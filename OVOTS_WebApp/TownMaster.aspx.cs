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
    public partial class TownMaster : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static List<TownMasterBll> GetTownList(string ddlFilterType, string FilterValue, int startindex, int EndIndex)
        {

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<TownMasterBll> retuT = new List<TownMasterBll>();
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetTownList(ddlFilterType, FilterValue, startindex, EndIndex);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                TownMasterBll retu = new TownMasterBll();
                retu.P_TownCode = dr["TownCode"].ToString();
                retu.P_TownName = dr["TownName"].ToString();
                retu.P_StateName = dr["StateName"].ToString();
                retu.P_DistrictName = dr["DistrictName"].ToString();


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
        public static List<ListItem> GetDistrictDll(string StateCode)
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetDistrictDll(StateCode);
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["DistrictCode"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["DistrictName"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }

        [WebMethod(EnableSession = true)]
        public static string GetTownDetails(string P_TownCode)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            TownMasterBll del = new TownMasterBll();

            ds = dal.GetTownDetails(P_TownCode);
            if (ds.Tables[0].Rows.Count > 0)
            {
                del.P_TownCode = Convert.ToString(ds.Tables[0].Rows[0]["TownCode"]);
                del.P_TownName = Convert.ToString(ds.Tables[0].Rows[0]["TownName"]);
                del.P_StateCode = Convert.ToString(ds.Tables[0].Rows[0]["StateCode"]);
                del.P_DistrictCode = Convert.ToString(ds.Tables[0].Rows[0]["DistrictCode"]);
                del.P_Active = Convert.ToString(ds.Tables[0].Rows[0]["Active"]);

            }


            string oTownBll = JsonConvert.SerializeObject(new { TownDetails = del });
            return oTownBll;
        }

        [WebMethod(EnableSession = true)]
        public static string GetTownCnt(string ddlFilterType, string FilterValue)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            string cnt = "0";
            HttpContext.Current.Session["TownCnt"] = "0";
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetTownList(ddlFilterType, FilterValue, 0, 0);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }

            HttpContext.Current.Session["TownCnt"] = cnt;
            return cnt;
        }



        [WebMethod(EnableSession = true)]
        public static string SaveTownDetails(List<TownMasterBll> oTownBll)
        {
            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            TownMasterBll obll = new TownMasterBll();
            foreach (TownMasterBll oPBLL in oTownBll)
            {
                obll.P_TownCode = oPBLL.P_TownCode;
                obll.P_TownName = oPBLL.P_TownName;
                obll.P_StateCode = oPBLL.P_StateCode;
                obll.P_DistrictCode = oPBLL.P_DistrictCode;
                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_Active = oPBLL.P_Active;
                obll.P_UserIP = "";
                ds = dal.SaveTownMaster(obll);
                retu = "Town Details Saved Sucessfully";
                //ds = dal.CheckDuplicateTown(obll.P_TownCode, obll.P_MobileNo);
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
            int cnt = Convert.ToInt32(HttpContext.Current.Session["TownCnt"]);
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
            dsExcel = dal.GetTownList(ddlFilterType, FilterValue, 0, cnt);
            if (dsExcel.Tables.Count != 0)
            {
                string Reportname = "TownList";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(dsExcel.Tables[0], "TownList");

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