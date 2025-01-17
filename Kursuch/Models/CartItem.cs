using System;
using System.Collections.Generic;

namespace Kursuch.Models;

public partial class CartItem
{
    public int CartItemId { get; set; }

    public int? CartId { get; set; }

    public int? MovieId { get; set; }

    public int? LicenseId { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public virtual Cart? Cart { get; set; }

    public virtual License? License { get; set; }

    public virtual Movie? Movie { get; set; }
}
