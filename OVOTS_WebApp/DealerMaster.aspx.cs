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
    public partial class DealerMaster : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static List<DelaerMasterBll> GetDealerList(string ddlFilterType, string FilterValue, int startindex, int EndIndex)
        {

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<DelaerMasterBll> retuT = new List<DelaerMasterBll>();
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetDealerList(ddlFilterType, FilterValue, startindex, EndIndex);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                DelaerMasterBll retu = new DelaerMasterBll();
                retu.P_DealerCode = dr["DealerCode"].ToString();
                retu.P_DistributerCode = dr["Distributer"].ToString();
                retu.P_FirmName = dr["FirmName"].ToString();
                retu.P_MobileNo = dr["MobileNo"].ToString();
                retu.P_EmailId = dr["EmailId"].ToString();
                retu.P_State = dr["State"].ToString();
                retu.P_District = dr["District"].ToString();
                retu.P_Town = dr["Town"].ToString();
                retu.P_PinCode = dr["PinCode"].ToString();
                retu.P_Address = dr["Address"].ToString();
                retu.P_SalesManagerName = dr["SalesManagerName"].ToString();
                retu.P_SalesManagerMoblle = dr["SalesManagerMoblle"].ToString();
                retu.P_ClusterName = dr["ClusterName"].ToString();
                retu.P_OwnerName = dr["OwnerName"].ToString();
                retu.P_GSTNo = dr["GSTNo"].ToString();
                retu.P_GCHName = dr["GCHName"].ToString();
                
                retu.P_LatLong = dr["LatLong"].ToString();

                retuT.Add(retu);
            }
            return retuT;
        }

        [WebMethod(EnableSession = true)]
        public static string GetDealerDetails(string P_DealerCode)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            DelaerMasterBll del = new DelaerMasterBll();

            ds = dal.GetDealerDetails(P_DealerCode);
            if (ds.Tables[0].Rows.Count > 0)
            {
                del.P_DealerCode = Convert.ToString(ds.Tables[0].Rows[0]["DealerCode"]);
                del.P_Distributer = Convert.ToString(ds.Tables[0].Rows[0]["Distributer"]);
                del.P_DistributerMob = Convert.ToString(ds.Tables[0].Rows[0]["DistributerMob"]);
                del.P_FirmName = Convert.ToString(ds.Tables[0].Rows[0]["FirmName"]);
                del.P_MobileNo = Convert.ToString(ds.Tables[0].Rows[0]["MobileNo"]);
                del.P_EmailId = Convert.ToString(ds.Tables[0].Rows[0]["EmailId"]);
                del.P_State = Convert.ToString(ds.Tables[0].Rows[0]["State"]);
                del.P_District = Convert.ToString(ds.Tables[0].Rows[0]["District"]);
                del.P_Town = Convert.ToString(ds.Tables[0].Rows[0]["Town"]);
                del.P_PinCode = Convert.ToString(ds.Tables[0].Rows[0]["PinCode"]);
                del.P_Address = Convert.ToString(ds.Tables[0].Rows[0]["Address"]);
                del.P_SalesManagerName = Convert.ToString(ds.Tables[0].Rows[0]["SalesManagerName"]);
                del.P_SalesManagerMoblle = Convert.ToString(ds.Tables[0].Rows[0]["SalesManagerMoblle"]);
                del.P_ClusterName = Convert.ToString(ds.Tables[0].Rows[0]["ClusterName"]);
                del.P_OwnerName = Convert.ToString(ds.Tables[0].Rows[0]["OwnerName"]);

                del.P_GSTNo = Convert.ToString(ds.Tables[0].Rows[0]["GSTNo"]);
                del.P_LatLong = Convert.ToString(ds.Tables[0].Rows[0]["LatLong"]);
                del.P_GCHName = Convert.ToString(ds.Tables[0].Rows[0]["GCHName"]);
              
                del.P_Active = Convert.ToString(ds.Tables[0].Rows[0]["Active"]);

            }


            string oDealerBll = JsonConvert.SerializeObject(new { DealerDetails = del });
            return oDealerBll;
        }

        [WebMethod(EnableSession = true)]
        public static string GetDealerCnt(string ddlFilterType, string FilterValue)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            string cnt = "0";
            HttpContext.Current.Session["DealerCnt"] = "0";
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetDealerList(ddlFilterType, FilterValue, 0, 0);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }

            HttpContext.Current.Session["DealerCnt"] = cnt;
            return cnt;
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetDistributerDll()
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetDistributerDll();
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["DistributerCode"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["Name"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetASMDll()
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetASMDll();
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["ASMCode"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["ASMName"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetGCHDllASMWise(string ASMCode)
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetGCHASMWise(ASMCode);
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["GCHCode"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["GCHName"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }


        [WebMethod(EnableSession = true)]
        public static string SaveDealerDetails(List<DelaerMasterBll> oDealerBll)
        {
            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            DelaerMasterBll obll = new DelaerMasterBll();
            foreach (DelaerMasterBll oPBLL in oDealerBll)
            {
                obll.P_DealerCode = oPBLL.P_DealerCode;
                obll.P_DistributerCode = oPBLL.P_DistributerCode;
                obll.P_DistributerMob = oPBLL.P_DistributerMob;
                obll.P_FirmName = oPBLL.P_FirmName;
                obll.P_MobileNo = oPBLL.P_MobileNo;
                obll.P_EmailId = oPBLL.P_EmailId;
                obll.P_State = oPBLL.P_State;
                obll.P_District = oPBLL.P_District;
                obll.P_Town = oPBLL.P_Town;
                obll.P_PinCode = oPBLL.P_PinCode;
                obll.P_Address = oPBLL.P_Address;
                obll.P_ASMCode = oPBLL.P_ASMCode;
              
                obll.P_ClusterName = oPBLL.P_ClusterName;
                obll.P_OwnerName = oPBLL.P_OwnerName;
                obll.P_GSTNo = oPBLL.P_GSTNo;
                obll.P_LatLong = oPBLL.P_LatLong;
                obll.P_GCHName = oPBLL.P_GCHName;
             

                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_Active = oPBLL.P_Active;
                obll.P_UserIP = "";
                ds = dal.CheckDuplicateDealer(obll.P_DealerCode, obll.P_MobileNo);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    retu = "Same contact Number Already available!";
                }
                else
                {
                    ds = dal.SaveDealerDetails(obll);
                    retu = "Dealer Details Saved Sucessfully";
                }

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

        protected void clkUpload_ServerClick(object sender, EventArgs e)
        {
            //if (flupDocFilePath.HasFile)
            //{
            //    DataTable dtExcel = new DataTable();
            //    DataSet ds = new DataSet();
            //    CDal dal = new CDal();
            //    dtExcel = LoadExcelTodt();
            //    if (ValidateExcelData(dtExcel))
            //    {
            //        if (dtExcel.Rows.Count > 0)
            //        {
            //            for (int i = 0; i < dtExcel.Rows.Count; i++)
            //            {
            //                DelaerMasterBll obll = new DelaerMasterBll();
            //                obll.P_DealerCode = "0";
            //                obll.P_Distributer = dtExcel.Rows[i]["Distributer"].ToString();
            //                obll.P_DistributerMob = dtExcel.Rows[i]["DistributerMob"].ToString();
            //                obll.P_FirmName = dtExcel.Rows[i]["FirmName"].ToString();
            //                obll.P_MobileNo = dtExcel.Rows[i]["MobileNo"].ToString();
            //                obll.P_EmailId = dtExcel.Rows[i]["EmailId"].ToString();
            //                obll.P_State = dtExcel.Rows[i]["State"].ToString();
            //                obll.P_District = dtExcel.Rows[i]["District"].ToString();
            //                obll.P_Town = dtExcel.Rows[i]["Town"].ToString();
            //                obll.P_PinCode = dtExcel.Rows[i]["PinCode"].ToString();
            //                obll.P_Address = dtExcel.Rows[i]["Address"].ToString();
            //                obll.P_SalesManagerName = dtExcel.Rows[i]["SalesManagerName"].ToString();
            //                obll.P_SalesManagerMoblle = dtExcel.Rows[i]["SalesManagerMoblle"].ToString();
            //                obll.P_ClusterName = dtExcel.Rows[i]["ClusterName"].ToString();
            //                obll.P_OwnerName = dtExcel.Rows[i]["OwnerName"].ToString();
            //                obll.P_GSTNo = dtExcel.Rows[i]["GSTNo"].ToString();
            //                obll.P_LatLong = dtExcel.Rows[i]["LatLong"].ToString();

            //                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
            //                obll.P_Active = "TRUE";
            //                obll.P_UserIP = "";

            //                ds = dal.SaveDealerDetails(obll);


            //            }
            //            divmsg.InnerHtml = "Dealer Data Uploaded..";
            //             ScriptManager.RegisterStartupScript(this, GetType(), "ShowMsg", "ShowMsg();", true);
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
            Msg.InnerHtml = "";

            List<string> ColumnName = (from dc in dtEx.Columns.Cast<DataColumn>()
                                       select dc.ColumnName.Trim()).ToList();
            DataSet dspay = new DataSet();
            dspay.Tables.Add(new DataTable());
            dspay.Tables[0].Columns.Add("ColumnName", typeof(string));
            DataRow dtrow = dspay.Tables[0].NewRow();
            dtrow["ColumnName"] = "Distributer";
            dspay.Tables[0].Rows.Add(dtrow);
            DataRow dtrow2 = dspay.Tables[0].NewRow();
            dtrow2["ColumnName"] = "DistributerMob";
            dspay.Tables[0].Rows.Add(dtrow2);
            DataRow dtrow3 = dspay.Tables[0].NewRow();
            dtrow3["ColumnName"] = "FirmName";
            dspay.Tables[0].Rows.Add(dtrow3);
            DataRow dtrow4 = dspay.Tables[0].NewRow();
            dtrow4["ColumnName"] = "MobileNo";
            dspay.Tables[0].Rows.Add(dtrow4);
            DataRow dtrow5 = dspay.Tables[0].NewRow();
            dtrow5["ColumnName"] = "EmailId";
            dspay.Tables[0].Rows.Add(dtrow5);
            DataRow dtrow6 = dspay.Tables[0].NewRow();
            dtrow6["ColumnName"] = "State";
            dspay.Tables[0].Rows.Add(dtrow6);
            DataRow dtrow7 = dspay.Tables[0].NewRow();
            dtrow7["ColumnName"] = "District";
            dspay.Tables[0].Rows.Add(dtrow7);
            DataRow dtrow8 = dspay.Tables[0].NewRow();
            dtrow8["ColumnName"] = "Town";
            dspay.Tables[0].Rows.Add(dtrow8);
            DataRow dtrow9 = dspay.Tables[0].NewRow();
            dtrow9["ColumnName"] = "PinCode";
            dspay.Tables[0].Rows.Add(dtrow9);
            DataRow dtrow10 = dspay.Tables[0].NewRow();
            dtrow10["ColumnName"] = "Address";
            dspay.Tables[0].Rows.Add(dtrow10);
            DataRow dtrow11 = dspay.Tables[0].NewRow();
            dtrow11["ColumnName"] = "SalesManagerName";
            dspay.Tables[0].Rows.Add(dtrow11);
            DataRow dtrow12 = dspay.Tables[0].NewRow();
            dtrow12["ColumnName"] = "SalesManagerMoblle";
            dspay.Tables[0].Rows.Add(dtrow12);
            DataRow dtrow13 = dspay.Tables[0].NewRow();
            dtrow13["ColumnName"] = "ClusterName";
            dspay.Tables[0].Rows.Add(dtrow13);
            DataRow dtrow14 = dspay.Tables[0].NewRow();
            dtrow14["ColumnName"] = "OwnerName";
            dspay.Tables[0].Rows.Add(dtrow14);
            DataRow dtrow15 = dspay.Tables[0].NewRow();
            dtrow15["ColumnName"] = "GSTNo";
            dspay.Tables[0].Rows.Add(dtrow15);
            DataRow dtrow16 = dspay.Tables[0].NewRow();
            dtrow16["ColumnName"] = "LatLong";
            dspay.Tables[0].Rows.Add(dtrow16);


            DataTable dtCol = new DataTable();

            dtCol = dspay.Tables[0];
            DataSet ds = new DataSet();
            CDal dal = new CDal();



            var firstNotSecond = ColumnName.Except(dtCol.AsEnumerable().Select(x => x["ColumnName"].ToString().Replace(".", "#").Trim())).ToList();

            if (firstNotSecond.Count > 0)
            {
                ValidMsg = ValidMsg + " Column sequence or name not match |";
            }
            if (dtEx.Rows.Count > 0)
            {
                for (int i = 0; i < dtEx.Rows.Count; i++)
                {
                    ds = dal.CheckDuplicate("dealermaster", "MobileNo", dtEx.Rows[i]["MobileNo"].ToString());
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (ds.Tables[0].Rows[0][0].ToString() != "0")
                            ValidMsg = ValidMsg + dtEx.Rows[i]["FirmName"].ToString() + " Dealer Details Already Available in Dealer Master </br>";
                    }

                }

                for (int i = 0; i < dtEx.Rows.Count; i++)
                {
                    string FirstMob = dtEx.Rows[i]["MobileNo"].ToString();
                    for (int j = 0; j < dtEx.Rows.Count; j++)
                    {
                        if (i != j)
                        {
                            string DuplicateMob = dtEx.Rows[j]["MobileNo"].ToString();
                            if (FirstMob == DuplicateMob)
                            {
                                if (!ValidMsg.Contains(DuplicateMob))
                                {
                                    ValidMsg = ValidMsg + " " + DuplicateMob + " Dealer Mobile no duplicate in Excel  </br>";
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
            int cnt = Convert.ToInt32(HttpContext.Current.Session["DealerCnt"]);
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
            dsExcel = dal.GetDealerList(ddlFilterType, FilterValue, 0, cnt);
            if (dsExcel.Tables.Count != 0)
            {
                string Reportname = "DealerList";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(dsExcel.Tables[0], "DealerList");

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

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetStateDll() // New Updates 02 - jan - 23
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
        public static List<ListItem> GetDistrictDll(string StateCode) // New Updates 02 - jan - 23
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
        public static List<ListItem> GetTownDll(string DistrictCode) // New Updates 02 - jan - 23
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