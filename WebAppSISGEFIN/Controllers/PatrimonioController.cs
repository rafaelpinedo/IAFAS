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
    public class PatrimonioController : Controller
    {

        [FiltroAutenticacion]
        public ActionResult DashPatrimonio()
        {
            DateTime fechaActual = DateTime.Now;
            string Mes = fechaActual.ToString("MMMM").ToUpper();
            int Anio = DateTime.Now.Year;
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            ViewBag.Anio = Anio;
            ViewBag.Mes = Mes;
            ViewBag.Fecha = fechaActual.ToShortDateString();
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult UbicaFisica()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Marca()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult CausalBaja()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult TiposPatrimonio()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }
        
        [FiltroAutenticacion]
        public ActionResult TasaUIT()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult InventarioInicial()
        {
            //string Mes = fechaActual.ToString("MMMM").ToUpper();
            int Anio = DateTime.Now.Year;
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            string Fecha = DateTime.Now.ToShortDateString();
            ViewBag.FechaInicial = DateTime.Now.Year - 1 + "-01-01";
            ViewBag.Fecha = Convert.ToDateTime(Fecha).ToString("yyyy-MM-dd");
            DateTime nuevaFecha = Convert.ToDateTime(Fecha);
            ViewBag.Anio = Anio;
           // ViewBag.Mes = Mes;
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult General()
        {
            //string Mes = fechaActual.ToString("MMMM").ToUpper();
            int Anio = DateTime.Now.Year;
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            string Fecha = DateTime.Now.ToShortDateString();
            ViewBag.FechaInicial = DateTime.Now.Year - 1 + "-01-01";
            ViewBag.Fecha = Convert.ToDateTime(Fecha).ToString("yyyy-MM-dd");
            DateTime nuevaFecha = Convert.ToDateTime(Fecha);
            ViewBag.Anio = Anio;
            // ViewBag.Mes = Mes;
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Altas()
        {
            DateTime fechaActual = DateTime.Now;
            string Mes = fechaActual.ToString("MMMM").ToUpper();
            int Anio = DateTime.Now.Year;
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            ViewBag.Anio = Anio;
            ViewBag.Mes = Mes;
            ViewBag.Fecha = fechaActual.ToShortDateString();
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Bajas()
        {
            DateTime fechaActual = DateTime.Now;
            string Mes = fechaActual.ToString("MMMM").ToUpper();
            int Anio = DateTime.Now.Year;
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            ViewBag.Anio = Anio;
            ViewBag.Mes = Mes;
            ViewBag.Fecha = fechaActual.ToShortDateString();
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult MantoActivo()
        {
            DateTime fechaActual = DateTime.Now;
            string Mes = fechaActual.ToString("MMMM").ToUpper();
            int Anio = DateTime.Now.Year;
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            ViewBag.Anio = Anio;
            ViewBag.Mes = Mes;
            ViewBag.Fecha = fechaActual.ToShortDateString();
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Devoluciones()
        {
            DateTime fechaActual = DateTime.Now;
            string Mes = fechaActual.ToString("MMMM").ToUpper();
            int Anio = DateTime.Now.Year;
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            ViewBag.Anio = Anio;
            ViewBag.Mes = Mes;
            ViewBag.Fecha = fechaActual.ToShortDateString();
            return View();
        }
    }
}