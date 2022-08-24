var filaAnterior = null;
var idUsu = "";
var vista = "";
var controller = "";
var idCombos = [];
var listas = [];
var ayudas = [];
var formulario = [];
var idRegistro = "";
var matrixDeta = [[]];
var enti_secuencia;
var hest_secuencia;

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

        if (divPopupContainer.hasAttribute("nuevo")) {
            divPopupContainer.removeAttribute("nuevo");
        }
        divPopupContainer.style.display = 'block';
        var tituloModal = document.getElementById("tituloModal");
        tituloModal.innerText = "Nuevo Registro";
        var filas = tbDetalleCN.getElementsByTagName("tr");
        var nroFilas = filas.length;
        if (nroFilas != 0) {
            for (var i = nroFilas; i > -1; i--) {
                var fila = filas[i];
                if (fila != undefined) tbDetalleCN.removeChild(fila);
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
        cboEstado.classList.remove("control-form");
        cboEstado.classList.add("control-lectura");
        if (cboEstado != null) {
            cboEstado.value = 1;
            cboEstado.disabled = true;
        }
    }

    var btnConsutarItems = document.getElementById("btnConsutarItems");
    if (btnConsutarItems != null) btnConsutarItems.onclick = function () {
        var idTipoBien = cboTipoBien.value;
        if (idTipoBien != "") {
            var idOficina = cboOficina.value;
            if (idOficina != "") {
                var ingresos;
                var anno = document.getElementById("txtAnioCN2");
                var tituloModal = document.getElementById("tituloModal");
                anno = anno.value;
                tituloModal = tituloModal.innerText.substr(0, 1);
                tituloModal = tituloModal.toLowerCase() == "n" ? "0" : "1";
                ingresos = tituloModal + "|" + anno + "|" + idOficina + "|" + idTipoBien;
                Http.get("General/listarTabla?tbl=" + controller + vista + "Items&data=" + ingresos, mostrarListadoItems);
            } else {
                Swal.fire({
                    title: 'Advertencia!',
                    text: "Debe seleccionar una Oficina.",
                    icon: 'warning',
                    showConfirmButton: true,
                    timer: 1000
                })
            }
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

    var btnReporteExcel = document.getElementById("btnReporteExcel");
    if (btnReporteExcel != null) btnReporteExcel.onclick = function () {
        var anio = txtAnioCN.value;
        Http.get("General/getReporte/?tbl=" + controller + vista + "&data=" + anio, mostrarDatosExportar);

    }

    var btnCancelar3 = document.getElementById("btnCancelar3");
    if (btnCancelar3 != null) btnCancelar3.onclick = function () {
        divPopupRpts.style.display = "none";
    }

    var btnMenuRpt = document.getElementById("btnMenuRpt");
    if (btnMenuRpt != null) btnMenuRpt.onclick = function () {
        var txtAnioCN3 = document.getElementById("txtAnioCN3");
        var data = txtAnioCN3.value;
        Http.get("General/listarTabla?tbl=" + controller + vista + "AyuRpte&data=" + data, mostrarAyudasReporte);
        divPopupRpts.style.display = "block";
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
    else {
        var cboEstado = document.getElementById("cboEstado");
        cboEstado.classList.remove("control-lectura");
        cboEstado.classList.add("control-form");
        if (cboEstado != null) {
            cboEstado.value = 1;
            cboEstado.disabled = false;
        }
    }
}


function mostrarListadoItems(rpta) {
    if (rpta) {
        divPopupContainerForm1.style.display = 'block';
        btnSeleccionarItems.disabled = true;
        var listas = rpta.split('¯');
        lista = listas[0].split("¬");
        grillaItems = new GrillaScroll(lista, "listaItem", 1000, 6, "listaItems", "Admon", null, null, null, null, 25, false, true);

        var tbllistaItem = document.getElementById("tbllistaItem");
        if (typeof (tbllistaItem) != undefined && tbllistaItem != null) {

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
                fila = filas[i].getElementsByTagName("td");
                var celda = fila[5];
                if (celda != undefined) {
                    if (celda.hasAttribute("style")) {
                        dato = celda.getAttribute("style");
                        dato += ";display:none";
                        celda.removeAttribute("style");
                        celda.setAttribute("style", dato);
                    }
                }
            }
        }
    } else {
        Swal.fire({
            title: 'Advertencia!',
            text: "Ya existe el tipo de Bien seleccionado para esta Oficina.",
            icon: 'warning',
            showConfirmButton: true,
            timer: 1000
        })
    }
}

function mostrarAyudas(rpta) {
    if (rpta) {
        var listas = rpta.split('¯');
        var listaOficina = listas[0].split("¬");
        var listaTipo = listas[1].split("¬");
        var listaEstado = listas[2].split("¬");
        var listaPersonal = listas[3].split("¬");
        var fechaActual = new Date;
        crearCombo(listaOficina, "cboOficina", "Seleccione");
        crearCombo(listaTipo, "cboTipoBien", "Seleccione");
        crearCombo(listaEstado, "cboEstado", null);
        crearCombo(listaPersonal, "cboPersonal", "Seleccione");
        var dttFechaRegistro = document.getElementById("dttFechaRegistro");
        dttFechaRegistro.value = fechaActual.toLocaleDateString("en-CA");
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

function adicionarItem(datos, secuencia) {
    var campos = datos.split('|');
    var item = campos[0];
    var codigo = campos[1];
    var nombre = campos[2];
    var unimed = campos[3];
    var codUni = campos[4];
    var idSecuencia;

    var divPopupContainer = document.getElementById("divPopupContainer");
    if (divPopupContainer.hasAttribute("nuevo")) idSecuencia = secuencia == undefined ? "" : secuencia;
    var nFilas = tbDetalleCN.rows.length;
    var existe = false;
    for (var i = 0; i < nFilas; i++) {
        if (tbDetalleCN.rows[i].cells[1].innerHTML == item) {
            existe = true;
            break;
        }
    }

    if (!existe) {
        var nroMatriz = "";
        if (secuencia == undefined) {
            var tituloModal = document.getElementById("tituloModal");
            tituloModal = tituloModal.innerText.substr(0, 1);
            tituloModal = tituloModal.toLowerCase() == "n" ? true : false;
            if (tituloModal) {
                var cboOficina = document.getElementById("cboOficina");
                cboOficina.setAttribute("disabled","");
                var cboTipoBien = document.getElementById("cboTipoBien");
                cboTipoBien.setAttribute("disabled","");
            }
            var matriz = [];
            nroMatriz = matrixDeta.length;
            matriz[nroMatriz] = new Array(21);
            matrixDeta.push(matriz);
            matrixDeta[nroMatriz][0] = "";
            matrixDeta[nroMatriz][1] = item;
            matrixDeta[nroMatriz][2] = codUni;
            matrixDeta[nroMatriz][3] = nombre;
        }
        var filaDetalle = "<tr data-pos='";
        filaDetalle += nroMatriz;
        filaDetalle += "'>";
        filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none' data-col='0'>";
        filaDetalle += idSecuencia;
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none' data-col='1'>";
        filaDetalle += item;
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:100px;vertical-align:top;'>";
        filaDetalle += codigo;
        filaDetalle += "</td> ";
        filaDetalle += "<td style='width:500px;white-space:pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;' data-col='3'>";
        filaDetalle += nombre;
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:80px;vertical-align:top;'>";
        filaDetalle += unimed;
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:80px;vertical-align:top;display:none' data-col='2'>";
        filaDetalle += codUni;
        filaDetalle += "</td> ";

        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)' data-col='7'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)' data-col='8'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)' data-col='9'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += '';
        filaDetalle += "</td> ";

        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)' data-col='10'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)' data-col='11'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)' data-col='12'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += '';
        filaDetalle += "</td> ";

        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)' data-col='13'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)' data-col='14'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)' data-col='15'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += '';
        filaDetalle += "</td> ";

        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)' data-col='16'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)' data-col='17'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)' data-col='18'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += '';
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px' data-col='4'>";
        filaDetalle += '';
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
        filaDetalle += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 onkeyup='importes(this)' data-col='5'>";
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px' data-col='6'>";
        filaDetalle += '';
        filaDetalle += "</td> ";

        filaDetalle += "<td style='white-space:pre-wrap;width:10px;vertical-align:top;'>";
        filaDetalle += "<i class='fa fa-trash f-16 text-c-red' title='Quitar Item' onclick='retirarItem(this,\"";
        filaDetalle += item;
        filaDetalle += "\");'></i>";
        filaDetalle += "</td> ";
        filaDetalle += "</tr>";
        tbDetalleCN.insertAdjacentHTML("beforeend", filaDetalle);

        spnNroItems.innerHTML = "Items: " + (nFilas + 1);
    }
    else mostrarMensaje("Existen Items ya agregados- verificar", "error");
    divPopupContainerForm1.style.display = 'none';

}

function retirarItem(col, id) {
    var fila = col.parentNode.parentNode;
    tbDetalleCN.removeChild(fila);
    var nFilas = 0;
    nFilas = tbDetalleCN.rows.length;
    if (nFilas == 0) {
        var cboOficina = document.getElementById("cboOficina");
        if (cboOficina.hasAttribute("disabled")) cboOficina.removeAttribute("disabled");
        var cboTipoBien = document.getElementById("cboTipoBien");
        if (cboTipoBien.hasAttribute("disabled")) cboTipoBien.removeAttribute("disabled");
    }
    spnNroItems.innerHTML = "Items: " + (nFilas);
    var divPopupContainer = document.getElementById("divPopupContainer");
    var esUpdate = (divPopupContainer.hasAttribute("nuevo")) ? true : false;
    if (esUpdate) {
        var posRow = fila.getAttribute("data-pos");
        if (matrixDeta[posRow][0] == "") matrixDeta[posRow][0] = "x";
        else {
            for (var i = 1; i < 19; i++) {
                matrixDeta[posRow][i] = "0";
            }
        }
    }
}

function importes(col) {
    // var pos = Array.from(fila.parentNode.children).indexOf(fila);
    var divPopupContainer = document.getElementById("divPopupContainer");
    var esUpdate = (divPopupContainer.hasAttribute("nuevo")) ? true : false;
    var fila = col.parentNode.parentNode;
    fila.childNodes[18].style.textAlign = "center";
    fila.childNodes[18].style.fontWeight = "bold";
    fila.childNodes[26].style.textAlign = "center";
    fila.childNodes[26].style.fontWeight = "bold";
    fila.childNodes[34].style.textAlign = "center";
    fila.childNodes[34].style.fontWeight = "bold";
    fila.childNodes[42].style.textAlign = "center";
    fila.childNodes[42].style.fontWeight = "bold";
    fila.childNodes[44].style.textAlign = "center";
    fila.childNodes[44].style.fontWeight = "bold";
    fila.childNodes[48].style.textAlign = "center";
    fila.childNodes[48].style.fontWeight = "bold";
    var pos = fila.getAttribute("data-pos");
    var elemento = fila.getElementsByTagName('input');
    var nroElemento = elemento.length;
    var valor = 0;
    var subTot = 0;
    var posCol;
    var valorElemento = 0;
    for (var i = 0; i < nroElemento - 1; i++) {
        posCol = elemento[i].getAttribute("data-col");
        valorElemento = elemento[i].value * 1;
        if (esUpdate) matrixDeta[pos][posCol] = valorElemento;
        valor += valorElemento;
        subTot += valorElemento;
        if (i == 2) fila.childNodes[18].innerText = valor.toFixed(2).toString();
        if (i == 5) fila.childNodes[26].innerText = valor.toFixed(2).toString();
        if (i == 8) fila.childNodes[34].innerText = valor.toFixed(2).toString();
        if (i == 11) fila.childNodes[42].innerText = valor.toFixed(2).toString();
        fila.childNodes[44].innerText = subTot.toFixed(2).toString();
        if (esUpdate) matrixDeta[pos][4] = subTot.toFixed(2);
        if (i == 2 || i == 5 || i == 8 || i == 11) valor = 0;
    }
    valorElemento = elemento[12].value * 1;
    if (esUpdate) matrixDeta[pos][5] = valorElemento;
    fila.childNodes[48].innerText = (valorElemento * (fila.childNodes[44].innerText * 1)).toFixed(2).toString();
    if (esUpdate) matrixDeta[pos][6] = (valorElemento * (fila.childNodes[44].innerText * 1)).toFixed(2);
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
    var divPopupContainer = document.getElementById("divPopupContainer");
    var esUpdate = (divPopupContainer.hasAttribute("nuevo")) ? true : false;
    var idRegistro = txtIdRegistro.value;
    var idOficina = cboOficina.value;
    var idEntidad = "1";
    var anioCN = hdfAnioCN.value;
    var fechaRegistro = dttFechaRegistro.value;
    var idPersonal = cboPersonal.value;
    var idCodBien = cboTipoBien.value;
    var dEstado = cboEstado.value;
    var hEstado = "6";

    data = (esUpdate) ? idRegistro : "";
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

    if (esUpdate) {
        var preData = grabarCNEditData();
        data = (preData == "" ? "" : data) + preData;
    } else {
        var nfilas = tbDetalleCN.rows.length;
        var fila;
        for (var i = 0; i < nfilas; i++) {
            fila = tbDetalleCN.rows[i];
            data += "||";
            data += fila.cells[1].innerHTML; //Item
            data += "|";
            data += fila.cells[5].innerHTML; //uniMed
            data += "|";
            data += fila.cells[3].innerHTML; //descripcion
            data += "|";
            data += fila.cells[22].innerHTML; //cant
            data += "|";
            data += fila.cells[23].childNodes[0].value; //precio
            data += "|";
            data += fila.cells[24].innerHTML; //subTot
            data += "|";
            data += fila.cells[6].childNodes[0].value == "" ? 0 : fila.cells[6].childNodes[0].value; //ene
            data += "|";
            data += fila.cells[7].childNodes[0].value == "" ? 0 : fila.cells[7].childNodes[0].value; //feb
            data += "|";
            data += fila.cells[8].childNodes[0].value == "" ? 0 : fila.cells[8].childNodes[0].value; //mar
            data += "|";
            data += fila.cells[10].childNodes[0].value == "" ? 0 : fila.cells[10].childNodes[0].value; //abr
            data += "|";
            data += fila.cells[11].childNodes[0].value == "" ? 0 : fila.cells[11].childNodes[0].value; //may
            data += "|";
            data += fila.cells[12].childNodes[0].value == "" ? 0 : fila.cells[12].childNodes[0].value; //jun
            data += "|";
            data += fila.cells[14].childNodes[0].value == "" ? 0 : fila.cells[14].childNodes[0].value; //jul
            data += "|";
            data += fila.cells[15].childNodes[0].value == "" ? 0 : fila.cells[15].childNodes[0].value; //ago
            data += "|";
            data += fila.cells[16].childNodes[0].value == "" ? 0 : fila.cells[16].childNodes[0].value; //set
            data += "|";
            data += fila.cells[18].childNodes[0].value == "" ? 0 : fila.cells[18].childNodes[0].value; //oct
            data += "|";
            data += fila.cells[19].childNodes[0].value == "" ? 0 : fila.cells[19].childNodes[0].value; //nov
            data += "|";
            data += fila.cells[20].childNodes[0].value == "" ? 0 : fila.cells[20].childNodes[0].value; //dic
            data += "¬";

            if (fila.cells[24].innerHTML == "" || fila.cells[24].innerHTML * 1 < 1) {
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
    }

    if (data != "") {
        var frm = new FormData();
        frm.append("data", data);
        Swal.fire({
            title: '¿Desea Grabar el registro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                Http.post("General/guardar?tbl=" + controller + vista, mostrarGrabar, frm);
            }
        })
    }

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
            var divPopupContainer = document.getElementById("divPopupContainer");
            if (!divPopupContainer.hasAttribute("nuevo")) divPopupContainer.setAttribute("nuevo", "nuevo");
            editarRegistro(idRegistro);
            divPopupContainer.style.display = 'block';
        }
        if (idBoton == "Eliminar") {
            eliminarRegistro(idRegistro);
        }
    }
}

function editarRegistro(id) {
    Http.get("General/obtenerTabla/?tbl=" + controller + vista + '&id=' + id, mostrarRegistro);
}

function mostrarRegistro(rpta) {
    if (rpta) {
        var divPopupContainer = document.getElementById("divPopupContainer");
        if (divPopupContainer.hasAttribute("nuevo")) {
            edicionRegistroRecuperado(rpta);
        } else {
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
}

function eliminarRegistro(id) {
    var frm = new FormData();
    frm.append("data", id);
    Swal.fire({
        title: '¿Desea eliminar el registro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.value) {
            Http.post("General/eliminar?tbl=" + controller + vista, mostrarGrabar, frm);
        }
    })
}

function edicionRegistroRecuperado(rpta) {
    limpiarGrilla();
    crearCombo([], "cboOficina", null);
    crearCombo([], "cboTipoBien", null);
    crearCombo([], "cboEstado", null);
    crearCombo([], "cboPersonal", null);

    var listas = rpta.split("¯");
    var listaCabecera = listas[0].split("¬");
    var listaDetalles = listas[1].split("¬");
    var listaOficina = listas[2].split("¬");
    var listaTipo = listas[3].split("¬");
    var listaEstado = listas[4].split("¬");
    var listaPersonal = listas[5].split("¬");
    var listaUndMedida = listas[6].split("¬");

    //crearCombo(listaOficina, "cboOficina","seleccione");
    //crearCombo(listaTipo, "cboTipoBien", "Seleccione");
    crearCombo(listaEstado, "cboEstado", "Seleccione");
    crearCombo(listaPersonal, "cboPersonal", "Seleccione");

    var arrayCab = listaCabecera[0].split("|");
    var cn_secuencia = arrayCab[0];
    var txtIdRegistro = document.getElementById("txtIdRegistro");
    txtIdRegistro.value = cn_secuencia;

    var newLista = [];
    newLista = bloqueoCbo(listaOficina, arrayCab[1]);
    crearCombo(newLista, "cboOficina",null);
    newLista = bloqueoCbo(listaTipo, arrayCab[6]);
    crearCombo(newLista, "cboTipoBien",null);

    cboOficina.value = arrayCab[1];
    enti_secuencia = arrayCab[2];
    txtAnioCN2.value = arrayCab[3];
    dttFechaRegistro.value = arrayCab[4];
    cboPersonal.value = arrayCab[5];
    cboTipoBien.value = arrayCab[6];
    cboEstado.value = arrayCab[7];
    hest_secuencia = arrayCab[8];
    var nroUnidad = listaUndMedida.length;
    var nroArrayDeta = listaDetalles.length;
    var detalle, preDeta, medida;

    matrixDeta = crearMatriz2D(matrixDeta, nroArrayDeta);
    for (var i = 0; i < nroArrayDeta; i++) {
        detalle = listaDetalles[i].split("|");
        for (var j = 0; j < nroUnidad; j++) {
            medida = listaUndMedida[j].split("|");
            if (detalle[2] == medida[0]) {
                preDeta = medida[1];
                break;
            }
        }
        preDeta = detalle[1] + "|" + detalle[19] + "|" + detalle[3] + "|" + preDeta + "|" + detalle[2];
        adicionarItem(preDeta, detalle[0]);
        matrixDeta[i][0] = detalle[0];
        matrixDeta[i][1] = detalle[1];
        matrixDeta[i][2] = detalle[2];
        matrixDeta[i][3] = detalle[3];

        matrixDeta[i][4] = detalle[4];
        matrixDeta[i][5] = detalle[5];
        matrixDeta[i][6] = detalle[6];
        matrixDeta[i][7] = detalle[7];
        matrixDeta[i][8] = detalle[8];
        matrixDeta[i][9] = detalle[9];
        matrixDeta[i][10] = detalle[10];
        matrixDeta[i][11] = detalle[11];
        matrixDeta[i][12] = detalle[12];
        matrixDeta[i][13] = detalle[13];
        matrixDeta[i][14] = detalle[14];
        matrixDeta[i][15] = detalle[15];
        matrixDeta[i][16] = detalle[16];
        matrixDeta[i][17] = detalle[17];
        matrixDeta[i][18] = detalle[18];
        poblarGrillaEditable(matrixDeta, i);
    }
}

function bloqueoCbo(lista, id) {
    var nroList = lista.length;
    var elemento,valor;
    for (var i = 0; i < nroList; i++) {
        elemento = lista[i].split("|");
        if (elemento[0] == id) {
            valor = lista[i];
            lista = [];
            lista.push(valor);
            break;
        }
    }
    return lista;
}


function limpiarGrilla() {
    var tbDetalleCN = document.getElementById("tbDetalleCN");
    var filas = tbDetalleCN.getElementsByTagName("tr");
    var nroFilas = filas.length;
    if (nroFilas != 0) {
        for (var i = nroFilas; i > -1; i--) {
            var fila = filas[i];
            if (fila != undefined) tbDetalleCN.removeChild(fila);
        }
        var spnNroItems = document.getElementById("spnNroItems");
        spnNroItems.innerHTML = "Items: 0";
    }
}

function crearMatriz2D(matriz, rows) {
    matriz = new Array(rows);
    for (var i = 0; i < rows; i++) {
        matriz[i] = new Array(21);
    }
    return matriz;
}

function poblarGrillaEditable(matriz, item) {
    var tbDetalleCN = document.getElementById("tbDetalleCN");
    var fila = tbDetalleCN.lastChild;
    var cells = fila.getElementsByTagName("td");
    var nroCells = cells.length;
    var colItem, texto, valor;
    var subTot = 0;
    fila.setAttribute("data-pos", item);
    for (var i = 6; i < nroCells; i++) {
        if (cells[i].hasAttribute("data-col")) {
            colItem = cells[i].getAttribute("data-col");
            cells[i].innerHTML = (matriz[item][colItem] * 1).toFixed(2).toString();
            cells[i].style.textAlign = "center";
            cells[i].style.fontWeight = "bold";
        } else {
            if (cells[i].hasChildNodes()) {
                texto = cells[i].firstChild;
                if (texto.hasAttribute("data-col")) {
                    colItem = texto.getAttribute("data-col");
                    valor = (matriz[item][colItem] * 1);
                    texto.value = valor == 0 ? "" : valor.toFixed(2).toString();
                    subTot += (texto.value == "" ? 0 : texto.value) * 1;
                }
            } else {
                cells[i].innerHTML = subTot.toFixed(2).toString();
                cells[i].style.textAlign = "center";
                cells[i].style.fontWeight = "bold";
                subTot = 0;
            }
        }
    }
    var spnNroItems = document.getElementById("spnNroItems");
    spnNroItems.innerHTML = "Items: " + (item + 1);
}

function grabarCNEditData() {
    var data = "";
    var nroDat = matrixDeta.length;
    var txtIdRegistro = document.getElementById("txtIdRegistro");
    var secuencia = txtIdRegistro.value;
    var nulos;
    for (var i = 0; i < nroDat; i++) {
        if (matrixDeta[i][0] != "x") {
            nulos = 0;
            for (var j = 4; j < 19; j++) {
                nulos +=  matrixDeta[i][j] * 1;
            }
            if (matrixDeta[i][6] == undefined || matrixDeta[i][6] == "" || (matrixDeta[i][6]*1 < 1 && Math.abs(nulos) > 0)) {
                Swal.fire({
                    title: 'Advertencia!',
                    text: "El subTotal debe ser mayor a cero.",
                    icon: 'warning',
                    showConfirmButton: true,
                    timer: 3000
                })
                return "";
            } else {
                data += matrixDeta[i][0];
                data += "|";
                data += secuencia;
                for (var j = 1; j < 19; j++) {
                    data += "|";
                    data += matrixDeta[i][j];
                }
                data += "¬";
            }
        }
    }
    data = data.substr(0, data.length - 1);
    return data;
}

function mostrarDatosExportar(rpta) {
    if (rpta) {
        // spnLoad.style.display = 'none';
        var listas = rpta.split('¯');
        var tituloReporte = listas[0];
        contenidoExporta = listas[1];

        archivo = tituloReporte + ".xlsx";
        Http.postDownloadBytes("General/exportar/?orienta=V&nombreArchivo=" + archivo, mostrarExportar, contenidoExporta);
    }
}

function mostrarExportar(rpta) {
    //spnLoad.style.display = 'none';
    if (rpta) {
        descargarArchivo(rpta, obtenerMime());

    }
    else {
        mostrarMensaje("No tiene archivo de descarga", "error");
    }
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

function descargarArchivo(contenido, tipoMime) {
    var blob = new Blob([contenido], { "type": tipoMime });
    var enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = archivo;
    enlace.click();
    document.removeChild(enlace);
}


function mostrarAyudasReporte(rpta) {
    if (rpta) {
        var listaOficinas = rpta.split('¬');
        crearCombo(listaOficinas, "cboOficina3", "Seleccione");
    }
}