# 🧬 POO I — Clases y objetos

!!! example "🤔 El problema: datos sueltos que andan de la mano"
    Querés representar a un alumno: nombre, nota y materias. Con lo que sabés, usás un diccionario:

    ```python
    ana = {"nombre": "Ana", "nota": 9, "materias": ["Python", "Mate"]}
    ```

    Funciona, pero tiene dos molestias:

    1. Nada te avisa si escribís mal una clave: `ana["nombre"]` no es un error hasta que explota.
    2. Las cosas que se **hacen** con un alumno (saludar, ver si aprobó) quedan **sueltas** como
       funciones por todo el programa, lejos de los datos que usan.

    ¿Y si pudieras meter los **datos** y lo que se **hace** con ellos en una sola cosa, con un molde
    que siempre tenga la misma forma? Eso es la **Programación Orientada a Objetos**.

!!! info "🎯 Objetivos de la clase"
    Al terminar deberías poder:

    - Entender la diferencia entre una **clase** (el molde) y un **objeto** (lo construido con él).
    - Escribir una clase con su **constructor** `__init__` y sus **atributos**.
    - Entender qué es **`self`** y para qué sirve.
    - Agregar **métodos** (funciones que viven dentro de la clase) y usarlos.

---

## 🧱 La idea: un molde y sus copias

Una **clase** es un **molde** (un plano). Un **objeto** es algo **construido con ese molde**.

- 🏠 El **plano** de una casa es la clase. Cada **casa** construida con ese plano es un objeto.
- 🍪 El **molde** de galletitas es la clase. Cada **galletita** es un objeto.

Definís el molde **una vez** y creás **todos los objetos que quieras** con él. Cada objeto tiene sus
**propios datos**, pero todos comparten la misma forma.

---

## 🐣 Tu primera clase

```python
class Alumno:
    def __init__(self, nombre, nota):
        self.nombre = nombre
        self.nota = nota
```

Despacito, qué es cada cosa:

- **`class Alumno:`** → definimos el molde. Por convención, el nombre va en *MayúsculaInicial*.
- **`def __init__(self, ...)`** → el **constructor**. Es una función especial que Python ejecuta
  **sola, automáticamente, cada vez que creás un objeto**. Acá le decís qué datos necesita.
- **`self.nombre = nombre`** → guarda el dato dentro del objeto. Eso es un **atributo**.

### Crear objetos (instanciar)

```python
ana  = Alumno("Ana", 9)      # se ejecuta __init__ con nombre="Ana", nota=9
beto = Alumno("Beto", 5)

print(ana.nombre)   # Ana
print(ana.nota)     # 9
print(beto.nombre)  # Beto
```

`ana` y `beto` son **dos objetos distintos** del mismo molde, cada uno con **sus propios datos**.
Acceder a un atributo es `objeto.atributo` — con punto, sin comillas (a diferencia del diccionario,
que era `ana["nombre"]`).

---

## 🪞 `self`: "yo mismo"

`self` es la palabra clave que más confunde al principio, así que vamos con calma.

Cuando escribís un método, **todavía no existe ningún objeto concreto** — estás escribiendo el molde.
`self` es el comodín que significa **"el objeto que esté usando este método en este momento"**.

```python
ana.nombre    # cuando hacés esto, adentro del método self ES ana
beto.nombre   # y acá self ES beto
```

!!! tip "🧠 Regla práctica"
    **Adentro de la clase**, para referirte a los datos del objeto, usás `self.algo`. **Afuera**, para
    referirte a un objeto concreto, usás `suNombre.algo` (`ana.nombre`). Es la misma cosa vista desde
    adentro y desde afuera.

---

## 🛠️ Métodos: funciones que el objeto lleva consigo

Un **método** es una función definida **adentro** de la clase. Opera sobre los datos del objeto
(`self`). Es la parte de "lo que se **hace**" con el alumno, ahora pegada a sus datos.

```python
class Alumno:
    def __init__(self, nombre, nota):
        self.nombre = nombre
        self.nota = nota

    def aprobo(self):
        return self.nota >= 6

    def saludar(self):
        print(f"Hola, soy {self.nombre} y mi nota es {self.nota}")
```

Para usarlos, los llamás con punto, igual que un atributo pero con `()`:

```python
ana = Alumno("Ana", 9)
ana.saludar()        # Hola, soy Ana y mi nota es 9
print(ana.aprobo())  # True

beto = Alumno("Beto", 4)
print(beto.aprobo()) # False
```

!!! note "🔌 Esto es la entrada en calor en acción"
    `ana.aprobo()` es una **caja negra**: la llamás confiando en que te devuelve si aprobó, sin pensar
    en el `self.nota >= 6` de adentro. Un objeto no es más que **datos + sus propias funciones**
    juntos. Si esto te suena raro, repasá la
    [🔥 Entrada en calor: Funciones como caja negra](../06_funciones/funciones_caja_negra.md).

### ¿Por qué no seguir con diccionarios?

=== "❌ Con diccionario"

    ```python
    ana = {"nombre": "Ana", "nota": 9}

    # La lógica anda suelta, lejos de los datos:
    def aprobo(alumno):
        return alumno["nota"] >= 6

    print(aprobo(ana))
    print(ana["nombre"])   # 💥 typo silencioso: KeyError recién al ejecutar
    ```

=== "✅ Con clase"

    ```python
    ana = Alumno("Ana", 9)

    # La lógica vive CON los datos:
    print(ana.aprobo())
    print(ana.nombre)      # el editor te autocompleta y avisa si te equivocás
    ```

La clase junta los datos y sus operaciones en una sola cosa coherente. Eso escala muchísimo mejor
cuando el programa crece.

---

## 🎮 Ejercicios

### 🌱 Ejercicio 1 — La clase `Perro`

Definí una clase `Perro` con dos atributos: `nombre` y `edad`. Agregale un método `ladrar()` que
imprima `"<nombre> dice: ¡Guau!"`. Después creá dos perros distintos y hacé que ladren.

```
# Salida esperada (con tus perros):
Firulais dice: ¡Guau!
Laika dice: ¡Guau!
```

??? tip "💡 Pista"
    El constructor recibe `self, nombre, edad` y guarda `self.nombre` y `self.edad`. En `ladrar()`,
    usá `self.nombre` para armar el mensaje. No te olvides el `self` como primer parámetro de cada
    método.

??? success "✅ Solución"
    ```python
    class Perro:
        def __init__(self, nombre, edad):
            self.nombre = nombre
            self.edad = edad

        def ladrar(self):
            print(f"{self.nombre} dice: ¡Guau!")

    firulais = Perro("Firulais", 3)
    laika = Perro("Laika", 5)

    firulais.ladrar()
    laika.ladrar()
    ```

### 🌿 Ejercicio 2 — La cuenta bancaria

Creá una clase `CuentaBancaria` que arranque con un `saldo` (por defecto 0). Agregale:

- `depositar(monto)` → suma el monto al saldo.
- `extraer(monto)` → resta el monto, **pero solo si hay saldo suficiente**; si no, imprime
  `"Saldo insuficiente"`.
- `ver_saldo()` → imprime el saldo actual.

```
cuenta = CuentaBancaria(100)
cuenta.depositar(50)
cuenta.ver_saldo()      # Saldo: 150
cuenta.extraer(200)     # Saldo insuficiente
cuenta.extraer(30)
cuenta.ver_saldo()      # Saldo: 120
```

??? tip "💡 Pista"
    El saldo es un atributo que **cambia con el tiempo** (`self.saldo`). Cada método lo modifica o lo
    muestra. Para el valor por defecto, usá `def __init__(self, saldo=0):`. En `extraer`, un `if`
    decide si alcanza.

??? success "✅ Solución"
    ```python
    class CuentaBancaria:
        def __init__(self, saldo=0):
            self.saldo = saldo

        def depositar(self, monto):
            self.saldo += monto

        def extraer(self, monto):
            if monto <= self.saldo:
                self.saldo -= monto
            else:
                print("Saldo insuficiente")

        def ver_saldo(self):
            print(f"Saldo: {self.saldo}")

    cuenta = CuentaBancaria(100)
    cuenta.depositar(50)
    cuenta.ver_saldo()    # Saldo: 150
    cuenta.extraer(200)   # Saldo insuficiente
    cuenta.extraer(30)
    cuenta.ver_saldo()    # Saldo: 120
    ```

    Fijate cómo el objeto **recuerda su propio estado** entre llamadas: el saldo va cambiando y cada
    cuenta lleva el suyo.

### 🌿 Ejercicio 3 — Alumno con varias notas

Esta clase la vas a reconocer del proyecto que viene. Creá una clase `Alumno` con `nombre` y una
**lista de notas**. Agregale:

- `agregar_nota(nota)` → suma una nota a la lista.
- `promedio()` → **devuelve** el promedio de las notas (0 si todavía no tiene ninguna).
- `aprobado()` → **devuelve** `True` si el promedio es 6 o más.

```
ana = Alumno("Ana")
ana.agregar_nota(8)
ana.agregar_nota(10)
ana.agregar_nota(6)
print(ana.promedio())   # 8.0
print(ana.aprobado())   # True
```

??? tip "💡 Pista"
    En el constructor, la lista de notas arranca **vacía**: `self.notas = []`. Para el promedio, ya
    conocés `sum(self.notas)` y `len(self.notas)` — pero ojo con dividir por cero si la lista está
    vacía. `aprobado()` puede **reusar** `self.promedio()`.

??? success "✅ Solución"
    ```python
    class Alumno:
        def __init__(self, nombre):
            self.nombre = nombre
            self.notas = []

        def agregar_nota(self, nota):
            self.notas.append(nota)

        def promedio(self):
            if not self.notas:
                return 0
            return sum(self.notas) / len(self.notas)

        def aprobado(self):
            return self.promedio() >= 6

    ana = Alumno("Ana")
    ana.agregar_nota(8)
    ana.agregar_nota(10)
    ana.agregar_nota(6)
    print(ana.promedio())   # 8.0
    print(ana.aprobado())   # True
    ```

    `aprobado()` llama a `self.promedio()`: un método del objeto usando **otro** método del mismo
    objeto. Reutilización pura. 💪

---

## 📌 Cheatsheet

```python
class NombreClase:               # el molde (MayúsculaInicial)
    def __init__(self, dato1):   # constructor: corre al crear el objeto
        self.dato1 = dato1       # atributo: dato guardado en el objeto

    def un_metodo(self):         # método: función del objeto (self primero)
        return self.dato1

obj = NombreClase("hola")        # crear un objeto (instanciar)
print(obj.dato1)                 # acceder a un atributo
print(obj.un_metodo())           # llamar a un método
```

---

!!! quote "Para cerrar"
    Acabás de dar el salto más importante del año: de manejar datos sueltos a **modelar cosas** con
    sus datos y sus comportamientos juntos. En el primer proyecto vas a modelar `Alumno`, `Clase` y
    `Asistencia` exactamente así. En la próxima clase (**POO II**) vamos a hacer que tus objetos se
    impriman lindo (`__str__`) y a proteger sus datos (encapsulamiento).

## [⬅️ Anterior: Git y GitHub](../07_persistencia/git_github.md)
## [📚 Índice](../../clases.md)
## ➡️ Siguiente: POO II *(próximamente)*
