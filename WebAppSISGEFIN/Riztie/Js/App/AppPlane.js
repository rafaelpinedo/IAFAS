var filaAnterior = null;
var idUsu = "";
var vista = "";
var controller = "";
var idCombos = [];
var listas = [];
var ayudas = [];
var formulario = [];
var idRegistro = "";

window.onload = function () {
    getConfigMn();
    vista = window.sessionStorage.getItem("Vista");
    controller = window.sessionStorage.getItem("Controller");
    getListar();
    configurarBotones();
    // configurarConsultas();
}

function getListar() {
    var data = "";
    Http.get("General/listarTabla?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
}

function mostrarlistas(rpta) {
    if (rpta) {

    }
}

function configurarBotones() {
    var btnNuevo = document.getElementById("btnNuevo");
    if (btnNuevo != null) btnNuevo.onclick = function () {

        Http.get("General/listarTabla?tbl=" + controller + vista + "Ayudas&data=", mostrarAyudas);

        divPopupContainer.style.display = 'block';
        var cboEstado = document.getElementById("cboEstado");
        if (cboEstado != null) {
            cboEstado.value = 1;
            cboEstado.disabled = true;
        }
    }

    var btnConsutarItems = document.getElementById("btnConsutarItems");
    if (btnConsutarItems != null) btnConsutarItems.onclick = function () {
        var idTipoBien = cboTipoBien.value;
        Http.get("General/listarTabla?tbl=" + controller + vista + "Items&data=" + idTipoBien, mostrarListadoItems);

        divPopupContainerForm1.style.display = 'block';

    }

    var btnGuardar = document.getElementById("btnGuardar");
    if (btnGuardar != null) btnGuardar.onclick = function () {
        if (vista == "RegistroCN") {
            if (validarCN()) grabarCN();
        }
        else {
            if (validarInformacion("Reque")) grabarDatos();
        }
    }

    var btnCancelar = document.getElementById("btnCancelar");
    if (btnCancelar != null) btnCancelar.onclick = function () {
        divPopupContainer.style.display = 'none';
    }

    var btnCancelarForm1 = document.getElementById("btnCancelarForm1");
    if (btnCancelarForm1 != null) btnCancelarForm1.onclick = function () {
        divPopupContainerForm1.style.display = 'none';
    }
}

function seleccionarFila(fila, id, prefijo) {
    idRegistro = id;
    window["id" + prefijo] = id;
    if (window["fila" + prefijo] != null) window["fila" + prefijo].className = "FilaDatos";
    fila.className = "FilaSeleccionada";
    window["fila" + prefijo] = fila;
}


function mostrarListadoItems(rpta) {
    if (rpta) {
        var listas = rpta.split('¯');
        lista = listas[0].split("¬");
        grillaItems = new GrillaScroll(lista, "listaItem", 1000, 6, "listaItems", "Admon", null, null, null, null, 25, false, true);
    }
}

function mostrarAyudas(rpta) {
    if (rpta) {
        var listas = rpta.split('¯');
        var listaOficina = listas[0].split("¬");
        var listaTipo = listas[1].split("¬");
        var listaEstado = listas[2].split("¬");
        crearCombo(listaOficina, "cboOficina", "Seleccione");
        crearCombo(listaTipo, "cboTipoBien", "Seleccione");
        crearCombo(listaEstado, "cboEstado", null);
    }
}

var btnSeleccionarItems = document.getElementById("btnSeleccionarItems");
if (btnSeleccionarItems != null) btnSeleccionarItems.onclick = function () {
    var ids = grillaItems.obtenerIdsChecks();
    var data = "";
    for (var i = 0; i < ids.length; i++) {
        fila = grillaItems.obtenerFilaCheckPorId(ids[i]);
        if (fila.length > 0) {
            id = fila[0];
            codigo = fila[1];
            nombre = fila[2];
            unidad = fila[3];
            data += (id + "|" + codigo + "|" + nombre + "|" + unidad);
            if (i < ids.length - 1) data += "¬";
        }
    }
    obtenerItems(data);
}

function obtenerItems(datos) {
    var lista = datos.split('¬');
    var nRegistros = lista.length;
    for (var i = 0; i < nRegistros; i++) {
        adicionarItem(lista[i]);
    }
}

function adicionarItem(datos) {
    var campos = datos.split('|');
    var item = campos[0];
    var codigo = campos[1];
    var nombre = campos[2];
    var unimed = campos[3];

    var nFilas = tbDetalleCN.rows.length;
    var existe = false;
    for (var i = 0; i < nFilas; i++) {
        if (tbDetalleCN.rows[i].cells[0].innerHTML == item) {
            existe = true;
            break;
        }
    }

    if (!existe) {
        var filaDetalle = "<tr>";
        filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>";
        filaDetalle += item;
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:100px;vertical-align:top;'>";
        filaDetalle += codigo;
        filaDetalle += "</td> ";
        filaDetalle += "<td style='width:500px;white-space:pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
        filaDetalle += nombre;
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:80px;vertical-align:top;'>";
        filaDetalle += unimed;
        filaDetalle += "</td> ";

        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += '';
        filaDetalle += "</td> ";

        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += '';
        filaDetalle += "</td> ";

        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += '';
        filaDetalle += "</td> ";

        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += '';
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += '';
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += '';
        filaDetalle += "</td> ";

        filaDetalle += "<td style='white-space:pre-wrap;width:10px;vertical-align:top;'>";
        filaDetalle += "<i class='fa fa-trash f-16 text-c-red' title='Quitar Item' onclick='retirarItem(this,\"";
        filaDetalle += item;
        filaDetalle += "\");'></i>";
        filaDetalle += "</td> ";
        filaDetalle += "</tr>";
        tbDetalleCN.insertAdjacentHTML("beforeend", filaDetalle);
    }
    else mostrarMensaje("Existen Items ya agregados- verificar", "error");
    spnNroItems.innerHTML = "Items: " + (nFilas + 1);
    divPopupContainerForm1.style.display = 'none';
}

function retirarItem(col, id) {
    var fila = col.parentNode.parentNode;
    tbDetalleCN.removeChild(fila);
    var nFilas = 0;
    nFilas = tbDetalleCN.rows.length;
    spnNroItems.innerHTML = "Items: " + (nFilas);
}

function validarCN() {
    if (validarInformacion("Reque")) {
        var nfilas = tbDetalleCN.rows.length;
        if (nfilas == 0) {
            mostrarMensaje("Debe agregar items al Cuadro Necesidades", "error");
            return false;
        }

        //var fila;
        //for (var i = 0; i < nfilas; i++) {
        //    fila = tbDetalleCN.rows[i];
        //    if (fila.cells[4].childNodes[0].value == 0 || fila.cells[4].childNodes[0].value == "") {
        //        mostrarMensaje("Debe ingresar cantidad a todos los items", "error");
        //        return false;
        //    }
        //}
        return true;
    }
}

function grabarCN() {
    var data = "";
    var idRegistro = txtIdRegistro.value;
    var anioCN = txtAnioCN.value;
    var fechaRegistro = dttFechaRegistro.value;
    var idOficina = cboOficina.value;
    var idEstado = cboEstado.value;

    data = idRegistro;
    data += "|";
    data += anioCN;
    data += "|";
    data += fechaRegistro;
    data += "|";
    data += idOficina;
    data += "|";
    data += idEstado;
    data += "¯";

    var nfilas = tbDetalleCN.rows.length;
    var fila;
    for (var i = 0; i < nfilas; i++) {
        fila = tbDetalleCN.rows[i];
        data += fila.cells[0].innerHTML; //Item
        data += "|";
        data += fila.cells[4].childNodes[0].value; //Cantidad
        data += "¬";
    }
    data = data.substr(0, data.length - 1);

    alert(data);

    //var frm = new FormData();
    //frm.append("data", data);
    //post("Admon/grabar?Id=" + tabla, mostrarGrabar, frm);

    //btnGuardar.innerHTML = "Guardando <i class='fa fa-circle-o-notch fa-spin' style='color:white'></i>";
    //btnGuardar.disabled = true;
}

function configurarEnterCantidad(tbody, celda) {
    var filas = tbody.childNodes;
    var nfilas = filas.length - 1;
    for (var i = 0; i < nfilas; i++) {
        txt = filas[i].childNodes[celda].firstChild;
        txt.onkeyup = function (event) {
            if (this.value != "" && event.keyCode == 13) {
                this.parentNode.parentNode.nextSibling.childNodes[celda].firstChild.focus();
            }
        }
    }
}