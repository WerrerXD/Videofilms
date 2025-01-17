using Microsoft.AspNetCore.Authorization;

namespace Kursuch.AuthorizeRequirements
{
    public class AdminRequirement: IAuthorizationRequirement
    {
        public string? IsAdmin { get; }

        public string? UserEmail {  get; }

        public AdminRequirement(string? isAdmin)
        {
            IsAdmin = isAdmin;
        }

    }
}
