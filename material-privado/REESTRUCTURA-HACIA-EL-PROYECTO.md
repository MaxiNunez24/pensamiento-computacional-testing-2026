# Reestructurar el curso hacia el proyecto

> Escrito el 27/8/2026. Cómo pasar de "ejercicios sueltos que no llevan a nada" a "cada ejercicio
> es una pieza del sistema", y cómo repartir el trabajo entre seis personas sin que las faltas
> arruinen nada.

---

## 1. Dónde arranca el cambio, y por qué ahí

**Desde POO (9/9). Ni antes ni después.**

Antes no conviene: `print`, variables, condicionales, listas y bucles son **el alfabeto**. Un
ejercicio de `print` dirigido al proyecto ("mostrá el encabezado de la planilla") es peor que uno
neutro, porque el contexto agrega ruido a algo que todavía cuesta.

Después es tarde: POO es donde aparecen `Alumno` y `Curso`, y si esas clases nacen como ejemplos
de juguete —el clásico `class Perro` con `ladrar()`— después hay que tirarlas y empezar de nuevo.

> 📌 **La bisagra es el 23/9**, la clase "Del prototipo al modelo". Ahí se decide entre todos qué
> clases necesita el sistema. Todo lo anterior prepara ese momento; todo lo posterior lo usa.

---

## 2. Qué pasa con los ejercicios que ya existen

**Nada. No se tira nada.** Hay 168 ejercicios repartidos en 27 clases y son buenos.

Lo que cambia es **cuáles se marcan como obligatorios** y cuáles quedan como práctica opcional:

| Clase | Ejercicios | Qué se hace |
|---|---|---|
| `print`, `variables`, `input`, `condicionales`, `listas`, `bucles` | 58 | **Se quedan como están.** Son el alfabeto y ya están en la puesta al día. |
| `cuadernillo-listas`, `repaso`, `lectura-codigo` | 34 | Pasan a **práctica opcional**. Sirven para el que quiere más. |
| `tuplas`, `sets`, `diccionarios` | 14 | **Se re-dirigen**: los mismos conceptos con datos del sistema. Un diccionario que guarda asistencia enseña lo mismo que uno que guarda capitales, y de paso construye. |
| `funciones-1`, `funciones-2` | 14 | **Se re-dirigen**: cada función que escriban es una función del sistema. |
| `poo-1`, `poo-2` | 9 | **Se reescriben apuntando al proyecto**: `Alumno` y `Curso` en vez de `Perro` y `Gato`. |
| `poo-herencia` | 6 | **Queda como material optativo.** Se cae del plan (ver PLAN-CLASES-RESTANTES). |
| `archivos`, `json` | 10 | **Se re-dirigen**: guardar y leer *los datos del sistema*. |
| `logica-*`, `testing-1`, `bingo`, `git-vscode` | 23 | Se quedan como están. Son método y herramientas, no dominio. |

**Traducido: hay que reescribir ~37 ejercicios y crear los de las etapas nuevas.** No es poco,
pero no es empezar de cero, y se puede hacer clase por clase, una semana antes de darla.

---

## 3. Cómo se ve un ejercicio "dirigido al proyecto"

No es ponerle nombres del CFP a un ejercicio cualquiera. La diferencia es que **lo que escriben
queda**.

### Antes

> Escribí una función que reciba una lista de números y devuelva el promedio.

### Después

> Escribí `porcentaje_asistencia(marcas)`. Recibe la lista de marcas de un alumno
> (`["P", "A", "P", "T"]`) y devuelve qué porcentaje vino. **Esta función va a estar en el
> sistema**: es la que calcula la columna de la planilla.

Se enseña lo mismo. Pero la segunda tiene tres cosas que la primera no:

1. **Un nombre que va a existir de verdad.**
2. **Una regla del negocio para discutir**: ¿el que llegó tarde vino? *(sí — y no lo decide el
   programador, lo decide el CFP)*.
3. **Un destino.** Cuando esté, se copia al sistema.

---

## 4. La página donde se juntan las soluciones

Esto es lo que pediste y es la pieza que hace que todo lo demás funcione.

### Cómo funcionaría

1. Cada alumno resuelve el ejercicio en la plataforma, como siempre.
2. La solución **ya está guardada** (`pcp:code:<ruta>::<título>`) y **ya se sincroniza** con el
   Worker. **La infraestructura existe**: no hay que construir nada nuevo para juntarlas.
3. Una página del curso pide al Worker las soluciones de *ese ejercicio* de *todos los códigos*, y
   las muestra **una al lado de la otra**.
4. En clase se comparan y **se vota cuál va al sistema**.

### La decisión que tenés que tomar

⚠️ **¿Las soluciones se muestran con nombre o anónimas?**

| | A favor | En contra |
|---|---|---|
| **Con nombre** | Reconoce a quien la escribió; se puede preguntarle | Expone a quien la tiene mal, delante de todos |
| **Anónimas** | Se discute el código y no la persona | Nadie se lleva el crédito |

**Mi recomendación: anónimas para comparar, y el nombre se revela recién cuando se elige una.**
Así la discusión es sobre el código, pero el reconocimiento existe. Y para el que va atrasado,
saber que su intento entra sin su nombre baja muchísimo la barrera para mandarlo.

### Lo que hay que construir

Del lado del Worker hace falta un endpoint nuevo (`GET /soluciones?ejercicio=...`) que junte lo de
todos los códigos. **Es media hora**, pero abre una puerta que hoy está cerrada: hasta ahora cada
código solo puede leer *sus* datos. Hay que decidirlo a propósito, no de casualidad.

---

## 5. Cómo repartir el trabajo entre seis

Esta era la parte que te preocupaba. La respuesta corta: **no se reparte por partes del sistema.**

### Por qué no funciona "cada uno hace un módulo"

Es lo primero que uno piensa y es lo que más falla en un curso:

- El que agarró la parte difícil se traba y **frena a todos**.
- El que falta dos clases vuelve y **su parte no existe**.
- Al final hay seis piezas que **no encajan** y alguien (vos) las tiene que unir.
- Y cada uno aprendió **una sexta parte** del sistema.

### Lo que sí funciona: todos hacen lo mismo, y se elige

**Todos resuelven el mismo ejercicio.** Después se comparan las soluciones y **se elige una**, que
es la que va al sistema.

| Ventaja | Por qué |
|---|---|
| **Nadie bloquea a nadie** | Si uno no lo hizo, se usa el de otro y el sistema avanza igual |
| **Las faltas no rompen nada** | El que faltó tiene el ejercicio esperándolo, no un módulo abandonado |
| **Todos aprenden todo** | Cada uno pensó cada pieza, no una sexta parte |
| **Comparar es la mejor clase** | Ver cinco formas de resolver lo mismo enseña más que resolverlo |
| **La elección se justifica** | "Elegimos esta porque…" es una discusión de diseño real |

Y resuelve tu problema de raíz: **el sistema no depende de que nadie falte.**

### Los roles rotativos, que sí se reparten

Lo que se reparte no es el código: son **los papeles alrededor del código**, y rotan cada clase
para que todos pasen por todos:

| Rol | Qué hace ese día |
|---|---|
| 🎤 **Presenta** | Explica su solución al grupo |
| 🔍 **Revisa** | Busca un caso donde la solución elegida falle |
| 🧪 **Prueba** | Escribe el test de la pieza del día |
| 📝 **Documenta** | Anota qué se eligió y **por qué** |
| 🔗 **Integra** | Copia la solución elegida al sistema y verifica que siga andando |
| 🗺️ **Al día** | Actualiza el mapa del proyecto con lo que ya está hecho |

Son seis roles para seis personas, y **el que falta no deja un agujero**: su rol lo toma otro ese
día y vuelve a rotar la clase siguiente.

> 💡 El rol de **Integra** es el más valioso y el menos obvio: es el que se da cuenta de que la
> pieza elegida no encaja con lo anterior. En la industria eso es media ingeniería.

### Cómo se ve una clase con este esquema

```
 20 min   Se plantea la pieza del día  (¿qué tiene que hacer? ¿qué recibe? ¿qué devuelve?)
 40 min   Cada uno la resuelve en la plataforma
 25 min   Se comparan las soluciones en pantalla y se ELIGE una
 20 min   El de Integra la copia al sistema; el de Prueba le escribe el test
 15 min   Corre todo junto. Si rompe algo, se ve en el momento
```

Tres horas y veinte, que es exactamente lo que dura la clase.

---

## 6. Riesgos, y qué hacer con cada uno

| Riesgo | Mitigación |
|---|---|
| **Siempre se elige la del mismo** | Rotar quién presenta primero, y a veces elegir "la más simple de entender" en vez de "la más corta" |
| **Discutir dos horas cuál es mejor** | El profe corta a los 25 minutos. **Una solución elegida hoy vale más que la mejor solución elegida el mes que viene.** |
| **El que va atrasado no participa** | Por eso las soluciones se muestran anónimas: mandar un intento incompleto no expone |
| **El sistema queda como un Frankenstein** | El rol de Integra + el test de cada pieza. Si no encaja, se nota el mismo día |
| **Se pierde tiempo en la comparación** | Es la parte que más enseña. No es tiempo perdido: es la clase |

---

## 7. Qué hay que hacer, en orden

- [ ] **Antes del 9/9** — reescribir los ejercicios de `poo-1` y `poo-2` con `Alumno` y `Curso`.
- [ ] **Antes del 23/9** — preparar la clase "Del prototipo al modelo": es la bisagra.
- [ ] **Decidir**: ¿las soluciones se comparan con nombre o anónimas?
- [ ] **Construir** el endpoint de soluciones en el Worker (media hora) y la página que las muestra.
- [ ] **Antes de la primera clase con roles** — imprimir las seis tarjetas de rol. Que sean físicas
      y se repartan en la mesa: se rota mucho mejor que con una lista en el pizarrón.
- [ ] **Re-dirigir** `diccionarios`, `funciones-1/2`, `archivos` y `json` (~37 ejercicios), una
      clase antes de darla.
