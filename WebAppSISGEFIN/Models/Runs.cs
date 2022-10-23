using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using General.Librerias.AccesoDatos;
using iText.Layout.Element;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data.OleDb;
using System.Linq;
using System.Runtime.Remoting;
using System.Runtime.Remoting.Contexts;
using System.Security.Policy;
using System.Web;
using System.Web.Hosting;

namespace WebAppSISGEFIN.Models
{
    public static class Runs
    {

        public static ReportDocument OpenDocumRPT(string fileRpt)
        {
            ReportDocument _ReportDocument = new ReportDocument();
            _ReportDocument.Load(fileRpt, OpenReportMethod.OpenReportByTempCopy);
            return _ReportDocument;
        }


        public static string GetTrama4Combo(string param)
        {
            daSQL _odaSQL = new daSQL("conSISGEFIN");
            string _trama = _odaSQL.EjecutarComando("usp_GetDataForCombo", "@param", param);
            return _trama;
        }

        public static List<T> GetRows4Combo<T>(string param)
        {
            daSQL _odaSQL = new daSQL("conSISGEFIN");
            string _trama = _odaSQL.EjecutarComando("usp_GetDataForCombo", "@param", param);
            var _rows = Runs.GetTramaToList<T>(_trama);
            return _rows;
        }


        public static List<T> GetTramaToList<T>(string trama)
        {
            var _items = new List<T>();
            string[] _rows = trama.Split('¬');
            for (int f = 0; f < _rows.Length; f++)
            {
                var _itm = Activator.CreateInstance<T>();
                var _row = _rows[f];
                string[] _cols = _row.Split('|'); int c = -1;
                dynamic _properties = _itm.GetType().GetProperties();
                foreach (var _prp in _properties)
                {
                    c = c + 1;
                    dynamic _valor = _cols[c];
                    _prp.SetValue(_itm, Convert.ChangeType(_valor, _prp.PropertyType), null);
                }
                _items.Add(_itm);
            }
            return _items;
        }

        public static dynamic GetTramaToList(string trama, Type t)
        {
            var _listType = typeof(List<>);
            var _constrc = _listType.MakeGenericType(t);
            var _items = (IList)Activator.CreateInstance(_constrc);
            string[] _rows = trama.Split('¬');
            for (int f = 0; f < _rows.Length; f++)
            {
                var _itm = Activator.CreateInstance(t);
                var _row = _rows[f];
                string[] _cols = _row.Split('|'); int c = -1;
                dynamic _properties = _itm.GetType().GetProperties();
                foreach (var _prp in _properties)
                {
                    c = c + 1;
                    dynamic _valor = _cols[c];
                    _prp.SetValue(_itm, Convert.ChangeType(_valor, _prp.PropertyType), null);
                }
                _items.Add(_itm);
            }
            return _items;
        }

        public static xResponse<dynamic> GetDataForRPT(string spName, string param, Type t)
        {
            var _response = new xResponse<dynamic>();
            try
            {
                daSQL _odaSQL = new daSQL("conSISGEFIN");
                string _trama = _odaSQL.EjecutarComando(spName, "@param", param);
                if (_trama != "")
                {
                    var _items = GetTramaToList(_trama, t);
                    _response.Message = $"Se hallaron {_items.Count} registros.";
                    _response.Content = _items;
                    _response.IsOk = true;
                    _response.Code = 1; //Ok
                }
                else
                {
                    _response.Message = "No se hallaron registros con los criterios especificados.";
                    _response.Content = null;
                    _response.IsOk = false;
                    _response.Code = 2; //Alert
                }
            }
            catch (Exception ex)
            {
                _response.Message = ex.Message;
                _response.Content = null;
                _response.IsOk = false;
                _response.Code = 3; //Error
            }
            return _response;
        }

    }

}