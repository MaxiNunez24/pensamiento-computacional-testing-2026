# Video 1 — Tuplas: qué son y cómo se crean

**Serie:** Tuplas
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este video arrancamos con **Tuplas**: una colección muy parecida a las listas, pero con una diferencia fundamental que cambia cuándo y para qué la usamos.

---

## ¿QUÉ ES UNA TUPLA? (~1.5 minutos)

```python
mi_lista = [1, 2, 3]
mi_tupla = (1, 2, 3)
```

> La diferencia visual es el paréntesis en lugar de los corchetes. Pero la diferencia real es otra: las listas son **mutables** — podemos cambiar su contenido. Las tuplas son **inmutables** — una vez creadas, no se pueden modificar.

```python
mi_lista[0] = 99
print(mi_lista)   # [99, 2, 3]  ✅ funciona

mi_tupla[0] = 99  # ❌ TypeError: 'tuple' object does not support item assignment
```

> ¿Y para qué sirve algo que no se puede modificar? Justamente porque no se puede modificar. Cuando guardamos datos que **no deberían cambiar**, una tupla nos da esa garantía. Si alguien intenta modificarla por error, Python lo detecta y lanza un error — en lugar de dejar que el dato se corrompa en silencio.

---

## CÓMO SE CREAN (~1.5 minutos)

```python
# La forma más común: con paréntesis
coordenadas = (35.7, -58.4)
persona     = ("Maxi", 27, "Ensenada")

# Los paréntesis son OPCIONALES — esto también es una tupla
punto = 10, 20
print(type(punto))   # <class 'tuple'>

# Tupla vacía
vacia = ()

# Conversión desde una lista
lista  = [1, 2, 3]
tupla  = tuple(lista)
```

> ⚠️ Trampa clásica: la tupla de **un solo elemento**.

```python
a = (5)
b = (5,)

print(type(a))   # <class 'int'>   ← NO es una tupla, son paréntesis matemáticos
print(type(b))   # <class 'tuple'> ← SÍ es una tupla — la coma es la clave
```

> Para crear una tupla de un solo elemento necesitan la **coma final**. Sin ella, Python interpreta los paréntesis como agrupación matemática, igual que `(2 + 3)`.

---

## ACCESO: IGUAL QUE LAS LISTAS (~1 minuto)

> Las tuplas se acceden exactamente igual que las listas:

```python
persona = ("Maxi", 27, "Ensenada")

print(persona[0])    # Maxi
print(persona[-1])   # Ensenada
print(persona[1:])   # (27, 'Ensenada')

print(len(persona))  # 3
print("Maxi" in persona)  # True

for dato in persona:
    print(dato)
```

> Índices, slicing, `len()`, `in`, `for`: todo funciona igual que con las listas. La única diferencia es que no podemos modificar nada.

---

## CIERRE (~20 segundos)

> En el próximo video vemos la **feature estrella** de las tuplas: el desempaquetado — una de las herramientas más elegantes de Python.
>
> ¡Nos vemos!
