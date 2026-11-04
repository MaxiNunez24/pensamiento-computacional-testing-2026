"""Sube al Worker de los catálogos lo privado del panel del stand (/expo/panel/).

Lo privado vive en contenido-privado/expo/panel/, que no se sube al repo:

    imagenes.json   [{"archivo": "diseno-1.webp", "titulo": "...", "grupo": "Proyector"}, ...]
    consultas.json  [{"texto": "...", "grupo": "Directivos"}, ...]   (solo con --consultas)
    *.webp / *.png  las imágenes (mejor WEBP: viajan todas juntas al abrir el panel)

Uso, desde la raíz del repo (pide la clave de administración, o la toma de ADMIN_CLAVE):

    python scripts/subir-panel.py [--consultas]                        al Worker de verdad
    python scripts/subir-panel.py --worker http://127.0.0.1:8790 ...   a uno local (wrangler dev)

Las imágenes se pueden subir las veces que haga falta. Las consultas NO: pisarían lo que se tildó en el
panel. Por eso van aparte, con --consultas, y se suman a las que ya había (o a los temas del stand).
"""
import argparse
import getpass
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CARPETA = RAIZ / "contenido-privado" / "expo" / "panel"
WORKER = "https://catalogos.maxinunez434.workers.dev"
# La administración acepta 10 pedidos por minuto: uno cada 6,5 segundos no llega nunca al límite
PAUSA = 6.5


def pedir(worker, clave, metodo, ruta, cuerpo=None, tipo="application/json"):
    pedido = urllib.request.Request(worker + ruta, data=cuerpo, method=metodo, headers={
        "X-Admin": clave,
        "Content-Type": tipo,
        # El Worker solo atiende la administración desde las páginas del curso
        "Origin": "https://maxinunez24.github.io",
    })
    try:
        with urllib.request.urlopen(pedido) as r:
            return json.load(r)
    except urllib.error.HTTPError as error:
        raise SystemExit(f"{metodo} {ruta}: {error.code} {error.read().decode('utf-8', 'replace')}")
    finally:
        time.sleep(PAUSA)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--worker", default=WORKER)
    parser.add_argument("--consultas", action="store_true", help="suma el checklist de consultas.json")
    args = parser.parse_args()
    clave = os.environ.get("ADMIN_CLAVE") or getpass.getpass("Clave de administración: ")

    imagenes = json.loads((CARPETA / "imagenes.json").read_text(encoding="utf-8"))
    for i, img in enumerate(imagenes):
        archivo = CARPETA / img["archivo"]
        # El número adelante ordena la galería: el KV lista por orden alfabético
        nombre = f"{i:02d}-{archivo.stem.lower()}"
        consulta = urllib.parse.urlencode({"titulo": img["titulo"], "grupo": img["grupo"]})
        pedir(args.worker, clave, "PUT", f"/admin/panel/imagen/{nombre}?{consulta}", archivo.read_bytes(), "application/octet-stream")
        print("imagen:", nombre, flush=True)

    if args.consultas:
        ya = pedir(args.worker, clave, "GET", "/admin/panel")["consultas"]
        textos = {c["texto"] for c in ya}
        nuevas = [c for c in json.loads((CARPETA / "consultas.json").read_text(encoding="utf-8")) if c["texto"] not in textos]
        consultas = ya + [{"texto": c["texto"], "grupo": c["grupo"], "hecho": False} for c in nuevas]
        pedir(args.worker, clave, "PUT", "/admin/panel/consultas", json.dumps({"consultas": consultas}).encode("utf-8"))
        print(f"consultas: {len(consultas)} ({len(nuevas)} nuevas)")


if __name__ == "__main__":
    main()
