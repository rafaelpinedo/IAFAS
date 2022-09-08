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
var listaUbigeo = [];

window.onload = function () {
    getConfigMn();
    vista = window.sessionStorage.getItem("Vista");
    controller = window.sessionStorage.getItem("Controller");
    getListar();
    configurarBotones();
    configurarCombos();
    configurarConsultas();
}

function NumCheck(e, field) {
    key = e.keyCode ? e.keyCode : e.which
    // backspace
    if (key == 8) return true
    // 0-9
    if (key > 47 && key < 58) {
        if (field.value == "") return true
        regexp = /^\d+(\.\d{0,2})?$/;
        return (regexp.test(field.value))
    }
    // .
    //if (key == 46) {
    //    if (field.value == "") return false
    //    regexp = /^[0-9]+$/
    //    return regexp.test(field.value)
    //}

    return false
}

function getListar() {
    var data = "";
    Http.get("General/listarTabla?tbl=" + controller + vista + "&data=" + data, mostrarlistas);
}

function mostrarlistas(rpta) {
    if (rpta) {
        var listas = rpta.split("¯");
        var lista = listas[0].split("¬");

        if (vista == "Personal") {
            var listaTipoDocumento = listas[1].split("¬");
            var listaPais = listas[2].split("¬");
            var listaEntidad = listas[3].split("¬");
            listaOficina_VG = listas[4].split("¬");
            var listaEstado = listas[5].split("¬");
          
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaTipoDocumento, "cboTipoDocumento", "Seleccione");
            listarSelect2Item(listaPais, "cboPais");
            listarSelect2Item(listaEntidad, "cboEntidad");
            /*listarSelect2Item(listaOficina, "cboOficina");*/
            listarOficinaItem();
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "Persona") {
            var listaDocumento = listas[1].split("¬");
            var listaTipoContr = listas[2].split("¬");
            var listaSexo = listas[3].split("¬");
            var listaEstadoCivil = listas[4].split("¬");
            var listaEstado = listas[5].split("¬");
            listaUbigeo = listas[6].split("¬");
            listarDepartamentos();
            var listaGradoMil = listas[7].split("¬");
            var listaSituacionMil = listas[8].split("¬");
            var listaBanco = listas[9].split("¬");
            var listaPais = listas[10].split("¬");
            var listaEntidad = listas[11].split("¬");
            var listaOficina = listas[12].split("¬");
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaDocumento, "cboTipoDocumento", "Seleccione");
            crearCombo(listaTipoContr, "cboTipoContribuyente", "Seleccione");
            crearCombo(listaSexo, "cboSexo", "Seleccione");
            crearCombo(listaEstadoCivil, "cboEstadoCivil", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
            crearCombo(listaGradoMil, "cboGrado", "Seleccione");
            crearCombo(listaSituacionMil, "cboSituacion", "Seleccione");
            crearCombo(listaBanco, "cboBanco", "Seleccione");
            crearCombo(listaPais, "cboPais", "Seleccione");
            crearCombo(listaEntidad, "cboEntidad", "Seleccione");
            crearCombo(listaOficina, "cboOficina", "Seleccione");
           
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


function grabarDatos() {
    var data = ""
    var frm = new FormData();
    data = obtenerDatosGrabar("Popup");
    frm.append("data", data);
    console.log(data);
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


        if (vista == "Personal") {
            txtIdRegistro.value = campos[0];
            cboTipoDocumento.value = campos[1];
            txtDocumento.value = campos[2];
            txtApellPaterno.value = campos[3];
            txtApellMaterno.value = campos[4];
            txtNombres.value = campos[5];
            cboPais.value = campos[6];
            txtTelefono.value = campos[7];
            txtCorreo.value = campos[8];
            cboEntidad.value = campos[9];
            listarOficinaItem();
            cboOficina.value = campos[10];
            document.getElementById('select2-cboOficina-container').innerHTML = cboOficina.options[cboOficina.selectedIndex].text;
            cboEstado.value = campos[11];

        }

        else if (vista =="Persona") {
            txtIdRegistro.value = campos[0];
            cboTipoDocumento.value = campos[1];
            cboTipoContribuyente.value = campos[2];
            chkEsEmpleado.value = campos[3];
            chkEsProveedor.value = campos[4];
            chkEsAsegurado.value = campos[5];
            chkEsFamiliar.value = campos[6];
            chkEsOtros.value = campos[7];
            txtRUC.value = campos[8];
            txtRazonSocial.value = campos[9];
            txtNroDocumento.value = campos[10];
            txtApePaterno.value = campos[11];
            txtApeMaterno.value = campos[12];
            txtNombres.value = campos[13];

            cboPais.value = campos[14];
            txtTelefono.value = campos[15];
            txtCorreo.value = campos[16];
            txtFechaNacimiento.value = campos[17];
            cboSexo.value = campos[18];
            cboEstadoCivil.value = campos[19];
            cboEstado.value = campos[20];

            cboEntidad.value = campos[21];
            cboOficina.value = campos[22];
            txtFechaIngreso.value = campos[23];

            listarDepartamentos();
            cboDepartamento.value = campos[24];
           // document.getElementById('select2-cboDepartamento-container').innerHTML = cboDepartamento.options[cboDepartamento.selectedIndex].text;
            listarProvincias();
            cboProvincia.value = campos[25];
            //document.getElementById('select2-cboProvincia-container').innerHTML = cboProvincia.options[cboProvincia.selectedIndex].text;
            listarDistritos();
            cboDistrito.value = campos[26];
           // document.getElementById('select2-cboDistrito-container').innerHTML = cboDistrito.options[cboDistrito.selectedIndex].text;

            ttaDireccion.value = campos[27];
            cboGrado.value = campos[28];
           // document.getElementById('select2-cboGrado-container').innerHTML = cboGrado.options[cboGrado.selectedIndex].text;
            cboSituacion.value = campos[29];
            txtCIP.value = campos[30];
            txtContacto.value = campos[31];
            dtgEsAgenteRetencion.value = campos[32];

            cboBanco.value = campos[33];
            txtNroCuenta.value = campos[34];
            txtCCI.value = campos[35];
            txtNroCuenta.value = campos[36];



            if (cboTipoDocumento.value == "4") {
                if (cboTipoContribuyente.value == "2") {
                    tipoPersonaNatural.style.display = "none";
                    tipoPersonaJuridica.style.display = "block";
                }
                else if (cboTipoContribuyente.value == "3") {
                    tipoPersonaJuridica.style.display = "none";
                    tipoPersonaNatural.style.display = "block";
                }
                else {
                    tipoPersonaJuridica.style.display = "block";
                    tipoPersonaNatural.style.display = "block";
                }
            }

            if (chkEsEmpleado.value == "1") {
                chklaborales.style.display = "block";
            }
            else {
                chklaborales.style.display = "none";
            }


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
        var cboEntidad = document.getElementById("cboEntidad");
        if (cboEntidad != null) {
            cboEntidad.value = 1;
            cboEntidad.disabled = true;
        }

        var cboTipoDocumento = document.getElementById("cboTipoDocumento");
        if (cboTipoDocumento != null) {
            cboTipoDocumento.value = 4;
        }

        var select2cboPais = document.getElementById("select2-cboPais-container");
        if (select2cboPais != null) select2cboPais.innerHTML = "Seleccione";

        var select2cboEntidad = document.getElementById("select2-cboEntidad-container");
        if (select2cboEntidad != null) select2cboEntidad.innerHTML = "Seleccione";

        var select2cboOficina = document.getElementById("select2-cboOficina-container");
        if (select2cboOficina != null) select2cboOficina.innerHTML = "Seleccione";

        var dtgEsAgenteRetencion = document.getElementById("dtgEsAgenteRetencion");
        if (dtgEsAgenteRetencion != null) {
            $('#dtgEsAgenteRetencion').bootstrapToggle('off')
        }

        

        var select2cboDepartamento = document.getElementById("select2-cboDepartamento-container");
        if (select2cboDepartamento != null) select2cboDepartamento.innerHTML = "Seleccione";

        var select2cboProvincia = document.getElementById("select2-cboProvincia-container");
        if (select2cboProvincia != null) select2cboProvincia.innerHTML = "Seleccione";

        var select2cboDistrito = document.getElementById("select2-cboDistrito-container");
        if (select2cboDistrito != null) select2cboDistrito.innerHTML = "Seleccione";

        var select2cboGrado = document.getElementById("select2-cboGrado-container");
        if (select2cboGrado != null) select2cboGrado.innerHTML = "Seleccione";

        //var chkEsEmpleado = document.getElementById("chkEsEmpleado")
        //if (chkEsEmpleado != null) {
        //    chklaborales.style.display = "none";
        //}
        
        if (vista == "Persona") {
            tipoPersonaNatural.style.display = "block";
            tipoPersonaJuridica.style.display = "block";
            chklaborales.style.display = "none";

            document.getElementById("txtRUC").classList.remove("Reque");
            document.getElementById("txtRazonSocial").classList.remove("Reque");
            document.getElementById("txtNroDocumento").classList.remove("Reque");
            document.getElementById("txtApePaterno").classList.remove("Reque");
            document.getElementById("txtApeMaterno").classList.remove("Reque");
            document.getElementById("txtNombres").classList.remove("Reque");

        }
    }


    var btnGuardar = document.getElementById("btnGuardar");
    if (btnGuardar != null) btnGuardar.onclick = function () {
        var validar = false;
        debugger
        if (vista == "Persona") {

            let inputs = document.querySelectorAll('.chkTipoPersonaId:checked');
            if (inputs.length == 0) {
                mostrarMensaje("Seleccionar Tipo de Persona","error")
                return;
            }
            // Aquí haces lo que debas hacer con cada checkbox
            //inputs.forEach(input => {
            //    console.log(input.value);
            //});


            let dni = txtNroDocumento.value;
            if (cboTipoDocumento.value == "4" && cboTipoContribuyente.value == "3") {
                txtRazonSocial.value = txtApePaterno.value + ' ' + txtApeMaterno.value + ', ' + txtNombres.value;
                document.getElementById("txtRUC").classList.remove("Reque");
                document.getElementById("txtRazonSocial").classList.remove("Reque");
                //if (dni.length != 8) {
                //    spnDniDocumento.innerHTML = "Nro de Documento Incorrecto";
                //    spnDniDocumento.style.color = "red";
                //}
            }
            else if (cboTipoDocumento.value == "4" && cboTipoContribuyente.value == "2") {
                document.getElementById("txtNroDocumento").classList.remove("Reque");
                document.getElementById("txtApePaterno").classList.remove("Reque");
                document.getElementById("txtApeMaterno").classList.remove("Reque");
                document.getElementById("txtNombres").classList.remove("Reque");
            }
            else {
                //document.getElementById("txtRUC").classList.add("Reque");
                //document.getElementById("txtRazonSocial").classList.add("Reque");
                document.getElementById("txtNroDocumento").classList.add("Reque");
                document.getElementById("txtApePaterno").classList.add("Reque");
                document.getElementById("txtApeMaterno").classList.add("Reque");
                document.getElementById("txtNombres").classList.add("Reque");
            }
           
        }

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


function mostrarDatosSunat(rpta) {
    if (rpta != "") {
        var obj = JSON.parse(rpta);
        if (obj.success) {
            spnDocumento.innerHTML = "";
            var ttaDireccion = document.getElementById("ttaDireccion");
            if (ttaDireccion != null) ttaDireccion.value = obj.data.direccion_completa;
            var txtNombre = document.getElementById("txtRazonSocial");
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

function configurarCombos() {
    var cboEntidad = document.getElementById("cboEntidad");
    if (cboEntidad != null) cboEntidad.onchange = function () {
        listarOficinaItem();
    }

    var cboDepartamento = document.getElementById("cboDepartamento")
    if (cboDepartamento != null) cboDepartamento.onchange = function () {
        listarProvincias();
    }

    var cboProvincia = document.getElementById("cboProvincia")
    if (cboProvincia != null) cboProvincia.onchange = function () {
        listarDistritos();
    }

    var cboTipoContribuyente = document.getElementById("cboTipoContribuyente")
    if (cboTipoContribuyente != null) cboTipoContribuyente.onchange = function () {
        if (cboTipoDocumento.value == "4") {
            if (cboTipoContribuyente.value == "2") {
                tipoPersonaNatural.style.display = "none";
                tipoPersonaJuridica.style.display = "block";
            }
            else if (cboTipoContribuyente.value == "3") {
                tipoPersonaJuridica.style.display = "none";
                tipoPersonaNatural.style.display = "block";
            }
            else {
                tipoPersonaJuridica.style.display = "block";
                tipoPersonaNatural.style.display = "block";
            }
        }
    }

    var chkEsEmpleado = document.getElementById("chkEsEmpleado")
    if (chkEsEmpleado != null) chkEsEmpleado.onchange = function () {
        var checked = chkEsEmpleado.checked;
        if (checked) {
            chklaborales.style.display = "block";
            tipoPersonaJuridica.style.display = "none";
            document.getElementById("txtRUC").classList.remove("Reque");
            document.getElementById("txtRazonSocial").classList.remove("Reque");
            //cboTipoDocumento.value = 2;
            //cboTipoContribuyente.value = 1;
        }
        else {
            chklaborales.style.display = "none";
            tipoPersonaJuridica.style.display = "block";
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