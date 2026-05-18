# Video 3 — Tuplas: métodos y casos de uso

**Serie:** Tuplas
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este video vemos los métodos que tienen las tuplas — que son muy pocos, y por buena razón — y los casos de uso más típicos.

---

## MÉTODOS: SOLO DOS (~1.5 minutos)

> Las tuplas son inmutables, así que no tienen métodos para modificar como `append()` o `remove()`. Solo tienen dos:

```python
notas = (7, 8, 9, 7, 6, 7)

print(notas.count(7))    # 3 — cuántas veces aparece 7
print(notas.index(9))    # 2 — posición de la primera aparición de 9
```

> `.count(x)` cuenta cuántas veces aparece `x`. `.index(x)` devuelve la posición de la primera aparición.
>
> Son exactamente los mismos que en las listas. El resto de las operaciones que funcionan en listas (slicing, `len()`, `in`, `for`) también funcionan en tuplas.

---

## LAS TUPLAS COMO CLAVES DE DICCIONARIO (~1 minuto)

> Una ventaja importante de la inmutabilidad: las tuplas pueden ser **claves de un diccionario**. Las listas no pueden.

```python
# Diccionario con coordenadas como claves
ciudades = {
    (-34.6, -58.4): "Buenos Aires",
    (35.7,  139.7): "Tokio",
    (-34.9, -57.9): "La Plata"
}

print(ciudades[(-34.6, -58.4)])   # Buenos Aires
```

> Los diccionarios necesitan claves que no cambien. Por eso aceptan tuplas (inmutables) pero no listas (mutables). Esto lo vamos a ver más en detalle en la serie de Diccionarios.

---

## CUÁNDO USAR TUPLAS (~2 minutos)

> La pregunta clave para decidir entre lista y tupla:

**Usá tupla cuando:**

```python
# Los datos representan una unidad conceptual fija
coordenadas  = (-34.6, -58.4)          # un punto en el mapa
fecha        = (2026, 5, 17)           # un día específico
rgb          = (255, 128, 0)           # un color
registro     = ("Ana", 20, "La Plata") # una fila de tabla

# Los datos no deben cambiar
COLORES_VALIDOS = ("rojo", "verde", "azul")  # constante del programa

# Una función que devuelve múltiples valores
def min_max(lista):
    return min(lista), max(lista)
```

**Usá lista cuando:**

```python
# El contenido va a cambiar: agregar, quitar, modificar
carrito    = ["laptop", "mouse"]
carrito.append("teclado")

# Una secuencia de cosas del mismo tipo que va creciendo
notas      = []
for clase in range(10):
    notas.append(float(input("Nota: ")))
```

> Regla mental: si los elementos forman una **unidad conceptual** (un punto, una fecha, un registro), usá tupla. Si es una **colección que puede crecer o cambiar**, usá lista.

---

## CIERRE (~20 segundos)

> Listo para la serie de Tuplas. Son simples pero poderosas: su inmutabilidad es una feature, no una limitación.
>
> En la próxima serie vemos los **Sets**: colecciones sin orden y sin duplicados, perfectas para operaciones de conjuntos.
>
> ¡Nos vemos!
