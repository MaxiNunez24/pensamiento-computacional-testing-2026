import os

os.system("clear")

archivo = open("texto.txt", "w")
# open(path_absoluto, modo)

# path_absoluto: str
# modo: str

# r -> solo lectura, error si no existe (POR DEFECTO)
# w -> escritura, crea el archivo o lo sobreescrive si ya existe
# a -> crea el archivo si no existe, si existe agrega al final sin borrar lo que había
# x -> creación exclusiva, error si ya existe
# r+ -> lectura y escritura, error si no existe

print(archivo.read())

archivo.close()