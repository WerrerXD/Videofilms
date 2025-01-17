using System;
using System.Collections.Generic;

namespace Kursuch.Models;

public partial class Movie
{
    public int MovieId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public DateOnly? DateRelease { get; set; }

    public int? GenreId { get; set; }

    public decimal? Price { get; set; }

    public int? StudioId { get; set; }

    public string? ImageUrl { get; set; }

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public virtual Genre? Genre { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual Studio? Studio { get; set; }

    public virtual ICollection<UserLicense> UserLicenses { get; set; } = new List<UserLicense>();

    public virtual ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
}
