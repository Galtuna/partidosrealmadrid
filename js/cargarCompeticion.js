const urlParams = new URLSearchParams(window.location.search);
const temporada = urlParams.get("temporada");
const competicion = urlParams.get("competicion");
const categoria = urlParams.get("categoria");
let cat = "";
if (categoria === "f") {
    cat = "f";
}
const filePath = 'partidos/' + temporada + '/' + temporada + '_' + competicion + cat + '.json';
const jsonData = JSON();

function JSON() {
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
    document.title = jsonData.titulo;
    let tituloHTML = document.getElementById('titulo');
    tituloHTML.textContent = jsonData.titulo;
    let botonAtras = document.getElementById('btnAtras');
    botonAtras.href = jsonData.atras;
    cargarEliminatorias(jsonData.eliminatorias, 'tblEliminatorias');
    cargarLiga(jsonData.liga);
    cargarPrevias(jsonData.previas);
}

function cargarEliminatorias(jsonData, idTabla) {
    let tblEliminatorias = document.getElementById(idTabla);
    
    if (jsonData.length > 0) {
        for (var i = 0; i < jsonData.length; i++) {   
            let trc1 = document.createElement("tr");            
            let td1 = document.createElement("td");
            td1.classList.add("azul");
            if (jsonData[i].unica) {
                td1.colSpan = "2";
            }
            td1.textContent = jsonData[i].nombre;
            trc1.appendChild(td1);
            tblEliminatorias.appendChild(trc1);

            let trc2 = document.createElement("tr");            
            if (jsonData[i].unica) {
                let td2 = document.createElement("td");
                td2.colSpan = "2";                
                let enlace = document.createElement("a");
                enlace.href = jsonData[i].enlace1;
                let img = document.createElement("img");
                img.classList.add("medio");
                img.src = 'img/ico/campo.png';
                enlace.appendChild(img);
                td2.innerHTML = jsonData[i].partido1 + ' ' + enlace.outerHTML;
                trc2.appendChild(td2);
            }  else {
                let td2 = document.createElement("td");
                let span1 = document.createElement("span");
                span1.classList.add("azul");    
                span1.textContent = "Ida: ";                          
                let enlace1 = document.createElement("a");
                enlace1.href = jsonData[i].enlace1;
                let img = document.createElement("img");
                img.classList.add("medio");
                img.src = 'img/ico/campo.png';
                enlace1.appendChild(img);
                td2.innerHTML = span1.outerHTML + jsonData[i].partido1 + ' ' + enlace1.outerHTML;
                trc2.appendChild(td2);
                let td3 = document.createElement("td");
                let span2 = document.createElement("span");
                span2.classList.add("azul");    
                span2.textContent = "Vuelta: ";                          
                let enlace2 = document.createElement("a");
                enlace2.href = jsonData[i].enlace2;                
                enlace2.appendChild(img);
                td3.innerHTML = span2.outerHTML + jsonData[i].partido2 + ' ' + enlace2.outerHTML;
                trc2.appendChild(td3);
            }
            tblEliminatorias.appendChild(trc2);

            // Agregar fila de separación si no es la última vuelta del bucle
            if (i < jsonData.length - 1) {
                let trc3 = document.createElement("tr");
                let td3 = document.createElement("td");
                if (jsonData[i].unica) {
                    td3.colSpan = "2";
                }
                td3.innerHTML = "&nbsp;";
                trc3.appendChild(td3);
                tblEliminatorias.appendChild(trc3);
            }
        }
    }
}

function cargarLiga(jsonData) {
    cargarPartidos(jsonData, 'tblLiga');
    cargarClasificacion(jsonData, 'tblLiga');
}

function cargarPrevias(jsonData) {
    cargarEliminatorias(jsonData, 'tblPrevias');
}

function cargarPartidos(jsonData, idTabla) {
    let tblPartidos = document.getElementById(idTabla);

    if (jsonData.grupo != "") {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        td1.colSpan = "2";
        td1.classList.add("azul");
        td1.textContent = jsonData.grupo;
        tr.appendChild(td1);
        tblPartidos.appendChild(tr);
    }

    if (jsonData.jornadas.length > 0) {
        let medio = jsonData.jornadas.length % 2 === 0 ? jsonData.jornadas.length / 2 : (jsonData.jornadas.length + 1) / 2;
        for (var i = 0; i < medio; i++) {
            let tr = document.createElement("tr");
            let td1 = document.createElement("td");
            let span1 = document.createElement("span");
            span1.classList.add("azul");    
            span1.textContent = "Jornada " + jsonData.jornadas[i].jornada + ": ";                          
            let enlace1 = document.createElement("a");
            enlace1.href = jsonData.jornadas[i].enlace1;
            let img = document.createElement("img");
            img.classList.add("medio");
            img.src = 'img/ico/campo.png';
            enlace1.appendChild(img);
            td1.innerHTML = span1.outerHTML + jsonData.jornadas[i].partido + ' ' + enlace1.outerHTML;
            tr.appendChild(td1);
            let td2 = document.createElement("td");
            let span2 = document.createElement("span");
            span2.classList.add("azul");    
            span2.textContent = "Jornada " + jsonData.jornadas[i + medio].jornada + ": ";                        
            let enlace2 = document.createElement("a");
            enlace2.href = jsonData.jornadas[i + medio].enlace;                
            enlace2.appendChild(img);
            td2.innerHTML = span2.outerHTML + jsonData.jornadas[i + medio].partido + ' ' + enlace2.outerHTML;
            tr.appendChild(td2);
            tblPartidos.appendChild(tr);
        }
    }

    let trc3 = document.createElement("tr");
    let td3 = document.createElement("td");    
    td3.colSpan = "2";
    td3.innerHTML = "&nbsp;";
    trc3.appendChild(td3);
    tblPartidos.appendChild(trc3);
}

function cargarClasificacion(jsonData, idTabla) {
    let tblContenedor = document.getElementById(idTabla);
    let trContenedor = document.createElement("tr");
    let tdContenedor = document.createElement("td");
    tdContenedor.colSpan = "2";
        
    let tblClasificacion = document.createElement("table");
    tblClasificacion.id = "tblClasificacion";
    let trHeader = document.createElement("tr");
    let th1 = document.createElement("th");
    th1.colSpan = "2";
    th1.innerHTML = "&nbsp;";
    trHeader.appendChild(th1);
    let th2 = document.createElement("th");
    th2.classList.add("derecha");
    th2.textContent = "PJ";
    trHeader.appendChild(th2);
    let th3 = document.createElement("th");
    th3.classList.add("derecha");
    th3.textContent = "G";
    trHeader.appendChild(th3);
    let th4 = document.createElement("th");
    th4.classList.add("derecha");
    th4.textContent = "E";
    trHeader.appendChild(th4);
    let th5 = document.createElement("th");
    th5.classList.add("derecha");
    th5.textContent = "P";
    trHeader.appendChild(th5);
    let th6 = document.createElement("th");
    th6.classList.add("derecha");
    th6.textContent = "GF";
    trHeader.appendChild(th6);
    let th7 = document.createElement("th");
    th7.classList.add("derecha");
    th7.textContent = "GC";
    trHeader.appendChild(th7);
    let th8 = document.createElement("th");
    th8.classList.add("derecha");
    th8.classList.add("azul");
    th8.textContent = "Pts";
    trHeader.appendChild(th8);
    tblClasificacion.appendChild(trHeader);

    for (let i = 0; i < jsonData.clasificacion.length; i++) {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        td1.classList.add("derecha");
        td1.textContent = jsonData.clasificacion[i].posicion;
        tr.appendChild(td1);
        let td2 = document.createElement("td");
        td2.classList.add("azul");
        td2.textContent = jsonData.clasificacion[i].equipo;
        tr.appendChild(td2);        
        let td3 = document.createElement("td");
        td3.classList.add("derecha");
        td3.textContent = jsonData.clasificacion[i].pj;
        tr.appendChild(td3);
        let td4 = document.createElement("td");
        td4.classList.add("derecha");
        td4.textContent = jsonData.clasificacion[i].pg;
        tr.appendChild(td4);
        let td5 = document.createElement("td");
        td5.classList.add("derecha");
        td5.textContent = jsonData.clasificacion[i].pe;
        tr.appendChild(td5);
        let td6 = document.createElement("td");
        td6.classList.add("derecha");
        td6.textContent = jsonData.clasificacion[i].pp;
        tr.appendChild(td6);
        let td7 = document.createElement("td");
        td7.classList.add("derecha");
        td7.textContent = jsonData.clasificacion[i].gf;
        tr.appendChild(td7);
        let td8 = document.createElement("td");
        td8.classList.add("derecha");
        td8.textContent = jsonData.clasificacion[i].gc;
        tr.appendChild(td8);
        let td9 = document.createElement("td");
        td9.classList.add("derecha");
        td9.classList.add("azul");
        td9.textContent = jsonData.clasificacion[i].puntos;
        tr.appendChild(td9);
        tblClasificacion.appendChild(tr);
    }

    tdContenedor.appendChild(tblClasificacion);
    trContenedor.appendChild(tdContenedor);
    tblContenedor.appendChild(trContenedor);
}

