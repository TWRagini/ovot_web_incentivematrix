$(document).ready(function () {
    debugger;
    $body = $("body");
    // $("#Approve_Date").datepicker({ dateFormat: 'dd/mm/yy', maxDate: 0 }).datepicker("setDate", new Date());
    var UserName = $("#HDUserName").val();
    var UserCode = $("#HDUserCode").val();
    var UserRole = $("#HDUserRole").val();
    var CurrentUserLevel = $("#HDUserLevel").val();
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
      
        $.ajax({
            type: "POST",
            url: "IssueManagement.aspx/GetIssueManagmentListCnt",
            data: JSON.stringify({ 'ddlFilterType': FilterType, 'FilterValue': FilterValue, 'FromDt': FromDt, 'ToDt': ToDt }),
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
        var IssueCode = $("#Invoicetbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        var IssueType = $("#Invoicetbl").find("tr").eq(TblIndex).find("td").eq(3).text();
        var Dealer = $("#Invoicetbl").find("tr").eq(TblIndex).find("td").eq(2).text();
        var IssueDesciption = $("#Invoicetbl").find("tr").eq(TblIndex).find("td").eq(11).text();
        var CurrentUser = $("#Invoicetbl").find("tr").eq(TblIndex).find("td").eq(10).text();
        var CurrentLevel = $("#Invoicetbl").find("tr").eq(TblIndex).find("td").eq(12).text();
        var CurrentLevelText = $("#Invoicetbl").find("tr").eq(TblIndex).find("td").eq(7).text();
        var DealerCode = $("#Invoicetbl").find("tr").eq(TblIndex).find("td").eq(13).text();
        var IssueTypeCode = $("#Invoicetbl").find("tr").eq(TblIndex).find("td").eq(14).text();
        debugger;
        $("#ContentPlaceHolder1_hdIssueCode").val(IssueCode);
        $("#ISSUE_TYPE").val(IssueType);
        $("#DEALER").val(Dealer);
        $("#IssueDesciption").val(IssueDesciption);
        var CURRL = parseInt(CurrentLevel) + 1;
        $("#CURRLEV").val(CURRL);
       
            $('#ForwardTo').children('option:not(:first)').remove();
            $.ajax({
                type: "POST",
                url: "IssueManagement.aspx/GetForwardToDll",
                data: JSON.stringify({ 'IssueTypeCode': IssueTypeCode }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (r) {

                    var ReasonDD = $("[id*=ForwardTo]");
                    $.each(r.d, function () {
                        ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
                    });
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                    alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
                }

            });

            $.ajax({
                type: "POST",
                url: "IssueManagement.aspx/GetPrevForwardDt",
                data: JSON.stringify({ 'IssueCode': IssueCode }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var ns = $.parseJSON(data.d);
                    var Apd = ns.ApproveDetails;
                    if (CurrentLevelText.trim() != Apd.P_PreviousUserLevel) {
                        $("#PREVUSERLEVEL").val(Apd.P_PreviousUserLevel);
                        $("#PREVUSER").val(Apd.P_PrevUser);
                        $("#ForDetails").val(Apd.P_ForwardDetail);
                    }
                    
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                    alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
                }

            });

        if (UserRole == "ROL00012") {
            $("#ActionType option[value='Forward']").remove();
                $("#Forward").hide();
                $("#lblDetail").text("Resolution Details");
            }
            $('#DetailModal').modal('show');
       
    });

    $("#btnSave").click(function () {
        debugger;
        var ApproveBll = [];

        var Validate = true;

        var P_IssueCode = $("#ContentPlaceHolder1_hdIssueCode").val();
        var P_ActionBy = "USER";
        var P_ActionType = $("#ActionType").val();
        var P_ActionUserCode = UserCode;
        var P_ForwardTo = $("#ForwardTo").val();
        var P_ForwardDetail = $("#Details").val();
        var P_PrevUserLevel = CurrentUserLevel
        var P_CurrentUserLevel = $("#CURRLEV").val(); ;
      
        
        if (P_ActionType == "") {
            P_ActionType == "" ? $("#ActionType").addClass('error') : $("#ActionType").removeClass('error');
            Validate = false;
        }
        else {
            if (P_ActionType == "Forward") {
                P_ForwardTo == "" ? $("#ForwardTo").addClass('error') : $("#ForwardTo").removeClass('error');
                P_ForwardDetail == "" ? $("#Details").addClass('error') : $("#Details").removeClass('error');
                if (P_ForwardTo == "" || P_ForwardDetail == "") {
                    Validate = false;
                  
                }

                if (P_ForwardTo == "") {
                    alert("Next level user not availble in system to forward issue");
                    Validate = false;
                }
            }
            if (P_ActionType == "Resolve") {

                P_ForwardDetail == "" ? $("#Details").addClass('error') : $("#Details").removeClass('error');
                if (P_ForwardDetail == "") {
                    Validate = false;
                }
            }
        }
        

        if (Validate) {
            $body.addClass("loading");
         
            ApproveBll.push({
              
                P_IssueCode : P_IssueCode,
                P_ActionBy :P_ActionBy,
                P_ActionType : P_ActionType,
                P_ActionUserCode : P_ActionUserCode,
                P_ForwardTo : P_ForwardTo,
                P_ForwardDetail : P_ForwardDetail,
                P_PreviousUserLevel : P_PrevUserLevel,
                P_CurrentUserLevel: P_CurrentUserLevel
                
            });


            $.ajax({
                type: "POST",
                url: "IssueManagement.aspx/SaveIssueDetail",
                data: JSON.stringify({ 'oApproveBll': ApproveBll }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data.d != '') {
                        $.alert("Issue Details Save Successfuly...");
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

        $("#ForwardTo").val('');
        $("#ForwardTo").removeClass('error');
        $("#Details").val('');
        $("#Details").removeClass('error');
    }

    $("#ActionType").change(function () {
        var ActionType = $("#ActionType").val(); Forward
        if (ActionType == 'Forward') {
            $("#Forward").show();
            $("#lblDetail").text("Forward Details");
        }
        if (ActionType == 'Resolve') {
            $("#Forward").hide();
            $("#lblDetail").text("Resolution Details");
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
                url: "IssueManagement.aspx/GetIssueManagmentList",
                data: JSON.stringify({ 'ddlFilterType': ddlFilterType, 'FilterValue': FilterValue, 'FromDt': FromDt, 'ToDt': ToDt, 'startindex': StartIndex, 'EndIndex': EndIndex }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var DR = data.d;
                    if (DR.length > 0) {
                        $("#nav").show();

                        for (var i = 0; i < DR.length; i++) {
                            debugger;
                            $("#Invoicetbl").append("<tr> <td class='noExl'>"
                                + "<a class='clkApprove pointerOnAnchor'>Action</a></td><td style='display:none'> "
                                + DR[i].P_IssueCode + "</td><td>"
                                + DR[i].P_Dealer + "</td><td>"
                                + DR[i].P_IssueType + "</td><td>"
                                + DR[i].P_IssueLevel + "</td><td>"
                                + DR[i].P_IssueDate + "</td><td>"
                                + DR[i].P_IssueStatus + "</td><td>"
                                + DR[i].P_CurrentUserLevelText + "</td><td>"
                                + DR[i].P_ResolveBy + "</td><td>"
                                + DR[i].P_ResolveDate + "</td><td>"
                                + DR[i].P_CurrentUser + "</td><td style='display:none'>"
                                + DR[i].P_IssueDescription + "</td><td style='display:none'>"
                                + DR[i].P_CurrentUserLevel + "</td><td style='display:none'>"
                                + DR[i].P_DealerCode + "</td><td style='display:none'>"
                                + DR[i].P_IssueTypeCode + "</td><td>"
                                + DR[i].P_PendingSince + "</td></tr>");
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