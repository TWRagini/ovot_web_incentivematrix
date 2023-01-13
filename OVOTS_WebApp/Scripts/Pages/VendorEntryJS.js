$(document).ready(function () {
    $body = $("body");

    var form = $('#AntiForgeryForm');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    var headers = {};
    headers['__RequestVerificationToken'] = token;
    var OldValue = '';
    SetDate();
    $body.addClass("loading");
    LoadDropdown();
    $body.removeClass("loading");
    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        }
        return decodeURI(results[1]) || 0;
    }
    var InvoiceNo = "";
    var AccessType = $.urlParam('AC');
    var UserType = $.urlParam('TY');
    var EncriptedInvoiceNo = $.urlParam('In');

    if (EncriptedInvoiceNo != null && EncriptedInvoiceNo != "") {

        $.ajax({
            type: "POST",
            url: "/Transactions/GetDecriptedInvoiceNo",
            data: JSON.stringify({ 'EncriptedInvoiceNo': EncriptedInvoiceNo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json", headers: headers,
            async: false,
            success: function (data) {
                InvoiceNo = data;
                GetInvoiceDetails();
            }
        });

    }

    if (AccessType != null && UserType != null) {
        if (AccessType == "V") {
            ViewForm();
            $("#btnSave").hide();
            $("#btnBillingSave").hide();
        } else {
            //EditForm();
            if (UserType == "BL") {
                BLEdit();
                $("#btnSave").hide();
                $("#btnBillingSave").show();
            } else if (UserType == "VE") {
                VendorEdit();
                $("#btnSave").show();
                $("#btnBillingSave").hide();
            }
        }
    }

    var UserRole = $("#HDUserRole").val();
    if (UserRole == 'AD' || UserRole == 'VAD' || UserRole == 'BAD' || UserRole == 'BEN') {
        $("#BillingDiv").show();
    } else {
        $("#BillingDiv").hide();
    }
    if (UserRole == 'AD' || UserRole == 'VAD') {
        if (AccessType != "V") {
            $("#BILLING_TEAM_COMPLETION").attr('disabled', false);
            $("#BILLING_CATEGORY_CODE").attr('disabled', false);
            $("#HGS_INVOICE_DATE").attr('disabled', false);
            $("#HGS_INVOICE_NO").attr('disabled', false);
            $("#HGS_INVOICE_AMOUNT").attr('disabled', false);
        }
    }

    function GetInvoiceDetails() {
        $body.addClass("loading");
        $.ajax({
            type: "POST",
            url: "/Transactions/GetVendorTrackingDetails",
            data: JSON.stringify({ 'InvoiceNo': InvoiceNo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json", headers: headers,
            success: function (data) {
                var ns = data;
                //console.log(data);
                var INVOICE_ENTRY_DATE = ns.INVOICE_ENTRY_DATE;
                if (INVOICE_ENTRY_DATE != "" && INVOICE_ENTRY_DATE != null) {
                    INVOICE_ENTRY_DATE = new Date(parseInt(ns.INVOICE_ENTRY_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                    INVOICE_ENTRY_DATE = GetDDMMYYDate(INVOICE_ENTRY_DATE);
                }
                var INVOICE_DATE = ns.INVOICE_DATE;
                if (INVOICE_DATE != "") {
                    INVOICE_DATE = new Date(parseInt(ns.INVOICE_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                    INVOICE_DATE = GetDDMMYYDate(INVOICE_DATE);
                }
                var COMPLIANCE_FORWARD_DATE = ns.COMPLIANCE_FORWARD_DATE;
                if (COMPLIANCE_FORWARD_DATE != '' && COMPLIANCE_FORWARD_DATE != null) {
                    COMPLIANCE_FORWARD_DATE = new Date(parseInt(ns.COMPLIANCE_FORWARD_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                    COMPLIANCE_FORWARD_DATE = GetDDMMYYDate(COMPLIANCE_FORWARD_DATE);
                }
                var SAP_POSTING_DATE = ns.SAP_POSTING_DATE;
                if (SAP_POSTING_DATE != "" && SAP_POSTING_DATE != null) {
                    SAP_POSTING_DATE = new Date(parseInt(ns.SAP_POSTING_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                    SAP_POSTING_DATE = GetDDMMYYDate(SAP_POSTING_DATE);
                }
                var QUERY_DATE = ns.QUERY_DATE;
                if (QUERY_DATE != "" && QUERY_DATE != null) {
                    QUERY_DATE = new Date(parseInt(ns.QUERY_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                    QUERY_DATE = GetDDMMYYDate(QUERY_DATE);
                }
                var QUERY_REVERT_DATE = ns.QUERY_REVERT_DATE;
                if (QUERY_REVERT_DATE != "" && QUERY_REVERT_DATE != null) {
                    QUERY_REVERT_DATE = new Date(parseInt(ns.QUERY_REVERT_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                    QUERY_REVERT_DATE = GetDDMMYYDate(QUERY_REVERT_DATE);
                }
                var MSME_DUE_DATE = ns.MSME_DUE_DATE;
                if (MSME_DUE_DATE != "" && MSME_DUE_DATE != null) {
                    MSME_DUE_DATE = new Date(parseInt(ns.MSME_DUE_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                    MSME_DUE_DATE = GetDDMMYYDate(MSME_DUE_DATE);
                }
                var GST_DUE_DATE = ns.GST_DUE_DATE;
                if (GST_DUE_DATE != "" && GST_DUE_DATE != null) {
                    GST_DUE_DATE = new Date(parseInt(ns.GST_DUE_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                    GST_DUE_DATE = GetDDMMYYDate(GST_DUE_DATE);
                }
                var PAYMENT_DATE = ns.PAYMENT_DATE;
                if (PAYMENT_DATE != "" && PAYMENT_DATE != null) {
                    PAYMENT_DATE = new Date(parseInt(ns.PAYMENT_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                    PAYMENT_DATE = GetDDMMYYDate(PAYMENT_DATE);
                }
                var HGS_INVOICE_DATE = ns.HGS_INVOICE_DATE;
                if (HGS_INVOICE_DATE != "" && HGS_INVOICE_DATE != null) {
                    HGS_INVOICE_DATE = new Date(parseInt(ns.HGS_INVOICE_DATE.replace(/(^.*\()|([+-].*$)/g, '')));
                    HGS_INVOICE_DATE = GetDDMMYYDate(HGS_INVOICE_DATE);
                }
                var BILLING_TEAM_COMPLETION = ns.BILLING_TEAM_COMPLETION;
                if (BILLING_TEAM_COMPLETION != "" && BILLING_TEAM_COMPLETION != null) {
                    BILLING_TEAM_COMPLETION = new Date(parseInt(ns.BILLING_TEAM_COMPLETION.replace(/(^.*\()|([+-].*$)/g, '')));
                    BILLING_TEAM_COMPLETION = GetDDMMYYDate(BILLING_TEAM_COMPLETION);
                }
                var RECD_FROM_VENDOR = ns.RECD_FROM_VENDOR;
                if (RECD_FROM_VENDOR != "" && RECD_FROM_VENDOR != null) {
                    RECD_FROM_VENDOR = new Date(parseInt(ns.RECD_FROM_VENDOR.replace(/(^.*\()|([+-].*$)/g, '')));
                    RECD_FROM_VENDOR = GetDDMMYYDate(RECD_FROM_VENDOR);
                }
                var RECD_FROM_COMPLIANCE = ns.RECD_FROM_COMPLIANCE;
                if (RECD_FROM_COMPLIANCE != "" && RECD_FROM_COMPLIANCE != null) {
                    RECD_FROM_COMPLIANCE = new Date(parseInt(ns.RECD_FROM_COMPLIANCE.replace(/(^.*\()|([+-].*$)/g, '')));
                    RECD_FROM_COMPLIANCE = GetDDMMYYDate(RECD_FROM_COMPLIANCE);
                }
                var BILLING_TEAM_INTIMATION = ns.BILLING_TEAM_INTIMATION;
                if (BILLING_TEAM_INTIMATION != "" && BILLING_TEAM_INTIMATION != null) {
                    BILLING_TEAM_INTIMATION = new Date(parseInt(ns.BILLING_TEAM_INTIMATION.replace(/(^.*\()|([+-].*$)/g, '')));
                    BILLING_TEAM_INTIMATION = GetDDMMYYDate(BILLING_TEAM_INTIMATION);
                }

                $("#HDINVOICE_CODE").val(ns.INVOICE_CODE);
                $("#INVOICE_ENTRY_DATE").val(INVOICE_ENTRY_DATE);
                $("#INVOICE_ENTRY_USER").val(ns.INVOICE_ENTRY_USER);
                $("#VENDOR_CODE").val(ns.VENDOR_CODE);
                $("#VENDOR_SAP_CODE").val(ns.VENDOR_SAP_CODE);
                $("#VENDOR_GST").val(ns.VENDOR_GST);
                $("#VENDOR_MSME").val(ns.VENDOR_MSME);
                $("#SAC_CODE").val(ns.SAC_CODE);
                $("#INVOICE_NO").val(ns.INVOICE_NO);
                OldValue = ns.INVOICE_NO;
                $("#INVOICE_DATE").val(INVOICE_DATE);
                $("#CLIENT_CODE").val(ns.CLIENT_CODE);
                $("#SERVICE_CODE").val(ns.SERVICE_CODE);
                $("#ADDITIONAL_INFORMATION").val(ns.ADDITIONAL_INFORMATION);
                $("#REGISTRATION_NUMBER").val(ns.REGISTRATION_NUMBER);
                $("#SITE_CODE").val(ns.SITE_CODE);
                $("#LOCATION").val(ns.LOCATION);

                $("#STATE_CODE").val(ns.STATE_CODE);
                $.ajax({
                    type: "POST",
                    url: "/Transactions/GetStateWiseCityDropdwon",
                    data: JSON.stringify({ 'State': ns.STATE_CODE }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false, headers: headers,
                    success: function (r) {
                        var ddlval = $("[id*=CITY_CODE]");
                        $.each(r, function () {
                            ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
                        });
                    }
                });
                $("#CITY_CODE").val(ns.CITY_CODE);
                $("#SERVICE_PERIOD").val(ns.SERVICE_PERIOD);
                $("#SERVICE_CHARGE").val(ns.SERVICE_CHARGE);
                $("#CGST").val(ns.CGST.toFixed(2));
                $("#SGST").val(ns.SGST.toFixed(2));
                $("#IGST").val(ns.IGST.toFixed(2));
                $("#REIMB_EXPENSES").val(ns.REIMB_EXPENSES);
                $("#INVOICE_AMOUNT").val(ns.INVOICE_AMOUNT.toFixed(2));
                $("#TDS_AMOUNT").val(ns.TDS_AMOUNT.toFixed(2));
                $("#ADVANCE_ADJUSTMENT").val(ns.ADVANCE_ADJUSTMENT);
                $("#NET_AMOUNT").val(ns.NET_AMOUNT.toFixed(2));
                $("#RECD_FROM_VENDOR").val(RECD_FROM_VENDOR);
                $("#COMPLIANCE_USER").val(ns.COMPLIANCE_USER);
                $("#COMPLIANCE_FORWARD_DATE").val(COMPLIANCE_FORWARD_DATE);
                $("#RECD_FROM_COMPLIANCE").val(RECD_FROM_COMPLIANCE);
                $("#COMPLIANCE_REMARKS").val(ns.COMPLIANCE_REMARKS);
                $("#SAP_POSTING_DATE").val(SAP_POSTING_DATE);
                $("#SAP_DOC_NO").val(ns.SAP_DOC_NO);
                $("#SAP_ENTRY_USER").val(ns.SAP_ENTRY_USER);
                $("#APPROVED_BY").val(ns.APPROVED_BY);
                $("#APPROVAL_EMAIL_REFERENCE").val(ns.APPROVAL_EMAIL_REFERENCE);
                $("#QUERY_DATE").val(QUERY_DATE);
                $("#NATURE_OF_QUERY").val(ns.NATURE_OF_QUERY);
                $("#QUERY_REVERT_DATE").val(QUERY_REVERT_DATE);
                $("#QUERY_RESOLUTION").val(ns.QUERY_RESOLUTION);
                $("#MSME_DUE_DATE").val(MSME_DUE_DATE);
                $("#GST_DUE_DATE").val(GST_DUE_DATE);
                $("#PAYMENT_STATUS").val(ns.PAYMENT_STATUS);
                $("#PAYMENT_DATE").val(PAYMENT_DATE);
                $("#BILLING_TEAM_INTIMATION").val(BILLING_TEAM_INTIMATION);
                $("#BILLING_TEAM_COMPLETION").val(BILLING_TEAM_COMPLETION);
                $("#BILLING_CATEGORY_CODE").val(ns.BILLING_CATEGORY_CODE);
                $("#HGS_INVOICE_DATE").val(HGS_INVOICE_DATE);
                $("#HGS_INVOICE_NO").val(ns.HGS_INVOICE_NO);
                $("#HGS_INVOICE_AMOUNT").val(ns.HGS_INVOICE_AMOUNT);
                //$("#ACTIVE").val(ns.ACTIVE);
                //$("#CurrentStatus").val(ns.CurrentStatus);
                //$("#IsSubmiitedToBilling").val(ns.IsSubmiitedToBilling);
                //$("#IsBillingCompleted").val(ns.IsBillingCompleted);
                //$("#ID").val(ns.ID);


            },
            complete: function () {
                $body.removeClass("loading");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    };
    //input, select, textarea
    $('#Content .valcheck').blur(function () {
        if ($(this).val() == '') {
            $(this).addClass('error');
        } else {
            $(this).removeClass('error');
        }
    });

    //$("#INVOICE_NO").blur(function () {
    //    var INVOICE_NO = $("#INVOICE_NO").val();
    //    var INVOICE_CODE = $("#HDINVOICE_CODE").val().trim();
    //    if (INVOICE_NO != '') {
    //        if (INVOICE_CODE == 0 || INVOICE_NO != OldValue) {
    //            $.ajax({
    //                type: "POST",
    //                url: "/Masters/CheckDuplicate",
    //                data: JSON.stringify({ 'TblName': 'VendorTrackingTbl', 'ColumnName': 'INVOICE_NO', 'Value': INVOICE_NO }),
    //                contentType: "application/json; charset=utf-8",
    //                dataType: "json",
    //                async: false,
    //                headers: headers,
    //                success: function (data) {
    //                    console.log(data);
    //                    if (data != "0") {
    //                        Validate = false;
    //                        $.alert("" + INVOICE_NO + " Invoice No Already Exist!");
    //                    }
    //                },
    //                complete: function () {
    //                    $body.removeClass("loading");
    //                }
    //            });
    //        }
    //    }
    //});

    $("#btnSave").click(function () {

        var Validate = true;
        var VendorTracking = [];
        var INVOICE_CODE = $("#HDINVOICE_CODE").val().trim();
        var INVOICE_ENTRY_DATE = $("#INVOICE_ENTRY_DATE").val().trim();
        var INVOICE_ENTRY_USER = $("#INVOICE_ENTRY_USER").val().trim();
        var VENDOR_CODE = $("#VENDOR_CODE").val().trim();
        var VENDOR_SAP_CODE = $("#VENDOR_SAP_CODE").val().trim();
        var VENDOR_GST = $("#VENDOR_GST").val().trim();
        var VENDOR_MSME = $("#VENDOR_MSME").val().trim();
        var SAC_CODE = $("#SAC_CODE").val().trim();
        var INVOICE_NO = $("#INVOICE_NO").val().trim();
        var INVOICE_DATE = $("#INVOICE_DATE").val().trim();
        var CLIENT_CODE = $("#CLIENT_CODE").val().trim();
        var SERVICE_CODE = $("#SERVICE_CODE").val().trim();
        var ADDITIONAL_INFORMATION = $("#ADDITIONAL_INFORMATION").val().trim();
        var REGISTRATION_NUMBER = $("#REGISTRATION_NUMBER").val().trim();
        var SITE_CODE = $("#SITE_CODE").val().trim();
        var LOCATION = $("#LOCATION").val().trim();
        var CITY_CODE = $("#CITY_CODE").val().trim();
        var STATE_CODE = $("#STATE_CODE").val().trim();
        var SERVICE_PERIOD = $("#SERVICE_PERIOD").val().trim();
        var SERVICE_CHARGE = $("#SERVICE_CHARGE").val().trim();
        var CGST = $("#CGST").val().trim();
        var SGST = $("#SGST").val().trim();
        var IGST = $("#IGST").val().trim();
        var REIMB_EXPENSES = $("#REIMB_EXPENSES").val().trim();
        var INVOICE_AMOUNT = $("#INVOICE_AMOUNT").val().trim();
        var TDS_AMOUNT = $("#TDS_AMOUNT").val().trim();
        var ADVANCE_ADJUSTMENT = $("#ADVANCE_ADJUSTMENT").val().trim();
        var NET_AMOUNT = $("#NET_AMOUNT").val().trim();
        var RECD_FROM_VENDOR = $("#RECD_FROM_VENDOR").val().trim();
        var COMPLIANCE_USER = $("#COMPLIANCE_USER").val().trim();
        var COMPLIANCE_FORWARD_DATE = $("#COMPLIANCE_FORWARD_DATE").val().trim();
        var RECD_FROM_COMPLIANCE = $("#RECD_FROM_COMPLIANCE").val().trim();
        var COMPLIANCE_REMARKS = $("#COMPLIANCE_REMARKS").val().trim();
        var SAP_POSTING_DATE = $("#SAP_POSTING_DATE").val().trim();
        var SAP_DOC_NO = $("#SAP_DOC_NO").val().trim();
        var SAP_ENTRY_USER = $("#SAP_ENTRY_USER").val().trim();
        var APPROVED_BY = $("#APPROVED_BY").val();
        var APPROVAL_EMAIL_REFERENCE = $("#APPROVAL_EMAIL_REFERENCE").val().trim();
        var QUERY_DATE = $("#QUERY_DATE").val().trim();
        var NATURE_OF_QUERY = $("#NATURE_OF_QUERY").val().trim();
        var QUERY_REVERT_DATE = $("#QUERY_REVERT_DATE").val().trim();
        var QUERY_RESOLUTION = $("#QUERY_RESOLUTION").val().trim();
        var MSME_DUE_DATE = $("#MSME_DUE_DATE").val().trim();
        var GST_DUE_DATE = $("#GST_DUE_DATE").val().trim();
        var PAYMENT_STATUS = $("#PAYMENT_STATUS").val().trim();
        var PAYMENT_DATE = $("#PAYMENT_DATE").val().trim();
        var BILLING_TEAM_INTIMATION = $("#BILLING_TEAM_INTIMATION").val().trim();
        var BILLING_TEAM_COMPLETION = $("#BILLING_TEAM_COMPLETION").val().trim()
        var BILLING_CATEGORY_CODE = $("#BILLING_CATEGORY_CODE").val().trim();
        var ACTIVE = $("#ACTIVE").val();

        //var CurrentStatus = $("#CurrentStatus").val();
        //var IsSubmiitedToBilling = $("#IsSubmiitedToBilling").val();
        //var IsBillingCompleted = $("#IsBillingCompleted ").val();


        //INVOICE_CODE == "" ? $("#INVOICE_CODE").addClass('error') : $("#INVOICE_CODE").removeClass('error');
        INVOICE_ENTRY_DATE == "" ? $("#INVOICE_ENTRY_DATE").addClass('error') : $("#INVOICE_ENTRY_DATE").removeClass('error');
        INVOICE_ENTRY_USER == "" ? $("#INVOICE_ENTRY_USER").addClass('error') : $("#INVOICE_ENTRY_USER").removeClass('error');
        VENDOR_CODE == "" ? $("#VENDOR_CODE").addClass('error') : $("#VENDOR_CODE").removeClass('error');
        VENDOR_SAP_CODE == "" ? $("#VENDOR_SAP_CODE").addClass('error') : $("#VENDOR_SAP_CODE").removeClass('error');
        VENDOR_GST == "" ? $("#VENDOR_GST").addClass('error') : $("#VENDOR_GST").removeClass('error');
        VENDOR_MSME == "" ? $("#VENDOR_MSME").addClass('error') : $("#VENDOR_MSME").removeClass('error');
        //AP-20210923-Commected on mondatory columns
        //SAC_CODE == "" ? $("#SAC_CODE").addClass('error') : $("#SAC_CODE").removeClass('error');
        INVOICE_NO == "" ? $("#INVOICE_NO").addClass('error') : $("#INVOICE_NO").removeClass('error');
        INVOICE_DATE == "" ? $("#INVOICE_DATE").addClass('error') : $("#INVOICE_DATE").removeClass('error');
        CLIENT_CODE == "" ? $("#CLIENT_CODE").addClass('error') : $("#CLIENT_CODE").removeClass('error');
        SERVICE_CODE == "" ? $("#SERVICE_CODE").addClass('error') : $("#SERVICE_CODE").removeClass('error');
        //AP-20210923-Commected on mondatory columns
        //ADDITIONAL_INFORMATION == "" ? $("#ADDITIONAL_INFORMATION").addClass('error') : $("#ADDITIONAL_INFORMATION").removeClass('error');
        //REGISTRATION_NUMBER == "" ? $("#REGISTRATION_NUMBER").addClass('error') : $("#REGISTRATION_NUMBER").removeClass('error');
        //SITE_CODE == "" ? $("#SITE_CODE").addClass('error') : $("#SITE_CODE").removeClass('error');
        //LOCATION == "" ? $("#LOCATION").addClass('error') : $("#LOCATION").removeClass('error');
        CITY_CODE == "" ? $("#CITY_CODE").addClass('error') : $("#CITY_CODE").removeClass('error');
        STATE_CODE == "" ? $("#STATE_CODE").addClass('error') : $("#STATE_CODE").removeClass('error');
        SERVICE_PERIOD == "" ? $("#SERVICE_PERIOD").addClass('error') : $("#SERVICE_PERIOD").removeClass('error');
        SERVICE_CHARGE == "" ? $("#SERVICE_CHARGE").addClass('error') : $("#SERVICE_CHARGE").removeClass('error');
        CGST == "" ? $("#CGST").addClass('error') : $("#CGST").removeClass('error');
        SGST == "" ? $("#SGST").addClass('error') : $("#SGST").removeClass('error');
        IGST == "" ? $("#IGST").addClass('error') : $("#IGST").removeClass('error');
        //REIMB_EXPENSES == "" ? $("#REIMB_EXPENSES").addClass('error') : $("#REIMB_EXPENSES").removeClass('error');
        INVOICE_AMOUNT == "" ? $("#INVOICE_AMOUNT").addClass('error') : $("#INVOICE_AMOUNT").removeClass('error');
        TDS_AMOUNT == "" ? $("#TDS_AMOUNT").addClass('error') : $("#TDS_AMOUNT").removeClass('error');
        ADVANCE_ADJUSTMENT == "" ? $("#ADVANCE_ADJUSTMENT").addClass('error') : $("#ADVANCE_ADJUSTMENT").removeClass('error');
        NET_AMOUNT == "" ? $("#NET_AMOUNT").addClass('error') : $("#NET_AMOUNT").removeClass('error');
        MSME_DUE_DATE == "" ? $("#MSME_DUE_DATE").addClass('error') : $("#MSME_DUE_DATE").removeClass('error');
        GST_DUE_DATE == "" ? $("#GST_DUE_DATE").addClass('error') : $("#GST_DUE_DATE").removeClass('error');

        //AP-20210923-Commected on mondatory columns
        //SAC_CODE === "" || ADDITIONAL_INFORMATION === "" || REGISTRATION_NUMBER === "" || SITE_CODE === "" || LOCATION === "" || REIMB_EXPENSES === "" ||
        if (INVOICE_ENTRY_DATE === "" || INVOICE_ENTRY_USER === "" || VENDOR_CODE === "" || VENDOR_SAP_CODE === "" || VENDOR_GST === "" || VENDOR_MSME === "" || INVOICE_NO === "" || INVOICE_DATE === "" || CLIENT_CODE === "" || SERVICE_CODE === "" || CITY_CODE === "" || STATE_CODE === "" || SERVICE_PERIOD === "" || SERVICE_CHARGE === "" || CGST === "" || SGST === "" || IGST === "" || INVOICE_AMOUNT === "" || TDS_AMOUNT === "" || ADVANCE_ADJUSTMENT === "" || NET_AMOUNT === "" || MSME_DUE_DATE === "" || GST_DUE_DATE === "") {
            Validate = false;
        }
        if (PAYMENT_STATUS == 'Paid') {
            PAYMENT_DATE == "" ? $("#PAYMENT_DATE").addClass('error') : $("#PAYMENT_DATE").removeClass('error');
            if (PAYMENT_DATE === "") {
                Validate = false;
            }
        } else {
            $("#PAYMENT_DATE").removeClass('error');
        }
        //AP_20210923-Added validation for client groupwise site code
        if ($("#HDClientGroup").val() == "INSTRAKART") {
            SITE_CODE == "" ? $("#SITE_CODE").addClass('error') : $("#SITE_CODE").removeClass('error');
            if (SITE_CODE === "") {
                Validate = false;
            }
        }
        else {
            $("#SITE_CODE").removeClass('error');
        }
        if (UserType == "BL") {
            BILLING_TEAM_COMPLETION == "" ? $("#BILLING_TEAM_COMPLETION").addClass('error') : $("#BILLING_TEAM_COMPLETION").removeClass('error');
            BILLING_CATEGORY_CODE == "" ? $("#BILLING_CATEGORY_CODE").addClass('error') : $("#BILLING_CATEGORY_CODE").removeClass('error');
            if (BILLING_TEAM_COMPLETION === "" || BILLING_CATEGORY_CODE === "") {
                Validate = false;
            }
        }
        else {
            $("#BILLING_TEAM_COMPLETION").removeClass('error');
            $("#BILLING_CATEGORY_CODE").removeClass('error');
        }
        //if (INVOICE_CODE == 0 || INVOICE_NO != OldValue) {
        //    $.ajax({
        //        type: "POST",
        //        url: "/Masters/CheckDuplicate",
        //        data: JSON.stringify({ 'TblName': 'VendorTrackingTbl', 'ColumnName': 'INVOICE_NO', 'Value': INVOICE_NO }),
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        async: false,
        //        headers: headers,
        //        success: function (data) {
        //            console.log(data);
        //            if (data != "0") {
        //                Validate = false;
        //                $.alert("" + INVOICE_NO + " Invoice No Already Exist!");
        //            }
        //        },
        //        complete: function () {
        //            $body.removeClass("loading");
        //        }
        //    });
        //}

        if (Validate) {
            $body.addClass("loading");
            var ACTIVE = false;
            if ($("#Active").prop("checked") == true) {
                ACTIVE = true;
            }
            var FINVOICE_ENTRY_DATE = FormateDate(INVOICE_ENTRY_DATE);
            var FINVOICE_DATE = FormateDate(INVOICE_DATE);
            var FMSME_DUE_DATE = FormateDate(MSME_DUE_DATE);
            var FGST_DUE_DATE = FormateDate(GST_DUE_DATE);
            var FPAYMENT_DATE = FormateDate(PAYMENT_DATE);
            if (RECD_FROM_VENDOR != "") {
                var FRECD_FROM_VENDOR = FormateDate(RECD_FROM_VENDOR);
            }
            if (RECD_FROM_COMPLIANCE != "") {
                var FRECD_FROM_COMPLIANCE = FormateDate(RECD_FROM_COMPLIANCE);
            }
            if (BILLING_TEAM_INTIMATION != "") {
                var FBILLING_TEAM_INTIMATION = FormateDate(BILLING_TEAM_INTIMATION);
            }
            if (QUERY_DATE != "") {
                var FQUERY_DATE = FormateDate(QUERY_DATE);
            }
            if (QUERY_REVERT_DATE != "") {
                var FQUERY_REVERT_DATE = FormateDate(QUERY_REVERT_DATE);
            }

            VendorTracking.push({
                INVOICE_CODE: INVOICE_CODE,
                INVOICE_ENTRY_DATE: FINVOICE_ENTRY_DATE,
                INVOICE_ENTRY_USER: INVOICE_ENTRY_USER,
                VENDOR_CODE: VENDOR_CODE,
                VENDOR_SAP_CODE: VENDOR_SAP_CODE,
                VENDOR_GST: VENDOR_GST,
                VENDOR_MSME: VENDOR_MSME,
                SAC_CODE: SAC_CODE,
                INVOICE_NO: INVOICE_NO,
                INVOICE_DATE: FINVOICE_DATE,
                CLIENT_CODE: CLIENT_CODE,
                SERVICE_CODE: SERVICE_CODE,
                ADDITIONAL_INFORMATION: ADDITIONAL_INFORMATION,
                REGISTRATION_NUMBER: REGISTRATION_NUMBER,
                SITE_CODE: SITE_CODE,
                LOCATION: LOCATION,
                CITY_CODE: CITY_CODE,
                STATE_CODE: STATE_CODE,
                SERVICE_PERIOD: SERVICE_PERIOD,
                SERVICE_CHARGE: SERVICE_CHARGE,
                CGST: CGST,
                SGST: SGST,
                IGST: IGST,
                REIMB_EXPENSES: REIMB_EXPENSES,
                INVOICE_AMOUNT: INVOICE_AMOUNT,
                TDS_AMOUNT: TDS_AMOUNT,
                ADVANCE_ADJUSTMENT: ADVANCE_ADJUSTMENT,
                NET_AMOUNT: NET_AMOUNT,
                RECD_FROM_VENDOR: FRECD_FROM_VENDOR,
                COMPLIANCE_USER: COMPLIANCE_USER,
                COMPLIANCE_FORWARD_DATE: COMPLIANCE_FORWARD_DATE,
                RECD_FROM_COMPLIANCE: FRECD_FROM_COMPLIANCE,
                COMPLIANCE_REMARKS: COMPLIANCE_REMARKS,
                SAP_POSTING_DATE: SAP_POSTING_DATE,
                SAP_DOC_NO: SAP_DOC_NO,
                SAP_ENTRY_USER: SAP_ENTRY_USER,
                APPROVED_BY: APPROVED_BY,
                APPROVAL_EMAIL_REFERENCE: APPROVAL_EMAIL_REFERENCE,
                QUERY_DATE: FQUERY_DATE,
                NATURE_OF_QUERY: NATURE_OF_QUERY,
                QUERY_REVERT_DATE: FQUERY_REVERT_DATE,
                QUERY_RESOLUTION: QUERY_RESOLUTION,
                MSME_DUE_DATE: FMSME_DUE_DATE,
                GST_DUE_DATE: FGST_DUE_DATE,
                PAYMENT_STATUS: PAYMENT_STATUS,
                PAYMENT_DATE: FPAYMENT_DATE,
                BILLING_TEAM_INTIMATION: FBILLING_TEAM_INTIMATION,
                CurrentStatus: "Vendor Entry",
                IsSubmiitedToBilling: true,
                IsBillingCompleted: "No",
                ACTIVE: true
            })
            $.ajax({
                type: "POST",
                url: "/Transactions/SaveUpdateVendorEntry",
                data: JSON.stringify({ 'master': VendorTracking }),
                contentType: "application/json; charset=utf-8",
                dataType: "json", headers: headers,
                success: function (data) {
                    //console.log(data);
                    if (data.d != "") {
                        if (UserRole == "AD" && InvoiceNo != '') {
                            $("#btnBillingSave").click();
                        } else {
                            $.alert("Vendor Invoice Saved/Updated Sucessfully!");
                        }
                    }
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });
        }
    });

    $("#btnBillingSave").click(function () {
        var Validate = true;
        var VendorTracking = [];
        var INVOICE_CODE = $("#HDINVOICE_CODE").val();
        var BILLING_TEAM_COMPLETION = $("#BILLING_TEAM_COMPLETION").val();
        var BILLING_CATEGORY_CODE = $("#BILLING_CATEGORY_CODE").val();
        var HGS_INVOICE_DATE = $("#HGS_INVOICE_DATE").val();
        var HGS_INVOICE_NO = $("#HGS_INVOICE_NO").val();
        var HGS_INVOICE_AMOUNT = $("#HGS_INVOICE_AMOUNT").val();

        var ACTIVE = $("#ACTIVE").val();

        BILLING_TEAM_COMPLETION == "" ? $("#BILLING_TEAM_COMPLETION").addClass('error') : $("#BILLING_TEAM_COMPLETION").removeClass('error');
        BILLING_CATEGORY_CODE == "" ? $("#BILLING_CATEGORY_CODE").addClass('error') : $("#BILLING_CATEGORY_CODE").removeClass('error');
        HGS_INVOICE_DATE == "" ? $("#HGS_INVOICE_DATE").addClass('error') : $("#HGS_INVOICE_DATE").removeClass('error');
        HGS_INVOICE_NO == "" ? $("#HGS_INVOICE_NO").addClass('error') : $("#HGS_INVOICE_NO").removeClass('error');
        HGS_INVOICE_AMOUNT == "" ? $("#HGS_INVOICE_AMOUNT").addClass('error') : $("#HGS_INVOICE_AMOUNT").removeClass('error');


        if (BILLING_TEAM_COMPLETION === "" || BILLING_CATEGORY_CODE === "" || HGS_INVOICE_DATE === "" || HGS_INVOICE_NO === "" || HGS_INVOICE_AMOUNT === "") {
            Validate = false;
        }
        if (Validate) {
            $body.addClass("loading");
            var ACTIVE = false;
            if ($("#Active").prop("checked") == true) {
                ACTIVE = true;
            }

            var FHGS_INVOICE_DATE = FormateDate(HGS_INVOICE_DATE);
            var FBILLING_TEAM_COMPLETION = FormateDate(BILLING_TEAM_COMPLETION);

            VendorTracking.push({
                INVOICE_CODE: INVOICE_CODE,
                BILLING_TEAM_COMPLETION: FBILLING_TEAM_COMPLETION,
                BILLING_CATEGORY_CODE: BILLING_CATEGORY_CODE,
                HGS_INVOICE_DATE: FHGS_INVOICE_DATE,
                HGS_INVOICE_NO: HGS_INVOICE_NO,
                HGS_INVOICE_AMOUNT: HGS_INVOICE_AMOUNT,
                CurrentStatus: "Billing Entry",
                IsSubmiitedToBilling: "Yes",
                IsBillingCompleted: true,
                ACTIVE: true
            })
            $.ajax({
                type: "POST",
                url: "/Transactions/UpdateBillingEntry",
                data: JSON.stringify({ 'master': VendorTracking }),
                contentType: "application/json; charset=utf-8",
                dataType: "json", headers: headers,
                success: function (data) {
                    //console.log(data);
                    if (data.d != "") {
                        $.alert("Billing Entry Saved/Updated Sucessfully!");

                    }
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });
        }
    });

    //$("#SERVICE_CHARGE").blur(function () {
    //    var State = $("#STATE_CODE option:selected").text();

    //    //if (State == "Maharashtra") {
    //    //if ($("#STATE_CODE").val() != '') {

    //    //    } else {
    //    //        IGST = (ServiceCharge * 18) / 100;
    //    //        var INVOICE_AMOUNT = parseFloat(ServiceCharge) + (IGST);
    //    //        var TDS = (parseFloat(INVOICE_AMOUNT) * 2) / 100;
    //    //        var NetAmount = parseFloat(INVOICE_AMOUNT) - parseFloat(TDS);
    //    //        $("#CGST").val(0);
    //    //        $("#SGST").val(0);
    //    //        $("#IGST").val(IGST);
    //    //        $("#INVOICE_AMOUNT").val(INVOICE_AMOUNT.toFixed(2));
    //    //        $("#TDS_AMOUNT").val(TDS.toFixed(2));
    //    //        $("#NET_AMOUNT").val(NetAmount.toFixed(2));
    //    //    }
    //    //} else {
    //    //    $.alert("Select state!");
    //    //    $("#SERVICE_CHARGE").val('');
    //    //}
    //    CalculateNetAmt();
    //    if ($("#SERVICE_CHARGE").val() == '') {
    //        $("#CGST").val('');
    //        $("#SGST").val('');
    //        $("#IGST").val('');
    //        $("#INVOICE_AMOUNT").val('');
    //        $("#TDS_AMOUNT").val('');
    //        $("#NET_AMOUNT").val('');
    //        $("#REIMB_EXPENSES").val('');
    //        $("#ADVANCE_ADJUSTMENT").val('');
    //    }
    //    SERVICE_CHARGE == "" ? $("#SERVICE_CHARGE").addClass('error') : $("#SERVICE_CHARGE").removeClass('error');
    //    CGST == "" ? $("#CGST").addClass('error') : $("#CGST").removeClass('error');
    //    SGST == "" ? $("#SGST").addClass('error') : $("#SGST").removeClass('error');
    //    IGST == "" ? $("#IGST").addClass('error') : $("#IGST").removeClass('error');
    //    REIMB_EXPENSES == "" ? $("#REIMB_EXPENSES").addClass('error') : $("#REIMB_EXPENSES").removeClass('error');
    //    INVOICE_AMOUNT == "" ? $("#INVOICE_AMOUNT").addClass('error') : $("#INVOICE_AMOUNT").removeClass('error');
    //    TDS_AMOUNT == "" ? $("#TDS_AMOUNT").addClass('error') : $("#TDS_AMOUNT").removeClass('error');
    //    ADVANCE_ADJUSTMENT == "" ? $("#ADVANCE_ADJUSTMENT").addClass('error') : $("#ADVANCE_ADJUSTMENT").removeClass('error');
    //    NET_AMOUNT == "" ? $("#NET_AMOUNT").addClass('error') : $("#NET_AMOUNT").removeClass('error');
    //    MSME_DUE_DATE == "" ? $("#MSME_DUE_DATE").addClass('error') : $("#MSME_DUE_DATE").removeClass('error');
    //    GST_DUE_DATE == "" ? $("#GST_DUE_DATE").addClass('error') : $("#GST_DUE_DATE").removeClass('error');

    //    if (CGST == 0 && SGST == 0) {
    //        $("#CGST").removeClass('error');
    //        $("#SGST").removeClass('error');
    //    }
    //    if (IGST == 0) {
    //        $("#IGST").removeClass('error');
    //    }
    //});

    //function CalculateNetAmt() {
    //    var ServiceCharge = $("#SERVICE_CHARGE").val();
    //    var CGST = $("#CGST").val();
    //    var SGST = $("#SGST").val();
    //    var IGST = $("#IGST").val();
    //    var REIMB_EXPENSES = $("#REIMB_EXPENSES").val() || 0;
    //    var ADVANCE_ADJUSTMENT = $("#ADVANCE_ADJUSTMENT").val() || 0;
    //    //console.log(REIMB_EXPENSES);
    //    //console.log(ADVANCE_ADJUSTMENT);
    //    CGST = (ServiceCharge * 9) / 100;
    //    SGST = (ServiceCharge * 9) / 100;

    //    IGST = (ServiceCharge * 18) / 100;

    //    var INVOICE_AMOUNT_State = parseFloat(ServiceCharge) + (CGST) + (SGST) + (IGST);
    //    var TDS_State = (parseFloat(INVOICE_AMOUNT_State) * 2) / 100;

    //    var NetAmount_State = (parseFloat(INVOICE_AMOUNT_State) - parseFloat(TDS_State));
    //    NetAmount_State = parseFloat(NetAmount_State) + parseFloat(REIMB_EXPENSES);
    //    NetAmount_State = parseFloat(NetAmount_State) - parseFloat(ADVANCE_ADJUSTMENT);
    //    $("#CGST").val(SGST);
    //    $("#SGST").val(SGST);
    //    $("#IGST").val(IGST);
    //    $("#INVOICE_AMOUNT").val(INVOICE_AMOUNT_State.toFixed(2));
    //    $("#TDS_AMOUNT").val(TDS_State.toFixed(2));
    //    $("#NET_AMOUNT").val(NetAmount_State.toFixed(2));
    //};

    function CalculateNetAmtSum() {
       
        var TDSPercent = "";
        var checkDateDiff = 0;
        var LowerTaxDate = $("#HDVendorLowerTaxDate").val();
        var InvoiceDate = $("#INVOICE_DATE").val();
        if ($.datepicker.parseDate('dd/mm/yy', InvoiceDate) >= $.datepicker.parseDate('dd/mm/yy', LowerTaxDate)) {
            checkDateDiff = 1;
        }
        if ($("#HDLowerTax").val() != "" && checkDateDiff == 1) {
            TDSPercent = $("#HDLowerTax").val();
        } else {
            TDSPercent = '10';
        }
        var ServiceCharge = $("#SERVICE_CHARGE").val();
        var CGST = $("#CGST").val();
        var SGST = $("#SGST").val();
        var IGST = $("#IGST").val();
        var REIMB_EXPENSES = $("#REIMB_EXPENSES").val() || 0;
        var ADVANCE_ADJUSTMENT = $("#ADVANCE_ADJUSTMENT").val() || 0;
        var INVOICE_AMOUNT_State = parseFloat(ServiceCharge) + (parseFloat(CGST)) + (parseFloat(SGST)) + (parseFloat(IGST)) + parseFloat(REIMB_EXPENSES); //AP-20210923
        //  var TDS_State = (parseFloat(INVOICE_AMOUNT_State) * parseFloat(TDSPercent)) / 100;
        var TDS_State = (parseFloat(ServiceCharge) * parseFloat(TDSPercent)) / 100; //AP-20210923

        var NetAmount_State = (parseFloat(INVOICE_AMOUNT_State) - parseFloat(TDS_State));
        NetAmount_State = parseFloat(NetAmount_State) + parseFloat(REIMB_EXPENSES);
        NetAmount_State = parseFloat(NetAmount_State) - parseFloat(ADVANCE_ADJUSTMENT);
        $("#CGST").val(Math.ceil(CGST));
        $("#SGST").val(Math.ceil(SGST));
        $("#IGST").val(Math.ceil(IGST));
        $("#INVOICE_AMOUNT").val(Math.ceil(INVOICE_AMOUNT_State));
        $("#TDS_AMOUNT").val(Math.ceil(TDS_State));
        $("#NET_AMOUNT").val(Math.ceil(NetAmount_State));
    };

    function CalculateGST() {
      
        var InvoiceType = $("#INVOICE_TYPE option:selected").val();
        var GSTType = $("#GST_TYPE option:selected").val();
        var VendorGSTType = $("#HDVendorGSTType").val();
        var VendorGSTStartDate = $("#HDVendorGSTStartDate").val();
        var LowerTax = $("#HDLowerTax").val();
        var ServiceCharge = $("#SERVICE_CHARGE").val();
        var checkDateDiff = 0;
        var LowerTaxDate = $("#HDVendorLowerTaxDate").val();
        var InvoiceDate = $("#INVOICE_DATE").val();
        if ($.datepicker.parseDate('dd/mm/yy', InvoiceDate) >= $.datepicker.parseDate('dd/mm/yy', LowerTaxDate)) {
            checkDateDiff = 1;
        }
        var CGST = $("#CGST").val();
        var SGST = $("#SGST").val();
        var IGST = $("#IGST").val();

        var TDSPercent = "";
        if (LowerTax != "" && checkDateDiff == 1) {
            TDSPercent = LowerTax;
        } else {
            TDSPercent = '10';
        }
        if (ServiceCharge != '') {
           
            if (InvoiceType == "Invoice" || InvoiceType == "Credit Note-Prof") {
                if (GSTType == "CGST_SGST") {
                    if (VendorGSTType == "Registered") {
                        CGST = (ServiceCharge * 9) / 100;
                        SGST = (ServiceCharge * 9) / 100;
                        var INVOICE_AMOUNT_State = parseFloat(ServiceCharge) + (CGST) + (SGST);
                        //var TDS_State = (parseFloat(INVOICE_AMOUNT_State) * parseFloat(TDSPercent)) / 100;
                        var TDS_State = (parseFloat(ServiceCharge) * parseFloat(TDSPercent)) / 100;
                        var NetAmount_State = parseFloat(INVOICE_AMOUNT_State) - parseFloat(TDS_State);
                        $("#CGST").val(Math.ceil(SGST));
                        $("#SGST").val(Math.ceil(SGST));
                        $("#IGST").val(0);
                        $("#INVOICE_AMOUNT").val(Math.ceil(INVOICE_AMOUNT_State));
                        $("#TDS_AMOUNT").val(Math.ceil(TDS_State));
                        $("#NET_AMOUNT").val(Math.ceil(NetAmount_State));
                    }
                }
                if (GSTType == "IGST") {
                    if (VendorGSTType == "Registered") {
                        IGST = (ServiceCharge * 18) / 100;
                        var INVOICE_AMOUNT = parseFloat(ServiceCharge) + (IGST);
                        //var TDS = (parseFloat(INVOICE_AMOUNT) * parseFloat(TDSPercent)) / 100;
                        var TDS = (parseFloat(ServiceCharge) * parseFloat(TDSPercent)) / 100;
                        var NetAmount = parseFloat(INVOICE_AMOUNT) - parseFloat(TDS);
                        $("#CGST").val(0);
                        $("#SGST").val(0);
                        $("#IGST").val(Math.ceil(IGST));
                        $("#INVOICE_AMOUNT").val(Math.ceil(INVOICE_AMOUNT));
                        $("#TDS_AMOUNT").val(Math.ceil(TDS));
                        $("#NET_AMOUNT").val(Math.ceil(NetAmount));
                    }
                }
                if (VendorGSTType == "Unregistered") {
                    $("#CGST").val(0);
                    $("#SGST").val(0);
                    $("#IGST").val(0);
                    var INVOICE_AMOUNT_State = parseFloat(ServiceCharge) + (CGST) + (SGST);
                    //var TDS_State = (parseFloat(INVOICE_AMOUNT_State) * parseFloat(TDSPercent)) / 100;
                    var TDS_State = (parseFloat(ServiceCharge) * parseFloat(TDSPercent)) / 100;
                    var NetAmount_State = parseFloat(INVOICE_AMOUNT_State) - parseFloat(TDS_State);
                    $("#INVOICE_AMOUNT").val(Math.ceil(INVOICE_AMOUNT_State));
                    $("#TDS_AMOUNT").val(Math.ceil(TDS_State));
                    $("#NET_AMOUNT").val(Math.ceil(NetAmount_State));
                }

            } else {
                $("#CGST").val(0);
                $("#SGST").val(0);
                $("#IGST").val(0);
                var INVOICE_AMOUNT_State = parseFloat(ServiceCharge) + (CGST) + (SGST);
                //var TDS_State = (parseFloat(INVOICE_AMOUNT_State) * parseFloat(TDSPercent)) / 100;
                var TDS_State = (parseFloat(ServiceCharge) * parseFloat(TDSPercent)) / 100;
                var NetAmount_State = parseFloat(INVOICE_AMOUNT_State) - parseFloat(TDS_State);
                $("#INVOICE_AMOUNT").val(Math.ceil(INVOICE_AMOUNT_State));
                $("#TDS_AMOUNT").val(Math.ceil(TDS_State));
                $("#NET_AMOUNT").val(Math.ceil(NetAmount_State));
            }
        } else {
            
            $("#SERVICE_CHARGE").val('');
        }
        if ($("#SERVICE_CHARGE").val() == '') {
            $("#CGST").val('');
            $("#SGST").val('');
            $("#IGST").val('');
            $("#INVOICE_AMOUNT").val('');
            $("#TDS_AMOUNT").val('');
            $("#NET_AMOUNT").val('');

        }
        SERVICE_CHARGE == "" ? $("#SERVICE_CHARGE").addClass('error') : $("#SERVICE_CHARGE").removeClass('error');
        CGST == "" ? $("#CGST").addClass('error') : $("#CGST").removeClass('error');
        SGST == "" ? $("#SGST").addClass('error') : $("#SGST").removeClass('error');
        IGST == "" ? $("#IGST").addClass('error') : $("#IGST").removeClass('error');
        REIMB_EXPENSES == "" ? $("#REIMB_EXPENSES").addClass('error') : $("#REIMB_EXPENSES").removeClass('error');
        INVOICE_AMOUNT == "" ? $("#INVOICE_AMOUNT").addClass('error') : $("#INVOICE_AMOUNT").removeClass('error');
        TDS_AMOUNT == "" ? $("#TDS_AMOUNT").addClass('error') : $("#TDS_AMOUNT").removeClass('error');
        ADVANCE_ADJUSTMENT == "" ? $("#ADVANCE_ADJUSTMENT").addClass('error') : $("#ADVANCE_ADJUSTMENT").removeClass('error');
        NET_AMOUNT == "" ? $("#NET_AMOUNT").addClass('error') : $("#NET_AMOUNT").removeClass('error');
        MSME_DUE_DATE == "" ? $("#MSME_DUE_DATE").addClass('error') : $("#MSME_DUE_DATE").removeClass('error');
        GST_DUE_DATE == "" ? $("#GST_DUE_DATE").addClass('error') : $("#GST_DUE_DATE").removeClass('error');

        if (CGST == 0 && SGST == 0) {
            $("#CGST").removeClass('error');
            $("#SGST").removeClass('error');
        }
        if (IGST == 0) {
            $("#IGST").removeClass('error');
        }
    }

    //$("#CGST").blur(function () {
    //    CalculateNetAmtSum();

    //});

    //$("#SGST").blur(function () {
    //    CalculateNetAmtSum();
    //});

    $("#INVOICE_TYPE").change(function () {
        CalculateGST();
    });

    $("#GST_TYPE").change(function () {
        CalculateGST();
    });

    $("#REIMB_EXPENSES").blur(function () {
        CalculateNetAmtSum();
    });

    $("#ADVANCE_ADJUSTMENT").blur(function () {
        CalculateNetAmtSum();
    });


    $("#SERVICE_CHARGE").blur(function () {
        CalculateGST();
    });

    $("#VENDOR_CODE").change(function () {
        var VENDOR_CODE = $("#VENDOR_CODE").val();
        if (VENDOR_CODE != '') {
            $.ajax({
                type: "POST",
                url: "/Masters/GetVendorDetails",
                data: JSON.stringify({ 'VendorCode': VENDOR_CODE }),
                contentType: "application/json; charset=utf-8",
                dataType: "json", headers: headers,
                success: function (data) {
                    var ns = data;
                    //console.log(ns);
                    $("#VENDOR_SAP_CODE").val(ns.VENDOR_SAP_CODE);
                    $("#VENDOR_GST").val(ns.VENDOR_GST);
                    $("#VENDOR_MSME").val(ns.VENDOR_MSMED);
                    var LowerTax = ns.LowerTaxPer ;
                    $("#HDLowerTax").val(LowerTax);
                    $("#HDVendorGSTType").val(ns.GSTType);
                   
                    
                    var  gstSatrtdate = new Date(parseInt(ns.GSTStartDate.replace(/(^.*\()|([+-].*$)/g, '')));
                    gstSatrtdate = GetDDMMYYDate(gstSatrtdate);
                    $("#HDVendorGSTStartDate").val(gstSatrtdate);

                    var msmeSatrtdate = new Date(parseInt(ns.MEMSDStartDate.replace(/(^.*\()|([+-].*$)/g, '')));
                    msmeSatrtdate = GetDDMMYYDate(msmeSatrtdate);
                    $("#HDVendorMSMEtDate").val(msmeSatrtdate);

                    var LowerTaxDate = new Date(parseInt(ns.LowerTaxStartDate.replace(/(^.*\()|([+-].*$)/g, '')));
                    LowerTaxDate = GetDDMMYYDate(LowerTaxDate);
                    $("#HDVendorLowerTaxDate").val(LowerTaxDate);



                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
                }
            });
        } else {
            $("#VENDOR_SAP_CODE").val('');
            $("#VENDOR_GST").val('');
            $("#VENDOR_MSME").val('');
        }

    });

    $("#CLIENT_CODE").change(function () {
        var CLIENT_CODE = $("#CLIENT_CODE").val();
        if (CLIENT_CODE != '') {
            $.ajax({
                type: "POST",
                url: "/Masters/GetClientDetails",
                data: JSON.stringify({ 'ClientCode': CLIENT_CODE }),
                contentType: "application/json; charset=utf-8",
                dataType: "json", headers: headers,
                success: function (data) {
                    var ns = data;
                    //console.log(ns);

                    $("#HDClientGroup").val(ns.CLIENT_GROUP);



                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
                }
            });
        } else {
            $("#HDClientGroup").val('');

        }

    });

    function LoadDropdown() {
        var VendorDropdown = localStorage['VendorDropdown'] || '';
        if (VendorDropdown != '') {
            var obj = $.parseJSON(VendorDropdown);
            var ddlval = $("[id*=VENDOR_CODE]");
            $.each(obj, function () {
                ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        }
        else {
            $.ajax({
                type: "POST",
                url: "/Transactions/GetVendorsDropdwon",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false, headers: headers,
                success: function (r) {
                    ////console.log(r);
                    var ddlval = $("[id*=VENDOR_CODE]");
                    $.each(r, function () {
                        ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
                    });
                }
            });
        }
        var ClientDropdown = localStorage['ClientDropdown'] || '';
        if (ClientDropdown != '') {
            var obj = $.parseJSON(ClientDropdown);
            var ddlval = $("[id*=CLIENT_CODE]");
            $.each(obj, function () {
                ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        }
        else {
            $.ajax({
                type: "POST",
                url: "/Transactions/GetClientsDropdwon",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false, headers: headers,
                success: function (r) {
                    ////console.log(r);
                    var ddlval = $("[id*=CLIENT_CODE]");
                    $.each(r, function () {
                        ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
                    });
                }
            });
        }
        var ServiceDropdown = localStorage['ServiceDropdown'] || '';
        if (ServiceDropdown != '') {
            var obj = $.parseJSON(ServiceDropdown);
            var ddlval = $("[id*=SERVICE_CODE]");
            $.each(obj, function () {
                ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        }
        else {
            $.ajax({
                type: "POST",
                url: "/Transactions/GetServicesDropdwon",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false, headers: headers,
                success: function (r) {
                    ////console.log(r);
                    var ddlval = $("[id*=SERVICE_CODE]");
                    $.each(r, function () {
                        ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
                    });
                }
            });
        }
        var StateDropdown = localStorage['StateDropdown'] || '';
        if (StateDropdown != '') {
            var obj = $.parseJSON(StateDropdown);
            var ddlval = $("[id*=STATE_CODE]");
            $.each(obj, function () {
                ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        }
        else {
            $.ajax({
                type: "POST",
                url: "/Transactions/GetStatesDropdwon",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false, headers: headers,
                success: function (r) {
                    console.log(r);
                    var ddlval = $("[id*=STATE_CODE]");
                    $.each(r, function () {
                        ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
                    });
                }
            });
        }

        var CategoryDropdown = localStorage['CategoryDropdown'] || '';
        if (CategoryDropdown != '') {
            var obj = $.parseJSON(CategoryDropdown);
            var ddlval = $("[id*=BILLING_CATEGORY_CODE]");
            $.each(obj, function () {
                ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        }
        else {
            $.ajax({
                type: "POST",
                url: "/Transactions/GetBillingCategoryDropdwon",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "json", headers: headers,
                async: false,
                success: function (r) {
                    //console.log(r);
                    var ddlval = $("[id*=BILLING_CATEGORY_CODE]");
                    $.each(r, function () {
                        ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
                    });
                }
            });
        }
        var SACDropdown = localStorage['SACDropdown'] || '';
        if (SACDropdown != '') {
            var obj = $.parseJSON(SACDropdown);
            var ddlval = $("[id*=SAC_CODE]");
            $.each(obj, function () {
                ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        }
        else {
            $.ajax({
                type: "POST",
                url: "/Transactions/GetSACCodesDropdwon",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "json", headers: headers,
                async: false,
                success: function (r) {
                    //console.log(r);
                    var ddlval = $("[id*=SAC_CODE]");
                    $.each(r, function () {
                        ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
                    });
                }
            });
        }
        var UserDropdown = localStorage['UserDropdown'] || '';
        var UserID = $("#HDUserID").val();//AP-20210923
        if (UserDropdown != '') {
            var obj = $.parseJSON(UserDropdown);
            var ddlval = $("[id*=INVOICE_ENTRY_USER]");
            $.each(obj, function () {
                ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        }
        else {
            $.ajax({
                type: "POST",
                url: "/Transactions/GetUserDropdwon",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "json", headers: headers,
                async: false,
                success: function (r) {
                    //console.log(r);
                    var ddlval = $("[id*=INVOICE_ENTRY_USER]");
                    $.each(r, function () {
                        ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
                    });
                }
            });
        }

        $("#INVOICE_ENTRY_USER").val(UserID);//AP-20210923
        var UserDropdown = localStorage['UserDropdown'] || '';
        if (UserDropdown != '') {
            var obj = $.parseJSON(UserDropdown);
            var ddlval = $("[id*=COMPLIANCE_USER]");
            $.each(obj, function () {
                ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        }
        else {
            $.ajax({
                type: "POST",
                url: "/Transactions/GetUserDropdwon",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "json", headers: headers,
                async: false,
                success: function (r) {
                    //console.log(r);
                    var ddlval = $("[id*=COMPLIANCE_USER]");
                    $.each(r, function () {
                        ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
                    });
                }
            });
        }
        var CityDropdown = localStorage['CityDropdown'] || '';
        if (CityDropdown != '') {
            var obj = $.parseJSON(CityDropdown);
            var ddlval = $("[id*=CITY_CODE]");
            $.each(obj, function () {
                ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        }
        else {
            $.ajax({
                type: "POST",
                url: "/Transactions/CityDropdwon",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "json", headers: headers,
                success: function (r) {
                    //console.log(r);
                    var ddlval = $("[id*=CITY_CODE]");
                    $.each(r, function () {
                        ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
                    });
                }
            });
        }
        var ApprovedByDropdwon = localStorage['ApprovedByDropdwon'] || '';
        if (ApprovedByDropdwon != '') {
            var obj = $.parseJSON(ApprovedByDropdwon);
            var ddlval = $("[id*=APPROVED_BY]");
            $.each(obj, function () {
                ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        }
        else {
            $.ajax({
                type: "POST",
                url: "/Masters/GetApprovedByDropdwon",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "json", headers: headers,
                async: false,
                success: function (r) {
                    //console.log(r);
                    var ddlval = $("[id*=APPROVED_BY]");
                    $.each(r, function () {
                        ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
                    });
                }
            });
        }
    }

    //$("#STATE_CODE").change(function () {
    //    $("#CGST").val('');
    //    $("#SGST").val('');
    //    $("#IGST").val('');
    //    $("#INVOICE_AMOUNT").val('');
    //    $("#TDS_AMOUNT").val('');
    //    $("#NET_AMOUNT").val('');
    //    if ($("#SERVICE_CHARGE").val() != '') {
    //        $("#SERVICE_CHARGE").blur();
    //    }
    //});

    //$("#STATE_CODE").change(function () {
    //    var State = $("#STATE_CODE").val();
    //    $('#CITY_CODE').children('option:not(:first)').remove();
    //    $.ajax({
    //        type: "POST",
    //        url: "/Transactions/GetStateWiseCityDropdwon",
    //        data: JSON.stringify({ 'State': State }),
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json", headers: headers,
    //        success: function (r) {
    //            //console.log(r);
    //            var ddlval = $("[id*=CITY_CODE]");
    //            $.each(r, function () {
    //                ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
    //            });
    //        }
    //    });

    //    $("#CGST").val('');
    //    $("#SGST").val('');
    //    $("#IGST").val('');
    //    $("#INVOICE_AMOUNT").val('');
    //    $("#TDS_AMOUNT").val('');
    //    $("#NET_AMOUNT").val('');
    //    if ($("#SERVICE_CHARGE").val() != '') {
    //        $("#SERVICE_CHARGE").blur();
    //    }
    //});

    $("#INVOICE_DATE").change(function () {
        var INVOICE_DATE = $("#INVOICE_DATE").val();
        if (INVOICE_DATE != '') {
            debugger;
            var VendorGSTType = $('#HDVendorGSTType').val();
            var VendorGSTdate = $('#HDVendorGSTStartDate').val();
            var VendorMSMEdate = $('#HDVendorMSMEtDate').val();
            var split = INVOICE_DATE.split('/');
            var date1 = new Date([split[1], split[0], split[2]].join('/'));

            split = VendorGSTdate.split('/');
            var date2 = new Date([split[1], split[0], split[2]].join('/'));

            split = VendorMSMEdate.split('/');
            var date3 = new Date([split[1], split[0], split[2]].join('/'));
            
            var GSTDateDiff = date1.getTime() - date2.getTime() ;
            var GSTDateDiffDays = GSTDateDiff / 1000 / 60 / 60 / 24;
           
            var MSMEDateDiff = date1.getTime() - date3.getTime();
            var MSMEDateDiffDays = MSMEDateDiff / 1000 / 60 / 60 / 24;
           
            if (GSTDateDiffDays > 180) {
                alert("Invoice date is more than 180 days of Vendor GST Date");
                $("#INVOICE_DATE").val("");
            }

            else if (MSMEDateDiffDays > 45) {
                alert("Invoice date is more than 45 days of Vendor MSME Date");
                $("#INVOICE_DATE").val("");
            }
            else {
                var NewMESEDate = $('#INVOICE_DATE').datepicker('getDate', '+45d');
                NewMESEDate.setDate(NewMESEDate.getDate() + 45);

                $("#MSME_DUE_DATE").datepicker({ dateFormat: 'dd/mm/yy', maxDate: 0 }).datepicker("setDate", NewMESEDate);

                var NewGSTDate = $('#INVOICE_DATE').datepicker('getDate', '+180d');
                NewGSTDate.setDate(NewGSTDate.getDate() + 180);

                $("#GST_DUE_DATE").datepicker({ dateFormat: 'dd/mm/yy', maxDate: 0 }).datepicker("setDate", NewGSTDate);
            }
        }
    });


    function SetDate() {
        $("#INVOICE_ENTRY_DATE").datepicker({ dateFormat: 'dd/mm/yy', maxDate: 0 }).datepicker("setDate", new Date());
        $("#INVOICE_DATE").datepicker({ dateFormat: 'dd/mm/yy', maxDate: 0 }).datepicker("setDate", new Date());
        $("#COMPLIANCE_FORWARD_DATE").datepicker({ dateFormat: 'dd/mm/yy' });
        $("#SAP_POSTING_DATE").datepicker({ dateFormat: 'dd/mm/yy' });
        $("#QUERY_DATE").datepicker({ dateFormat: 'dd/mm/yy' });
        $("#QUERY_REVERT_DATE").datepicker({ dateFormat: 'dd/mm/yy' });
        $("#MSME_DUE_DATE").datepicker({ dateFormat: 'dd/mm/yy' });
        $("#GST_DUE_DATE").datepicker({ dateFormat: 'dd/mm/yy' });
        $("#PAYMENT_DATE").datepicker({ dateFormat: 'dd/mm/yy' });
        $("#HGS_INVOICE_DATE").datepicker({ dateFormat: 'dd/mm/yy' });
        $("#BILLING_TEAM_COMPLETION").datepicker({ dateFormat: 'dd/mm/yy' });
        $("#RECD_FROM_VENDOR").datepicker({ dateFormat: 'dd/mm/yy' });
        $("#RECD_FROM_COMPLIANCE").datepicker({ dateFormat: 'dd/mm/yy' });
        $("#BILLING_TEAM_INTIMATION").datepicker({ dateFormat: 'dd/mm/yy' });

        var NewMESEDate = $('#INVOICE_ENTRY_DATE').datepicker('getDate', '+45d');
        NewMESEDate.setDate(NewMESEDate.getDate() + 45);

        $("#MSME_DUE_DATE").datepicker({ dateFormat: 'dd/mm/yy', maxDate: 0 }).datepicker("setDate", NewMESEDate);

        var NewGSTDate = $('#INVOICE_ENTRY_DATE').datepicker('getDate', '+180d');
        NewGSTDate.setDate(NewGSTDate.getDate() + 180);

        $("#GST_DUE_DATE").datepicker({ dateFormat: 'dd/mm/yy', maxDate: 0 }).datepicker("setDate", NewGSTDate);

        //var AddDays = new Date();
        //AddDays.setDate(AddDays.getDate() + 45);
        //$("#MSME_DUE_DATE").datepicker({ dateFormat: 'dd/mm/yy', maxDate: 0 }).datepicker("setDate", AddDays);
        //AddDays.setDate(AddDays.getDate() + 180);
        //$("#GST_DUE_DATE").datepicker({ dateFormat: 'dd/mm/yy', maxDate: 0 }).datepicker("setDate", AddDays);
    };

    function FormateDate(date) {
        var d = new Date(date.split("/").reverse().join("-"));
        var dd = d.getDate();
        var mm = d.getMonth() + 1;
        var yy = d.getFullYear();
        var retu = yy + "-" + mm + "-" + dd;
        return retu;
    };

    function ViewForm() {
        $("#INVOICE_CODE").attr('disabled', true);
        $("#INVOICE_ENTRY_DATE").attr('disabled', true);
        $("#INVOICE_ENTRY_USER").attr('disabled', true);
        $("#VENDOR_CODE").attr('disabled', true);
        $("#VENDOR_SAP_CODE").attr('disabled', true);
        $("#VENDOR_GST").attr('disabled', true);
        $("#VENDOR_MSME").attr('disabled', true);
        $("#SAC_CODE").attr('disabled', true);
        $("#INVOICE_NO").attr('disabled', true);
        $("#INVOICE_DATE").attr('disabled', true);
        $("#CLIENT_CODE").attr('disabled', true);
        $("#SERVICE_CODE").attr('disabled', true);
        $("#ADDITIONAL_INFORMATION").attr('disabled', true);
        $("#REGISTRATION_NUMBER").attr('disabled', true);
        $("#SITE_CODE").attr('disabled', true);
        $("#LOCATION").attr('disabled', true);
        $("#CITY_CODE").attr('disabled', true);
        $("#STATE_CODE").attr('disabled', true);
        $("#SERVICE_PERIOD").attr('disabled', true);
        $("#SERVICE_CHARGE").attr('disabled', true);
        //$("#CGST").attr('disabled', true);
        //$("#SGST").attr('disabled', true);
        //$("#IGST").attr('disabled', true);
        $("#REIMB_EXPENSES").attr('disabled', true);
        //$("#INVOICE_AMOUNT").attr('disabled', true);
        //$("#TDS_AMOUNT").attr('disabled', true);
        $("#ADVANCE_ADJUSTMENT").attr('disabled', true);
        //$("#NET_AMOUNT").attr('disabled', true);
        $("#RECD_FROM_VENDOR").attr('disabled', true);
        $("#COMPLIANCE_USER").attr('disabled', true);
        $("#COMPLIANCE_FORWARD_DATE").attr('disabled', true);
        $("#RECD_FROM_COMPLIANCE").attr('disabled', true);
        $("#COMPLIANCE_REMARKS").attr('disabled', true);
        $("#SAP_POSTING_DATE").attr('disabled', true);
        $("#SAP_DOC_NO").attr('disabled', true);
        $("#SAP_ENTRY_USER").attr('disabled', true);
        $("#APPROVED_BY").attr('disabled', true);
        $("#APPROVAL_EMAIL_REFERENCE").attr('disabled', true);
        $("#QUERY_DATE").attr('disabled', true);
        $("#NATURE_OF_QUERY").attr('disabled', true);
        $("#QUERY_REVERT_DATE").attr('disabled', true);
        $("#QUERY_RESOLUTION").attr('disabled', true);
        $("#MSME_DUE_DATE").attr('disabled', true);
        $("#GST_DUE_DATE").attr('disabled', true);
        $("#PAYMENT_STATUS").attr('disabled', true);
        $("#PAYMENT_DATE").attr('disabled', true);
        $("#BILLING_TEAM_INTIMATION").attr('disabled', true);
        $("#BILLING_TEAM_COMPLETION").attr('disabled', true);
        $("#BILLING_CATEGORY_CODE").attr('disabled', true);
        $("#HGS_INVOICE_DATE").attr('disabled', true);
        $("#HGS_INVOICE_NO").attr('disabled', true);
        $("#HGS_INVOICE_AMOUNT").attr('disabled', true);
    };

    function EditForm() {
        $("#INVOICE_CODE").attr('disabled', false);
        $("#INVOICE_ENTRY_DATE").attr('disabled', false);
        $("#INVOICE_ENTRY_USER").attr('disabled', false);
        $("#VENDOR_CODE").attr('disabled', false);
        $("#VENDOR_SAP_CODE").attr('disabled', false);
        $("#VENDOR_GST").attr('disabled', false);
        $("#VENDOR_MSME").attr('disabled', false);
        $("#SAC_CODE").attr('disabled', false);
        $("#INVOICE_NO").attr('disabled', false);
        $("#INVOICE_DATE").attr('disabled', false);
        $("#CLIENT_CODE").attr('disabled', false);
        $("#SERVICE_CODE").attr('disabled', false);
        $("#ADDITIONAL_INFORMATION").attr('disabled', false);
        $("#REGISTRATION_NUMBER").attr('disabled', false);
        $("#SITE_CODE").attr('disabled', false);
        $("#LOCATION").attr('disabled', false);
        $("#CITY_CODE").attr('disabled', false);
        $("#STATE_CODE").attr('disabled', false);
        $("#SERVICE_PERIOD").attr('disabled', false);
        $("#SERVICE_CHARGE").attr('disabled', false);
        $("#CGST").attr('disabled', false);
        $("#SGST").attr('disabled', false);
        $("#IGST").attr('disabled', false);
        $("#REIMB_EXPENSES").attr('disabled', false);
        $("#INVOICE_AMOUNT").attr('disabled', false);
        $("#TDS_AMOUNT").attr('disabled', false);
        $("#ADVANCE_ADJUSTMENT").attr('disabled', false);
        $("#NET_AMOUNT").attr('disabled', false);
        $("#RECD_FROM_VENDOR").attr('disabled', false);
        $("#COMPLIANCE_USER").attr('disabled', false);
        $("#COMPLIANCE_FORWARD_DATE").attr('disabled', false);
        $("#RECD_FROM_COMPLIANCE").attr('disabled', false);
        $("#COMPLIANCE_REMARKS").attr('disabled', false);
        $("#SAP_POSTING_DATE").attr('disabled', false);
        $("#SAP_DOC_NO").attr('disabled', false);
        $("#SAP_ENTRY_USER").attr('disabled', false);
        $("#APPROVED_BY").attr('disabled', false);
        $("#APPROVAL_EMAIL_REFERENCE").attr('disabled', false);
        $("#QUERY_DATE").attr('disabled', false);
        $("#NATURE_OF_QUERY").attr('disabled', false);
        $("#QUERY_REVERT_DATE").attr('disabled', false);
        $("#QUERY_RESOLUTION").attr('disabled', false);
        $("#MSME_DUE_DATE").attr('disabled', false);
        $("#GST_DUE_DATE").attr('disabled', false);
        $("#PAYMENT_STATUS").attr('disabled', false);
        $("#PAYMENT_DATE").attr('disabled', false);
        $("#BILLING_TEAM_INTIMATION").attr('disabled', false);
        $("#BILLING_TEAM_COMPLETION").attr('disabled', false);
        $("#BILLING_CATEGORY_CODE").attr('disabled', false);
        $("#HGS_INVOICE_DATE").attr('disabled', false);
        $("#HGS_INVOICE_NO").attr('disabled', false);
        $("#HGS_INVOICE_AMOUNT").attr('disabled', false);
    };

    function BLEdit() {
        $("#INVOICE_CODE").attr('disabled', true);
        $("#INVOICE_ENTRY_DATE").attr('disabled', true);
        $("#INVOICE_ENTRY_USER").attr('disabled', true);
        $("#VENDOR_CODE").attr('disabled', true);
        $("#VENDOR_SAP_CODE").attr('disabled', true);
        $("#VENDOR_GST").attr('disabled', true);
        $("#VENDOR_MSME").attr('disabled', true);
        $("#SAC_CODE").attr('disabled', true);
        $("#INVOICE_NO").attr('disabled', true);
        $("#INVOICE_DATE").attr('disabled', true);
        $("#CLIENT_CODE").attr('disabled', true);
        $("#SERVICE_CODE").attr('disabled', true);
        $("#ADDITIONAL_INFORMATION").attr('disabled', true);
        $("#REGISTRATION_NUMBER").attr('disabled', true);
        $("#SITE_CODE").attr('disabled', true);
        $("#LOCATION").attr('disabled', true);
        $("#CITY_CODE").attr('disabled', true);
        $("#STATE_CODE").attr('disabled', true);
        $("#SERVICE_PERIOD").attr('disabled', true);
        $("#SERVICE_CHARGE").attr('disabled', true);
        //$("#CGST").attr('disabled', true);
        //$("#SGST").attr('disabled', true);
        //$("#IGST").attr('disabled', true);
        $("#REIMB_EXPENSES").attr('disabled', true);
        //$("#INVOICE_AMOUNT").attr('disabled', true);
        //$("#TDS_AMOUNT").attr('disabled', true);
        $("#ADVANCE_ADJUSTMENT").attr('disabled', true);
        //$("#NET_AMOUNT").attr('disabled', true);
        $("#RECD_FROM_VENDOR").attr('disabled', true);
        $("#COMPLIANCE_USER").attr('disabled', true);
        $("#COMPLIANCE_FORWARD_DATE").attr('disabled', true);
        $("#RECD_FROM_COMPLIANCE").attr('disabled', true);
        $("#COMPLIANCE_REMARKS").attr('disabled', true);
        $("#SAP_POSTING_DATE").attr('disabled', true);
        $("#SAP_DOC_NO").attr('disabled', true);
        $("#SAP_ENTRY_USER").attr('disabled', true);
        $("#APPROVED_BY").attr('disabled', true);
        $("#APPROVAL_EMAIL_REFERENCE").attr('disabled', true);
        $("#QUERY_DATE").attr('disabled', true);
        $("#NATURE_OF_QUERY").attr('disabled', true);
        $("#QUERY_REVERT_DATE").attr('disabled', true);
        $("#QUERY_RESOLUTION").attr('disabled', true);
        //$("#MSME_DUE_DATE").attr('disabled', true);
        //$("#GST_DUE_DATE").attr('disabled', true);
        $("#PAYMENT_STATUS").attr('disabled', true);
        $("#PAYMENT_DATE").attr('disabled', true);
        $("#BILLING_TEAM_INTIMATION").attr('disabled', true);

        $("#BILLING_TEAM_COMPLETION").attr('disabled', false);
        $("#BILLING_CATEGORY_CODE").attr('disabled', false);
        $("#HGS_INVOICE_DATE").attr('disabled', false);
        $("#HGS_INVOICE_NO").attr('disabled', false);
        $("#HGS_INVOICE_AMOUNT").attr('disabled', false);
    };

    function VendorEdit() {
        $("#INVOICE_CODE").attr('disabled', false);
        $("#INVOICE_ENTRY_DATE").attr('disabled', false);
        $("#INVOICE_ENTRY_USER").attr('disabled', false);
        $("#VENDOR_CODE").attr('disabled', false);
        $("#VENDOR_SAP_CODE").attr('disabled', true);
        $("#VENDOR_GST").attr('disabled', true);
        $("#VENDOR_MSME").attr('disabled', true);
        $("#SAC_CODE").attr('disabled', false);
        $("#INVOICE_NO").attr('disabled', false);
        $("#INVOICE_DATE").attr('disabled', false);
        $("#CLIENT_CODE").attr('disabled', false);
        $("#SERVICE_CODE").attr('disabled', false);
        $("#ADDITIONAL_INFORMATION").attr('disabled', false);
        $("#REGISTRATION_NUMBER").attr('disabled', false);
        $("#SITE_CODE").attr('disabled', false);
        $("#LOCATION").attr('disabled', false);
        $("#CITY_CODE").attr('disabled', false);
        $("#STATE_CODE").attr('disabled', false);
        $("#SERVICE_PERIOD").attr('disabled', false);
        $("#SERVICE_CHARGE").attr('disabled', false);
        //$("#CGST").attr('disabled', false);
        //$("#SGST").attr('disabled', false);
        //$("#IGST").attr('disabled', false);
        $("#REIMB_EXPENSES").attr('disabled', false);
        //$("#INVOICE_AMOUNT").attr('disabled', false);
        //$("#TDS_AMOUNT").attr('disabled', false);
        $("#ADVANCE_ADJUSTMENT").attr('disabled', false);
        //$("#NET_AMOUNT").attr('disabled', false);
        $("#RECD_FROM_VENDOR").attr('disabled', false);
        $("#COMPLIANCE_USER").attr('disabled', false);
        $("#COMPLIANCE_FORWARD_DATE").attr('disabled', false);
        $("#RECD_FROM_COMPLIANCE").attr('disabled', false);
        $("#COMPLIANCE_REMARKS").attr('disabled', false);
        $("#SAP_POSTING_DATE").attr('disabled', false);
        $("#SAP_DOC_NO").attr('disabled', false);
        $("#SAP_ENTRY_USER").attr('disabled', false);
        $("#APPROVED_BY").attr('disabled', false);
        $("#APPROVAL_EMAIL_REFERENCE").attr('disabled', false);
        $("#QUERY_DATE").attr('disabled', false);
        $("#NATURE_OF_QUERY").attr('disabled', false);
        $("#QUERY_REVERT_DATE").attr('disabled', false);
        $("#QUERY_RESOLUTION").attr('disabled', false);
        //$("#MSME_DUE_DATE").attr('disabled', false);
        //$("#GST_DUE_DATE").attr('disabled', false);
        $("#PAYMENT_STATUS").attr('disabled', false);
        $("#PAYMENT_DATE").attr('disabled', false);
        $("#BILLING_TEAM_INTIMATION").attr('disabled', false);

        $("#BILLING_TEAM_COMPLETION").attr('disabled', true);
        $("#BILLING_CATEGORY_CODE").attr('disabled', true);
        $("#HGS_INVOICE_DATE").attr('disabled', true);
        $("#HGS_INVOICE_NO").attr('disabled', true);
        $("#HGS_INVOICE_AMOUNT").attr('disabled', true);
    };

    function GetDDMMYYDate(date) {
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return day + '/' + month + '/' + year;
    }

    $("#ReturnToVendorList").click(function () {
        window.location.href = "/Transactions/VendorTrackingList";
    });
});