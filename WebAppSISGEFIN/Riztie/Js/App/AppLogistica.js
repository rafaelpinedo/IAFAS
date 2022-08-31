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
var listaGrupoItem = [];
var listaClaseItem = [];
var listaFamiliaItem = [];
var estadoTabla = "";
var listaUbigeo = [];
var listaItemInventario = [];
var idTabActivo = "";

var botonesProceso = [
    { "cabecera": "Editar", "clase": "fa fa-plus-circle btn btn-primary btnCirculo", "id": "Proceso" },
    { "cabecera": "Editar", "clase": "fa fa-pencil btn btn-info btnCirculo", "id": "Editar" },
    { "cabecera": "Anular", "clase": "fa fa-minus-circle btn btn-danger btnCirculo", "id": "Eliminar" },
];
var botonesPeriodo = [
    { "cabecera": "Extornar", "clase": "fa fa-arrow-left btn btn-danger btnCirculo", "id": "Eliminar" },
];

var botonesAsignar = [
    { "cabecera": "Editar", "clase": "fa fa-money btn btn-info btnCirculo", "id": "Editar" },
];

window.onload = function () {
    getConfigMn();
    vista = window.sessionStorage.getItem("Vista");
    controller = window.sessionStorage.getItem("Controller");
    mostrarLoading("divLista");
    if (vista == "PedidoCompra" || vista == "SolicitudCompra" || vista == "Cotizacion" || vista == "CuadroCompara" || vista == "Asigpre") {
        getListarPedido();
    }
    else if (vista == "OrdenCompra") {
        getListarOrden(1);
    }
    else if (vista == "PAC") {
        getListarLicita();
    }
    else if (vista == "Articulo") {
        getListarArticulo('B')
    }
    else if (vista == "Periodo" || vista == "ReporteOrdenes") {
        getListarPeriodo()
    }

    else {
        getListar();
    }
    
    configurarBotones();
    configurarConsultas();
    configurarCombos();
    configurarOptions();
}

function getListarLicita() {
    var anioFiscal = document.getElementById("txtAnioFiscal").value;
    Http.get("General/listarTabla/?tbl=" + controller + vista + "&data=" + anioFiscal, mostrarlistas);
}

function getListarOrden(tipo) {
    var data = "";
    var txtFechaInicio = document.getElementById("txtFechaInicio").value;
    var txtFechaFinal = document.getElementById("txtFechaFinal").value;
    data = txtFechaInicio + '|' + txtFechaFinal + '|' + tipo;
    Http.get("General/listarTabla/?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
}

function getListarPedido() {
    var data = "";
    var txtFechaInicio = document.getElementById("txtFechaInicio").value;
    var txtFechaFinal = document.getElementById("txtFechaFinal").value;
    data = txtFechaInicio + '|' + txtFechaFinal;
    Http.get("General/listarTabla/?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
}

function getListarPeriodo() {
    var anio = document.getElementById("txtAnioFiscal").value;
    Http.get("General/listarTabla?tbl=" + controller + vista + "&data=" + anio, mostrarlistas);
}

function getListar() {
    var data = "";
    if (vista == "Configuracion") {
        Http.get("General/listarTabla?tbl=" + controller + vista + "&data=" + data, mostrarConfiguracion);
    }
    else {
        Http.get("General/listarTabla?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
    }
}

function getListarArticulo(tipo) {
    Http.get("General/listarTabla?tbl=" + controller + vista + "&data=" + tipo, mostrarlistas);
}

function mostrarlistas(rpta) {
    if (rpta) {
        var listas = rpta.split("¯");
        var lista = listas[0].split("¬");
        if (vista == "Proveedor") {
            var listaDocumento = listas[1].split("¬");
            var listaBanco = listas[2].split("¬");
            var listaEstado = listas[3].split("¬");
            listaUbigeo = listas[4].split("¬");
            listarDepartamentos();

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaDocumento, "cboTipoDocumento", "Seleccione");
            crearCombo(listaBanco, "cboBanco", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "Oficina") {
            var listaEntidad = listas[1].split("¬");
            var listaOficinaPadre = listas[2].split("¬");
            var listaEstado = listas[3].split("¬");

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaEntidad, "cboEntidad", "Seleccione");
            crearCombo(listaOficinaPadre, "cboOficinaPadre", "Primer Nivel");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "CondicionCompra") {
            var listaEntidad = listas[1].split("¬");
            var listaEstado = listas[2].split("¬");

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaEntidad, "cboTipoCC", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "Formato") {
            var listaEntidad = listas[1].split("¬");
            var listaDocumento = listas[2].split("¬");
            var listaEstado = listas[3].split("¬");

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaEntidad, "cboEntidad", "Seleccione");
            crearCombo(listaDocumento, "cboDocumento", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");

        }
        else if (vista == "PedidoCompra") {
            var listaTipo = listas[1].split("¬");
            var listaOficina = listas[2].split("¬");

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaTipo, "cboTipoSolicitud", "Seleccione");
            crearCombo(listaOficina, "cboOficina", "Seleccione");
        }
        else if (vista == "SolicitudCompra" || vista == "Cotizacion") {
            var listaTipo = listas[1].split("¬");

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaTipo, "cboTipoSolicitud", "Seleccione");
        }
        else if (vista == "OrdenCompra") {
            var listaFteFto = listas[1].split("¬");

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaFteFto, "cboFteFto", "Seleccione");
        }
        else if (vista == "Articulo") {

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            var listaTipo = listas[1].split("¬");
            listaGrupoItem = listas[2].split("¬");
            listaClaseItem = listas[3].split("¬");
            listaFamiliaItem = listas[4].split("¬");
            var listaTipoItem = listas[5].split("¬");
            var listaUniMed = listas[6].split("¬");
            var listaEstado = listas[7].split("¬");
            crearCombo(listaTipo, "cboTipoBien", "Seleccione");
            listarGrupoItem();
            crearCombo(listaTipoItem, "cboTipoItem", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
            crearCombo(listaUniMed, "cboUniMed", "Seleccione");
        }

        else if (vista == "Grupo") {

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            var listaTipoBien = listas[1].split("¬");
            var listaEstado = listas[2].split("¬");
            var listaCuentaContable = listas[3].split("¬");
            crearCombo(listaTipoBien, "cboTipoBien", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
            crearCombo(listaCuentaContable, "cboCuentaContable", "Seleccione");
        }
        else if (vista == "UniMed") {

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            var listaEstado = listas[1].split("¬");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "Clase") {

            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            var listaTipoBien = listas[1].split("¬");
            listaGrupoItem = listas[2].split("¬");
            var listaEstado = listas[3].split("¬");
            listarGrupoItem();
            crearCombo(listaTipoBien, "cboTipoBien", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "Familia") {
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            var listaTipo = listas[1].split("¬");
            listaGrupoItem = listas[2].split("¬");
            listaClaseItem = listas[3].split("¬");
            var listaEstado = listas[4].split("¬");
            crearCombo(listaTipo, "cboTipoBien", "Seleccione");
            listarGrupoItem();
            crearCombo(listaEstado, "cboEstado", "Seleccione");
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
        else if (vista == "ReporteOrdenes") {
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, null, 38, false, null);
        }
        else if (vista == "Asigpre") {
            var listaFteFto = listas[1].split('¬');
            var listaMes = listas[2].split('¬');
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botonesAsignar, 38, false, null);
            crearCombo(listaMes, "cboMes", "Seleccione");
            crearCombo(listaFteFto, "cboFteFto", "Seleccione");
        }
        else if (vista == "Periodo") {
            var listaMesActual = listas[1].split("¬");
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botonesPeriodo, 38, false, null);

            crearCombo(listaMesActual, "cboPeriodoActual", "Seleccione");
            crearCombo(listaMesActual, "cboPeriodoSiguiente", "Seleccione");
        }
        else {
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
        }
    }
}

function mostrarConfiguracion(rpta) {
    if (rpta) {
        idTabActivo = "tabParametro";
        var listas = rpta.split('¯');
        var listaPersonal = listas[0].split('¬');
        var anioFiscal = listas[1].split('|');
        var anioCN = listas[2].split('|');
        var igv = listas[3].split('|');
        var direccion = listas[4].split('|');
        var jelog = listas[5].split('|');
        var adquisicion = listas[6].split('|');
        var jelogAlma = listas[7].split('|');
        var jefealma = listas[8].split('|');

        crearCombo(listaPersonal, "cboDirector", "Seleccione");
        crearCombo(listaPersonal, "cboJelog", "Seleccione");
        crearCombo(listaPersonal, "cboAdquisicion", "Seleccione");
        crearCombo(listaPersonal, "cboJelogAlma", "Seleccione");
        crearCombo(listaPersonal, "cboJefeAlmacen", "Seleccione");

        txtAnioFiscal.value = anioFiscal[1] * 1;
        txtAnioFiscal.setAttribute('data-id', anioFiscal[0]);

        txtAnioCN.value = anioCN[1] * 1;
        txtAnioCN.setAttribute('data-id', anioCN[0]);

        txtIGV.value = igv[1] * 1;
        txtIGV.setAttribute('data-id', igv[0]);

        cboDirector.value = direccion[1] * 1;
        cboDirector.setAttribute('data-id', direccion[0]);

        cboJelog.value = jelog[1] * 1;
        cboJelog.setAttribute('data-id', jelog[0]);

        cboAdquisicion.value = adquisicion[1] * 1;
        cboAdquisicion.setAttribute('data-id', adquisicion[0]);

        cboJelogAlma.value = jelogAlma[1] * 1;
        cboJelogAlma.setAttribute('data-id', jelogAlma[0]);

        cboJefeAlmacen.value = jefealma[1] * 1;
        cboJefeAlmacen.setAttribute('data-id', jefealma[0]);

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

function listarGrupoItem() {
    var idTipoItem = cboTipoBien.value;
    var nRegistros = listaGrupoItem.length;
    var contenido = "<option value=''>Seleccione</option>";
    var campos, idCodigo, nombre, idxTipoItem;
    for (var i = 0; i < nRegistros; i++) {
        campos = listaGrupoItem[i].split('|');
        idCodigo = campos[0];
        nombre = campos[1];
        idxTipoItem = campos[2];
        if (idxTipoItem == idTipoItem) {
            contenido += "<option value='";
            contenido += idCodigo;
            contenido += "'>";
            contenido += nombre;
            contenido += "</option>";
        }
    }
    var cbo = document.getElementById("cboGrupo");
    if (cbo != null) {
        cbo.innerHTML = contenido;
        listarClaseItem();
    }
}

function listarClaseItem() {
    var idTipoItem = cboTipoBien.value;
    var idGrupoItem = cboGrupo.value;
    var nRegistros = listaClaseItem.length;
    var contenido = "<option value=''>Seleccione</option>";
    var campos, idCodigo, nombre, idxTipoItem, idxGrupoItem;
    for (var i = 0; i < nRegistros; i++) {
        campos = listaClaseItem[i].split('|');
        idCodigo = campos[0];
        nombre = campos[1];
        idxTipoItem = campos[2];
        idxGrupoItem = campos[3];
        if (idxTipoItem == idTipoItem && idxGrupoItem == idGrupoItem) {
            contenido += "<option value='";
            contenido += idCodigo;
            contenido += "'>";
            contenido += nombre;
            contenido += "</option>";
        }
    }
    var cbo = document.getElementById("cboClase");
    if (cbo != null) {
        cbo.innerHTML = contenido;
        listarFamiliaItem();
    }
}

function listarFamiliaItem() {
    var idTipoItem = cboTipoBien.value;
    var idGrupoItem = cboGrupo.value;
    var idClaseItem = cboClase.value;
    var nRegistros = listaFamiliaItem.length;
    var contenido = "<option value=''>Seleccione</option>";
    var campos, idCodigo, nombre, idxTipoItem, idxGrupoItem, idxClaseItem;
    for (var i = 0; i < nRegistros; i++) {
        campos = listaFamiliaItem[i].split('|');
        idCodigo = campos[0];
        nombre = campos[1];
        idxTipoItem = campos[2];
        idxGrupoItem = campos[3];
        idxClaseItem = campos[4];
        if (idxTipoItem == idTipoItem && idxGrupoItem == idGrupoItem && idxClaseItem == idClaseItem) {
            contenido += "<option value='";
            contenido += idCodigo;
            contenido += "'>";
            contenido += nombre;
            contenido += "</option>";
        }
    }
    var cbo = document.getElementById("cboFamilia");
    if (cbo != null) cbo.innerHTML = contenido;
}

function configurarCombos() {
    var cboMeta = document.getElementById("cboMeta");
    if (cboMeta != null) cboMeta.onchange = function () {
        listarSubMeta();
    }

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

    var cboTipoSolicitud = document.getElementById("cboTipoSolicitud")
    if (cboTipoSolicitud != null) cboTipoSolicitud.onchange = function () {
        var idTipoSolicitud = cboTipoSolicitud.value;
        var anio = numAnioPendiente.value;
        var data = ""
        data = idTipoSolicitud + '|' + anio;
        if (vista == "SolicitudCompra") {
            Http.get("General/listarTabla/?tbl=" + controller + vista + "Pedidos&data=" + data, mostrarListadoItem);
            tbDetallePedido.innerHTML = "";
        }
        else {
            tbDetallePedido.innerHTML = "";
        }
    }

    var cboDepartamento = document.getElementById("cboDepartamento")
    if (cboDepartamento != null) cboDepartamento.onchange = function () {
        listarProvincias();
    }

    var cboProvincia = document.getElementById("cboProvincia")
    if (cboProvincia != null) cboProvincia.onchange = function () {
        listarDistritos();
    }

    if (vista == "PAC") {

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

function configurarBotones() {
    var btnReporteExcel = document.getElementById("btnReporteExcel");
    if (btnReporteExcel != null) btnReporteExcel.onclick = function () {
        var data = "";
        var anio = numAnio.value;
        var idItem = cboArticulo.value;
        var idProveedor = cboProveedor.value;
        spnLoad.style.display = 'inline';
        if (optItems.checked) {
            if (idItem != "") {
                archivo = "ORDEN COMPRA POR ITEMS.xlsx";
                data = anio + '|' + idItem;
                Http.getDownload("General/exportarOnline/?ori=V&tbl=" + tabla + "PorItems&idx=" + data, mostrarExportar)
            }
            else {
                mostrarMensaje("Seleccione Items", "error");
                cboArticulo.focus();
            }
        }
        else if (optRecordProv.checked) {
            archivo = "RECORD POR PROVEEDOR.xlsx";
            Http.getDownload("General/exportarOnline/?ori=V&tbl=" + tabla + "ResumenProveedor&idx=" + anio, mostrarExportar)
        }
        else if (optOCProv.checked) {
            if (idProveedor != "") {
                archivo = "ORDENES POR PROVEEDOR.xlsx";
                spnLoad.style.display = 'inline';
                data = anio + '|' + idProveedor;
                Http.getDownload("General/exportarOnline/?ori=V&tbl=" + tabla + "PorProveedor&idx=" + data, mostrarExportar)
            }
            else {
                mostrarMensaje("Seleccione Proveedor", "error");
                cboProveedor.focus();
            }

        }
        //else if (optEntradas.checked) {
        //    spnLoad.style.display = 'inline';
        //    get("Inventario/getReporte/?tbl=" + tabla + "Entradas&data=" + anio, mostrarDatosExportar);
        //}

    }


    var btnAgregarPartida = document.getElementById("btnAgregarPartida");
    if (btnAgregarPartida != null) btnAgregarPartida.onclick = function () {
        meta = cboMeta.value;
        subMeta = cboSubMeta.value;
        clasificador = cboClasificador.value;

        if (meta == "") {
            mostrarMensaje("Seleccione Meta", "error");
            cboMeta.focus();
            return false;
        }
        else if (subMeta == "") {
            mostrarMensaje("Seleccione Sub-Meta", "error");
            cboSubMeta.focus();
            return false;
        }
        else if (clasificador == "") {
            mostrarMensaje("Seleccione Partida", "error");
            cboClasificador.focus();
            return false;
        }
        else {
            meta = cboMeta.value;
            subMeta = cboSubMeta.value;
            clasificador = cboClasificador.value;
            filaDetalle.cells[1].innerHTML = meta;
            filaDetalle.cells[2].innerHTML = subMeta;
            filaDetalle.cells[3].innerHTML = clasificador;
            divPopupContainerDetalleItem.style.display = 'none';
        }
    }

    var btnAgregarTodos = document.getElementById("btnAgregarTodos");
    if (btnAgregarTodos != null) btnAgregarTodos.onclick = function () {
        meta = cboMeta.value;
        subMeta = cboSubMeta.value;
        clasificador = cboClasificador.value;

        if (meta == "") {
            mostrarMensaje("Seleccione Meta", "error");
            cboMeta.focus();
            return false;
        }
        else if (subMeta == "") {
            mostrarMensaje("Seleccione Sub-Meta", "error");
            cboSubMeta.focus();
            return false;
        }
        else if (clasificador == "") {
            mostrarMensaje("Seleccione Partida", "error");
            cboClasificador.focus();
            return false;
        }
        else {
            var nFilas = tbDetalleOrden.rows.length;
            var fila;
            for (var i = 0; i < nFilas; i++) {
                fila = tbDetalleOrden.rows[i];
                fila.cells[1].innerHTML = meta;
                fila.cells[2].innerHTML = subMeta;
                fila.cells[3].innerHTML = clasificador;
            }
            divPopupContainerDetalleItem.style.display = 'none';
        }
    }


    var btnConfirmarPeriodo = document.getElementById("btnConfirmarPeriodo");
    if (btnConfirmarPeriodo != null) btnConfirmarPeriodo.onclick = function () {
        grabarPeriodo();
    }

    var tabOrdCompra = document.getElementById("tabOrdCompra");
    if (tabOrdCompra != null) tabOrdCompra.onclick = function () {
        getListarOrden(1);
        idTabActivo = "tabOrdCompra";
    }

    var tabOrdServicio = document.getElementById("tabOrdServicio");
    if (tabOrdServicio != null) tabOrdServicio.onclick = function () {
        idTabActivo = "tabOrdServicio";
        getListarOrden(2);
    }

    var tabParametro = document.getElementById("tabParametro");
    if (tabParametro != null) tabParametro.onclick = function () {
        idTabActivo = "tabParametro";
    }

    var tabAutorizacion = document.getElementById("tabAutorizacion");
    if (tabAutorizacion != null) tabAutorizacion.onclick = function () {
        idTabActivo = "tabAutorizacion";
    }

    var btnTabBienes = document.getElementById("btnTabBienes");
    if (btnTabBienes != null) btnTabBienes.onclick = function () {
        getListarArticulo('B')
    }

    var btnTabServicios = document.getElementById("btnTabServicios");
    if (btnTabServicios != null) btnTabServicios.onclick = function () {
        getListarArticulo('S')
    }

    var btnTabObras = document.getElementById("btnTabObras");
    if (btnTabObras != null) btnTabObras.onclick = function () {
        getListarArticulo('O')
    }

    var btnConsultar = document.getElementById("btnConsultar");
    if (btnConsultar != null) btnConsultar.onclick = function () {
        if (vista == "PedidoCompra" || vista == "SolicitudCompra" || vista == "Cotizacion" || vista == "CuadroCompara" || vista == "OrdenCompra") {
            getListarPedido();
        }
        else if (vista == "Periodo") {
            getListarPeriodo();
        }
        else {
            getListar();
        }
    }

    var btnNuevo = document.getElementById("btnNuevo");
    if (btnNuevo != null) btnNuevo.onclick = function () {
        divPopupContainer.style.display = 'block';
        limpiarForm("Popup");

        let spnLoad = document.getElementById("spnLoad");
        if (spnLoad != null) {
            spnLoad.style.display = 'none';
        }

        let tituloModal = document.getElementById("tituloModal");
        if (tituloModal != null) {
            tituloModal.innerText = "Nuevo Registro";
        }

        var cboEntidad = document.getElementById("cboEntidad");
        if (cboEntidad != null) {
            cboEntidad.value = 1;
            cboEntidad.disabled = true;
        }

        var dtgEsAgenteRetencion = document.getElementById("dtgEsAgenteRetencion");
        if (dtgEsAgenteRetencion != null) {
            $('#dtgEsAgenteRetencion').bootstrapToggle('off')
        }
        var dtgEsFinal = document.getElementById("dtgEsFinal");
        if (dtgEsFinal != null) {
            $('#dtgEsFinal').bootstrapToggle('off')
        }

        var cboEstado = document.getElementById("cboEstado");
        if (cboEstado != null) {
            cboEstado.value = 1;
            cboEstado.disabled = true;
        }

        var cboTipoDocumento = document.getElementById("cboTipoDocumento");
        if (cboTipoDocumento != null) {
            cboTipoDocumento.value = 4;
        }

        var lblEstado = document.getElementById("lblEstado");
        if (lblEstado != null) lblEstado.innerHTML = "";

        var txtFechaPedido = document.getElementById("txtFechaPedido");
        if (txtFechaPedido != null) txtFechaPedido.value = txtFechaPedido.getAttribute("data-fecha");

        var select2cboOficina = document.getElementById("select2-cboOficina-container");
        if (select2cboOficina != null) select2cboOficina.innerHTML = "Seleccione";

        var tbDetallePedido = document.getElementById("tbDetallePedido");
        if (tbDetallePedido != null) tbDetallePedido.innerHTML = "";

        var tBodytblItem = document.getElementById("tBodytblItem");
        if (tBodytblItem != null) tBodytblItem.innerHTML = "";

        var spnNroItems = document.getElementById("spnNroItems");
        if (spnNroItems != null) spnNroItems.innerHTML = "";

        if (vista == "Cotizacion" || vista == "CuadroCompara" || vista == "OrdenCompra") {
            var data = "";
            Http.get("General/listarTabla/?tbl=" + controller + vista + "Pendientes&data=" + data, mostrarListadoItem);

            var listaDetalle = document.getElementById("listaDetalle");
            if (listaDetalle != null) listaDetalle.innerHTML = "";

            var divBuenaPro = document.getElementById("divBuenaPro");
            if (divBuenaPro != null) divBuenaPro.style.display = 'none';

            var listaCC = document.getElementById("listaCC");
            if (listaCC != null) listaCC.innerHTML = "";

            var listaProveedor = document.getElementById("listaProveedor");
            if (listaProveedor != null) listaProveedor.innerHTML = "";

            var listaProductos = document.getElementById("listaProductos");
            if (listaProductos != null) listaProductos.innerHTML = "";

            var divItems = document.getElementById("divItems");
            if (divItems != null) divItems.innerHTML = "";

            var divSeleccionado = document.getElementById("divSeleccionado");
            if (divSeleccionado != null) divSeleccionado.innerHTML = "";

            var divTotal = document.getElementById("divTotal");
            if (divTotal != null) divTotal.innerHTML = "";

        }

        var select2cboGrupo = document.getElementById("select2-cboGrupo-container");
        if (select2cboGrupo != null) select2cboGrupo.innerHTML = "Seleccione";
        var select2cboOClase = document.getElementById("select2-cboClase-container");
        if (select2cboOClase != null) select2cboOClase.innerHTML = "Seleccione";

        var select2cboFamilia = document.getElementById("select2-cboFamilia-container");
        if (select2cboFamilia != null) select2cboFamilia.innerHTML = "Seleccione";

        if (vista == "Periodo") {
            //Logica
            var data = "";
            Http.get("General/listarTabla/?tbl=" + controller + vista + "Actual&data=" + data, mostrarListadoPeriodo);
        }
    }

    var btnActualizar = document.getElementById("btnActualizar");
    if (btnActualizar != null) btnActualizar.onclick = function () {
        Swal.fire({
            title: '¿Desea grabar la información de la proforma?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                grabarProforma();
            }
        })
    }

    var btnAprobar = document.getElementById("btnAprobar");
    if (btnAprobar != null) btnAprobar.onclick = function () {
        if (idRegistro == "") {
            mostrarMensaje("Seleccione pedido de la lista", "error");
        }
        else {
            aprobarPedido();
        }
    }

    var btnImprimir = document.getElementById("btnImprimir");
    if (btnImprimir != null) btnImprimir.onclick = function () {
        if (idRegistro == "") {
            mostrarMensaje("Seleccione registro de la lista", "error");
        }
        else {
            getReporte(idRegistro);
        }
    }

    var btnGenerar = document.getElementById("btnGenerar");
    if (btnGenerar != null) btnGenerar.onclick = function () {
        var nSeleccionados = contarProductos();
        var cantidadPermitida = 20;
        var nFilas = tbDetalleItem.rows.length;
        var existe = false;
        for (var i = 0; i < nFilas; i++) {
            if (tbDetalleItem.rows[i].cells[8].childNodes[0].childNodes[0].childNodes[0].childNodes[0].checked) {
                existe = true;
                break;
            }
        }

        if (existe != true) {
            mostrarMensaje("Seleccione productos de la lista", "error");
        }
        else if (nFilasSeleccionadas > cantidadPermitida) {
            mostrarMensaje("El número de Items supera la cantidad permitida. Lo permitido es solo " + cantidadPermitida, "error");
        }
        else {
            divPopupContainer.style.display = 'none';
            divPopupContainerForm1.style.display = 'block';
            var data = idSolCompra + '|' + idProveedor;
            Http.get("General/listarTabla/?tbl=" + controller + vista + "Ayudas&data=" + data, GenerarOrdenCompra);
        }
    }

    var btnGuardar = document.getElementById("btnGuardar");
    if (btnGuardar != null) btnGuardar.onclick = function () {
        var validar = false;

        if (vista == "PedidoCompra" && validarPedido()) {
            validar = true;
        }
        else if (vista == "SolicitudCompra" && validarSoliCompra()) {
            validar = true;
        }
        else if (vista == "Cotizacion" && validarCotizacion()) {
            validar = true;
        }
        else if (vista == "CuadroCompara" && validarCuadroCompara()) {
            validar = true;
        }
        else if (vista == "OrdenCompra" && validarOrdenCompra()) {
            validar = true;
        }
        else {

            if (validarInformacion("Reque") == true) {
                validar = true;
            }
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
                    if (vista == "PedidoCompra") {
                        grabarPedido();
                    }
                    else if (vista == "SolicitudCompra") {
                        grabarSolicitud();
                    }
                    else if (vista == "Cotizacion") {
                        grabarCotizacion();
                    }
                    else if (vista == "CuadroCompara") {
                        grabarCuadroCompara();
                    }
                    else if (vista == "OrdenCompra") {
                        grabarOrdenCompra();
                    }
                    else if (vista == "Configuracion") {
                        grabarConfiguracion();
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

    var btnReporte = document.getElementById("btnReporte");
    if (btnReporte != null) btnReporte.onclick = function () {
        getReporteAyudas();
    }

    var btnMostrarCorreo = document.getElementById("btnMostrarCorreo");
    if (btnMostrarCorreo != null) btnMostrarCorreo.onclick = function () {
        if (idRegistro == "") {
            mostrarMensaje("Seleccione un proveedor de la lista", "error")
        }
        else {
            divPopupContainerForm2.style.display = 'block';
        }
    }

    var btnEnviarCorreo = document.getElementById("btnEnviarCorreo");
    if (btnEnviarCorreo != null) btnEnviarCorreo.onclick = function () {
        var correo = txtEmail.value
        if (correo == "") {
            mostrarMensaje("Ingrese correo electrónico del proveedor", "error")
        }
        else {
            var doc = new jsPDF();
            doc.text('IAFAS DE LA MARINA DE GUERRA DEL PERU', 14, 18)
            doc.text('SISGEFIN', 14, 21)
            //  doc.text('Fecha: ' + fecha, 170, 21)
            // doc.text('Usuario: ' + spnUsuario.innerHTML, 14, 23)
            //doc.text('Hora: ' + hora, 170, 23)
            doc.setFontSize(16);
            doc.text('Solicitud de cotización', 84, 33);

            var blobPDF = new Blob([doc.output("blob")], { type: 'application/pdf' });
            var frm = new FormData();
            frm.append("correo", correo);
            frm.append("data", blobPDF);
            Http.post("General/enviarCorreo", mostrarEnviarCorreo, frm);
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

    var btnAgregarDetalle = document.getElementById("btnAgregarDetalle");
    if (btnAgregarDetalle != null) btnAgregarDetalle.onclick = function () {
        grabarDetalleItem();
    }

    var btnConsutarItems = document.getElementById("btnConsutarItems");
    if (btnConsutarItems != null) btnConsutarItems.onclick = function () {
        var idTipoBien = cboTipoSolicitud.value;
        if (idTipoBien != "") {
            Http.get("General/listarTabla?tbl=" + controller + "Items&data=" + idTipoBien, mostrarListadoItems);
        }
        else {
            mostrarMensaje("Seleccione tipo de solicitud", "error")
            cboTipoSolicitud.focus();
        }
    }

    //Modificacion Reutilizar Form
    var btnAgregar = document.getElementById("btnAgregar");
    if (btnAgregar != null) btnAgregar.onclick = function () {
        var data = "";
        if (vista == "PedidoCompra") {
            limpiarForm("PopupOfi");
            Http.get("General/listarTabla?tbl=" + controller + "Oficina" + "&data=" + data, listarOficinaOrdenCompra);
            divPopupContainerForm3.style.display = 'block';
        }
        else if (vista == "Cotizacion") {
            limpiarForm("PopupProv");
            Http.get("General/listarTabla?tbl=" + controller + "Proveedor" + "&data=" + data, listarOficinaOrdenCompra);
            divPopupContainerForm3.style.display = 'block';
        }
    }

    var btnCancelarForm3 = document.getElementById("btnCancelarForm3");
    if (btnCancelarForm3 != null) btnCancelarForm3.onclick = function () {
        divPopupContainerForm3.style.display = 'none';
    }

    var btnGuardarForm3 = document.getElementById("btnGuardarForm3");
    if (btnGuardarForm3 != null) btnGuardarForm3.onclick = function () {
        var validar = false;
        var clase_form = "", vista_proc = "";
        if (vista == "PedidoCompra") {
            if (validarInformacion("RequeOfi") == true) {
                validar = true;
                clase_form = "PopupOfi";
                vista_proc = "Oficina";
            }
        }
        else if (vista == "Cotizacion") {
            if (validarInformacion("RequeProv") == true) {
                validar = true;
                clase_form = "PopupProv";
                vista_proc = "Proveedor";
            }
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
                    grabarDatosOficinaPedidoCompra(clase_form, vista_proc);
                }
            })
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

    if (vista == "PAC") {

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
                    //Limpiar Formulario
                    var cboCatalogoItem = document.getElementById("select2-cboCatalogoItem-container");
                    if (cboCatalogoItem != null) cboCatalogoItem.innerHTML = "Seleccione";
                    cboUnidadMedida.value = "";
                    txtCantidad.value = "";
                    txtValorEstimado.value = "";
                    var divPopupContainerForm2 = document.getElementById("divPopupContainerForm2");
                    if (divPopupContainerForm2 != null) { divPopupContainerForm2.style.display = 'block'; };
                }
            }
        }

        var btnAgregarPacItems = document.getElementById("btnAgregarPacItems");
        if (btnAgregarPacItems != null) btnAgregarPacItems.onclick = function () {
            validarPCAItems();
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
                        //if (vista == "PedidoCompra") {
                        //    grabarPedido();
                        //}

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

}
function mostrarListadoPeriodo(rpta) {
    if (rpta) {
        var listas = rpta.split("|");
        var listaAnio = listas[0];
        var listaMesActual = listas[1];
        var listaMesSiguiente = listas[2];
        console.log(listas);

        txtAnio.value = listaAnio;
        cboPeriodoActual.value = listaMesActual;
        cboPeriodoSiguiente.value = listaMesSiguiente;
    }
}

function getReporteAyudas() {
    var anio = txtAnioFiscal.value;
    Http.get("General/listarTabla/?tbl=" + controller + vista + "AyudaItem&data=" + anio, mostrarReporteAyudas);
}

function mostrarReporteAyudas(rpta) {
    if (rpta) {
        var divPopupContainer = document.getElementById("divPopupContainer");
        if (divPopupContainer != null) divPopupContainer.style.display = 'block';
        var listas = rpta.split('¯');
        var listaItems = listas[0].split('¬');
        var listaMes = listas[1].split('¬');
        var listaProv = listas[2].split('¬');
        crearCombo(listaItems, "cboArticulo", "Seleccionar");
        //crearCombo(listaMes, "cboMes", "Todos");
        crearCombo(listaProv, "cboProveedor", "Seleccionar");
    }
    else {
        mostrarMensaje('No se encuentra el reporte disponible','error')
    }
}

function listarOficinaOrdenCompra(rpta) {
    if (rpta) {
        var listas = rpta.split("¯");

        if (vista == "PedidoCompra") {
            var listaEntidad = listas[1].split("¬");
            var listaOficinaPadre = listas[2].split("¬");
            var listaEstado = listas[3].split("¬");

            crearCombo(listaEntidad, "cboEntidad", "Seleccione");
            crearCombo(listaOficinaPadre, "cboOficinaPadre", "Primer Nivel");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "Cotizacion") {
            var listaDocumento = listas[1].split("¬");
            var listaBanco = listas[2].split("¬");
            var listaEstado = listas[3].split("¬");
            listaUbigeo = listas[4].split("¬");
            listarDepartamentos();

            crearCombo(listaDocumento, "cboTipoDocumento", "Seleccione");
            crearCombo(listaBanco, "cboBanco", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }


        var cboEntidad = document.getElementById("cboEntidad");
        if (cboEntidad != null) {
            cboEntidad.value = 1;
            cboEntidad.disabled = true;
        }
        var cboTipoDocumento = document.getElementById("cboTipoDocumento");
        if (cboTipoDocumento != null) {
            cboTipoDocumento.value = 4;
        }

        var dtgEsAgenteRetencion = document.getElementById("dtgEsAgenteRetencion");
        if (dtgEsAgenteRetencion != null) {
            $('#dtgEsAgenteRetencion').bootstrapToggle('off')
        }
        var dtgEsFinal = document.getElementById("dtgEsFinal");
        if (dtgEsFinal != null) {
            $('#dtgEsFinal').bootstrapToggle('off')
        }

        var cboEstado = document.getElementById("cboEstado");
        if (cboEstado != null) {
            cboEstado.value = 1;
            cboEstado.disabled = true;
        }

    }
}

function grabarDatosOficinaPedidoCompra(clase_frm, vista_proc) {
    var data = ""
    var frm = new FormData();
    data = obtenerDatosGrabar(clase_frm);
    frm.append("data", data);
    Http.post("General/guardar/?tbl=" + controller + vista_proc, OrdenCompraOficinaGrabar, frm);
}

function OrdenCompraOficinaGrabar(rpta) {

    if (rpta) {
        var listas = rpta.split("¯")
        mensajeResul = listas[1].split("|");
        var tipo = mensajeResul[0];
        var mensaje = mensajeResul[1];

        if (vista == "PedidoCompra") {
            document.getElementById('divPopupContainerForm3').style.display = 'none';
            var listaOficinaPadre = listas[3].split("¬");
            crearCombo(listaOficinaPadre, "cboOficina", "Seleccione");

        }
        else if (vista == "Cotizacion") {
            document.getElementById('divPopupContainerForm3').style.display = 'none';
            var listaProveedor = listas[2].split("¬");
            crearCombo(listaProveedor, "cboProveedor", "Seleccione");
        }

        if (tipo == 'A') {
            mostrarMensaje(mensaje, "success");
        }
        else {
            mostrarMensaje(mensaje, "error");
        }
    }
    else {
        mostrarMensaje("No se registro Datos", "error");
    }

}

function mostrarEnviarCorreo(rpta) {
    if (rpta) alert(rpta);
    else mostrarMensaje('ocurrio un error al enviar correo', 'error');
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

    var nFilas = tbDetallePedido.rows.length;
    var existe = false;
    for (var i = 0; i < nFilas; i++) {
        if (tbDetallePedido.rows[i].cells[0].innerHTML == item) {
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
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;'>";
        filaDetalle += '';
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;'>";
        filaDetalle += '';
        filaDetalle += "</td> ";
        filaDetalle += "<td style='white-space:pre-wrap;width:10px;vertical-align:top;'>";
        filaDetalle += "<i class='fa fa-trash f-16 text-c-red' title='Quitar Item' onclick='retirarItem(this,\"";
        filaDetalle += item;
        filaDetalle += "\");'></i>";
        filaDetalle += "</td> ";
        filaDetalle += "</tr>";
        tbDetallePedido.insertAdjacentHTML("beforeend", filaDetalle);
    }
    else mostrarMensaje("Existen Items ya agregados- verificar", "error");
    spnNroItems.innerHTML = "Items: " + (nFilas + 1);
    configurarEnterCantidad(tbDetallePedido, 8);
}

function retirarItem(col, id) {
    var fila = col.parentNode.parentNode;
    tbDetallePedido.removeChild(fila);
    var nFilas = 0;
    nFilas = tbDetallePedido.rows.length;
    spnNroItems.innerHTML = "Items: " + (nFilas);
    //var idSolicitud = txtIdRegistro.value;
    //var opera = 'D'
    //var data = "";
    //data = idSolicitud + '|' + id + '|' + opera + '| ';
    //var frm = new FormData();
    //frm.append("data", data);
    //post("Logistica/grabar/?Id=" + tabla + 'Detalle', mostrarGrabarDetalleItem, frm);
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

function validarPedido() {
    if (validarInformacion("Reque")) {
        var vExito = false;
        var fechaPedido = txtFechaPedido.value;
        var fechaRequerida = txtFechaRequerida.value;
        var nfilas = tbDetallePedido.rows.length;
        var fila;
        for (var i = 0; i < nfilas; i++) {
            fila = tbDetallePedido.rows[i];
            if (fila.cells[4].childNodes[0].value == 0 || fila.cells[4].childNodes[0].value == "") {
                vExito = false
            }
            else {
                vExito = true;
            }
        }

        if (fechaRequerida < fechaPedido) { mostrarMensaje("La fecha requerida no puede ser menor a la fecha de pedido", "error"); return false; }
        else if (nfilas == 0) {
            mostrarMensaje("Debe agregar items al Pedido", "error");
            return false;
        }
        else if (vExito == false) {
            mostrarMensaje("Debe ingresar cantidad solicitada a todos los items", "error");
            return false;
        }
        else {
            return true;
        }
    }
}

function grabarPedido() {
    var data = "";
    var idRegistro = txtIdRegistro.value;
    var tipoSolicitud = cboTipoSolicitud.value;
    var idArea = cboOficina.value;
    var justiciacion = ttaJusticiacion.value;
    var documentoReferencia = ttaDocumentoReferencia.value;

    var dFechaRecibo = document.getElementById("txtFechaPedido").value.split("-");
    var fechaEmision = dFechaRecibo[2] + "-" + dFechaRecibo[1] + "-" + dFechaRecibo[0];
    var dFechaVcto = document.getElementById("txtFechaRequerida").value.split("-");
    var fechaRequerida = dFechaVcto[2] + "-" + dFechaVcto[1] + "-" + dFechaVcto[0];

    data = idRegistro;
    data += "|";
    data += tipoSolicitud;
    data += "|";
    data += idArea;
    data += "|";
    data += documentoReferencia;
    data += "|";
    data += justiciacion;
    data += "|";
    data += fechaEmision;
    data += "|";
    data += fechaRequerida;
    data += "¯";

    var nfilas = tbDetallePedido.rows.length;
    var fila;
    for (var i = 0; i < nfilas; i++) {
        fila = tbDetallePedido.rows[i];
        data += fila.cells[0].innerHTML; //Item
        data += "|";
        data += fila.cells[4].childNodes[0].value; //Cantidad
        data += "¬";
    }
    data = data.substr(0, data.length - 1);

    var dFechaInicio = document.getElementById("txtFechaInicio").value.split("-");
    var txtFechaInicio = dFechaInicio[2] + "-" + dFechaInicio[1] + "-" + dFechaInicio[0];
    var dFechaFinal = document.getElementById("txtFechaFinal").value.split("-");
    var txtFechaFinal = dFechaFinal[2] + "-" + dFechaFinal[1] + "-" + dFechaFinal[0];

    data = data + '¯' + txtFechaInicio + '|' + txtFechaFinal

    var frm = new FormData();
    frm.append("data", data);
    Http.post("General/guardar?tbl=" + controller + vista, mostrarGrabar, frm);

    btnGuardar.innerHTML = "Guardando <i class='fa fa-circle-o-notch fa-spin' style='color:white'></i>";
    btnGuardar.disabled = true;
}

function configurarConsultas() {
    var txtRUC = document.getElementById("txtRUC");
    if (txtRUC != null) {
        txtRUC.onkeyup = function (event) {
            if (this.value != "" && this.value.length == 11 || (event.keyCode == 13)) {
                spnLoad.style.display = 'block';
                Http.get("General/consultaRucSunat/?ruc=" + this.value, mostrarDatosSunat);
            }

        }
    }
}

function mostrarListadoItems(rpta) {
    if (rpta) {
        divPopupContainerForm1.style.display = 'block';
        var listas = rpta.split('¯');
        lista = listas[0].split("¬");
        grillaItems = new GrillaScroll(lista, "listaItem", 1000, 6, "listaItems", "Admon", null, null, null, null, 25, false, true);
    }
}

function mostrarDatosSunat(rpta) {
    if (rpta != "") {
        var obj = JSON.parse(rpta);
        if (obj.success) {
            spnDocumento.innerHTML = "";
            var ttaDireccion = document.getElementById("ttaDireccion");
            if (ttaDireccion != null) ttaDireccion.value = obj.data.direccion_completa;
            var txtNombre = document.getElementById("txtNombre");
            if (txtNombre != null) txtNombre.value = obj.data.nombre_o_razon_social;
            divEstadoSunat.style.display = 'inline';
            lblEstadoSunat.innerHTML = obj.data.estado;
            lblCondicionSunat.innerHTML = obj.data.condicion;
            if (obj.data.es_agente_de_retencion == "NO") {
                $('#dtgEsAgenteRetencion').bootstrapToggle('off')
            }
            else {
                $('#dtgEsAgenteRetencion').bootstrapToggle('on')
            }
            spnLoad.style.display = 'none';
        }
        else {
            spnDocumento.innerHTML = "Nro de Documento no encontrado";
            spnDocumento.style.color = "red";
            spnLoad.style.display = 'none';
        }
    }
    else {
        spnDocumento.innerHTML = "Documento incorrecto o no existe enlace con SUNAT";
        spnDocumento.style.color = "red";
        spnLoad.style.display = 'none';
    }
}

function seleccionarFila(fila, id, prefijo) {
    idRegistro = id;
    window["id" + prefijo] = id;
    if (window["fila" + prefijo] != null) window["fila" + prefijo].className = "FilaDatos";
    fila.className = "FilaSeleccionada";
    window["fila" + prefijo] = fila;

    if (vista == "PedidoCompra") {
        estadoTabla = fila.childNodes[7].innerHTML;
        (estadoTabla == "GENERADA") ? btnAprobar.disabled = false : btnAprobar.disabled = true;
        if (estadoTabla == "APROBADA") {
            btnAprobar.innerHTML = "<i class='fa fa-reply fa-lg' aria-hidden='true'></i>";
            btnAprobar.setAttribute("Title", "Pendiente");
            btnAprobar.disabled = false
        }
    }
    else if (vista == "Cotizacion") {
        if (prefijo == "divLista") {
            txtProveedorCorreo.value = fila.childNodes[4].innerHTML;
            txtEmail.value = fila.childNodes[8].innerHTML;
        }
        else if (prefijo == "listaPendientes") {
            Http.get("General/listarTabla/?tbl=" + controller + vista + "DetalleItem&data=" + id, mostrarSolicitudDetalle);
        }
    }
    else if (vista == "CuadroCompara" && prefijo == "listaPendientes") {
        Http.get("General/listarTabla/?tbl=" + controller + vista + "DetalleItem&data=" + id, mostrarSolicitudDetalle);
    }
    else if (vista == "OrdenCompra") {
        if (prefijo == "lista") {
            empresa = fila.childNodes[3].innerHTML;
            estadoTabla = fila.childNodes[8].innerHTML;
            if (estadoTabla == "EMITIDA") {
                tdEtiquetaIAFAS.innerHTML = "&nbsp;";
                snpEtiquetaMGP.innerHTML = "";
            }
            else {
                tdEtiquetaIAFAS.innerHTML = "PENDIENTE";
                snpEtiquetaMGP.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PENDIENTE";
            }
        }
        if (prefijo == "listaPendientes") {
            idSolCompra = id;
            var listaProveedor = document.getElementById("listaProveedor");
            if (listaProveedor != null) listaProveedor.innerHTML = "";

            var listaProductos = document.getElementById("listaProductos");
            if (listaProductos != null) listaProductos.innerHTML = "";

            var divItems = document.getElementById("divItems");
            if (divItems != null) divItems.innerHTML = "";

            var divSeleccionado = document.getElementById("divSeleccionado");
            if (divSeleccionado != null) divSeleccionado.innerHTML = "";

            var divTotal = document.getElementById("divTotal");
            if (divTotal != null) divTotal.innerHTML = "";

            Http.get("General/listarTabla/?tbl=" + controller + vista + "Proveedores&data=" + id, mostrarParametrosOrden);
        }

        if (prefijo == "listaProveedor") {

            idProveedor = fila.childNodes[0].innerHTML;
            var data = idSolCompra + '|' + idProveedor;

            Http.get("General/listarTabla/?tbl=" + controller + vista + "DetalleItem&data=" + data, mostrarEvaluacionDetalle);
        }
    }
}

function mostrarParametrosOrden(rpta) {
    if (rpta) {
        var listas = rpta.split("¯");
        var listaCC = listas[0].split("¬");
        var listaProveedor = listas[1].split("¬");
        generarTablaItem(listaProveedor, "listaProveedor", "tblProveedor", null, true);
    }
}


function mostrarEvaluacionDetalle(rpta) {
    var contenido = "";
    var textoDescripcion = ""
    var campos = [];
    var lista = rpta.split('¬');
    var nRegistros = lista.length;
    var campos = lista[0].split("|");
    var anchos = lista[1].split("|");
    var total = 0;
    var nCampos = campos.length;
    contenido = "<table class='grilla bordered table-fija'><thead><tr class='FilaHead'>";
    for (var z = 0; z < nCampos; z++) {
        if (z == 0 || z == 1 || z == 2) {
            contenido += "<th style='white-space:pre-wrap;display:none;width:";
            contenido += anchos[z];
            contenido += "px'>";
            contenido += campos[z];
            contenido += "</th>";
        }
        else {
            contenido += "<th style='white-space:pre-wrap;width:";
            contenido += anchos[z];
            contenido += "px'>";
            contenido += campos[z];
            contenido += "</th>";
        }
    }
    contenido += "<th style='vertical-align:top;text-align:center'>";
    contenido += "<div class='chk-option'>";
    contenido += "<div class='checkbox-fade fade-in-warning'>";
    contenido += "<label class='check-task'>";
    contenido += "<input type='checkbox' onclick='seleccionarTodo(this);' id='chkAll'>";
    contenido += "<span class='cr'>";
    contenido += "<i class='cr-icon fa fa-check txt-default'></i>";
    contenido += "</span>";
    contenido += "</label>";
    contenido += "</div>";
    contenido += "</div>";
    contenido += "</th>";
    contenido += "</tr></thead><tbody id='tbDetalleItem'>";

    for (var i = 3; i < nRegistros; i++) {
        campos = lista[i].split("|");
        contenido += "<tr>";
        contenido += "<td style='white-space:pre-wrap;width:";
        contenido += anchos[0];
        contenido += "px;display: none'>";
        contenido += campos[0];
        contenido += "</td> ";
        contenido += "<td style='white-space:pre-wrap;width:";
        contenido += anchos[1];
        contenido += "px;display: none'>";
        contenido += campos[1];
        contenido += "</td> ";
        contenido += "<td style='white-space:pre-wrap;width:";
        contenido += anchos[2];
        contenido += "px;display: none'>";
        contenido += campos[2];
        contenido += "</td> ";
        contenido += "<td style='white-space:pre-line;white-space:-moz-pre-wrap;white-space:-o-pre-wrap;width:";
        contenido += anchos[3];
        contenido += "px;'>";
        contenido += campos[3];
        textoDescripcion += campos[3];
        contenido += "</td>";
        contenido += "<td style='white-space:pre-wrap;width:";
        contenido += anchos[4];
        contenido += "px;vertical-align: top; '>";
        contenido += campos[4];
        contenido += "</td> ";
        contenido += "<td style='white-space:pre-wrap;width:";
        contenido += anchos[5];
        contenido += "px;vertical-align: top; text-align: right'>";
        contenido += formatoNumeroDecimal(campos[5]);
        contenido += "</td> ";
        contenido += "<td style='white-space:pre-wrap;width:";
        contenido += anchos[6];
        contenido += "px;vertical-align: top; text-align: right'>";
        contenido += formatoNumeroDecimal(campos[6]);
        contenido += "</td> ";
        contenido += "<td style='white-space:pre-wrap;width:";
        contenido += anchos[7];
        contenido += "px;vertical-align: top; text-align: right'>";
        contenido += formatoNumeroDecimal(campos[7]);
        total = total + (campos[7] * 1);
        contenido += "</td> ";
        contenido += "<td style='white-space:pre-wrap;vertical-align:top;text-align:center'>";
        contenido += "<div class='chk-option'>";
        contenido += "<div class='checkbox-fade fade-in-primary'>";
        contenido += "<label class='check-task'>";
        contenido += "<input type='checkbox' class='chkPopup' onclick='contarProductos();' id='chk";
        contenido += campos[0];
        contenido += "' value='";
        contenido += campos[0] + '|' + campos[1] + '|' + campos[2] + '|' + campos[3] + '|' + campos[4] + '|' + campos[5] + '|' + campos[6] + '|' + campos[7];
        contenido += "');'> <span class='cr'>";
        contenido += "<i class='cr-icon fa fa-check txt-default'></i>";
        contenido += "</span>";
        contenido += "</label>";
        contenido += "</div>";
        contenido += "</div>";
        contenido += "</td>";
        contenido += "</tr>";
    }
    contenido += "</tbody>";
    contenido += "</table>";
    listaProductos.innerHTML = contenido;
    divTotal.innerHTML = "Total cotización: " + formatoNumeroDecimal(total);
    var divSeleccionado = document.getElementById("divSeleccionado");
    if (divSeleccionado != null) divSeleccionado.innerHTML = "Seleccionados: 0";
    nFilasSeleccionadas = textoDescripcion.split("\n").length
    var nFilas = tbDetalleItem.rows.length;
    var divItems = document.getElementById("divItems");
    if (divItems != null) divItems.innerHTML = 'Items: ' + nFilas;
}

function seleccionarTodo(controChk) {
    var controles = document.getElementsByClassName("chkPopup");
    var nControles = controles.length;
    var control;
    if (controChk.checked) {
        for (i = 0; i < nControles; i++) {
            control = controles[i];
            control.checked = 1
        }
    }
    else {
        for (i = 0; i < nControles; i++) {
            control = controles[i];
            control.checked = 0
        }
    }

    var nfilas = contarProductos();
    var divSeleccionado = document.getElementById("divSeleccionado");
    if (divSeleccionado != null) divSeleccionado.innerHTML = "Seleccionados: " + nfilas;
}

function contarProductos() {
    var controles = document.getElementsByClassName("chkPopup");
    var nControles = controles.length;
    var control;
    var nFilas = 0;
    for (i = 0; i < nControles; i++) {
        control = controles[i];
        if (control.checked == true) {
            nFilas = nFilas + 1;
        }
    }
    divSeleccionado.innerHTML = "Seleccionados: " + nFilas;
    return nFilas;
}

function mostrarSolicitudDetalle(rpta) {
    if (rpta) {
        if (vista == 'CuadroCompara') {
            var listas = rpta.split('¯');
            var lista = listas[0].split('¬');
            generarPivot(lista, "listaDetalle");
            var listaProveedores = listas[1].split("¬");
            var listaTipoEjecucion = listas[2].split("¬");
            crearCombo(listaProveedores, "cboProveedor", "Seleccionar");
            crearCombo(listaTipoEjecucion, "cboTipoEjecucion", "Seleccionar");
            divBuenaPro.style.display = 'inline';
        }
        else {
            var contenido = "";
            tbDetallePedido.innerHTML = "";
            var lista = rpta.split('¬');
            var nRegistros = lista.length;
            var campos = [];
            for (var i = 0; i < nRegistros; i++) {
                campos = lista[i].split("|");
                contenido += "<tr>";
                contenido += "<td style='display:none'>";
                contenido += campos[0];
                contenido += "</td> ";
                contenido += "<td style='display:none'>";
                contenido += campos[1];
                contenido += "</td> ";
                contenido += "<td style='vertical-align:top'>";
                contenido += campos[2];
                contenido += "</td> ";
                contenido += "<td style='max-width:600px;white-space: pre-line;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
                if (campos[4].length != 0) {
                    contenido += "<h6>";
                    contenido += campos[3];
                    contenido += "</h6>";
                    contenido += "<p style='white-space:pre-line;'>";
                    contenido += campos[4];
                    contenido += "</p>";
                }
                else {
                    contenido += "<h6>";
                    contenido += campos[3];
                    contenido += "</h6>";
                }
                contenido += "</td>";
                contenido += "<td style='vertical-align:top;'>";
                contenido += campos[5];
                contenido += "</td> ";
                contenido += "<td style='vertical-align:top;text-align:right'>";
                contenido += campos[6];
                contenido += "</td> ";
                contenido += "</tr>";
            }
            tbDetallePedido.innerHTML = contenido;

            var spnNroItems = document.getElementById("spnNroItems");
            if (spnNroItems != null) spnNroItems.innerHTML = 'Items: ' + nRegistros;
        }
    }
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
            editarRegistro(idRegistro);
        }
        if (idBoton == "Eliminar") {
            eliminarRegistro(idRegistro)
        }
        if (idBoton == "Proceso") {
            var txtIdPac = document.getElementById("txtIdPac");
            if (txtIdPac != null) { txtIdPac.value = idRegistro }

            Http.get("General/obtenerTabla/?tbl=" + controller + vista + idBoton + '&id=' + idRegistro, mostrarRegistro);

        }
    }
}

function editarRegistro(id) {
    Http.get("General/obtenerTabla/?tbl=" + controller + vista + '&id=' + id, mostrarRegistro);
}

function editarPedidoCompra(rpta) {
    var divPopupContainer = document.getElementById("divPopupContainer");
    if (divPopupContainer != null) { divPopupContainer.style.display = 'block'; };
    var listas = rpta.split('¯');
    var cabecera = listas[0].split('|');
    var detalle = listas[1].split('¬');
    txtIdRegistro.value = cabecera[0];
    cboTipoSolicitud.value = cabecera[1];
    txtNroPedido.value = cabecera[2];
    var dFecha = cabecera[3].split("/");
    txtFechaPedido.value = dFecha[2] + "-" + dFecha[1] + "-" + dFecha[0];
    var dFechaReque = cabecera[4].split("/");
    txtFechaRequerida.value = dFechaReque[2] + "-" + dFechaReque[1] + "-" + dFechaReque[0];
    ttaJusticiacion.value = cabecera[6];
    operacion = 1;
    if (cabecera[7] == "GENERADA") {
        lblEstado.innerHTML = cabecera[7];
        lblEstado.style.color = 'blue';
        btnGuardar.style.display = 'block';
        btnConsutarItems.style.display = 'block';
    }
    else {
        lblEstado.innerHTML = cabecera[7];
        lblEstado.style.color = 'red';
        btnGuardar.style.display = 'none';
        btnConsutarItems.style.display = 'none';
    }
    ttaDocumentoReferencia.value = cabecera[8];
    cboOficina.value = cabecera[5];
    var controlSelect = 'select2-' + cboOficina.id + '-container';
    var cboControlSelect = document.getElementById(controlSelect);
    if (cboControlSelect != null) {
        var selected = cboOficina.options[cboOficina.selectedIndex].text;
        cboControlSelect.innerHTML = selected;
    }

    if (cabecera != null || cabecera != "") {
        getDetalleItem(detalle);
    }

    btnGuardar.innerHTML = "<i class='fa fa-save'></i> Grabar";
    btnGuardar.disabled = false;

}

function grabarDetalleItem() {
    var data = "";
    var idRegistro = txtIdRegistro.value;
    var idItem = lblnombreItem.getAttribute("data-id");
    var detalleItem = txtDetalleItem.value;
    var opera = 'A';
    data = idRegistro + '|' + idItem + '|' + opera + '|' + detalleItem;
    var frm = new FormData();
    frm.append("data", data);
    Http.post("General/guardar/?tbl=" + controller + vista + 'Detalle', mostrarGrabarDetalleItem, frm);
}

function getDetalleItem(rpta) {
    var contenido = "";
    tbDetallePedido.innerHTML = "";
    var nRegistros = rpta.length;
    var campos = [];
    for (var i = 0; i < nRegistros; i++) {
        campos = rpta[i].split("|");
        contenido += "<tr>";
        contenido += "<td style='display:none'>";
        contenido += campos[0];
        contenido += "</td> ";
        contenido += "<td style='vertical-align:top'>";
        contenido += campos[1];
        contenido += "</td> ";
        contenido += "<td style='vertical-align:top;width:500px;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
        if (campos[7].length != 0) {
            contenido += "<h6>";
            contenido += campos[2];
            contenido += "</h6>";
            contenido += "<p style='white-space:pre-line;'>";
            contenido += campos[7];
            contenido += "</p>";
        }
        else {
            contenido += campos[2];
        }
        contenido += "</td> ";
        contenido += "<td style='vertical-align:top'>";
        contenido += campos[3];
        contenido += "</td> ";
        if (lblEstado.innerHTML == "GENERADA") {
            contenido += "<td style='vertical-align:top;width:90px;padding:0px'>";
            contenido += "<input type='number' style='text-align:right;width:100%;border:1px solid blue;height:25px;padding:0px' min=1 value=";
            contenido += campos[4];
            contenido += "></td> ";
        }
        else {
            contenido += "<td style='vertical-align:top;text-align:right'>";
            contenido += campos[4];
            contenido += "</td> ";
        }
        contenido += "<td style='vertical-align:top;text-align:right'>";
        contenido += campos[5];
        contenido += "</td> ";
        contenido += "<td style='vertical-align:top;text-align:right'>";
        contenido += campos[6];
        contenido += "</td> ";
        contenido += "<td style='vertical-align:top'>";
        if (lblEstado.innerHTML == "GENERADA") {
            contenido += "<i class='fa fa-pencil-square-o f-16 m-r-15'  title='Agregar detalle' onclick='agregarDetalle(\"";
            contenido += campos[2];
            contenido += "\",\"";
            contenido += campos[0];
            contenido += "\")'></i>";
            contenido += "<i class='fa fa-trash f-16 text-c-red' title='Quitar Item' onclick='retirarItem(this,\"";
            contenido += campos[0];
            contenido += "\");'></i>";
        }
        contenido += "</td> ";
        contenido += "</tr>";
    }
    tbDetallePedido.innerHTML = contenido;
    spnNroItems.innerHTML = 'Items: ' + nRegistros;
}

function agregarDetalle(nombreItem, idItem) {
    var data = "";
    txtDetalleItem.value = "";
    divPopupContainerForm2.style.display = 'block';
    lblnombreItem.innerHTML = nombreItem;
    lblnombreItem.setAttribute("data-id", idItem);
    var idRegistro = txtIdRegistro.value;
    data = idRegistro + '|' + idItem;
    Http.get("General/obtenerTabla/?tbl=" + controller + vista + "Detalle&id=" + data, mostrarDetalleItem);
}

function mostrarDetalleItem(rpta) {
    if (rpta) {
        operacion = 1;
        txtDetalleItem.value = rpta;
    } else {
        operacion = 0;
    }
}

function mostrarRegistro(rpta) {
    if (rpta) {
        var campos = rpta.split("|");
        var controlesSelectSearch = document.getElementsByClassName("SelectSearch");
        var nControlesSelectSearch = controlesSelectSearch.length;
        var cboEstado = document.getElementById("cboEstado");
        if (cboEstado != null) { cboEstado.disabled = false };

        if (vista == "PedidoCompra") {
            editarPedidoCompra(rpta);
        }
        else if (vista == "SolicitudCompra") {
            document.getElementById("divPopupContainerForm1").style.display = 'block';
            var listas = rpta.split('¯');
            var cabecera = listas[0].split('|');
            var detalle = listas[1].split('¬');
            lblNumero.innerHTML = cabecera[0];
            lblFechaEmision.innerHTML = cabecera[1];
            lblTipo.innerHTML = cabecera[2];
            lblEstado.innerHTML = cabecera[3];

            generarTablaItem(detalle, "listaDetalle", "tblDetalle", null);
        }
        else if (vista == "Cotizacion") {
            document.getElementById("divPopupContainerForm1").style.display = 'block';
            var listas = rpta.split('¯');
            var cabecera = listas[0].split('|');
            var detalle = listas[1].split('¬');
            txtIdRegistro.value = cabecera[0];
            lblNumero.innerHTML = cabecera[1];
            lblFechaEmision.innerHTML = cabecera[2];
            lblProveedor.innerHTML = cabecera[3];
            lblCondicionCompra.innerHTML = cabecera[4];
            lblNroSolicitud.innerHTML = cabecera[5];
            ttaComentarioCoti.value = cabecera[6];
            lblEstado.innerHTML = cabecera[10];
            txtProforma.value = cabecera[7];
            var dFecha = cabecera[8].split("/");
            txtFechaProforma.value = dFecha[2] + "-" + dFecha[1] + "-" + dFecha[0];
            ttaComentarioProveedor.value = cabecera[9];
            txtDiasEntrega.value = cabecera[11];
            txtGarantia.value = cabecera[12];
            txtTipoSolicitud.value = cabecera[13];
            if (cabecera[10] == "PENDIENTE" || cabecera[10] == "PROFORMADA") {
                btnActualizar.style.display = 'inline';
            }
            else {
                btnActualizar.style.display = 'none';
            }

            var campos = detalle[0].split("|");
            var anchos = detalle[1].split("|");
            var nRegistros = detalle.length;
            var nCampos = campos.length;
            var contenido = "<table cellpadding='0' cellspacing='0' class='grilla bordered Tabla table-fija'><thead><tr class='FilaHead'>";
            for (var z = 0; z < nCampos; z++) {

                if (z == 0) {
                    contenido += "<th style='display:none;width:";
                    contenido += anchos[z];
                    contenido += "px'>";
                    contenido += campos[z];
                    contenido += "</th>";
                }
                else {
                    contenido += "<th style='white-space:pre-wrap;width:";
                    contenido += anchos[z];
                    contenido += "px'>";
                    contenido += campos[z];
                    contenido += "</th>";
                }
            }
            contenido += "</tr></thead><tbody id='tbDetalleItem'>";
            for (var i = 3; i < nRegistros; i++) {
                campos = detalle[i].split("|");
                contenido += "<tr>";
                for (var j = 0; j < nCampos; j++) {
                    if (j == 0) {
                        contenido += "<td style='vertical-align:top;display:none;width:";
                        contenido += anchos[j];
                        contenido += "px'>";
                        contenido += campos[j];
                        contenido += "</td>";
                    }
                    else if (j == 5) {
                        if (cabecera[10] == "PENDIENTE" || cabecera[10] == "PROFORMADA") {
                            contenido += "<td style='vertical-align:top; padding:2px;width:";
                            contenido += anchos[j];
                            contenido += "px'>";
                            contenido += "<input type='number' min='1' style='text-align:right;width:100%;border:1px solid blue;height:25px;' onkeyup='totalCotizacion(\"I\");' value='"
                            contenido += formatoNumeroDecimal(campos[j]);
                            contenido += "'>";
                            contenido += "</td>";
                        }
                        else {
                            contenido += "<td style='vertical-align:top;text-align:right;width:";
                            contenido += anchos[j];
                            contenido += "px'>";
                            contenido += formatoNumeroDecimal(campos[j]);
                            contenido += "</td>";
                        }
                    }
                    else if (j == 4) {
                        contenido += "<td style='vertical-align:top;text-align:right;white-space:pre-wrap;width:";
                        contenido += anchos[j];
                        contenido += "px'>";
                        contenido += formatoNumeroDecimal(campos[j]);
                        contenido += "</td>";
                    }
                    else {
                        contenido += "<td style='vertical-align:top;text-align:left;white-space:pre-wrap;width:";
                        contenido += anchos[j];
                        contenido += "px'>";
                        contenido += campos[j];
                        contenido += "</td>";
                    }
                }
            }
            contenido += "</tr>";
            contenido += "</tbody>";
            contenido += "</table>";
            var div = document.getElementById("listaDetalle");
            div.innerHTML = contenido;
            configurarEnterCantidad(tbDetalleItem, 5);
            totalCotizacion();

        }
        else if (vista == "OrdenCompra") {
            ttaPedidos.value = "";
            document.getElementById("divPopupContainerForm1").style.display = 'block';
            var listas = rpta.split('¯');
            var cabecera = listas[0].split('|');
            var detalle = listas[1];
            txtIdRegistro.value = cabecera[0];
            lblNumero.innerHTML = cabecera[1];
            lblTipo.innerHTML = cabecera[3];
            txtFechaEmision.value = cabecera[4];
            idProveedor = cabecera[5];
            lblProveedor.innerHTML = cabecera[6];
            lblCotizacion.innerHTML = cabecera[7];
            lblProforma.innerHTML = cabecera[8];
            lblDiasEntrega.innerHTML = cabecera[9];
            lblCondicionCompra.innerHTML = cabecera[11];
            lblEstado.innerHTML = cabecera[12];
            ttaPedidos.value = cabecera[13];
            //lblArea.innerHTML = cabecera[14];
            cboFteFto.value = cabecera[15];
            ttaJustificacion.value = cabecera[16];
            //if (cabecera[19] == "0.00") {
            //    lblChkIgv.innerHTML = "NO";
            //    chkIgv.checked = false;
            //    chkIgv.disabled = true;
            //}
            //else {
            //    lblChkIgv.innerHTML = "SI";
            //    chkIgv.checked = true;
            //    chkIgv.disabled = true;
            //}

            lblSubTotal.innerHTML = formatoNumeroDecimal(cabecera[17]);
            lblIGV.innerHTML = formatoNumeroDecimal(cabecera[18]);
            lblTotal.innerHTML = formatoNumeroDecimal(cabecera[19]);
            lblGarantia.innerHTML = cabecera[21];
            lblUsuarioCreacion.innerHTML = cabecera[22];
            lblFechaCreacion.innerHTML = cabecera[23];
            idSolCompra = cabecera[20];
            if (cabecera[12] != "GENERADA") {
                btnGuardar.style.display = 'none';
                btnGuardar.disabled = true;

                cboFteFto.disabled = true;
                ttaJustificacion.disabled = true;
            }
            else {
                btnGuardar.style.display = 'inline';
                btnGuardar.disabled = false;

                cboFteFto.disabled = false;
                ttaJustificacion.disabled = false;
            }
            generarDetalleOrdenCompra(detalle);
        }
        else if (vista == "Asigpre") {
            document.getElementById("divPopupContainer").style.display = 'block';
            var listas = rpta.split('¯');
            var cabecera = listas[0].split('|');
            var detalle = listas[1];
            txtIdRegistro.value = cabecera[0];
            lblNumero.innerHTML = cabecera[1];
            lblTipo.innerHTML = cabecera[3];
            lblFechaEmision.innerHTML = cabecera[4];
            idProveedor = cabecera[5];
            lblProveedor.innerHTML = cabecera[6];
            lblCotizacion.innerHTML = cabecera[7];
            lblProforma.innerHTML = cabecera[8];
            lblDiasEntrega.innerHTML = cabecera[9];
            lblCondicionCompra.innerHTML = cabecera[11];
            lblEstado.innerHTML = cabecera[12];
            ttaPedidos.value = cabecera[14];
            //  cboEmpresa.value = cabecera[15];
            // listarFteFto();
            cboFteFto.value = cabecera[15];
            ttaJustificacion.value = cabecera[16];


            lblSubTotal.innerHTML = formatoNumeroDecimal(cabecera[17]);
            lblIGV.innerHTML = formatoNumeroDecimal(cabecera[18]);
            lblTotal.innerHTML = formatoNumeroDecimal(cabecera[19]);
            idSolCompra = cabecera[20];
            lblGarantia.innerHTML = cabecera[23];
            //txtProceso.value = cabecera[25];
            //txtEcofin.value = cabecera[26];
            if (cabecera[21] == "") {
                txtAnioFiscal.value = cabecera[24];
            } else {
                txtAnioFiscal.value = cabecera[21];
            }
            cboMes.value = cabecera[25];
            cboMes.disabled = true;

            if (cabecera[12] != "GENERADA") {
                btnGuardar.style.display = 'none';
                btnGuardar.disabled = true;
                //   cboEmpresa.disabled = true;
                cboFteFto.disabled = true;
                ttaJustificacion.disabled = true;
                btnConfirmarPeriodo.style.display = 'none';
                btnConfirmarPeriodo.disabled = true;
            }
            else {
                btnGuardar.style.display = 'inline';
                btnGuardar.disabled = false;
                //cboEmpresa.disabled = false;
                cboFteFto.disabled = false;
                ttaJustificacion.disabled = false;
                btnConfirmarPeriodo.style.display = 'inline';
                btnConfirmarPeriodo.disabled = false;
            }

            if (cabecera[25] != "" && cabecera[12] == "GENERADA") {
                generarDetalleOrdenCompraAsig(detalle, 2);
            }
            else {
                generarDetalleOrdenCompraAsig(detalle, 1);
            }
        }
        else if (vista == "CuadroCompara") {
            document.getElementById("divPopupContainerForm1").style.display = 'block';
            var listas = rpta.split('¯');
            var cabecera = listas[0].split('|');
            var detalle = listas[1].split('¬');
            lblNumero.innerHTML = cabecera[0];
            lblFechaEmision.innerHTML = cabecera[1];
            lblNroSolicitud.innerHTML = cabecera[2];
            lblPedido.innerHTML = cabecera[3];
            lblEstado.innerHTML = cabecera[4];
            generarPivot(detalle, "listaDetallePrevia");
        }
        else if (vista == "Articulo") {
            document.getElementById("divPopupContainer").style.display = 'block';
            txtIdRegistro.value = campos[0];
            cboTipoBien.value = campos[1];
            listarGrupoItem();
            cboGrupo.value = campos[2];
            document.getElementById('select2-cboGrupo-container').innerHTML = cboGrupo.options[cboGrupo.selectedIndex].text;
            listarClaseItem();
            cboClase.value = campos[3];
            document.getElementById('select2-cboClase-container').innerHTML = cboClase.options[cboClase.selectedIndex].text;
            listarFamiliaItem();
            document.getElementById('select2-cboFamilia-container').innerHTML = cboClase.options[cboClase.selectedIndex].text;
            cboFamilia.value = campos[4];
            txtCodigo.value = campos[5];
            cboTipoItem.value = campos[6];
            cboUniMed.value = campos[7];
            txtNombre.value = campos[8];
            cboEstado.value = campos[9];
        }
        else if (vista == "Clase") {
            document.getElementById("divPopupContainer").style.display = 'block';
            cboTipoBien.value = campos[0];
            listarGrupoItem();
            cboGrupo.value = campos[1];
            document.getElementById('select2-cboGrupo-container').innerHTML = cboGrupo.options[cboGrupo.selectedIndex].text;
            txtIdRegistro.value = campos[2];
            txtCodigo.value = campos[2];
            txtNombre.value = campos[3];
            cboEstado.value = campos[4];
        }
        else if (vista == "Familia") {
            document.getElementById("divPopupContainer").style.display = 'block';
            txtIdRegistro.value = campos[3];
            cboTipoBien.value = campos[0];
            listarGrupoItem();
            cboGrupo.value = campos[1];
            document.getElementById('select2-cboGrupo-container').innerHTML = cboGrupo.options[cboGrupo.selectedIndex].text;
            listarClaseItem();
            cboClase.value = campos[2];
            document.getElementById('select2-cboClase-container').innerHTML = cboClase.options[cboClase.selectedIndex].text;
            txtNombre.value = campos[4];
            cboEstado.value = campos[5];
        }
        //else if (vista == "PAC") {
        //    var txtIdPacPr = document.getElementById("txtIdPac").value;
        //    if (txtIdPacPr != "0") {

        //        if (campos[0] != '0¯0') {
        //            var listaCabe = rpta.split("¯")[0];
        //            var listaDetalle = rpta.split("¯")[1];
        //            campos = listaCabe.split("|");

        //            txtIdPac.value = campos[0];
        //            txtIdPacProceso.value = campos[1];
        //            cboTipoItem.value = campos[2];
        //            cboTipoCompra.value = campos[3];
        //            txtEntidadConv.value = campos[4];
        //            cboTipo.value = campos[5];
        //            cboTipoProceso.value = campos[6];
        //            cboObjetoContratacion.value = campos[7];
        //            cboAntecedentes.value = campos[8];
        //            txtComentarioAntecedente.value = campos[9];
        //            txtDescripcionServicio.value = campos[10];
        //            cboFuenteFto.value = campos[11];
        //            cboOficinaProceso.value = campos[12];
        //            cboFechaPrevista.value = campos[13];

        //            listarDepartamentos();
        //            cboDepartamento.value = campos[14];
        //            document.getElementById('select2-cboDepartamento-container').innerHTML = cboDepartamento.options[cboDepartamento.selectedIndex].text;
        //            listarProvincias();
        //            cboProvincia.value = campos[15];
        //            document.getElementById('select2-cboProvincia-container').innerHTML = cboProvincia.options[cboProvincia.selectedIndex].text;
        //            listarDistritos();
        //            cboDistrito.value = campos[16];
        //            document.getElementById('select2-cboDistrito-container').innerHTML = cboDistrito.options[cboDistrito.selectedIndex].text;
        //            cboTipoMoneda.value = campos[17];
        //            txtTipoCambio.value = campos[18];
        //            txtObservaciones.value = campos[19];

        //            let comentarioAntecedente = document.getElementById("txtComentarioAntecedente");
        //            if (campos[9] == "") {
        //                comentarioAntecedente.readOnly = true;
        //            }
        //            else {
        //                comentarioAntecedente.readOnly = false;
        //            }
        //            //Detalle
        //            tbDetalleItemPac.innerHTML = "";
        //            listasDetalleItemPacProcesos(listaDetalle);

        //        }
        //        else {
        //            var idpac = txtIdPac.value;
        //            limpiarForm("Popuproceso");
        //            tbDetalleItemPac.innerHTML = "";
        //            tbBodyDetalleItemPac.innerHTML = "";
        //            txtIdPac.value = idpac;
        //            listarDepartamentos();
        //            document.getElementById("txtComentarioAntecedente").readOnly = true;

        //        }

        //        listarItemInventario();
        //        var divPopupContainerForm1 = document.getElementById("divPopupContainerForm1");
        //        if (divPopupContainerForm1 != null) { divPopupContainerForm1.style.display = 'block'; };
        //    }
        //    else {

        //        txtIdRegistro.value = campos[0];
        //        cboEntidadPAC.value = campos[1];
        //        txtAnioPAC.value = campos[2];
        //        txtVersion.value = campos[3];
        //        txtAprobacion.value = campos[4];
        //        cboEstado.value = campos[5];

        //        var divPopupContainer = document.getElementById("divPopupContainer");
        //        if (divPopupContainer != null) { divPopupContainer.style.display = 'block'; };
        //    }

        //}
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
                        if (vista == "Proveedor") {
                            listarDepartamentos();
                            cboDepartamento.value = campos[9];
                            document.getElementById('select2-cboDepartamento-container').innerHTML = cboDepartamento.options[cboDepartamento.selectedIndex].text;
                            listarProvincias();
                            cboProvincia.value = campos[10];
                            document.getElementById('select2-cboProvincia-container').innerHTML = cboProvincia.options[cboProvincia.selectedIndex].text;
                            listarDistritos();
                            cboDistrito.value = campos[11];
                            document.getElementById('select2-cboDistrito-container').innerHTML = cboDistrito.options[cboDistrito.selectedIndex].text;
                        }
                        else {
                            if (nControlesSelectSearch > 0)
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


function grabarConfiguracion() {
    var data = "";
    var frm = new FormData();

    if (idTabActivo == "tabAutorizacion") {
        var idDirector = cboDirector.value
        var idRegistroDirector = cboDirector.getAttribute('data-id');
        var idJeLog = cboJelog.value
        var idRegistroJeLog = cboJelog.getAttribute('data-id');

        var idJelogAlma = cboJelogAlma.value
        var idRegistroJelogAlma = cboJelogAlma.getAttribute('data-id');
        var idJefeAlmacen = cboJefeAlmacen.value
        var idRegistroJefeAlmacen = cboJefeAlmacen.getAttribute('data-id');

        data = idRegistroDirector + '|' + idDirector + '|' + idRegistroJeLog + '|' + idJeLog + '|' + idRegistroJelogAlma + '|' + idJelogAlma + '|' + idRegistroJefeAlmacen + '|' + idJefeAlmacen
        frm.append("data", data);
        Http.post("General/guardar/?tbl=" + controller + vista + 'Autorizacion', mostrarGrabarConfiguracion, frm);
    }
}

function grabarDatos() {
    var data = ""
    var frm = new FormData();
    data = obtenerDatosGrabar("Popup");
    if (vista == "Periodo") {
        data += data + '¯' + txtAnioFiscal.value;
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

function mostrarGrabarDetalleItem(rpta) {
    var mensajeResul = [];
    var tipo = "";
    if (rpta) {
        listas = rpta.split("¯")
        lista = listas[0].split("¬");
        mensajeResul = listas[1].split("|");
        tipo = mensajeResul[0];
        var mensaje = mensajeResul[1];
        if (tipo == 'A') {
            alerta = "success";
            getDetalleItem(lista);
        }
        else {
            alerta = "error";
        }
    }
    else {
        mensaje = "Error: intentelo nuevamente";
        alerta = "error";
    }
    if (tipo != 'Z') mostrarMensaje(mensaje, alerta);

    divPopupContainerForm2.style.display = 'none';
    txtDetalleItem.value = "";

}

function mostrarGrabarConfiguracion(rpta) {
    var mensajeResul = [];
    if (rpta) {
        mensajeResul = rpta.split("|");
        var tipo = mensajeResul[0];
        var mensaje = mensajeResul[1];
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
        Swal.fire({
            title: 'Error!',
            text: 'No se realizó el registro-verificador datos',
            icon: 'error',
            showConfirmButton: true,
            timer: 2000
        })
    }

    btnGuardar.innerHTML = "<i class='fa fa-save'></i> Grabar";
    btnGuardar.disabled = false;
}

function mostrarGrabar(rpta) {
    var mensajeResul = [];
    if (rpta) {
        listas = rpta.split("¯")
        lista = listas[0].split("¬");
        mensajeResul = listas[1].split("|");
        var tipo = mensajeResul[0];
        var mensaje = mensajeResul[1];
        document.getElementById('divPopupContainer').style.display = 'none';

        if (vista == "PAC") {
            document.getElementById('divPopupContainerForm1').style.display = 'none';
            botones = botonesProceso;
        }
        else if (vista == "Periodo") {
            botones = botonesPeriodo;
        }

        grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);

        if (vista == "Oficina") {
            var listaOficinaPadre = listas[2].split("¬");
            crearCombo(listaOficinaPadre, "cboOficinaPadre", "Primer Nivel");
        }
        else if (vista == "OrdenCompra") {
            document.getElementById('divPopupContainerForm1').style.display = 'none';
        }
        else if (vista == "Cotizacion") {
            var divPopupContainerForm1 = document.getElementById('divPopupContainerForm1');
            if (divPopupContainerForm1 != null) divPopupContainerForm1.style.display = 'none';

            var btnActualizar = document.getElementById('btnActualizar');
            if (btnActualizar != null) btnActualizar.innerHTML = "<i class='fa fa-envelope'></i> Actualizar";
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
        Swal.fire({
            title: 'Error!',
            text: 'No se realizó el registro-verificador datos',
            icon: 'error',
            showConfirmButton: true,
            timer: 2000
        })
    }

    btnGuardar.innerHTML = "<i class='fa fa-save'></i> Grabar";
    btnGuardar.disabled = false;
}

function aprobarPedido() {
    var tipo = btnAprobar.getAttribute("Title");
    var idE;
    var textoMensaje = "";
    if (tipo == "Pendiente") { idE = 1; textoMensaje = '¿Desea retornar el Pedido a pendiente?'; }
    else { idE = 5; textoMensaje = '¿Desea aprobar el Pedido?'; }

    var data = "";
    var fechaInicio = txtFechaInicio.value;
    var fechaFinal = txtFechaFinal.value;
    data = idRegistro + '|' + idE + '|' + fechaInicio + '|' + fechaFinal;

    var frm = new FormData();
    frm.append("data", data);
    Swal.fire({
        title: textoMensaje,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.value) {
            Http.post("General/guardar/?tbl=" + controller + vista + "Aprobar", mostrarGrabar, frm);
        }
    })

}

function eliminarRegistro(id) {
    var data = "";
    var titulomsg = '¿Desea anular el registro?';
    if (vista == "PedidoCompra" || vista == "SolicitudCompra" || vista == "Cotizacion" || vista == "CuadroCompara") {
        var fechaInicio = txtFechaInicio.value;
        var fechaFinal = txtFechaFinal.value;
        data = id + '|' + fechaInicio + '|' + fechaFinal;
    }
    else if (vista == "OrdenCompra") {

        var container = document.querySelector('#mytab');
        let tabs = Array.prototype.slice.apply(container.querySelectorAll('.nav-tabs .active'));
        var idTabActivo = tabs[0].attributes[1].value;

        var idTipo;
        if (idTabActivo == "tabOrdCompra") { idTipo = 1; } else { idTipo = 2; }
        var fechaInicio = txtFechaInicio.value;
        var fechaFinal = txtFechaFinal.value;
        data = id + '|' + fechaInicio + '|' + fechaFinal + '|' + idTipo;
    }
    else if (vista == "Periodo") {
        titulomsg = '¿Desea Extornar El Período ?';
    }
    else {
        data = id;
    }

    var frm = new FormData();
    frm.append("data", data);

    if (vista == 'OrdenCompra') {
         titulomsg = '¿Desea anular ord. de compra ?';
        Swal.fire({
            title: titulomsg,
            icon: 'question',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off',
                placeholder:'Ingresar Justificación Aquí.',
            },
            showCancelButton: true,
            showLoaderOnConfirm: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            preConfirm: (login) => {
                var error = "Ingresar Justificación";
                if (login == "") {
                    Swal.showValidationMessage(`* ${error}`);
                    return;
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                data = data+ '|' + result.value;
                var frm = new FormData();
                frm.append("data", data);
                Http.post("General/eliminar/?tbl=" + controller + vista, mostrarEliminar, frm);
            }
        })
    }
    else {

        Swal.fire({
            title: titulomsg,
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
}
function mostrarEliminar(rpta) {
    var mensajeResul = [];
    if (rpta) {
        listas = rpta.split("¯")
        lista = listas[0].split("¬");
        mensajeResul = listas[1].split("|");
        var tipo = mensajeResul[0];
        var mensaje = mensajeResul[1];

        if (vista == "PAC") {
            botones = botonesProceso;
        }

        grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, null, botones, 38, false, null);

        if (vista == "Oficina") {
            var listaOficinaPadre = listas[2].split("¬");
            crearCombo(listaOficinaPadre, "cboOficinaPadre", "Primer Nivel");
        }

        if (tipo == 'A') {
            Swal.fire({
                title: 'Anulado!',
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

function getReporte(id) {
    Http.get("General/obtenerReporteId/?tbl=" + controller + vista + '&id=' + id, mostrarReporte);
}

function mostrarReporte(rpta) {
    if (rpta) {
        var listaDetallePedido;
        var listaDetalleReporte;
        var tipoOrden;
        var listaReporte = rpta.split("¯");
        var Cabecera = listaReporte[0].split("|");

        if (vista == "CuadroCompara") {
            var detalle = listaReporte[1].split("¬");
            tdJustificacion.innerHTML = Cabecera[2];
            tdFechaEmision.innerHTML = Cabecera[0];
            tdArea.innerHTML = Cabecera[1];
            tdEvaluadorCC.innerHTML = Cabecera[3];
            tdPresupuesto.innerHTML = Cabecera[4];
            generarPivotCC(detalle);
        }
        else if (vista == "PedidoCompra") {
            tdNroSolicitud.innerHTML = Cabecera[0];
            tdTipoSolicitud.innerHTML = Cabecera[1];
            tdFechaPedido.innerHTML = Cabecera[2];
            tdFechaRequerida.innerHTML = Cabecera[3];
            tdJustificacion.innerHTML = Cabecera[4];
            tdDocumento.innerHTML = Cabecera[7];
            tdElaborado.innerHTML = Cabecera[9];
            tdEstado.innerHTML = Cabecera[6];
            spnPromotor.innerHTML = "SOLICITANTE: " + Cabecera[8] + "<br />";
            if (Cabecera[5] != 1) {
                tdEtiquetaEstado.innerHTML = "";
            }
            else {
                tdEtiquetaEstado.innerHTML = "PENDIENTE DE APROBACION";
            }
        }
        else if (vista == "SolicitudCompra") {
            tdNroSolicitud.innerHTML = Cabecera[0];
            tdTipoSolicitud.innerHTML = Cabecera[1];
            tdFechaPedido.innerHTML = Cabecera[2];
            tdEstado.innerHTML = Cabecera[3];
        }
        else if (vista == "Cotizacion") {
            tdNroSolicitud.innerHTML = Cabecera[0];
            tdFechaEmision.innerHTML = "Fecha emisión: " + Cabecera[1];
            tdProveedor.innerHTML = "Señor(es): " + Cabecera[2];
            tdRUC.innerHTML = "RUC: " + Cabecera[3];
            spnUserAdquisicones.innerHTML = spnUsuario.innerHTML;
        }
        else if (vista == "OrdenCompra") {
            tipoOrden = Cabecera[1];
            document.getElementById("tdNroOrden").innerHTML = "Nº " + Cabecera[0];
            document.getElementById("tdDia").innerHTML = Cabecera[2];
            document.getElementById("tdMes").innerHTML = Cabecera[3];
            document.getElementById("tdAnio").innerHTML = Cabecera[4];
            spnEmpresa.innerHTML = Cabecera[5];
            spnRUC.innerHTML = Cabecera[6];
            spnDireccion.innerHTML = Cabecera[7];
            tdJustificacion.innerHTML = Cabecera[8];
            tdTotal.innerHTML = formatoNumeroDecimal(Cabecera[9]);
            tdCuentasPagar.innerHTML = formatoNumeroDecimal(Cabecera[9]);
            tdPlazoEntrega.innerHTML = Cabecera[10] + " DIAS";
            tdCredito.innerHTML = Cabecera[11];
            tdMontoTexto.innerHTML = NumeroALetras(Cabecera[9]);
            tdGarantia.innerHTML = Cabecera[12];
            tdSolicitante.innerHTML = Cabecera[13];
            tdResumenPresu.innerHTML = 'FTE.FTO.:' + Cabecera[14] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;META:' + Cabecera[15] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PARTIDA:' + Cabecera[16];
            var datosDirector = Cabecera[17].split('-');
            tdDirector.innerHTML = datosDirector[0];
            tdDNIDirector.innerHTML = datosDirector[1];

            var datosJelog = Cabecera[18].split('-');
            tdJelog.innerHTML = datosJelog[0];
            tdDNIJelog.innerHTML = datosJelog[1];

            if (Cabecera[19] == 5) {
                tdAnulacion.style.display = 'inline';
                tdMotivoAnulado.innerHTML = Cabecera[20];
            }
            else {
                tdAnulacion.style.display = 'none';
            }

            var contenido = ""
            if (tipoOrden == "SERVICIOS") {
                snpTipoOrden.innerHTML = "ORDEN DE SERVICIO";
                contenido = "<tr>";
                contenido += "<th style='border: black 1px solid; padding: 5px'>ITEM</th>";
                contenido += "<th style='border: black 1px solid;'>DESCRIPCION</th>";
                contenido += "<th style='border: black 1px solid; padding: 5px'>PRECIO</th>";
                contenido += "</tr>";
            }
            else {
                snpTipoOrden.innerHTML = "ORDEN DE COMPRA";
                contenido = "<tr>";
                contenido += "<th style='border: black 1px solid; padding: 5px'>ITEM</th>";
                contenido += "<th style='border: black 1px solid;'>CANTIDAD</th>";
                contenido += "<th style='border: black 1px solid; padding: 5px'>UNIDAD</th>";
                contenido += "<th style='border: black 1px solid; padding: 5px'>DESCRIPCION</th>";
                contenido += "<th style='border: black 1px solid; padding: 5px'>PRECIO UNITARIO</th>";
                contenido += "<th style='border: black 1px solid; padding: 5px'>TOTAL</th>";
                contenido += "</tr>";
            }
            tblCabecera.innerHTML = "";
            tblCabecera.innerHTML = contenido;
        }

        var contenido = "";
        var html = "";
        if (vista == "SolicitudCompra") {
            listaDetallePedido = listaReporte[1].split("¬");
            listaDetalleReporte = listaReporte[2].split("¬");
            var nregistros = listaDetallePedido.length;
            if (nregistros > 0 && listaDetallePedido[0] != "") {
                var campos = [];
                for (var i = 0; i < nregistros; i++) {
                    campos = listaDetallePedido[i].split("|");
                    html += "<tr>";
                    html += "<td style='vertical-align:top;text-align: center;border: black 1px solid;'>";
                    html += campos[0];
                    html += "</td > ";
                    html += "<td style='vertical-align:top;text-align: left;border: black 1px solid;'>";
                    html += campos[1];
                    html += "</td > ";
                    html += "<td style='text-align: left;max-width:500px;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;border: black 1px solid;'>";
                    html += campos[2];
                    html += "</td > ";
                    html += "<td style='vertical-align:top;text-align: left;border: black 1px solid;'>";
                    html += campos[3];
                    html += "</td > ";
                    html += "</tr>";
                }
                tblDetallePedido.innerHTML = html;
            }
        }
        else {
            listaDetalleReporte = listaReporte[1].split("¬");
        }
        var nregistros = listaDetalleReporte.length;
        if (nregistros > 0 && listaDetalleReporte[0] != "") {
            var campos = [];

            if (vista == "Cotizacion") {
                var total = 0;
                for (var i = 0; i < nregistros; i++) {
                    campos = listaDetalleReporte[i].split("|");
                    contenido += "<tr>";
                    contenido += "<td style='vertical-align:top;text-align: center;border: black 1px solid;'>";
                    contenido += campos[0];
                    contenido += "</td > ";
                    contenido += "<td style='vertical-align:top;text-align: left;max-width:500px;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;border: black 1px solid;'>";
                    contenido += campos[1];
                    contenido += "</td > ";
                    contenido += "<td style='vertical-align:top;text-align: center;border: black 1px solid;'>";
                    contenido += campos[2];
                    contenido += "</td > ";
                    contenido += "<td style='vertical-align:top;text-align: right;border: black 1px solid;'>";
                    contenido += formatoNumeroDecimal(campos[3] * 1);
                    contenido += "</td > ";
                    contenido += "<td style='vertical-align:top;text-align: right;border: black 1px solid;'>";
                    contenido += formatoNumeroDecimal(campos[4] * 1);
                    contenido += "</td > ";
                    contenido += "<td style='vertical-align:top;text-align: right;border: black 1px solid;'>";
                    contenido += formatoNumeroDecimal((campos[3] * 1) * (campos[4] * 1));
                    total = total + ((campos[3] * 1) * (campos[4] * 1));
                    contenido += "</td > ";
                    contenido += "</tr>";
                }
                tdTotal.innerHTML = formatoNumeroDecimal(total);
                tblDetalleReporte.innerHTML = contenido;
            }
            if (vista == "OrdenCompra") {
                if (tipoOrden == "SERVICIOS") {
                    for (var i = 0; i < nregistros; i++) {
                        campos = listaDetalleReporte[i].split("|");
                        contenido += "<tr>";
                        contenido += "<td style='vertical-align:top;text-align: center;'>";
                        contenido += campos[0];
                        contenido += "</td > ";
                        contenido += "<td style='vertical-align:top;text-align: justify;max-width:500px;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
                        contenido += campos[1];
                        contenido += "</td > ";
                        contenido += "<td style='vertical-align:top;text-align: right;'>";
                        contenido += formatoNumeroDecimal(campos[5] * 1);
                        contenido += "</td > ";
                        contenido += "</tr>";
                    }
                }
                else {
                    for (var i = 0; i < nregistros; i++) {
                        campos = listaDetalleReporte[i].split("|");
                        contenido += "<tr>";
                        contenido += "<td style='vertical-align:top;text-align: center;'>";
                        contenido += i + 1;
                        contenido += "</td> ";
                        contenido += "<td style='vertical-align:top;text-align: right;'>";
                        contenido += formatoNumeroDecimal(campos[3]);
                        contenido += "</td>";
                        contenido += "<td style='vertical-align:top;text-align: center;'>";
                        contenido += campos[2];
                        contenido += "</td>";
                        contenido += "<td style='vertical-align:top;text-align: left;max-width:500px;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
                        contenido += campos[1];
                        contenido += "</td>";
                        contenido += "<td style='vertical-align:top;text-align: right;'>";
                        contenido += formatoNumeroDecimal(campos[4] * 1);
                        contenido += "</td>";
                        contenido += "<td style='vertical-align:top;text-align: right;'>";
                        contenido += formatoNumeroDecimal(campos[5] * 1);
                        contenido += "</td>";
                        contenido += "</tr>";
                    }
                }
            }
            else if (vista == "PedidoCompra") {

                for (var i = 0; i < nregistros; i++) {
                    campos = listaDetalleReporte[i].split("|");
                    contenido += "<tr>";
                    contenido += "<td style='vertical-align:top;text-align: center;border: black 1px solid;'>";
                    contenido += i + 1;
                    contenido += "</td > ";
                    contenido += "<td style='vertical-align:top;text-align: center;border: black 1px solid;'>";
                    contenido += campos[1];
                    contenido += "</td > ";
                    contenido += "<td style='text-align: left;max-width:500px;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;border: black 1px solid;'>";
                    contenido += campos[2];
                    contenido += "</td > ";
                    contenido += "<td style='vertical-align:top;text-align: center;border: black 1px solid;'>";
                    contenido += campos[3];
                    contenido += "</td > ";
                    contenido += "<td style='vertical-align:top;text-align: right;border: black 1px solid;'>";
                    contenido += formatoNumeroDecimal(campos[4] * 1);
                    contenido += "</td > ";
                    contenido += "</tr>";
                }
                tblDetalleReporte.innerHTML = contenido;

            }
            else if (vista == "SolicitudCompra") {
                for (var i = 0; i < nregistros; i++) {
                    campos = listaDetalleReporte[i].split("|");
                    contenido += "<tr>";
                    contenido += "<td style='vertical-align:top;text-align: center;border: black 1px solid;'>";
                    contenido += i + 1;
                    contenido += "</td > ";
                    contenido += "<td style='vertical-align:top;text-align: center;border: black 1px solid;'>";
                    contenido += campos[1];
                    contenido += "</td > ";
                    contenido += "<td style='text-align: left;max-width:500px;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;border: black 1px solid;'>";
                    contenido += campos[2];
                    contenido += "</td > ";
                    contenido += "<td style='vertical-align:top;text-align: center;border: black 1px solid;'>";
                    contenido += campos[3];
                    contenido += "</td > ";
                    contenido += "<td style='vertical-align:top;text-align: right;border: black 1px solid;'>";
                    contenido += formatoNumeroDecimal(campos[4] * 1);
                    contenido += "</td > ";
                    contenido += "</tr>";
                }
                tblDetalleReporte.innerHTML = contenido;
            }
            if (vista == "OrdenCompra") {
                tblDetalleReporte.innerHTML = contenido;
            }
        }
        imprimir(divReporte.innerHTML);
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

function mostrarListadoItem(rpta) {
    if (rpta) {
        var listas = rpta.split('¯');
        lista = listas[0].split("¬");
        if (vista == "Cotizacion") {
            var listaProveedores = listas[1].split("¬");
            var listaCondicionCompra = listas[2].split("¬");
            var listaMoneda = listas[3].split("¬");
            generarTablaItem(lista, "listaPendientes", "tblSolicitud", null, true);
            crearCombo(listaProveedores, "cboProveedor", "Seleccione");
            crearCombo(listaCondicionCompra, "cboCondicionCompra", "Seleccione");
            crearCombo(listaMoneda, "cboMoneda", "Seleccione");
        }
        else if (vista == "CuadroCompara" || vista == "OrdenCompra") {
            listaPendientes.innerHTML = "";
            generarTablaItem(lista, "listaPendientes", "tblSolicitud", null, true);
        }
        else if (vista == "PedidoCompra") {
            listaItem.innerHTML = "";
            listaProducto = listas[0].split("¬");
            grillaItem = new GrillaScroll(listaProducto, "listaItem", 1000, 6, tabla, "Admon", null, null, null, null, 25, false, true);
            var listaTipoBien = listas[1].split("¬");
            listaGrupoItem = listas[2].split("¬");
            listaClaseItem = listas[3].split("¬");
            listaFamiliaItem = listas[4].split("¬");
            var listaUnidadMedida = listas[5].split("¬");
            crearCombo(listaTipoBien, "cboTipoItem", "Seleccionar");
            listarGrupoItem();
            crearCombo(listaUnidadMedida, "cboUniMedItem", "Seleccionar");
        }
        else {
            listaItem.innerHTML = "";
            generarTablaItem(lista, "listaItem", "tblItem", true, null, null);
        }
    }
}

function generarTablaItem(lista, nombreDiv, idTabla, ischeck, isSeleccionar, isFiltro) {
    var campos = lista[0].split("|");
    var anchos = lista[1].split("|");
    var tipos = lista[2].split("|");
    var nRegistros = lista.length;
    var nCampos = campos.length;
    var nombreProducto = "";
    if (isFiltro == true) {
        var txtBuscarItem = document.getElementById("txtBuscarItem");
        if (txtBuscarItem != null) nombreProducto = txtBuscarItem.value
    }

    var contenido = "<table class='grilla bordered Tabla' id='";
    contenido += idTabla;
    contenido += "'><thead><tr class='FilaHead'>";
    for (var z = 0; z < nCampos; z++) {
        contenido += "<th style='white-space:pre-wrap;width:";
        contenido += anchos[z];
        contenido += "px'>";
        contenido += campos[z];
        contenido += "</th>";
    }
    contenido += "</tr></thead>"
    contenido += "<tbody id='tBody";
    contenido += idTabla
    contenido += "'>";
    if (lista[3].length > 0) {
        if (isFiltro == true) {
            for (var i = 3; i < nRegistros; i++) {
                campos = lista[i].split("|");
                if (campos[2] == "" || campos[2].toLowerCase().indexOf(nombreProducto.toLowerCase()) > -1) {
                    if (isSeleccionar == true) {
                        contenido += "<tr class='FilaDatos' onclick='seleccionarFila(this, \"";
                        contenido += campos[1];
                        contenido += "\",\"";
                        contenido += nombreDiv;
                        contenido += "\"); '>";
                    } else {
                        contenido += "<tr>";
                    }
                    for (var j = 0; j < nCampos; j++) {
                        if (j == 0 && ischeck == true) {
                            contenido += "<td>";
                            contenido += "<div class='chk-option'>";
                            contenido += "<div class='checkbox-fade fade-in-primary'>";
                            contenido += "<label class='check-task'>";
                            contenido += "<input type='checkbox' class='chkPopup' id='chk";
                            contenido += campos[j];
                            contenido += "' value='";
                            contenido += campos[j];
                            if (vista == "PedidoCompra") {
                                contenido += "' onclick='adicionarItem(\"";
                                contenido += campos[0] + '|' + campos[1] + '|' + campos[2] + '|' + campos[3];
                            }
                            else {
                                contenido += "' onclick='seleccionarItem(\"";
                                contenido += campos[0];
                            }

                            contenido += "\");'> <span class='cr'>";
                            contenido += "<i class='cr-icon fa fa-check txt-default'></i>";
                            contenido += "</span>";
                            contenido += "</label>";
                            contenido += "</div>";
                            contenido += "</div>";
                            contenido += "</td>";
                        }
                        else {
                            contenido += "<td style='text-align:left;white-space:pre-wrap;width:";
                            contenido += anchos[j];
                            contenido += "px'>";
                            contenido += campos[j];
                            contenido += "</td>";
                        }
                    }
                    contenido += "</tr>";
                }
            }
        }
        else {
            for (var i = 3; i < nRegistros; i++) {
                campos = lista[i].split("|");
                if (isSeleccionar == true) {
                    contenido += "<tr class='FilaDatos' onclick='seleccionarFila(this, \"";
                    contenido += campos[1];
                    contenido += "\",\"";
                    contenido += nombreDiv;
                    contenido += "\"); '>";
                } else {
                    contenido += "<tr>";
                }
                for (var j = 0; j < nCampos; j++) {
                    if (j == 0 && ischeck == true) {
                        contenido += "<td>";
                        contenido += "<div class='chk-option'>";
                        contenido += "<div class='checkbox-fade fade-in-primary'>";
                        contenido += "<label class='check-task'>";
                        contenido += "<input type='checkbox' class='chkPopup' id='chk";
                        contenido += campos[j];
                        contenido += "' value='";
                        contenido += campos[j];
                        if (vista == "PedidoCompra") {
                            contenido += "' onclick='adicionarItem(\"";
                            contenido += campos[0] + '|' + campos[1] + '|' + campos[2] + '|' + campos[3];
                        }
                        else {
                            contenido += "' onclick='seleccionarItem(\"";
                            contenido += campos[0];
                        }

                        contenido += "\");'> <span class='cr'>";
                        contenido += "<i class='cr-icon fa fa-check txt-default'></i>";
                        contenido += "</span>";
                        contenido += "</label>";
                        contenido += "</div>";
                        contenido += "</div>";
                        contenido += "</td>";
                    }
                    else {
                        contenido += "<td style='text-align:left;white-space:pre-wrap;width:";
                        contenido += anchos[j];
                        contenido += "px'>";
                        contenido += campos[j];
                        contenido += "</td>";
                    }
                }
                contenido += "</tr>";
            }
        }
    }
    else {
        contenido += "<tr>";
        contenido += "<td Colspan='";
        contenido += nCampos;
        contenido += "' style='text-align:center'>No se encuentran registros";
        contenido += "</td>";
        contenido += "</tr>";
    }
    contenido += "</tbody>";
    contenido += "</table>";

    var div = document.getElementById(nombreDiv);
    div.innerHTML = contenido;

    var nFilas = document.getElementById("tBody" + idTabla).rows.length;
    var spnNPedidos = document.getElementById("spnNPedidos");
    if (spnNPedidos != null) spnNPedidos.innerHTML = "Pendientes: " + nFilas;
}


function seleccionarItem(item) {
    if (vista == "SolicitudCompra") {
        var data = "";
        var controles = document.getElementsByClassName("chkPopup");
        var nControles = controles.length;
        var control;
        for (var i = 0; i < nControles; i++) {
            control = controles[i];
            if (control.checked == true) {
                data += control.value;
                data += '|';
            }
        }
        data = data.substr(0, data.length - 1);
        Http.get("General/listarTabla/?tbl=" + controller + vista + "Items&data=" + data, mostrarSolicitudItem);
    }
    else {
        var codigo = "";
        var nombre = "";
        var unimed = "";

        var control = 'chk' + item;
        if (control != null) document.getElementById(control).checked = true;
        var cantidad = 0;
        var nFilas = tbDetallePedido.rows.length;
        var existe = false;
        for (var i = 0; i < nFilas; i++) {
            if (tbDetallePedido.rows[i].cells[0].innerHTML == item) {
                existe = true;
                break;
            }
        }

        if (!existe) {
            var filaDetalle = "<tr>";
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>";
            filaDetalle += item;
            filaDetalle += "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;vertical-align:top;'>";
            filaDetalle += codigo;
            filaDetalle += "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:500px;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
            filaDetalle += nombre;
            filaDetalle += "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:80px;vertical-align:top;'>";
            filaDetalle += unimed;
            filaDetalle += "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;'>";
            filaDetalle += "<input type='number' style='text-align:right' min=1>";
            filaDetalle += "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;text-align:right'>";
            filaDetalle += '';
            filaDetalle += "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:70px;vertical-align:top;text-align:right'>";
            filaDetalle += '';
            filaDetalle += "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:10px;vertical-align:top;'>";
            filaDetalle += "<i class='fa fa-trash f-16 text-c-red' title='Quitar Item' onclick='retirarItem(this,\"";
            filaDetalle += item;
            filaDetalle += "\");'></i>";
            filaDetalle += "</td> ";
            filaDetalle += "</tr>";
            tbDetallePedido.insertAdjacentHTML("beforeend", filaDetalle);
        }
        else mostrarMensaje("El Item ya se encuentra agregado", "error");
    }

    spnNroItems.innerHTML = "Items: " + (nFilas + 1);
}


function mostrarSolicitudItem(rpta) {
    var contenido = "";
    tbDetallePedido.innerHTML = "";
    var lista = rpta.split('¬');
    var nRegistros = lista.length;
    var campos = [];
    for (var i = 0; i < nRegistros; i++) {
        campos = lista[i].split("|");
        contenido += "<tr>";
        contenido += "<td style='display:none'>";
        contenido += campos[0];
        contenido += "</td> ";
        contenido += "<td style='display:none'>";
        contenido += campos[1];
        contenido += "</td> ";
        contenido += "<td style='vertical-align:top'>";
        contenido += campos[2];
        contenido += "</td> ";
        contenido += "<td style='max-width:600px;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
        if (campos[5].length != 0) {
            contenido += "<h6>";
            contenido += campos[3];
            contenido += "</h6>";
            contenido += "<p style='white-space:pre-line;'>";
            contenido += campos[5];
            contenido += "</p>";
        }
        else {
            contenido += campos[3];
        }
        contenido += "</td> ";
        contenido += "<td style='vertical-align:top'>";
        contenido += campos[4];
        contenido += "</td> ";
        contenido += "<td style='vertical-align:top;'>";
        contenido += "<input type='number' style='text-align:right' onkeyup='validarCantidad(this,\"";
        contenido += campos[7]
        contenido += "\",\"";
        contenido += campos[8];
        contenido += "\");' min=1 value=";
        contenido += campos[6];
        contenido += "></td> ";
        contenido += "<td style='vertical-align:top;text-align:right'>";
        contenido += campos[7];
        contenido += "</td> ";
        contenido += "<td style='vertical-align:top;text-align:right'>";
        contenido += campos[8];
        contenido += "</td> ";
        contenido += "<td style='display:none'>";
        contenido += campos[9];
        contenido += "</td> ";
        contenido += "</tr>";
    }
    tbDetallePedido.innerHTML = contenido;
    spnNroItems.innerHTML = 'Items: ' + nRegistros;
    configurarEnterCantidad(tbDetallePedido, 8);
}

function validarSoliCompra() {
    var tipoSolicitud = cboTipoSolicitud.value;
    var nFilas = 0;

    var tBodytblItem = document.getElementById("tBodytblItem")
    if (tBodytblItem != null) {
        nFilas = tBodytblItem.rows.length;
        var existe = false;
        for (var i = 0; i < nFilas; i++) {
            if (tBodytblItem.rows[i].cells[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].checked) {
                existe = true;
                break;
            }
        }
    }

    if (tipoSolicitud == "") {
        mostrarMensaje("Seleccione Tipo de solicitud", "error");
        return false;
        cboTipoSolicitud.focus();
    }
    else if (existe != true) {
        mostrarMensaje("Seleccione Solicitud de la lista", "error");
    }
    //else if (existetb != true) {
    //    mostrarMensaje("Es necesario ingresar cantidad pedida para generar la solicitud", "error");
    //}

    return true;
}


function grabarSolicitud() {
    var data = "";
    var idTipoSolicitud = cboTipoSolicitud.value;

    data = idTipoSolicitud;
    data += '¯';
    var nfilas = tbDetallePedido.rows.length;
    var fila;
    for (var i = 0; i < nfilas; i++) {
        fila = tbDetallePedido.rows[i];
        data += fila.cells[0].innerHTML; //Pedido
        data += "|";
        data += fila.cells[1].innerHTML; //Item
        data += "|";
        data += fila.cells[8].innerHTML; //unidad medida
        data += "|";
        data += fila.cells[5].childNodes[0].value; //Cantidad
        data += "¬";
    }
    data = data.substr(0, data.length - 1);

    var txtFechaInicio = document.getElementById("txtFechaInicio").value;
    var txtFechaFinal = document.getElementById("txtFechaFinal").value;

    data = data + '¯' + txtFechaInicio + '|' + txtFechaFinal
    var frm = new FormData();
    frm.append("data", data);
    Http.post("General/guardar?tbl=" + controller + vista, mostrarGrabar, frm);

    btnGuardar.innerHTML = "Guardando <i class='fa fa-circle-o-notch fa-spin' style='color:white'></i>";
    btnGuardar.disabled = true;
}

//function mostrarSolicitudDetalle(rpta) {
//    if (rpta) {
//        if (vista == 'CuadroCompara') {
//            var listas = rpta.split('¯');
//            var lista = listas[0].split('¬');
//            generarPivot(lista, "listaDetalle");
//            var listaProveedores = listas[1].split("¬");
//            crearCombo(listaProveedores, "cboProveedor", "Seleccionar")
//            divBuenaPro.style.display = 'inline';
//        }
//        else {
//            var contenido = "";
//            tbDetallePedido.innerHTML = "";
//            var lista = rpta.split('¬');
//            var nRegistros = lista.length;
//            var campos = [];
//            for (var i = 0; i < nRegistros; i++) {
//                campos = lista[i].split("|");
//                contenido += "<tr>";
//                contenido += "<td style='display:none'>";
//                contenido += campos[0];
//                contenido += "</td> ";
//                contenido += "<td style='display:none'>";
//                contenido += campos[1];
//                contenido += "</td> ";
//                contenido += "<td style='vertical-align:top'>";
//                contenido += campos[2];
//                contenido += "</td> ";
//                contenido += "<td style='max-width:600px;white-space: pre-line;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
//                if (campos[4].length != 0) {
//                    contenido += "<h6>";
//                    contenido += campos[3];
//                    contenido += "</h6>";
//                    contenido += "<p style='white-space:pre-line;'>";
//                    contenido += campos[4];
//                    contenido += "</p>";
//                }
//                else {
//                    contenido += "<h6>";
//                    contenido += campos[3];
//                    contenido += "</h6>";
//                }
//                contenido += "</td>";
//                contenido += "<td style='vertical-align:top;'>";
//                contenido += campos[5];
//                contenido += "</td> ";
//                contenido += "<td style='vertical-align:top;text-align:right'>";
//                contenido += campos[6];
//                contenido += "</td> ";
//                contenido += "</tr>";
//            }
//            tbDetallePedido.innerHTML = contenido;

//            var spnNroItems = document.getElementById("spnNroItems");
//            if (spnNroItems != null) spnNroItems.innerHTML = 'Items: ' + nRegistros;
//        }
//    }
//}

function validarCotizacion() {
    var idProveedor = cboProveedor.value;
    var idCondicionCompra = cboCondicionCompra.value;
    var idMoneda = cboMoneda.value;

    if (idRegistro == "") { mostrarMensaje("Seleccione una Solicitud de la lista", "error"); return false; }
    else if (idProveedor == "") { mostrarMensaje("Seleccione Proveedor", "error"); return false; }
    else if (idCondicionCompra == "") { mostrarMensaje("Seleccione Condición de compra", "error"); return false; }
    else if (idMoneda == "") { mostrarMensaje("Seleccione Moneda", "error"); return false; }

    //var fila;
    //for (var i = 0; i < nfilas; i++) {
    //    fila = tbDetallePedido.rows[i];
    //    if (fila.cells[4].childNodes[0].value == 0 || fila.cells[4].childNodes[0].value == "") {
    //        mostrarMensaje("Debe ingresar cantidad solicitada a todos los items", "error");
    //        return false;
    //    }
    //}
    return true;
}


function grabarCotizacion() {
    var idSolicitud = idRegistro;
    var idProveedor = cboProveedor.value;
    var idCondicionCompra = cboCondicionCompra.value;
    var comentario = ttaComentario.value;
    var idMoneda = cboMoneda.value;

    var data = "";
    data = idSolicitud;
    data += "|";
    data += idProveedor
    data += "|";
    data += idCondicionCompra
    data += "|";
    data += idMoneda
    data += "|";
    data += comentario
    data += '¯';
    var nfilas = tbDetallePedido.rows.length;
    var fila;
    for (var i = 0; i < nfilas; i++) {
        fila = tbDetallePedido.rows[i];
        data += fila.cells[0].innerHTML; //Item
        data += "|";
        data += fila.cells[1].innerHTML; //unidad medida
        data += "|";
        data += fila.cells[2].innerHTML; //Correlativo
        data += "|";
        data += fila.cells[3].childNodes[0].innerHTML; //descripcion
        data += "|";
        data += fila.cells[5].innerHTML; //Cantidad
        data += "¬";
    }
    data = data.substr(0, data.length - 1);

    var txtFechaInicio = document.getElementById("txtFechaInicio").value;
    var txtFechaFinal = document.getElementById("txtFechaFinal").value;

    data = data + '¯' + txtFechaInicio + '|' + txtFechaFinal

    var frm = new FormData();
    frm.append("data", data);
    Http.post("General/guardar?tbl=" + controller + vista, mostrarGrabar, frm);

    btnGuardar.innerHTML = "Guardando <i class='fa fa-circle-o-notch fa-spin' style='color:white'></i>";
    btnGuardar.disabled = true;
}


function totalCotizacion(id) {
    var tbDetalleItem = document.getElementById("tbDetalleItem");
    if (tbDetalleItem != null) {
        var nFilas = tbDetalleItem.rows.length
        var fila
        var total = 0
        var precio, cantidad, subtotal
        if (id == 'I') {
            for (var i = 0; i < nFilas; i++) {
                fila = tbDetalleItem.rows[i];
                cantidad = fila.cells[4].innerHTML * 1;
                precio = fila.cells[5].childNodes[0].value * 1;
                subtotal = cantidad * precio;
                total = total + subtotal;
            }
        }
        else {
            for (var i = 0; i < nFilas; i++) {
                fila = tbDetalleItem.rows[i];
                cantidad = fila.cells[4].innerHTML * 1;
                precio = fila.cells[5].innerHTML * 1;
                subtotal = cantidad * precio;
                total = total + subtotal;
            }
        }
        htTotal.innerHTML = "TOTAL: " + formatoNumeroDecimal(total);
    }
}


function grabarProforma() {
    var data = "";
    var idCotizacion = txtIdRegistro.value;
    var numeroProforma = txtProforma.value;
    var fechaProforma = txtFechaProforma.value;
    var comentario = ttaComentarioProveedor.value;
    var diasEntrega = txtDiasEntrega.value;
    var garantia = txtGarantia.value;
    var tipoSolicitud = txtTipoSolicitud.value;

    var nFilas = tbDetalleItem.rows.length;
    var existe = false;
    for (var i = 0; i < nFilas; i++) {
        if (tbDetalleItem.rows[i].cells[5].childNodes[0].value == 0) {
            existe = true;
            break;
        }
    }

    if (numeroProforma === "") {
        mostrarMensaje("Ingrese el número de proforma", "error");
        return false;
    }
    else if (fechaProforma === "") {
        mostrarMensaje("Seleccione la fecha de la proforma", "error");
        return false;
    } else if (diasEntrega === "" && tipoSolicitud === 2) {
        mostrarMensaje("Ingrese el tiempo de entrega en días", "error");
        return false;
    }
    else if (existe) {
        mostrarMensaje("Debe ingresar el precio a todos los Items", "error");
        return false;
    }
    else {
        data = idCotizacion;
        data += "|";
        data += numeroProforma;
        data += "|";
        data += fechaProforma;
        data += "|";
        data += diasEntrega;
        data += "|";
        data += comentario;
        data += "|";
        data += garantia;
        data += '¯';
        var nfilas = tbDetalleItem.rows.length;
        var fila;
        for (var i = 0; i < nfilas; i++) {
            fila = tbDetalleItem.rows[i];
            data += fila.cells[0].innerHTML; //Item
            data += "|";
            data += fila.cells[4].innerHTML.replace(',', ''); //Cantidad
            data += "|";
            data += fila.cells[5].childNodes[0].value; //Precio
            data += "¬";
        }
        data = data.substr(0, data.length - 1);

        var txtFechaInicio = document.getElementById("txtFechaInicio").value;
        var txtFechaFinal = document.getElementById("txtFechaFinal").value;

        data = data + '¯' + txtFechaInicio + '|' + txtFechaFinal

        var frm = new FormData();
        frm.append("data", data);
        Http.post("General/guardar?tbl=" + controller + vista + "Actualizar", mostrarGrabar, frm);

        btnActualizar.innerHTML = "Guardando <i class='fa fa-circle-o-notch fa-spin' style='color:white'></i>";
        btnActualizar.disabled = true;
    }
}

function generarPivotCC(detalle) {
    var nDetalles = detalle.length;
    var productos = [];
    var proveedores = [];
    var rucs = [];
    var correos = [];
    var contactos = [];
    var telefonos = [];
    var campos = [];
    for (var i = 3; i < nDetalles; i++) {
        campos = detalle[i].split('|');
        if (proveedores.indexOf(campos[0]) == -1) {
            proveedores.push(campos[0]);
            window[campos[0] + "_SubTotal"] = 0;
        }
        if (rucs.indexOf(campos[1]) == -1) {
            rucs.push(campos[1]);
        }
        if (correos.indexOf(campos[2]) == -1) {
            correos.push(campos[2]);
        }
        if (contactos.indexOf(campos[3]) == -1) {
            contactos.push(campos[3]);
        }
        if (telefonos.indexOf(campos[4]) == -1) {
            telefonos.push(campos[4]);
        }
        if (productos.indexOf(campos[5]) == -1) {
            productos.push(campos[5]);
        }

        window[campos[5] + "_Unidad"] = campos[6];
        window[campos[5] + "_Cantidad"] = formatoNumeroDecimal(campos[7] * 1);
        window[campos[0] + "_" + campos[5] + "_Plazo"] = SoloNumeros(formatoNumeroEntero(campos[8] * 1)) + '(' + formatoNumeroEntero(campos[8] * 1) + ') DIAS';
        window[campos[0] + "_" + campos[5] + "_Precio"] = formatoNumeroDecimal(campos[9] * 1);
        window[campos[0] + "_" + campos[5] + "_SubTotal"] = formatoNumeroDecimal(campos[10] * 1);
        window[campos[0] + "_SubTotal"] += (campos[10] * 1);
    }
    var html = "";
    html += "<thead>";
    html += "<tr>";
    html += "<th colspan='3' style='border: 1px solid black;width:300px;text-align:left'>INFORMACION DE PROPUESTAS</th>";
    var nProveedores = proveedores.length;
    for (var i = 0; i < nProveedores; i++) {
        html += "<th colspan='3' style='border: 1px solid black;width:150px'>";
        html += 'PROVEEDOR ' + (i + 1);
        html += "</th>";
    }
    html += "</tr>";
    html += "<tr>";
    html += "<th colspan='3' style='border: 1px solid black;width:300px;text-align:left'>RAZON SOCIAL</th>";
    var nProveedores = proveedores.length;
    for (var i = 0; i < nProveedores; i++) {
        html += "<th colspan='3' style='border: 1px solid black;width:150px'>";
        html += proveedores[i];
        html += "</th>";
    }
    html += "</tr>";
    html += "<tr>";
    html += "<th colspan='3' style='border: 1px solid black;width:300px;text-align:left'>RUC</th>";
    var nRucs = rucs.length;
    for (var i = 0; i < nRucs; i++) {
        html += "<th colspan='3' style='border: 1px solid black;width:150px'>";
        html += rucs[i];
        html += "</th>";
    }
    html += "</tr>";
    html += "<tr>";
    html += "<th colspan='3' style='border: 1px solid black;width:300px;text-align:left'>CORREO ELECTRONICO</th>";
    var nCorreos = correos.length;
    for (var i = 0; i < nCorreos; i++) {
        html += "<th colspan='3' style='border: 1px solid black;width:150px'>";
        html += correos[i];
        html += "</th>";
    }
    html += "</tr>";
    html += "<tr>";
    html += "<th colspan='3' style='border: 1px solid black;width:300px;text-align:left'>CONTACTO</th>";
    var nContactos = contactos.length;
    for (var i = 0; i < nContactos; i++) {
        html += "<th colspan='3' style='border: 1px solid black;width:150px'>";
        html += contactos[i];
        html += "</th>";
    }
    html += "</tr>";
    html += "<tr>";
    html += "<th colspan='3' style='border: 1px solid black;width:300px;text-align:left'>TELEFONO MOVIL</th>";
    var nTelefonos = telefonos.length;
    for (var i = 0; i < nTelefonos; i++) {
        html += "<th colspan='3' style='border: 1px solid black;width:150px'>";
        html += telefonos[i];
        html += "</th>";
    }
    html += "</tr>";
    html += "<tr>";
    html += "<th style='border: 1px solid black;width:300px;line-height:20px'>Descripción</th>";
    html += "<th style='border: 1px solid black;width:75px;line-height:20px'>Unidad</th>";
    html += "<th style='border: 1px solid black;width:75px;line-height:20px'>Cantidad</th>";
    var nProveedores = proveedores.length;
    for (var i = 0; i < nProveedores; i++) {
        html += "<th style='border: 1px solid black;width:75px;line-height:20px'>";
        html += "Plazo Compra";
        html += "</th>";
        html += "<th style='border: 1px solid black;width:75px;line-height:20px'>";
        html += "Precio Unitario";
        html += "</th>";
        html += "<th style='border: 1px solid black;width:75px;line-height:20px'>";
        html += "Precio Total";
        html += "</th>";
    }
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";
    var nProductos = productos.length;
    for (var i = 0; i < nProductos; i++) {
        html += "<tr>";
        html += "<td style='border: 1px solid black;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;text-align:left;width:300px;line-height:20px'>";
        html += productos[i];
        html += "</td>";
        html += "<td style='border: 1px solid black;width:75px;line-height:20px'>";
        html += window[productos[i] + "_Unidad"];
        html += "</td>";
        html += "<td style='border: 1px solid black;text-align:right;width:75px;line-height:20px'>";
        html += window[productos[i] + "_Cantidad"];
        html += "</td>";
        for (var j = 0; j < nProveedores; j++) {
            html += "<td style='border: 1px solid black;width:75px;line-height:20px'>";
            html += window[proveedores[j] + "_" + productos[i] + "_Plazo"];
            html += "</td>";
            html += "<td style='border: 1px solid black;text-align:right;width:75px;line-height:20px'>";
            html += window[proveedores[j] + "_" + productos[i] + "_Precio"];
            html += "</td>";
            html += "<td style='border: 1px solid black;text-align:right;font-weight:bold;width:75px;line-height:20px'>";
            html += window[proveedores[j] + "_" + productos[i] + "_SubTotal"];
            html += "</td>";
        }
        html += "</tr>";
    }
    html += "<tr>";
    html += "<td colspan='3' style='border: 1px solid black;text-align:right;font-weight:bold;width:300px;line-height:20px'>";
    html += "TOTALES:";
    html += "</td>";
    for (var j = 0; j < nProveedores; j++) {
        html += "<td style='border: 1px solid black;width:75px;line-height:20px'>";
        html += "";
        html += "</td>";
        html += "<td style='border: 1px solid black;width:75px;line-height:20px'>";
        html += "";
        html += "</td>";
        html += "<td style='border: 1px solid black;text-align:right;width:75px;line-height:20px' id='tdSubTotal";
        html += j;
        html += "'>";
        html += formatoNumeroDecimal(window[proveedores[j] + "_SubTotal"]);
        html += "</td>";
    }
    html += "</tr>";
    html += "</tbody>";
    tblGenerarCC.innerHTML = html;
    var minSubTotal = 100000000;
    var posMin = -1;
    for (var j = 0; j < nProveedores; j++) {
        if (window[proveedores[j] + "_SubTotal"] < minSubTotal) {
            minSubTotal = window[proveedores[j] + "_SubTotal"];
            posMin = j;
        }
    }
    if (posMin > -1) {
        var celda = document.getElementById("tdSubTotal" + posMin);
        if (celda != null) celda.style.fontWeight = 'bold';
        if (celda != null) celda.style.fontSize = '12px';
    }
}

function generarPivot(detalle, div) {
    var nDetalles = detalle.length;
    var productos = [];
    var proveedores = [];
    var campos = [];
    for (var i = 0; i < nDetalles; i++) {
        campos = detalle[i].split('|');
        if (proveedores.indexOf(campos[0]) == -1) {
            proveedores.push(campos[0]);
            window[campos[0] + "_SubTotal"] = 0;
        }
        if (productos.indexOf(campos[1]) == -1) {
            productos.push(campos[1]);
        }
        window[campos[1] + "_Unidad"] = campos[2];
        window[campos[1] + "_Cantidad"] = formatoNumeroDecimal(campos[3] * 1);
        window[campos[0] + "_" + campos[1] + "_Precio"] = formatoNumeroDecimal(campos[4] * 1);
        window[campos[0] + "_" + campos[1] + "_SubTotal"] = formatoNumeroDecimal(campos[5] * 1);
        window[campos[0] + "_SubTotal"] += (campos[5] * 1);
    }
    var html = "";
    html += "<table class='grilla bordered' style='width:100%'>";
    html += "<thead>";
    html += "<tr class='FilaHead'>";
    html += "<th style='width:300px'>&nbsp;</th>";
    html += "<th style='width:75px'>&nbsp;</th>";
    html += "<th style='width:75px'>&nbsp;</th>";
    var nProveedores = proveedores.length;
    for (var i = 0; i < nProveedores; i++) {
        html += "<th colspan='2' style='white-space: pre-wrap;width:150px'>";
        html += proveedores[i];
        html += "</th>";
    }
    html += "</tr>";
    html += "<tr class='FilaHead'>";
    html += "<th style='width:300px'>Descripción</th>";
    html += "<th style='width:75px'>Unidad</th>";
    html += "<th style='width:75px'>Cantidad</th>";
    var nProveedores = proveedores.length;
    for (var i = 0; i < nProveedores; i++) {
        html += "<th style='width:75px'>";
        html += "Precio Unitario";
        html += "</th>";
        html += "<th style='width:75px'>";
        html += "Sub Total";
        html += "</th>";
    }
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";
    var nProductos = productos.length;
    for (var i = 0; i < nProductos; i++) {
        html += "<tr class='FilaDatos'>";
        html += "<td style='background-color:#F4ED9C;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;text-align:left;width:300px'>";
        html += productos[i];
        html += "</td>";
        html += "<td style='background-color:#F4ED9C;width:75px'>";
        html += window[productos[i] + "_Unidad"];
        html += "</td>";
        html += "<td style='background-color:#F4ED9C;text-align:right;width:75px'>";
        html += window[productos[i] + "_Cantidad"];
        html += "</td>";
        for (var j = 0; j < nProveedores; j++) {
            html += "<td style='text-align:right;width:75px'>";
            html += window[proveedores[j] + "_" + productos[i] + "_Precio"];
            html += "</td>";
            html += "<td style='text-align:right;font-weight:bold;width:75px'>";
            html += window[proveedores[j] + "_" + productos[i] + "_SubTotal"];
            html += "</td>";
        }
        html += "</tr>";
    }
    html += "<tr>";
    html += "<td colspan='3' style='text-align:right;font-weight:bold;width:300px'>";
    html += "TOTALES:";
    html += "</td>";
    for (var j = 0; j < nProveedores; j++) {
        html += "<td style='width:75px'>";
        html += "";
        html += "</td>";
        html += "<td style='text-align:right;font-weight:bold;width:75px' id='tdSubTotal";
        html += j;
        html += "'>";
        html += formatoNumeroDecimal(window[proveedores[j] + "_SubTotal"]);
        html += "</td>";
    }
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    var div = document.getElementById(div);
    div.innerHTML = html;
    var minSubTotal = 100000000;
    var posMin = -1;
    for (var j = 0; j < nProveedores; j++) {
        if (window[proveedores[j] + "_SubTotal"] < minSubTotal) {
            minSubTotal = window[proveedores[j] + "_SubTotal"];
            posMin = j;
        }
    }
    if (posMin > -1) {
        var celda = document.getElementById("tdSubTotal" + posMin);
        if (celda != null) celda.style.color = 'red';
    }
}

function validarCuadroCompara() {
    //var idProveedor = cboProveedor.value;
    var idTipoEjecucion = cboTipoEjecucion.value;
    if (idRegistro == "") {
        mostrarMensaje("Seleccione una Solicitud de la fila", "error");
        return false;
    }
    //else if (idProveedor == "") {
    //    mostrarMensaje("Otorgue la buena pro al Proveedor", "error");
    //    cboProveedor.focus();
    //    return false;
    //}
    else if (idTipoEjecucion == "") {
        mostrarMensaje("Seleccione Tipo de Ejecución", "error");
        cboTipoEjecucion.focus();
        return false;
    }
    else {
        return true;
    }
}

function grabarCuadroCompara() {
    var idSolicitud = idRegistro;
    //var idProveedor = cboProveedor.value;
    var idTipoEjecucion = cboTipoEjecucion.value;
    var data = "";
    data = idSolicitud + '|' + idTipoEjecucion;
    var txtFechaInicio = document.getElementById("txtFechaInicio").value;
    var txtFechaFinal = document.getElementById("txtFechaFinal").value;
    data = data + '¯' + txtFechaInicio + '|' + txtFechaFinal

    var frm = new FormData();
    frm.append("data", data);
    Http.post("General/guardar?tbl=" + controller + vista, mostrarGrabar, frm);

    btnGuardar.innerHTML = "Guardando <i class='fa fa-circle-o-notch fa-spin' style='color:white'></i>";
    btnGuardar.disabled = true;
}

function GenerarOrdenCompra(rpta) {
    if (rpta) {
        cboFteFto.value = "";
        ttaJustificacion.value = "";
        ttaPedidos.value = "";

        var listas = rpta.split("¯");
        var cabecera = listas[0].split("|");
        lblProveedor.setAttribute('data-id', cabecera[0]);
        lblProveedor.innerHTML = cabecera[1];
        lblCotizacion.innerHTML = cabecera[2];
        lblProforma.innerHTML = cabecera[3];
        ttaPedidos.value = cabecera[4];
        lblDiasEntrega.innerHTML = cabecera[6];
        lblCondicionCompra.innerHTML = cabecera[7];
        lblTipo.innerHTML = cabecera[8];
        lblGarantia.innerHTML = cabecera[9];
        lblEstado.innerHTML = "PENDIENTE";
        ttaJustificacion.value = cabecera[10];
        var datos = "";
        var controles = document.getElementsByClassName("chkPopup");
        var nControles = controles.length;
        var control;

        for (var i = 0; i < nControles; i++) {
            control = controles[i];
            if (control.checked == true) {
                datos += control.value;
                datos += '¬';
            }
        }
        datos = datos.substr(0, datos.length - 1);
        generarDetalleOrdenCompra(datos);
    }
}


function generarDetalleOrdenCompra(datos) {
    var contenido = "";
    tbDetalleOrden.innerHTML = "";
    var lista = datos.split('¬');
    var lista = datos.split('¬');
    var nRegistros = lista.length;
    var campos = [];
    var item = 0;
    var total = 0;
    var subTotal = 0;

    for (var i = 0; i < nRegistros; i++) {
        campos = lista[i].split("|");
        item++;
        contenido += "<tr>";
        contenido += "<td style='width:50px;display:none'>";
        contenido += campos[0];
        contenido += "</td> ";
        contenido += "<td style='width:50px;display:none'>";
        contenido += campos[1];
        contenido += "</td> ";
        contenido += "<td style='width:50px;vertical-align:top'>";
        contenido += item
        contenido += "</td> ";
        contenido += "<td style='width:400px;white-space: pre-line;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
        contenido += campos[3];

        contenido += "</td>";
        contenido += "<td style='width:50px;vertical-align:top;'>";
        contenido += campos[4];
        contenido += "</td> ";
        contenido += "<td style='width:50px;vertical-align:top;text-align:right'>";
        contenido += formatoNumeroDecimal(campos[5]);
        contenido += "</td> ";
        contenido += "<td style='width:50px;vertical-align:top;text-align:right'>";
        contenido += formatoNumeroDecimal(campos[6]);
        contenido += "</td> ";
        contenido += "<td style='width:50px;vertical-align:top;text-align:right'>";
        contenido += formatoNumeroDecimal(campos[7]);
        contenido += "</td> ";
        contenido += "</tr>";
        total = total + (campos[7] * 1);
    }
    subTotal = total / 1.18;
    tbDetalleOrden.innerHTML = contenido;
    lblSubTotal.innerHTML = formatoNumeroDecimal(subTotal);
    lblIGV.innerHTML = formatoNumeroDecimal(total - subTotal);
    lblTotal.innerHTML = formatoNumeroDecimal(total);
}

function validarOrdenCompra() {
    var idFteFto = cboFteFto.value;
    var justificacion = ttaJustificacion.value;

    if (idFteFto == "") {
        mostrarMensaje("Seleccione Fuente Financimiento", "error");
        cboFteFto.focus();
        return false;

    }
    else if (justificacion == "") {
        mostrarMensaje("Ingrese Justificacion", "error");
        ttaJustificacion.focus();
        return false;
    }
    return true;
}

function grabarOrdenCompra() {
    var data = "";
    var total = lblTotal.innerHTML.replace(',', '')
    var idFteFto = cboFteFto.value;
    var justificacion = ttaJustificacion.value;
    var idRegistro = txtIdRegistro.value;

    data = idRegistro;
    data += "|";
    data += idSolCompra;
    data += "|";
    data += idProveedor
    data += "|";
    data += total.replace(',', '');
    data += "|";
    data += idFteFto
    data += "|";
    data += justificacion
    data += "¯";
    var nfilas = tbDetalleOrden.rows.length;
    var fila;
    for (var i = 0; i < nfilas; i++) {
        fila = tbDetalleOrden.rows[i];
        data += fila.cells[0].innerHTML; //codigo
        data += "|";
        data += fila.cells[2].innerHTML; //Item
        data += "|";
        data += fila.cells[1].innerHTML; //unidad medida
        data += "|";
        data += fila.cells[5].innerHTML.replace(/,/g, ''); //Cantidad
        data += "|";
        data += (fila.cells[6].innerHTML).replace(/,/g, ''); //Precio
        data += "¬";
    }
    data = data.substr(0, data.length - 1);

    var txtFechaInicio = document.getElementById("txtFechaInicio").value;
    var txtFechaFinal = document.getElementById("txtFechaFinal").value;

    data = data + '¯' + txtFechaInicio + '|' + txtFechaFinal
    var frm = new FormData();
    frm.append("data", data);
    Http.post("General/guardar?tbl=" + controller + vista, mostrarGrabar, frm);

    btnGuardar.innerHTML = "Guardando <i class='fa fa-circle-o-notch fa-spin' style='color:white'></i>";
    btnGuardar.disabled = true;
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
            listasDetalleItemPacProcesos(dataItem);

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
        dataItem += fila.cells[5].innerHTML.replace(/,/g, ''); //Cantidad
        dataItem += "|";
        dataItem += (fila.cells[6].innerHTML).replace(/,/g, ''); //Precio
        dataItem += "¬";
    }
    dataItem = dataItem.substr(0, dataItem.length - 1);

    var frm = new FormData();
    data = obtenerDatosGrabar("Popuproceso");
    data += "¯" + dataItem;
    frm.append("data", data);

    Http.post("General/guardar/?tbl=" + controller + vista + 'Proceso', mostrarGrabar, frm);
}

function listasDetalleItemPacProcesos(listaDetalle) {
    //Detalle
    if (listaDetalle) {
        var listaDet = listaDetalle.split('¬');
        var nRegistros = listaDet.length;
        var camposDetalle = [];

        var filaDetalle = '';
        for (var i = 0; i < nRegistros; i++) {
            camposDetalle = listaDet[i].split("|");
            //totalCantidad = totalCantidad + (camposDetalle[5] * 1);
            //totalMonto = totalMonto + (camposDetalle[6]*1);
            // item++;
            filaDetalle += '<tr>';
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[1] + "</td> ";
            filaDetalle += "<td style='white-space:pre-wrap;width:50px;display:none'>" + camposDetalle[2] + "</td> ";
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[0] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[3] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + camposDetalle[4] + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + formatoNumeroDecimal(camposDetalle[5]) + '</td>';
            filaDetalle += '<td style="white-space:pre-wrap;width:50px;" colspan="1">' + formatoNumeroDecimal(camposDetalle[6]) + '</td>';
            filaDetalle += "<td style='white-space:pre-wrap;width:10px;vertical-align:top;'>";
            filaDetalle += "<i class='fa fa-trash f-16 text-c-red' title='Quitar Item' onclick='retirarItemPCA(this,\"";
            filaDetalle += camposDetalle[0];
            filaDetalle += "\");'></i>";
            filaDetalle += "</td>";
            filaDetalle += '</tr>';
        }
        tbDetalleItemPac.insertAdjacentHTML("beforeend", filaDetalle);

        var nFilas = tbDetalleItemPac.rows.length;
        tbBodyDetalleItemPac.innerHTML = "";

        if ((nFilas * 1) > 1) {

            var totalCantidad = 0;
            var totalMonto = 0;

            var fila, itemCant = 0, itemMonto = 0;
            for (var i = 0; i < nFilas; i++) {
                fila = tbDetalleItemPac.rows[i];

                itemCant = (fila.cells[5].innerText).replace(/,/g, '');
                itemMonto = (fila.cells[6].innerText).replace(/,/g, '');
                totalCantidad = totalCantidad + (itemCant * 1);
                totalMonto = totalMonto + (itemMonto * 1);
            }

            var tbBodyResumen = "";
            tbBodyResumen += '<tr>';
            tbBodyResumen += '<td colspan="3" class="text-right">TOTAL</td>';
            tbBodyResumen += '<td>' + formatoNumeroDecimal(totalCantidad) + '</td>';
            tbBodyResumen += '<td colspan="2">' + formatoNumeroDecimal(totalMonto) + '</td>';
            tbBodyResumen += '</tr>';
            tbBodyDetalleItemPac.innerHTML = tbBodyResumen;
        }
    }
}

function retirarItemPCA(col, id) {

    var filaRemove = col.parentNode.parentNode;
    tbDetalleItemPac.removeChild(filaRemove);

    var dataItem = "";
    var nFilas = tbDetalleItemPac.rows.length;
    var fila, item = 0;
    for (var i = 0; i < nFilas; i++) {
        item += 1;
        fila = tbDetalleItemPac.rows[i];
        dataItem += item + '|' + fila.cells[0].innerHTML + '|';
        dataItem += fila.cells[1].innerHTML + '|' + fila.cells[3].innerHTML + '|';
        dataItem += fila.cells[4].innerHTML + '|';
        dataItem += (fila.cells[5].innerHTML).replace(/,/g, '') + '|';
        dataItem += (fila.cells[6].innerHTML).replace(/,/g, '');
        dataItem += "¬";
    }
    dataItem = dataItem.substr(0, dataItem.length - 1);

    tbDetalleItemPac.innerHTML = "";
    listasDetalleItemPacProcesos(dataItem);
}


function generarDetalleOrdenCompraAsig(datos, tipo) {
    var contenido = "";
    tbDetalleOrden.innerHTML = "";
    var lista = datos.split('¬');
    var nRegistros = lista.length;
    var campos = [];
    var item = 0;
    var total = 0;
    var subTotal = 0;
    for (var i = 0; i < nRegistros; i++) {
        campos = lista[i].split("|");
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
        contenido += "<td style='width:50px;vertical-align:top'>";
        contenido += campos[1];
        contenido += "</td> ";
        contenido += "<td style='width:80px;vertical-align:top'>";
        contenido += campos[2];
        contenido += "</td> ";
        contenido += "<td style='width:80px;vertical-align:top'>";
        contenido += campos[3];
        contenido += "</td> ";
        contenido += "<td style='width:50px;vertical-align:top;text-align:right'>";
        contenido += formatoNumeroDecimal(campos[4]);
        contenido += "</td> ";
        contenido += "<td style='width:50px;vertical-align:top;text-align:right'>";
        contenido += formatoNumeroDecimal(campos[5]);
        contenido += "</td> ";
        contenido += "<td style='width:50px;vertical-align:top;text-align:right'>";
        contenido += formatoNumeroDecimal(campos[6]);
        contenido += "</td> ";
        contenido += "<td style='width:350px;white-space:pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;vertical-align:top'>";
        contenido += campos[7];
        contenido += "</td>";
        contenido += "<td style='width:50px;vertical-align:top;'>";
        contenido += campos[8];
        contenido += "</td> ";
        contenido += "</tr>";
        total = total + (campos[6] * 1);
    }

    //  subTotal = total / 1.18;
    tbDetalleOrden.innerHTML = contenido;
    //lblSubTotal.innerHTML = formatoNumero(subTotal);
    //lblIGV.innerHTML = formatoNumero(total - subTotal);
    //lblTotal.innerHTML = formatoNumero(total);
}


function seleccionarFilaItem(fila, id) {
    filaDetalle = fila;
    //if (fila!= null) fila.className = "FilaDatos";
    //fila.className = "FilaSeleccionada";
    // fila = fila;
    limpiarForm("asignar");
    var data = "";
    var anioFiscal = txtAnioFiscal.value;
    var idMes = cboMes.value;
    var idFteFto = cboFteFto.value;
    var idRegistro = txtIdRegistro.value;

    if (anioFiscal == "") {
        txtAnioFiscal.focus();
        mostrarMensaje("Ingrese año fiscal", "error");
        return false;
    }
    else if (idMes == "") {
        cboMes.focus();
        mostrarMensaje("Seleccione Mes", "error");
        return false;
    }
    else if (idFteFto == "") {
        cboFteFto.focus();
        mostrarMensaje("Seleccione Fuente Financimiento", "error");
        return false;
    }
    else {
        data = anioFiscal + '|' + idMes + '|' + idFteFto + '|' + idRegistro;
        Http.get("General/listarTabla/?tbl=" + controller + vista + "Ayudas&data=" + data, mostrarAsignarAyudas);
    }
}


function mostrarAsignarAyudas(rpta) {
    if (rpta) {
        divPopupContainerForm1.style.display = 'block';
        var listas = rpta.split('¯');
        var listaPCA = listas[0].split('¬');
        var listaMeta = listas[1].split('¬');
        listaSubMeta = listas[2].split('¬');
        var listaPartida = listas[3].split('¬');
        crearCombo(listaPCA, "cboPCA", null);
        crearCombo(listaMeta, "cboMeta", "Seleccionar");
        cboSubMeta.disabled = true;
        cboSubMeta.innerHTML = "";
        crearCombo(listaPartida, "cboClasificador", "Seleccionar");
    }
    else {
        mostrarMensaje("No se obtuvo respuesta de las ayudas", "error")
    }
}


function grabarPeriodo() {
    var anioFiscal = txtAnioFiscal.value;
    var idMes = cboMes.value;
    var idFteFto = cboFteFto.value;
    var idRegistro = txtIdRegistro.value;

    if (anioFiscal == "") {
        txtAnioFiscal.focus();
        mostrarMensaje("Ingrese año fiscal", "error");
        return false;
    }
    else if (idMes == "") {
        cboMes.focus();
        mostrarMensaje("Seleccione Mes", "error");
        return false;
    }
    else if (idFteFto == "") {
        cboFteFto.focus();
        mostrarMensaje("Seleccione Fuente Financimiento", "error");
        return false;
    }
    var data = "";
    data = anioFiscal + '|' + idMes + '|' + idFteFto + '|' + idRegistro;
    var frm = new FormData();
    frm.append("data", data);
    Http.post("General/guardar/?tbl=" + controller + vista + "Periodo", mostrarGrabarPeriodo, frm);
}

function mostrarGrabarPeriodo(rpta) {
    var mensajeResul = [];
    if (rpta) {
        var listas = rpta.split('¯');
        mensajeResul = listas[0].split('|');
        var listaDetalle = listas[1];

        var tipo = mensajeResul[0];
        var mensaje = mensajeResul[1];
        if (tipo == 'A') {
            mostrarMensaje(mensaje, 'success');
        }
        else {
            mostrarMensaje(mensaje, 'error');
        }
        generarDetalleOrdenCompraAsig(listaDetalle, 2);
    }
}


function listarSubMeta() {
    var nRegistros = listaSubMeta.length;
    var campos = [];
    var contenido = "<option value=''>Seleccione</option>";
    var idMeta, idSubMeta, nombre, idxMeta;
    var idMeta = document.getElementById("cboMeta").value;
    for (var i = 0; i < nRegistros; i++) {
        campos = listaSubMeta[i].split('|');
        idSubMeta = campos[0];
        nombre = campos[1];
        idxMeta = campos[2];

        if (idxMeta == idMeta) {
            contenido += "<option value='";
            contenido += idSubMeta;
            contenido += "'>";
            contenido += nombre;
            contenido += "</option>";
        }
    }
    document.getElementById("cboSubMeta").disabled = false;
    var cbo = document.getElementById("cboSubMeta");
    if (cbo != null) cbo.innerHTML = contenido;
}

function configurarOptions() {
    var optRecordProv = document.getElementById("optRecordProv");
    if (optRecordProv != null) optRecordProv.onclick = function () {
        divProveedor.style.display = 'none';
        divItems.style.display = 'none';
    }

    var optItems = document.getElementById("optItems");
    if (optItems != null) optItems.onclick = function () {
        divItems.style.display = 'block';
        divProveedor.style.display = 'none';
    }

    var optOCProv = document.getElementById("optOCProv");
    if (optOCProv != null) optOCProv.onclick = function () {
        divProveedor.style.display = 'block';
        divItems.style.display = 'none';
    }
}