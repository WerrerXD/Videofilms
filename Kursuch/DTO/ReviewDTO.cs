namespace Kursuch.DTO;

public class ReviewDTO
{
    public ReviewDTO(string movieName, string userName, int rating, string comment, DateTime date)
    {
        this.MovieName = movieName;
        this.UserName = userName;
        this.Rating = rating;
        this.Comment = comment;
        this.CreatedAt = date;
    }
    public string MovieName { get; set; }
    public string UserName { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}