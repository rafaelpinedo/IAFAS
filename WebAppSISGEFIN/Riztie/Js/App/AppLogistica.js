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

window.onload = function () {
    getConfigMn();
    vista = window.sessionStorage.getItem("Vista");
    controller = window.sessionStorage.getItem("Controller");
    if (vista == "PedidoCompra" || vista == "SolicitudCompra" || vista == "Cotizacion" || vista == "CuadroCompara" || vista == "OrdenCompra") {
        getListarPedido();
    }
    else {
        getListar();
    }
    configurarBotones();
    configurarConsultas();
    configurarCombos();
}

function getListarPedido() {
    var data = "";
    var txtFechaInicio = document.getElementById("txtFechaInicio").value;
    var txtFechaFinal = document.getElementById("txtFechaFinal").value;
    data = txtFechaInicio + '|' + txtFechaFinal;
    Http.get("General/listarTabla/?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
}

function getListar() {
    var data = "";
    Http.get("General/listarTabla?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
}

function mostrarlistas(rpta) {
    if (rpta) {
        var listas = rpta.split("¯");
        var lista = listas[0].split("¬");

        if (vista == "Proveedor") {
            var listaDocumento = listas[1].split("¬");
            var listaBanco = listas[2].split("¬");
            var listaEstado = listas[3].split("¬");

            var botones = [
                { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
                { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
            ];
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaDocumento, "cboTipoDocumento", "Seleccione");
            crearCombo(listaBanco, "cboBanco", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "Oficina") {
            var listaEntidad = listas[1].split("¬");
            var listaOficinaPadre = listas[2].split("¬");
            var listaEstado = listas[3].split("¬");

            var botones = [
                { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
                { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
            ];
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaEntidad, "cboEntidad", "Seleccione");
            crearCombo(listaOficinaPadre, "cboOficinaPadre", "Ninguno");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "CondicionCompra") {
            var listaEntidad = listas[1].split("¬");
            var botones = [
                { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
                { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
            ];
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaEntidad, "cboTipoCC", "Seleccione");
        }
        else if (vista == "Formato") {
            var listaEntidad = listas[1].split("¬");
            var listaDocumento = listas[2].split("¬");
            var listaEstado = listas[3].split("¬");


            var botones = [
                { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
                { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
            ];
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaEntidad, "cboEntidad", "Seleccione");
            crearCombo(listaDocumento, "cboDocumento", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");

        }
        else if (vista == "Formato") {
            var listaDocumentos = listas[1].split("¬");
            var listaEstado = listas[2].split("¬");
            var botones = [
                { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
                { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
            ];
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaDocumentos, "cboFormato", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "PedidoCompra") {
            var listaTipo = listas[1].split("¬");
            var listaOficina = listas[2].split("¬");

            var botones = [
                { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
                { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
            ];
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaTipo, "cboTipoSolicitud", "Seleccione");
            crearCombo(listaOficina, "cboOficina", "Seleccione");
        }
        else if (vista == "Articulo"){
            var botones = [
                { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
                { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
            ];
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
          
            //crearCombo(listaOficina, "cboOficina", "Seleccione");
            //crearCombo(listaOficina, "cboOficina", "Seleccione");
        }

        else if (vista == "Grupo" ) {
            var botones = [
                { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
                { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
            ];
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            var listaTipoBien = listas[1].split("¬"); 
            var listaEstado = listas[2].split("¬");
            crearCombo(listaTipoBien, "cboTipoBien", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "UniMed") {
            var botones = [
                { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
                { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
            ];
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            var listaEstado = listas[1].split("¬");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "Clase") {
            var botones = [
                { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
                { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
            ];
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            var listaTipoBien = listas[1].split("¬");
            listaGrupoItem = listas[2].split("¬");
            var listaEstado = listas[3].split("¬");
            crearCombo(listaTipoBien, "cboTipoBien", "Seleccione");
            listarGrupoItem();
            //crearCombo(listaTipoBien, "cboTipoBien", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }

        else if (vista == "Familia") {
            var botones = [
                { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
                { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
            ];
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            var listaTipo = listas[1].split("¬");
            listaGrupoItem = listas[2].split("¬");
            listaClaseItem = listas[3].split("¬");
            var listaEstado = listas[4].split("¬");
            crearCombo(listaTipo, "cboTipoBien", "Seleccione");
            listarGrupoItem();
            crearCombo(listaEstado, "cboEstado", "Seleccione");
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
function configurarBotones() {
    var btnNuevo = document.getElementById("btnNuevo");
    if (btnNuevo != null) btnNuevo.onclick = function () {
        divPopupContainer.style.display = 'block';
        limpiarForm("Popup");

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

        var select2cboOficina= document.getElementById("select2-cboOficina-container");
        if (select2cboOficina != null) select2cboOficina.innerHTML = "Seleccione";

        var tbDetallePedido = document.getElementById("tbDetallePedido");
        if (tbDetallePedido != null) tbDetallePedido.innerHTML = "";
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

    var btnGuardar = document.getElementById("btnGuardar");

    /*
    if (btnGuardar != null) btnGuardar.onclick = function () {
        var validar = false;

        if (vista == "PedidoCompra" && validarPedido() == true) {
            validar = true;
        }
        //else if (vista == "SolicitudCompra" && validarSoliCompra()) {
        //    validar = true;
        //}
        //else if (vista == "Cotizacion" && validarCotizacion()) {
        //    validar = true;
        //}
        //else if (vista == "CuadroCompara" && validarCuadroCompara()) {
        //    validar = true;
        //}
        //else if (vista == "OrdenCompra" && validarOrdenCompra()) {
        //    validar = true;
        //}
       else if (validarInformacion("Reque")==true){
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
                    if (vista == "PedidoCompra") {
                        grabarPedido();
                    }
                    //else if (vista == "SolicitudCompra") {
                    //    grabarSolicitud();
                    //}
                    //else if (vista == "Cotizacion") {
                    //    grabarCotizacion();
                    //}
                    //else if (vista == "CuadroCompara") {
                    //    grabarCuadroCompara();
                    //}
                    //else if (vista == "OrdenCompra") {
                    //    grabarOrdenCompra();
                    //}
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
    */
    // se Omitio codigo de Guardar cascada
    var btnGuardar = document.getElementById("btnGuardar");
    if (btnGuardar != null) btnGuardar.onclick = function () {
        if (validarInformacion("Reque")) grabarDatos();
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

        if (fechaRequerida < fechaPedido)
        { mostrarMensaje("La fecha requerida no puede ser menor a la fecha de pedido", "error"); return false; }
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

function editarPedidoCompra(rpta) {
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
        var divPopupContainer = document.getElementById("divPopupContainer");
        if (divPopupContainer != null) { divPopupContainer.style.display = 'block'; };

        var controlesSelectSearch = document.getElementsByClassName("SelectSearch");
        var nControlesSelectSearch = controlesSelectSearch.length;
        var cboEstado = document.getElementById("cboEstado");
        if (cboEstado != null) { cboEstado.disabled = false };

        if (vista == "PedidoCompra") {
            editarPedidoCompra(rpta);
        }

        else if (vista == "Familia") {
            //B | 74 | 7408 | 74089557 | PRUEBA TEST FAMILIA | 1
       
            txtIdRegistro.value = campos[3];
            cboTipoBien.value = campos[0];
            listarGrupoItem();
            cboGrupo.value = campos[1];
            document.getElementById('select2-cboGrupo-container').innerHTML = cboGrupo.options[cboGrupo.selectedIndex].text;
            listarClaseItem();
            cboClase.value = campos[2];
            document.getElementById('select2-cboClase-container').innerHTML = cboClase.options[cboClase.selectedIndex].text;
            
        }

        else { 
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
    if (vista == "PedidoCompra") {
        var fechaInicio = txtFechaInicio.value;
        var fechaFinal = txtFechaFinal.value;
        data = id + '|' + fechaInicio + '|' + fechaFinal;
    }
    else {
        data = id;
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

function getReporte(id) {
    Http.get("General/obtenerReporteId/?tbl=" + controller + vista + '&id=' + id, mostrarReporte);
}

function mostrarReporte(rpta) {
    if (rpta) {

        var tipoOrden;
        var IdEmpresa;
        var listaReporte = rpta.split("¯");
        var Cabecera = listaReporte[0].split("|");

        if (vista == "CuadroCompara") {
            var detalle = listaReporte[1].split("¬");
            tdJustificacion.innerHTML = Cabecera[2];
            tdFechaEmision.innerHTML = Cabecera[0];
            tdArea.innerHTML = Cabecera[1];
            tdEvaluadorCC.innerHTML = Cabecera[3];
            spnGrado.innerHTML = Cabecera[4];
            spnCargo.innerHTML = Cabecera[5];
            spnNombre.innerHTML = Cabecera[6];
            spnCIP.innerHTML = Cabecera[7];
            spnBuenaPro.innerHTML = Cabecera[8];
            tdPresupuesto.innerHTML = Cabecera[9];
            generarPivotCC(detalle);
        }
        else if (vista == "PedidoCompra") {
            tdNroSolicitud.innerHTML = Cabecera[0];
            tdTipoSolicitud.innerHTML = Cabecera[1];
            tdFechaPedido.innerHTML = Cabecera[2];
            tdFechaRequerida.innerHTML = Cabecera[3];
            tdJustificacion.innerHTML = Cabecera[4];
            tdDocumento.innerHTML = Cabecera[7];
            tdEstado.innerHTML = Cabecera[6];
          //  spnPromotor.innerHTML = "DEL: " + Cabecera[8] + "<br />";
            if (Cabecera[5] != 1) {
                tdEtiquetaEstado.innerHTML = "";
            }
            else {
                tdEtiquetaEstado.innerHTML = "PENDIENTE DE APROBACION";
            }
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
            IdEmpresa = Cabecera[2];
            if (IdEmpresa == 1) {
                document.getElementById("tdNroOrden").innerHTML = "Nº " + Cabecera[0];
                document.getElementById("tdDia").innerHTML = Cabecera[3];
                document.getElementById("tdMes").innerHTML = Cabecera[4];
                document.getElementById("tdAnio").innerHTML = Cabecera[5];
                spnEmpresa.innerHTML = Cabecera[6];
                spnRUC.innerHTML = Cabecera[7];
                spnDireccion.innerHTML = Cabecera[8];
                tdRegistroInterno.innerHTML = Cabecera[9];
                tdCuadroC.innerHTML = Cabecera[10];
                tdRequerimiento.innerHTML = Cabecera[11];
                document.getElementById("tdCipDirector").innerHTML = Cabecera[17];
                document.getElementById("tdDirector").innerHTML = Cabecera[18];
                document.getElementById("tdGradoDirector").innerHTML = Cabecera[19];
                document.getElementById("tdCipAdmon").innerHTML = Cabecera[20];
                document.getElementById("tdAdmon").innerHTML = Cabecera[21];
                document.getElementById("tdGradoAdmon").innerHTML = Cabecera[22];
                tdJustificacion.innerHTML = Cabecera[39];
                tdTotal.innerHTML = formatoNumeroDecimal(Cabecera[15]);
                tdCuentasPagar.innerHTML = formatoNumeroDecimal(Cabecera[15]);
                tdPlazoEntrega.innerHTML = Cabecera[23] + " DIAS";
                tdCredito.innerHTML = Cabecera[24];
                tdMontoTexto.innerHTML = NumeroALetras(Cabecera[15]);
                tdResumenPresu.innerHTML = Cabecera[25] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + Cabecera[37] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + Cabecera[35];//Cabecera[16];
                tdGarantiaIAFAS.innerHTML = Cabecera[38];
                var contenido = ""
                if (tipoOrden == "SERVICIOS") {
                    snpTipoOrden.innerHTML = "ORDEN DE SERVICIO";
                    contenido = "<tr>";
                    contenido += "<th style='border: black 1px solid; padding: 5px'>ITEM</th>";
                    contenido += "<th style='border: black 1px solid;'>DESCRIPCION DETALLADA DEL SERVICIO</th>";
                    contenido += "<th style='border: black 1px solid; padding: 5px'>PRECIO(S/)</th>";
                    contenido += "</tr>";
                }
                else {
                    snpTipoOrden.innerHTML = "ORDEN DE COMPRA";
                    contenido = "<tr>";
                    contenido += "<th style='border: black 1px solid; padding: 5px'>ITEM</th>";
                    contenido += "<th style='border: black 1px solid;'>CANTIDAD</th>";
                    contenido += "<th style='border: black 1px solid; padding: 5px'>UNIDAD</th>";
                    contenido += "<th style='border: black 1px solid; padding: 5px'>DESCRIPCION DETALLADA DEL PRODUCTO</th>";
                    contenido += "<th style='border: black 1px solid; padding: 5px'>PRECIO UNITARIO</th>";
                    contenido += "<th style='border: black 1px solid; padding: 5px'>TOTAL</th>";
                    contenido += "</tr>";
                }
                tblCabecera.innerHTML = "";
                tblCabecera.innerHTML = contenido;
            }
            else {
                spnNroOrdenMGP.innerHTML = "Nº " + Cabecera[0];
                tdDiaMgp.innerHTML = Cabecera[3];
                tdMesMgp.innerHTML = Cabecera[4];
                tdAnioMgp.innerHTML = Cabecera[5];
                tdProveedorMgp.innerHTML = Cabecera[6];
                tdRUCMgp.innerHTML = Cabecera[7];
                tdDireccionMGP.innerHTML = Cabecera[8];
                tdTelefonoProvMgp.innerHTML = Cabecera[26];
                tdCorreoProvMgp.innerHTML = Cabecera[27];
                tdCCIMGP.innerHTML = Cabecera[28];
                tdBancoProvMgp.innerHTML = Cabecera[29];
                tdTelefonoMGP.innerHTML = Cabecera[30];
                tdAreaMGP.innerHTML = Cabecera[12];
                if (Cabecera[23] != "") {
                    tdPlazoEntregaMgp.innerHTML = Cabecera[23] + " DIAS";
                }
                else {
                    tdPlazoEntregaMgp.innerHTML = "";
                }
                tdFormaPagoMGP.innerHTML = Cabecera[24];
                spnMontoLetraMgp.innerHTML = NumeroALetras(Cabecera[15]);
                tdTotalMgp.innerHTML = formatoNumeroDecimal(Cabecera[15]);
                tdIGVMgp.innerHTML = formatoNumeroDecimal(Cabecera[14]);
                tdSubTotalMgp.innerHTML = formatoNumeroDecimal(Cabecera[13]);
                tdMetaMgp.innerHTML = Cabecera[36];
                tdSubMetaMgp.innerHTML = Cabecera[37];
                tdPartidaMgp.innerHTML = Cabecera[35];
                tdProcesoMgp.innerHTML = Cabecera[33];
                tdFteFtoMgp.innerHTML = Cabecera[25];
                tdEcofinMgp.innerHTML = Cabecera[34];
                tdGarantiaMgp.innerHTML = Cabecera[38];
                var contenido = ""
                if (tipoOrden == "SERVICIOS") {
                    snpTipoOrden.innerHTML = "ORDEN DE SERVICIO";
                    contenido = "<tr>";
                    contenido += "<th style='border: black 1px solid; padding: 5px'>ITEM</th>";
                    contenido += "<th style='border: black 1px solid;'>DESCRIPCION DETALLADA DEL SERVICIO</th>";
                    contenido += "<th style='border: black 1px solid; padding: 5px'>PRECIO(S/)</th>";
                    contenido += "</tr>";
                }
                else {
                    snpTipoOrden.innerHTML = "ORDEN DE COMPRA";
                    contenido = "<tr>";
                    contenido += "<th style='border: black 1px solid; padding: 5px'>ITEM</th>";
                    contenido += "<th style='border: black 1px solid;'>CANTIDAD</th>";
                    contenido += "<th style='border: black 1px solid; padding: 5px'>UNIDAD</th>";
                    contenido += "<th style='border: black 1px solid; padding: 5px' colspan='4'>DESCRIPCION DETALLADA DEL PRODUCTO</th>";
                    contenido += "<th style='border: black 1px solid; padding: 5px' colspan='2'>PRECIO UNITARIO</th>";
                    contenido += "<th style='border: black 1px solid; padding: 5px'>TOTAL</th>";
                    contenido += "</tr>";
                }
                tblCabeceraMgp.innerHTML = "";
                tblCabeceraMgp.innerHTML = contenido;

                if (tipoOrden == "SERVICIOS") {
                    spnTipoOrdenMGP.innerHTML = "ORDEN DE SERVICIO";
                    tdRecepccion.innerHTML = "RECEPCION ORDEN DE SERVICIO";
                    tdNotaMgp.innerHTML = "NOTA:<br />- Sírvase remitir para su cancelación Factura o Factura Electrónica o Boleta de Venta o Recibo por Honorarios, según corresponda:a nombre de la Marina de Guerra del Perú, R.U.C.: 20153408191. Adjuntando el Acta de Conformidad y la presente Orden de Servicio.<br />" +
                        "- En caso de retraso injustificado del contratista en la ejecución de las presentación objeto del contrato, la entidad le aplica automatianmente la penalidad por mora po cada día de retraso de acuerdo a lo establecido en el Art.Nº 162 de la Ley del Estado, aprobado mediante Decreto Supremo Nº 344 - 2018 - EF < br />" +
                        "- La Orden de Servicio es nula sin las firmas y sellos autorizados.";
                    tdRecibiMgp.innerHTML = "EN LA FECHA SE DEJA CONSTANCIA QUE<br />SE HA CULMINADO EL TRABAJO";
                    tdRecibiMgp.style.textAlign = "center";
                }
                else {
                    spnTipoOrdenMGP.innerHTML = "ORDEN DE COMPRA";
                    tdRecepccion.innerHTML = "RECEPCION ORDEN DE COMPRA";
                    tdNotaMgp.innerHTML = "NOTA:<br />Para efectos de pago:<br/>" +
                        "- Sírvase remitir para su cancelación Factura o Factura Electrónica o Boleta de Venta o Recibo por Honorarios, según corresponda: a nombre de la Marina de Guerra del Perú, R.U.C.: 20153408191. Adjuntando el Acta de Conformidad.<br /> " +
                        "- El proveedor debe adjuntar a su factura la copia de Orden de Compra<br />" +
                        "- Esta O/C se anulará sin las firmas mancomunadas respectivas.<br />" +
                        "- El area usuaria se reservará el derecho de devolver los materiales que no cumplan con las especificaciones técnicas requeridas.";
                    tdRecibiMgp.innerHTML = "GRADO:................................................<br/>" +
                        "ANTEFIRMA:.........................................<br/>" +
                        "CIP:........................................................";
                    tdRecibiMgp.style.textAlign = "left";
                    tdRecibiMgp.style.fontSize = "8px";
                }
            }
        }

        var contenido = "";
        listaDetalleReporte = listaReporte[1].split("¬");
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
                        if (empresa == "MGP") {
                            contenido += "<td colspan='4' style='vertical-align:top;text-align: left;max-width:500px;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
                            contenido += campos[1];
                            contenido += "</td>";
                            contenido += "<td colspan='2' style='vertical-align:top;text-align: right;'>";
                            contenido += formatoNumeroDecimal(campos[4] * 1);
                            contenido += "</td>";
                        }
                        else {
                            contenido += "<td style='vertical-align:top;text-align: left;max-width:500px;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;'>";
                            contenido += campos[1];
                            contenido += "</td>";
                            contenido += "<td style='vertical-align:top;text-align: right;'>";
                            contenido += formatoNumeroDecimal(campos[4] * 1);
                            contenido += "</td>";
                        }
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