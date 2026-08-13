// Motor de Python compartido: un único Pyodide corriendo en un WEB WORKER,
// usado por todos los tipos de ejercicio (EjercicioPython, CompletarCodigo…).
//
// El worker protege la página: si el código del alumno se cuelga (bucle
// infinito), el hilo principal detecta el timeout, termina el worker y lo
// recrea, mostrando un mensaje pedagógico en lugar de congelar la pestaña.

export const RUN_TIMEOUT_MS = 15_000;

export interface RunResult {
  ok: boolean;
  out: string;
  err: string;
}

export class TimeoutError extends Error {}

let worker: Worker | null = null;
let readyPromise: Promise<void> | null = null;
let isReady = false;
let nextId = 1;
const pending = new Map<number, { resolve: (raw: string) => void; reject: (e: Error) => void }>();

// ¿El intérprete ya terminó de cargar? (para mostrar "Cargando Python…" la 1ª vez)
export function pythonReady(): boolean {
  return isReady;
}

function resetWorker(reason: Error): void {
  worker?.terminate();
  worker = null;
  readyPromise = null;
  isReady = false;
  pending.forEach((p) => p.reject(reason));
  pending.clear();
}

export function ensureWorker(): Promise<void> {
  if (!readyPromise) {
    const w = new Worker(new URL('./pyodide-worker.ts', import.meta.url), { type: 'module' });
    worker = w;
    readyPromise = new Promise<void>((resolve, reject) => {
      w.onmessage = (ev: MessageEvent) => {
        const d = ev.data;
        if (d.type === 'ready') {
          isReady = true;
          resolve();
        } else if (d.type === 'init-error') {
          reject(new Error(d.error));
          resetWorker(new Error(d.error));
        } else if (d.type === 'result') {
          const p = pending.get(d.id);
          if (p) {
            pending.delete(d.id);
            p.resolve(d.raw);
          }
        }
      };
      w.onerror = (e) => reject(new Error(e.message || 'falló el worker de Python'));
    });
  }
  return readyPromise;
}

// Manda un pedido al worker y espera la respuesta, con el timeout que protege
// de los bucles infinitos.
async function pedir(mensaje: Record<string, unknown>): Promise<string> {
  await ensureWorker();
  const id = nextId++;
  return new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      // El código del alumno sigue colgado dentro del worker: lo terminamos
      // y dejamos todo listo para recrear el intérprete en la próxima corrida.
      resetWorker(new TimeoutError());
      reject(new TimeoutError());
    }, RUN_TIMEOUT_MS);
    pending.set(id, {
      resolve: (r) => {
        clearTimeout(timer);
        resolve(r);
      },
      reject: (e) => {
        clearTimeout(timer);
        reject(e);
      },
    });
    worker!.postMessage({ id, ...mensaje });
  });
}

export async function runPython(
  code: string,
  tests: string,
  archivo = '',
  datos = '',
  entradas: string[] = [],
): Promise<RunResult> {
  const raw = await pedir({ code, tests, archivo, datos, entradas });
  return JSON.parse(raw) as RunResult;
}

// ---------- Medición de eficiencia ----------

export interface Escenario {
  etiqueta: string;
  /** Cuántos datos maneja este escenario (para hablar de cómo crece el costo). */
  tamano: number;
  /** Código que USA la solución del alumno, p. ej. `resolver(list(range(1000)))`. */
  codigo: string;
}

export interface Medicion {
  etiqueta: string;
  tamano: number;
  pasos: number;
  /** true = se pasó del tope y dejamos de contar (el número real es mayor). */
  cortado: boolean;
}

export interface MedirResult {
  ok: boolean;
  err: string;
  escenarios: Medicion[];
}

// Tope de pasos por escenario. Trazar es caro: sin tope, una solución de fuerza
// bruta se lleva puesto el timeout y el alumno ve "se colgó" en vez de "es lenta".
export const TOPE_PASOS = 300_000;

export async function medirPython(
  code: string,
  escenarios: Escenario[],
  datos = '',
): Promise<MedirResult> {
  const raw = await pedir({ modo: 'medir', code, tests: '', datos, escenarios, tope: TOPE_PASOS });
  return JSON.parse(raw) as MedirResult;
}
