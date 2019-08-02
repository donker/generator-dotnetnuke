using DotNetNuke.Security;
using DotNetNuke.Web.Mvc.Framework.ActionFilters;
using <%= Namespace %>.Common;
using System.Web.Mvc;

namespace <%= Namespace %>.Controllers
{
    [DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.Edit)]
    [DnnHandleError]
    public class SettingsController : <%= Name %>MvcController
    {
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Settings()
        {
            return View(<%= Name %>ModuleContext.Settings);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="supportsTokens"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateInput(false)]
        [DotNetNuke.Web.Mvc.Framework.ActionFilters.ValidateAntiForgeryToken]
        public ActionResult Settings(ModuleSettings settings)
        {
            settings.SaveSettings(ModuleContext.Configuration);
            return RedirectToDefaultRoute();
        }
    }
}