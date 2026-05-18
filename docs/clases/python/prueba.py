import os, math
os.system("clear")

def separador(): print("-"*60)

def promedio(numeros): return sum(numeros) / len(numeros)

def estadisticas(numeros):
    if type(numeros) != type([]): 
        return "ERROR, Se necesita una lista"
    return min(numeros), max(numeros), promedio(numeros) 

estadisticas = estadisticas(numeros = [1,2,4,5,6,8])
print(estadisticas)
mn, mx, prom = estadisticas
print(f"Min: {mn}, Max: {mx}, Promedio: {prom:.2f}")
# Min: 2, Max: 9, Promedio: 5.00