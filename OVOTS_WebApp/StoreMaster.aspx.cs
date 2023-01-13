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
    public partial class StoreMaster : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static List<StoreMasterBll> GetStoreList(string ddlFilterType, string FilterValue, int startindex, int EndIndex)
        {

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<StoreMasterBll> retuT = new List<StoreMasterBll>();
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetStoreList(ddlFilterType, FilterValue, startindex, EndIndex);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                StoreMasterBll retu = new StoreMasterBll();
                retu.P_StoreCode = dr["StoreCode"].ToString();
                retu.P_StoreName = dr["StoreName"].ToString();
                retu.P_OwnerName = dr["OwnerName"].ToString();
                retu.P_MobileNo = dr["MobileNo"].ToString();
                retu.P_EmailId = dr["EmailId"].ToString();
                retu.P_State = dr["State"].ToString();
                retu.P_District = dr["District"].ToString();
                retu.P_Town = dr["Town"].ToString();
                retu.P_PinCode = dr["PinCode"].ToString();
                retu.P_Address = dr["Address"].ToString();
                retu.P_GSTNo = dr["GSTNo"].ToString();


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
        public static List<ListItem> GetGCHDll()
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetGCHDll();
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["GCHCode"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["GCHName"]);
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
        public static string GetStoreDetails(string P_StoreCode)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            StoreMasterBll del = new StoreMasterBll();

            ds = dal.GetStoreDetails(P_StoreCode);
            if (ds.Tables[0].Rows.Count > 0)
            {
                del.P_StoreCode = Convert.ToString(ds.Tables[0].Rows[0]["StoreCode"]);
                del.P_StoreName = Convert.ToString(ds.Tables[0].Rows[0]["StoreName"]);
                del.P_OwnerName = Convert.ToString(ds.Tables[0].Rows[0]["OwnerName"]);
                del.P_MobileNo = Convert.ToString(ds.Tables[0].Rows[0]["MobileNo"]);
                del.P_EmailId = Convert.ToString(ds.Tables[0].Rows[0]["EmailId"]);
                del.P_State = Convert.ToString(ds.Tables[0].Rows[0]["State"]);
                del.P_District = Convert.ToString(ds.Tables[0].Rows[0]["District"]);
                del.P_Town = Convert.ToString(ds.Tables[0].Rows[0]["Town"]);
                del.P_PinCode = Convert.ToString(ds.Tables[0].Rows[0]["PinCode"]);
                del.P_Address = Convert.ToString(ds.Tables[0].Rows[0]["Address"]);
                del.P_GSTNo = Convert.ToString(ds.Tables[0].Rows[0]["GSTNo"]);

                del.P_Active = Convert.ToString(ds.Tables[0].Rows[0]["Active"]);

            }


            string oStoreBll = JsonConvert.SerializeObject(new { StoreDetails = del });
            return oStoreBll;
        }

        [WebMethod(EnableSession = true)]
        public static string GetStoreCnt(string ddlFilterType, string FilterValue)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            string cnt = "0";
            HttpContext.Current.Session["StoreCnt"] = "0";
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetStoreList(ddlFilterType, FilterValue, 0, 0);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }

            HttpContext.Current.Session["StoreCnt"] = cnt;
            return cnt;
        }



        [WebMethod(EnableSession = true)]
        public static string SaveStoreDetails(List<StoreMasterBll> oStoreBll)
        {
            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            StoreMasterBll obll = new StoreMasterBll();
            foreach (StoreMasterBll oPBLL in oStoreBll)
            {
                obll.P_StoreCode = oPBLL.P_StoreCode;
                obll.P_StoreName = oPBLL.P_StoreName;
                obll.P_OwnerName = oPBLL.P_OwnerName;
                obll.P_MobileNo = oPBLL.P_MobileNo;
                obll.P_EmailId = oPBLL.P_EmailId;
                obll.P_State = oPBLL.P_State;
                obll.P_District = oPBLL.P_District;
                obll.P_Town = oPBLL.P_Town;
                obll.P_PinCode = oPBLL.P_PinCode;
                obll.P_Address = oPBLL.P_Address;
                obll.P_GSTNo = oPBLL.P_GSTNo;

                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_Active = oPBLL.P_Active;
                obll.P_UserIP = "";
                ds = dal.SaveStoreMaster(obll);
                retu = "Store Details Saved Sucessfully";
                //ds = dal.CheckDuplicateStore(obll.P_StoreCode, obll.P_MobileNo);
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
            int cnt = Convert.ToInt32(HttpContext.Current.Session["StoreCnt"]);
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
            dsExcel = dal.GetStoreList(ddlFilterType, FilterValue, 0, cnt);
            if (dsExcel.Tables.Count != 0)
            {
                string Reportname = "StoreList";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(dsExcel.Tables[0], "StoreList");

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