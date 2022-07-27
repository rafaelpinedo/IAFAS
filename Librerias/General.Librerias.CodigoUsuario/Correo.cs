using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using General.Librerias.EntidadesNegocio;

namespace General.Librerias.CodigoUsuario
{
    public class Correo
    {
        public static string EnviarCorreo(string Destina1, string Destina2, string Titulo, string Contenido, bool adjunto, string NombreArchivo = "", byte[] archivoPDF = null)
        {
            //string Idx = "5";
            //daSQL odaSQL = new daSQL("conTCambio");
            //string Datos = odaSQL.EjecutarComando("uspConfiguracionListarCsv", "@Data", Idx);
            //string[] MiConfig = Datos.ToString().Split('|');
            //string strURL = MiConfig[5];

            string archivoLog = ConfigurationManager.AppSettings["ArchivoLog"];

            string EnviadoPor = ConfigurationManager.AppSettings["adminUser"];
            string Clave = ConfigurationManager.AppSettings["adminPassword"];
            string sHost = ConfigurationManager.AppSettings["SMTPName"];
            string iPort = ConfigurationManager.AppSettings["SMTPPort"];
            try
            {
                var mensaje = new MailMessage();
                mensaje.From = new MailAddress(EnviadoPor);
                mensaje.To.Add(new MailAddress(Destina1));
                mensaje.CC.Add(new MailAddress(Destina2));
                mensaje.Subject = Titulo;
                mensaje.Body = Contenido;
                mensaje.IsBodyHtml = true;
                if (adjunto)
                {
                    mensaje.Attachments.Add(new Attachment(new MemoryStream(archivoPDF), NombreArchivo, MediaTypeNames.Application.Pdf));
                }
                using (var smtp = new SmtpClient())
                {
                    var credenciales = new NetworkCredential
                    {
                        UserName = EnviadoPor,
                        Password = Clave
                    };
                   
                    smtp.Host = sHost;
                    smtp.Port = int.Parse(iPort);
                    smtp.EnableSsl = true;
                    smtp.UseDefaultCredentials = false;
                    //smtp.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
                    smtp.Credentials = credenciales;
                    smtp.Send(mensaje);
                }
                return "Se envió el correo con exito";
            }
            catch (Exception ex)
            {
                beLog obeLog = new beLog();
                obeLog.MensajeError = ex.Message;
                obeLog.DetalleError = ex.StackTrace;
                Log.Grabar(obeLog, archivoLog);
                return "Error - No se pudo enviar el correo";
            }
        }
    }
}
