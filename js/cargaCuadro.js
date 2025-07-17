const urlParams = new URLSearchParams(window.location.search);
const codigo = urlParams.get("temporada");
const categoria = urlParams.get("categoria");
let cat = "";
if (categoria === "f") {
    cat = "f";
}
const filePath = 'partidos/' + codigo.substring(0, 4) + '/' + codigo + '_cuadro' + cat + '.json';
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
    document.title = jsonData.titulo;
    let tituloHTML = document.getElementById('titulo');
    tituloHTML.textContent = jsonData.titulo;
    let botonAtras = document.getElementById('btnAtras');
    botonAtras.href = jsonData.atras;
    cargarCampeones(jsonData.campeones);
}

function cargarCampeones(jsonData, tablaId){
    let tblCampeones = document.getElementById('tblCampeones');

    for (var i = 0; i < jsonData.length; i++) {  
        let trc1 = document.createElement("tr");
        let td1 = document.createElement("td");
        td1.colSpan = "3";
        td1.textContent = "&nbsp;";
        trc1.appendChild(td1);
        tblCampeones.appendChild(trc1);

        let trc2 = document.createElement("tr");
        for (var j = 0; j < jsonData[i].length; j++) {   
            let td = document.createElement("td");
            td.classList.add("escudo");            
            let img = document.createElement("img");
            if (jsonData[i][j].campeon.includes("|")) {
                let img1 = document.createElement("img");
                img1.src = 'img/esc/' + jsonData[i][j].campeon.split("|")[0];
                let img2 = document.createElement("img");
                img2.src = 'img/esc/' + jsonData[i][j].campeon.split("|")[1];
                let img3 = document.createElement("img");
                img3.src = "img/ico/barra.png";
                td.appendChild(img1);
                td.appendChild(img3);
                td.appendChild(img2);
            } else {
                let img = document.createElement("img");
                img.src = 'img/esc/' + jsonData[i][j].campeon;
                td.appendChild(img);
            }            
            trc2.appendChild(td);
        }        
        tblCampeones.appendChild(trc2);

        let trc3 = document.createElement("tr");
        for (var j = 0; j < jsonData[i].length; j++) {
            let td = document.createElement("td");
            td.classList.add("azul");
            td.classList.add("centrado");
            td.innerHTML = jsonData[i][j].competicion;
            trc3.appendChild(td);
        }
        tblCampeones.appendChild(trc3);
    }    
}