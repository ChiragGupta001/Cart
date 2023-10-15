using Core_Test_Dal.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core_Test_Dal.RepositoryInterfaces
{
    public interface IAccountRepository
    {
        Task<bool> CheckUser(string Email);
        Task<bool> SignupUser(UserSignupDto UserDto);
        Task<bool> LoginUser(UserLoginDto loginDto);
        Task<string> CreateToken(string Email);
        Task<User> EditUserProfile(User user, UserProfileDto profielDto);

    }
}
