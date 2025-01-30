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

        // POST --> api/Guard
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

                    var insertQuery = @"INSERT INTO Guards (image_url, name, age, gender, skills, type, bio)
                                        VALUES (@Image_url, @Name, @Age, @Gender, @Skills, @Type, @Bio);
                                        SELECT CAST(SCOPE_IDENTITY() as int);";

                    var guardId = connection.QuerySingle<int>(insertQuery, guard);
                    guard.Guard_id = guardId;

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

        // GET --> api/Guard
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

        // GET --> api/Guard/{id}
        [HttpGet("{id}")]
        public IActionResult GetGuardById(int id)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    var query = "SELECT guard_id , image_url, name, age, gender, skills, type, bio FROM Guards WHERE guard_id = @guard_id";
                    var guard = connection.QueryFirstOrDefault<Guard>(query, new { guard_id = id });

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

        // PUT --> api/Guard/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateGuard(int id, [FromBody] Guard guard)
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

                    var checkQuery = "SELECT COUNT(1) FROM Guards WHERE guard_id = @guard_id";
                    var exists = connection.ExecuteScalar<bool>(checkQuery, new { guard_id = id });

                    if (!exists)
                    {
                        return NotFound(new { success = false, message = "Guard not found" });
                    }

                    var updateQuery = @"UPDATE Guards 
                                        SET image_url = @Image_url, 
                                            name = @Name, 
                                            age = @Age, 
                                            gender = @Gender, 
                                            skills = @Skills, 
                                            type = @Type, 
                                            bio = @Bio
                                        WHERE guard_id = @guard_id";

                    var affectedRows = connection.Execute(updateQuery, new
                    {
                        guard_id = id,
                        guard.Image_url,
                        guard.Name,
                        guard.Age,
                        guard.Gender,
                        guard.Skills,
                        guard.Type,
                        guard.Bio
                    });

                    if (affectedRows == 0)
                    {
                        return StatusCode(500, new { success = false, message = "Update failed" });
                    }

                    return Ok(new { success = true, message = "Guard updated successfully" });
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