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

export async function runPython(code: string, tests: string, archivo = ''): Promise<RunResult> {
  await ensureWorker();
  const id = nextId++;
  const raw = await new Promise<string>((resolve, reject) => {
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
    worker!.postMessage({ id, code, tests, archivo });
  });
  return JSON.parse(raw) as RunResult;
}
