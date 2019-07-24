using System.Web.Mvc;
using <%= Namespace %>.Common;

namespace <%= Namespace %>.Controllers
{
    public class HomeController : <%= Name %>MvcController
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View(<%= Name %>ModuleContext.Settings.View);
        }
    }
}
