using Core_Test_Dal.Models;
using Core_Test_Dal.RepositoryInterfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Core_Test_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IGenericCrud<User> _genericCrud;
        public AccountController(IAccountRepository accountRepository,IGenericCrud<User> generic)
        {
            _accountRepository = accountRepository;
            _genericCrud = generic;
        }
        [HttpPost("SignUp")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<User>> SignUp([FromForm] UserSignupDto model)
        {
            bool checkUser = await _accountRepository.CheckUser(model.Email);
            if (checkUser)
            {
                var CreateUser = await _accountRepository.SignupUser(model);
                if (CreateUser)
                {
                    return Ok(model);
                }
                return BadRequest();
            }
            else
            {
                return Conflict();
            }
        }
        [HttpPost("Login")]
        public async Task<ActionResult<User>> Login(UserLoginDto model)
        {
            bool checkUser = await _accountRepository.LoginUser(model);
            if (checkUser)
            {
                string token = await _accountRepository.CreateToken(model.Email);
                var authorizeToken = new Token() { token = token };
                return Ok(authorizeToken);
            }
            var error = new Error() { error = "User not exist" };
            return Ok(error);
        }

        [HttpPost("EditProfile/{id}")]
        public async Task<ActionResult<User>> EditProfile([FromForm]UserProfileDto model)
        {
            var isUserExist = await _genericCrud.GetById(model.Id.ToString());
            if (isUserExist != null)
            {
                var result = await _accountRepository.EditUserProfile(isUserExist, model);
                if (result == null)
                {
                    return BadRequest();
                }
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("GetUser/{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            var user = await _genericCrud.GetById(id);
            if(user == null)
            {
                return BadRequest();
            }
            return Ok(user);
        }

    }
}