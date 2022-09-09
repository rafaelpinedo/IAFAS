using General.Librerias.AccesoDatos;
using General.Librerias.CodigoUsuario;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using io = System.IO;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net;
using WebAppSISGEFIN.Filtros;
using WebAppSISGEFIN.Models;

namespace WebAppTurnera.Controllers
{
    public class GeneralController : Controller
    {
        [FiltroAutenticacion]
        public ActionResult Inicio()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        // GET: General
        public string guardar(string tbl)
        {
            string rpta = "";
            daSQL odaSQL = new daSQL("conSISGEFIN");
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string User = Data[1];
            string data = Request.Form["data"];
            data = data + "¯" + User;

            rpta = odaSQL.EjecutarComando("usp" + tbl + "GrabarCsv", "@Data", data);
            return rpta;
        }

        public string listarTabla(string tbl, string data)
        {
            string rpta = "";
            daSQL odaSQL = new daSQL("conSISGEFIN");
            rpta = odaSQL.EjecutarComando("usp" + tbl + "ListarCsv", "@Data", data);
            return rpta;
        }

        public string obtenerTabla(string tbl, string id)
        {
            string rpta = "";
            daSQL odaSQL = new daSQL("conSISGEFIN");
            if (tbl == "SecurityUsuarioPerfil")
            {
                string[] Data = Session["DataUsuario"].ToString().Split('|');
                string User = Data[1];
                //string data = Request.Form["data"];
                //data = User + "|" + data;
                rpta = odaSQL.EjecutarComando("usp" + tbl + "EdicionCsv", "@Data", User);
            }
            else
            {
                rpta = odaSQL.EjecutarComando("usp" + tbl + "EdicionCsv", "@Data", id);
            }
            return rpta;
        }

        public string obtenerReporteId(string tbl, string id)
        {
            string rpta = "";
            daSQL odaSQL = new daSQL("conSISGEFIN");
            rpta = odaSQL.EjecutarComando("usp" + tbl + "ReporteCsv", "@Data", id);
            return rpta;
        }

        public string getreporte(string tbl, string data)
        {
            string Fecha = DateTime.Now.ToShortDateString();
            string Hora = DateTime.Now.ToShortTimeString();
            string rpta = "";
            daSQL odaSQL = new daSQL("conSISGEFIN");
            rpta = odaSQL.EjecutarComando("usp" + tbl + "ReporteCsv", "@Data", data);
            return rpta + '¯' + Fecha + '¯' + Hora;
        }

        public string eliminar(string tbl)
        {
            string rpta = "";
            daSQL odaSQL = new daSQL("conSISGEFIN");
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string User = Data[1];
            string data = Request.Form["data"];
            data = data + "|" + User;

            rpta = odaSQL.EjecutarComando("usp" + tbl + "EliminarCsv", "@Data", data);
            return rpta;
        }

        public void exportarOnline(string tbl, string idx, string ori)
        {
            string rpta;
            string data;
            string nombreArchivo;
            string subTitulo = "";
            string sProducto = "";
            bool isTotal = false;
            string colSum = "";
            daSQL odaSQL = new daSQL("conSISGEFIN");
            rpta = odaSQL.EjecutarComando("usp" + tbl + "ReporteCsv", "@Data", idx);

            string[] Listas = rpta.Split('¯');
            nombreArchivo = Listas[0];
            data = Listas[1];
            var nListas = Listas.Length;
            if (nListas > 2)
            {
                if (Listas[2] != null || Listas[2] != "")
                {
                    string[] configuracion = Listas[2].Split('|');
                    subTitulo = configuracion[0];
                    if (configuracion[1] == "1")
                    {
                        isTotal = true;
                    }
                    colSum = configuracion[2];
                }
            }

            nombreArchivo = nombreArchivo.Replace(" ", "_");
            nombreArchivo = nombreArchivo + ".xlsx";
            if (data != null || data != "")
            {
                crearArchivoBajar(nombreArchivo, data, ori, subTitulo, sProducto, isTotal, colSum);
            }
        }

        public void exportar(string orienta, string nombreArchivo, string stitulo = "", string sProducto = "", bool isTotal = false)
        {
            string data = "";
            nombreArchivo = nombreArchivo.Replace(" ", "_");
            long n = Request.InputStream.Length;
            if (n > 0)
            {
                Stream flujo = Request.InputStream;
                StreamReader sr = new StreamReader(flujo);
                data = sr.ReadToEnd();
                crearArchivoBajar(nombreArchivo, data, orienta, stitulo, sProducto, isTotal);
                //crearArchivoBajar(nombreArchivo, data, orienta);
            }
        }

        //private void crearArchivoBajar(string nombreArchivo, string data, string orienta)

        private void crearArchivoBajar(string nombreArchivo, string data, string orienta, string stitulo = "", string sProducto = "", bool isTotal = false, string colSuma = "")
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string usuario = Data[1];
            string tipoMime = "";
            string tipo = System.IO.Path.GetExtension(nombreArchivo).ToLower();
            string nombre = Path.GetFileNameWithoutExtension(nombreArchivo).ToLower();
            string tituloReporte = nombre.ToUpper();
            var usuarioNombre = "Usuario: " + usuario;
            var nombreSistema = "SISGEFIN";

            DataTable table = Cadena.ConvertirDataTable(data, tipo);
            DataSet dst = new DataSet();
            dst.Tables.Add(table);

            byte[] buffer = null;
            switch (tipo)
            {
                //case ".xlsx":
                //    buffer = Epplus.Excel(table, nombre, tituloReporte, usuarioNombre, nombreSistema);
                //    break;
                case ".xlsx":
                    buffer = Epplus.Excel(data, nombre, tituloReporte, usuarioNombre, nombreSistema, stitulo, sProducto, isTotal, colSuma);
                    break;
                case ".pdf":
                    string ruta = Server.MapPath("~/Riztie/Images");
                    string img1 = io.Path.Combine(ruta, "logoReporte.png");
                    tipoMime = "application/pdf";
                    buffer = PDF.Crear(dst, tituloReporte, usuario, img1, orienta);
                    break;
            }
            Response.Clear();
            Response.ContentType = tipoMime;
            Response.AppendHeader("content-disposition", "attachment;filename=" + nombreArchivo);
            if ((tipo.Equals(".pdf")) || (tipo.Equals(".xlsx")) && buffer != null && buffer.Length > 0)
            {
                Response.BinaryWrite(buffer);
            }

            //if (!tipo.Equals(".pdf") && io.File.Exists(archivo))
            //{
            //    Response.TransmitFile(archivo);
            //}
            Response.End();
        }

        public string getTimeServer()
        {
            string Fecha = DateTime.Now.ToShortDateString();
            string Hora = DateTime.Now.ToShortTimeString();
            return Fecha + '¯' + Hora;
        }

        public async Task<string> consultaDniReniec(string dni)
        {
            string url = "https://apiperu.dev/api/";
            string rpta = "";
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "d4c10682b2e806473f582210d51df363ab44853b87ef4d4612fe80f33809dff3");
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                HttpResponseMessage rptaServicio = await client.GetAsync("dni/" + dni);
                if (rptaServicio != null && rptaServicio.StatusCode.Equals(HttpStatusCode.OK))
                {
                    rpta = await rptaServicio.Content.ReadAsStringAsync();
                }
            }
            return rpta;
        }

        public async Task<string> consultaRucSunat(string ruc)
        {
            string url = "https://apiperu.dev/api/";
            string rpta = "";
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "d4c10682b2e806473f582210d51df363ab44853b87ef4d4612fe80f33809dff3");
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                HttpResponseMessage rptaServicio = await client.GetAsync("ruc/" + ruc);
                if (rptaServicio != null && rptaServicio.StatusCode.Equals(HttpStatusCode.OK))
                {
                    rpta = await rptaServicio.Content.ReadAsStringAsync();
                }
            }
            return rpta;
        }

        public string enviarCorreo(bool grabarBD = false)
        {
            string rpta = "";
            string contenidoMail = "datos de prueba";
            string correo = Request.Form["correo"];
            //string data = Request.Form["data"];
            string idOrden = Request.Form["idx"];
            if (Request.Files.Count > 0)
            {
                //string ruta = Server.MapPath("~/Reporte");
                //string archivo = io.Path.Combine(ruta, "cotizacion.pdf");
                //Request.Files[0].SaveAs(archivo);
                //byte[] buffer = io.File.ReadAllBytes(archivo);
                Stream flujo = Request.Files[0].InputStream;
                int nSize = Request.Files[0].ContentLength;
                byte[] buffer = new byte[nSize];
                flujo.Read(buffer, 0, nSize);
                string rutaPDF = Server.MapPath("~/Riztie/Files/" + idOrden + ".pdf");
                Request.Files[0].SaveAs(rutaPDF);
                //Correo.EnviarCorreo(correo, "sisgefinweb@gmail.com", "IAFAS: solicitud de cotización", contenidoMail, true, "SolicitudCotizacion", buffer);
                if (grabarBD)
                {
                    daSQL odaSQL = new daSQL("conSISGEFIN");
                    bool exito = odaSQL.EjecutarComandoBinario("uspDocumentoOrdenesAdicionar", "@id", idOrden, "@orden", buffer);
                    if (exito) rpta = "Se envio el correo con el archivo adjunto y Se grabo el documento";
                    else rpta = "Se envio el correo con el archivo adjunto pero No se pudo grabar el documento";
                }
                else
                {
                    rpta = "Se envio el correo con el archivo adjunto";
                }
            }
            return rpta;
        }

        public string enviarOrden(string tbl)
        {
            string rpta = "";
            string contenidoMail = "Envio de orden de compra al proveedor";
            string correo = Request.Form["correo"];
            string idOrden = Request.Form["idx"];
            if (Request.Files.Count > 0)
            {
                //Correo.EnviarCorreo(correo, "sisgefinweb@gmail.com", "IAFAS: solicitud de cotización", contenidoMail, true, "SolicitudCotizacion", buffer);
                rpta = "Se envio el correo con el archivo adjunto";
                string[] Data = Session["DataUsuario"].ToString().Split('|');
                string User = Data[1];

                Stream flujo = Request.Files[0].InputStream;
                int nSize = Request.Files[0].ContentLength;
                byte[] buffer = new byte[nSize];
                flujo.Read(buffer, 0, nSize);

                daSQL odaSQL = new daSQL("conSISGEFIN");
                bool exito = odaSQL.EjecutarComandoBinario("uspDocumentoOrdenesAdicionar", "@id", idOrden, "@orden", buffer);
                if (exito) rpta = "Se grabo el documento";
                else rpta = "`No se pudo grabar el documento";
            }
            return rpta;
        }

        public FileResult descargarOrden(string idOrden)
        {
            FileResult rpta = null;
            daSQL odaSQL = new daSQL("conSISGEFIN");
            byte[] buffer = odaSQL.EjecutarConsultaBinaria("uspDocumentoOrdenesObtenerDocPorId", "@id", idOrden);
            if (buffer != null && buffer.Length > 0) rpta = File(buffer, "application/pdf");
            return rpta;
        }

        public string grabarUpdate()
        {
            string rpta = "";
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string User = Data[1];
            daSQL odaSQL = new daSQL("conSISGEFIN");
            string data = Request.Form["data"];
            data = User + "|" + data;
            rpta = odaSQL.EjecutarComando("uspSegUsuarioActualizarCsv", "@Data", data);
            //string[] listas = rpta.ToString().Split('¯');
            //string[] mensaje = listas[0].ToString().Split('|');
            //string tipo = mensaje[0];

            //string[] datosUsuario = listas[1].ToString().Split('|');
            //string usuario = datosUsuario[0];
            //string nombreUsuario = datosUsuario[2];
            //string emailUsuario = datosUsuario[3];
            //string nombrePerfil = datosUsuario[4];

            //if (listas.Length > 1 && !String.IsNullOrEmpty(listas[1]) && tipo == "A")
            //{
            //    string ContenidoMail = "<div bgcolor='#EEEEEE' style='text-align:center;background:#eeeeee;margin:0px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#555' link='#0066CC' alink='#0066CC' vlink='#0066CC'><table style='width:100%;height:100%;background-color:#eeeeee'><tbody><tr><td bgcolor='#EEEEEE'><table width='600' border='0' cellspacing='0' cellpadding='0' align='center'>" +
            //    "<tbody><tr><td align='center' valign='top'><table width='590' border='0' cellspacing='0' cellpadding='0'>" +
            //    "<tbody><tr><td colspan='2' height='10' align='left' valign='top' style='font-size:5px'>&nbsp;</td></tr>" +
            //    "<tr>" +
            //    "<td align='left' valign='middle'><table width='150' border='0' align='left' cellpadding='0' cellspacing='0'><tbody>" +
            //    "<tr><td align='right' valign='middle' style='font-family:Trebuchet MS,Arial,Helvetica,sans-serif;font-size:11px;font-weight:normal;padding-top:3px'>" +
            //    "</td></tr></tbody></table></td>" +
            //    "</tr>" +
            //    "</tbody></table></td></tr>" +
            //    "<tr><td height = '10' align = 'left' valign = 'top' style = 'font-size:5px'> &nbsp;</td></tr>" +
            //    "<tr><td><table width = '600' border = '0' cellspacing = '0' cellpadding = '0'>" +
            //    "<tbody>" +
            //    "<tr>" +
            //    "<td bgcolor = '#C57C12' colspan = '2' height = '10' align = 'left' valign = 'top' style = 'font-size:5px'> &nbsp;</td>" +
            //    "<td bgcolor = '#C57C12' width = '10' height = '10' align = 'right' valign = 'top' style = 'font-size:5px'> &nbsp;</td>" +
            //    "</tr>" +
            //    "<tr>" +
            //    "<td bgcolor = '#C57C12' width = '10' height = '20' align = 'left' valign = 'top'> &nbsp;</td>" +
            //    "<td bgcolor = '#C57C12' valign = 'middle' align = 'left' style = 'font-family:Arial,Helvetica,sans-serif;color:#fff;font-size:20px' > &nbsp; ENAMM</td>" +
            //    "<td bgcolor = '#C57C12' width='10' align='right' valign='top'>&nbsp;</td>" +
            //    "</tr>" +
            //     "<tr>" +
            //    "<td bgcolor = '#0000FF' width = '10' height = '20' align = 'left' valign = 'top'> &nbsp;</td>" +
            //    "<td bgcolor = '#0000FF' valign = 'middle' align = 'left' style = 'font-family:Arial,Helvetica,sans-serif;color:#fff;font-size:20px' > &nbsp; Seguridad SIGEA: <span class='il'>Acceso</span> al sistema.</td>" +
            //    "<td bgcolor = '#0000FF' width='10' align='right' valign='top'>&nbsp;</td>" +
            //    "</tr>" +
            //    "<tr><td bgcolor = '#0000FF' colspan='3' height='10' align='left' valign='top' style='font-size:5px'>&nbsp;</td></tr>" +
            //    "</tbody></table></td></tr>" +
            //    "<tr><td bgcolor = '#FFFFFF' height='20'>&nbsp;</td></tr>" +
            //    "<tr><td bgcolor = '#FFFFFF' align='center' valign='top' style='font-family:Arial,Helvetica,sans-serif'><table width = '600' border='0' cellspacing='0' cellpadding='0'><tbody><tr>" +
            //    "<td width = '30' > &nbsp;</td>" +
            //    "<td align = 'left' valign='top' style='font-family:Arial,Helvetica,sans-serif;color:#555555;font-size:14px'>" +
            //    "<h2 style = 'color:#22aae4;font-size:20px' > Estimado(a), " +
            //    nombreUsuario +
            //    "</h2>" +
            //    "<p>De acuerdo a tu solicitud, se ha actualizado tu contraseña de acceso al SIGEA.</p>" +
            //    "<table cellpadding = '0' cellspacing='0' border='0' style='margin-top:10px'>" +
            //    "<tbody><tr><td style = 'font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#22aae4' ><strong> Tus datos de acceso:</strong></td></tr>" +
            //    "<tr><td style = 'font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#555'><ul style='margin-top:0;padding:5px 0 0 15px;line-height:22px'>" +
            //    "<li>Nombre de Usuario: <strong style = 'color:#f90'>" +
            //    usuario +
            //    "</strong>" +
            //    "</li>" +
            //     "<li><span class='il'>Perfil</span>: <strong style = 'color:#f90'>" +
            //    nombrePerfil +
            //    "</strong>" +
            //    "</li>" +
            //    "</ul></td></tr>" +
            //    "</tbody></table>" +
            //    "<p style = 'line-height:1.5'><strong><em> Quedamos a tu disposición.</em></strong><br>Oficina de Informática<br></p>" +
            //    "</td>" +
            //    "<td width = '30' > &nbsp;</td>" +
            //    "</tr></tbody></table></td></tr>" +
            //    "<tr><td height = '20' style='background-color:#ffffff'><table width = '100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr>" +
            //    "<td align = 'left' height='20' width='20'>&nbsp;</td>" +
            //    "<td align = 'right' height='20' width='20'>&nbsp;</td>" +
            //    "</tr></tbody></table></td></tr>" +
            //    "<tr><td>" +
            //    "<br><br><p align = 'center' style='display:block;margin:0 0 5px 0;font-size:12px;color:#666666;font-family:Arial,Helvetica,sans-serif'>Por favor, no respondas este e-mail ya que se genera automáticamente.</p>" +
            //    "</td></tr>" +
            //    "<tr><td height = '40' > &nbsp;</td></tr>" +
            //    "<tr><td height = '20' ><table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr>" +
            //    "<td align = 'left' height='20' width='20'>&nbsp;</td>" +
            //    "<td align = 'right' height='20' width='20'>&nbsp;</td>" +
            //    "</tr></tbody></table></td></tr>" +
            //    "<tr><td align = 'center' valign='top'><table width = '550' border='0' cellspacing='0' cellpadding='0' align='center'><tbody><tr>" +
            //    "</tr></tbody></table></td></tr>" +
            //    "<tr><td height = '20' ><table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr>" +
            //    "<td align = 'left' height='20' width='20'>&nbsp;</td>" +
            //    "<td align = 'right' height='20' width='20'>&nbsp;</td>" +
            //    "</tr></tbody></table></td></tr>" +
            //    "<tr><td height = '60' > &nbsp;</td></tr>" +
            //    "</tbody></table></td></tr></tbody></table></div>";

            //    Correo.EnviarCorreo(emailUsuario, "jarucer@gmail.com", "TURNOSNET: Acceso al Sistema", ContenidoMail, false);
            //}

            //  rpta = listas[0];
            return rpta;
        }
    }
}