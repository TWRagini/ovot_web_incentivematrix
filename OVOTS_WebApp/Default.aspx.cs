using OVOTS_WebApp.Dal;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace OVOTS_WebApp
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static string VerifyPassword(string UserName, string Password)
        {
            string UserID = "";
            EncryptDecrypt EnDe = new EncryptDecrypt();
            Password = EnDe.Encrypt(Password);
            CDal dal = new CDal();
            DataSet ds = new DataSet();
            ds = dal.GetLoginDetails(UserName, Password);
            if (ds.Tables[0].Rows.Count > 0)
            {
                HttpContext.Current.Session["UserName"] = Convert.ToString(ds.Tables[0].Rows[0]["UserName"]);
                HttpContext.Current.Session["UserID"] = Convert.ToString(ds.Tables[0].Rows[0]["UserId"]);
                HttpContext.Current.Session["UserRole"] = Convert.ToString(ds.Tables[0].Rows[0]["UserRole"]);
                HttpContext.Current.Session["USERCODE"] = Convert.ToString(ds.Tables[0].Rows[0]["USERCODE"]);
                HttpContext.Current.Session["UserLevel"] = Convert.ToString(ds.Tables[0].Rows[0]["UserLevel"]);
                HttpContext.Current.Session["RoleName"] = Convert.ToString(ds.Tables[0].Rows[0]["RoleName"]);

                UserID = Convert.ToString(ds.Tables[0].Rows[0]["UserId"]);
            }
            return UserID;
        }
    }
}