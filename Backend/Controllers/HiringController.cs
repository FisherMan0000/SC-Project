using Microsoft.AspNetCore.Mvc;
using System;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HiringController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public HiringController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("{customerId}")]
        public async Task<IActionResult> PostHiring(int customerId, Hiring hiring)
        {
            try
            {

                hiring.Customer_id = customerId;


                if (!await RecordExists("dbo.Customer", "Id", hiring.Customer_id))
                {
                    return NotFound(new { Message = "Customer not found!" });
                }


                if (!await RecordExists("dbo.Guards", "Guard_id", hiring.Guard_id))
                {
                    return NotFound(new { Message = "Guard not found!" });
                }


                var query = @"
                    INSERT INTO Hiring (Customer_id, Guard_id, Price, Start_date, End_date)
                    OUTPUT INSERTED.Hiring_id
                    VALUES (@Customer_id, @Guard_id, @Price, @Start_date, @End_date)";

                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Customer_id", hiring.Customer_id);
                    command.Parameters.AddWithValue("@Guard_id", hiring.Guard_id);
                    command.Parameters.AddWithValue("@Price", hiring.Price ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@Start_date", hiring.Start_date ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@End_date", hiring.End_date ?? (object)DBNull.Value);

                    await connection.OpenAsync();
                    var newId = (int)await command.ExecuteScalarAsync();
                    hiring.Hiring_id = newId;
                }

                return CreatedAtAction(nameof(GetHiringById), new { id = hiring.Hiring_id }, hiring);
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

        [HttpGet("{id}")]
        public async Task<ActionResult<Hiring>> GetHiringById(int id)
        {
            var query = "SELECT * FROM Hiring WHERE Hiring_id = @Hiring_id";

            using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            using (var command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@Hiring_id", id);

                await connection.OpenAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        var hiring = new Hiring
                        {
                            Hiring_id = reader.GetInt32(reader.GetOrdinal("Hiring_id")),
                            Customer_id = reader.GetInt32(reader.GetOrdinal("Customer_id")),
                            Guard_id = reader.GetInt32(reader.GetOrdinal("Guard_id")),
                            Price = reader.IsDBNull(reader.GetOrdinal("Price")) ? null : reader.GetDecimal(reader.GetOrdinal("Price")),
                            Start_date = reader.IsDBNull(reader.GetOrdinal("Start_date")) ? null : reader.GetDateTime(reader.GetOrdinal("Start_date")),
                            End_date = reader.IsDBNull(reader.GetOrdinal("End_date")) ? null : reader.GetDateTime(reader.GetOrdinal("End_date"))
                        };
                        return Ok(hiring);
                    }
                }
            }

            return NotFound();
        }

        private async Task<bool> RecordExists(string tableName, string columnName, int id)
        {
            var query = $"SELECT COUNT(1) FROM {tableName} WHERE {columnName} = @Id";

            using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            using (var command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@Id", id);

                await connection.OpenAsync();
                var count = (int)await command.ExecuteScalarAsync();
                return count > 0;
            }
        }
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllHiringInfo()
        {
            var query = @"
                SELECT 
                    h.Hiring_id, 
                    c.Name AS CustomerName, 
                    g.Name AS GuardName, 
                    h.Price, 
                    h.Start_date, 
                    h.End_date
                FROM Hiring h
                INNER JOIN Customer c ON h.Customer_id = c.Id
                INNER JOIN Guards g ON h.Guard_id = g.Guard_id";

            var hiringList = new List<object>();

            using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            using (var command = new SqlCommand(query, connection))
            {
                await connection.OpenAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        hiringList.Add(new
                        {
                            Hiring_id = reader.GetInt32(reader.GetOrdinal("Hiring_id")),
                            CustomerName = reader.GetString(reader.GetOrdinal("CustomerName")),
                            GuardName = reader.GetString(reader.GetOrdinal("GuardName")),
                            Price = reader.IsDBNull(reader.GetOrdinal("Price")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("Price")),
                            Start_date = reader.IsDBNull(reader.GetOrdinal("Start_date")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("Start_date")),
                            End_date = reader.IsDBNull(reader.GetOrdinal("End_date")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("End_date"))
                        });
                    }
                }
            }

            return Ok(hiringList);
        }
    }
}

