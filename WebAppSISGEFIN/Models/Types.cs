using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAppSISGEFIN.Models
{

    public class rMensaje
    {
        public string Type { get; set; }
        public string Image { get; set; }
        public string Message { get; set; }
    }

    public class rElemCbo
    {
        public string Codigo { get; set; }
        public string Descrp { get; set; }        
    }

    public class xResponse<T>
    {
        public bool IsOk { get; set; }
        public string Message { get; set; }
        public T Content { get; set; }
        public byte Code { get; set; }
    }

    public class rInventario1
    {

        public int Id_Movim { get; set; }
        public int Id_Detalle { get; set; }
        public int Id_Secuencia { get; set; }

        [MaxLength(150)]
        public string Nombre_Mayor { get; set; }
        
        [MaxLength(150)]
        public string Nombre_SubCta { get; set; }

        [MaxLength(30)]
        public string Cuenta_Contable { get; set; }

        [MaxLength(20)]
        public string Codigo_Patrimon { get; set; }

        [MaxLength(200)]
        public string DescripcionMovim { get; set; }

        [MaxLength(100)]
        public string DescripcionMarca { get; set; }

        [MaxLength(100)]
        public string DescripcionModelo { get; set; }

        [MaxLength(20)]
        public string OC_NEA { get; set; }

        [MaxLength(10)]
        public string FECHA_EA { get; set; }

        public decimal Valor_Compra { get; set; }
        public decimal Valor_Inicial { get; set; }

    }

}