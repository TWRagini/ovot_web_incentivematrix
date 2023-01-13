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
    public partial class ASMMaster : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static List<ASMMasterBll> GetASMList(string ddlFilterType, string FilterValue, int startindex, int EndIndex)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<ASMMasterBll> retuT = new List<ASMMasterBll>();
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetASMList(ddlFilterType, FilterValue, startindex, EndIndex);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                ASMMasterBll retu = new ASMMasterBll();

                retu.P_ASMCode = dr["ASMCode"].ToString();
                retu.P_ASMName = dr["ASMName"].ToString();
                retu.P_MobileNo = dr["MobileNo"].ToString();
                retu.P_EmailId = dr["EmailId"].ToString();
                retu.P_State = dr["State"].ToString();
                retu.P_District = dr["District"].ToString();
                retu.P_Town = dr["Town"].ToString();
               // retu.P_GCHCode = dr["GCHCode"].ToString();
                retu.P_ClusterName = dr["ClusterName"].ToString();
                retu.P_PinCode = dr["PinCode"].ToString();
                retu.P_Address = dr["Address"].ToString();
              
                retuT.Add(retu);
            }
            return retuT;
            
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetStateDll() // Updates 04 - jan - 2023 Danish
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
        public static List<ListItem> GetGCHDll() // Update 04-jan-2023
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
        public static string GetASMDetails(string P_ASMCode) //New Implementation
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ASMMasterBll del = new ASMMasterBll();

            ds = dal.GetASMDetails(P_ASMCode);
            if (ds.Tables[0].Rows.Count > 0)
            {
                del.P_ASMCode = Convert.ToString(ds.Tables[0].Rows[0]["ASMCode"]);
                
                del.P_ASMName = Convert.ToString(ds.Tables[0].Rows[0]["ASMName"]);
                del.P_MobileNo = Convert.ToString(ds.Tables[0].Rows[0]["MobileNo"]);
                del.P_EmailId = Convert.ToString(ds.Tables[0].Rows[0]["EmailId"]);
                del.P_State = Convert.ToString(ds.Tables[0].Rows[0]["State"]);
                del.P_District = Convert.ToString(ds.Tables[0].Rows[0]["District"]);
                del.P_Town = Convert.ToString(ds.Tables[0].Rows[0]["Town"]);
                del.P_PinCode = Convert.ToString(ds.Tables[0].Rows[0]["PinCode"]);
                del.P_Address = Convert.ToString(ds.Tables[0].Rows[0]["Address"]);
                del.P_ClusterName = Convert.ToString(ds.Tables[0].Rows[0]["ClusterName"]);
                
                del.P_GCHCode = Convert.ToString(ds.Tables[0].Rows[0]["GCHCode"]);

                del.P_Active = Convert.ToString(ds.Tables[0].Rows[0]["Active"]);

            }
            
            string oASMBll = JsonConvert.SerializeObject(new { ASMDetails = del }); 
            return oASMBll;
        }

        [WebMethod(EnableSession = true)]
        public static string GetASMCnt(string ddlFilterType, string FilterValue)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            string cnt = "0";
            HttpContext.Current.Session["ASMCnt"] = "0";
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetASMList(ddlFilterType, FilterValue, 0, 0);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }

            HttpContext.Current.Session["ASMCnt"] = cnt;
            return cnt;
        }



        [WebMethod(EnableSession = true)]
        public static string SaveASMDetails(List<ASMMasterBll> oASMBll)
        {
            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ASMMasterBll obll = new ASMMasterBll();
            foreach (ASMMasterBll oPBLL in oASMBll)
            {
                obll.P_ASMCode = oPBLL.P_ASMCode;
                obll.P_ASMName = oPBLL.P_ASMName;
                obll.P_MobileNo = oPBLL.P_MobileNo;
                obll.P_EmailId = oPBLL.P_EmailId;
                obll.P_State = oPBLL.P_State;
                obll.P_District = oPBLL.P_District;
                obll.P_Town = oPBLL.P_Town;
                obll.P_GCHCode = oPBLL.P_GCHCode;
                obll.P_ClusterName = oPBLL.P_ClusterName;
                obll.P_PinCode = oPBLL.P_PinCode;
                obll.P_Address = oPBLL.P_Address;
                
                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_Active = oPBLL.P_Active;
                obll.P_UserIP = "";
                ds = dal.CheckDuplicateDealer(obll.P_ASMCode, obll.P_MobileNo);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    retu = "Same contact Number Already available!";
                }
                else
                {
                    ds = dal.SaveASMMaster(obll);
                    retu = "ASM Details Saved Sucessfully";
                }

            }


            return retu;
        }

        protected void GenExcel_ServerClick(object sender, EventArgs e)
        {
            int cnt = Convert.ToInt32(HttpContext.Current.Session["ASMCnt"]);
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
            dsExcel = dal.GetASMList(ddlFilterType, FilterValue, 0, cnt);
            if (dsExcel.Tables.Count != 0)
            {
                string Reportname = "ASMList";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(dsExcel.Tables[0], "ASMList");

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