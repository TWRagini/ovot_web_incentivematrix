using Newtonsoft.Json;
using OVOTS_WebApp.Bll;
using OVOTS_WebApp.Dal;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
namespace OVOTS_WebApp
{
    public partial class UploadData : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if(!IsPostBack)
            {
                if (Request.QueryString["PG"].ToString() == "Dealer")
                {
                    heading.InnerText = "Upload Dealer Master";
                    FileFormat.HRef = "ExecelPath/Format/DealerMasterFormat.xlsx";
                }
                if (Request.QueryString["PG"].ToString() == "ISD")
                {
                    heading.InnerText = "Upload ISD Master";
                    FileFormat.HRef = "ExecelPath/Format/ISDMasterFormat.xlsx";
                }
                if (Request.QueryString["PG"].ToString() == "Product")
                {
                    heading.InnerText = "Upload Product Master";
                    FileFormat.HRef = "ExecelPath/Format/ProductMasterFormat.xlsx";
                }
            }
        }

        protected void clkUpload_ServerClick(object sender, EventArgs e)
        {
            if (flupDocFilePath.HasFile)
            {
              //  ScriptManager.RegisterStartupScript(this, GetType(), "ShowLoader", "ShowLoader();", true);
                DataTable dtExcel = new DataTable();
                DataSet ds = new DataSet();
                CDal dal = new CDal();
                dtExcel = LoadExcelTodt();
                if (ValidateExcelData(dtExcel))
                {
                    dtExcel = (DataTable)ViewState["UpdatedDt"];
                    grdData.DataSource = dtExcel;
                    grdData.DataBind();
                    dvsave.Style.Add("display", "block");
                    ScriptManager.RegisterStartupScript(this, GetType(), "HideLoader", "HideLoader();", true);
                }
                else
                {
                    dtExcel = (DataTable)ViewState["UpdatedDt"];
                    grdData.DataSource = dtExcel;
                    grdData.DataBind();
                    dvsave.Style.Add("display", "none");
                    ScriptManager.RegisterStartupScript(this, GetType(), "ShowMsg", "ShowMsg();", true);
                    ScriptManager.RegisterStartupScript(this, GetType(), "HideLoader", "HideLoader();", true);
                }
            }
            else
            {
                divmsg.InnerHtml = "Please select data file";
                dvsave.Style.Add("display", "none");
                ScriptManager.RegisterStartupScript(this, GetType(), "ShowMsg", "ShowMsg();", true);
            }
        }

        private DataTable LoadExcelTodt()
        {
            DataTable dt = new DataTable();
            string Ext = Path.GetExtension(flupDocFilePath.PostedFile.FileName);
            if (Ext == ".xls" || Ext == ".xlsx")
            {
                string Name = Path.GetFileName(flupDocFilePath.PostedFile.FileName);
                string FolderPath = "ExecelPath\\";
                string FilePath = Server.MapPath(FolderPath + Name);
                flupDocFilePath.SaveAs(FilePath);
                string connectionString = "";
                if (Ext == ".xls")
                {   //For Excel 97-03
                    connectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source = " + FilePath + "; Extended Properties = 'Excel 8.0;HDR=Yes'";
                }
                else if (Ext == ".xlsx")
                {    //For Excel 07 and greater
                    connectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source = " + FilePath + "; Extended Properties = 'Excel 8.0;HDR=Yes'";
                }

                //connectionString = String.Format(connectionString, FilePath);
                OleDbConnection conn = new OleDbConnection(connectionString);
                OleDbCommand cmd = new OleDbCommand();
                OleDbDataAdapter dataAdapter = new OleDbDataAdapter();

                cmd.Connection = conn;
                //Fetch 1st Sheet Name
                conn.Open();
                DataTable dtSchema;
                dtSchema = conn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                string ExcelSheetName = dtSchema.Rows[0]["TABLE_NAME"].ToString();
                //  conn.Close();
                //Read all data of fetched Sheet to a Data Table
                //   conn.Open();
                cmd.CommandText = "SELECT * From [" + ExcelSheetName + "]";
                dataAdapter.SelectCommand = cmd;
                dataAdapter.Fill(dt);
                conn.Close();

                // System.Data.OleDb.OleDbConnection MyConnection;
                // System.Data.DataSet DtSet;
                // System.Data.OleDb.OleDbDataAdapter MyCommand;
                // MyConnection = new System.Data.OleDb.OleDbConnection("provider=Microsoft.Jet.OLEDB.12.0;Data Source="+ FilePath  + ";Extended Properties=Excel 12.0;");
                // MyCommand = new System.Data.OleDb.OleDbDataAdapter("select * from [Sheet1$]", MyConnection);
                //// MyCommand.TableMappings.Add("Table", "TestTable");
                // DtSet = new System.Data.DataSet();
                // MyCommand.Fill(DtSet);

                // MyConnection.Close();
                // return DtSet.Tables[0];

            }
            return dt;
        }

        private Boolean ValidateExcelData(DataTable dtExcel)
        {
            if (Request.QueryString["PG"].ToString() == "Dealer")
            {
                return ValidateDealerExcelData(dtExcel);
            }
            if (Request.QueryString["PG"].ToString() == "ISD")
            {
                return ValidateISDExcelData(dtExcel);
            }
            if (Request.QueryString["PG"].ToString() == "Product")
            {
                return ValidateProductExcelData(dtExcel);
            }
            else
            { return false; }
        }


        private Boolean ValidateDealerExcelData(DataTable dtExcel)
        {
            string ValidMsg = "";
            DataTable dtEx = new DataTable();
            dtEx = dtExcel.Copy();


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

            DataRow dtrow17 = dspay.Tables[0].NewRow();
            dtrow17["ColumnName"] = "GCHName";
            dspay.Tables[0].Rows.Add(dtrow17);
            DataRow dtrow18 = dspay.Tables[0].NewRow();
            dtrow18["ColumnName"] = "GCHMob";
            dspay.Tables[0].Rows.Add(dtrow18);
            DataRow dtrow19 = dspay.Tables[0].NewRow();
            dtrow19["ColumnName"] = "GCHEmail";
            dspay.Tables[0].Rows.Add(dtrow19);


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
                dtEx.Columns.Add("color", typeof(String));

                for (int i = 0; i < dtEx.Rows.Count; i++)
                {
                    ds = dal.CheckDuplicate("dealermaster", "MobileNo", dtEx.Rows[i]["MobileNo"].ToString());
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (ds.Tables[0].Rows[0][0].ToString() != "0")
                        {
                            ValidMsg = ValidMsg + dtEx.Rows[i]["FirmName"].ToString() + " , " + dtEx.Rows[i]["MobileNo"].ToString() + " Dealer Details Already Available in Dealer Master </br>";
                            dtEx.Rows[i]["color"] = "Red";
                            dtEx.AcceptChanges();
                        }
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
                                    dtEx.Rows[i]["color"] = "Red";
                                    dtEx.AcceptChanges();
                                }
                            }
                        }
                    }

                }
            }
            ViewState["UpdatedDt"] = dtEx;
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
        protected void clkSave_ServerClick(object sender, EventArgs e)
        {
            if (Request.QueryString["PG"].ToString() == "Dealer")
            {
                SaveDealerData();
               
            }
            if (Request.QueryString["PG"].ToString() == "ISD")
            {
                SaveISDData();

            }
            if (Request.QueryString["PG"].ToString() == "Product")
            {
                SaveProductData();

            }
            ViewState["UploadData"] = "";
            grdData.DataSource = "";
            grdData.DataBind();
            dvsave.Style.Add("display", "none");
            ScriptManager.RegisterStartupScript(this, GetType(), "ShowMsg", "ShowMsg();", true);
        }

        private void SaveDealerData()
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            DataTable dtExcel = new DataTable();
            dtExcel = (DataTable)ViewState["UpdatedDt"];
            if (dtExcel.Rows.Count > 0)
            {
                for (int i = 0; i < dtExcel.Rows.Count; i++)
                {
                    DelaerMasterBll obll = new DelaerMasterBll();
                    obll.P_DealerCode = "0";
                    string Distributercode = dal.GetCode("DistributerCode", "distributermaster", "MobileNo", dtExcel.Rows[i]["DistributerMob"].ToString().Trim()) ;
                    string StateCode = dal.GetCode("StateCode", "statemaster", "StateName", dtExcel.Rows[i]["State"].ToString().Trim());
                    string DistrictCode = dal.GetCode("DistrictCode", "districtmaster", "DistrictName", dtExcel.Rows[i]["District"].ToString().Trim());
                    string TownCode = dal.GetCode("TownCode", "townmaster", "TownName", dtExcel.Rows[i]["Town"].ToString().Trim());
                    string ASMCode = dal.GetCode("ASMCode", "asmmaster", "MobileNo", dtExcel.Rows[i]["SalesManagerMoblle"].ToString().Trim());

                    obll.P_Distributer = Distributercode;
                    obll.P_DistributerMob ="";
                    obll.P_FirmName = dtExcel.Rows[i]["FirmName"].ToString();
                    obll.P_MobileNo = dtExcel.Rows[i]["MobileNo"].ToString();
                    obll.P_EmailId = dtExcel.Rows[i]["EmailId"].ToString();
                    obll.P_State = StateCode;
                    obll.P_District = DistrictCode;
                    obll.P_Town = TownCode;
                    obll.P_PinCode = dtExcel.Rows[i]["PinCode"].ToString();
                    obll.P_Address = dtExcel.Rows[i]["Address"].ToString();
                    obll.P_SalesManagerName = ASMCode;
                    obll.P_SalesManagerMoblle ="";
                    obll.P_ClusterName = dtExcel.Rows[i]["ClusterName"].ToString();
                    obll.P_OwnerName = dtExcel.Rows[i]["OwnerName"].ToString();
                    obll.P_GSTNo = dtExcel.Rows[i]["GSTNo"].ToString();
                    obll.P_LatLong = dtExcel.Rows[i]["LatLong"].ToString();
                    obll.P_GCHName = dtExcel.Rows[i]["GCHName"].ToString();
                  
                    obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                    obll.P_Active = "TRUE";
                    obll.P_UserIP = "";

                    ds = dal.SaveDealerDetails(obll);


                }
                divmsg.InnerHtml = "Dealer Data Uploaded..";
             
                ScriptManager.RegisterStartupScript(this, GetType(), "ShowMsg", "ShowMsg();", true);
            }
        }

        private void SaveISDData()
        {
            DataTable dtExcel = new DataTable();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            dtExcel = (DataTable)ViewState["UpdatedDt"];
            if (dtExcel.Rows.Count > 0)
            {
                for (int i = 0; i < dtExcel.Rows.Count; i++)
                {
                    ISDMasterBll obll = new ISDMasterBll();

                   
                    string StateCode = dal.GetCode("StateCode", "statemaster", "StateName", dtExcel.Rows[i]["State"].ToString().Trim());
                    string DistrictCode = dal.GetCode("DistrictCode", "districtmaster", "DistrictName", dtExcel.Rows[i]["District"].ToString().Trim());
                    string TownCode = dal.GetCode("TownCode", "townmaster", "TownName", dtExcel.Rows[i]["Town"].ToString().Trim());
                    string DealerCode = dal.GetCode("DealerCode", "dealermaster", "MobileNo", dtExcel.Rows[i]["Dealer MobileNo"].ToString().Trim());

                    obll.P_ISDCode = "0";
                    obll.P_DealerCode = DealerCode;
                    obll.P_Name = dtExcel.Rows[i]["Name"].ToString();
                    obll.P_MobileNo = dtExcel.Rows[i]["MobileNo"].ToString();
                    obll.P_State = StateCode;
                    obll.P_District = DistrictCode;
                    obll.P_Town = TownCode;
                    obll.P_AdharNo = dtExcel.Rows[i]["AdharNo"].ToString();
                    obll.P_PANNO = dtExcel.Rows[i]["PANNO"].ToString();
                    obll.P_BankName = dtExcel.Rows[i]["BankName"].ToString();
                    obll.P_BankACNo = dtExcel.Rows[i]["BankACNo"].ToString();
                    obll.P_UPINo = dtExcel.Rows[i]["UPINo"].ToString();
                    obll.P_IFSCCode = dtExcel.Rows[i]["IFSCCode"].ToString();


                    obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                    obll.P_Active = "TRUE";
                    obll.P_UserIP = "";

                    ds = dal.SaveISDDetails(obll);


                }
                divmsg.InnerHtml = "ISD Data Uploaded..";
                ScriptManager.RegisterStartupScript(this, GetType(), "ShowMsg", "ShowMsg();", true);
            }
        }

        private Boolean ValidateISDExcelData(DataTable dtExcel)
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
            dtrow["ColumnName"] = "Dealer Name";
            dspay.Tables[0].Rows.Add(dtrow);
            DataRow dtrow2 = dspay.Tables[0].NewRow();
            dtrow2["ColumnName"] = "Name";
            dspay.Tables[0].Rows.Add(dtrow2);
            DataRow dtrow3 = dspay.Tables[0].NewRow();
            dtrow3["ColumnName"] = "MobileNo";
            dspay.Tables[0].Rows.Add(dtrow3);
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
            dtrow9["ColumnName"] = "AdharNo";
            dspay.Tables[0].Rows.Add(dtrow9);
            DataRow dtrow10 = dspay.Tables[0].NewRow();
            dtrow10["ColumnName"] = "PANNO";
            dspay.Tables[0].Rows.Add(dtrow10);
            DataRow dtrow11 = dspay.Tables[0].NewRow();
            dtrow11["ColumnName"] = "BankName";
            dspay.Tables[0].Rows.Add(dtrow11);
            DataRow dtrow12 = dspay.Tables[0].NewRow();
            dtrow12["ColumnName"] = "BankACNo";
            dspay.Tables[0].Rows.Add(dtrow12);
            DataRow dtrow13 = dspay.Tables[0].NewRow();
            dtrow13["ColumnName"] = "UPINo";
            dspay.Tables[0].Rows.Add(dtrow13);
            DataRow dtrow14 = dspay.Tables[0].NewRow();
            dtrow14["ColumnName"] = "IFSCCode";
            dspay.Tables[0].Rows.Add(dtrow14);
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
                dtEx.Columns.Add("color", typeof(String));
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
                        ValidMsg = ValidMsg + dtEx.Rows[i]["Dealer Name"].ToString() +  " , " + dtEx.Rows[i]["Dealer MobileNo"].ToString() + " Dealer Details Not Available in Dealer Master <br/>";
                        dtEx.Rows[i]["color"] = "Red";
                        dtEx.AcceptChanges();

                    }
                    ds = dal.CheckDuplicate("isdmaster", "MobileNo", dtEx.Rows[i]["MobileNo"].ToString());
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (ds.Tables[0].Rows[0][0].ToString() != "0")
                        {
                            ValidMsg = ValidMsg + dtEx.Rows[i]["Name"].ToString() + " , " + dtEx.Rows[i]["MobileNo"].ToString() + " ISD Details Already Available in ISD Master </br>";
                            dtEx.Rows[i]["color"] = "Red";
                            dtEx.AcceptChanges();
                        }
                    }
                    string ISDMobileNo = Convert.ToString(dtEx.Rows[i]["MobileNo"]);
                    if(ISDMobileNo != "" || ISDMobileNo!= null)
                    {
                        Regex regex = new Regex(@"^-?[0-9][0-9,\.]+$");
                        bool valid = regex.IsMatch(ISDMobileNo);
                        if(!valid)
                        {
                            ValidMsg = ValidMsg + dtEx.Rows[i]["MobileNo"].ToString() + " ,  Mobile Number Not Valid </br>";
                            dtEx.Rows[i]["color"] = "Red";
                            dtEx.AcceptChanges();
                        }
                    }

                }
                ViewState["UpdatedDt"] = dtEx;
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
                                    ValidMsg = ValidMsg + " " + DuplicateMob + " ISD Mobile no duplicate in Excel  </br>";
                                    dtEx.Rows[i]["color"] = "Red";
                                    dtEx.AcceptChanges();
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

        private void SaveProductData()
        {
            DataTable dtExcel = new DataTable();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            dtExcel = (DataTable)ViewState["UpdatedDt"];
            if (dtExcel.Rows.Count > 0)
            {
                for (int i = 0; i < dtExcel.Rows.Count; i++)
                {
                    ProductMasterBll obll = new ProductMasterBll();
                    string Distributercode = dal.GetCode("DistributerCode", "distributermaster", "MobileNo", dtExcel.Rows[i]["DistributerMobile"].ToString().Trim());
                    string ModelCode = dal.GetCode("ModelCode", "modelmaster", "ModelName", dtExcel.Rows[i]["Model"].ToString().Trim());
                    string DealerCode = dal.GetCode("DealerCode", "dealermaster", "MobileNo", dtExcel.Rows[i]["Dealer MobileNo"].ToString().Trim());
                    obll.P_ProductCode = "0";
                    obll.P_ProductCat = dtExcel.Rows[i]["ProductCat"].ToString();
                    obll.P_SubCat = dtExcel.Rows[i]["SubCat"].ToString();
                    obll.P_SerialNo = dtExcel.Rows[i]["SerialNo"].ToString();
                    obll.P_Model = ModelCode;
                    obll.P_DealerCode = DealerCode;
                    obll.P_IncentiveAmt = dtExcel.Rows[i]["IncentiveAmt"].ToString();
                    obll.P_DistributerName = Distributercode;
                    obll.P_DistributerMobile = dtExcel.Rows[i]["DistributerMobile"].ToString();
                    if (dtExcel.Rows[i]["DistributerMobile"].ToString() == "")
                    {
                        obll.P_DistributerMobile = null;
                    }


                    obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                    obll.P_Active = "TRUE";
                    obll.P_UserIP = "";

                    ds = dal.SaveProductDetails(obll);


                }
                divmsg.InnerHtml = "Product Data Uploaded..";
                ScriptManager.RegisterStartupScript(this, GetType(), "ShowMsg", "ShowMsg();", true);
            }
        }

        private Boolean ValidateProductExcelData(DataTable dtExcel)
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
                dtEx.Columns.Add("color", typeof(String));
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
                        ValidMsg = ValidMsg + dtEx.Rows[i]["Dealer Name"].ToString() + " , " + dtEx.Rows[i]["Dealer MobileNo"].ToString() + " Dealer Details Not Available in Dealer Master <br/>";
                        dtEx.Rows[i]["color"] = "Red";
                        dtEx.AcceptChanges();

                    }
                    ds = dal.CheckDuplicate("Productmaster", "SerialNo", dtEx.Rows[i]["SerialNo"].ToString());
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (ds.Tables[0].Rows[0][0].ToString() != "0")
                        {
                            ValidMsg = ValidMsg + dtEx.Rows[i]["SerialNo"].ToString() + " Product Details Already Available in Product Master </br>";
                            dtEx.Rows[i]["color"] = "Red";
                            dtEx.AcceptChanges();
                        }
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
                                    dtEx.Rows[i]["color"] = "Red";
                                    dtEx.AcceptChanges();
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

        protected void grdData_RowDataBound(object sender, GridViewRowEventArgs e)
        {
            int cellcnt = 0;
            if(Request.QueryString["PG"].ToString()=="Dealer")
            {
                cellcnt = 19;
            }
            if (Request.QueryString["PG"].ToString() == "ISD")
            {
                cellcnt = 13;
            }
            if (Request.QueryString["PG"].ToString() == "Product")
            {
                cellcnt = 9;
            }
            if (e.Row.RowType == DataControlRowType.DataRow)
            {
               
                if (Convert.ToString(e.Row.Cells[cellcnt].Text) == "Red")
                {

                    e.Row.BackColor = Color.LightPink;
                   

                }
             
            }
            if (e.Row.Cells.Count >1)
            {
                e.Row.Cells[cellcnt].Visible = false;
            }

        }
    }
}