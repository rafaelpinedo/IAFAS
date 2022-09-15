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
var listaOficina_VG = [];
var idTabActivo = "";
var tipoPlanCta = "";

const CTA_MAYOR = "Mayor";
const SUB_CTA = "SubCta";

window.onload = function () {
    getConfigMn();
    vista = window.sessionStorage.getItem("Vista");
    controller = window.sessionStorage.getItem("Controller");
    mostrarLoading("divLista");
    if (vista == "PlanContable") {
        tipoPlanCta = CTA_MAYOR;
        getListarPlanCta(tipoPlanCta)

        mostrarFormTabPlanCta("formTabMayor");
        ocultarFormTabPlanCta("formTabSubCta");
    }
    else {
        getListar();
    }
    configurarBotones();
    configurarCombos();

}

function getListarPlanCta(tabPlan) {
    var anioFiscal = txtAnioFiscal.value;
    Http.get("General/listarTabla?tbl=" + controller + vista + tabPlan + "&data=" + anioFiscal, mostrarlistas);
}

function getListar() {
    var data = "";
    Http.get("General/listarTabla?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
}

function mostrarlistas(rpta) {
    if (rpta) {
        var listas = rpta.split("¯");
        var lista = listas[0].split("¬");

        if (vista == "PlanContable") {
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);

            if (tipoPlanCta == CTA_MAYOR) {
                var listaEstado = listas[1].split("¬");

                crearCombo(listaEstado, "cboEstado", "Seleccione");
            }
            else if (tipoPlanCta == SUB_CTA) {
                var listaCtaMayor = listas[1].split("¬");
                var listaFuentFinanciera = listas[2].split("¬");
                var listaEstado = listas[3].split("¬");

                crearCombo(listaCtaMayor, "cboCuentaMayorSubCta", "Seleccione");
                crearCombo(listaFuentFinanciera, "cboFuenteFinanciamientoSubCta", "Ninguno");
                crearCombo(listaEstado, "cboEstadoSubCta", "Seleccione");
            }
        }

        else {
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
        }
    }
}


function listarOficinaItem() {
    var idEntidad = cboEntidad.value;
    var nRegistros = listaOficina_VG.length;
    var contenido = "<option value=''>Seleccione</option>";
    var campos, idCodigo, nombre, idxEntidadItem;
    for (var i = 0; i < nRegistros; i++) {
        campos = listaOficina_VG[i].split('|');
        idCodigo = campos[0];
        nombre = campos[1];
        idxEntidadItem = campos[2];
        if (idxEntidadItem == idEntidad) {
            contenido += "<option value='";
            contenido += idCodigo;
            contenido += "'>";
            contenido += nombre;
            contenido += "</option>";
        }
    }
    var cbo = document.getElementById("cboOficina");
    if (cbo != null) {
        cbo.innerHTML = contenido;
    }
}


function grabarDatosPlanCta(tabPlan) {
    var data = ""
    var frm = new FormData();

    var clasePopup = "Popup";
    if (tipoPlanCta == SUB_CTA) clasePopup = "PopupSubCta";

    data = obtenerDatosGrabar(clasePopup);

    var txtAnhoFiscal = document.getElementById("txtAnioFiscal").value;
    data += "|" + txtAnhoFiscal;

    frm.append("data", data);
    Http.post("General/guardar/?tbl=" + controller + vista + tabPlan, mostrarGrabar, frm);
}

function grabarDatos() {
    var data = ""
    var frm = new FormData();
    data = obtenerDatosGrabar("Popup");
    frm.append("data", data);
    Http.post("General/guardar/?tbl=" + controller + vista, mostrarGrabar, frm);
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
        grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);

        var cboPlanContable = document.getElementById("cboPlanContable");
        if (cboPlanContable != null) {
            var listaPadre = listas[2].split("¬");
            crearCombo(listaPadre, "cboPlanContable", "Primer Nivel");
        }


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
            eliminarRegistroPlanCta(idRegistro);
        }
    }
}

function editarRegistro(id) {
    if (vista == "PlanContable") {
        if (tipoPlanCta)
            Http.get("General/obtenerTabla/?tbl=" + controller + vista + tipoPlanCta + '&id=' + id, mostrarRegistro);
    }
    else {
        Http.get("General/obtenerTabla/?tbl=" + controller + vista + '&id=' + id, mostrarRegistro);
    }
}

function eliminarRegistroPlanCta(id) {
    var data = "";
    data = id;

    var txtAnhoFiscal = document.getElementById("txtAnioFiscal").value;
    data += "|" + txtAnhoFiscal;

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
            Http.post("General/eliminar/?tbl=" + controller + vista + tipoPlanCta, mostrarEliminar, frm);
        }
    })
}

function eliminarRegistro(id) {
    var data = "";
    data = id;

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
            Http.post("General/eliminar/?tbl=" + controller + vista, mostrarEliminar, frm);
        }
    })
}

function mostrarRegistro(rpta) {
    if (rpta) {
        var campos = rpta.split("|");
        var controlesSelectSearch = document.getElementsByClassName("SelectSearch");
        var nControlesSelectSearch = controlesSelectSearch.length;
        var cboEstado = document.getElementById("cboEstado");
        if (cboEstado != null) { cboEstado.disabled = false };

        var cboEstadoSubCta = document.getElementById("cboEstadoSubCta");
        if (cboEstadoSubCta != null) { cboEstadoSubCta.disabled = false };

        var divPopupContainer = document.getElementById("divPopupContainer");
        if (divPopupContainer != null) { divPopupContainer.style.display = 'block'; };

        var claseControles = "Popup";
        if (vista == "PlanContable")
            if (tipoPlanCta == SUB_CTA) claseControles = "PopupSubCta";

        var controles = document.getElementsByClassName(claseControles);
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
    var tabMayor = document.getElementById("tabMayor");
    if (tabMayor != null) tabMayor.onclick = function () {
        idTabActivo = "tabMayor";
        tipoPlanCta = CTA_MAYOR;
        getListarPlanCta(tipoPlanCta);

        mostrarFormTabPlanCta("formTabMayor");
        ocultarFormTabPlanCta("formTabSubCta");
    }

    var tabSubCta = document.getElementById("tabSubCta");
    if (tabSubCta != null) tabSubCta.onclick = function () {
        idTabActivo = "tabSubCta";
        tipoPlanCta = SUB_CTA;
        getListarPlanCta(tipoPlanCta);

        mostrarFormTabPlanCta("formTabSubCta");
        ocultarFormTabPlanCta("formTabMayor");
    }

    var btnNuevo = document.getElementById("btnNuevo");
    if (btnNuevo != null) btnNuevo.onclick = function () {
        divPopupContainer.style.display = 'block';
        limpiarForm("Popup");
        limpiarForm("PopupSubCta");

        var txtAnio = document.getElementById("txtAnio");
        if (txtAnio != null) {
            var anio = txtAnio.getAttribute('value');
            txtAnio.value = anio;
        }

        let tituloModal = document.getElementById("tituloModal");
        if (tituloModal != null) {
            tituloModal.innerText = "Nuevo Registro";
        }

        var cboEstado = document.getElementById("cboEstado");
        if (cboEstado != null) {
            cboEstado.value = 1;
            cboEstado.disabled = true;
        }

        var cboEstadoSubCta = document.getElementById("cboEstadoSubCta");
        console.log(cboEstadoSubCta);
        if (cboEstadoSubCta != null) {
            cboEstadoSubCta.value = 1;
            cboEstadoSubCta.disabled = true;
        }

        //var select2cboOficina = document.getElementById("select2-cboOficina-container");
        //if (select2cboOficina != null) select2cboOficina.innerHTML = "Seleccione";

        //var txtFechaPedido = document.getElementById("txtFechaPedido");
        //if (txtFechaPedido != null) txtFechaPedido.value = txtFechaPedido.getAttribute("data-fecha");
    }


    var btnGuardar = document.getElementById("btnGuardar");
    if (btnGuardar != null) btnGuardar.onclick = function () {
        var validar = false;

        var claseReque = "Reque";

        if (vista == "PlanContable")
            if (tipoPlanCta == SUB_CTA) claseReque = "RequeSubCta";


        if (validarInformacion(claseReque) == true) {
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

                    if (vista == "PlanContable") {
                        grabarDatosPlanCta(tipoPlanCta);
                    }
                    else {
                        grabarDatos();
                    }

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

    var btnConsultar = document.getElementById("btnConsultar");
    if (btnConsultar != null) btnConsultar.onclick = function () {

        if (vista == "PlanContable") {
            getListarPlanCta(tipoPlanCta);
        }
        else {
            getListar();
        }
    }
}

function configurarCombos() {


}

function mostrarEliminar(rpta) {
    var mensajeResul = [];
    if (rpta) {
        listas = rpta.split("¯")
        lista = listas[0].split("¬");
        mensajeResul = listas[1].split("|");
        var tipo = mensajeResul[0];
        var mensaje = mensajeResul[1];
        grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, null, botones, 38, false, null);

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
}

function mostrarFormTabPlanCta(idTab) {
    var divPopupFormTab = document.getElementById(idTab);
    if (divPopupFormTab != null) { divPopupFormTab.style.display = 'block'; };
}

function ocultarFormTabPlanCta(idTab) {
    var divPopupFormTab = document.getElementById(idTab);
    if (divPopupFormTab != null) { divPopupFormTab.style.display = 'none'; };
}