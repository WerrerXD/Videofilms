using System;
using System.Collections.Generic;

namespace Kursuch.Models;

public partial class Studio
{
    public int StudioId { get; set; }

    public string Name { get; set; } = null!;

    public string? Country { get; set; }

    public int? YearFounded { get; set; }

    public virtual ICollection<Movie> Movies { get; set; } = new List<Movie>();
}
