import{registrar as e,desdeTraza as a}from"./motor.BDnp107R.js";const n=`def mostrar_doble(precio):
    print(precio * 2)


def doble(precio):
    return precio * 2


a = doble(4500)
b = mostrar_doble(4500)
print(a + 100)
print(b + 100)
`,o="python",r=[{linea:1,variables:{},salida:""},{linea:5,variables:{},salida:""},{linea:9,variables:{},salida:""},{linea:6,variables:{},salida:"",pila:[{funcion:"doble",linea:6,variables:{precio:{tipo:"int",repr:"4500"}}}]},{linea:6,variables:{},salida:"",pila:[{funcion:"doble",linea:6,variables:{precio:{tipo:"int",repr:"4500"}}}],retorno:{funcion:"doble",valor:"9000"}},{linea:10,variables:{a:{tipo:"int",repr:"9000"}},salida:""},{linea:2,variables:{a:{tipo:"int",repr:"9000"}},salida:"",pila:[{funcion:"mostrar_doble",linea:2,variables:{precio:{tipo:"int",repr:"4500"}}}]},{linea:2,variables:{a:{tipo:"int",repr:"9000"}},salida:`9000
`,pila:[{funcion:"mostrar_doble",linea:2,variables:{precio:{tipo:"int",repr:"4500"}}}],retorno:{funcion:"mostrar_doble",valor:"None"}},{linea:11,variables:{a:{tipo:"int",repr:"9000"},b:{tipo:"NoneType",repr:"None"}},salida:`9000
`},{linea:12,variables:{a:{tipo:"int",repr:"9000"},b:{tipo:"NoneType",repr:"None"}},salida:`9000
9100
`},{linea:12,variables:{a:{tipo:"int",repr:"9000"},b:{tipo:"NoneType",repr:"None"}},salida:`9000
9100
`,excepcion:{tipo:"TypeError",mensaje:"unsupported operand type(s) for +: 'NoneType' and 'int'"}}],i={codigo:n,lenguaje:o,traza:r};e("funciones-return-print",a({...i,explicar:!0,lineaGrande:!0,alto:"auto",ritmo:1.4,titulo:"¿return o print?",archivo:"funciones.py",descripcion:"Dos funciones casi iguales: una muestra el doble con print y la otra lo devuelve con return. Solo la que devuelve deja algo guardado; la otra deja None, y sumarle algo da error.",capitulos:{0:"Dos funciones",2:"La que devuelve",5:"La que muestra",9:"Usar lo que quedó"},explicaciones:{0:"Dos funciones casi iguales: mostrar_doble MUESTRA el doble, y doble lo DEVUELVE.",4:"doble devuelve 9000: vuelve a quien la llamó, y queda guardado en a.",7:"mostrar_doble mostró 9000 en la pantalla… pero no tiene return: devuelve None.",8:"Por eso b vale None. El 9000 se vio, pero no quedó guardado en ningún lado.",10:"Le faltaba el return."},preguntas:{2:{pregunta:"doble termina con return precio * 2. ¿Qué va a quedar guardado en a?",opciones:["9000","None","Nada: no muestra nada en la pantalla"],correcta:0,explicacion:"return devuelve el valor a quien llamó a la función, y el = lo guarda en a. No hace falta que se vea."},5:{pregunta:"mostrar_doble hace print(precio * 2) y no tiene return. ¿Qué va a quedar guardado en b?",opciones:["9000","None: no devolvió nada",'"9000", como texto'],correcta:1,explicacion:"print muestra, pero no devuelve. Una función sin return devuelve None, y eso es lo que se guarda."},9:{pregunta:"b vale None. ¿Qué pasa con print(b + 100)?",opciones:["Muestra 9100","Muestra None100","Da un error"],correcta:2,explicacion:"None no es un número."}}}));
