// AuthControllers.cs
using Microsoft.AspNetCore.Mvc;
using Backend.Models; // Ensure this is included
using Dapper;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User loginRequest)
        {
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Username) || string.IsNullOrEmpty(loginRequest.Password))
            {
                return BadRequest(new { success = false, message = "Invalid input" });
            }

            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                // var user = connection.QueryFirstOrDefault<User>(
                //     "SELECT * FROM Users WHERE username = @Username AND password = @Password",
                //     new { Username = loginRequest.Username, Password = loginRequest.Password });

                var user = connection.QueryFirstOrDefault<User>(
                "SELECT * FROM Manager WHERE username = @Username AND password = @Password",
                new { Username = loginRequest.Username, Password = loginRequest.Password });

                if (user == null)
                {
                    return Unauthorized(new { success = false, message = "Invalid username or password" });
                }

                return Ok(new { success = true, role = user.Role });
            }
        }
    }
}
