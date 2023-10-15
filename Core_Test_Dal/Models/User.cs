using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core_Test_Dal.Models
{
    public class User : IdentityUser
    {

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? ProfilePic { get; set; }
    }
}
