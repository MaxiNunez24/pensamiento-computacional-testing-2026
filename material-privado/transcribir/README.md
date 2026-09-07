# Transcribir las entrevistas

Convierte los audios de las entrevistas en texto **con las marcas metidas en su
minuto**, para no tener que escuchar tres horas de nuevo.

---

## 1. Instalación (una vez)

```bash
pip install -r material-privado/transcribir/requirements.txt
```

```bash
winget install Gyan.FFmpeg
```

**El segundo no es opcional.** ffmpeg es lo que sabe abrir el `.webm` que graba
el navegador, y no viene con pip. Si el script falla al abrir el audio, empezar
por ahí — el error no menciona a ffmpeg por ningún lado.

> La primera corrida baja el modelo (`large-v3` son unos 3 GB). Después queda
> cacheado y no se vuelve a bajar.

---

## 2. Correrlo

```bash
python material-privado/transcribir/transcribir.py preceptoria.webm --marcas marcas.txt --seccion "Preceptoría"
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
