$(document).ready(function () {
    debugger;
    $body = $("body");
    // $("#Approve_Date").datepicker({ dateFormat: 'dd/mm/yy', maxDate: 0 }).datepicker("setDate", new Date());
   
    $("#FromDate").datepicker({ dateFormat: 'dd/mm/yy' });
    $("#ToDate").datepicker({ dateFormat: 'dd/mm/yy' });
    var TotalClientCnt = GetClientCnt();
    SetPages(TotalClientCnt, 15, 7);
    GetCustomerInvoiceList(0, 15);

    function GetClientCnt() {
        var TotalClientCnt = 0;
     
        var FromDt = $("#FromDate").val();
        var ToDt = $("#ToDate").val();
       
        $.ajax({
            type: "POST",
            url: "ViewIncentiveInvoice.aspx/GetISDInvoiceCnt",
            data: JSON.stringify({  'FromDt': FromDt, 'ToDt': ToDt }),
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

   
    function GetCustomerInvoiceList(StartIndex, EndIndex) {
        $("#Invoicetbl").find("tr:gt(0)").remove();
       
        var FromDt = $("#FromDate").val();
        var ToDt = $("#ToDate").val();
     
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
                url: "ViewIncentiveInvoice.aspx/GetISDInvoiceList",
                data: JSON.stringify({ 'FromDt': FromDt, 'ToDt': ToDt, 'startindex': StartIndex, 'EndIndex': EndIndex }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var DR = data.d;
                    if (DR.length > 0) {
                        $("#nav").show();
                        for (var i = 0; i < DR.length; i++) {
                            $("#Invoicetbl").append("<tr> <td>"
                                + DR[i].InvoiceCode + "</td><td>"
                                + DR[i].ISDName + "</td><td>"
                                + DR[i].InvoiceForDate + "</td><td class='noExl'> "
                                + "<a  class='clkFile' href='" + DR[i].FilePath + "' target='_blank' >View</a></td><td>"
                                + DR[i].CreatedDate + "</td></tr>");
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

 

    $("#GenExcel").click(function () {
        var PPtblLength = $("#Invoicetbl").find("tr").length;
        if (PPtblLength > 1) {
            $("#Invoicetbl").table2excel({
                name: "Table2Excel",
                filename: "ISD_Invoice"
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