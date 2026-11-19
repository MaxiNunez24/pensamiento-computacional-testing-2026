# Video de promoción 2027

El guion y el plan están en `guiones/promo-2027.md`. Esta carpeta tiene lo que lo arma:

| Carpeta | Qué hay |
|---|---|
| `motor/` | Las escenas del motor de animaciones (las "clases animadas"). Cada una se graba a un MP4 vertical |
| `hf/` | La composición de HyperFrames: une los clips del motor con las transiciones con shaders, el texto cinético y la música |
| `capturar.mjs` | Saca capturas en tamaño celular de las páginas que aparecen en el video |

## Cómo se arma

1. **Servir las escenas del motor** (el video.js del motor las abre por HTTP):

    ```bash
    cd motor && python -m http.server 8123 --bind 127.0.0.1
    ```

2. **Grabar cada escena** desde la carpeta del motor, sin modificarlo:

    ```bash
    cd D:/Dev/motor-animaciones
    node herramientas/video.js --base http://127.0.0.1:8123 --url desde-cero.html --ancho 1080 --alto 1920 --desenfoque 4 --subtitulos no --salida "<esta carpeta>/hf/assets/desde-cero.mp4"
    ```

3. **Revisar y armar el video** con HyperFrames (versión fija, 0.9.69):

    ```bash
    cd hf
    npx hyperframes lint
    npx hyperframes snapshot --at 1,3,5
    npx hyperframes render -o renders/prototipo.mp4
    ```

HyperFrames necesita FFmpeg en el PATH (se instaló con `winget install Gyan.FFmpeg`). La
telemetría de HyperFrames está apagada (`npx hyperframes telemetry disable`).

## Reglas del video

- **Grilla:** 120 BPM, un golpe cada 0,5 s y un compás cada 2 s. Cuando se elija la pista, `npx hyperframes beats` detecta sus golpes y se ajustan los tiempos.
- **Zonas seguras:** nada importante en los 250 px de arriba ni en los 340 px de abajo.
- **Paleta:** la del estilo neón del motor (fondo `#07060f`, cian `#22e3ff`, magenta `#ff3dc8`, verde `#39ff9c`).
- **Transiciones:** un vocabulario fijo (glitch, zoom cinematográfico, destello, paneo rápido, corte por forma), de 0,15 a 0,3 s.
- **Nada de nombres de alumnos** en pantalla.
