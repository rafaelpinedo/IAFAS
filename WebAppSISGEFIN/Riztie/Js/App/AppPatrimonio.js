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
var listaCuentaContables_v = [];
var FLAG_INICIAL_INVENTARIO_INICIAL = 1;
var FLAG_INICIAL_ALTAS = 0;
var dataImport = "";
var dataDeta = "";
var anioFiscal = "";
var periodo = "";
var tabGeneral = "";
var EST_APROBADO = 2;
var esOrdenAprobado = false;

var idTabActivo = 'tabAltas';
var TIPO_ALTAS = 1;
var TIPO_BAJAS = 2;

window.onload = function () {
    getConfigMn();
    vista = window.sessionStorage.getItem("Vista");
    controller = window.sessionStorage.getItem("Controller");
    mostrarLoading("divLista");
    getListar();
    getIniciarConfiguracion();
    configurarBotones();
    configurarCombos();
    configurarCampos();
    configurarTabs();
}

var botonInventarioGeneral = [
    { "cabecera": "Editar", "clase": "fa fa-search btn btn-info btnCirculo", "id": "Editar" },
];

var botonTiposPatrimonio = [
    { "cabecera": "Editar", "clase": "fa fa-search btn btn-info btnCirculo", "id": "Editar" },
];

function getIniciarConfiguracion() {
    var data = ""
    if (vista == "Bajas" || vista == "General") {
        Http.get("General/listarTabla?tbl=" + controller + vista + "Configuracion&data=" + data, configurarValores);
        var controlesPopup = document.getElementsByClassName("Popup");
        var controlesPopupValContable = document.getElementsByClassName("PopupValContable");
        var controlesPopupEspTecnica = document.getElementsByClassName("PopupEspTecnica");

        desahabilitarControles(controlesPopup);
        desahabilitarControles(controlesPopupValContable);
        desahabilitarControles(controlesPopupEspTecnica);
    }
}

function getListar() {
    var data = "";

    if (vista == "InventarioInicial") {
        var anioConsulta = document.getElementById('txtPeriodoCons')?.value;
        data = FLAG_INICIAL_INVENTARIO_INICIAL + '|' + anioConsulta;
    }
    if (vista == "Altas") {
        var anioConsulta = document.getElementById('txtPeriodoCons')?.value;
        data = anioConsulta;
    }
    if (vista == "Bajas") {
        var anioConsulta = document.getElementById('txtPeriodoCons')?.value;
        data = anioConsulta;
    }
    if (vista == "General") {
        var anioConsulta = document.getElementById('txtPeriodoCons')?.value;
        var idTab = (idTabActivo == "tabAltas" ? TIPO_ALTAS : TIPO_BAJAS);
        data = idTab + '|' + anioConsulta;
    }


    if (vista == "Altas") {
        Http.get("General/listarTabla?tbl=" + controller + vista + "Mov&data=" + data, mostrarlistas);
    }
    else {
        Http.get("General/listarTabla?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
    }
}

function getListarMovActivos(data) {
    if (vista == "Altas") {
        Http.get("General/listarTabla?tbl=" + controller + vista + "ActivosMov&data=" + data, mostrarlistasActivos);
    }
    else if (vista == "Bajas") {
        Http.get("General/listarTabla?tbl=" + controller + vista + "Activos&data=" + data, adicionarLista);
    }
}

function configurarValores(rpta) {
    if (rpta) {
        var listas = rpta.split("¯");
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
        else if (vista == "InventarioInicial" || vista == "Altas") {
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

            listaCuentaContables_v = listas[13].split("¬");

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

            if (vista == "Altas") {
                var listaTipoDoc = listas[13].split("¬");
                var listaTipoMov = listas[14].split("¬");
                var listaEstadoMov = listas[15].split("¬");

                anioFiscal = listas[16].split("|")[0];
                periodo = listas[16].split("|")[1];

                crearCombo(listaMeses, "cboMesesCab", "Seleccione");
                crearCombo(listaTipoDoc, "cboTipoDocCab", "Seleccione");
                crearCombo(listaTipoMov, "cboTipoMovCab", "Seleccione");
                crearCombo(listaTipoMov, "cboCausalAltaCab", "Seleccione");
                crearCombo(listaEstadoMov, "cboEstadoCab", "Seleccione");
                grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 20, false, null);
            }
            else {
                grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, null, 20, false, null);

            }
        }
        else if (vista == "Bajas") {
            anioFiscal = listas[1].split("|")[0];
            periodo = listas[1].split("|")[1];

            var listaMeses = listas[2].split("¬");
            var listaTipoMov = listas[3].split("¬");
            var listaCausalBajas = listas[4].split("¬");
            var listaEstadoMov = listas[5].split("¬");

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);

            crearCombo(listaMeses, "cboMesesCab", "Seleccione");
            crearCombo(listaTipoMov, "cboTipoMovCab", "Seleccione");
            crearCombo(listaCausalBajas, "cboCausalBaja", "Seleccione");
            crearCombo(listaEstadoMov, "cboEstadoCab", "Seleccione");
        }
        else if (vista == "General") {
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botonInventarioGeneral, 38, false, null);
        }
        else if (vista == "TiposPatrimonio") {
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, null, 38, false, null);
        }
        else if (vista == "TasaUIT") {
            var tituloTasa = listas[0].split("¬");
            var tituloValorUnidad = listas[1].split("¬");

            var listaTasa = listas[2].split("¬");
            var listaValorUnidad = listas[3].split("¬");

            var lblTituloTasa = document.getElementById("lblTituloTasa");
            if (lblTituloTasa != null) lblTituloTasa.innerText = tituloTasa;

            var lblTituloValorUnidad = document.getElementById("lblTituloValorUnidad");
            if (lblTituloValorUnidad != null) lblTituloValorUnidad.innerText = tituloValorUnidad;

            grillaItem = new GrillaScroll(listaTasa, "divListaTasa", 100, 6, vista, controller, null, null, true, null, 38, false, null);
            grillaItem = new GrillaScroll(listaValorUnidad, "divListaValorUnidad", 100, 6, vista, controller, null, null, true, null, 38, false, null);
        }
        else {
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
        }
    }
}
function configurarTabs() {

    var tabAltas = document.getElementById("tabAltas");
    if (tabAltas != null) tabAltas.onclick = function () {
        document.getElementById("divLista").innerHTML = "";

        idTabActivo = "tabAltas";
        getListar();
    }

    var tabBajas = document.getElementById("tabBajas");
    if (tabBajas != null) tabBajas.onclick = function () {
        document.getElementById("divLista").innerHTML = "";

        idTabActivo = "tabBajas";
        getListar();
    }
}

function configurarBotones() {
    var btnCargarArchivo = document.getElementById("btnCargarArchivo");
    if (btnCargarArchivo != null) btnCargarArchivo.onclick = function () {
        divPopupContainerForm3.style.display = 'block';
        limpiarImportacionExcel();
        spanPendiente.innerHTML = "";
    }

    var btnDescagarArchivo = document.getElementById("btnDescagarArchivo");
    if (btnDescagarArchivo != null) btnDescagarArchivo.onclick = function () {
        const link = document.createElement('a');
        link.href = '/templates/Patrimonio/Template_InventarioInicial.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    var btnCargarCXC = document.getElementById("btnCargarCXC");
    if (btnCargarCXC != null) btnCargarCXC.onclick = function () {
        divPopupContainerForm4.style.display = 'block';
        fupExcel.value = "";
        snpnombrearchivo.innerHTML = "Seleccione archivo&hellip;";
        btnImportarExcel.disabled = false;
        btnImportarExcel.style.display = 'block';
        btnImportarExcel.innerHTML = "<i class='fa fa-upload' aria-hidden='true'></i>&nbsp;Importar";
    }

    var btnImportarExcel = document.getElementById("btnImportarExcel");
    if (btnImportarExcel != null) btnImportarExcel.onclick = function () {
        vista = window.sessionStorage.getItem("Vista");

        importarExcel("divPopupContainerForm4", "divListaExcel", dataDeta);
    }

    var btnGuardarListaExcel = document.getElementById("btnGuardarListaExcel");
    if (btnGuardarListaExcel != null) btnGuardarListaExcel.onclick = function () {
        if (!fupExcel.value) {
            mostrarMensaje("Seleccione el archivo excel a importar", "error");
            return;
        }
        grabarDatosExcel();
    }

    var btnLimpiar = document.getElementById("btnLimpiar");
    if (btnLimpiar != null) btnLimpiar.onclick = function () {
        limpiarImportacionExcel();
    }

    var btnNuevoMov = document.getElementById("btnNuevoMov");
    if (btnNuevoMov != null) btnNuevoMov.onclick = function () {
        divPopupContainerMov.style.display = 'block'

        limpiarForm("PopupMov");
        limpiarForm("NoPopupMov");

        if (vista == "Altas") {
            document.getElementById("detalleActivo").style.display = 'none';

            var txtAnioCab = document.getElementById("txtAnioCab");
            if (txtAnioCab != null) txtAnioCab.value = anioFiscal;

            var cboMesesCab = document.getElementById("cboMesesCab");
            if (cboMesesCab != null) cboMesesCab.value = periodo;

            var cboEstadoCab = document.getElementById("cboEstadoCab");
            if (cboEstadoCab != null) cboEstadoCab.value = 1; // 1: PENDIENTE, 2:APROBADO

            var cboCausalAltaCab = document.getElementById("cboCausalAltaCab");
            if (cboCausalAltaCab != null) cboCausalAltaCab.value = 1; // 1: COMPRAS

            var dttFechaMovCab = document.getElementById("dttFechaMovCab");
            if (dttFechaMovCab != null) dttFechaMovCab.value = obtenerFechaActualYYYMMDD();
        }
        if (vista == "Bajas") {
            document.querySelectorAll('.section-nuevo-activo').forEach(function (el) {
                el.style.display = 'block';
            });

            tbDetalleActivos.innerHTML = "";
            spnNroItems.innerHTML = "Items: 0";
            txtPeriodoItemsCons.value = new Date().getFullYear();

            var txtAnioCab = document.getElementById("txtAnioCab");
            if (txtAnioCab != null) txtAnioCab.value = anioFiscal;

            var cboMesesCab = document.getElementById("cboMesesCab");
            if (cboMesesCab != null) cboMesesCab.value = periodo;

            var cboTipoMovCab = document.getElementById("cboTipoMovCab");
            if (cboTipoMovCab != null) cboTipoMovCab.value = 2; //2: BAJA

            var cboEstadoCab = document.getElementById("cboEstadoCab");
            if (cboEstadoCab != null) cboEstadoCab.value = 1; // 1: PENDIENTE, 2:APROBADO

            var dttFechaMovCab = document.getElementById("dttFechaMovCab");
            if (dttFechaMovCab != null) dttFechaMovCab.value = obtenerFechaActualYYYMMDD();

            var dttFechaResolucion = document.getElementById("dttFechaResolucion");
            if (dttFechaResolucion != null) dttFechaResolucion.value = obtenerFechaActualYYYMMDD();

            btnGuardarBajas.innerHTML = "<i class='fa fa-save'></i> Grabar";
            btnGuardarBajas.disabled = false;
        }

    }

    var btnNuevo = document.getElementById("btnNuevo");
    if (btnNuevo != null) btnNuevo.onclick = function () {
        divPopupContainer.style.display = 'block';
        limpiarForm("Popup");
        limpiarForm("NoPopup");

        if (vista == "InventarioInicial" || vista == "Altas") {
            limpiarForm("PopupValContable");
            limpiarForm("NoPopupValContable");
            limpiarForm("PopupEspTecnica");
            limpiarForm("NoPopupEspTecnica");

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
                dttFechaProceso.value = obtenerFechaActualYYYMMDD();
            };

            var txtDeprecAcumulada = document.getElementById("txtDeprecAcumulada");
            if (txtDeprecAcumulada != null) txtDeprecAcumulada.value = 0;

            var txtEstadoConservacion = document.getElementById("txtEstadoConservacion");
            if (txtEstadoConservacion != null) txtEstadoConservacion.value = cboEstadoConserv.options[cboEstadoConserv.selectedIndex].innerText
        }
    }

    var btnGuardarBajas = document.getElementById("btnGuardarBajas");
    if (btnGuardarBajas != null) btnGuardarBajas.onclick = function () {

        if (esBajasValido()) {
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
                    grabarBajas();

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


    var btnGuardarMov = document.getElementById("btnGuardarMov");
    if (btnGuardarMov != null) btnGuardarMov.onclick = function () {
        var validar = false;

        if (validarInformacion("RequeMov") == true) {
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
                    grabarDatosMov();

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

    var btnCancelarMov = document.getElementById("btnCancelarMov");
    if (btnCancelarMov != null) btnCancelarMov.onclick = function () {
        divPopupContainerMov.style.display = 'none';
    }

    var btnCancelar = document.getElementById("btnCancelar");
    if (btnCancelar != null) btnCancelar.onclick = function () {
        divPopupContainer.style.display = 'none';
    }

    var btnCancelarListadoItemsForm = document.getElementById("btnCancelarListadoItemsForm");
    if (btnCancelarListadoItemsForm != null) btnCancelarListadoItemsForm.onclick = function () {
        divPopupContainerListadoItemsForm.style.display = 'none';
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

    var btnCancelarForm4 = document.getElementById("btnCancelarForm4");
    if (btnCancelarForm4 != null) btnCancelarForm4.onclick = function () {
        divPopupContainerForm4.style.display = 'none';
    }

    var btnConsutarEspecificacionesTecnicas = document.getElementById("btnConsutarEspecificacionesTecnicas");
    if (btnConsutarEspecificacionesTecnicas != null) btnConsutarEspecificacionesTecnicas.onclick = function () {
        mostrarEspecificacionesTecnicas("s");
    }

    var btnConsutarValoresContables = document.getElementById("btnConsutarValoresContables");
    if (btnConsutarValoresContables != null) btnConsutarValoresContables.onclick = function () {
        mostrarValoresContables("s");
    }

    var btnConsultar = document.getElementById("btnConsultar");
    if (btnConsultar != null) btnConsultar.onclick = function () {
        var anioConsulta = document.getElementById('txtPeriodoCons');

        if (!anioConsulta || !anioConsulta.value) {
            mostrarMensaje('Especifique el año del periodo', 'error');
            return;
        }

        limpiarListaActivos();
        getListar();
    }

    var cboUbicaFisica = document.getElementById("cboUbicaFisica");
    if (cboUbicaFisica != null) cboUbicaFisica.innerHTML = "<option value>Seleccione</option>";

    var btnConsutarItems = document.getElementById("btnConsutarItems");
    if (btnConsutarItems != null) btnConsutarItems.onclick = function () {
        var anioConsulta = document.getElementById('txtPeriodoItemsCons')?.value;
        if (anioConsulta) {
            var data = anioConsulta;
            Http.get("General/listarTabla?tbl=" + controller + vista + "Items&data=" + data, mostrarListadoItems);
            //    spnLoad.style.display = 'inline';
        }
        else {
            mostrarMensaje("Seleccione el periodo", "error")
            txtPeriodoItemsCons.focus();
        }
    }

    var btnSeleccionarItems = document.getElementById("btnSeleccionarItems");
    if (btnSeleccionarItems != null) btnSeleccionarItems.onclick = function () {
        var ids = grillaItems.obtenerIdsChecks();

        if (ids.length == 0) {
            mostrarMensaje("No hay items seleccionados", "error");
            return;
        }

        var data = "";

        for (var i = 0; i < ids.length; i++) {
            fila = grillaItems.obtenerFilaCheckPorId(ids[i]);
            if (fila.length > 0) {
                id = fila[0];
                codigo = fila[1];
                descripcion = fila[2];
                marca = fila[3];
                modelo = fila[4];
                serie = fila[5];
                usuarioFinal = fila[6];
                fechaCompra = fila[7];
                valorCompra = fila[8];
                fechaAlta = fila[9];
                valorInicial = fila[10];
                conservacion = fila[11];
                data += (id + "|" + codigo + "|" + descripcion + "|" + marca + "|" + modelo + "|" + serie + "|" + usuarioFinal +
                    "|" + fechaCompra + "|" + valorCompra + "|" + fechaAlta + "|" + valorInicial + "|" + conservacion);

                if (i < ids.length - 1) data += "¬";
            }
        }
        obtenerItems(data);
    }
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
                    var anios = txtVidaUtil.value ? parseFloat(txtVidaUtil.value).toFixed(2) : 0;
                    calcularFechaFin(dttFinVidaAltaValContable, dttFechaAlta.value, parseInt(anios));
                    calcularTazaDepreciacion(anios);
                }
            }
        }

        if (txtVidaUtil && dttFinVidaAltaValContable) {
            txtVidaUtil.onkeyup = function (event) {
                if (dttFechaAlta && dttFechaAlta.value) {
                    if (txtVidaUtil && dttFinVidaAltaValContable) {
                        var anios = txtVidaUtil.value ? parseFloat(txtVidaUtil.value).toFixed(2) : 0;
                        calcularFechaFin(dttFinVidaAltaValContable, dttFechaAlta.value, parseInt(anios));
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
    if (vista == "InventarioInicial" || vista == "Altas" || vista == "General") {
        //var cboActivos = document.getElementById("cboActivos");
        //if (cboActivos != null) cboActivos.onchange = function () {
        //    asignarValoresActivo(this.value);
        //}

        var cboOficina = document.getElementById("cboOficina");
        if (cboOficina != null) cboOficina.onchange = function () {
            listarUbicaFisica();
        }

        var cboActivos = document.getElementById("cboActivos");
        if (cboActivos != null) cboActivos.onchange = function () {
            asignarValoresActivo(this.value);
            asignarCuentaContable(this.value);

            txtDescripcion.value = cboActivos.value
                ? cboActivos.options[cboActivos.selectedIndex].innerText
                : '';

            txtDescripcionMargesi.value = cboActivos.value
                ? cboActivos.options[cboActivos.selectedIndex].innerText
                : '';
        }

        var cboEstadoConserv = document.getElementById("cboEstadoConserv");
        if (cboEstadoConserv != null) cboEstadoConserv.onchange = function () {
            var txtEstadoConservacion = document.getElementById("txtEstadoConservacion");
            if (txtEstadoConservacion != null)
                txtEstadoConservacion.value = cboEstadoConserv.value
                    ? cboEstadoConserv.options[cboEstadoConserv.selectedIndex].innerText
                    : '';
        }
    }
}

function seleccionarBoton(idGrilla, idRegistro, idBoton) {
    limpiarForm('Popup')
    limpiarForm("PopupMov");

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
    Http.get("General/obtenerTabla/?tbl=" + controller + vista + 'Activos&id=' + id, mostrarRegistroActivo);
}

function editarRegistro(id) {
    if (vista == "Altas") {
        Http.get("General/obtenerTabla/?tbl=" + controller + vista + 'Mov&id=' + id, mostrarRegistroMov);
    }
    else {
        Http.get("General/obtenerTabla/?tbl=" + controller + vista + '&id=' + id, mostrarRegistro);
    }
}

function mostrarRegistroMov(rpta) {
    if (rpta) {
        var campos = rpta.split("|");
        if (vista == "Altas") {
            txtNroMovCab.value = campos[0];
            txtAnioCab.value = campos[1];
            cboMesesCab.value = campos[2];
            dttFechaMovCab.value = formatearFechaYYYMMDD(campos[3]);
            ttaObservacionCab.value = campos[4];
            cboEstadoCab.value = campos[5];
            cboTipoMovCab.value = campos[6];
            cboCausalAltaCab.value = campos[7];
            cboTipoDocCab.value = campos[8];
            txtNroOrdenCab.value = campos[9];

            document.getElementById("divPopupContainerMov").style.display = 'block';
            getListarMovActivos(campos[0]);

            actualizarBotones(campos[5])
        }
    }
    else {
        mostrarMensaje('No se encontró información', 'error');
    }
}
function mostrarRegistroActivo(rpta, container) {
    if (rpta) {
        var campos = rpta.split("|");
        document.getElementById(container ? container : "divPopupContainer").style.display = 'block';

        txtIdRegistro.value = campos[0];
        txtCodigoPatrimonio.value = campos[1];
        txtCodigoMargesi.value = campos[1];
        txtItem.value = campos[2];
        cboActivos.value = campos[3];
        txtDescripcionMargesi.value = cboActivos.options[cboActivos.selectedIndex]?.text;
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

        setCuentaContable(campos[36]);

        txtTbCodigo.value = campos[37];
        txtGruCodigo.value = campos[38];
        txtClaCodigo.value = campos[39];
        txtFamCodigo.value = campos[40];
        txtInvCodigo.value = campos[41];

        ttaObservacionMargesi.value = campos[42];

        txtVidaUtil.value = campos[43];
        dttFechaAltaValContable.value = dttFechaAlta.value;
        var dFinVidaValContable = campos[44].split("/");
        dttFinVidaAltaValContable.value = dFinVidaValContable.length == 3 ? dFinVidaValContable[2] + "-" + dFinVidaValContable[1] + "-" + dFinVidaValContable[0] : '';
        txtAnio.value = campos[45];
        cboMes.value = campos[46];
        txtDepreciacion.value = campos[47];
        txtEstadoConservacion.value = cboEstadoConserv.options[cboEstadoConserv.selectedIndex]?.text;
        txtFactorAjuste.value = campos[48];
        var dFechaProceso = campos[49].split("/");
        dttFechaProceso.value = dFechaProceso.length == 3 ? dFechaProceso[2] + "-" + dFechaProceso[1] + "-" + dFechaProceso[0] : '';
        txtValor.value = campos[50];
        txtDeprecAcumulada.value = campos[51];
        txtValorNeto.value = (txtValor.value || txtDeprecAcumulada.value) ? txtValor.value - txtDeprecAcumulada.value : '';

    }
    else {
        mostrarMensaje('No se encontró información', 'error');
    }
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
        else if (vista == "General") {
            mostrarRegistroActivo(rpta);
        }
        else if (vista == "Bajas") {
            document.getElementById("divPopupContainerMov").style.display = 'block';

            txtNroMovCab.value = campos[0];
            txtAnioCab.value = campos[1];
            cboMesesCab.value = campos[2];
            dttFechaMovCab.value = formatearFechaYYYMMDD(campos[3]);
            txtNroResolucion.value = campos[4];
            dttFechaResolucion.value = formatearFechaYYYMMDD(campos[5]);
            ttaObservacionCab.value = campos[6];
            cboEstadoCab.value = campos[7];
            cboTipoMovCab.value = campos[8];
            cboCausalBaja.value = campos[9];

            getListarMovActivos(campos[0]);
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

    if (vista == 'Altas') {
        var codigoMov = txtNroMovCab.value;
        data += "|" + codigoMov;
    }

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
            if (vista == 'Altas') {
                Http.post("General/eliminar/?tbl=" + controller + vista + "ActivosMov", mostrarEliminar, frm);
            }
            else {
                Http.post("General/eliminar/?tbl=" + controller + vista + "Activos", mostrarEliminar, frm);
            }
        }
    })
}

function eliminarRegistro(id) {
    var data = "";
    data = id;

    var frm = new FormData();

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
            if (vista == "InventarioInicial" || vista == "Altas" || vista == "Bajas") {
                var filtroAnio = txtPeriodoCons.value;
                data += "|" + filtroAnio;
                frm.append("data", data);
                Http.post("General/eliminar/?tbl=" + controller + vista, mostrarEliminar, frm);
            }
            else {
                frm.append("data", data);
                Http.post("General/eliminar/?tbl=" + controller + vista, mostrarEliminar, frm);
            }
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

        if (vista == "InventarioInicial" /*|| vista == "Altas"*/) {
            limpiarListaActivos();
            getListar();
        }
        else if (vista == 'Altas') {
            grillaItem = new GrillaScroll(lista, "divListaActivo", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
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

    if ((vista == "InventarioInicial") && prefijo != "divListaActivo") {
        var periodoCons = txtPeriodoCons.value;
        var flagInicial = vista == "InventarioInicial" ? FLAG_INICIAL_INVENTARIO_INICIAL : FLAG_INICIAL_ALTAS;
        var data = periodoCons + '-' + idRegistro + '-' + flagInicial;

        Http.get("General/listarTabla?tbl=" + controller + vista + "Activos&data=" + data, mostrarlistasActivos);
    }
    if ((vista == "TiposPatrimonio") && prefijo != "divListaActivo") {
        var data = idRegistro;

        Http.get("General/listarTabla?tbl=" + controller + vista + "SubTipos&data=" + data, mostrarlistaSubTipos);
    }
}

function mostrarlistaSubTipos(rpta) {
    if (rpta) {
        var listas = rpta.split("¯");
        var lista = listas[0].split("¬");
        grillaItem = new GrillaScroll(lista, "divListaActivo", 100, 6, vista, controller, null, null, true, null, 38, false, null);
    }
}

function mostrarlistasActivos(rpta) {
    var divLista = 'divListaActivo'
    if (vista == "Altas") {
        document.getElementById("detalleActivo").style.display = 'block';
        var divLista = 'divListaActivo'
    }

    if (vista == "Bajas") {
        divLista = 'tbDetalleActivos'
    }
    if (rpta) {
        var listas = rpta.split("¯");
        var lista = listas[0].split("¬");
        grillaItem = new GrillaScroll(lista, divLista, 100, 6, vista, controller, null, null, true, botones, 38, false, null);
    }
}

function mostrarListadoItems(rpta) {
    if (rpta) {
        //spnLoad.style.display = 'none';
        divPopupContainerListadoItemsForm.style.display = 'block';

        var listas = rpta.split('¯');
        lista = listas[0].split("¬");
        grillaItems = new GrillaScroll(lista, "listaItem", 1000, 6, "listaItems", "Admon", null, null, null, null, 25, false, true);
        //    configurarCheckBoxs();
    }
}

function grabarDatosExcel() {
    var data = "";
    var frm = new FormData();

    var txtPeriodoCons = document.getElementById("txtPeriodoCons");
    if (txtAnio != null) {
        data = dataImport + "¯" + txtPeriodoCons.value;
    }

    frm.append("data", data);
    Http.post("General/guardar/?tbl=" + controller + vista + "Importar", mostrarGrabar, frm);

    divPopupContainerForm3.style.display = 'none';
    limpiarImportacionExcel();
}

function limpiarImportacionExcel() {
    divListaExcel.innerHTML = '';
    dataImport = '';
    fupExcel.value = '';
    btnGuardarListaExcel.disabled = false;
}

function grabarBajas() {
    var data = "";
    data = obtenerDatosGrabar("PopupMov");

    data += "|";

    data += "¯";
    var nfilas = tbDetalleActivos.rows.length;
    var fila;
    for (var i = 0; i < nfilas; i++) {
        fila = tbDetalleActivos.rows[i];
        data += fila.cells[0].innerHTML; //Item

        if (i < (nfilas - 1))
            data += ",";
    }

    var filtroAnio = txtPeriodoCons.value;

    data += "¯" + filtroAnio;

    var frm = new FormData();
    frm.append("data", data);

    Http.post("General/guardar?tbl=" + controller + vista, mostrarGrabar, frm);

    btnGuardarBajas.innerHTML = "Guardando <i class='fa fa-circle-o-notch fa-spin' style='color:white'></i>";
    btnGuardarBajas.disabled = true;
}

function grabarDatosMov() {
    var data = "";
    var frm = new FormData();
    data = obtenerDatosGrabar("PopupMov");

    if (vista == "Altas") {
        var tipoMov = (vista == "Altas") ? 'A' : 'S'; //A: Alta, I: Inicial, B: Baja
        var anioConsulta = document.getElementById('txtPeriodoCons')?.value;

        data += '|' + tipoMov;
        data += '|' + anioConsulta;
        data += '|';

        frm.append("data", data);
    }
    else {
        frm.append("data", data);
    }

    Http.post("General/guardar/?tbl=" + controller + vista + "Mov", mostrarGrabarMov, frm);
}

function grabarDatos() {
    var data = "";
    var frm = new FormData();
    data = obtenerDatosGrabar("Popup");

    if (vista == "InventarioInicial" || vista == "Altas") {
        var valoreseEspecTecnicas = obtenerDatosGrabar("PopupEspTecnica");
        var valoresContables = obtenerDatosGrabar("PopupValContable");

        var dataSplit = data.split("|");

        var valorTipoIngresoBien = optOC.checked ? 2 : (optNEA.checked ? 1 : 0);
        dataSplit[22] = valorTipoIngresoBien;
        dataSplit.splice(23, 1);
        data = dataSplit.join('|');

        var flagInicial = (vista == "InventarioInicial") ? 1 : 0;
        data += '|' + flagInicial;
        data += '|' + valoreseEspecTecnicas;
        data += '|' + valoresContables;
        data += '|';

        if (vista == "Altas") {
            var codigoMov = txtNroMovCab.value;
            data += '¯' + codigoMov;
        }

        frm.append("data", data);
    }
    else if (vista == "Bajas") {
        var grupoSecuencias = ''
        var filtroAnio = txtPeriodoCons.value;

        data += '|' + grupoSecuencias;
        data += '|' + filtroAnio;
        data += '|';

        frm.append("data", data);
    }
    else {
        frm.append("data", data);
    }

    if (vista == "Altas") {
        Http.post("General/guardar/?tbl=" + controller + vista + "ActivosMov", mostrarGrabarActivosMov, frm);
    }
    else if (vista == "InventarioInicial")
        Http.post("General/guardar/?tbl=" + controller + vista, mostrarGrabar, frm);

    else {
        Http.post("General/guardar/?tbl=" + controller + vista, mostrarlistasActivos, frm);
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
                if (control.id.substr(0, 3) == "num") data += control.value;
                if (control.id.substr(0, 3) == "dtt") {
                    if (control.value != "") {
                        if (vista == "InventarioInicial" || vista == "Altas" || vista == "Bajas") {
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

function obtenerItems(datos) {
    var lista = datos.split('¬');
    var nRegistros = lista.length;
    for (var i = 0; i < nRegistros; i++) {
        adicionarItem(lista[i]);
    }
}


function adicionarLista(datos) {
    document.querySelectorAll('.section-nuevo-activo').forEach(function (el) {
        el.style.display = 'block';
    });

    tbDetalleActivos.innerHTML = "";
    spnNroItems.innerHTML = "Items: 0";
    txtPeriodoItemsCons.value = new Date().getFullYear();

    var lista = datos.split('¬');

    lista = lista.slice(3, lista.length); //obtener desde el primer registro de data

    for (var i = 0; i < lista.length; i++) {
        if (lista[i])
            adicionarItem(lista[i]);
    }
}

function adicionarItem(datos) {
    var campos = datos.split('|');
    item = campos[0];
    codigo = campos[1];
    descripcion = campos[2];
    marca = campos[3];
    modelo = campos[4];
    serie = campos[5];
    usuarioFinal = campos[6];
    fechaCompra = campos[7];
    valorCompra = campos[8];
    fechaAlta = campos[9];
    valorInicial = campos[10];
    conservacion = campos[11];

    var nFilas = tbDetalleActivos.rows.length;
    var existe = false;
    for (var i = 0; i < nFilas; i++) {
        if (tbDetalleActivos.rows[i].cells[0].innerHTML == item) {
            existe = true;
            break;
        }
    }
    if (existe) {
        mostrarMensaje("Existen Items ya agregados - verificar", "error");
        return;
    }

    var filaDetalle = "<tr>";
    filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>";
    filaDetalle += item;
    filaDetalle += "</td> ";
    filaDetalle += "<td style='white-space:pre-wrap;width:100px;vertical-align:top;'>";
    filaDetalle += codigo;
    filaDetalle += "</td> ";
    filaDetalle += "<td style='white-space:pre-wrap;width:100px;vertical-align:top;'>";
    filaDetalle += descripcion;
    filaDetalle += "</td> ";
    filaDetalle += "<td style='white-space:pre-wrap;width:100px;vertical-align:top;'>";
    filaDetalle += marca;
    filaDetalle += "</td> ";
    //filaDetalle += "<td style='white-space:pre-wrap;width:100px;vertical-align:top;'>";
    //filaDetalle += modelo;
    //filaDetalle += "</td> ";
    filaDetalle += "<td style='white-space:pre-wrap;width:100px;vertical-align:top;'>";
    filaDetalle += serie;
    filaDetalle += "</td> ";
    //filaDetalle += "<td style='white-space:pre-wrap;width:100px;vertical-align:top;'>";
    //filaDetalle += usuarioFinal;
    //filaDetalle += "</td> ";
    filaDetalle += "<td style='white-space:pre-wrap;width:100px;vertical-align:top;'>";
    filaDetalle += fechaCompra;
    filaDetalle += "</td> ";
    //filaDetalle += "<td style='white-space:pre-wrap;width:100px;vertical-align:top;'>";
    //filaDetalle += valorCompra;
    //filaDetalle += "</td> ";
    filaDetalle += "<td style='white-space:pre-wrap;width:100px;vertical-align:top;'>";
    filaDetalle += fechaAlta;
    filaDetalle += "</td> ";
    filaDetalle += "<td style='white-space:pre-wrap;width:100px;vertical-align:top;'>";
    filaDetalle += valorInicial;
    filaDetalle += "</td> ";
    //filaDetalle += "<td style='white-space:pre-wrap;width:100px;vertical-align:top;'>";
    //filaDetalle += conservacion;
    //filaDetalle += "</td> ";
    filaDetalle += "<td style='white-space:pre-wrap;width:100px;vertical-align:top;'>";
    filaDetalle += 0.00;
    filaDetalle += "</td> ";
    filaDetalle += "<td style='white-space:pre-wrap;width:10px;vertical-align:top;'>";
    filaDetalle += "<i class='fa fa-search btn btn-info btnCirculo' title='Ver Item' onclick='editarRegistroActivo("
    filaDetalle += item;
    filaDetalle += ");'></i>";
    filaDetalle += "<i class='fa fa-trash ml-1 btn-danger btnCirculo' style='width: 30px;height: 26px;' title='Quitar Item' onclick='retirarItem(this,\"";
    filaDetalle += item;
    filaDetalle += "\");'></i>";
    filaDetalle += "</td> ";
    filaDetalle += "</tr>";
    tbDetalleActivos.insertAdjacentHTML("beforeend", filaDetalle);

    spnNroItems.innerHTML = "Items: " + (nFilas + 1);
    configurarEnterCantidad(tbDetalleActivos, 8);

    divPopupContainerListadoItemsForm.style.display = 'none';
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

function retirarItem(col, id) {
    var fila = col.parentNode.parentNode;
    tbDetalleActivos.removeChild(fila);
    var nFilas = 0;
    nFilas = tbDetalleActivos.rows.length;
    spnNroItems.innerHTML = "Items: " + (nFilas);
}

function esBajasValido() {
    var nfilas = tbDetalleActivos.rows.length;

    if (!validarInformacion("RequeMov")) {
        return false;
    }

    if (nfilas == 0) {
        mostrarMensaje("Debe agregar items a la Baja", "error");
        return false;
    }

    return true;
}

function setCuentaContable(cuentaContable) {
    if (cuentaContable) {
        var cuenta = cuentaContable.split(';')
        var mayor = cuenta?.[0];
        var subcuenta = cuenta?.[1];
        var clasificador = cuenta?.[2];
        var descripcionCtaContable = cuenta?.[3];

        if (!(mayor && subcuenta))
            return;

        txtCtaContable.value = mayor + '.' + subcuenta + ' - ' + descripcionCtaContable;
        txtMayorSubCtaClasificador.value = mayor + ';' + subcuenta + ';' + clasificador;
    }
}

function asignarCuentaContable(idItem) {
    var cuentasContables = [];
    txtCtaContable.value = "";
    txtMayorSubCtaClasificador.value = "";

    for (var i = 0; i < listaCuentaContables_v.length; i++) {
        var ctaContable = listaCuentaContables_v[i].split('|');
        if (ctaContable[0] == idItem) {
            cuentasContables.push(ctaContable);
        }
    }

    if (cuentasContables && cuentasContables.length == 1) {
        var cuenta = cuentasContables[0];
        var mayor = cuenta?.[1];
        var subcuenta = cuenta?.[2];
        var clasificador = cuenta?.[3];
        var descripcionCtaContable = cuenta?.[4];

        if (!(mayor && subcuenta))
            return;

        txtCtaContable.value = mayor + '.' + subcuenta + ' - ' + descripcionCtaContable;
        txtMayorSubCtaClasificador.value = mayor + ';' + subcuenta + ';' + clasificador;
    }

    if (cuentasContables && cuentasContables.length > 1) {
        cboActivos.value = "";
        seleccionarControlSelect2(cboActivos);

        Swal.fire({
            title: 'Warning!',
            text: 'El Activo tiene mas de una Cta Contable asociada',
            icon: 'warning',
            showConfirmButton: true,
        })
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
        var tasaDeprec = activo[8];

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

        var txtDepreciacion = document.getElementById('txtDepreciacion');
        if (txtDepreciacion) txtDepreciacion.value = tasaDeprec;

        var txtVidaUtil = document.getElementById('txtVidaUtil');
        if (txtVidaUtil) txtVidaUtil.value = tasaDeprec > 0 ? (100 / tasaDeprec).toFixed(2) : '';

        if (dttFechaAlta && dttFechaAlta.value) {
            if (txtVidaUtil && dttFinVidaAltaValContable) {
                var anios = txtVidaUtil.value ? parseFloat(txtVidaUtil.value).toFixed(2) : 0;
                calcularFechaFin(dttFinVidaAltaValContable, dttFechaAlta.value, parseInt(anios));
            }
        }

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

function obtenerFechaActualYYYMMDD() {
    var date = new Date();
    return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
}

function formatearFechaYYYMMDD(fecha) {
    if (!fecha)
        return '';

    var dfecha = fecha.split("/");
    var dia = dfecha[0].padStart("2", "0");
    var mes = dfecha[1].padStart("2", "0");
    var anio = dfecha[2];

    return anio + "-" + mes + "-" + dia;
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

function limpiarListaActivos() {
    var divListaActivo = document.getElementById("divListaActivo");
    if (divListaActivo) divListaActivo.innerHTML = '';
}

function desahabilitarControles(controles) {
    for (var j = 0; j < controles.length; j++) {
        control = controles[j];
        control.style.borderColor = ""
        tipo = control.id.substr(0, 3);

        if (tipo == "txt" || tipo == "num" || tipo == "tta" || tipo == "tim") {
            control.classList.remove('control-form');
            control.classList.add('control-lectura');
        }
        else if (tipo == "dtt") {
            control.classList.remove('control-form');
            control.classList.add('control-lectura');
        }
        else if (tipo == "cbo") {
            control.classList.remove('control-form');
            control.classList.add('control-lectura');
        }
        else if (tipo == "chk" || tipo == "opt") {
            control.setAttribute("disabled", "");
        }
    }
}
function seleccionarControlSelect2(control) {
    var controlSelect = 'select2-' + control.id + '-container';
    var cboControlSelect = document.getElementById(controlSelect);
    if (cboControlSelect != null) {
        var selected = control.options[control.selectedIndex].text;
        cboControlSelect.innerHTML = selected;
    }
}
function mostrarGrabarActivosMov(rpta) {
    var mensajeResul = [];
    if (rpta) {
        listas = rpta.split("¯")
        lista = listas[0].split("¬");
        mensajeResul = listas[1].split("|");
        var tipo = mensajeResul[0];
        var mensaje = mensajeResul[1];
        divPopupContainer.style.display = 'none';

        grillaItem = new GrillaScroll(lista, "divListaActivo", 100, 6, vista, controller, null, null, true, botones, 38, false, null);

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

    if (vista == "Bajas") {
        btnGuardarBajas.innerHTML = "<i class='fa fa-save'></i> Grabar";
        btnGuardarBajas.disabled = false;
    }
    else {
        btnGuardar.innerHTML = "<i class='fa fa-save'></i> Grabar";
        btnGuardar.disabled = false;
    }
}

function mostrarGrabarMov(rpta) {
    var mensajeResul = [];
    if (rpta) {
        listas = rpta.split("¯")
        lista = listas[0].split("¬");
        mensajeResul = listas[1].split("|");
        var tipo = mensajeResul[0];
        var mensaje = mensajeResul[1];
        divPopupContainerMov.style.display = 'none';

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

    if (vista == "Bajas") {
        btnGuardarBajas.innerHTML = "<i class='fa fa-save'></i> Grabar";
        btnGuardarBajas.disabled = false;
    }
    else {
        btnGuardar.innerHTML = "<i class='fa fa-save'></i> Grabar";
        btnGuardar.disabled = false;
    }
}

function actualizarBotones(idEstado) {
    var esAprobado = (idEstado == EST_APROBADO)
    if (vista == "Altas") {
        if (esAprobado) {
            btnGuardarMov.style.display = 'none';
            btnNuevo.style.display = 'none';
            btnGuardar.style.display = 'none';
        }
        else {
            btnGuardarMov.style.display = 'block';
            btnNuevo.style.display = 'block';
            btnGuardar.style.display = 'block';
        }
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
            limpiarListaActivos();
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

    if (vista == "Bajas") {
        divPopupContainerMov.style.display = 'none'

        btnGuardarBajas.innerHTML = "<i class='fa fa-save'></i> Grabar";
        btnGuardarBajas.disabled = false;
    }
    else {
        btnGuardar.innerHTML = "<i class='fa fa-save'></i> Grabar";
        btnGuardar.disabled = false;
    }
}

function importarExcel(divForm, divLista, dataDeta) {
    btnGuardarListaExcel.disabled = false;

    document.getElementById(divForm).style.display = "none";

    var file = fupExcel.files[0];
    var reader = new FileReader();

    var camposNea = [7, 8, 9];
    var camposOC = [10, 11, 12];
    var camposNull = [19, 20, 21, 22, 30, 31, 32, 33];

    var esArchivoCompleto = true;

    reader.onload = function (e) {
        var data = new Uint8Array(reader.result);
        var libro = XLSX.read(data, { type: 'array', cellDates: true, dateNF: 'yyyy-mm-dd' });
        var nhojas = libro.SheetNames.length;
        var nombreHoja = libro.SheetNames[0];
        var hoja = libro.Sheets[nombreHoja];
        var range = XLSX.utils.decode_range(hoja['!ref']);
        var contenido = "<table>";
        contenido += "<tr style='background-color:lightgray;text-align:center'>";
        contenido += "<td></td>";
        for (var j = range.s.c; j <= range.e.c; j++) {
            contenido += "<th>";
            contenido += j < 26 ? String.fromCharCode(65 + j) : String.fromCharCode(65, 65 + (j - 26)); //65: A, 90:Z
            contenido += "</th>";
        }
        contenido += "</tr>";

        /*Detalle de la importacion*/
        for (var i = range.s.r; i <= range.e.r; i++) {
            if (i > 0) {
                contenido += "<tr style='background-color:white;text-align:left'>";
                contenido += "<th style='width:50px;background-color:lightgray;padding-left: 10px;padding-right: 10px;'>";
                contenido += i + 1;
                contenido += "</th>";

                var camposNoObligatorios = [];
                camposNoObligatorios = camposNoObligatorios.concat(camposNull);

                for (var j = range.s.c; j <= range.e.c; j++) {
                    contenido += "<td style='padding-left: 10px;padding-right: 10px;padding-top: 5px;padding-bottom: 5px;'>";
                    var direccion = XLSX.utils.encode_cell({ c: j, r: i });
                    var celda = hoja[direccion];

                    if (celda != null) {
                        if (i == 1) {
                            contenido += '<b>' + celda.v + '</b >';
                        }
                        if (i > 1) {
                            if (j == 9 || j == 12 || j == 14) {//celdas tipo fecha
                                contenido += celda.v.toLocaleDateString();
                                dataDeta += formatearFechaYYYMMDD(celda.v.toLocaleDateString());
                            }
                            else {
                                contenido += celda.v;
                                dataDeta += celda.v;
                            }

                            var indiceTipoDocAdquisicion = 6;
                            if (indiceTipoDocAdquisicion == j) {
                                if (celda.v == 1)
                                    camposNoObligatorios = camposNoObligatorios.concat(camposOC);
                                else if (celda.v == 2)
                                    camposNoObligatorios = camposNoObligatorios.concat(camposNea);
                            }
                        }
                    }
                    else {
                        if (camposNoObligatorios.indexOf(j) == -1) {
                            contenido += '<span style="background-color: red;display: block;">&nbsp</span >';
                            esArchivoCompleto = false;
                        }
                    }

                    if (i > 1) {
                        dataDeta += "|";
                    }
                    contenido += "</td>";
                }
                dataDeta = dataDeta.substr(0, dataDeta.length - 1);
                dataDeta += "¬";

                contenido += "</tr>";
            }
        }
        //****** dataDeta Eliminar primer  caracter "¬"
        dataDeta = dataDeta.slice(1, -1);

        dataImport = dataDeta
        contenido += "<table>";
        document.getElementById(divLista).innerHTML = contenido;

        if (!esArchivoCompleto) {
            btnGuardarListaExcel.disabled = true;
            mostrarMensaje("Los campos de rojo son obligatorios", "error");
        }
    }
    reader.readAsArrayBuffer(file);
}