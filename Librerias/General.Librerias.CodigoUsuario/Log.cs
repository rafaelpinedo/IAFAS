using System;
using System.IO;
using System.Reflection;
using System.Collections.Generic;

namespace General.Librerias.CodigoUsuario
{
    public class Log
    {
        public static void Grabar<T>(T obj, string archivo)
        {
            PropertyInfo[] propiedades = obj.GetType().GetProperties();
            using (StreamWriter sw = new StreamWriter(archivo, true))
            {
                try
                {
                    foreach (PropertyInfo propiedad in propiedades)
                    {
                        sw.WriteLine("{0} = {1}", propiedad.Name, propiedad.GetValue(obj, null));
                    }
                    sw.WriteLine(new String('_', 50)); 
                }
                catch (Exception ex)
                {
                    //Guardar el Error
                }
            }
        }
    }
}
