# Video 5 — Funciones: *args y **kwargs

**Serie:** Funciones
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este video vemos `*args` y `**kwargs`: dos mecanismos para que una función acepte una cantidad variable de argumentos. Los van a ver mucho en código de bibliotecas externas, así que es importante que les suenen.

---

## *ARGS: CANTIDAD VARIABLE DE POSICIONALES (~2 minutos)

> ¿Qué pasa si queremos una función que sume todos los números que le pasemos, sin importar cuántos sean?

```python
def sumar_todo(*args):
    print(type(args))   # <class 'tuple'>
    return sum(args)

print(sumar_todo(1, 2, 3))          # 6
print(sumar_todo(10, 20))           # 30
print(sumar_todo(1, 2, 3, 4, 5))   # 15
```

> El `*` antes del nombre captura **todos los argumentos posicionales extra** en una **tupla**. El nombre `args` es convención — lo importante es el asterisco.

*(Combinado con parámetros normales:)*

```python
def describir_persona(nombre, *hobbies):
    print(f"{nombre} le gusta: {', '.join(hobbies)}")

describir_persona("Maxi", "música", "programación", "ajedrez")
# Maxi le gusta: música, programación, ajedrez

describir_persona("Ana", "leer")
# Ana le gusta: leer
```

> `nombre` recibe el primer argumento. `*hobbies` captura todo lo que venga después en una tupla.

---

## **KWARGS: CANTIDAD VARIABLE DE NOMBRADOS (~2 minutos)

> `**kwargs` captura todos los **argumentos por nombre** que no correspondan a parámetros definidos, en un **diccionario**:

```python
def mostrar_info(**kwargs):
    print(type(kwargs))   # <class 'dict'>
    for clave, valor in kwargs.items():
        print(f"  {clave}: {valor}")

mostrar_info(nombre="Maxi", edad=27, ciudad="Ensenada")
# nombre: Maxi
# edad: 27
# ciudad: Ensenada
```

*(Uso práctico — crear un diccionario flexible:)*

```python
def crear_perfil(nombre, **datos):
    return {"nombre": nombre, **datos}

perfil = crear_perfil("Ana", edad=20, ciudad="La Plata", activo=True)
print(perfil)
# {'nombre': 'Ana', 'edad': 20, 'ciudad': 'La Plata', 'activo': True}
```

---

## ORDEN DE PARÁMETROS (~30 segundos)

```python
def todo(pos1, pos2, *args, kwonly=True, **kwargs):
    pass
```

> Cuando combinamos todo, el orden es estricto:
> 1. Parámetros normales
> 2. `*args`
> 3. Parámetros solo-keyword (después del `*`)
> 4. `**kwargs`

> Para el 95% del código de este curso, alcanza con parámetros normales y valores por defecto. `*args` y `**kwargs` están acá para que los reconozcan cuando los vean en código ajeno.

---

## CIERRE (~20 segundos)

> En el próximo y último video de la serie vemos las **buenas prácticas** al escribir funciones.
>
> ¡Nos vemos!
