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

        //public JsonResult GetOficinas()
        //{
        //    string _data = "M_OFICINA|OFI_SECUENCIA|OFI_ABREVIATURA|OFI_NOMBRE Like 'OFICINA%'";
        //    var _rows = Runs.GetRows4Combo<rElemCbo>(_data);
        //    return Json(_rows, JsonRequestBehavior.AllowGet);
        //}

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

        public ActionResult ShowRpt(string area, string grp, string act, string par, string t)
        {
            string _binDir = ConfigurationManager.AppSettings.Get("BinDir");
            string _dirRpt = string.Format("{0}\\{1}", _binDir, "filesRpt");
            ViewBag.FileNm = $"{_dirRpt}\\{area}_{grp}_{act}.rpt";
            ViewBag.SpName = $"usp_{area}_{grp}_{act}";
            string _vName = "";
            if (t != null)
            {
                ViewBag.TypeNm = t;
                ViewBag.Params = par;
                _vName = "PuenteRpt";
            }
            else
            {
                ViewBag.TypeNm = par; 
                _vName = par;
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