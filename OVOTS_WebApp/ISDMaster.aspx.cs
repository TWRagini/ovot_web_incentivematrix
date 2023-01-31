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
    public partial class ISDMaster : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

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
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["FirmName"]);
                    Prodd.Add(n);
                }


            return Prodd;
        }

        [WebMethod(EnableSession = true)]
        public static List<ISDMasterBll> GetISDList(string ddlFilterType, string FilterValue, int StartIndex, int EndIndex)
        {

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<ISDMasterBll> retuT = new List<ISDMasterBll>();
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetISDList(ddlFilterType, FilterValue, StartIndex, EndIndex);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                ISDMasterBll retu = new ISDMasterBll();
                retu.P_ISDCode = dr["ISDCode"].ToString();
                retu.P_DealerCode = dr["DealerCode"].ToString();
                retu.P_DealerName = dr["DealerName"].ToString();
                retu.P_Name = dr["Name"].ToString();
                retu.P_MobileNo = dr["MobileNo"].ToString();
                retu.P_State = dr["State"].ToString();
                retu.P_District = dr["District"].ToString();
                retu.P_Town = dr["Town"].ToString();
                retu.P_AdharNo = dr["AdharNo"].ToString();
                retu.P_PANNO = dr["PANNO"].ToString();
                retu.P_BankName = dr["BankName"].ToString();
                retu.P_BankACNo = dr["BankACNo"].ToString();
                retu.P_UPINo = dr["UPINo"].ToString();
                retu.P_IFSCCode = dr["IFSCCode"].ToString();
                
                retu.P_Active = dr["Active"].ToString();


                retuT.Add(retu);
            }
            return retuT;
        }

        [WebMethod(EnableSession = true)]
        public static string GetISDCnt(string ddlFilterType, string FilterValue)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            string cnt = "0";
            HttpContext.Current.Session["ISDCnt"] = "0";
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetISDList(ddlFilterType, FilterValue, 0, 0);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }

            HttpContext.Current.Session["ISDCnt"] = cnt;
            return cnt;
        }

        [WebMethod(EnableSession = true)]
        public static string GetISDDetails(string P_ISDCode)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ISDMasterBll del = new ISDMasterBll();

            ds = dal.GetISDDetails(P_ISDCode);
            if (ds.Tables[0].Rows.Count > 0)
            {
                del.P_ISDCode = Convert.ToString(ds.Tables[0].Rows[0]["ISDCode"]);
                del.P_DealerCode = Convert.ToString(ds.Tables[0].Rows[0]["DealerCode"]);
                del.P_Name = Convert.ToString(ds.Tables[0].Rows[0]["Name"]);
                del.P_MobileNo = Convert.ToString(ds.Tables[0].Rows[0]["MobileNo"]);
                del.P_State = Convert.ToString(ds.Tables[0].Rows[0]["State"]);
                del.P_District = Convert.ToString(ds.Tables[0].Rows[0]["District"]);
                del.P_Town = Convert.ToString(ds.Tables[0].Rows[0]["Town"]);
                del.P_AdharNo = Convert.ToString(ds.Tables[0].Rows[0]["AdharNo"]);
                del.P_PANNO = Convert.ToString(ds.Tables[0].Rows[0]["PANNO"]);
                del.P_BankName = Convert.ToString(ds.Tables[0].Rows[0]["BankName"]);
                del.P_BankACNo = Convert.ToString(ds.Tables[0].Rows[0]["BankACNo"]);
                del.P_UPINo = Convert.ToString(ds.Tables[0].Rows[0]["UPINo"]);
                del.P_IFSCCode = Convert.ToString(ds.Tables[0].Rows[0]["IFSCCode"]);
                del.P_Active = Convert.ToString(ds.Tables[0].Rows[0]["Active"]);
                

            }


            string oDealerBll = JsonConvert.SerializeObject(new { DealerDetails = del });
            return oDealerBll;
        }
        [WebMethod(EnableSession = true)]
        public static string SaveISDDetails(List<ISDMasterBll> oISDBll)
        {
            string retu = "";
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ISDMasterBll obll = new ISDMasterBll();
            foreach (ISDMasterBll oPBLL in oISDBll)
            {
                obll.P_ISDCode = oPBLL.P_ISDCode;
                obll.P_Name = oPBLL.P_Name;
                obll.P_MobileNo = oPBLL.P_MobileNo;
                obll.P_DealerCode = oPBLL.P_DealerCode;
                obll.P_State = oPBLL.P_State;
                obll.P_District = oPBLL.P_District;
                obll.P_Town = oPBLL.P_Town;
                obll.P_AdharNo = oPBLL.P_AdharNo;
                obll.P_PANNO = oPBLL.P_PANNO;
                obll.P_BankName = oPBLL.P_BankName;
                obll.P_IFSCCode = oPBLL.P_IFSCCode;
                obll.P_BankACNo = oPBLL.P_BankACNo;
                obll.P_UPINo = oPBLL.P_UPINo;

                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_Active = oPBLL.P_Active;
                obll.P_UserIP = "";
                ds = dal.CheckDuplicateISD(obll.P_ISDCode, obll.P_MobileNo);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    retu = "Same contact Number Already available!";
                }
                else
                {
                    ds = dal.SaveISDDetails(obll);
                    retu = "ISD Details Saved Sucessfully";
                }
                
            }


            return retu;
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
            //                ISDMasterBll obll = new ISDMasterBll();
            //                obll.P_ISDCode = "0";
            //                obll.P_DealerCode = dtExcel.Rows[i]["Dealer Name"].ToString();
            //                obll.P_Name = dtExcel.Rows[i]["Name"].ToString();
            //                obll.P_MobileNo = dtExcel.Rows[i]["MobileNo"].ToString();
            //                obll.P_State = dtExcel.Rows[i]["State"].ToString();
            //                obll.P_District = dtExcel.Rows[i]["District"].ToString();
            //                obll.P_Town = dtExcel.Rows[i]["Town"].ToString();
            //                obll.P_AdharNo = dtExcel.Rows[i]["AdharNo"].ToString();
            //                obll.P_PANNO = dtExcel.Rows[i]["PANNO"].ToString();
            //                obll.P_BankName = dtExcel.Rows[i]["BankName"].ToString();
            //                obll.P_BankACNo = dtExcel.Rows[i]["BankACNo"].ToString();
            //                obll.P_UPINo = dtExcel.Rows[i]["UPINo"].ToString();
            //                obll.P_IFSCCode = dtExcel.Rows[i]["IFSCCode"].ToString();


            //                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
            //                obll.P_Active = "TRUE";
            //                obll.P_UserIP = "";

            //                ds = dal.SaveISDDetails(obll);


            //            }
            //            divmsg.InnerHtml = "ISD Data Uploaded..";
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

        protected void GenExcel_ServerClick(object sender, EventArgs e)
        {
            int cnt = Convert.ToInt32(HttpContext.Current.Session["ISDCnt"]);
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
            dsExcel = dal.GetISDList(ddlFilterType, FilterValue, 0, cnt);
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


        //-------------New Implementation---------------//
        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetStateDll() // Updates 20 - jan - 2023 Danish
        {

            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetStateDll();
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["StateCode"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["StateName"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetDistrictDll(string StateCode) // Updates 20 - jan - 2023 Danish
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetDistrictDll(StateCode);
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["DistrictCode"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["DistrictName"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetTownDll(string DistrictCode)// Updates 20 - jan - 2023 Danish
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetTownDll(DistrictCode);
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["TownCode"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["TownName"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }
    }
}