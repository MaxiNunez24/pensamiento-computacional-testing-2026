"""Une los cuadros de grabar.mjs en un MP4 a 30 cuadros por segundo (grabacion/pantalla.mp4).
Cada cuadro dura hasta que llega el siguiente, con los tiempos reales que mandó Chrome."""
import json
import subprocess
from pathlib import Path

AQUI = Path(__file__).resolve().parent
G = AQUI / 'grabacion'
tiempos = json.loads((G / 'cuadros.json').read_text())
lineas = []
for i, t in enumerate(tiempos):
    dura = (tiempos[i + 1] - t) if i + 1 < len(tiempos) else 0.5
    lineas += [f"file 'cuadros/{i:05d}.jpg'", f'duration {dura:.4f}']
lineas.append(f"file 'cuadros/{len(tiempos) - 1:05d}.jpg'")
(G / 'lista.txt').write_text('\n'.join(lineas) + '\n')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(G / 'lista.txt'),
                '-vf', 'fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p', '-c:v', 'libx264', '-crf', '14',
                '-preset', 'slow', '-movflags', '+faststart', str(G / 'pantalla.mp4')], check=True)
print('listo:', G / 'pantalla.mp4')
