# Video 1 — Sets: qué son y cómo se crean

**Serie:** Sets
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este video vemos los **Sets** (conjuntos): una colección que elimina duplicados automáticamente y está optimizada para preguntas del tipo "¿este elemento está en la colección?".

---

## ¿QUÉ ES UN SET? (~1.5 minutos)

```python
colores = {"rojo", "verde", "azul"}
print(colores)   # {'rojo', 'verde', 'azul'}
print(type(colores))  # <class 'set'>
```

> Los sets se escriben con llaves `{}` y elementos separados por comas. Tienen dos propiedades clave:

```python
# 1. Sin duplicados: Python los ignora silenciosamente
colores2 = {"rojo", "verde", "azul", "rojo", "verde"}
print(colores2)   # {'rojo', 'verde', 'azul'} — solo 3 elementos
```

```python
# 2. Sin orden garantizado: no podemos acceder por índice
print(colores[0])   # ❌ TypeError: 'set' object is not subscriptable
```

> Los sets no tienen posiciones. No podemos hacer `set[0]`. Están optimizados para verificar si algo **está o no está**, no para recuperar elementos por posición.

---

## TRAMPA CLÁSICA: EL SET VACÍO (~45 segundos)

```python
vacio_mal  = {}         # ¡Esto es un DICCIONARIO vacío!
vacio_bien = set()      # Esto SÍ es un set vacío

print(type(vacio_mal))    # <class 'dict'>
print(type(vacio_bien))   # <class 'set'>
```

> Las llaves vacías crean un diccionario, no un set. Para un set vacío, usamos `set()` sin argumentos.

---

## CONVERSIÓN DESDE OTRAS COLECCIONES (~1.5 minutos)

> Una de las técnicas más útiles: usar `set()` para **eliminar duplicados** de una lista.

```python
nombres_con_repetidos = ["Ana", "Beto", "Ana", "Cami", "Beto", "Ana"]

nombres_unicos = set(nombres_con_repetidos)
print(nombres_unicos)   # {'Ana', 'Beto', 'Cami'}

# Si necesitamos volver a tener una lista sin duplicados:
lista_limpia = list(set(nombres_con_repetidos))
print(lista_limpia)   # ['Ana', 'Beto', 'Cami'] — orden no garantizado
```

> ⚠️ Al convertir lista → set → lista, **se pierde el orden original**. Si necesitan conservarlo, hay que hacerlo de otra manera.

*(Restricción importante:)*

```python
# Los elementos de un set deben ser inmutables
ok  = {1, 2, "hola", (3, 4)}    # ✅ números, strings, tuplas
mal = {[1, 2], [3, 4]}           # ❌ TypeError: las listas no son hashables
```

> Los elementos de un set tienen que ser inmutables: números, strings, tuplas. Las listas no pueden ser elementos de un set.

---

## IN: BÚSQUEDA INSTANTÁNEA (~30 segundos)

```python
primos = {2, 3, 5, 7, 11, 13, 17, 19}

print(7 in primos)    # True  — instantáneo, sin importar el tamaño
print(4 in primos)    # False
```

> La búsqueda con `in` en un set es prácticamente instantánea, independientemente de cuántos elementos tenga. En una lista, Python tiene que recorrerla elemento por elemento. Si van a hacer muchas verificaciones de pertenencia, el set es mucho más eficiente.

---

## CIERRE (~20 segundos)

> En el próximo video vemos cómo **agregar y eliminar elementos** de un set.
>
> ¡Nos vemos!
