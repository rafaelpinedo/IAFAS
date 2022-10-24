using System;
using System.IO;
using System.Net.Mime;
using WebAppSISGEFIN.Models;
using CrystalDecisions.Shared;
using CrystalDecisions.CrystalReports.Engine;

namespace WebAppSISGEFIN
{
    public partial class rptViewer : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string _UrlResp = "";
            try
            {
                string _TypeNm = $"WebAppSISGEFIN.Models.{Request["TypeNm"]}";
                Type _Type = Type.GetType(_TypeNm);
                string _FileNm = Request["FileNm"];
                string _SpName = Request["SpName"];
                string _Params = Request["Params"];
                string _Option = Request["r"];

                xResponse<dynamic> _rptData = Runs.GetDataForRPT(_SpName, _Params, _Type);

                if (_rptData.IsOk == true)
                {
                    ReportDocument _Report = Runs.OpenDocumRPT(_FileNm);
                    _Report.Database.Tables[0].SetDataSource(_rptData.Content);
                    _Report.ReadRecords();
                    if (_Option == "1")
                    {
                        CrystalReportViewer1.ReportSource = _Report;
                        CrystalReportViewer1.RefreshReport();
                    }
                    else
                    {
                        string _type = "pdf";
                        string _fileName = (new FileInfo(_FileNm)).Name.ToLower().Replace("rpt", _type);
                        string _guidName = "~/Reportes/" + Guid.NewGuid() + "." + _type;
                        string _fullName = Server.MapPath(_guidName);
                        _Report.ExportToDisk(ExportFormatType.PortableDocFormat, _fullName);
                        if (File.Exists(_fullName) == true)
                        {
                            _UrlResp = _guidName;
                        }
                        else
                        {
                            throw new Exception("No se halló el archivo PDF.");
                        }
                    }
                }
                else
                {
                   if (_rptData.Code == 2)
                   {
                        _UrlResp = $"~/Reportes/MsgRpt/?msg={_rptData.Message}&e=2";
                    }
                   else
                   {
                        throw new Exception(_rptData.Message);
                   }
                }
            }
            catch (Exception ex)
            {
                _UrlResp = $"~/Reportes/MsgRpt/?msg={ex.Message}&e=3";
            }
            finally
            {
                if (_UrlResp != "")
                {
                    Response.Redirect(_UrlResp);
                }
            }

        }

    }

}