using System;
using System.IO;
using System.Data;
using System.Collections.Generic;
using iText.IO.Font.Constants;
using iText.IO.Image;
using iText.Kernel.Colors;
using iText.Kernel.Events;
using iText.Kernel.Font;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas;
using iText.Layout;
using iText.Layout.Borders;
using iText.Layout.Element;
using iText.Layout.Properties;
using System.Web.Mvc;

namespace General.Librerias.CodigoUsuario
{
    public class PDF
    {
        private static Table serializarTablaPDF(Document oDocumento, DataTable tabla, string titulo, bool flagUltimaCol = false)
        {
            int nCols = tabla.Columns.Count;
            int nFilas = tabla.Rows.Count;
            string campo;
            string ancho;
            List<int> anchos = new List<int>();
            Table tablaPdf = new Table(nCols).UseAllAvailableWidth();

            string Titulo = titulo;
            PdfFont fuente = PdfFontFactory.CreateFont(StandardFonts.TIMES_ROMAN);

            Style styleTitulo = new Style()
                .SetTextAlignment(TextAlignment.CENTER)
                .SetBorder(Border.NO_BORDER)
                .SetBold()
                .SetFont(fuente);

            Style styleCellCabecera = new Style()
                .SetBackgroundColor(ColorConstants.LIGHT_GRAY)
                .SetTextAlignment(TextAlignment.CENTER)
                .SetFontSize(7)
                .SetFont(fuente)
                .SetBold();
            Style styleCellDetalle = new Style()
                .SetBackgroundColor(ColorConstants.WHITE)
                .SetFontSize(6)
                .SetFont(fuente);

            Cell _cell = new Cell(1, nCols).Add(new Paragraph(Titulo));
            tablaPdf.AddHeaderCell(_cell.AddStyle(styleTitulo));

            if (nCols > 0 && nFilas > 0)
            {

                //Genera la cabecera de la tabla
                for (int j = 0; j < nCols; j++)
                {
                    campo = tabla.Columns[j].ColumnName;
                    ancho = tabla.Columns[j].Caption;
                    anchos.Add(int.Parse(ancho));
                    _cell = new Cell(j, 1).Add(new Paragraph(campo.ToUpper()));
                    tablaPdf.AddHeaderCell(_cell.AddStyle(styleCellCabecera));
                }

                //Genera el detalle de la tabla
                for (int i = 0; i < nFilas; i++)
                {
                    for (int j = 0; j < nCols; j++)
                    {
                        if (tabla.Rows[i][j].ToString() == "0" || tabla.Rows[i][j].ToString() == "01/01/1900")
                        {
                            _cell = new Cell().Add(new Paragraph(""));
                        }
                        else
                        {
                            _cell = new Cell().Add(new Paragraph(tabla.Rows[i][j].ToString()));
                        }
                        if (flagUltimaCol && tabla.Rows[i][nCols].Equals("1"))
                        {
                            _cell = new Cell().Add(new Paragraph(tabla.Rows[i][j].ToString()));
                            _cell.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                        }
                        tablaPdf.AddCell(_cell.AddStyle(styleCellDetalle));
                    }
                }
            }
            return tablaPdf;
        }

        public static byte[] Crear(DataSet dst, string Titulo = "", string usuario = "", string logo = "", string orienta = "", string imagenBase64 = "", int imagenAncho = 0, int imagenAlto = 0)
        {
            byte[] buffer = null;
            using (MemoryStream ms = new MemoryStream())
            {
                PdfWriter pw = new PdfWriter(ms);
                PdfDocument pdfDocument = new PdfDocument(pw);
                Document doc = new Document(pdfDocument);

                if (!String.IsNullOrEmpty(orienta) && orienta == "V")
                {
                    doc = new Document(pdfDocument, PageSize.A4);
                    doc.SetMargins(75, 20, 35, 20);
                }
                else
                {
                    doc = new Document(pdfDocument, PageSize.A4.Rotate());
                    doc.SetMargins(75, 20, 35, 20);
                }
                string pathLogo = System.Web.HttpContext.Current.Server.MapPath("~/Riztie/Images/escudoDisamar.png");

                Image logotipo = new Image(ImageDataFactory.Create(pathLogo));
                pdfDocument.AddEventHandler(PdfDocumentEvent.START_PAGE, new HeaderEventHandler1(logotipo));
                pdfDocument.AddEventHandler(PdfDocumentEvent.END_PAGE, new FooterEventHandler1(usuario));

                int nTablas = dst.Tables.Count;

                for (int i = 0; i < nTablas; i++)
                {
                    doc.Add(serializarTablaPDF(doc, dst.Tables[i], Titulo, dst.Tables[i].Prefix != ""));
                    doc.Add(new Paragraph(" "));
                }
                //if (!String.IsNullOrEmpty(imagenBase64))
                //{
                //    doc.Add(new Paragraph(" "));
                //    byte[] bufferImagen = Convert.FromBase64String(imagenBase64);
                //    using (MemoryStream msImagen = new MemoryStream(bufferImagen))
                //    {
                //        System.Drawing.Image imagen = System.Drawing.Image.FromStream(msImagen);
                //        System.Drawing.Bitmap bmp = new System.Drawing.Bitmap(imagen, new System.Drawing.Size(imagenAncho, imagenAlto));
                //        Image pic = new Image(ImageDataFactory.Create(imagen));
                //        doc.Add(pic);
                //    }
                //}
                doc.Close();

                buffer = ms.ToArray();
            }
            return buffer;
        }

        public class HeaderEventHandler1 : IEventHandler
        {
            Image Img;
            public HeaderEventHandler1(Image img)
            {
                Img = img;
            }
            public void HandleEvent(Event @event)
            {
                PdfDocumentEvent docEvent = (PdfDocumentEvent)@event;
                PdfDocument pdfDoc = docEvent.GetDocument();
                PdfPage page = docEvent.GetPage();

                PdfCanvas canvas1 = new PdfCanvas(page.NewContentStreamBefore(), page.GetResources(), pdfDoc);
                Rectangle rootArea = new Rectangle(35, page.GetPageSize().GetTop() - 75, page.GetPageSize().GetWidth() - 70, 55);
                //new Canvas(canvas1, pdfDoc, rootArea)
                //      .Add(getTable(docEvent));
            }

            public Table getTable(PdfDocumentEvent docEvent)
            {
                float[] cellWith = { 20f, 80f };
                Table tableEvent = new Table(UnitValue.CreatePercentArray(cellWith)).UseAllAvailableWidth();

                Style styleCell = new Style()
                    .SetBorder(Border.NO_BORDER);

                Style styleText = new Style()
                    .SetTextAlignment(TextAlignment.RIGHT).SetFontSize(10f)
                    .SetBold()
                    .SetFontSize(6);

                Cell cell = new Cell().Add(Img.SetAutoScale(true));

                tableEvent.AddCell(cell
                    .AddStyle(styleCell)
                    .SetTextAlignment(TextAlignment.LEFT));

                cell = new Cell()
                    .Add(new Paragraph("SISGEFIN\n"))
                    .Add(new Paragraph("Fecha : " + DateTime.Now.ToShortDateString() + "\n"))
                    .Add(new Paragraph("Hora : " + DateTime.Now.ToShortTimeString()))
                    .AddStyle(styleText).AddStyle(styleCell);

                tableEvent.AddCell(cell);

                return tableEvent;
            }
        }

        public class FooterEventHandler1 : IEventHandler
        {
            string Usuario;
            public FooterEventHandler1(string usuario)
            {
                Usuario = "Usuario: " + usuario;
            }
              
            public void HandleEvent(Event @event)
            {
                PdfDocumentEvent docEvent = (PdfDocumentEvent)@event;
                PdfDocument pdfDoc = docEvent.GetDocument();
                PdfPage page = docEvent.GetPage();
                PdfCanvas canvas = new PdfCanvas(page.NewContentStreamBefore(), page.GetResources(), pdfDoc);

                //Rectangle rootArea = new Rectangle(36, 20, page.GetPageSize().GetWidth() - 70, 20);
                //new Canvas(canvas, pdfDoc, rootArea)
                //    .Add(getTable(docEvent));
            }

            public Table getTable(PdfDocumentEvent docEvent)
            {
                float[] cellWith = { 92f, 8f };
                Table tableEvent = new Table(UnitValue.CreatePercentArray(cellWith)).UseAllAvailableWidth();

                PdfPage page = docEvent.GetPage();
                int pageNum = docEvent.GetDocument().GetPageNumber(page);

                //int paginasNum = docEvent.GetDocument().GetNumberOfPages();

                Style styleCell = new Style()
                    .SetFontSize(6)
                    .SetPadding(3)
                    .SetBorder(Border.NO_BORDER)
                    .SetBorderTop(new SolidBorder(ColorConstants.BLACK, 2));

                Cell cell = new Cell().Add(new Paragraph(Usuario));

                tableEvent.AddCell(cell
                    .AddStyle(styleCell)
                    .SetTextAlignment(TextAlignment.LEFT)
                    .SetBold());

                cell = new Cell().Add(new Paragraph(pageNum.ToString()));
                cell.AddStyle(styleCell)
                    .SetBackgroundColor(ColorConstants.BLACK)
                    .SetFontColor(ColorConstants.WHITE)
                    .SetTextAlignment(TextAlignment.CENTER);
                tableEvent.AddCell(cell);
                return tableEvent;
            }
        }
    }
}