using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core_Test_Dal.Models
{
    public class UserProfileDto
    {
        public Guid Id { get; set; }
        public IFormFile Profile { get; set; }
    }
}
