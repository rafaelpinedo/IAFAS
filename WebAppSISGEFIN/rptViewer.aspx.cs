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
           try
           {
                string _FileNm = Request["FileNm"];

                string _SpName = Request["SpName"];

                string _Params = Request["Params"];

                string _TypeNm = $"WebAppSISGEFIN.Models.{Request["TypeNm"]}";

                ReportDocument _Report = Runs.OpenDocumRPT(_FileNm);

                Type _Type = Type.GetType(_TypeNm);

                var _Datos = Runs.GetDataForRPT(_SpName, _Params, _Type);

                _Report.Database.Tables[0].SetDataSource(_Datos);

                //_Report.ReadRecords();

                CrystalReportViewer1.ReportSource = _Report;

            }
            catch(Exception ex) 
            {
                Response.Write(ex.Message);
            }

            CrystalReportViewer1.RefreshReport();

        }

    }
}