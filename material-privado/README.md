# 🔒 Material privado (solo para el profe)

Esta carpeta **no se publica en el sitio**: MkDocs solo construye `docs/` y Astro solo
`src/content/docs/`, así que todo lo que viva acá queda fuera del sitio y del buscador.

> ⚠️ **Pero el repositorio es PÚBLICO.** "No se publica" quiere decir que no aparece en la web del
> curso, **no** que sea secreto: cualquiera que entre a github.com/MaxiNunez24/… lo lee.
> **Nada de datos personales acá**: ni nombres de alumnos, ni DNI, ni teléfonos, ni capturas de
> sistemas con datos reales. Lo que necesite ser privado de verdad va a `.gitignore`
> (como `capturas_bot/`).

---

## 📅 Todo, en el orden en que fue apareciendo

Leído de arriba a abajo, esto es la historia del año. Al final de cada entrada está **qué quedó
sin definir**, que es lo que conviene revisar.

### Junio — la plataforma

| | Documento | De qué se trata |
|---|---|---|
| **5/6** | [`cronograma-original.md`](./cronograma-original.md) | El cronograma semana a semana original, de antes de pasar al modelo liviano (hitos + bitácora). Se conserva para comparar **lo planeado contra el atraso real**. |
| **5/6** | [`MIGRACION-ASTRO.md`](./MIGRACION-ASTRO.md) | Guía del re-autorado del curso a la plataforma interactiva. |
| **12/6** | [`clase-12-06_bingo_runofshow.md`](./clase-12-06_bingo_runofshow.md) | Run of show del Bingo, el integrador del Bloque 2. Es el primer documento con formato "minuto a minuto", que después se repitió. |
| **25/6** | [`imports_modulos_y_venv_completo.md`](./imports_modulos_y_venv_completo.md) | Material sobre importar módulos y entornos virtuales. **Ojo: el `venv` de acá se va a usar recién en octubre**, en la clase de entorno previa al deploy. |
| **3/7** | [`PLAN-coexistencia-mkdocs-astro.md`](./PLAN-coexistencia-mkdocs-astro.md) | Cómo conviven el sitio de teoría (MkDocs) y el de ejercicios (Astro) en el mismo GitHub Pages. |
| **8/7** | [`prompt-asistente-alumnos.md`](./prompt-asistente-alumnos.md) | El prompt del asistente para los alumnos. |
| **4/8** | [`STACK-Y-POSIBILIDADES.md`](./STACK-Y-POSIBILIDADES.md) | Resumen del stack completo y qué se puede hacer con él. Es el documento a leer si alguien se suma al proyecto. |

### Agosto — el proyecto de Asistencias

| | Documento | De qué se trata |
|---|---|---|
| **15/8** | [`PROYECTO-ASISTENCIAS.md`](./PROYECTO-ASISTENCIAS.md) | **El documento central del proyecto.** Qué es, dónde está cada archivo, las medidas del formato de la planilla (que costaron varias vueltas), los bugs ya arreglados, qué falta, y las clases que hacen falta para poder hospedarlo + qué hosting y por qué. |
| **18/8** | [`PLAN-CLASES-RESTANTES.md`](./PLAN-CLASES-RESTANTES.md) | Las 35 clases hasta el 18/12, clase por clase, y las tres decisiones que hacen que entren: Expo = Asistencias, pandas optativo, testing a 4 clases. Incluye el plan de puesta al día del grupo. |
| **24/8** | [`EXPO-2026-STAND.md`](./EXPO-2026-STAND.md) | El stand de la Expo del **viernes 13/11**: la regla de los 15 segundos, las tres interacciones, el guion de 60 segundos repartido entre los alumnos, la logística y los riesgos. |
| **26/8** | [`clase-2026-08-20_elicitacion.md`](./clase-2026-08-20_elicitacion.md) | Run of show de la clase de elicitación de requerimientos y preparación de la demo con preceptores. |
| **26/8** | [`bot-siges/`](./bot-siges/) | El bot de carga al SiGeS: [README](./bot-siges/README.md) (cómo funciona y cómo demostrarlo), [mapa del proceso](./bot-siges/mapa_siges.md), y el código andando. |
| **26/8** | [`clase-bot-siges.md`](./clase-bot-siges.md) | Cómo dar el bot en clase: el pantallazo de lo que viene y la clase para construirlo. |
| **27/8** | [`taller-flask/`](./taller-flask/) | **El sistema construido de verdad**, en etapas, con tests. [`GUIA.md`](./taller-flask/GUIA.md) explica por qué Flask y no otro framework, y tiene la tabla de dónde se traban los alumnos. Para hacerlo el profe primero. |

---

## ❓ Lo que quedó sin definir

Esto es lo que hay que decidir, no lo que hay que hacer. Ordenado por cuándo aprieta.

### Para esta semana

- [ ] **Los sub-formularios del SiGeS sin datos de origen.** Vivienda, Transportes y parte de
      Contacto son obligatorios y **no están en el formulario de Google**: hoy la preceptora los
      inventa. O el bot pone valores por defecto marcados para revisar, o se agregan esas preguntas
      al formulario de inscripción. **Es una pregunta para hacerles el viernes.**
- [ ] **Qué se muestra el viernes y qué no.** El bot está andando contra el simulador. ¿Se muestra
      también el sistema de asistencias, o solo el bot? El riesgo de mostrar las dos cosas es que
      se hable una hora y no se escuche nada.
- [ ] **Quién anota el viernes.** Está el reparto de roles en el documento de elicitación, pero
      falta asignar los nombres.

### Para septiembre

- [ ] **El buscador de la Expo: ¿con nombres del sistema o algo neutro?** Con nombres cuenta mejor
      la historia del proyecto; con algo neutro (un número, una carta) entra más fácil a alguien
      que pasa y no sabe nada del CFP. **Sin esto no puedo empezarlo.**
- [ ] **Los datos de demo del sistema.** Inventados, pero ¿cuántos alumnos, cuántos meses cargados?
      Conviene que la planilla impresa se vea llena.

### Para octubre y noviembre

- [ ] **La cuenta de PythonAnywhere**: tiene que ser **del CFP**, no personal. Hay que pedirla.
- [ ] **Confirmar con la Expo**: mesa, sillas, enchufes, si hay proyector propio o va el tuyo.
- [ ] **La impresora del stand.** ¿Hay una disponible? ¿Papel Oficio?
- [ ] **Las fotos del proceso del SiGeS ya llegaron** ✅ (19/8). Falta la media hora con el sistema
      real abierto para ajustar los selectores.

### Decisiones tomadas que conviene no volver a discutir

Están en sus documentos, pero las junto acá porque son las que más se re-preguntan:

- **En la Expo se presenta el Sistema de Asistencias**, no el proyecto final con IA. Un sistema
  que el CFP usa de verdad pesa más que un demo apurado. *(PLAN-CLASES-RESTANTES §2.1)*
- **pandas queda optativo; testing pasa a 4 clases.** Testing está en el nombre del curso.
  *(§2.2)*
- **El deploy se da** (~5 clases). Sin eso el proyecto no le sirve al CFP. *(§2.3)*
- **El prototipo es la especificación, no el código base.** Los alumnos lo rehacen en Python.
  *(PROYECTO-ASISTENCIAS §5)*
- **Datos inventados siempre**, en clase y en la Expo. *(idem)*
- **La planilla se entrega como molde**: no hace falta dar HTML/CSS. *(idem)*

---

## 🧭 Si tenés cinco minutos y no sabés por dónde empezar

1. `PLAN-CLASES-RESTANTES.md` — qué viene y cuándo.
2. La sección "Lo que quedó sin definir" de acá arriba.
3. `bot-siges/README.md` §8 — el guion de la demo del viernes.
