using System.Security.Claims;
using Kursuch.DTO;
using Kursuch.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kursuch.Controllers;

[Route("[controller]")]
[ApiController]
public class ReviewsController : ControllerBase
{
    private readonly VideofilmdbContext _context;

    public ReviewsController(VideofilmdbContext context)
    {
        _context = context;
    }
     
    [Authorize(Policy = "AdminPolicy")]
    [HttpGet("GetAllReviews")]
    public IQueryable<Review> GetAllReviews()
    {
        return _context.Reviews
            .FromSqlRaw($"SELECT * FROM \"Reviews\"");
    }
        
    [Authorize(Policy = "AdminPolicy")]
    [HttpDelete("DeleteReview")]
    public async Task<int> DeleteReview(int id)
    {
        return await _context.Database
            .ExecuteSqlInterpolatedAsync($"DELETE FROM \"Reviews\" WHERE \"ReviewID\" = {id}");
    }

    [Authorize(Policy = "AdminPolicy")]
    [HttpGet("GetReviewById/{id}")]
    public async Task<Review> GetReviewById(int id)
    {
        return await _context.Reviews
            .FromSqlInterpolated($"SELECT * FROM \"Reviews\" WHERE \"ReviewID\" = {id}")
            .FirstOrDefaultAsync() ?? throw new Exception("Review with this id does not exist");
    }
    
    [Authorize]
    [HttpGet("GetWatchedMovies")]
    public async Task<List<MovieDTO>> GetWatchedMovies()
    {
        var userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.Name)); 
        var licenses = await _context.UserLicenses
            .FromSqlRaw("SELECT * FROM \"UserLicenses\" WHERE \"UserID\" = {0}", userId)
            .ToListAsync();
        var moviesDto = new List<MovieDTO>();
            
        for (int i = 0; i < licenses.Count; i++)
        {
            var movie = await _context.Movies
                .FromSqlRaw("SELECT * FROM \"Movies\" WHERE \"MovieID\" = {0}", licenses[i].MovieId)
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
    
    [Authorize]
    [HttpPut("AddReviewToWatchedMovie")]
    public async Task<int> AddReview(int movieId, int rating, string? comment)
    {
        if (rating < 1 || rating > 5)
        {
            throw new Exception("Rating must be between 1 and 5");
        }
        var userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.Name)); 
        return await _context.Database
            .ExecuteSqlInterpolatedAsync($"INSERT INTO \"Reviews\"(\"MovieID\", \"UserID\", \"Rating\", \"Comment\") VALUES ({movieId}, {userId}, {rating}, {comment})");
    }
    
    [HttpGet("GetMovieReviews")]
    public async Task<List<ReviewDTO>> GetMovieReviews(int movieId)
    {
        var reviews = await _context.Reviews
            .FromSqlRaw("SELECT * FROM \"Reviews\" WHERE \"MovieID\" = {0}", movieId)
            .ToListAsync();
        var reviewsDTO = new List<ReviewDTO>();
            
        for (int i = 0; i < reviews.Count; i++)
        {
            var movie = await _context.Movies
                .FromSqlRaw("SELECT * FROM \"Movies\" WHERE \"MovieID\" = {0}", reviews[i].MovieId)
                .FirstOrDefaultAsync();
            var user = await _context.Users
                .FromSqlRaw("SELECT * FROM \"Users\" WHERE \"UserID\" = {0}", reviews[i].UserId)
                .FirstOrDefaultAsync();
            ReviewDTO reviewDto = new ReviewDTO
            (
                movie.Title,
                user.FullName,
                reviews[i].Rating,
                reviews[i].Comment,
                reviews[i].ReviewDate
            );
            reviewsDTO.Add(reviewDto);
        }

        return reviewsDTO;
    }
}