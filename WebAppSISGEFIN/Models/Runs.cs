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

        private static dynamic GetValue(ParameterValueKind pType, dynamic pValue)
        {
            dynamic _rpta = null;
            switch (pType)
            {
                case ParameterValueKind.BooleanParameter:
                    _rpta = Convert.ToBoolean(pValue);
                    break;

                case ParameterValueKind.CurrencyParameter:
                    _rpta = Convert.ToDouble(pValue);
                    break;

                case ParameterValueKind.DateParameter:
                    DateTime _fecha = Convert.ToDateTime(pValue);
                    _rpta = _fecha.ToString("dd/MM/yyyy");
                    break;

                case ParameterValueKind.DateTimeParameter:
                    _rpta = Convert.ToDateTime(pValue);
                    break;

                case ParameterValueKind.NumberParameter:
                    _rpta = Convert.ToInt32(pValue);
                    break;

                case ParameterValueKind.TimeParameter:
                    DateTime _hora = Convert.ToDateTime(pValue);
                    _rpta = _hora.ToString("HH:mm:ss");
                    break;

                case ParameterValueKind.StringParameter:
                    _rpta = Convert.ToString(pValue);
                    break;

            }
            return _rpta;
        }

        public static ReportDocument OpenDocumRPT(string fileRpt)
        {
            ReportDocument _ReportDocument = new ReportDocument();
            _ReportDocument.Load(fileRpt, OpenReportMethod.OpenReportByTempCopy);
            return _ReportDocument;
        }

        public static dynamic GetDataForRPT(string spName, string param, Type t)
        {
            daSQL _odaSQL = new daSQL("conSISGEFIN");
            string _trama = _odaSQL.EjecutarComando(spName, "@param", param);
            string[] _rows = _trama.Split('¬');

            var listType = typeof(List<>);
            var constructedType = listType.MakeGenericType(t);
            var _items = (IList)Activator.CreateInstance(constructedType);

            if (_rows != null)
            {

                for (int f = 0; f < _rows.Length; f++)
                {
                    var _itm = Activator.CreateInstance(t);

                    var _row = _rows[f];

                    string[] _cols = _row.Split('|');

                    int c = -1;
                    dynamic _properties = _itm.GetType().GetProperties();
                    foreach (var _prp in _properties)
                    {
                        c = c + 1;
                        dynamic _valor = _cols[c];
                        _prp.SetValue(_itm, Convert.ChangeType(_valor, _prp.PropertyType), null);
                    }

                    _items.Add(_itm);
                }
            }

            return _items;
        }


        //public static ReportDocument GetReportDocRPT(string reportName, string parameters)
        //{
        //    string _conxString = ConfigurationManager.AppSettings["ConexionACC"].ToString();
        //    var _baseParams = parameters.Split('^');

        //    var _parameters = new Dictionary<string, object>();

        //    foreach (var _base in _baseParams)
        //    {
        //        var _value = _base.Split('~');
        //        _parameters.Add(_value[0], _value[1]);
        //    }

        //    string _director = ConfigurationManager.AppSettings["DirFilesRPT"].ToString();
        //    string _fileName = _director + "\\" + reportName + ".rpt";

        //    ReportDocument _ReportDocument = new ReportDocument();
        //    _ReportDocument.Load(_fileName, OpenReportMethod.OpenReportByTempCopy);

        //    OleDbConnectionStringBuilder _connectionDB = new OleDbConnectionStringBuilder(_conxString);
        //    ConnectionInfo _connectInfo = new ConnectionInfo();
        //    _connectInfo.ServerName = _connectionDB.DataSource;
        //    _connectInfo.DatabaseName = string.Empty;
        //    _connectInfo.UserID = "Admin";
        //    _connectInfo.Password = string.Empty;

        //    foreach (Table _table in _ReportDocument.Database.Tables)
        //    {
        //        var _logonInfo = _table.LogOnInfo;
        //        _logonInfo.ConnectionInfo = _connectInfo;
        //        _table.ApplyLogOnInfo(_logonInfo);
        //    }

        //    foreach (var _paramQ in _parameters)
        //    {
        //        var _paramR = _ReportDocument.DataDefinition.ParameterFields[_paramQ.Key];
        //        _paramR.DefaultValues.Clear();
        //        _paramR.CurrentValues.Clear();
        //        if (_paramR.EnableAllowMultipleValue == true)
        //        {
        //            var _arrVals = ((string)_paramQ.Value).Split(',');
        //            foreach (var _arrVal in _arrVals)
        //            {
        //                var _valorX = GetValue(_paramR.ParameterValueKind, _arrVal);
        //                _paramR.CurrentValues.AddValue(_valorX);
        //            }
        //        }
        //        else
        //        {
        //            var _valorX = GetValue(_paramR.ParameterValueKind, _paramQ.Value);
        //            _paramR.CurrentValues.AddValue(_valorX);
        //        }
        //        _paramR.ApplyCurrentValues(_paramR.CurrentValues);
        //    }

        //    return _ReportDocument;

        //}


    }
}