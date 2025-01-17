using System.Collections;
using System.Security.Claims;
using System.Text;
using Kursuch.DTO;
using Kursuch.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kursuch.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly VideofilmdbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public MoviesController(VideofilmdbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("GetAll")]
        public IQueryable<Movie> GetAllMovies()
        {
            return _context.Movies
                .FromSqlRaw($"SELECT * FROM \"Movies\"");
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpPut("Add")]
        public async Task<int> AddMovie(string title, string description, DateOnly dateRelease, decimal price, int genreId, int studioId, IFormFile image)
        {
            var folderPath = "filmsimages"; 
            string folder = folderPath + "/" + Guid.NewGuid().ToString() + "_" + image.FileName;
            string serverFolder = Path.Combine(_webHostEnvironment.WebRootPath, folder);

            await image.CopyToAsync(new FileStream(serverFolder, FileMode.Create));

            var imageUrl = "/" + folder;
            return await _context.Database
                .ExecuteSqlInterpolatedAsync($"INSERT INTO \"Movies\"(\"Title\", \"Description\", \"DateRelease\", \"Price\", \"GenreID\", \"StudioID\", \"ImageUrl\") VALUES ({title},{description},{dateRelease}, {price}, {genreId}, {studioId}, {imageUrl})");
        }
        
        [Authorize(Policy = "AdminPolicy")]
        [HttpPut("UpdateMovie")]
        public async Task<int> UpdateMovie(
            int id, 
            string title, 
            string description, 
            DateOnly dateRelease, 
            decimal price, 
            int genreId, 
            int studioId, 
            IFormFile? image)
        {
            string? imageUrl = null;

            // Если изображение не выбрано, оставляем старое изображение
            if (image != null)
            {
                var folderPath = "filmsimages";
                string folder = folderPath + "/" + Guid.NewGuid().ToString() + "_" + image.FileName;
                string serverFolder = Path.Combine(_webHostEnvironment.WebRootPath, folder);

                await image.CopyToAsync(new FileStream(serverFolder, FileMode.Create));

                imageUrl = "/" + folder;
            }
            else
            {
                // Если изображение не было загружено, используем текущее значение
                var movie = await _context.Movies.FindAsync(id);
                imageUrl = movie?.ImageUrl;  // Получаем текущее значение изображения, если оно существует
            }

            // Формирование SQL-запроса
            return await _context.Database.ExecuteSqlInterpolatedAsync($"UPDATE \"Movies\" SET \"Title\" = {title}, \"Description\" = {description}, \"DateRelease\" = {dateRelease}, \"Price\" = {price}, \"GenreID\" = {genreId}, \"StudioID\" = {studioId}, \"ImageUrl\" = {imageUrl ?? "NULL"} WHERE \"MovieID\" = {id}");
        }


        
        [Authorize(Policy = "AdminPolicy")]
        [HttpDelete("DeleteMovie")]
        public async Task<int> DeleteMovie(int id)
        {
            return await _context.Database
                .ExecuteSqlInterpolatedAsync($"DELETE FROM \"Movies\" WHERE \"MovieID\" = {id}");
        }
        
        //[Authorize(Policy = "AdminPolicy")]
        [HttpGet("GetById/{id}")]
        public async Task<MovieDTO> GetMovieById(int id)
        {
            var movie = await _context.Movies
                .FromSqlInterpolated($"SELECT * FROM \"Movies\" WHERE \"MovieID\" = {id}")
                .FirstOrDefaultAsync() ?? throw new Exception("Movie with this id does not exist");
            
                var genre = await _context.Genres
                    .FromSqlRaw("SELECT * FROM \"Genres\" WHERE \"GenreID\" = {0}", movie.GenreId)
                    .FirstOrDefaultAsync();
                var studio = await _context.Studios
                    .FromSqlRaw("SELECT * FROM \"Studios\" WHERE \"StudioID\" = {0}", movie.StudioId)
                    .FirstOrDefaultAsync();
                MovieDTO movieDto = new MovieDTO
                (
                    movie.Title,
                    movie.Description,
                    movie.Price,
                    genre.Name,
                    studio.Name,
                    movie.DateRelease,
                    movie.ImageUrl,
                    movie.MovieId
                );

            return movieDto;
        }
        
        [Authorize]
        [HttpPost("AddMovieToUserCart")]
        public async Task<IActionResult> AddMovieToUserCart(int movieId, int licenseId, int quantity = 1)
        {
            var userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.Name));
            var carts = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId);
            var status = "IsActive";
            if (carts == null)
            {
                await _context.Database
                    .ExecuteSqlInterpolatedAsync($"INSERT INTO \"Carts\"(\"UserID\", \"Status\") VALUES ({userId},{status})");
                await _context.SaveChangesAsync();
            }

            var cart = await _context.Carts
                .FromSqlRaw("SELECT * FROM \"Carts\" WHERE \"UserID\" = {0}", userId)
                .FirstOrDefaultAsync();
            if(cart == null)
                throw new Exception("Cart not found");
            var test = await _context.CartItems
                .FromSqlRaw("SELECT * FROM \"CartItems\" WHERE \"MovieID\" = {0} AND \"CartID\" = {1} AND \"LicenseID\" = {2}", movieId, cart.CartId, licenseId)
                .FirstOrDefaultAsync();
            if (test != null)
            {
                return BadRequest("Этот фильм уже есть в корзине");
            }
            var license = await _context.Licenses
                .FromSqlRaw("SELECT * FROM \"Licenses\" WHERE \"LicenseID\" = {0}", licenseId)
                .FirstOrDefaultAsync();
            if(license == null)
                throw new Exception("License not found");
            var movie = await GetMovieById(movieId);
            return Ok( _context.Database
                .ExecuteSqlInterpolatedAsync($"INSERT INTO \"CartItems\"(\"CartID\", \"MovieID\", \"LicenseID\", \"Quantity\", \"Price\") VALUES ({cart.CartId},{movieId},{licenseId}, {quantity}, {movie.Price * license.PriceMultiplier})"));
        }

        [Authorize]
        [HttpPost("GetItemsFromCart")]
        public async Task<List<CartItemDTO>> GetItemsFromCart()
        {
            var userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.Name));
            var cartId = (await _context.Carts
                .Where(c => c.UserId == userId && c.Status == "IsActive")
                .FirstOrDefaultAsync() ?? throw new Exception("You don't have cart")).CartId;
            var cartItems = await _context.CartItems
                .FromSqlRaw("SELECT * FROM \"CartItems\" WHERE \"CartID\" = {0}", cartId)
                .ToListAsync();
            var CartItemsDTO = new List<CartItemDTO>();
            
            for (int i = 0; i < cartItems.Count; i++)
            {
                var movie = await GetMovieById((int)cartItems[i].MovieId);
                var license = await _context.Licenses
                    .FromSqlRaw("SELECT * FROM \"Licenses\" WHERE \"LicenseID\" = {0}", cartItems[i].LicenseId)
                    .FirstOrDefaultAsync();
                CartItemDTO cartItem = new CartItemDTO
                (
                    cartItems[i].CartItemId,
                    movie.Title,
                    license.Name,
                    cartItems[i].Quantity,
                    cartItems[i].Price
                );
                CartItemsDTO.Add(cartItem);
            }
            
            return CartItemsDTO;
        }
        
        [Authorize]
        [HttpPost("RemoveItemFromCart")]
        public async Task<IActionResult> RemoveItemFromCart(int itemId)
        {
            var userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.Name));
            
            var cartId = await _context.Carts
                .FromSqlRaw("SELECT * FROM \"Carts\" WHERE \"UserID\" = {0}", userId)
                .Select(c => c.CartId)
                .FirstOrDefaultAsync();

            var cartItem = await _context.CartItems
                .FromSqlRaw("SELECT * FROM \"CartItems\" WHERE \"CartID\" = {0} AND \"CartItemID\" = {1}", cartId, itemId)
                .FirstOrDefaultAsync();

            if (cartItem == null)
            {
                return NotFound(new { message = "Item not found in cart" });
            }
            
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM \"CartItems\" WHERE \"CartItemID\" = {0}", itemId);

            return Ok(new { message = "Item removed from cart successfully" });
        }


        [Authorize]
        [HttpPost("AddItemsFromCartToOrder")]
        public async Task<int> AddItemsFromCartToOrder()
        {
            var userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.Name));
            var status = "IsActive";
            var cart = await _context.Carts
                .FromSqlRaw("SELECT * FROM \"Carts\" WHERE \"UserID\" = {0} AND \"Status\" = {1}", userId, status)
                .FirstOrDefaultAsync() ?? throw new Exception("You don't have cart");
            await _context.Database
                .ExecuteSqlInterpolatedAsync($"INSERT INTO \"Orders\"(\"UserID\", \"Status\") VALUES ({userId},{status})");
            await _context.SaveChangesAsync();
            var order = await _context.Orders
                .FromSqlRaw("SELECT * FROM \"Orders\" WHERE \"UserID\" = {0}", userId)
                .OrderBy(o => o.OrderId)
                .LastOrDefaultAsync();
            var cartItems = await _context.CartItems
                .FromSqlRaw("SELECT * FROM \"CartItems\" WHERE \"CartID\" = {0}", cart.CartId)
                .ToListAsync();
            foreach (var t in cartItems)
            {
                await _context.Database
                    .ExecuteSqlInterpolatedAsync(
                        $"INSERT INTO \"OrderItems\"(\"OrderID\", \"MovieID\", \"LicenseID\", \"Price\") VALUES ({order.OrderId},{t.MovieId},{t.LicenseId}, {t.Price * t.Quantity})");
            }
            await _context.SaveChangesAsync();
            return await _context.Database.ExecuteSqlInterpolatedAsync(
                $"DELETE FROM \"CartItems\" WHERE \"CartID\" = {cart.CartId}");
        }

        [Authorize]
        [HttpPost("GetOrderItems")]
        public async Task<List<CartItemDTO>> GetOrderItems(int orderId)
        {
            var userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.Name));
            var orderItems = await _context.OrderItems
                .FromSqlRaw("SELECT * FROM \"OrderItems\" WHERE \"OrderID\" = {0}", orderId)
                .ToListAsync();
            var CartItemsDTO = new List<CartItemDTO>();
            
            for (int i = 0; i < orderItems.Count; i++)
            {
                var movie = await GetMovieById((int)orderItems[i].MovieId);
                var license = await _context.Licenses
                    .FromSqlRaw("SELECT * FROM \"Licenses\" WHERE \"LicenseID\" = {0}", orderItems[i].LicenseId)
                    .FirstOrDefaultAsync();
                CartItemDTO orderItem = new CartItemDTO
                (
                    i + 1,
                    movie.Title,
                    license.Name,
                    1,
                    orderItems[i].Price
                );
                CartItemsDTO.Add(orderItem);
            }
            
            return CartItemsDTO;
        }

        [Authorize]
        [HttpGet("GetOrders")]
        public async Task<List<OrderDTO>> GetOrders()
        {
            var userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.Name));
            var orders = await _context.Orders
                .FromSqlRaw("SELECT * FROM \"Orders\" WHERE \"UserID\" = {0}", userId)
                .ToListAsync();
            decimal price;
            int quantity;
            var ordersDTO = new List<OrderDTO>();
            for (int i = 0; i < orders.Count; i++)
            {
                price = 0;
                quantity = 0;
                var orderItems = await _context.OrderItems
                    .FromSqlRaw("SELECT * FROM \"OrderItems\" WHERE \"OrderID\" = {0}", orders[i].OrderId)
                    .ToListAsync();
                foreach (var t in orderItems)
                {
                    price += t.Price;
                    quantity += 1;
                }
                OrderDTO order = new OrderDTO
                (
                    orders[i].OrderId,
                    quantity,
                    price,
                    orders[i].OrderDate,
                    orders[i].Status
                );
                ordersDTO.Add(order);
            }
            return ordersDTO;
        }

        [Authorize]
        [HttpPost("PayForOrder")]
        public async Task PayForOrder(int orderId, decimal price, int paymentMethodId)
        {
            var userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.Name));
            var status = (await _context.Orders
                .FromSqlRaw("SELECT * FROM \"Orders\" WHERE \"OrderID\" = {0}", orderId)
                .FirstOrDefaultAsync()).Status;
            if(status != "IsActive")
                throw new Exception("Order is already paid");
            await _context.Database
                .ExecuteSqlInterpolatedAsync(
                    $"INSERT INTO \"Payments\"(\"OrderID\", \"PaymentMethodID\", \"Amount\") VALUES ({orderId},{paymentMethodId},{price})");
            await _context.SaveChangesAsync(); 
            await _context.Database
                .ExecuteSqlRawAsync(
                    "UPDATE \"Orders\" SET \"Status\" = {0} WHERE \"OrderID\" = {1}", "IsPaid",orderId);
            await _context.SaveChangesAsync();
            var orderItems = await _context.OrderItems
                .FromSqlRaw("SELECT * FROM \"OrderItems\" WHERE \"OrderID\" = {0}", orderId)
                .ToListAsync();
            int duration;
            DateTime endDate;
            for (int i = 0; i < orderItems.Count; i++)
            {
                duration = (await _context.Licenses
                    .FromSqlRaw("SELECT * FROM \"Licenses\" WHERE \"LicenseID\" = {0}", orderItems[i].LicenseId)
                    .FirstOrDefaultAsync()).DurationInHours;
                endDate = (DateTime.UtcNow).AddHours(duration);
                if (duration == 0)
                {
                    endDate = DateTime.MaxValue;
                }
                await _context.Database
                    .ExecuteSqlInterpolatedAsync(
                        $"INSERT INTO \"UserLicenses\"(\"UserID\", \"MovieID\", \"LicenseID\", \"EndDate\") VALUES ({userId},{orderItems[i].MovieId},{orderItems[i].LicenseId},{endDate})");
            }
        }
        
        [HttpGet("GetAllWithFilter")]
        public async Task<List<MovieDTO>> GetMoviesWithFilter(
            string? title, string? description, string? genreName, string? studioName,
            int? year, double? minPrice, double? maxPrice, string? sortBy)
        {
            var sql = new StringBuilder(
                "SELECT m.* FROM \"Movies\" m " +
                "LEFT JOIN \"Genres\" g ON m.\"GenreID\" = g.\"GenreID\" " +
                "LEFT JOIN \"Studios\" s ON m.\"StudioID\" = s.\"StudioID\" " +
                "WHERE 1=1");

            var parameters = new List<object>();
            int paramIndex = 0;

            if (!string.IsNullOrEmpty(title))
            {
                sql.Append($" AND m.\"Title\" ILIKE '%' || {{{paramIndex}}} || '%'");
                parameters.Add(title);
                paramIndex++;
            }

            if (!string.IsNullOrEmpty(description))
            {
                sql.Append($" AND m.\"Description\" ILIKE '%' || {{{paramIndex}}} || '%'");
                parameters.Add(description);
                paramIndex++;
            }

            if (!string.IsNullOrEmpty(genreName))
            {
                sql.Append($" AND g.\"Name\" ILIKE '%' || {{{paramIndex}}} || '%'");
                parameters.Add(genreName);
                paramIndex++;
            }

            if (!string.IsNullOrEmpty(studioName))
            {
                sql.Append($" AND s.\"Name\" ILIKE '%' || {{{paramIndex}}} || '%'");
                parameters.Add(studioName);
                paramIndex++;
            }

            if (year.HasValue)
            {
                sql.Append($" AND EXTRACT(YEAR FROM m.\"DateRelease\") = {{{paramIndex}}}");
                parameters.Add(year.Value);
                paramIndex++;
            }

            if (minPrice.HasValue)
            {
                sql.Append($" AND m.\"Price\" >= {{{paramIndex}}}");
                parameters.Add(minPrice.Value);
                paramIndex++;
            }

            if (maxPrice.HasValue)
            {
                sql.Append($" AND m.\"Price\" <= {{{paramIndex}}}");
                parameters.Add(maxPrice.Value);
                paramIndex++;
            }
            
            if (!string.IsNullOrEmpty(sortBy))
            {
                string sortColumn;
                string sortDirection;

                var sortParts = sortBy.Split('.');
                if (sortParts.Length == 2)
                {
                    sortColumn = sortParts[0] switch
                    {
                        "primary_release_date" => "m.\"DateRelease\"",
                        "title" => "m.\"Title\"",
                        "price" => "m.\"Price\"",
                        _ => throw new ArgumentException("Invalid sort field")
                    };

                    sortDirection = sortParts[1].ToLower() == "desc" ? "DESC" : "ASC";
                    sql.Append($" ORDER BY {sortColumn} {sortDirection}");
                }
                else
                {
                    throw new ArgumentException("Invalid sort format");
                }
            }

            var movies = await _context.Movies
                .FromSqlRaw(sql.ToString(), parameters.ToArray())
                .ToListAsync();
            
            var moviesDto = new List<MovieDTO>();

            for (int i = 0; i < movies.Count; i++)
            {
                var genre = await _context.Genres
                    .FromSqlRaw("SELECT * FROM \"Genres\" WHERE \"GenreID\" = {0}", movies[i].GenreId)
                    .FirstOrDefaultAsync();
                var studio = await _context.Studios
                    .FromSqlRaw("SELECT * FROM \"Studios\" WHERE \"StudioID\" = {0}", movies[i].StudioId)
                    .FirstOrDefaultAsync();
                MovieDTO movieDto = new MovieDTO
                (
                    movies[i].Title,
                    movies[i].Description,
                    movies[i].Price,
                    genre.Name,
                    studio.Name,
                    movies[i].DateRelease,
                    movies[i].ImageUrl,
                    movies[i].MovieId
                );
                moviesDto.Add(movieDto);
            }

            return moviesDto;
        }
        
    }
}
