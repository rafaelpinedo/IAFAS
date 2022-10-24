using General.Librerias.AccesoDatos;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebAppSISGEFIN.Models;

namespace WebAppSISGEFIN.Controllers
{
    public class ReportesController : Controller
    {

        [HttpGet]
        public string GetOficinas()
        {
            string _data = "M_OFICINA|OFI_SECUENCIA|OFI_ABREVIATURA|OFI_NOMBRE Like 'OFICINA%'";
            var _trama = Runs.GetTrama4Combo(_data);
            return _trama;
        }

        [HttpGet]
        public string GetUbicaciones()
        {
            string _data = "PATRI_UBICACION_FISICA|UBIFIS_SECUENCIA|UBIFIS_NOMBRE|";
            var _trama = Runs.GetTrama4Combo(_data);
            return _trama;
        }

        [HttpGet]
        public ActionResult ShowRpt(string area, string name, string type, string par, string r)
        {
            string _binDir = ConfigurationManager.AppSettings.Get("BinDir");
            string _dirRpt = string.Format("{0}\\{1}", _binDir, "filesRpt");
            ViewBag.FileNm = $"{_dirRpt}\\{area}{name}.rpt";
            ViewBag.SpName = $"usp{area}{name}ReporteCsv";
            ViewBag.Option = r;
            string _vName = "";
            if (par != null)
            {
                ViewBag.TypeNm = type;
                ViewBag.Params = par;
                _vName = "_PuenteRpt";
            }
            else
            {
                ViewBag.TypeNm = type;
                _vName = name;
            }
            return View(_vName);
        }

        public ActionResult MsgRpt(string msg, byte e)
        {
            rMensaje _mensj = new rMensaje();
            switch (e)
            {
                case 1:
                    _mensj.Type = "Informe";
                    _mensj.Image = "../../Images/rpt_info.png";
                    break;

                case 2:
                    _mensj.Type = "Alerta";
                    _mensj.Image = "../../Images/rpt_alert.png";
                    break;

                default:
                    _mensj.Type = "Error";
                    _mensj.Image = "../../Images/rpt_error.png";
                    break;
            }
            _mensj.Message = msg;
            return View("MsgRpt", _mensj);
        }

    }

}