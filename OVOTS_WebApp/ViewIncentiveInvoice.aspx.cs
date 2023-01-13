using ClosedXML.Excel;
using Newtonsoft.Json;
using OVOTS_WebApp.Bll;
using OVOTS_WebApp.Dal;
using System;
using System.Collections.Generic;
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
    public partial class ViewIncentiveInvoice : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {

                if (Session["UserName"] == null)
                {
                    Response.Redirect("Default.aspx");
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public static string GetISDInvoiceCnt( string FromDt, string ToDt)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            string cnt = "0";
            HttpContext.Current.Session["InvoiceCnt"] = "0";
           
            string strFrom = null;
            string strTo = null;
            if (FromDt != "" && ToDt != "")
            {
                DateTime dtFrom = DateTime.ParseExact(FromDt, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateTime dtTo = DateTime.ParseExact(ToDt, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                strFrom = dtFrom.ToString("yyyy-MM-dd");
                strTo = dtTo.ToString("yyyy-MM-dd");
            }
            ds = dal.GetISDInvoiceList( strFrom, strTo, 0, 0);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }

            HttpContext.Current.Session["InvoiceCnt"] = cnt;
            return cnt;
        }

        [WebMethod(EnableSession = true)]
        public static List<InvoiceRef> GetISDInvoiceList( string FromDt, string ToDt, int startindex, int EndIndex)
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
            ds = dal.GetISDInvoiceList( strFrom, strTo, startindex, EndIndex);
         
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                InvoiceRef retu = new InvoiceRef();
                retu.InvoiceCode = dr["InvoiceCode"].ToString();
                retu.ISDCode = dr["ISDCode"].ToString();
                retu.InvoiceForDate = dr["InvoiceForDate"].ToString();
                retu.FilePath = dr["FilePath"].ToString();
                retu.CreatedDate = dr["CreatedDate"].ToString();
                retu.ISDName = dr["ISDName"].ToString();
               
                retuT.Add(retu);
            }
            return retuT;
        }


        public class InvoiceRef
        {
            public string InvoiceCode { get; set; }

            public string ISDCode { get; set; }
            public string InvoiceForDate { get; set; }
            public string FilePath { get; set; }
            public string CreatedDate { get; set; }
            public string ISDName { get; set; }
           

        }
    }
}