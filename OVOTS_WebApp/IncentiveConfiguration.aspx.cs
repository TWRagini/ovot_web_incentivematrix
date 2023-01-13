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
        protected void Page_Load(object sender, EventArgs e)
        {

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
          
            return retuT;
        }

        [WebMethod(EnableSession = true)]
        public static string GetIncentiveConfigDetails(string P_ConfigCode)
        {
         

          
            return "";
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
            

            ds = dal.DeleteIncentiveConfigDetails(ConfigCode, ModelCode);
            
            return "Model Deleted";
        }

        [WebMethod(EnableSession = true)]
        public static string SaveConfigDetails(List<IncentiveConfigMasterBll> oConfigBll, List<IncentiveConfigMasterBll> oColumnDt)
        {
            string retu = "";

            

            return retu;
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