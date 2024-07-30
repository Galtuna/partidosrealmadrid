import sys
from bs4 import BeautifulSoup
import re
import json

fichero = sys.argv[1]
# Step 1: Load the HTML page
html_file = "c:/Users/galtuna/RealMadrid/public/t2324f/ligaf/" + fichero + ".html"
with open(html_file, 'r') as file:
    html_content = file.read()

# Step 2: Parse the HTML content
soup = BeautifulSoup(html_content, 'html.parser')

# Step 3: Extract the data
titulo = soup.find('title').text[14:]
atras = soup.find('span', id="btnVolver").find('a')['href']
pattern = r'<td><img src="../../img/ico/campo.png" /> (.*?)\. (.*?)\.<br/>'
match = re.search(pattern, html_content)
if match:
    ciudad = match.group(1)
    estadio_nombre = match.group(2)
pattern = r'<img src="../../img/ico/fans.png" /> (.*?) espectadores'
match = re.search(pattern, html_content)  
if match:
    espectadores = match.group(1)
pattern = r'<img class="imagen" src="../../img/est/(.*?)"/>'
match = re.search(pattern, html_content)  
if match:
    estadio_imagen = match.group(1)
pattern = r'<img src="../../img/ico/calendario.png" /> (.*?) <img'
match = re.search(pattern, html_content)  
if match:
    fecha = match.group(1)
pattern = r'<img src="../../img/ico/reloj.png" /> (.*?)<br/>'
match = re.search(pattern, html_content)  
if match:
    hora = match.group(1)
pattern = r'<img src="../../img/ico/silbato.png" /> (.*?)\n'
match = re.search(pattern, html_content)  
if match:
    arbitro = match.group(1)
pattern = r'<h2>(.*?)</h2>'
match = re.findall(pattern, html_content)  
if match:
    local_nombre = match[0]
    visit_nombre = match[1]
pattern = r'<img src="../../img/esc/(.*?)"/>'
match = re.findall(pattern, html_content)  
if match:
    local_escudo = match[0]
    visit_escudo = match[1]
local_goles = soup.find('h1').text[:1]
visit_goles = soup.find('h1').text[4:]
pattern = r'<td>Entrenador</td>\n\s+</tr>\n\s+<tr>\n\s+<td>&nbsp;</td>\n\s+<td>(.*?)</td>'
match = re.findall(pattern, html_content)
if match:
    local_entrenador = match[0]
    visit_entrenador = match[1]

# Step 4: Structure the data
data = {
    "titulo": titulo,
    "atras": atras,    
    "estadio": {"ciudad": ciudad, "nombre": estadio_nombre, "imagen": estadio_imagen, "espectadores": espectadores},
    "fecha": fecha,
    "hora": hora,    
    "arbitro": arbitro,      
    "local": {"nombre": local_nombre, "escudo": local_escudo, "goles": local_goles, "golesp": 0, "entrenador": local_entrenador},
    "visitante": {"nombre": visit_nombre, "escudo": visit_escudo, "goles": visit_goles, "golesp": 0, "entrenador": visit_entrenador},
    "titularesLocal": [],
    "suplentesLocal": [],
    "titularesVisitante": [],
    "suplentesVisitante": [],
    "goles": [],
    "penaltis": []
}

# Extract alineaciones details
local11 = []
suplenteslocal = []
visit11 = []
suplentesvisit = []

# Local players
tablepadre = soup.find('table', id='tblAlineaciones')
filapadre = tablepadre.find('tr')
celdapadre = filapadre.find('td')
tablelocal = celdapadre.find('table')
rows = tablelocal.find_all('tr')[:11]
for row in rows:
    cells = row.find_all('td')
    dorsal = cells[0].text.strip()
    jugador = cells[1].encode_contents().decode("utf-8").strip()
    if "abajo.png" in jugador:
        ini = jugador.find("abajo.png")
        fin = jugador.find("'", ini)
        abajo = jugador[ini+12:fin] + "'"
    else:
        abajo = "0"
    if "amarilla.png" in jugador:
        countamarillas = jugador.count('amarilla.png')
        if countamarillas == 1:
            amarilla = "1"
        else:
            ini = jugador.rfind("amarilla.png")
            fin = jugador.find("'", ini)
            amarilla = jugador[ini+15:fin] + "'"
    else:
        amarilla = "0"
    if "roja.png" in jugador:
        ini = jugador.find("roja.png")
        fin = jugador.find("'", ini)
        roja = jugador[ini+11:fin] + "'"
    else:
        roja = "0"
    if "gol.png" in jugador:
        gol = jugador.count('gol.png')
    else:
        gol = 0
    if "golpp.png" in jugador:
        golpp = jugador.count('golpp.png')
    else:
        golpp = 0
    if "lesion.png" in jugador:
        lesion = 1
    else:
        lesion = 0
    if "<" in jugador:
        fin = jugador.find("<")
        jugador = jugador[:fin]
    local11.append( {"dorsal": dorsal, "nombre": jugador, "salida": "0", "cambio": abajo, "amarilla": amarilla, "roja": roja, "gol": gol, "golpp": golpp, "lesion": lesion})
rows = tablelocal.find_all('tr')[13:]
for row in rows:
    cells = row.find_all('td')
    dorsal = cells[0].text.strip()
    if dorsal != "":
        jugador = cells[1].encode_contents().decode("utf-8").strip()
        ini = jugador.find("arriba.png")
        fin = jugador.find("'", ini)
        arriba = jugador[ini+13:fin] + "'"
        if "abajo.png" in jugador:
            ini = jugador.find("abajo.png")
            fin = jugador.find("'", ini)
            abajo = jugador[ini+12:fin] + "'"
        else:
            abajo = "0"
        if "amarilla.png" in jugador:
            countamarillas = jugador.count('amarilla.png')
            if countamarillas == 1:
                amarilla = "1"
            else:
                ini = jugador.rfind("amarilla.png")
                fin = jugador.find("'", ini)
                amarilla = jugador[ini+15:fin] + "'"
        else:
            amarilla = "0"
        if "roja.png" in jugador:
            ini = jugador.find("roja.png")
            fin = jugador.find("'", ini)
            roja = jugador[ini+11:fin] + "'"
        else:
            roja = "0"
        if "gol.png" in jugador:
            gol = jugador.count('gol.png')
        else:
            gol = 0
        if "golpp.png" in jugador:
            golpp = jugador.count('golpp.png')
        else:
            golpp = 0
        if "lesion.png" in jugador:
            lesion = 1
        else:
            lesion = 0
        if "<" in jugador:
            fin = jugador.find("<")
            jugador = jugador[:fin]
        suplenteslocal.append( {"dorsal": dorsal, "nombre": jugador, "salida": arriba, "cambio": abajo, "amarilla": amarilla, "roja": roja, "gol": gol, "golpp": golpp, "lesion": lesion})

# Visit players
tablevisit = soup.find('table', class_='tabladerecha')
rows = tablevisit.find_all('tr')[:11]
for row in rows:
    cells = row.find_all('td')
    dorsal = cells[0].text.strip()
    jugador = cells[1].encode_contents().decode("utf-8").strip()
    if "abajo.png" in jugador:
        ini = jugador.find("abajo.png")
        fin = jugador.find("'", ini)
        abajo = jugador[ini+12:fin] + "'"
    else:
        abajo = "0"
    if "amarilla.png" in jugador:
        countamarillas = jugador.count('amarilla.png')
        if countamarillas == 1:
            amarilla = "1"
        else:
            ini = jugador.rfind("amarilla.png")
            fin = jugador.find("'", ini)
            amarilla = jugador[ini+15:fin] + "'"
    else:
        amarilla = "0"
    if "roja.png" in jugador:
        ini = jugador.find("roja.png")
        fin = jugador.find("'", ini)
        roja = jugador[ini+11:fin] + "'"
    else:
        roja = "0"
    if "gol.png" in jugador:
        gol = jugador.count('gol.png')
    else:
        gol = 0
    if "golpp.png" in jugador:
        golpp = jugador.count('golpp.png')
    else:
        golpp = 0
    if "lesion.png" in jugador:
        lesion = 1
    else:
        lesion = 0
    if "<" in jugador:
        fin = jugador.find("<")
        jugador = jugador[:fin]
    visit11.append( {"dorsal": dorsal, "nombre": jugador, "salida": "0", "cambio": abajo, "amarilla": amarilla, "roja": roja, "gol": gol, "golpp": golpp, "lesion": lesion})
rows = tablevisit.find_all('tr')[13:]
for row in rows:
    cells = row.find_all('td')
    dorsal = cells[0].text.strip()
    if dorsal != "":
        jugador = cells[1].encode_contents().decode("utf-8").strip()
        ini = jugador.find("arriba.png")
        fin = jugador.find("'", ini)
        arriba = jugador[ini+13:fin] + "'"
        if "abajo.png" in jugador:
            ini = jugador.find("abajo.png")
            fin = jugador.find("'", ini)
            abajo = jugador[ini+12:fin] + "'"
        else:
            abajo = "0"
        if "amarilla.png" in jugador:
            countamarillas = jugador.count('amarilla.png')
            if countamarillas == 1:
                amarilla = "1"
            else:
                ini = jugador.rfind("amarilla.png")
                fin = jugador.find("'", ini)
                amarilla = jugador[ini+15:fin] + "'"
        else:
            amarilla = "0"
        if "roja.png" in jugador:
            ini = jugador.find("roja.png")
            fin = jugador.find("'", ini)
            roja = jugador[ini+11:fin] + "'"
        else:
            roja = "0"
        if "gol.png" in jugador:
            gol = jugador.count('gol.png')
        else:
            gol = 0
        if "golpp.png" in jugador:
            golpp = jugador.count('golpp.png')
        else:
            golpp = 0
        if "lesion.png" in jugador:
            lesion = 1
        else:
            lesion = 0
        if "<" in jugador:
            fin = jugador.find("<")
            jugador = jugador[:fin]
        suplentesvisit.append( {"dorsal": dorsal, "nombre": jugador, "salida": arriba, "cambio": abajo, "amarilla": amarilla, "roja": roja, "gol": gol, "golpp": golpp, "lesion": lesion})

# Update the JSON data
data["titularesLocal"] = local11
data["titularesVisitante"] = visit11
data["suplentesLocal"] = suplenteslocal
data["suplentesVisitante"] = suplentesvisit

# Extract goals details
goals = []
table = soup.find('table', id='tblGoles')
rows = table.find_all('tr')[1:]  # Ignore the first row
for row in rows:
    cells = row.find_all('td')
    gol = cells[0].text.strip()
    minuto = cells[1].text.strip()
    descripcion = cells[2].encode_contents().decode("utf-8").strip()
    goals.append({"gol": gol, "minuto": minuto, "descripcion": descripcion})

# Update the JSON data
data["goles"] = goals

# Step 5: Convert to JSON
json_data = json.dumps(data, indent=4)

# Step 6: Save the JSON data
with open('%s.json' % fichero, 'w') as file:
    file.write(json_data)