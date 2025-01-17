using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Kursuch.AuthorizeRequirements.Handlers
{
    public class AdminHandler : AuthorizationHandler<AdminRequirement>
    {
        private readonly IHttpContextAccessor _httpContext;

        public AdminHandler(IHttpContextAccessor httpContext)
        {
            _httpContext = httpContext;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AdminRequirement requirement)
        {
            var httpRequest = _httpContext.HttpContext!.Request;
            if (httpRequest.Cookies[requirement.IsAdmin] != "Yes")
            {
                context.Fail();

                return Task.CompletedTask;
            }

            context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}
