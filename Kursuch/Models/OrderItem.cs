using System;
using System.Collections.Generic;

namespace Kursuch.Models;

public partial class OrderItem
{
    public int OrderItemId { get; set; }

    public int? OrderId { get; set; }

    public int? MovieId { get; set; }

    public int? LicenseId { get; set; }

    public decimal Price { get; set; }

    public virtual License? License { get; set; }

    public virtual Movie? Movie { get; set; }

    public virtual Order? Order { get; set; }
}
