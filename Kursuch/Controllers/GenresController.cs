using Kursuch.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kursuch.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class GenresController : ControllerBase
    {
        private readonly VideofilmdbContext _context;

        public GenresController(VideofilmdbContext context)
        {
            _context = context;
        }
        
        [HttpGet("GetAllGenres")]
        public async Task<List<Genre>> GetAllGenres()
        {
            var genres = await _context.Genres
                .FromSqlRaw($"SELECT * FROM \"Genres\"")
                .ToListAsync();
            //var names = genres.Select(g => g.Name).ToList();
            return genres;
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpPut("AddGenre")]
        public async Task<int> AddGenre(string name)
        {
            return await _context.Database
                .ExecuteSqlInterpolatedAsync($"INSERT INTO \"Genres\"(\"Name\") VALUES ({name})");
        }
        
        [Authorize(Policy = "AdminPolicy")]
        [HttpDelete("DeleteGenre")]
        public async Task<int> DeleteGenre(int id)
        {
            return await _context.Database
                .ExecuteSqlInterpolatedAsync($"DELETE FROM \"Genres\" WHERE \"GenreID\" = {id}");
        }
        
        [Authorize(Policy = "AdminPolicy")]
        [HttpPut("UpdateGenre")]
        public async Task<int> UpdateGenre(int id, string newName)
        {
            return await _context.Database
                .ExecuteSqlInterpolatedAsync($"UPDATE \"Genres\" SET \"Name\" = {newName} WHERE \"GenreID\" = {id}");
        }


        [Authorize(Policy = "AdminPolicy")]
        [HttpGet("GetGenreById/{id}")]
        public async Task<Genre> GetGenreById(int id)
        {
            return await _context.Genres
                .FromSqlInterpolated($"SELECT * FROM \"Genres\" WHERE \"GenreID\" = {id}")
                .FirstOrDefaultAsync() ?? throw new Exception("Genre with this id does not exist");
        }
    }
}