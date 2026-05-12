import os
os.system("clear")

# Ejercicio 3.5
"""
alumnos = ["Ana", "Beto", "Cami", "Dante"]
asistencias = [
    [1, 1, 0, 1, 1],   # Ana
    [0, 1, 1, 1, 0],   # Beto
    [1, 1, 1, 1, 1],   # Cami
    [0, 0, 1, 0, 1],   # Dante
]


for i, alu in enumerate(alumnos):
    porcentaje_asistencias = 0.0
    fila = asistencias[i]
    porcentaje_asistencias = round((sum(fila)/ len(fila)) * 100)

    print(f"{alu}: {porcentaje_asistencias}%")
"""

# Ejercicio 4
"""
curso = [
    ["Ana", 8, 7, 9],
    ["Beto", 4, 5, 6],
    ["Cami", 10, 9, 10],
    ["Dante", 3, 5, 4],
    ["Eva", 7, 7, 8],
]

aprobados = []
desaprobados = []
mejor_promedio = 0.0
mejor_alumno = ""
for alu in curso:
    nombre = alu[0]
    notas = alu[1:]
    promedio = sum(notas) / len(notas)
    
    if(promedio >= 6): aprobados.append(nombre)
    else: desaprobados.append(nombre)

    if promedio > mejor_promedio:
        mejor_promedio = promedio
        mejor_alumno = nombre
    
print(f" Aprobados: {aprobados}\n Desaprobados: {desaprobados}\n El mejor alumno: {mejor_alumno} con 3{mejor_promedio:.2f} ")
"""

# Ejercicio 4.2

instrumentos = ["Kick", "Snare", "HiHat", "Clap"]
patron = [
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],   # Kick
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],   # Snare
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],   # HiHat
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],   # Clap
]

number_hits = "     "
for i in range(len(patron[0])):
    if i > 9: number_hits += f"  {i}"
    else: number_hits += f"  {i} "

print(number_hits)
cantidad_hits = [0,0,0,0]
for i, inst in enumerate(patron):
    if(len(instrumentos[i]) == 4): print(f"{instrumentos[i]}", end = "   ")
    else: print(f"{instrumentos[i]}", end = "  ")
    for step in inst:
        if step == 1:
            shape = "■"
            cantidad_hits[i] += 1 
        else: 
            shape = "·"
        print(shape, end = "   ")
    print()

print("-"*50)

print("Cantidad de hits:")
for i, cant in enumerate(cantidad_hits):
    print(f"{instrumentos[i]}: {cant}")

print("-"*50)

suma_max = 0
step_max = 0
for c in range(len(patron[0])):
    suma_actual = 0
    for f in range(len(patron)):
        suma_actual += patron[f][c]
    if suma_actual > suma_max:
        suma_max = suma_actual
        step_max = c
    
print(f"El step con más hits fue el step {step_max} con {suma_max} hits")

"""
Imprimí el patrón visualmente, con ■ cuando hay hit y · cuando no, separando por espacios. La salida debería verse así:

Kick   ■ · · · ■ · · · ■ · · · ■ · · ·
Snare  · · · · ■ · · · · · · · ■ · · ·
HiHat  ■ · ■ · ■ · ■ · ■ · ■ · ■ · ■ ·
Clap   · · · · · · · · · · · · ■ · · ·
Contá la cantidad de hits que tiene cada instrumento.

Encontrá el step con más hits simultáneos (ese momento donde "explota" el ritmo). Devolvé el número de step y la cantidad.
"""