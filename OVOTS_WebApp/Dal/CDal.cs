using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Net;
using MySql.Data.MySqlClient;
using System.Web.UI.WebControls;
using System.Configuration;
using OVOTS_WebApp.Bll;
//using OVOTS_WebApp.Bll;

namespace OVOTS_WebApp.Dal
{
    public class CDal
    {
        DataSet ds = new DataSet();
        MySqlCommand cmd = new MySqlCommand();
        MySqlDataAdapter da = new MySqlDataAdapter();

        public DataSet GetLoginDetails(string P_UserName, string P_Password)
        {
            MySqlCommand command = new MySqlCommand();            
            command.Parameters.AddWithValue("P_UserName", P_UserName);
            command.Parameters.AddWithValue("P_Password", P_Password);
            ds = FillDS(command, "usp_get_LoginDetails");
            return ds;
        }

        public DataSet GetRejectionReasonList()
        {
            MySqlCommand command = new MySqlCommand();
          
            ds = FillDS(command, "usp_get_RejectionReasonList");
            return ds;
        }

        public DataSet GetISDRejectionReasonList()
        {
            MySqlCommand command = new MySqlCommand();

            ds = FillDS(command, "usp_get_ISDRejectionReasonList");
            return ds;
        }

        public DataSet GetForwardToDll(string P_UserLevel, string P_DealerCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_UserLevel", P_UserLevel);
            command.Parameters.AddWithValue("P_DealerCode", P_DealerCode);
            ds = FillDS(command, "usp_get_ForwardToUser");
            return ds;
        }

        public DataSet GetMatrixLevel(string P_IssueType, string P_Level)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_IssueType", P_IssueType);
            command.Parameters.AddWithValue("P_Level", P_Level);
            ds = FillDS(command, "usp_get_MatrixLevelUser");
            return ds;
        }

        // New Implimentation 
        public DataSet GetMatrixLevelDropDown(string P_IssueType, string P_Level) // Updates 14-01-2023
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_IssueType", P_IssueType);
            command.Parameters.AddWithValue("P_Level", P_Level);
            ds = FillDS(command, "usp_get_MatrixLevelUserDropdown");
            return ds;
        }

        public DataSet GetApproveDetails(string P_UploadCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_UploadCode", P_UploadCode);
            ds = FillDS(command, "usp_get_ApproveDetails");
            return ds;
        }

        public DataSet GetApproveDetailsByNo(string P_InvoiceNo, string P_Status, string P_ActionId)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_InvoiceNo", P_InvoiceNo);
            command.Parameters.AddWithValue("P_Status", P_Status);
            command.Parameters.AddWithValue("P_ActionId", P_ActionId);
            ds = FillDS(command, "usp_get_ApproveDetailsByNo");
            return ds;
        }

        public DataSet GetApproveProduct(string P_InvoiceNo, string P_Status, string P_ActionId)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_InvoiceNo", P_InvoiceNo);
            command.Parameters.AddWithValue("P_Status", P_Status);
            command.Parameters.AddWithValue("P_ActionId", P_ActionId);
            ds = FillDS(command, "usp_get_ApproveProductDt");
            return ds;
        }

        public DataSet SaveApproveStatus(InvoiceApproveBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_InvoiceNo", bll.P_InvoiceNo);
            command.Parameters.AddWithValue("P_ApproveStatus", bll.P_ApproveStatus);
            command.Parameters.AddWithValue("P_RejectionReason", bll.P_RejectionReason);
            command.Parameters.AddWithValue("P_ApproveBy", bll.P_ApproveBy);
            command.Parameters.AddWithValue("P_Remarks", bll.P_Remarks);
            ds = FillDS(command, "usp_update_ApproveStatus");
            return ds;
        }

        public DataSet SaveApproveDetails(InvoiceApproveBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_UploadCode", bll.P_UploadCode);
            command.Parameters.AddWithValue("P_ApproveStatus", bll.P_ApproveStatus);
            command.Parameters.AddWithValue("P_RejectionReason", bll.P_RejectionReason);
            command.Parameters.AddWithValue("P_ApproveBy", bll.P_ApproveBy);
            command.Parameters.AddWithValue("P_Remarks", bll.P_Remarks);

            ds = FillDS(command, "usp_update_Approveststus");
            return ds;
        }

        public DataSet SaveISDApproveDetails(ISDMasterBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_ISDcode", bll.P_ISDCode);
            command.Parameters.AddWithValue("P_KYCApproved", bll.P_KYCApproved);
            command.Parameters.AddWithValue("P_Reason", bll.P_Reason);
            command.Parameters.AddWithValue("P_ApproveBy", bll.P_ApproveBy);
            command.Parameters.AddWithValue("P_ApproveRemarks", bll.P_ApproveRemarks);
            ds = FillDS(command, "usp_update_ISDApproveStatus");
            return ds;
        }

        public DataSet GetDealerList(string P_FilterType, string P_FilterValue, int P_StartIndex, int P_EndIndex)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            ds = FillDS(command, "usp_listweb_DealerMaster");
            return ds;
        }

        public DataSet GetStateList(string P_FilterType, string P_FilterValue, int P_StartIndex, int P_EndIndex)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            ds = FillDS(command, "usp_listweb_StateMaster");
            return ds;
        }

        public DataSet GetDistrictList(string P_FilterType, string P_FilterValue, int P_StartIndex, int P_EndIndex)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            ds = FillDS(command, "usp_listweb_DistrictMaster");
            return ds;
        }

        public DataSet GetTownList(string P_FilterType, string P_FilterValue, int P_StartIndex, int P_EndIndex)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            ds = FillDS(command, "usp_listweb_TownMaster");
            return ds;
        }

        public DataSet GetASMList(string P_FilterType, string P_FilterValue, int P_StartIndex, int P_EndIndex)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            ds = FillDS(command, "usp_listweb_ASMMaster");
            return ds;
        }

        public DataSet GetGCHList(string P_FilterType, string P_FilterValue, int P_StartIndex, int P_EndIndex)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            ds = FillDS(command, "usp_listweb_GCHMaster");
            return ds;
        }

        public DataSet GetDistributerList(string P_FilterType, string P_FilterValue, int P_StartIndex, int P_EndIndex)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            ds = FillDS(command, "usp_listweb_DistributerMaster");
            return ds;
        }

        public DataSet GetStoreList(string P_FilterType, string P_FilterValue, int P_StartIndex, int P_EndIndex)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            ds = FillDS(command, "usp_listweb_StoreMaster");
            return ds;
        }

        public DataSet GetModelList(string P_FilterType, string P_FilterValue, int P_StartIndex, int P_EndIndex)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            ds = FillDS(command, "usp_listweb_ModelMaster");
            return ds;
        }

        public DataSet GetInvoiceList(string P_FilterType, string P_FilterValue, int P_StartIndex, int P_EndIndex)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            ds = FillDS(command, "usp_listweb_customerinvoice");
            return ds;
        }

        public DataSet GetDealerDetails(string P_DealerCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_DealerCode", P_DealerCode);
            ds = FillDS(command, "usp_get_DealerMaster");
            return ds;
        }

        public DataSet GetStateDetails(string P_StateCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_StateCode", P_StateCode);
            ds = FillDS(command, "app_get_StateDetails");
            return ds;
        }

        public DataSet GetASMDetails(string P_ASMCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_ASMCode", P_ASMCode);
            ds = FillDS(command, "usp_get_ASMMaster");
            return ds;
        }

        public DataSet GetGCHDetails(string P_GCHCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_GCHCode", P_GCHCode);
            ds = FillDS(command, "usp_get_GCHMaster");
            return ds;
        }

        public DataSet GetDistrictDetails(string P_DistrictCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_DistrictCode", P_DistrictCode);
            ds = FillDS(command, "app_get_DistrictDetails");
            return ds;
        }

        public DataSet GetTownDetails(string P_TownCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_TownCode", P_TownCode);
            ds = FillDS(command, "app_get_TownDetails");
            return ds;
        }

        public DataSet GetDistributerDetails(string P_DistributerCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_DistributerCode", P_DistributerCode);
            ds = FillDS(command, "usp_get_DistributerMaster");
            return ds;
        }

        public DataSet GetStoreDetails(string P_StoreCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_StoreCode", P_StoreCode);
            ds = FillDS(command, "usp_get_StoreMaster");
            return ds;
        }

        public DataSet GetModelDetails(string P_ModelCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_ModelCode", P_ModelCode);
            ds = FillDS(command, "app_get_ModelDetails");
            return ds;
        }


        public DataSet GetInvoiceDetails(string P_InvoiceNo)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_InvoiceNo", P_InvoiceNo);
            ds = FillDS(command, "usp_get_customerinvoice");
            return ds;
        }

        public DataSet GetDistributerDll()
        {
            MySqlCommand command = new MySqlCommand();
           
            ds = FillDS(command, "usp_get_DistributerDll");
            return ds;
        }
        public DataSet GetISDDll()
        {
            MySqlCommand command = new MySqlCommand();

            ds = FillDS(command, "usp_get_ISDDll");
            return ds;
        }
        public DataSet GetDealerDll()
        {
            MySqlCommand command = new MySqlCommand();

            ds = FillDS(command, "usp_get_DealerDll");
            return ds;
        }

        public DataSet GetRollDll()
        {
            MySqlCommand command = new MySqlCommand();

            ds = FillDS(command, "usp_get_RollDll");
            return ds;
        }

        public DataSet GetPendingUser(string P_UserType)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_UserType", P_UserType);
            ds = FillDS(command, "usp_get_PendingUser");
            return ds;
        }

        public DataSet GetProductDll()
        {
            MySqlCommand command = new MySqlCommand();

            ds = FillDS(command, "usp_get_ProductDll");
            return ds;
        }

        public DataSet GetStateDll()
        {
            MySqlCommand command = new MySqlCommand();

            ds = FillDS(command, "usp_get_StateDll");
            return ds;
        }

        public DataSet GetDistrictDll(string P_StateCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_StateCode", P_StateCode);
            ds = FillDS(command, "usp_get_DistrictDll");
            return ds;
        }

        public DataSet GetTownDll(string P_DistrictCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_DistrictCode", P_DistrictCode);
            ds = FillDS(command, "usp_get_TownDll");
            return ds;
        }

        public DataSet GetGCHDll()
        {
            MySqlCommand command = new MySqlCommand();
            ds = FillDS(command, "usp_get_GCHDll");
            return ds;
        }

        public DataSet GetASMDll()
        {
            MySqlCommand command = new MySqlCommand();
            ds = FillDS(command, "usp_get_ASMDll");
            return ds;
        }

        public DataSet GetGCHASMWise(string P_ASMCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_ASMCode", P_ASMCode);
            ds = FillDS(command, "usp_get_GCHDllASMWise");
            return ds;
        }

        public DataSet DeleteInvoiceProduct(string P_UploadCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_UploadCode", P_UploadCode);
            ds = FillDS(command, "usp_del_InvoiceProduct");
            return ds;
        }



        public DataSet SaveDealerDetails(DelaerMasterBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_DealerCode", bll.P_DealerCode);
            command.Parameters.AddWithValue("P_Distributer", bll.P_DistributerCode);
            command.Parameters.AddWithValue("P_DistributerMob", bll.P_DistributerMob);
            command.Parameters.AddWithValue("P_FirmName", bll.P_FirmName);
            command.Parameters.AddWithValue("P_MobileNo", bll.P_MobileNo);
            command.Parameters.AddWithValue("P_EmailId", bll.P_EmailId);
            command.Parameters.AddWithValue("P_State", bll.P_State);
            command.Parameters.AddWithValue("P_District", bll.P_District);
            command.Parameters.AddWithValue("P_Town", bll.P_Town);
            command.Parameters.AddWithValue("P_PinCode", bll.P_PinCode);
            command.Parameters.AddWithValue("P_Address", bll.P_Address);
            command.Parameters.AddWithValue("P_SalesManagerName", bll.P_ASMCode);
            command.Parameters.AddWithValue("P_SalesManagerMoblle", "");
            command.Parameters.AddWithValue("P_ClusterName", bll.P_ClusterName);
            command.Parameters.AddWithValue("P_OwnerName", bll.P_OwnerName);
            command.Parameters.AddWithValue("P_GSTNo", bll.P_GSTNo);
            command.Parameters.AddWithValue("P_LatLong", bll.P_LatLong);
            command.Parameters.AddWithValue("P_GCHName", bll.P_GCHName);
           
            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);

            ds = FillDS(command, "usp_iu_dealermaster");
            return ds;
        }

        public DataSet SaveInvoiceMaster(CustomerInvoiceBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_InvoiceNo", bll.P_InvoiceNo);
            command.Parameters.AddWithValue("P_Customer", bll.P_Customer);
            command.Parameters.AddWithValue("P_MobileNo", bll.P_MobileNo);
            command.Parameters.AddWithValue("P_ISDCode", bll.P_ISDCode);
           
            command.Parameters.AddWithValue("P_Remarks", bll.P_Remarks);
            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_iu_customerinvoiceMaster");
            return ds;
        }

        public DataSet SaveInvoiceDetails(CustomerInvoiceBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_UploadCode", bll.P_UploadCode);
            command.Parameters.AddWithValue("P_InvoiceNo", bll.P_InvoiceNo);
            command.Parameters.AddWithValue("P_ProductCode", bll.P_ProductCode);
            command.Parameters.AddWithValue("P_ProductSrNo", bll.P_ProductSrNo);
            command.Parameters.AddWithValue("P_Customer", bll.P_Customer);
            command.Parameters.AddWithValue("P_MobileNo", bll.P_MobileNo);
            command.Parameters.AddWithValue("P_ISDCode", bll.P_ISDCode);
         
            command.Parameters.AddWithValue("P_Model", bll.P_Model);
            command.Parameters.AddWithValue("P_Dealer", bll.P_Dealer);
            command.Parameters.AddWithValue("P_Remarks", bll.P_Remarks);
            command.Parameters.AddWithValue("P_IncentiveAmt", bll.P_IncentiveAmt);
            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_iu_customerinvoice");
            return ds;
        }


        public DataSet SaveISDDetails(ISDMasterBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_ISDCode", bll.P_ISDCode);
            command.Parameters.AddWithValue("P_DealerCode", bll.P_DealerCode);
            command.Parameters.AddWithValue("P_Name", bll.P_Name);
            command.Parameters.AddWithValue("P_MobileNo", bll.P_MobileNo);
            command.Parameters.AddWithValue("P_State", bll.P_State);
            command.Parameters.AddWithValue("P_District", bll.P_District);
            command.Parameters.AddWithValue("P_Town", bll.P_Town);
            command.Parameters.AddWithValue("P_AdharNo", bll.P_AdharNo);
            command.Parameters.AddWithValue("P_PANNO", bll.P_PANNO);
            command.Parameters.AddWithValue("P_BankName", bll.P_BankName);
            command.Parameters.AddWithValue("P_BankACNo", bll.P_BankACNo);
            command.Parameters.AddWithValue("P_UPINo", bll.P_UPINo);
            command.Parameters.AddWithValue("P_IFSCCOde", bll.P_IFSCCode);
            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_iu_ISDmaster");
            return ds;
        }


        public DataSet SaveStateMaster(StateMasterBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_StateCode", bll.P_StateCode);
            command.Parameters.AddWithValue("P_StateName", bll.P_StateName);

            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_iu_StateMaster");
            return ds;
        }

        public DataSet SaveASMMaster(ASMMasterBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_ASMCode", bll.P_ASMCode);
            command.Parameters.AddWithValue("P_ASMName", bll.P_ASMName);
            command.Parameters.AddWithValue("P_MobileNo", bll.P_MobileNo);
            command.Parameters.AddWithValue("P_EmailId", bll.P_EmailId);
            command.Parameters.AddWithValue("P_State", bll.P_State);
            command.Parameters.AddWithValue("P_District", bll.P_District);
            command.Parameters.AddWithValue("P_Town", bll.P_Town);
            command.Parameters.AddWithValue("P_PinCode", bll.P_PinCode);
            command.Parameters.AddWithValue("P_Address", bll.P_Address);
            command.Parameters.AddWithValue("P_ClusterName", bll.P_ClusterName);
            command.Parameters.AddWithValue("P_GCHCode", bll.P_GCHCode);


            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_iu_ASMmaster");
            return ds;
        }

        public DataSet SaveGCHMaster(GCHMasterBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_GCHCode", bll.P_GCHCode);
            command.Parameters.AddWithValue("P_GCHName", bll.P_GCHName);
            command.Parameters.AddWithValue("P_MobileNo", bll.P_MobileNo);
            command.Parameters.AddWithValue("P_EmailId", bll.P_EmailId);
            command.Parameters.AddWithValue("P_State", bll.P_State);
            command.Parameters.AddWithValue("P_District", bll.P_District);
            command.Parameters.AddWithValue("P_Town", bll.P_Town);
            command.Parameters.AddWithValue("P_PinCode", bll.P_PinCode);
            command.Parameters.AddWithValue("P_Address", bll.P_Address);
            command.Parameters.AddWithValue("P_ClusterName", bll.P_ClusterName);
            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_iu_GCHmaster");
            return ds;
        }

        public DataSet SaveDistributerMaster(DistributerMasterBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_DistributerCode", bll.P_DistributerCode);
            command.Parameters.AddWithValue("P_Name", bll.P_DistributerName);
            command.Parameters.AddWithValue("P_MobileNo", bll.P_MobileNo);
            command.Parameters.AddWithValue("P_EmailId", bll.P_EmailId);
            command.Parameters.AddWithValue("P_State", bll.P_State);
            command.Parameters.AddWithValue("P_District", bll.P_District);
            command.Parameters.AddWithValue("P_Town", bll.P_Town);
            command.Parameters.AddWithValue("P_PinCode", bll.P_PinCode);
            command.Parameters.AddWithValue("P_Address", bll.P_Address);
            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_iu_distributermaster");
            return ds;
        }

        public DataSet SaveStoreMaster(StoreMasterBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_StoreCode", bll.P_StoreCode);
            command.Parameters.AddWithValue("P_StoreName", bll.P_StoreName);
            command.Parameters.AddWithValue("P_OwnerName", bll.P_OwnerName);
            command.Parameters.AddWithValue("P_MobileNo", bll.P_MobileNo);
            command.Parameters.AddWithValue("P_EmailId", bll.P_EmailId);
            command.Parameters.AddWithValue("P_State", bll.P_State);
            command.Parameters.AddWithValue("P_District", bll.P_District);
            command.Parameters.AddWithValue("P_Town", bll.P_Town);
            command.Parameters.AddWithValue("P_PinCode", bll.P_PinCode);
            command.Parameters.AddWithValue("P_Address", bll.P_Address);
            command.Parameters.AddWithValue("P_GSTNo", bll.P_GSTNo);
            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_iu_Storemaster");
            return ds;
        }

        public DataSet SaveDistrictMaster(DistrictMasterBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_DistrictCode", bll.P_DistrictCode);
            command.Parameters.AddWithValue("P_StateCode", bll.P_StateCode);
            command.Parameters.AddWithValue("P_DistrictName", bll.P_DistrictName);
            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_iu_districtMaster");
            return ds;
        }

        public DataSet SaveModelMaster(ModelMasterBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_ModelCode", bll.P_ModelCode);
            command.Parameters.AddWithValue("P_ModelName", bll.P_ModelName);
            command.Parameters.AddWithValue("P_IncentiveAmt", bll.P_IncentiveAmt);
            command.Parameters.AddWithValue("P_Remarks", bll.P_Remarks);
            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_iu_ModelMaster");
            return ds;
        }

        public DataSet SaveTownMaster(TownMasterBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_TownCode", bll.P_TownCode);
            command.Parameters.AddWithValue("P_TownName", bll.P_TownName);
            command.Parameters.AddWithValue("P_StateCode", bll.P_StateCode);
            command.Parameters.AddWithValue("P_DistrictCode", bll.P_DistrictCode);

            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_iu_townmaster");
            return ds;
        }

        public DataSet GetISDList(string P_FilterType, string P_FilterValue, int P_StartIndex, int P_EndIndex)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            ds = FillDS(command, "usp_listweb_ISDMaster");
            return ds;
        }

        public DataSet GetUserList(string P_FilterType, string P_FilterValue, int P_StartIndex, int P_EndIndex)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            ds = FillDS(command, "usp_listweb_UserMaster");
            return ds;
        }

        public DataSet GetReport(string P_FilterType, string P_FilterValue, string P_DateFrom, string P_DateTo, string P_ReportType, string P_ReportName, string P_UserRoll, string P_MobNo)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_DateFrom", P_DateFrom);
            command.Parameters.AddWithValue("P_DateTo", P_DateTo);
            command.Parameters.AddWithValue("P_ReportType", P_ReportType);
            command.Parameters.AddWithValue("P_ReportName", P_ReportName);
            command.Parameters.AddWithValue("P_UserRoll", P_UserRoll);
            command.Parameters.AddWithValue("P_MobilNo", P_MobNo);
            ds = FillDS(command, "usp_rpt_Report");
            return ds;
        }

        public DataSet GetISDDetails(string P_ISDCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_ISDCode", P_ISDCode);
            ds = FillDS(command, "usp_get_isdmaster");
            return ds;
        }

        public DataSet GetUserDetails(string P_UserCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_UserCode", P_UserCode);
            ds = FillDS(command, "usp_get_usermaster");
            return ds;
        }

        public DataSet ValidateUser(string P_UserType, string P_UserNumber, string P_UserCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_UserType", P_UserType);
            command.Parameters.AddWithValue("P_UserNumber", P_UserNumber);
            command.Parameters.AddWithValue("P_UserCode", P_UserCode);
            ds = FillDS(command, "usp_check_User");
            return ds;
        }

        public DataSet GetMainMenu(string P_RoleCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_RoleCode", P_RoleCode);
            ds = FillDS(command, "usp_get_MainMenuRoleWise");
            return ds;
        }

        public DataSet CheckDuplicateISD(string P_ISDCode, string P_MobileNo)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_ISDCode", P_ISDCode);
            command.Parameters.AddWithValue("P_MobileNo", P_MobileNo);
            ds = FillDS(command, "usp_check_ISD");
            return ds;
        }

        public DataSet CheckDuplicateDealer(string P_DealerCode, string P_MobileNo)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_DealerCode", P_DealerCode);
            command.Parameters.AddWithValue("P_MobileNo", P_MobileNo);
            ds = FillDS(command, "usp_check_Dealer");
            return ds;
        }
        public DataSet GetSubMenu(string P_RoleCode, string P_MenuHDCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_RoleCode", P_RoleCode);
            command.Parameters.AddWithValue("P_MenuHDCode", P_MenuHDCode);
            ds = FillDS(command, "usp_get_SubMenuRoleWise");
            return ds;
        }
        public DataSet ResetPassword(string P_UserCode, string P_Password, string P_EntryUserCode, string P_IPAdd)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_UserCode", P_UserCode);
            command.Parameters.AddWithValue("P_Password", P_Password);
            command.Parameters.AddWithValue("P_EntryUserCode", P_EntryUserCode);
            command.Parameters.AddWithValue("P_IPAdd", P_IPAdd);
            ds = FillDS(command, "usp_update_Resetpassword");
            return ds;
        }

        public DataSet SaveUserDetails(UserMasterBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_UserId", bll.P_UserId);
            command.Parameters.AddWithValue("P_UserName", bll.P_UserName);
            command.Parameters.AddWithValue("P_UserType", bll.P_UserType);
            command.Parameters.AddWithValue("P_PassWord", bll.P_PassWord);
            command.Parameters.AddWithValue("P_ConfirmPassword", bll.P_ConfirmPassword);
            command.Parameters.AddWithValue("P_ContactNumber", bll.P_ContactNumber);
            command.Parameters.AddWithValue("P_UserRole", bll.P_UserRole);
            command.Parameters.AddWithValue("P_IMEI", bll.P_IMEI);
            command.Parameters.AddWithValue("P_EmailId", bll.P_EmailId);
            command.Parameters.AddWithValue("P_Remarks", bll.P_Remarks);
            command.Parameters.AddWithValue("P_UserLevel", bll.P_UserLevel);
            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_EntryUserCode", bll.P_EntryUserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_iu_Usermaster");
            return ds;
        }

        public DataSet SaveProductDetails(ProductMasterBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_ProductCode", bll.P_ProductCode);
            command.Parameters.AddWithValue("P_ProductCat", bll.P_ProductCat);
            command.Parameters.AddWithValue("P_SubCat", bll.P_SubCat);
            command.Parameters.AddWithValue("P_SerialNo", bll.P_SerialNo);
            command.Parameters.AddWithValue("P_Model", bll.P_Model);
            command.Parameters.AddWithValue("P_DealerCode", bll.P_DealerCode);
            command.Parameters.AddWithValue("P_IncentiveAmt", bll.P_IncentiveAmt);
            command.Parameters.AddWithValue("P_DistributerName", bll.P_DistributerName);
            command.Parameters.AddWithValue("P_DistributerMobile", bll.P_DistributerMobile);
            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_iu_Productmaster");
            return ds;
        }

        public DataSet GetProductList(string P_FilterType, string P_FilterValue, int P_StartIndex, int P_EndIndex)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            ds = FillDS(command, "usp_listweb_ProductMaster");
            return ds;
        }

        public DataSet GetProductDetails(string P_ProductCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_ProductCode", P_ProductCode);
            ds = FillDS(command, "usp_get_ProductMaster");
            return ds;
        }
        public DataSet SaveCataloguetDetails(CatalogueMasterBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_ManualCode", bll.P_ManualCode);
            command.Parameters.AddWithValue("P_Category", bll.P_Category);
            command.Parameters.AddWithValue("P_SubCategory", bll.P_SubCategory);
            command.Parameters.AddWithValue("P_Model", bll.P_Model);
            command.Parameters.AddWithValue("P_ContentType", bll.P_ContentType);
            command.Parameters.AddWithValue("P_ShortName", bll.P_ShortName);
            command.Parameters.AddWithValue("P_iconFilePath", bll.P_iconFilePath);
            command.Parameters.AddWithValue("P_FilePath", bll.P_FilePath);
            command.Parameters.AddWithValue("P_ActiveTill", bll.P_ActiveTill);
            command.Parameters.AddWithValue("P_Remarks", bll.P_Remarks);
            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_iu_ProductManual");
            return ds;
        }

        public DataSet GetCatalogueList(string P_FilterType, string P_FilterValue, int P_StartIndex, int P_EndIndex)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            ds = FillDS(command, "usp_listweb_ProductManual");
            return ds;
        }

        public DataSet GetCatalogueDetails(string P_ManualCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_ManualCode", P_ManualCode);
            ds = FillDS(command, "usp_get_ProductManual");
            return ds;
        }

        public DataSet SaveUpdateNotification(CatalogueMasterBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_UpdateCode", bll.P_UpdateCode);
            command.Parameters.AddWithValue("P_ContentType", bll.P_ContentType);
            command.Parameters.AddWithValue("P_ShortName", bll.P_ShortName);
            command.Parameters.AddWithValue("P_FilePath", bll.P_FilePath);
            command.Parameters.AddWithValue("P_ActiveTill", bll.P_ActiveTill);
            command.Parameters.AddWithValue("P_Content", bll.P_Content);
            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_iu_UpdateNotification");
            return ds;
        }

        public DataSet SaveUpdateIncentiveConfig(IncentiveConfigMasterBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_ConfigCode", bll.P_ConfigCode);
            command.Parameters.AddWithValue("P_ConfigName", bll.P_ConfigName);
            command.Parameters.AddWithValue("P_ConfigBy", bll.P_ConfigBy);
            command.Parameters.AddWithValue("P_ConfigLevel", bll.P_ConfigLevel);
            command.Parameters.AddWithValue("P_EntityCode", bll.P_EntityCode);
            command.Parameters.AddWithValue("P_Remarks", bll.P_Remarks);
            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_iu_incentiveconfigmaster");
            return ds;
        }

        public DataSet SaveUpdateIncentiveConfigdt(IncentiveConfigMasterBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_ConfigCode", bll.P_ConfigCode);
            command.Parameters.AddWithValue("P_ModelCode", bll.P_ModelCode);
            command.Parameters.AddWithValue("P_FromDate", bll.P_FromDate);
            command.Parameters.AddWithValue("P_ToDate", bll.P_ToDate);
            command.Parameters.AddWithValue("P_IncentiveAmt", bll.P_IncentiveAmt);
            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_iu_incentiveconfigdt");
            return ds;
        }

        public DataSet GetUpdatesList(string P_FilterType, string P_FilterValue, int P_StartIndex, int P_EndIndex)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            ds = FillDS(command, "usp_listweb_UpdateNotification");
            return ds;
        }

        public DataSet GetUpdateDetails(string P_UpdateCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_UpdateCode", P_UpdateCode);
            ds = FillDS(command, "usp_get_UpdateNotification");
            return ds;
        }

        public DataSet GetIncentiveConfigDetails(string P_ConfigCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_ConfigCode", P_ConfigCode);
            ds = FillDS(command, "usp_get_IncentiveConfigMaster");
            return ds;
        }

        public DataSet DeleteIncentiveConfigDetails(string P_ConfigCode, string P_ModelCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_ConfigCode", P_ConfigCode);
            command.Parameters.AddWithValue("P_ModelCode", P_ModelCode);
            ds = FillDS(command, "usp_del_IncentiveConfigMaster");
            return ds;
        }

        public DataSet GetProductCategoryDll()
        {
            MySqlCommand command = new MySqlCommand();
           
            ds = FillDS(command, "usp_get_ProductCategoryDll");
            return ds;
        }

        public DataSet GetProductSubCategoryDll(string P_Category)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_Category", P_Category);
            ds = FillDS(command, "usp_get_ProductSubCategoryDll");
            return ds;
        }

        public DataSet GetModelDll(string P_SubCategory)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_SubCategory", P_SubCategory);
            ds = FillDS(command, "usp_get_ModelDll");
            return ds;
        }

        public DataSet GetModelDll()
        {
            MySqlCommand command = new MySqlCommand();
            
            ds = FillDS(command, "app_get_ModelDll");
            return ds;
        }

        public DataSet GetIsdForInvoice(string P_InvoiceDate)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_InvoiceDate", P_InvoiceDate);
            ds = FillDS(command, "usp_get_ISDForInvoice");
            return ds;
        }
        public DataSet GetIsdInvoice(string P_InvoiceDate, string P_ISDCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_InvoiceDate", P_InvoiceDate);
            command.Parameters.AddWithValue("P_ISDCode", P_ISDCode);
            ds = FillDS(command, "usp_get_ISDInvoice");
            return ds;
        }
        public DataSet GetCustomerApproveList(string P_FilterType, string P_FilterValue, string P_DateFrom, string P_DateTo)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_DateFrom", P_DateFrom);
            command.Parameters.AddWithValue("P_DateTo", P_DateTo);
            ds = FillDS(command, "usp_Approvelist_customerInvoice");
            return ds;
        }

        public DataSet GetIncentiveConfigList(string P_FilterType, string P_FilterValue, int P_StartIndex, int P_EndIndex)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            ds = FillDS(command, "usp_listweb_incentiveconfigmaster");
            return ds;
        }


        public DataSet CheckISDInvoice(string P_InvoiceDate)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_InvoiceDate", P_InvoiceDate);
            ds = FillDS(command, "usp_get_ISDInvoiceGen");
            return ds;
        }

        public DataSet GetEntityDll(string P_Level)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_Level", P_Level);
            ds = FillDS(command, "usp_get_EntityCode");
            return ds;
        }

        public DataSet InsertISDInvoice(string P_InvoiceCode, string P_ISDCode, string P_InvoiceForDate, string P_FilePath, string P_UserCode, string P_IPAdd)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_InvoiceCode", P_InvoiceCode);
            command.Parameters.AddWithValue("P_ISDCode", P_ISDCode);
            command.Parameters.AddWithValue("P_InvoiceForDate", P_InvoiceForDate);
            command.Parameters.AddWithValue("P_FilePath", P_FilePath);
            command.Parameters.AddWithValue("P_UserCode", P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", P_IPAdd);
            ds = FillDS(command, "usp_iu_ISDInvoice");
            return ds;
        }

        public DataSet GetInvoiceApproveListGroup(string P_FilterType, string P_FilterValue, string P_DateFrom, string P_DateTo, int P_StartIndex, int P_EndIndex, string P_Status)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_DateFrom", P_DateFrom);
            command.Parameters.AddWithValue("P_DateTo", P_DateTo);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            command.Parameters.AddWithValue("P_Status", P_Status);
            ds = FillDS(command, "usp_Approvelist_Invoice");
            return ds;
        }

        public DataSet GetISDInvoiceList(string P_DateFrom, string P_DateTo, int P_StartIndex, int P_EndIndex)
        {
            MySqlCommand command = new MySqlCommand();
            
            command.Parameters.AddWithValue("P_DateFrom", P_DateFrom);
            command.Parameters.AddWithValue("P_DateTo", P_DateTo);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
           
            ds = FillDS(command, "usp_list_ISDInvoice");
            return ds;
        }

        public DataSet GetPrevForwardDt(string P_IssueCode)
        {
            MySqlCommand command = new MySqlCommand();

            command.Parameters.AddWithValue("P_IssueCode", P_IssueCode.Trim());
           
            ds = FillDS(command, "usp_get_PrevForward");
            return ds;
        }

        public DataSet CheckUserByPassword(string P_UserPass, string P_Usercode)
        {
            MySqlCommand command = new MySqlCommand();

            command.Parameters.AddWithValue("P_UserPass", P_UserPass.Trim());
            command.Parameters.AddWithValue("P_Usercode", P_Usercode.Trim());
            ds = FillDS(command, "usp_check_UserByPass");
            return ds;
        }

        public DataSet UpdateUserPassword(string P_UserCode, string P_OldPass, string P_NewPass)
        {
            MySqlCommand command = new MySqlCommand();

            command.Parameters.AddWithValue("P_UserCode", P_UserCode.Trim());
            command.Parameters.AddWithValue("P_OldPass", P_OldPass.Trim());
            command.Parameters.AddWithValue("P_NewPass", P_NewPass.Trim());

            ds = FillDS(command, "usp_update_UserPass");
            return ds;
        }

        public DataSet GetISDApproveList(string P_FilterType, string P_FilterValue, string P_DateFrom, string P_DateTo, int P_StartIndex, int P_EndIndex, string ApproveStatus)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_DateFrom", P_DateFrom);
            command.Parameters.AddWithValue("P_DateTo", P_DateTo);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            command.Parameters.AddWithValue("P_Status", ApproveStatus);
            ds = FillDS(command, "usp_Approvelist_ISD");
            return ds;
        }

        public DataSet GetRPTISDApproveList(string P_DateFrom, string P_DateTo, string ApproveStatus)
        {
            MySqlCommand command = new MySqlCommand();
            
            command.Parameters.AddWithValue("P_DateFrom", P_DateFrom);
            command.Parameters.AddWithValue("P_DateTo", P_DateTo);

            command.Parameters.AddWithValue("P_Status", ApproveStatus);
            ds = FillDS(command, "usp_rpt__KYCApproveStatus");
            return ds;
        }
        public DataSet GetIssueManagmentList(string P_FilterType, string P_FilterValue, string P_DateFrom, string P_DateTo, int P_StartIndex, int P_EndIndex, string UserCode, string P_UserLevel, string P_UserRole)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_FilterType", P_FilterType);
            command.Parameters.AddWithValue("P_FilterValue", P_FilterValue);
            command.Parameters.AddWithValue("P_DateFrom", P_DateFrom);
            command.Parameters.AddWithValue("P_DateTo", P_DateTo);
            command.Parameters.AddWithValue("P_StartIndex", P_StartIndex);
            command.Parameters.AddWithValue("P_EndIndex", P_EndIndex);
            command.Parameters.AddWithValue("P_UserCode", UserCode);
            command.Parameters.AddWithValue("P_UserLevel", P_UserLevel);
            command.Parameters.AddWithValue("P_UserRole", P_UserRole);
            ds = FillDS(command, "usp_listweb_IssueMaster");
            return ds;

        }

        //New Impementation 
        public DataSet GetPendingWithUsers(string P_IssueTypeCode)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_IssueTypeCode", P_IssueTypeCode);
            ds = FillDS(command, "usp_get_PendingUsers");
            return ds;
        }

        public DataSet GetMailMaster(string P_MailType)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_MailType", P_MailType);

            ds = FillDS(command, "usp_get_MailMaster");
            return ds;
        }
        public DataSet SaveIssueDetails(IssueManagementBll bll)
        {
            MySqlCommand command = new MySqlCommand();
            
            command.Parameters.AddWithValue("P_IssueCode", bll.P_IssueCode.Trim());
            command.Parameters.AddWithValue("P_ActionBy", bll.P_ActionBy);
            command.Parameters.AddWithValue("P_ActionType", bll.P_ActionType);
            command.Parameters.AddWithValue("P_ActionUserCode", bll.P_ActionUserCode);
            command.Parameters.AddWithValue("P_ForwardTo", bll.P_ForwardTo);
            command.Parameters.AddWithValue("P_ForwardDetail", bll.P_ForwardDetail);
            command.Parameters.AddWithValue("P_PreviousUserLevel", bll.P_PreviousUserLevel);
            command.Parameters.AddWithValue("P_CurrentUserLevel", bll.P_CurrentUserLevel);
            command.Parameters.AddWithValue("P_Active", bll.P_Active);
            command.Parameters.AddWithValue("P_UserCode", bll.P_UserCode);
            command.Parameters.AddWithValue("P_IPAdd", bll.P_UserIP);
            ds = FillDS(command, "usp_Update_IssueStatus");
            return ds;
        }
        public DataSet CheckDuplicate(string TblName, string ColumnName, string Value)
        {
            //MySqlCommand command = new MySqlCommand();
            //command.Parameters.AddWithValue("P_RFIDNO", P_RFIDNO);
            //ds = FillDS(command, "app_get_CurrentLocation");
            //return ds;
            MySqlCommand command = new MySqlCommand();

            DataSet DSGet = new DataSet();

            string CommandText = "SELECT count(*) FROM  " + TblName + " Where " + ColumnName + " = '" + Value + "';";
            command.CommandType = CommandType.Text;
            command.CommandText = CommandText;
            command.Connection = new MySqlConnection(getConnectionString());
            command.Connection.Open();
            da.SelectCommand = command;

            da.Fill(DSGet);
            command.Connection.Close();
            return DSGet;
        }

        public DataSet CheckDelaerCode(string MobileNo)
        {
            //MySqlCommand command = new MySqlCommand();
            //command.Parameters.AddWithValue("P_RFIDNO", P_RFIDNO);
            //ds = FillDS(command, "app_get_CurrentLocation");
            //return ds;
            MySqlCommand command = new MySqlCommand();

            DataSet DSGet = new DataSet();

            string CommandText = "SELECT DealerCode  FROM  dealermaster  Where MobileNo  = '" + MobileNo + "';";
            command.CommandType = CommandType.Text;
            command.CommandText = CommandText;
            command.Connection = new MySqlConnection(getConnectionString());
            command.Connection.Open();
            da.SelectCommand = command;

            da.Fill(DSGet);
            command.Connection.Close();
            return DSGet;
        }

        public string  GetCode(string SelectColumn, string FromTable, string WhereColumn, string WhereCondition)
        {
            //MySqlCommand command = new MySqlCommand();
            //command.Parameters.AddWithValue("P_RFIDNO", P_RFIDNO);
            //ds = FillDS(command, "app_get_CurrentLocation");
            //return ds;
            MySqlCommand command = new MySqlCommand();

            DataSet DSGet = new DataSet();

            string CommandText = "SELECT "+ SelectColumn + " AS Code FROM " + FromTable  + " Where " + WhereColumn + " = '" + WhereCondition + "'; ";
            command.CommandType = CommandType.Text;
            command.CommandText = CommandText;
            command.Connection = new MySqlConnection(getConnectionString());
            command.Connection.Open();
            da.SelectCommand = command;

            da.Fill(DSGet);
            command.Connection.Close();
            string Code ="";
            if(DSGet.Tables.Count > 0)
            {
                if(DSGet.Tables[0].Rows.Count > 0)
                {
                    Code = Convert.ToString(DSGet.Tables[0].Rows[0]["Code"]);
                }
            }

            return Code;
        }
        public DataSet UpdateOutsourseDetails(string P_DoneOutsourceDate,string P_UserCode,string P_TransactionID)
        {
            MySqlCommand command = new MySqlCommand();
            command.Parameters.AddWithValue("P_DoneOutsourceDate", P_DoneOutsourceDate);
            command.Parameters.AddWithValue("P_UserCode", P_UserCode);
            command.Parameters.AddWithValue("P_TransactionID", P_TransactionID);
            ds = FillDS(command, "usp_update_OutsourseDetails");
            return ds;
        }
        public DataSet GetRequestNotificationCnt()
        {
            MySqlCommand command = new MySqlCommand();            
            ds = FillDS(command, "usp_get_RequestNotificationCnt");
            return ds;
        }

        public DataSet FillDS(MySqlCommand command, string strTableName)
        {
            DataSet DSGet = new DataSet();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = strTableName;
            command.Connection = new MySqlConnection(getConnectionString());
            command.Connection.Open();
            da.SelectCommand = command;

            da.Fill(DSGet, strTableName);
            command.Connection.Close();
            return DSGet;
        }

        public static string getConnectionString()
        {
            // EncryptDecrypt EnDe = new EncryptDecrypt();
            string Connection = ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
            return Connection;
        }

        public string GetIPAddress()
        {
            string visitorIPAddress = "";

            try
            {
                string publicIpAddress = HttpContext.Current.Request.ServerVariables["LOCAL_ADDR"];
                visitorIPAddress = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

                if (String.IsNullOrEmpty(visitorIPAddress))
                    visitorIPAddress = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];

                if (string.IsNullOrEmpty(visitorIPAddress))
                    visitorIPAddress = HttpContext.Current.Request.UserHostAddress;

                if (string.IsNullOrEmpty(visitorIPAddress) || visitorIPAddress.Trim() == "::1")
                {

                    visitorIPAddress = string.Empty;
                }

                if (string.IsNullOrEmpty(visitorIPAddress))
                {
                    //This is for Local(LAN) Connected ID Address
                    string stringHostName = Dns.GetHostName();
                    //Get Ip Host Entry
                    IPHostEntry ipHostEntries = Dns.GetHostEntry(stringHostName);
                    //Get Ip Address From The Ip Host Entry Address List
                    IPAddress[] arrIpAddress = ipHostEntries.AddressList;

                    try
                    {
                        visitorIPAddress = arrIpAddress[1].ToString();
                    }
                    catch
                    {
                        try
                        {
                            visitorIPAddress = arrIpAddress[0].ToString();
                        }
                        catch
                        {
                            try
                            {
                                arrIpAddress = Dns.GetHostAddresses(stringHostName);
                                visitorIPAddress = arrIpAddress[0].ToString();
                            }
                            catch (Exception ex)
                            {
                                visitorIPAddress = "127.0.0.1";
                            }
                        }
                    }
                }
            }
            catch
            {

            }
            return visitorIPAddress;
        }

        // Danish Bagwan 30-01-2023 //

        public DataSet GetState(string DealerCode)
        {
            
            MySqlCommand command = new MySqlCommand();

            DataSet DSGet = new DataSet();

            string CommandText = "SELECT State,District,Town FROM dealermaster  WHERE DealerCode = '" + DealerCode + "';";
            command.CommandType = CommandType.Text;
            command.CommandText = CommandText;
            command.Connection = new MySqlConnection(getConnectionString());
            command.Connection.Open();
            da.SelectCommand = command;

            da.Fill(DSGet);
            command.Connection.Close();
            return DSGet;
        }


    }
}