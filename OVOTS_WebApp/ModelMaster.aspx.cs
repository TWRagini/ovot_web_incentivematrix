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
    public partial class ModelMaster : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static List<ModelMasterBll> GetModelList(string ddlFilterType, string FilterValue, int startindex, int EndIndex)
        {

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<ModelMasterBll> retuT = new List<ModelMasterBll>();
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetModelList(ddlFilterType, FilterValue, startindex, EndIndex);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                ModelMasterBll retu = new ModelMasterBll();
                retu.P_ModelCode = dr["ModelCode"].ToString();
                retu.P_ModelName = dr["ModelName"].ToString();
                retu.P_IncentiveAmt = dr["IncentiveAmt"].ToString();
               // retu.P_Remarks = dr["Remarks"].ToString();


                retuT.Add(retu);
            }
            return retuT;
        }

     

        [WebMethod(EnableSession = true)]
        public static string GetModelDetails(string P_ModelCode)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ModelMasterBll del = new ModelMasterBll();

            ds = dal.GetModelDetails(P_ModelCode);
            if (ds.Tables[0].Rows.Count > 0)
            {
                del.P_ModelCode = Convert.ToString(ds.Tables[0].Rows[0]["ModelCode"]);
                del.P_ModelName = Convert.ToString(ds.Tables[0].Rows[0]["ModelName"]);
                del.P_IncentiveAmt = Convert.ToString(ds.Tables[0].Rows[0]["IncentiveAmt"]);
                del.P_Remarks = Convert.ToString(ds.Tables[0].Rows[0]["Remarks"]);

                del.P_Active = Convert.ToString(ds.Tables[0].Rows[0]["Active"]);

            }


            string oModelBll = JsonConvert.SerializeObject(new { ModelDetails = del });
            return oModelBll;
        }

        [WebMethod(EnableSession = true)]
        public static string GetModelCnt(string ddlFilterType, string FilterValue)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            string cnt = "0";
            HttpContext.Current.Session["ModelCnt"] = "0";
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetModelList(ddlFilterType, FilterValue, 0, 0);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }

            HttpContext.Current.Session["ModelCnt"] = cnt;
            return cnt;
        }



        [WebMethod(EnableSession = true)]
        public static string SaveModelDetails(List<ModelMasterBll> oModelBll)
        {
            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ModelMasterBll obll = new ModelMasterBll();
            foreach (ModelMasterBll oPBLL in oModelBll)
            {
                obll.P_ModelCode = oPBLL.P_ModelCode;
                obll.P_ModelName = oPBLL.P_ModelName;
                obll.P_IncentiveAmt = oPBLL.P_IncentiveAmt;
                obll.P_Remarks = oPBLL.P_Remarks;

                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_Active = oPBLL.P_Active;
                obll.P_UserIP = "";
                ds = dal.SaveModelMaster(obll);
                retu = "Model Details Saved Sucessfully";
                //ds = dal.CheckDuplicateModel(obll.P_ModelCode, obll.P_MobileNo);
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
            int cnt = Convert.ToInt32(HttpContext.Current.Session["ModelCnt"]);
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
            dsExcel = dal.GetModelList(ddlFilterType, FilterValue, 0, cnt);
            if (dsExcel.Tables.Count != 0)
            {
                string Reportname = "ModelList";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(dsExcel.Tables[0], "ModelList");

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