var Http = (function () {
    function Http() {
    }
    Http.get = function (url, callBack) {
        requestServer(url, "get", callBack);
    }

    Http.getDownloadBytes = function (url, callBack) {
        requestServer(url, "get", callBack, null, "arraybuffer");
    }

    Http.post = function (url, callBack, data) {
        requestServer(url, "post", callBack, data);
    }

    Http.postDownloadBytes = function (url, callBack, data) {
        requestServer(url, "post", callBack, data, "arraybuffer");
    }

    function requestServer(url, metodoHttp, callBack, data, tipoRpta) {
        var xhr = new XMLHttpRequest();
        xhr.open(metodoHttp, hdfRaiz.value + url);
        if (tipoRpta != null) xhr.responseType = tipoRpta;
        xhr.onreadystatechange = function () {
            if (xhr.status == 200 && xhr.readyState == 4) {
                if (tipoRpta == "arraybuffer") callBack(xhr.response);
                else callBack(xhr.responseText);
            }
        }
        if (data != null) xhr.send(data);
        else xhr.send();
    }
    return Http;
})();

function validarInformacion(clase) {
    var nObligatorio = validarObligatorio(clase);
    if (nObligatorio != "0") {
        mostrarMensaje("Los datos en rojo es obligatorio", "error");
    }
    return (nObligatorio == "0");
}

function validarObligatorio(clase) {
    var controles = document.getElementsByClassName(clase);
    var control;
    var nControles = controles.length;
   // var fila;
    var nObligatorio = 0;
    for (var j = 0; j < nControles; j++) {
        control = controles[j];
        if (control.value == "") {
           // fila = control.parentNode.parentNode;
            control.style.borderColor = "red";
            //$('.select2-selection').css('border-color', 'blue');
            nObligatorio = nObligatorio + 1;
        }
        else {
            control.style.borderColor = "";
        }
    }
    return nObligatorio;
}


function crearCombo(lista, idCombo, primerItem) {
    var contenido = "";
    if (primerItem != null && primerItem != "") {
        contenido += "<option value=''>";
        contenido += primerItem;
        contenido += "</option>";
    }
    var nRegistros = lista.length;
    var campos = [];
    for (var i = 0; i < nRegistros; i++) {
        campos = lista[i].split('|');
        if (campos[1] != null) {
            contenido += "<option value='";
            contenido += campos[0];
            contenido += "'>";
            contenido += campos[1];
        }
        else {
            contenido += "<option value=''>";
        }
        contenido += "</option>";
    }
    var cbo = document.getElementById(idCombo);
    if (cbo != null) cbo.innerHTML = contenido;
}


function guardarUrl() {
    var urlBase = document.getElementById("hdfRaiz").value;
    window.localStorage.setItem("urlBase", urlBase);
}

function validarDatosForm(clsRequerido, span) {
    var mensaje = validarRequeridos(clsRequerido);
    var spnValida = document.getElementById(span);

    if (mensaje == "") {
        mensaje = validarNumeros("Numero");
        if (mensaje == "") spnValida.innerHTML = "";
        else spnValida.innerHTML = "<ul>" + mensaje + "</ul>";
    }
    else {
        spnValida.innerHTML = "<ul>" + mensaje + "</ul>";
    }
    return (mensaje == "");
}

function validarRequeridos(clase) {
    var controles = document.getElementsByClassName(clase);
    var control;
    var nControles = controles.length;
    var fila;
    var mensaje = "";
    for (var j = 0; j < nControles; j++) {
        control = controles[j];
        if (control.value == "") {
            fila = control.parentNode.parentNode;
            mensaje += "<li>Ingresa ";
            mensaje += control.getAttribute("data-msg");
            mensaje += "</li>";
            control.style.borderColor = "red";
        }
        else {
            control.style.borderColor = "";
        }
    }
    return (mensaje);
}
function validarNumeros(clase) {
    var controles = document.getElementsByClassName(clase);
    var control;
    var nControles = controles.length;
    var fila;
    var mensaje = "";
    for (var j = 0; j < nControles; j++) {
        control = controles[j];
        if (isNaN(control.value)) {
            fila = control.parentNode.parentNode;
            mensaje += "<li>";
            mensaje += control.getAttribute("data-msg");
            mensaje += " debe ser numérico</li>";
            control.style.borderColor = "red";
        }
        else {
            if ((control.value * 1) < 0) {
                fila = control.parentNode.parentNode;
                mensaje += "<li>";
                mensaje += control.getAttribute("data-msg");
                mensaje += " debe ser numérico mayor o igual a cero</li>";
                control.style.borderColor = "red";
            }
            else control.style.borderColor = "";
        }
    }
    return (mensaje);
}

function navegar(url) {
    var urlBase = window.localStorage.getItem("urlBase");
    window.location.href = urlBase + url;
}

function obtenerVista(control, vista, controller) {
    window.sessionStorage.setItem("Vista", vista);
    window.sessionStorage.setItem("Controller", controller);
    var mod = control.parentNode.parentNode.parentNode.parentNode.parentNode.id;
    window.sessionStorage.setItem("mod", mod);
    var me = control.parentNode.parentNode.parentNode.id;
    window.sessionStorage.setItem("me", me);
    var subme = control.parentNode.id;
    window.sessionStorage.setItem("subme", subme);
}

//function obtenerVista(control,vista,controller) {
//    window.sessionStorage.setItem("Vista", vista);
//    window.sessionStorage.setItem("Controller", controller);
//    var menuId = control.parentNode.id;
//    var opcionId = control.id;
//    window.sessionStorage.setItem("menuId", menuId);
//    window.sessionStorage.setItem("opcionId", opcionId);
//}

function mensajeAlerta(mensaje, alerta) {
    if (alerta == "error") {
        Swal.fire({
            icon: "error",
            title: "Alerta del Sistema",
            text: mensaje,
            confirmButtonColor: '#2143FD',
            closeOnCancel: false,
            closeOnConfirm: false,
            allowOutsideClick: false
        })
    }
    else if (alerta == "info") {
        Swal.fire({
            icon: "info",
            title: "Información del Sistema",
            text: mensaje,
            confirmButtonColor: '#2143FD',
            closeOnCancel: false,
            closeOnConfirm: false,
            allowOutsideClick: false
        })
    }
    else {
        Swal.fire({
            icon: "success",
            title: "Correcto",
            text: mensaje,
            confirmButtonColor: '#2143FD',
            closeOnCancel: false,
            closeOnConfirm: false,
            allowOutsideClick: false
        })
    }
}

function mostrarMensaje(mensaje, status) {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    toastr[status](mensaje, "")
}

function moverVentana(divContainer, divWindow, divBarra) {
    var divBarra = document.getElementById(divBarra);
    divBarra.draggable = true;
    divBarra.ondragstart = function (event) {
        var divPopupWindow = document.getElementById(divWindow);
        var ancho = getComputedStyle(divPopupWindow, null).getPropertyValue("left");
        var alto = getComputedStyle(divPopupWindow, null).getPropertyValue("top");
        var a = Math.floor(ancho.replace("px", ""));
        var b = Math.floor(alto.replace("px", ""));
        var x = (event.clientX > a ? event.clientX - a : a - event.clientX);
        var y = (event.clientY > b ? event.clientY - b : b - event.clientY);
        var punto = x + "," + y;
        event.dataTransfer.setData("text", punto);
    }
    divBarra.ondragover = function (event) {
        event.preventDefault();
    }

    var divPopupContainer = document.getElementById(divContainer);
    divPopupContainer.ondragover = function (event) {
        event.preventDefault();
    }
    divPopupContainer.ondrop = function (event) {
        event.preventDefault();
        var x1 = event.clientX;
        var y1 = event.clientY;
        var puntoInicial = event.dataTransfer.getData("text");
        var punto = puntoInicial.split(",");
        var x2 = punto[0] * 1;
        var y2 = punto[1] * 1;
        var divPopupWindow = document.getElementById(divWindow);
        divPopupWindow.style.left = (x1 - x2) + "px";
        divPopupWindow.style.top = (y1 - y2) + "px";
    }
}
var divPopupContainer = document.getElementById("divPopupContainer");
if (divPopupContainer != null) moverVentana("divPopupContainer", "divPopupWindow", "divBarra");

var divPopupContainerForm1 = document.getElementById("divPopupContainerForm1");
if (divPopupContainerForm1 != null) moverVentana("divPopupContainerForm1", "divPopupWindowForm1", "divBarraForm1");

var divPopupContainerForm2 = document.getElementById("divPopupContainerForm2");
if (divPopupContainerForm2 != null) moverVentana("divPopupContainerForm2", "divPopupWindowForm2", "divBarraForm2");

var divPopupContainerForm3 = document.getElementById("divPopupContainerForm3");
if (divPopupContainerForm3 != null) moverVentana("divPopupContainerForm3", "divPopupWindowForm3", "divBarraForm3");

function formatoNumeroDecimal(num) {
    if (!num || num == 'NaN') return '-';
    if (num == 'Infinity') return '&#x221e;';
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
}

function formatoNumeroEntero(num) {
    if (!num || num == 'NaN') return '-';
    if (num == 'Infinity') return '&#x221e;';
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num);
}

function limpiarForm(clase) {
    var controles = document.getElementsByClassName(clase);
    var nControles = controles.length;
    var control;
    var tipo;
    for (var j = 0; j < nControles; j++) {
        control = controles[j];
        tipo = control.id.substr(0, 3);
        if (tipo == "chk" || tipo == "opt") {
            control.checked = false;
        }
        else {
            controles[j].value = "";
            controles[j].style.borderColor = "";
        }
    }

    var divValida = document.getElementById("divValida");
    if (divValida!=null) divValida.style.display = 'none';
}

function contadorHoras(segundos) {
    var hour = Math.floor(segundos / 3600);
    hour = (hour < 10) ? '0' + hour : hour;
    var minute = Math.floor((segundos / 60) % 60);
    minute = (minute < 10) ? '0' + minute : minute;
    var second = segundos % 60;
    second = (second < 10) ? '0' + second : second;
    return hour + ':' + minute + ':' + second;
}

function reproducirVoz(texto) {
    speechSynthesis.speak(new SpeechSynthesisUtterance(texto));
}

function limpiarChecks(clase) {
    var controles = document.getElementsByClassName(clase);
    var nControles = controles.length;
    var control;
    for (var i = 0; i < nControles; i++) {
        control = controles[i];
        control.checked = false;
    }
}
function getConfigMn() {
    var mod = window.sessionStorage.getItem("mod");
    document.getElementById(mod).classList.add("pcoded-trigger");

    var men = window.sessionStorage.getItem("me");
    document.getElementById(men).classList.add("active");
    document.getElementById(men).classList.add("pcoded-trigger");

    var subme = window.sessionStorage.getItem("subme");
    document.getElementById(subme).classList.add("active");
}

//function getConfigMn() {
//    var menuId = window.sessionStorage.getItem("menuId");
//    var opcionId = window.sessionStorage.getItem("opcionId");
//    document.getElementById(menuId).classList.add("active");
//    document.getElementById(opcionId).setAttribute('data-active',true);
//}

function validarURL(url) {
    var res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (res == null)
        return false;
    else
        return true;
}

var botones = [
    { "cabecera": "Editar", "clase": "fa fa-pencil btn btn-info btnCirculo", "id": "Editar" },
    { "cabecera": "Anular", "clase": "fa fa-minus-circle btn btn-danger btnCirculo", "id": "Eliminar" },
];

function GrillaScroll(lista, divGrilla, registrosPagina, paginasBloque, tabla, controlador, listas, sinFiltros, sinReporte, botones, altoGrilla, tieneFiltro, tieneChecks, tieneMensajeRegistros, tieneOrden) {
    var nListas = (listas != null ? listas.length : 0);
    var matriz = [];
    var ordenIndice = 0;
    var ordenTipo = 0;

    var indicePagina = 0;
    if (registrosPagina == null) registrosPagina = 20;
    var indiceBloque = 0;
    if (paginasBloque == null) paginasBloque = 10;
    var archivo;
    var cabeceras = [];
    var anchos = [];
    var tipos = [];
    botones = (botones == null ? [] : botones);
    var nBotones = botones.length;
    var existeFiltro = (tieneFiltro == null);
    var existeChecks = (tieneChecks != null);
    var tieneMensajeRegistros = (tieneMensajeRegistros == null ? true : tieneMensajeRegistros);
    tieneOrden = (tieneOrden == null ? true : tieneOrden);
   var ids = [];

    iniciarGrilla();

    function iniciarGrilla() {
        crearTabla();
        llenarCombos();
        filtrarMatriz();
        configurarFiltros();
        if (tieneOrden) configurarOrdenacion();
        configurarPaginacion();
        configurarBotones();
    }

    function crearTabla() {
        cabeceras = lista[0].split("|");
        anchos = lista[1].split("|");
        tipos = lista[2].split("|");

        var nRegistros = lista.length;
        var nCampos = cabeceras.length;
        var contenido = contenido = "<div class='table-container' style='height:" + altoGrilla + "em;'>";
        contenido += "<div>";
        contenido += "<div style='text-align: right;'>";
        if (sinFiltros == null) {
            contenido += "<button id='btnLimpiar";
            contenido += divGrilla;
            contenido += "' type='button' class='btn btn-warning btn-sm'>";
            contenido += "<i class='fa fa-paint-brush'></i>";
            contenido += "</button>";
        }
        if (existeFiltro) {
            contenido += "<button id='btnFiltro";
            contenido += divGrilla;
            contenido += "' type='button' value='Filtro' title='";
            contenido += (sinFiltros == null ? "Quitar Filtro" : "Activar Filtro");
            contenido += "' class='btn btn-info btn-sm'>";
            contenido += "<i class='fa fa-filter'></i>";
            contenido += "</button>";
        }
        if (sinReporte) {
            contenido += "<div class='btn-group' role='group'>";
            contenido += "<button id='btnGroupDropExportarGrilla' type='button' class='btn btn-success btn-sm dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
            contenido += "<i class='fa fa-cloud-download' aria-hidden='true'></i>Exportar";
            contenido += "</button>";
            contenido += "<div class='dropdown-menu' aria-labelledby='btnGroupDropExportarGrilla'>";
            contenido += "<button id='btnImprimir";
            contenido += divGrilla;
            contenido += "' type='button' class='dropdown-item'>";
            contenido += "<i class='fa fa-print text-c-blue'></i> Imprimir";
            contenido += "</button>";
            contenido += "<div role='separator' class='dropdown-divider'></div>";
            contenido += "<button id='btnExportarXlsx";
            contenido += divGrilla;
            contenido += "' type='button' class='dropdown-item'>";
            contenido += "<i class='fa fa-file-excel-o text-c-green' aria-hidden='true'></i> Excel";
            contenido += "</button>";
            contenido += "<button id='btnExportarDocx";
            contenido += divGrilla;
            contenido += "' type='button' class='dropdown-item' style='display:none'>";
            contenido += "<i class='fa fa-file-word-o' aria-hidden='true'></i> Word";
            contenido += "</button>";
            contenido += "<button id='btnExportarPdf";
            contenido += divGrilla;
            contenido += "' type='button' class='dropdown-item'>";
            contenido += "<i class='fa fa-file-pdf-o text-c-red' aria-hidden='true'></i> PDF";
            contenido += "</button>";
            contenido += "</div>";
            contenido += "</div>";
        }

        contenido += "</div>";
        contenido += "</div>";
        contenido += "<table class='grilla bordered Tabla table-scroll' id='tbl";
        contenido += divGrilla;
        contenido += "'>";
        contenido += "<thead><tr class='FilaHead'>";

        if (existeChecks) {
            contenido += "<th style='width:30px' class='NoImprimir'>";
            contenido += "<input type='checkbox' class='selcheckbox' />";
            contenido += "</th>";
        }
        var totalancho = 0;
        var prefijo = "";
        var ancho;
        for (var j = 0; j < nCampos; j++) {
            prefijo = anchos[j].substr(0, 1);
            contenido += "<th style='white-space:pre-wrap;width:";
            if (prefijo == "c") ancho = anchos[j].substr(1, anchos[j].length - 1);
            else ancho = anchos[j];
            totalancho = totalancho + (ancho * 1);
            contenido += ancho;
            contenido += "px";
            if (j == 0) contenido += ";display:none";
            contenido += "'>";
            contenido += "<span class='Enlace ";
            contenido += divGrilla;
            contenido += "Enlace' data-ind='";
            contenido += j;
            contenido += "'>";
            contenido += cabeceras[j];
            contenido += "</span>";
            if (sinFiltros == null) {
                contenido += "<br/>";
                switch (prefijo) {
                    case "c":
                        contenido += "<select class='";
                        contenido += divGrilla;
                        contenido += "Cabecera Combo control-form' style='width:90%";
                        if (sinFiltros != null) contenido += ";display:none"
                        contenido += "'>";
                        break;
                    default:
                        contenido += "<input type='text' class='";
                        contenido += divGrilla;
                        contenido += "Cabecera Texto' style='color:black; width:90%";
                        if (sinFiltros != null) contenido += ";display:none"
                        contenido += "'>";
                        break;
                }
            }
            contenido += "</th>";
        }
        if (nBotones > 0) {
            contenido += "<th style='width:80px'>";
           // contenido += botones[j].cabecera;
            contenido += "</th>";
            //for (var j = 0; j < nBotones; j++) {
            //    contenido += "<th style='width:50px'>";
            //    contenido += botones[j].cabecera;
            //    contenido += "</th>";
            //}
        }
        contenido += "</tr></thead><tbody id='tbData";
        contenido += divGrilla;
        contenido += "'>";
        contenido += "</tbody>";
        contenido += "</table>";
        contenido += "<div>";

        contenido += "<div style='margin-top:10px'>";

        if (tieneMensajeRegistros) {
            contenido += "<div style='float:left;width:30%;text-align:left'>";
            contenido += "Registros: <span id='spnRegistros";
            contenido += divGrilla;
            contenido += "' class='font-weight-bold'></span>";
            contenido += "</div>";
        }

        contenido += "<div id='tdPagina";
        contenido += divGrilla;
        contenido += "' style='float:left;width:70%;text-align:right'>";
        contenido += "</div>";

        contenido += "</div>";


        document.getElementById(divGrilla).innerHTML = contenido;
        var ancho = document.getElementById("tbl" + divGrilla).clientWidth;
        if (totalancho > ancho) {
            document.getElementById("tbl" + divGrilla).style.width = totalancho + 'px';
        }

    }

    function llenarCombos() {
        if (nListas > 0) {
            var combos = document.getElementsByClassName("Combo");
            console.log(combos);
            for (var j = 0; j < nListas; j++) {
                crearComboObj(listas[j].split("¬"), combos[j], "Todos");
            }
        }
    }

    function crearMatriz() {
        matriz = [];
        var campos = [];
        var nRegistros = lista.length;
        var nCampos = lista[0].split('|').length;
        var contenido = "";
        var valores = [];
        var controles = document.getElementsByClassName(divGrilla + "Cabecera");
        var nControles = controles.length;
        var control;
        var valor = "";
        if (sinFiltros == null) {
            for (var j = 0; j < nControles; j++) {
                control = controles[j];
                if (control.className.indexOf("Combo") > -1) {
                    valores.push(control.options[control.selectedIndex].text.toLowerCase());
                }
                else valores.push(control.value.toLowerCase());
            }
        }
        //else {
        //    var txtSearch = document.getElementById("txtSearch" + divGrilla);
        //    if (txtSearch != null) valor = txtSearch.value.toLowerCase();
        //}
        var c = 0;
        var exito = true;
        var fila = [];
        var nFilas = lista[3].length;
        if (nFilas > 0 && lista[3] != "" && lista[3] != null) {
            for (var i = 3; i < nRegistros; i++) {
                campos = lista[i].split("|");

                exito = true;
                if (sinFiltros == null) {
                    for (var j = 0; j < nControles; j++) {
                        control = controles[j];
                        if (control.className.indexOf("Combo") > -1) {
                            exito = (valores[j] == "todos" || campos[j].toLowerCase() == valores[j]);
                        }
                        else exito = (valores[j] == "" || campos[j].toLowerCase().indexOf(valores[j]) > -1);
                        if (!exito) break;
                    }
                }
                else {
                    for (var j = 0; j < nCampos; j++) {
                        exito = (valor == "" || campos[j].toLowerCase().indexOf(valor) > -1);
                        if (exito) break;
                    }
                }
                if (exito) {
                    c++;
                    fila = [];
                    for (var j = 0; j < nCampos; j++) {
                        if (campos[j] == "" || isNaN(campos[j])) fila.push(campos[j]);
                        else {
                            if (campos[j].substr(0, 1) == "0") fila.push(campos[j]);
                            else fila.push(+campos[j]);
                        }
                    }
                    matriz.push(fila);
                }
            }
        }
    }

    function mostrarMatriz() {
        var contenido = "";
        var campos = [];
        var nRegistros = matriz.length;
        var prefijo = "";

        if (nRegistros > 0) {
            var nCampos = matriz[0].length;
            var tipos = lista[2].split("|");
            var inicio = indicePagina * registrosPagina;
            var fin = inicio + (sinFiltros == null ? registrosPagina : nRegistros);
            var valor = "";
            for (var i = inicio; i < fin; i++) {
                if (i < nRegistros) {
                    seleccionada = (ids.indexOf(matriz[i][0].toString()) > -1);
                    contenido += "<tr class='";
                    contenido += (seleccionada ? "FilaSeleccionada" : "FilaDatos");
                    contenido += "' onclick='seleccionarFila(this, \"";
                    contenido += matriz[i][0];
                    contenido += "\",\"";
                    contenido += divGrilla;
                    contenido += "\");'>";
                    if (existeChecks) {
                        contenido += "<td style='width:30px' class='NoImprimir'>";;
                        contenido += "<input type='checkbox' class='selcheckbox' ";
                        contenido += (seleccionada ? 'checked ' : '');
                        contenido += "/>";
                        contenido += "</td>";
                    }
                    for (var j = 0; j < nCampos; j++) {
                        prefijo = anchos[j].substr(0, 1);
                        //alert(matriz[i][j]);
                        contenido += "<td style='white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:";
                        if (prefijo == "c") ancho = anchos[j].substr(1, anchos[j].length - 1);
                        else ancho = anchos[j];
                        contenido += ancho;
                        contenido += "px";
                        if (j == 0) contenido += ";display:none";
                        contenido += ";text-align:";

                        switch (tipos[j]) {
                            case "Int32":
                                contenido += "right";
                                valor = matriz[i][j];
                                break;
                            case "Int64":
                                contenido += "right";
                                valor = matriz[i][j];
                                break;
                            case "Decimal":
                                contenido += "right";
                                valor = formatoNumeroDecimal(matriz[i][j]);
                                break;
                            case "String":
                                contenido += "left";
                                valor = matriz[i][j];
                                break;
                            case "DateTime":
                                contenido += "center";
                                valor = matriz[i][j];
                                break;
                        }
                        contenido += "' title = '";
                        contenido += valor;
                        contenido += "'>";
                        contenido += valor;
                        contenido += "</td>";
                    }
                    if (nBotones > 0) {
                        contenido += "<td style='width:80px'>";
                        for (var j = 0; j < nBotones; j++) {
                            contenido += "<i class='";
                            contenido += botones[j].clase;
                            contenido += " BotonGrilla";
                            contenido += divGrilla;
                            contenido += "' data-id='";
                            contenido += botones[j].id;
                            contenido += "'aria-hidden='true' Title='";
                            contenido += botones[j].cabecera;
                            contenido += "'></i > ";
                        }
                        contenido += "</td>";
                    }
                    contenido += "</tr>";
                }
                else break;
            }
        }
        else {
            var nCampos = lista[0].split('|').length;
            contenido += "<tr>";
            contenido += "<td style='text-align:center' colspan='";
            contenido += nCampos;
            contenido += "'>";
            contenido += "No se encontraron registros";
            contenido += "</td>";
            contenido += "</tr>";
        }

        document.getElementById("tbData" + divGrilla).innerHTML = contenido;
        var CantidaddivGrilla = document.getElementById("spnRegistros" + divGrilla);
        if (CantidaddivGrilla!=null)document.getElementById("spnRegistros" + divGrilla).innerHTML = formatoNumeroEntero(nRegistros);
        crearPaginacion();
        configurarSelCheckBox();
        if (nBotones > 0) configurarBotonesExtra();
    }

    function configurarBotonesExtra() {
        var btns = document.getElementsByClassName("BotonGrilla" + divGrilla);
        var nBtns = btns.length;
        for (var j = 0; j < nBtns; j++) {
            btns[j].onclick = function () {
                var n = (existeChecks ? 1 : 0);
                var fila = this.parentNode.parentNode;
                var idRegistro = fila.childNodes[n].innerText;
                seleccionarBoton(divGrilla, idRegistro, this.getAttribute("data-id"));
            }
        }
    }

    function configurarFiltros() {
        var cabeceras = document.getElementsByClassName(divGrilla + "Cabecera");
        var nCabeceras = cabeceras.length;
        var cabecera;
        for (var i = 0; i < nCabeceras; i++) {
            cabecera = cabeceras[i];
            if (cabecera.className.indexOf("Combo") > -1) {
                cabecera.onchange = function () { filtrarMatriz() };
            }
            else cabecera.onkeyup = function (event) { filtrarMatriz() };
        }
        var txtSearch = document.getElementById("txtSearch" + divGrilla);
        if (txtSearch != null) {
            txtSearch.onkeyup = function (event) { console.log(this.value); filtrarMatriz(); }
        }
    }

    function configurarOrdenacion() {
        var enlaces = document.getElementsByClassName(divGrilla + "Enlace");
        var nEnlaces = enlaces.length;
        var enlace;
        for (var i = 0; i < nEnlaces; i++) {
            enlace = enlaces[i];
            enlace.onclick = function () { ordenar(this, this.getAttribute("data-ind") * 1); }
        }
    }

    function configurarPaginacion() {
        var paginas = document.getElementsByClassName(divGrilla + "Pagina");
        var nPaginas = paginas.length;
        var pagina;
        for (var i = 0; i < nPaginas; i++) {
            pagina = paginas[i];
            pagina.onclick = function () { paginar(this.getAttribute("data-pag") * 1); }
        }
    }

    function crearPaginacion() {
        var contenido = "";
        var nRegistros = matriz.length;
        var indiceUltimaPagina = Math.floor(nRegistros / registrosPagina);
        if (nRegistros % registrosPagina == 0) indiceUltimaPagina--;
        var registrosBloque = Math.floor(registrosPagina * paginasBloque);
        var indiceUltimoBloque = Math.floor(nRegistros / registrosBloque);
        if (nRegistros % registrosBloque == 0) indiceUltimoBloque--;
        if (nRegistros > registrosPagina) {
            if (indiceBloque > 0) {
                contenido += "<input type='button' class='Pagina ";
                contenido += divGrilla;
                contenido += "Pagina' value='<<' data-pag='-1'/>";
                contenido += "<input type='button' class='Pagina ";
                contenido += divGrilla;
                contenido += "Pagina' value='<' data-pag='-2'/>";
            }
            var inicio = indiceBloque * paginasBloque;
            var fin = inicio + paginasBloque;
            for (var i = inicio; i < fin; i++) {
                if (i <= indiceUltimaPagina) {
                    contenido += "<input type='button' class='Pagina";
                    if (indicePagina == i) contenido += "Sel";
                    contenido += " ";
                    contenido += divGrilla;
                    contenido += "Pagina' value='";
                    contenido += (i + 1);
                    contenido += "' data-pag='";
                    contenido += i;
                    contenido += "'/>";
                }
                else break;
            }
            if (indiceBloque < indiceUltimoBloque) {
                contenido += "<input type='button' class='Pagina ";
                contenido += divGrilla;
                contenido += "Pagina' value='>' data-pag='-3'/>";
                contenido += "<input type='button' class='Pagina ";
                contenido += divGrilla;
                contenido += "Pagina' value='>>' data-pag='-4'/>";
            }
        }
        document.getElementById("tdPagina" + divGrilla).innerHTML = contenido;
        configurarPaginacion();
    }

    function filtrarMatriz() {
        indicePagina = 0;
        indiceBloque = 0;
        crearMatriz();
        mostrarMatriz();
    }

    function ordenar(span, indice) {
        ordenIndice = indice;
        var simbolo = "▲";
        ordenTipo = 0;
        if (span.innerHTML.indexOf("▲") > -1 || span.innerHTML.indexOf("▼") > -1) {
            if (span.innerHTML.indexOf("▲") > -1) simbolo = "▼";
            matriz.reverse();
        }
        else matriz.sort(ordenaAsc);
        borrarSimboloOrden();
        span.innerHTML += " " + simbolo;
        mostrarMatriz();
    }

    function ordena(x, y) {
        var valX = x[ordenIndice];
        var valY = y[ordenIndice];
        if (ordenTipo == 0) return (valX > valY ? 1 : -1);
        else return (valX < valY ? 1 : -1);
    }

    function ordenaAsc(x, y) {
        var valX = x[ordenIndice];
        var valY = y[ordenIndice];
        return (valX > valY ? 1 : -1);
    }

    function borrarSimboloOrden() {
        var enlaces = document.getElementsByClassName(divGrilla + "Enlace");
        var nEnlaces = enlaces.length;
        var enlace;
        for (var i = 0; i < nEnlaces; i++) {
            enlace = enlaces[i];
            enlace.innerHTML = enlace.innerHTML.replace("▲", "").replace("▼", "");
        }
    }

    function paginar(indice) {
        if (indice > -1) indicePagina = indice;
        else {
            var nRegistros = matriz.length;
            var indiceUltimaPagina = Math.floor(nRegistros / registrosPagina);
            if (nRegistros % registrosPagina == 0) indiceUltimaPagina--;
            var registrosBloque = Math.floor(registrosPagina * paginasBloque);
            var indiceUltimoBloque = Math.floor(nRegistros / registrosBloque);
            if (nRegistros % registrosBloque == 0) indiceUltimoBloque--;
            switch (indice) {
                case -1: //Ir al primer bloque
                    indicePagina = 0;
                    indiceBloque = 0;
                    break;
                case -2: //Ir al bloque anterior
                    if (indiceBloque > 0) {
                        indiceBloque--;
                        indicePagina = indiceBloque * paginasBloque;
                    }
                    break;
                case -3: //Ir al bloque siguiente
                    if (indiceBloque < indiceUltimoBloque) {
                        indiceBloque++;
                        indicePagina = indiceBloque * paginasBloque;
                    }
                    break;
                case -4: //Ir al último bloque
                    indicePagina = indiceUltimaPagina;
                    indiceBloque = indiceUltimoBloque;
                    break;
            }
        }
        mostrarMatriz();
    }

    function configurarBotones() {
        var btnLimpiar = document.getElementById("btnLimpiar" + divGrilla);
        if (btnLimpiar != null) {
            btnLimpiar.onclick = function () {
                var textos = document.getElementsByClassName(divGrilla + "Cabecera");
                var nTextos = textos.length;
                for (var j = 0; j < nTextos; j++) {
                    textos[j].value = "";
                }
                filtrarMatriz();
            }
        }

        var btnFiltro = document.getElementById("btnFiltro" + divGrilla);
        if (btnFiltro != null) btnFiltro.onclick = function () {
            sinFiltros = (this.title == "Quitar Filtro" ? "true" : null);
            iniciarGrilla();
        }

        var btnImprimir = document.getElementById("btnImprimir" + divGrilla);
        if (btnImprimir != null) {
            btnImprimir.onclick = function () {
                imprimir(crearHtml());
            }
        }

        var btnExportarXlsx = document.getElementById("btnExportarXlsx" + divGrilla);
        if (btnExportarXlsx != null) {
            btnExportarXlsx.onclick = function () {
                archivo = tabla + ".xlsx";
                var contenido = crearTexto('|', '¬', true);
                Http.postDownloadBytes("General/exportar/?orienta=V&nombreArchivo=" + archivo, mostrarExportar, contenido);
            }
        }

        var btnExportarDocx = document.getElementById("btnExportarDocx" + divGrilla);
        if (btnExportarDocx != null) {
            btnExportarDocx.onclick = function () {
                archivo = tabla + ".docx";
                var contenido = crearTexto('|', '¬', true);
                Http.postDownloadBytes("General/exportar/?orienta=V&nombreArchivo=" + archivo, mostrarExportar, contenido);
            }
        }

        var btnExportarPdf = document.getElementById("btnExportarPdf" + divGrilla);
        if (btnExportarPdf != null) {
            btnExportarPdf.onclick = function () {
                divPopupContainerPDF.style.display = 'block';
            }
        }

        var btnAceptarPDF = document.getElementById("btnAceptarPDF");
        if (btnAceptarPDF != null) {
            btnAceptarPDF.onclick = function () {
                if (optVertical.checked) {
                    archivo = tabla + ".pdf";
                    var contenido = crearTexto('|', '¬', true);
                    Http.postDownloadBytes("General/exportar/?orienta=V&nombreArchivo=" + archivo, mostrarExportar, contenido);
                }
                else {
                    archivo = tabla + ".pdf";
                    var contenido = crearTexto('|', '¬', true);
                    Http.postDownloadBytes("General/exportar/?orienta=H&nombreArchivo=" + archivo, mostrarExportar, contenido);
                }
            }
        }

        var btnCancelarPDF = document.getElementById("btnCancelarPDF");
        var btnCerrarPDF = document.getElementById("btnCerrarPDF");
        if (btnCancelarPDF != null && btnCerrarPDF!=null) {
            btnCancelarPDF.onclick =
                btnCerrarPDF.onclick = function () {
                    divPopupContainerPDF.style.display = 'none';
                }
        }
    }

    function descargarArchivo(contenido, tipoMime) {
        var blob = new Blob([contenido], { "type": tipoMime });
        var enlace = document.createElement("a");
        enlace.href = URL.createObjectURL(blob);
        enlace.download = archivo;
        enlace.click();
        document.removeChild(enlace);
    }

    function crearPdf(texto) {
        var contenido = "";
        contenido += "%PDF-1.4\n\r";
        contenido += "1 0 obj <</Type /Catalog /Pages 2 0 R>>\n\r";
        contenido += "endobj\n\r";
        contenido += "2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>>\n\r";
        contenido += "endobj\n\r";
        contenido += "3 0 obj <</Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 500 800] /Contents 6 0 R>>\n\r";
        contenido += "endobj\n\r";
        contenido += "4 0 obj <</Font <</F1 5 0 R>>>>\n\r";
        contenido += "endobj\n\r";
        contenido += "5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>\n\r";
        contenido += "endobj\n\r";
        contenido += "6 0 obj\n\r";
        contenido += "<</Length 44>>\n\r";
        contenido += "stream\n\r";
        contenido += "BT /F1 24 Tf 175 720 Td (";
        contenido += texto;
        contenido += ")Tj ET\n\r";
        contenido += "endstream\n\r";
        contenido += "endobj\n\r";
        contenido += "xref\n\r";
        contenido += "0 7\n\r";
        contenido += "0000000000 65535 f\n\r";
        contenido += "0000000009 00000 n\n\r";
        contenido += "0000000056 00000 n\n\r";
        contenido += "0000000111 00000 n\n\r";
        contenido += "0000000212 00000 n\n\r";
        contenido += "0000000250 00000 n\n\r";
        contenido += "0000000317 00000 n\n\r";
        contenido += "trailer <</Size 7/Root 1 0 R>>\n\r";
        contenido += "startxref\n\r";
        contenido += "406\n\r";
        contenido += "%%EOF";
        return contenido;
    }

    function crearTexto(sepCampo, sepRegistros, conCabeceras) {
        var campos = [];
        var nRegistros = matriz.length;
        var nCampos = matriz[0].length;
        var contenido = cabeceras.join(sepCampo);
        contenido += sepRegistros;
        if (conCabeceras != null) {
            contenido += anchos.join(sepCampo).replace(/c/g, '').replace(/m/g, '');
            contenido += sepRegistros;
            contenido += tipos.join(sepCampo);
            contenido += sepRegistros;
        }
        for (var i = 0; i < nRegistros; i++) {
            for (var j = 0; j < nCampos; j++) {
                contenido += matriz[i][j];
                if (j < (nCampos - 1)) contenido += sepCampo;
            }
            if (i < (nRegistros - 1)) contenido += sepRegistros;
        }
        return contenido;
    }

    function crearHtml() {
        var campos = [];
        var nRegistros = matriz.length;
        var nCampos = matriz[0].length;
        var contenido = "<html><body><table><thead>";
        contenido += "<tr>";
        for (var j = 0; j < nCampos; j++) {
            contenido += "<th style='background-color:blue;color:white'>";
            contenido += cabeceras[j];
            contenido += "</th>";
        }
        contenido += "</tr></thead><tbody>";
        for (var i = 0; i < nRegistros; i++) {
            contenido += "<tr>";
            for (var j = 0; j < nCampos; j++) {
                contenido += "<td>";
                contenido += matriz[i][j];
                contenido += "</td>";
            }
            contenido += "</tr>";
        }
        contenido += "</tbody></table></body></html>";
        return contenido;
    }

    function mostrarExportar(rpta) {
        descargarArchivo(rpta, obtenerMime());
    }

    function obtenerMime() {
        var campos = archivo.split('.');
        var n = campos.length;
        var extension = campos[n - 1].toLowerCase();
        switch (extension) {
            case "xlsx":
                tipoMime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                break;
            case "docx":
                tipoMime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                break;
            case "pdf":
                tipoMime = "aplication/pdf";
                break;
            default:
                tipoMime = "aplication/octect-stream";
                break;
        }
        return tipoMime;
    }

    /************************** Funciones de impresion *********************/
    function imprimir(contenido) {
        alert('aqui imprime');
        pagina = document.body;
        var ventana = window.frames["print_frame"];
        ventana.document.body.innerHTML = "";
        ventana.document.write(contenido);
        ventana.focus();
        ventana.print();
        ventana.close();
        document.body = pagina;
    }

    function configurarSelCheckBox() {
        var div = document.getElementById(divGrilla);
        var allcheck = div.getElementsByClassName("selcheckbox");
        for (var p = 0; p < allcheck.length; p++) {
            if (p == 0) {
                allcheck[p].onclick = function () {
                    seleccionarTodosCheck(this);
                }
            }
            else {
                allcheck[p].onclick = function () {
                    seleccionarFilaCheck(this);
                }
            }
        }
    }

    function seleccionarTodosCheck(chkCab) {
        var filas = document.getElementById("tbData" + divGrilla).rows;
        var nfilas = filas.length;
        for (var i = 0; i < nfilas; i++) {
            filas[i].className = (chkCab.checked ? "FilaSeleccionada" : "FilaDatos");
            filas[i].cells[0].firstChild.checked = chkCab.checked;
        }
        ids = [];
        if (chkCab.checked) {
            var nregistros = matriz.length;
            for (var i = 0; i < nregistros; i++) {
                ids.push(matriz[i][0].toString());
            }
        }
    }


    function seleccionarFilaCheck(check) {
        var fila = check.parentNode.parentNode;
        var id = fila.childNodes[1].innerText;
        var pos = ids.indexOf(id);
        if (check.checked) {
            if (ids.length == 0 || (ids.length > 0 && pos == -1)) {
                ids.push(id);
                fila.className = "FilaSeleccionada";
            }
        }
        else {
            if (ids.length > 0 && pos > -1) {
                var n = ids.length;
                for (var i = 0; i < n; i++) {
                    if (ids[i] == id) {
                        ids.splice(i, 1);
                        fila.className = "FilaDatos";
                    }
                }
            }
        }
    }

    GrillaScroll.prototype.obtenerIdsMatriz = function () {
        var idsGrilla = [];
        var nregistros = matriz.length;
        for (var i = 0; i < nregistros; i++) {
            idsGrilla.push(matriz[i][0]);
        }
        return idsGrilla;
    }

    GrillaScroll.prototype.obtenerIdsChecks = function () {
        return ids;
    }

    GrillaScroll.prototype.obtenerFilaCheckPorId = function (id) {
        var fila = [];
        var nregistros = matriz.length;
        for (var i = 0; i < nregistros; i++) {
            if (matriz[i][0] == id) {
                fila = matriz[i];
                break;
            }
        }
        return fila;
    }
}
