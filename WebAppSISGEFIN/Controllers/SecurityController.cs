using General.Librerias.AccesoDatos;
using General.Librerias.CodigoUsuario;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using WebAppSISGEFIN.Filtros;
using WebAppSISGEFIN.Models;

namespace WebAppSISGEFIN.Controllers
{
    public class SecurityController : Controller
    {
         public ActionResult Login()
        {
            return View();
        }

        public string validarLogin(string usuario, string clave, string codigo)
        {
            string stHostName = "";
            string stIPAddress = "";
            // Obtener Nombre PC
            stHostName = System.Net.Dns.GetHostName();
            // 'Obtenemos la IP de la pc
            IPHostEntry IPs = Dns.GetHostEntry(stHostName);
            IPAddress[] Direcciones = IPs.AddressList;
            // Se despliega la lista de IP's
            for (var i_cont = 0; i_cont < Direcciones.Length; i_cont++)
            {
                stIPAddress = stIPAddress + Direcciones[i_cont].ToString();
            }

            stIPAddress = Request.UserHostAddress;
            string rpta = "";
            string login = usuario + "|" + clave + "|" + stIPAddress;
            daSQL odaSQL = new daSQL("conSISGEFIN");
            string DataUsuario = odaSQL.EjecutarComando("uspSegUsuarioValidarLoginCsv", "@Login", login);
            if (String.IsNullOrEmpty(DataUsuario)) rpta = "Usuario y/o Contaseña es invalido";
            else
            {
                Session["DataUsuario"] = DataUsuario;
                string[] Data = Session["DataUsuario"].ToString().Split('|');
                string IdEstado = Data[0];

                if (IdEstado == "1")
                {
                    rpta = "Usuario registrado pendiente de confirmación de correo";
                }
                if (IdEstado == "2")
                {
                    string token = Guid.NewGuid().ToString();
                    rpta += DataUsuario.ToString() + "¯";
                    rpta += token;
                }
            }

            return rpta;
        }

        public ActionResult LogOff()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdAcceso = Data[5];

            string rpta = "";
            daSQL odaSQL = new daSQL("conSISGEFIN");
            rpta = odaSQL.EjecutarComando("uspSegUsuarioSalirLoginCsv", "@Data", IdAcceso);

            FormsAuthentication.SignOut();
            Session.Abandon();
            Session.Clear();
            Session.RemoveAll();
            return RedirectToAction("Login", "Security");
        }

        [FiltroAutenticacion]
        public ActionResult UserPerfil()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult AccesoSistema()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Seguridad()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Menu()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Usuario()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Permisos()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            return View();
        }
    }
}