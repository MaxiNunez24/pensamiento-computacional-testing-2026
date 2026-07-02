import os
from carton import generar_carton, estado_del_carton
from sorteo import sacar_numero, verificar_ganador

os.system("clear")

def jugar_individual():
    print("¡Empieza el juego!")
    
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
    print("¡Empieza el juego!")

    jugadores = dict()

    print("Cartones de los jugadores:")
    for nom in nombres:
        carton = generar_carton()
        jugadores[nom] = carton
        print(f"{nom}: {sorted(carton)}")

    input("Presioná Enter para empezar...")

    bolillero = set(range(1,91))
    salientes = set()

    cont = 0
    ganadores = []

    while len(ganadores) == 0:
        num = sacar_numero(bolillero, salientes)
        print("\n"*3)

        cont += 1

        for nom, carton in jugadores.items():
            if num in carton:
                print(f"Jugador: {nom}")
                print("-"*40)
                estado_del_carton(carton, salientes)
                print("\n"*3)
            
            
            if verificar_ganador(carton, salientes):
                ganadores.append(nom)

        input("Presioná Enter para continuar...")

    print(f"🎉 ¡BINGO! Ganaron {ganadores} en {cont} turnos.")
    

if __name__ == "__main__":
    print("HOLA DESDE BINGO.PY!")
    jugar_individual()