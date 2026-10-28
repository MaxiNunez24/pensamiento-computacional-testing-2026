# Los chequeos de las clases

Tres scripts que revisan lo mismo que revisaría una persona leyendo todas las páginas, pero en
segundos. **Correlos después de escribir o tocar una clase**, antes de publicar:

```bash
python scripts/revisar-enunciados.py
python scripts/verificar_ejercicios.py
python scripts/verificar-docs-editor.py
python scripts/verificar_render.py
python scripts/verificar-ver-como-corre.py
python scripts/revisar-animaciones.py
```

| Script | Qué busca | Por qué existe |
|---|---|---|
| `revisar-enunciados.py` | Ejercicios que piden trabajar con **datos cuya forma nunca se muestra** | Pasó cuatro veces: el enunciado decía qué hacer pero no con qué, el alumno suponía una lista donde había un diccionario, y el test le decía que no. La cuarta se escapó del chequeo porque el enunciado tenía un bloque de código que mostraba las **llamadas** y no los **datos**: ahora se exige el literal escrito |
| `verificar_ejercicios.py` | Que ningún test le muestre al alumno **un error nuestro** | Un alumno tuvo bien las dos líneas del ejercicio, le faltó el `print`, y la plataforma le mostró un `IndexError` de código nuestro |
| `verificar-docs-editor.py` | Que los ejemplos del panel de documentación del editor **den lo que prometen** | El panel le muestra al alumno `"  Ana  ".strip() → "Ana"`. Un ejemplo equivocado ahí es peor que no tener panel: lo copia, le da otra cosa, y no sabe quién se equivocó. Así que no se leen, se corren |
| `verificar_render.py` | Que las páginas se construyan y se vean | — |
| `verificar-ver-como-corre.py` | Que **"👣 Ver cómo corre"** ande en todos los ejercicios de Python: que se trace el starter con la llamada sugerida y que el motor arme la escena | Un ejercicio que solo define funciones, trazado tal cual, muestra los `def` y nada más. Avisa dónde no se pudo sugerir una llamada: ahí va la prop `llamada` (o `sinTraza`) |
| `revisar-animaciones.py` | Que cada `<Animacion>` tenga su escena y que las trazas estén al día con sus programas | Las preguntas de una lección van por número de paso: si cambia el programa y no se vuelve a trazar, quedan en otro lado |

## La regla del enunciado

**Si el ejercicio recibe o devuelve algo que no es un número o un texto suelto, el enunciado lo
muestra.** Un bloque corto, con la entrada y la salida:

```python
dia = {"30111222": "P", "28999888": "T"}

estado_de(dia, "30111222")   # "P"
estado_de(dia, "99999999")   # "A"   ← a ese nadie lo marcó
```

Vale más que dos párrafos de explicación, y es lo que evita que alguien escriba una solución
razonable para un problema que no era. Ojo con los nombres del dominio: `lista_del_dia` y `mes` son
los nombres correctos en el CFP, pero **no dicen nada de su forma**, y `lista_` en Python promete
otra cosa.

Si un ejercicio tiene que quedar sin ejemplo a propósito, se le pone `{/* sin-ejemplo: motivo */}`
en el enunciado y el chequeo lo saltea.
