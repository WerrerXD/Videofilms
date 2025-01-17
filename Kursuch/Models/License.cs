using System;
using System.Collections.Generic;

namespace Kursuch.Models;

public partial class License
{
    public int LicenseId { get; set; }

    public string Name { get; set; } = null!;

    public int DurationInHours { get; set; }

    public decimal PriceMultiplier { get; set; }

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<UserLicense> UserLicenses { get; set; } = new List<UserLicense>();
}
