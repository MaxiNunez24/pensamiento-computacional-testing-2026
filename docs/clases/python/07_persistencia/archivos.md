# 💾 Manejo de archivos en Python

Los programas que hiciste hasta ahora "olvidan" todo cuando los cerrás. Aprender a leer y escribir **archivos** es lo que le da **memoria** a tus programas: la próxima vez que los ejecutés, los datos siguen ahí.

!!! info "🎯 Objetivos de la clase"
    Al terminar la clase deberían poder:

    - Abrir archivos con `open()` en distintos **modos** (lectura, escritura, append).
    - Leer el contenido completo de un archivo o **línea por línea**.
    - Escribir y agregar texto a un archivo.
    - Usar el bloque `with` para trabajar con archivos **de forma segura**.
    - Especificar codificación `utf-8` correctamente.

---

## 🧠 ¿Por qué guardar en archivos?

Hasta ahora los datos viven en variables — y cuando el programa termina, desaparecen. Los archivos nos permiten **persistir** información entre ejecuciones.

```python
# Sin archivos: todo se pierde al cerrar el programa
nombres = ["Ana", "Beto", "Cami"]
# Mañana, los nombres ya no están...

# Con archivos: los datos sobreviven entre ejecuciones
# (y así funciona cualquier app real)
```

---

## 📂 Abrir un archivo con open()

La función `open()` abre un archivo y devuelve un **objeto de archivo** (file object) con el que podemos leer o escribir.

```python
archivo = open("datos.txt", "r")  # "r" = modo lectura
# ... hacemos algo con el archivo ...
archivo.close()                    # ¡siempre hay que cerrarlo!
```

### 🔑 Modos de apertura

| Modo | Nombre | ¿Qué hace? |
|------|--------|------------|
| `"r"` | read | Abre para **leer**. Error si no existe. *(por defecto)* |
| `"w"` | write | Abre para **escribir**. Crea el archivo o **sobreescribe** si ya existe. |
| `"a"` | append | Abre para **agregar** al final. Crea el archivo si no existe. |
| `"x"` | exclusive create | Crea el archivo. Error si ya existe. |
| `"r+"` | read + write | Abre para leer **y** escribir. Error si no existe. |

!!! warning "⚠️ El modo `\"w\"` borra el contenido existente"
    Si abrís un archivo existente con `"w"`, su contenido se **destruye** inmediatamente, antes incluso de que escribas nada. Si querés conservar lo que había, usá `"a"`.

---

## 🛡️ El bloque with (la forma correcta)

En lugar de acordarte siempre de hacer `.close()`, Python nos da el bloque `with`, que **cierra el archivo automáticamente** al terminar — incluso si ocurre un error.

```python
# ❌ Forma manual (propensa a errores si hay excepciones)
archivo = open("datos.txt", "r")
contenido = archivo.read()
archivo.close()

# ✅ Forma correcta con with
with open("datos.txt", "r") as archivo:
    contenido = archivo.read()
# El archivo se cierra solo al salir del bloque
```

!!! tip "🏆 Regla de oro"
    Siempre usá `with open(...) as archivo:` para trabajar con archivos. Es más seguro, más limpio, y es la forma estándar en Python moderno.

---

## 📖 Leer archivos

=== "📜 `.read()` — todo de una vez"

    Devuelve el contenido completo como un **string**.

    ```python
    with open("poema.txt", "r", encoding="utf-8") as f:
        contenido = f.read()

    print(contenido)
    print(type(contenido))  # <class 'str'>
    ```

    !!! tip "Cuándo usarlo"
        Para archivos pequeños donde necesitás todo el texto de una vez.

=== "📋 `.readlines()` — lista de líneas"

    Devuelve una **lista de strings**, una por línea. Cada línea incluye el `\n` al final.

    ```python
    with open("lista.txt", "r", encoding="utf-8") as f:
        lineas = f.readlines()

    print(lineas)
    # ['Ana\n', 'Beto\n', 'Cami\n']

    # Para quitarles el \n:
    lineas = [linea.strip() for linea in lineas]
    print(lineas)
    # ['Ana', 'Beto', 'Cami']
    ```

=== "🔁 `for` línea por línea (lo más eficiente)"

    Podemos iterar el archivo directamente sin cargar todo en memoria. Es la forma más **eficiente** para archivos grandes.

    ```python
    with open("alumnos.txt", "r", encoding="utf-8") as f:
        for linea in f:
            nombre = linea.strip()  # quita espacios y \n
            print(f"Alumno: {nombre}")
    ```

!!! warning "🌐 Siempre especificá `encoding='utf-8'`"
    Sin `encoding`, Python usa la codificación del sistema operativo (que en Windows suele ser `cp1252` o `latin-1`). Esto rompe los tildes y la ñ. Por eso **siempre** escribí `encoding="utf-8"`.

---

## ✍️ Escribir archivos

=== "📝 Modo `\"w\"` — crear / sobreescribir"

    ```python
    nombres = ["Ana", "Beto", "Cami"]

    with open("alumnos.txt", "w", encoding="utf-8") as f:
        for nombre in nombres:
            f.write(nombre + "\n")  # write() no agrega \n solo
    ```

    Después de ejecutar esto, el archivo `alumnos.txt` contiene:
    ```
    Ana
    Beto
    Cami
    ```

=== "➕ Modo `\"a\"` — agregar al final"

    ```python
    # El archivo ya existe con Ana, Beto y Cami
    with open("alumnos.txt", "a", encoding="utf-8") as f:
        f.write("Dante\n")

    # Ahora el archivo tiene: Ana, Beto, Cami, Dante
    ```

!!! info "`.write()` vs `print()`"
    - `.write(texto)` escribe exactamente el texto dado (sin `\n` automático).
    - También podés usar `print("algo", file=f)` que sí agrega `\n` al final automáticamente.

---

## 📍 Rutas: relativas vs absolutas

```python
# Ruta relativa — relativa al directorio desde donde ejecutás el script
with open("datos.txt", "r") as f: ...           # mismo directorio
with open("datos/alumnos.txt", "r") as f: ...   # subcarpeta "datos"

# Ruta absoluta — funciona sin importar desde dónde ejecutés
with open("C:/Users/Maxi/Desktop/datos.txt", "r") as f: ...  # Windows
with open("/home/maxi/datos.txt", "r") as f: ...              # Linux/Mac
```

!!! tip "💡 En proyectos reales"
    Usá rutas relativas al proyecto. Las rutas absolutas "hardcodeadas" no funcionan en la computadora de otra persona. En el proyecto vamos a usar rutas relativas a la carpeta del proyecto.

---

## ✅ Buenas prácticas

!!! success "Hacé esto ✅"
    - Siempre usá `with open(...)` para cerrar el archivo automáticamente.
    - Siempre especificá `encoding="utf-8"` al abrir.
    - Usá `.strip()` al leer líneas para eliminar el `\n` del final.
    - Para archivos grandes, iterá el archivo con `for linea in f:` en lugar de `.read()`.

!!! failure "Evitá esto ❌"
    - No abras archivos sin `with` si podés evitarlo.
    - No uses modo `"w"` si querés conservar el contenido existente.
    - No asumas que el archivo existe: si puede no existir, manejá el caso con `if os.path.exists(...)`.

---

## 🎮 Ejercicios

### 🌱 Ejercicio 1 — Crear y leer

1. Creá un archivo `frutas.txt` y escribí 5 frutas, una por línea.
2. Luego leelo e imprimí cada fruta en mayúsculas.

??? tip "💡 Pista"
    Primero abrí el archivo en modo `"w"` para escribir, luego en modo `"r"` para leer. `for linea in archivo` te da cada línea incluyendo el `\n` al final — `.strip()` lo limpia.

??? success "✅ Solución"
    ```python
    # Escribir
    with open("frutas.txt", "w") as f:
        for fruta in ["manzana", "banana", "naranja", "uva", "pera"]:
            f.write(fruta + "\n")

    # Leer
    with open("frutas.txt", "r") as f:
        for linea in f:
            print(linea.strip().upper())
    ```

### 🌿 Ejercicio 2 — Contar palabras

Creá un archivo `texto.txt` con al menos 3 párrafos. Luego escribí un programa que:

1. Cuente cuántas líneas tiene el archivo.
2. Cuente cuántas palabras tiene en total.
3. Muestre la línea más larga.

??? tip "💡 Pista"
    Para las palabras: `.split()` sin argumento divide por cualquier espacio. Para la línea más larga: acumulá llevando registro de la más larga a medida que recorrés.

??? success "✅ Solución"
    ```python
    with open("texto.txt", "r") as f:
        lineas = f.readlines()

    total_palabras = 0
    linea_mas_larga = ""
    for linea in lineas:
        palabras = linea.split()
        total_palabras += len(palabras)
        if len(linea) > len(linea_mas_larga):
            linea_mas_larga = linea

    print(f"Líneas: {len(lineas)}")
    print(f"Palabras: {total_palabras}")
    print(f"Línea más larga: {linea_mas_larga.strip()}")
    ```

### 🌿 Ejercicio 3 — Registro de notas

Escribí un programa que:

1. Pida al usuario nombres y notas hasta que ingrese `"fin"`.
2. Guarde cada registro como `"Nombre,Nota\n"` en un archivo `notas.csv`.
3. Al volver a ejecutar el programa, cargue el archivo y calcule el promedio de notas.

??? tip "💡 Pista"
    Para que los datos se acumulen entre ejecuciones, usá modo `"a"` (append) al escribir. Para leer, separás cada línea con `.split(",")`.

??? success "✅ Solución"
    ```python
    # Parte 1 y 2: guardar notas
    with open("notas.csv", "a") as f:
        while True:
            nombre = input("Nombre (o 'fin'): ")
            if nombre.lower() == "fin":
                break
            nota = input("Nota: ")
            f.write(f"{nombre},{nota}\n")

    # Parte 3: calcular promedio
    notas = []
    with open("notas.csv", "r") as f:
        for linea in f:
            partes = linea.strip().split(",")
            if len(partes) == 2:
                notas.append(float(partes[1]))

    if notas:
        print(f"Promedio: {sum(notas) / len(notas):.2f}")
    ```

### 🌶️ Ejercicio 4 — Log de ejecuciones

Cada vez que el programa se ejecute, que agregue una línea al archivo `log.txt` con la fecha/hora y un mensaje.

!!! info "📦 Módulo: datetime"
    ```python
    from datetime import datetime
    ahora = datetime.now()
    print(ahora.strftime("%Y-%m-%d %H:%M:%S"))  # "2026-05-22 11:30:00"
    ```

??? tip "💡 Pista"
    Abrí el archivo en modo `"a"` para que cada ejecución agregue sin borrar lo anterior. `datetime.now()` te da la fecha y hora actual; `.strftime()` la formatea como texto.

??? success "✅ Solución"
    ```python
    from datetime import datetime

    mensaje = "Programa ejecutado correctamente"
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open("log.txt", "a") as f:
        f.write(f"[{timestamp}] {mensaje}\n")

    print(f"Log actualizado: {timestamp}")
    ```

---

!!! quote "Para cerrar"
    Leer y escribir archivos de texto es la base de la persistencia. En la próxima clase vamos a dar un salto enorme: en lugar de texto plano, vamos a guardar **datos estructurados en formato JSON**, lo que nos permite guardar listas y diccionarios directamente.

## [⬅️ Anterior: Funciones II](../06_funciones/funciones_2.md)
## [📚 Índice](../../clases.md#persistencia)
## [➡️ Siguiente: JSON](./json.md)
