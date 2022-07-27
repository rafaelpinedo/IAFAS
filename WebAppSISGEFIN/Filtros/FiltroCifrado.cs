using System.Web;
using System.Web.UI;
using System.Web.Mvc;
using System.IO;
using System.Text;

namespace AppWebSigeaSchool.Filtros
{
    public class FiltroCifrado : ActionFilterAttribute
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
            string response = cifradoXOR(sb.ToString());
            output.Write(response);
        }
        private string cifradoXOR(string mensaje)
        {
            StringBuilder sb = new StringBuilder();
            int n = mensaje.Length;
            int clave = 10;
            int c;
            for (var i = 0; i < n; i++)
            {
                c = (int)mensaje[i];
                sb.Append((char)(c ^ clave));
            }
            return sb.ToString();
        }
    }
}