using DotNetNuke.Common;
using DotNetNuke.Entities.Portals;
using DotNetNuke.Entities.Users;
using DotNetNuke.Instrumentation;
using DotNetNuke.Web.Api;

namespace <%= Namespace %>.Common
{
    public enum SecurityAccessLevel
    {
        Anonymous = 0,
        Authenticated = 1,
        View = 2,
        Edit = 3,
        Admin = 4,
        Host = 5
    }

    public class <%= Name %>AuthorizeAttribute : AuthorizeAttributeBase, IOverrideDefaultAuthLevel
    {
        private static readonly ILog Logger = LoggerSource.Instance.GetLogger(typeof(<%= Name %>AuthorizeAttribute));
        public SecurityAccessLevel SecurityLevel { get; set; }
        public UserInfo User { get; set; }

        public <%= Name %>AuthorizeAttribute()
        {
            SecurityLevel = SecurityAccessLevel.Admin;
        }

        public <%= Name %>AuthorizeAttribute(SecurityAccessLevel accessLevel)
        {
            SecurityLevel = accessLevel;
        }

        public override bool IsAuthorized(AuthFilterContext context)
        {
            Logger.Trace("IsAuthorized");
            if (SecurityLevel == SecurityAccessLevel.Anonymous)
            {
                Logger.Trace("Anonymous");
                return true;
            }
            User = HttpContextSource.Current.Request.IsAuthenticated ? UserController.Instance.GetCurrentUserInfo() : new UserInfo();
            Logger.Trace("UserId " + User.UserID.ToString());
            ContextSecurity security = ContextSecurity.GetSecurity(context.ActionContext.Request.FindModuleInfo());
            Logger.Trace(security.ToString());
            switch (SecurityLevel)
            {
                case SecurityAccessLevel.Authenticated:
                    return User.UserID != -1;
                case SecurityAccessLevel.Host:
                    return User.IsSuperUser;
                case SecurityAccessLevel.Admin:
                    return security.IsAdmin;
                case SecurityAccessLevel.Edit:
                    return security.CanEdit;
                case SecurityAccessLevel.View:
                    return security.CanView;
            }
            return false;
        }
    }
}