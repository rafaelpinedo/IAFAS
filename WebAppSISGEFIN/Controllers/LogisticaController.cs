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
    public class LogisticaController : Controller
    {

        [FiltroAutenticacion]
        public ActionResult DashCompras()
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
        public ActionResult Configuracion()
        {
            int Anio = DateTime.Now.Year;
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            ViewBag.Anio = Anio;
            ViewBag.AnioCN = Anio+1;
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Proveedor()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Oficina()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult CondicionCompra()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Formato()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Grupo()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Clase()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Familia()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Articulo()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult UniMed()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }
        
        [FiltroAutenticacion]
        public ActionResult PedidoCompra()
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
        public ActionResult SolicitudCompra()
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
        public ActionResult Cotizacion()
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
        public ActionResult CuadroCompara()
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
        public ActionResult OrdenCompra()
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
        public ActionResult Tipoproceso()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult PAC()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            int Anio = DateTime.Now.Year;
            ViewBag.Anio = Anio;
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Prosel()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            int Anio = DateTime.Now.Year;
            ViewBag.Anio = Anio;
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Contrato()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            int Anio = DateTime.Now.Year;
            ViewBag.Anio = Anio;
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult RegistroCN()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            int Anio = DateTime.Now.Year;
            ViewBag.Anio = Anio;
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult AprobacionCN()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            int Anio = DateTime.Now.Year;
            ViewBag.Anio = Anio;
            return View();
        }



    }
}