using ClosedXML.Excel;
using Newtonsoft.Json;
using OVOTS_WebApp.Bll;
using OVOTS_WebApp.Dal;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace OVOTS_WebApp
{
    public partial class ISDApproval : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static string GetISDApproveListCnt(string ddlFilterType, string FilterValue, string FromDt, string ToDt, string ApproveStatus)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            string cnt = "0";
            HttpContext.Current.Session["InvoiceCnt"] = "0";
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }

            string strFrom = null;
            string strTo = null;
            if (FromDt != "" && ToDt != "")
            {
                DateTime dtFrom = DateTime.ParseExact(FromDt, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateTime dtTo = DateTime.ParseExact(ToDt, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                strFrom = dtFrom.ToString("yyyy-MM-dd");
                strTo = dtTo.ToString("yyyy-MM-dd");
            }
            ds = dal.GetISDApproveList(ddlFilterType, FilterValue, strFrom, strTo, 0, 0, ApproveStatus);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }

            HttpContext.Current.Session["InvoiceCnt"] = cnt;
            return cnt;
        }


        [WebMethod(EnableSession = true)]
        public static List<ISDMasterBll> GetISDApproveList(string ddlFilterType, string FilterValue, string FromDt, string ToDt, int startindex, int EndIndex, string ApproveStatus)
        {
            string strFrom = null;
            string strTo = null;
            if (FromDt != "" && ToDt != "")
            {
                DateTime dtFrom = DateTime.ParseExact(FromDt, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateTime dtTo = DateTime.ParseExact(ToDt, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                strFrom = dtFrom.ToString("yyyy-MM-dd");
                strTo = dtTo.ToString("yyyy-MM-dd");
            }
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<ISDMasterBll> retuT = new List<ISDMasterBll>();
            ds = dal.GetISDApproveList(ddlFilterType, FilterValue, strFrom, strTo, startindex, EndIndex, ApproveStatus);
            string strPAN = ConfigurationManager.AppSettings["PAN"];
            string strAdhaar = ConfigurationManager.AppSettings["ADHAAR"];
            string strBank = ConfigurationManager.AppSettings["BANK"];
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                ISDMasterBll del = new ISDMasterBll();
                del.P_ISDCode = Convert.ToString(dr["ISDCode"]);
                del.P_DealerName = Convert.ToString(dr["DealerName"]);
                del.P_Name = Convert.ToString(dr["Name"]);
                del.P_MobileNo = Convert.ToString(dr["MobileNo"]);
                del.P_EmailId = Convert.ToString(dr["EmailId"]);
                del.P_State = Convert.ToString(dr["State"]);
                del.P_District = Convert.ToString(dr["District"]);
                del.P_Town = Convert.ToString(dr["Town"]);
                del.P_AdharNo = Convert.ToString(dr["AdharNo"]);
                del.P_PANNO = Convert.ToString(dr["PANNO"]);
                del.P_BankName = Convert.ToString(dr["BankName"]);
                del.P_BankACNo = Convert.ToString(dr["BankACNo"]);
                del.P_UPINo = Convert.ToString(dr["UPINo"]);
                del.P_IFSCCode = Convert.ToString(dr["IFSCCode"]);
                del.P_KYCApproved = Convert.ToString(dr["KYCApproved"]);
                del.P_Reason = Convert.ToString(dr["Reason"]);
                del.P_KYCApprovedate = Convert.ToString(dr["KYCApprovedate"]);
                del.P_AggreementAccepted = Convert.ToString(dr["AggreementAccepted"]);
                del.P_AcceptedDate = Convert.ToString(dr["AcceptedDate"]);
                if (File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/ISDDocs/ISDADHAAR/ADHAAR_" + dr["ISDCode"] + ".jpg")))
                {
                    del.P_AdharFilePath = strAdhaar + "ADHAAR_" + dr["ISDCode"] + ".jpg";
                }
                else
                {
                    del.P_AdharFilePath = "PageNotFound.aspx";
                }
                if (File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/ISDDocs/ISDPAN/PAN_" + dr["ISDCode"] + ".jpg")))
                {
                    del.P_PANFilePath = strPAN + "PAN_" + dr["ISDCode"] + ".jpg";
                }
                else
                {
                    del.P_PANFilePath = "PageNotFound.aspx";
                }
                
                if (File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/ISDDocs/ISDBANK/BANK_" + dr["ISDCode"] + ".jpg")))
                {
                    del.P_ChequeFilePath = strBank + "BANK_" + dr["ISDCode"] + ".jpg";
                }
                else
                {
                    del.P_ChequeFilePath = "PageNotFound.aspx";
                }


                retuT.Add(del);
            }
            return retuT;
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetReasonDll()
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetISDRejectionReasonList();
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["ReasonCode"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["Reason"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }

        [WebMethod(EnableSession = true)]
        public static string GetApproveDetails(string ISDCode)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ISDMasterBll ord = new ISDMasterBll();
            List<ISDMasterBll> pdt = new List<ISDMasterBll>();
            ds = dal.GetISDDetails(ISDCode);
            if (ds.Tables[0].Rows.Count > 0)
            {
                ord.P_KYCApproved = Convert.ToString(ds.Tables[0].Rows[0]["KYCApproved"]);
                ord.P_Reason = Convert.ToString(ds.Tables[0].Rows[0]["RejectionReson"]);
                ord.P_KYCApprovedate = Convert.ToString(ds.Tables[0].Rows[0]["KYCApprovedate"]);
                ord.P_ApproveBy = Convert.ToString(ds.Tables[0].Rows[0]["KYCApproveBy"]);
                ord.P_ApproveRemarks = Convert.ToString(ds.Tables[0].Rows[0]["ApproveRemarks"]);


            }


            string oApproveBll = JsonConvert.SerializeObject(new { ApproveDetails = ord });
            return oApproveBll;
        }



        [WebMethod(EnableSession = true)]
        public static string SaveApproveDetails(List<ISDMasterBll> oApproveBll)
        {

            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ISDMasterBll obll = new ISDMasterBll();
            foreach (ISDMasterBll oPBLL in oApproveBll)
            {
                obll.P_ISDCode = oPBLL.P_ISDCode;
                obll.P_KYCApproved = oPBLL.P_KYCApproved;
                obll.P_ApproveBy = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_Reason = oPBLL.P_Reason;
                obll.P_KYCApprovedate = oPBLL.P_KYCApprovedate;
                obll.P_ApproveRemarks = oPBLL.P_ApproveRemarks;

                ds = dal.SaveISDApproveDetails(obll);
                retu = "Approval Details Saved Sucessfully";

            }


            return retu;
        }

        protected void GenExcel_ServerClick(object sender, EventArgs e)
        {
            int cnt = Convert.ToInt32(HttpContext.Current.Session["InvoiceCnt"]);
            DataSet dsExcel = new DataSet();
            CDal dal = new CDal();

            string ddlFilterType = null;
            string FilterValue = null;
            string strFrom = null;
            string strTo = null;
            if (hdfromdt.Value != "" && hdtodt.Value != "")
            {
                DateTime dtFrom = DateTime.ParseExact(hdfromdt.Value, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateTime dtTo = DateTime.ParseExact(hdtodt.Value, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                strFrom = dtFrom.ToString("yyyy-MM-dd");
                strTo = dtTo.ToString("yyyy-MM-dd");
            }
            if (hdFilterType.Value != "")
            {
                ddlFilterType = hdFilterType.Value;
            }
            if (hdFilterValue.Value != "")
            {
                FilterValue = hdFilterValue.Value;
            }
            dsExcel = dal.GetISDApproveList(ddlFilterType, FilterValue, strFrom, strTo, 0, cnt, hdApproveStatus.Value);
            if (dsExcel.Tables.Count != 0)
            {
                string Reportname = "ISDList";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(dsExcel.Tables[0], "ISDList");

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