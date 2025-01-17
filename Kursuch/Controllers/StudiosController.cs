using Kursuch.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kursuch.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class StudiosController : ControllerBase
    {
        private readonly VideofilmdbContext _context;

        public StudiosController(VideofilmdbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllStudios")]
        public async Task<List<Studio>> GetAllStudios()
        {
            var studios = await _context.Studios
                .FromSqlRaw($"SELECT * FROM \"Studios\"")
                .ToListAsync();
            //var names = studios.Select(g => g.Name).ToList();
            return studios;
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpPut("Add")]
        public async Task<int> AddStudio(string name, string country, int yearFounded)
        {
            return await _context.Database
                .ExecuteSqlInterpolatedAsync($"INSERT INTO \"Studios\"(\"Name\", \"Country\", \"YearFounded\") VALUES ({name},{country},{yearFounded})");
        }
        
        [Authorize(Policy = "AdminPolicy")]
        [HttpPut("Update")]
        public async Task<int> UpdateStudio(int id, string name, string country, int yearFounded)
        {
            return await _context.Database
                .ExecuteSqlInterpolatedAsync($"UPDATE \"Studios\" SET \"Name\" = {name}, \"Country\" = {country}, \"YearFounded\" = {yearFounded} WHERE \"StudioID\" = {id}");
        }

        
        [Authorize(Policy = "AdminPolicy")]
        [HttpDelete("DeleteStudio")]
        public async Task<int> DeleteStudio(int id)
        {
            return await _context.Database
                .ExecuteSqlInterpolatedAsync($"DELETE FROM \"Studios\" WHERE \"StudioID\" = {id}");
        }
        
        [Authorize(Policy = "AdminPolicy")]
        [HttpGet("GetById/{id}")]
        public async Task<Studio> GetStudioById(int id)
        {
            return await _context.Studios
                .FromSqlInterpolated($"SELECT * FROM \"Studios\" WHERE \"StudioID\" = {id}")
                .FirstOrDefaultAsync() ?? throw new Exception("Studio with this id does not exist");
        }
    }
}
