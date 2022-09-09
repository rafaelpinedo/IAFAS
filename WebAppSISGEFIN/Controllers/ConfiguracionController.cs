using WebAppSISGEFIN.Models;
using System.IO;
using io = System.IO;
using System.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using General.Librerias.CodigoUsuario;
using General.Librerias.AccesoDatos;
using WebAppSISGEFIN.Filtros;
using System.Threading.Tasks;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Data;

namespace WebAppSISGEFIN.Controllers
{
    public class ConfiguracionController : Controller
    {
        [FiltroAutenticacion]
        public ActionResult Configuracion()
        {
            int Anio = DateTime.Now.Year;
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            ViewBag.Anio = Anio;
            ViewBag.AnioCN = Anio + 1;
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Periodo()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            int Anio = DateTime.Now.Year;
            ViewBag.Anio = Anio;
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Persona()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }
    }
}