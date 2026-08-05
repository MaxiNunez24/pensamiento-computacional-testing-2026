# 🔥 Entrada en calor: Funciones como caja negra

!!! tip "Antes de armar el Bingo"
    En el Bingo vas a tener que **escribir funciones y después usarlas** dentro de un `while`. Si eso
    todavía te marea un poco, esta entrada en calor es para vos. Si ya te sentís cómodo con funciones,
    saltala tranquilo y andá directo al [🎲 Bingo](./bingo.md).

!!! info "🎯 Qué vas a sacar de acá"
    - Entender que una función es una **caja negra**: te importa **qué hace**, no **cómo lo hace**.
    - Poder **usar** una función confiando en su "contrato", sin releer su interior cada vez.
    - Llegar al Bingo sabiendo que `verificar_ganador(...)` es tu amiga, no tu enemiga. 🤝

---

## Spoiler: ya venís usando cajas negras

Desde la primera clase usás funciones que **vos no escribiste** y que **nunca viste por dentro**:

```python
len("hola")              # 4     ¿sabés CÓMO cuenta las letras? No. ¿Importa? Tampoco.
sorted([3, 1, 2])        # [1, 2, 3]
print("¡Hola!")          # muestra texto en pantalla
random.choice([1, 2, 3]) # un número al azar
```

Confiás en **qué hacen** sin tener idea de **cómo lo hacen**. Eso es una **caja negra**: metés algo,
sale algo, y el "cómo" está tapado adentro. **Tus propias funciones funcionan exactamente igual.**

!!! note "🍔 La analogía del microondas"
    Para calentar la comida apretás *1 minuto* y listo. No necesitás saber qué es un magnetrón ni
    cómo genera las microondas. **Apretás (entrada) → sale comida caliente (salida).** Una función es
    tu microondas: la usás por lo que hace, no por cómo está hecha por dentro.

---

## El contrato de una función

Para **usar** una función solo necesitás tres cosas — su **contrato**:

```python
def precio_con_iva(precio):      # 1) NOMBRE: precio_con_iva
    return precio * 1.21         # 2) QUÉ RECIBE: un precio   3) QUÉ DEVUELVE: ese precio + 21%
```

- **Nombre** → cómo la llamás.
- **Qué recibe** (parámetros) → qué le tenés que dar.
- **Qué devuelve** (`return`) → qué te entrega de vuelta.

El **cuerpo** (la línea de adentro, el *cómo*) te importa cuando la **escribís**. Pero cuando la
**usás**, lo podés "olvidar" y confiar en el contrato:

```python
total = precio_con_iva(100)   # confío en que me devuelve 121.0
print(total)                  # 121.0
```

!!! success "La idea clave"
    **Escribir** una función = pensar en el *cómo*. **Usar** una función = confiar en el *qué*.
    Son dos sombreros distintos. Cuando la llamás, no estás "entrando" a la función: le pasás datos y
    esperás el resultado.

---

## 🎮 Ejercicio 1 — Leer el contrato, no el cuerpo 🌱

Tenés esta función:

```python
def es_mayor_de_edad(edad):
    return edad >= 18
```

Sin ejecutar nada en la compu, decí qué devuelve cada llamada:

```python
es_mayor_de_edad(20)
es_mayor_de_edad(15)
es_mayor_de_edad(18)
```

??? tip "💡 Pista"
    No necesitás "entrar" a la función línea por línea. Leé el nombre y el `return`: *devuelve si la
    edad es mayor o igual a 18*. Aplicá esa idea a cada número.

??? success "✅ Respuesta"
    ```python
    es_mayor_de_edad(20)   # True   (20 >= 18)
    es_mayor_de_edad(15)   # False  (15 >= 18 es falso)
    es_mayor_de_edad(18)   # True   (18 >= 18, el >= incluye al 18)
    ```
    Fijate que para responder **no hiciste la cuenta de cómo funciona por dentro**: confiaste en lo
    que el nombre y el `return` te prometen. Eso es leer el contrato.

---

## 🎮 Ejercicio 2 — Usar una caja negra ajena 🌿

Imaginá que un compañero ya escribió esta función (vos **no ves el código de adentro**, solo te
cuenta el contrato):

> `descuento(precio, porcentaje)` → devuelve el precio **ya con el descuento aplicado**.
> Por ejemplo, `descuento(100, 10)` devuelve `90.0`.

Sin saber cómo está hecha por dentro, **usala** para resolver esto:

> Una campera cuesta $50.000 y está al 30% off. Imprimí cuánto pagás.

??? tip "💡 Pista"
    No tenés que escribir `descuento` — ya existe. Tu única tarea es **llamarla** con los datos
    correctos y mostrar el resultado. ¿Qué dos cosas recibe? ¿Qué te devuelve?

??? success "✅ Solución"
    ```python
    a_pagar = descuento(50000, 30)
    print(f"Pagás ${a_pagar}")
    ```
    No te hizo falta saber si por dentro hace `precio - precio * porcentaje / 100` o cualquier otra
    cuenta. **Confiaste en el contrato** y la usaste. Así se trabaja con funciones (propias o ajenas).

---

## 🎮 Ejercicio 3 — Escribirla una vez, usarla muchas 🌿

Acá te toca ponerte el otro sombrero (el de *escribir*). Definí una función `area_triangulo(base, altura)`
que **devuelva** el área (base por altura dividido 2). Después, **usala 3 veces** para imprimir el
área de tres triángulos distintos.

```python
# Ejemplo de salida esperada:
# Área 1: 10.0
# Área 2: 6.0
# Área 3: 25.0
```

??? tip "💡 Pista"
    Primero el contrato: recibe `base` y `altura`, devuelve `base * altura / 2` con `return`.
    Después la llamás tres veces con números distintos. Definís **una vez**, usás **las que quieras**.

??? success "✅ Solución"
    ```python
    def area_triangulo(base, altura):
        return base * altura / 2

    print(f"Área 1: {area_triangulo(4, 5)}")   # 10.0
    print(f"Área 2: {area_triangulo(3, 4)}")   # 6.0
    print(f"Área 3: {area_triangulo(10, 5)}")  # 25.0
    ```
    Esa es la **potencia** de las funciones: escribís la lógica **una sola vez** y la reusás todas las
    veces que necesites, sin copiar y pegar.

---

## 🎯 Y esto, ¿qué tiene que ver con el Bingo?

En el Bingo vas a escribir una función así:

```python
def verificar_ganador(carton, sorteados):
    return carton.issubset(sorteados)
```

Y después la vas a **usar** dentro del bucle del juego:

```python
while not verificar_ganador(carton, sorteados):
    # seguir sorteando...
```

Cuando llegues a esa línea, **no necesitás recordar cómo `verificar_ganador` decide si ganaste**.
Solo confiás en su contrato: *le doy el cartón y lo sorteado, me devuelve `True` o `False`*. El
`while` la usa como caja negra — igual que vos usás `len()` sin pensarlo.

!!! success "Si esto te hizo clic…"
    …ya estás listo para el Bingo. 🎰 Y si todavía no del todo, no pasa nada: lo vamos a armar
    **entre todos**, paso a paso.

---

## [⬅️ Anterior: Lectura y corrección de código](./lectura_codigo.md)
## [📚 Índice](../clases.md#colecciones)
## [➡️ Siguiente: Bingo](./bingo.md)
