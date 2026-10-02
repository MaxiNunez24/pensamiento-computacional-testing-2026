# Los chequeos de las clases

Tres scripts que revisan lo mismo que revisaría una persona leyendo todas las páginas, pero en
segundos. **Correlos después de escribir o tocar una clase**, antes de publicar:

```bash
python scripts/revisar-enunciados.py
python scripts/verificar_ejercicios.py
python scripts/verificar_render.py
```

| Script | Qué busca | Por qué existe |
|---|---|---|
| `revisar-enunciados.py` | Ejercicios que piden trabajar con **datos cuya forma nunca se muestra** | Pasó cuatro veces: el enunciado decía qué hacer pero no con qué, el alumno suponía una lista donde había un diccionario, y el test le decía que no. La cuarta se escapó del chequeo porque el enunciado tenía un bloque de código que mostraba las **llamadas** y no los **datos**: ahora se exige el literal escrito |
| `verificar_ejercicios.py` | Que ningún test le muestre al alumno **un error nuestro** | Un alumno tuvo bien las dos líneas del ejercicio, le faltó el `print`, y la plataforma le mostró un `IndexError` de código nuestro |
| `verificar_render.py` | Que las páginas se construyan y se vean | — |

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
