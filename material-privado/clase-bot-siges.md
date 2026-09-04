# El bot del SiGeS en clase

> Dos cosas distintas, y conviene no mezclarlas:
>
> - **Parte A — el pantallazo** (30-40 min, se puede dar ya): qué es el bot y por qué existe.
>   No se programa nada. Sirve para que vean a dónde va el año.
> - **Parte B — construirlo** (2 clases, noviembre): recién cuando tengan POO, archivos y el
>   sistema andando. Está al final de este documento.

---

# Parte A — El pantallazo (30-40 min)

Se puede dar en cualquier momento a partir de ahora, y **rinde más apenas vuelvan de ver la demo
del viernes**, con la escena fresca.

## A.1 Arrancar por el problema, no por la herramienta

Nada de "hoy vemos automatización". Se arranca mostrando **la planilla de Google en la pantalla**
y contando lo que pasa hoy:

> "Para inscribir a un alumno, alguien abre esta planilla, copia el DNI, lo pega en el sistema del
> Ministerio, y completa **veinte campos a mano** leyendo de acá. Después vuelve a empezar con el
> siguiente. Son treinta alumnos."

Y la pregunta al grupo, antes de mostrar nada:

> **"¿Cuánto tarda? ¿Y cuántas veces se equivoca?"**

Que estimen ellos. Dos horas es la respuesta razonable. Ahí ya entendieron para qué sirve el bot,
sin que nadie diga la palabra "bot".

## A.2 La demostración (10 min)

En este orden, que es el que cuenta la historia:

**1. La planilla como llega.** Bajar hasta la fila donde alguien puso el DNI en la columna del
domicilio. Dejar que lo vean. *"Esto lo escribieron treinta personas distintas."*

**2. `python normalizar.py`** — 5 listos, 3 frenados, cada uno con su motivo:

```
⛔ FRENADOS, los tiene que mirar una persona: 3
   fila   3  Ledesma, Marta Elena
            · la fecha "13/10/2072" está en el futuro
   fila   8  Gutierrez, Amanda
            · el domicilio dice "40000010", que parece un DNI
```

Este paso es el que más impresiona y **es Python puro, sin navegador**: `csv`, `re`, `datetime`,
diccionarios y `if`. Todo lo que ya vieron o van a ver. Que se den cuenta de eso es media clase.

**3. `python bot.py --lento`** — el navegador llenando los campos solo. Acá **no expliques nada**.
Se ve. Callarse y dejar que miren es más efectivo que cualquier cosa que uno diga encima.

**4. Recién ahora, el nombre:** se llama Playwright, es una biblioteca de Python, y hace lo mismo
que harías vos con el mouse.

## A.3 Las tres ideas que se tienen que llevar

Si se llevan estas tres, la clase sirvió. Si se llevan cómo se instala Playwright, no.

### 💡 Idea 1 — Un bot no arregla un proceso malo: lo acelera

Es la frase de la clase. Si el bot cargara los datos sucios tal cual, **ensuciaría el sistema del
Ministerio a 40 registros por minuto en vez de a uno por minuto**.

> **Pregunta para el grupo:** *"Si el bot carga la fecha 13/10/2072 en el sistema del Ministerio,
> ¿de quién es la culpa: del que llenó el formulario o del que programó el bot?"*

No hay respuesta correcta y por eso funciona. Lo que tiene que quedar: **el que automatiza se hace
responsable de lo que automatiza**.

### 💡 Idea 2 — Hay una frontera entre lo que hace la máquina y lo que decide una persona

El bot deja a todos como **pre inscriptos**, un estado reversible: tiene un tachito al lado. El
botón **"Generar matrícula inicial"** no lo toca nunca.

> **El bot no decide, tipea.**

Que vean que esa frontera **está en el código**, escrita a propósito, y que fue una decisión de
diseño y no una limitación técnica.

### 💡 Idea 3 — Antes de tocar el sistema real, se practica en una copia

Mostrar el simulador y decir por qué existe: para poder equivocarse sin consecuencias, para no
necesitar la contraseña de nadie, y para poder mostrarlo sin exponer datos de personas.

> **Pregunta:** *"¿Qué pasaría si probamos el bot a medio hacer contra el sistema del Ministerio?"*

(Quedan registros basura que alguien tiene que borrar a mano, uno por uno.)

## A.4 El puente al proyecto

Cerrar mostrando **el Excel al lado del sistema**, que es la comparación que más les va a servir:

| Hoy: la planilla de Google + el Excel | Con el sistema |
|---|---|
| Los datos se escriben una vez en el formulario y **se vuelven a escribir a mano** en el SiGeS | Se escriben una vez |
| La asistencia se lleva en un Excel con fórmulas que **se rompen al borrar una celda** | Los datos y las cuentas están separados |
| Cada mes hay que **rehacer la planilla oficial** | Se genera sola desde los datos cargados |
| Está en **una** computadora | Entra cualquiera que tenga permiso |
| No hay forma de saber **quién cambió qué** | El sistema lo puede registrar |

Y la frase que conecta todo:

> "Este bot y ese sistema son el mismo proyecto. El sistema junta los datos bien; el bot los lleva
> a donde tienen que ir. Y los dos los vamos a escribir nosotros."

---

# Parte B — Construir el bot (2 clases, noviembre)

Va **después** de Playwright como herramienta de testing E2E (18/11 y 25/11 en el plan). Ese orden
no es casual: primero Playwright para *probar* lo propio, después para *manejar* lo ajeno. Es más
fácil aceptar "esto controla un navegador" cuando ya lo usaron para verificar su propia app.

## B.1 Requisitos previos

| Ya tienen que tener | Se usa para |
|---|---|
| Archivos y CSV | Leer la planilla |
| Diccionarios y listas | Cada persona es un diccionario |
| Funciones | Una por cada control |
| `if` / `for` | Todo |
| pytest | Probar el normalizador sin abrir el navegador |

**No hace falta POO** para el bot. Se puede hacer entero con funciones, y así conviene.

## B.2 Clase 1 — El normalizador (sin navegador)

Toda la clase en Python puro. **No se abre un navegador hasta la clase siguiente**, y eso es a
propósito: la parte difícil no es manejar el navegador, es decidir qué datos están bien.

1. **Leer el CSV** y mostrar los primeros. Con `csv.DictReader`, tres líneas.
2. **Buscar la basura entre todos.** Proyectar los datos y que la encuentren ellos. Van a
   encontrar más de la que uno espera; ahí sale sola la idea de "controlar antes de cargar".
3. **Una función por control**, repartidas entre los alumnos:
   - `normalizar_nacionalidad` — que las cuatro formas queden en una
   - `normalizar_dni` — solo dígitos, 7 u 8
   - `normalizar_celular` — sin el 0 y sin el 15
   - `normalizar_fecha` — que exista, que no sea futura, que dé una edad razonable
   - `partir_direccion` — separar calle y altura
4. **Un test por función** (ya vieron pytest). Acá el ejercicio de "escribí el test que atrapa el
   bug" se vuelve real: *¿tu test atrapa la fecha del 2072?*
5. **Juntar todo** e imprimir el informe de listos y frenados.

**Cierre:** *"Todavía no cargamos nada, y ya hicimos la parte que importa."*

## B.3 Clase 2 — El navegador

1. **Playwright en tres líneas**: abrir, escribir en un campo, hacer clic. Contra el simulador.
2. **Que rompan el simulador a propósito**: cambiarle el `id` a un campo y ver el error del bot.
   De ahí sale por qué conviene buscar por el **rótulo** y no por el identificador — el rótulo es
   lo que ve una persona, y es lo que menos cambia.
3. **Armar el ciclo**: para cada persona, llenar y guardar.
4. **Los frenos**, y que los escriban ellos: la confirmación escrita, no tocar "Generar matrícula".
5. **Correrlo entero** y ver la tabla llenarse.

**Cierre:** ponerlo contra el SiGeS real **con un solo alumno de prueba**, con vos logueado y todo
el grupo mirando. Ese momento —ver el sistema del Ministerio llenándose solo— es probablemente el
recuerdo que se llevan del año.

## B.4 Lo que hay que decir sí o sí

Antes de que alguien lo pregunte, y mejor si sale de vos:

> "Esto se puede usar para el trabajo del CFP, con nuestros datos y nuestro permiso. La misma
> herramienta, apuntada a un sistema que no es tuyo o con datos que no son tuyos, ya es otra cosa.
> La diferencia no está en el código: está en para qué lo usás."

Es una conversación de cinco minutos y es de las más importantes del año.

---

## Mejoras que se me ocurren para más adelante

Ordenadas por lo que rinden. Ninguna es urgente.

| | Qué | Por qué |
|---|---|---|
| 1 | **Agregar las preguntas faltantes al formulario de inscripción** (vivienda, transporte) | Es la solución de fondo: el dato lo da quien lo sabe, y el bot deja de inventar. Además es lo que charlaste con la preceptora. |
| 2 | **Que el bot saque una captura de cada carga** | Queda constancia de qué se cargó y cuándo. Con Playwright es una línea, y es lo que convierte al bot en algo auditable. |
| 3 | **Un informe en CSV de lo que se cargó** | Para poder comparar contra la planilla y detectar faltantes. |
| 4 | **Que el sistema de asistencias exporte el CSV que come el bot** | Ahí los dos proyectos se enchufan y dejan de ser dos. |
| 5 | **Reintentar los que fallaron** | Si el SiGeS se cae a mitad de camino, hoy hay que empezar de nuevo a mano. |
| 6 | **Detectar duplicados antes de cargar** | En la planilla real hay dos filas con el mismo celular. |
| 7 | Formulario propio en el sistema en vez de Google Forms | Se acaba el exportar/importar. Va con Flask. |
