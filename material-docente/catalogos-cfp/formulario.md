# Catálogos para todo el CFP: el formulario y la planilla

Todo lo necesario para armar el formulario de Google y su planilla. El programa que genera los
catálogos (`plantilla-repo/generar.py`) busca las columnas **por su título**: si cambiás el texto
de una pregunta, cambialo también ahí. Los títulos que el programa necesita están en `código`.

---

## 1. El formulario

**Título:** Tu catálogo gratis · CFP 401
**Descripción:**

> El curso de Pensamiento Computacional del CFP 401 te arma **gratis un catálogo en internet** para
> tu emprendimiento: una página con tus productos, sus fotos y precios, y un botón para que te
> escriban por WhatsApp. Completá este formulario y, cuando lo revisemos, te avisamos con el link y
> un código QR para compartir. Tarda unos 10 minutos: tené a mano las fotos de tus productos.

### Sección 1 · Tu emprendimiento

| Pregunta (título exacto) | Tipo | Obligatoria | Ayuda / validación |
|---|---|---|---|
| `Nombre del emprendimiento` | Respuesta corta | ✅ | Tal cual querés que aparezca. |
| `Rubro` | Respuesta corta | ✅ | En dos o tres palabras: "Dulces caseros", "Tejidos a mano". Validación: longitud máxima 40. |
| `Contanos qué hacés` | Párrafo | — | Una o dos oraciones, aparecen debajo del nombre. Validación: longitud máxima 150. |
| `Logo` | Subir archivo | — | Solo imágenes, 1 archivo, hasta 10 MB. Si no tenés, el nombre va escrito con una letra linda. |
| `Un emoji que lo represente` | Respuesta corta | — | Por ejemplo 🍯 🧶 🕯️. Se usa en los productos que no tienen foto. Validación: longitud máxima 4. |
| `WhatsApp para consultas` | Respuesta corta | ✅ | **Característica sin el 0 y número sin el 15**, sin espacios ni guiones: un 0221 15 555-0000 se escribe 2215550000. Validación: expresión regular, coincide con `^\d{10}$`, mensaje: "Son 10 números: la característica sin el 0 y el número sin el 15". |
| `Instagram` | Respuesta corta | — | Solo el usuario, sin la @. |
| `Estilo del catálogo` | Opción múltiple | ✅ | Opciones (exactas): **Natural** (verde y rosa viejo) · **Dulce** (rosa y bordó) · **Mar** (celeste y azul) · **Elegante** (negro y dorado) · **Alegre** (naranja y amarillo). |

### Secciones 2 a 13 · Producto 1 a Producto 12

Una sección por producto. **Armá la del Producto 1 y después usá "Duplicar sección"** (los tres
puntitos de la sección) y cambiale el número a cada pregunta. El número va en el título porque la
planilla tiene una columna por pregunta, y si se repiten los títulos no se sabe cuál es cuál.

| Pregunta (título exacto, con el número de la sección) | Tipo | Obligatoria | Ayuda / validación |
|---|---|---|---|
| `Producto 1 · Nombre` | Respuesta corta | ✅ | |
| `Producto 1 · Precio` | Respuesta corta | — | Solo el número, sin $ ni puntos: 4500. **Vacío = "Consultar".** Validación: número, mayor que 0. |
| `Producto 1 · Descripción` | Párrafo | — | Una oración. Validación: longitud máxima 120. |
| `Producto 1 · Foto` | Subir archivo | — | Solo imágenes, 1 archivo, hasta 10 MB. Mejor de cerca y con buena luz. |
| `Producto 1 · ¿Agregás otro?` | Opción múltiple | ✅ | Opciones: **Sí** / **No**. Activá **"Ir a la sección según la respuesta"**: Sí → Producto 2, No → *Sobre vos*. |

La sección del **Producto 12** no lleva la última pregunta: va directo a *Sobre vos* (en "Después de
la sección 13", elegí *Sobre vos*).

### Sección 14 · Sobre vos (no se publica)

> Esto es solo para avisarte cuando esté publicado. **No aparece en el catálogo.**

| Pregunta | Tipo | Obligatoria |
|---|---|---|
| `Nombre y apellido` | Respuesta corta | ✅ |
| `¿En qué curso del CFP estás?` | Respuesta corta (o desplegable con los cursos) | ✅ |

### Sección 15 · Antes de enviar

`Conformidad` · Casillas de verificación · Obligatoria · Validación: **"Seleccionar exactamente 3"**,
mensaje: "Hay que tildar las tres para poder publicarlo".

- Acepto que los datos del emprendimiento (nombre, productos, fotos, precios, WhatsApp e Instagram)
  se publiquen en internet en un catálogo del CFP 401. Mi nombre y mi curso no se publican.
- Las fotos son mías o tengo permiso para usarlas.
- Entiendo que alguien del CFP lo revisa antes de publicarlo, y que puedo pedir que lo den de baja
  cuando quiera.

### Configuración (el engranaje ⚙️)

- **Respuestas → Recopilar direcciones de correo electrónico: Verificadas.** Sirve para avisarles,
  y Google lo pide igual para poder subir archivos.
- **Respuestas → Permitir que se editen las respuestas: NO.** Si alguien quiere cambiar algo,
  completa el formulario de nuevo (ver "Cambios" más abajo).
- **Respuestas → Limitar a 1 respuesta: NO** (una persona puede tener dos emprendimientos).
- **Respuestas → Vincular con Hojas de cálculo:** crear una planilla nueva.

> Los archivos quedan en el Drive de quien creó el formulario, en una carpeta "Tu catálogo gratis
> · CFP 401 (File responses)". Conviene crearlo desde una cuenta del CFP, no personal.

---

## 2. La planilla

Google la arma sola, con una columna por pregunta (en el orden del formulario), más **Marca
temporal** y **Dirección de correo electrónico** al principio. Hay que agregarle **a mano, a la
derecha de todo**, tres columnas para la revisión:

| Columna (título exacto) | Qué es | Cómo se arma |
|---|---|---|
| `Aprobado` | Si se publica | Insertar → **Casilla de verificación** en toda la columna |
| `Revisó` | Quién lo aprobó | Texto: el nombre de quien revisó |
| `Observaciones` | Lo que haya que pedirle o avisarle | Texto |

**Compartila como Editor** con quienes pueden aprobar (preceptores, instructores). Para
aprobar, alcanza con tildar la casilla y poner tu nombre en *Revisó*.

En `respuestas-ejemplo.xlsx` hay una planilla de ejemplo, con las columnas exactas y datos
inventados, para probar el programa sin el formulario de verdad.

---

## 3. ¿Qué es aprobar un catálogo?

Aprobar **no es corregir**: es su catálogo, con sus palabras y sus fotos. Es revisar que se pueda
publicar en nombre del CFP. Una propuesta para discutir con los directivos:

**Se aprueba si:**

1. Es un emprendimiento de **un o una estudiante del CFP** (lo dice *Sobre vos*).
2. Las tres casillas de **Conformidad** están tildadas.
3. Lo que vende es algo que **se podría ofrecer en la cartelera del CFP**.
4. Las **fotos** muestran productos. Si aparecen personas, que sean adultas y la propia
   emprendedora o el propio emprendedor.
5. No hay **datos personales de más** en descripciones o fotos (direcciones, DNI, otros teléfonos).
6. El **WhatsApp** tiene 10 números (el formulario ya lo controla).

**No se toca:** la ortografía, los precios, el estilo elegido. Si algo no se puede aprobar, se anota
en *Observaciones* y se le escribe al correo de la respuesta.

**Después de publicado:** a la hora, como mucho, ya está en internet. Quien aprobó **abre el link y
escanea el QR** para confirmar que anda, y le avisa a la persona.

### Cambios y bajas

- **Cambiar algo** (un precio, un producto nuevo): la persona completa el formulario de nuevo, con el
  **mismo nombre de emprendimiento**. Hasta que se apruebe la respuesta nueva, sigue publicado el de
  antes. Cuando se aprueba, la nueva reemplaza a la vieja.
- **Darlo de baja:** se destilda *Aprobado* en todas sus respuestas. En la próxima publicación,
  desaparece.
