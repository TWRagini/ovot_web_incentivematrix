$(document).ready(function () {
    $body = $("body");

    var form = $('#AntiForgeryForm');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    var headers = {};
    headers['__RequestVerificationToken'] = token;

    //var TotalUserCnt = GetUserCnt();
    //SetPages(TotalUserCnt, 15, 7);

    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        }
        return decodeURI(results[1]) || 0;
    }
    var SearchType = $.urlParam('LP');
    if (SearchType != null) {
        if (SearchType == "BL") {
            $("#ddlFilterType").val("IsBillingCompleted");
            $("#FilterValue").val("0");
            var TotalUserCnt = GetUserCnt();
            SetPages(TotalUserCnt, 15, 7);
            $("#VendorTrackingMasterTbl").find("tr:gt(0)").remove();
            GetAllRecords(0, 15);
            $("#ddlFilterType").val('');
            $("#FilterValue").val('');
        }
        if (SearchType == "PY") {
            $("#VendorTrackingMasterTbl").find("tr:gt(0)").remove();
            $("#ddlFilterType").val("PAYMENT_STATUS");
            $("#FilterValue").val("No");
            var TotalUserCnt = GetUserCnt();
            SetPages(TotalUserCnt, 15, 7);
            GetAllRecords(0, 15);
            $("#ddlFilterType").val('');
            $("#FilterValue").val('');

            $("#ddlFilterType").val("PAYMENT_STATUS1");
            $("#FilterValue").val("No");
            TotalUserCnt += GetUserCnt();
            SetPages(TotalUserCnt, 15, 7);
            GetAllRecords(0, 15);
            $("#ddlFilterType").val('');
            $("#FilterValue").val('');
        }
      
    }




    $("#FromDate").datepicker({ dateFormat: 'dd/mm/yy' });
    $("#ToDate").datepicker({ dateFormat: 'dd/mm/yy' });


    //GetAllRecords(0, 15);
    $("#nav").hide();
    var OldValue = '';
    LoadDropdown();

    function GetUserCnt() {
        var TotalUserCnt = 0;
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        var FromDate = $("#FromDate").val().trim();
        var ToDate = $("#ToDate").val().trim();
        $.ajax({
            type: "POST",
            url: "/Transactions/GetVendorTrackingCnt",
            data: JSON.stringify({ 'FilterType': FilterType, 'FilterValue': FilterValue, 'FromDate': FromDate, 'ToDate': ToDate }),
            contentType: "application/json; charset=utf-8",
            dataType: "json", headers: headers,
            async: false,
            success: function (data) {
                console.log(data);
                if (data != "") {
                    TotalUserCnt = data;
                }
            }
        });
        return TotalUserCnt;
    };

    $("#clkSearch").click(function () {
        var TotalUserCnt = GetUserCnt();
        SetPages(TotalUserCnt, 15, 7);
        $("#VendorTrackingMasterTbl").find("tr:gt(0)").remove();
        GetAllRecords(0, 15);
    });
    $('body').on('click', '#nav li', function () {
        $("#VendorTrackingMasterTbl").find("tr:gt(0)").remove();
        var val = $(this).find('a').text();
        var End = parseInt(val) * parseInt(15);
        var Start = (parseInt(End) - parseInt(15));
        GetAllRecords(Start, 15);
    });
    var TotalLength = 0;
    function GetAllRecords(StartIndex, EndIndex) {
        $body.addClass("loading");
       
        var Validate = true;

        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        var FromDate = $("#FromDate").val().trim();
        var ToDate = $("#ToDate").val().trim();
        if (FilterType == "" && FilterValue == "" && FromDate == "" && ToDate == "") {
            Validate = false;
            $.alert("Please Select Filter Type & Filter Value or From & To Date!");
            $body.removeClass("loading");
            $("#nav").hide();
            //$("#VendorTrackingMasterTbl").append("<tr style='color:red;'><td colspan='25' style='text-align:left'>No Record Found</td></tr>");
        }
        if (Validate) {
            $.ajax({
                type: "POST",
                url: "/Transactions/GetVendorTrackingList",
                data: JSON.stringify({ 'StartIndex': StartIndex, 'EndIndex': EndIndex, 'FilterType': FilterType, 'FilterValue': FilterValue, 'FromDate': FromDate, 'ToDate': ToDate }),
                contentType: "application/json; charset=utf-8",
                dataType: "json", headers: headers,
                success: function (data) {
                    console.log(data);
                    var PT = JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\""));
                    if (SearchType == "PY") {
                        TotalLength += PT.length;
                    }                   
                    if (PT.length > 0) {
                        $("#nav").show();
                        for (var i = 0; i < PT.length; i++) {
                            var INVOICE_ENTRY_DATE = PT[i].INVOICE_ENTRY_DATE;
                            if (INVOICE_ENTRY_DATE != "" && INVOICE_ENTRY_DATE != null) {
                                INVOICE_ENTRY_DATE = new Date(parseInt(PT[i].INVOICE_ENTRY_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                                INVOICE_ENTRY_DATE = GetDDMMYYDate(INVOICE_ENTRY_DATE);
                            }
                            var INVOICE_DATE = PT[i].INVOICE_DATE;
                            if (INVOICE_DATE != "") {
                                INVOICE_DATE = new Date(parseInt(PT[i].INVOICE_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                                INVOICE_DATE = GetDDMMYYDate(INVOICE_DATE);
                            }
                            var COMPLIANCE_FORWARD_DATE = PT[i].COMPLIANCE_FORWARD_DATE;
                            if (COMPLIANCE_FORWARD_DATE != '' && COMPLIANCE_FORWARD_DATE != null) {
                                COMPLIANCE_FORWARD_DATE = new Date(parseInt(PT[i].COMPLIANCE_FORWARD_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                                COMPLIANCE_FORWARD_DATE = GetDDMMYYDate(COMPLIANCE_FORWARD_DATE);
                            }
                            var SAP_POSTING_DATE = PT[i].SAP_POSTING_DATE;
                            if (SAP_POSTING_DATE != "" && SAP_POSTING_DATE != null) {
                                SAP_POSTING_DATE = new Date(parseInt(PT[i].SAP_POSTING_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                                SAP_POSTING_DATE = GetDDMMYYDate(SAP_POSTING_DATE);
                            }
                            var QUERY_DATE = PT[i].QUERY_DATE;
                            if (QUERY_DATE != "" && QUERY_DATE != null) {
                                QUERY_DATE = new Date(parseInt(PT[i].QUERY_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                                QUERY_DATE = GetDDMMYYDate(QUERY_DATE);
                            }
                            var QUERY_REVERT_DATE = PT[i].QUERY_REVERT_DATE;
                            if (QUERY_REVERT_DATE != "" && QUERY_REVERT_DATE != null) {
                                QUERY_REVERT_DATE = new Date(parseInt(PT[i].QUERY_REVERT_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                                QUERY_REVERT_DATE = GetDDMMYYDate(QUERY_REVERT_DATE);
                            }
                            var MSME_DUE_DATE = PT[i].MSME_DUE_DATE;
                            if (MSME_DUE_DATE != "" && MSME_DUE_DATE != null) {
                                MSME_DUE_DATE = new Date(parseInt(PT[i].MSME_DUE_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                                MSME_DUE_DATE = GetDDMMYYDate(MSME_DUE_DATE);
                            }
                            var GST_DUE_DATE = PT[i].GST_DUE_DATE;
                            if (GST_DUE_DATE != "" && GST_DUE_DATE != null) {
                                GST_DUE_DATE = new Date(parseInt(PT[i].GST_DUE_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                                GST_DUE_DATE = GetDDMMYYDate(GST_DUE_DATE);
                            }
                            var PAYMENT_DATE = PT[i].PAYMENT_DATE;
                            if (PAYMENT_DATE != "" && PAYMENT_DATE != null) {
                                PAYMENT_DATE = new Date(parseInt(PT[i].PAYMENT_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                                PAYMENT_DATE = GetDDMMYYDate(PAYMENT_DATE);
                            }
                            var HGS_INVOICE_DATE = PT[i].HGS_INVOICE_DATE;
                            if (HGS_INVOICE_DATE != "" && HGS_INVOICE_DATE != null) {
                                HGS_INVOICE_DATE = new Date(parseInt(PT[i].HGS_INVOICE_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                                HGS_INVOICE_DATE = GetDDMMYYDate(HGS_INVOICE_DATE);
                            }
                            var BILLING_TEAM_COMPLETION = PT[i].BILLING_TEAM_COMPLETION;
                            if (BILLING_TEAM_COMPLETION != "" && BILLING_TEAM_COMPLETION != null) {
                                BILLING_TEAM_COMPLETION = new Date(parseInt(PT[i].BILLING_TEAM_COMPLETION.replace(/(^.*\()|([+-].*$)/g, '')));
                                BILLING_TEAM_COMPLETION = GetDDMMYYDate(BILLING_TEAM_COMPLETION);
                            }
                            var RECD_FROM_VENDOR = PT[i].RECD_FROM_VENDOR;
                            if (RECD_FROM_VENDOR != "" && RECD_FROM_VENDOR != null) {
                                RECD_FROM_VENDOR = new Date(parseInt(PT[i].RECD_FROM_VENDOR.replace(/(^.*\()|([+-].*$)/g, '')));
                                RECD_FROM_VENDOR = GetDDMMYYDate(RECD_FROM_VENDOR);
                            }
                            var RECD_FROM_COMPLIANCE = PT[i].RECD_FROM_COMPLIANCE;
                            if (RECD_FROM_COMPLIANCE != "" && RECD_FROM_COMPLIANCE != null) {
                                RECD_FROM_COMPLIANCE = new Date(parseInt(PT[i].RECD_FROM_COMPLIANCE.replace(/(^.*\()|([+-].*$)/g, '')));
                                RECD_FROM_COMPLIANCE = GetDDMMYYDate(RECD_FROM_COMPLIANCE);
                            }
                            var BILLING_TEAM_INTIMATION = PT[i].BILLING_TEAM_INTIMATION;
                            if (BILLING_TEAM_INTIMATION != "" && BILLING_TEAM_INTIMATION != null) {
                                BILLING_TEAM_INTIMATION = new Date(parseInt(PT[i].BILLING_TEAM_INTIMATION.replace(/(^.*\()|([+-].*$)/g, '')));
                                BILLING_TEAM_INTIMATION = GetDDMMYYDate(BILLING_TEAM_INTIMATION);
                            }

                            var BillingStatus = PT[i].IsBillingCompleted == false ? 'No' : 'Yes';
                            var SubmiitedToBilling = PT[i].IsSubmiitedToBilling == false ? 'No' : 'Yes';
                            if (BillingStatus == 'No') {
                                $("#VendorTrackingMasterTbl").append("<tr style='background-color: #F9EBEA'><td>"
                                    + ('<a class="clkEdit pointerOnAnchor" id="clkEdit" style=""><span style="color:green">Edit</span></a> | <a class="clkView pointerOnAnchor" id="clkView" style=""><span style="color:orange">View</span></a>') + "</td><td style='display:none'>"
                                    + PT[i].EncriptedInvCode + "</td><td style='word-break: break-all !important'>" + PT[i].INVOICE_CODE + "</td><td style='word-break: break-all !important'>"
                                    + INVOICE_ENTRY_DATE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].InvoiceEnteredUser + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].VENDOR_NAME + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].VENDOR_SAP_CODE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].VENDOR_GST + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].VENDOR_MSME + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].SAC_CODE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].INVOICE_NO + "</td><td style='word-break: break-all !important'>"
                                    + INVOICE_DATE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].CLIENT_NAME + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].SERVICE_NAME + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].ADDITIONAL_INFORMATION + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].REGISTRATION_NUMBER + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].SITE_CODE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].LOCATION + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].CITY_NAME + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].STATE_NAME + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].SERVICE_PERIOD + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].SERVICE_CHARGE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].CGST + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].SGST + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].IGST + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].REIMB_EXPENSES + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].INVOICE_AMOUNT + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].TDS_AMOUNT + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].ADVANCE_ADJUSTMENT + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].NET_AMOUNT + "</td><td style='word-break: break-all !important'>"
                                    + RECD_FROM_VENDOR + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].ComplianceUserName + "</td><td style='word-break: break-all !important'>"
                                    + COMPLIANCE_FORWARD_DATE + "</td><td style='word-break: break-all !important'>"
                                    + RECD_FROM_COMPLIANCE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].COMPLIANCE_REMARKS + "</td><td style='word-break: break-all !important'>"
                                    + SAP_POSTING_DATE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].SAP_DOC_NO + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].SAP_ENTRY_USER + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].APPROVED_BY + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].APPROVAL_EMAIL_REFERENCE + "</td><td style='word-break: break-all !important'>"
                                    + QUERY_DATE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].NATURE_OF_QUERY + "</td><td style='word-break: break-all !important'>"
                                    + QUERY_REVERT_DATE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].QUERY_RESOLUTION + "</td><td style='word-break: break-all !important'>"
                                    + MSME_DUE_DATE + "</td><td style='word-break: break-all !important'>"
                                    + GST_DUE_DATE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].PAYMENT_STATUS + "</td><td style='word-break: break-all !important'>"
                                    + PAYMENT_DATE + "</td><td style='word-break: break-all !important'>"
                                    + BILLING_TEAM_INTIMATION + "</td><td style='word-break: break-all !important'>"
                                    + BILLING_TEAM_COMPLETION + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].BILLING_CATEGORY_NAME + "</td><td style='word-break: break-all !important'>"
                                    + HGS_INVOICE_DATE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].HGS_INVOICE_NO + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].HGS_INVOICE_AMOUNT + "</td><td style='word-break: break-all !important'>"
                                    + SubmiitedToBilling + "</td><td style='word-break: break-all !important'>"
                                    + BillingStatus + "</td></tr>");
                            } else {
                                $("#VendorTrackingMasterTbl").append("<tr style='background-color: #E8F8F5'><td>"
                                    + ('<a class="clkEdit pointerOnAnchor" id="clkEdit" style=""><span style="color:green">Edit</span></a> | <a class="clkView pointerOnAnchor" id="clkView" style=""><span style="color:orange">View</span></a>') + "</td><td style='display:none'>"
                                    + PT[i].EncriptedInvCode + "</td><td style='word-break: break-all !important'>" + PT[i].INVOICE_CODE + "</td ><td style='word-break: break-all !important'>"
                                    + INVOICE_ENTRY_DATE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].InvoiceEnteredUser + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].VENDOR_NAME + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].VENDOR_SAP_CODE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].VENDOR_GST + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].VENDOR_MSME + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].SAC_CODE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].INVOICE_NO + "</td><td style='word-break: break-all !important'>"
                                    + INVOICE_DATE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].CLIENT_NAME + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].SERVICE_NAME + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].ADDITIONAL_INFORMATION + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].REGISTRATION_NUMBER + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].SITE_CODE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].LOCATION + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].CITY_NAME + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].STATE_NAME + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].SERVICE_PERIOD + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].SERVICE_CHARGE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].CGST + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].SGST + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].IGST + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].REIMB_EXPENSES + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].INVOICE_AMOUNT + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].TDS_AMOUNT + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].ADVANCE_ADJUSTMENT + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].NET_AMOUNT + "</td><td style='word-break: break-all !important'>"
                                    + RECD_FROM_VENDOR + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].ComplianceUserName + "</td><td style='word-break: break-all !important'>"
                                    + COMPLIANCE_FORWARD_DATE + "</td><td style='word-break: break-all !important'>"
                                    + RECD_FROM_COMPLIANCE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].COMPLIANCE_REMARKS + "</td><td style='word-break: break-all !important'>"
                                    + SAP_POSTING_DATE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].SAP_DOC_NO + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].SAP_ENTRY_USER + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].APPROVED_BY + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].APPROVAL_EMAIL_REFERENCE + "</td><td style='word-break: break-all !important'>"
                                    + QUERY_DATE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].NATURE_OF_QUERY + "</td><td style='word-break: break-all !important'>"
                                    + QUERY_REVERT_DATE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].QUERY_RESOLUTION + "</td><td style='word-break: break-all !important'>"
                                    + MSME_DUE_DATE + "</td><td style='word-break: break-all !important'>"
                                    + GST_DUE_DATE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].PAYMENT_STATUS + "</td><td style='word-break: break-all !important'>"
                                    + PAYMENT_DATE + "</td><td style='word-break: break-all !important'>"
                                    + BILLING_TEAM_INTIMATION + "</td><td style='word-break: break-all !important'>"
                                    + BILLING_TEAM_COMPLETION + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].BILLING_CATEGORY_NAME + "</td><td style='word-break: break-all !important'>"
                                    + HGS_INVOICE_DATE + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].HGS_INVOICE_NO + "</td><td style='word-break: break-all !important'>"
                                    + PT[i].HGS_INVOICE_AMOUNT + "</td><td style='word-break: break-all !important'>"
                                    + SubmiitedToBilling + "</td><td style='word-break: break-all !important'>"
                                    + BillingStatus + "</td></tr>");
                            }

                        }
                    } else {
                        if (SearchType == "PY") {
                            if (TotalLength > 0) {

                            } else {
                                $("#VendorTrackingMasterTbl").find("tr:gt(0)").remove();
                                $("#nav").hide();
                                $("#VendorTrackingMasterTbl").append("<tr style='color:red;'><td colspan='25' style='text-align:left'>No Record Found</td></tr>");
                            }
                        } else {
                            $("#nav").hide();
                            $("#VendorTrackingMasterTbl").append("<tr style='color:red;'><td colspan='25' style='text-align:left'>No Record Found</td></tr>");
                        }
                       
                    }
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });
        }
    }

    $("#clkAdd").click(function () {
        var UserRole = $("#HDUserRole").val().trim();
        if (UserRole == 'AD' || UserRole == 'VAD' || UserRole == 'VEN' ) {
            window.location.href = "/Transactions/VendorEntry?AC=E&TY=VE";

        } else if (UserRole == 'VVI' || UserRole == 'BVI' || UserRole == 'BAD' || UserRole == 'BEN') {
            $.alert({
                title: "Error",
                content: "Dont have add access!"
            })
        }       
    });


    $(document).on("click", ".clkView", function () {
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var InvoiceNo = $("#VendorTrackingMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();

        //window.open("/Transactions/VendorEntry?AC=V&TY=VE&In=" + InvoiceNo + "", '_blank');
        window.location.href = "/Transactions/VendorEntry?AC=V&TY=VE&In=" + InvoiceNo + "";
    });

    $(document).on("click", ".clkEdit", function () {
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var InvoiceNo = $("#VendorTrackingMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        var UserRole = $("#HDUserRole").val().trim();
        if (UserRole == 'AD' || UserRole == 'VAD' || UserRole == 'VEN' || UserRole == 'BAD' || UserRole == 'BEN') {
            if (UserRole == 'AD' || UserRole == 'VAD' || UserRole == 'VEN') {
                //window.open("/Transactions/VendorEntry?AC=E&TY=VE&In=" + InvoiceNo + "", '_blank');
                window.location.href = "/Transactions/VendorEntry?AC=E&TY=VE&In=" + InvoiceNo + "";
            } else if (UserRole == 'BAD' || UserRole == 'BEN') {
                //window.open("/Transactions/VendorEntry?AC=E&TY=BL&In=" + InvoiceNo + "", '_blank');
                window.location.href = "/Transactions/VendorEntry?AC=E&TY=BL&In=" + InvoiceNo + "";
            }

        } else if (UserRole == 'VVI' || UserRole == 'BVI') {
            $.alert({
                title: "Error",
                content: "Dont have edit access!"
            })
        }

    });

    $("#ddlFilterType").change(function () {
        $("#FilterValue").val('');
        $("#VENDOR_CODE").val('');
        $("#CLIENT_CODE").val('');
        $("#SERVICE_CODE").val();
        var ddlFilterType = $("#ddlFilterType").val().trim();
        if (ddlFilterType == "a.VENDOR_CODE") {
            $("#FilterValue").hide();
            $("#CLIENT_CODE").hide();
            $("#SERVICE_CODE").hide();
            $("#VENDOR_CODE").show();
        } else if (ddlFilterType == "a.CLIENT_CODE") {
            $("#FilterValue").hide();
            $("#VENDOR_CODE").hide();
            $("#SERVICE_CODE").hide();
            $("#CLIENT_CODE").show();
        } else if (ddlFilterType == "a.SERVICE_CODE") {
            $("#FilterValue").hide();
            $("#VENDOR_CODE").hide();
            $("#CLIENT_CODE").hide();
            $("#SERVICE_CODE").show();
        } else {
            $("#SERVICE_CODE").hide();
            $("#CLIENT_CODE").hide();
            $("#VENDOR_CODE").hide();
            $("#FilterValue").show();
        }
    });

    $("#VENDOR_CODE").change(function () {
        var VENDOR_CODE = $("#VENDOR_CODE").val().trim();
        $("#FilterValue").val(VENDOR_CODE);
    });
    $("#CLIENT_CODE").change(function () {
        var CLIENT_CODE = $("#CLIENT_CODE").val().trim();
        $("#FilterValue").val(CLIENT_CODE);
    });
    $("#SERVICE_CODE").change(function () {
        var SERVICE_CODE = $("#SERVICE_CODE").val().trim();
        $("#FilterValue").val(SERVICE_CODE);
    });


    function GetDDMMYYDate(date) {
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return day + '/' + month + '/' + year;
    }

    function getPageList(totalPages, page, maxLength) {
        if (maxLength < 5) throw "maxLength must be at least 5";

        function range(start, end) {
            return Array.from(Array(end - start + 1), (_, i) => i + start);
        }

        var sideWidth = maxLength < 9 ? 1 : 2;
        var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
        var rightWidth = (maxLength - sideWidth * 2 - 2) >> 1;
        if (totalPages <= maxLength) {
            return range(1, totalPages);
        }
        if (page <= maxLength - sideWidth - 1 - rightWidth) {
            return range(1, maxLength - sideWidth - 1)
                .concat(0, range(totalPages - sideWidth + 1, totalPages));
        }
        if (page >= totalPages - sideWidth - 1 - rightWidth) {
            return range(1, sideWidth)
                .concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
        }
        return range(1, sideWidth)
            .concat(0, range(page - leftWidth, page + rightWidth),
                0, range(totalPages - sideWidth + 1, totalPages));
    }

    function SetPages(numberOfItems, limitPerPage, paginationSize) {

        var numberOfItems = numberOfItems;
        var limitPerPage = limitPerPage;
        var totalPages = Math.ceil(numberOfItems / limitPerPage);
        var paginationSize = paginationSize;
        var currentPage;

        function showPage(whichPage) {
            if (whichPage < 1 || whichPage > totalPages) return false;
            currentPage = whichPage;
            $(".pagination li").slice(1, -1).remove();
            getPageList(totalPages, currentPage, paginationSize).forEach(item => {
                $("<li>").addClass("page-item")
                    .addClass(item ? "current-page" : "disabled")
                    .toggleClass("active", item === currentPage).append(
                        $("<a>").addClass("page-link").attr({
                            href: "javascript:void(0)"
                        }).text(item || "...")
                    ).insertBefore("#next-page");
            });
            $("#previous-page").toggleClass("disabled", currentPage === 1);
            $("#next-page").toggleClass("disabled", currentPage === totalPages);
            return true;
        }
        $(".pagination").append(
            $("<li>").addClass("page-item").attr({ id: "previous-page" }).append(
                $("<a>").addClass("page-link").attr({
                    href: "javascript:void(0)"
                }).text("Prev")
            ),
            $("<li>").addClass("page-item").attr({ id: "next-page" }).append(
                $("<a>").addClass("page-link").attr({
                    href: "javascript:void(0)"
                }).text("Next")
            )
        );
        showPage(1);
        $(document).on("click", ".pagination li.current-page:not(.active)", function () {
            return showPage(+$(this).text());
        });
        $("#next-page").on("click", function () {
            var End = parseInt(currentPage + 1) * parseInt(15);
            var Start = (parseInt(End) - parseInt(15));
            $("#VendorTrackingMasterTbl").find("tr:gt(0)").remove();
            GetAllRecords(Start, 15);
            return showPage(currentPage + 1);
        });

        $("#previous-page").on("click", function () {
            var End = parseInt(currentPage - 1) * parseInt(15);
            var Start = (parseInt(End) - parseInt(15));
            $("#VendorTrackingMasterTbl").find("tr:gt(0)").remove();
            GetAllRecords(Start, 15);
            return showPage(currentPage - 1);
        });
        $(".pagination").append("</ul>");
    };

    $("#GenExcel").click(function () {

        $("#VendorTrackingMasterTblCopy").find("tr:gt(0)").remove();

        if (SearchType == "BL") {
            $("#ddlFilterType").val("IsBillingCompleted");
            $("#FilterValue").val("0");
        } else if (SearchType == "PY") {
            var FilterType = "PAYMENT_STATUS";
            var FilterValue = "No";
            var FromDate = $("#FromDate").val().trim();
            var ToDate = $("#ToDate").val().trim();

           
            $.ajax({
                type: "POST",
                url: "/Transactions/GetVendorTrackingListExcel",
                data: JSON.stringify({ 'FilterType': FilterType, 'FilterValue': FilterValue, 'FromDate': FromDate, 'ToDate': ToDate }),
                contentType: "application/json; charset=utf-8",
                dataType: "json", headers: headers,
                async: false,
                success: function (data) {
                    var ns = JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\""));
                    console.log(ns);
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
                        $("#VendorTrackingMasterTblCopy").append("<tr><td>" + value.INVOICE_CODE + "</td ><td>"
                            + INVOICE_ENTRY_DATE + "</td><td>"
                            + value.InvoiceEnteredUser + "</td><td>"
                            + value.VENDOR_NAME + "</td><td>"
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
                            + value.HGS_INVOICE_AMOUNT + "</td><td>"
                            + value.IsSubmiitedToBilling + "</td><td>"
                            + value.IsBillingCompleted + "</td></tr>");
                    });                  
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });

            FilterType = "PAYMENT_STATUS1";
            FilterValue = "No";
           

            $.ajax({
                type: "POST",
                url: "/Transactions/GetVendorTrackingListExcel",
                data: JSON.stringify({ 'FilterType': FilterType, 'FilterValue': FilterValue, 'FromDate': FromDate, 'ToDate': ToDate }),
                contentType: "application/json; charset=utf-8",
                dataType: "json", headers: headers, async: false,
                success: function (data) {
                    var ns = JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\""));
                    console.log(ns);
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
                        $("#VendorTrackingMasterTblCopy").append("<tr><td>" + value.INVOICE_CODE + "</td ><td>"
                            + INVOICE_ENTRY_DATE + "</td><td>"
                            + value.InvoiceEnteredUser + "</td><td>"
                            + value.VENDOR_NAME + "</td><td>"
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
                            + value.HGS_INVOICE_AMOUNT + "</td><td>"
                            + value.IsSubmiitedToBilling + "</td><td>"
                            + value.IsBillingCompleted + "</td></tr>");
                    });
                    
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });

            var TblLength = $("#VendorTrackingMasterTblCopy").find("tr").length;
           
            if (TblLength > 1) {
                $("#VendorTrackingMasterTblCopy").table2excel({
                    name: "Table2Excel",
                    filename: "Vendor_Tracking_Report"

                });
            }

        } else {
            var Validate = true;
            var FilterType = $("#ddlFilterType").val().trim();
            var FilterValue = $("#FilterValue").val().trim();
            var FromDate = $("#FromDate").val().trim();
            var ToDate = $("#ToDate").val().trim();
            if (FilterType == '' && FilterValue == '' && ToDate == '' && FromDate == '') {
                Validate = false;
                $.alert("Please select filter value or from & to date!");
            }
            if (Validate) {
                $body.addClass("loading");
                $.ajax({
                    type: "POST",
                    url: "/Transactions/GetVendorTrackingListExcel",
                    data: JSON.stringify({ 'FilterType': FilterType, 'FilterValue': FilterValue, 'FromDate': FromDate, 'ToDate': ToDate }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json", headers: headers,
                    success: function (data) {
                        var ns = JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\""));
                        console.log(ns);
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
                            $("#VendorTrackingMasterTblCopy").append("<tr><td>" + value.INVOICE_CODE + "</td ><td>"
                                + INVOICE_ENTRY_DATE + "</td><td>"
                                + value.InvoiceEnteredUser + "</td><td>"
                                + value.VENDOR_NAME + "</td><td>"
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
                                + value.HGS_INVOICE_AMOUNT + "</td><td>"
                                + value.IsSubmiitedToBilling + "</td><td>"
                                + value.IsBillingCompleted + "</td></tr>");
                        });
                        var TblLength = $("#VendorTrackingMasterTblCopy").find("tr").length;
                        if (TblLength > 1) {
                            $("#VendorTrackingMasterTblCopy").table2excel({
                                name: "Table2Excel",
                                filename: "Vendor_Tracking_Report"

                            });
                        }
                    },
                    complete: function () {
                        $body.removeClass("loading");
                    }
                });
            }
        }
    
    });

    $("#morefilter").on("keyup", function () {

        var value = $(this).val().toLowerCase();

        $("#VendorTrackingMasterTbl tr:not(:first-child)").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    function LoadDropdown() {
        $.ajax({
            type: "POST",
            url: "/Transactions/GetVendorsDropdwon",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false, headers: headers,
            success: function (r) {
                //console.log(r);
                var ddlval = $("[id*=VENDOR_CODE]");
                $.each(r, function () {
                    ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
                });
            }
        });
        $.ajax({
            type: "POST",
            url: "/Transactions/GetClientsDropdwon",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false, headers: headers,
            success: function (r) {
                //console.log(r);
                var ddlval = $("[id*=CLIENT_CODE]");
                $.each(r, function () {
                    ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
                });
            }
        });
        $.ajax({
            type: "POST",
            url: "/Transactions/GetServicesDropdwon",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json", headers: headers,
            async: false,
            success: function (r) {
                //console.log(r);
                var ddlval = $("[id*=SERVICE_CODE]");
                $.each(r, function () {
                    ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
                });
            }
        });
        //$.ajax({
        //    type: "POST",
        //    url: "/Transactions/GetStatesDropdwon",
        //    data: '{}',
        //    contentType: "application/json; charset=utf-8",
        //    dataType: "json",
        //    async: false,
        //    success: function (r) {
        //        //console.log(r);
        //        var ddlval = $("[id*=STATE_CODE]");
        //        $.each(r, function () {
        //            ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
        //        });
        //    }
        //});
        //$.ajax({
        //    type: "POST",
        //    url: "/Transactions/GetBillingCategoryDropdwon",
        //    data: '{}',
        //    contentType: "application/json; charset=utf-8",
        //    dataType: "json",
        //    async: false,
        //    success: function (r) {
        //        //console.log(r);
        //        var ddlval = $("[id*=BILLING_CATEGORY_CODE]");
        //        $.each(r, function () {
        //            ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
        //        });
        //    }
        //});
        //$.ajax({
        //    type: "POST",
        //    url: "/Transactions/GetSACCodesDropdwon",
        //    data: '{}',
        //    contentType: "application/json; charset=utf-8",
        //    dataType: "json",
        //    async: false,
        //    success: function (r) {
        //        //console.log(r);
        //        var ddlval = $("[id*=SAC_CODE]");
        //        $.each(r, function () {
        //            ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
        //        });
        //    }
        //});
        //$.ajax({
        //    type: "POST",
        //    url: "/Transactions/GetUserDropdwon",
        //    data: '{}',
        //    contentType: "application/json; charset=utf-8",
        //    dataType: "json",
        //    async: false,
        //    success: function (r) {
        //        //console.log(r);
        //        var ddlval = $("[id*=INVOICE_ENTRY_USER]");
        //        $.each(r, function () {
        //            ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
        //        });
        //    }
        //});
        //$.ajax({
        //    type: "POST",
        //    url: "/Transactions/GetUserDropdwon",
        //    data: '{}',
        //    contentType: "application/json; charset=utf-8",
        //    dataType: "json",
        //    async: false,
        //    success: function (r) {
        //        //console.log(r);
        //        var ddlval = $("[id*=COMPLIANCE_USER]");
        //        $.each(r, function () {
        //            ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
        //        });
        //    }
        //});
    }
});