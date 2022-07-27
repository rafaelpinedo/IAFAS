using System;

namespace General.Librerias.EntidadesNegocio
{
    public class beLog
    {
        public DateTime FechaHora { get; set; }
        public string MensajeError { get; set; }
        public string DetalleError { get; set; }
       public beLog()
        {
            FechaHora = DateTime.Now;
        }
    }
}
