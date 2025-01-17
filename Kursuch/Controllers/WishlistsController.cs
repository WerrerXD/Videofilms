using System.Security.Claims;
using Kursuch.DTO;
using Kursuch.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kursuch.Controllers;

[Route("[controller]")]
[ApiController]
public class WishlistsController : ControllerBase
{
    private readonly VideofilmdbContext _context;

    public WishlistsController(VideofilmdbContext context)
    {
        _context = context;
    }
     
    [Authorize(Policy = "AdminPolicy")]
    [HttpGet("GetAllWishlists")]
    public IQueryable<Wishlist> GetAllWishlists()
    {
        return _context.Wishlists
            .FromSqlRaw($"SELECT * FROM \"Wishlists\"");
    }
    
    [Authorize(Policy = "AdminPolicy")]
    [HttpDelete("DeleteWishlist")]
    public async Task<int> DeleteWishlist(int id)
    {
        return await _context.Database
            .ExecuteSqlInterpolatedAsync($"DELETE FROM \"Wishlists\" WHERE \"WishlistID\" = {id}");
    }

    [Authorize(Policy = "AdminPolicy")]
    [HttpGet("GetWishlistById/{id}")]
    public async Task<Wishlist> GetWishlistsById(int id)
    {
        return await _context.Wishlists
            .FromSqlInterpolated($"SELECT * FROM \"Wishlists\" WHERE \"WishlistID\" = {id}")
            .FirstOrDefaultAsync() ?? throw new Exception("Wishlist with this id does not exist");
    }
    
    [Authorize]
    [HttpDelete("DeleteMovieInWishlist")]
    public async Task<int> DeleteMovieInWishlist(int movieId)
    {
        return await _context.Database
            .ExecuteSqlInterpolatedAsync($"DELETE FROM \"Wishlists\" WHERE \"MovieID\" = {movieId}");
    }
    
    [Authorize]
    [HttpPut("AddMovieToWishlist")]
    public async Task<IActionResult> AddMovieToWishlist(int movieId)
    {
        var userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.Name));

        // Проверка, существует ли уже этот фильм в списке желаемого
        var existingEntry = await _context.Wishlists
            .FromSqlInterpolated($"SELECT * FROM \"Wishlists\" WHERE \"UserID\" = {userId} AND \"MovieID\" = {movieId}")
            .ToListAsync();

        if (existingEntry.Count != 0)
        {
            // Фильм уже есть в списке желаемого
            return BadRequest("Этот фильм уже добавлен в ваш список желаемого.");
        }

        // Добавление фильма в список желаемого
        await _context.Database
            .ExecuteSqlInterpolatedAsync($"INSERT INTO \"Wishlists\"(\"UserID\", \"MovieID\") VALUES ({userId}, {movieId})");

        return Ok("Фильм добавлен в список желаемого.");
    }

    
    [Authorize]
    [HttpGet("GetMoviesFromWishlist")]
    public async Task<List<MovieDTO>> GetMoviesFromWishlist()
    {
        var userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.Name)); 
        var wishlist = await _context.Wishlists
            .FromSqlRaw("SELECT * FROM \"Wishlists\" WHERE \"UserID\" = {0}", userId)
            .ToListAsync();
        var moviesDto = new List<MovieDTO>();
            
        for (int i = 0; i < wishlist.Count; i++)
        {
            var movie = await _context.Movies
                .FromSqlRaw("SELECT * FROM \"Movies\" WHERE \"MovieID\" = {0}", wishlist[i].MovieId)
                .FirstOrDefaultAsync();
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
            moviesDto.Add(movieDto);
        }

        return moviesDto;
    }
}