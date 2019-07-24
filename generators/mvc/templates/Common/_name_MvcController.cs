using DotNetNuke.Web.Mvc.Framework.Controllers;
using DotNetNuke.Web.Mvc.Routing;
using System.Web.Mvc;
using System.Web.Routing;

namespace <%= Namespace %>.Common
{
    public class <%= Name %>MvcController : DnnController
    {

        private ContextHelper _<%= Name %>ModuleContext;
        public ContextHelper <%= Name %>ModuleContext
        {
            get { return _<%= Name %>ModuleContext ?? (_<%= Name %>ModuleContext = new ContextHelper(this)); }
        }

    }
}