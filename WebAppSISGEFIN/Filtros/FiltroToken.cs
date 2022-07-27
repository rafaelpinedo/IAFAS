using System.Web.Mvc;

namespace AppWebSigeaSchool.Filtros
{
    public class FiltroToken : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            string directorio = filterContext.HttpContext.Request.ApplicationPath;
            if (filterContext.HttpContext.Session["token"] == null) filterContext.Result = new ContentResult() { Content = "No se puede llamar directamente la pagina" };
            else filterContext.HttpContext.Session["token"] = null;
        }
    }
}