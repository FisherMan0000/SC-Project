using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncomeController : ControllerBase // เปลี่ยนชื่อคลาสจาก RevenueController เป็น IncomeController
    {
        private readonly IConfiguration _configuration;

        public IncomeController(IConfiguration configuration) // อัปเดต Constructor ด้วยชื่อใหม่
        {
            _configuration = configuration;
        }

        // POST: Add Income Record
        [HttpPost("{hiringId}")]
        public async Task<IActionResult> AddIncome(int hiringId, [FromBody] Income income)
        {
            if (income == null)
            {
                return BadRequest("Income data is missing.");
            }

            try
            {
                // ตรวจสอบว่า Hiring ที่ส่งมามีอยู่จริงหรือไม่
                if (!await RecordExists("Hiring", "hiring_id", hiringId))
                {
                    return NotFound(new { Message = "Hiring record not found!" });
                }

                // ตรวจสอบว่า Customer ที่เชื่อมกับ Hiring มีอยู่หรือไม่
                var queryCheckCustomer = @"
                SELECT COUNT(1) 
                FROM Hiring h
                JOIN Customer c ON h.Customer_id = c.Id
                WHERE h.Hiring_id = @HiringId"; // ใช้ @HiringId แทน @Hiring_id

                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                using (var command = new SqlCommand(queryCheckCustomer, connection))
                {
                    command.Parameters.AddWithValue("@HiringId", hiringId); // ใช้ @HiringId แทน @Hiring_id

                    await connection.OpenAsync();
                    var customerExists = await command.ExecuteScalarAsync();

                    if (customerExists == null || (int)customerExists == 0)
                    {
                        return NotFound(new { Message = "Customer not found for the provided Hiring ID!" });
                    }
                }

                // เพิ่มข้อมูลในตาราง Income
                var query = @"
                INSERT INTO Income (hiring_id, payment_date, amount)
                OUTPUT INSERTED.income_id
                VALUES (@HiringId, @PaymentDate, @Amount)"; // ใช้ @HiringId แทน @Hiring_id

                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@HiringId", hiringId); // ใช้ @HiringId แทน @Hiring_id
                    command.Parameters.AddWithValue("@PaymentDate", income.Payment_date ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@Amount", income.Amount ?? (object)DBNull.Value);

                    await connection.OpenAsync();
                    var newId = (int)await command.ExecuteScalarAsync();
                    income.Income_id = newId;
                }

                return CreatedAtAction(nameof(GetIncomeById), new { id = income.Income_id }, income);
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




        // GET: Get Income by ID
        // GET: Retrieve Income Record by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetIncomeById(int id)
        {
            try
            {
                // ตรวจสอบว่า Income ที่ส่งมามีอยู่จริงหรือไม่
                var queryCheckIncome = @"
            SELECT COUNT(1) 
            FROM Income i
            WHERE i.income_id = @IncomeId"; // ใช้ @IncomeId แทน @Income_id

                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                using (var command = new SqlCommand(queryCheckIncome, connection))
                {
                    command.Parameters.AddWithValue("@IncomeId", id); // ใช้ @IncomeId แทน @Income_id

                    await connection.OpenAsync();
                    var incomeExists = await command.ExecuteScalarAsync();

                    if (incomeExists == null || (int)incomeExists == 0)
                    {
                        return NotFound(new { Message = "Income record not found for the provided ID!" });
                    }
                }

                // ดึงข้อมูล Income ที่ต้องการ
                var query = @"
            SELECT i.income_id, c.Name AS CustomerName, i.payment_date, i.amount
            FROM Income i
            INNER JOIN Hiring h ON i.hiring_id = h.hiring_id
            INNER JOIN Customer c ON h.Customer_id = c.id
            WHERE i.income_id = @IncomeId"; // ใช้ @IncomeId แทน @Income_id

                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@IncomeId", id); // ใช้ @IncomeId แทน @Income_id

                    await connection.OpenAsync();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            var income = new
                            {
                                Income_id = reader.GetInt32(reader.GetOrdinal("income_id")),
                                CustomerName = reader.GetString(reader.GetOrdinal("CustomerName")),
                                Payment_date = reader.GetDateTime(reader.GetOrdinal("payment_date")),
                                Amount = reader.GetDecimal(reader.GetOrdinal("amount"))
                            };
                            return Ok(income);
                        }
                    }
                }

                return NotFound(); // ถ้าไม่พบข้อมูล
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

        // Helper Method: Check if Record Exists
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
    }
}
