$(document).ready(function () {
    $body = $("body");

    var form = $('#AntiForgeryForm');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    var headers = {};
    headers['__RequestVerificationToken'] = token;

    var TotalServiceCnt = GetServiceCnt();
    SetPages(TotalServiceCnt, 15, 7);
    GetAllServices(0, 15);

    function GetServiceCnt() {
        var TotalServiceCnt = 0;
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "/Masters/GetServicesCnt",
            data: JSON.stringify({ 'FilterType': FilterType, 'FilterValue': FilterValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            headers: headers,
            success: function (data) {
                console.log(data);
                if (data != "") {
                    TotalServiceCnt = data;
                }
            }
        });
        return TotalServiceCnt;
    };

    $('body').on('click', '#nav li', function () {
        $("#ServiceMasterTbl").find("tr:gt(0)").remove();
        var val = $(this).find('a').text();
        var End = parseInt(val) * parseInt(15);
        var Start = (parseInt(End) - parseInt(15));
        GetAllServices(Start, 15);
    });

    function GetAllServices(StartIndex, EndIndex) {
        $("#ServiceMasterTbl").find("tr:gt(0)").remove();

        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "/Masters/GetServicesList",
            data: JSON.stringify({ 'StartIndex': StartIndex, 'EndIndex': EndIndex, 'FilterType': FilterType, 'FilterValue': FilterValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                console.log(data);
                var PT = JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\""));               
                if (PT.length > 0) {
                    $("#nav").show();
                    for (var i = 0; i < PT.length; i++) {                        
                        $("#ServiceMasterTbl").append("<tr><td>"
                            + PT[i].SERVICE_CODE + "</td><td style='word-break: break-all !important'>"
                            + PT[i].SERVICE_NAME + "</td><td style='word-break: break-all !important'>"
                            + PT[i].Remark + "</td><td>"
                            + ('<a class="clkEdit pointerOnAnchor" id="clkEdit" style=""><span style="color:green">Edit</span></a> | <a class="clkView pointerOnAnchor" id="clkView" style=""><span style="color:orange">View</span></a>') + "</td></tr>");
                    }
                } else {
                    $("#nav").hide();
                    $("#ServiceMasterTbl").append("<tr style='color:red;'><td colspan='7' style='text-align:center'>No Record Found</td></tr>");
                }
            }
        });
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
            GetAllServices(Start, 15);
            return showPage(currentPage + 1);
        });

        $("#previous-page").on("click", function () {
            var End = parseInt(currentPage - 1) * parseInt(15);
            var Start = (parseInt(End) - parseInt(15));
            GetAllServices(Start, 15);
            return showPage(currentPage - 1);
        });
        $(".pagination").append("</ul>");
    };

    $("#clkSearch").click(function () {
        var TotalServiceCnt = GetServiceCnt();
        SetPages(TotalServiceCnt, 15, 7);
        GetAllServices(0, 15);
    });

    $('#ModelContent input:text').blur(function () {
        if ($(this).val() == '') {
            $(this).addClass('error');
        } else {
            $(this).removeClass('error');
        }
    });

    $(document).on("click", ".clkEdit", function () {
        $("#btnSave").show();
        ClearAll();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var ServiceCode = $("#ServiceMasterTbl").find("tr").eq(TblIndex).find("td").eq(0).text();
        $.ajax({
            type: "POST",
            url: "/Masters/GetServiceDetails",
            data: JSON.stringify({ 'ServiceCode': ServiceCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                var ns = data;
                console.log(data);
                $("#HDSERVICE_CODE").val(ns.SERVICE_CODE);
                $("#SERVICE_NAME").val(ns.SERVICE_NAME);

                $("#Remark").val(ns.Remark);
                if (ns.ACTIVE == true) {
                    $("#Active").prop('checked', true);
                }
                $("#Remark").attr('disabled', false);
                $("#Active").attr('disabled', false);

                $('#DetailModal').modal('show');
                $("#SERVICE_NAME").attr('disabled', false);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });

    $(document).on("click", ".clkView", function () {
        ClearAll();
        $("#btnSave").hide();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var ServiceCode = $("#ServiceMasterTbl").find("tr").eq(TblIndex).find("td").eq(0).text();
        $.ajax({
            type: "POST",
            url: "/Masters/GetServiceDetails",
            data: JSON.stringify({ 'ServiceCode': ServiceCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                var ns = data;
                console.log(data);
                $("#HDSERVICE_CODE").val(ns.SERVICE_CODE);
                $("#SERVICE_NAME").val(ns.SERVICE_NAME);
                $("#Remark").val(ns.Remark);
                if (ns.ACTIVE == true) {
                    $("#Active").prop('checked', true);
                }
                $("#Remark").attr('disabled', true);
                $("#Active").attr('disabled', true);

                $('#DetailModal').modal('show');

                $("#SERVICE_NAME").attr('disabled', true);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });

    $("#btnSave").click(function () {

        var Validate = true;
        var ServiceMaster = [];
        var ServiceName = $("#SERVICE_NAME").val().trim();

        ServiceName == "" ? $("#SERVICE_NAME").addClass('error') : $("#SERVICE_NAME").removeClass('error');        

        if (ServiceName == "") {
            Validate = false;
        }
        if (Validate) {
            $body.addClass("loading");
            var ACTIVE = false;
            if ($("#Active").prop("checked") == true) {
                ACTIVE = true;
            }
            ServiceMaster.push({
                SERVICE_CODE: $("#HDSERVICE_CODE").val(),
                SERVICE_NAME: ServiceName,              
                Remark: $("#Remark").val().trim(),
                ACTIVE: ACTIVE
            })
            $.ajax({
                type: "POST",
                url: "/Masters/SaveUpdateService",
                data: JSON.stringify({ 'services': ServiceMaster }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: headers,
                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        $.alert("Service Saved/Updated Sucessfully!");
                        var TotalServiceCnt = GetServiceCnt();
                        SetPages(TotalServiceCnt, 15, 7);
                        GetAllServices(0, 15);

                        //$('#DetailModal').modal('hide');

                    }
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });
        }
    });

    $("#GenExcel").click(function () {
        //$body.addClass("loading");       
        $("#ServiceMasterTblCopy").find("tr:gt(0)").remove();
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "/Masters/GetServiceListForExcel",
            data: JSON.stringify({ 'FilterType': FilterType, 'FilterValue': FilterValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                var ns = JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\""));
                console.log(ns);
                $.each(ns, function (index, value) {
                    $("#ServiceMasterTblCopy").append("<tr><td>"
                        + value.SERVICE_CODE + "</td><td>"
                        + value.SERVICE_NAME + "</td><td>"
                        + value.Remark + "</td></tr>");
                });
                var TblLength = $("#ServiceMasterTblCopy").find("tr").length;
                if (TblLength > 1) {
                    $("#ServiceMasterTblCopy").table2excel({
                        name: "Table2Excel",
                        filename: "Service_Master_Report"

                    });
                }
            },
            complete: function () {
                $body.removeClass("loading");
            }
        });

    });

    $("#clkAdd").click(function () {
        //ClearAll();
        $("#HDSERVICE_CODE").val('0');
        $("#DetailModal").modal('show');
        $("#btnSave").show();

        $("#Remark").attr('disabled', false);
        $("#Active").prop('checked', true);
        $("#Active").attr('disabled', true);
        $("#ServiceName").attr('disabled', false);
       
    });

    function ClearAll() {
        $("#SERVICE_NAME").removeClass('error');
       
        $("#SERVICE_NAME").val('');
        $("#Active").prop('checked', false);
        $("#Remark").val('');
    };
});