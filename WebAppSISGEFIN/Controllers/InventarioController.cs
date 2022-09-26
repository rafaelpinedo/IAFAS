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
    public class InventarioController : Controller
    {
        [FiltroAutenticacion]
        public ActionResult Almacen()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult InventarioInicial()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            string Fecha = DateTime.Now.ToShortDateString();
            ViewBag.FechaInicial = DateTime.Now.Year - 1 + "-01-01";
            ViewBag.Fecha = Convert.ToDateTime(Fecha).ToString("yyyy-MM-dd");
            DateTime nuevaFecha = Convert.ToDateTime(Fecha);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Pendiente()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            string Fecha = DateTime.Now.ToShortDateString();
            ViewBag.FechaInicial = DateTime.Now.Year - 1 + "-01-01";
            ViewBag.Fecha = Convert.ToDateTime(Fecha).ToString("yyyy-MM-dd");
            DateTime nuevaFecha = Convert.ToDateTime(Fecha);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult GenerarNP()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            string Fecha = DateTime.Now.ToShortDateString();
            ViewBag.FechaInicial = DateTime.Now.Year + "-01-01";
            ViewBag.Fecha = Convert.ToDateTime(Fecha).ToString("yyyy-MM-dd");
            DateTime nuevaFecha = Convert.ToDateTime(Fecha);
            int Anio = DateTime.Now.Year;
            ViewBag.Anio = Anio;
            return View();
        }

       
        [FiltroAutenticacion]
        public ActionResult Kardex()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            string Fecha = DateTime.Now.ToShortDateString();
            ViewBag.FechaInicial = DateTime.Now.Year + "-01-01";
            ViewBag.Fecha = Convert.ToDateTime(Fecha).ToString("yyyy-MM-dd");
            DateTime nuevaFecha = Convert.ToDateTime(Fecha);
            int Anio = DateTime.Now.Year;
            ViewBag.Anio = Anio;
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult CierreAlmacen()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            string Fecha = DateTime.Now.ToShortDateString();
            ViewBag.FechaInicial = DateTime.Now.Year + "-01-01";
            ViewBag.Fecha = Convert.ToDateTime(Fecha).ToString("yyyy-MM-dd");
            DateTime nuevaFecha = Convert.ToDateTime(Fecha);
            int Anio = DateTime.Now.Year;
            ViewBag.Anio = Anio;
            return View();
        }

    }
}