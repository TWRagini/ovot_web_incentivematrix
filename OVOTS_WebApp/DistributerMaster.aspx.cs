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
    public partial class DistributerMaster : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static List<DistributerMasterBll> GetDistributerList(string ddlFilterType, string FilterValue, int startindex, int EndIndex)
        {

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<DistributerMasterBll> retuT = new List<DistributerMasterBll>();
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetDistributerList(ddlFilterType, FilterValue, startindex, EndIndex);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                DistributerMasterBll retu = new DistributerMasterBll();
                retu.P_DistributerCode = dr["DistributerCode"].ToString();
                retu.P_DistributerName = dr["Name"].ToString();
                retu.P_MobileNo = dr["MobileNo"].ToString();
                retu.P_EmailId = dr["EmailId"].ToString();
                retu.P_State = dr["State"].ToString();
                retu.P_District = dr["District"].ToString();
                retu.P_Town = dr["Town"].ToString();
                retu.P_PinCode = dr["PinCode"].ToString();
                retu.P_Address = dr["Address"].ToString();
              
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
        public static List<ListItem> GetDistributerDll()
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetDistributerDll();
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["DistributerCode"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["DistributerName"]);
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
        public static List<ListItem> GetTownDll(string DistrictCode)
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetTownDll(DistrictCode);
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["TownCode"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["TownName"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }

        [WebMethod(EnableSession = true)]
        public static string GetDistributerDetails(string P_DistributerCode)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            DistributerMasterBll del = new DistributerMasterBll();

            ds = dal.GetDistributerDetails(P_DistributerCode);
            if (ds.Tables[0].Rows.Count > 0)
            {
                del.P_DistributerCode = Convert.ToString(ds.Tables[0].Rows[0]["DistributerCode"]);
                del.P_DistributerName = Convert.ToString(ds.Tables[0].Rows[0]["Name"]);
                del.P_MobileNo = Convert.ToString(ds.Tables[0].Rows[0]["MobileNo"]);
                del.P_EmailId = Convert.ToString(ds.Tables[0].Rows[0]["EmailId"]);
                del.P_State = Convert.ToString(ds.Tables[0].Rows[0]["State"]);
                del.P_District = Convert.ToString(ds.Tables[0].Rows[0]["District"]);
                del.P_Town = Convert.ToString(ds.Tables[0].Rows[0]["Town"]);
                del.P_PinCode = Convert.ToString(ds.Tables[0].Rows[0]["PinCode"]);
                del.P_Address = Convert.ToString(ds.Tables[0].Rows[0]["Address"]);
               

                del.P_Active = Convert.ToString(ds.Tables[0].Rows[0]["Active"]);

            }


            string oDistributerBll = JsonConvert.SerializeObject(new { DistributerDetails = del });
            return oDistributerBll;
        }

        [WebMethod(EnableSession = true)]
        public static string GetDistributerCnt(string ddlFilterType, string FilterValue)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            string cnt = "0";
            HttpContext.Current.Session["DistributerCnt"] = "0";
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetDistributerList(ddlFilterType, FilterValue, 0, 0);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }

            HttpContext.Current.Session["DistributerCnt"] = cnt;
            return cnt;
        }



        [WebMethod(EnableSession = true)]
        public static string SaveDistributerDetails(List<DistributerMasterBll> oDistributerBll)
        {
            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            DistributerMasterBll obll = new DistributerMasterBll();
            foreach (DistributerMasterBll oPBLL in oDistributerBll)
            {
                obll.P_DistributerCode = oPBLL.P_DistributerCode;
                obll.P_DistributerName = oPBLL.P_DistributerName;
                obll.P_MobileNo = oPBLL.P_MobileNo;
                obll.P_EmailId = oPBLL.P_EmailId;
                obll.P_State = oPBLL.P_State;
                obll.P_District = oPBLL.P_District;
                obll.P_Town = oPBLL.P_Town;
                obll.P_PinCode = oPBLL.P_PinCode;
                obll.P_Address = oPBLL.P_Address;
               

                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_Active = oPBLL.P_Active;
                obll.P_UserIP = "";
                ds = dal.SaveDistributerMaster(obll);
                retu = "Distributer Details Saved Sucessfully";
                //ds = dal.CheckDuplicateDistributer(obll.P_DistributerCode, obll.P_MobileNo);
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
            int cnt = Convert.ToInt32(HttpContext.Current.Session["DistributerCnt"]);
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
            dsExcel = dal.GetDistributerList(ddlFilterType, FilterValue, 0, cnt);
            if (dsExcel.Tables.Count != 0)
            {
                string Reportname = "DistributerList";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(dsExcel.Tables[0], "DistributerList");

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