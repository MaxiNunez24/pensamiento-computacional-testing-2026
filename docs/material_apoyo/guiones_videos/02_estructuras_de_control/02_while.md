# Video 2 — While: repetir mientras se cumpla una condición

**Serie:** Estructuras de Control
**Duración estimada:** ~5 minutos

---

## INTRO (~30 segundos)

*(Abrir un archivo Python vacío en el editor)*

> Hola! En este video vemos el bucle `while`: la primera estructura de repetición del curso. Sirve para ejecutar un bloque de código **repetidamente, mientras se cumpla una condición**.

---

## CÓMO FUNCIONA EL WHILE (~1.5 minutos)

*(Escribir en el editor:)*

```python
contador = 1

while contador <= 5:
    print(contador)
    contador += 1

print("¡Listo!")
```

> Cada vez que el programa llega al `while`, evalúa la condición `contador <= 5`. Si es verdadera, ejecuta el bloque. Cuando termina el bloque, vuelve a evaluar la condición. Y así hasta que la condición sea falsa.

*(Mostrar la salida:)*

```
1
2
3
4
5
¡Listo!
```

> Todo bucle `while` bien construido tiene tres partes obligatorias:

*(Marcar cada parte en el código:)*

```python
contador = 1          # 1. INICIALIZACIÓN: definir la variable de control

while contador <= 5:  # 2. CONDICIÓN: ¿seguimos?
    print(contador)
    contador += 1     # 3. ACTUALIZACIÓN: modificar la variable para que
                      #    algún día la condición sea falsa
```

> Si olvidamos la actualización, la condición nunca cambia y el programa **nunca termina**. Eso se llama **bucle infinito** y es el error más común al aprender bucles.

*(Mostrar el ejemplo malo:)*

```python
# ❌ Bucle infinito — el programa se cuelga
contador = 1
while contador <= 5:
    print(contador)
    # Falta contador += 1
```

> Si quedan atrapados en un bucle infinito, usen `Ctrl + C` en la terminal para detener el programa.

---

## PATRÓN ACUMULADOR (~1 minuto)

> Un patrón muy frecuente: usar una variable que va acumulando un valor a lo largo de las iteraciones.

```python
suma     = 0
cantidad = 0

while cantidad < 5:
    numero    = float(input("Ingresá un número: "))
    suma      += numero
    cantidad  += 1

promedio = suma / cantidad
print(f"Promedio: {promedio:.2f}")
```

> `suma = 0` se inicializa en cero antes del bucle. Dentro del bucle, `suma += numero` va acumulando. Al terminar, tenemos la suma de todos los números.

---

## WHILE CON INPUT DEL USUARIO (~1 minuto)

> Otra aplicación muy común: seguir pidiendo datos hasta que el usuario ingrese algo específico.

```python
respuesta = ""

while respuesta != "salir":
    respuesta = input("Escribí algo (o 'salir' para terminar): ")
    if respuesta != "salir":
        print(f"Dijiste: {respuesta}")

print("¡Hasta luego!")
```

> El bucle sigue mientras el usuario no escriba exactamente `"salir"`. Esta estructura aparece constantemente en menús y formularios.

---

## CIERRE (~30 segundos)

> Listo. `while` repite un bloque mientras la condición sea verdadera. Siempre asegurense de que la condición pueda volverse falsa en algún momento.
>
> En el próximo video vemos `for`: el bucle para cuando sabemos cuántas veces repetir, o cuando queremos recorrer una colección.
>
> ¡Nos vemos!
