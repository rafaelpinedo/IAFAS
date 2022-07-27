using OfficeOpenXml;
using OfficeOpenXml.Style;
using OfficeOpenXml.Table;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace General.Librerias.CodigoUsuario
{
    public class Epplus
    {
        public static byte[] Excel(DataTable tabla, string nombreHoja, string Titulo,string usuario,string nombreSistema)
        {
            try
            {
                int nRegistros = tabla.Rows.Count+6;
                int nColumns = tabla.Columns.Count;

                var memoryStream = new MemoryStream();
                using (var package = new ExcelPackage(memoryStream))
                {
                    var worksheet = package.Workbook.Worksheets.Add(nombreHoja);
                    worksheet.Cells["A1"].Value = nombreSistema;
                    worksheet.Cells["A2"].Value = usuario;
                    worksheet.Cells[1, nColumns].Value = "Fecha: " + DateTime.Now.ToShortDateString();
                    worksheet.Cells[2, nColumns].Value = "Hora: " + DateTime.Now.ToShortTimeString();

                    worksheet.Cells["A4"].Value = Titulo;
                    using (ExcelRange r = worksheet.Cells[4, 1, 4, nColumns])
                    {
                        r.Merge = true;
                        r.Style.Font.SetFromFont(new Font("Arial", 14, FontStyle.Underline));
                        r.Style.Font.Color.SetColor(Color.Black);
                        r.Style.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                        r.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        r.Style.Fill.BackgroundColor.SetColor(Color.White);
                        r.Style.Font.Bold = true;
                    }

                    worksheet.Cells[6, 1].LoadFromDataTable(tabla, true, TableStyles.None);
                    worksheet.Cells.AutoFitColumns(0);

                    using (var range = worksheet.Cells[6, 1, nRegistros, nColumns])
                    {
                        range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        range.Style.Fill.BackgroundColor.SetColor(Color.White);
                        range.Style.Font.Color.SetColor(Color.Black);
                        range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        range.Style.Font.SetFromFont(new Font("Arial", 10, FontStyle.Regular));
                    }
                    using (ExcelRange filaCabecera = worksheet.Cells[6, 1, 6, nColumns])
                    {
                        filaCabecera.Style.Font.SetFromFont(new Font("Arial", 12, FontStyle.Regular));
                        filaCabecera.Style.Font.Color.SetColor(Color.Black);
                        filaCabecera.Style.Font.Bold = true;
                        filaCabecera.Style.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                    }
                    Byte[] fileBytes = package.GetAsByteArray();
                    return fileBytes;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw ex;
            }
        }
    }
}
