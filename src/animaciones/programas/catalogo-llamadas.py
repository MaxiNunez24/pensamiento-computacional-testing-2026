def precio(texto):
    return "$" + texto


def tarjeta(producto):
    p = precio(producto["precio"])
    return producto["nombre"] + ": " + p + ". "


def pagina(productos):
    tarjetas = ""
    for producto in productos:
        tarjetas += tarjeta(producto)
    return tarjetas


taza = {"nombre": "Taza", "precio": "4500"}
mate = {"nombre": "Mate", "precio": "7800"}
html = pagina([taza, mate])
print(html)
