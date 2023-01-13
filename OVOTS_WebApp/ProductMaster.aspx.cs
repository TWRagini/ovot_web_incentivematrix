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
    public partial class ProductMaster : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static List<ProductMasterBll> GetProductList(string ddlFilterType, string FilterValue, int startindex, int EndIndex)
        {

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<ProductMasterBll> retuT = new List<ProductMasterBll>();
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetProductList(ddlFilterType, FilterValue, startindex, EndIndex);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                ProductMasterBll retu = new ProductMasterBll();
                retu.P_ProductCode = dr["ProductCode"].ToString();
                retu.P_ProductCat = dr["ProductCat"].ToString();
                retu.P_SubCat = dr["SubCat"].ToString();
                retu.P_SerialNo = dr["SerialNo"].ToString();
                retu.P_Model = dr["Model"].ToString();
                retu.P_DealerCode = dr["DealerCode"].ToString();
                retu.P_DealerName = dr["Dealer"].ToString();
                retu.P_DealerNo = dr["DealerContactNo"].ToString();
                retu.P_State = dr["State"].ToString(); 
                retu.P_District = dr["District"].ToString();
                retu.P_Town = dr["Town"].ToString(); 
                retu.P_IncentiveAmt = dr["IncentiveAmt"].ToString();
                retu.P_DistributerName = dr["DistributerName"].ToString();
                retu.P_DistributerMobile = dr["DistributerMobile"].ToString();

                retuT.Add(retu);
            }
            return retuT;
        }
        [WebMethod(EnableSession = true)]
        public static string GetProductCnt(string ddlFilterType, string FilterValue)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            string cnt = "0";
            HttpContext.Current.Session["ProductCnt"] = "0";
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetProductList(ddlFilterType, FilterValue, 0, 0);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }

            HttpContext.Current.Session["ProductCnt"] = cnt;
            return cnt;
        }
        [WebMethod(EnableSession = true)]
        public static string GetProductDetails(string P_ProductCode)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ProductMasterBll del = new ProductMasterBll();

            ds = dal.GetProductDetails(P_ProductCode);
            if (ds.Tables[0].Rows.Count > 0)
            {
                del.P_ProductCode = ds.Tables[0].Rows[0]["ProductCode"].ToString();
                del.P_ProductCat = ds.Tables[0].Rows[0]["ProductCat"].ToString();
                del.P_SubCat = ds.Tables[0].Rows[0]["SubCat"].ToString();
                del.P_SerialNo = ds.Tables[0].Rows[0]["SerialNo"].ToString();
                del.P_Model = ds.Tables[0].Rows[0]["Model"].ToString();
                del.P_DealerCode = ds.Tables[0].Rows[0]["DealerCode"].ToString();
                del.P_DealerName = ds.Tables[0].Rows[0]["Dealer"].ToString();
                del.P_DealerNo = ds.Tables[0].Rows[0]["DealerContactNo"].ToString();
                del.P_State = Convert.ToString(ds.Tables[0].Rows[0]["State"]);
                del.P_District = Convert.ToString(ds.Tables[0].Rows[0]["District"]);
                del.P_Town = Convert.ToString(ds.Tables[0].Rows[0]["Town"]);
                del.P_IncentiveAmt = ds.Tables[0].Rows[0]["IncentiveAmt"].ToString();
                del.P_DistributerName = ds.Tables[0].Rows[0]["DistributerName"].ToString();
                del.P_DistributerMobile = ds.Tables[0].Rows[0]["DistributerMobile"].ToString();
                del.P_Active = Convert.ToString(ds.Tables[0].Rows[0]["Active"]);

            }


            string oProductBll = JsonConvert.SerializeObject(new { ProductDetails = del });
            return oProductBll;
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetDealerDll()
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetDealerDll();
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["DealerCode"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["Firmname"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetModelDll()
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetModelDll();
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["ModelCode"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["Model"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }

        [WebMethod(EnableSession = true)]
        public static string SaveProductDetails(List<ProductMasterBll> oDealerBll)
        {
            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ProductMasterBll obll = new ProductMasterBll();
            foreach (ProductMasterBll oPBLL in oDealerBll)
            {
                obll.P_ProductCode = oPBLL.P_ProductCode;
                obll.P_ProductCat = oPBLL.P_ProductCat;
                obll.P_SubCat = oPBLL.P_SubCat;
                obll.P_SerialNo = oPBLL.P_SerialNo;
                obll.P_Model = oPBLL.P_Model;
                obll.P_DealerCode = oPBLL.P_DealerCode;
                obll.P_IncentiveAmt = oPBLL.P_IncentiveAmt;
                obll.P_DistributerName = oPBLL.P_DistributerName;
                if(oPBLL.P_DistributerMobile == "")
                {
                    oPBLL.P_DistributerMobile = null;
                }
                obll.P_DistributerMobile = oPBLL.P_DistributerMobile;
                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_Active = oPBLL.P_Active;
                obll.P_UserIP = "";

                ds = dal.SaveProductDetails(obll);
                retu = "Dealer Details Saved Sucessfully";

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
            if (ds.Tables[0].Rows.Count > 0)
            { if (ds.Tables[0].Rows[0][0].ToString() == "0") { Prodd = ds.Tables[0].Rows[0][0].ToString(); } }
            return Prodd;
        }

        protected void clkUpload_ServerClick(object sender, EventArgs e)
        {
            //if (flupDocFilePath.HasFile)
            //{
            //    DataTable dtExcel = new DataTable();
            //    DataSet ds = new DataSet();
            //    CDal dal = new CDal();
            //    ViewState["UpdatedDt"] = "";
            //    ViewState["ErrorMsg"] = "";
            //    dtExcel = LoadExcelTodt();
            //    if (ValidateExcelData(dtExcel))
            //    {
            //        dtExcel = (DataTable)ViewState["UpdatedDt"];
            //        if (dtExcel.Rows.Count > 0)
            //        {
            //            for (int i = 0; i < dtExcel.Rows.Count; i++)
            //            {
            //                ProductMasterBll obll = new ProductMasterBll();
            //                obll.P_ProductCode = "0";
            //                obll.P_ProductCat = dtExcel.Rows[i]["ProductCat"].ToString();
            //                obll.P_SubCat = dtExcel.Rows[i]["SubCat"].ToString();
            //                obll.P_SerialNo = dtExcel.Rows[i]["SerialNo"].ToString();
            //                obll.P_Model = dtExcel.Rows[i]["Model"].ToString();
            //                obll.P_DealerCode = dtExcel.Rows[i]["Dealer Name"].ToString();
            //                obll.P_IncentiveAmt = dtExcel.Rows[i]["IncentiveAmt"].ToString();
            //                obll.P_DistributerName = dtExcel.Rows[i]["DistributerName"].ToString();
            //                obll.P_DistributerMobile = dtExcel.Rows[i]["DistributerMobile"].ToString();
            //                if (dtExcel.Rows[i]["DistributerMobile"].ToString() == "")
            //                {
            //                    obll.P_DistributerMobile = null;
            //                }


            //                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
            //                obll.P_Active = "TRUE";
            //                obll.P_UserIP = "";

            //                ds = dal.SaveProductDetails(obll);


            //            }
            //            divmsg.InnerHtml = "Product Data Uploaded..";
            //            ScriptManager.RegisterStartupScript(this, GetType(), "ShowMsg", "ShowMsg();", true);
            //        }

            //    }
            //    else
            //    {
            //        ScriptManager.RegisterStartupScript(this, GetType(), "ShowMsg", "ShowMsg();", true);
            //    }
            //}
            //else
            //{
            //    divmsg.InnerHtml = "Please select data file";
            //    ScriptManager.RegisterStartupScript(this, GetType(), "ShowMsg", "ShowMsg();", true);
            //}
        }

        private DataTable LoadExcelTodt()
        {
            DataTable dt = new DataTable();
            //string Ext = Path.GetExtension(flupDocFilePath.PostedFile.FileName);
            //if (Ext == ".xls" || Ext == ".xlsx")
            //{
            //    string Name = Path.GetFileName(flupDocFilePath.PostedFile.FileName);
            //    string FolderPath = "ExecelPath\\";
            //    string FilePath = Server.MapPath(FolderPath + Name);
            //    flupDocFilePath.SaveAs(FilePath);
            //    string connectionString = "";
            //    if (Ext == ".xls")
            //    {   //For Excel 97-03
            //        connectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source = " + FilePath + "; Extended Properties = 'Excel 8.0;HDR=Yes'";
            //    }
            //    else if (Ext == ".xlsx")
            //    {    //For Excel 07 and greater
            //        connectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source = " + FilePath + "; Extended Properties = 'Excel 8.0;HDR=Yes'";
            //    }

            //    //connectionString = String.Format(connectionString, FilePath);
            //    OleDbConnection conn = new OleDbConnection(connectionString);
            //    OleDbCommand cmd = new OleDbCommand();
            //    OleDbDataAdapter dataAdapter = new OleDbDataAdapter();

            //    cmd.Connection = conn;
            //    //Fetch 1st Sheet Name
            //    conn.Open();
            //    DataTable dtSchema;
            //    dtSchema = conn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
            //    string ExcelSheetName = dtSchema.Rows[0]["TABLE_NAME"].ToString();
            //    //  conn.Close();
            //    //Read all data of fetched Sheet to a Data Table
            //    //   conn.Open();
            //    cmd.CommandText = "SELECT * From [" + ExcelSheetName + "]";
            //    dataAdapter.SelectCommand = cmd;
            //    dataAdapter.Fill(dt);
            //    conn.Close();

            //    // System.Data.OleDb.OleDbConnection MyConnection;
            //    // System.Data.DataSet DtSet;
            //    // System.Data.OleDb.OleDbDataAdapter MyCommand;
            //    // MyConnection = new System.Data.OleDb.OleDbConnection("provider=Microsoft.Jet.OLEDB.12.0;Data Source="+ FilePath  + ";Extended Properties=Excel 12.0;");
            //    // MyCommand = new System.Data.OleDb.OleDbDataAdapter("select * from [Sheet1$]", MyConnection);
            //    //// MyCommand.TableMappings.Add("Table", "TestTable");
            //    // DtSet = new System.Data.DataSet();
            //    // MyCommand.Fill(DtSet);

            //    // MyConnection.Close();
            //    // return DtSet.Tables[0];

            //}
            return dt;
        }

        private Boolean ValidateExcelData(DataTable dtExcel)
        {
            string ValidMsg = "";
            DataTable dtEx = new DataTable();
            dtEx = dtExcel.Copy();
            DataSet ds = new DataSet();
            CDal dal = new CDal();

            List<string> ColumnName = (from dc in dtEx.Columns.Cast<DataColumn>()
                                       select dc.ColumnName.Trim()).ToList();
            DataSet dspay = new DataSet();
            dspay.Tables.Add(new DataTable());
            dspay.Tables[0].Columns.Add("ColumnName", typeof(string));
            DataRow dtrow = dspay.Tables[0].NewRow();
            dtrow["ColumnName"] = "ProductCat";
            dspay.Tables[0].Rows.Add(dtrow);
            DataRow dtrow2 = dspay.Tables[0].NewRow();
            dtrow2["ColumnName"] = "SubCat";
            dspay.Tables[0].Rows.Add(dtrow2);
            DataRow dtrow3 = dspay.Tables[0].NewRow();
            dtrow3["ColumnName"] = "SerialNo";
            dspay.Tables[0].Rows.Add(dtrow3);
            DataRow dtrow6 = dspay.Tables[0].NewRow();
            dtrow6["ColumnName"] = "Model";
            dspay.Tables[0].Rows.Add(dtrow6);
            DataRow dtrow7 = dspay.Tables[0].NewRow();
            dtrow7["ColumnName"] = "Dealer Name";
            dspay.Tables[0].Rows.Add(dtrow7);
            DataRow dtrow8 = dspay.Tables[0].NewRow();
            dtrow8["ColumnName"] = "IncentiveAmt";
            dspay.Tables[0].Rows.Add(dtrow8);
            DataRow dtrow9 = dspay.Tables[0].NewRow();
            dtrow9["ColumnName"] = "DistributerName";
            dspay.Tables[0].Rows.Add(dtrow9);
            DataRow dtrow10 = dspay.Tables[0].NewRow();
            dtrow10["ColumnName"] = "DistributerMobile";
            dspay.Tables[0].Rows.Add(dtrow10);
            DataRow dtrow15 = dspay.Tables[0].NewRow();
            dtrow15["ColumnName"] = "Dealer MobileNo";
            dspay.Tables[0].Rows.Add(dtrow15);

            DataTable dtCol = new DataTable();

            dtCol = dspay.Tables[0];



            var firstNotSecond = ColumnName.Except(dtCol.AsEnumerable().Select(x => x["ColumnName"].ToString().Replace(".", "#").Trim())).ToList();

            if (firstNotSecond.Count > 0)
            {
                ValidMsg = ValidMsg + " Column sequence or name not match |";
            }
            if (dtEx.Rows.Count > 0)
            {
                for (int i = 0; i < dtEx.Rows.Count; i++)
                {
                    ds = dal.CheckDelaerCode(dtEx.Rows[i]["Dealer MobileNo"].ToString());
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        dtEx.Rows[i]["Dealer Name"] = ds.Tables[0].Rows[0]["DealerCode"].ToString();
                        dtEx.AcceptChanges();
                    }
                    else
                    {
                        ValidMsg = ValidMsg + dtEx.Rows[i]["Dealer Name"].ToString() + " Dealer Details Not Available in Dealer Master <br/>";

                    }
                    ds = dal.CheckDuplicate("Productmaster", "SerialNo", dtEx.Rows[i]["SerialNo"].ToString());
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (ds.Tables[0].Rows[0][0].ToString() != "0")
                            ValidMsg = ValidMsg + dtEx.Rows[i]["SerialNo"].ToString() + " Product Details Already Available in Product Master </br>";
                    }

                }

                ViewState["UpdatedDt"] = dtEx;
                for (int i = 0; i < dtEx.Rows.Count; i++)
                {
                    string FirstMob = dtEx.Rows[i]["SerialNo"].ToString();
                    for (int j = 0; j < dtEx.Rows.Count; j++)
                    {
                        if (i != j)
                        {
                            string DuplicateMob = dtEx.Rows[j]["SerialNo"].ToString();
                            if (FirstMob == DuplicateMob)
                            {
                                if (!ValidMsg.Contains(DuplicateMob))
                                {
                                    ValidMsg = ValidMsg + " " + DuplicateMob + " Serial No duplicate in Excel  </br>";
                                }
                            }
                        }
                    }

                }
            }

            // string datatype = dtExcel.Columns[4].DataType.Name.ToString();
            // ColumnName.Except(dbCol, StringComparer.OrdinalIgnoreCase).ToList();
            if (ValidMsg == "")
            { return true; }
            else
            {
                divmsg.InnerHtml = ValidMsg;
                return false;
            }

        }

        protected void GenExcel_ServerClick(object sender, EventArgs e)
        {
            int cnt = Convert.ToInt32(HttpContext.Current.Session["ProductCnt"]);
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
            dsExcel = dal.GetProductList(ddlFilterType, FilterValue, 0, cnt);
            if (dsExcel.Tables.Count != 0)
            {
                string Reportname = "ProductList";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(dsExcel.Tables[0], "ProductList");

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