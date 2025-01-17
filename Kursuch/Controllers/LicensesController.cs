using System.Security.Claims;
using Kursuch.DTO;
using Kursuch.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kursuch.Controllers;

[Route("[controller]")]
[ApiController]
public class LicensesController : ControllerBase
{
    private readonly VideofilmdbContext _context;

    public LicensesController(VideofilmdbContext context)
    {
        _context = context;
    }

    [HttpGet("GetAllLicenses")]
    public IQueryable<License> GetAllLicenses()
    {
        return _context.Licenses
            .FromSqlRaw($"SELECT * FROM \"Licenses\"");
    }

    [Authorize(Policy = "AdminPolicy")]
    [HttpPut("AddLicense")]
    public async Task<int> AddLicense(string name, int durationInHours, decimal priceMultiplier)
    {
        return await _context.Database
            .ExecuteSqlInterpolatedAsync(
                $"INSERT INTO \"Licenses\"(\"Name\", \"DurationInHours\", \"PriceMultiplier\") VALUES ({name},{durationInHours},{priceMultiplier})");
    }
    
    [Authorize(Policy = "AdminPolicy")]
    [HttpPut("UpdateLicense")]
    public async Task<int> UpdateLicense(int id, string name, int durationInHours, decimal priceMultiplier)
    {
        return await _context.Database
            .ExecuteSqlInterpolatedAsync(
                $"UPDATE \"Licenses\" SET \"Name\" = {name}, \"DurationInHours\" = {durationInHours}, \"PriceMultiplier\" = {priceMultiplier} WHERE \"LicenseID\" = {id}");
    }


    [Authorize(Policy = "AdminPolicy")]
    [HttpDelete("DeleteLicense")]
    public async Task<int> DeleteLicense(int id)
    {
        return await _context.Database
            .ExecuteSqlInterpolatedAsync($"DELETE FROM \"Licenses\" WHERE \"LicenseID\" = {id}");
    }

    [Authorize(Policy = "AdminPolicy")]
    [HttpGet("GetLicenseById/{id:int}")]
    public async Task<License> GetLicenseById(int id)
    {
        return await _context.Licenses
            .FromSqlInterpolated($"SELECT * FROM \"Licenses\" WHERE \"LicenseID\" = {id}")
            .FirstOrDefaultAsync() ?? throw new Exception("License with this id does not exist");
    }

    [Authorize]
    [HttpGet("GetActualLicenses")]
    public async Task<List<LicenseDTO>> GetActualLicenses()
    {
        var userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.Name));
        var licenses = await _context.UserLicenses
            .FromSqlRaw("SELECT * FROM \"UserLicenses\" WHERE \"UserID\" = {0}", userId)
            .ToListAsync();
        var licensesDTO = new List<LicenseDTO>();
            
        for (int i = 0; i < licenses.Count; i++)
        {
            var movie = await _context.Movies
                .FromSqlRaw("SELECT * FROM \"Movies\" WHERE \"MovieID\" = {0}", licenses[i].MovieId)
                .FirstOrDefaultAsync();
            var license = await _context.Licenses
                .FromSqlRaw("SELECT * FROM \"Licenses\" WHERE \"LicenseID\" = {0}", licenses[i].LicenseId)
                .FirstOrDefaultAsync();
            LicenseDTO licenseDTO = new LicenseDTO
            (
                i + 1,
                movie.Title,
                license.Name,
                licenses[i].StartDate,
                licenses[i].EndDate
            );
            licensesDTO.Add(licenseDTO);
        }

        return licensesDTO.FindAll(l => l.EndDate > DateTime.UtcNow);
    }
    
    
}