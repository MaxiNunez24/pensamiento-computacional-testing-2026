# Video 4 — Sets: cuándo usarlos y buenas prácticas

**Serie:** Sets
**Duración estimada:** ~4 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! Último video de la serie de Sets. Vemos cuándo conviene usar un set y cuándo no, con ejemplos concretos.

---

## CUÁNDO SÍ USAR SETS (~2 minutos)

**1. Eliminar duplicados de una colección**

```python
registros = ["Ana", "Beto", "Ana", "Cami", "Beto", "Ana"]
unicos    = list(set(registros))
print(unicos)   # ['Ana', 'Beto', 'Cami']
```

**2. Muchas verificaciones de pertenencia**

```python
# ❌ Lista: lenta para búsquedas repetidas (recorre elemento a elemento)
palabras_invalidas_lista = ["spam", "hack", "virus", ...]

# ✅ Set: instantáneo, sin importar el tamaño
palabras_invalidas = {"spam", "hack", "virus", "malware"}

mensaje = "este mensaje contiene spam"
for palabra in mensaje.split():
    if palabra in palabras_invalidas:
        print(f"Palabra bloqueada: {palabra}")
```

**3. Lógica de conjuntos**

```python
# ¿Qué alumnos aprobaron ambos parciales?
aprobaron_p1 = {"Ana", "Beto", "Cami", "Eva"}
aprobaron_p2 = {"Beto", "Cami", "Dante", "Eva"}

aprobaron_todo = aprobaron_p1 & aprobaron_p2
print(aprobaron_todo)   # {'Beto', 'Cami', 'Eva'}

solo_faltaron_p2 = aprobaron_p1 - aprobaron_p2
print(solo_faltaron_p2)   # {'Ana'}
```

---

## CUÁNDO NO USAR SETS (~1 minuto)

```python
# ❌ Cuando el orden importa
historial = ["busqueda1", "busqueda2", "busqueda3"]
# → usar lista

# ❌ Cuando necesitamos acceder por índice
primer_elemento = coleccion[0]
# → los sets no tienen índices → usar lista o tupla

# ❌ Cuando necesitamos permitir duplicados
# (por ejemplo: contar cuántas veces aparece algo)
votos = ["Python", "Python", "Java", "Python"]
conteo = {}
for v in votos:
    conteo[v] = conteo.get(v, 0) + 1
# → usar diccionario
```

---

## TABLA RESUMEN (~45 segundos)

```
Necesito eliminar duplicados        → set
Muchas búsquedas con "in"          → set
Operaciones de conjuntos            → set
Orden importa                       → lista o tupla
Acceso por índice                   → lista o tupla
Datos con nombre (clave → valor)   → diccionario
Contar cuántas veces aparece algo  → diccionario
```

---

## CIERRE (~20 segundos)

> Listo para la serie de Sets. Simples, poderosos, y subutilizados — cuando el problema encaja, son la herramienta perfecta.
>
> En la próxima serie vemos los **Diccionarios**: la colección más usada y más versátil de Python.
>
> ¡Nos vemos!
