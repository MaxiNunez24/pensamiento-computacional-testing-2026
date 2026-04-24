# Ejercicios Estructuras de Control
import os 
os.system("clear")

# IF-ELIF-ELSE

# 1️⃣ Clasificador de notas extendido
"""
nota = int(input("Ingrese una nota (0..10): "))
if nota >= 0 and nota <= 3: print("❌ Insuficiente")
elif nota >= 4 and nota <= 5: print("⚠️ Regular")
elif nota >= 6 and nota <= 7: print("✅ Aprobado")
elif nota >= 8 and nota <= 9: print("⭐ Bueno")
elif nota == 10: print("🏆 Excelente")
else: print("Por favor ingrese una nota válida (0..10)")
"""

# 2️⃣ ¿Puedo entrar al boliche?
"""
edad = int(input("Ingrese su edad: "))
tiene_entrada = input("Tiene entrada? (Responder 'si' o 'no'): ")
print(tiene_entrada)

if edad >= 18 and tiene_entrada == "si":
    print("✅ Puede entrar al boliche!")
else:
    print("❌ NO puede entrar al boliche:")
    if edad < 18: print("   -> Es menor de edad")
    if tiene_entrada == "no": print("   -> No tiene una entrada")
    elif tiene_entrada == "si": print("   -> Cómo sacó una entrada siendo menor??")
    else: print("   -> Respuesta sobre entrada inválida")
"""

# 3️⃣ Calculadora básica
operando1 = float(input("Ingrese el primer número: "))
operando2 = float(input("Ingrese el segundo número: "))
operador = input("Ingrese la operación (+, -, *, /): ")

if operador != "+" and operador != "-" and operador != "*" and operador != "/":
    print("Operador no válido. Por favor ingrese uno de los siguientes: +, -, *, /")
else: 
    if operador == "+":
        resultado = operando1 + operando2
    elif operador == "-":
        resultado = operando1 - operando2
    elif operador == "*":
        resultado = operando1 * operando2
    elif operador == "/" and operando2 != 0:
        resultado = operando1 / operando2
    else:
        print("Error: No se puede dividir por cero.")
        resultado = "Inválido"
print(f"El resultado de {operando1} {operador} {operando2} es: {resultado}")    
