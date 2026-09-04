# Scripts antes de la demo

## Flask 
### Flask - Una vez
pip install -r material-privado/taller-flask/requirements.txt

### Flask - Cada vez
python3 material-privado/taller-flask/sembrar_demo.py

python3 material-privado/taller-flask/app.py


### Después abrir:
localhost:5000/lista/2026-09-04

localhost:5000/merienda


## Bot SIGES
### Bot SIGES - Una vez
pip install -r material-privado/bot-siges/requirements.txt
python3 -m playwright install chromium

### Bot SIGES - Cada vez
cd material-privado/bot-siges
python3 bot.py --lento

Si sólo se desea ver las filas que pasan el control sin navegador:
python3 normalizar.py