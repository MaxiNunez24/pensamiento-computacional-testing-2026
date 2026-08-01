from random import choice

def verificar_ganador(carton, salientes):
    return carton.issubset(salientes)

def sacar_numero(bolillero, salientes):
    num = choice(list(bolillero))
    bolillero.remove(num)
    print(f"Salió el {num}.")
    salientes.add(num)
    return num
