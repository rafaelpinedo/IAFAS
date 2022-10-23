using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using WebAppSISGEFIN.Models;

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
                string _SpName = Request["SpName"];
                string _Params = Request["Params"];
                xResponse<dynamic> _rptData = Runs.GetDataForRPT(_SpName, _Params, _Type);
                if (_rptData.IsOk == true)
                {
                    string _FileNm = Request["FileNm"];
                    ReportDocument _Report = Runs.OpenDocumRPT(_FileNm);
                    _Report.Database.Tables[0].SetDataSource(_rptData.Content);
                    CrystalReportViewer1.ReportSource = _Report;
                    CrystalReportViewer1.RefreshReport();
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