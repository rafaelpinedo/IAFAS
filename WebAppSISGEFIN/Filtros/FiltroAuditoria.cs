//using System.Web.Mvc;
//using System.Configuration;
//using AppWebSigeaSchool.Models;
//using General.Librerias.CodigoUsuario; //Log

//namespace AppWebSigeaSchool.Filtros
//{
//    public class FiltroAuditoria : ActionFilterAttribute
//    {
//        public override void OnActionExecuted(ActionExecutedContext filterContext)
//        {
//            Auditoria oAuditoria = new Auditoria();
//            oAuditoria.Usuario = (filterContext.HttpContext.Session["DataUsuario"] != null ? filterContext.HttpContext.Session["usuario"].ToString() : "");
//            oAuditoria.Controlador = filterContext.ActionDescriptor.ControllerDescriptor.ControllerName;
//            oAuditoria.Metodo = filterContext.ActionDescriptor.ActionName;
//            oAuditoria.Navegador = filterContext.HttpContext.Request.Browser.ToString();
//            string archivo = ConfigurationManager.AppSettings["RutaAuditoria"];
//            Log.Grabar(oAuditoria, archivo);
//        }
//    }
//}