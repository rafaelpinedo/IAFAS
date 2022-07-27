var filaAnterior = null;
var tabla = "";
var idCombos = [];
var listas = [];
var ayudas = [];
var formulario = [];
var idRegistro = "";
var idFiltro = 0;
var listaFormulario = [];
var listaPersona = [];
var listaControles = [];
var nombrePerfil = "";
var lista = [];
var idRegistroMenu = "";
var generico = 0;

window.onload = function () {
    tabla = window.sessionStorage.getItem("Form");
    getConfigMn();
    var data = "";
    Http.get("Security/listarconfigurarControles/?data=" + tabla, configurarControles);

    if (tabla == "UserPerfil") {
        Http.get("Security/obtenerPerfil", mostrarPerfil);
    }
    else {
        Http.get("Security/listarTabla/?tbl=" + tabla + "&data=1" + data, mostrarListadoSec);
    }

    configurarBotonesSec();
    configurarCombos();
}

function mostrarPerfil(rpta) {
    //divValida.style.display = 'none';
    if (rpta) {
        var listas = rpta.split('¯');
        var campos = listas[0].split("|");
        var controles = document.getElementsByClassName("Popup");
        var nControles = controles.length;
        var control;
        var tipo;
        var subCampos;
        var apellidos, nombres, foto
        apellidos = campos[4] + ' ' + campos[5];
        nombres = campos[3];
        foto = campos[7];
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
                control.value = subCampos[0];
            }
            else if (tipo == "img") {
                if (campos[j] != "") {
                    control.src = "data:image/jpeg;base64," + campos[j];
                } else {
                    control.src = "/Daymeva/Images/NOFOTO.jpg";
                }

            }
            else if (tipo == "chk" || tipo == "opt") control.checked = (campos[j] == "1");
            else {
            }
        }
    }
}

function validarUpdate() {
    var clave = txtContrasenia.value.trim();
    var reclave = txtConfirmarContrasenia.value.trim();
    var isValid = false
    var mensaje = "";
    var alerta = "";
    var cantidad = clave.length;
    if (cantidad < 6) {
        mensaje = "La contraseña debe ser mínimo 6 digitos";
        alerta = "error";
        isValid = false;
    }

    else if (clave == "") {
        mensaje = "Ingrese clave";
        alerta = "error";
        isValid = false;
    }
    else if (reclave == "") {
        mensaje = "Ingrese confirmación de contraseña";
        alerta = "error";
        isValid = false;
    }
    else if (reclave != clave) {
        mensaje = "La confirmación de contraseña no es correcta";
        alerta = "error";
        isValid = false;
    }
    else {
        isValid = true;
    }
    mensajeAlerta(mensaje, alerta);
    return (isValid == true);
}

function grabarUpdate() {
    document.getElementById("btnGrabarSeguridad").innerHTML = "Procesando contraseña";
    document.getElementById("btnGrabarSeguridad").disabled = true;
    var data = CryptoJS.SHA256(txtContrasenia.value).toString();;
    var frm = new FormData();
    frm.append("data", data);
    Http.post("Security/grabarUpdate", mostrarGrabarUpdate, frm);
}


function mostrarGrabarUpdate(rpta) {
    var mensaje = "";
    var mensajeResul = [];
    if (rpta) {
        mensajeResul = rpta.split("|");
        var tipo = mensajeResul[0];
        mensaje = mensajeResul[1];
        if (tipo == 'A') {
            alerta = 'success';
            cerrarSesion();
        }
        else {
            alerta = 'error';
        }
        document.getElementById("btnGrabarSeguridad").disabled = false;
        document.getElementById("btnGrabarSeguridad").innerHTML = "<span class='fa fa-save'></span>&nbsp;Guardar";
    }
    else {
        mensaje = "No se proceso el registro - verifique por favor";
        alerta = "error";
    }
    mostrarMensaje(mensaje, alerta);
}

function configurarBotonesSec() {
    var btnGrabarSeguridad = document.getElementById("btnGrabarSeguridad");
    if (btnGrabarSeguridad != null) btnGrabarSeguridad.onclick = function () {
        if (validarUpdate()) grabarUpdate();;
    }
    var btnGrabarPermiso = document.getElementById("btnGrabarPermiso")
    if (btnGrabarPermiso != null) btnGrabarPermiso.onclick = function () {
        grabarPermiso();
    }
    var btnGrabarAcciones = document.getElementById("btnGrabarAcciones")
    if (btnGrabarAcciones != null) btnGrabarAcciones.onclick = function () {
        if (tabla == "Formulario") {
            grabarFormulario();
        }
        else {
            grabarAcciones();
        }
    }

    var btnCancelarUsuario = document.getElementById("btnCancelarUsuario")
    if (btnCancelarUsuario != null) btnCancelarUsuario.onclick = function () {
        divPopupContainerUsuario.style.display = 'none';
    }

    var btnCerrarUsuario = document.getElementById("btnCerrarUsuario")
    if (btnCerrarUsuario != null) btnCerrarUsuario.onclick = function () {
        divPopupContainerUsuario.style.display = 'none';
    }

    var btnGrabar = document.getElementById("btnGrabar")
    if (btnGrabar != null) btnGrabar.onclick = function () {
        if (validarInformacion()) grabarDatos();
    }

    var btnNuevolista = document.getElementById("btnNuevolista")
    if (btnNuevolista != null) btnNuevolista.onclick = function () {
        if (tabla == 'Usuario') {
            limpiarForm("Popup");
            divPopupContainerUsuario.style.display = "block";
        }
        else {
            limpiarForm("Popup");
            divPopupContainer.style.display = "block";
            tituloVentana.innerHTML = "Nuevo Registro";
        }

    }

    var btnEliminarlista = document.getElementById("btnEliminarlista")
    if (btnEliminarlista != null) btnEliminarlista.onclick = function () {
        if (idRegistro == "") {
            mostrarMensaje("Seleccione la fila del registro", "error")
        }
        else {
            eliminarDatos();
        }
    }

}

function mostrarPermisos(rpta) {
    if (rpta) {
        var listaPermisos = rpta.split('¬');
        var nRegistros = listaPermisos.length;
        var MenuId;
        var tbl = document.getElementById("tbPermiso");
        var controles = tbl.getElementsByClassName('Popup');
        var nControles = controles.length;
        var control;
        for (var j = 0; j < nControles; j++) {
            control = controles[j];
            control.checked = false;
        }

        for (var i = 0; i < nRegistros; i++) {
            var controlId = listaPermisos[i].split('¬');
            MenuId = 'chk' + controlId;
            var MenuId = document.getElementById(MenuId);
            if (MenuId != null) MenuId.checked = true;
        }
    }
}


function configurarCombos() {

    var cboPersona = document.getElementById("cboPersona");
    if (cboPersona != null) cboPersona.onchange = function () {
        alert('aqui');
        listarPersona();
    }

    var cboPerfil = document.getElementById("cboPerfil");
    if (cboPerfil != null) cboPerfil.onchange = function () {
        var data = "";
        var idSistema = cboSistema.value;
        var idPerfil = cboPerfil.value;

        if (idSistema == "") {
            mostrarMensaje("Seleccione Sistema", "error");
            cboSistema.focus();
            cboPerfil.value = "";
        }
        else {
            data = idSistema + '|' + idPerfil;
            Http.get("Security/listarTabla/?tbl=" + tabla + "Usuarios&data=" + data, mostrarPermisos);
        }
    }

    var cboSistema = document.getElementById("cboSistema");
    if (cboSistema != null) cboSistema.onchange = function () {
        cboPerfil.value = "";
        var idSistemaApp = cboSistema.value;

        if (idSistemaApp == "") {
            mostrarMensaje("Seleccione Sistema", "error");
            cboSistema.focus();
            cboPerfil.value = "";
        }
        else {
            var tbl = document.getElementById("tbPermiso");
            tbl.innerHTML = "";
            Http.get("Security/listarTabla/?tbl=" + tabla + "Id&data=" + idSistemaApp, mostrarMenus);
        }
    }
}

function mostrarListadoSec(rpta) {
    tabla = sessionStorage.getItem("Form");
    if (rpta) {
        var listas = rpta.split('¯');

        if (tabla == "AccesoSistema") {
            lista = listas[0].split("¬");
            var grilla = new GrillaScroll(lista, "lista", 500, 10, tabla, "Security", null, true, null, null, 26);
        }
        else if ((tabla != "Permisos") && (tabla != "Formulario") && (tabla != "UserPerfil")) {
            lista = listas[0].split("¬");
            var nFormulario = listas[1].split("¬").length;
            var grilla = new GrillaScroll(lista, "lista", 500, 10, tabla, "Security", null, true, null, true, 26);
            configurarBotonesSec();
            if (nFormulario > 1) {
                generico = 1;
                formulario = listas[1].split("¬");
                crearFormulario();
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
                    if (tipo == "cbo") {
                        idCombos.push(control.id);
                    }
                }
            }
            var nListas = listas.length;
            if (nListas > 2) {
                for (var i = 2; i < nListas; i++) {
                    ayudas.push(listas[i].split("¬"));
                }
            }
            if (ayudas.length > 0) {
                for (var i = 0; i < ayudas.length; i++) {
                    crearCombo(ayudas[i], idCombos[i], "Seleccione");
                }
            }
        }

        if (tabla == "Usuario") {
            listaPersona = listas[2].split("¬");
        }

        if (tabla == "Formulario") {
            mostrarListadoFormulario(rpta)
            cboSistema.value = 1;
        }

        if (tabla == "Permisos") {
            mostrarListadoPermisos(rpta)
            cboSistema.value = 1;
        }
        configurarCombosDinamicos();
    }
}

function mostrarListadoFormulario(rpta) {
    if (rpta != "") {
        var listas = rpta.split("¯");
        var listaAplicaciones = listas[0].split("¬");
        crearCombo(listaAplicaciones, "cboSistema", "Seleccione")
        mostrarMenus(listas[1]);
        listaControles = listas[2].split("¬");
    }
}

function mostrarAcciones(rpta) {
    if (rpta != "") {
        var listaMenu = rpta.split("¬");
        var Campos = [];
        var nRegistros = listaMenu.length;
        var nCampos = 3;
        var contenido = "<table class='grilla bordered'><thead><tr class='FilaCabecera bg-customer'>";
        contenido += "<th>AcciónId</th>";
        contenido += "<th>Titulo</th>";
        contenido += "<th>Denegar</th>";
        contenido += "</tr></thead>";
        contenido += "<tbody id='tbPermiso'>";
        for (var fila = 0; fila < nRegistros; fila++) {
            Campos = listaMenu[fila].split("|");
            contenido += "<tr onclick= 'seleccionarFilaPermisos(this);'>";
            for (var columna = 0; columna < nCampos; columna++) {
                if (columna == 0) {
                    contenido += "<td>";
                    contenido += Campos[0];
                    contenido += "</td>";
                }
                else if (columna == 1) {
                    contenido += "<td>";
                    contenido += Campos[1];
                    contenido += "</td>";
                }
                else if (columna == 2) {
                    contenido += "<td>";
                    contenido += "<div class='form-check form-check-inline'>";
                    contenido += "<div class='switchToggle'>";
                    contenido += "<input type='checkbox' id='chk";
                    contenido += Campos[0];
                    contenido += "' class='form-check-input Popup'>";
                    contenido += "<label for='chk";
                    contenido += Campos[0];
                    contenido += "'></label>";
                    contenido += "</div></div>";
                    contenido += "</td>";
                }
            }
            contenido += "</tr>";
        }
        contenido += "</tbody></table>";
        divControles.innerHTML = contenido;
    }
}

function mostrarListadoPermisos(rpta) {
    if (rpta != "") {

        var listas = rpta.split("¯");
        var listaAplicaciones = listas[1].split("¬");
        var listaPerfil = listas[2].split("¬");
        crearCombo(listaAplicaciones, "cboSistema", "Seleccione")
        crearCombo(listaPerfil, "cboPerfil", "Seleccione")
        mostrarMenus(listas[0]);
    }
}

function mostrarMenus(rpta) {

    if (rpta != "") {
        var listaMenu = rpta.split("¬");
        var Campos = [];
        var nRegistros = listaMenu.length;
        var nCampos = 4;
        var contenido = "<table id='tblMenu' class='grilla bordered'><thead><tr class='FilaCabecera bg-customer'>";
        contenido += "<th>MenuId</th>";
        contenido += "<th>Titulo</th>";
        if (tabla != "Formulario") {
            contenido += "<th>Permitir</th>";
        }
        contenido += "</tr></thead>";
        if (tabla == "Formulario") { contenido += "<tbody id='tbMenus'>"; }
        else { contenido += "<tbody id='tbPermiso'>"; }
        for (var fila = 0; fila < nRegistros; fila++) {
            Campos = listaMenu[fila].split("|");
            if (Campos[0] == '0') {
                contenido += "<tr style='background-color:#FBEC88;color:black'>";
            }
            else {
                if (tabla == "Formulario") {
                    contenido += "<tr onclick= 'seleccionarFilaMenu(this,\"";
                    contenido += Campos[1];
                    contenido += "\");'>";
                }
                else {
                    contenido += "<tr onclick= 'seleccionarFilaPermisos(this,\"";
                    contenido += Campos[1];
                    contenido += "\");'>";
                }
            }

            for (var columna = 0; columna < nCampos; columna++) {
                if (columna == 1) {
                    contenido += "<td>";
                    contenido += Campos[1];
                    contenido += "</td>";
                }

                else if (columna == 2) {
                    if (Campos[0] != '0') {
                        contenido += "<td>";
                        contenido += Campos[2];
                        contenido += "</td>";
                    }
                    else {
                        contenido += "<td>";
                        contenido += "Módulo de " + Campos[2];
                        contenido += "</td>";
                    }
                }
                else if (columna == 3 && tabla != "Formulario") {
                    if (Campos[0] != '0') {
                        contenido += "<td>";
                        contenido += "<div class='form-check form-check-inline'>";
                        contenido += "<div class='switchToggle'>";
                        contenido += "<input type='checkbox' id='chk";
                        contenido += Campos[3];
                        contenido += "' class='form-check-input Popup'>";
                        contenido += "<label for='chk";
                        contenido += Campos[3];
                        contenido += "'></label>";
                        contenido += "</div></div>";
                        contenido += "</td>";
                    }
                    else {
                        contenido += "<td>";
                        contenido += "</td>";
                    }
                }

            }
            contenido += "</tr>";
        }
        contenido += "</tbody></table>";
        divContenido.innerHTML = contenido;
    }
}

function seleccionarFilaPermisos(fila, id) {
    if (window["fila"] != null) window["fila"].className = "FilaDatos";
    fila.className = "FilaElegidaPermiso";
    window["fila"] = fila;
    var control = 'chk' + id;
    if (document.getElementById(control).checked) {
        var idSistema = cboSistema.value;
        var idPerfil = cboPerfil.value;
        var data = "";
        idRegistroMenu = id;
        data = idSistema + '|' + id;
        Http.get("Security/listarTabla/?tbl=FormularioId&data=" + data, mostrarControlesFormulario);

    } else { divControl.style.display = 'none'; }
}

function seleccionarFilaMenu(fila, id) {
    if (window["fila"] != null) window["fila"].className = "FilaDatos";
    fila.className = "FilaElegidaPermiso";
    window["fila"] = fila;
    divControl.style.display = 'block';
    var idSistema = cboSistema.value;
    idRegistroMenu = id;
    mostrarControl(id);
    var data = "";
    data = idSistema + '|' + id;
    Http.get("Security/listarTabla/?tbl=FormularioId&data=" + data, mostrarAccionesRpta);
}

function mostrarAccionesRpta(rpta) {
    if (rpta != "") {
        var listaAcciones = rpta.split('¬');
        var nRegistros = listaAcciones.length;
        var AccionId
        var listaRetorno = [];

        var tbl = document.getElementById("tbControl");
        var controles = tbl.getElementsByClassName('PopupAccion');
        var nControles = controles.length;
        var control;
        for (var j = 0; j < nControles; j++) {
            control = controles[j];
            control.checked = false;
        }

        for (var i = 0; i < nRegistros; i++) {
            listaRetorno = listaAcciones[i].split('|');
            AccionId = 'chkC' + listaRetorno[0];
            document.getElementById(AccionId).checked = true;
        }
    }
    else {
        var tbl = document.getElementById("tbControl");
        var controles = tbl.getElementsByClassName('PopupAccion');
        var nControles = controles.length;
        var control;
        for (var j = 0; j < nControles; j++) {
            control = controles[j];
            control.checked = false;
        }
    }
}

function mostrarControlesFormulario(rpta) {
    if (rpta) {
        listaControles = rpta.split('¬');
        divControl.style.display = 'block';
        var Campos = [];
        var nRegistros = listaControles.length;
        var nCampos = 3;
        var contenido = "<table class='grilla bordered'><thead><tr class='FilaCabecera bg-customer'>";
        contenido += "<th>ControlId</th>";
        contenido += "<th>Titulo</th>";
        contenido += "<th>Denegar</th>";
        contenido += "</tr></thead>";
        contenido += "<tbody id='tbControl'>";
        for (var fila = 0; fila < nRegistros; fila++) {
            Campos = listaControles[fila].split("|");
            contenido += "<tr>";
            for (var columna = 0; columna < nCampos; columna++) {
                if (columna == 0) {
                    contenido += "<td>";
                    contenido += Campos[0];
                    contenido += "</td>";
                }
                else if (columna == 1) {
                    contenido += "<td>";
                    contenido += Campos[1];
                    contenido += "</td>";
                }
                else if (columna == 2) {
                    contenido += "<td>";
                    contenido += "<div class='form-check form-check-inline'>";
                    contenido += "<div class='switchToggle'>";
                    contenido += "<input type='checkbox' id='chkC";
                    contenido += Campos[2];
                    contenido += "' class='form- check-input PopupAccion'>";
                    contenido += "<label for='chkC";
                    contenido += Campos[2];
                    contenido += "'></label>";
                    contenido += "</div></div>";
                    contenido += "</td>";
                }
            }
            contenido += "</tr>";
        }
        contenido += "</tbody></table>";
        divControles.innerHTML = contenido;

        var data = "";
        var idSistema = cboSistema.value;
        var idPerfil = cboPerfil.value;
        data = idSistema + '|' + idPerfil + '|' + idRegistroMenu;
        get("Security/listarTabla/?tbl=" + tabla + "ControlesId&data=" + data, mostrarAccionesRptaId);
    }
    else {
        tbControl.innerHTML = "";
        mostrarMensaje("Formulario no tiene controles asignados", "error");
    }
}

function mostrarAccionesRptaId(rpta) {
    if (rpta) {
        var listaAcciones = rpta.split('¬');
        var nRegistros = listaAcciones.length;
        var AccionId
        var listaRetorno = [];

        var tbl = document.getElementById("tbControl");
        var controles = tbl.getElementsByClassName('PopupAccion');
        var nControles = controles.length;
        var control;

        for (var j = 0; j < nControles; j++) {
            control = controles[j];
            control.checked = false;
        }

        for (var i = 0; i < nRegistros; i++) {
            listaRetorno = listaAcciones[i].split('|');
            AccionId = 'chkC' + listaRetorno[0];
            document.getElementById(AccionId).checked = true;
        }
    }
}

function mostrarControl(id) {
    divControl.style.display = 'block';

    if (id != "") {
        var Campos = [];

        var nRegistros = listaControles.length;
        var nCampos = 3;
        var contenido = "<table class='grilla bordered'><thead><tr class='FilaCabecera bg-customer'>";
        contenido += "<th>ControlId</th>";
        contenido += "<th>Titulo</th>";
        contenido += "<th>Agregar</th>";
        contenido += "</tr></thead>";
        contenido += "<tbody id='tbControl'>";
        for (var fila = 0; fila < nRegistros; fila++) {
            Campos = listaControles[fila].split("|");
            contenido += "<tr>";
            for (var columna = 0; columna < nCampos; columna++) {
                if (columna == 0) {
                    contenido += "<td>";
                    contenido += Campos[0];
                    contenido += "</td>";
                }
                else if (columna == 1) {
                    contenido += "<td>";
                    contenido += Campos[1];
                    contenido += "</td>";
                }
                else if (columna == 2) {
                    contenido += "<td>";
                    contenido += "<div class='form-check form-check-inline'>";
                    contenido += "<div class='switchToggle'>";
                    contenido += "<input type='checkbox' id='chkC";
                    contenido += Campos[2];
                    contenido += "' class='form- check-input PopupAccion'>";
                    contenido += "<label for='chkC";
                    contenido += Campos[2];
                    contenido += "'></label>";
                    contenido += "</div></div>";
                    contenido += "</td>";
                }
            }
            contenido += "</tr>";
        }
        contenido += "</tbody></table>";
        divControles.innerHTML = contenido;
    }
    else {
        mostrarMensaje("Error sistema", "error");
    }
}

function listarPersona() {
    var idRegistro = cboPersona.value;
    var nRegistros = listaPersona.length;
    var idxPersona, Correo, Documento
    var lista = [];
    for (var i = 0; i < nRegistros; i++) {
        lista = listaPersona[i].split('|');
        idxPersona = lista[0];
        if (idxPersona == idRegistro) {
            Documento = lista[2];
            Correo = lista[3];
        }
    }
    txtUsuario.value = Documento;
    txtCorreo.value = Correo;
    txtClave.value = Documento;
    txtClave.disabled = true;
}

function configurarCombosDinamicos() {
    var cboSistema = document.getElementById('cboSistema');
    if (cboSistema != null) cboSistema.onchange = function () {
        listarFormulario();
    }

    var cboPersona = document.getElementById('cboPersona');
    if (cboPersona != null) cboPersona.onchange = function () {
        listarPersona();
    }
}

function listarFormulario() {

    var nRegistros = listaFormulario.length;
    var contenido = "<option value=''>Seleccione</option>";
    var idFormulario, titulo, lista, idsFormulario
    var idSistema = cboSistema.value;
    for (var i = 0; i < nRegistros; i++) {
        lista = listaFormulario[i].split('|');
        idFormulario = lista[0];
        titulo = lista[1];
        idsFormulario = lista[2];
        if (idsFormulario == idSistema) {
            contenido += "<option value='";
            contenido += idFormulario;
            contenido += "'>";
            contenido += titulo;
            contenido += "</option>";
        }
    }
    cboFormulario.innerHTML = contenido;
}

function crearFormulario() {
    var contenido = "";
    var nRegistros = formulario.length;
    var prefijo;
    var campos = [];
    var cAyudas = 0;
    var esLectura;
    var esBuscar;
    var decimal;
    var nCol = formulario[0];
    var cantCol = 0;
    if (nRegistros > 0) {
        contenido += "<div class='row'>";
        contenido += "<div class='col-md-12 mx-auto'>";
        for (var i = 1; i < nRegistros; i++) {
            campos = formulario[i].split("|");
            prefijo = campos[1].substr(0, 3);
            esObligatorio = (campos[3].indexOf("Requerido") > -1);
            esBuscar = (campos[3].indexOf("Buscar") > -1);
            esLectura = (campos[3].indexOf("Lectura") > -1);
            var dataValue = campos[1];
            if (cantCol == '0') {
                contenido += "<div class='form-group row'>";
            }
            if (nCol == '2') { contenido += "<div class='col-lg-6'>" }
            else { contenido += "<div class='col-lg-12'>" };
            cantCol++;
            contenido += "<div class='col-sm-";
            contenido += campos[2];
            contenido += "'>";
            if ((prefijo != "chk") && (prefijo != "opt")) {
                contenido += "<label for='";
                contenido += campos[1];
                contenido += "' class='control-label'>";
                contenido += campos[0]
                contenido += "</label> ";
            }

            switch (prefijo) {
                case "txt":
                    contenido += "<input type='text'";
                    contenido += " id = '";
                    contenido += dataValue;
                    contenido += "' class='control-form Popup";
                    if (esObligatorio) contenido += " Requerido";
                    contenido += "'";
                    if (esLectura) contenido += " readonly='readonly' style='background-color:#FBEC88'";
                    contenido += " autocomplete='off'";
                    contenido += "/>";
                    break;
                case "dtt":
                    contenido += "<input type='date'";
                    contenido += " id = '";
                    contenido += dataValue;
                    contenido += "' class='control-form Popup";
                    if (esObligatorio) contenido += " Requerido";
                    contenido += "'";
                    if (esLectura) contenido += " readonly='readonly' style='background-color:#FBEC88'";
                    contenido += "/>";
                    break;
                case "tim":
                    contenido += "<input type='time'";
                    contenido += " id = '";
                    contenido += dataValue;
                    contenido += "' class='control-form Popup";
                    if (esObligatorio) contenido += " Requerido";
                    contenido += "'";
                    if (esLectura) contenido += " readonly='readonly' style='background-color:#FBEC88'";
                    contenido += "/>";
                    break;
                case "mal":
                    contenido += "<input type='email' ";
                    contenido += " id = '";
                    contenido += dataValue;
                    contenido += "' class='control-form Popup";
                    if (esObligatorio) contenido += " Requerido";
                    contenido += "'";
                    if (esLectura) contenido += " readonly='readonly' style='background-color:#FBEC88'";
                    contenido += "/>";
                    break;
                case "num":
                    contenido += "<input type='number' ";
                    contenido += " id = '";
                    contenido += dataValue;
                    contenido += "' class='control-form Popup";
                    if (esObligatorio) contenido += " Requerido";
                    contenido += "'";
                    if (esLectura) contenido += " readonly='readonly' style='background-color:#FBEC88'";
                    contenido += " step='any' ";
                    if (decimal) contenido += " step='any' ";
                    contenido += "/>";
                    break;
                case "tta":
                    contenido += "<textarea type='time' ";
                    contenido += " id = '";
                    contenido += dataValue;
                    contenido += "' class='control-form Popup";
                    if (esObligatorio) contenido += " Requerido";
                    contenido += "'";
                    if (esLectura) contenido += " readonly='readonly' style='background-color:#FBEC88'";
                    contenido += ">";
                    contenido += "</textarea>";
                    break;
                case "chk":
                    contenido += "<div class='custom-control custom-checkbox'>";
                    contenido += "<input type='checkbox' ";
                    contenido += " id='";
                    contenido += dataValue;
                    contenido += "' class='custom-control-input Popup";
                    if (esObligatorio) contenido += " Requerido";
                    contenido += "'";
                    if (esLectura) contenido += " readonly='readonly'";
                    contenido += "/>";
                    contenido += "<label for='";
                    contenido += dataValue;
                    contenido += "' class='custom-control-label texto-negrita'>";
                    contenido += campos[0]
                    contenido += "</label> ";
                    contenido += "</div> ";
                    break;
                case "opt":
                    contenido += "<div class='custom-control custom-radio'>";
                    contenido += "<input type='radio' ";
                    contenido += " id = '";
                    contenido += dataValue;
                    contenido += "' class='custom-control-input Popup";
                    if (esObligatorio) contenido += " Requerido";
                    contenido += "'";
                    if (esLectura) contenido += " readonly='readonly'";
                    contenido += "/>";
                    contenido += "<label for='";
                    contenido += dataValue;
                    contenido += "' class='custom-control-label texto-negrita'>";
                    contenido += campos[0]
                    contenido += "</label> ";
                    contenido += "</div> ";
                    break;
                case "cbo":
                    contenido += "<select ";
                    contenido += " id='";
                    contenido += dataValue;
                    if (esBuscar) { contenido += "' class='SelectSearch control-form Popup" } else { contenido += "' class='control-form Popup" };
                    if (esObligatorio) contenido += " Requerido";
                    contenido += "'";
                    if (esLectura) contenido += " disabled style='background-color:#FBEC88'";
                    contenido += "></select>";
                    idCombos.push(dataValue);
                    break;
            }
            if (cantCol <= nCol) {
                contenido += "</div>";
                contenido += "</div>";
                if (cantCol == nCol) {
                    cantCol = 0;
                }
            }
            if (cantCol == '0') {
                contenido += "</div>";
            }
        }
        contenido += "</div>";
        contenido += "</div>";
        document.getElementById("divCuerpo").innerHTML = contenido;
    }
}

function seleccionarFila(fila, id, prefijo) {
    idRegistro = id;
    window["id" + prefijo] = id;
    if (window["fila" + prefijo] != null) window["fila" + prefijo].className = "FilaDatos";
    fila.className = "FilaSeleccionada";
    window["fila" + prefijo] = fila;

    nombrePerfil = fila.childNodes[1].innerHTML;

}

function editarRegistro(id) {
    get("Security/obtenerTabla/?tbl=" + tabla + '&id=' + id, mostrarRegistro);
}

function mostrarRegistro(rpta) {
    if (rpta) {
        var campos = rpta.split("|");
        if (generico == 1) {
            divPopupContainer.style.display = "block";
            tituloVentana.innerHTML = "Editar Registro";
        }
        else {
            divPopupContainerUsuario.style.display = "block";
        }

        var controlesSelectSearch = document.getElementsByClassName("SelectSearch");
        var nControlesSelectSearch = controlesSelectSearch.length;

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
            else if (tipo == "img") {
                control.src = "data:image/jpeg;base64," + campos[j];
            }
            else if (tipo == "chk" || tipo == "opt") control.checked = (campos[j] == "1");
            else {
            }
        }
    }
}

function listarPersonal() {
    var nRegistros = listaPersona.length;
    var contenido = "<option value=''>Seleccione</option>";
    var idCodigo, nombre
    var lista = [];
    for (var i = 0; i < nRegistros; i++) {
        lista = listaPersona[i].split('|');
        idCodigo = lista[0];
        nombre = lista[1];
        contenido += "<option value='";
        contenido += idCodigo;
        contenido += "'>";
        contenido += nombre;
        contenido += "</option>";
    }
    var cbo = document.getElementById("cboPersona");
    if (cbo != null) cbo.innerHTML = contenido;
}

function eliminarDatos() {
    var data = "";
    data = idRegistro;
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
            post("Security/Eliminar/?Id=" + tabla, mostrarGrabar, frm);
        }
    })

}

function grabarDatos() {
    var data = "";
    if (tabla == "Usuario") {
        document.getElementById("btnGrabar").innerHTML = "Procesando usuario...";
        document.getElementById("btnGrabar").disabled = true;

        var codigo = txtCodigo.value;
        var idPersona = cboPersona.value;
        var usuario = txtUsuario.value;
        var clave = CryptoJS.SHA256(txtClave.value).toString();
        var correo = txtCorreo.value;
        var idPerfil = cboPerfil.value;
        data = codigo + '|' + idPersona + '|' + usuario + '|' + clave + '|' + correo + '|' + idPerfil;
        var frm = new FormData();
        frm.append("data", data);
        post("Security/grabar/?Id=" + tabla, mostrarGrabar, frm);
    }
    else {
        var data = obtenerDatosGrabar("Popup");
        var frm = new FormData();
        frm.append("data", data);
        post("Security/grabar/?Id=" + tabla, mostrarGrabar, frm);
    }

}

function grabarPermiso() {
    let idSistema = cboSistema.value;
    let idPerfil = cboPerfil.value;
    let nSeleccionado = 0;
    var data = "";
    var dataPermiso = "";
    if (idSistema == "") {
        mostrarMensaje("Seleccione Sistema", "error");
        cboSistema.focus();
    }
    else if (idPerfil == "") {
        mostrarMensaje("Seleccione el Perfil", "error");
        cboPerfil.focus();
    }
    else {
        var tbl = document.getElementById("tbPermiso");
        var nRegistros = tbl.rows.length;
        var fila;
        data += idSistema + '|';
        data += idPerfil;
        for (var i = 0; i < nRegistros; i++) {
            fila = tbl.rows[i];
            if (fila.childNodes[2].innerHTML != "" && fila.cells[2].childNodes[0].childNodes[0].childNodes[0].checked) {
                nSeleccionado = nSeleccionado + 1;
                dataPermiso += fila.childNodes[0].innerHTML;
                dataPermiso += "¬";
            }
        }
        dataPermiso = dataPermiso.substr(0, dataPermiso.length - 1);

        if (nSeleccionado == 0) {
            data = data + '¯0';
        }
        else {
            data = data + '¯' + dataPermiso;
        }
        var frm = new FormData();
        frm.append("data", data);
        post("Security/grabar/?Id=" + tabla, mostrarGrabar, frm);
        divControl.style.display = 'none';
    }
}

function grabarAcciones() {
    let idSistema = cboSistema.value;
    let idPerfil = cboPerfil.value;
    let nSeleccionado = 0;
    var data = "";
    var dataAcciones = "";
    if (idSistema == "") {
        mostrarMensaje("Seleccione Sistema", "error");
        cboSistema.focus();
    }
    else if (idPerfil == "") {
        mostrarMensaje("Seleccione el Perfil", "error");
        cboPerfil.focus();
    }
    else {
        var tbl = document.getElementById("tbControl");
        var controles = tbl.getElementsByClassName("PopupAccion");
        var nControles = controles.length;
        var nRegistros = tbl.rows.length;
        data += idSistema + '|';
        data += idPerfil + '|';
        data += idRegistroMenu;

        for (var i = 0; i < nControles; i++) {
            control = controles[i].id;
            if (document.getElementById(control).checked) {
                nSeleccionado = nSeleccionado + 1;
                control = control.substr(4, control.length);
                dataAcciones += control;
                dataAcciones += "¬";
            }
        }
        dataAcciones = dataAcciones.substr(0, dataAcciones.length - 1);
        if (nSeleccionado == 0) {
            data = data + '¯0';
        }
        else {
            data = data + '¯' + dataAcciones;
        }
        var frm = new FormData();
        frm.append("data", data);
        post("Security/grabar/?Id=" + tabla + "Controles", mostrarGrabar, frm);
    }
}


function grabarFormulario() {
    let idSistema = cboSistema.value;
    let nSeleccionado = 0;
    var data = "";
    var dataAcciones = "";
    if (idSistema == "") {
        mostrarMensaje("Seleccione Sistema", "error");
        cboSistema.focus();
    }
    else {
        var tbl = document.getElementById("tbControl");
        var nRegistros = tbl.rows.length;
        var fila;
        data += idSistema + '|';
        data += idRegistroMenu;

        for (var i = 0; i < nRegistros; i++) {
            fila = tbl.rows[i];
            if (fila.childNodes[2].innerHTML != "" && fila.cells[2].childNodes[0].childNodes[0].childNodes[0].checked) {
                nSeleccionado = nSeleccionado + 1;
                dataAcciones += fila.childNodes[0].innerHTML;
                dataAcciones += "¬";
            }
        }
        dataAcciones = dataAcciones.substr(0, dataAcciones.length - 1);

        if (nSeleccionado == 0) {
            data = data + '¯0';
        }
        else {
            data = data + '¯' + dataAcciones;
        }
        var frm = new FormData();
        frm.append("data", data);
        post("Security/grabar/?Id=Formulario", mostrarGrabar, frm);

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
    divPopupContainer.style.display = 'none';
    var divPopupContainerUsuario = document.getElementById("divPopupContainerUsuario");
    if (divPopupContainerUsuario != null) divPopupContainerUsuario.style.display = "none";

    var mensajeResul = [];
    if (rpta) {
        listas = rpta.split("¯")
        if (tabla == "Permisos" || tabla == "Formulario") {
            mensajeResul = rpta.split("|");
        }
        else {
            document.getElementById("btnGrabar").disabled = false;
            document.getElementById("btnGrabar").innerHTML = "<span class='fa fa-save'></span>&nbsp;Grabar";
            listaRegistro = listas[0].split("¬");
            var grilla = new GrillaScroll(listaRegistro, "lista", 500, 10, tabla, "Security", null, true, null, true, 26);
            configurarBotonesSec();
            mensajeResul = listas[1].split("|");
        }

        var tipo = mensajeResul[0];
        var mensaje = mensajeResul[1];
        if (tipo == 'A') {
            alerta = 'success';
        }
        else {
            alerta = 'error';
        }
    }
    else {
        mensaje = "No se proceso el registro - verifique por favor";
        alerta = "error";
    }
    mostrarMensaje(mensaje, alerta);
}