using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace General.Librerias.CodigoUsuario
{
    public class Cadena
    {
        public static DataTable ConvertirDataTable(string data, string extension, char separadorCampo = '|', char separadorRegistro = '¬')
        {
            DataTable dt = new DataTable();
            string[] registros = data.Split(separadorRegistro);
            string[] cabeceras = registros[0].Split(separadorCampo);
            string[] anchos = registros[1].Split(separadorCampo);
            string[] tipos = registros[2].Split(separadorCampo);
            int nRegistros = registros.Length;
            string[] campos;
            DataRow fila;
            int nColumns = cabeceras.Length;

            Type tipo;
            for (int j = 0; j < nColumns; j++)
            {
                if (tipos[j] == "DateTime")
                {
                    tipo = Type.GetType("System.String");
                }
                else {
                    tipo = Type.GetType("System." + tipos[j]);
                }
                dt.Columns.Add(cabeceras[j], tipo);
                if (extension == ".pdf") {
                    dt.Columns[j].Caption = anchos[j];
                }
            }

            for (int i = 3; i < nRegistros; i++)
            {
                campos = registros[i].Split(separadorCampo);
                fila = dt.NewRow();
                for (int j = 0; j < nColumns; j++)
                {
                    fila[j] = campos[j];
                }
                dt.Rows.Add(fila);
            }

            return dt;
        }

        public static DataTable ConvertirTabla(string data, char separadorCampo = '|', char separadorRegistro = '¬')
        {

            DataTable tabla = new DataTable();
            string[] registros = data.Split(separadorRegistro);
            string[] cabeceras = registros[0].Split(separadorCampo);
            string[] anchos = registros[1].Split(separadorCampo);
            string[] tipos = registros[2].Split(separadorCampo);
            int nColumns = cabeceras.Length;
            for (int j = 0; j < nColumns; j++)
            {
                tabla.Columns.Add(cabeceras[j], Type.GetType("System." + tipos[j]));
                tabla.Columns[j].Caption = anchos[j];
            }
            int nRegistros = registros.Length;
            string[] campos;
            DataRow fila;
            Type tipo;
            for (int i = 3; i < nRegistros; i++)
            {
                campos = registros[i].Split(separadorCampo);
                fila = tabla.NewRow();
                for (int j = 0; j < nColumns; j++)
                {
                    tipo = Type.GetType("System." + tipos[j]);
                    fila[j] = Convert.ChangeType(campos[j], tipo);
                }
                tabla.Rows.Add(fila);
            }

            return tabla;
        }
    }
}
