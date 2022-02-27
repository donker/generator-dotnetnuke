using Dnn.PersonaBar.Library.Controllers;
using Dnn.PersonaBar.Library.Model;
using DotNetNuke.Entities.Users;
using System.Collections.Generic;

namespace <%= Namespace %>.Common
{
   public class MenuController : IMenuItemController
    {
        public IDictionary<string, object> GetSettings(MenuItem menuItem)
        {
            var settings = new Dictionary<string, object>();
            return settings;
        }

        public void UpdateParameters(MenuItem menuItem)
        {
        }

        public bool Visible(MenuItem menuItem)
        {
            return UserController.Instance.GetCurrentUserInfo().IsAdmin;
        }
    }
}
