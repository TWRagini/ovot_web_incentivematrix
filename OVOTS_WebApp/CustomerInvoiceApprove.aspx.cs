using Newtonsoft.Json;
using OVOTS_WebApp.Bll;
using OVOTS_WebApp.Dal;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace OVOTS_WebApp
{
    public partial class CustomerInvoiceApprove : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static List<InvoiceRef> GetInvoiceApproveList(string ddlFilterType, string FilterValue, string FromDt, string ToDt)
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
            List<InvoiceRef> retuT = new List<InvoiceRef>();
            string strDomain = ConfigurationManager.AppSettings["Domain"];
            ds = dal.GetCustomerApproveList(ddlFilterType, FilterValue, strFrom, strTo);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                InvoiceRef retu = new InvoiceRef();
                retu.UploadCode = dr["UploadCode"].ToString();
                retu.InvoiceNo = dr["InvoiceNo"].ToString();
                
                retu.ProductSrNo = dr["ProductSrNo"].ToString();
                retu.Model = dr["Model"].ToString();
                retu.Dealer = dr["Dealer"].ToString();
                retu.ISD = dr["ISD"].ToString();
                retu.Customer = dr["Customer"].ToString();
                retu.MobileNo = dr["MobileNo"].ToString();
                string DealerCode = dr["DealerCode"].ToString();
                string InvoiceDate = dr["InvoiceDate"].ToString();
                DateTime dt = Convert.ToDateTime(InvoiceDate);
                DateTime dtcom = Convert.ToDateTime("2022-06-29");
                if (dt < dtcom)
                {
                    retu.InvoiceFilePath = strDomain + dr["InvoiceNo"].ToString() +  ".jpg";
                }
                else
                {
                    retu.InvoiceFilePath = strDomain + dr["InvoiceNo"].ToString() + "_" + DealerCode + "_" + InvoiceDate + ".jpg";
                }
                retu.IncentiveAmt = dr["IncentiveAmt"].ToString();
                retu.ApproveStatus = dr["ApproveStatus"].ToString();
                retu.ApproveBy = dr["ApproveBy"].ToString();
                retu.Reason = dr["Reason"].ToString();
                retu.ApproveDate = dr["ApproveDate"].ToString();
              
                retuT.Add(retu);
            }
            return retuT;
        }

       
        [WebMethod(EnableSession = true)]
        public static List<InvoiceRef> GetInvoiceApproveListGroup(string ddlFilterType, string FilterValue, string FromDt, string ToDt, int startindex, int EndIndex, string ApproveStatus)
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
            List<InvoiceRef> retuT = new List<InvoiceRef>();
            ds = dal.GetInvoiceApproveListGroup(ddlFilterType, FilterValue, strFrom, strTo, startindex,EndIndex, ApproveStatus);
            string strDomain = ConfigurationManager.AppSettings["Domain"];
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                InvoiceRef retu = new InvoiceRef();
                retu.UploadCode = dr["UploadCode"].ToString();
                retu.ActionId = dr["ActionId"].ToString();
                retu.InvoiceNo = dr["InvoiceNo"].ToString();
                retu.InvoiceDate = dr["InvoiceDate"].ToString();
                retu.Dealer = dr["Dealer"].ToString();
                retu.ISD = dr["ISD"].ToString();
                retu.ISDEmailId = dr["EmailId"].ToString();
                retu.ISDAdhar = dr["AdharNo"].ToString();
                retu.PAN = dr["PANNO"].ToString();
                retu.BankName = dr["BankName"].ToString();
                retu.BankACNo = dr["BankACNo"].ToString();
                retu.IFSC = dr["IFSCCode"].ToString();
                retu.UPINo = dr["UPINo"].ToString();
                retu.Customer = dr["Customer"].ToString();
                retu.MobileNo = dr["MobileNo"].ToString();
                string DealerCode = dr["DealerCode"].ToString();
                string InvoiceDate = dr["InvoiceDate"].ToString();
                DateTime dt = Convert.ToDateTime(InvoiceDate);
                DateTime dtcom = Convert.ToDateTime("2022-08-15");
                retu.InvoiceFilePath = strDomain + dr["InvoiceNo"].ToString() + ".jpg";
                //if (dt < dtcom)
                //{
                //    retu.InvoiceFilePath = strDomain + dr["InvoiceNo"].ToString() + ".jpg";
                //}
                //else
                //{
                //    retu.InvoiceFilePath = strDomain + dr["InvoiceNo"].ToString() + "_" + DealerCode + "_" + dt.Date.ToString("yyyy-MM-dd") + ".jpg";
                //}
                retu.IncentiveAmt = dr["IncentiveAmt"].ToString();
                retu.ApproveStatus = dr["ApproveStatus"].ToString();
                retu.ApproveBy = dr["ApproveBy"].ToString();
                retu.Reason = dr["Reason"].ToString();
                retu.ApproveDate = dr["ApproveDate"].ToString();
               

                retuT.Add(retu);
            }
            return retuT;
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetReasonDll()
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetRejectionReasonList();
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
        public static string GetApproveDetails(string UploadCode)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            InvoiceApproveBll ord = new InvoiceApproveBll();
            List<InvoiceApproveBll> pdt = new List<InvoiceApproveBll>();
            ds = dal.GetApproveDetails(UploadCode);
            if (ds.Tables[0].Rows.Count > 0)
            {
                ord.P_UploadCode = Convert.ToString(ds.Tables[0].Rows[0]["UploadCode"]);
                ord.P_ApproveStatus = Convert.ToString(ds.Tables[0].Rows[0]["ApproveStatus"]);
                ord.P_RejectionReason = Convert.ToString(ds.Tables[0].Rows[0]["RejectionReason"]);
                ord.P_ApproveBy = Convert.ToString(ds.Tables[0].Rows[0]["ApproveBy"]);

                ord.P_ApproveDate = Convert.ToString(ds.Tables[0].Rows[0]["ApproveDate"]);
                ord.P_Remarks = Convert.ToString(ds.Tables[0].Rows[0]["Remarks"]);

            }


            string oApproveBll = JsonConvert.SerializeObject(new { ApproveDetails = ord});
            return oApproveBll;
        }

        [WebMethod(EnableSession = true)]
        public static string GetApproveDetailsByNo(string InvoiceNo, string Status, string ActionId)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            InvoiceApproveBll ord = new InvoiceApproveBll();
            List<InvoiceApproveBll> pdt = new List<InvoiceApproveBll>();
            string Action = ActionId.Trim();
            if (ActionId.Trim() == "(NULL)" || ActionId.Trim() == "" || ActionId == null)
            {
                Action = null;
            }
            ds = dal.GetApproveDetailsByNo(InvoiceNo, Status, Action);
            if (ds.Tables[0].Rows.Count > 0)
            {
                ord.P_InvoiceNo = Convert.ToString(ds.Tables[0].Rows[0]["InvoiceNo"]);
                ord.P_ApproveStatus = Convert.ToString(ds.Tables[0].Rows[0]["ApproveStatus"]);
                ord.P_RejectionReason = Convert.ToString(ds.Tables[0].Rows[0]["RejectionReason"]);
                ord.P_ApproveBy = Convert.ToString(ds.Tables[0].Rows[0]["ApproveBy"]);

                ord.P_ApproveDate = Convert.ToString(ds.Tables[0].Rows[0]["ApproveDate"]);
                ord.P_Remarks = Convert.ToString(ds.Tables[0].Rows[0]["Remarks"]);

            }


            string oApproveBll = JsonConvert.SerializeObject(new { ApproveDetails = ord });
            return oApproveBll;
        }

        [WebMethod(EnableSession = true)]
        public static List<CustomerInvoiceBll> GetApproveProduct(string InvoiceNo, string Status, string ActionId)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            InvoiceApproveBll ord = new InvoiceApproveBll();
            List<CustomerInvoiceBll> retuT = new List<CustomerInvoiceBll>();
            string Action = ActionId.Trim();
            if (ActionId.Trim() == "(NULL)" || ActionId.Trim() == "" || ActionId == null)
            {
                Action = null;
            }
            ds = dal.GetApproveProduct(InvoiceNo, Status, Action);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                CustomerInvoiceBll del = new CustomerInvoiceBll();
                del.P_UploadCode = Convert.ToString(dr["UploadCode"]);
                del.P_InvoiceNo = Convert.ToString(dr["InvoiceNo"]);
                del.P_ProductCode = Convert.ToString(dr["ProductCode"]);
                del.P_ProductSrNo = Convert.ToString(dr["ProductSrNo"]);
                del.P_ProductCat = Convert.ToString(dr["ProductCat"]);
                del.P_SubCat = Convert.ToString(dr["SubCat"]);
                del.P_Model = Convert.ToString(dr["Model"]);
                del.P_Dealer = Convert.ToString(dr["Dealer"]);
                del.P_Customer = Convert.ToString(dr["Customer"]);
                del.P_MobileNo = Convert.ToString(dr["MobileNo"]);
                del.P_ISDCode = Convert.ToString(dr["ISDCode"]);
                del.P_ISDName = Convert.ToString(dr["ISDName"]);
               
                del.P_IncentiveAmt = Convert.ToString(dr["IncentiveAmt"]);

                del.P_Remarks = Convert.ToString(dr["Remarks"]);
                del.P_Active = Convert.ToString(dr["Active"]);

                retuT.Add(del);
            }


            return retuT;
        }

        [WebMethod(EnableSession = true)]
        public static string SaveApproveDetails(List<InvoiceApproveBll> oApproveBll)
        {

            string retu = "";
           
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            InvoiceApproveBll obll = new InvoiceApproveBll();
            foreach (InvoiceApproveBll oPBLL in oApproveBll)
            {
                obll.P_UploadCode = oPBLL.P_UploadCode;
                obll.P_ApproveStatus = oPBLL.P_ApproveStatus;
                obll.P_ApproveBy = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_RejectionReason = oPBLL.P_RejectionReason;
                obll.P_ApproveDate = oPBLL.P_ApproveDate;
                obll.P_Remarks = oPBLL.P_Remarks;

                ds = dal.SaveApproveDetails(obll);
                retu = "Approval Details Saved Sucessfully";

            }


            return retu;
        }

        [WebMethod(EnableSession = true)]
        public static string SaveApproveStatus(List<InvoiceApproveBll> oApproveBll)
        {
            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            InvoiceApproveBll obll = new InvoiceApproveBll();
            foreach (InvoiceApproveBll oPBLL in oApproveBll)
            {
                obll.P_InvoiceNo = oPBLL.P_InvoiceNo;
                obll.P_ApproveStatus = oPBLL.P_ApproveStatus;
                obll.P_ApproveBy = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_RejectionReason = oPBLL.P_RejectionReason;
                obll.P_ApproveDate = oPBLL.P_ApproveDate;
                obll.P_Remarks = oPBLL.P_Remarks;

                ds = dal.SaveApproveStatus(obll);
                retu = "Approval Details Saved Sucessfully";

            }


            return retu;
        }
        public class InvoiceRef
        {
            public string ProductSrNo { get; set; }

            public string UploadCode { get; set; }
            public string ActionId { get; set; }
            public string InvoiceNo { get; set; }
            public string InvoiceDate { get; set; }
            public string Model { get; set; }
            public string Dealer { get; set; }
            public string ISD { get; set; }
            public string ISDAdhar { get; set; }
            public string PAN { get; set; }
            public string BankName { get; set; }
            public string IFSC { get; set; }
            public string ISDEmailId { get; set; }
            
            public string BankACNo { get; set; }
            public string UPINo { get; set; }
            public string Customer { get; set; }
            public string MobileNo { get; set; }
            public string InvoiceFilePath { get; set; }
            public string IncentiveAmt { get; set; }
            public string ApproveStatus { get; set; }
            public string ApproveBy { get; set; }
            public string Reason { get; set; }
            public string ApproveDate { get; set; }
            public string Remarks { get; set; }
            public string CreatedDate { get; set; }

        }
    }
}