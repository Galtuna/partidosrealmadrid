const urlParams = new URLSearchParams(window.location.search);
const codigo = urlParams.get("cod");
const filePath = '/partidos/' + codigo.substring(0, 4) + '/' + codigo + '.json';
const jsonData = JSON();

function JSON(){    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var respuesta = xhttp.response;
            htmlFromJSON(respuesta);
        }
        if (this.readyState == 4 && this.status == 404) {
            window.location.href = '404.html';
        }
    }
    xhttp.open("GET", filePath, true);
    xhttp.responseType = "json";
    xhttp.send();
}

function htmlFromJSON(jsonData){
    cargarDatosGenerales(jsonData);
    cargarJugadores(jsonData.titularesLocal, 1);
    cargarJugadores(jsonData.suplentesLocal, 2);
    cargarJugadores(jsonData.titularesVisitante, 3);
    cargarJugadores(jsonData.suplentesVisitante, 4);
    cargarGoles(jsonData);
    cargarPenaltis(jsonData);
}

function cargarDatosGenerales(jsonData) {
    document.title = "Real Madrid - " + jsonData.titulo;
    let tituloHTML = document.getElementById('titulo');
    tituloHTML.textContent = jsonData.titulo;
    let imgLocal = document.getElementById('imgLocal');
    imgLocal.src = 'img/esc/' + jsonData.local.escudo;
    let nombreLocal = document.getElementById('nombreLocal');
    nombreLocal.textContent = jsonData.local.nombre;
    let entrenadorLocal = document.getElementById('entrenadorLocal');
    entrenadorLocal.textContent = jsonData.local.entrenador;
    let imgVisitante = document.getElementById('imgVisitante');
    imgVisitante.src = 'img/esc/' + jsonData.visitante.escudo;
    let nombreVisitante = document.getElementById('nombreVisitante');
    nombreVisitante.textContent = jsonData.visitante.nombre;
    let resultado = document.getElementById('resultado');
    resultado.innerHTML = jsonData.local.goles + " - " + jsonData.visitante.goles;
    if (jsonData.local.golesp != 0 || jsonData.visitante.golesp != 0) {
        resultado.innerHTML += "<br /> (" + jsonData.local.golesp + " - " + jsonData.visitante.golesp + ")";
    }
    let entrenadorVisitante = document.getElementById('entrenadorVisitante');
    entrenadorVisitante.textContent = jsonData.visitante.entrenador;
    let botonAtras = document.getElementById('btnAtras');
    botonAtras.href = jsonData.atras;
    let ciudad = document.getElementById('ciudad');
    ciudad.textContent = jsonData.estadio.ciudad;
    let estadio = document.getElementById('estadio');
    estadio.textContent = jsonData.estadio.nombre;
    let imgEstadio = document.getElementById('imgEstadio');
    imgEstadio.src = 'img/est/' + jsonData.estadio.imagen;
    let espectadores = document.getElementById('espectadores');
    espectadores.textContent = jsonData.estadio.espectadores;
    let fecha = document.getElementById('fecha');
    fecha.textContent = jsonData.fecha;
    let hora = document.getElementById('hora');
    hora.textContent = jsonData.hora;
    let arbitro = document.getElementById('arbitro');
    arbitro.innerHTML = jsonData.arbitro;
}

function cargarJugadores(jsonDataJugadores, tabla){
    let tblJugadores = null;

    if (tabla == 1) {
        tblJugadores = document.getElementById('tblAlineacionLocal');
    } else if (tabla == 2) {
        tblJugadores = document.getElementById('tblSuplentesLocal');
    } else if (tabla == 3) {
        tblJugadores = document.getElementById('tblAlineacionVisitante');
    } else if (tabla == 4) {
        tblJugadores = document.getElementById('tblSuplentesVisitante');
    }

    for (var i = 0; i < jsonDataJugadores.length; i++) {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        td1.classList.add("derecha");
        td1.classList.add("azul");
        td1.textContent = jsonDataJugadores[i].dorsal;
        tr.appendChild(td1);
        let td2 = document.createElement("td");
        td2.innerHTML = jsonDataJugadores[i].nombre;
        if (jsonDataJugadores[i].salida != "0") {
            td2.innerHTML += " <img src='../../img/ico/arriba.png'></img>" + jsonDataJugadores[i].salida;
        }
        if (jsonDataJugadores[i].amarilla == "1") {
            td2.innerHTML += " <img src='../../img/ico/amarilla.png'></img>";
        }
        if (jsonDataJugadores[i].gol > 0) {
            for (var j = 0; j < jsonDataJugadores[i].gol; j++) {
                td2.innerHTML += " <img src='../../img/ico/gol.png'></img>";
            }
        }
        if (jsonDataJugadores[i].golpp > 0) {
            for (var j = 0; j < jsonDataJugadores[i].golpp; j++) {
                td2.innerHTML += " <img src='../../img/ico/golpp.png'></img>";
            }
        }
        if (jsonDataJugadores[i].amarilla != "0" && jsonDataJugadores[i].amarilla != "1") {
            td2.innerHTML += " <img src='../../img/ico/amarilla.png'></img>" + "<img src='../../img/ico/amarilla.png'></img>" + jsonDataJugadores[i].amarilla;
        }
        if (jsonDataJugadores[i].roja != "0") {
            td2.innerHTML += " <img src='../../img/ico/roja.png'></img>" + jsonDataJugadores[i].roja;
        }
        if (jsonDataJugadores[i].cambio != "0") {
            td2.innerHTML += " <img src='../../img/ico/abajo.png'></img>" + jsonDataJugadores[i].cambio;
        }
        if (jsonDataJugadores[i].lesion > 0) {
            td2.innerHTML += " <img src='../../img/ico/lesion.png'></img>";
        }
        tr.appendChild(td2);
        tblJugadores.appendChild(tr);
    }
}

function cargarGoles(jsonData){
    let tblGoles = document.getElementById('tblGoles');

    if (jsonData.goles.length > 0) {
        let table = document.createElement('table');
        let trc = document.createElement("tr");
        let tdc = document.createElement("td");
        tdc.colSpan = 3;
        tdc.classList.add("azul");
        tdc.textContent = "Goles";
        trc.appendChild(tdc);
        table.appendChild(trc);

        for (var i = 0; i < jsonData.goles.length; i++) {            
            let tr = document.createElement("tr");
            let td1 = document.createElement("td");
            td1.classList.add("col1gol");
            td1.classList.add("azul");
            td1.textContent = jsonData.goles[i].gol;
            tr.appendChild(td1);
            let td2 = document.createElement("td");
            td2.classList.add("col2gol");
            td2.textContent = jsonData.goles[i].minuto;
            tr.appendChild(td2);
            let td3 = document.createElement("td");
            td3.innerHTML = jsonData.goles[i].descripcion;
            tr.appendChild(td3);
            table.appendChild(tr);
        }
        tblGoles.appendChild(table);
    }    
}

function cargarPenaltis(jsonData){
    let tblPenaltis = document.getElementById('tblPenaltis');

    if (jsonData.penaltis.length > 0) {
        let table = document.createElement('table');
        let trc = document.createElement("tr");
        let tdc = document.createElement("td");
        tdc.colSpan = 3;
        tdc.classList.add("azul");
        tdc.textContent = "Penaltis";
        trc.appendChild(tdc);
        table.appendChild(trc);

        for (var i = 0; i < jsonData.penaltis.length; i++) {            
            let tr = document.createElement("tr");
            if (jsonData.penaltis[i].gol > 0) {
                let td1 = document.createElement("td");
                td1.classList.add("col1gol");
                td1.classList.add("azul");
                td1.textContent = jsonData.penaltis[i].parcial;
                tr.appendChild(td1);
                let td2 = document.createElement("td");
                td2.innerHTML = jsonData.penaltis[i].tirador + " <img src='../../img/ico/gol.png'></img>";
                tr.appendChild(td2);
            } else {
                let td1 = document.createElement("td");
                td1.classList.add("col1gol");
                td1.classList.add("centrado");
                td1.innerHTML = "<img src='../../img/ico/error.png'></img>";
                tr.appendChild(td1);
                let td2 = document.createElement("td");
                td2.innerHTML = jsonData.penaltis[i].tirador + ", " + jsonData.penaltis[i].error + ".";
                tr.appendChild(td2);
            }            
            table.appendChild(tr);
        }
        tblPenaltis.appendChild(table);
    }    
}