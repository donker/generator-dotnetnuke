using DotNetNuke.Web.Api;

namespace <%= Namespace %>.Common
{
   public class RouteMapper : IServiceRouteMapper
    {
        public void RegisterRoutes(IMapRoute mapRouteManager)
        {
            mapRouteManager.MapHttpRoute("<%= Company %>/<%= Name %>", "<%= Name %>1", "{controller}/{action}", null, null, new[] { "<%= Namespace %>.Api" });
            mapRouteManager.MapHttpRoute("PersonaBar/<%= Company %>/<%= Name %>", "<%= Name %>2", "{controller}/{action}", null, null, new[] { "<%= Namespace %>.Api" });
        }
    }
}
