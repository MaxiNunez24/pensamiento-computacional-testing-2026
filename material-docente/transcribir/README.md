# Transcribir las entrevistas

Convierte los audios de las entrevistas en texto **con las marcas metidas en su
minuto**, para no tener que escuchar tres horas de nuevo.

> **¿Primera vez?** Empezá por **[PASO-A-PASO.md](PASO-A-PASO.md)**: va desde
> sacar los audios del celular hasta la primera corrida. Este README es la
> referencia del script, no el camino.

---

## 1. Instalación (una vez)

```bash
pip install -r material-docente/transcribir/requirements.txt
```

Y nada más. **No hace falta instalar ffmpeg**: faster-whisper 1.x decodifica con
PyAV, que trae las librerías de ffmpeg adentro. Verificado generando un
`.webm/opus` como el que graba el navegador y abriéndolo con ffmpeg **no**
instalado en el sistema.

> ⚠️ **Ojo con cuál `python`.** En esta máquina hay dos Python 3.14 distintos, y
> faster-whisper quedó instalado en uno solo:
>
> | Comando | Intérprete | ¿Tiene faster-whisper? |
> |---|---|---|
> | `python` | `C:\Python314\python.exe` | ✅ sí |
> | `python3` | `...\pythoncore-3.14-64\python.exe` | ❌ no |
>
> Usar siempre **`python`**. Con `python3` va a decir que falta el módulo, y el
> error no da ninguna pista de que el problema es el intérprete.

> La primera corrida baja el modelo (`large-v3` son unos 3 GB). Después queda
> cacheado y no se vuelve a bajar.

### Con la placa de video (recomendado en esta máquina)

```bash
python -m venv material-docente/transcribir/.venv
material-docente/transcribir/.venv/Scripts/python -m pip install -r material-docente/transcribir/requirements-gpu.txt
```

Trae, además, **cuBLAS y cuDNN como paquetes de Python** (~1,2 GB): sin CUDA
Toolkit, sin administrador y sin tocar el PATH del sistema. Va en un entorno
virtual en D: para no cargar C:, y se deshace borrando la carpeta `.venv`, que
el repo ya ignora.

Desde ahí, **el comando es con el Python del entorno** en vez de `python`:

```bash
material-docente/transcribir/.venv/Scripts/python material-docente/transcribir/transcribir.py audio.webm
```

Tiene que decir `intentando con GPU (float16)` y **no** seguir con
`la placa no pudo`.

**Medido el 6/10:** una clase de 35 minutos con `large-v3` tardó **5 minutos,
contando la primera descarga del modelo** (3 GB). En CPU, con el modelo `small`,
que es mucho peor, eran 12.

> 👻 `large-v3` a veces **rellena los silencios repitiendo una frase**: en esa
> prueba, "Vamos a ver" diez veces seguidas, una por segundo. Si ves una racha
> así, no es algo que se dijo.

> ⚠️ **Por qué antes "andaba" y no andaba.** Construir el modelo en `cuda`
> funciona aunque falten las librerías: lo único que comprueba es que exista una
> placa. La cuenta real pasa después y muere con
> `Library cublas64_12.dll is not found`. Y aun con los paquetes instalados pasa
> lo mismo si Windows no sabe dónde quedaron las DLL: de eso se encarga
> `_sumar_dlls_de_nvidia()` en `transcribir.py`.

---

## 2. Correrlo

```bash
python material-docente/transcribir/transcribir.py preceptoria.webm --marcas marcas.txt --seccion "Preceptoría"
```

Deja un `preceptoria.md` al lado del audio.

| Bandera | Para qué |
|---|---|
| `--marcas` | El `.txt` que sale de **📋 Copiar todas las marcas** del kit |
| `--seccion` | Si ese `.txt` trae las tres entrevistas, se queda solo con una |
| `--modelo` | `large-v3` (por defecto, el mejor) · `medium` · `small` (más rápido) |

Sin `--marcas` transcribe igual, solo que sin el índice.

---

## 3. Qué sale

```
[00:50] Bueno, primero me llega la planilla del instructor.
[00:58] Y ahí tengo que pasarla a la de secretaría, que es otra.

┌─ 🔖 00:59 · proceso de la planilla  (Guada)
└─ 🔖 01:01 · la planilla  (Rodolfo)
   ↑ 2 personas marcaron este momento

[02:40] Los datos que nos piden son el DNI, el nombre y las horas.
```

**Primero la frase, después la marca.** Al revés se lee la señal antes de lo que
la motivó, que es justo lo contrario de lo que uno quiere al releer.

Y cuando dos personas marcaron el mismo momento **quedan agrupadas y se avisa**.
Eso no lo dice ninguna marca suelta: es la señal más barata de "acá pasó algo
importante", y sale gratis de ordenar por tiempo.

---

## 4. Lo que hay que saber antes de citar nada

**La transcripción se equivoca, y se equivoca justo donde más duele.** Los
nombres propios y el vocabulario del CFP —SiGeS, matrícula, preceptoría, horas
cátedra, pre inscripto— son las palabras que peor salen, porque son las que el
modelo menos vio.

Antes de llevar una frase a la reunión del miércoles, **escuchar ese minuto**.
Para eso están las marcas: el audio se abre en el kit y se toca la marca.

> Y si aparece una palabra rara repetida, casi seguro es un término del CFP mal
> entendido. Esos son justamente los que van al glosario.

---

## 5. Los audios no se suben al repo

El repositorio es público. Los audios son personal del CFP hablando de su
trabajo, y los `.md` que salen de acá tienen lo mismo en texto.

Dejarlos fuera de la carpeta del proyecto, o en una carpeta ignorada.
