using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebAppSISGEFIN.Models;
using WebAppSISGEFIN.Filtros;

namespace WebAppSISGEFIN.Controllers
{
    public class IngresosController : Controller
    {
        // GET: Ingresos
        public ActionResult Index()
        {
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Asegurado()
        {

            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult EntiFin()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult LineaIngreso()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Tarifa()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            ViewBag.AnhoActual = DateTime.Now.Year;
            return View();
        }



    }
}