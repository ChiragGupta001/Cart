using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core_Test_Dal.Models
{
    public class ItemDto
    {
        [Required(ErrorMessage = "Enter Product Name")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Enter image Url")]
        public IFormFile Image { get; set; }
        [Required(ErrorMessage = "Enter Product Description")]
        public string Description { get; set; }
        [Required(ErrorMessage = "Enter Category")]
        public string Category { get; set; }
        [Required(ErrorMessage = "Enter product quantity")]
        public int Quantity { get; set; }
        [Required(ErrorMessage = "Enter Product Price")]
        public decimal Price { get; set; }
    }
}
