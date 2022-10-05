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

        [FiltroAutenticacion]
        public ActionResult CodifiEntiFin()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            ViewBag.AnhoActual = DateTime.Now.Year;
            return View();
        }
        [FiltroAutenticacion]
        public ActionResult Recaudacion()
        {
            int Anio = DateTime.Now.Year;
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            string Fecha = DateTime.Now.ToShortDateString();
            ViewBag.FechaInicial = DateTime.Now.Year + "-01-01";
            ViewBag.Fecha = Convert.ToDateTime(Fecha).ToString("yyyy-MM-dd");
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            ViewBag.Anio = Anio;
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult ReciboIngreso()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            string Fecha = DateTime.Now.ToShortDateString();
            ViewBag.FechaInicial = DateTime.Now.Year + "-01-01";
            ViewBag.Fecha = Convert.ToDateTime(Fecha).ToString("yyyy-MM-dd");
            DateTime nuevaFecha = Convert.ToDateTime(Fecha);
            nuevaFecha = nuevaFecha.AddDays(-1);
            ViewBag.FechaAprobacion = Convert.ToDateTime(nuevaFecha).ToString("yyyy-MM-dd");
            int Anio = DateTime.Now.Year;
            ViewBag.Anio = Anio;
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult EstadoCuenta()
        {
            int Anio = DateTime.Now.Year;
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            ViewBag.Anio = Anio;
            return View();
        }

    }
}