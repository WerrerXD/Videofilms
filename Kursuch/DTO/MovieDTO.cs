namespace Kursuch.DTO;

public class MovieDTO
{
    public MovieDTO(string title, string description, decimal? price, string genre, string studio, DateOnly? date, string imagePath, int id)
    {
        Title = title;
        Description = description;
        Price = price;
        Genre = genre;
        Studio = studio;
        DateRelease = date;
        ImagePath = imagePath;
        Id = id;
    }
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public decimal? Price { get; set; }
    public string Genre { get; set; }
    public string Studio { get; set; }
    public DateOnly? DateRelease { get; set; }
    public string ImagePath { get; set; }
}