from pathlib import Path

# 1) Un archivo de texto con varios párrafos (lo usa el Ejercicio 2)
texto = """La informática transformó el mundo en pocas décadas.
Hoy programar es una habilidad tan útil como leer o escribir.
Con Python, automatizar tareas aburridas es cuestión de minutos.
Y esto recién empieza."""
Path("texto.txt").write_text(texto, encoding="utf-8")

# 2) Una carpeta con archivos de nombres "sucios" (los vas a ordenar en el último ejercicio)
carpeta = Path("practica_archivos")
carpeta.mkdir(exist_ok=True)

nombres = [
    "Apunte De Clase.txt", "Tarea Para El Lunes.txt", "Lista De Compras.txt",
    "NOTAS Importantes.txt", "Mi Resumen Final.txt", "Fotos Del Viaje.txt",
    "Presupuesto 2026.txt", "Ideas Locas.txt", "Pendientes De Hoy.txt",
    "Receta De La Abuela.txt", "Cosas Por Comprar.txt", "Borrador Sin Titulo.txt",
]
for nombre in nombres:
    (carpeta / nombre).write_text("archivo de práctica", encoding="utf-8")

print(f"✅ Listo: creé 'texto.txt' y {len(nombres)} archivos en '{carpeta}/' en un parpadeo.")