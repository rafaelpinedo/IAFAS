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
var listaRespoItem_VG = [];

window.onload = function () {
    getConfigMn();
    vista = window.sessionStorage.getItem("Vista");
    controller = window.sessionStorage.getItem("Controller");
    if (vista == "Almacen") {
        getListar();
    }
    else {
        getInventario()
    }
    
    configurarBotones();
    configurarCombos();
}

function getListar() {
    var data = "";
    Http.get("General/listarTabla?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
}

function getInventario() {
    var data = "";
    var fechaInicio = document.getElementById("txtFechaInicio").value;
    var fechaFinal = document.getElementById("txtFechaFinal").value;
    data = fechaInicio + '|' + fechaFinal;
    Http.get("General/listarTabla/?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
}

function mostrarlistas(rpta) {
    if (rpta) {
        var listas = rpta.split("¯");
        var lista = listas[0].split("¬");
        if (vista == "Almacen") {
            listaRespoItem_VG = listas[1].split("¬");
            var listaEstado = listas[2].split("¬");
            var botones = [
                { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
                { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
            ];
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            listarResponsableItem();
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "InventarioInicial") {
            var listaItem = listas[1].split("¬");
            var botones = [
                { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
                { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
            ];
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaItem, "cboArticulo", "Seleccione");
        }
        else {
            var botones = [
                { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
                { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
            ];
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
        }
    }
}

function listarResponsableItem() {
    var nRegistros = listaRespoItem_VG.length;
    var contenido = "<option value=''>Seleccione</option>";
    var campos, idCodigo, nombre;
    for (var i = 0; i < nRegistros; i++) {
        campos = listaRespoItem_VG[i].split('|');
        idCodigo = campos[0];
        nombre = campos[1];
        contenido += "<option value='";
        contenido += idCodigo;
        contenido += "'>";
        contenido += nombre;
        contenido += "</option>";
    }
    var cbo = document.getElementById("cboResponsable");
    if (cbo != null) {
        cbo.innerHTML = contenido;
    }
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
        var cboEmpresa = document.getElementById("cboEmpresa");
        if (cboEmpresa != null) { cboEmpresa.disabled = false };
        var select2cboPadre = document.getElementById("select2-cboPadre-container");
        if (select2cboPadre != null) select2cboPadre.innerHTML = "Seleccione";


        if (vista == "Clase") {
            cboTipoBien.value = campos[0];
            listarGrupoItem();
            cboGrupo.value = campos[1];
            document.getElementById('select2-cboGrupo-container').innerHTML = cboGrupo.options[cboGrupo.selectedIndex].text;
            txtIdRegistro.value = campos[2];
            txtNombre.value = campos[3];
            cboEstado.value = campos[4];
        }


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

function configurarBotones() {
    var btnNuevo = document.getElementById("btnNuevo");
    if (btnNuevo != null) btnNuevo.onclick = function () {
        divPopupContainer.style.display = 'block';
        limpiarForm("Popup");

        let tituloModal = document.getElementById("tituloModal");
        if (tituloModal != null) {
            tituloModal.innerText = "Nuevo Registro";
        }

        var cboEstado = document.getElementById("cboEstado");
        if (cboEstado != null) {
            cboEstado.value = 1;
            cboEstado.disabled = true;
        }
        var select2cboResponsable = document.getElementById("select2-cboResponsable-container");
        if (select2cboResponsable != null) select2cboResponsable.innerHTML = "Seleccione";

        var dtgFinal = document.getElementById("dtgEsFinal");
        if (dtgFinal != null) {
            $('#dtgEsFinal').bootstrapToggle('off')
        }

        //var txtFechaPedido = document.getElementById("txtFechaPedido");
        //if (txtFechaPedido != null) txtFechaPedido.value = txtFechaPedido.getAttribute("data-fecha");
    }


    var btnGuardar = document.getElementById("btnGuardar");
    if (btnGuardar != null) btnGuardar.onclick = function () {
        var validar = false;

        if (vista == "PedidoCompra" && validarPedido() == true) {
            validar = true;
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
                    //else
                    //{
                    //    grabarDatos();
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
}

function configurarCombos() {
    var cboTipoBien = document.getElementById("cboTipoBien");
    if (cboTipoBien != null) cboTipoBien.onchange = function () {
        listarGrupoItem();
    }

    var cboGrupo = document.getElementById("cboGrupo");
    if (cboGrupo != null) cboGrupo.onchange = function () {
        listarClaseItem();
    }

    var cboClase = document.getElementById("cboClase");
    if (cboClase != null) cboClase.onchange = function () {
        listarFamiliaItem();
    }

}

function mostrarEliminar(rpta) {
    var mensajeResul = [];
    if (rpta) {
        listas = rpta.split("¯")
        lista = listas[0].split("¬");
        mensajeResul = listas[1].split("|");
        var tipo = mensajeResul[0];
        var mensaje = mensajeResul[1];

        var botones = [
            { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
            { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
        ];
        grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, null, botones, 38, false, null);

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
}

function ComboAnoFecha() {
    var d = new Date();
    var n = d.getFullYear();
    var select = document.getElementById("ano");
    for (var i = n; i >= 2015; i--) {
        select.options[i] = new Option(i);
    }
}