# La página de la Expo: cómo se usa

Dos páginas con diseño propio, aparte de las clases:

| Página | Para qué | Dónde |
|---|---|---|
| `/expo/` | El celular de quien escanea el QR del stand: la vidriera, la moneda, el sistema y "Probá vos" | `src/pages/expo/index.astro` |
| `/expo/pantalla/` | La lona: la animación del sistema en loop, sin controles, con un QR a `/expo/` en la esquina | `src/pages/expo/pantalla.astro` |

## Sumar los catálogos (la vidriera)

En `src/data/expo/vidriera.csv`, con el **mismo formato** que la clase de la vidriera:

```csv
emprendimiento,rubro,emoji,link
Dulces de la Isla,Dulces caseros,🍯,https://usuario.github.io/dulces/
```

- Mientras esté vacía, la página muestra los ejemplos de la clase con un cartel de **ejemplo**.
  Con la primera fila de verdad, los ejemplos desaparecen solos.
- **El nombre del emprendimiento, nunca el de quien lo hizo**: el repo es público.
- Los QR se dibujan al construir la página. No dependen de internet, y una fila nueva se publica
  con el deploy de siempre (push a main).
- Solo se aceptan links que empiezan con `http://` o `https://`.

## Sumar los juegos de los alumnos

En `src/data/expo/juegos.json`:

```json
[
    { "nombre": "Un dado", "emoji": "🎲", "descripcion": "Tirá y mirá qué sale.", "link": "https://usuario.github.io/dado/" }
]
```

La moneda está siempre, jugable en la página misma. **El panel secreto se abre con la tecla P**:
una barra para la probabilidad de GANAR (no de que salga cara: con 80, quien juega gana 8 de cada 10, elija lo que elija), para los sorteos del stand. En el celular no hay tecla P,
así que no lo ve nadie.

## El día de la Expo, sin internet

La notebook del proyector puede no tener wifi. La página no pide nada a internet: el motor, la
escena y los QR van adentro. Pero las rutas llevan el `base` del sitio, así que no se abre con
doble clic: hay que servirla. En la notebook, con el repo:

```bash
corepack pnpm run build
corepack pnpm exec astro preview --port 4322
```

Y abrir `http://localhost:4322/pensamiento-computacional-testing-2026/ejercicios/expo/pantalla/`,
con **F11** para la pantalla completa. Probarlo **el día antes**, con el wifi apagado.

Los QR de la vidriera llevan a los catálogos publicados en GitHub Pages: esos los abre cada
visitante en su celular, con sus datos.

## Ojo con la mudanza a la organización

Los QR salen de la dirección del sitio (`site` + `base` en `astro.config.mjs`). Si el repo se muda
a la organización del CFP, la dirección cambia: la página se reconstruye sola con los QR nuevos,
pero **un QR impreso queda apuntando a la dirección vieja**. Mudarlo después de la Expo, como estaba
previsto, o imprimir los carteles después de la mudanza.

## La escena del sistema

`src/animaciones/expo-siges.js` es una copia de `motor-animaciones/ejemplos/expo/siges.js`,
pasada a módulo (el `import` en vez del `Motor` global). Si cambia en el motor, se vuelve a copiar.
Los nombres y el DNI son inventados, y el bot del SiGeS no aparece.
