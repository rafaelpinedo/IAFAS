using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using General.Librerias.EntidadesNegocio;
using General.Librerias.CodigoUsuario;

namespace General.Librerias.AccesoDatos
{
    public class daSQL
    {
        string cadenaConexion;

        public daSQL(string _cadenaConexion)
        {
            //cadenaConexion = ConfigurationManager.ConnectionStrings[_cadenaConexion].ConnectionString;
            cadenaConexion = "user=%USER_IAFAS%;pwd=%PASS_IAFAS%;server=%SERV_IAFAS%;database=%DABA_IAFAS%";
            cadenaConexion = Environment.ExpandEnvironmentVariables(cadenaConexion);
        }

        public string EjecutarComando(string NombreSP, string ParNombre = "", string ParValor = "")
        {
            string rpta = "";
            string archivoLog = ConfigurationManager.AppSettings["ArchivoLog"];
            using (SqlConnection con = new SqlConnection(cadenaConexion))
            {
                try
                {
                    con.Open();
                    SqlCommand cmd = new SqlCommand(NombreSP, con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    if (!String.IsNullOrEmpty(ParNombre))
                    {
                        cmd.Parameters.AddWithValue(ParNombre, ParValor);
                    }
                    object data = cmd.ExecuteScalar();
                    if (data != null) rpta = data.ToString();

                }
                catch (Exception ex)
                {
                    beLog obeLog = new beLog();
                    obeLog.MensajeError = ex.Message;
                    obeLog.DetalleError = ex.StackTrace;
                   // Log.Grabar(obeLog, archivoLog);
                }
            }
            return rpta;
        }
       public string EjecutarCopiaMasivaString(string nombreTabla, string data, char separadorRegistro = '¬', char separadorCampo = '|')
        {
            string rpta = "";
            //Crear un DataTable con la data
            DataTable tabla = new DataTable();
            string[] lista = data.Split(separadorRegistro);
            int nRegistros = lista.Length;
            string[] campos = lista[0].Split(separadorCampo);
            string[] tipos = lista[2].Split(separadorCampo);
            int nCampos = campos.Length;
            string campo;
            for (int j = 0; j < nCampos; j++)
            {
                campo = campos[j];
                tabla.Columns.Add(campo, Type.GetType(String.Format("System.{0}", tipos[j])));
            }
            DataRow fila;
            for (int i = 3; i < nRegistros; i++)
            {
                if (!String.IsNullOrEmpty(lista[i]))
                {
                    campos = lista[i].Split(separadorCampo);
                    fila = tabla.NewRow();
                    fila.BeginEdit();
                    for (int j = 0; j < nCampos; j++)
                    {
                        fila[j] = campos[j];
                    }
                    fila.EndEdit();
                    tabla.Rows.Add(fila);
                }
            }
            using (SqlConnection con = new SqlConnection(cadenaConexion))
            {
                try
                {
                    con.Open();
                    using (SqlBulkCopy sbc = new SqlBulkCopy(con))
                    {
                        sbc.DestinationTableName = nombreTabla;
                        sbc.WriteToServer(tabla);
                        rpta = "OK";
                    }
                }
                catch (Exception ex)
                {
                    rpta = "Error: " + ex.Message;
                    //Grabar Log
                }
            }
            return rpta;
        }

        public string EjecutarCopiaMasivaTabla(string nombreTabla, DataTable tabla)
        {
            string rpta = "";
            using (SqlConnection con = new SqlConnection(cadenaConexion))
            {
                try
                {
                    con.Open();
                    using (SqlBulkCopy sbc = new SqlBulkCopy(con))
                    {
                        sbc.DestinationTableName = nombreTabla;
                        sbc.WriteToServer(tabla);
                        rpta = "OK";
                    }
                }
                catch (Exception ex)
                {
                    rpta = "Error: " + ex.Message;
                    //Grabar Log
                }
            }
            return rpta;
        }
    }
}
