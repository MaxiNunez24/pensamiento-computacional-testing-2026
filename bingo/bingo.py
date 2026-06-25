import random
import os
os.system("clear")

def generar_carton():
    return set(random.sample(range(1,91),15))

def verificar_ganador(carton, salientes):
    return carton.issubset(salientes)

def sacar_numero(bolillero, salientes):
    num = random.choice(list(bolillero))
    bolillero.remove(num)
    print(f"Salió el {num}.")
    salientes.add(num)
    return num

def estado_del_carton(carton, salientes):
    faltantes = carton - salientes
    marcados = carton & salientes
    print("_"*50)

    for num in carton:
        if num in salientes:
            print(num, "✓", sep="", end=" ")
        else:
            print(num, end= "  ") 
    print()
    print("_"*50)
    print(f"Marcados: {len(marcados)}/15  |  Faltantes: {len(faltantes)}")
    
print("¡Empieza el juego!")

def jugar_individual():
    carton = generar_carton()

    print(f"Tu cartón: {sorted(carton)}")

    input("Presioná Enter para empezar...")

    bolillero = set(range(1,91))
    salientes = set()

    cont = 0
    while not verificar_ganador(carton, salientes):
        num = sacar_numero(bolillero, salientes)
        cont += 1

        if num in carton:
            estado_del_carton(carton, salientes)

        input("Presioná Enter para continuar...")

    print(f"🎉 ¡BINGO! Ganaste en {cont} turnos.")

def jugar_multijugador(nombres):
    jugadores = dict()
    print("Cartones de los jugadores:")
    for nom in nombres:
        carton = generar_carton()
        jugadores[nom] = carton
        print(f"{nom}: {sorted(carton)}")
    
    
    
    