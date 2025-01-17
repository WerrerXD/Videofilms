namespace Kursuch.DTO;

public class CartItemDTO
{
    public CartItemDTO(int Id, string movieName, string licenseName, int quantity, decimal price)
    {
        this.Id = Id;
        this.MovieName = movieName;
        this.LicenseName = licenseName;
        this.Quantity = quantity;
        this.Price = price;
    }
    public int Id { get; set; }
    public string MovieName { get; set; }
    public string LicenseName { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}