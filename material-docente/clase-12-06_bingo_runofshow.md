# 🎬 Run-of-show — Viernes 12/6 (Lectura de bugs + Bingo)

> Nota del profe (privada, no se publica). Clase de 3h20m, 14:00–17:20.
> Objetivo: cerrar el Bloque 2 armando el Bingo entre todos. La primera hora caza los bugs más
> comunes del Bingo para llegar con las piezas frescas.

## Antes del recreo (~80 min) — Ronda de bugs al pizarrón

Material: la sección **"🖍️ Ronda extra — Seis bugs al pizarrón"** en
[lectura_codigo.md](../docs/clases/python/06_funciones/lectura_codigo.md). Proyectar el código de
cada caso; los alumnos pasan al pizarrón a marcar el error y escribir la corrección.

> 🤫 **Clave pedagógica**: los seis casos son de OTROS dominios (rifa, pizarrón, playlist,
> adivinanzas, recetas, asistencia) pero esconden **las mismas trampas** que el Bingo. **No nombrar
> al Bingo durante la ronda** — la transferencia la hacen ellos después del recreo, recordando.

| Hora | Qué |
|------|-----|
| 14:00–14:10 | Reencuadre + recordar el protocolo de lectura (*el truco del dedo*: seguir línea a línea anotando el valor de cada variable). |
| 14:10–15:15 | **Los 6 casos al pizarrón**, ~10 min c/u: leen mentalmente → uno pasa, marca y corrige sobre el proyectado → debate corto. Rotar quién pasa. |
| 15:15–15:20 | Cierre: tabla de errores frecuentes + el anuncio misterioso: *"estas seis trampas vuelven a aparecer hoy, disfrazadas"*. |

**Recreo ☕**

## Después del recreo (~100 min) — Armar el Bingo entre todos

Material: [bingo.md](../docs/clases/python/06_funciones/bingo.md). Ir construyendo en vivo, llamando
a los alumnos a dictar el código. Cuando se traben en una etapa, NO dar la respuesta: preguntar
*"¿a cuál de los seis casos de hoy se parece esto?"* y dejar que la conexión la hagan ellos.

| Hora aprox. | Etapa | Caso que la preparó (chuleta del profe) |
|-------------|-------|------------------------------------------|
| 15:40–15:50 | Etapa 1 — el cartón (`generar_carton`) | Caso 1: la rifa (off-by-one en `range`) |
| 15:50–16:20 | Etapa 2 — `sortear_numero` y `verificar_ganador` | Caso 2: pizarrón (`choice` sobre set), Caso 3: playlist (olvidar el `.add`), Caso 5: receta (`==` vs `issubset`) |
| 16:20–16:40 | Etapa 3 — `mostrar_carton` | Caso 6: asistencia (`&`/`-` invertidos) |
| 16:40–17:10 | Etapa 4 — `jugar_solitario` (el `while` completo) | Caso 4: adivinanzas (`while` sin `not`) |
| 17:10–17:20 | **Jugar, festejar 🎉 y retrospectiva** | — |

Etapa 5 (multijugador) y el desafío extra de estadísticas → **opcional / para casa**.

## Frase ancla
Cuando alguien pise una trampa: *"¿a cuál de los casos de hoy se parece?"*. Que el reconocimiento
sea de ellos — eso es transferencia, no repetición. (Bonus: el Caso 6 es literalmente el dominio
del primer proyecto: el Sistema de Asistencias. 😉)
