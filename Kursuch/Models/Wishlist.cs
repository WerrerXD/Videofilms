using System;
using System.Collections.Generic;

namespace Kursuch.Models;

public partial class Wishlist
{
    public int WishlistId { get; set; }

    public int? UserId { get; set; }

    public int? MovieId { get; set; }

    public DateTime? DateAdded { get; set; }

    public virtual Movie? Movie { get; set; }

    public virtual User? User { get; set; }
}
