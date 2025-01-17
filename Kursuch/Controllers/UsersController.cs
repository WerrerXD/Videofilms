using Kursuch.Interfaces;
using Kursuch.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace Kursuch.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly VideofilmdbContext _context;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IEmailService _emailService;

        public UsersController(VideofilmdbContext context, IPasswordHasher passwordHasher, IEmailService emailService)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _emailService = emailService;
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpGet("GetAll")]
        public IQueryable<User> GetAllUsers()
        {
            return _context.Users
                .FromSqlRaw($"SELECT * FROM \"Users\"");
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpGet("GetByEmail")]
        public async Task<User> GetUserByEmail(string email)
        {
            var result =  await _context.Users
                .FromSqlInterpolated($"SELECT * FROM \"Users\" WHERE \"Email\" = {email}")
                .FirstOrDefaultAsync() ?? throw new Exception("User with this email does not exist");
            return result;
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpPut("Add")]
        public async Task<int> AddUser(string email, string passwordHash, string fullName)
        {
            return await _context.Database
                .ExecuteSqlInterpolatedAsync($"INSERT INTO \"Users\"(\"Email\", \"PasswordHash\", \"FullName\") VALUES ({email},{passwordHash},{fullName})");
        }
        
        [Authorize(Policy = "AdminPolicy")]
        [HttpPut("Update")]
        public async Task<int> UpdateUser(int userId, string email, string fullName)
        {
            return await _context.Database
                .ExecuteSqlInterpolatedAsync($"UPDATE \"Users\" SET \"Email\" = {email}, \"FullName\" = {fullName} WHERE \"UserID\" = {userId}");
        }


        
        [Authorize(Policy = "AdminPolicy")]
        [HttpDelete("DeleteUser")]
        public async Task<int> DeleteUser(int id)
        {
            return await _context.Database
                .ExecuteSqlInterpolatedAsync($"DELETE FROM \"Users\" WHERE \"UserID\" = {id}");
        }
        
        [Authorize(Policy = "AdminPolicy")]
        [HttpGet("GetById/{id}")]
        public async Task<User> GetUserById(int id)
        {
            return await _context.Users
                .FromSqlInterpolated($"SELECT * FROM \"Users\" WHERE \"UserID\" = {id}")
                .FirstOrDefaultAsync() ?? throw new Exception("User with this id does not exist");
        }

        [HttpPost("Register")]
        public async Task Register(string email, string password, string fullName)
        {
            var check = await _context.Users
                .FromSqlInterpolated($"SELECT * FROM \"Users\" WHERE \"Email\" = {email}")
                .AnyAsync();
            if(check)
            {
                throw new Exception("User with this email already exists");
            }
            var hashedPassword = _passwordHasher.Generate(password);
            await AddUser(email, hashedPassword, fullName);
            _context.SaveChanges();
        }
        
        
        [HttpPost("Login")]
        public async Task<IActionResult> Login(string email, string password)
        {
            var user = await GetUserByEmail(email);
            if (user == null)
            {
                return Unauthorized("User not found");
            }

            var result = _passwordHasher.Verify(password, user.PasswordHash);
            if (!result)
            {
                return Unauthorized("Wrong password");
            }

            var random = new Random();

            var twoFactorCode = random.Next(100000, 999999).ToString();

            HttpContext.Response.Cookies.Append("TwoFactorCode", twoFactorCode, new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddMinutes(5)
            });

            await _emailService.SendAsync(email, "Your 2FA Code", $"Your verification code is: {twoFactorCode}");

            return Ok("2FA required. Check your email for the verification code.");
        }
        
        [HttpPost("VerifyTwoFactorCode")]
        public async Task<IActionResult> VerifyTwoFactorCode(string email, string code)
        {
            var storedCode = HttpContext.Request.Cookies["TwoFactorCode"];
            if (storedCode == null || storedCode != code)
            {
                return Unauthorized("Invalid or expired verification code");
            }

            HttpContext.Response.Cookies.Delete("TwoFactorCode");

            var user = await GetUserByEmail(email);
            if (user == null)
            {
                return Unauthorized("User not found");
            }

            if (email == "andreyperko9@gmail.com")
                HttpContext.Response.Cookies.Append("IsAdmin", "Yes");
            else
                HttpContext.Response.Cookies.Append("IsAdmin", "No");

            var claims = new List<Claim>
            {
                new(ClaimTypes.Name, (user.UserId).ToString())
            };
            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

            return Ok("Authentication successful");
        }



        [Authorize]
        [HttpPost("LogOut")]
        public async Task LogOut()
        {
            await HttpContext.SignOutAsync();
            foreach (var cookie in HttpContext.Request.Cookies.Keys)
            {
                HttpContext.Response.Cookies.Delete(cookie);

            }
        }
        
        [HttpGet("CheckAuth")]
        public IActionResult CheckAuth()
        {
            if (User.Identity.IsAuthenticated)
            {
                return Ok(new { isAuthenticated = true });
            }
            return Unauthorized(new { isAuthenticated = false });
        }
    }
}
