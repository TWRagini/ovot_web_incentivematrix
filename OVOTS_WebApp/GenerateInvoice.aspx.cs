using ClosedXML.Excel;
using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
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
    public partial class GenerateInvoice : System.Web.UI.Page
    {
        CDal dal = new CDal();
        DataSet DSGet = new DataSet();
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void clkSearch_ServerClick(object sender, EventArgs e)
        {
            lblSucess.Visible = false;
            lblError.Visible = false;
            DateTime dtFrom = DateTime.ParseExact(txtDate.Value, "dd/MM/yyyy", CultureInfo.InvariantCulture);
            string strFrom = dtFrom.ToString("yyyy-MM-dd");
            DataSet ds = new DataSet();
            ds = dal.CheckISDInvoice(strFrom);
            if (ds.Tables[0].Rows.Count > 0)
            {
                lblError.Text = "Invoice Already Generated For Given Date!";
                lblError.Visible = true;
            }
            else
            {
                ScriptManager.RegisterStartupScript(this, this.GetType(), "ShowLoader", "ShowLoader();", true);
                ds = dal.GetIsdForInvoice(strFrom);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    String ISDCnt = ds.Tables[0].Rows.Count.ToString();
                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        string ISDCode = ds.Tables[0].Rows[i]["ISDCode"].ToString();
                        string Name = Convert.ToString(ds.Tables[0].Rows[i]["Name"]);
                        string PanNo = Convert.ToString(ds.Tables[0].Rows[i]["PANNO"]);
                        
                        DSGet = dal.GetIsdInvoice(strFrom, ISDCode);

                        if (DSGet.Tables[0].Rows.Count > 0)
                        {
                            string TemplateName = Server.MapPath("~/Template/InvoiceTemplate.html");
                            string FileName = ISDCode + "_" + dtFrom.ToString("dd-MMM-yyyy") + "_Invoice.pdf";
                            string strContent = File.ReadAllText(TemplateName);
                            string output = "";
                            if (strContent.Contains("{NAME}"))
                            {
                                strContent = strContent.Replace("{NAME}", Name);
                            }
                            if (strContent.Contains("{PANNO}"))
                            {
                                strContent = strContent.Replace("{PANNO}", PanNo);
                            }
                            if (strContent.Contains("{DATE}"))
                            {
                                strContent = strContent.Replace("{DATE}", dtFrom.ToString("dd-MMM-yyyy"));
                            }
                            if (strContent.Contains("{INVOICENO}"))
                            {
                                strContent = strContent.Replace("{INVOICENO}", "INV_"+ ISDCode + "_" + dtFrom.ToString("ddmmyyyy"));
                            }
                            string AllRows = "";
                            int Total = 0;
                            for (int j = 0; j < DSGet.Tables[0].Rows.Count; j++)
                            {
                                string Description = "<tr style='height: 35px;'> <td style='height: 35px;border: 1px solid black;' colspan='1'> <p>&nbsp;&nbsp;{SRNO}</p></td><td style='height: 35px;border: 1px solid black;' colspan='3'> <p>&nbsp;&nbsp;{DESCRIPTON}</p></td><td style='height: 35px;border: 1px solid black;' colspan='2'> <p>&nbsp;&nbsp;{INVOICENO}</p></td><td style='height: 35px;border: 1px solid black;text-align:right' colspan='1'> <p>&nbsp;&nbsp;{AMOUNT}</p></td></tr>";
                                if (Description.Contains("{SRNO}"))
                                {
                                    Description = Description.Replace("{SRNO}", DSGet.Tables[0].Rows[j]["SRNO"].ToString());
                                }
                                if (Description.Contains("{DESCRIPTON}"))
                                {
                                    string Desc = DSGet.Tables[0].Rows[j]["ProductCat"].ToString() + " - " + DSGet.Tables[0].Rows[j]["SubCat"].ToString() + " - " + DSGet.Tables[0].Rows[j]["Model"].ToString() + " - " + DSGet.Tables[0].Rows[j]["ProductSrNo"].ToString();
                                    Description = Description.Replace("{DESCRIPTON}", Desc);
                                }
                                if (Description.Contains("{INVOICENO}"))
                                {
                                    Description = Description.Replace("{INVOICENO}", DSGet.Tables[0].Rows[j]["InvoiceNo"].ToString());
                                }
                                if (Description.Contains("{AMOUNT}"))
                                {
                                    Description = Description.Replace("{AMOUNT}", DSGet.Tables[0].Rows[j]["IncentiveAmt"].ToString());
                                }
                                Total = Total + Convert.ToInt32(DSGet.Tables[0].Rows[j]["IncentiveAmt"]);
                                AllRows = AllRows + Description;
                            }
                            if (strContent.Contains("{CONTENT}"))
                            {
                                strContent = strContent.Replace("{CONTENT}", AllRows);
                            }
                            if (strContent.Contains("{TOTAL}"))
                            {
                                strContent = strContent.Replace("{TOTAL}", Total.ToString());
                            }

                           output = strContent;

                            string path = Server.MapPath("~/IncentiveInvoice/" + FileName);

                            StringReader sr = new StringReader(output.ToString());

                            Document pdfDoc = new Document(PageSize.A4, 20f, 20f, 20f, 10f);

                            HTMLWorker htmlparser = new HTMLWorker(pdfDoc);

                            using (MemoryStream memoryStream = new MemoryStream())
                            {
                                PdfWriter writer = PdfWriter.GetInstance(pdfDoc, memoryStream);
                                pdfDoc.Open();

                                htmlparser.Parse(sr);

                                pdfDoc.Close();

                                byte[] bytes = memoryStream.ToArray();

                                memoryStream.Close();
                                System.IO.File.WriteAllBytes(path, bytes);

                            }

                            DataSet dsInsert = new DataSet();
                            string FilePath = "IncentiveInvoice/" + FileName;
                            dsInsert = dal.InsertISDInvoice("0", ISDCode, strFrom, FilePath, "ADMIN", dal.GetIPAddress());
                        }
                    }

                    lblSucess.Text = ISDCnt + " ISD Invoice Generated For Given Date!";
                    lblSucess.Visible = true;
                    ScriptManager.RegisterStartupScript(this, this.GetType(), "Success", "Success(" + ISDCnt + ");", true);
                }
                else
                {
                    lblError.Text = "No Invoice found For Given Date!";
                    lblError.Visible = true;
                }
            }

        }
    }
}