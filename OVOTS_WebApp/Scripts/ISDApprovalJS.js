$(document).ready(function () {
    debugger;
    $body = $("body");
    // $("#Approve_Date").datepicker({ dateFormat: 'dd/mm/yy', maxDate: 0 }).datepicker("setDate", new Date());
    var UserName = $("#HDUserName").val();
    $("#APPROVE_BY").val(UserName);
    $("#FromDate").datepicker({ dateFormat: 'dd/mm/yy' });
    $("#ToDate").datepicker({ dateFormat: 'dd/mm/yy' });
    var TotalClientCnt = GetClientCnt();
    SetPages(TotalClientCnt, 15, 7);
    GetCustomerInvoiceList(0, 15);

    function GetClientCnt() {
        var TotalClientCnt = 0;
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        var FromDt = $("#FromDate").val();
        var ToDt = $("#ToDate").val();
        var ApproveStatus = $("#ApproveStatus").val();
        $.ajax({
            type: "POST",
            url: "ISDApproval.aspx/GetISDApproveListCnt",
            data: JSON.stringify({ 'ddlFilterType': FilterType, 'FilterValue': FilterValue, 'FromDt': FromDt, 'ToDt': ToDt, 'ApproveStatus': ApproveStatus  }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,

            success: function (data) {

                if (data.d != "") {
                    TotalClientCnt = data.d;
                }
            }
        });
        return TotalClientCnt;
    };

    $.ajax({
        type: "POST",
        url: "ISDApproval.aspx/GetReasonDll",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {

            var ReasonDD = $("[id*=REJECTION_REASON]");
            $.each(r.d, function () {
                ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
        }

    });

    $("#clkSearch").click(function () {
        var TotalClientCnt = GetClientCnt();
        SetPages(TotalClientCnt, 15, 7);
        GetCustomerInvoiceList(0, 15);
    });

    $('body').on('click', '#nav li', function () {
        $("#Invoicetbl").find("tr:gt(0)").remove();
        var val = $(this).find('a').text();
        var End = parseInt(val) * parseInt(15);
        var Start = (parseInt(End) - parseInt(15));
        GetCustomerInvoiceList(Start, 15);
    });

    $(document).on("click", ".clkApprove", function () {

        ClearAll();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var ISDCode = $("#Invoicetbl").find("tr").eq(TblIndex).find("td").eq(2).text();
        $("#HUploadCode").val(ISDCode);
        $.ajax({
            type: "POST",
            url: "ISDApproval.aspx/GetApproveDetails",
            data: JSON.stringify({ 'ISDCode': ISDCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                debugger;
                var ns = $.parseJSON(data.d);
                var Apd = ns.ApproveDetails;

                console.log(data.d);
                if (Apd.P_ApproveBy != null && Apd.P_ApproveBy != "") {

                    $("#APPROVE_STATUS").val(Apd.P_KYCApproved);
                    if (Apd.P_KYCApproved == "Rejected") {
                        $("#REJECTION_REASON").attr('disabled', false);
                    }
                    $("#REJECTION_REASON").val(Apd.P_Reason);
                    $("#APPROVE_BY").val(Apd.P_ApproveBy);
                    $("#Approve_Date").val(Apd.P_KYCApprovedate);
                    $("#ApproveRemarks").val(Apd.P_ApproveRemarks);

                    $("#APPROVE_STATUS").attr('disabled', true);
                    $("#REJECTION_REASON").attr('disabled', true);
                    $("#APPROVE_BY").attr('disabled', true);
                    $("#ApproveRemarks").attr('disabled', true);
                    $("#btnSave").attr('disabled', true);
                }
                else {

                    $("#REJECTION_REASON").val('');
                    $("#APPROVE_STATUS").val('Approved');
                    $("#APPROVE_STATUS").attr('disabled', false);
                    $("#REJECTION_REASON").attr('disabled', true);
                    $("#APPROVE_BY").attr('disabled', false);
                    $("#ApproveRemarks").attr('disabled', false);
                    $("#btnSave").attr('disabled', false);
                    $("#ApproveRemarks").val('');
                    $("#APPROVE_BY").val($("#HDUserName").val());
                    $("#APPROVE_BY").removeClass('error');
                    $("#Approve_Date").datepicker({ dateFormat: 'dd/mm/yy', maxDate: 0 }).datepicker("setDate", new Date());
                    if ($("#HDUserName").val() == "") {
                        window.location.href = 'Default.aspx';
                    }
                }
                $('#DetailModal').modal('show');

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });

    $("#btnSave").click(function () {
        debugger;
        var ApproveBll = [];

        var Validate = true;

        var P_ISDCode = $("#HUploadCode").val();
        var P_KYCApproved = $("#APPROVE_STATUS").val();
        var P_Reason = $("#REJECTION_REASON").val();
        var P_ApproveBy = $("#APPROVE_BY").val();
        var P_KYCApprovedate = $("#Approve_Date    ").val();
        var P_ApproveRemarks = $("#ApproveRemarks").val();



        P_KYCApproved == "" ? $("#APPROVE_STATUS").addClass('error') : $("#APPROVE_STATUS").removeClass('error');
        P_ApproveBy == "" ? $("#APPROVE_BY").addClass('error') : $("#APPROVE_BY").removeClass('error');
        P_KYCApprovedate == "" ? $("#Approve_Date").addClass('error') : $("#Approve_Date").removeClass('error');




        if (P_KYCApproved == "" || P_ApproveBy === "" || P_KYCApprovedate === "") {
            Validate = false;
        }
        if (P_KYCApproved == "Rejected") {

            P_Reason == "" ? $("#REJECTION_REASON").addClass('error') : $("#REJECTION_REASON").removeClass('error');
            if (P_Reason == "") {
                Validate = false;
            }
        }



        if (Validate) {
            $body.addClass("loading");
            var FP_ApproveDate = FormateDate(P_KYCApprovedate);

            ApproveBll.push({
                P_ISDCode: P_ISDCode,
                P_KYCApproved: P_KYCApproved,
                P_Reason: P_Reason,
                P_ApproveBy: P_ApproveBy,
                P_KYCApprovedate: FP_ApproveDate,
                P_ApproveRemarks: P_ApproveRemarks,

            });


            $.ajax({
                type: "POST",
                url: "ISDApproval.aspx/SaveApproveDetails",
                data: JSON.stringify({ 'oApproveBll': ApproveBll }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data.d != '') {
                        $.alert("Approval Details Save Successfuly...");
                        $("#Invoicetbl").find("tr:gt(0)").remove();
                        GetCustomerInvoiceList(0, 15);
                        $('#DetailModal').modal('hide');

                    }
                },
                complete: function () {
                    $body.removeClass("loading");
                }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                    debugger;
                    alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
                }
            });
        }
    });

    function ClearAll() {

        $("#REJECTION_REASON").val('');
        $("#REJECTION_REASON").removeClass('error');
        $("#ApproveRemarks").val('');
        $("#ApproveRemarks").removeClass('error');
    }

    $("#APPROVE_STATUS").change(function () {
        var ApproveStatus = $("#APPROVE_STATUS").val();
        if (ApproveStatus == 'Approved') {
            $("#REJECTION_REASON").val('');
            $("#REJECTION_REASON").attr('disabled', true);
        }
        else {
            $("#REJECTION_REASON").attr('disabled', false);
        }
    });

    function GetCustomerInvoiceList(StartIndex, EndIndex) {
        $("#Invoicetbl").find("tr:gt(0)").remove();
        var ddlFilterType = $("#ddlFilterType").val();
        var FilterValue = $("#FilterValue").val();
        var ApproveStatus = $("#ApproveStatus").val();
        $("#ContentPlaceHolder1_hdFilterValue").val(FilterValue);
        $("#ContentPlaceHolder1_hdFilterType").val(ddlFilterType);
        $("#ContentPlaceHolder1_hdApproveStatus").val(ApproveStatus);
        var FromDt = $("#FromDate").val();
        var ToDt = $("#ToDate").val();
        $("#ContentPlaceHolder1_hdfromdt").val(FromDt);
        $("#ContentPlaceHolder1_hdtodt").val(ToDt);
        var Validate = true;
        //ddlFilterType == "" ? $("#ddlFilterType").addClass('error') : $("#ddlFilterType").removeClass('error');
        //FilterValue == "" ? $("#FilterValue").addClass('error') : $("#FilterValue").removeClass('error');
        //if (ddlFilterType == "" || FilterValue === "") {
        //    Validate = false;

        //}
        if (Validate) {
            $body.addClass("loading");
            $.ajax({
                type: "POST",
                url: "ISDApproval.aspx/GetISDApproveList",
                data: JSON.stringify({ 'ddlFilterType': ddlFilterType, 'FilterValue': FilterValue, 'FromDt': FromDt, 'ToDt': ToDt, 'startindex': StartIndex, 'EndIndex': EndIndex, 'ApproveStatus': ApproveStatus  }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var DR = data.d;
                    if (DR.length > 0) {
                        $("#nav").show();
                       
                        for (var i = 0; i < DR.length; i++) {
                            debugger;
                            $("#Invoicetbl").append("<tr> <td class='noExl'>"
                                + "<a class='clkApprove pointerOnAnchor'>Action</a></td><td> "
                                + DR[i].P_KYCApproved + "</td><td>"
                                + DR[i].P_ISDCode + "</td><td>"
                                + DR[i].P_Name + "</td><td>"
                                + DR[i].P_MobileNo + "</td><td>"
                                + DR[i].P_EmailId + "</td><td>"
                                + DR[i].P_DealerName + "</td><td>"
                                + DR[i].P_State + "</td><td>"
                                + DR[i].P_District + "</td><td>"
                                + DR[i].P_AdharNo + "</td><td class='noExl'> "
                                + "<a  class='clkFile' href='" + DR[i].P_AdharFilePath + "' target='_blank' >View</a></td><td>"
                                + DR[i].P_PANNO + "</td><td class='noExl'> "
                                + "<a  class='clkFile' href='" + DR[i].P_PANFilePath + "' target='_blank' >View</a></td><td>"
                                + DR[i].P_BankACNo + "</td><td>"
                                + DR[i].P_BankName + "</td><td>"
                                + DR[i].P_IFSCCode + "</td><td class='noExl'> "
                                + "<a  class='clkFile' href='" + DR[i].P_ChequeFilePath + "' target='_blank' >View</a></td><td>"
                                + DR[i].P_UPINo + "</td><td>"
                               
                                + DR[i].P_Reason + "</td></tr>");
                        }
                    }
                    else {
                        $("#nav").hide();
                        $("#Invoicetbl").append("<tr style='color:red;'><td colspan='7' style='text-align:center'>No Record Found</td></tr>");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    debugger;
                    alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });
        }
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
            GetAllClients(Start, 15);
            return showPage(currentPage + 1);
        });

        $("#previous-page").on("click", function () {
            var End = parseInt(currentPage - 1) * parseInt(15);
            var Start = (parseInt(End) - parseInt(15));
            GetAllClients(Start, 15);
            return showPage(currentPage - 1);
        });
        $(".pagination").append("</ul>");
    };

   

    $(document).on("click", ".clkFile", function () {

        var href = $(this).attr('href');

        if (href == '') {
            alert("No file found");
            return false;
        }
        //else {
        //    $(this).attr("target", "_blank");
        //}
    });

    function ShowFile(FilePath) {

        if (FilePath == "") {
            alert("No Invoice Uploaded");
        }
        else {
            window.location.href = FilePath;
        }
    }

    $("#GenExcel").click(function () {
        var PPtblLength = $("#Invoicetbl").find("tr").length;
        if (PPtblLength > 1) {
            $("#Invoicetbl").table2excel({
                name: "Table2Excel",
                filename: "Customer_Invoice"
            });
        }
    });

    $("#Search").on("keyup", function () {

        var value = $(this).val().toLowerCase();

        $("#Invoicetbl tr:not(:first-child)").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    function FormateDate(date) {
        var d = new Date(date.split("/").reverse().join("-"));
        var dd = d.getDate();
        var mm = d.getMonth() + 1;
        var yy = d.getFullYear();
        var retu = yy + "-" + mm + "-" + dd;
        return retu;
    };
});