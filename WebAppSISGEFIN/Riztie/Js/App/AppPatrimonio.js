var idTabActivo = "";
var idCombos = [];
var listas = [];
var ayudas = [];
var formulario = [];
var filaAnterior = null;
var vista = "";
var controller = "";
var idRegistro = "";
var listaUbicaFisica_v = [];
var listaActivos_v = [];
var FLAG_INICIAL_INVENTARIO_INICIAL = 1;
var FLAG_INICIAL_ALTA = 0;

window.onload = function () {
    getConfigMn();
    vista = window.sessionStorage.getItem("Vista");
    controller = window.sessionStorage.getItem("Controller");
    mostrarLoading("divLista");
    getListar();
    configurarBotones();
    configurarCombos();
    configurarCampos();
}


function getListar() {
    var data = "";
    Http.get("General/listarTabla?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
}

function mostrarlistas(rpta) {
    if (rpta) {
        var listas = rpta.split("¯");
        var lista = listas[0].split("¬");
        if (vista == "UbicaFisica") {
            var listaOficina = listas[1].split("¬");
            var listaResponsable = listas[2].split("¬");
            var listaEstado = listas[3].split("¬");

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaOficina, "cboOficina", "Seleccione");
            crearCombo(listaResponsable, "cboResponsable", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        if (vista == "InventarioInicial" || vista == "Altas") {
            listaUbicaFisica_v = listas[1].split("¬");
            listaActivos_v = listas[4].split("¬");

            var listaResponsable = listas[2].split("¬");
            var listaOficina = listas[3].split("¬");
            var listaActivos = listas[4].split("¬");
            var listaCentroCosto = listas[5].split("¬");
            var listaEstadoConserv = listas[6].split("¬");
            var listaMarcas = listas[7].split("¬");
            var listaPais = listas[8].split("¬");
            var listaEstadoTipo = listas[9].split("¬");
            var listaProveedor = listas[10].split("¬");
            var listaTipoDoc = listas[11].split("¬");
            var listaMeses = listas[12].split("¬");

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, null, 20, false, null);

            crearCombo(listaCentroCosto, "cboCentroCostoCons", "Ninguno");
            crearCombo(listaOficina, "cboOficinaCons", "Ninguno");

            crearCombo(listaResponsable, "cboResponsable", "Seleccione");
            crearCombo(listaResponsable, "cboUsuarioFinal", "Seleccione");
            crearCombo(listaOficina, "cboOficina", "Ninguno");
            crearCombo(listaActivos, "cboActivos", "Seleccione");
            crearCombo(listaCentroCosto, "cboCentroCosto", "Seleccione");
            crearCombo(listaEstadoConserv, "cboEstadoConserv", "Seleccione");
            crearCombo(listaMarcas, "cboMarcas", "Seleccione");
            crearCombo(listaPais, "cboPaisProcedencia", "Seleccione");
            crearCombo(listaEstadoTipo, "cboEstadoTipo", "Seleccione");
            crearCombo(listaProveedor, "cboProveedor", "Seleccione");
            crearCombo(listaTipoDoc, "cboTipoDoc", "Seleccionar");
            crearCombo(listaMeses, "cboMes", "Seleccione");
        }
        else {
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
        }
    }
}

function configurarBotones() {
    var btnNuevo = document.getElementById("btnNuevo");
    if (btnNuevo != null) btnNuevo.onclick = function () {
        divPopupContainer.style.display = 'block';
        limpiarForm("Popup");

        if (vista == "InventarioInicial" || vista == "Altas") {
            limpiarForm("PopupValContable");
            limpiarForm("NoPopupValContable");

            var txtAnio = document.getElementById("txtAnio");
            if (txtAnio != null) txtAnio.value = new Date().getFullYear();

            var cboMes = document.getElementById("cboMes");
            if (cboMes != null) cboMes.value = new Date().getMonth() + 1;

            var select2cboActivos = document.getElementById("select2-cboActivos-container");
            if (select2cboActivos != null) select2cboActivos.innerHTML = "Seleccione";

            var select2cboMarcas = document.getElementById("select2-cboMarcas-container");
            if (select2cboMarcas != null) select2cboMarcas.innerHTML = "Seleccione";

            var cboEstadoConserv = document.getElementById("cboEstadoConserv");
            if (cboEstadoConserv != null) cboEstadoConserv.value = (vista == "Altas" ? 5 : 1); //NUEVO:5, BUENO:1

            var cboPaisProcedencia = document.getElementById("cboPaisProcedencia");
            if (cboPaisProcedencia != null) cboPaisProcedencia.value = 51; //PERÚ:51

            var cboEstadoTipo = document.getElementById("cboEstadoTipo");
            if (cboEstadoTipo != null) cboEstadoTipo.value = 1; //ACTIVO:1

            var optOC = document.getElementById("optOC");
            if (optOC != null) optOC.checked = (vista == "Altas" ? true : false);

            var cboTipoDoc = document.getElementById("cboTipoDoc");
            if (cboTipoDoc != null) cboTipoDoc.value = 5; //PECOSA:5

            var txtFactorAjuste = document.getElementById("txtFactorAjuste");
            if (txtFactorAjuste != null) txtFactorAjuste.value = 1; //DEFAULT: 1

            var dttFechaProceso = document.getElementById("dttFechaProceso");
            if (dttFechaProceso != null) {
                var date = new Date();
                dttFechaProceso.value = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
            };

            var txtDeprecAcumulada = document.getElementById("txtDeprecAcumulada");
            if (txtDeprecAcumulada != null) txtDeprecAcumulada.value = 0;
        }
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

    var btnConsutarEspecificacionesTecnicas = document.getElementById("btnConsutarEspecificacionesTecnicas");
    if (btnConsutarEspecificacionesTecnicas != null) btnConsutarEspecificacionesTecnicas.onclick = function () {
        mostrarEspecificacionesTecnicas("s");
    }

    var btnConsutarValoresContables = document.getElementById("btnConsutarValoresContables");
    if (btnConsutarValoresContables != null) btnConsutarValoresContables.onclick = function () {
        mostrarValoresContables("s");
    }

    var cboUbicaFisica = document.getElementById("cboUbicaFisica");
    if (cboUbicaFisica != null) cboUbicaFisica.innerHTML = "<option value>Seleccione</option>";
}

function configurarCampos() {
    if (vista == "InventarioInicial" || vista == "Altas") {
        var dttFechaAlta = document.getElementById("dttFechaAlta");
        var txtVidaUtil = document.getElementById("txtVidaUtil");
        var dttFinVidaAltaValContable = document.getElementById("dttFinVidaAltaValContable");

        if (dttFechaAlta) {
            dttFechaAlta.onchange = function () {
                var dttFechaAltaValContable = document.getElementById('dttFechaAltaValContable');
                if (dttFechaAltaValContable) dttFechaAltaValContable.value = this.value;
                if (txtVidaUtil && dttFinVidaAltaValContable) {
                    var anios = txtVidaUtil.value ? parseInt(txtVidaUtil.value) : 0;
                    calcularFechaFin(dttFinVidaAltaValContable, dttFechaAlta.value, anios);
                    calcularTazaDepreciacion(anios);
                }
            }
        }

        if (txtVidaUtil && dttFinVidaAltaValContable) {
            txtVidaUtil.onkeyup = function (event) {
                if (dttFechaAlta && dttFechaAlta.value) {
                    if (txtVidaUtil && dttFinVidaAltaValContable) {
                        var anios = txtVidaUtil.value ? parseInt(txtVidaUtil.value) : 0;
                        calcularFechaFin(dttFinVidaAltaValContable, dttFechaAlta.value, anios);
                        calcularTazaDepreciacion(anios);
                    }
                }
            }
        }

        var txtValor = document.getElementById("txtValor");
        var txtDeprecAcumulada = document.getElementById("txtDeprecAcumulada");
        var txtValorNeto = document.getElementById("txtValorNeto");
        if (txtValor && txtDeprecAcumulada && txtValorNeto) {
            txtValor.onkeyup = function (event) {
                txtValorNeto.value = CalcularValorNeto(txtValor, txtDeprecAcumulada);
            }
            txtDeprecAcumulada.onkeyup = function (event) {
                txtValorNeto.value = CalcularValorNeto(txtValor, txtDeprecAcumulada);
            }
        }

        var txtValorCompra = document.getElementById("txtValorCompra");
        if (txtValorCompra) {
            txtValorCompra.onkeyup = function (event) {
                if (txtValor) txtValor.value = txtValorCompra.value;
            }
        }
    }
}

function configurarCombos() {
    if (vista == "InventarioInicial" || vista == "Altas") {
        var cboActivos = document.getElementById("cboActivos");
        if (cboActivos != null) cboActivos.onchange = function () {
            asignarValoresActivo(this.value);
        }

        var cboOficina = document.getElementById("cboOficina");
        if (cboOficina != null) cboOficina.onchange = function () {
            listarUbicaFisica();
        }

        var cboEstadoConserv = document.getElementById("cboEstadoConserv");
        if (cboEstadoConserv != null) cboEstadoConserv.onchange = function () {
            var txtEstadoConservacion = document.getElementById("txtEstadoConservacion");
            if (txtEstadoConservacion != null)
                txtEstadoConservacion.value = cboEstadoConserv.value
                    ? cboEstadoConserv.options[cboEstadoConserv.value].innerText
                    : '';
        }
    }
}

function seleccionarBoton(idGrilla, idRegistro, idBoton) {
    limpiarForm('Popup')

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
    else if (idGrilla == "divListaActivo") {
        if (idBoton == "Editar") {
            let tituloModal = document.getElementById("tituloModal");
            if (tituloModal != null) {
                tituloModal.innerText = "Actualizar Registro";
            }
            editarRegistroActivo(idRegistro);
        }
        if (idBoton == "Eliminar") {
            eliminarRegistroActivo(idRegistro)
        }
    }
}

function editarRegistroActivo(id) {
    Http.get("General/obtenerTabla/?tbl=" + controller + vista + 'Activos&id=' + id, mostrarRegistro);
}

function editarRegistro(id) {
    Http.get("General/obtenerTabla/?tbl=" + controller + vista + '&id=' + id, mostrarRegistro);
}

function mostrarRegistro(rpta) {
    if (rpta) {
        var campos = rpta.split("|");
        if (vista == "UbicaFisica") {
            document.getElementById("divPopupContainer").style.display = 'block';
            txtIdRegistro.value = campos[0];
            cboOficina.value = campos[1];
            txtNombre.value = campos[2];
            cboResponsable.value = campos[3];
            cboEstado.value = campos[4];
        }
        if (vista == "InventarioInicial" || vista == "Altas") {
            txtIdRegistro.value = campos[0];
            txtCodigoPatrimonio.value = campos[1];
            txtItem.value = campos[2];
            cboActivos.value = campos[3];
            seleccionarControlSelect2(cboActivos);
            txtDescripcion.value = campos[4];
            cboCentroCosto.value = campos[5];
            cboOficina.value = campos[6];
            listarUbicaFisica();
            cboUbicaFisica.value = campos[7];
            cboResponsable.value = campos[8];
            cboUsuarioFinal.value = campos[9];
            txtNroSerie.value = campos[10];
            cboEstadoConserv.value = campos[11];
            cboMarcas.value = campos[12];
            seleccionarControlSelect2(cboMarcas);
            txtModelo.value = campos[13];
            txtMedida.value = campos[14];
            ttaCaracteristica.value = campos[15];
            ttaObservacion.value = campos[16];
            cboPaisProcedencia.value = campos[17];
            cboEstadoTipo.value = campos[18];
            chkEsSBN.checked = campos[19] == "S" ? true : false;
            chkEsActivoDepreciable.checked = campos[20] == "1" ? true : false;
            chkEsVerificacionFisica.checked = campos[21] == "1" ? true : false;

            optOC.checked = campos[22] == "2" ? true : false;
            optNEA.checked = campos[22] == "1" ? true : false;
            txtNumeroIngresoBien.value = campos[22] == "2" ? campos[23] : campos[26];
            var dFechaIngresoBien = campos[22] == "2" ? campos[24].split("/") : campos[27].split("/");
            dttFechaIngresoBien.value = dFechaIngresoBien.length == 3 ? dFechaIngresoBien[2] + "-" + dFechaIngresoBien[1] + "-" + dFechaIngresoBien[0] : '';
            txtValorCompra.value = campos[22] == "2" ? campos[25] : campos[28];

            cboProveedor.value = campos[29];
            chkEsGarantia.checked = campos[30] == "1" ? true : false;
            var dFechaGarantia = campos[31].split("/");
            dttFechaGarantia.value = dFechaGarantia.length == 3 ? dFechaGarantia[2] + "-" + dFechaGarantia[1] + "-" + dFechaGarantia[0] : '';
            txtNroContrato.value = campos[32];
            cboTipoDoc.value = campos[33];
            txtNumeroDoc.value = campos[34];
            var dFechaAlta = campos[35].split("/");
            dttFechaAlta.value = dFechaAlta.length == 3 ? dFechaAlta[2] + "-" + dFechaAlta[1] + "-" + dFechaAlta[0] : '';
            txtCtaContable.value = campos[36];

            txtTbCodigo.value = campos[37];
            txtGruCodigo.value = campos[38];
            txtClaCodigo.value = campos[39];
            txtFamCodigo.value = campos[40];
            txtInvCodigo.value = campos[41];

            txtVidaUtil.value = campos[42];
            dttFechaAltaValContable.value = dttFechaAlta.value;
            var dFinVidaValContable = campos[43].split("/");
            dttFinVidaAltaValContable.value = dFinVidaValContable.length == 3 ? dFinVidaValContable[2] + "-" + dFinVidaValContable[1] + "-" + dFinVidaValContable[0] : '';
            txtAnio.value = campos[44];
            cboMes.value = campos[45];
            txtDepreciacion.value = campos[46];
            txtEstadoConservacion.value = cboEstadoConserv.options[cboEstadoConserv.selectedIndex]?.text;
            txtFactorAjuste.value = campos[47];
            var dFechaProceso = campos[48].split("/");
            dttFechaProceso.value = dFechaProceso.length == 3 ? dFechaProceso[2] + "-" + dFechaProceso[1] + "-" + dFechaProceso[0] : '';
            txtValor.value = campos[49];
            txtDeprecAcumulada.value = campos[50];
            txtValorNeto.value = (txtValor.value || txtDeprecAcumulada.value) ? txtValor.value - txtDeprecAcumulada.value : '';

            document.getElementById("divPopupContainer").style.display = 'block';
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
                        control.value = campos[j];
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
    else {
        mostrarMensaje('No se encontró información', 'error');
    }
}

function eliminarRegistroActivo(id) {
    var data = "";
    data = id;

    var frm = new FormData();
    frm.append("data", data);

    Swal.fire({
        title: '¿Desea anular el registro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.value) {
            Http.post("General/eliminar/?tbl=" + controller + vista + "Activos", mostrarEliminar, frm);
        }
    })
}

function eliminarRegistro(id) {
    var data = "";
    data = id;

    var frm = new FormData();
    frm.append("data", data);

    Swal.fire({
        title: '¿Desea anular el registro?',
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

        if (vista == "InventarioInicial" || vista == "Altas") {
            var divListaActivo = document.getElementById("divListaActivo");
            if (divListaActivo) divListaActivo.innerHTML = '';
            getListar();
        }
        else {
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
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

    if ((vista == "InventarioInicial" || vista == "Altas") && prefijo != "divListaActivo") {
        var periodoCons = txtPeriodoCons.value;
        var data = periodoCons + '-' + idRegistro;

        Http.get("General/listarTabla?tbl=" + controller + vista + "Activos&data=" + data, mostrarlistasActivos);
    }
}

function mostrarlistasActivos(rpta) {
    if (rpta) {
        var listas = rpta.split("¯");
        var lista = listas[0].split("¬");
        grillaItem = new GrillaScroll(lista, "divListaActivo", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
    }
}

function grabarDatos() {
    var data = "";
    var frm = new FormData();
    data = obtenerDatosGrabar("Popup");

    if (vista == "InventarioInicial" || vista == "Altas") {
        var valoresContables = "";
        valoresContables = obtenerDatosGrabar("PopupValContable");

        var dataSplit = data.split("|");

        var valorTipoIngresoBien = optOC.checked ? 2 : (optNEA.checked ? 1 : 0);
        dataSplit[22] = valorTipoIngresoBien;
        dataSplit.splice(23, 1);
        data = dataSplit.join('|');

        var flagInicial = (vista == "InventarioInicial") ? 1 : 0;

        data += '|' + flagInicial;
        data += '|' + valoresContables;

        frm.append("data", data);
    }
    else {
        frm.append("data", data);
    }
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
                        if (vista == "InventarioInicial" || vista == "Altas") {
                            data += control.value;
                        }
                        else {
                            var dFecha = control.value.split("-");
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

function mostrarEspecificacionesTecnicas(rpta) {
    if (rpta) {
        //spnLoad.style.display = 'none';
        divPopupContainerForm1.style.display = 'block';
    }
}

function mostrarValoresContables(rpta) {
    if (rpta) {
        //spnLoad.style.display = 'none';
        divPopupContainerForm2.style.display = 'block';
    }
}

function asignarValoresActivo(idItem) {
    var activo = obtenerActivoSeleccionado(idItem);
    if (activo) {
        var txtDescripcion = document.getElementById('txtDescripcion');
        if (txtDescripcion) txtDescripcion.value = activo[1];

        var esCheckSBN = activo[2] == 'S' ? true : false;
        var tbCodigo = activo[3];
        var grupoCodigo = activo[4];
        var claseCodigo = activo[5];
        var familiaCodigo = activo[6];
        var inventarioCodigo = activo[7];
        var codigoItem = grupoCodigo + claseCodigo + familiaCodigo + inventarioCodigo;

        var chkEsSBN = document.getElementById('chkEsSBN');
        if (chkEsSBN) chkEsSBN.checked = esCheckSBN;

        var txtItem = document.getElementById('txtItem');
        if (txtItem) txtItem.value = codigoItem;

        var txtTbCodigo = document.getElementById('txtTbCodigo');
        if (txtTbCodigo) txtTbCodigo.value = tbCodigo;

        var txtGruCodigo = document.getElementById('txtGruCodigo');
        if (txtGruCodigo) txtGruCodigo.value = grupoCodigo;

        var txtClaCodigo = document.getElementById('txtClaCodigo');
        if (txtClaCodigo) txtClaCodigo.value = claseCodigo;

        var txtFamCodigo = document.getElementById('txtFamCodigo');
        if (txtFamCodigo) txtFamCodigo.value = familiaCodigo;

        var txtInvCodigo = document.getElementById('txtInvCodigo');
        if (txtInvCodigo) txtInvCodigo.value = inventarioCodigo;
    }
}

function obtenerActivoSeleccionado(idItem) {
    var activo;

    for (var i = 0; i < listaActivos_v.length; i++) {
        activo = listaActivos_v[i].split('|');
        if (activo[0] == idItem) {
            return activo;
        }
    }
}

function listarUbicaFisica() {
    var cboOficina = document.getElementById("cboOficina");
    var idOficina = cboOficina.value;
    var nRegistros = listaUbicaFisica_v.length;
    var contenido = "<option value=''>Seleccione</option>";
    var campos, idCodigo, nombre, idxOficina;
    for (var i = 0; i < nRegistros; i++) {
        campos = listaUbicaFisica_v[i].split('|');
        idCodigo = campos[0];
        nombre = campos[1];
        idxOficina = campos[2];
        if (idxOficina == idOficina) {
            contenido += "<option value='";
            contenido += idCodigo;
            contenido += "'>";
            contenido += nombre;
            contenido += "</option>";
        }
    }
    var cbo = document.getElementById("cboUbicaFisica");
    if (cbo != null) {
        cbo.innerHTML = contenido;
    }
}

function calcularFechaFin(control, fechaAlta, anios) {
    var dFecha = fechaAlta.split("-");
    var dateFin = new Date(dFecha[0] + "/" + dFecha[1] + "/" + dFecha[2]);
    dateFin.setFullYear(dateFin.getFullYear() + anios);

    var dFechaCalculada = dateFin.toLocaleDateString().split("/");

    var dia = dFechaCalculada[0].padStart("2", "0");
    var mes = dFechaCalculada[1].padStart("2", "0");
    var anio = dFechaCalculada[2];

    control.value = (anio + "-" + mes + "-" + dia);
}


function calcularTazaDepreciacion(anios) {
    var txtDepreciacion = document.getElementById("txtDepreciacion");
    if (txtDepreciacion) txtDepreciacion.value = (100 / anios).toFixed(2);
}

function CalcularValorNeto(txtValor, txtDeprecAcumulada) {
    var valor = txtValor.value ? parseFloat(txtValor.value) : 0;
    var deprec = txtDeprecAcumulada.value ? parseFloat(txtDeprecAcumulada.value) : 0;

    return valor - deprec;
}

function seleccionarControlSelect2(control) {
    var controlSelect = 'select2-' + control.id + '-container';
    var cboControlSelect = document.getElementById(controlSelect);
    if (cboControlSelect != null) {
        var selected = control.options[control.selectedIndex].text;
        cboControlSelect.innerHTML = selected;
    }
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

        if (vista == "InventarioInicial" || vista == "Altas") {
            var divListaActivo = document.getElementById("divListaActivo");
            if (divListaActivo) divListaActivo.innerHTML = '';
            getListar();
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