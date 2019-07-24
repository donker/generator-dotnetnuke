using DotNetNuke.Web.Api;

namespace <%= Namespace %>.Common
{
    public class RouteMapper : IServiceRouteMapper
    {
        public void RegisterRoutes(IMapRoute mapRouteManager)
        {
            mapRouteManager.MapHttpRoute("<%= Company %>/<%= Name %>", "<%= Name %>Map1", "{controller}/{action}", null, null, new[] { "<%= Namespace %>.Api" });
            mapRouteManager.MapHttpRoute("<%= Company %>/<%= Name %>", "<%= Name %>Map2", "{controller}/{action}/{id}", null, new { id = "-?\\d+" }, new[] { "<%= Namespace %>.Api" });
        }
    }
}