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

        var botones = [
            { "cabecera": "Editar", "clase": "fa fa-pencil-square-o btn btn-info btnCirculo", "id": "Editar" },
            { "cabecera": "Eliminar", "clase": "fa fa-trash btn btn-danger btnCirculo", "id": "Eliminar" },
        ];
        grillaItem = new GrillaScroll(lista, "divLista", 100, 6, vista, controller, null, null, true, botones, 38, false, null);
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

}