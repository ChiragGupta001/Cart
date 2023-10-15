using Core_Test_Dal.Models;
using Core_Test_Dal.RepositoryInterfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;

namespace Core_Test_Bal.Services
{
    public class AccountRepository : IAccountRepository
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IitemServices<User> _itemService;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly IGenericCrud<User> _genericCrud;

        public AccountRepository(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration, IitemServices<User> item, IMapper mapper, IGenericCrud<User> genericCrud)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _itemService = item;
            _mapper = mapper;
            _genericCrud = genericCrud;
        }

        public async Task<bool> CheckUser(string Email)
        {
            var userCheck = await _userManager.FindByEmailAsync(Email);
            if (userCheck == null)
            {
                return true;
            }
            return false;
        }


        public async Task<bool> SignupUser(UserSignupDto UserDto)
        {

            var profile = await _itemService.UploadedFile(UserDto.ProfilePic);
            //var user = _mapper.Map<User>(UserDto);
            //user.ProfilePic = profile;
                
            var user = new User
            {
                UserName = UserDto.UserName,
                FirstName = UserDto.UserName,
                LastName = UserDto.UserName,
                NormalizedUserName = UserDto.UserName,
                Email = UserDto.Email,
                NormalizedEmail = UserDto.Email,
                ProfilePic = profile,
                PhoneNumber = UserDto.PhoneNumber,
                EmailConfirmed = true,
                PhoneNumberConfirmed = true,
            };

            var result = await _userManager.CreateAsync(user, UserDto.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User");
                return true;
            }
            return false;
        }

        public async Task<bool> LoginUser(UserLoginDto UserLogin)
        {
            var user = await _userManager.FindByEmailAsync(UserLogin.Email);
            if (user != null && !user.EmailConfirmed)
            {
                return false;
            }
            if (await _userManager.CheckPasswordAsync(user, UserLogin.Password) == false)
            {
                return false;
            }
            return true;
        }

        public async Task<string> CreateToken(string Email)
        {
            var user = await _userManager.FindByEmailAsync(Email);

            var role = await _userManager.GetRolesAsync(user).ConfigureAwait(false);

            List<Claim> claim = new List<Claim>
            {
                new Claim("role", role[0]),
                new Claim("id", user.Id)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken
              (
              _configuration.GetSection("AppSettings:Issuer").Value,
              _configuration.GetSection("AppSettings:Audience").Value,
              claims: claim,
              expires: DateTime.Now.AddMinutes(90),
              signingCredentials: cred
              );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }



        public async Task<User> EditUserProfile(User user,UserProfileDto profielDto)
        {
            var profile = await _itemService.UploadedFile(profielDto.Profile);
            user.ProfilePic = profile;
            //user.ProfilePic = profile;
            _genericCrud.Update(user);
            _genericCrud.Save();
            return user;
        }
    }
}