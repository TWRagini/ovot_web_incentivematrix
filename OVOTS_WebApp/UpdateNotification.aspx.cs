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
using System.Web.UI.WebControls;

namespace OVOTS_WebApp
{
    public partial class UpdateNotification : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static List<CatalogueMasterBll> GetUpdatesList(string ddlFilterType, string FilterValue, int startindex, int EndIndex)
        {

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<CatalogueMasterBll> retuT = new List<CatalogueMasterBll>();
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetUpdatesList(ddlFilterType, FilterValue, startindex, EndIndex);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                CatalogueMasterBll retu = new CatalogueMasterBll();

                retu.P_UpdateCode = Convert.ToString(dr["UpdateCode"]);
                
                retu.P_ShortName = Convert.ToString(dr["ShortName"]);
                retu.P_ContentType = Convert.ToString(dr["ContentType"]);
               
                retu.P_FilePath = Convert.ToString(dr["FilePath"]);
                retu.P_ActiveTill = Convert.ToString(dr["ActiveTill"]);
                retu.P_Content = Convert.ToString(dr["Content"]);
                //retu.P_Active = Convert.ToString(dr["Active"]);

                retuT.Add(retu);
            }
            return retuT;
        }

        [WebMethod(EnableSession = true)]
        public static string GetUpdateDetails(string P_UpdateCode)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            CatalogueMasterBll del = new CatalogueMasterBll();

            ds = dal.GetUpdateDetails(P_UpdateCode);
            if (ds.Tables[0].Rows.Count > 0)
            {
                del.P_UpdateCode = Convert.ToString(ds.Tables[0].Rows[0]["UpdateCode"]);
                del.P_ShortName = Convert.ToString(ds.Tables[0].Rows[0]["ShortName"]);
                del.P_ContentType = Convert.ToString(ds.Tables[0].Rows[0]["ContentType"]);
                del.P_FilePath = Convert.ToString(ds.Tables[0].Rows[0]["FilePath"]);
                del.P_ActiveTill = Convert.ToString(ds.Tables[0].Rows[0]["ActiveTill"]);
                del.P_Content = Convert.ToString(ds.Tables[0].Rows[0]["Content"]);
                del.P_Active = Convert.ToString(ds.Tables[0].Rows[0]["Active"]);

            }


            string oDealerBll = JsonConvert.SerializeObject(new { DealerDetails = del });
            return oDealerBll;
        }

        [WebMethod(EnableSession = true)]
        public static string GetUpdateCnt(string ddlFilterType, string FilterValue)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            string cnt = "0";
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetUpdatesList(ddlFilterType, FilterValue, 0, 0);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }


            return cnt;
        }

        [WebMethod(EnableSession = true)]
        public static string SaveUpdateNotification(List<CatalogueMasterBll> oDealerBll)
        {
            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            CatalogueMasterBll obll = new CatalogueMasterBll();
            foreach (CatalogueMasterBll oPBLL in oDealerBll)
            {
                obll.P_UpdateCode = oPBLL.P_UpdateCode;
                
                obll.P_ContentType = oPBLL.P_ContentType;
                obll.P_ShortName = oPBLL.P_ShortName;
               
                obll.P_FilePath = oPBLL.P_FilePath;
                obll.P_ActiveTill = oPBLL.P_ActiveTill;
                obll.P_Content = oPBLL.P_Content;
                obll.P_Active = oPBLL.P_Active;
                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_UserIP = "";

                ds = dal.SaveUpdateNotification(obll);
                retu = "Updates Notifications Details Saved Sucessfully";

            }


            return retu;
        }
    }
}