$(document).ready(function () {
    $body = $("body");
    var form = $('#AntiForgeryForm');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    var headers = {};
    headers['__RequestVerificationToken'] = token;

    $(document).on("click", "#btnUpload", function () {
        $("#VendorTrackingMasterTbl").find("tr:gt(0)").remove();
        var files = $("#importFile").get(0).files;

        var formData = new FormData();
        formData.append('importFile', files[0]);
        $body.addClass("loading");
        var ErrorData = [];
        $("#ErrorMsges").empty();
        $.ajax({
            url: '/Transactions/ImportExcel',
            data: formData,
            type: 'POST',
            contentType: false,
            processData: false,
            headers: headers,
            success: function (data) {
                console.log(data);
                var ns = JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\""));

                $.each(ns, function (index, value) {
                    var INVOICE_ENTRY_DATE = value.INVOICE_ENTRY_DATE;
                    if (INVOICE_ENTRY_DATE != "" && INVOICE_ENTRY_DATE != null) {
                        INVOICE_ENTRY_DATE = new Date(parseInt(value.INVOICE_ENTRY_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                        INVOICE_ENTRY_DATE = GetDDMMYYDate(INVOICE_ENTRY_DATE);
                    }
                    var INVOICE_DATE = value.INVOICE_DATE;
                    if (INVOICE_DATE != "") {
                        INVOICE_DATE = new Date(parseInt(value.INVOICE_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                        INVOICE_DATE = GetDDMMYYDate(INVOICE_DATE);
                    }
                    var COMPLIANCE_FORWARD_DATE = value.COMPLIANCE_FORWARD_DATE;
                    if (COMPLIANCE_FORWARD_DATE != '' && COMPLIANCE_FORWARD_DATE != null) {
                        COMPLIANCE_FORWARD_DATE = new Date(parseInt(value.COMPLIANCE_FORWARD_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                        COMPLIANCE_FORWARD_DATE = GetDDMMYYDate(COMPLIANCE_FORWARD_DATE);
                    }
                    var SAP_POSTING_DATE = value.SAP_POSTING_DATE;
                    if (SAP_POSTING_DATE != "" && SAP_POSTING_DATE != null) {
                        SAP_POSTING_DATE = new Date(parseInt(value.SAP_POSTING_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                        SAP_POSTING_DATE = GetDDMMYYDate(SAP_POSTING_DATE);
                    }
                    var QUERY_DATE = value.QUERY_DATE;
                    if (QUERY_DATE != "" && QUERY_DATE != null) {
                        QUERY_DATE = new Date(parseInt(value.QUERY_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                        QUERY_DATE = GetDDMMYYDate(QUERY_DATE);
                    }
                    var QUERY_REVERT_DATE = value.QUERY_REVERT_DATE;
                    if (QUERY_REVERT_DATE != "" && QUERY_REVERT_DATE != null) {
                        QUERY_REVERT_DATE = new Date(parseInt(value.QUERY_REVERT_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                        QUERY_REVERT_DATE = GetDDMMYYDate(QUERY_REVERT_DATE);
                    }
                    var MSME_DUE_DATE = value.MSME_DUE_DATE;
                    if (MSME_DUE_DATE != "" && MSME_DUE_DATE != null) {
                        MSME_DUE_DATE = new Date(parseInt(value.MSME_DUE_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                        MSME_DUE_DATE = GetDDMMYYDate(MSME_DUE_DATE);
                    }
                    var GST_DUE_DATE = value.GST_DUE_DATE;
                    if (GST_DUE_DATE != "" && GST_DUE_DATE != null) {
                        GST_DUE_DATE = new Date(parseInt(value.GST_DUE_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                        GST_DUE_DATE = GetDDMMYYDate(GST_DUE_DATE);
                    }
                    var PAYMENT_DATE = value.PAYMENT_DATE;
                    if (PAYMENT_DATE != "" && PAYMENT_DATE != null) {
                        PAYMENT_DATE = new Date(parseInt(value.PAYMENT_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                        PAYMENT_DATE = GetDDMMYYDate(PAYMENT_DATE);
                    }
                    var HGS_INVOICE_DATE = value.HGS_INVOICE_DATE;
                    if (HGS_INVOICE_DATE != "" && HGS_INVOICE_DATE != null) {
                        HGS_INVOICE_DATE = new Date(parseInt(value.HGS_INVOICE_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                        HGS_INVOICE_DATE = GetDDMMYYDate(HGS_INVOICE_DATE);
                    }
                    var BILLING_TEAM_COMPLETION = value.BILLING_TEAM_COMPLETION;
                    if (BILLING_TEAM_COMPLETION != "" && BILLING_TEAM_COMPLETION != null) {
                        BILLING_TEAM_COMPLETION = new Date(parseInt(value.BILLING_TEAM_COMPLETION.replace(/(^.*\()|([+-].*$)/g, '')));
                        BILLING_TEAM_COMPLETION = GetDDMMYYDate(BILLING_TEAM_COMPLETION);
                    }
                    var RECD_FROM_VENDOR = value.RECD_FROM_VENDOR;
                    if (RECD_FROM_VENDOR != "" && RECD_FROM_VENDOR != null) {
                        RECD_FROM_VENDOR = new Date(parseInt(value.RECD_FROM_VENDOR.replace(/(^.*\()|([+-].*$)/g, '')));
                        RECD_FROM_VENDOR = GetDDMMYYDate(RECD_FROM_VENDOR);
                    }
                    var RECD_FROM_COMPLIANCE = value.RECD_FROM_COMPLIANCE;
                    if (RECD_FROM_COMPLIANCE != "" && RECD_FROM_COMPLIANCE != null) {
                        RECD_FROM_COMPLIANCE = new Date(parseInt(value.RECD_FROM_COMPLIANCE.replace(/(^.*\()|([+-].*$)/g, '')));
                        RECD_FROM_COMPLIANCE = GetDDMMYYDate(RECD_FROM_COMPLIANCE);
                    }
                    var BILLING_TEAM_INTIMATION = value.BILLING_TEAM_INTIMATION;
                    if (BILLING_TEAM_INTIMATION != "" && BILLING_TEAM_INTIMATION != null) {
                        BILLING_TEAM_INTIMATION = new Date(parseInt(value.BILLING_TEAM_INTIMATION.replace(/(^.*\()|([+-].*$)/g, '')));
                        BILLING_TEAM_INTIMATION = GetDDMMYYDate(BILLING_TEAM_INTIMATION);
                    }
                    $("#VendorTrackingMasterTbl").append("<tr><td>" + value.SrNo + "</td ><td>"
                        + INVOICE_ENTRY_DATE + "</td><td>"
                        + value.INVOICE_ENTRY_USER + "</td><td class='VENDOR_CODE'>"
                        + value.VENDOR_CODE + "</td><td>"
                        + value.VENDOR_SAP_CODE + "</td><td>"
                        + value.VENDOR_GST + "</td><td>"
                        + value.VENDOR_MSME + "</td><td>"
                        + value.SAC_CODE + "</td><td>"
                        + value.INVOICE_NO + "</td><td>"
                        + INVOICE_DATE + "</td><td>"
                        + value.CLIENT_NAME + "</td><td>"
                        + value.SERVICE_NAME + "</td><td>"
                        + value.ADDITIONAL_INFORMATION + "</td><td>"
                        + value.REGISTRATION_NUMBER + "</td><td>"
                        + value.SITE_CODE + "</td><td>"
                        + value.LOCATION + "</td><td>"
                        + value.CITY_NAME + "</td><td>"
                        + value.STATE_NAME + "</td><td>"
                        + value.SERVICE_PERIOD + "</td><td>"
                        + value.SERVICE_CHARGE + "</td><td>"
                        + value.CGST + "</td><td>"
                        + value.SGST + "</td><td>"
                        + value.IGST + "</td><td>"
                        + value.REIMB_EXPENSES + "</td><td>"
                        + value.INVOICE_AMOUNT + "</td><td>"
                        + value.TDS_AMOUNT + "</td><td>"
                        + value.ADVANCE_ADJUSTMENT + "</td><td>"
                        + value.NET_AMOUNT + "</td><td>"
                        + RECD_FROM_VENDOR + "</td><td>"
                        + value.ComplianceUserName + "</td><td>"
                        + COMPLIANCE_FORWARD_DATE + "</td><td>"
                        + RECD_FROM_COMPLIANCE + "</td><td>"
                        + value.COMPLIANCE_REMARKS + "</td><td>"
                        + SAP_POSTING_DATE + "</td><td>"
                        + value.SAP_DOC_NO + "</td><td>"
                        + value.SAP_ENTRY_USER + "</td><td>"
                        + value.APPROVED_BY + "</td><td>"
                        + value.APPROVAL_EMAIL_REFERENCE + "</td><td>"
                        + QUERY_DATE + "</td><td>"
                        + value.NATURE_OF_QUERY + "</td><td>"
                        + QUERY_REVERT_DATE + "</td><td>"
                        + value.QUERY_RESOLUTION + "</td><td>"
                        + MSME_DUE_DATE + "</td><td>"
                        + GST_DUE_DATE + "</td><td>"
                        + value.PAYMENT_STATUS + "</td><td>"
                        + PAYMENT_DATE + "</td><td>"
                        + BILLING_TEAM_INTIMATION + "</td><td>"
                        + BILLING_TEAM_COMPLETION + "</td><td>"
                        + value.BILLING_CATEGORY_NAME + "</td><td>"
                        + HGS_INVOICE_DATE + "</td><td>"
                        + value.HGS_INVOICE_NO + "</td><td>"
                        + value.HGS_INVOICE_AMOUNT + "</td></tr>");
                    var error = {};
                    error["SrNo"] = value.SrNo + "  |  ";
                    var TblIndex = index+1;
                    var AppText = "";
                    if (value.VendorID == "") {
                        AppText += "Vendor Name";
                        $("#VendorTrackingMasterTbl").find("tr").eq(TblIndex).find("td").eq(3).css('background-color','#F2D7D5');
                    }
                    if (value.InvoiceEntryUserID == "") {
                        if (AppText.length > 0) {
                            AppText += ", ";
                        }                       
                        AppText += "Entry User";
                        $("#VendorTrackingMasterTbl").find("tr").eq(TblIndex).find("td").eq(2).css('background-color', '#F2D7D5');
                    }
                    error["column"] = AppText;
                    ErrorData.push(error);
                    
                });
                
                console.log(ErrorData);
                for (var i = 0; i < ErrorData.length; i++) {
                    if (ErrorData[i].column != '') {
                        $("#ErrorMsges").append("<li class='clk'>" + ErrorData[i].SrNo + "  " +"<a> " + ErrorData[i].column + "</a ></li>");
                    }
                   
                };
                //$("#ErrorMsges").html(ErrorData.toString());
                $('#myModal').modal('show');
            }, complete: function () {

                $body.removeClass("loading");
            }
        });
        $("#ErrorMsges").on("click", "li.clk", function (event) {
            var TDTxt = $(this).text();
            var SelectedSrNo = TDTxt.substring(0, TDTxt.indexOf('|'));
            var TblLength = $("#VendorTrackingMasterTbl").find("tr").length;
            for (var i = 1; i < TblLength; i++) {
                var SrNo = $("#VendorTrackingMasterTbl").find("tr").eq(i).find("td").eq(0).text();
                if (parseFloat(SrNo) == parseFloat(SelectedSrNo)) {                   
                    $("#VendorTrackingMasterTbl").find("tr").eq(i).css('background-color', '#F2D7D5');
                    return false;
                }
            }
            
        });
    });

    function GetDDMMYYDate(date) {
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return day + '/' + month + '/' + year;
    }
});
