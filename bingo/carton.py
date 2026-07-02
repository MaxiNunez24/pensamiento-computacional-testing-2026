from random import sample

def generar_carton():
    return set(sample(range(1,91),15))

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