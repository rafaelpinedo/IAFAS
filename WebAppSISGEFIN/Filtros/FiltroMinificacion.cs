using System.IO;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;

namespace AppWebSigeaSchool.Filtros
{
    public class FiltroMinificacion : ActionFilterAttribute
    {
        StringBuilder sb;
        HttpWriter output;

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            sb = new StringBuilder();
            StringWriter sw = new StringWriter(sb);
            HtmlTextWriter tw = new HtmlTextWriter(sw);
            output = (HttpWriter)filterContext.RequestContext.HttpContext.Response.Output;
            filterContext.RequestContext.HttpContext.Response.Output = tw;
        }

        public override void OnResultExecuted(ResultExecutedContext filterContext)
        {
            if (sb != null)
            {
                string response = minificar(sb.ToString());
                output.Write(response);
            }
        }

        private string minificar(string contenido)
        {
            contenido = contenido.Replace("\n", " ");
            contenido = contenido.Replace("\t", " ");
            contenido = contenido.Replace("        ", " ");
            contenido = contenido.Replace("       ", " ");
            contenido = contenido.Replace("      ", " ");
            contenido = contenido.Replace("     ", " ");
            contenido = contenido.Replace("    ", " ");
            contenido = contenido.Replace("   ", " ");
            contenido = contenido.Replace("  ", " ");
            return contenido;
        }
    }
}