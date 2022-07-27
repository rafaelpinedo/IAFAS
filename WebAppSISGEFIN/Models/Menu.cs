using System;
using General.Librerias.AccesoDatos;

namespace WebAppSISGEFIN.Models
{
    public class Menu
    {
        private string[] lista;

        public string Listar(string IdPerfil)
        {
            string contenido = "";
            daSQL odaSQL = new daSQL("conSISGEFIN");
                 string rpta = odaSQL.EjecutarComando("uspSegMenuListarPorIdApCsv", "@data", IdPerfil);
            if (!String.IsNullOrEmpty(rpta))
            {
                contenido = "<ul class='pcoded-item pcoded-left-item'>";
                lista = rpta.Split('¬');
                int nRegistros = lista.Length;
                string[] campos;
                //contenido += "<li class='active'>";
                //contenido += "<a href='javascript:navegar(\"Admon/Inicio\");' class='waves-effect waves-dark'>";
                //contenido += "<span class='pcoded-micon'><i class='fa fa-home' aria-hidden='true'></i><b>D</b></span>";
                //contenido += "<span class='pcoded-mtext'>Dashboard</span>";
                //contenido += "<span class='pcoded-mcaret'></span>";
                //contenido += "</a>";
                //contenido += "</li>";
                for (var i = 0; i < nRegistros; i++)
                {
                    campos = lista[i].Split('|');
                    if (campos[3] == "0")
                    {
                        contenido += "<li class='pcoded-hasmenu active ";
                       // if (i == 0) contenido += " pcoded-trigger";
                        contenido += "' id='";
                        contenido += campos[1];
                        contenido += "'>";
                        contenido += "<a href='javascript:void(0)' class='waves-effect waves-dark'>";
                        contenido += "<span class='pcoded-micon'><i class='ti-id-badge'></i><b>A</b></span>";
                        contenido += "<span class='pcoded-mtext'>";
                        contenido += campos[1];
                        contenido += "</span>";
                        contenido += "<span class='pcoded-mcaret'></span>";
                        contenido += "</a>";
                        contenido += crearMenus(campos[0]);
                        contenido += "</li>";
                    }
                }
                contenido += "</ul>";
            }
            return contenido;
        }

        private string crearMenus(string idPadre)
        {
            string contenido = "<ul class='pcoded-submenu'>";
            int nRegistros = lista.Length;
            string[] campos;
            for (var i = 0; i < nRegistros; i++)
            {
                campos = lista[i].Split('|');
                if (campos[3] == idPadre)
                {
                    contenido += "<li id='";
                    contenido += campos[0];
                    contenido += "' class='pcoded-hasmenu'>";
                    contenido += "<a href='javascript:void(0)' class='waves-effect waves-dark'>";
                    contenido += "<span class='pcoded-micon'><i class='ti-angle-right'></i></span>";
                    contenido += "<span class='pcoded-mtext'>";
                    contenido += campos[1];
                    contenido += "</span>";
                    contenido += "<span class='pcoded-mcaret'></span>";
                    contenido += "</a>";
                    contenido += crearSubMenus(campos[0]);
                    contenido += "</li>";
                }
            }
            contenido += "</ul>";
            return contenido;
        }

        private string crearSubMenus(string idPadre)
        {
            string contenido = "<ul class='pcoded-submenu'>";
            int nRegistros = lista.Length;
            string[] campos;
            for (var i = 0; i < nRegistros; i++)
            {
                campos = lista[i].Split('|');
                if (campos[3] == idPadre)
                {
                    contenido += "<li id='";
                    contenido += campos[0];
                    contenido += "' class=''>";
                    contenido += "<a onclick='javascript:obtenerVista(this,\"";
                    contenido += campos[4];
                    contenido += "\",\"";
                    contenido += campos[6];
                    contenido += "\");' href='javascript:navegar(\"";
                    contenido += campos[2];
                    contenido += "\");' class='waves-effect waves-dark'>";
                    contenido += "<span class='pcoded-micon'><i class='ti-id-badge'></i><b>A</b></span>";
                    contenido += "<span class='pcoded-mtext'>";
                    contenido += campos[1];
                    contenido += "</span>";
                    contenido += "<span class='pcoded-mcaret'></span>";
                    contenido += "</a>";
                    contenido += "</li>";
                }
            }
            contenido += "</ul>";
            return contenido;
        }
    }
}