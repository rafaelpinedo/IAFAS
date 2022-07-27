using System;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using ZXing;
using ZXing.QrCode;
using ZXing.Rendering;
using ZXing.QrCode.Internal;

namespace General.Librerias.CodigoUsuario
{
    public class CodigoQR
    {
        public static Bitmap CrearBitmap(string codigo, int ancho, int alto)
        {
            Bitmap bmp = null;
            BarcodeWriter bcw = new BarcodeWriter();
            bcw.Format = BarcodeFormat.QR_CODE;
            QrCodeEncodingOptions opciones = new QrCodeEncodingOptions();
            opciones.Height = alto;
            opciones.Width = ancho;
            opciones.Margin = 1;
            bcw.Options = opciones;
            bmp = bcw.Write(codigo);
            return bmp;
        }

        public static byte[] CrearBytes(string codigo, int ancho, int alto)
        {
            byte[] buffer = null;
            BarcodeWriter bcw = new BarcodeWriter();
            bcw.Format = BarcodeFormat.QR_CODE;
            QrCodeEncodingOptions opciones = new QrCodeEncodingOptions();
            opciones.Height = alto;
            opciones.Width = ancho;
            opciones.Margin = 1;
            bcw.Options = opciones;
            Bitmap bmp = bcw.Write(codigo);
            using (MemoryStream ms = new MemoryStream())
            {
                bmp.Save(ms, ImageFormat.Jpeg);
                buffer = ms.ToArray();
            }
            return buffer;
        }

        public static string CrearBase64(string codigo, int ancho, int alto)
        {
            string rpta = "";
            BarcodeWriter bcw = new BarcodeWriter();
            bcw.Format = BarcodeFormat.QR_CODE;
            QrCodeEncodingOptions opciones = new QrCodeEncodingOptions();
            opciones.Height = alto;
            opciones.Width = ancho;
            opciones.Margin = 1;
            bcw.Options = opciones;
            Bitmap bmp = bcw.Write(codigo);
            byte[] buffer = null;
            using (MemoryStream ms = new MemoryStream())
            {
                bmp.Save(ms, ImageFormat.Jpeg);
                buffer = ms.ToArray();
            }
            rpta = Convert.ToBase64String(buffer);
            return rpta;
        }

        public static Bitmap CrearBitmapTexto(string codigo, int width, int height, string texto="")
        {
            var bw = new ZXing.BarcodeWriter();
            var encOptions = new ZXing.Common.EncodingOptions
            {
                Width = width,
                Height = height,
                Margin = 0,
                PureBarcode = false
            };
            encOptions.Hints.Add(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            bw.Renderer = new BitmapRenderer();
            bw.Options = encOptions;
            bw.Format = ZXing.BarcodeFormat.QR_CODE;
            Bitmap bm = bw.Write(texto);
            Bitmap overlay = CrearBitmap(codigo, width, height);
            int deltaHeigth = bm.Height - overlay.Height;
            int deltaWidth = bm.Width - overlay.Width;
            Graphics g = Graphics.FromImage(bm);
            g.DrawImage(overlay, new Point(deltaWidth / 2, deltaHeigth / 2));
            return bm;
        }
    }
}
