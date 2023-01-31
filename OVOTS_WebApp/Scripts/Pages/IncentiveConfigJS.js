$(document).ready(function () {
    $body = $("body");
    //var form = $('#AntiForgeryForm');
    //var token = $('input[name="__RequestVerificationToken"]', form).val();
    //var headers = {};
    //headers['__RequestVerificationToken'] = token;
    $("#FromDate").datepicker({ dateFormat: 'dd/mm/yy' });
    $("#ToDate").datepicker({ dateFormat: 'dd/mm/yy' });
    var username = $("#HDUserName").val();
    alert(username);
    $("#ConfigBy").val(username);

    var TotalClientCnt = GetClientCnt();
    SetPages(TotalClientCnt, 15, 7);
    GetAllClients(0, 15);
    var OldValue = '';
    function GetClientCnt() {
        var TotalClientCnt = 0;
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "IncentiveConfiguration.aspx/GetIncentiveConfigCnt",
            data: JSON.stringify({ 'ddlFilterType': FilterType, 'FilterValue': FilterValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,

            success: function (data) {
                console.log(data);
                if (data.d != "") {
                    TotalClientCnt = data.d;
                }
            }
        });
        return TotalClientCnt;
    };

 
    $.ajax({
        type: "POST",
        url: "IncentiveConfiguration.aspx/GetEntityDll",
        data: JSON.stringify({ 'Level': 'Model' }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            console.log(r);
            var ReasonDD = $("#Model    ");
            $.each(r.d, function () {
                ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
        }

    });

    $("#ConfigLevel").change(function () {
       

    });


    $('body').on('click', '#nav li', function () {
        $("#ConfigMasterTbl").find("tr:gt(0)").remove();
        var val = $(this).find('a').text();
        var End = parseInt(val) * parseInt(15);
        var Start = (parseInt(End) - parseInt(15));
        GetAllClients(Start, 15);
    });

   

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

    //----------------------------24-01-2023-------------------------------//
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

    //function GetAllClients(StartIndex, EndIndex) {
    //    debugger;
    //    $("#GCHMasterTbl").find("tr:gt(0)").remove();
    //    $body.addClass("loading");
    //    var FilterType = $("#ddlFilterType").val().trim();
    //    var FilterValue = $("#FilterValue").val().trim();
    //    $("#ContentPlaceHolder1_hdFilterValue").val(FilterValue);
    //    $("#ContentPlaceHolder1_hdFilterType").val(FilterType);
    //    $.ajax({
    //        type: "POST",
    //        url: "GCHMaster.aspx/GetGCHList",
    //        data: JSON.stringify({ 'ddlFilterType': FilterType, 'FilterValue': FilterValue, 'startindex': StartIndex, 'EndIndex': EndIndex }),
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",

    //        success: function (data) {
    //            console.log(data);
    //            var PT = data.d;
    //            if (PT.length > 0) {

    //                $("#nav").show();
    //                for (var i = 0; i < PT.length; i++) {
    //                    $("#GCHMasterTbl").append("<tr><td>"
    //                        + ('<a class="clkEdit pointerOnAnchor" id="clkEdit" style=""><span style="color:green">Edit</span></a> | <a class="clkView pointerOnAnchor" id="clkView" style=""><span style="color:orange">View</span></a>') + "</td><td>"
    //                        + PT[i].P_GCHCode + "</td><td>"
    //                        + PT[i].P_GCHName + "</td><td>"
    //                        + PT[i].P_MobileNo + "</td><td>"
    //                        + PT[i].P_EmailId + "</td><td>"
    //                        + PT[i].P_State + "</td><td>"
    //                        + PT[i].P_District + "</td><td>"
    //                        + PT[i].P_Town + "</td><td>"
    //                        + PT[i].P_PinCode + "</td><td>"
    //                        + PT[i].P_Address + "</td><td>"
    //                        + PT[i].P_ClusterName + "</td></tr>");
    //                }

    //            } else {
    //                $("#nav").hide();
    //                $("#GCHMasterTbl").append("<tr style='color:red;'><td colspan='7' style='text-align:center'>No Record Found</td></tr>");
    //            }
    //            $body.removeClass("loading");
    //        }
    //    });
    //}

    //----------------------------------- END -------------------------------------//

   

    $('#ModelContent input:text').blur(function () {
        if ($(this).val() == '') {
            $(this).addClass('error');
        } else {
            $(this).removeClass('error');
        }
    });

    $("#Search").on("keyup", function () {

        var value = $(this).val().toLowerCase();

        $("#ConfigMasterTbl tr:not(:first-child)").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });




   

    $("#clkAdd").click(function () {
        ClearAll();
        $("#HdConfigCode").val('0');
        $("#DetailModal").modal('show');
        $("#btnSave").show();


        $("#Active").prop('checked', true);
        $("#Active").attr('disabled', true);


    });

    



    function ClearAll() {
        $("#DistrictName").removeClass('error');

        $("#ConfigName").removeClass('error');
        $("#ConfigBy").removeClass('error');
        $("#ConfigLevel").removeClass('error');
        $("#EntityCode").removeClass('error');
       
        $("#Active").attr('disabled', false);
        $("#ConfigName").attr('disabled', false);

       
        $("#ConfigLevel").attr('disabled', false);
        $("#EntityCode").attr('disabled', false);
        $("#Remarks").attr('disabled', false);
        $("#ConfigName").val('');
        
        $("#ConfigLevel").val('');
        $("#EntityCode").val('');
        $("#Remarks").val('');
        $("#ProductTbl").find("tr:gt(0)").remove();


        $("#Active").prop('checked', false);

    };
});