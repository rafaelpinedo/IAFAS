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


window.onload = function () {
    getConfigMn();
    vista = window.sessionStorage.getItem("Vista");
    controller = window.sessionStorage.getItem("Controller");
    getListar();
    configurarBotones();
    configurarCombos();
}

function getListar() {
    var data = "";
    Http.get("General/listarTabla?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
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

        else {
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
        }
    }
}


function grabarDatos() {
    var data = ""
    var frm = new FormData();
    data = obtenerDatosGrabar("Popup");

    if (vista == "Comite") {
        let detalle = obtenerItemComision();
        data += '¯' + detalle;
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


   
    
}

function configurarCombos() {
    var cboEntidad = document.getElementById("cboEntidad");
    if (cboEntidad != null) cboEntidad.onchange = function () {
        listarOficinaItem();
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