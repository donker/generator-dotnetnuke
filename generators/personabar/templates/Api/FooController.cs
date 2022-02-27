namespace <%= Namespace %>.Api
{
    using Dnn.PersonaBar.Library;
    using Dnn.PersonaBar.Library.Attributes;
    using DotNetNuke.Web.Api;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    [MenuPermission()]
    public class FooController : PersonaBarApiController
    {
        [HttpGet]
        public HttpResponseMessage Bar()
        {
            return this.Request.CreateResponse(HttpStatusCode.OK, true);
        }
    }
}
