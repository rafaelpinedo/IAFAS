using System;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace General.Librerias.CodigoUsuario
{
    public class Captcha
    {
        static string obtenerNumeroAzar()
        {
            Random oAzar = new Random();
            int n = oAzar.Next(10);
            if (n == 0) { n = 1; }
            System.Threading.Thread.Sleep(20);
            return n.ToString();
        }

        static string obtenerCaracterAzar()
        {
            Random oAzar = new Random();
            int n = 65 + oAzar.Next(26);
            System.Threading.Thread.Sleep(20);
            return ((char)n).ToString();
        }

        public static Dictionary<string, byte[]> Crear()
        {
            Dictionary<string, byte[]> rpta = new Dictionary<string, byte[]>();
            Random oAzar = new Random();
            StringBuilder sb = new StringBuilder();
            Bitmap bmp = new Bitmap(200, 80);
            Graphics grafico = Graphics.FromImage(bmp);
            Rectangle rect = new Rectangle(0, 0, 200, 80);
            LinearGradientBrush degradado = new LinearGradientBrush(rect, Color.Aqua, Color.Beige, LinearGradientMode.BackwardDiagonal);
            grafico.FillRectangle(degradado, rect);
            string c;
            int x = 10;
            int y;
            int r, g, b;
            Color color;
            for (int i = 0; i < 5; i++)
            {
                if (oAzar.Next(2).Equals(0)) c = obtenerNumeroAzar();
                else c = obtenerCaracterAzar();
                if (c == "O") { c = "A"; }
                sb.Append(c);
                y = oAzar.Next(30);
                r = oAzar.Next(57);
                g = oAzar.Next(87);
                b = oAzar.Next(235);
                color = Color.FromArgb(r, g, b);
                grafico.DrawString(c, new Font("Courier New", 40), new SolidBrush(color), x, y);
                x += 35;
            }
            //grafico.DrawString(sb.ToString(), new Font("Arial", 40), Brushes.White, 10, 5);
            byte[] buffer;
            using (MemoryStream ms = new MemoryStream())
            {
                bmp.Save(ms, ImageFormat.Png);
                buffer = ms.ToArray();
            }
            rpta.Add(sb.ToString(), buffer);
            return rpta;
        }
    }
}
