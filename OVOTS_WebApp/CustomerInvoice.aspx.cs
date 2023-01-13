using Newtonsoft.Json;
using OVOTS_WebApp.Bll;
using OVOTS_WebApp.Dal;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace OVOTS_WebApp
{
    public partial class CustomerInvoice : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static List<CustomerInvoiceBll> GetInvoiceList(string ddlFilterType, string FilterValue, int startindex, int EndIndex)
        {

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<CustomerInvoiceBll> retuT = new List<CustomerInvoiceBll>();
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetInvoiceList(ddlFilterType, FilterValue, startindex, EndIndex);
            string strDomain = ConfigurationManager.AppSettings["Domain"];
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                CustomerInvoiceBll retu = new CustomerInvoiceBll();
                //retu.P_UploadCode = dr["UploadCode"].ToString();
                retu.P_InvoiceNo = dr["InvoiceNo"].ToString();
                retu.P_Customer = dr["Customer"].ToString();
                retu.P_MobileNo = dr["MobileNo"].ToString();
                retu.P_ISDName = dr["ISDName"].ToString();
                retu.P_InvoiceFilePath = strDomain + dr["InvoiceNo"].ToString() + ".jpg";
                retu.P_Remarks = "";
                retu.P_Active = dr["Active"].ToString();


                retuT.Add(retu);
            }
            return retuT;
        }

        [WebMethod(EnableSession = true)]
        public static List<CustomerInvoiceBll> GetInvoiceDetails(string P_InvoiceNo)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            //CustomerInvoiceBll del = new CustomerInvoiceBll();
            List<CustomerInvoiceBll> retuT = new List<CustomerInvoiceBll>();
            ds = dal.GetInvoiceDetails(P_InvoiceNo);
            string strDomain = ConfigurationManager.AppSettings["Domain"];
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
                del.P_InvoiceFilePath = strDomain +  Convert.ToString(dr["InvoiceNo"]) + ".jpg";
                del.P_IncentiveAmt = Convert.ToString(dr["IncentiveAmt"]);
            
                del.P_Remarks = Convert.ToString(dr["Remarks"]);
                del.P_Active = Convert.ToString(dr["Active"]);

                retuT.Add(del);
            }


            return retuT;
        }

        [WebMethod(EnableSession = true)]
        public static string GetInvoiceCnt(string ddlFilterType, string FilterValue)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            string cnt = "0";
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetInvoiceList(ddlFilterType, FilterValue, 0, 0);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }


            return cnt;
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetISDDll()
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetISDDll();
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["ISDCode"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["Name"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetProductDll()
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetProductDll();
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["ProductCode"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["Product"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }

        [WebMethod(EnableSession = true)]
        public static string SaveInvoiceMaster(List<CustomerInvoiceBll> oDealerBll)
        {
            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            CustomerInvoiceBll obll = new CustomerInvoiceBll();
            foreach (CustomerInvoiceBll oPBLL in oDealerBll)
            {
                obll.P_InvoiceNo = oPBLL.P_InvoiceNo;
                obll.P_Customer = oPBLL.P_Customer;
                obll.P_MobileNo = oPBLL.P_MobileNo;
                obll.P_ISDCode = oPBLL.P_ISDCode;
              
                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_Active = "TRUE";
                obll.P_UserIP = "";

                ds = dal.SaveInvoiceMaster(obll);
                retu = "Invoice Details Saved Sucessfully";

            }


            return retu;
        }

        [WebMethod(EnableSession = true)]
        public static bool DeleteProduct(string UploadCode)
        {
            bool retu = true;
            DataSet ds = new DataSet();
            CDal dal = new CDal();

            ds = dal.DeleteInvoiceProduct(UploadCode);
            return retu;
        }

        [WebMethod(EnableSession = true)]
        public static string SaveInvoiceDetails(List<CustomerInvoiceBll> oDealerBll)
        {
            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            CustomerInvoiceBll obll = new CustomerInvoiceBll();
            foreach (CustomerInvoiceBll oPBLL in oDealerBll)
            {
                obll.P_UploadCode = oPBLL.P_UploadCode;
                obll.P_ProductCode = oPBLL.P_ProductCode;
                obll.P_ProductSrNo = oPBLL.P_ProductSrNo;
                obll.P_Model = oPBLL.P_Model;
                obll.P_Dealer = oPBLL.P_Dealer;
                obll.P_IncentiveAmt = oPBLL.P_IncentiveAmt;
                obll.P_Customer = oPBLL.P_Customer;
                obll.P_InvoiceNo = oPBLL.P_InvoiceNo;
                obll.P_MobileNo = oPBLL.P_MobileNo;
              
                obll.P_ISDCode = oPBLL.P_ISDCode;
                obll.P_Remarks = "";
                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_Active = "TRUE";
                obll.P_UserIP = "";

                ds = dal.SaveInvoiceDetails(obll);
                retu = "Invoice Details Saved Sucessfully";

            }


            return retu;
        }

        [WebMethod(EnableSession = true)]
        public static string CheckDuplicate(string TblName, string ColumnName, string Value)
        {
            string Prodd = "";
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.CheckDuplicate(TblName, ColumnName, Value);
            { if (ds.Tables[0].Rows[0][0].ToString() == "0") { Prodd = ds.Tables[0].Rows[0][0].ToString(); } }
            return Prodd;
        }
    }
}