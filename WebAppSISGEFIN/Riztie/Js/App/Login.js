window.onload = function () {
    localStorage.clear();
    guardarUrl();
    
    document.getElementById("btnAceptar").onclick = function () {
        if (validarDatosForm("Requerido", "spnValida")) {
            var usuario = document.getElementById("txtUsuario").value;
            var clave = document.getElementById("txtClave").value;
            var claveCifrada = CryptoJS.SHA256(clave).toString();
            document.getElementById("txtClave").value = "********";
            this.disabled = true;
            Http.get("Security/validarLogin/?usuario=" + usuario + "&clave=" + claveCifrada, mostrarValidar);
        }
        else {
            document.getElementById("txtClave").value = "";
        }
    }
}

function mostrarValidar(rpta) {
    btnAceptar.disabled = false;
    if (rpta != "") {
        var data = rpta.split("¯");
        var login = data[0];
        var token = data[1];
        localStorage.setItem("token", token);
        var campos = login.split("|");
        if (campos[1] != null) {
            localStorage.setItem("Cliente", campos[2]);
            localStorage.setItem("Foto", campos[6]);
            navegar("Logistica/DashCompras");
        }
        else {
            mostrarMensaje(rpta, "error");
            txtClave.value = "";
            txtUsuario.focus();
        }
    }
    else {
        mostrarMensaje("Error de Acceso", "error")
    };
}
