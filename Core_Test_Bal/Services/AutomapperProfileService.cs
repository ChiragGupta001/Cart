using AutoMapper;
using Core_Test_Dal.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core_Test_Bal.Services
{
    internal class AutomapperProfileService:Profile
    {

        public AutomapperProfileService() 
        {

            CreateMap<User, UserSignupDto>();
            CreateMap<UserSignupDto, User>();

        }

    }
}