using System;
using System.Collections.Generic;

namespace Kursuch.Models;

public partial class UserLicense
{
    public int UserLicenceId { get; set; }

    public int? UserId { get; set; }

    public int? MovieId { get; set; }

    public int? LicenseId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public virtual License? License { get; set; }

    public virtual Movie? Movie { get; set; }

    public virtual User? User { get; set; }
}
