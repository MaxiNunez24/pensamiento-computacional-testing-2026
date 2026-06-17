import random
import os
os.system("clear")

def generar_carton():
    return set(random.sample(range(1,91),15))
    
def verificar_ganador(carton, salientes):
    pass

def sacar_numero(bolillero, salientes):
    pass

def estado_del_carton(carton, salientes):
    pass

print("¡Empieza el juego!")

carton = generar_carton()

print(f"Tu cartón: {sorted(carton)}")

input("Presioná Enter para empezar...")

bolillero = set(range(1,91))
salientes = set()

while not verificar_ganador(carton, salientes):
    num = sacar_numero(bolillero, salientes)

    if num in carton:
        estado_del_carton(carton, salientes)





