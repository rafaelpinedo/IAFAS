﻿using WebAppSISGEFIN.Models;
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
    public class ContabilidadController : Controller
    {
        [FiltroAutenticacion]
        public ActionResult PlanContable()
        {
            string[] Data = Session["DataUsuario"].ToString().Split('|');
            string IdPerfil = Data[3];
            ViewBag.Menu = new Menu().Listar(IdPerfil);
            int Anio = DateTime.Now.Year;
            ViewBag.Anio = Anio;
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult FamiliaCuenta()
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