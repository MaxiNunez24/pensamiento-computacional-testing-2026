# Del celular a la transcripción, paso a paso

Esta es la guía de la **primera vez**: sacar los audios del celular, dejarlos en
un lugar sano y correr Whisper.

El [README](README.md) de al lado es la referencia del script (qué hace cada
bandera, cómo sale el archivo). Acá está el camino completo, en orden, una sola
vez.

---

## Paso 0 — Qué hay instalado (y qué no)

Antes de instalar nada, mirá qué tenés. Abrí una terminal en la carpeta del
proyecto y corré:

```bash
python -c "import faster_whisper; print(faster_whisper.__version__)"
```

Si contesta `1.2.0`, **ya está instalado y no hay que instalar nada más**.
(Al 8/9 en esta máquina contesta eso.)

Si dice `ModuleNotFoundError`, ahí sí:

```bash
pip install -r material-privado/transcribir/requirements.txt
```

> ⚠️ **Ojo con cuál `python`.** En esta máquina hay dos Python 3.14 y
> faster-whisper quedó en uno solo. Siempre `python`, nunca `python3`.
> Con `python3` el error dice "falta el módulo" y no da ninguna pista de que el
> problema es el intérprete.

### Qué se instaló, en dos líneas

Vale la pena saberlo porque explica por qué **no hace falta instalar ffmpeg**:

| Pieza | Para qué |
|---|---|
| `faster-whisper` | El que transcribe. Es Whisper de OpenAI reimplementado para que corra rápido. |
| `ctranslate2` | El motor que hace las cuentas. Es el que usa la placa de video. |
| `PyAV` | Abre el archivo de audio. **Trae las librerías de ffmpeg adentro**, por eso no hay que instalar ffmpeg aparte. |

Ninguna manda nada a internet salvo la primera vez, para bajar el modelo.

---

## Paso 1 — Sacar los audios del celular

**Por cable USB.** No por WhatsApp, no por Drive, no por mail.

No es paranoia: son personas del CFP hablando de cómo trabajan, y les
prometimos que eso se queda en el curso. Mandarlo por WhatsApp o subirlo a Drive
es sacarlo del curso, aunque después lo borres — queda en el servidor de otro.
Por cable el archivo va del celular al disco y no pasa por ningún lado.

1. Enchufá el celular por USB.
2. En el celular va a aparecer una notificación tipo *"Cargando este
   dispositivo por USB"*. Tocala y elegí **Transferencia de archivos (MTP)**.
   Si no elegís eso, Windows lo ve pero la carpeta aparece vacía.
3. En el Explorador de Windows, *Este equipo* → el celular → *Almacenamiento
   interno*.
4. Buscá las grabaciones. Según el celular están en `Grabaciones/`,
   `Recordings/`, `Sounds/` o `Music/Recordings/`.
   Si son notas de voz de WhatsApp: `WhatsApp/Media/WhatsApp Voice Notes/`.

> Si es un iPhone, la grabadora de voz no se ve por MTP. Se pasan con el cable
> desde la app **Notas de voz** → *Compartir* → *Guardar en Archivos*, y desde
> ahí a la PC.

**Copiá, no muevas.** Dejá el original en el celular hasta que la transcripción
haya salido bien. Es la única copia que hay.

---

## Paso 2 — Dónde guardarlos

**Fuera del repositorio.** Hoy están acá:

```
E:\Ex Disco D\CFP\desarrollo_sistema_gestion_de_alumnos\interview_recordings\
```

Podría ir adentro de `material-privado/transcribir/`, porque el `.gitignore` de
esa carpeta ya ignora `*.m4a`, `*.mp3`, `*.webm` y hasta los `.md` que salen.
Pero después de lo del `datos_ejemplo.csv`, la regla que vale es otra: **lo que
no puede subirse al repo, que no esté en la carpeta del repo**. Un `.gitignore`
es una regla que puede fallar; una carpeta en otro lado no.

E: tiene 416 GB libres, así que espacio sobra.

> **Ojo con las comillas.** Esa ruta tiene espacios (`Ex Disco D`). Sin comillas
> la terminal la parte en tres argumentos y Python dice que el archivo no
> existe, que despista bastante.

### Cómo nombrarlos

```
2026-09-04_preceptoria.m4a
2026-09-04_maestra-de-apoyo.m4a
2026-09-04_instructor.m4a
marcas_2026-09-04.txt
```

Fecha adelante (así se ordenan solos) y el **rol**, no el nombre de la persona.
Es la misma regla que en `REQUERIMIENTOS-RELEVADOS.md`: lo que importa para el
sistema es que lo dijo preceptoría, no quién es.

### El archivo de marcas

Las marcas que te compartieron, pegalas tal cual en un `.txt` en esa misma
carpeta. El script entiende varios formatos:

```
0:47 - planillas
00:47  planillas
1:02:30  el tema de las horas cátedra
```

Y si el `.txt` trae las tres entrevistas separadas por encabezados, con
`--seccion "Preceptoría"` se queda solo con esa.

---

## Paso 3 — Antes de la primera corrida: dónde cae el modelo

Esto conviene decidirlo **antes**, no después de bajar 3 GB.

La primera vez que uses un modelo, se baja solo. Por defecto va a:

```
C:\Users\maxin\.cache\huggingface\hub
```

Y `C:` está al **93%**. `large-v3` pesa unos 3 GB. Entra, pero queda al filo.

Ya está resuelto: el cache vive en **`F:\cache\huggingface`**. Se hizo así:

```powershell
Move-Item "C:\Users\maxin\.cache\huggingface" "F:\cache\huggingface"
```

```powershell
[Environment]::SetEnvironmentVariable('HF_HOME','F:\cache\huggingface','User')
```

> 🚨 **Esto es lo que muerde.** `SetEnvironmentVariable` afecta a las terminales
> que se abran **de ahí en adelante**. Una ventana ya abierta sigue con el
> entorno viejo, no encuentra el cache en F:, y **vuelve a bajar el modelo a
> C:** sin avisar. Pasó de verdad: 464 MB duplicados.
>
> Después de definirla, **cerrá y abrí la terminal**. Y comprobalo:

```powershell
python -c "import huggingface_hub.constants as k; print(k.HF_HUB_CACHE)"
```

Tiene que decir `F:\cache\huggingface\hub`. Si dice `C:\Users\...`, esa
ventana todavía no tomó la variable.

---

## Paso 4 — La primera corrida

Empezá con **una** entrevista y con el modelo chico, para ver que todo el camino
funciona antes de esperar media hora:

```bash
python material-privado/transcribir/transcribir.py "E:\Ex Disco D\CFP\desarrollo_sistema_gestion_de_alumnos\interview_recordings\NOMBRE.m4a" --modelo small --cpu
```

Tendría que verse algo así:

```
Transcribiendo NOMBRE.m4a con el modelo small…
  intentando con CPU (int8) — más lento
  duración detectada: 14:59
  transcribiendo… 14:59
Listo: E:\...\NOMBRE.md
```

Las dos líneas que importan:

- **`duración detectada`** — si no coincide con lo que dura el audio de verdad,
  el archivo se copió mal.
- **`transcribiendo…`** — el contador va por el audio. Mirándolo diez segundos
  ya sabés a qué velocidad va.

Después le sumás las marcas:

```bash
python material-privado/transcribir/transcribir.py "E:\...\NOMBRE.m4a" --marcas "E:\...\marcas.txt" --seccion "Preceptoría" --cpu
```

**Cuánto tarda en CPU.** Medido: 24 segundos de audio con `small` tardaron 7
segundos de reloj, incluyendo cargar el modelo. Una entrevista de 15 minutos
sale en **2 a 4 minutos**. Con `large-v3` es bastante más lento en CPU.

### ¿Y la placa de video?

**Todavía no anda, y hace falta instalar cosas.** `ctranslate2` necesita cuBLAS
y cuDNN de CUDA 12, que en esta máquina no están: no hay CUDA Toolkit ni
paquetes `nvidia-*` en pip. El síntoma es este, y aparece **después** de
detectar la duración:

```
RuntimeError: Library cublas64_12.dll is not found or cannot be loaded
```

Sin `--cpu` el script lo intenta igual, se da cuenta y **sigue solo en CPU**.
La bandera `--cpu` sirve para saltear el intento y no esperar de gusto.

Para que la placa funcione hay que instalar `nvidia-cublas-cu12` y
`nvidia-cudnn-cu12`, que son ~1 GB y por defecto van a `site-packages` en C:.
Conviene hacerlo dentro de un entorno virtual en otro disco.

Después repetís lo mismo con los otros dos audios. Son corridas independientes:
cada una deja su `.md` al lado de su audio.

---

## Paso 5 — Revisar que las marcas cayeron en su lugar

Esto es lo único que no puedo dar por hecho, y es importante.

Las marcas que hicieron los alumnos van en minutos contados **desde que arrancó
el cronómetro del kit**. Tu audio va en minutos contados **desde que apretaste
grabar en el celular**. Si esas dos cosas no arrancaron en el mismo segundo,
todas las marcas van a caer corridas la misma cantidad.

Cómo darte cuenta, en un minuto:

1. Abrí el `.md` y buscá `🔖`.
2. Agarrá una marca que diga algo concreto — por ejemplo *"planillas
   duplicadas"*.
3. Leé el párrafo justo antes. ¿Está hablando de eso?
   - **Sí** → listo, no hay desfase. Seguí.
   - **No, pero lo dice dos minutos más arriba (o más abajo)** → hay desfase, y
     es el mismo para todas.

Si hay desfase, avisame cuántos segundos y le agrego al script una bandera
`--desfase` que corra todas las marcas de una. No lo hice todavía porque no sé
si hace falta, y si hace falta no sé para qué lado.

---

## Paso 6 — Y ahí recién, leerlo

Lo importante del archivo que sale no es el texto corrido: son los `🔖`. Ese es
el índice que hicieron ustedes en vivo. Se busca el marcador y se lee alrededor.

Y cuando dos personas marcaron el mismo momento, quedan agrupadas con un
`↑ 2 personas marcaron este momento`. Eso es la señal más barata de "acá pasó
algo": no lo dice ninguna marca sola, sale de ordenarlas por tiempo.

> **Antes de llevar una frase a la reunión, escuchá ese minuto.** La
> transcripción se equivoca justo donde más duele: SiGeS, matrícula,
> preceptoría, horas cátedra, pre inscripto. Son las palabras que el modelo
> menos vio.

---

## Si algo sale mal

| Lo que ves | Qué es |
|---|---|
| `ModuleNotFoundError: faster_whisper` | Corriste `python3`. Usá `python`. |
| `No existe: ...` | La ruta. Si tiene espacios, va entre comillas. |
| `Library cublas64_12.dll is not found` | Faltan las librerías de CUDA. El script sigue solo en CPU; con `--cpu` te ahorrás el intento. |
| Baja el modelo aunque ya lo tengas en F: | Esa terminal se abrió antes de definir `HF_HOME`. Cerrala y abrí otra. |
| Se queda en `transcribiendo… 00:00` largo rato | La primera vez está bajando el modelo. Los 3 GB no muestran barra de progreso. |
| Termina bien pero con letras raras (`Busc? ?`) | La consola de Windows es cp1252 y no sabe dibujar los acentos ni el emoji. **El `.md` sale perfecto igual**, se escribe en UTF-8 aparte. |
| Sale con muchos `[Música]` o repite frases | Hay tramos de silencio o ruido. Probá `--modelo medium`, a veces alucina menos. |

> Hasta el 8/9 esto último se caía con un `UnicodeEncodeError` **después** de
> escribir el archivo: parecía que había fallado y no había fallado nada. Ya
> está arreglado; si lo ves, el `.md` igual está.

---

## Lo que nunca sale de esta máquina

Los audios y los `.md` que salen de acá **no van al repo**, que es público, ni
se reenvían, ni se suben a ningún servicio. Whisper corre local justamente para
eso: el audio no sale de la placa de video.

Se pueden leer y proyectar **dentro del curso** — es exactamente lo que les
prometimos. Lo que no se puede es que salga del curso.
