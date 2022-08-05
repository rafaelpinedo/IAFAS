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
    var anioCN = document.getElementById("txtAnioCN").value;
    var data = anioCN;
    Http.get("General/listarTabla?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
}

function mostrarlistas(rpta) {
    if (rpta) {
        var listas = rpta.split("¯");
        var lista = listas[0].split("¬");
        var botones = [
            { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
            { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
        ];
        grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);

    }
}

function configurarBotones() {
    var btnNuevo = document.getElementById("btnNuevo");
    if (btnNuevo != null) btnNuevo.onclick = function () {

        Http.get("General/listarTabla?tbl=" + controller + vista + "Ayudas&data=", mostrarAyudas);

        divPopupContainer.style.display = 'block';
        var filas = tbDetalleCN.getElementsByTagName("tr");
        var nroFilas = filas.length;
        if (nroFilas != 0) {
            for (var i = nroFilas; i > -1; i--) {
                var fila = filas[i];
                if(fila != undefined) tbDetalleCN.removeChild(fila);
            }
            var spnNroItems = document.getElementById("spnNroItems");
            spnNroItems.innerHTML = "Items: 0";
        }

        var estilos = divPopupWindow.getElementsByClassName("Reque");
        var nroEstilos = estilos.length;
        for (var i = 0; i < nroEstilos; i++) {
            var estilo = [];
            estilo = estilos[i].getAttributeNames();
            if (estilo.indexOf("style") > -1) estilos[i].removeAttribute("style");
        }

        var cboEstado = document.getElementById("cboEstado");
        if (cboEstado != null) {
            cboEstado.value = 1;
            cboEstado.disabled = true;
        }
    }

    var btnConsutarItems = document.getElementById("btnConsutarItems");
    if (btnConsutarItems != null) btnConsutarItems.onclick = function () {
        var idTipoBien = cboTipoBien.value;
        if (idTipoBien != "") {
            Http.get("General/listarTabla?tbl=" + controller + vista + "Items&data=" + idTipoBien, mostrarListadoItems);

            divPopupContainerForm1.style.display = 'block';
            btnSeleccionarItems.disabled = true;
        } else {
            Swal.fire({
                title: 'Advertencia!',
                text: "Debe seleccionar un tipo de bien.",
                icon: 'warning',
                showConfirmButton: true,
                timer: 1000
            })
        }
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

    if (prefijo.toLowerCase() == "listaitem") {
        var isCheck = false;
        var chequeo = tbllistaItem.getElementsByTagName('input');
        var nroChequeo = chequeo.length;
        for (var i = 0; i < nroChequeo; i++) {
            if (chequeo[i].type == "checkbox" && chequeo[i].checked) {
                isCheck = true;
                break;
            }
        }
        if (isCheck) btnSeleccionarItems.disabled = false;
        else btnSeleccionarItems.disabled = true;
    }
}


function mostrarListadoItems(rpta) {
    if (rpta) {
        var listas = rpta.split('¯');
        lista = listas[0].split("¬");
        grillaItems = new GrillaScroll(lista, "listaItem", 1000, 6, "listaItems", "Admon", null, null, null, null, 25, false, true);

        var tbllistaItem = document.getElementById("tbllistaItem");
        if (typeof(tbllistaItem) != undefined && tbllistaItem != null) {

            var primerCheck = tbllistaItem.tHead.getElementsByTagName("input")[0];
            primerCheck.setAttribute("id", "idFirstCheck");
            var checkid = document.getElementById("idFirstCheck");
            checkid.onchange = function () {
                if (checkid.checked) btnSeleccionarItems.disabled = false;
                else btnSeleccionarItems.disabled = true;
            }

            //ocultar ultimo Item:
            var cabecera = tbllistaItem.tHead.getElementsByTagName("th")[5];
            var dato = cabecera.getAttribute("style");
            dato += ";display:none";
            cabecera.removeAttribute("style");
            cabecera.setAttribute("style", dato);
            var tbDatalistaItem = document.getElementById("tbDatalistaItem");
            var filas = tbDatalistaItem.getElementsByTagName("tr");
            var nroFilas = filas.length;
            var fila;
            for (var i = 0; i < nroFilas; i++) {
                dato = "";
                fila = filas[i].getElementsByTagName("td")[5];
                if (fila.hasAttribute("style")) {
                    dato = fila.getAttribute("style");
                    dato += ";display:none";
                    fila.removeAttribute("style");
                    fila.setAttribute("style", dato);
                }
            }
        }
    }
}

function mostrarAyudas(rpta) {
    if (rpta) {
        var listas = rpta.split('¯');
        var listaOficina = listas[0].split("¬");
        var listaTipo = listas[1].split("¬");
        var listaEstado = listas[2].split("¬");
        var listaPersonal = listas[3].split("¬");
        crearCombo(listaOficina, "cboOficina", "Seleccione");
        crearCombo(listaTipo, "cboTipoBien", "Seleccione");
        crearCombo(listaEstado, "cboEstado", null);
        crearCombo(listaPersonal, "cboPersonal", "Seleccione");
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
            codUni = fila[4];
            data += (id + "|" + codigo + "|" + nombre + "|" + unidad + "|" + codUni);
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
    var codUni = campos[4];

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
        filaDetalle += "<td style='white-space:pre-wrap;width:80px;vertical-align:top;display:none'>";
        filaDetalle += codUni;
        filaDetalle += "</td> ";

        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += '';
        filaDetalle += "</td> ";

        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += '';
        filaDetalle += "</td> ";

        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += '';
        filaDetalle += "</td> ";

        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += '';
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += '';
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)'>";
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

function importes(col) {
    var fila = col.parentNode.parentNode;
    fila.childNodes[16].style.textAlign = "center";
    fila.childNodes[16].style.fontWeight = "bold";
    fila.childNodes[24].style.textAlign = "center";
    fila.childNodes[24].style.fontWeight = "bold";
    fila.childNodes[32].style.textAlign = "center";
    fila.childNodes[32].style.fontWeight = "bold";
    fila.childNodes[40].style.textAlign = "center";
    fila.childNodes[40].style.fontWeight = "bold";
    fila.childNodes[42].style.textAlign = "center";
    fila.childNodes[42].style.fontWeight = "bold";
    fila.childNodes[46].style.textAlign = "center";
    fila.childNodes[46].style.fontWeight = "bold";
    var elemento = fila.getElementsByTagName('input');
    var nroElemento = elemento.length;
    var valor = 0;
    var subTot = 0;
    for (var i = 0; i < nroElemento-1; i++) {
        valor += elemento[i].value * 1;
        subTot += elemento[i].value * 1;
        if (i == 2) fila.childNodes[16].innerText = valor.toString();
        if (i == 5) fila.childNodes[24].innerText = valor.toString();
        if (i == 8) fila.childNodes[32].innerText = valor.toString();
        if (i == 11) fila.childNodes[40].innerText = valor.toString();
        fila.childNodes[42].innerText = subTot.toString();
        if (i == 2 || i == 5 || i == 8 || i == 11) valor = 0;
    }
    fila.childNodes[46].innerText = ((elemento[12].value*1)*(fila.childNodes[42].innerText*1)).toFixed(2).toString();
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
    var idOficina = cboOficina.value;
    var idEntidad = "1";
    var anioCN = hdfAnioCN.value;
    var fechaRegistro = dttFechaRegistro.value;
    var idPersonal = cboPersonal.value;
    var idCodBien = cboTipoBien.value;
    var dEstado = cboEstado.value;
    var hEstado = "6";

    data = idRegistro;
    data += "|";
    data += idOficina;
    data += "|";
    data += idEntidad;
    data += "|";
    data += anioCN;
    data += "|";
    data += fechaRegistro;
    data += "|";
    data += idPersonal;
    data += "|";
    data += idCodBien;
    data += "|";
    data += dEstado;
    data += "|";
    data += hEstado;
    data += "¯";

    var nfilas = tbDetalleCN.rows.length;
    var fila;
    for (var i = 0; i < nfilas; i++) {
        fila = tbDetalleCN.rows[i];
        data += "||";
        data += fila.cells[0].innerHTML; //Item
        data += "|";
        data += fila.cells[4].innerHTML; //uniMed
        data += "|";
        data += fila.cells[2].innerHTML; //descripcion
        data += "|";
        data += fila.cells[21].innerHTML; //cant
        data += "|";
        data += fila.cells[22].childNodes[0].value; //precio
        data += "|";
        data += fila.cells[23].innerHTML; //subTot
        data += "|";
        data += fila.cells[5].childNodes[0].value == "" ? 0 : fila.cells[5].childNodes[0].value; //ene
        data += "|";
        data += fila.cells[6].childNodes[0].value == "" ? 0 : fila.cells[6].childNodes[0].value; //feb
        data += "|";
        data += fila.cells[7].childNodes[0].value == "" ? 0 : fila.cells[7].childNodes[0].value; //mar
        data += "|";
        data += fila.cells[9].childNodes[0].value == "" ? 0 : fila.cells[9].childNodes[0].value; //abr
        data += "|";
        data += fila.cells[10].childNodes[0].value == "" ? 0 : fila.cells[10].childNodes[0].value; //may
        data += "|";
        data += fila.cells[11].childNodes[0].value == "" ? 0 : fila.cells[11].childNodes[0].value; //jun
        data += "|";
        data += fila.cells[13].childNodes[0].value == "" ? 0 : fila.cells[13].childNodes[0].value; //jul
        data += "|";
        data += fila.cells[14].childNodes[0].value == "" ? 0 : fila.cells[14].childNodes[0].value; //ago
        data += "|";
        data += fila.cells[15].childNodes[0].value == "" ? 0 : fila.cells[15].childNodes[0].value; //set
        data += "|";
        data += fila.cells[17].childNodes[0].value == "" ? 0 : fila.cells[17].childNodes[0].value; //oct
        data += "|";
        data += fila.cells[18].childNodes[0].value == "" ? 0 : fila.cells[18].childNodes[0].value; //nov
        data += "|";
        data += fila.cells[19].childNodes[0].value == "" ? 0 : fila.cells[19].childNodes[0].value; //dic
        data += "¬";

        if (fila.cells[23].innerHTML == "" || fila.cells[23].innerHTML * 1 < 1) {
            Swal.fire({
                title: 'Advertencia!',
                text: "El subTotal debe ser mayor a cero.",
                icon: 'warning',
                showConfirmButton: true,
                timer: 3000
            })
            return false;
        }
    }
    data = data.substr(0, data.length - 1);

    var frm = new FormData();
    frm.append("data", data);
    Http.post("General/guardar?tbl=" + controller + vista, mostrarGrabar, frm);

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

function mostrarGrabar(rpta) {
    var mensajeResul = [];
    var mensaje = "";
    var tipo;
    if (rpta) {
        listas = rpta.split("¯")
        nroLs = listas.length;
        lista = listas[0].split("¬");
        if (nroLs > 1) {
            mensajeResul = listas[1].split("|");
            tipo = mensajeResul[0];
            mensaje = mensajeResul[1];
        }
        divPopupContainer.style.display = 'none';


        var botones = [
            { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
            { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
        ];
        grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
        
        if (tipo == 'A') {
            Swal.fire({
                title: 'Finalizado!',
                text: mensaje,
                icon: 'success',
                showConfirmButton: true,
                timer: 2000
            })
            alerta = 'success';
        }
        else {
            Swal.fire({
                title: 'Error!',
                text: mensaje,
                icon: 'error',
                showConfirmButton: true,
                timer: 2000
            })
        }
    }
    else {
        mostrarMensaje("No se realizó el registro", "error")
    }

    btnGuardar.innerHTML = "<i class='fa fa-save'></i> Grabar";
    btnGuardar.disabled = false;
}

function seleccionarBoton(idGrilla, idRegistro, idBoton) {
    if (idGrilla == "divLista") {
        if (idBoton == "Editar") {
            let tituloModal = document.getElementById("tituloModal");
            if (tituloModal != null) {
                tituloModal.innerText = "Actualizar Registro";
            }
            editarRegistro(idRegistro);
        }
        if (idBoton == "Eliminar") {
            eliminarRegistro(idRegistro)
        }
    }
}

function editarRegistro(id) {
    Http.get("General/obtenerTabla/?tbl=" + controller + vista + '&id=' + id, mostrarRegistro);
}

function mostrarRegistro(rpta) {
    if (rpta) {
        var campos = rpta.split("|");
        var controlesSelectSearch = document.getElementsByClassName("SelectSearch");
        var nControlesSelectSearch = controlesSelectSearch.length;
        var cboEstado = document.getElementById("cboEstado");
        if (cboEstado != null) { cboEstado.disabled = false };

        var divPopupContainer = document.getElementById("divPopupContainer");
        if (divPopupContainer != null) { divPopupContainer.style.display = 'block'; };
        var controles = document.getElementsByClassName("Popup");
        var nControles = controles.length;
        var control;
        var tipo;
        var subCampos;
        for (var j = 0; j < nControles; j++) {
            control = controles[j];
            control.style.borderColor = ""
            tipo = control.id.substr(0, 3);
            if (tipo == "txt" || tipo == "num" || tipo == "tta" || tipo == "tim") { control.value = campos[j]; }
            else if (tipo == "dtt") {
                if (campos[j] == '01/01/1900') {
                    control.value = "";
                } else {
                    var dFecha = campos[j].split("/");
                    control.value = dFecha[2] + "-" + dFecha[1] + "-" + dFecha[0];
                }
            }
            else if (tipo == "cbo") {
                subCampos = campos[j].split("-");
                if (subCampos[0] == 0) {
                    control.value = '';
                }
                else {
                    control.value = subCampos[0];
                    if (nControlesSelectSearch > 0) {
                        var controlSelect = 'select2-' + control.id + '-container';
                        var cboControlSelect = document.getElementById(controlSelect);
                        if (cboControlSelect != null) {
                            var selected = control.options[control.selectedIndex].text;
                            cboControlSelect.innerHTML = selected;
                        }
                    }
                }
            }
            else if (tipo == "img") {
                control.src = "data:image/jpeg;base64," + campos[j];
            }
            else if (tipo == "chk" || tipo == "opt") {
                control.checked = (campos[j] == "1")
            }
            else if (tipo == "dtg") {
                if (campos[j] == 1) {
                    $('#' + control.id).bootstrapToggle('on')
                }
                else {
                    $('#' + control.id).bootstrapToggle('off')
                }
            }
        }

    }
}
