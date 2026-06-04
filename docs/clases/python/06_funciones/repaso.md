# 🔁 Repaso general — Antes del Bingo

!!! example "🤔 El momento de la verdad"
    El ejercicio integrador de la próxima clase conecta todo lo que vimos: variables, condicionales, bucles, listas, sets, diccionarios y funciones. Este repaso es para asegurarte de que cada herramienta está clara antes de usarlas todas juntas.

    No hay teoría nueva. Solo problemas reales para resolver.

!!! info "🎯 Objetivos de la clase"
    Al terminar deberías poder:

    - Elegir la **estructura de datos correcta** para cada problema (lista, set, diccionario).
    - Escribir **funciones** que encapsulen lógica y devuelvan valores.
    - Combinar **bucles, condicionales y colecciones** para resolver problemas de una pieza.
    - Identificar cuándo estás en el camino correcto antes de ejecutar el código.

---

## 🗺️ El mapa de herramientas

Antes de arrancar, recordá qué tenés disponible:

| Herramienta | Para qué sirve | Cuándo elegirla |
|-------------|---------------|-----------------|
| `int`, `float`, `str`, `bool` | Guardar y transformar datos simples | Siempre que trabajés con un valor individual |
| `if / elif / else` | Tomar decisiones | Cuando el resultado depende de una condición |
| `while` | Repetir mientras algo sea verdadero | Cuando no sabés cuántas iteraciones habrá |
| `for` | Recorrer colecciones | Cuando sabés exactamente qué recorrés |
| Lista `[]` | Secuencia ordenada, modificable | Orden importa, puede haber duplicados |
| Set `{}` | Elementos únicos, operaciones de conjuntos | Sin duplicados, pertenencia rápida |
| Diccionario `{k: v}` | Datos etiquetados | Necesitás acceder por nombre, no por posición |
| Función `def` | Encapsular lógica reutilizable | Cuando el mismo bloque se usa más de una vez |

!!! tip "💡 La pregunta antes de codear"
    Antes de cada ejercicio, respondé en papel:

    1. ¿Qué recibo? ¿Qué tipo de dato es?
    
    2. ¿Qué tengo que devolver o mostrar?
    
    3. ¿Cómo lo resolvería con 3 datos de ejemplo, a mano?

---

## 🎮 Ejercicios

### 🌱 Ejercicio 1 — La fotocopiadora

Una fotocopiadora cobra **$15 por hoja**. Si la cantidad supera las 100 hojas, aplica un **descuento del 20%** sobre el total.

Escribí un programa que pida la cantidad de hojas y muestre el precio final con 2 decimales. Si hubo descuento, mostralo por separado.

```
Cantidad de hojas: 50
Total: $750.00
```

```
Cantidad de hojas: 150
Subtotal: $2250.00
Descuento (20%): $450.00
Total: $1800.00
```

??? tip "💡 Pista"
    - ¿Qué tipo de dato necesitás para la cantidad? ¿Y para el precio?
    - ¿Cuál es la condición exacta que activa el descuento?
    - ¿Cómo calculás el 20% de un número?

??? success "✅ Solución"
    ```python
    cantidad = int(input("Cantidad de hojas: "))
    subtotal = cantidad * 15

    if cantidad > 100:
        descuento = subtotal * 0.20
        total = subtotal - descuento
        print(f"Subtotal: ${subtotal:.2f}")
        print(f"Descuento (20%): ${descuento:.2f}")
    else:
        total = subtotal

    print(f"Total: ${total:.2f}")
    ```

---

### 🌱 Ejercicio 2 — El clasificador de entradas

Un boliche tiene estas categorías por edad:

| Edad | Mensaje |
|------|---------|
| Menor de 18 | `"No puede ingresar"` |
| 18 a 25 | `"Entrada joven: $2000"` |
| 26 a 59 | `"Entrada general: $3000"` |
| 60 o más | `"Entrada libre"` |

Escribí una **función** `clasificar_entrada(edad)` que reciba la edad y **devuelva** el mensaje correspondiente.

```python
clasificar_entrada(16)  # → "No puede ingresar"
clasificar_entrada(22)  # → "Entrada joven: $2000"
clasificar_entrada(45)  # → "Entrada general: $3000"
clasificar_entrada(65)  # → "Entrada libre"
```

??? tip "💡 Pista"
    - ¿Cuántas ramas tiene este problema? ¿Cuántos `elif` necesitás?
    - ¿En qué orden conviene escribir las condiciones para que no se pisen?
    - La función tiene que **devolver** el string, no imprimirlo — ¿qué instrucción usás?

??? success "✅ Solución"
    ```python
    def clasificar_entrada(edad):
        if edad < 18:
            return "No puede ingresar"
        elif edad <= 25:
            return "Entrada joven: $2000"
        elif edad <= 59:
            return "Entrada general: $3000"
        else:
            return "Entrada libre"

    print(clasificar_entrada(22))  # Entrada joven: $2000
    ```

---

### 🌿 Ejercicio 3 — La alcancía digital

Alguien quiere ahorrar **$10.000**. Cada semana deposita una cantidad variable. El programa pide montos hasta que:

- Se llega o supera el objetivo, **o**
- El usuario escribe `0` para parar antes.

Al terminar, mostrá cuánto ahorró y si llegó al objetivo.

```
Depósito (0 para parar): 2500
Depósito (0 para parar): 3000
Depósito (0 para parar): 1500
Depósito (0 para parar): 4000
¡Llegaste al objetivo! Ahorraste $11000 en 4 depósitos.
```

```
Depósito (0 para parar): 1000
Depósito (0 para parar): 500
Depósito (0 para parar): 0
No llegaste al objetivo. Ahorraste $1500 (te faltan $8500).
```

??? tip "💡 Pista"
    - ¿Cuándo continúa el bucle? ¿Cuándo para? Esas dos condiciones definen el `while`.
    - ¿Qué variables necesitás actualizar en cada iteración?
    - ¿Cómo sabés, después del bucle, si llegó al objetivo o no?

??? success "✅ Solución"
    ```python
    OBJETIVO = 10000
    total = 0
    depositos = 0

    monto = float(input("Depósito (0 para parar): "))
    while total < OBJETIVO and monto != 0:
        total += monto
        depositos += 1
        monto = float(input("Depósito (0 para parar): "))

    if total >= OBJETIVO:
        print(f"¡Llegaste al objetivo! Ahorraste ${total:.0f} en {depositos} depósitos.")
    else:
        print(f"No llegaste al objetivo. Ahorraste ${total:.0f} (te faltan ${OBJETIVO - total:.0f}).")
    ```

---

### 🌿 Ejercicio 4 — Estadísticas de ventas

Dada esta lista de ventas del mes (en pesos):

```python
ventas = [12500, 8900, 23100, 5400, 18700, 11200, 9800, 30500, 7600, 15300]
```

Escribí una **función** `analizar_ventas(ventas)` que devuelva un **diccionario** con:

- `"total"`: suma de todas las ventas
- `"promedio"`: promedio
- `"mayor"`: venta más alta
- `"menor"`: venta más baja
- `"sobre_promedio"`: cuántas ventas superan el promedio

```python
resultado = analizar_ventas(ventas)
# resultado["total"]          → 143000
# resultado["promedio"]       → 14300.0
# resultado["mayor"]          → 30500
# resultado["menor"]          → 5400
# resultado["sobre_promedio"] → 4
```

??? tip "💡 Pista"
    - ¿Qué built-ins calculan suma, mínimo y máximo de una lista?
    - Para `"sobre_promedio"` necesitás el promedio primero — ¿cómo recorrés la lista y contás los que lo superan?
    - La función devuelve un diccionario — ¿cómo lo armás antes del `return`?

??? success "✅ Solución"
    ```python
    def analizar_ventas(ventas):
        total = sum(ventas)
        promedio = total / len(ventas)

        sobre_promedio = 0
        for v in ventas:
            if v > promedio:
                sobre_promedio += 1

        return {
            "total": total,
            "promedio": promedio,
            "mayor": max(ventas),
            "menor": min(ventas),
            "sobre_promedio": sobre_promedio,
        }

    ventas = [12500, 8900, 23100, 5400, 18700, 11200, 9800, 30500, 7600, 15300]
    print(analizar_ventas(ventas))
    ```

---

### 🌿 Ejercicio 5 — Validador de contraseñas

Escribí una función `es_segura(password)` que devuelva `True` si la contraseña cumple **las tres** condiciones, o `False` si falla alguna:

- Al menos **8 caracteres**
- Al menos **una letra mayúscula**
- Al menos **un dígito**

```python
es_segura("hola")        # → False  (muy corta)
es_segura("holamundo")   # → False  (sin mayúscula ni dígito)
es_segura("Holamundo")   # → False  (sin dígito)
es_segura("Holamundo1")  # → True
es_segura("ABCD1234")    # → True
```

??? tip "💡 Pista"
    - ¿Podés verificar el largo con `len()` antes de revisar el resto?
    - Para saber si hay una mayúscula: ¿qué método de strings te dice si un carácter es mayúscula? ¿Cómo recorrés todos los caracteres de la contraseña?
    - ¿Qué método de strings verifica si un carácter es un dígito?

??? success "✅ Solución"
    ```python
    def es_segura(password):
        if len(password) < 8:
            return False

        tiene_mayuscula = False
        tiene_digito = False

        for c in password:
            if c.isupper():
                tiene_mayuscula = True
            if c.isdigit():
                tiene_digito = True

        return tiene_mayuscula and tiene_digito

    print(es_segura("Holamundo1"))  # True
    print(es_segura("holamundo"))   # False
    ```

---

### 🌿 Ejercicio 6 — Control de accesos

Un edificio registra el DNI de cada persona que entra. El mismo DNI puede aparecer varias veces si entró más de una vez en el día.

```python
accesos_lunes  = [12345678, 87654321, 12345678, 55555555, 87654321, 11111111]
accesos_martes = [87654321, 33333333, 55555555, 87654321, 44444444]
```

Respondé:

1. ¿Cuántas personas **distintas** entraron el lunes?
2. ¿Qué personas entraron **los dos días**?
3. ¿Qué personas entraron el lunes pero **no** el martes?
4. ¿Cuántas personas distintas entraron en **alguno de los dos días**?

```
Personas distintas el lunes: 4
Entraron ambos días: {87654321, 55555555}
Solo el lunes: {12345678, 11111111}
Total en algún día: 6
```

??? tip "💡 Pista"
    - ¿Qué estructura elimina duplicados automáticamente cuando la construís?
    - Para "los dos días": ¿qué operación de conjuntos te da los elementos que están en **ambos**?
    - Para "solo el lunes": ¿qué operación te da lo que está en A pero no en B?
    - Para el total: ¿qué operación reúne todo sin repetir?

??? success "✅ Solución"
    ```python
    accesos_lunes  = [12345678, 87654321, 12345678, 55555555, 87654321, 11111111]
    accesos_martes = [87654321, 33333333, 55555555, 87654321, 44444444]

    lunes  = set(accesos_lunes)
    martes = set(accesos_martes)

    print(f"Personas distintas el lunes: {len(lunes)}")        # 4
    print(f"Entraron ambos días: {lunes & martes}")            # {87654321, 55555555}
    print(f"Solo el lunes: {lunes - martes}")                  # {12345678, 11111111}
    print(f"Total en algún día: {len(lunes | martes)}")        # 6
    ```

---

### 🌿 Ejercicio 7 — Agenda de contactos

Tenés esta agenda:

```python
agenda = {
    "Ana":  {"telefono": "221-1234", "ciudad": "La Plata"},
    "Beto": {"telefono": "011-5678", "ciudad": "Buenos Aires"},
    "Cami": {"telefono": "221-9012", "ciudad": "La Plata"},
}
```

Escribí tres funciones:

1. `buscar(agenda, nombre)` → devuelve los datos del contacto, o `"No encontrado"` si no existe.
2. `agregar(agenda, nombre, telefono, ciudad)` → agrega el contacto a la agenda.
3. `por_ciudad(agenda, ciudad)` → devuelve una **lista de nombres** de los contactos de esa ciudad.

```python
buscar(agenda, "Ana")           # → {"telefono": "221-1234", "ciudad": "La Plata"}
buscar(agenda, "Dante")         # → "No encontrado"
agregar(agenda, "Dante", "223-3456", "Mar del Plata")
por_ciudad(agenda, "La Plata")  # → ["Ana", "Cami"]
```

??? tip "💡 Pista"
    - Para `buscar`: ¿cómo verificás si una clave existe en un diccionario?
    - Para `agregar`: los diccionarios son mutables — ¿necesitás `return`?
    - Para `por_ciudad`: ¿cómo recorrés los ítems del diccionario? ¿Cómo comparás la ciudad de cada contacto?

??? success "✅ Solución"
    ```python
    def buscar(agenda, nombre):
        if nombre in agenda:
            return agenda[nombre]
        return "No encontrado"

    def agregar(agenda, nombre, telefono, ciudad):
        agenda[nombre] = {"telefono": telefono, "ciudad": ciudad}

    def por_ciudad(agenda, ciudad):
        resultado = []
        for nombre, datos in agenda.items():
            if datos["ciudad"] == ciudad:
                resultado.append(nombre)
        return resultado

    agenda = {
        "Ana":  {"telefono": "221-1234", "ciudad": "La Plata"},
        "Beto": {"telefono": "011-5678", "ciudad": "Buenos Aires"},
        "Cami": {"telefono": "221-9012", "ciudad": "La Plata"},
    }

    print(buscar(agenda, "Ana"))            # {'telefono': '221-1234', 'ciudad': 'La Plata'}
    print(buscar(agenda, "Dante"))          # No encontrado
    agregar(agenda, "Dante", "223-3456", "Mar del Plata")
    print(por_ciudad(agenda, "La Plata"))   # ['Ana', 'Cami']
    ```

---

### 🌶️ Ejercicio 8 — El analizador de texto

Escribí una función `analizar(texto)` que reciba un string y devuelva un diccionario con:

- `"palabras"`: cantidad total de palabras
- `"unicas"`: cantidad de palabras distintas (sin importar mayúsculas/minúsculas)
- `"mas_frecuente"`: la palabra que más se repite
- `"promedio_largo"`: longitud promedio de las palabras, redondeada a 1 decimal

```python
texto = "el zorro marrón salta sobre el perro el zorro siempre escapa"

resultado = analizar(texto)
# resultado["palabras"]        → 11
# resultado["unicas"]          → 9
# resultado["mas_frecuente"]   → "el"
# resultado["promedio_largo"]  → 4.5
```

??? tip "💡 Pista"
    - ¿Qué método divide el texto en una lista de palabras?
    - Para palabras únicas: ¿qué estructura elimina duplicados automáticamente?
    - Para la más frecuente: usá un diccionario para contar cuántas veces aparece cada palabra. Luego recorrelo para encontrar la clave con el mayor valor.
    - Para el promedio de largo: ¿cómo sumás `len()` de cada palabra y dividís por la cantidad total?

??? success "✅ Solución"
    ```python
    def analizar(texto):
        palabras = texto.lower().split()

        conteo = {}
        for p in palabras:
            if p in conteo:
                conteo[p] += 1
            else:
                conteo[p] = 1

        mas_frecuente = ""
        max_veces = 0
        for palabra, veces in conteo.items():
            if veces > max_veces:
                max_veces = veces
                mas_frecuente = palabra

        promedio = sum(len(p) for p in palabras) / len(palabras)

        return {
            "palabras": len(palabras),
            "unicas": len(set(palabras)),
            "mas_frecuente": mas_frecuente,
            "promedio_largo": round(promedio, 1),
        }

    texto = "el zorro marrón salta sobre el perro el zorro siempre escapa"
    print(analizar(texto))
    ```

---

## 🔄 Retrospectiva rápida

Antes de cerrar: ¿cómo quedaste?

| | |
|---|---|
| 😊 | Los 8 ejercicios claros, me siento listo/a para el Bingo |
| 🤔 | Algunos ejercicios me costaron, pero llegué |
| 😵 | Me trabé bastante, necesito repasar antes de seguir |

Anotá también: **¿qué ejercicio fue el más difícil y por qué?** Esa respuesta te dice exactamente en qué concepto enfocarte.

---

## [⬅️ Anterior: Cómo encarar un ejercicio](./como_encarar_ejercicios.md)
## [📚 Índice](../../clases.md#colecciones)
## [➡️ Siguiente: Lectura y corrección de código](./lectura_codigo.md)
