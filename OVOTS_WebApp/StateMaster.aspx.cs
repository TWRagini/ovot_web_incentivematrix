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
    public partial class StateMaster : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static List<StateMasterBll> GetStateList(string ddlFilterType, string FilterValue, int startindex, int EndIndex)
        {

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<StateMasterBll> retuT = new List<StateMasterBll>();
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetStateList(ddlFilterType, FilterValue, startindex, EndIndex);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                StateMasterBll retu = new StateMasterBll();
                retu.P_StateCode = dr["StateCode"].ToString();
                retu.P_StateName = dr["StateName"].ToString();
                

                retuT.Add(retu);
            }
            return retuT;
        }

        [WebMethod(EnableSession = true)]
        public static string GetStateDetails(string P_StateCode)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            StateMasterBll del = new StateMasterBll();

            ds = dal.GetStateDetails(P_StateCode);
            if (ds.Tables[0].Rows.Count > 0)
            {
                del.P_StateCode = Convert.ToString(ds.Tables[0].Rows[0]["StateCode"]);
                del.P_StateName = Convert.ToString(ds.Tables[0].Rows[0]["StateName"]);
                
                del.P_Active = Convert.ToString(ds.Tables[0].Rows[0]["Active"]);

            }


            string oStateBll = JsonConvert.SerializeObject(new { StateDetails = del });
            return oStateBll;
        }

        [WebMethod(EnableSession = true)]
        public static string GetStateCnt(string ddlFilterType, string FilterValue)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            string cnt = "0";
            HttpContext.Current.Session["StateCnt"] = "0";
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetStateList(ddlFilterType, FilterValue, 0, 0);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }

            HttpContext.Current.Session["StateCnt"] = cnt;
            return cnt;
        }

        

        [WebMethod(EnableSession = true)]
        public static string SaveStateDetails(List<StateMasterBll> oStateBll)
        {
            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            StateMasterBll obll = new StateMasterBll();
            foreach (StateMasterBll oPBLL in oStateBll)
            {
                obll.P_StateCode = oPBLL.P_StateCode;
                obll.P_StateName = oPBLL.P_StateName;
              
                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_Active = oPBLL.P_Active;
                obll.P_UserIP = "";
                ds = dal.SaveStateMaster(obll);
                retu = "State Details Saved Sucessfully";
                //ds = dal.CheckDuplicateState(obll.P_StateCode, obll.P_MobileNo);
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
            int cnt = Convert.ToInt32(HttpContext.Current.Session["StateCnt"]);
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
            dsExcel = dal.GetStateList(ddlFilterType, FilterValue, 0, cnt);
            if (dsExcel.Tables.Count != 0)
            {
                string Reportname = "StateList";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(dsExcel.Tables[0], "StateList");

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