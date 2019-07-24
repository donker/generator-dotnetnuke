using DotNetNuke.Instrumentation;
using DotNetNuke.Web.Api;
using System.Net;
using System.Net.Http;

namespace <%= Namespace %>.Common
{
    public class <%= Name %>ApiController : DnnApiController
    {
        public static readonly ILog Logger = LoggerSource.Instance.GetLogger(typeof(DnnApiController));
        
        private ContextHelper _<%= Name %>ModuleContext;
        public ContextHelper <%= Name %>ModuleContext
        {
            get { return _<%= Name %>ModuleContext ?? (_<%= Name %>ModuleContext = new ContextHelper(this)); }
        }

        public HttpResponseMessage ServiceError(string message) {
            return Request.CreateResponse(HttpStatusCode.InternalServerError, message);
        }

        public HttpResponseMessage AccessViolation(string message)
        {
            return Request.CreateResponse(HttpStatusCode.Unauthorized, message);
        }

    }
}