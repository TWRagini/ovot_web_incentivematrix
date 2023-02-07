using ClosedXML.Excel;
using Newtonsoft.Json;
using OVOTS_WebApp.Bll;
using OVOTS_WebApp.Dal;
using System;
using System.Collections.Generic;
using System.Configuration;
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


    public partial class IssueManagement : System.Web.UI.Page
    {
        private static string StatusType; //D Update StatusType

        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static string GetIssueManagmentListCnt(string ddlFilterType, string FilterValue, string FromDt, string ToDt)
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
            string LoginUserCode = HttpContext.Current.Session["USERCODE"].ToString();
            string LoginUserLevel = HttpContext.Current.Session["UserLevel"].ToString();
            string LoginUserRole = HttpContext.Current.Session["UserRole"].ToString();
            string strFrom = null;
            string strTo = null;
            if (FromDt != "" && ToDt != "")
            {
                DateTime dtFrom = DateTime.ParseExact(FromDt, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateTime dtTo = DateTime.ParseExact(ToDt, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                strFrom = dtFrom.ToString("yyyy-MM-dd");
                strTo = dtTo.ToString("yyyy-MM-dd");
            }
            ds = dal.GetIssueManagmentList(ddlFilterType, FilterValue, strFrom, strTo, 0, 0, LoginUserCode, LoginUserLevel, LoginUserRole);


            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }

            HttpContext.Current.Session["InvoiceCnt"] = cnt;
            return cnt;
        }

        [WebMethod(EnableSession = true)]
        public static string GetPrevForwardDt(string IssueCode)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            IssueManagementBll ord = new IssueManagementBll();
            List<IssueManagementBll> pdt = new List<IssueManagementBll>();
            ds = dal.GetPrevForwardDt(IssueCode);
            if (ds.Tables[0].Rows.Count > 0)
            {
                ord.P_PrevUser = Convert.ToString(ds.Tables[0].Rows[0]["PrevUser"]);
                ord.P_PreviousUserLevel = Convert.ToString(ds.Tables[0].Rows[0]["PreviousUserLevel"]);
                ord.P_ForwardDetail = Convert.ToString(ds.Tables[0].Rows[0]["ForwardDetail"]);

            }


            string oApproveBll = JsonConvert.SerializeObject(new { ApproveDetails = ord });
            return oApproveBll;
        }


        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetForwardToDll(string IssueTypeCode)
        {
            List<ListItem> Prodd = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();

            string CurrentUserLevel = Convert.ToString(HttpContext.Current.Session["UserLevel"]);
            string EscLevel = "2";
            string LoginUserRole = HttpContext.Current.Session["UserRole"].ToString();
            if (LoginUserRole == "ROL00007" || LoginUserRole == "ROL00011")
            {
                EscLevel = "3";
            }
            if (CurrentUserLevel == "")
                CurrentUserLevel = "0";
            int UserLevel = Convert.ToInt32(CurrentUserLevel) + 1;
            ds = dal.GetMatrixLevelDropDown(IssueTypeCode, EscLevel);
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["USERCODE"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["UserName"]);
                    Prodd.Add(n);
                }
            return Prodd;
        }

        [WebMethod(EnableSession = true)]
        public static List<IssueManagementBll> GetIssueManagmentList(string ddlFilterType, string FilterValue, string FromDt, string ToDt, int startindex, int EndIndex)
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
            string LoginUserCode = HttpContext.Current.Session["USERCODE"].ToString();
            string LoginUserLevel = HttpContext.Current.Session["UserLevel"].ToString();
            string LoginUserRole = HttpContext.Current.Session["UserRole"].ToString();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<IssueManagementBll> retuT = new List<IssueManagementBll>();
            ds = dal.GetIssueManagmentList(ddlFilterType, FilterValue, strFrom, strTo, startindex, EndIndex, LoginUserCode, LoginUserLevel, LoginUserRole);



            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                IssueManagementBll del = new IssueManagementBll();

                string CurrentUserLevel = Convert.ToString(dr["CurrentUserLevel"]);


                DataSet dsPendingWith = new DataSet();
                dsPendingWith = dal.GetPendingWithUsers(Convert.ToString(dr["IssueType"]));
                string Data = "";
                for (int i = 0; i <= dsPendingWith.Tables[0].Rows.Count - 1; i++)
                {

                    Data = Convert.ToString(dsPendingWith.Tables[0].Rows[i]["UserName"]);

                }

                del.P_IssueCode = Convert.ToString(dr["IssueCode"]);
                del.P_Dealer = Convert.ToString(dr["FirmName"]);
                del.P_IssueType = Convert.ToString(dr["IssueType"]);
                StatusType = del.P_IssueType;
                del.P_IssueTypeCode = Convert.ToString(dr["IssueTypeCode"]);
                del.P_IssueLevel = "";
                del.P_IssueDescription = Convert.ToString(dr["IssueDescription"]);
                del.P_IssueDate = Convert.ToString(dr["IssueDate"]);
                del.P_IssueStatus = Convert.ToString(dr["IssueStatus"]);
                del.P_CurrentUserLevel = Convert.ToString(dr["CurrentUserLevel"]);
                CurrentUserLevel = del.P_CurrentUserLevel;

                del.P_CurrentUserLevelText = Convert.ToString(dr["CurrentUserLevelText"]);
                if (CurrentUserLevel == Convert.ToString(1))
                {
                    del.P_CurrentUser = Data;
                }
                else
                {
                    del.P_CurrentUser = Convert.ToString(dr["CurrentUser"]);
                }

                //del.P_CurrentUser = Convert.ToString(dr["CurrentUser"]);
                del.P_ResolveBy = Convert.ToString(dr["ResolveBy"]);
                del.P_ResolveDate = Convert.ToString(dr["ResolveDate"]);
                del.P_PendingSince = Convert.ToString(dr["PendingSince"]);
                del.P_DealerCode = Convert.ToString(dr["DealerCode"]);

                retuT.Add(del);
            }
            return retuT;
        }

        [WebMethod(EnableSession = true)]
        public static string SaveIssueDetail(List<IssueManagementBll> oApproveBll)
        {

            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            IssueManagementBll obll = new IssueManagementBll();
            foreach (IssueManagementBll del in oApproveBll)
            {

                string LoginUserRole = HttpContext.Current.Session["UserRole"].ToString();
                string EscLevel = "2";

                if (LoginUserRole == "ROL00007" || LoginUserRole == "ROL00011")
                {
                    EscLevel = "3";
                }
                obll.P_IssueCode = del.P_IssueCode.Trim();
                obll.P_ActionBy = del.P_ActionBy;
                obll.P_ActionType = del.P_ActionType;
                obll.P_ActionUserCode = del.P_ActionUserCode;
                obll.P_ForwardTo = del.P_ForwardTo;
                obll.P_ForwardDetail = del.P_ForwardDetail;
                obll.P_PreviousUserLevel = del.P_PreviousUserLevel;
                obll.P_CurrentUserLevel = EscLevel;
                obll.P_Active = "TRUE";
                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_UserIP = dal.GetIPAddress();
                ds = dal.SaveIssueDetails(del);

                retu = "Issue Details Saved Sucessfully";
                if (obll.P_ForwardTo != "" && obll.P_ForwardTo != null && del.P_ActionType != "Resolve")
                {
                    DataSet dsMat = new DataSet();
                    //dsMat = dal.GetMatrixLevel(StatusType, EscLevel);// Replace del.P_IssueType by IssueType
                    dsMat = dal.GetMatrixLevel(obll.P_ForwardTo, EscLevel); 
                    if (dsMat.Tables[0].Rows.Count > 0)
                    {
                        string EmailId = Convert.ToString(dsMat.Tables[0].Rows[0]["email"]);
                        string UserName = Convert.ToString(dsMat.Tables[0].Rows[0]["UserName"]);
                        //string IssueType = Convert.ToString(ds.Tables[0].Rows[0]["IssueType"]);

                        string EntryBy = HttpContext.Current.Session["UserName"].ToString();
                        SendMail(UserName, StatusType, EmailId, EntryBy); // IssueType Replace by StatusType
                    }

                    
                }


            }


            return retu;
        }

        public static void SendMail(string UserName, string IssueType, string SendTo, string EntryBy)
        {


            EmailBll emailBll = new EmailBll();
            CDal dal = new CDal();
            EmailCommon emailCommon = new EmailCommon();
            emailBll.P_UserName = UserName;
            emailBll.P_IssueType = IssueType;
            emailBll.P_Mailto = SendTo;
            emailBll.P_EntryBy = EntryBy;

            emailCommon.SendMailWithFormated(emailBll, "IssueForward", "Sender");


        }

    }
}