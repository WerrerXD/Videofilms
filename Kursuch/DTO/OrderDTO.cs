namespace Kursuch.DTO;

public class OrderDTO
{
    public OrderDTO(int id, int quantity, decimal price, DateTime orderDate, string status)
    {
        this.Id = id;
        this.Quantity = quantity;
        this.Price = price;
        this.Date = orderDate;
        this.Status = status;
    }
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public string Status { get; set; }
}