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
    public partial class CatalogueOffer : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static List<CatalogueMasterBll> GetCatalogueList(string ddlFilterType, string FilterValue, int startindex, int EndIndex)
        {

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            List<CatalogueMasterBll> retuT = new List<CatalogueMasterBll>();
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetCatalogueList(ddlFilterType, FilterValue, startindex, EndIndex);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                CatalogueMasterBll retu = new CatalogueMasterBll();
               
                retu.P_ManualCode = Convert.ToString(dr["ManualCode"]);
                retu.P_Category = Convert.ToString(dr["Category"]);
                retu.P_SubCategory = Convert.ToString(dr["SubCategory"]);
                retu.P_Model = Convert.ToString(dr["Model"]);
                retu.P_ShortName = Convert.ToString(dr["ShortName"]);
                retu.P_ContentType = Convert.ToString(dr["ContentType"]);
                retu.P_iconFilePath = Convert.ToString(dr["iconFilePath"]);
                retu.P_FilePath = Convert.ToString(dr["FilePath"]);
                retu.P_ActiveTill = Convert.ToString(dr["ActiveTill"]);
                retu.P_Remarks = Convert.ToString(dr["Remarks"]);
                //retu.P_Active = Convert.ToString(dr["Active"]);

                retuT.Add(retu);
            }
            return retuT;
        }


        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetProductCategoryDll()
        {
            List<ListItem> Cat = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetProductCategoryDll();
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["ProductCat"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["ProductCat"]);
                    Cat.Add(n);
                }
            return Cat;
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetProductSubCategoryDll(string P_Category)
        {
            List<ListItem> Cat = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetProductSubCategoryDll(P_Category);
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["SubCat"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["SubCat"]);
                    Cat.Add(n);
                }
            return Cat;
        }

        [WebMethod(EnableSession = true)]
        public static List<ListItem> GetModelDll(string P_SubCategory)
        {
            List<ListItem> Cat = new List<ListItem>();
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            ds = dal.GetModelDll(P_SubCategory);
            if (ds.Tables[0].Rows.Count > 0)
                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    ListItem n = new ListItem();
                    n.Value = Convert.ToString(ds.Tables[0].Rows[i]["Model"]);
                    n.Text = Convert.ToString(ds.Tables[0].Rows[i]["Model"]);
                    Cat.Add(n);
                }
            return Cat;
        }

        [WebMethod(EnableSession = true)]
        public static string GetCatalogueDetails(string P_CatalogueCode)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            CatalogueMasterBll del = new CatalogueMasterBll();

            ds = dal.GetCatalogueDetails(P_CatalogueCode);
            if (ds.Tables[0].Rows.Count > 0)
            {
                del.P_ManualCode = Convert.ToString(ds.Tables[0].Rows[0]["ManualCode"]);
                del.P_Category = Convert.ToString(ds.Tables[0].Rows[0]["Category"]);
                del.P_SubCategory = Convert.ToString(ds.Tables[0].Rows[0]["SubCategory"]);
                del.P_Model = Convert.ToString(ds.Tables[0].Rows[0]["Model"]);
                del.P_ShortName = Convert.ToString(ds.Tables[0].Rows[0]["ShortName"]);
                del.P_ContentType = Convert.ToString(ds.Tables[0].Rows[0]["ContentType"]);
                del.P_iconFilePath = Convert.ToString(ds.Tables[0].Rows[0]["iconFilePath"]);
                del.P_FilePath = Convert.ToString(ds.Tables[0].Rows[0]["FilePath"]);
                del.P_ActiveTill = Convert.ToString(ds.Tables[0].Rows[0]["ActiveTill"]);
                del.P_Remarks = Convert.ToString(ds.Tables[0].Rows[0]["Remarks"]);
                del.P_Active = Convert.ToString(ds.Tables[0].Rows[0]["Active"]);

            }


            string oDealerBll = JsonConvert.SerializeObject(new { DealerDetails = del });
            return oDealerBll;
        }

        [WebMethod(EnableSession = true)]
        public static string GetCatalogueCnt(string ddlFilterType, string FilterValue)
        {
            DataSet ds = new DataSet();
            CDal dal = new CDal();
            string cnt = "0";
            if (ddlFilterType == "")
            {
                ddlFilterType = null;
            }
            if (FilterValue == "")
            {
                FilterValue = null;
            }
            ds = dal.GetCatalogueList(ddlFilterType, FilterValue, 0, 0);
            if (ds.Tables[1].Rows.Count > 0)
            {
                cnt = Convert.ToString(ds.Tables[1].Rows[0][0]);
            }


            return cnt;
        }

        [WebMethod(EnableSession = true)]
        public static string SaveCataloguetDetails(List<CatalogueMasterBll> oDealerBll)
        {
            string retu = "";

            DataSet ds = new DataSet();
            CDal dal = new CDal();
            CatalogueMasterBll obll = new CatalogueMasterBll();
            foreach (CatalogueMasterBll oPBLL in oDealerBll)
            {
                obll.P_ManualCode = oPBLL.P_CatalogueCode;
                obll.P_Category = oPBLL.P_Category;
                obll.P_SubCategory = oPBLL.P_SubCategory;
                obll.P_Model = oPBLL.P_Model;
                obll.P_ContentType = oPBLL.P_ContentType;
                obll.P_ShortName = oPBLL.P_ShortName;
                obll.P_iconFilePath = oPBLL.P_iconFilePath;
                obll.P_FilePath = oPBLL.P_FilePath;
                obll.P_ActiveTill = oPBLL.P_ActiveTill;
                obll.P_Remarks = oPBLL.P_Remarks;
                obll.P_Active = oPBLL.P_Active;
                obll.P_UserCode = HttpContext.Current.Session["USERCODE"].ToString();
                obll.P_UserIP = "";

                ds = dal.SaveCataloguetDetails(obll);
                retu = "Product Manual Details Saved Sucessfully";

            }


            return retu;
        }


    }
}