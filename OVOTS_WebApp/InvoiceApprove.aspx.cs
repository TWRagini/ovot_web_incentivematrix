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
    public partial class InvoiceApprove : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if(!IsPostBack)
            {
                
                if (Session["UserName"] == null)
                {
                    Response.Redirect("Default.aspx");
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public static string GetInvoiceCnt(string ddlFilterType, string FilterValue, string FromDt, string ToDt, string ApproveStatus)
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
            ds = dal.GetInvoiceApproveListGroup(ddlFilterType, FilterValue, strFrom, strTo, 0, 0, ApproveStatus);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }

            HttpContext.Current.Session["InvoiceCnt"] = cnt;
            return cnt;
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
            dsExcel = dal.GetInvoiceApproveListGroup(ddlFilterType, FilterValue, strFrom,strTo,0, cnt,hdApproveStatus.Value);
            if (dsExcel.Tables.Count != 0)
            {
                dsExcel.Tables[0].Columns.Remove("InvoiceFilePath"); 
                    dsExcel.Tables[0].Columns.Remove("ActionId");
                dsExcel.Tables[0].Columns["CreatedDate"].ColumnName = "Entry Date";
                dsExcel.Tables[0].AcceptChanges();
                string Reportname = "InvoiceList";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(dsExcel.Tables[0], "InvoiceList");

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