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
    public partial class RPTKYCStatus : System.Web.UI.Page
    {
        CDal dal = new CDal();
        DataSet DSGet = new DataSet();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {

            }
        }

        protected void clkSearch_ServerClick(object sender, EventArgs e)
        {
            BindReportGrid();
        }

        private void BindReportGrid()
        {
            string strFrom = null;
            string strTo = null;

            string ReportName = "Date Wise Rejected Invoice";

            if (FromDate.Value != "" && ToDate.Value != "")
            {
                DateTime dtFrom = DateTime.ParseExact(FromDate.Value, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateTime dtTo = DateTime.ParseExact(ToDate.Value, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                strFrom = dtFrom.ToString("yyyy-MM-dd");
                strTo = dtTo.ToString("yyyy-MM-dd");
            }


            string Status = null;
            if (ApproveStatus.Value != "")
            {
                Status = ApproveStatus.Value;
            }
            DSGet = dal.GetRPTISDApproveList(strFrom, strTo, Status);
            if (DSGet.Tables[0].Rows.Count > 0)
            {
                grdReport.DataSource = DSGet.Tables[0];
                grdReport.DataBind();
                lblNotFound.Text = "";
                // lblCount.Text = DSGet.Tables[0].Rows.Count.ToString();
            }
            else
            {
                DataTable dt = DSGet.Tables[0];
                grdReport.DataSource = dt;
                grdReport.DataBind();
                lblNotFound.Text = "No data Found";
                // lblCount.Text = "0";
            }

        }

        protected void grdReport_PageIndexChanging(object sender, GridViewPageEventArgs e)
        {

            grdReport.PageIndex = e.NewPageIndex;

            BindReportGrid();
        }

        protected void GenExcel_ServerClick(object sender, EventArgs e)
        {
            DataSet dsExcel = new DataSet();
            CDal dal = new CDal();

            string strFrom = null;
            string strTo = null;

            string ReportName = "KYC Status Report";

            if (FromDate.Value != "" && ToDate.Value != "")
            {
                DateTime dtFrom = DateTime.ParseExact(FromDate.Value, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateTime dtTo = DateTime.ParseExact(ToDate.Value, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                strFrom = dtFrom.ToString("yyyy-MM-dd");
                strTo = dtTo.ToString("yyyy-MM-dd");
            }
            string Status = null;
            if(ApproveStatus.Value != "")
            {
                Status = ApproveStatus.Value;
            }
            dsExcel = dal.GetRPTISDApproveList( strFrom, strTo, Status);

            if (dsExcel.Tables.Count != 0)
            {
                string Reportname = ReportName;
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(dsExcel.Tables[0], Reportname);

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