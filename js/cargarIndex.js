const urlParams = new URLSearchParams(window.location.search);
const codigo = urlParams.get("temporada");
const categoria = urlParams.get("categoria");
let cat = "";
if (categoria === "f") {
    cat = "f";
}
const filePath = 'partidos/' + codigo.substring(0, 4) + '/' + codigo + '_index' + cat + '.json';
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
    let botonCuadro = document.getElementById('btnCuadro');
    botonCuadro.href = jsonData.cuadro;
    cargarCompeticiones(jsonData.competiciones1, 'competiciones1');
    cargarCompeticiones(jsonData.competiciones2, 'competiciones2');
}

function cargarCompeticiones(jsonData, tablaId){
    let tblCompeticiones = document.getElementById(tablaId);

    if (jsonData.length > 0) {        
        let trc1 = document.createElement("tr");
        let trc2 = document.createElement("tr");
        
        for (var i = 0; i < jsonData.length; i++) {   
            let td = document.createElement("td");
            td.classList.add("centrado");
            let enlace = document.createElement("a");
            enlace.href = jsonData[i].enlace;
            let img = document.createElement("img");
            img.src = 'img/ico/' + jsonData[i].imagen;
            td.appendChild(enlace);
            td.appendChild(img);
            trc1.appendChild(td);
        }
        for (var i = 0; i < jsonData.length; i++) {
            let td = document.createElement("td");
            td.classList.add("azul");
            td.classList.add("centrado");
            td.innerHTML = jsonData[i].nombre + (jsonData[i].campeon ? ' <img src="img/ico/campeon.png" />' : '');            
            trc2.appendChild(td);
        }
        tblCompeticiones.appendChild(trc1);
        tblCompeticiones.appendChild(trc2);
    }    
}