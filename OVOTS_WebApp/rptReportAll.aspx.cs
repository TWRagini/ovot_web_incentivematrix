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
    public partial class rptReportAll : System.Web.UI.Page
    {
        CDal dal = new CDal();
        DataSet DSGet = new DataSet();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                string strReportType = Convert.ToString(Request.QueryString["id"]);
                if (strReportType == "DealerInvoice")
                {
                    rptType.Visible = false;

                }
                if (strReportType == "Issue")
                {
                    ddlFilterType.Items.Clear();
                    ddlFilterType.Items.Insert(0, new ListItem("Select", ""));
                    ddlFilterType.Items.Insert(1, new ListItem("Dealer", "Dealer"));
                    ddlFilterType.Items.Insert(2, new ListItem("IssueType", "IssueType"));
                    ddlFilterType.Items.Insert(3, new ListItem("Status", "Status"));
                    ddlFilterType.Items.Insert(4, new ListItem("PendingWith", "PendingWith"));
                    rptType.Visible = false;
                    lblheading.InnerText = "Issue Report";
                    //grdReport.Width = 400;

                    BindReportGrid(); //Update On Page Load Data Display 
                }
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
            string FiltrType = null;
            string Filtervalue = null;
            string strReportType = Convert.ToString(Request.QueryString["id"]);
            string ReportTyepe = ddlReportType.Value;
            string ReportName = strReportType;
            string UserRoll = Convert.ToString(Session["UserRole"]); // New Implementation
            string MobNo = Convert.ToString(Session["UserID"]); // New Implementation
            if (ReportName == "DealerInvoice")
            {
                ReportTyepe = Convert.ToString(Session["UserID"]);

            }
            if (FromDate.Value != "" && ToDate.Value != "")
            {
                DateTime dtFrom = DateTime.ParseExact(FromDate.Value, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateTime dtTo = DateTime.ParseExact(ToDate.Value, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                strFrom = dtFrom.ToString("yyyy-MM-dd");
                strTo = dtTo.ToString("yyyy-MM-dd");
            }
            if (ddlFilterType.Value != "")
            {
                FiltrType = ddlFilterType.Value;
            }
            if (FilterValue.Value != "")
            {
                Filtervalue = FilterValue.Value;
            }

            DSGet = dal.GetReport(FiltrType, Filtervalue, strFrom, strTo, ReportTyepe, ReportName, UserRoll, MobNo);
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
            string FiltrType = null;
            string Filtervalue = null;
            string strReportType = Convert.ToString(Request.QueryString["id"]);
            string ReportTyepe = ddlReportType.Value;
            string ReportName = strReportType;
            string UserRoll = Convert.ToString(Session["UserRole"]);
            string MobNo = Convert.ToString(Session["UserID"]);
            if (ReportName == "DealerInvoice")
            {
                ReportTyepe = Convert.ToString(Session["UserID"]);

            }
            if (FromDate.Value != "" && ToDate.Value != "")
            {
                DateTime dtFrom = DateTime.ParseExact(FromDate.Value, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateTime dtTo = DateTime.ParseExact(ToDate.Value, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                strFrom = dtFrom.ToString("yyyy-MM-dd");
                strTo = dtTo.ToString("yyyy-MM-dd");
            }
            if (ddlFilterType.Value != "")
            {
                FiltrType = ddlFilterType.Value;
            }
            if (FilterValue.Value != "")
            {
                Filtervalue = FilterValue.Value;
            }

            dsExcel = dal.GetReport(FiltrType, Filtervalue, strFrom, strTo, ReportTyepe, ReportName, UserRoll, MobNo);

            if (dsExcel.Tables.Count != 0)
            {
                string Reportname = strReportType;
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