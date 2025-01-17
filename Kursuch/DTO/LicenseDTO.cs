namespace Kursuch.DTO;

public class LicenseDTO
{
    public LicenseDTO(int Id, string movieName, string licenseName, DateTime startDate, DateTime endDate)
    {
        this.Id = Id;
        this.MovieName = movieName;
        this.LicenseName = licenseName;
        this.StartDate = startDate;
        this.EndDate = endDate;
    }
    public int Id { get; set; }
    public string MovieName { get; set; }
    public string LicenseName { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}