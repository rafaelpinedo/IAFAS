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
var idTabActivo = "Ingreso";


window.onload = function () {
    getConfigMn();
    vista = window.sessionStorage.getItem("Vista");
    controller = window.sessionStorage.getItem("Controller");
    mostrarLoading("divLista");
    if (vista == "InventarioInicial") {
        getListarInventario();
    }
    else if (vista == "Pendiente" || vista == "GenerarNP") {
        getListarInformacion();
    }
    else {
        getListar();
    }
    configurarBotones();
    configurarCombos();
}
function getListarInformacion() {
    var tipo = "";
    var data = "";

    if (vista == "GenerarNP") {
        if (idTabActivo == "Ingreso") { tipo = "NEA"; } else { tipo = "PECOSA"; }
    }
    else {
        if (idTabActivo == "Ingreso") { tipo = "Ingreso"; } else { tipo = "Salida"; }
    }

    var fechaInicio = document.getElementById("txtFechaInicio").value;
    var fechaFinal = document.getElementById("txtFechaFinal").value;
    data = fechaInicio + '|' + fechaFinal;
    Http.get("General/listarTabla/?tbl=" + controller + vista + tipo + "&data=" + data, mostrarlistas);
}

function getListar() {
    var data = "";
    Http.get("General/listarTabla?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
}
function getListarInventario() {
    var data = "";
    var txtFechaInicio = document.getElementById("txtFechaInicio").value;
    var txtFechaFinal = document.getElementById("txtFechaFinal").value;
    data = txtFechaInicio + '|' + txtFechaFinal;
    Http.get("General/listarTabla/?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
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

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            listarResponsableItem();
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "InventarioInicial") {
            var listaAlmacen = listas[1].split("¬");
            var listaInvetario = listas[2].split("¬");
            var botoness = [
                { "cabecera": "Editar", "clase": "fa fa-pencil btn btn-info btnCirculo", "id": "Editar" },
                /*{ "cabecera": "Anular", "clase": "fa fa-minus-circle btn btn-danger btnCirculo", "id": "Eliminar" },*/
            ];

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botoness, 38, false, null);

            crearCombo(listaAlmacen, "cboAlmacen", "Seleccione");
            listarSelect2Item(listaInvetario, "cboInventario");
        }
        else if (vista == "Pendiente") {
          
            divLista.innerHTML = "";
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            var listaProveedor = listas[1].split("¬");
            var listaTipoOperacion = listas[2].split("¬");
            var listaAlmacen = listas[3].split("¬");
            var listaEstado = listas[4].split("¬");
            var listaArea = listas[5].split("¬");
            crearCombo(listaProveedor, "cboProveedor", "Seleccionar");
            crearCombo(listaTipoOperacion, "cboTipoOperacion", "Seleccionar");
            crearCombo(listaAlmacen, "cboAlmacen", "Seleccionar");
            crearCombo(listaEstado, "cboEstado", "Seleccionar");

            crearCombo(listaProveedor, "cboProveedorNuevo", "Seleccionar");
            crearCombo(listaTipoOperacion, "cboTipoOperacionNuevo", "Seleccionar");
            crearCombo(listaAlmacen, "cboAlmacenNuevo", "Seleccionar");
            crearCombo(listaEstado, "cboEstadoNuevo", "Seleccionar");

            crearCombo(listaArea, "cboArea", "Seleccionar");
            crearCombo(listaTipoOperacion, "cboTipoOperacionPCS", "Seleccionar");
            crearCombo(listaEstado, "cboEstadoPCS", "Seleccionar");
            crearCombo(listaProveedor, "cboProveedorPCS", "Seleccionar");
            crearCombo(listaAlmacen, "cboAlmacenPCS", "Seleccionar");

            crearCombo(listaArea, "cboAreaNuevo", "Seleccionar");
            crearCombo(listaTipoOperacion, "cboTipoOperacionSalidaNuevo", "Seleccionar");
            crearCombo(listaEstado, "cboEstadoSalidaNuevo", "Seleccionar");
            crearCombo(listaProveedor, "cboProveedorSalidaNuevo", "Seleccionar");
            crearCombo(listaAlmacen, "cboAlmacenSalidaNuevo", "Seleccionar");
        }
        else {
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

function grabarDatos() {
    var data = ""
    var frm = new FormData();
    data = obtenerDatosGrabar("Popup");

    if (vista == "InventarioInicial") {
        var txtFechaInicio = document.getElementById("txtFechaInicio").value;
        var txtFechaFinal = document.getElementById("txtFechaFinal").value;
        data += '|' + txtFechaInicio + '|' + txtFechaFinal;
    }

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
                        /*data += dFecha[2] + "-" + dFecha[1] + "-" + dFecha[0];*/
                        //Mod. VFG
                        if (vista == "InventarioInicial") {
                            data += dFecha[1] + "-" + dFecha[2] + "-" + dFecha[0];
                        }
                        else {
                            data += dFecha[2] + "-" + dFecha[1] + "-" + dFecha[0];
                        }

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

        var divPopupContainer = document.getElementById("divPopupContainer");
        if (divPopupContainer!=null) divPopupContainer.style.display = 'none';

        var divPopupContainerForm1 = document.getElementById("divPopupContainerForm1");
        if (divPopupContainerForm1 != null)divPopupContainerForm1.style.display = 'none';

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

    btnGenerar.innerHTML = "<i class='fa fa-save'></i> Grabar";
    btnGenerar.disabled = false;
}

function seleccionarBoton(idGrilla, idRegistro, idBoton) {
    if (idGrilla == "divLista") {
        if (idBoton == "Editar") {
            let tituloModal = document.getElementById("tituloModal");
            if (tituloModal != null) {
                tituloModal.innerText = "Editar Registro";
            }
            editarRegistro(idRegistro);
        }
        if (idBoton == "Eliminar") {
            eliminarRegistro(idRegistro)
        }
    }
}

function editarRegistro(id) {
    var tipo = "";
    if (vista == "Pendiente" || vista == "GenerarNP") {
        if (optIngreso.checked) { tipo = "Ingreso"; } else { tipo = "Salida"; }
        Http.get("General/obtenerTabla/?tbl=" + controller + vista + tipo + '&id=' + id, mostrarRegistro);
    }
    else { 
    Http.get("General/obtenerTabla/?tbl=" + controller + vista + '&id=' + id, mostrarRegistro);
    }
}

function eliminarRegistro(id) {
    var data = "";
    data = id;

    if (vista == "InventarioInicial") {
        var txtFechaInicio = document.getElementById("txtFechaInicio").value;
        var txtFechaFinal = document.getElementById("txtFechaFinal").value;
        data += '|' + txtFechaInicio + '|' + txtFechaFinal;
    }
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


        //if (vista == "Clase") {
        //    cboTipoBien.value = campos[0];
        //    listarGrupoItem();
        //    cboGrupo.value = campos[1];
        //    document.getElementById('select2-cboGrupo-container').innerHTML = cboGrupo.options[cboGrupo.selectedIndex].text;
        //    txtIdRegistro.value = campos[2];
        //    txtNombre.value = campos[3];
        //    cboEstado.value = campos[4];
        //}
        if (vista == "Pendiente") {
            var listas = rpta.split('¯');
            var cabecera = listas[0].split('|');
            var detalle = listas[1];
            if (optIngreso.checked) {
                document.getElementById("divPopupContainer").style.display = 'block';
                var listaDocumento = listas[2].split('¬');
                crearCombo(listaDocumento, "cboTipoDocumento", "Seleccionar")
                txtIdRegistro.value = cabecera[0];
                cboAlmacen.value = cabecera[1];
                cboProveedor.value = cabecera[2];
                document.getElementById('select2-cboProveedor-container').innerHTML = cboProveedor.options[cboProveedor.selectedIndex].text;
                cboTipoOperacion.value = cabecera[3];
                cboEstado.value = cabecera[4];
                ttaJustificacion.value = cabecera[5];
                cboTipoDocumento.value = 5;
                var dFecha = cabecera[6].split("/");
                ddtFecha.value = dFecha[2] + "-" + dFecha[1] + "-" + dFecha[0];
                lblOrdenCompra.innerHTML = cabecera[7];
                lblNroPendienteIngreso.innerHTML = cabecera[8];
                var idOrden = cabecera[9];
                txtNroGuia.value = "";
                ddtFechaGuia.value = "";
                btnMostrar.innerHTML = "Generar N.E.A.";
                idOrdenCompra = cabecera[9];
                cboAlmacen.disabled = false;
                cboProveedor.disabled = false;
                cboTipoOperacion.disabled = false;
                cboEstado.disabled = false;
                ddtFecha.disabled = false;
                if (cabecera[4] != '1') {
                    btnGuardar.style.display = 'none';
                    btnAgregarItem.style.display = 'none';
                    btnMostrar.style.display = 'none';
                }
                else {
                    btnGuardar.style.display = 'inline';
                    btnAgregarItem.style.display = 'inline';
                }

                if ((cabecera[4] == '1' || cabecera[4] == '2')) {
                    btnMostrar.style.display = 'inline';
                }

                generarDetallePendiente(detalle, 1, idOrden);
            }
            else {
                divPopupContainerFormatoPCS.style.display = 'block';
                txtIdRegistroPCS.value = cabecera[0];
                cboAlmacenPCS.value = cabecera[1];
                cboProveedorPCS.value = cabecera[2];
                document.getElementById('select2-cboProveedorPCS-container').innerHTML = cboProveedorPCS.options[cboProveedorPCS.selectedIndex].text;
                cboArea.value = cabecera[9];
                document.getElementById('select2-cboArea-container').innerHTML = cboArea.options[cboArea.selectedIndex].text;
                cboTipoOperacionPCS.value = cabecera[3];
                cboEstadoPCS.value = cabecera[4];
                ttaJustificacionPCS.value = cabecera[5];
                cboArea.onchange();
                cboJefeArea.value = cabecera[11];
                var dFecha = cabecera[6].split("/");
                ddtFechaPCS.value = dFecha[2] + "-" + dFecha[1] + "-" + dFecha[0];
                lblNroPendienteSalida.innerHTML = cabecera[8];
                btnMostrarPCS.innerHTML = "Generar PECOSA";
                cboAlmacenPCS.disabled = true;
                cboProveedorPCS.disabled = true;
                cboEstadoPCS.disabled = true;
                ddtFechaPCS.disabled = true;

                if (cabecera[4] != '1') {
                    btnGuardarPCS.style.display = 'none';
                    btnAgregarItemPCS.style.display = 'none';
                    btnMostrarPCS.style.display = 'none';
                    cboTipoOperacionPCS.disabled = true;
                    cboArea.disabled = true;
                }
                else {
                    btnGuardarPCS.style.display = 'inline';
                    btnAgregarItemPCS.style.display = 'inline';
                    cboTipoOperacionPCS.disabled = false;
                    cboArea.disabled = false;
                }

                if ((cabecera[4] == '1' || cabecera[4] == '2')) {
                    btnMostrarPCS.style.display = 'inline';
                }
                generarDetalleSalida(detalle, 0);

            }
        }
        else if (vista == "GenerarNP") {
            var listas = rpta.split('¯');
            var cabecera = listas[0].split('|');
            var detalle = listas[1].split('¬');
            if (optIngreso.checked) {
                divPopupContainerFormato.style.display = 'block';
                txtIdRegistro.value = cabecera[0];
                lblNro.innerHTML = cabecera[1];
                var dFecha = cabecera[2].split("/");
                ddtFecha.value = dFecha[2] + "-" + dFecha[1] + "-" + dFecha[0];
                lblOperacion.innerHTML = cabecera[3];
                lblProveedor.innerHTML = cabecera[4];
                lblOrdenCompra.innerHTML = cabecera[5];
                lblFechaOrden.innerHTML = cabecera[6];
                ttaJusticiacion.value = cabecera[7];
                lblDocumentoGuia.innerHTML = cabecera[8];
                lblNumeroGuia.innerHTML = cabecera[9];
                lblFechaGuia.innerHTML = cabecera[10];
                GrillaDetalleNP(detalle, "divDetalleNEA", "tblDetalleNEA", true, 7, "spnTotal");
            }
            else {
                divPopupContainerFormatoPCS.style.display = 'block';
                txtIdRegistroPCS.value = cabecera[0];
                lblNroPCS.innerHTML = cabecera[1];
                var dFecha = cabecera[2].split("/");
                ddtFechaPCS.value = dFecha[2] + "-" + dFecha[1] + "-" + dFecha[0];
                lblOperacionPCS.innerHTML = cabecera[3];
                ttaJusticiacionPCS.value = cabecera[5];
                lblRecepcion.innerHTML = cabecera[9] + "<br />" + cabecera[8] + "<br />&nbsp;";
                lblNombreSolicita.innerHTML = cabecera[12] + "<br />" + cabecera[11] + "<br />" + cabecera[10];
                GrillaDetalleNP(detalle, "divDetallePCS", "tblDetallePCS", true, 7, "spnTotal");
            }
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

function configurarBotones() {
    var btnTabIngreso = document.getElementById("btnTabIngreso");
    if (btnTabIngreso != null) btnTabIngreso.onclick = function () {
        idTabActivo = "Ingreso";
        getListarInformacion()
    }

    var btnTabSalida = document.getElementById("btnTabSalida");
    if (btnTabSalida != null) btnTabSalida.onclick = function () {
        idTabActivo = "Salida";
        getListarInformacion();
    }

    var btnImprimir = document.getElementById("btnImprimir");
    if (btnImprimir != null) btnImprimir.onclick = function () {
        if (idRegistro == "") {
            mostrarMensaje("Seleccione fila de la lista", "error");
        }
        else if (vista == "CierreInventario") {
            spnLoad.style.display = 'inline';
            Http.get("General/getreporte/?tbl=" + controller + vista + '&data=' + idRegistro, mostrarReporteCierre);
        }
        else {
            getReporte(idRegistro);
        }
    }

    var btnGenerarPS = document.getElementById("btnGenerarPS");
    if (btnGenerarPS != null) btnGenerarPS.onclick = function () {

        if (idRegistro == "") {
            mostrarMensaje("Seleccione la NEA", "error")
        }
        //else if (ordenCompra == "") {
        //    mostrarMensaje("La NEA no tiene Orden de Compra", "error")
        //}
        else {
            generarPendienteSalida();
        }
    }

    var btnGenerar = document.getElementById("btnGenerar");
    if (btnGenerar != null) btnGenerar.onclick = function () {

        if (vista == "CierreInventario") {
            Swal.fire({
                title: '¿Desea procesar información?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.value) {
                    Http.get("General/listarTabla/?tbl=Procesar&data=", mostrarProcesar);
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
        else {
            var tipo = "";
            if (optIngreso.checked) { tipo = "Ingreso"; } else { tipo = "Salida"; }
            var validar = false;

            if (vista == "Pendiente" && tipo == "Ingreso" && validarGenerar() == true) {
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
                        if (vista == "Pendiente" && tipo == "Ingreso") {
                            grabarIngreso();
                        }
                    }
                })
            }
        }
    }

    var btnMostrar = document.getElementById("btnMostrar");
    if (btnMostrar != null) btnMostrar.onclick = function () {
        if (vista == "Pendiente" || vista == "GenerarNP") {
            Http.get("General/obtenerTabla/?tbl=" + controller + vista + 'Ingreso&id=' + idRegistro, mostrarRegistroPendiente);
        }
    }
    var btnNuevo = document.getElementById("btnNuevo");
    if (btnNuevo != null) btnNuevo.onclick = function () {
        divPopupContainer.style.display = 'block';
        limpiarForm("Popup");

        let tituloModal = document.getElementById("tituloModal");
        if (tituloModal != null) {
            tituloModal.innerText = "Nuevo Registro";
        }

        var cboAlmacen = document.getElementById("cboAlmacen");
        if (cboAlmacen != null) {
            cboAlmacen.value = 1;
        }

        var cboEstado = document.getElementById("cboEstado");
        if (cboEstado != null) {
            cboEstado.value = 1;
            cboEstado.disabled = true;
        }
        var select2cboResponsable = document.getElementById("select2-cboResponsable-container");
        if (select2cboResponsable != null) select2cboResponsable.innerHTML = "Seleccione";

        var select2cboInventario = document.getElementById("select2-cboInventario-container");
        if (select2cboInventario != null) select2cboInventario.innerHTML = "Seleccione";

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

      if (validarInformacion("Reque") == true) {
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

    var btnCancelarForm1 = document.getElementById("btnCancelarForm1");
    if (btnCancelarForm1 != null) btnCancelarForm1.onclick = function () {
        divPopupContainerForm1.style.display = 'none';
    }

    var btnCancelarForm2 = document.getElementById("btnCancelarForm2");
    if (btnCancelarForm2 != null) btnCancelarForm2.onclick = function () {
        divPopupContainerForm2.style.display = 'none';
    }

    var btnConsultar = document.getElementById("btnConsultar");
    if (btnConsultar != null) btnConsultar.onclick = function () {
        if (vista == "InventarioInicial") {
            getListarInventario();
        }
        else {
            getListar();
        }
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


function generarDetallePendiente(datos, tipo, idOrden) {
    var idEstado = cboEstado.value;
    var contenidoHead = "";
    tbCabecera.innerHTML = "";
    var lista = datos.split('¬');
    if (optIngreso.checked) {
        contenidoHead = "<tr class='FilaHead'>";
        contenidoHead += "<th style='width:50px;display:none'>id</th>";
        contenidoHead += "<th style='width:50px;'>Item</th>";
        contenidoHead += "<th style='width:50px;'>Código</th>";
        contenidoHead += "<th style='width:500px;'>Descripción</th>";
        contenidoHead += "<th style='width:50px;'>Unidad Medida</th>";
        contenidoHead += "<th style='width:80px;'>Costo Unitario</th>";
        contenidoHead += "<th style='width:70px;'>Cantidad</th>";
        contenidoHead += "<th style='width:70px;'>Cantidad Ingresada</th>";
        contenidoHead += "<th style='width:70px;'>Cantidad a Aprobar</th>";
        contenidoHead += "</tr>";
        tbCabecera.innerHTML = contenidoHead;
        generarIngresoPediente(lista, tipo, idOrden);
        generarIngreso(lista, tipo);
    }
    else {
        contenidoHead = "<tr class='FilaHead'>";
        contenidoHead += "<th style='width:50px;display:none'>id</th>";
        contenidoHead += "<th style='width:50px;'>Item</th>";
        contenidoHead += "<th style='width:50px;'>Código</th>";
        contenidoHead += "<th style='width:500px;'>Descripción</th>";
        contenidoHead += "<th style='width:50px;'>Unidad Medida</th>";
        contenidoHead += "<th style='width:70px;'>Cantidad Solicitada</th>";
        contenidoHead += "<th style='width:70px;'>Cantidad Atendida</th>";
        contenidoHead += "<th style='width:70px;'>Cantidad Comprometida</th>";
        contenidoHead += "</tr>";
        tbCabecera.innerHTML = contenidoHead;
        generarIngresoPediente(lista, tipo, idOrden);
        generarIngreso(lista, tipo);
    }
}


function generarIngresoPediente(lista, tipo, idOrden) {
    var idEstado = cboEstado.value;
    var contenido = "";
    var nRegistros = lista.length;
    var campos = [];
    var item = 0;
    if (tipo == '1') {
        for (var i = 0; i < nRegistros; i++) {
            campos = lista[i].split("|");
            item++;
            contenido += "<tr>";
            contenido += "<td style='display:none'>";
            contenido += campos[0];
            contenido += "</td> ";
            contenido += "<td style='vertical-align:top'>";
            contenido += i + 1;
            contenido += "</td> ";
            contenido += "<td style='vertical-align:top'>";
            contenido += campos[1];
            contenido += "</td> ";
            contenido += "<td style='max-width:600px;white-space: pre-line;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
            contenido += campos[2];
            contenido += "</td> ";
            contenido += "<td style='vertical-align:top'>";
            contenido += campos[3];
            contenido += "</td> ";
            if ((idEstado == '1') && idOrden == '0') {
                contenido += "<td style='vertical-align:top;width:90px;padding:0px'>";
                contenido += "<input type='number' class='cantidad' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 value=";
                contenido += campos[5];
                contenido += "></td> ";
                contenido += "<td style='vertical-align:top;width:90px;padding:0px'>";
                contenido += "<input type='number' class='cantidad' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 value=";
                contenido += campos[4];
                contenido += "></td> ";
            }
            else {
                contenido += "<td style='vertical-align:top;text-align:right'>";
                contenido += formatoNumeroDecimal(campos[5]);
                contenido += "</td>";
                contenido += "<td style='vertical-align:top;text-align:right;background-color:#FBB6A7;font-weight:bold'>";
                contenido += formatoNumeroDecimal(campos[4]);
                contenido += "</td>";
            }
            contenido += "<td style='vertical-align:top;text-align:right'>";
            contenido += formatoNumeroDecimal(campos[6]);
            contenido += "</td>";
            contenido += "<td style='vertical-align:top;text-align:right'>";
            contenido += formatoNumeroDecimal(campos[7]);
            contenido += "</td>";
            if ((idEstado == '1') && idOrden == '0') {
                contenido += "<td>";
                contenido += "<i class='fa fa-trash f-16 text-c-red' title='Quitar Item' onclick='retirarItem(this,\"";
                contenido += campos[0];
                contenido += "\");'></i>";
                contenido += "</td>";
            }
            contenido += "</tr>";
        }
    }
    else {
        for (var i = 0; i < nRegistros; i++) {
            campos = lista[i].split("|");
            item++;
            contenido += "<tr>";
            contenido += "<td style='display:none'>";
            contenido += campos[0];
            contenido += "</td> ";
            contenido += "<td style='vertical-align:top'>";
            contenido += i + 1;
            contenido += "</td> ";
            contenido += "<td style='vertical-align:top'>";
            contenido += campos[1];
            contenido += "</td> ";
            contenido += "<td style='max-width:600px;white-space: pre-line;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
            contenido += campos[2];
            contenido += "</td> ";
            contenido += "<td style='vertical-align:top'>";
            contenido += campos[3];
            contenido += "</td> ";
            if ((idEstado == '1') && idOrden == '0') {
                contenido += "<td style='vertical-align:top;width:90px;padding:0px'>";
                contenido += "<input type='number' class='cantidad' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 value=";
                contenido += campos[4];
                contenido += "></td> ";
            }
            else {
                contenido += "<td style='vertical-align:top;text-align:right'>";
                contenido += formatoNumeroDecimal(campos[4]);
                contenido += "</td>";
            }
            contenido += "<td style='vertical-align:top;text-align:right'>";
            contenido += (campos[5] == "") ? '' : formatoNumeroDecimal(campos[5]);
            contenido += "</td>";
            contenido += "<td style='vertical-align:top;text-align:right'>";
            contenido += (campos[6] == "") ? '' : formatoNumeroDecimal(campos[6]);
            contenido += "</td>";
            if ((idEstado == '1') && idOrden == '0') {
                contenido += "<td>";
                contenido += "<i class='fa fa-trash f-16 text-c-red' title='Quitar Item' onclick='retirarItem(this,\"";
                contenido += campos[0];
                contenido += "\");'></i>";
                contenido += "</td>";
            }
            contenido += "</tr>";
        }
    }

    tbDetallePendiente.innerHTML = contenido;
    spnNroItems.innerHTML = "Items: " + nRegistros;
    //configurarEnterGrid(tbDetallePendiente, 6);
}

function generarIngreso(lista, tipo) {
    var idEstado = cboEstado.value;
    if (tipo == '1') {
        contenidoHead = "<tr class='FilaHead'>";
        contenidoHead += "<th rowspan='2' style='width: 50px; display: none'>id</th>";
        contenidoHead += "<th rowspan='2' style='width: 50px;'>Item</th>";
        contenidoHead += "<th rowspan='2' style='width: 50px;'>Código</th>";
        contenidoHead += "<th rowspan='2' style='width: 500px;'>Descripción</th>";
        contenidoHead += "<th rowspan='2' style='white-space:pre-wrap;width: 50px;'>Unidad Medida</th>";
        contenidoHead += "<th rowspan='2' style='width: 70px;'>Costo Unitario</th>";
        if (idEstado == '1' || idEstado == '2') { contenidoHead += "<th colspan='4'>Valores</th>"; }
        else { contenidoHead += "<th colspan='3'>Valores</th>"; }
        contenidoHead += "</tr>";
        contenidoHead += "<tr class='FilaHead'>";
        contenidoHead += "<th style='white-space:pre-wrap;width: 80px;'>Total a internar</th>";
        contenidoHead += "<th style='white-space:pre-wrap;width: 70px;'>Cantidad Ingresada</th>";
        contenidoHead += "<th style='white-space:pre-wrap;width: 70px;'>Cantidad a Aprobar</th>";
        if (idEstado == '1' || idEstado == '2') { contenidoHead += "<th style='white-space:pre-wrap;width: 70px;'>Cantidad</th>"; }
        contenidoHead += "</tr>";
        tbCabeceraGenerar.innerHTML = contenidoHead;

        var contenido = "";
        var nRegistros = lista.length;
        var campos = [];
        var item = 0;
        var saldo = 0;
        for (var i = 0; i < nRegistros; i++) {
            campos = lista[i].split("|");
            saldo = (campos[4] * 1) - (campos[6] * 1) - (campos[7] * 1)
            if (idEstado == '1' || idEstado == '2') {
                if (saldo > 0) {
                    item++;
                    if (tipo == 1) {
                        contenido += "<tr>";
                    }
                    else {
                        contenido += "<tr class='FilaDatos' ondblclick='seleccionarFilaItem(this, \"";
                        contenido += campos[0];
                        contenido += "\"); '>";
                    }
                    contenido += "<td style='display:none'>";
                    contenido += campos[0];
                    contenido += "</td> ";
                    contenido += "<td style='vertical-align:top'>";
                    contenido += i + 1;
                    contenido += "</td> ";
                    contenido += "<td style='vertical-align:top'>";
                    contenido += campos[1];
                    contenido += "</td> ";
                    contenido += "<td style='max-width:600px;white-space: pre-line;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
                    contenido += campos[2];
                    contenido += "</td> ";
                    contenido += "<td style='vertical-align:top'>";
                    contenido += campos[3];
                    contenido += "</td> ";
                    contenido += "<td style='vertical-align:top;text-align:right'>";
                    contenido += formatoNumeroDecimal(campos[5]);
                    contenido += "</td> ";
                    contenido += "<td style='vertical-align:top;text-align:right;background-color:#FBB6A7;font-weight:bold'>";
                    contenido += formatoNumeroDecimal(campos[4]);
                    contenido += "</td> ";
                    contenido += "<td style='vertical-align:top;text-align:right'>";
                    contenido += formatoNumeroDecimal(campos[6]);
                    contenido += "</td>";
                    contenido += "<td style='vertical-align:top;text-align:right'>";
                    contenido += formatoNumeroDecimal(campos[7]);

                    contenido += "</td> ";
                    if (idEstado == '1' || idEstado == '2') {
                        contenido += "<td style='vertical-align:top;width:90px;padding:0px'>";
                        contenido += "<input type='number' onkeyup ='validarCantidad(this)' class='cantidad' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 value=";
                        contenido += formatoNumeroDecimal(saldo);
                        contenido += "></td> ";
                    }
                    contenido += "</tr>";
                }
            }
            else {

                item++;
                if (tipo == 1) {
                    contenido += "<tr>";
                }
                else {
                    contenido += "<tr class='FilaDatos' ondblclick='seleccionarFilaItem(this, \"";
                    contenido += campos[0];
                    contenido += "\"); '>";
                }
                contenido += "<td style='display:none'>";
                contenido += campos[0];
                contenido += "</td> ";
                contenido += "<td style='vertical-align:top'>";
                contenido += i + 1;
                contenido += "</td> ";
                contenido += "<td style='vertical-align:top'>";
                contenido += campos[1];
                contenido += "</td> ";
                contenido += "<td style='max-width:600px;white-space: pre-line;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
                contenido += campos[2];
                contenido += "</td> ";
                contenido += "<td style='vertical-align:top'>";
                contenido += campos[3];
                contenido += "</td> ";
                contenido += "<td style='vertical-align:top;text-align:right'>";
                contenido += formatoNumeroDecimal(campos[5]);
                contenido += "</td> ";
                contenido += "<td style='vertical-align:top;text-align:right'>";
                contenido += formatoNumeroDecimal(campos[4]);
                contenido += "</td> ";
                contenido += "<td style='vertical-align:top;text-align:right'>";
                contenido += formatoNumeroDecimal(campos[6]);
                contenido += "</td>";
                contenido += "<td style='vertical-align:top;text-align:right'>";
                contenido += formatoNumeroDecimal(campos[7]);
                contenido += "</td> ";
                if (idEstado == '1' || idEstado == '2') {
                    contenido += "<td style='vertical-align:top;width:90px;padding:0px'>";
                    contenido += "<input type='number' onkeyup ='validarCantidad(this)' class='cantidad' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 value=";
                    contenido += formatoNumeroDecimal(saldo);
                    contenido += "></td> ";
                }
                contenido += "</tr>";
            }
        }
    }
    else {
        contenidoHead = "<tr class='FilaHead'>";
        contenidoHead += "<th style='width: 50px; display: none'>id</th>";
        contenidoHead += "<th style='width: 50px;'>Item</th>";
        contenidoHead += "<th style='width: 50px;'>Código</th>";
        contenidoHead += "<th style='width: 500px;'>Descripción</th>";
        contenidoHead += "<th style='white-space:pre-wrap;width: 50px;'>Unidad Medida</th>";
        contenidoHead += "<th style='width: 70px;'>Stock Actual</th>";
        contenidoHead += "<th style='white-space:pre-wrap;width: 80px;'>Cantidad Pedida</th>";
        contenidoHead += "<th style='white-space:pre-wrap;width: 70px;'>Cantidad Atendida</th>";
        contenidoHead += "<th style='white-space:pre-wrap;width: 70px;'>Cantidad Comprometida</th>";
        if (idEstado == '1' || idEstado == '2') { contenidoHead += "<th style='white-space:pre-wrap;width: 70px;'>Cantidad Guiada</th>"; }
        contenidoHead += "</tr>";
        tbCabeceraGenerar.innerHTML = contenidoHead;
        var contenido = "";
        var nRegistros = lista.length;
        var campos = [];
        var item = 0;
        var saldo = 0;
        for (var i = 0; i < nRegistros; i++) {
            campos = lista[i].split("|");
            saldo = (campos[4] * 1) - (campos[5] * 1) - (campos[6] * 1)
            if (saldo > 0) {
                item++;
                contenido += "<tr>";
                contenido += "<td style='display:none'>";
                contenido += campos[0];
                contenido += "</td> ";
                contenido += "<td style='vertical-align:top'>";
                contenido += i + 1;
                contenido += "</td> ";
                contenido += "<td style='vertical-align:top'>";
                contenido += campos[1];
                contenido += "</td> ";
                contenido += "<td style='max-width:600px;white-space: pre-line;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
                contenido += campos[2];
                contenido += "</td> ";
                contenido += "<td style='vertical-align:top'>";
                contenido += campos[3];
                contenido += "</td> ";
                contenido += "<td style='vertical-align:top;text-align:right;background-color:#FBB6A7;font-weight:bold'>";
                contenido += formatoNumeroDecimal(campos[7]);//Stock Actual
                contenido += "</td> ";
                contenido += "<td style='vertical-align:top;text-align:right;background-color:#B4FA80;font-weight:bold'>";
                contenido += formatoNumeroDecimal(campos[4]);//cantidad
                contenido += "</td> ";
                contenido += "<td style='vertical-align:top;text-align:right'>";
                contenido += (campos[5] == "") ? '' : formatoNumeroDecimal(campos[5]);//Cantidad atendida
                contenido += "</td>";
                contenido += "<td style='vertical-align:top;text-align:right'>";
                contenido += (campos[6] == "") ? '' : formatoNumeroDecimal(campos[6]);//Cantidad comprometida
                contenido += "</td> ";
                if (idEstado == '1' || idEstado == '2') {
                    contenido += "<td style='vertical-align:top;width:90px;padding:0px'>";
                    contenido += "<input type='number' onkeyup ='validarCantidadSalida(this)' class='cantidad' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 value=";
                    contenido += formatoNumeroDecimal(saldo);
                    contenido += "></td> ";
                }
                contenido += "</tr>";
            }
        }
    }
    tbDetalleGenerar.innerHTML = contenido;
    var nFilas = tbDetalleGenerar.rows.length;
    spnNroItemsNuevo.innerHTML = "Items: " + nFilas;
}

function validarCantidadPS(txt) {
    //var fila = txt.parentNode.parentNode;
    var stock = (txt.getAttribute("data-stock") * 1)
    var cantidad = txt.value * 1;
    if (cantidad > stock) {
        mostrarMensaje("La cantidad ingresada es mayor al stock actual", "error");
        txt.value = "";
        return;
    }
}


function mostrarRegistroPendiente(rpta) {
    if (rpta) {
        if (vista == "Pendiente") {
            var idOrdenCompra;
            var listas = rpta.split('¯');
            var cabecera = listas[0].split('|');
            var detalle = listas[1];

            if (optIngreso.checked) {
                divPopupContainerForm1.style.display = 'block';
                txtIdRegistroNuevo.value = cabecera[0];
                lblNroPendienteIngresoNuevo.innerHTML = cabecera[8];
                cboAlmacenNuevo.value = cabecera[1];
                cboProveedorNuevo.value = cabecera[2];
                cboTipoOperacionNuevo.value = cabecera[3];
                cboEstadoNuevo.value = cabecera[4];
                ttaJustificacionNuevo.value = cabecera[5];
                lblOrdenCompraNuevo.innerHTML = cabecera[7];
                var dFecha = cabecera[6].split("/");
                ddtFechaNuevo.value = dFecha[2] + "-" + dFecha[1] + "-" + dFecha[0];
                // divArea.style.display = 'none';
            //    lblTituloOrden.innerHTML = "Orden Compra";
                var listaDocumento = listas[2].split('¬');
                crearCombo(listaDocumento, "cboTipoDocumento", "Seleccionar")
                cboTipoDocumento.value = 9;
                var idOrden = cabecera[9];
               // divAreaNuevo.style.display = 'none';
                divRecepcion.style.display = 'none';
                generarDetallePendiente(detalle, 1, idOrden);

            }
            else {
                divPopupContainerDetalleItemPCS.style.display = 'block';
                var listaRecepcion = listas[2].split('¬');
                crearCombo(listaRecepcion, "cboRecepcion", "Seleccionar")
                var dFecha = cabecera[6].split("/");
                txtIdRegistroSalidaNuevo.value = cabecera[1];
                cboAlmacenSalidaNuevo.value = cabecera[1];
                cboProveedorSalidaNuevo.value = cabecera[2];
                cboAreaNuevo.value = cabecera[9];
                cboTipoOperacionSalidaNuevo.value = cabecera[3];
                cboEstadoSalidaNuevo.value = cabecera[4];
                ttaJustificacionSalidaNuevo.value = cabecera[5];
                ddtFechaSalidaNuevo.value = dFecha[2] + "-" + dFecha[1] + "-" + dFecha[0];
                lblNroPendienteSalidaNuevo.innerHTML = cabecera[8];
                generarDetalleSalida(detalle, 1);
            }
        }
    }
}


function validarGenerar() {
    if (optIngreso.checked) {
        var idTipoDocumento = cboTipoDocumento.value;
        var nroGuia = txtNroGuia.value.trim();
        var fechaGuia = ddtFechaGuia.value;
        var justificacion = ttaJustificacion.value.trim();

        if (idTipoDocumento == "") {
            mostrarMensaje("Seleccione Tipo de documento", "error");
            cboTipoDocumento.focus();
            return false;
        }
        else if (nroGuia == "") {
            mostrarMensaje("Ingrese número de documento", "error");
            txtNroGuia.focus();
            return false;
        }
        else if (fechaGuia == "") {
            mostrarMensaje("Ingrese fecha del documento", "error");
            ddtFechaGuia.focus();
            return false;
        }
        else if (justificacion == "") {
            mostrarMensaje("Ingrese justificacion", "error");
            ttaJustificacion.focus();
            return false;
        }
        else {
            return true;
        }
    }
    else {
        var tipoOperacion = cboTipoOperacionSalidaNuevo.value;
        var justificacionSalidaNuevo = ttaJustificacionSalidaNuevo.value.trim();
        var recepcion = cboRecepcion.value;

        if (tipoOperacion == "") {
            mostrarMensaje("Seleccione el tipo de operación", "error");
            cboTipoOperacionSalidaNuevo.focus();
            return false;
        }
        else if (justificacionSalidaNuevo == "") {
            mostrarMensaje("Ingrese la justificación", "error");
            ttaJustificacionSalidaNuevo.focus();
            return false;
        }

        else if (recepcion == "") {
            mostrarMensaje("Seleccione quien recepciona los artículos", "error");
            cboRecepcion.focus();
            return false;
        }
        else {
            return true;
        }
    }
}


function grabarIngreso() {
    var data = "";
    var idES = txtIdES.value;
    var idRegistro = txtIdRegistro.value;
    var idTipoDocumento = cboTipoDocumento.value;
    var nroGuia = txtNroGuia.value;
    var fechaGuia = ddtFechaGuia.value;
    var justificacion = ttaJustificacion.value;

    if (optIngreso.checked) { tipo = 1; } else { tipo = 2; }

    data = idES;
    data += "|";
    data += idRegistro;
    data += "|";
    data += idTipoDocumento;
    data += "|";
    data += nroGuia
    data += "|";
    data += fechaGuia
    data += "|";
    data += justificacion
    data += "|";
    data += tipo
    data += "¯";
    var nfilas = tbDetalleGenerar.rows.length;
    var fila;
    for (var i = 0; i < nfilas; i++) {
        fila = tbDetalleGenerar.rows[i];
        if (fila.cells[9].childNodes[0].value > 0) {
            data += fila.cells[0].innerHTML; //IdItem
            data += "|";
            data += fila.cells[5].innerHTML.replace(/,/g, ''); //Precio
            data += "|";
            data += fila.cells[9].childNodes[0].value; //Cantidad
            data += "¬";
        }
    }
    data = data.substr(0, data.length - 1);

    var txtFechaInicio = document.getElementById("txtFechaInicio").value;
    var txtFechaFinal = document.getElementById("txtFechaFinal").value;

    data = data + '¯' + txtFechaInicio + '|' + txtFechaFinal

    var frm = new FormData();
    frm.append("data", data);
    Http.post("General/guardar?tbl=" + controller + 'GenerarNP', mostrarGrabar, frm);

    btnGenerar.innerHTML = "Procesando información <i class='fa fa-circle-o-notch fa-spin' style='color:white'></i>";
    btnGenerar.disabled = true;
}

function getReporte(id) {
    var tipo = "";
    if (vista == "GenerarNP") {
        if (optIngreso.checked) { tipo = "NEA"; } else { tipo = "PECOSA"; }
    }
    Http.get("General/obtenerReporteId/?tbl=" + controller + vista + tipo + '&id=' + id, mostrarReporte);
}


function mostrarReporteCierre(rpta) {
    spnLoad.style.display = 'none';
    if (rpta) {
        var listas = rpta.split('¯');
        tituloReporte = listas[0];
        var lista = listas[1].split("¬");
        contenidoExporta = listas[1];
        crearTablaReporte(lista, 5, 5, "tblListaDatosResumen");
        listaDatos = listas[1];
        var fecha = listas[3];
        var hora = listas[4];
        var doc = new jsPDF()
        var totalPagesExp = '{total_pages_count_string}';
        doc.autoTable({
            html: '#tblListaDatosResumen',
            styles: { cellPadding: 0.5, fontSize: 9 },
            theme: 'grid',
            headerStyles: {
                fillColor: [0, 0, 0],
                fontSize: 9,
                halign: 'center',
            },
            columnStyles: {
                1: { halign: 'center' },
                5: { halign: 'right' },
                6: { halign: 'right' },
                7: { halign: 'right' },
            },
            margin: { top: 41 },
            didDrawPage: function (data) {
                // Header
                doc.setFontSize(20)
                doc.setTextColor(40)
                if (base64Img) {
                    doc.addImage(base64Img, 'JPEG', 25, 6, 10, 10)
                }
                doc.setFontSize(6);
                doc.text('IAFAS de la Marina de Guerra del Perú', 14, 18)
                doc.text('SISGEFIN', 14, 21)
                doc.text('Fecha: ' + fecha, 170, 21)
                doc.text('Usuario: ' + spnUsuario.innerHTML, 14, 23)
                doc.text('Hora: ' + hora, 170, 23)
                doc.setFontSize(13);
                doc.text(tituloReporte, data.settings.margin.left + 80, 32)
                doc.setFontSize(12);
                doc.text('FECHA CIERRE: ' + ordenCompra, data.settings.margin.left + 75, 37)

                // Footer
                var str = 'Página ' + doc.internal.getNumberOfPages()
                if (typeof doc.putTotalPages === 'function') {
                    str = str + ' de ' + totalPagesExp
                }
                doc.setFontSize(10)

                var pageSize = doc.internal.pageSize
                var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
                doc.text(str, data.settings.margin.left, pageHeight - 5)
            },

        })

        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp)
        }

        doc.setProperties({
            title: 'SISGEFIN: ' + tituloReporte,
            subject: 'IAFAS-FOSMAR',
            author: spnUsuario.innerHTML
        });
        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));

        //document.getElementById("output").data = doc.output('datauristring');
        //var divPopupContainerItem = document.getElementById("divPopupContainerItem");
        //if (divPopupContainerItem != null) divPopupContainerItem.style.display = 'block';
    }
    else {
        mostrarMensaje("No se generó ningún reporte", "error")
    }
}

function mostrarReporte(rpta) {
    if (rpta) {
        if (vista == "GenerarNP") {
            if (optIngreso.checked) {
                var listaDetalleReporte = "";
                var listaReporte = rpta.split("¯");
                var Cabecera = listaReporte[0].split("|");
                tdNroTitulo.innerHTML = "Nº " + Cabecera[0];
                tdNroNea.innerHTML = Cabecera[0];
                var fechaNea = Cabecera[1].split('/');
                tdDia.innerHTML = fechaNea[0];
                tdMes.innerHTML = fechaNea[1];
                tdAnio.innerHTML = fechaNea[2];
                tdMoneda.innerHTML = Cabecera[2];
                tdOrden.innerHTML = Cabecera[3];
                lblNroOrden.innerHTML = Cabecera[3];
                lblFechaOC.innerHTML = Cabecera[4];
                lblJustificacion.innerHTML = Cabecera[5];
                lblProveedorNEA.innerHTML = Cabecera[6];
                lblGuiaRemi.innerHTML = Cabecera[7];
                lblFechaGuiaRemi.innerHTML = Cabecera[8];
                lblPresupuesto.innerHTML = Cabecera[9];

                var jeLog = Cabecera[10].split('-');
                lblGradoJeLog.innerHTML = jeLog[2];
                lblNombreJelog.innerHTML = jeLog[0];
                lblDNIJelog.innerHTML = jeLog[1];

                var jeAlmacen = Cabecera[11].split('-');
                lblNombreJefeAlmacen.innerHTML = jeAlmacen[0];
                lblDNIAlmacen.innerHTML = jeAlmacen[1];

                var total = 0;
                var contenido = "";
                listaDetalleReporte = listaReporte[1].split("¬");
                var nregistros = listaDetalleReporte.length;
                if (nregistros > 0 && listaDetalleReporte[0] != "") {
                    var campos = [];
                    for (var i = 0; i < nregistros; i++) {
                        campos = listaDetalleReporte[i].split("|");
                        contenido += "<tr>";
                        contenido += "<td colspan='2'style='vertical-align:top;text-align: center;'>";
                        contenido += i + 1;
                        contenido += "</td > ";
                        contenido += "<td>";
                        contenido += "</td > ";
                        contenido += "<td colspan='16' style='vertical-align:top;text-align: center;'>";
                        contenido += campos[1];
                        contenido += "</td > ";
                        contenido += "<td style='vertical-align:top;text-align: center;'>";
                        contenido += campos[2];//unidad medida
                        contenido += "</td > ";
                        contenido += "<td colspan='10' style='vertical-align:top;text-align: right;'>";
                        contenido += formatoNumeroDecimal(campos[3] * 1);
                        contenido += "</td > ";
                        contenido += "<td style='vertical-align:top;width:550px;max-width:550px;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>&nbsp;&nbsp;&nbsp;";
                        contenido += campos[4];//descripcion
                        contenido += "</td > ";
                        contenido += "<td style='vertical-align:top;'>";
                        contenido += campos[5];
                        contenido += "</td > ";
                        contenido += "<td colspan='10' style='vertical-align:top;text-align: right;'>";
                        contenido += formatoNumeroDecimal(campos[6] * 1);
                        contenido += "</td > ";
                        contenido += "<td style='width:75px;max-width:75px;vertical-align:top;text-align: right;'>";
                        contenido += formatoNumeroDecimal(campos[7] * 1);
                        total = total + (campos[7] * 1);
                        contenido += "</td > ";
                        contenido += "</tr>";
                    }
                    tdTotalNEA.innerHTML ="TOTAL: "+ formatoNumeroDecimal(total);
                    tblDetalleNEA.innerHTML = contenido;
                }
                imprimir(divReporte.innerHTML);
            }
            else {
                var listaDetalleReporte = "";
                var listaReporte = rpta.split("¯");
                var Cabecera = listaReporte[0].split("|");
                tdNroPecosa.innerHTML = "PEDIDO-COMPROBANTE DE SALIDA Nº " + Cabecera[0];
                tdDiaPecosa.innerHTML = Cabecera[1];
                tdMesPecosa.innerHTML = Cabecera[2];
                tdAnioPecosa.innerHTML = Cabecera[3];
                tdJustificacion.innerHTML = Cabecera[4];
                tdPedidoPecosa.innerHTML = Cabecera[25];
                spnSolicitaGrado.innerHTML = Cabecera[17];
                spnSolicitaCargo.innerHTML = Cabecera[18];
                spnSolicitaNombre.innerHTML = Cabecera[19];
                spnSolicitaCIP.innerHTML = Cabecera[20];
                spnJefeAbaGrado.innerHTML = Cabecera[21];
                spnJefeAbaNombre.innerHTML = Cabecera[23];
                spnJefeAbaCIP.innerHTML = Cabecera[24];

                spnRecibidoGrado.innerHTML = Cabecera[13];
                spnRecibidoNombre.innerHTML = Cabecera[15];
                spnRecibidoCIP.innerHTML = Cabecera[16];

                spnEntregadoGrado.innerHTML = Cabecera[9];
                spnEntregadoNombre.innerHTML = Cabecera[11];
                spnEntregadoCIP.innerHTML = Cabecera[12];

                spnJefeAlmacenGrado.innerHTML = Cabecera[5];
                spnJefeAlmacenNombre.innerHTML = Cabecera[7];
                spnJefeAlmacenCIP.innerHTML = Cabecera[8];

                var contenido = "";
                listaDetalleReporte = listaReporte[1].split("¬");
                var nregistros = listaDetalleReporte.length;
                if (nregistros > 0 && listaDetalleReporte[0] != "") {
                    var campos = [];
                    for (var i = 0; i < nregistros; i++) {
                        campos = listaDetalleReporte[i].split("|");
                        contenido += "<tr>";
                        contenido += "<td style='border:1px solid black;vertical-align:top;text-align: center;'>";
                        contenido += i + 1;
                        contenido += "</td > ";
                        contenido += "<td style='border:1px solid black;>";
                        contenido += "</td > ";
                        contenido += "<td style='border:1px solid black;vertical-align:top;text-align: center;'>";
                        contenido += campos[1];
                        contenido += "</td > ";
                        contenido += "<td colspan='2' style='border:1px solid black;vertical-align:top;text-align: left;max-width:500px;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
                        contenido += campos[2];
                        contenido += "</td > ";
                        contenido += "<td style='border:1px solid black;vertical-align:top;text-align: center;'>";
                        contenido += campos[3];
                        contenido += "</td > ";
                        contenido += "<td style='border:1px solid black;vertical-align:top;text-align: right;'>";
                        contenido += formatoNumero(campos[4] * 1);
                        contenido += "</td > ";
                        contenido += "<td style='vertical-align:top;text-align: right;'>";
                        contenido += formatoNumero(campos[5] * 1);
                        contenido += "</td > ";
                        contenido += "<td></td>";
                        contenido += "<tdcolspan='3'></td>";
                        contenido += "</tr>";
                    }
                    tblDetallePecosa.innerHTML = contenido;
                }

                imprimir(divReportePECOSA.innerHTML);
            }
        }
    }
}

function imprimir(contenido) {
    pagina = document.body;
    var ventana = window.frames["print_frame"];
    ventana.document.body.innerHTML = "";
    ventana.document.write(contenido);
    ventana.focus();
    ventana.print();
    ventana.close();
    document.body = pagina;
}


function generarPendienteSalida() {
    var data = "";
    var fechaInicio = txtFechaInicio.value;
    var fechaFinal = txtFechaFinal.value;
    data = idRegistro + '|' + fechaInicio + '|' + fechaFinal;

    var frm = new FormData();
    frm.append("data", data);
    Swal.fire({
        title: '¿Está seguro que desea generar pendiente de salida de la N.E.A. seleccionada ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.value) {
            Http.post("General/Guardar/?tbl=" + controller + "PendienteSalidadeNEA", mostrarGrabar, frm);
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
