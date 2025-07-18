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

function cargarLiga(jsonData) {
    let tblLiga = document.getElementById('tblLiga');

}

function cargarPrevias(jsonData) {
    cargarEliminatorias(jsonData, 'tblPrevias');
}
