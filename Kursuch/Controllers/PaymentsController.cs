using System.Security.Claims;
using Kursuch.DTO;
using Kursuch.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kursuch.Controllers;

[Route("[controller]")]
[ApiController]
public class PaymentsController : ControllerBase
{
    private readonly VideofilmdbContext _context;

    public PaymentsController(VideofilmdbContext context)
    {
        _context = context;
    }
    
    [HttpGet("GetAllPaymentMethods")]
    public IQueryable<PaymentMethod> GetAllPaymentMethods()
    {
        return _context.PaymentMethods
            .FromSqlRaw($"SELECT * FROM \"PaymentMethods\"");
    }

    [Authorize(Policy = "AdminPolicy")]
    [HttpPut("AddPaymentMethod")]
    public async Task<int> AddPaymentMethod(string name, string description)
    {
        return await _context.Database
            .ExecuteSqlInterpolatedAsync($"INSERT INTO \"PaymentMethods\"(\"Name\", \"Description\") VALUES ({name},{description})");
    }
    
    [Authorize(Policy = "AdminPolicy")]
    [HttpPut("UpdatePaymentMethod")]
    public async Task<int> UpdatePaymentMethod(int id,string name, string description)
    {
        return await _context.Database
            .ExecuteSqlInterpolatedAsync($"UPDATE \"PaymentMethods\" SET \"Name\" = {name}, \"Description\" = {description} WHERE \"PaymentMethodID\" = {id}");
    }
    
    [Authorize(Policy = "AdminPolicy")]
    [HttpDelete("DeletePaymentMethod")]
    public async Task<int> DeletePaymentMethod(int id)
    {
        return await _context.Database
            .ExecuteSqlInterpolatedAsync($"DELETE FROM \"PaymentMethods\" WHERE \"PaymentMethodID\" = {id}");
    }
    
    [HttpGet("GetPaymentByOrder")]
    public async Task<Payment> GetPaymentByOrder(int orderId)
    {
        return await _context.Payments
            .FromSqlInterpolated($"SELECT * FROM \"Payments\" WHERE \"OrderID\" = {orderId}")
            .FirstOrDefaultAsync();
    }
    
    [Authorize]
    [HttpGet("GetInfoAboutOrderPayment")]
    public async Task<PaymentDTO> GetInfoAboutOrderPayment(int orderId)
    {
        var userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.Name));
        var payment = await _context.Payments
            .FromSqlRaw("SELECT * FROM \"Payments\" WHERE \"OrderID\" = {0}", orderId)
            .FirstOrDefaultAsync();
        var paymentMethodName = (await _context.PaymentMethods
            .FromSqlRaw("SELECT * FROM \"PaymentMethods\" WHERE \"PaymentMethodID\" = {0}", payment.PaymentMethodId)
            .FirstOrDefaultAsync()).Name;
        PaymentDTO paymentDto = new PaymentDTO
        (
            payment.Amount,
            payment.PaymentDate,
            paymentMethodName
        );
        return paymentDto;
    }
}