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
var listaSubCuentaItem = [];
var dataImport = "";
var dataCab = "";
var dataDeta = "";

window.onload = function () {
    getConfigMn();
    vista = window.sessionStorage.getItem("Vista");
    controller = window.sessionStorage.getItem("Controller");
    mostrarLoading("divLista");
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

function doubleCheck(e, field) {
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
    if (key == 46) {
        if (field.value == "") return false
        regexp = /^[0-9]+$/
        return regexp.test(field.value)
    }

    return false
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

        if (vista == "Asegurado") {
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
            crearCombo(listaTipoContr, "cboTipoContribuyente", null);
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
        else if (vista == "EntiFin") {
            var listaEstado = listas[1].split("¬");
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "LineaIngreso") {
            var listaclasificador = listas[1].split("¬");
            var listacuentaMayor = listas[2].split("¬");
            listaSubCuentaItem = listas[3].split("¬");
            var listaEstado = listas[4].split("¬");
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaclasificador, "cboClasificador", "Seleccione");
            crearCombo(listacuentaMayor, "cboCuentaMayor", "Seleccione");
            listarSubCuentaItem();
            crearCombo(listaEstado, "cboEstado", "Seleccione");
        }
        else if (vista == "Tarifa") {
            var listaIngreso = listas[1].split("¬");
            var listaMoneda = listas[2].split("¬");
            var listaEstado = listas[3].split("¬");
            grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
            crearCombo(listaIngreso, "cboIngreso", "Seleccione");
            crearCombo(listaMoneda, "cboMoneda", "Seleccione");
            crearCombo(listaEstado, "cboEstado", "Seleccione");
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
    if (vista == "Recaudacion") {
        frm.append("data", dataImport);
        Http.post("General/guardar/?tbl=" + controller + vista, mostrarGrabar, frm);
    }
    else {
        var txtAnio = document.getElementById("txtAnio");
        if (txtAnio != null) {
            data += "¯" + txtAnio.value;
            frm.append("data", data);
            Http.post("General/guardar/?tbl=" + controller + vista, mostrarGrabar, frm);
        }
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

    var txtAnio = document.getElementById("txtAnio");
    if (txtAnio != null) {
        data += '|' + txtAnio.value;
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


        if (vista == "Asegurado") {
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

            if (cboTipoContribuyente.value == "1") {
                tipoPersonaNatural.style.display = "block";
                tipoPersonaJuridica.style.display = "none";
                tipoPersonaJuridicaRuc.style.display = "none";
                cboTipoDocumento.value = "";
            }
            else if (cboTipoContribuyente.value == "2") {
                tipoPersonaNatural.style.display = "none";
                tipoPersonaJuridica.style.display = "block";
                tipoPersonaJuridicaRuc.style.display = "block";
                cboTipoDocumento.value = 4;

            }
            else if (cboTipoContribuyente.value == "3") {
                tipoPersonaNatural.style.display = "block";
                tipoPersonaJuridicaRuc.style.display = "block";
                tipoPersonaJuridica.style.display = "none";
                cboTipoDocumento.value = 4;
            }

        }
        else if (vista == "LineaIngreso") {
            txtIdRegistro.value = campos[0];
            txtIngreso.value = campos[1];
            txtAbreviatura.value = campos[2];
            cboCuentaMayor.value = campos[3];
            listarSubCuentaItem();
            cboSubCuenta.value = campos[4];
            cboClasificador.value = campos[5];
            cboEstado.value = campos[6];
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
    var btnCargarArchivo = document.getElementById("btnCargarArchivo");
    if (btnCargarArchivo != null) btnCargarArchivo.onclick = function () {
        divPopupContainer.style.display = 'block';
        spanPendiente.innerHTML = "";
    }

    var btnCargarCXC = document.getElementById("btnCargarCXC");
    if (btnCargarCXC != null) btnCargarCXC.onclick = function () {
        divPopupContainerForm1.style.display = 'block';
        fupExcel.value = "";
        snpnombrearchivo.innerHTML = "Seleccione archivo&hellip;";
        btnImportarExcel.disabled = false;
        btnImportarExcel.style.display = 'block';
        btnImportarExcel.innerHTML = "<i class='fa fa-upload' aria-hidden='true'></i>&nbsp;Importar";
    }

    var btnImportarExcel = document.getElementById("btnImportarExcel");
    if (btnImportarExcel != null) btnImportarExcel.onclick = function () {
        vista = window.sessionStorage.getItem("Vista");
        /* if (validarDatos()) {*/

        importarExcel("divPopupContainerForm1", "divListaExcel", dataCab, dataDeta);
        //btnGrabarExterno.style.display = 'block';

        //}
    }

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


        if (vista == "Asegurado") {
            tipoPersonaNatural.style.display = "block";
            tipoPersonaJuridica.style.display = "none";
            tipoPersonaJuridicaRuc.style.display = "none";
            divEstadoSunat.style.display = "none";
            cboTipoDocumento.value = 2;

            var cboTipoContribuyente = document.getElementById("cboTipoContribuyente");
            cboTipoContribuyente.value = 1;
            cboTipoContribuyente.disabled = true;

            document.getElementById("txtRUC").classList.remove("Reque");
            document.getElementById("txtRazonSocial").classList.remove("Reque");
            document.getElementById("txtNroDocumento").classList.remove("Reque");
            document.getElementById("txtApePaterno").classList.remove("Reque");
            document.getElementById("txtApeMaterno").classList.remove("Reque");
            document.getElementById("txtNombres").classList.remove("Reque");

        }

        var select2cboCuentaMayor = document.getElementById("select2-cboCuentaMayor-container");
        if (select2cboCuentaMayor != null) {
            select2cboCuentaMayor.innerHTML = "Seleccione";
            listarSubCuentaItem();
        }
        var select2cboSubCuenta = document.getElementById("select2-cboSubCuenta-container");
        if (select2cboSubCuenta != null) select2cboSubCuenta.innerHTML = "Seleccione";

        var select2cboClasificador = document.getElementById("select2-cboClasificador-container");
        if (select2cboClasificador != null) select2cboClasificador.innerHTML = "Seleccione";

        var txtAnofiscal = document.getElementById("txtAnofiscal");
        if (txtAnofiscal != null) {
            var anio = txtAnofiscal.getAttribute('value');
            txtAnofiscal.value = anio;
        }
    }


    var btnGuardar = document.getElementById("btnGuardar");
    if (btnGuardar != null) btnGuardar.onclick = function () {
        var validar = false;
        if (vista == "Asegurado") {

            let inputs = document.querySelectorAll('.chkTipoPersonaId:checked');
            if (inputs.length == 0) {
                mostrarMensaje("Seleccionar Tipo de Persona", "error")
                return;
            }

            if (cboTipoContribuyente.value == "1") {
                document.getElementById("txtNroDocumento").classList.add("Reque");
                document.getElementById("txtApePaterno").classList.add("Reque");
                document.getElementById("txtApeMaterno").classList.add("Reque");
                document.getElementById("txtNombres").classList.add("Reque");
                document.getElementById("txtRUC").classList.remove("Reque");
                document.getElementById("txtRazonSocial").classList.remove("Reque");
            }
            else {
                document.getElementById("txtRUC").classList.remove("Reque");
                document.getElementById("txtRazonSocial").classList.remove("Reque");
                document.getElementById("txtNroDocumento").classList.remove("Reque");
                document.getElementById("txtApePaterno").classList.remove("Reque");
                document.getElementById("txtApeMaterno").classList.remove("Reque");
                document.getElementById("txtNombres").classList.remove("Reque");
            }
        }
        else if (vista == "Recaudacion") {
            if (fupExcel.value = "") {
                mostrarMensaje("Seleccione el archivo excel a importar", "error");
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

    var btnConsultar = document.getElementById("btnConsultar");
    if (btnConsultar != null) btnConsultar.onclick = function () {
        getListar();
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

    var txtDNI = document.getElementById("txtNroDocumento");
    if (txtDNI != null) {
        txtDNI.onkeyup = function (event) {
            var cboTipoDocumento = document.getElementById("cboTipoDocumento");
            if (cboTipoDocumento.value == "2" || cboTipoDocumento.value == "4") {
                if (this.value != "" && this.value.length == 8 || (event.keyCode == 13)) {
                    spnLoadDoc.style.display = 'block';
                    Http.get("General/consultaDniReniec/?dni=" + this.value, mostrarDatosDNI);
                }
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

function mostrarDatosDNI(rpta) {
    if (rpta != "") {
        var obj = JSON.parse(rpta);

        if (obj.success) {
            spnDniDocumento.innerHTML = "";
            var ttaDireccion = document.getElementById("ttaDireccion");
            if (ttaDireccion != null) ttaDireccion.value = obj.data.direccion_completa;
            var txtApePaterno = document.getElementById("txtApePaterno");
            if (txtApePaterno != null) txtApePaterno.value = obj.data.apellido_paterno;
            var txtApeMaterno = document.getElementById("txtApeMaterno");
            if (txtApeMaterno != null) txtApeMaterno.value = obj.data.apellido_materno;
            var txtNombres = document.getElementById("txtNombres");
            if (txtNombres != null) txtNombres.value = obj.data.nombres;
            var txtNroDocumento = document.getElementById("txtNroDocumento");
            if (txtNroDocumento != null) txtNroDocumento.value = obj.data.numero;
            var cboSexo = document.getElementById("cboSexo");
            if (cboSexo != null) {
                switch (obj.data.sexo) {
                    case "MASCULINO":
                        cboSexo.value = 2;
                        break;
                    case "FEMENINO":
                        cboSexo.value = 3;
                        break;
                    default:
                        cboSexo.value = "";
                }
            }

            var cboEstadoCivil = document.getElementById("cboEstadoCivil");
            if (cboEstadoCivil != null) {
                switch (obj.data.estado_civil) {
                    case "SOLTERO":
                        cboEstadoCivil.value = 2;
                        break;
                    case "CASADO":
                        cboEstadoCivil.value = 3;
                        break;
                    case "VIUDO":
                        cboEstadoCivil.value = 4;
                        break;
                    case "DIVORCIADO":
                        cboEstadoCivil.value = 5;
                        break;
                    case "CONVIVIENTE":
                        cboEstadoCivil.value = 6;
                        break;
                    default:
                        cboEstadoCivil.value = "";
                }
            }

            var txtFechaNacimiento = document.getElementById("txtFechaNacimiento");
            if (txtFechaNacimiento != null) txtFechaNacimiento.value = obj.data.fecha_nacimiento;
            var cboPais = document.getElementById("cboPais");
            if (cboPais != null) cboPais.value = "1";
            listarDepartamentos();
            let ubigeo = obj.data.ubigeo_sunat;
            let idDpto = ubigeo.substr(0, 2);
            let idProv = ubigeo.substr(2, 2);
            let idDist = ubigeo.substr(4, 2);
            cboDepartamento.value = idDpto;
            document.getElementById('select2-cboDepartamento-container').innerHTML = cboDepartamento.options[cboDepartamento.selectedIndex].text;
            listarProvincias();
            cboProvincia.value = idProv;
            document.getElementById('select2-cboProvincia-container').innerHTML = cboProvincia.options[cboProvincia.selectedIndex].text;
            listarDistritos();
            cboDistrito.value = idDist;
            document.getElementById('select2-cboDistrito-container').innerHTML = cboDistrito.options[cboDistrito.selectedIndex].text;
            spnLoadDoc.style.display = 'none';
        }
        else {
            spnLoadDoc.style.display = 'none';
            spnDniDocumento.innerHTML = "Nro de Documento no encontrado";
            spnDniDocumento.style.color = "red";

        }
    }
    else {
        spnDniDocumento.innerHTML = "Documento incorrecto o no existe enlace con SUNAT";
        spnDniDocumento.style.color = "red";
        spnLoadDoc.style.display = 'none';
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

    var cboTipoDocumento = document.getElementById("cboTipoDocumento")
    if (cboTipoDocumento != null) cboTipoDocumento.onchange = function () {
        if (cboTipoDocumento.value == "4") {
            cboTipoDocumento.value = 2;
        }
        cboTipoContribuyente.value = 1;
        tipoPersonaNatural.style.display = "block";
        tipoPersonaJuridica.style.display = "none";
        tipoPersonaJuridicaRuc.style.display = "none";

    }

    var cboTipoContribuyente = document.getElementById("cboTipoContribuyente")
    if (cboTipoContribuyente != null) cboTipoContribuyente.onchange = function () {

        if (cboTipoContribuyente.value == "1") {
            tipoPersonaNatural.style.display = "block";
            tipoPersonaJuridica.style.display = "none";
            tipoPersonaJuridicaRuc.style.display = "none";
            //  cboTipoDocumento.value = "";
        }
        else if (cboTipoContribuyente.value == "2") {
            //tipoPersonaNatural.style.display = "none";
            // tipoPersonaJuridica.style.display = "block";
            // tipoPersonaJuridicaRuc.style.display = "block";

            tipoPersonaNatural.style.display = "block";
            tipoPersonaJuridica.style.display = "none";
            tipoPersonaJuridicaRuc.style.display = "none";

        }
        else if (cboTipoContribuyente.value == "3") {

            tipoPersonaNatural.style.display = "block";
            tipoPersonaJuridica.style.display = "none";
            tipoPersonaJuridicaRuc.style.display = "none";

            //tipoPersonaNatural.style.display = "block";
            //tipoPersonaJuridicaRuc.style.display = "block";
            // tipoPersonaJuridica.style.display = "none";
        }

    }

    var chkEsEmpleado = document.getElementById("chkEsEmpleado")
    if (chkEsEmpleado != null) chkEsEmpleado.onchange = function () {
        var checked = chkEsEmpleado.checked;
        if (checked) {
            document.getElementById("txtRUC").classList.remove("Reque");
            document.getElementById("txtRazonSocial").classList.remove("Reque");
        }
        else {
            document.getElementById("txtRUC").classList.remove("Reque");
        }
    }

    var cboCuentaMayor = document.getElementById("cboCuentaMayor");
    if (cboCuentaMayor != null) cboCuentaMayor.onchange = function () {
        listarSubCuentaItem();
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


function listarSubCuentaItem() {
    var idCuentaMayor = cboCuentaMayor.value;
    var nRegistros = listaSubCuentaItem.length;
    var contenido = "<option value=''>Seleccione</option>";
    var campos, idCodigo, nombre, idxTipoItem;
    for (var i = 0; i < nRegistros; i++) {
        campos = listaSubCuentaItem[i].split('|');
        idCodigo = campos[0];
        nombre = campos[1];
        idxTipoItem = campos[2];
        if (idxTipoItem === idCuentaMayor) {
            contenido += "<option value='";
            contenido += idCodigo;
            contenido += "'>";
            contenido += nombre;
            contenido += "</option>";
        }
    }
    var cbo = document.getElementById("cboSubCuenta");
    if (cbo != null) {
        cbo.innerHTML = contenido;
    }
}

/*Importar EXCEL*/
function importarExcel(divForm, divLista, dataCab, dataDeta) {
    document.getElementById(divForm).style.display = "none";
    operacion = "1";
    var cabeceras = "";
    var detalles = "";
    var totales = "";
    var file = fupExcel.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var data = new Uint8Array(reader.result);
        var libro = XLSX.read(data, { type: 'array' });
        var nhojas = libro.SheetNames.length;
        var nombreHoja = libro.SheetNames[0];
        var hoja = libro.Sheets[nombreHoja];
        var range = XLSX.utils.decode_range(hoja['!ref']);
        var contenido = "<table>";
        contenido += "<tr style='background-color:lightgray;text-align:center'>";
        contenido += "<td></td>";
        for (var j = range.s.c; j <= range.e.c; j++) {
            contenido += "<th>";
            contenido += String.fromCharCode(65 + j);
            contenido += "</th>";
        }
        contenido += "</tr>";
        /*Detalle de la importacion*/
        for (var i = range.s.r; i <= range.e.r; i++) {
            contenido += "<tr style='background-color:white;text-align:left'>";
            contenido += "<th style='width:50px;background-color:lightgray'>";
            contenido += i + 1;
            contenido += "</th>";
            //alert(celda.v)
            for (var j = range.s.c; j <= range.e.c; j++) {
                contenido += "<td>";
                var direccion = XLSX.utils.encode_cell({ c: j, r: i });
                var celda = hoja[direccion];
                if (celda != null) {
                    contenido += celda.v;
                    if (i == 3) {
                        dataCab += celda.v;
                        dataCab += "|";
                    }
                    if (i > 3) {
                        dataDeta += celda.v;
                        dataDeta += "|";
                    }
                }
                contenido += "</td>";
            }
            if (i > 0) {
                dataCab = dataCab.substr(0, dataCab.length - 1);
                dataCab += "¬";
                dataDeta = dataDeta.substr(0, dataDeta.length - 1);
                dataDeta += "¬";
            }
            contenido += "</tr>";
        }
        dataCab = dataCab.substr(0, dataCab.length - 1);
        dataDeta = dataDeta.substr(0, dataDeta.length - 1);
        dataImport = dataCab + '¯' + dataDeta;
        contenido += "<table>";
        document.getElementById(divLista).innerHTML = contenido;
    }
    reader.readAsArrayBuffer(file);
}