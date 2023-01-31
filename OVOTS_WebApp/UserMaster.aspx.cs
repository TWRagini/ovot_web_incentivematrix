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
    public partial class UserMaster : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetRollDll()
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetRollDll();
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["RoleCode"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["RoleName"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetPendingUser(string UserType)
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetPendingUser(UserType);
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["Code"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["Name"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }

        [WebMethod(EnableSession = true)]
        public static List<UserMasterBll> GetUserList(string ddlFilterType, string FilterValue, int StartIndex, int EndIndex)
        {

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<UserMasterBll> retuT = new List<UserMasterBll>();
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetUserList(ddlFilterType, FilterValue, StartIndex, EndIndex);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                UserMasterBll retu = new UserMasterBll();
                retu.P_UserCode = dr["UserCode"].ToString();
                retu.P_UserId = dr["UserId"].ToString();
                retu.P_UserName = dr["UserName"].ToString();
                retu.P_UserType = dr["UserType"].ToString();
                //retu.P_PassWord = dr["PassWord"].ToString();
               // retu.P_ConfirmPassword = dr["ConfirmPassword"].ToString();
                retu.P_ContactNumber = dr["ContactNumber"].ToString();
                retu.P_UserRole = dr["RoleName"].ToString();
                //retu.P_IMEI = dr["IMEI"].ToString();
                //retu.P_Remarks = dr["Remarks"].ToString();
                retu.P_UserLevel = dr["UserLevel"].ToString();
                retu.P_Active = dr["Active"].ToString();
           


                retuT.Add(retu);
            }
            return retuT;
        }

        [WebMethod(EnableSession = true)]
        public static string GetUserCnt(string ddlFilterType, string FilterValue)
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
            ds = dal.GetUserList(ddlFilterType, FilterValue, 0, 0);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }

            HttpContext.Current.Session["ISDCnt"] = cnt;
            return cnt;
        }

        [WebMethod(EnableSession = true)]
        public static string GetUserDetails(string P_UserCode)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            UserMasterBll del = new UserMasterBll();

            ds = dal.GetUserDetails(P_UserCode);
            if (ds.Tables[0].Rows.Count > 0)
            {
                del.P_UserCode = Convert.ToString(ds.Tables[0].Rows[0]["UserCode"]);
                del.P_UserId = Convert.ToString(ds.Tables[0].Rows[0]["UserId"]);
                del.P_EmailId = Convert.ToString(ds.Tables[0].Rows[0]["EmailId"]);
                del.P_UserName = Convert.ToString(ds.Tables[0].Rows[0]["UserName"]);
                del.P_UserType = Convert.ToString(ds.Tables[0].Rows[0]["UserType"]);
                del.P_PassWord = Convert.ToString(ds.Tables[0].Rows[0]["PassWord"]);
                del.P_ConfirmPassword = Convert.ToString(ds.Tables[0].Rows[0]["ConfirmPassword"]);
                del.P_ContactNumber = Convert.ToString(ds.Tables[0].Rows[0]["ContactNumber"]);
                del.P_UserRole = Convert.ToString(ds.Tables[0].Rows[0]["UserRole"]);
                del.P_IMEI = Convert.ToString(ds.Tables[0].Rows[0]["IMEI"]);
                del.P_Remarks = Convert.ToString(ds.Tables[0].Rows[0]["Remarks"]);
                del.P_UserLevel = Convert.ToString(ds.Tables[0].Rows[0]["UserLevel"]);
                del.P_Active = Convert.ToString(ds.Tables[0].Rows[0]["Active"]);



            }


            string oDealerBll = JsonConvert.SerializeObject(new { DealerDetails = del });
            return oDealerBll;
        }
        [WebMethod(EnableSession = true)]
        public static string SaveUserDetails(List<UserMasterBll> oDealerBll)
        {
            string retu = "";
            bool valid = true;
            EncryptDecrypt en = new EncryptDecrypt();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            UserMasterBll obll = new UserMasterBll();
            foreach (UserMasterBll oPBLL in oDealerBll)
            {
                obll.P_UserCode = oPBLL.P_UserCode;
                obll.P_UserId = oPBLL.P_UserId;
                obll.P_UserName = oPBLL.P_UserName;
                obll.P_EmailId = oPBLL.P_EmailId;
                obll.P_UserType = oPBLL.P_UserType;
                obll.P_PassWord = en.Encrypt(oPBLL.P_PassWord);
                obll.P_ConfirmPassword =  en.Encrypt(oPBLL.P_ConfirmPassword);
                obll.P_ContactNumber = oPBLL.P_ContactNumber;
                obll.P_UserRole = oPBLL.P_UserRole.Trim();
                obll.P_IMEI = "";
                obll.P_Remarks = oPBLL.P_Remarks;

                
                string ValidateDuplicate = ValidateUser(oPBLL.P_ContactNumber, "Duplicate", oPBLL.P_UserCode);
                if(ValidateDuplicate == "Duplicate")
                {
                    retu = "Same Contact number available in User Master!";
                    valid = false;
                }
                ValidateDuplicate = ValidateUser(oPBLL.P_ContactNumber, oPBLL.P_UserType, oPBLL.P_UserCode);
                if (ValidateDuplicate == "NoUser" )
                {
                    retu = "No details found for this contact number in record!";
                    valid = false;
                }
                if(obll.P_UserId == "")
                {
                    obll.P_UserId = oPBLL.P_ContactNumber;
                }
                obll.P_UserLevel = "0";
                if (oPBLL.P_UserRole == "ROL00001")
                {
                    obll.P_UserLevel = "9";
                }
                if (oPBLL.P_UserRole == "ROL00002")
                {
                    obll.P_UserLevel = "1";
                }
                if (oPBLL.P_UserRole == "ROL00003")
                {
                    obll.P_UserLevel = "2";
                }
                if (oPBLL.P_UserRole == "ROL00005")
                {
                    obll.P_UserLevel = "3";
                }
                if (oPBLL.P_UserRole == "ROL00008")
                {
                    obll.P_UserLevel = "3";
                }
                if (oPBLL.P_UserRole == "ROL00009")
                {
                    obll.P_UserLevel = "3";
                }
                if (oPBLL.P_UserRole == "ROL00010")
                {
                    obll.P_UserLevel = "3";
                }
                if (oPBLL.P_UserRole == "ROL00006")
                {
                    obll.P_UserLevel = "4";
                }
                if (oPBLL.P_UserRole == "ROL00007")
                {
                    obll.P_UserLevel = "5";
                }
                if (oPBLL.P_UserRole == "ROL00011")
                {
                    obll.P_UserLevel = "5";
                }
                if (oPBLL.P_UserRole == "ROL00012")
                {
                    obll.P_UserLevel = "6";
                }
                

                obll.P_EntryUserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_Active = oPBLL.P_Active;
                obll.P_UserIP = dal.GetIPAddress();
                if (valid)
                {
                    if (oPBLL.P_UserCode != "0")
                    {
                        if (oPBLL.P_UserPrevRole == "ROL00003" && oPBLL.P_UserRole == "ROL00004")
                        {
                            ds = dal.GetState(oPBLL.P_UserId);
                            string getstatecode = "";
                            string getDistrictcode = "";
                            string getTowncode = "";
                            if (ds.Tables[0].Rows.Count != 0)
                            {
                                getstatecode = Convert.ToString(ds.Tables[0].Rows[0]["State"]);
                                getDistrictcode = Convert.ToString(ds.Tables[0].Rows[0]["District"]);
                                getTowncode = Convert.ToString(ds.Tables[0].Rows[0]["Town"]);
                            }

                            ISDMasterBll isdbll = new ISDMasterBll();
                            isdbll.P_ISDCode = "0";
                            isdbll.P_DealerCode = oPBLL.P_UserId;
                            isdbll.P_Name = oPBLL.P_UserName;
                            isdbll.P_MobileNo = oPBLL.P_ContactNumber;
                            isdbll.P_State = getstatecode;
                            isdbll.P_District = getDistrictcode;
                            isdbll.P_Town = getTowncode;
                            isdbll.P_AdharNo = "";
                            isdbll.P_PANNO = "";
                            isdbll.P_BankName = "";
                            isdbll.P_BankACNo = "";
                            isdbll.P_UPINo = "";
                            isdbll.P_IFSCCode = "";
                            isdbll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                            isdbll.P_Active = "TRUE";
                            isdbll.P_UserIP = dal.GetIPAddress();
                            ds = dal.CheckDuplicateISD("0", isdbll.P_MobileNo);
                            if (ds.Tables[0].Rows.Count > 0)
                            {
                                obll.P_UserId = Convert.ToString(ds.Tables[0].Rows[0]["Code"]);
                            }
                            else
                            {
                                ds = dal.SaveISDDetails(isdbll);
                                if (ds.Tables[0].Rows.Count > 0)
                                {
                                    string ISDCode = Convert.ToString(ds.Tables[0].Rows[0]["ISDCode"]);
                                    obll.P_UserId = ISDCode;
                                }
                            }

                        }
                    }



                    ds = dal.SaveUserDetails(obll);
                    retu = "User Saved / Updated Sucessfully!";
                }
               

            }


            return retu;
        }

        [WebMethod(EnableSession = true)]
        public static string ResetPassword(List<UserMasterBll> oDealerBll)
        {
            string retu = "";
            EncryptDecrypt en = new EncryptDecrypt();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            UserMasterBll obll = new UserMasterBll();
            foreach (UserMasterBll oPBLL in oDealerBll)
            {
                obll.P_UserCode = oPBLL.P_UserCode;
                obll.P_UserId = oPBLL.P_UserId;
                obll.P_UserName = oPBLL.P_UserName;
                obll.P_UserType = oPBLL.P_UserType;
                obll.P_PassWord = en.Encrypt(oPBLL.P_PassWord);
                obll.P_ConfirmPassword = en.Encrypt(oPBLL.P_ConfirmPassword);
                obll.P_ContactNumber = oPBLL.P_ContactNumber;
                obll.P_UserRole = oPBLL.P_UserRole;
                

                obll.P_EntryUserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_Active = "TRUE";
                obll.P_UserIP = dal.GetIPAddress();

                ds = dal.ResetPassword(obll.P_UserCode, obll.P_PassWord,obll.P_EntryUserCode, dal.GetIPAddress());
                retu = "Password Reset";

            }


            return retu;
        }

        [WebMethod(EnableSession = true)]
        public static string ValidateUser(string Number, string Type, string UserCode)
        {
            string retu = "";
            
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            UserMasterBll obll = new UserMasterBll();

            
            if(Type == "Duplicate")
            {
                ds = dal.ValidateUser("Check", Number, UserCode);
                if(ds.Tables[0].Rows.Count>0)
                {
                    retu = "Duplicate";
                }
            }
            else
            {
                if(Type  == "ISD + Dealer")
                {
                    Type = "Dealer";
                }
                ds = dal.ValidateUser(Type, Number, UserCode);
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        retu = Convert.ToString(ds.Tables[0].Rows[0]["Code"]);
                    }
                    else
                    {
                        retu = "NoUser";
                    }
                }else
                {
                    retu = "";
                }
            }

            return retu;
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
            dsExcel = dal.GetUserList(ddlFilterType, FilterValue, 0, cnt);
            if (dsExcel.Tables.Count != 0)
            {
                string Reportname = "UserList";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(dsExcel.Tables[0], "UserList");

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