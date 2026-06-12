# 🎬 Run-of-show — Viernes 12/6 (Lectura de bugs + Bingo)

> Nota del profe (privada, no se publica). Clase de 3h20m, 14:00–17:20.
> Objetivo: cerrar el Bloque 2 armando el Bingo entre todos. La primera hora caza los bugs más
> comunes del Bingo para llegar con las piezas frescas.

## Antes del recreo (~80 min) — Ronda de bugs al pizarrón

Material: la sección **"🎰 Ronda extra — Cazando bugs en el Bingo"** en
[lectura_codigo.md](../docs/clases/python/06_funciones/lectura_codigo.md). Proyectar el código de
cada bug; los alumnos pasan al pizarrón a marcar el error y escribir la corrección.

| Hora | Qué |
|------|-----|
| 14:00–14:10 | Reencuadre + recordar el protocolo de lectura (*el truco del dedo*: seguir línea a línea anotando el valor de cada variable). |
| 14:10–15:15 | **Los 6 bugs al pizarrón**, ~10 min c/u: leen mentalmente → uno pasa, marca y corrige sobre el proyectado → debate corto. Rotar quién pasa. |
| 15:15–15:20 | Cierre: tabla de errores frecuentes. *"Estas son justo las trampas del Bingo — ya las tienen cazadas."* |

**Recreo ☕**

## Después del recreo (~100 min) — Armar el Bingo entre todos

Material: [bingo.md](../docs/clases/python/06_funciones/bingo.md). Ir construyendo en vivo, llamando
a los alumnos a dictar el código. Cuando aparezca cada función, recordar el bug que la prepara.

| Hora aprox. | Etapa | Bug que la preparó |
|-------------|-------|--------------------|
| 15:40–15:50 | Etapa 1 — el cartón (`generar_carton`) | Bug 1 (cartón `range(1,90)` → off-by-one) |
| 15:50–16:20 | Etapa 2 — `sortear_numero` y `verificar_ganador` | Bug 2 (`choice` sobre set), Bug 3 (marcar el sorteado), Bug 5 (`==` vs `issubset`) |
| 16:20–16:40 | Etapa 3 — `mostrar_carton` | Bug 6 (marcados/pendientes invertidos) |
| 16:40–17:10 | Etapa 4 — `jugar_solitario` (el `while` completo) | Bug 4 (`while` sin `not`) |
| 17:10–17:20 | **Jugar, festejar 🎉 y retrospectiva** | — |

Etapa 5 (multijugador) y el desafío extra de estadísticas → **opcional / para casa**.

## Frase ancla
Cada vez que llegues a una función, soltá: *"¿se acuerdan del bug N de hoy a la mañana?"*. Es
refuerzo puro: ya razonaron el error, ahora escriben la versión correcta.
