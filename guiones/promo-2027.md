# 🎬 Video de promoción 2027 — Usuaria/o de IA generativa y Programación Web

Borrador del 18/11/2026. Tiene que estar listo el **viernes 20/11**, para que se comparta en las
redes antes de las inscripciones (1 al 4/12).

| | |
|---|---|
| **Formato** | Vertical 1080 × 1920, para Reels de Instagram (y para pasar por WhatsApp) |
| **Duración** | Alrededor de 1 minuto (este guion da unos 65 s) |
| **Hecho con** | El motor de animaciones: graba a MP4 vertical, con música y subtítulos |
| **Voz** | Voice-over de Maxi, grabado encima. De respaldo, la voz de Piper que trae el motor |
| **Subtítulos** | **Siempre en pantalla.** En Instagram la mayoría lo mira sin sonido |
| **Música** | Pegadiza, de 100 a 120 BPM. Los cambios de escena caen en el golpe |

**Decidido el 19/11 (a la madrugada):**
- **Motor + HyperFrames**: el motor anima las escenas y HyperFrames las une con transiciones con shaders, texto cinético y música. El plan detallado (la grilla de golpes y el vocabulario de transiciones) está en la conversación del 18-19/11, y el prototipo, en `material-docente/videos/promo-2027/`.
- **Un solo gancho:** *"Esto lo hizo alguien que en marzo no sabía programar"*. El de *"¿Cuánto tardás en hacer la página de tu negocio?"* se probó y se sacó el 19/11, porque no se entendía.
- **Nada de fotos de la Expo:** van trabajos terminados (catálogos, páginas del curso). Maxi los manda.
- **Al cierre va la encuesta de horarios:** *"Si te interesa, ayudanos completando esta encuesta para saber tu disponibilidad horaria"*.
- **El logo del CFP** solo lo tiene en baja calidad: lo manda y se ve si se puede mejorar.
- **La música:** *Glitch Hop*, de The_Mountain (Pixabay), desde su último drop. Hay una segunda versión con *Standard Glitch Hop 02*, de vjgalaxy. `armar-version.py` arma cualquiera de las dos.

**Cómo quedó armado (19/11), en golpes de la música** (130 BPM: un golpe dura 0,46 s; 128 golpes son 59 s):

| Golpes | Escena | Transición de entrada |
|---|---|---|
| 0 – 8 | Gancho: el catálogo en el celular y "Esto lo hizo alguien que en marzo no sabía programar" | — |
| 8 – 16 | Desde cero (motor): el contador baja a 0 y se apila DESDE LA BASE | glitch (el drop) |
| 16 – 20 | PARTE 1 · IA generativa | destello |
| 20 – 36 | La IA por dentro (motor): tokens, atención y la respuesta de a poco | zoom |
| 36 – 48 | Pedirle bien las cosas (ChatGPT, Gemini, Claude) · crear textos e imágenes · darte cuenta cuándo se equivoca | paneo rápido |
| 48 – 52 | PARTE 2 · WEB programación | glitch |
| 52 – 68 | De etiquetas a página publicada (motor) | zoom |
| 68 – 84 | Hecho este año en el curso: tres celulares con trabajos (**provisorio**) | paneo rápido |
| 84 – 96 | El giro: todo era una animación dentro de una lección · "Las clases son así" | separación de color |
| 96 – 128 | Cierre: el nombre del curso, inscripción, requisitos y la encuesta con QR | destello |

**La voz (grabada el 26/11).** Doce archivos en `material-docente/videos/promo-2027/voz/` (no se
suben). `armar-version.py` los pone en su golpe, los limpia y baja la música mientras habla: sale
`hf/renders/glitch-hop-voz.mp4`. Para que entraran las tres últimas frases, el cierre se estiró:
**El curso 116 – 128, Inscripción 128 – 144, Encuesta 144 – 164** (el video pasa a 164 golpes, 1:16).

| # | Golpe | Texto grabado |
|---|---|---|
| 00 | 0 | Esto lo hicieron alumnos que en marzo no sabían programar. *(27/11: con "alguien" parecía que el que no sabía era el instructor; y en el celular va el catálogo real de Bambú, no uno inventado)* |
| 01 | 8 | No hace falta saber nada: arrancamos desde la base. |
| 02 | 16 | Primero, inteligencia artificial. |
| 03 | 20 | Vas a entender cómo funciona por dentro: cómo parte lo que le pedís en pedacitos, en qué se fija y cómo arma la respuesta. |
| 04 | 40 | A pedirle bien las cosas, a crear textos e imágenes, y a darte cuenta cuándo se equivoca. |
| 05 | 60 | Después, la web. |
| 06 | 64 | Armás páginas de verdad, con tu diseño y tus productos, y las publicás en internet. |
| 07 | 88 | Este año armamos catálogos para emprendimientos de la zona, y hasta el Bingo de la Expo. |
| 08 | 104 | Y las clases son así: con ejercicios que se corrigen solos, y animadas como este video. |
| 09 | 116 | Usuaria o usuario de IA generativa y Programación Web, en el CFP 401. |
| 10 | 128 | Inscripciones del 1 al 4 de diciembre. El viernes 4 estoy yo para inscribirte y responder tus dudas. |
| 11 | 144 | Y si te interesa, por favor completá la encuesta de horarios: tarda un minuto. Te esperamos el viernes 4 en las inscripciones. |

**La idea que lo ordena:** el video **es** una clase animada. Al final se revela que está hecho con
el mismo motor de las clases, y eso es la prueba de lo que promete.

---

## 1. El gancho (0:00 – 0:04)

*(En pantalla: un celular. En un chat se tipea solo: "Haceme la página de mi emprendimiento".
Al mandar, la página se arma sola dentro del celular, pieza por pieza, al ritmo de la música.)*

> ¿Y si la compu hiciera lo que le pedís?

**Texto en pantalla:** ¿Y si la compu hiciera lo que le pedís?

## 2. Desde cero (0:04 – 0:11)

*(Un contador grande que baja hasta 0. Debajo aparece: "conocimientos previos".)*

> No hace falta saber nada. Ni programar, ni saber mucho de computadoras. Arrancamos desde la base.

**Texto en pantalla:** 0 conocimientos previos · Desde la base

## 3. Primero, la inteligencia artificial (0:11 – 0:29)

*(Una frase se parte en pedacitos, que son los tokens. Unas flechas van y vienen entre ellos, la
atención, y la respuesta sale palabra por palabra. Después, burbujas de chat con los nombres
ChatGPT, Gemini y Claude, solo en texto y sin logos. Aparece una imagen que se arma sola, y un
cartel ⚠️ que tacha un dato inventado.)*

> Primero, la inteligencia artificial. Cómo pedirle bien las cosas, crear textos e imágenes para tu
> trabajo o tu emprendimiento, y darte cuenta cuándo se equivoca. Y la vas a entender por dentro:
> cómo hace para responder.

**Texto en pantalla:** Parte 1 · IA generativa → pedir bien · crear · detectar errores

## 4. Después, la web (0:29 – 0:46)

*(Unas etiquetas `<h1>`, `<p>` e `<img>` caen dentro del celular y se convierten en una página con
productos y precios. Arriba aparece una dirección web, y un ✓ "Publicada".)*

> Después, con esa ayuda, armás páginas web de verdad: con tu diseño, tus productos, y publicadas en
> internet, para que cualquiera las abra desde el celular.

**Texto en pantalla:** Parte 2 · Programación Web → diseñar · armar · publicar

## 5. La prueba (0:46 – 0:54)

*(Fotos y clips reales de la Expo: el stand y los catálogos en los celulares. Los alumnos firmaron
el permiso para fotos y videos, pero en pantalla van sin nombres.)*

> Este año, el curso armó catálogos para emprendimientos de Ensenada y los mostró en la Expo.

**Texto en pantalla:** Expo 2026 · catálogos de emprendimientos reales

## 6. El giro (0:54 – 1:00)

*(La cámara se aleja: todo lo que se vio estaba adentro de una lección de la plataforma, y al lado
hay un ejercicio que se pone en ✓ Resuelto.)*

> Y las clases son así: animadas, como este video.

**Texto en pantalla:** Las clases son así

## 7. Cierre e inscripción (1:00 – 1:06)

*(El nombre del curso grande, el CFP 401, y los datos de la inscripción. Este cuadro queda quieto
un par de segundos, para quien quiera sacarle captura.)*

> Usuaria o usuario de IA generativa y Programación Web. En el CFP 401. Inscripciones del 1 al 4 de
> diciembre. Te esperamos.

**Texto en pantalla:**
- **Usuaria/o de IA generativa y Programación Web**
- CFP 401 · curso anual · desde cero
- Inscripciones: 1 al 4 de diciembre
- Mayores de 16 · 2 fotocopias del DNI

---

## Para grabarlo

1. La escena se escribe con el motor (`Motor.registrar`, con un ancho de 1080 y un alto de 1920),
   en `material-docente/videos/promo-2027/`. No se toca el repo del motor: solo se usa.
2. Se graba con el `npm run video` del motor, con `--ancho 1080 --alto 1920`. Graba cuadro por
   cuadro, así que sale fluido aunque la compu sea lenta.
3. **Primero el voice-over, después la animación.** Se graba la voz, se mide cuánto dura cada
   tramo, y la línea de tiempo se ajusta a esa voz. Al revés, hay que hablar apurado.
4. **Música:**
   - Si va metida en el MP4, que sirve también para WhatsApp: una pista libre de Pixabay Music,
     que no pide atribución. El motor la baja sola cuando habla la voz.
   - Si se publica solo en Instagram, se puede usar un audio de la biblioteca de la app. Pero
     entonces el MP4 sale sin música, para que no suenen dos.
