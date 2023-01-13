using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace OVOTS_WebApp
{
    public partial class Main : System.Web.UI.MasterPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if(!IsPostBack)
            {
                string UserRole = Convert.ToString(Session["UserRole"]);
                string RoleName = Convert.ToString(Session["RoleName"]);
                string UserName = Convert.ToString(Session["UserName"]);
                string UserLevel = Convert.ToString(Session["UserLevel"]);
                Role.InnerHtml = RoleName;
                HDUserRole.Value = UserRole;
                UserNametxt.InnerHtml = UserName;
                HDUserLevel.Value = UserLevel;
                HDUserName.Value = UserName;
                HDUserCode.Value = Convert.ToString(Session["USERCODE"]);
                HDUserRole.Value = UserRole;

            }
        }

        
    }
}