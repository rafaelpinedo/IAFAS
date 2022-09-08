var filaAnterior = null;
var idUsu = "";
var vista = "";
var controller = "";
var idCombos = [];
var listas = [];
var ayudas = [];
var formulario = [];
var idRegistro = "";
var operacion = 0;
var listaItemInventario = [];
var listaUbigeo = [];
var listaComiteItem = [];
var listaEstadoBuenaProItem = [];
var idTabActivo = "";
var idCombos = [];
var listas = [];
var ayudas = [];
var formulario = [];

var botonesProceso = [
    { "cabecera": "Editar", "clase": "fa fa-plus-circle btn btn-info btnCirculo", "id": "Proceso" },
    { "cabecera": "Editar", "clase": "fa fa-pencil btn btn-info btnCirculo", "id": "Editar" },
    { "cabecera": "Anular", "clase": "fa fa-minus-circle btn btn-danger btnCirculo", "id": "Eliminar" },
];

window.onload = function () {
    getConfigMn();
    vista = window.sessionStorage.getItem("Vista");
    controller = window.sessionStorage.getItem("Controller");
    if (vista == "PAC" || vista == "Contrato" || vista == "Prosel" || vista == "Tipoproceso") {
        getListarLicitaPac();
    }
    else {
        getListar();
    }
    configurarBotones();
    configurarCombos();
}


function NumCheck(e, field) {
    key = e.keyCode ? e.keyCode : e.which
    // backspace
    if (key == 8) return true
    // 0-9
    if (key > 47 && key < 58) {
        if (field.value == "") return true
        regexp = /^\d+(\.\d{0,2})?$/;
        return (regexp.test(field.value))
    }
    // .
    if (key == 46) {
        if (field.value == "") return false
        regexp = /^[0-9]+$/
        return regexp.test(field.value)
    }

    return false
}

function getListar() {
    var data = "";
    Http.get("General/listarTabla?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
}

function getListarLicitaPac() {
    var anioFiscal = document.getElementById("txtAnioFiscal").value;
    Http.get("General/listarTabla/?tbl=" + controller + vista + "&data=" + anioFiscal, mostrarlistas);
}

function mostrarlistas(rpta) {
    if (rpta) {
        var listas = rpta.split("¯");
        var lista = listas[0].split("¬");

        if (vista == "Comite") {
            var listaPersonal = listas[1].split("¬");
            var listaEstado = listas[2].split("¬");
            var listaCargo = listas[3].split("¬");

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);

            listarSelect2Item(listaPersonal, "cboPersona");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
            crearCombo(listaCargo, "cboCargoPersona", "Seleccione");

        }
        else if (vista == "PAC") {
            var listaEntidad = listas[1].split("¬");
            var listaEstado = listas[2].split("¬");

            var listaTipoItem = listas[3].split("¬");
            var listaTipoCompra = listas[4].split("¬");
            //var listaEntidadConvocante = listas[5].split("¬");
            var listaTipo = listas[6].split("¬");
            var listaTipoProceso = listas[7].split("¬");
            var listabjetoContratacion = listas[8].split("¬");
            var listaAntecendes = listas[9].split("¬");
            var listaFuenteFto = listas[10].split("¬");
            var listaOficinaProceso = listas[11].split("¬");
            var listaFechaPrevista = listas[12].split("¬");
            listaUbigeo = listas[13].split("¬");
            listaItemInventario = listas[14].split("¬");

            var listaUnidadMedi = listas[15].split("¬");
            var listaTipoMoneda = listas[16].split("¬");


            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botonesProceso, 38, false, null);
            crearCombo(listaEntidad, "cboEntidadPAC", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
            crearCombo(listaTipoItem, "cboTipoItem", "Seleccione");
            crearCombo(listaTipoCompra, "cboTipoCompra", "Seleccione");
            //crearCombo(listaEntidadConvocante, "cboTipoConvocante", "Seleccione");
            crearCombo(listaTipo, "cboTipo", "Seleccione");
            crearCombo(listaTipoProceso, "cboTipoProceso", "Seleccione");
            crearCombo(listabjetoContratacion, "cboObjetoContratacion", "Seleccione");
            crearCombo(listaAntecendes, "cboAntecedentes", "Seleccione");
            crearCombo(listaFuenteFto, "cboFuenteFto", "Seleccione");
            crearCombo(listaEntidad, "cboEntidadProceso", "Seleccione");
            crearCombo(listaOficinaProceso, "cboOficinaProceso", "Seleccione");
            crearCombo(listaFechaPrevista, "cboFechaPrevista", "Seleccione");
            // crearCombo(listaInventario, "cboCatalogoItem", "Seleccione");
            crearCombo(listaUnidadMedi, "cboUnidadMedida", "Seleccione");
            crearCombo(listaTipoMoneda, "cboTipoMoneda", "Seleccione");

            listarDepartamentos();
            listarItemInventario();

        }
        else if (vista == "Prosel") {
            var listaSolicitud = listas[1].split("¬");
            var listaTipoItem = listas[2].split("¬");
            var listaProcedimiento = listas[3].split("¬");
            listaComiteItem = listas[4];
            var listaComite = listas[4].split("¬");
            var listaEstado = listas[5].split("¬");
            var listaProveedor = listas[6].split("¬");
            listaEstadoBuenaProItem = listas[7].split("¬");

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaSolicitud, "cboSolicitudCompra", "Ninguno");
            crearCombo(listaTipoItem, "cboTipoItem", "Seleccione");
            crearCombo(listaProcedimiento, "cboProcedimiento", "Seleccione");
            crearCombo(listaComite, "cboComite", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
            listarSelect2Item(listaProveedor, "cboProveedorProsel");

            document.getElementById("tabProsel").style.display = "block";
        }
        else if (vista == "Contrato") {
            var listaProSel = listas[1].split("¬");
            var listaEstado = listas[2].split("¬");
            var listaTipoItem = listas[3].split("¬");
            var listaMoneda = listas[4].split("¬");
            var listaProveedor = listas[5].split("¬");

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaProSel, "cboLicitacion", "Ninguno");
            crearCombo(listaTipoItem, "cboTipoItem", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
            crearCombo(listaMoneda, "cboMoneda", "Seleccione");
            crearCombo(listaProveedor, "cboProveedor", "Seleccione");
        }
        else if (vista == "Tipoproceso") {
                grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, null, 38, false, null);
        }
        else {
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
        }
    }
}


function listarSelect2Item(lista, idCombo) {
    var nRegistros = lista.length;
    var contenido = "<option value=''>Seleccione</option>";
    var campos, idCodigo, nombre;
    for (var i = 0; i < nRegistros; i++) {
        campos = lista[i].split('|');
        idCodigo = campos[0];
        nombre = campos[1];
        contenido += "<option value='";
        contenido += idCodigo;
        contenido += "'>";
        contenido += nombre;
        contenido += "</option>";
    }
    var cbo = document.getElementById(idCombo);
    if (cbo != null) {
        cbo.innerHTML = contenido;
    }
}

function listarItemInventario() {
    var idTipoServicio = cboObjetoContratacion.value;
    //Servicios y Consultoria de Obras
    if (idTipoServicio == "2" || idTipoServicio == "4") {
        idTipoServicio = "2";
    }

    var nRegistros = listaItemInventario.length;
    var contenido = "<option value=''>Seleccione</option>";
    var campos, idItem, nombreItem, idTipoServ;
    for (var i = 0; i < nRegistros; i++) {
        campos = listaItemInventario[i].split('|');
        idItem = campos[0];
        nombreItem = campos[1];
        idTipoServ = campos[2];

        if (idTipoServ == idTipoServicio) {
            contenido += "<option value='";
            contenido += idItem;
            contenido += "'>";
            contenido += nombreItem;
            contenido += "</option>";
        }
    }
    var cbo = document.getElementById("cboCatalogoItem");
    if (cbo != null) cbo.innerHTML = contenido;
}


function listarDepartamentos() {
    var nRegistros = listaUbigeo.length;
    var contenido = "<option value=''>Seleccione</option>";
    var idDpto, idProv, idDist, nombre, ubigeo;
    for (var i = 0; i < nRegistros; i++) {
        ubigeo = listaUbigeo[i];
        idDpto = ubigeo.substr(0, 2);
        idProv = ubigeo.substr(2, 2);
        idDist = ubigeo.substr(4, 2);
        if (idDpto != "00" && idProv == "00" && idDist == "00") {
            nombre = ubigeo.substr(6, ubigeo.length - 6);
            contenido += "<option value='";
            contenido += idDpto;
            contenido += "'>";
            contenido += nombre;
            contenido += "</option>";
        }
    }
    var cbo = document.getElementById("cboDepartamento");
    if (cbo != null) cbo.innerHTML = contenido;
    listarProvincias();
}

function listarProvincias() {
    var nRegistros = listaUbigeo.length;

    var contenido = "<option value=''>Seleccione</option>";
    var idDpto, idProv, idDist, nombre, ubigeo;
    var idDptoSel = document.getElementById("cboDepartamento").value;
    for (var i = 0; i < nRegistros; i++) {
        ubigeo = listaUbigeo[i];
        idDpto = ubigeo.substr(0, 2);
        idProv = ubigeo.substr(2, 2);
        idDist = ubigeo.substr(4, 2);
        if (idDpto == idDptoSel && idProv != "00" && idDist == "00") {
            nombre = ubigeo.substr(6, ubigeo.length - 6);
            contenido += "<option value='";
            contenido += idProv;
            contenido += "'>";
            contenido += nombre;
            contenido += "</option>";
        }
    }
    var cbo = document.getElementById("cboProvincia");
    if (cbo != null) cbo.innerHTML = contenido;
    listarDistritos();
}

function listarDistritos() {
    var nRegistros = listaUbigeo.length;
    var contenido = "<option value=''>Seleccione</option>";
    var idDpto, idProv, idDist, nombre, ubigeo;
    var idDptoSel = document.getElementById("cboDepartamento").value;
    var idProvSel = document.getElementById("cboProvincia").value;
    for (var i = 0; i < nRegistros; i++) {
        ubigeo = listaUbigeo[i];
        idDpto = ubigeo.substr(0, 2);
        idProv = ubigeo.substr(2, 2);
        idDist = ubigeo.substr(4, 2);
        if (idDpto == idDptoSel && idProv == idProvSel && idDist != "00") {
            nombre = ubigeo.substr(6, ubigeo.length - 6);
            contenido += "<option value='";
            contenido += idDist;
            contenido += "'>";
            contenido += nombre;
            contenido += "</option>";
        }
    }
    var cbo = document.getElementById("cboDistrito");
    if (cbo != null) cbo.innerHTML = contenido;
}


function grabarDatosVarios(clase, tab) {
    var idPrincipal = txtIdRegistro.value;
    var data = ""
    var frm = new FormData();
    data = idPrincipal + '|' + obtenerDatosGrabar(clase);
    frm.append("data", data);
    Http.post("General/guardar/?tbl=" + controller + vista + tab, mostrarGrabarTab, frm);
}

function grabarDatos() {
    var data = ""
    var frm = new FormData();
    data = obtenerDatosGrabar("Popup");

    if (vista == "Comite") {
        let detalle = obtenerItemComision();
        data += '¯' + detalle;
    }
    if (vista == "PAC") {
        var txtIdRegistro = document.getElementById("txtIdRegistro").value;
        if (txtIdRegistro != null) {
            data += '|' + txtAnioFiscal.value;
        }
    }
    if (vista == "Prosel") {
        data += '¯' + txtAnioFiscal.value;
    }
    frm.append("data", data);
    Http.post("General/guardar/?tbl=" + controller + vista, mostrarGrabar, frm);
}

function mostrarGrabarTab(rpta) {
    var mensajeResul = [];
    if (rpta) {
        var listas = rpta.split("¯")
        var lista = listas[0].split("¬");
        mensajeResul = listas[1].split("|");
        var tipo = mensajeResul[0];
        var mensaje = mensajeResul[1];
        divPopupContainerForm1.style.display = 'none';
        if (idTabActivo == "tabGarantia") {
            grillaGarantia = new GrillaScroll(lista, "divListaGarantia", 100, 6, vista, controller, null, false, true, null, 32, false, null);
        }
        else if (idTabActivo == "tabAdelanto") {
            grillaAdelanto= new GrillaScroll(lista, "divListaAdelanto", 100, 6, vista, controller, null, false, true, null, 32, false, null);
        }
        else if (idTabActivo == "tabAdenda") {
            grillaAdenda = new GrillaScroll(lista, "divListaAdenda", 100, 6, vista, controller, null, false, true, null, 32, false, null);
        }
        else if (idTabActivo == "tabCronograma") {
            grillaCronograma = new GrillaScroll(lista, "divListaCronograma", 100, 6, vista, controller, null, false, true, null, 32, false, null);
        }

        if (tipo == 'A') {
            Swal.fire({
                title: 'Finalizado!',
                text: mensaje,
                icon: 'success',
                showConfirmButton: true,
                timer: 2000
            })
            
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
}

function obtenerDatosGrabar(clase) {
    var data = "";
    var controles = document.getElementsByClassName(clase);
    var control;
    var nControles = controles.length;
    for (var j = 0; j < nControles; j++) {
        control = controles[j];
        switch (control.tagName) {
            case "INPUT":
                if (control.id.substr(0, 3) == "txt") data += control.value;
                if (control.id.substr(0, 3) == "num") data += control.value;
                if (control.id.substr(0, 3) == "dtt") {
                    if (control.value != "") {
                        var dFecha = control.value.split("-");
                        data += dFecha[2] + "-" + dFecha[1] + "-" + dFecha[0];
                    }
                    else { data += ""; }
                }
                if (control.id.substr(0, 3) == "tim") data += control.value;
                if (control.id.substr(0, 3) == "chk") data += (control.checked ? "1" : "0");
                if (control.id.substr(0, 3) == "opt") data += (control.checked ? "1" : "0");
                if (control.id.substr(0, 3) == "dtg") data += (control.checked ? "1" : "0");
                break;
            case "SELECT":
                data += control.value;
                break;
            case "TEXTAREA":
                data += control.value;
                break;
            case "IMG":
                data += control.src.replace("data:image/jpeg;base64,", "");
                break;
        }
        data += "|";
    }
    data = data.substr(0, data.length - 1);

    return data;
}


function mostrarGrabar(rpta) {
    var mensajeResul = [];
    if (rpta) {
        listas = rpta.split("¯")
        lista = listas[0].split("¬");
        mensajeResul = listas[1].split("|");
        var tipo = mensajeResul[0];
        var mensaje = mensajeResul[1];
        divPopupContainer.style.display = 'none';

        if (vista == "PAC") {
            divPopupContainerForm1.style.display = 'none';
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botonesProceso, 38, false, null);
        }
        else {
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
        }

        


        if (tipo == 'A') {
            Swal.fire({
                title: 'Finalizado!',
                text: mensaje,
                icon: 'success',
                showConfirmButton: true,
                timer: 2000
            })
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
            let txtIdPac = document.getElementById("txtIdPac");
            if (txtIdPac != null) {
                txtIdPac.value = "0";
            }

            let divContratoDetalle = document.getElementById("divContratoDetalle");
            if (divContratoDetalle != null) divContratoDetalle.style.display = 'inline';

            editarRegistro(idRegistro);
        }
        if (idBoton == "Eliminar") {
            eliminarRegistro(idRegistro)
        }
        if (idBoton == "Proceso") {
            divListaDetalle.style.display = 'none';
            let txtIdPac = document.getElementById("txtIdPac");
            if (txtIdPac != null) {
                txtIdPac.value = idRegistro;
            }
            Http.get("General/listarTabla/?tbl=" + controller + vista + 'Detalle&data=' + idRegistro, mostrarDetalles);
        }
    }

    if (idGrilla == "divListaPAC") {
        if (idBoton == "Editar") {
            let tituloModal = document.getElementById("tituloModal");
            if (tituloModal != null) {
                tituloModal.innerText = "Actualizar Registro";
            }

            var txtIdPac = document.getElementById("txtIdPac");
            if (txtIdPac != null) { txtIdPac.value = idRegistro }

            Http.get("General/obtenerTabla/?tbl=" + controller + vista + 'Proceso' + '&id=' + idRegistro, mostrarRegistro);

            return;

        }
        if (idBoton == "Eliminar") {

            var data = "";
            data = idRegistro;
            var frm = new FormData();
            frm.append("data", data);

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
                    Http.post("General/eliminar/?tbl=" + controller + vista + 'Proceso', mostrarDetallesProceso, frm);
                }
            })
            //eliminarRegistro(idRegistro);
        }
    }
}

function mostrarDetallesProceso(rpta) {
    var mensajeResul = [];
    if (rpta) {
        listas = rpta.split("¯")
        lista = listas[0].split("¬");
        mensajeResul = listas[1].split("|");
        var tipo = mensajeResul[0];
        var mensaje = mensajeResul[1];
        divPopupContainerForm3.style.display = 'none';

        grillaItem = new GrillaScroll(lista, "divListaPAC", 100, 6, vista, controller, null, null, true, botones, 38, false, null);

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
}

function mostrarDetalles(rpta) {
    if (rpta) {
        divPopupContainerForm1.style.display = 'block'
        var lista = rpta.split('¬');
        grillaItemPac = new GrillaScroll(lista, "divListaPAC", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
    }
}

function editarRegistro(id) {
    if (vista == 'Contrato') {
        Http.get("General/obtenerTabla/?tbl=" + controller + vista + '&id=' + id, mostrarContrato);
    }
    else {
        Http.get("General/obtenerTabla/?tbl=" + controller + vista + '&id=' + id, mostrarRegistro);
    }
}

function eliminarRegistro(id) {
    var data = "";
    data = id;

    if (vista == "Prosel") {
        data += '|' + txtAnioFiscal.value;
    }
    // if (vista ="")

    var frm = new FormData();
    frm.append("data", data);

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
            if (vista == "Contrato" && idTabActivo == "tabGarantia") {
                Http.post("General/eliminar/?tbl=" + controller + vista + 'Garantia', mostrarEliminarTab, frm);
            }
            else if (vista == "Contrato" && idTabActivo == "tabCronograma") {
                Http.post("General/eliminar/?tbl=" + controller + vista + 'Cronograma', mostrarEliminarTab, frm);
            }
            else if (vista == "Contrato" && idTabActivo == "tabCronograma") {
                Http.post("General/eliminar/?tbl=" + controller + vista + 'Cronograma', mostrarEliminarTab, frm);
            }
            else if (vista == "Contrato" && idTabActivo == "tabAdelanto") {
                Http.post("General/eliminar/?tbl=" + controller + vista + 'Adelanto', mostrarEliminarTab, frm);
            }
            else if (vista == "Contrato" && idTabActivo == "tabAdenda") {
                Http.post("General/eliminar/?tbl=" + controller + vista + 'Adenda', mostrarEliminarTab, frm);
            }
            else {
                Http.post("General/eliminar/?tbl=" + controller + vista, mostrarEliminar, frm);
            }
        }
    })
}

function mostrarContrato(rpta) {
    if (rpta) {
        divLicitacion.style.display = 'none';
        var listas = rpta.split("¯");
        var campos = listas[0].split('|');
        var listaDetalle = listas[1].split('¬');

        var controlesSelectSearch = document.getElementsByClassName("SelectSearch");
        var nControlesSelectSearch = controlesSelectSearch.length;

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
            if (tipo == "txt" || tipo == "tta" || tipo == "tim") { control.value = campos[j]; }
            else if (tipo == "num") {
                control.style.textAlign = "right";
                control.value = campos[j];
            }
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

        listasDetalleContrato(listaDetalle);
    }
}

function mostrarRegistro(rpta) {
    if (rpta) {
        var campos = rpta.split("|");
        var controlesSelectSearch = document.getElementsByClassName("SelectSearch");
        var nControlesSelectSearch = controlesSelectSearch.length;
        var cboEstado = document.getElementById("cboEstado");
        if (cboEstado != null) { cboEstado.disabled = false };
        var cboEmpresa = document.getElementById("cboEmpresa");
        if (cboEmpresa != null) { cboEmpresa.disabled = false };
        var select2cboPadre = document.getElementById("select2-cboPadre-container");
        if (select2cboPadre != null) select2cboPadre.innerHTML = "Seleccione";


        if (vista == "Comite") {
            var dataH = rpta.split('¯')[0];
            var dataList = rpta.split('¯')[1];

            campos = dataH.split('|');

            txtIdRegistro.value = campos[0];
            txtAnio.value = campos[1];
            txtNumResol.value = campos[2];
            txtObjContrat.value = campos[3];
            var dFechaReque = campos[4].split("/");
            txtFechaCom.value = dFechaReque[2] + "-" + dFechaReque[1] + "-" + dFechaReque[0];
            cboEstado.value = campos[5];

            var select2cboPersona = document.getElementById("select2-cboPersona-container");
            if (select2cboPersona != null) select2cboPersona.innerHTML = "Seleccione";
            tbDetalleComite.innerHTML = "";
            listasDetalleComite(dataList);
            var divPopupContainer = document.getElementById("divPopupContainer");
            if (divPopupContainer != null) { divPopupContainer.style.display = 'block'; };
            return;
        }
        else if (vista == "PAC") {
            var txtIdPacPr = document.getElementById("txtIdPac").value;
            if (txtIdPacPr != "0") {
                if (campos[0] != '0¯0') {
                    var listaCabe = rpta.split("¯")[0];
                    var listaDetalle = rpta.split("¯")[1];
                    campos = listaCabe.split("|");

                    txtIdPac.value = campos[0];
                    txtIdPacProceso.value = campos[1];
                    cboTipoItem.value = campos[2];
                    cboTipoCompra.value = campos[3];
                    txtEntidadConv.value = campos[4];
                    cboTipo.value = campos[5];
                    cboTipoProceso.value = campos[6];
                    cboObjetoContratacion.value = campos[7];
                    cboAntecedentes.value = campos[8];
                    txtComentarioAntecedente.value = campos[9];
                    txtDescripcionServicio.value = campos[10];
                    cboFuenteFto.value = campos[11];
                    cboOficinaProceso.value = campos[12];
                    cboFechaPrevista.value = campos[13];

                    listarDepartamentos();
                    cboDepartamento.value = campos[14];
                    document.getElementById('select2-cboDepartamento-container').innerHTML = cboDepartamento.options[cboDepartamento.selectedIndex].text;
                    listarProvincias();
                    cboProvincia.value = campos[15];
                    document.getElementById('select2-cboProvincia-container').innerHTML = cboProvincia.options[cboProvincia.selectedIndex].text;
                    listarDistritos();
                    cboDistrito.value = campos[16];
                    document.getElementById('select2-cboDistrito-container').innerHTML = cboDistrito.options[cboDistrito.selectedIndex].text;
                    cboTipoMoneda.value = campos[17];
                    txtTipoCambio.value = campos[18];
                    txtObservaciones.value = campos[19];

                    let comentarioAntecedente = document.getElementById("txtComentarioAntecedente");
                    if (campos[9] == "") {
                        comentarioAntecedente.readOnly = true;
                    }
                    else {
                        comentarioAntecedente.readOnly = false;
                    }
                    //Detalle
                    tbDetalleItemPac.innerHTML = "";
                    listasDetalPacProcesos(listaDetalle);

                }
                else {
                    var idpac = txtIdPac.value;
                    limpiarForm("Popuproceso");
                    tbDetalleItemPac.innerHTML = "";
                    tbBodyDetalleItemPac.innerHTML = "";
                    txtIdPac.value = idpac;
                    listarDepartamentos();
                    document.getElementById("txtComentarioAntecedente").readOnly = true;

                }

                listarItemInventario();
                divPopupContainerForm3.style.display = 'block';
            }
            else {

                txtIdRegistro.value = campos[0];
                cboEntidadPAC.value = campos[1];
                txtAnioPAC.value = campos[2];
                txtVersion.value = campos[3];
                txtAprobacion.value = campos[4];
                cboEstado.value = campos[5];

                var divPopupContainer = document.getElementById("divPopupContainer");
                if (divPopupContainer != null) { divPopupContainer.style.display = 'block'; };
            }

        }
        else if (vista == "Prosel") {
            var dataH = rpta.split('¯')[0];
            campos = dataH.split('|');
            txtIdRegistro.value = campos[0];
            txtAnioFiscalModal.value = campos[1];
            cboSolicitudCompra.value = campos[2];
            txtNumeroProceso.value = campos[3];
            var dFechaReque = campos[4].split("/");
            txtFechaEmision.value = dFechaReque[2] + "-" + dFechaReque[1] + "-" + dFechaReque[0];

            cboEstado.value = campos[5];
            cboTipoItem.value = campos[6];
            txtObjetoProceso.value = campos[7];
            txtValorreferencial.value = campos[8];
            cboProcedimiento.value = campos[9];
            cboComite.value = campos[10];

            txtEvalTecnica.value = campos[11];
            txtEvalEconomica.value = campos[12];
            txtEvalMinTecnica.value = campos[13];
            //datos del Tab
            var dataCalendario = rpta.split('¯')[1];
            var dataCabeCal = dataCalendario.split('¥')[0];
            //var dataCaleDet = dataCalendario.split('¥')[0];

            var dataDetallEvaTecnica = rpta.split('¯')[2];
            var dataDetallRegistro = rpta.split('¯')[3];
            var dataDetallBuenaPro = rpta.split('¯')[4];
            var dataDetallSolicitud = rpta.split('¯')[5];
            var camposHCal = "";
          

            tabProsel.style.display = "block";
            limpiarTablesTabProcesoSeleccion();
            tabSolicitudCompraDetalle(dataDetallSolicitud);
            if (dataCabeCal != "") {
                camposHCal = dataCabeCal.split('|');
                txtIdCal.value = camposHCal[0];
                txtNumeroDocCal.value = camposHCal[1];
                txtFechaEmisionCal.value = camposHCal[2];
                txtGlosaCal.value = camposHCal[3];
                listarCalendarioProsel(dataCalendario, 'S');

                tabRegistroListar(dataDetallRegistro);
                tabEvaTecnicaProveedorListar(dataDetallRegistro);
                tabEvaEconomicaProveedorListar(dataDetallRegistro);
                //buena  pro
                listarTabBuenaPro(dataDetallBuenaPro);
            }
            else {
                limpiarForm("PopupCal");
                listarCalendarioProsel(dataCalendario, 'N');
            }

            tabEvaluacionTecnicaListar(dataDetallEvaTecnica);

            var divPopupContainer = document.getElementById("divPopupContainer");
            if (divPopupContainer != null) { divPopupContainer.style.display = 'block'; };

            var elemento = document.querySelectorAll(".buenapro");
            for (var i = 0; i < elemento.length; i++) {
                if (campos[5] == "3") {
                    elemento[i].classList.add("clase-hiddeBuenapro");
                }
                else {
                    elemento[i].classList.remove("clase-hiddeBuenapro");
                }
            }

            return;
        }
        else {
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
                if (tipo == "txt" || tipo == "tta" || tipo == "tim") { control.value = campos[j]; }
                else if (tipo == "num") {
                    control.style.textAlign = "right";
                    control.value = campos[j];
                }
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

function listarSelect2Item(lista, idCombo) {
    var nRegistros = lista.length;
    var contenido = "<option value=''>Seleccione</option>";
    var campos, idCodigo, nombre;
    for (var i = 0; i < nRegistros; i++) {
        campos = lista[i].split('|');
        idCodigo = campos[0];
        nombre = campos[1];
        contenido += "<option value='";
        contenido += idCodigo;
        contenido += "'>";
        contenido += nombre;
        contenido += "</option>";
    }
    var cbo = document.getElementById(idCombo);
    if (cbo != null) {
        cbo.innerHTML = contenido;
    }
}

function configurarBotones() {
    var btnEliminarForm = document.getElementById("btnEliminarForm");
    if (btnEliminarForm != null) btnEliminarForm.onclick = function () {
        if (idRegistro == "") {
            mostrarMensaje('Seleccione un registro de la lista')
        }
        else {
            eliminarRegistro(idRegistro);
        }
    }

    var btnNuevoForm = document.getElementById("btnNuevoForm");
    if (btnNuevoForm != null) btnNuevoForm.onclick = function () {
        divPopupContainerForm1.style.display = 'block';
        if (idTabActivo == "tabGarantia") {
            nombreFormulario.innerHTML = "Registro de Garantía";
            limpiarForm("PopupGar");
        }
        else if (idTabActivo == "tabCronograma") {
            nombreFormulario.innerHTML = "Registro de Cronograma";
            limpiarForm("PopupCrono");
        }
        else if (idTabActivo == "tabAdelanto") {
            nombreFormulario.innerHTML = "Registro de Adelanto";
            limpiarForm("PopupAdel");
        }
        else if (idTabActivo == "tabAdenda") {
            nombreFormulario.innerHTML = "Registro de Adenda";
            limpiarForm("PopupAdend");
        }
    }

    var tabCompromiso = document.getElementById("tabCompromiso");
    if (tabCompromiso != null) tabCompromiso.onclick = function () {
        idTabActivo = "tabCompromiso";
        btnNuevoForm.style.display = 'none';
        btnEliminarForm.style.display = 'none';
    }

    var tabGarantia = document.getElementById("tabGarantia");
    if (tabGarantia != null) tabGarantia.onclick = function () {
        idTabActivo = "tabGarantia";
        var idRegistro = txtIdRegistro.value;
        if (idRegistro != "") { 
            Http.get("General/listarTabla?tbl=" + controller + vista + "Garantia&data=" + idRegistro, mostrarlistaTab);
        }
        btnNuevoForm.style.display = 'inline';
        btnEliminarForm.style.display = 'inline';
        return;
    }

    var tabCronograma = document.getElementById("tabCronograma");
    if (tabCronograma != null) tabCronograma.onclick = function () {
        idTabActivo = "tabCronograma";
        var idRegistro = txtIdRegistro.value;
        if (idRegistro != "") {
            Http.get("General/listarTabla?tbl=" + controller + vista + "Cronograma&data=" + idRegistro, mostrarlistaTab);
        }
        btnNuevoForm.style.display = 'inline';
        btnEliminarForm.style.display = 'inline';
        return;
    }

    var tabAdelanto = document.getElementById("tabAdelanto");
    if (tabAdelanto != null) tabAdelanto.onclick = function () {
        idTabActivo = "tabAdelanto";
        var idRegistro = txtIdRegistro.value;
        if (idRegistro != "") {
            Http.get("General/listarTabla?tbl=" + controller + vista + "Adelanto&data=" + idRegistro, mostrarlistaTab);
        }
        btnNuevoForm.style.display = 'inline';
        btnEliminarForm.style.display = 'inline';
        return false;
    }

    var tabAdenda = document.getElementById("tabAdenda");
    if (tabAdenda != null) tabAdenda.onclick = function () {
        idTabActivo = "tabAdenda";
        var idRegistro = txtIdRegistro.value;
        if (idRegistro != "") {
            Http.get("General/listarTabla?tbl=" + controller + vista + "Adenda&data=" + idRegistro, mostrarlistaTab);
        }
        btnNuevoForm.style.display = 'inline';
        btnEliminarForm.style.display = 'inline';
        return false;
    }

    var btnNuevo = document.getElementById("btnNuevo");
    if (btnNuevo != null) btnNuevo.onclick = function () {
        divPopupContainer.style.display = 'block';
        limpiarForm("Popup");

        
        let divContratoDetalle = document.getElementById("divContratoDetalle");
        if (divContratoDetalle != null) {
            divContratoDetalle.style.display = 'none';
        }

        let tbBodyListDetalleItemPac = document.getElementById("tbBodyListDetalleItemPac");
        if (tbBodyListDetalleItemPac != null) {
            tbBodyListDetalleItemPac.innerText = "";
        }

        let tbListDetalleItemPac = document.getElementById("tbListDetalleItemPac");
        if (tbListDetalleItemPac != null) {
            tbListDetalleItemPac.innerText = "";
        }

        let divListaGarantia = document.getElementById("divListaGarantia");
        if (divListaGarantia != null) {
            divListaGarantia.innerText = "";
        }

        let divListaCronograma = document.getElementById("divListaCronograma");
        if (divListaCronograma != null) {
            divListaCronograma.innerText = "";
        }

        let tituloModal = document.getElementById("tituloModal");
        if (tituloModal != null) {
            tituloModal.innerText = "Nuevo Registro";
        }

        var txtAnio = document.getElementById("txtAnio");
        if (txtAnio != null) {
            var anio = txtAnio.getAttribute('value');
            txtAnio.value = anio;
        }

        var txtAnioFiscalModal = document.getElementById("txtAnioFiscalModal");
        if (txtAnioFiscalModal != null) {
            var anio = txtAnioFiscalModal.getAttribute('value');
            txtAnioFiscalModal.value = anio;
        }

        var cboEstado = document.getElementById("cboEstado");
        if (cboEstado != null) {
            cboEstado.value = 1;
            cboEstado.disabled = true;
        }

        var select2cboPersona = document.getElementById("select2-cboPersona-container");
        if (select2cboPersona != null) select2cboPersona.innerHTML = "Seleccione";

        var tbDetalleComite = document.getElementById("tbDetalleComite");
        if (tbDetalleComite != null) {
            tbDetalleComite.innerHTML = "";
        }

        var tabProsel = document.getElementById("tabProsel");
        if (tabProsel != null) {
            tabProsel.style.display = "none";
        }
        //var txtFechaComision = document.getElementById("dttFechaCom");
        //if (txtFechaComision != null) txtFechaComision.value = txtFechaComision.getAttribute("data-fecha");

    }

    var btnGuardar = document.getElementById("btnGuardar");
    if (btnGuardar != null) btnGuardar.onclick = function () {
        var validar = false;

        if (vista == "Comite" && validarInformacion("Reque") == true) {
            var nFilas = tbDetalleComite.rows.length;
            if (nFilas == 0) {
                mostrarMensaje("Asignar Personas a la Comisión", "error");
                return;
            }
            else {
                validar = true;
            }
        }
        else if (vista == "Prosel" && validarInformacion("Reque") == true) {
            var tecnica = txtEvalTecnica.value;
            var economica = txtEvalEconomica.value;

            var result = (tecnica * 1) + (economica * 1);
            if (parseFloat(result) != 100.0) {
                mostrarMensaje("Coeficiente Eval. Técnica - Económica ", "error");
                txtEvalTecnica.focus();
                return;
            }
            else {
                validar = true;
            }
        }
        else if (validarInformacion("Reque") == true) {
            validar = true;
        }
        if (validar == true) {
            Swal.fire({
                title: '¿Desea grabar la información?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.value) {
                    //if (vista == "PedidoCompra") {
                    //    grabarPedido();
                    //}

                    grabarDatos();
                    Swal.fire({
                        title: 'Procesando...',
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        onOpen: () => {
                            Swal.showLoading()
                        }
                    })
                }
            })
        }
    }

    var btnCancelar = document.getElementById("btnCancelar");
    if (btnCancelar != null) btnCancelar.onclick = function () {
        divPopupContainer.style.display = 'none';
    }

    var btnAddItemsComite = document.getElementById("btnAddItemsComite");
    if (btnAddItemsComite != null) btnAddItemsComite.onclick = function () {
        var validar = false;
        if (validarInformacion("RequeItem") == true) {
            validar = true;
        }
        if (validar == true) {

            var personal = document.getElementById("cboPersona");
            var cargo = document.getElementById("cboCargoPersona");
            var codPersonal = personal.value;
            var nombrePersonal = personal.options[personal.selectedIndex].text;
            var codCargo = cargo.value;
            var nombreCargo = cargo.options[cargo.selectedIndex].text;

            var item = 0;
            let mensage = '';
            var nFilas = tbDetalleComite.rows.length;
            item = nFilas + 1;
            var existe = false;
            for (var i = 0; i < nFilas; i++) {
                if (tbDetalleComite.rows[i].cells[0].innerHTML == codPersonal) {
                    existe = true;
                    mensage = "Personal ya se encuentra";
                    break;
                }
                if (tbDetalleComite.rows[i].cells[1].innerHTML == codCargo) {
                    mensage = "Cargo ya se encuentra";
                    existe = true;
                    break;
                }
            }
            if (existe) {
                mostrarMensaje(mensage, "warning");
            }
            else {
                var dataItem = '';
                dataItem = item + '|' + codPersonal + '|' + codCargo + '|' + nombrePersonal + '|' + nombreCargo;
                listasDetalleComite(dataItem);
            }
        }
    }

    var btnCancelarForm1 = document.getElementById("btnCancelarForm1");
    if (btnCancelarForm1 != null) btnCancelarForm1.onclick = function () {
        divPopupContainerForm1.style.display = 'none';
    }

    var btnCancelarForm2 = document.getElementById("btnCancelarForm2");
    if (btnCancelarForm2 != null) btnCancelarForm2.onclick = function () {
        divPopupContainerForm2.style.display = 'none';
    }

    var btnCancelarForm3 = document.getElementById("btnCancelarForm3");
    if (btnCancelarForm3 != null) btnCancelarForm3.onclick = function () {
        divPopupContainerForm3.style.display = 'none';
    }

    var btnAgregar = document.getElementById("btnAgregar");
    if (btnAgregar != null) btnAgregar.onclick = function () {
        if (vista == "Contrato" && idTabActivo == "tabGarantia") {
            if (validarInformacion("RequeGar")) grabarDatosVarios("PopupGar", "Garantia");
        }
        else if (vista == "Contrato" && idTabActivo == "tabCronograma") {
            if (validarInformacion("RequeCrono")) grabarDatosVarios("PopupCrono", "Cronograma");
        }
        else if (vista == "Contrato" && idTabActivo == "tabAdelanto") {
           if (validarInformacion("RequeAdel")) grabarDatosVarios("PopupAdel", "Adelanto");
        }
        else if (vista == "Contrato" && idTabActivo == "tabAdenda") {
            if (validarInformacion("RequeAdenda")) grabarDatosVarios("PopupAdend", "Adenda");
        }
    }

    if (vista == "PAC") {
        //Nuevo Pac
        var btnAgregar = document.getElementById("btnAgregar");
        if (btnAgregar != null) btnAgregar.onclick = function () {
            //Pac Nuevo
            divPopupContainerForm3.style.display = 'block';
            let txtIdPac = document.getElementById("txtIdPac");
            let IdPac = "";
            if (txtIdPac != null) {
                IdPac = txtIdPac.value;
            }
            limpiarForm("Popuproceso");

            txtIdPac.value = IdPac;
            //Default 
            cboTipoCompra.value = "0";
            txtEntidadConv.value = "IAFAS"

            tbDetalleItemPac.innerHTML = "";
            tbBodyDetalleItemPac.innerHTML = "";

            var select2cboDepartamento = document.getElementById("select2-cboDepartamento-container");
            if (select2cboDepartamento != null) select2cboDepartamento.innerHTML = "Seleccione";

            var select2cboProvincia = document.getElementById("select2-cboProvincia-container");
            if (select2cboProvincia != null) select2cboProvincia.innerHTML = "Seleccione";

            var select2cboDistrito = document.getElementById("select2-cboDistrito-container");
            if (select2cboDistrito != null) select2cboDistrito.innerHTML = "Seleccione";
        }

        var btnMostrarItems = document.getElementById("btnMostrarItems");
        if (btnMostrarItems != null) btnMostrarItems.onclick = function () {
            var idTipoItems = cboTipoItem.value;
            var idObjetoContra = cboObjetoContratacion.value;
            var nFilas = tbDetalleItemPac.rows.length;

            if (idTipoItems == "") {
                mostrarMensaje("Seleccione tipo de Items", "error")
                cboTipoItem.focus();
            }
            else if (idObjetoContra == "") {
                mostrarMensaje("Seleccione tipo de Objeto de Contratación", "error")
                cboObjetoContratacion.focus();
            }
            else {
                if (idTipoItems == "1" && nFilas == "1") {
                    mostrarMensaje("No se Puede Agregar Mas Item", "warning")
                }
                else {
                    if (idObjetoContra == "1") {
                        idObjetoContra = "B";
                    }
                    else if (idObjetoContra == "2" || idObjetoContra =="4") {
                        idObjetoContra = "S";
                    }
                    else {
                        idObjetoContra = "O";
                    }
                   Http.get("General/listarTabla?tbl=" + controller + vista + "Inventario" + "&data=" + idObjetoContra, mostrarlistasInventario); 
                }
            }
        }

        var btnAgregarPacItems = document.getElementById("btnAgregarPacItems");
        if (btnAgregarPacItems != null) btnAgregarPacItems.onclick = function () {
            var ids = grillaItems.obtenerIdsChecks();
            var data = "";
            var idInv = "", IdUnidad = "";
            for (var i = 0; i < ids.length; i++) {
                fila = grillaItems.obtenerFilaCheckPorId(ids[i]);
                if (fila.length > 0) {
                    id = fila[0];
                    nombre = fila[1];
                    unidad = fila[2];
                   // codigo = fila[3];
                    idInv = id.split("¥")[0];
                    IdUnidad = id.split("¥")[1];
                    data += (idInv + "|" + IdUnidad + "|" + nombre + "|" + unidad);
                    if (i < ids.length - 1) data += "¬";
                }
            }
            obtenerItems(data);
          //  validarPCAItems();
        }

        var btnGuardarProceso = document.getElementById("btnGuardarProceso");
        if (btnGuardarProceso != null) btnGuardarProceso.onclick = function () {
            var validar = false;
            var nFilas = tbDetalleItemPac.rows.length;

            if (validarInformacion("RequeProc") == true && nFilas > 0) {
                validar = true;
            }
            else if (nFilas == 0) {
                mostrarMensaje("Agregar Item ", "error");
                return;
            }

            if (validar === true) {
                Swal.fire({
                    title: '¿Desea grabar la información?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No'
                }).then((result) => {
                    if (result.value) {

                        grabarDatosPacProcesos();

                        Swal.fire({
                            title: 'Procesando...',
                            allowEscapeKey: false,
                            allowOutsideClick: false,
                            onOpen: () => {
                                Swal.showLoading()
                            }
                        })
                    }
                })
            }
        }
    }

    var btnConsultar = document.getElementById("btnConsultar");
    if (btnConsultar != null) btnConsultar.onclick = function () {

        if (vista == "PAC" || vista == "Prosel"|| vista == "Contrato") {
            getListarLicitaPac();
        }
        else {
            getListar();
        }
    }
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
    

    var nFilas = tbDetalleItemPac.rows.length;
    var existe = false;
    for (var i = 0; i < nFilas; i++) {
        if (tbDetalleItemPac.rows[i].cells[0].innerHTML == item) {
            existe = true;
            break;
        }
    }

    if (!existe) {
        let datos = item + '|' + codigo + '|' + item + '' + codigo + '|' + nombre + '|' + unimed+'|'+'|'
        listasDetalPacProcesos(datos);
    }
    else mostrarMensaje("Existen Items ya agregados- verificar", "error");
    spnNroItems.innerHTML = "Items: " + (nFilas + 1);
   // configurarEnterCantidad(tbDetalleItemPac, 8);
}


function retirarItemPCA(col, id) {
    var filaRemove = col.parentNode.parentNode;
    tbDetalleItemPac.removeChild(filaRemove);

    var dataItem = "";
    var nFilas = 0;
    nFilas = tbDetalleItemPac.rows.length;
    spnNroItems.innerHTML = "Items: " + (nFilas);

    var fila;
    for (var i = 0; i < nFilas; i++) {
        fila = tbDetalleItemPac.rows[i];
        dataItem += fila.cells[0].innerHTML + '|' + fila.cells[1].innerHTML + '|';
        dataItem += fila.cells[2].innerHTML + '|' + fila.cells[3].innerHTML + '|' + fila.cells[4].innerHTML + '|';
        dataItem += (fila.cells[5].childNodes[0].value).replace(/,/g, '') + '|';
        dataItem += (fila.cells[6].childNodes[0].value).replace(/,/g, '');
        dataItem += "¬";
    }
    dataItem = dataItem.substr(0, dataItem.length - 1);
    tbDetalleItemPac.innerHTML = "";
    listasDetalPacProcesos(dataItem);
}

function listasDetalPacProcesos(listaDetalle) {
    if (listaDetalle) {
        var listaDet = listaDetalle.split('¬');
        var nRegistros = listaDet.length;
        var camposDetalle = [];
        var cantoTotal = 0;
        var filaDetalle = '';
        let cantidadProd = "", precioProd = "",subTotal="";
        for (var i = 0; i < nRegistros; i++) {
            camposDetalle = listaDet[i].split("|");
            cantoTotal = (camposDetalle[5] * 1) * (camposDetalle[6] * 1);
            cantidadProd = formatoNumeroDecimal(camposDetalle[5]);
            precioProd = formatoNumeroDecimal(camposDetalle[6]);
            subTotal = formatoNumeroDecimal(cantoTotal);

            if (cantidadProd == "-") {
                cantidadProd = "";
            }
            if (precioProd == "-") {
                precioProd = "";
            }
            if (subTotal == "-") {
                subTotal = "";
            }
            filaDetalle += "<tr data-pos='" + camposDetalle[0]+"'>";
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>";
            filaDetalle += camposDetalle[0];
            filaDetalle += "</td>";
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>";
            filaDetalle += camposDetalle[1];
            filaDetalle += "</td>";
            filaDetalle += "<td style='white-space:pre-wrap;width:100px;vertical-align:top;'>";
            filaDetalle += camposDetalle[2];
            filaDetalle += "</td>";
            filaDetalle += "<td style='width:500px;white-space:pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
            filaDetalle += camposDetalle[3];
            filaDetalle += "</td>";
            filaDetalle += "<td style='white-space:pre-wrap;width:80px;vertical-align:top;'>";
            filaDetalle += camposDetalle[4];
            filaDetalle += "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
            filaDetalle += "<input type='text' class='RequeProc' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 value='" + cantidadProd + "' onkeyup='importesPCA(this)' onkeypress='return NumCheck(event, this)'>";
            filaDetalle += "</td>";
            filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;padding:0px'>";
            filaDetalle += "<input type='text' class='RequeProc' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 value='" + precioProd + "' onkeyup='importesPCA(this)' onkeypress='return NumCheck(event, this)'>";
            filaDetalle += "</td>";
            filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;'>";
            filaDetalle += subTotal;
            filaDetalle += "</td>";
            filaDetalle += "<td style='white-space:pre-wrap;width:10px;vertical-align:top;'>";
            filaDetalle += "<i class='fa fa-trash f-16 text-c-red' title='Quitar Item' onclick='retirarItemPCA(this,\"";
            filaDetalle += camposDetalle[0];
            filaDetalle += "\");'></i>";
            filaDetalle += "</td> ";
            filaDetalle += "</tr>";
        }
        tbDetalleItemPac.insertAdjacentHTML("beforeend", filaDetalle);

        var nFilas = tbDetalleItemPac.rows.length;
        tbBodyDetalleItemPac.innerHTML = "";

        if ((nFilas * 1) > 1) {
            listarResumenDetallePac();
        }
        spnNroItems.innerHTML = "Items: " + (nFilas);
    }
}

function listarResumenDetallePac() {
    var nFilas = tbDetalleItemPac.rows.length;
    tbBodyDetalleItemPac.innerHTML = "";

    var totalCantidad = 0;
    var totalMonto = 0;
    var sumaTotal = 0;

    var fila, itemCant = 0, itemMonto = 0, itemTotal = 0;
    for (var i = 0; i < nFilas; i++) {
        fila = tbDetalleItemPac.rows[i];
        itemCant = (fila.cells[5].childNodes[0].value).replace(/,/g, '');
        itemMonto = (fila.cells[6].childNodes[0].value).replace(/,/g, '');
        itemTotal = (fila.cells[7].innerText).replace(/,/g, '');
        totalCantidad = totalCantidad + (itemCant * 1);
        totalMonto = totalMonto + (itemMonto * 1);
        sumaTotal += (itemTotal * 1);
    }

    var tbBodyResumen = "";
    tbBodyResumen += '<tr>';
    tbBodyResumen += '<td colspan="3" class="text-right">TOTAL</td>';
    tbBodyResumen += '<td>' + formatoNumeroDecimal(totalCantidad) + '</td>';
    tbBodyResumen += '<td>' + formatoNumeroDecimal(totalMonto) + '</td>';
    tbBodyResumen += '<td colspan="2">' + formatoNumeroDecimal(sumaTotal) + '</td>';
    tbBodyResumen += '</tr>';
    tbBodyDetalleItemPac.innerHTML = tbBodyResumen;
}

function importesPCA(col) {
    var fila = col.parentNode.parentNode;
    fila.childNodes[7].style.textAlign = "center";
    fila.childNodes[7].style.fontWeight = "bold";
    fila.childNodes[6].style.textAlign = "center";
    fila.childNodes[6].style.fontWeight = "bold";
    fila.childNodes[8].style.textAlign = "center";
    fila.childNodes[8].style.fontWeight = "bold";

    var elemento = fila.getElementsByTagName('input');
    var nroElemento = elemento.length;
    var subTot = 0;
    var valorElemento = 0;
    var valor = 0;
    let val1 = 0, val2 = 0;
    for (var i = 0; i < nroElemento; i++) {
        valorElemento = (elemento[i].value).replace(/,/g, '');
        if (valorElemento == "") {
            valor = 0;
        }
        else {
            valor = valorElemento * 1;
        }
        if (i == 1) {
            val1 = valor;
        }
        else {
            val2 = valor;
        }
        
    }
    subTot =( val1 * val2);
    fila.childNodes[8].innerText = subTot.toFixed(2).toString();
    listarResumenDetallePac();
}


function mostrarlistasInventario(rpta) {
    if (rpta) {
        var listas = rpta.split("¯");
        var lista = listas[0].split("¬");

        if (vista == "PAC") {
            grillaItems = new GrillaScroll(lista, "divListaInventario", 1000, 3, "divListaInventarios", controller, null, null, null, null, 25, false, true);
            var divPopupContainerForm2 = document.getElementById("divPopupContainerForm2");
            if (divPopupContainerForm2 != null) { divPopupContainerForm2.style.display = 'block'; };
        }
    }
}

function mostrarlistaTab(rpta) {
    if (rpta) {
        var listas = rpta.split('¯');
        var lista = listas[0].split('¬');

        if (idTabActivo == "tabGarantia") {
            grillaGarantia = new GrillaScroll(lista, "divListaGarantia", 100, 6, vista, controller, null, false, null, null, 25, true, null);
            formulario = listas[1].split("¬");
            crearFormulario("PopupGar", "RequeGar");
        }
        else if (idTabActivo == "tabAdelanto") {
            grillaAdelanto = new GrillaScroll(lista, "divListaAdelanto", 100, 6, vista, controller, null, false, null, null, 25, true, null);
            formulario = listas[1].split("¬");
            crearFormulario("PopupAdel", "RequeAdel");
        }
        else if (idTabActivo == "tabAdenda") {
            grillaAdenda = new GrillaScroll(lista, "divListaAdenda", 100, 6, vista, controller, null, false, null, null, 25, true, null);
            formulario = listas[1].split("¬");
            crearFormulario("PopupAdend", "RequeAdenda");
        }
        else {
            grillaCronograma = new GrillaScroll(lista, "divListaCronograma", 100, 6, vista, controller, null, false, null, null, 25, true, null);
            formulario = listas[1].split("¬");
            crearFormulario("PopupCrono", "RequeCrono");
        }

        var nListas = listas.length;
        if (nListas > 2) {
            for (var i = 2; i < nListas; i++) {
                ayudas.push(listas[i].split("¬"));
            }
            if (ayudas.length > 0) {
                for (var i = 0; i < ayudas.length; i++) {
                    crearCombo(ayudas[i], idCombos[i], "Seleccione");
                }
            }
        }
    }
}

function crearFormulario(clasePop, claseReque) {
    var contenido = "";
    var nRegistros = formulario.length;
    var prefijo;
    var campos = [];
    var cAyudas = 0;
    var esLectura;
    var esBuscar;
    var decimal;
    var nCol = formulario[0];
    var cantCol = 0;
    if (nRegistros > 0) {
        contenido += "<div class='row'>";
        contenido += "<div class='col-md-12 mx-auto'>";
        for (var i = 1; i < nRegistros; i++) {
            campos = formulario[i].split("|");
            prefijo = campos[1].substr(0, 3);
            esObligatorio = (campos[3].indexOf(claseReque) > -1);
            esBuscar = (campos[3].indexOf("Buscar") > -1);
            esLectura = (campos[3].indexOf("Lectura") > -1);
            var dataValue = campos[1];
            if (cantCol == '0') {
                contenido += "<div class='form-group row'>";
            }
            if (nCol == '2') { contenido += "<div class='col-lg-6'>" }
            else { contenido += "<div class='col-lg-12'>" };
            cantCol++;
            contenido += "<div class='col-sm-";
            contenido += campos[2];
            contenido += "'>";
            if ((prefijo != "chk") && (prefijo != "opt")) {
                contenido += "<label for='";
                contenido += campos[1];
                contenido += "' class='control-label'>";
                contenido += campos[0]
                contenido += "</label> ";
            }

            switch (prefijo) {
                case "txt":
                    contenido += "<input type='text'";
                    contenido += " id = '";
                    contenido += dataValue;
                    contenido += "' class='control-form " + clasePop;
                    if (esObligatorio) contenido += " " + claseReque;
                    contenido += "'";
                    if (esLectura) contenido += " readonly='readonly' style='background-color:#FBEC88'";
                    contenido += " autocomplete='off'";
                    contenido += "/>";
                    break;
                case "dtt":
                    contenido += "<input type='date'";
                    contenido += " id = '";
                    contenido += dataValue;
                    contenido += "' class='control-form " + clasePop;
                    if (esObligatorio) contenido += " " + claseReque;
                    contenido += "'";
                    if (esLectura) contenido += " readonly='readonly' style='background-color:#FBEC88'";
                    contenido += "/>";
                    break;
                case "tim":
                    contenido += "<input type='time'";
                    contenido += " id = '";
                    contenido += dataValue;
                    contenido += "' class='control-form " + clasePop;
                    if (esObligatorio) contenido += " " + claseReque;
                    contenido += "'";
                    if (esLectura) contenido += " readonly='readonly' style='background-color:#FBEC88'";
                    contenido += "/>";
                    break;
                case "mal":
                    contenido += "<input type='email' ";
                    contenido += " id = '";
                    contenido += dataValue;
                    contenido += "' class='control-form " + clasePop;
                    if (esObligatorio) contenido += " " + claseReque;
                    contenido += "'";
                    if (esLectura) contenido += " readonly='readonly' style='background-color:#FBEC88'";
                    contenido += "/>";
                    break;
                case "num":
                    contenido += "<input type='number' ";
                    contenido += " id = '";
                    contenido += dataValue;
                    contenido += "' class='control-form " + clasePop;
                    if (esObligatorio) contenido += " " + claseReque;
                    contenido += "'";
                    if (esLectura) contenido += " readonly='readonly' style='background-color:#FBEC88'";
                    contenido += " step='any' ";
                    if (decimal) contenido += " step='any' ";
                    contenido += "/>";
                    break;
                case "tta":
                    contenido += "<textarea type='time' ";
                    contenido += " id = '";
                    contenido += dataValue;
                    contenido += "' class='control-form " + clasePop;
                    if (esObligatorio) contenido += " " + claseReque;
                    contenido += "'";
                    if (esLectura) contenido += " readonly='readonly' style='background-color:#FBEC88'";
                    contenido += ">";
                    contenido += "</textarea>";
                    break;
                case "chk":
                    contenido += "<div class='custom-control custom-checkbox'>";
                    contenido += "<input type='checkbox' ";
                    contenido += " id='";
                    contenido += dataValue;
                    contenido += "' class='custom-control-input " + clasePop;
                    if (esObligatorio) contenido += " " + claseReque;
                    contenido += "'";
                    if (esLectura) contenido += " readonly='readonly'";
                    contenido += "/>";
                    contenido += "<label for='";
                    contenido += dataValue;
                    contenido += "' class='custom-control-label texto-negrita'>";
                    contenido += campos[0]
                    contenido += "</label> ";
                    contenido += "</div> ";
                    break;
                case "opt":
                    contenido += "<div class='custom-control custom-radio'>";
                    contenido += "<input type='radio' ";
                    contenido += " id = '";
                    contenido += dataValue;
                    contenido += "' class='custom-control-input " + clasePop;
                    if (esObligatorio) contenido += " " + claseReque;
                    contenido += "'";
                    if (esLectura) contenido += " readonly='readonly'";
                    contenido += "/>";
                    contenido += "<label for='";
                    contenido += dataValue;
                    contenido += "' class='custom-control-label texto-negrita'>";
                    contenido += campos[0]
                    contenido += "</label> ";
                    contenido += "</div> ";
                    break;
                case "cbo":
                    contenido += "<select ";
                    contenido += " id='";
                    contenido += dataValue;
                    if (esBuscar) { contenido += "' class='SelectSearch control-form " + clasePop } else { contenido += "' class='control-form " + clasePop };
                    if (esObligatorio) contenido += " " + claseReque;
                    contenido += "'";
                    if (esLectura) contenido += " disabled style='background-color:#FBEC88'";
                    contenido += "></select>";
                    idCombos.push(dataValue);
                    break;
            }
            if (cantCol <= nCol) {
                contenido += "</div>";
                contenido += "</div>";
                if (cantCol == nCol) {
                    cantCol = 0;
                }
            }
            if (cantCol == '0') {
                contenido += "</div>";
            }
        }
        contenido += "</div>";
        contenido += "</div>";
        document.getElementById("divFormulario").innerHTML = contenido;
    }
    if (vista == "PAC" || vista == "Contrato" || vista == "Prosel") {
        //Error lista Tab VFG   ==========================vfgError================================================================//
       // getListarLicitaPac();
    }
    else {
        getListar();
    }
}
 
function configurarCombos() {

    var cboDepartamento = document.getElementById("cboDepartamento")
    if (cboDepartamento != null) cboDepartamento.onchange = function () {
        listarProvincias();
    }

    var cboProvincia = document.getElementById("cboProvincia")
    if (cboProvincia != null) cboProvincia.onchange = function () {
        listarDistritos();
    }

    if (vista == "PAC") {

        var cboTipoCompra = document.getElementById("cboTipoCompra")
        if (cboTipoCompra != null) cboTipoCompra.onchange = function () {
            if (cboTipoCompra.value == "0") {
                txtEntidadConv.value = "IAFAS"
            }
            else {
                txtEntidadConv.value = ""
            }
        }

        var cboObjetoContratacion = document.getElementById("cboObjetoContratacion")
        if (cboObjetoContratacion != null) cboObjetoContratacion.onchange = function () {
            listarItemInventario();
        }

        var cboAntecedentes = document.getElementById("cboAntecedentes")
        if (cboAntecedentes != null) cboAntecedentes.onchange = function () {
            let cboAntece = cboAntecedentes.value;
            let comentarioAntecedente = document.getElementById("txtComentarioAntecedente");
            if (cboAntece == "1") {
                comentarioAntecedente.readOnly = false;
            }
            else {
                comentarioAntecedente.readOnly = true;
                comentarioAntecedente.value = "";
            }
        }

    }
}

function mostrarEliminarTab(rpta) {
    var mensajeResul = [];
    if (rpta) {
        listas = rpta.split("¯");
        lista = listas[0].split("¬");
        mensajeResul = listas[1].split("|");
        var tipo = mensajeResul[0];
        var mensaje = mensajeResul[1];
        if (idTabActivo == "tabGarantia") {
            grillaGarantia = new GrillaScroll(lista, "divListaGarantia", 100, 6, vista, controller, null, false, null, null, 30, false, null);
        }
        else if (idTabActivo == "tabCronograma") {
            grillaCronograma = new GrillaScroll(lista, "divListaCronograma", 100, 6, vista, controller, null, false, null, null, 30, false, null);
        }
        else if (idTabActivo == "tabAdelanto") {
            grillaAdelanto = new GrillaScroll(lista, "divListaAdelanto", 100, 6, vista, controller, null, false, null, null, 30, false, null);
        }
        else if (idTabActivo == "tabAdenda") {
            grillaAdenda = new GrillaScroll(lista, "divListaAdenda", 100, 6, vista, controller, null, false, null, null, 30, false, null);
        }

        if (tipo == 'A') {
            Swal.fire({
                title: 'Eliminado!',
                text: mensaje,
                icon: 'success',
                showConfirmButton: true,
                timer: 2000
            })
        }
        else {
            Swal.fire({
                title: 'Advertencia!',
                text: mensaje,
                icon: 'warning',
                showConfirmButton: true,
                timer: 2000
            })
        }
    }
    else {
        mostrarMensaje("No se proceso el registro - verifique por favor", "error");
    }
}


function mostrarEliminar(rpta) {
    var mensajeResul = [];
    if (rpta) {
        listas = rpta.split("¯");
        lista = listas[0].split("¬");
        mensajeResul = listas[1].split("|");
        var tipo = mensajeResul[0];
        var mensaje = mensajeResul[1];

        if (vista == "PAC") {
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, null, botonesProceso, 38, false, null);
        }
        else {
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, null, botones, 38, false, null);
        }
        
        var cbo = document.getElementById("cboPadre");
        if (cbo != null) {
            var listaPadre = listas[2].split("¬");
            crearCombo(listaPadre, "cboPadre", "Ninguno");
        }

        if (tipo == 'A') {
            Swal.fire({
                title: 'Eliminado!',
                text: mensaje,
                icon: 'success',
                showConfirmButton: true,
                timer: 2000
            })
        }
        else {
            Swal.fire({
                title: 'Advertencia!',
                text: mensaje,
                icon: 'warning',
                showConfirmButton: true,
                timer: 2000
            })
        }
    }
    else {
        mostrarMensaje("No se proceso el registro - verifique por favor", "error");
    }
}

function seleccionarFila(fila, id, prefijo) {
    idRegistro = id;
    window["id" + prefijo] = id;
    if (window["fila" + prefijo] != null) window["fila" + prefijo].className = "FilaDatos";
    fila.className = "FilaSeleccionada";
    window["fila" + prefijo] = fila;
    if (prefijo == "divListaPAC") {
        Http.get("General/obtenerTabla/?tbl=" + controller + vista + 'Proceso&id=' + id, listasDetalleItemPacProcesos);
        divListaDetalle.style.display = 'block';
    }
}

function listasDetalleComite(listaDetalle) {
    //Detalle
    if (listaDetalle) {
        var listaDet = listaDetalle.split('¬');
        var nRegistros = listaDet.length;
        var camposDetalle = [];

        var filaDetalle = '';
        for (var i = 0; i < nRegistros; i++) {
            camposDetalle = listaDet[i].split("|");

            filaDetalle += '<tr>';
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[1] + "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[2] + "</td> ";
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[0] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[3] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[4] + '</td>';
            filaDetalle += "<td style='white-space:pre-wrap;width:10px;vertical-align:top;'>";
            filaDetalle += "<i class='fa fa-trash f-16 text-c-red' title='Quitar Item' onclick='retirarItemComision(this,\"";
            filaDetalle += camposDetalle[0];
            filaDetalle += "\");'></i>";
            filaDetalle += "</td>";
            filaDetalle += '</tr>';
        }
        tbDetalleComite.insertAdjacentHTML("beforeend", filaDetalle);

    }
}


function retirarItemComision(col, id) {

    var filaRemove = col.parentNode.parentNode;
    tbDetalleComite.removeChild(filaRemove);

    var dataItem = "";
    var nFilas = tbDetalleComite.rows.length;
    var fila, item = 0;
    for (var i = 0; i < nFilas; i++) {
        item += 1;
        fila = tbDetalleComite.rows[i];
        dataItem += item + '|' + fila.cells[0].innerHTML + '|';
        dataItem += fila.cells[1].innerHTML + '|' + fila.cells[3].innerHTML + '|';
        dataItem += fila.cells[4].innerHTML;
        dataItem += "¬";
    }
    dataItem = dataItem.substr(0, dataItem.length - 1);

    tbDetalleComite.innerHTML = "";
    listasDetalleComite(dataItem);
}

function obtenerItemComision() {

    var nFilas = tbDetalleComite.rows.length;
    var fila;
    var dataItem = '';
    if (nFilas == 0) {
        mostrarMensaje("Asignar Personas a la Comisión", "error");
    }
    for (var i = 0; i < nFilas; i++) {
        fila = tbDetalleComite.rows[i];
        dataItem += fila.cells[0].innerHTML + '|' + fila.cells[1].innerHTML;
        dataItem += "¬";
    }
    dataItem = dataItem.substr(0, dataItem.length - 1);
    return dataItem;
}


function validarPCAItems() {
    if (validarInformacion("Requeitems")) {

        var catalogo = document.getElementById("cboCatalogoItem");
        var unidadMedida = document.getElementById("cboUnidadMedida");
        var codigoitemsCatalogo = catalogo.value;
        var nombreitemsCatalogo = catalogo.options[catalogo.selectedIndex].text;
        var codUnidadMedida = unidadMedida.value;
        var nomUnidadMedida = unidadMedida.options[unidadMedida.selectedIndex].text;
        var cantidad = txtCantidad.value;

        var valorEstimado = txtValorEstimado.value;

        var item = 0;
        var nFilas = tbDetalleItemPac.rows.length;
        item = nFilas + 1;
        var existe = false;
        for (var i = 0; i < nFilas; i++) {
            if (tbDetalleItemPac.rows[i].cells[0].innerHTML == codigoitemsCatalogo) {
                existe = true;
                break;
            }
        }
        if (existe) {
            mostrarMensaje("Item ya se encuentra agregado", "warning");
        }
        else {
            var dataItem = '';
            dataItem = item + '|' + codigoitemsCatalogo + '|' + codUnidadMedida + '|' + nombreitemsCatalogo + '|' +
                nomUnidadMedida + '|' + cantidad + '|' + valorEstimado;
            listasDetalPacProcesos(dataItem);

            var divPopupContainerForm2 = document.getElementById("divPopupContainerForm2");
            if (divPopupContainerForm2 != null) { divPopupContainerForm2.style.display = 'none'; };
        }
    }
}
function grabarDatosPacProcesos() {
    var nFilas = tbDetalleItemPac.rows.length;
    var data = ""
    var dataItem = "";
    var fila;
    for (var i = 0; i < nFilas; i++) {
        fila = tbDetalleItemPac.rows[i];
        dataItem += fila.cells[0].innerHTML; //codigo Item
        dataItem += "|";
        dataItem += fila.cells[1].innerHTML; //unidad medida
        dataItem += "|";
        dataItem += (fila.cells[5].childNodes[0].value).replace(/,/g, ''); //Cantidad
        dataItem += "|";
        dataItem += (fila.cells[6].childNodes[0].value).replace(/,/g, ''); //Precio
        dataItem += "¬";
    }
    dataItem = dataItem.substr(0, dataItem.length - 1);

    var frm = new FormData();
    data = obtenerDatosGrabar("Popuproceso");
    data += "¯" + dataItem;
    frm.append("data", data);
    Http.post("General/guardar/?tbl=" + controller + vista + 'Proceso', mostrarDetallesProceso, frm);
    divListaDetalle.style.display = 'none';
}


function listasDetalleContrato(rpta) {
    //Detalle
    if (rpta) {
        tbListDetalleItemPac.innerHTML = "";
        tbBodyListDetalleItemPac.innerHTML = "";
        //var lista = rpta.split('¯');
        var listaDet = rpta;
        var nRegistros = listaDet.length;
        var camposDetalle = [];

        var totalCantidad = 0;
        var totalMonto = 0;
        var sumaTotal = 0;

        var cantoTotal = 0;
        var filaDetalle = '';
        if (listaDet != "") { 
        for (var i = 0; i < nRegistros; i++) {
            camposDetalle = listaDet[i].split("|");
            cantoTotal = (camposDetalle[5] * 1) * (camposDetalle[6] * 1);
            filaDetalle += '<tr>';
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[0] + "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;'>" + camposDetalle[1] + "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;'>" + camposDetalle[2] + "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;'>" + camposDetalle[3] + "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;'>" + camposDetalle[4] + "</td> ";
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[6] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[5] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[7] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1" class="text-center">' + formatoNumeroDecimal(camposDetalle[8]) + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1" class="text-center">' + formatoNumeroDecimal(camposDetalle[9]) + '</td>';
            filaDetalle += '</tr>';

            totalCantidad = totalCantidad + (camposDetalle[5] * 1);
            totalMonto = totalMonto + (camposDetalle[6] * 1);
            sumaTotal = sumaTotal + (cantoTotal * 1);

        }
        }
        tbListDetalleItemPac.insertAdjacentHTML("beforeend", filaDetalle);
        var nFilas = tbListDetalleItemPac.rows.length;


        if ((nFilas * 1) > 1) {

            var tbBodyResumen = "";
            tbBodyResumen += '<tr>';
            tbBodyResumen += '<td colspan="3" class="text-right">TOTAL</td>';
            tbBodyResumen += '<td>' + formatoNumeroDecimal(totalCantidad) + '</td>';
            tbBodyResumen += '<td>' + formatoNumeroDecimal(totalMonto) + '</td>';
            tbBodyResumen += '<td colspan="1">' + formatoNumeroDecimal(sumaTotal) + '</td>';
            tbBodyResumen += '</tr>';
            tbBodyListDetalleItemPac.innerHTML = tbBodyResumen;
        }
    }
}

function listasDetalleItemPacProcesos(rpta) {
    if (rpta) {
        tbListDetalleItemPac.innerHTML = "";
        tbBodyListDetalleItemPac.innerHTML = "";
        var lista = rpta.split('¯')[1];
        var listaDet = lista.split('¬');
        var nRegistros = listaDet.length;
        var camposDetalle = [];

        var totalCantidad = 0;
        var totalMonto = 0;
        var sumaTotal = 0;

        var cantoTotal = 0;
        var filaDetalle = '';
        for (var i = 0; i < nRegistros; i++) {
            camposDetalle = listaDet[i].split("|");
            cantoTotal = (camposDetalle[5] * 1) * (camposDetalle[6] * 1);
            filaDetalle += '<tr>';
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[0] + "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[1] + "</td> ";
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[2] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[3] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[4] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1" class="text-center">' + formatoNumeroDecimal(camposDetalle[5]) + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1" class="text-center">' + formatoNumeroDecimal(camposDetalle[6]) + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1" class="text-center">' + formatoNumeroDecimal(cantoTotal) + '</td>';
            filaDetalle += '</tr>';

            totalCantidad = totalCantidad + (camposDetalle[5] * 1);
            totalMonto = totalMonto + (camposDetalle[6] * 1);
            sumaTotal = sumaTotal + (cantoTotal * 1);
        }

        tbListDetalleItemPac.insertAdjacentHTML("beforeend", filaDetalle);
        var nFilas = tbListDetalleItemPac.rows.length;


        if ((nFilas * 1) > 1) {

            var tbBodyResumen = "";
            tbBodyResumen += '<tr>';
            tbBodyResumen += '<td colspan="3" class="text-right">TOTAL</td>';
            tbBodyResumen += '<td>' + formatoNumeroDecimal(totalCantidad) + '</td>';
            tbBodyResumen += '<td>' + formatoNumeroDecimal(totalMonto) + '</td>';
            tbBodyResumen += '<td colspan="1">' + formatoNumeroDecimal(sumaTotal) + '</td>';
            tbBodyResumen += '</tr>';
            tbBodyListDetalleItemPac.innerHTML = tbBodyResumen;
        }
    }
}



function vizualizarComite() {
    var comite = document.getElementById("cboComite");
    if (comite.value == "") {
        comite.focus();
        mostrarMensaje("Seleccionar Comite", "warning");
    }
    else {
        var textoComite = comite.options[comite.selectedIndex].text;
        var listaDet = listaComiteItem.split('¬');
        var nRegistros = listaDet.length;
        var camposDetalle = [];
        tbDetalleVerComision.innerHTML = "";
        nombreComision.innerText = textoComite;
        var filaDetalle = '';
        for (var i = 0; i < nRegistros; i++) {
            camposDetalle = listaDet[i].split("|");

            if (camposDetalle[0] == comite.value) {
                var listComites = camposDetalle[2].split("*");
                var nRegist = listComites.length;
                var camposComi = [];
                for (var is = 0; is < nRegist; is++) {
                    camposComi = listComites[is].split("¥");

                    filaDetalle += '<tr>';
                    filaDetalle += '<td>' + camposComi[0] + '</td>';
                    filaDetalle += '<td>' + camposComi[1] + '</td>';
                    filaDetalle += '<td>' + camposComi[2] + '</td>';
                    filaDetalle += '<td>' + camposComi[3] + '</td>';
                    filaDetalle += '</tr>';
                }
                tbDetalleVerComision.insertAdjacentHTML("beforeend", filaDetalle);
            }
        }

        var divPopupContainerForm1 = document.getElementById("divPopupContainerForm1");
        if (divPopupContainerForm1 != null) { divPopupContainerForm1.style.display = 'block'; };
    }
}

function puntajeEconomica() {
    var tec = txtEvalTecnica.value;
    var econo = txtEvalEconomica.value;
    var result = 0;
    if (tec == "") {
        mostrarMensaje("Ingresar Coeficiente Eval. Técnica", "error");
        txtEvalTecnica.focus();
    }
    else if (econo != "") {
        result = (tec * 1) + (econo * 1);
        if (result > 100) {
            mostrarMensaje("Excede del 100 %.", "warning");
        }
        else if (result == 100) {
            mostrarMensaje("Objetivo de 100 %.", "success");
        }
    }
}
//**********************************************MENU EDICION  PROCESO TAB*******************************************//
// next Menu
function mostarResultadoItemProSel(rpta) {
    if (rpta) {

        let tabs = Array.prototype.slice.apply(document.querySelectorAll('.nav-tabs'));
        let panels = Array.prototype.slice.apply(document.querySelectorAll('.tab-pane'));
        tabs.map(tab => tab.classList.remove('active'));
        panels.map(panel => panel.classList.remove('active'));

        var dataMensage = rpta.split("¯")[0];
        var dataDatos = rpta.split("¯")[1];
        var mensage = dataMensage.split("|")[1];
        var tipo = dataMensage.split("|")[0];
        var id = dataMensage.split("|")[2];
        var tabid = dataMensage.split("|")[3];
        var dataBuenaPro = "";
        if (tipo == "A") {
            tipo = "success";
        }
        else {
            tipo = "error";
        }

        if (tabid == "tabCalendario") {
            txtIdCal.value = id;
            document.getElementById(tabid).classList.remove("active");
            document.getElementById("tabTecEconomica").classList.add("active");
            document.getElementById("pane_factorTecnEcon").classList.add("active");
        }
        else if (tabid == "tabTecEconomica") {
            document.getElementById(tabid).classList.remove("active");
            tabEvaluacionTecnicaListar(dataDatos);
            document.getElementById("tabParticipante").classList.add("active");
            document.getElementById("pane_participante").classList.add("active");
        }
        else if (tabid == "tabParticipante") {
            dataBuenaPro = rpta.split("¯")[2];

            tbDetalleProcesoRegistro.innerHTML = "";
            tbDetalleEvaTecnica.innerHTML = "";
            tbDetalleEvaEconomica.innerHTML = "";
            tbDetalleBuenaPro.innerHTML = "";

            tabRegistroListar(dataDatos);
            tabEvaTecnicaProveedorListar(dataDatos);
            tabEvaEconomicaProveedorListar(dataDatos);

            listarTabBuenaPro(dataBuenaPro);
            document.getElementById(tabid).classList.remove("active");
            document.getElementById("tabEvaluacionTec").classList.add("active");
            document.getElementById("pane_evaltecnica").classList.add("active");
        }
        else if (tabid == "tabEvaluacionTec") {
            document.getElementById(tabid).classList.remove("active");
            document.getElementById("tabEvaluacionEco").classList.add("active");
            document.getElementById("pane_evaleconomica").classList.add("active");
        }
        else if (tabid == "tabEvaluacionEco") {
            document.getElementById(tabid).classList.remove("active");
            document.getElementById("tabBuenaPro").classList.add("active");
            document.getElementById("pane_buenapro").classList.add("active");
        }
        else if (tabid == "tabBuenaPro") {
            document.getElementById("tabBuenaPro").classList.add("active");
            document.getElementById("pane_buenapro").classList.add("active");
            tbDetalleBuenaPro.innerHTML = "";
            listarTabBuenaPro(dataDatos);
            console.log('finaliza todo');
        }
        //FIN Tab Menu
        //Detalle Save EvaLuacion Tecnica
        else if (tabid == "tabEvaTecnicoDet") {
            dataBuenaPro = rpta.split("¯")[2];

            tbDetalleEvaEconomica.innerHTML = "";
            tbDetalleBuenaPro.innerHTML = "";
            document.getElementById("tabEvaluacionTec").classList.add("active");
            document.getElementById("pane_evaltecnica").classList.add("active");

            tabEvaEconomicaProveedorListar(dataDatos);
            listarTabBuenaPro(dataBuenaPro);
        }
        else if (tabid == "tabEvaEconomicoDet") {
            dataBuenaPro = rpta.split("¯")[2];
            document.getElementById("tabEvaluacionEco").classList.add("active");
            document.getElementById("pane_evaleconomica").classList.add("active");
            tbDetalleBuenaPro.innerHTML = "";
            listarTabBuenaPro(dataBuenaPro);
        }

        else if (tabid == "tabItemRegistro") {
            dataBuenaPro = rpta.split("¯")[2];
            tbDetalleProcesoRegistro.innerHTML = "";
            tbDetalleEvaTecnica.innerHTML = "";
            tbDetalleEvaEconomica.innerHTML = "";
            tbDetalleBuenaPro.innerHTML = "";

            document.getElementById("tabParticipante").classList.add("active");
            document.getElementById("pane_participante").classList.add("active");


            tabRegistroListar(dataDatos);
            tabEvaTecnicaProveedorListar(dataDatos);
            tabEvaEconomicaProveedorListar(dataDatos);
            listarTabBuenaPro(dataBuenaPro);
        }
        else {

        }
        mostrarMensaje(mensage, tipo);

    }
    else {
        mostrarMensaje("Datos no Guardados", "error");
    }
}


//============Calendario ============//
function listarCalendarioProsel(rpta, tipo) {

    if (rpta) {

        tbDetalleProcesoCalen.innerHTML = "";
        var listaDetHe = rpta.split('¥')[1];
        var listaDet = listaDetHe.split('¬');
        var nRegistros = listaDet.length;
        var camposDetalle = [];

        var filaDetalle = '';
        for (var i = 0; i < nRegistros; i++) {
            camposDetalle = listaDet[i].split("|");

            filaDetalle += '<tr>';
            filaDetalle += '<td class="text-center">' + camposDetalle[0] + '</td>';
            filaDetalle += '<td style="display:none">' + camposDetalle[1] + '</td>';
            filaDetalle += '<td>' + camposDetalle[2] + '</td>';

            if (tipo == "S") {
                filaDetalle += '<td><input type="date" id="txtFechaIniCalendario" class="control-form RequeCalendar" value="' + camposDetalle[3] + '"/></td>';
                filaDetalle += '<td><input type="date" id="txtFechaFinCalendario" class="control-form RequeCalendar" value="' + camposDetalle[4] + '"/></td>';
            }
            else {
                filaDetalle += '<td><input type="date" id="txtFechaIniCalendario" class="control-form RequeCalendar"/></td>';
                filaDetalle += '<td><input type="date" id="txtFechaFinCalendario" class="control-form RequeCalendar"/></td>';
            }
            filaDetalle += '</tr>';
        }
        tbDetalleProcesoCalen.insertAdjacentHTML("beforeend", filaDetalle);
    }
}

function guardarCalendario() {
    var existe = false;
    if (vista == "Prosel" && validarInformacion("RequeCalendar") == true) {
        existe = true;
    }
    if (existe == true) {
        var dataHeadCal = txtIdCal.value + '|' + txtNumeroDocCal.value + '|' + txtFechaEmisionCal.value + '|' +
            txtGlosaCal.value + '|' + txtIdRegistro.value;
        var dataItem = "";
        var nFilas = tbDetalleProcesoCalen.rows.length;
        var fila;
        for (var i = 0; i < nFilas; i++) {

            fila = tbDetalleProcesoCalen.rows[i];
            dataItem += fila.cells[0].innerHTML + '|' + fila.cells[1].innerHTML + '|';
            dataItem += fila.cells[3].childNodes[0].value + '|' + fila.cells[4].childNodes[0].value;
            dataItem += "¬";
        }
        dataItem = dataItem.substr(0, dataItem.length - 1);
        var frm = new FormData();
        dataHeadCal += "¯" + dataItem;
        frm.append("data", dataHeadCal);
        Http.post("General/guardar/?tbl=" + controller + vista + 'Calendario', mostarResultadoItemProSel, frm);
    }
}

//============Factores de Evaluacion Tecnica y Economica ======//

function tabEvaluacionTecnicaListar(rpta) {
    if (rpta) {
        var listaDet = rpta.split('¬');
        var nRegistros = listaDet.length;
        var camposDetalle = [];
        var filaDetalle = '', tipoCondicion;

        for (var i = 0; i < nRegistros; i++) {
            camposDetalle = listaDet[i].split("|");
            tipoCondicion = parseInt(camposDetalle[4]);

            filaDetalle += '<tr>';
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[0] + "</td> ";
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;display:none">' + camposDetalle[1] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;display:none">' + camposDetalle[2] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;display:none">' + camposDetalle[3] + '</td>';

            if (tipoCondicion == 99 || tipoCondicion == 98) {
                filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[1] + '</td>';
                filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1" class="text-center">' + camposDetalle[5] + '</td>';

                if (tipoCondicion == 98) {
                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1"><input type="number" step="any" id="tecnicaEva" style="text-align:right;width:100%;border:1px solid #f7200e;height:25px;padding:0px" value="' + camposDetalle[6] + '"/ disabled></td>';
                }
                else {
                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1"><input type="number" step="any" id="economicaEva" style="text-align:right;width:100%;border:1px solid #f7200e;height:25px;padding:0px" value="' + camposDetalle[6] + '"/ disabled></td>';
                }
                filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + '' + '</td>';
            }
            else {
                filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[1] + '</td>';
                filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[5] + '</td>';
                if (tipoCondicion == 1) {
                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1"><input type="number" id="tecEva" step="any" style="text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px" value="' + camposDetalle[6] + '" onkeyup="importeData(this)"/></td>';
                }
                else {
                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1"><input type="number" id="ecoEva" step="any" style="text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px" value="' + camposDetalle[6] + '" onkeyup="importeData(this)"/></td>';
                }

                filaDetalle += "<td style='white-space:pre-wrap;width:10px;'>";
                filaDetalle += "<i class='fa fa-trash f-16 text-c-red buenapro' title='Quitar Item' onclick='tabEvalTecnicaEconomicaItem(this,\"";
                filaDetalle += camposDetalle[1];
                filaDetalle += "\");'></i>";
                filaDetalle += "</td>";
            }
            filaDetalle += '</tr>';
        }

        tbDetalleEvaluacionTecnica.insertAdjacentHTML("beforeend", filaDetalle);
    }
}

function tabEvalTecnicaEconomicaItem(col) {
    var filaRemove = col.parentNode.parentNode;
    tbDetalleEvaluacionTecnica.removeChild(filaRemove);
}


function guardarTabEvaTecEconomico() {
    var nFilas = tbDetalleEvaluacionTecnica.rows.length;
    var idProcesos = txtIdRegistro.value;
    var dataItem = "";
    var existe = false;
    if (nFilas > 2) {
        existe = true;
    }
    else {
        mostrarMensaje("Agregar  Evaluación", "error");
    }
    if (existe == true) {
        var fila;
        var total = 0;
        for (var i = 0; i < nFilas; i++) {
            fila = tbDetalleEvaluacionTecnica.rows[i];
            dataItem += fila.cells[0].innerHTML + '|' + fila.cells[1].innerHTML + '|' + fila.cells[2].innerHTML + '|';
            dataItem += fila.cells[6].childNodes[0].value + '|' + fila.cells[3].innerHTML;
            dataItem += "¬";
            total = total + (fila.cells[6].childNodes[0].value * 1);
        }
        dataItem = dataItem.substr(0, dataItem.length - 1);

        if (total != 400) {
            mostrarMensaje("Regularizar Valores al 100 %", "error");
            return;
        }
        else {
            var frm = new FormData();
            var data = idProcesos + '¯' + dataItem;
            frm.append("data", data);
            Http.post("General/guardar/?tbl=" + controller + vista + 'EvalTecEcon', mostarResultadoItemProSel, frm);
            tbDetalleEvaluacionTecnica.innerHTML = "";
        }
    }
}


function importeData(id) {
    var tbDetalleItem = document.getElementById("tbDetalleEvaluacionTecnica");
    if (tbDetalleItem != null) {
        var nFilas = tbDetalleItem.rows.length
        var fila
        var totaltec = 0;
        var totaleco = 0;
        var subTotalTec, subTotalEco;
        for (var i = 0; i < nFilas; i++) {
            fila = tbDetalleItem.rows[i];
            if (fila.cells[6].childNodes[0].id == "tecEva") {
                subTotalTec = fila.cells[6].childNodes[0].value * 1;
                totaltec = totaltec + subTotalTec;
            }
            else if (fila.cells[6].childNodes[0].id == "ecoEva") {
                subTotalEco = fila.cells[6].childNodes[0].value * 1;
                totaleco = totaleco + subTotalEco;
            }
        }
        tecnicaEva.value = totaltec;
        economicaEva.value = totaleco;
    }
}

//==============Registro de Participante  ===============//

function tabRegistroListar(rpta) {
    if (rpta) {
        var listaDet = rpta.split('¬');
        var nRegistros = listaDet.length;
        var camposDetalle = [];

        var filaDetalle = '';
        for (var i = 0; i < nRegistros; i++) {
            camposDetalle = listaDet[i].split("|");
            filaDetalle += '<tr>';
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[0] + "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[1] + "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[2] + "</td> ";
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[3] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[4] + '</td>';

            filaDetalle += "<td style='white-space:pre-wrap;width:10px;'>";
            filaDetalle += "<i class='fa fa-trash f-16 text-c-red buenapro' title='Quitar Item' onclick='tabRegistroEliminarItem(this,3,\"";
            filaDetalle += camposDetalle[0];
            filaDetalle += "\");'></i>";
            filaDetalle += "</td>";

            filaDetalle += '</tr>';
        }
        tbDetalleProcesoRegistro.insertAdjacentHTML("beforeend", filaDetalle);
    }
}

function tabAgregarRegistro() {
    var nFilas = tbDetalleProcesoRegistro.rows.length;
    var proveedor = document.getElementById("cboProveedorProsel");
    var idProcesos = txtIdRegistro.value;
    var existe = false;
    if (proveedor.value == "") {
        mostrarMensaje("Seleccionar Proveedor", "error");
        proveedor.focus();
        return;
    }
    else {

        for (var i = 0; i < nFilas; i++) {
            if (tbDetalleProcesoRegistro.rows[i].cells[2].innerHTML == proveedor.value) {
                existe = true;
                mostrarMensaje("Proveedor ya se encuentra", "warning");
                break;
            }
        }

        if (existe == false) {
            nFilas = nFilas + 1;
            var textoProveedor = proveedor.options[proveedor.selectedIndex].text;
            var data = '0|' + idProcesos + '|' + proveedor.value + '|' + nFilas + '|' + textoProveedor;
            tabRegistroListar(data);
            var select2Proveedor = document.getElementById("select2-cboProveedorProsel-container");
            if (select2Proveedor != null)
                select2Proveedor.innerHTML = "Seleccione";
            cboProveedorProsel.value = "";
        }

    }
}

function guardarTabRegistro() {
    var nFilas = tbDetalleProcesoRegistro.rows.length;
    var idProcesos = txtIdRegistro.value;
    var dataItem = "";
    var existe = false;
    if (nFilas > 0) {
        existe = true;
    }
    else {
        mostrarMensaje("Agregar  Proveedor", "error");
    }
    if (existe == true) {
        var fila;
        for (var i = 0; i < nFilas; i++) {
            fila = tbDetalleProcesoRegistro.rows[i];
            dataItem += fila.cells[0].innerHTML + '|' + fila.cells[1].innerHTML + '|' + fila.cells[2].innerHTML;
            dataItem += "¬";
        }
        dataItem = dataItem.substr(0, dataItem.length - 1);
        var frm = new FormData();
        var data = idProcesos + '¯' + dataItem
        frm.append("data", data);
        Http.post("General/guardar/?tbl=" + controller + vista + 'Registro', mostarResultadoItemProSel, frm);
    }
}

function tabRegistroEliminarItem(col, tab, id) {
    if (parseInt(id) == 0) {
        var filaRemove = col.parentNode.parentNode;
        tbDetalleProcesoRegistro.removeChild(filaRemove);

        var dataItem = "";
        var nFilas = tbDetalleProcesoRegistro.rows.length;
        var fila, item = 0;
        for (var i = 0; i < nFilas; i++) {
            item += 1;
            fila = tbDetalleProcesoRegistro.rows[i];
            dataItem += fila.cells[0].innerHTML + '|' + fila.cells[1].innerHTML + '|' + fila.cells[2].innerHTML + '|';
            dataItem += item + '|' + fila.cells[4].innerHTML;
            dataItem += "¬";
        }
        dataItem = dataItem.substr(0, dataItem.length - 1);
        tbDetalleProcesoRegistro.innerHTML = "";
        tabRegistroListar(dataItem);
    }
    else {

        var data = "";
        data = txtIdRegistro.value + '|' + tab + '|' + id;
        var frm = new FormData();
        frm.append("data", data);

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
                Http.post("General/eliminar/?tbl=" + controller + vista + 'TabItem', mostarResultadoItemProSel, frm);
            }
        })
    }
}

//==============Evaluacion Tecnica  =================================//

function tabEvaTecnicaProveedorListar(rpta) {
    if (rpta) {
        var listaDet = rpta.split('¬');
        var nRegistros = listaDet.length;
        var camposDetalle = [];

        var filaDetalle = '';
        for (var i = 0; i < nRegistros; i++) {
            camposDetalle = listaDet[i].split("|");

            filaDetalle += "<tr class='FilaDatos' onclick='seleccionarFilaEvaluacion(this," + camposDetalle[0] + ",\"divListaEvaTecnica\",\"" + camposDetalle[4] + "\",1);'>";
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[0] + "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[1] + "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[2] + "</td> ";
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[3] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[4] + '</td>';
            filaDetalle += "<td style='white-space:pre-wrap;width:10px;vertical-align:top;'>";
            filaDetalle += "<i class='fa fa-pencil f-16 text-c-blue' aria-hidden='true' title='Asingar Evaluacion' ></i>";
            filaDetalle += "</td>";
            filaDetalle += '</tr>';
        }
        tbDetalleEvaTecnica.insertAdjacentHTML("beforeend", filaDetalle);
    }
}


function tabEvaTecgetProveedorListar(rpta) {
    if (rpta) {
        var listaRpta = rpta.split('¯')[0];
        var listaDet = listaRpta.split('¬');
        var nRegistros = listaDet.length;
        var camposDetalle = [];
        var IdEvaTecnica = 1;
        var filaDetalle = '', varTipoEvaluacion;

        for (var i = 0; i < nRegistros; i++) {
            camposDetalle = listaDet[i].split("|");
            varTipoEvaluacion = parseInt(camposDetalle[8]);

            if (varTipoEvaluacion == IdEvaTecnica) {
                if (parseInt(camposDetalle[7]) == parseInt(camposDetalle[8])) {
                    filaDetalle += '<tr>';
                    filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[0] + "</td> ";
                    filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[1] + "</td> ";
                    filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[2] + "</td> ";

                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[1] + '</td>';
                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[3] + '</td>';
                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[4] + '</td>';
                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1"><input type="number" id="evaltec" step="any" min="0" max="' + camposDetalle[4] + '" style="text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px" value="' + camposDetalle[5] + '" onkeyup="importeTecnico(this)"/></td>';
                    filaDetalle += '</tr>';
                }
                else {
                    filaDetalle += '<tr>';
                    filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[0] + "</td> ";
                    filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[1] + "</td> ";
                    filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[2] + "</td> ";

                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[1] + '</td>';
                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1" class="text-center">' + camposDetalle[3] + '</td>';
                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[4] + '</td>';
                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1"><input type="number" id="evaltecresult" step="any" min="0" max="' + camposDetalle[4] + '" style="text-align:right;width:100%;border:1px solid #dc354;height:25px;padding:0px" value="' + camposDetalle[5] + '"/ disabled></td>';
                    filaDetalle += '</tr>';
                }
            }
        }

        tbDetalleEvaTecnicaLista.insertAdjacentHTML("beforeend", filaDetalle);
    }
}

function importeTecnico(id) {
    var tbDetalleItem = document.getElementById("tbDetalleEvaTecnicaLista");
    if (tbDetalleItem != null) {
        var nFilas = tbDetalleItem.rows.length
        var fila
        var totaltec = 0, valorMax = 0;
        var subTotalTec;
        for (var i = 0; i < nFilas; i++) {
            fila = tbDetalleItem.rows[i];
            if (fila.cells[6].childNodes[0].id == "evaltec") {
                subTotalTec = fila.cells[6].childNodes[0].value * 1;
                valorMax = (fila.cells[5].innerText * 1)
                if (subTotalTec > valorMax) {
                    mostrarMensaje("Excede el Puntaje Max. " + fila.cells[4].innerText, "error");
                    return;
                }
                totaltec = totaltec + subTotalTec;
            }
        }
        evaltecresult.value = totaltec;
    }
}

function guardarTabEvaTecnicoProveedor() {
    var nFilas = tbDetalleEvaTecnicaLista.rows.length;
    var idProveedor = txtProveedorEvaTec.value;
    var dataItem = "";
    var existe = false;
    if (nFilas > 0) {
        existe = true;
    }
    else {
        mostrarMensaje("Agregar  Evaluación", "error");
    }
    if (existe == true) {
        var fila;

        for (var i = 0; i < nFilas; i++) {
            fila = tbDetalleEvaTecnicaLista.rows[i];
            dataItem += fila.cells[0].innerHTML + '|' + fila.cells[1].innerHTML + '|';
            dataItem += fila.cells[6].childNodes[0].value + '|0';
            dataItem += "¬";
        }
        dataItem = dataItem.substr(0, dataItem.length - 1);
        var frm = new FormData();
        var data = idProveedor + '¯' + dataItem + '¯' + 'tabEvaTecnicoDet' + '¯' + txtIdRegistro.value;
        frm.append("data", data);
        idTextoEvaTec.innerText = "Evaluación Técnica  ";
        tbDetalleEvaTecnicaLista.innerHTML = "";
        Http.post("General/guardar/?tbl=" + controller + vista + 'EvalTecnico', mostarResultadoItemProSel, frm);

    }
}
//==============Evaluacion Economica  =================================//

function tabEvaEconomicaProveedorListar(rpta) {
    if (rpta) {
        var listaDet = rpta.split('¬');
        var nRegistros = listaDet.length;
        var camposDetalle = [];

        var filaDetalle = '', aptoProceso = 0;
        var valorProceso = txtEvalMinTecnica.value;
        for (var i = 0; i < nRegistros; i++) {
            camposDetalle = listaDet[i].split("|");
            aptoProceso = (camposDetalle[5] * 1)

            if (aptoProceso >= (valorProceso * 1)) {
                filaDetalle += "<tr class='FilaDatos' onclick='seleccionarFilaEvaluacion(this," + camposDetalle[0] + ",\"divListaEvaEconomia\",\"" + camposDetalle[4] + "\",5);'>";
                filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[0] + "</td> ";
                filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[1] + "</td> ";
                filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[2] + "</td> ";
                filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[3] + '</td>';
                filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[4] + '</td>';

                filaDetalle += "<td style='white-space:pre-wrap;width:10px;vertical-align:top;'>";
                filaDetalle += "<i class='fa fa-pencil f-16 text-c-blue' aria-hidden='true' title='Asingar Evaluacion' ></i>";
                filaDetalle += "</td>";
                filaDetalle += '</tr>';
            }

        }
        tbDetalleEvaEconomica.insertAdjacentHTML("beforeend", filaDetalle);
    }
}

function seleccionarFilaEvaluacion(fila, id, prefijo, texto, tipoEvaluacion) {
    idRegistro = id;
    window["id" + prefijo] = id;
    if (window["fila" + prefijo] != null) window["fila" + prefijo].className = "FilaDatos";
    fila.className = "FilaSeleccionada";
    window["fila" + prefijo] = fila;
    var parametro = "";
    if (prefijo == "divListaEvaEconomia") {

        txtProveedorEvaTec.value = id;
        parametro = txtIdRegistro.value + '|' + id + '|' + tipoEvaluacion;
        idTextoEvaEco.innerText = texto;
        tbDetalleEvaEconoLista.innerHTML = "";
        Http.get("General/obtenerTabla/?tbl=" + controller + vista + 'EvalTecEcon' + '&id=' + parametro, tabEvaEconomicogetProveedorListar);
    }
    else if (prefijo == "divListaEvaTecnica") {
        txtProveedorEvaTec.value = id;
        parametro = txtIdRegistro.value + '|' + id + '|' + tipoEvaluacion;
        idTextoEvaTec.innerText = "Evaluación Técnica : " + texto;
        tbDetalleEvaTecnicaLista.innerHTML = "";
        Http.get("General/obtenerTabla/?tbl=" + controller + vista + 'EvalTecEcon' + '&id=' + parametro, tabEvaTecgetProveedorListar);
    }

}


function tabEvaEconomicogetProveedorListar(rpta) {
    if (rpta) {
        var listaRpta = rpta.split('¯')[0];
        var listaDet = listaRpta.split('¬');
        var nRegistros = listaDet.length;
        var camposDetalle = [];
        var IdEvaEconomica = 5;
        var filaDetalle = '', TipoEvaluacion = 0;

        for (var i = 0; i < nRegistros; i++) {
            camposDetalle = listaDet[i].split("|");

            if (parseInt(camposDetalle[8]) == IdEvaEconomica) {
                if (parseInt(camposDetalle[7]) == parseInt(camposDetalle[8])) {
                    filaDetalle += '<tr>';
                    filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[0] + "</td> ";
                    filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[1] + "</td> ";
                    filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[2] + "</td> ";

                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[1] + '</td>';
                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[3] + '</td>';

                    if (camposDetalle[3] == "PRECIO") {
                        filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1"><input type="number" step="any" min="0" style="text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px" value="' + camposDetalle[9] + '"/></td>';
                    }
                    else {
                        filaDetalle += '<td><input type="number" style="display:none;" value="' + camposDetalle[9] + '"/></td>';
                    }

                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[4] + '</td>';
                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1"><input type="number" id="evaecono" step="any" min="0" max="' + camposDetalle[4] + '" style="text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px" value="' + camposDetalle[5] + '"/ onkeyup="importeEvaEconomico(this)"></td>';
                    filaDetalle += '</tr>';
                }
                else {
                    filaDetalle += '<tr>';
                    filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[0] + "</td> ";
                    filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[1] + "</td> ";
                    filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[2] + "</td> ";
                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[1] + '</td>';
                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1" class="text-center">' + camposDetalle[3] + '</td>';

                    filaDetalle += '<td><input type="number" style="display:none;" value="' + camposDetalle[9] + '"/></td>';

                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[4] + '</td>';
                    filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1"><input type="number" id="evaeconoResult" step="any" min="0" max="' + camposDetalle[4] + '" style="text-align:right;width:100%;border:1px solid #dc354;height:25px;padding:0px" value="' + camposDetalle[5] + '"/ disabled></td>';
                    filaDetalle += '</tr>';
                }
            }
        }
        tbDetalleEvaEconoLista.insertAdjacentHTML("beforeend", filaDetalle);

    }
}

function importeEvaEconomico(id) {
    var tbDetalleItem = document.getElementById("tbDetalleEvaEconoLista");
    if (tbDetalleItem != null) {
        var nFilas = tbDetalleItem.rows.length
        var fila
        var totaltec = 0;
        var subTotalTec, valorMax = 0;
        for (var i = 0; i < nFilas; i++) {
            fila = tbDetalleItem.rows[i];
            if (fila.cells[7].childNodes[0].id == "evaecono") {
                subTotalTec = fila.cells[7].childNodes[0].value * 1;
                totaltec = totaltec + subTotalTec;
                valorMax = (fila.cells[6].innerText * 1)
                if (subTotalTec > valorMax) {
                    mostrarMensaje("Excede el Puntaje Max. " + fila.cells[4].innerText, "error");
                    return;
                }
            }
        }
        evaeconoResult.value = totaltec;
    }
}

function guardarTabEvaEconomicaProveedor() {
    var nFilas = tbDetalleEvaEconoLista.rows.length;
    var idProveedor = txtProveedorEvaTec.value;
    var dataItem = "";
    var existe = false;
    if (nFilas > 0) {
        existe = true;
    }
    else {
        mostrarMensaje("Agregar  Evaluación", "error");
    }
    if (existe == true) {
        var fila;
        for (var i = 0; i < nFilas; i++) {
            fila = tbDetalleEvaEconoLista.rows[i];
            dataItem += fila.cells[0].innerHTML + '|' + fila.cells[1].innerHTML + '|';
            dataItem += fila.cells[7].childNodes[0].value + '|' + fila.cells[5].childNodes[0].value;
            dataItem += "¬";
        }
        dataItem = dataItem.substr(0, dataItem.length - 1);
        var frm = new FormData();
        var data = idProveedor + '¯' + dataItem + '¯' + 'tabEvaEconomicoDet' + '¯' + txtIdRegistro.value;
        frm.append("data", data);

        Http.post("General/guardar/?tbl=" + controller + vista + 'EvalTecnico', mostarResultadoItemProSel, frm);
        idTextoEvaEco.innerText = "Evaluación Económica  ";
        tbDetalleEvaEconoLista.innerHTML = "";
    }
}

//===================Tab Buena Pro=======================================//
function listarTabBuenaPro(rpta) {
    if (rpta) {
        var listaDet = rpta.split('¬');
        var nRegistros = listaDet.length;
        var camposDetalle = [];

        var filaDetalle = '', actoBuentoPro = 0;
        var valorProceso = txtEvalMinTecnica.value;

        for (var i = 0; i < nRegistros; i++) {
            camposDetalle = listaDet[i].split("|");
            var estadoHtml = "";

            actoBuentoPro = (camposDetalle[8] * 1);
            if (actoBuentoPro >= (valorProceso * 1)) {
                estadoHtml = listarEstadoBuenaPro(listaEstadoBuenaProItem, camposDetalle[4]);
                filaDetalle += "<tr class='FilaDatos' onclick='seleccionarFilaItem(this," + camposDetalle[6] + ",\"divListaBuenaPro\");'>";
                filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[0] + "</td> ";
                filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[1] + "</td> ";
                filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[4] + "</td> ";
                filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[5] + "</td> ";
                filaDetalle += '<td>' + camposDetalle[6] + '</td>';
                filaDetalle += '<td>' + camposDetalle[7] + '</td>';
                filaDetalle += '<td>' + formatoNumeroDecimal(camposDetalle[8]) + '</td>';
                filaDetalle += '<td>' + formatoNumeroDecimal(camposDetalle[9]) + '</td>';
                filaDetalle += '<td><input type="number" class="control-form RequeBuenaPro" step="any" value="' + camposDetalle[2] + '"></td>';
                filaDetalle += '<td><input type="date" id="txtFechaAdju" class="control-form RequeBuenaPro" value="' + camposDetalle[3] + '"> </td>';
                filaDetalle += '<td>';
                filaDetalle += '<select class="control-form estadobuenapro RequeBuenaPro">' + estadoHtml + '</select>';
                filaDetalle += '</td>';
                filaDetalle += '<td>';
                filaDetalle += '<i class="fa fa-trash f-16 text-c-red buenapro" title="Quitar Item" onclick="tabBuenaProEliminarItem(this);"></i>';
                filaDetalle += '</td>';
                filaDetalle += '</tr>';
            }
        }
        tbDetalleBuenaPro.insertAdjacentHTML("beforeend", filaDetalle);
    }
}

function listarEstadoBuenaPro(lista, id) {
    var nRegistros = lista.length;
    var contenido = "<option value=''>Seleccione</option>";
    if (id == "") {
        contenido = "<option selected value=''>Seleccione</option>";
    }

    var campos, idCodigo, nombre;
    for (var i = 0; i < nRegistros; i++) {
        campos = lista[i].split('|');
        idCodigo = campos[0];
        nombre = campos[1];
        if (idCodigo == id) {
            contenido += "<option selected value='";
        }
        else {
            contenido += "<option value='";
        }
        contenido += idCodigo;
        contenido += "'>";
        contenido += nombre;
        contenido += "</option>";
    }
    return contenido;
}


function guardarTabBuenaPro() {
    var nFilas = tbDetalleBuenaPro.rows.length;
    var idProceso = txtIdRegistro.value;
    var dataItem = "";
    var existe = false;

    if (nFilas > 0) {

        if (validarInformacion("RequeBuenaPro") == true) {
            existe = true;
        }
    }
    else {
        mostrarMensaje("Falta Información", "error");
    }

    if (existe == true) {
        var fila;
        for (var i = 0; i < nFilas; i++) {
            fila = tbDetalleBuenaPro.rows[i];
            dataItem += fila.cells[0].innerHTML + '|' + fila.cells[1].innerHTML + '|' + fila.cells[8].childNodes[0].value + '|';
            dataItem += fila.cells[9].childNodes[0].value + '|' + fila.cells[10].childNodes[0].value + '|' + fila.cells[3].innerHTML;
            dataItem += "¬";
        }
        dataItem = dataItem.substr(0, dataItem.length - 1);

        var data = "";
        data += idProceso + "¯" + dataItem;
        var frm = new FormData();
        frm.append("data", data);
        Http.post("General/guardar/?tbl=" + controller + vista + 'BuenaPro', mostarResultadoItemProSel, frm);

    }
}

function tabBuenaProEliminarItem(col) {

    var filaRemove = col.parentNode.parentNode;
    tbDetalleBuenaPro.removeChild(filaRemove);
}

//-------------------------------------------------------------------//
function tabProselSiguienteItem(id) {
    var valor = "";
    valor = "A|Se registro  satisfactoriamente|5|" + id + "¯data"
    mostarResultadoItemProSel(valor);
}
function limpiarTablesTabProcesoSeleccion() {

    tbDetalleProcesoCalen.innerHTML = "";
    tbDetalleEvaluacionTecnica.innerHTML = "";
    tbDetalleProcesoRegistro.innerHTML = "";
    tbDetalleEvaTecnica.innerHTML = "";
    tbDetalleEvaTecnicaLista.innerHTML = "";
    tbDetalleEvaEconomica.innerHTML = "";
    tbDetalleEvaEconoLista.innerHTML = "";
    tbDetalleBuenaPro.innerHTML = "";
    tbDetalleItemProcesoCalen.innerHTML = "";
}


function tabSolicitudCompraDetalle(rpta) {
    if (rpta) {
        var listaDet = rpta.split('¬');
        var nRegistros = listaDet.length;
        var camposDetalle = [];
        var filaDetalle = '', tipoCondicion;

        for (var i = 0; i < nRegistros; i++) {
            camposDetalle = listaDet[i].split("|");

            filaDetalle += '<tr>';
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[0] + "</td> ";
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;display:none">' + camposDetalle[1] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;">' + camposDetalle[2] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;">' + camposDetalle[3] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;">' + camposDetalle[4] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;">' + formatoNumeroDecimal(camposDetalle[5]) + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;">' + formatoNumeroDecimal(camposDetalle[6]) + '</td>';
            filaDetalle += '</tr>';
        }
        tbDetalleItemProcesoCalen.insertAdjacentHTML("beforeend", filaDetalle);
    }
}

function seleccionarFilaItem(fila, id, prefijo) {
    idRegistro = id;
    window["id" + prefijo] = id;
    if (window["fila" + prefijo] != null) window["fila" + prefijo].className = "FilaDatos";
    fila.className = "FilaSeleccionada";
    window["fila" + prefijo] = fila;
}


//=========================================================================//

//(function (d) {
//    let tabs = Array.prototype.slice.apply(d.querySelectorAll('.nav-tabs'));
//    let panels = Array.prototype.slice.apply(d.querySelectorAll('.tab-pane'));
//    d.getElementById('mytab').addEventListener('click', e => {
//        alert(e);
//        if (e.target.classList.contains('nav-tabs')) {
//            let i = tabs.indexOf(e.target);
//            tabs.map(tab => tab.classList.remove('active'));
//            tabs[i].classList.add('active');

//            panels.map(panel => panel.classList.remove('active'));
//            panels[i].classList.add('active');

//            console.log(i);
//        }
//    })
//})(document);