using ClosedXML.Excel;
using Newtonsoft.Json;
using OVOTS_WebApp.Bll;
using OVOTS_WebApp.Dal;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;


namespace OVOTS_WebApp
{
    public partial class Landing : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if(!IsPostBack)
            {
                DataSet ds = new DataSet();
                CDal dal = new CDal();
                string UserRole = Convert.ToString(Session["UserRole"]);
                ds = dal.GetMainMenu(UserRole);
                if(ds.Tables[0].Rows.Count > 0)
                {
                    rpt_MainMenu.DataSource = ds.Tables[0];
                    rpt_MainMenu.DataBind();
                }
            }
        }

        protected void aMenuHead_ServerClick(object sender, EventArgs e)
        {
            try
            {
                HtmlAnchor aMenuHead = (HtmlAnchor)sender;
                string HeadCode = aMenuHead.Name;
                string HeaderName = aMenuHead.Title;
                DataSet ds = new DataSet();
                CDal dal = new CDal();
                string UserRole = Convert.ToString(Session["UserRole"]);
                ds = dal.GetSubMenu(UserRole, HeadCode);
                popupH1.InnerText = HeaderName;
                if (ds.Tables[0].Rows.Count > 0)
                {
                    rpt_SubMenu.DataSource = ds.Tables[0];
                    rpt_SubMenu.DataBind();
                    ScriptManager.RegisterStartupScript(this, this.GetType(), "ShowModel", "ShowModel()", true);
                }
            }
            catch (Exception ex)
            {
             //   dsError = dal.ErrorLog(ex.Message, ex.GetType().Name, ex.TargetSite.Name, ex.StackTrace, "LandingMenu", "aMenuHead_ServerClick", Convert.ToString(Session["UserCode"]));
            }
        }

        [WebMethod(EnableSession = true)]
        public static string UpdatePassword(string OldPass, string NewPass)
        {
            string msg = "";
            bool valid = true;
            string Usercode = Convert.ToString(HttpContext.Current.Session["USERCODE"]);
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            EncryptDecrypt en = new EncryptDecrypt();
            string chOldPass = en.Encrypt(OldPass);
            string chNewPass = en.Encrypt(NewPass);
            ds = dal.CheckUserByPassword(chOldPass,Usercode);
            if(ds.Tables[0].Rows.Count > 0)
            { }
            else
            {
                valid = false;
                msg = "Wrong Old Password";
            }

            if(valid)
            {
                ds = dal.UpdateUserPassword(Usercode, chOldPass, chNewPass);
                msg = "Password updated successfully!";
            }

            return msg;
           
        }
    }
}