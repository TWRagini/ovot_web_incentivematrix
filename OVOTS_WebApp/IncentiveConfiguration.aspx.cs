using ClosedXML.Excel;
using Newtonsoft.Json;
using OVOTS_WebApp.Bll;
using OVOTS_WebApp.Dal;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace OVOTS_WebApp
{
    public partial class IncentiveConfiguration : System.Web.UI.Page
    {
        public static string GetConfigurationCode = "";
        public static Boolean IsEdite = false;

        protected void Page_Load(object sender, EventArgs e)
        {
            GetConfigCode();
        }

        [WebMethod(EnableSession = true)]
        public void GetConfigCode() {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetConfigCode();
            
            GetConfigurationCode = Convert.ToString(ds.Tables[0].Rows[0]["CONCAT(Initials, LEFT((LTRIM(RTRIM(Digits))),(LENGTH(LTRIM(RTRIM(Digits))) - LENGTH(LTRIM(RTRIM(P_Code))))) , LTRIM(RTRIM(P_Code + 1)) )"]);
        }


        [WebMethod(EnableSession = true)]
        public static List<IncentiveConfigMasterBll> GetIncentiveConfigList(string ddlFilterType, string FilterValue, int startindex, int EndIndex)
        {

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<IncentiveConfigMasterBll> retuT = new List<IncentiveConfigMasterBll>();
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }

            ds = dal.GetIncentiveConfigList(ddlFilterType, FilterValue, startindex, EndIndex);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                IncentiveConfigMasterBll retu = new IncentiveConfigMasterBll();
                retu.P_ConfigCode = dr["ConfigCode"].ToString();
                retu.P_ConfigName = dr["ConfigName"].ToString();
                retu.P_ConfigBy = dr["ConfigBy"].ToString();
                retu.P_ConfigLevel = dr["ConfigLevel"].ToString();
                retu.P_EntityCode = dr["EntityCode"].ToString();

                retuT.Add(retu);
            }
            
            return retuT;
        }

        [WebMethod(EnableSession = true)]
        public static string SaveConfig(List<IncentiveConfigMasterBll> oConfigBll)
        {
            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            IncentiveConfigMasterBll obll = new IncentiveConfigMasterBll();
            foreach (IncentiveConfigMasterBll oPBLL in oConfigBll)
            {
                
                obll.P_ConfigCode = oPBLL.P_ConfigCode;
                obll.P_ConfigName = oPBLL.P_ConfigName;
                obll.P_ConfigBy = oPBLL.P_ConfigBy;
                obll.P_ConfigLevel = oPBLL.P_ConfigLevel;
                obll.P_EntityCode = oPBLL.P_EntityCode;
                obll.P_Remarks = oPBLL.P_Remarks;

                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_Active = oPBLL.P_Active;
                obll.P_UserIP = "";

                ds = dal.SaveUpdateIncentiveConfig(obll);
                retu = "Incentive Configuration Saved Sucessfully";


            }
            IsEdite = false;
            return retu;
           
        }

        [WebMethod(EnableSession = true)]
        public static List<IncentiveConfigMasterBll> GetIncentiveConfigDetails()
        {
            
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<IncentiveConfigMasterBll> retuT = new List<IncentiveConfigMasterBll>();
            
            ds = dal.GetIncentiveConfigDetails(GetConfigurationCode);
            foreach (DataRow dr in ds.Tables[1].Rows)
            {
                IncentiveConfigMasterBll retu = new IncentiveConfigMasterBll();
                retu.P_ConfigCode = dr["ConfigCode"].ToString();
                retu.P_ModelCode = dr["ModelCode"].ToString();
                retu.P_FromDate = dr["FromDate"].ToString();
                retu.P_ToDate = dr["ToDate"].ToString();
                retu.P_IncentiveAmt = dr["IncentiveAmt"].ToString();

                retuT.Add(retu);
            }

            return retuT;
        }

        [WebMethod(EnableSession = true)]
        public static string GetIncentiveConfigCnt(string ddlFilterType, string FilterValue)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            string cnt = "0";
            HttpContext.Current.Session["IncentiveConfigCnt"] = "0";
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetIncentiveConfigList(ddlFilterType, FilterValue, 0, 0);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }

            HttpContext.Current.Session["IncentiveConfigCnt"] = cnt;
            return cnt;
        }

        [WebMethod(EnableSession = true)]
        public static string DeleteModel(string ModelCode, string ConfigCode)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            

            ds = dal.DeleteIncentiveConfigDetails(ModelCode , GetConfigurationCode);
            
            return "Model Deleted";
        }

        [WebMethod(EnableSession = true)]
        public static string SaveConfigDetails(List<IncentiveConfigMasterBll> oConfigBll)
        {
            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            IncentiveConfigMasterBll obll = new IncentiveConfigMasterBll();
            foreach (IncentiveConfigMasterBll oPBLL in oConfigBll)
            {
                string strFrom = null;
                string strTo = null;
                if (obll.P_FromDate != "" && obll.P_ToDate != "")
                {
                    DateTime dtFrom = DateTime.ParseExact(oPBLL.P_FromDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    DateTime dtTo = DateTime.ParseExact(oPBLL.P_ToDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                    strFrom = dtFrom.ToString("yyyy-MM-dd");
                    strTo = dtTo.ToString("yyyy-MM-dd");
                }

                obll.P_ConfigCode = GetConfigurationCode;
                obll.P_ModelCode = oPBLL.P_ModelCode;
                obll.P_FromDate = strFrom;
                obll.P_ToDate = strTo;
                obll.P_IncentiveAmt = oPBLL.P_IncentiveAmt;
                

                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_Active = oPBLL.P_Active;
                obll.P_UserIP = "";

                ds = dal.SaveUpdateIncentiveConfigdt(obll);
                retu = "Incentive Product Details Saved Sucessfully";
               

            }


            return retu;
        }

        [WebMethod(EnableSession = true)]
        public static string GetIncentiveConfig(string P_ConfigCode)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            IncentiveConfigMasterBll del = new IncentiveConfigMasterBll();
            IsEdite = true;

            ds = dal.GetIncentiveConfigDetails(P_ConfigCode);
            GetConfigurationCode = P_ConfigCode;
            if (ds.Tables[0].Rows.Count > 0)
            {

                del.P_ConfigCode = Convert.ToString(ds.Tables[0].Rows[0]["ConfigCode"]); 
                del.P_ConfigName = Convert.ToString(ds.Tables[0].Rows[0]["ConfigName"]);
                del.P_ConfigBy = Convert.ToString(ds.Tables[0].Rows[0]["ConfigBy"]);
                del.P_ConfigLevel = Convert.ToString(ds.Tables[0].Rows[0]["ConfigLevel"]);
                del.P_EntityCode = Convert.ToString(ds.Tables[0].Rows[0]["EntityCode"]);
                del.P_Remarks = Convert.ToString(ds.Tables[0].Rows[0]["Remarks"]);

                del.P_Active = Convert.ToString(ds.Tables[0].Rows[0]["Active"]);
            }

            string oIncConfigBll = JsonConvert.SerializeObject(new { IncConfigDetails = del });
            return oIncConfigBll;
            
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetEntityDll(string Level)
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            
            ds = dal.GetEntityDll(Level);
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["Code"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["Name"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetModelDll(string Level)
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();


            ds = dal.GetEntityDll(Level);
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["Code"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["Name"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }

        protected void GenExcel_ServerClick(object sender, EventArgs e)
        {
            int cnt = Convert.ToInt32(HttpContext.Current.Session["IncentiveConfigCnt"]);
            DataSet dsExcel = new DataSet();
            CDal dal = new CDal();

            string ddlFilterType = null;
            string FilterValue = null;
            if (hdFilterType.Value != "")
            {
                ddlFilterType = hdFilterType.Value;
            }
            if (hdFilterValue.Value != "")
            {
                FilterValue = hdFilterValue.Value;
            }
            dsExcel = dal.GetIncentiveConfigList(ddlFilterType, FilterValue, 0, cnt);
            if (dsExcel.Tables.Count != 0)
            {
                string Reportname = "ASMList";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(dsExcel.Tables[0], "IncentiveConfigList");

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=" + Reportname + ".xlsx");
                    using (MemoryStream MyMemoryStream = new MemoryStream())
                    {
                        wb.SaveAs(MyMemoryStream);
                        MyMemoryStream.WriteTo(Response.OutputStream);
                        Response.Flush();
                        Response.End();
                    }
                }
            }
        }


    }
}