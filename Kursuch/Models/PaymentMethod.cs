using System;
using System.Collections.Generic;

namespace Kursuch.Models;
public partial class PaymentMethod
{
    public int PaymentMethodId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
