using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebAppSISGEFIN.Filtros
{
    public class FiltroAutenticacion : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            string directorio = filterContext.HttpContext.Request.ApplicationPath;
            if (filterContext.HttpContext.Session["DataUsuario"] == null) filterContext.Result = new RedirectResult("~" + directorio + "Security/Login");
        }
    }
}