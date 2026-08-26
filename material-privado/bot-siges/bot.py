"""Paso 2 del bot: cargar en el SiGeS las personas que quedaron listas.

Cómo funciona, en una frase
---------------------------
Playwright abre un navegador de verdad y hace exactamente lo que haría una
persona: escribe el DNI, toca "Buscar estudiante", completa el formulario y
guarda. No hay ninguna magia ni ninguna "conexión secreta" con el Ministerio:
es el mismo Chrome, manejado por Python en vez de por una mano.

Por qué así y no de otra forma
------------------------------
Un sistema como el SiGeS normalmente ofrecería una API (una puerta pensada para
que otros programas le hablen). El SiGeS no la tiene, o al menos no está abierta
para un CFP. Cuando no hay puerta, queda la ventana: automatizar el navegador.
Es más frágil —si el Ministerio cambia el formulario, el bot deja de andar— pero
es lo único disponible, y es exactamente lo que se hace en la vida real cuando
hay que integrarse con un sistema que no coopera.

Las tres reglas que este bot no rompe
-------------------------------------
1. **Por defecto va contra el SIMULADOR**, no contra el sistema real. Para ir al
   real hay que pedirlo explícitamente con --real.
2. **Nunca inicia sesión solo.** No hay usuario ni contraseña en el código, ni
   los pide. La persona se loguea a mano y recién ahí el bot toma el control.
3. **Nunca aprieta "Generar matrícula inicial".** El bot deja a la persona como
   PRE INSCRIPTA, que es un estado reversible: si algo salió mal, se borra con
   el tachito. La matrícula la genera una persona, mirando.

Se corre así:
    python bot.py                      # contra el simulador, mostrando el navegador
    python bot.py --lento              # con pausas, para que se vea en una demo
    python bot.py --real <url>         # contra el SiGeS (pide confirmación)
"""

import argparse
import pathlib
import sys
import time

from playwright.sync_api import sync_playwright

import normalizar

AQUI = pathlib.Path(__file__).parent
SIMULADOR = (AQUI / 'siges_falso.html').as_uri()


def cargar_una(page, datos, lento=0):
    """Carga UNA persona. Devuelve (ok, detalle)."""

    def respirar():
        if lento:
            time.sleep(lento)

    # --- 1. Buscar por documento -------------------------------------------
    page.fill('#numero-documento', datos['dni'])
    respirar()
    page.click('#buscar-estudiante')
    page.wait_for_selector('#apellidos', state='visible')
    respirar()

    # --- 2. Completar el formulario ----------------------------------------
    # Se llena campo por campo, igual que a mano. Si alguno no existe (porque el
    # formulario cambió), se avisa en vez de seguir a ciegas.
    campos = {
        '#apellidos': datos['apellidos'],
        '#nombres': datos['nombres'],
        '#nacionalidad': datos['nacionalidad'],
        '#lugar-nacimiento': datos['lugar_nacimiento'],
        '#fecha-nacimiento': datos['fecha_nacimiento'],
        '#calle': datos['calle'],
        '#altura': datos['altura'],
        '#distrito': datos['distrito'],
        '#localidad': datos['localidad'],
        '#celular': datos['celular'],
    }
    for selector, valor in campos.items():
        if valor is None:
            continue
        if page.locator(selector).count() == 0:
            return False, f'no encontré el campo {selector} (¿cambió el formulario?)'
        page.fill(selector, str(valor))
        respirar()

    page.check(f'input[name="sexo"][value="{datos["sexo"]}"]')
    if page.locator('#identidad-genero').count():
        page.select_option('#identidad-genero', label=datos['identidad_genero'])
    respirar()

    # --- 3. Guardar ---------------------------------------------------------
    page.click('#guardar')
    page.wait_for_selector('#alerta', state='visible')
    mensaje = page.inner_text('#alerta-texto')
    page.click('#entendido')
    page.wait_for_selector('#alerta', state='hidden')

    ok = 'correctamente' in mensaje.lower()
    return ok, mensaje


def main():
    ap = argparse.ArgumentParser(description='Carga alumnos en el SiGeS.')
    ap.add_argument('csv', nargs='?', default='datos_ejemplo.csv')
    ap.add_argument('--real', metavar='URL',
                    help='Ir contra el SiGeS de verdad (por defecto va al simulador)')
    ap.add_argument('--lento', action='store_true',
                    help='Pausas entre campo y campo, para que se vea en una demo')
    ap.add_argument('--sin-ventana', action='store_true',
                    help='Sin mostrar el navegador (más rápido, no sirve para demostrar)')
    args = ap.parse_args()

    # --- Primero limpiar. Solo se carga lo que pasó el control. -------------
    listos = normalizar.main(str(AQUI / args.csv) if not pathlib.Path(args.csv).is_absolute()
                             else args.csv)
    if not listos:
        print('No hay nadie para cargar. Fin.')
        return

    destino = args.real or SIMULADOR

    if args.real:
        # Freno a mano. Cargar en el sistema del Ministerio no puede pasar por
        # accidente ni por tener una terminal abierta de ayer.
        print('\n' + '=' * 62)
        print('  ⚠️  ESTO VA CONTRA EL SISTEMA REAL DEL MINISTERIO')
        print('=' * 62)
        print(f'  Destino : {destino}')
        print(f'  Personas: {len(listos)}')
        print('\n  Antes de seguir:')
        print('   · Iniciá sesión vos en el navegador que se va a abrir.')
        print('   · Revisá que el trayecto sea el correcto.')
        print('   · El bot NO va a generar la matrícula: quedan como pre inscriptos.')
        if input('\n  Escribí CARGAR para continuar: ').strip() != 'CARGAR':
            print('  Cancelado. No se tocó nada.')
            return

    with sync_playwright() as p:
        navegador = p.chromium.launch(headless=args.sin_ventana)
        page = navegador.new_page()
        page.goto(destino)

        if args.real:
            input('\n  Iniciá sesión y navegá hasta el trayecto. '
                  'Cuando esté listo, apretá Enter acá... ')

        print(f'\n{"=" * 62}\nCargando {len(listos)} persona(s) en '
              f'{"el SiGeS REAL" if args.real else "el simulador"}\n{"=" * 62}')

        bien, mal = 0, []
        for i, datos in listos:
            quien = f'{datos["apellidos"]}, {datos["nombres"]}'
            print(f'  fila {i:>3}  {quien:<38}', end=' ', flush=True)
            try:
                ok, detalle = cargar_una(page, datos, lento=0.35 if args.lento else 0)
            except Exception as e:                      # noqa: BLE001
                ok, detalle = False, f'{type(e).__name__}: {e}'
            if ok:
                bien += 1
                print('✅')
            else:
                mal.append((quien, detalle))
                print(f'⛔ {detalle}')

        print(f'\n{"=" * 62}')
        print(f'  Cargados: {bien}    Con problema: {len(mal)}')
        for quien, detalle in mal:
            print(f'   · {quien}: {detalle}')
        print('=' * 62)

        if not args.sin_ventana:
            input('\nEnter para cerrar el navegador... ')
        navegador.close()


if __name__ == '__main__':
    sys.exit(main())
