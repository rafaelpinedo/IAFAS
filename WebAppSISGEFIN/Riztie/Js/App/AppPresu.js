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
var listaMetaItem_VG = [];
var listaSubMetaItem_v = [];

window.onload = function () {
    getConfigMn();
    vista = window.sessionStorage.getItem("Vista");
    controller = window.sessionStorage.getItem("Controller");
    if (vista == "PCA") {
        getListarProgramacion();
    }
    else {
        getListar();
    }
    configurarBotones();
   configurarCombos();
}
function getListarProgramacion() {

    var data = "";
    var txtAnhoFiscal = document.getElementById("txtAnioFiscal").value;
    data = txtAnhoFiscal;
    Http.get("General/listarTabla/?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
}

function getListar() {
    var data = "";

    var txtAnio = document.getElementById("txtAnio");
    if (txtAnio != null) {
        data = txtAnio.value;
    }
    
    Http.get("General/listarTabla?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
}

function mostrarlistas(rpta) {
    if (rpta) {
        var listas = rpta.split("¯");
        var lista = listas[0].split("¬");

        if (vista == "Entidad") {
            var listaEmpresa = listas[1].split("¬");
            var listaEstado = listas[2].split("¬");
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaEmpresa, "cboEmpresa", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }

        else if (vista == "FuenteFto") { 
            var listaEstado = listas[1].split("¬");
             grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }

        else if (vista == "Meta") {
            var listaEstado = listas[1].split("¬");
             grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "SubMeta") {
            listaMetaItem_VG = listas[1].split("¬");
            var listaEstado = listas[2].split("¬");
  
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaEstado, "cboEstado", "Seleccione");
            listarMetaItem();
        }

        else if (vista == "ClasiIngreso") {
            let listaTipo = listas[1].split("¬");
            var listaEstado = listas[2].split("¬");
             grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaTipo, "cboTipoBien", "Ninguno");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "ClasiGasto") {

           // listaMetaItem_VG = listas[1].split("¬");
            let listaTipo = listas[1].split("¬");
            var listaEstado = listas[2].split("¬");
             grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            /*crearCombo(listaMetaItem_VG, "cboPadre", "Ninguno");*/
            crearCombo(listaTipo, "cboTipoBien", "Ninguno");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
            //var select2cboPadre= document.getElementById("select2-cboPadre-container");
            //if (select2cboPadre != null) select2cboPadre.innerHTML = "Ninguno";
           
            //listarMetaItem();
        }
        else if (vista == "CentroCosto") {
            var listaEntidad = listas[1].split("¬");
            var listaEstado = listas[2].split("¬");
 
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaEntidad, "cboEntidad", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
            
            listarMetaItem();
        }
        
        else if (vista == "PCA") {
            var listaEntidad = listas[1].split("¬");
            var listaFinanciamiento = listas[2].split("¬");
            var listaMeta = listas[3].split("¬");
            listaSubMetaItem_v = listas[4].split("¬");
            var listaEstado = listas[5].split("¬");
            var listaPresup = listas[6].split("¬");
             
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);

            crearCombo(listaEntidad, "cboEntidad", "Seleccione");
            crearCombo(listaFinanciamiento, "cboFuenteFto", "Seleccione");
            //listarSelect2Item(listaEntidad, "cboEntidad");
            listarSelect2Item(listaMeta, "cboMeta");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
            listarSubMetaItem();
            var pia = listaPresup[0].split("|")[0];
            totalsumAnho.innerText = "Total S/ : " + formatoNumeroDecimal(pia)
        }
        else if (vista == "MarcoPresu") {
            var listaPCA = listas[1].split('¬');
            var listaMeta = listas[2].split('¬');
            listaSubMetaItem_v = listas[3].split('¬');
            var listaClasificador = listas[4].split('¬');
             
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);

            listarSubMetaItem();
            crearCombo(listaPCA, "cboPCA", "Seleccionar");
            crearCombo(listaMeta, "cboMeta", "Seleccionar");
            crearCombo(listaClasificador, "cboClasificador", "Seleccionar");
        }
        else {
              grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
        }
    }
}


function listarMetaItem() {
    //var idTipoItem = cboTipoBien.value;
    var nRegistros = listaMetaItem_VG.length;
    var contenido = "<option value=''>Seleccione</option>";
    var campos, idCodigo, nombre;
    
    for (var i = 0; i < nRegistros; i++) {
        campos = listaMetaItem_VG[i].split('|');
        idCodigo = campos[0];
        nombre = campos[1];
        contenido += "<option value='";
        contenido += idCodigo;
        contenido += "'>";
        contenido += nombre;
        contenido += "</option>";
       
    }
    var cbo = document.getElementById("cboMeta");
    if (cbo != null) {
        cbo.innerHTML = contenido;
    }
    var cbo = document.getElementById("cboPadre");
    if (cbo != null) {
        if (listaMetaItem_VG != "") {
            cbo.innerHTML = contenido;
        }
    }
}

function listarSelect2Item(lista,idCombo) {
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

function listarSubMetaItem() {
    var idMeta = cboMeta.value;
    var nRegistros = listaSubMetaItem_v.length;
    var contenido = "<option value=''>Seleccione</option>";
    var campos, idCodigo, nombre, idxMetaItem;
    for (var i = 0; i < nRegistros; i++) {
        campos = listaSubMetaItem_v[i].split('|');
        idCodigo = campos[0];
        nombre = campos[1];
        idxMetaItem = campos[2];
        if (idxMetaItem == idMeta) {
            contenido += "<option value='";
            contenido += idCodigo;
            contenido += "'>";
            contenido += nombre;
            contenido += "</option>";
        }
    }
    var cbo = document.getElementById("cboSubMeta");
    if (cbo != null) {
        cbo.innerHTML = contenido;
       /* listarClaseItem();*/
    }
}

function grabarDatos() {
    var data = ""
    var frm = new FormData();
    data = obtenerDatosGrabar("Popup");
    if (vista == "PCA") {
        var txtAnhoFiscal = document.getElementById("txtAnioFiscal").value;
        data += "|" + txtAnhoFiscal;
    }

    var txtAnio = document.getElementById("txtAnio");
    if (txtAnio != null) {
        data += "¯" + txtAnio.value;
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
          grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);

        if (vista == "PCA") {
            var listaPresup = listas[2].split("¬");
            var pia = listaPresup[0].split("|")[0];
            totalsumAnho.innerText = "Total S/ : " + formatoNumeroDecimal(pia)
        }

        var cbo = document.getElementById("cboPadre");
        if (cbo != null) {
            var listaPadre = listas[2].split("¬");
            crearCombo(listaPadre, "cboPadre", "Ninguno");
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
    if (vista == "PCA") {
        var txtAnhoFiscal = document.getElementById("txtAnioFiscal").value;
        data += "|" + txtAnhoFiscal;
    }
    var txtAnio = document.getElementById("txtAnio");
    if (txtAnio != null) {
        data += "|" + txtAnio.value;
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

       if (vista == "PCA") {
            //txtIdRegistro.value = campos[0];
            //txtAnho.value = campos[1];
            //cboEntidad.value = campos[2];
            //cboFuenteFto.value = campos[3];
            cboMeta.value = campos[4];
            listarSubMetaItem();
            cboSubMeta.value = campos[5];
            document.getElementById('select2-cboSubMeta-container').innerHTML = cboSubMeta.options[cboSubMeta.selectedIndex].text;
            //txtPia.value = campos[6];
            //txtPim.value = campos[7];
            //txtEjecutado.value = campos[8];
            //txtDisponible.value = campos[9];
            //cboEstado.value = campos[10];
       }
       else if (vista == "MarcoPresu") {
            txtIdRegistro.value = campos[0];
           cboPCA.value = campos[1];
           document.getElementById('select2-cboPCA-container').innerHTML = cboPCA.options[cboPCA.selectedIndex].text;
           cboMeta.value = campos[2];
           document.getElementById('select2-cboMeta-container').innerHTML = cboMeta.options[cboMeta.selectedIndex].text;
            listarSubMetaItem();
           cboSubMeta.value = campos[3];
           document.getElementById('select2-cboSubMeta-container').innerHTML = cboSubMeta.options[cboSubMeta.selectedIndex].text;
           cboClasificador.value = campos[4];
           document.getElementById('select2-cboClasificador-container').innerHTML = cboClasificador.options[cboClasificador.selectedIndex].text;
           console.log(rpta);
           var divPopupContainer = document.getElementById("divPopupContainer");
           if (divPopupContainer != null) { divPopupContainer.style.display = 'block'; };
           return;
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

        var cboEmpresa = document.getElementById("cboEmpresa");
        if (cboEmpresa != null) {
            cboEmpresa.value = 1;
            cboEmpresa.disabled = true;
        }

        var cboEstado = document.getElementById("cboEstado");
        if (cboEstado != null) {
            cboEstado.value = 1;
            cboEstado.disabled = true;
        }
        var select2cboMeta = document.getElementById("select2-cboMeta-container");
        if (select2cboMeta != null) select2cboMeta.innerHTML = "Seleccione";

        var select2cboPadre = document.getElementById("select2-cboPadre-container");
        if (select2cboPadre != null) select2cboPadre.innerHTML = "Seleccione";

        var select2cboSubMeta = document.getElementById("select2-cboSubMeta-container");
        if (select2cboSubMeta != null) select2cboSubMeta.innerHTML = "Seleccione";

        var dtgFinal = document.getElementById("dtgEsFinal");
        if (dtgFinal != null) {
            $('#dtgEsFinal').bootstrapToggle('off')
        }

        if (vista == "PCA") {
            txtEjecutado.value = 0;
            txtDisponible.value = 0;
        }
          
        var txtAnioPerido = document.getElementById("txtAnioPerido");
        if (txtAnioPerido != null) {
            var anio = txtAnioPerido.getAttribute('value');
            txtAnioPerido.value = anio;
        }
        var select2cboClasificador = document.getElementById("select2-cboClasificador-container");
        if (select2cboClasificador != null) select2cboClasificador.innerHTML = "Seleccione";

        var select2cboPCA = document.getElementById("select2-cboPCA-container");
        if (select2cboPCA != null) select2cboPCA.innerHTML = "Seleccione";
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

    var btnConsultar = document.getElementById("btnConsultar");
    if (btnConsultar != null) btnConsultar.onclick = function () {
        if (vista == "PCA") {
            getListarProgramacion();
        }
        else {
            getListar();
        }
    }
}

function configurarCombos() {
    var cboMeta = document.getElementById("cboMeta");
    if (cboMeta != null) cboMeta.onchange = function () {
        listarSubMetaItem();
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

 