using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OVOTS_WebApp.Bll
{
    public class MasterBll
    {


    }

    public class DelaerMasterBll
    {
        public string P_DealerCode { get; set; }
        public string P_DistributerCode { get; set; }
        public string P_Distributer { get; set; }
        public string P_DistributerMob { get; set; }
        public string P_FirmName { get; set; }
        public string P_MobileNo { get; set; }
        public string P_EmailId { get; set; }
        public string P_State { get; set; }
        public string P_District { get; set; }
        public string P_Town { get; set; }
        public string P_PinCode { get; set; }
        public string P_Address { get; set; }
        public string P_SalesManagerCode { get; set; }
        public string P_ClusterName { get; set; }
        public string P_OwnerName { get; set; }
        public string P_GSTNo { get; set; }
        public string P_LatLong { get; set; }
        public string P_SalesManagerMoblle { get; set; }
        public string P_ASMCode { get; set; }
        public string P_SalesManagerName { get; set; }
        public string P_GCHName { get; set; }
        public string P_GCHMob { get; set; }
        public string P_GCHEmail { get; set; }
        public string P_Active { get; set; }
        public string P_UserCode { get; set; }
        public string P_UserIP { get; set; }

        public string P_TransactionId { get; set; }
    }

    public class ISDMasterBll
    {
        public string P_ISDCode { get; set; }
        public string P_DealerCode { get; set; }
        public string P_DealerName { get; set; }
        public string P_IFSCCode { get; set; }
        public string P_AdharFilePath { get; set; }
        public string P_PANFilePath { get; set; }
        public string P_ChequeFilePath { get; set; }
        public string P_Name { get; set; }
        public string P_MobileNo { get; set; }

        public string P_EmailId { get; set; }
        public string P_State { get; set; }
        public string P_District { get; set; }
        public string P_Town { get; set; }
        public string P_AdharNo { get; set; }
        public string P_PANNO { get; set; }
        public string P_BankName { get; set; }
        public string P_BankACNo { get; set; }
        public string P_UPINo { get; set; }
        public string P_Active { get; set; }
        public string P_UserCode { get; set; }

        public string P_KYCApproved { get; set; }
        public string P_Reason { get; set; }
        public string P_KYCApprovedate { get; set; }
        public string P_ApproveRemarks { get; set; }
        public string P_ApproveBy { get; set; }
        public string P_AggreementAccepted { get; set; }
        public string P_AcceptedDate { get; set; }
        public string P_UserIP { get; set; }

        public string P_TransactionId { get; set; }

    }

    public class UserMasterBll
    {
        public string P_UserCode { get; set; }
        public string P_UserId { get; set; }
        public string P_UserName { get; set; }
        public string P_UserType { get; set; }
        public string P_PassWord { get; set; }
        public string P_ConfirmPassword { get; set; }
        public string P_ContactNumber { get; set; }
        public string P_UserRole { get; set; }
        public string P_EmailId { get; set; }
        public string P_UserPrevRole { get; set; }
        public string P_IMEI { get; set; }
        public string P_Remarks { get; set; }
        public string P_UserLevel { get; set; }
        public string P_Active { get; set; }

        public string P_EntryUserCode { get; set; }

        public string P_UserIP { get; set; }

        public string P_TransactionId { get; set; }

    }

    public class IssueManagementBll
    {
        public string P_IssueCode { get; set; }
        public string P_OldIssueCode { get; set; }
        public string P_DealerCode { get; set; }

        public string P_Dealer { get; set; }
        public string P_IssueDate { get; set; }
        public string P_IssueTypeCode { get; set; }
        public string P_IssueType { get; set; }
        public string P_IssueLevel { get; set; }
        public string P_IssueDescription { get; set; }
        public string P_IssueStatus { get; set; }
        public string P_CurrentUserLevel { get; set; }

        public string P_CurrentUserLevelText { get; set; }
        public string P_CurrentUser { get; set; }
        public string P_PendingSince { get; set; }
        public string P_IsIssueResolved { get; set; }
        public string P_ResolveBy { get; set; }
        public string P_ResolveDate { get; set; }
        public string P_ResolutionDetails { get; set; }
        public string P_RegUserAction { get; set; }
        public string P_RegUserActionDate { get; set; }
        public string P_Active { get; set; }
        public string P_IssueDtCode { get; set; }
        public string P_ActionBy { get; set; }
        public string P_ActionType { get; set; }
        public string P_ActionUserCode { get; set; }
        public string P_ForwardTo { get; set; }
        public string P_ForwardDetail { get; set; }
        public string P_PreviousUserLevel { get; set; }
        public string P_UserCode { get; set; }
        public string P_UserIP { get; set; }
        public string P_PrevUser { get; set; }
        public string P_TransactionId { get; set; }

    }

    public class ProductMasterBll
    {
        public string P_ProductCode { get; set; }
        public string P_ProductCat { get; set; }
        public string P_SubCat { get; set; }
        public string P_SerialNo { get; set; }
        public string P_Model { get; set; }
        public string P_DealerCode { get; set; }
        public string P_IncentiveAmt { get; set; }
        public string P_DistributerName { get; set; }
        public string P_DistributerMobile { get; set; }
        public string P_State { get; set; }
        public string P_District { get; set; }
        public string P_DealerName { get; set; }
        public string P_DealerNo { get; set; }
        public string P_Town { get; set; }
        public string P_Active { get; set; }
        public string P_UserCode { get; set; }
        public string P_UserIP { get; set; }

        public string P_TransactionId { get; set; }

    }

    public class CustomerInvoiceBll
    {
        public string P_UploadCode { get; set; }
        public string P_InvoiceNo { get; set; }
        public string P_ProductCode { get; set; }
        public string P_ProductSrNo { get; set; }

        public string P_ProductCat { get; set; }

        public string P_SubCat { get; set; }
       
        public string P_Model { get; set; }
        public string P_Dealer { get; set; }
        public string P_Customer { get; set; }
        public string P_MobileNo { get; set; }
        public string P_ISDCode { get; set; }
        public string P_ISDName { get; set; }
        public string P_InvoiceFilePath { get; set; }
        public string P_IncentiveAmt { get; set; }
        public string P_ApproveStatus { get; set; }
        public string P_RejectionReason { get; set; }
        public string P_ApproveBy { get; set; }
        public string P_ApproveDate { get; set; }
        public string P_Remarks { get; set; }
        public string P_Active { get; set; }
        public string P_UserCode { get; set; }
        public string P_UserIP { get; set; }

    }

    public class CatalogueMasterBll
    {
       
        public string P_CatalogueCode  { get; set; }
        public string P_ManualCode { get; set; }
        public string P_SubCategory { get; set; }
        public string P_Model { get; set; }
        public string P_ContentType { get; set; }
        public string P_ShortName { get; set; }
        public string P_Category       { get; set; }
        public string P_Name           { get; set; }
        public string P_iconFilePath   { get; set; }
        public string P_FilePath       { get; set; }
        public string P_ActiveTill     { get; set; }
        public string P_UpdateCode { get; set; }
        public string P_Content { get; set; }
        public string P_Remarks { get; set; }

        public string P_Active { get; set; }
        public string P_UserCode { get; set; }
        public string P_UserIP { get; set; }

        public string P_TransactionId { get; set; }

    }

    public class StateMasterBll
    {
        public string P_StateCode { get; set; }
        public string P_StateName { get; set; }
        public string P_Active { get; set; }
        public string P_UserCode { get; set; }
        public string P_UserIP { get; set; }

    }

    public class DistrictMasterBll
    {
        public string P_DistrictCode { get; set; }
        public string P_StateCode { get; set; }

        public string P_StateName { get; set; }
        public string P_DistrictName { get; set; }
        public string P_Active { get; set; }
        public string P_UserCode { get; set; }
        public string P_UserIP { get; set; }

    }

    public class TownMasterBll
    {
        public string P_TownCode { get; set; }
        public string P_TownName { get; set; }
        public string P_StateCode { get; set; }
        public string P_DistrictCode { get; set; }
        public string P_StateName { get; set; }
        public string P_DistrictName { get; set; }
        public string P_Active { get; set; }
        public string P_UserCode { get; set; }
        public string P_UserIP { get; set; }

    }

    public class ASMMasterBll
    {
        public string P_ASMCode { get; set; }
        public string P_ASMName { get; set; }
        public string P_MobileNo { get; set; }
        public string P_EmailId { get; set; }
        public string P_State { get; set; }
        public string P_District { get; set; }
        public string P_Town { get; set; }
        public string P_PinCode { get; set; }
        public string P_Address { get; set; }
        public string P_ClusterName { get; set; }
        public string P_GCHCode { get; set; }
        public string P_Active { get; set; }
        public string P_UserCode { get; set; }
        public string P_UserIP { get; set; }

    }

    public class GCHMasterBll
    {
        public string P_GCHCode { get; set; }
        public string P_GCHName { get; set; }
        public string P_MobileNo { get; set; }
        public string P_EmailId { get; set; }
        public string P_State { get; set; }
        public string P_District { get; set; }
        public string P_Town { get; set; }
        public string P_PinCode { get; set; }
        public string P_Address { get; set; }
        public string P_ClusterName { get; set; }
        public string P_Active { get; set; }
        public string P_UserCode { get; set; }
        public string P_UserIP { get; set; }

    }

    public class DistributerMasterBll
    {
        public string P_DistributerCode { get; set; }
        public string P_DistributerName { get; set; }
        public string P_MobileNo { get; set; }
        public string P_EmailId { get; set; }
        public string P_State { get; set; }
        public string P_District { get; set; }
        public string P_Town { get; set; }
        public string P_PinCode { get; set; }
        public string P_Address { get; set; }
       
        public string P_Active { get; set; }
        public string P_UserCode { get; set; }
        public string P_UserIP { get; set; }

    }

    public class StoreMasterBll
    {
        public string P_StoreCode { get; set; }
        public string P_StoreName { get; set; }
        public string P_OwnerName { get; set; }
        public string P_MobileNo { get; set; }
        public string P_EmailId { get; set; }
        public string P_State { get; set; }
        public string P_District { get; set; }
        public string P_Town { get; set; }
        public string P_PinCode { get; set; }
        public string P_Address { get; set; }
        public string P_GSTNo { get; set; }


        public string P_Active { get; set; }
        public string P_UserCode { get; set; }
        public string P_UserIP { get; set; }

    }

    public class ModelMasterBll
    {
        public string P_ModelCode { get; set; }
        public string P_ModelName { get; set; }
        public string P_IncentiveAmt { get; set; }
        public string P_Remarks { get; set; }

        public string P_Active { get; set; }
        public string P_UserCode { get; set; }
        public string P_UserIP { get; set; }

    }
    public class IncentiveConfigMasterBll
    {
        public string P_ConfigCode { get; set; }
        public string P_ConfigName { get; set; }
        public string P_ConfigBy { get; set; }
        public string P_ConfigLevel { get; set; }
        public string P_EntityCode { get; set; }
        public string P_Remarks { get; set; }
       
        public string P_ModelCode { get; set; }

        public string P_ModelName { get; set; }
        public string P_FromDate { get; set; }
        public string P_ToDate { get; set; }
        public string P_IncentiveAmt { get; set; }


        public string P_Active { get; set; }
        public string P_UserCode { get; set; }
        public string P_UserIP { get; set; }

    }
}