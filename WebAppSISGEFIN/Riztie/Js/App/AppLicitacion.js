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

var botonesProceso = [
    { "cabecera": "Editar", "clase": "fa fa-plus-circle btn btn-info btnCirculo", "id": "Proceso" },
    { "cabecera": "Editar", "clase": "fa fa-pencil btn btn-info btnCirculo", "id": "Editar" },
    { "cabecera": "Anular", "clase": "fa fa-minus-circle btn btn-danger btnCirculo", "id": "Eliminar" },
];

window.onload = function () {
    getConfigMn();
    vista = window.sessionStorage.getItem("Vista");
    controller = window.sessionStorage.getItem("Controller");
    if (vista == "PAC") {
        getListarLicitaPac();
    }
    else {
        getListar();
    }
    configurarBotones();
    configurarCombos();
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

        else {
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
        }
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


function grabarDatos() {
    var data = ""
    var frm = new FormData();
    data = obtenerDatosGrabar("Popup");

    if (vista == "Comite") {
        let detalle = obtenerItemComision();
        data += '¯' + detalle;
    }
    if (vista == "PAC") {
        var txtIdPacPr = document.getElementById("txtIdPac").value;
        if (txtIdPacPr == "0") {
            data += '|' + txtAnioFiscal.value;
        }
        
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
            botones = botonesProceso;
        }

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


        if (vista == "Comite") {
            var dataH = rpta.split('¯')[0];
            var dataList = rpta.split('¯')[1];

            campos = dataH.split('|');

            txtIdRegistro.value = campos[0];
            txtAnhio.value = campos[1];
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
                    listasDetalleItemPacProcesos(listaDetalle);

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
                var divPopupContainerForm1 = document.getElementById("divPopupContainerForm1");
                if (divPopupContainerForm1 != null) { divPopupContainerForm1.style.display = 'block'; };
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

        var select2cboPersona = document.getElementById("select2-cboPersona-container");
        if (select2cboPersona != null) select2cboPersona.innerHTML = "Seleccione";

        var tbDetalleComite = document.getElementById("tbDetalleComite");
        if (tbDetalleComite != null) {
            tbDetalleComite.innerHTML = "";
        }
        //Pac Nuevo
        let txtIdPac = document.getElementById("txtIdPac");
        if (txtIdPac != null) {
            txtIdPac.value = "0";
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
                    mensage = "Personal ya se encuentra" ;
                    break;
                }
                if (tbDetalleComite.rows[i].cells[1].innerHTML == codCargo) {
                    mensage = "Cargo ya se encuentra" ;
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

        var btnConsultarPac = document.getElementById("btnConsultarPac");
        if (btnConsultarPac != null) btnConsultarPac.onclick = function () {
            getListarLicitaPac();
        }
         
        
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