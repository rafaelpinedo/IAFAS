var idPerfil;
var operacion = "";
var listaChecks = [];
var idCombos = [];
var ayudas = [];
var lista = [];
var formulario = [];
var idRegistro = null;
var filaAnterior = null;
var nombrePerfil = null;
var archivo, tipoMime;
var orienta;
var nombreArchivo = "";
var base64Img
var titulo = "";
var contenidoExporta = "";
var tituloReporte = "";
var archivo = "";
var vista = "";
var controller = "";


window.onload = function () {
    imgToBase64('../Riztie/Images/logoEmpresa.png', function (base64) {
        base64Img = base64;
    });
    getConfigMn();
    vista = window.sessionStorage.getItem("Vista");
    controller = window.sessionStorage.getItem("Controller");
    configurarBotones();
}

function configurarBotones() {
    var btnCerrar = document.getElementById("btnCerrar");
    if (btnCerrar != null) btnCerrar.onclick = function () {
        var divPopupContainer = document.getElementById("divPopupContainer");
        if (divPopupContainer != null) divPopupContainer.style.display = 'none';
    }

    var btnReporte = document.getElementById("btnReporte");
    if (btnReporte != null) btnReporte.onclick = function () {
        var divPopupContainer= document.getElementById("divPopupContainer");
        if (divPopupContainer != null) divPopupContainer.style.display = 'block';
    }

    var btnReporteExcel = document.getElementById("btnReporteExcel");
    if (btnReporteExcel != null) btnReporteExcel.onclick = function () {
        var data = "";
        spnLoad.style.display = 'inline';

        if (optResumen.checked) {
            nombreArchivo = 'RESUMEN_DEL_KARDEX_DEL_ALMACEN.xlsx';
            Http.getDownloadBytes("General/exportarOnline/?ori=V&tbl=" + controller + vista + "Resumen&idx=" + data, mostrarExportar)
        }
        else if (optSaldoVal.checked) {
            nombreArchivo = 'SALDOS EN UNIDADES.xlsx';
            Http.getDownloadBytes("General/exportarOnline/?ori=V&tbl=" + controller + vista + "SaldoValorizado&idx=" + data, mostrarExportar)
        }
        else if (optSaldoNega.checked) {
            nombreArchivo = 'SALDO NEGATIVOS.xlsx';
            Http.getDownloadBytes("General/exportarOnline/?ori=V&tbl=" + controller + vista + "SaldoNegativo&idx=" + data, mostrarExportar)
        }
        else if (optDetalle.checked) {
            nombreArchivo = 'KARDEX GENERAL DETALLADO.xlsx';
            Http.getDownloadBytes("General/exportarOnline/?ori=V&tbl=" + controller + vista + "Detallado&idx=" + data, mostrarExportar)
        }
        else if (optDetalleItem.checked) {
            if (idRegistro == null) {
                mostrarMensaje("Seleccione un item de la lista", "error")
                spnLoad.style.display = 'none';
            }
            else {
                nombreArchivo = 'KARDEX DETALLADO POR ITEMS.xlsx';
                Http.getDownloadBytes("General/exportarOnline/?ori=V&tbl=" + controller + vista + "DetalladoItem&idx=" + idRegistro, mostrarExportar)
            }
        }
    }
    var btnReportePdf = document.getElementById("btnReportePdf");
    if (btnReportePdf != null) btnReportePdf.onclick = function () {
        var data = "";
        tblTable.innerHTML = "";

        spnLoad.style.display = 'inline';
        if (optResumen.checked) {
            Http.get("General/getReporte/?tbl=" + controller + vista + "Resumen&data=" + data, mostrarReporteResumen);
        }
        else if (optSaldoVal.checked) {
            Http.get("General/getReporte/?tbl=" + controller + vista + "SaldoValorizado&data=" + data, mostrarReporteResumen);
        }
        else if (optSaldoNega.checked) {
            Http.get("General/getReporte/?tbl=" + controller + vista + "SaldoNegativo&data=" + data, mostrarReporteResumen);
        }
        else if (optDetalle.checked) {
            Http.get("General/getReporte/?tbl=" + controller + vista + "Detallado&data=" + data, mostrarReporteKardexDetalle);
        }
        else if (optDetalleItem.checked) {
            if (idRegistro == null) {
                mostrarMensaje("Seleccione un item de la lista", "error")
                spnLoad.style.display = 'none';
            }
            else {
                Http.get("General/getReporte/?tbl=" + controller + vista + "DetalladoItem&data=" + idRegistro, mostrarReporteKardexItem);
            }
        }
    }

    var btnGenerar = document.getElementById("btnGenerar");
    if (btnGenerar != null) btnGenerar.onclick = function () {
        Swal.fire({
            title: '¿Desea procesar el Kardex?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                generarKardex();
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

    var btnDescargarReporte = document.getElementById("btnDescargarReporte");
    if (btnDescargarReporte != null) btnDescargarReporte.onclick = function () {
        //archivo = titulo + ".xlsx";
        Http.postDownloadBytes("General/exportar/?orienta=V&nombreArchivo=" + archivo, mostrarExportar, listaDatos);
    }
}

function generarKardex() {
    var data = "";
    var fechaInicio = "";
    var fechaFinal = "";

    var dFechaFinal = txtFechaFinal.value.split("-");
    fechaFinal = dFechaFinal[2] + "-" + dFechaFinal[1] + "-" + dFechaFinal[0];

    data = fechaFinal;
    Http.get("General/listarTabla/?tbl=" + controller + vista + "Generar&data=" + data, mostrarListado);
}

function mostrarListado(rpta) {
    if (rpta) {
        var listas = rpta.split('¯');
        var lista = listas[0].split("¬");
        grillaItem = new GrillaScroll(lista, "divLista", 500, 10, "Kardex", "Inventario", null, null, null, null, 30, false, null);
        btnReporte.style.display = 'inline';
        Swal.close();
    }
}


function mostrarReporteResumen(rpta) {
    if (rpta) {
        spnLoad.style.display = 'none';
        var dFechaFinal = txtFechaFinal.value.split("-");
        var fechaFinal = dFechaFinal[2] + "-" + dFechaFinal[1] + "-" + dFechaFinal[0];

        var listas = rpta.split('¯');
        titulo = listas[0];
        var lista = listas[1].split("¬");
        crearTabla(lista, 5, 5, "tblListaDatosResumen2");
        //listaDatos = listas[1];
        var fecha = listas[2];
        var hora = listas[3];

        var doc = new jsPDF()
        var totalPagesExp = '{total_pages_count_string}';
        doc.autoTable({
            html: '#tblListaDatosResumen2',
            styles: { cellPadding: 0.5, fontSize: 7 },
            theme: 'grid',
            headerStyles: {
                fillColor: [0, 0, 0],
                fontSize: 9,
                halign: 'center',
            },
            columnStyles: {
                3: { halign: 'right' },
                4: { halign: 'right' },
                5: { halign: 'right' },
                6: { halign: 'right' },
            },
            margin: { top: 41 },
            didDrawPage: function (data) {
                // Header
                doc.setFontSize(20)
                doc.setTextColor(40)
                if (base64Img) {
                    doc.addImage(base64Img, 'JPEG', 25, 6, 10, 10)
                }
                doc.setFontSize(6);
                doc.text('IAFAS de la Marina de Guerra del Perú', 14, 18)
                doc.text('SISGEFIN', 14, 21)
                doc.text('Fecha: ' + fecha, 170, 21)
                doc.text('Usuario: ' + spnUsuario.innerHTML, 14, 23)
                doc.text('Hora: ' + hora, 170, 23)
                doc.setFontSize(13);
                doc.text(titulo, data.settings.margin.left + 55, 32)
                doc.setFontSize(12);
                doc.text('AL: ' + fechaFinal, data.settings.margin.left + 75, 37)

                // Footer
                var str = 'Página ' + doc.internal.getNumberOfPages()
                if (typeof doc.putTotalPages === 'function') {
                    str = str + ' de ' + totalPagesExp
                }
                doc.setFontSize(10)

                var pageSize = doc.internal.pageSize
                var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
                doc.text(str, data.settings.margin.left, pageHeight - 5)
            },

        })

        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp)
        }

        doc.setProperties({
            title: 'SISGEFIN: ' + titulo,
            subject: 'IAFAS-FOSMAR',
            author: spnUsuario.innerHTML
        });

        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));
    }
    else {
        mostrarMensaje("No se generó ningún reporte", "error")
    }
}
function mostrarReporteKardexItem(rpta) {
    if (rpta) {
        spnLoad.style.display = 'none';
        var dFechaFinal = txtFechaFinal.value.split("-");
        var fechaFinal = dFechaFinal[2] + "-" + dFechaFinal[1] + "-" + dFechaFinal[0];

        var listas = rpta.split('¯');
        titulo = listas[0];
        var cabecera = listas[1].split("|");
        var detalle = listas[2].split("¬");
        crearTabla(detalle, 5, 5, "tblListaDatosResumen2");
        //listaDatos = listas[1];
        var fecha = listas[3];
        var hora = listas[4];

        var doc = new jsPDF()
        var totalPagesExp = '{total_pages_count_string}';
        doc.autoTable({
            html: '#tblListaDatosResumen2',
            styles: { cellPadding: 0.5, fontSize: 7 },
            theme: 'grid',
            headerStyles: {
                fillColor: [0, 0, 0],
                fontSize: 9,
                halign: 'center',
            },
            columnStyles: {
                3: { halign: 'right' },
                4: { halign: 'right' },
                5: { halign: 'right' },
                6: { halign: 'right', fillColor: [231, 228, 228] },
            },
            margin: { top: 55 },
            didDrawPage: function (data) {
                // Header
                doc.setFontSize(20)
                doc.setTextColor(40)
                if (base64Img) {
                    doc.addImage(base64Img, 'JPEG', 25, 6, 10, 10)
                }
                doc.setFontSize(6);
                doc.text('IAFAS de la Marina de Guerra del Perú', 14, 18)
                doc.text('SISGEFIN', 14, 21)
                doc.text('Fecha: ' + fecha, 170, 21)
                doc.text('Usuario: ' + spnUsuario.innerHTML, 14, 23)
                doc.text('Hora: ' + hora, 170, 23)
                doc.setFontSize(13);
                doc.text(titulo, data.settings.margin.left + 55, 32)
                doc.setFontSize(12);
                doc.text('AL: ' + fechaFinal, data.settings.margin.left + 75, 37)
                doc.setFontSize(9);
                doc.text('CODIGO: ' + cabecera[0], 13, 45)
                doc.text('UNIDAD MEDIDA: ' + cabecera[2], 80, 45)
                doc.text('PRODUCTO: ' + cabecera[1], 13, 50)

                // Footer
                var str = 'Página ' + doc.internal.getNumberOfPages()
                if (typeof doc.putTotalPages === 'function') {
                    str = str + ' de ' + totalPagesExp
                }
                doc.setFontSize(10)

                var pageSize = doc.internal.pageSize
                var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
                doc.text(str, data.settings.margin.left, pageHeight - 5)
            },

        })

        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp)
        }

        doc.setProperties({
            title: 'SISGEFIN: ' + titulo,
            subject: 'IAFAS-FOSMAR',
            author: spnUsuario.innerHTML
        });

        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));
    }
    else {
        mostrarMensaje("No se generó ningún reporte", "error")
    }
}
function mostrarReporteKardexDetalle(rpta) {
    if (rpta) {
        spnLoad.style.display = 'none';
        var dFechaFinal = txtFechaFinal.value.split("-");
        var fechaFinal = dFechaFinal[2] + "-" + dFechaFinal[1] + "-" + dFechaFinal[0];

        var listas = rpta.split('¯');
        titulo = listas[0];
        var lista = listas[1].split("¬");
        crearTabla(lista, 5, 5, "tblListaDatosResumen2");
        //listaDatos = listas[1];
        var fecha = listas[2];
        var hora = listas[3];

        var doc = new jsPDF()
        var totalPagesExp = '{total_pages_count_string}';
        doc.autoTable({
            html: '#tblListaDatosResumen2',
            styles: { cellPadding: 0.5, fontSize: 7 },
            theme: 'grid',
            headerStyles: {
                fillColor: [0, 0, 0],
                fontSize: 9,
                halign: 'center',
            },
            columnStyles: {
                3: { halign: 'right' },
                4: { halign: 'right' },
                5: { halign: 'right' },
                6: { halign: 'right' },
            },
            margin: { top: 41 },
            didDrawPage: function (data) {
                // Header
                doc.setFontSize(20)
                doc.setTextColor(40)
                if (base64Img) {
                    doc.addImage(base64Img, 'JPEG', 25, 6, 10, 10)
                }
                doc.setFontSize(6);
                doc.text('IAFAS de la Marina de Guerra del Perú', 14, 18)
                doc.text('SISGEFIN', 14, 21)
                doc.text('Fecha: ' + fecha, 170, 21)
                doc.text('Usuario: ' + spnUsuario.innerHTML, 14, 23)
                doc.text('Hora: ' + hora, 170, 23)
                doc.setFontSize(13);
                doc.text(titulo, data.settings.margin.left + 55, 32)
                doc.setFontSize(12);
                doc.text('AL: ' + fechaFinal, data.settings.margin.left + 75, 37)

                // Footer
                var str = 'Página ' + doc.internal.getNumberOfPages()
                if (typeof doc.putTotalPages === 'function') {
                    str = str + ' de ' + totalPagesExp
                }
                doc.setFontSize(10)

                var pageSize = doc.internal.pageSize
                var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
                doc.text(str, data.settings.margin.left, pageHeight - 5)
            },

        })

        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp)
        }

        doc.setProperties({
            title: 'SISGEFIN: ' + titulo,
            subject: 'IAFAS-FOSMAR',
            author: spnUsuario.innerHTML
        });


        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));
    }
    else {
        mostrarMensaje("No se generó ningún reporte", "error")
    }
}
function crearTabla(lista, colSpan, calColum, idTabla) {
    var campos = lista[0].split("|");
    var anchos = lista[1].split("|");
    var tipos = lista[2].split("|");
    var nRegistros = lista.length;
    var nCampos = campos.length;
    var total = 0;
    var contenido = "<table id='";
    contenido += idTabla
    contenido += "' class='table'><thead><tr>";
    for (var z = 0; z < nCampos; z++) {
        contenido += "<th>";
        contenido += campos[z];
        contenido += "</th>";
    }
    contenido += "</tr></thead><tbody>";
    for (var i = 3; i < nRegistros; i++) {
        campos = lista[i].split("|");
        contenido += "<tr>";
        for (var j = 0; j < nCampos; j++) {
            contenido += "<td>";
            switch (tipos[j]) {
                case "Int32":
                    contenido += campos[j];
                    break;
                case "Int64":
                    contenido += campos[j];
                    break;
                case "Decimal":
                    contenido += formatoNumero(campos[j]);
                    break;
                case "String":
                    contenido += campos[j];
                    break;
                case "DateTime":
                    contenido += campos[j];
                    break;
            }
            contenido += "</td>";
        }
        contenido += "</tr>";

    }
    //contenido += "<tr><td colspan='";
    //contenido += colSpan;
    //contenido += "' >TOTAL</td>";
    //contenido += "<td>";
    //contenido += formatoNumero(total);
    //contenido += "</td>";
    //contenido += "</tr >";
    contenido += "</tbody>";
    contenido += "</table > ";
    var div = document.getElementById("tblTable");
    div.innerHTML = contenido;
}

function mostrarExportar(rpta) {
    var spnLoad = document.getElementById("spnLoad");
    if (spnLoad!=null)spnLoad.style.display = 'none';
    descargarArchivo(rpta, obtenerMime());
}

function obtenerMime() {
    var campos = archivo.split('.');
    var n = campos.length;
    var extension = campos[n - 1].toLowerCase();
    switch (extension) {
        case "xlsx":
            tipoMime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            break;
        case "docx":
            tipoMime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            break;
        case "pdf":
            tipoMime = "aplication/pdf";
            break;
        default:
            tipoMime = "aplication/octect-stream";
            break;
    }
    return tipoMime;
}

function descargarArchivo(data, tipoDato, archivo) {

    if (navigator.appVersion.toString().indexOf('Safari') > 0 && !(navigator.appVersion.toString().indexOf('Chrome') > 0)) {
        window.open('data:' + tipoDato + encodeURI(data));
    }
    else {
        var blob = new Blob((tipoDato == "text/csv" || tipoDato == "application/vnd.ms-excel" ? ["\ufeff", data] : [data]), { "type": tipoDato });
        if ('msSaveBlob' in navigator) {
            navigator.msSaveBlob(blob, nombreArchivo);
        }
        else {
            var link = document.createElement("a");
            document.body.appendChild(link);
            link.download = nombreArchivo;
            link.href = window.URL.createObjectURL(blob);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function seleccionarFila(fila, id, prefijo) {
    idRegistro = id;
    window["id" + prefijo] = id;
    if (window["fila" + prefijo] != null) window["fila" + prefijo].className = "FilaDatos";
    fila.className = "FilaSeleccionada";
    window["fila" + prefijo] = fila;
}

function mostrarDatosExportar(rpta) {

    if (rpta) {
        spnLoad.style.display = 'none';
        var listas = rpta.split('¯');
        tituloReporte = listas[0];
        var nombreItem;
        if (optDetalleItem.checked == true) {
            contenidoExporta = listas[2];
            var dataItem = listas[1].split('|');
            nombreItem = dataItem[1];
        }
        else {
            contenidoExporta = listas[1];
        }
       
        if (nombreItem != "") {
            nombreArchivo = tituloReporte + ' ' + nombreItem + ".xlsx"
        }
        else {
            nombreArchivo = tituloReporte + ".xlsx";
        }
        archivo = tituloReporte + ".xlsx";
        Http.postDownloadBytes("General/exportar/?orienta=V&nombreArchivo=" + archivo + "&sProducto=" + listas[1], mostrarExportar, contenidoExporta);
    }
}