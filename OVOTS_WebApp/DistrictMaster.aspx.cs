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
using System.Web.UI.WebControls;
namespace OVOTS_WebApp
{
    public partial class DistrictMaster : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static List<DistrictMasterBll> GetDistrictList(string ddlFilterType, string FilterValue, int startindex, int EndIndex)
        {

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<DistrictMasterBll> retuT = new List<DistrictMasterBll>();
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetDistrictList(ddlFilterType, FilterValue, startindex, EndIndex);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                DistrictMasterBll retu = new DistrictMasterBll();
                retu.P_DistrictCode = dr["DistrictCode"].ToString();
                retu.P_DistrictName = dr["DistrictName"].ToString();
                retu.P_StateName = dr["StateName"].ToString();


                retuT.Add(retu);
            }
            return retuT;
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetStateDll()
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetStateDll();
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["StateCode"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["StateName"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }

        [WebMethod(EnableSession = true)]
        public static string GetDistrictDetails(string P_DistrictCode)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            DistrictMasterBll del = new DistrictMasterBll();

            ds = dal.GetDistrictDetails(P_DistrictCode);
            if (ds.Tables[0].Rows.Count > 0)
            {
                del.P_DistrictCode = Convert.ToString(ds.Tables[0].Rows[0]["DistrictCode"]);
                del.P_DistrictName = Convert.ToString(ds.Tables[0].Rows[0]["DistrictName"]);
                del.P_StateCode = Convert.ToString(ds.Tables[0].Rows[0]["StateCode"]);

                del.P_Active = Convert.ToString(ds.Tables[0].Rows[0]["Active"]);

            }


            string oDistrictBll = JsonConvert.SerializeObject(new { DistrictDetails = del });
            return oDistrictBll;
        }

        [WebMethod(EnableSession = true)]
        public static string GetDistrictCnt(string ddlFilterType, string FilterValue)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            string cnt = "0";
            HttpContext.Current.Session["DistrictCnt"] = "0";
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetDistrictList(ddlFilterType, FilterValue, 0, 0);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }

            HttpContext.Current.Session["DistrictCnt"] = cnt;
            return cnt;
        }



        [WebMethod(EnableSession = true)]
        public static string SaveDistrictDetails(List<DistrictMasterBll> oDistrictBll)
        {
            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            DistrictMasterBll obll = new DistrictMasterBll();
            foreach (DistrictMasterBll oPBLL in oDistrictBll)
            {
                obll.P_DistrictCode = oPBLL.P_DistrictCode;
                obll.P_DistrictName = oPBLL.P_DistrictName;
                obll.P_StateCode = oPBLL.P_StateCode;
                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_Active = oPBLL.P_Active;
                obll.P_UserIP = "";
                ds = dal.SaveDistrictMaster(obll);
                retu = "District Details Saved Sucessfully";
                //ds = dal.CheckDuplicateDistrict(obll.P_DistrictCode, obll.P_MobileNo);
                //if (ds.Tables[0].Rows.Count > 0)
                //{
                //    retu = "Same contact Number Already available!";
                //}
                //else
                //{

                //}

            }


            return retu;
        }

        protected void GenExcel_ServerClick(object sender, EventArgs e)
        {
            int cnt = Convert.ToInt32(HttpContext.Current.Session["DistrictCnt"]);
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
            dsExcel = dal.GetDistrictList(ddlFilterType, FilterValue, 0, cnt);
            if (dsExcel.Tables.Count != 0)
            {
                string Reportname = "DistrictList";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(dsExcel.Tables[0], "DistrictList");

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