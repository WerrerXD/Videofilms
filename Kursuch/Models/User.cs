using System;
using System.Collections.Generic;

namespace Kursuch.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string FullName { get; set; } = null!;

    public DateTime DateCreated { get; set; }

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<UserLicense> UserLicenses { get; set; } = new List<UserLicense>();

    public virtual ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
}
