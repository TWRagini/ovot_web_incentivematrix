using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OVOTS_WebApp.Bll
{
    public class InvoiceApproveBll
    {
        public string P_UploadCode { get; set; }
        public string P_ProductSrNo { get; set; }
        public string P_Model { get; set; }
        public string P_Dealer { get; set; }
        public string P_Customer { get; set; }
        public string P_MobileNo { get; set; }
        public string P_ISDCode { get; set; }
        public string P_InvoiceFilePath { get; set; }

        public string P_InvoiceNo { get; set; }
        public string P_IncentiveAmt { get; set; }
        public string P_ApproveStatus { get; set; }
        public string P_RejectionReason { get; set; }
        public string P_ApproveBy { get; set; }
        public string P_ApproveDate { get; set; }
        public string P_Remarks { get; set; }
        public string P_Active { get; set; }
        public string P_UserCode { get; set; }
        public string P_UserIP { get; set; }
       
        public string P_TransactionId { get; set; }

    }
}