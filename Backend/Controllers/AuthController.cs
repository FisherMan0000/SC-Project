// // AuthControllers.cs
// using Microsoft.AspNetCore.Mvc;
// using Backend.Models;
// using Dapper;
// using Microsoft.Extensions.Configuration;
// using System.Data.SqlClient;
// using System.Security.Cryptography;
// using System.Text;

// namespace Backend.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class AuthController : ControllerBase
//     {
//         private readonly IConfiguration _configuration;

//         public AuthController(IConfiguration configuration)
//         {
//             _configuration = configuration;
//         }

//         [HttpPost("login")]
//         public IActionResult Login([FromBody] User loginRequest)
//         {
//             if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Username) || string.IsNullOrEmpty(loginRequest.Password))
//             {
//                 return BadRequest(new { success = false, message = "Invalid input" });
//             }

//             var connectionString = _configuration.GetConnectionString("DefaultConnection");

//             using (var connection = new SqlConnection(connectionString))
//             {
//                 var user = connection.QueryFirstOrDefault<User>(
//                     "SELECT * FROM Manager WHERE username = @Username AND password = @Password",
//                     new { Username = loginRequest.Username, Password = loginRequest.Password });

//                 if (user == null)
//                 {
//                     return Unauthorized(new { success = false, message = "Invalid username or password" });
//                 }

//                 return Ok(new { success = true, role = user.Role });
//             }
//         }

//         [HttpPost("register")]
//         public IActionResult Register([FromBody] Customer customer)
//         {
//             if (customer == null || string.IsNullOrEmpty(customer.Username) || string.IsNullOrEmpty(customer.Password))
//             {
//                 Console.WriteLine("Invalid input: Customer data is missing.");
//                 return BadRequest(new { success = false, message = "Invalid input" });
//             }

//             var connectionString = _configuration.GetConnectionString("DefaultConnection");
//             Console.WriteLine($"Using connection string: {connectionString}");

//             using (var connection = new SqlConnection(connectionString))
//             {
//                 try
//                 {
//                     connection.Open();
//                     Console.WriteLine("Database connection opened successfully.");

//                     // Check if username already exists
//                     var existingUser = connection.QueryFirstOrDefault<Customer>(
//                         "SELECT * FROM Customer WHERE Username = @Username",
//                         new { Username = customer.Username });

//                     if (existingUser != null)
//                     {
//                         Console.WriteLine($"Username '{customer.Username}' already exists.");
//                         return BadRequest(new { success = false, message = "Username already exists" });
//                     }

//                     // Hash the password
//                     customer.Password = HashPassword(customer.Password);
//                     Console.WriteLine($"Password hashed: {customer.Password}");

//                     // Insert the user into the database
//                     var sql = @"
//                         INSERT INTO Customer (Name, Email, Username, Password, PhoneNo, Address, Gender, Dob, User_Id)
//                         VALUES (@Name, @Email, @Username, @Password, @PhoneNo, @Address, @Gender, @Dob, @UserId);";

//                     // Generate a new user_id (int)
//                     var userId = connection.QuerySingle<int>(
//                         @"
//                         INSERT INTO Users (username, password, role)
//                         VALUES (@Username, @Password, @Role);
//                         SELECT CAST(SCOPE_IDENTITY() as int);",
//                         new
//                         {
//                             Username = customer.Username,
//                             Password = customer.Password,
//                             Role = "Customer" // Assign a default role
//                         });

//                     // Assign the generated user_id to the Customer table
//                     customer.UserId = userId;

//                     connection.Execute(sql, customer);

//                     Console.WriteLine("User registered successfully.");
//                     return Ok(new { success = true, message = "User registered successfully" });
//                 }
//                 catch (SqlException sqlEx)
//                 {
//                     Console.WriteLine($"SQL Exception: {sqlEx.Message}");
//                     return StatusCode(500, new { success = false, message = "Database error" });
//                 }
//                 catch (Exception ex)
//                 {
//                     Console.WriteLine($"General Exception: {ex.Message}");
//                     return StatusCode(500, new { success = false, message = "Internal server error" });
//                 }
//             }
//         }

//         private string HashPassword(string password)
//         {
//             using var sha256 = SHA256.Create();
//             var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
//             return Convert.ToBase64String(bytes);
//         }
//     }
// }



using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Dapper;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Security.Cryptography;
using System.Text;

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

        // [HttpPost("login")]
        // public IActionResult Login([FromBody] User loginRequest)
        // {
        //     if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Username) || string.IsNullOrEmpty(loginRequest.Password))
        //     {
        //         return BadRequest(new { success = false, message = "Invalid input" });
        //     }

        //     var connectionString = _configuration.GetConnectionString("DefaultConnection");

        //     using (var connection = new SqlConnection(connectionString))
        //     {
        //         connection.Open();

        //         // Query to check both Manager and Customer
        //         var user = connection.QueryFirstOrDefault<User>(
        //             @"SELECT u.username, u.password, u.role 
        //               FROM Users u 
        //               WHERE u.username = @Username",
        //             new { Username = loginRequest.Username });

        //         if (user == null)
        //         {
        //             return Unauthorized(new { success = false, message = "Invalid username or password" });
        //         }

        //         // Verify hashed password
        //         if (!VerifyPassword(loginRequest.Password, user.Password))
        //         {
        //             return Unauthorized(new { success = false, message = "Invalid username or password" });
        //         }

        //         return Ok(new { success = true, role = user.Role });
        //     }
        // }

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
                connection.Open();

                // Query to fetch user details based on the username
                var user = connection.QueryFirstOrDefault<User>(
                    @"SELECT u.username, u.password, u.role 
              FROM Users u 
              WHERE u.username = @Username",
                    new { Username = loginRequest.Username });

                if (user == null)
                {
                    return Unauthorized(new { success = false, message = "Invalid username or password" });
                }

                // Verify hashed password
                if (!VerifyPassword(loginRequest.Password, user.Password))
                {
                    return Unauthorized(new { success = false, message = "Invalid username or password" });
                }

                // Handle role-based login
                if (user.Role == "Manager")
                {
                    return Ok(new { success = true, role = "Manager", message = "Manager login successful" });
                }
                else if (user.Role == "Customer")
                {
                    return Ok(new { success = true, role = "Customer", message = "Customer login successful" });
                }
                else
                {
                    return Forbid(new { success = false, message = "Unauthorized role" });
                }
            }
        }

        private IActionResult Forbid(object value)
        {
            throw new NotImplementedException();
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] Customer customer)
        {
            if (customer == null || string.IsNullOrEmpty(customer.Username) || string.IsNullOrEmpty(customer.Password))
            {
                return BadRequest(new { success = false, message = "Invalid input" });
            }

            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Check if username already exists
                    var existingUser = connection.QueryFirstOrDefault<Customer>(
                        "SELECT * FROM Customer WHERE Username = @Username",
                        new { Username = customer.Username });

                    if (existingUser != null)
                    {
                        return BadRequest(new { success = false, message = "Username already exists" });
                    }

                    // Hash the password
                    customer.Password = HashPassword(customer.Password);

                    // Insert into Users and get the UserId
                    var userId = connection.QuerySingle<int>(
                        @"INSERT INTO Users (username, password, role) 
                          VALUES (@Username, @Password, @Role);
                          SELECT CAST(SCOPE_IDENTITY() as int);",
                        new
                        {
                            Username = customer.Username,
                            Password = customer.Password,
                            Role = "Customer"
                        });

                    // Assign the UserId to the Customer and insert into Customer table
                    customer.UserId = userId;

                    connection.Execute(
                        @"INSERT INTO Customer (Name, Email, Username, Password, PhoneNo, Address, Gender, Dob, User_Id) 
                          VALUES (@Name, @Email, @Username, @Password, @PhoneNo, @Address, @Gender, @Dob, @UserId);",
                        customer);

                    return Ok(new { success = true, message = "User registered successfully" });
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

        [HttpPost("addManager")]
        public IActionResult AddManager([FromBody] Manager manager)
        {
            if (manager == null || string.IsNullOrEmpty(manager.Username) || string.IsNullOrEmpty(manager.Password))
            {
                return BadRequest(new { success = false, message = "Invalid input" });
            }

            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Check if username already exists in Users table
                    var existingUser = connection.QueryFirstOrDefault<Manager>(
                        "SELECT * FROM Manager WHERE Username = @Username",
                        new { Username = manager.Username });

                    if (existingUser != null)
                    {
                        return BadRequest(new { success = false, message = "Username already exists" });
                    }

                    // Hash the password
                    manager.Password = HashPassword(manager.Password);

                    // Insert into Users table and get the UserId
                    var userId = connection.QuerySingle<int>(
                        @"INSERT INTO Users (username, password, role) 
                  VALUES (@Username, @Password, @Role);
                  SELECT CAST(SCOPE_IDENTITY() as int);",
                        new
                        {
                            Username = manager.Username,
                            Password = manager.Password,
                            Role = "Manager"
                        });

                    // Assign the UserId to the Manager and insert into Manager table
                    manager.User_Id = userId;

                    connection.Execute(
                        @"INSERT INTO Manager (Name, Email, Username, Password, PhoneNo, Address, Gender, Dob, User_Id) 
                  VALUES (@Name, @Email, @Username, @Password, @PhoneNo, @Address, @Gender, @Dob, @UserId);",
                        manager);

                    return Ok(new { success = true, message = "Manager added successfully" });
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

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        private bool VerifyPassword(string inputPassword, string hashedPassword)
        {
            var inputPasswordHash = HashPassword(inputPassword);
            return inputPasswordHash == hashedPassword;
        }
    }
}
