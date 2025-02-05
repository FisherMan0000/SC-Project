using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Dapper;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GuardController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public GuardController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        // Post--> api/Guard
        [HttpPost]
        public IActionResult AddGuard([FromBody] Guard guard)
        {
            if (guard == null || string.IsNullOrEmpty(guard.Name))
            {
                return BadRequest(new { success = false, message = "Invalid input" });
            }

            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();


                    var insertQuery = @"INSERT INTO Guards (Image_url, Name, Age, Gender, Skills, Type, Bio, Price)
                VALUES (@Image_url, @Name, @Age, @Gender, @Skills, @Type, @Bio, @Price);
                SELECT CAST(SCOPE_IDENTITY() as int);";

                    var id = connection.QuerySingle<int>(insertQuery, guard);
                    guard.Id = id;

                    return Ok(new { success = true, message = "Guard added successfully", guard });
                }
                catch (SqlException sqlEx)
                {
                    return StatusCode(500, new { success = false, message = "Database error", details = sqlEx.Message });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { success = false, message = "Internal server error", details = ex.Message });
                }
            }
        }


        // GET--> api/Guard
        [HttpGet]
        public IActionResult GetAllGuards()
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    var query = "SELECT * FROM Guards";
                    var guards = connection.Query<Guard>(query).ToList();

                    return Ok(new { success = true, data = guards });
                }
                catch (SqlException sqlEx)
                {
                    return StatusCode(500, new { success = false, message = "Database error", details = sqlEx.Message });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { success = false, message = "Internal server error", details = ex.Message });
                }
            }
        }

        // GET--> api/Guard/{id}
        [HttpGet("{id}")]
        public IActionResult GetGuardById(int id)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    var query = "SELECT * FROM Guards WHERE Id = @Id";
                    var guard = connection.QueryFirstOrDefault<Guard>(query, new { Id = id });

                    if (guard == null)
                    {
                        return NotFound(new { success = false, message = "Guard not found" });
                    }

                    return Ok(new { success = true, data = guard });
                }
                catch (SqlException sqlEx)
                {
                    return StatusCode(500, new { success = false, message = "Database error", details = sqlEx.Message });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { success = false, message = "Internal server error", details = ex.Message });
                }
            }
        }
        // Get--> api/Guard/by-type/{type}
        [HttpGet("by-type/{type}")]
        public IActionResult GetGuardsByType(string type)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    var query = "SELECT * FROM Guards WHERE Type = @Type";
                    var guards = connection.Query<Guard>(query, new { Type = type }).ToList();

                    return Ok(new { success = true, data = guards });
                }
                catch (SqlException sqlEx)
                {
                    return StatusCode(500, new { success = false, message = "Database error", details = sqlEx.Message });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { success = false, message = "Internal server error", details = ex.Message });
                }
            }
        }
        // GET: api/Guard/by-gender/{gender}
        [HttpGet("by-gender/{gender}")]
        public IActionResult GetGuardsByGender(string gender)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    var query = "SELECT * FROM Guards WHERE Gender = @Gender";
                    var guards = connection.Query<Guard>(query, new { Gender = gender }).ToList();

                    return Ok(new { success = true, data = guards });
                }
                catch (SqlException sqlEx)
                {
                    return StatusCode(500, new { success = false, message = "Database error", details = sqlEx.Message });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { success = false, message = "Internal server error", details = ex.Message });
                }
            }
        }
    }
}
