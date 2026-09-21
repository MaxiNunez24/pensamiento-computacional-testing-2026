# 📊 Aplicaciones de Python

!!! warning "🚧 En preparación"
    Esta sección se está armando. La prioridad número uno es el **sistema de asistencias**: esto
    viene después.

Python no es solo para hacer programas de consola. Con unas librerías que usa todo el mundo se
pueden analizar datos, hacer gráficos y manejar planillas de Excel. El orden de acá abajo es el
orden en que conviene verlas.

| | Librería | Qué vamos a hacer |
|---|---|---|
| 1 | **numpy** | Cuentas sobre muchos números a la vez, sin escribir el `for` |
| 2 | **pandas** | Leer **la planilla de asistencia del proyecto** y sacar reportes: porcentajes, faltas por mes, quién está por debajo del 85% |
| 3 | **matplotlib** | Los gráficos: primero los datos, después la imagen que los cuenta |
| 4 | **yfinance** | Bajar cotizaciones de verdad y graficarlas |
| 5 | **openpyxl** | Leer y escribir planillas de **Excel** desde Python. Para el CFP es oro: media institución vive en planillas |

!!! note "Dónde se practica"
    **numpy** y **pandas** andan en la plataforma de ejercicios: se cargan solos la primera vez que
    los importás (tarda unos segundos). Para el resto hace falta **VS Code**, con un entorno virtual
    como hicimos con el bot: los gráficos de **matplotlib** se abren en su propia ventana, y
    **openpyxl** trabaja con los archivos de Excel de tu compu.

    **yfinance** en particular no puede andar en la plataforma de ejercicios: necesita conectarse
    a Yahoo desde afuera, y el navegador no lo deja por seguridad. Esa clase es de VS Code sí o sí.
