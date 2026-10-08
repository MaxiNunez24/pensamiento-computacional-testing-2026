"""El bot: carga en el simulador del SiGeS a los alumnos que están listos.

Este archivo viene hecho. Lo importante no está acá: está en alumno.py, que es
donde ustedes deciden quién se carga y quién no. El bot solo obedece.

Se corre así, con la terminal abierta en esta carpeta:

    python bot.py                  # el control y después el navegador
    python bot.py --lento          # con pausas, para ver cada campo
    python bot.py --solo-control   # solo el control, sin abrir el navegador

Las tres reglas que este bot no rompe
-------------------------------------
1. Va contra el SIMULADOR (siges_falso.html), nunca contra el sistema real.
2. No se loguea en ningún lado: no tiene usuario ni contraseña.
3. Deja a los alumnos como PRE INSCRIPTOS. La matrícula la genera una persona.

El bot no decide: tipea.
"""

import argparse
import sys
import time

from ayudas import SIMULADOR, datos_para_siges, leer_filas
from planilla import leer_inscriptos

PLANILLA = 'inscriptos.csv'


def controlar(inscriptos):
    """Separa a los que se pueden cargar de los que tiene que mirar una persona."""
    listos, frenados = [], []
    for alumno in inscriptos:
        listo = alumno.esta_listo()
        if listo is None:
            print('\n⚠️  esta_listo() no devuelve nada todavía.')
            print('   Tiene que devolver True o False: completalo en alumno.py.\n')
            sys.exit(1)
        if listo:
            listos.append(alumno)
        else:
            frenados.append(alumno)
    return listos, frenados


def informar(inscriptos, listos, frenados):
    print(f'\nSe leyeron {len(inscriptos)} inscriptos de {PLANILLA}\n')
    print(f'✅ LISTOS PARA CARGAR: {len(listos)}')
    for a in listos:
        print(f'   {a.dni:>10}  {a.nombre_completo()}')
    print(f'\n⛔ FRENADOS, los tiene que mirar una persona: {len(frenados)}')
    for a in frenados:
        print(f'   {a.dni:>10}  {a.nombre_completo()}')
        for problema in a.problemas():
            print(f'               · {problema}')
    print()


def cargar_uno(page, datos, pausa=0):
    """Carga UN alumno en el simulador. Devuelve el mensaje que muestra."""

    def respirar():
        if pausa:
            time.sleep(pausa)

    # 1. Buscar por documento
    page.fill('#numero-documento', datos['dni'])
    respirar()
    page.click('#buscar-estudiante')
    page.wait_for_selector('#apellidos', state='visible')

    # 2. Completar el formulario, campo por campo, igual que a mano
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
        page.fill(selector, valor)
        respirar()
    page.check(f'input[name="sexo"][value="{datos["sexo"]}"]')
    if datos['identidad_genero'] in ('Mujer', 'Varón'):
        page.select_option('#identidad-genero', label=datos['identidad_genero'])
    respirar()

    # 3. Guardar y leer lo que contesta
    page.click('#guardar')
    page.wait_for_selector('#alerta', state='visible')
    mensaje = page.inner_text('#alerta-texto')
    page.click('#entendido')
    page.wait_for_selector('#alerta', state='hidden')
    return mensaje


def main():
    ap = argparse.ArgumentParser(description='Carga alumnos en el simulador del SiGeS.')
    ap.add_argument('--lento', action='store_true', help='pausas entre campo y campo')
    ap.add_argument('--solo-control', action='store_true', help='no abrir el navegador')
    ap.add_argument('--sin-ventana', action='store_true', help='navegador invisible (más rápido)')
    args = ap.parse_args()

    # ── Primero el control. Esto es Python puro: anda sin Playwright. ──
    inscriptos = leer_inscriptos(PLANILLA)
    if not inscriptos:
        print('\n⚠️  leer_inscriptos() devolvió una lista vacía.')
        print('   Completala en planilla.py: tiene que devolver un Alumno por fila.\n')
        return 1
    listos, frenados = controlar(inscriptos)
    informar(inscriptos, listos, frenados)

    if args.solo_control or not listos:
        return 0

    # ── Después el navegador ──
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print('⚠️  Todavía no está instalado Playwright. En la terminal, con el .venv activo:')
        print('       pip install -r requirements.txt')
        print('       python -m playwright install chromium\n')
        return 1

    filas = leer_filas(PLANILLA)
    print(f'Cargando {len(listos)} alumno(s) en el SIMULADOR...\n')
    with sync_playwright() as p:
        navegador = p.chromium.launch(headless=args.sin_ventana)
        page = navegador.new_page()
        page.goto(SIMULADOR)

        bien = 0
        for alumno in listos:
            print(f'   {alumno.nombre_completo():<32}', end=' ', flush=True)
            mensaje = cargar_uno(page, datos_para_siges(filas[alumno.dni]),
                                 pausa=0.35 if args.lento else 0)
            if 'correctamente' in mensaje.lower():
                bien += 1
                print('✅')
            else:
                print(f'⛔ {mensaje}')

        print(f'\nCargados: {bien} de {len(listos)}. '
              f'Los {len(frenados)} frenados no se tocaron.\n')
        if not args.sin_ventana:
            input('Enter para cerrar el navegador... ')
        navegador.close()
    return 0


if __name__ == '__main__':
    sys.exit(main())
