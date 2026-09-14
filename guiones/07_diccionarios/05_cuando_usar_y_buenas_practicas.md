# Video 5 — Diccionarios: cuándo usarlos y buenas prácticas

**Serie:** Diccionarios
**Duración estimada:** ~4 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! Último video de la serie de Diccionarios. Vemos cuándo usar un diccionario, los errores más comunes y las buenas prácticas.

---

## CUÁNDO USAR DICCIONARIOS (~1.5 minutos)

**1. Los datos tienen atributos con nombre**

```python
# ❌ Lista: ¿qué es el índice 2?
alumno = ["Ana", 20, "La Plata", 9.5]
print(alumno[2])   # "La Plata" — no es obvio

# ✅ Diccionario: auto-documentado
alumno = {"nombre": "Ana", "edad": 20, "ciudad": "La Plata", "promedio": 9.5}
print(alumno["ciudad"])   # claro y explícito
```

**2. Búsqueda rápida por clave**

```python
# Si necesitamos buscar alumnos por DNI frecuentemente:
alumnos_por_dni = {
    "12345678": {"nombre": "Ana",  "nota": 9},
    "87654321": {"nombre": "Beto", "nota": 6},
}
# Acceso instantáneo, sin recorrer toda la lista
print(alumnos_por_dni["12345678"]["nombre"])   # Ana
```

**3. Contar o agrupar cosas**

```python
# Contar votos, ocurrencias, frecuencias → diccionario
conteo = {}
for item in coleccion:
    conteo[item] = conteo.get(item, 0) + 1
```

---

## ERRORES COMUNES (~1.5 minutos)

```python
persona = {"nombre": "Maxi", "edad": 27}

# ❌ KeyError — clave que no existe
print(persona["apellido"])
# ✅ Solución: usar .get() o verificar con "in"
print(persona.get("apellido", "N/A"))

# ❌ Confundir {} vacío con set vacío
vacio = {}        # dict, no set
vacio = set()     # esto sí es un set vacío

# ❌ Claves mutables (listas no pueden ser claves)
d = {[1, 2]: "valor"}   # TypeError
d = {(1, 2): "valor"}   # ✅ tupla sí puede
```

> Los errores más frecuentes: asumir que una clave existe (usar siempre `.get()` cuando haya duda) y olvidar que `{}` crea un diccionario vacío, no un set.

---

## BUENAS PRÁCTICAS (~45 segundos)

```python
# ✅ Claves descriptivas en snake_case
alumno = {"nombre_completo": "Ana García", "nota_final": 9.5}

# ✅ .get() con default cuando la clave puede no estar
ciudad = perfil.get("ciudad", "Sin especificar")

# ✅ .items() para iterar en lugar de acceder por clave dentro del for
for nombre, nota in notas.items():   # más claro que notas[nombre]
    print(f"{nombre}: {nota}")

# ✅ No anidar más de 2-3 niveles
# Si el diccionario tiene 5 niveles de profundidad, replantear el modelo
```

---

## CIERRE (~20 segundos)

> Listo para la serie de Diccionarios. Son la herramienta más versátil de Python — van a usarlos en casi todos los programas que escriban.
>
> En la próxima serie vemos las **Funciones**: cómo nombrar bloques de código para reutilizarlos.
>
> ¡Nos vemos!
