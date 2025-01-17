namespace Kursuch.DTO;

public class PaymentDTO
{
    public PaymentDTO(decimal price, DateTime date, string paymentMethod)
    {
        this.Price = price;
        this.Date = date;
        this.PaymentMethod = paymentMethod;
    }
    public DateTime Date { get; set; }
    public decimal Price { get; set; }
    public string PaymentMethod { get; set; }
}