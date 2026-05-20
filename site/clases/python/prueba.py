import subprocess
subprocess.run(["clear"])

def agregar_fila(tabla, **campos):
    tabla.append(campos)

def filtrar(tabla, **criterios):
    return [fila for fila in tabla
            if all(fila.get(k) == v for k, v in criterios.items())]

def proyectar(tabla, *columnas):
    return [{col: fila[col] for col in columnas if col in fila} for fila in tabla]

def imprimir_tabla(tabla):
    if not tabla:
        print("(vacía)")
        return
    cols  = list(tabla[0].keys())
    ancho = 15
    print(" | ".join(f"{col:<{ancho}}" for col in cols))
    print("-" * (ancho * len(cols) + 3 * (len(cols) - 1)))
    for fila in tabla:
        print(" | ".join(f"{str(fila.get(col, '')):<{ancho}}" for col in cols))

tabla = []
agregar_fila(tabla, nombre="Maxi", nota=10, lenguaje="Python")
agregar_fila(tabla, nombre="Ana",   nota=9, ciudad="La Plata")
agregar_fila(tabla, nombre="Beto",  nota=5, ciudad="Ensenada")
agregar_fila(tabla, nombre="Cami",  nota=8, ciudad="La Plata")
agregar_fila(tabla, nombre="Dante", nota=4, ciudad="Ensenada")

imprimir_tabla(proyectar(tabla, "nombre", "lenguaje"))