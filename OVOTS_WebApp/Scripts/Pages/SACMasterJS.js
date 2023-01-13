$(document).ready(function () {
    $body = $("body");
    var form = $('#AntiForgeryForm');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    var headers = {};
    headers['__RequestVerificationToken'] = token;

    var TotalSACCnt = GetSACCnt();
    SetPages(TotalSACCnt, 15, 7);
    GetAllSACs(0, 15);
    var OldValue = '';
    function GetSACCnt() {
        var TotalSACCnt = 0;
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "/Masters/GetSACCnt",
            data: JSON.stringify({ 'FilterType': FilterType, 'FilterValue': FilterValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            headers: headers,
            success: function (data) {
                console.log(data);
                if (data != "") {
                    TotalSACCnt = data;
                }
            }
        });
        return TotalSACCnt;
    };

    $('body').on('click', '#nav li', function () {
        $("#SACMasterTbl").find("tr:gt(0)").remove();
        var val = $(this).find('a').text();
        var End = parseInt(val) * parseInt(15);
        var Start = (parseInt(End) - parseInt(15));
        GetAllSACs(Start, 15);
    });

    function GetAllSACs(StartIndex, EndIndex) {
        $("#SACMasterTbl").find("tr:gt(0)").remove();

        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "/Masters/GetSACList",
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
                        $("#SACMasterTbl").append("<tr><td>"
                            + PT[i].SAC_ID + "</td><td style='word-break: break-all !important'>"
                            + PT[i].SAC_CODE + "</td><td style='word-break: break-all !important'>"
                            + PT[i].Remark + "</td><td>"
                            + ('<a class="clkEdit pointerOnAnchor" id="clkEdit" style=""><span style="color:green">Edit</span></a> | <a class="clkView pointerOnAnchor" id="clkView" style=""><span style="color:orange">View</span></a>') + "</td></tr>");
                    }
                } else {
                    $("#nav").hide();
                    $("#SACMasterTbl").append("<tr style='color:red;'><td colspan='7' style='text-align:center'>No Record Found</td></tr>");
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
            GetAllSACs(Start, 15);
            return showPage(currentPage + 1);
        });

        $("#previous-page").on("click", function () {
            var End = parseInt(currentPage - 1) * parseInt(15);
            var Start = (parseInt(End) - parseInt(15));
            GetAllSACs(Start, 15);
            return showPage(currentPage - 1);
        });
        $(".pagination").append("</ul>");
    };

    $("#clkSearch").click(function () {
        var TotalSACCnt = GetSACCnt();
        SetPages(TotalSACCnt, 15, 7);
        GetAllSACs(0, 15);
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
        var SACCode = $("#SACMasterTbl").find("tr").eq(TblIndex).find("td").eq(0).text();
        $.ajax({
            type: "POST",
            url: "/Masters/GetSACDetails",
            data: JSON.stringify({ 'SACCode': SACCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                var ns = data;
                console.log(data);
                $("#HDSAC_ID").val(ns.SAC_ID);
                OldValue = ns.SAC_CODE;
                $("#SAC_CODE").val(ns.SAC_CODE);
                $('#DetailModal').modal('show');
                $("#Remark").val(ns.Remark);
                if (ns.ACTIVE == true) {
                    $("#Active").prop('checked', true);
                }
                $("#Remark").attr('disabled', false);
                $("#Active").attr('disabled', false);
                $("#SAC_CODE").attr('disabled', false);
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
        var SACCode = $("#SACMasterTbl").find("tr").eq(TblIndex).find("td").eq(0).text();
        $.ajax({
            type: "POST",
            url: "/Masters/GetSACDetails",
            data: JSON.stringify({ 'SACCode': SACCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                var ns = data;
                console.log(data);
                $("#HDSAC_ID").val(ns.SAC_ID);
                $("#SAC_CODE").val(ns.SAC_CODE);
                $('#DetailModal').modal('show');
                $("#Remark").val(ns.Remark);
                if (ns.ACTIVE == true) {
                    $("#Active").prop('checked', true);
                }
                $("#Remark").attr('disabled', true);
                $("#Active").attr('disabled', true);
                $("#SAC_CODE").attr('disabled', true);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });

    $("#btnSave").click(function () {

        var Validate = true;
        var SACMaster = [];
        var SACCode = $("#SAC_CODE").val().trim();

        SACCode == "" ? $("#SAC_CODE").addClass('error') : $("#SAC_CODE").removeClass('error');

        if (SACCode == "") {
            Validate = false;
        }
       
        if ($("#HDSAC_ID").val() == 0 || SACCode != OldValue) {
            $.ajax({
                type: "POST",
                url: "/Masters/CheckDuplicate",
                data: JSON.stringify({ 'TblName': 'SACMasterTbl', 'ColumnName': 'SAC_CODE', 'Value': SACCode }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                headers: headers,
                success: function (data) {
                    console.log(data);
                    if (data != "0") {
                        Validate = false;
                        $.alert("" + SACCode + " SAC Code Already Exist!");
                    }
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });
        }


        if (Validate) {
            $body.addClass("loading");
            var ACTIVE = false;
            if ($("#Active").prop("checked") == true) {
                ACTIVE = true;
            }
            SACMaster.push({
                SAC_ID: $("#HDSAC_ID").val(),
                SAC_CODE: SACCode,
                Remark: $("#Remark").val().trim(),
                ACTIVE: ACTIVE
            })
            $.ajax({
                type: "POST",
                url: "/Masters/SaveUpdateSAC",
                data: JSON.stringify({ 'master': SACMaster }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: headers,
                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        $.alert("SAC Saved/Updated Sucessfully!");
                        var TotalSACCnt = GetSACCnt();
                        SetPages(TotalSACCnt, 15, 7);
                        GetAllSACs(0, 15);

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
        $("#SACMasterTblCopy").find("tr:gt(0)").remove();
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "/Masters/GetSACListForExcel",
            data: JSON.stringify({ 'FilterType': FilterType, 'FilterValue': FilterValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                var ns = JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\""));
                console.log(ns);
                $.each(ns, function (index, value) {
                    $("#SACMasterTblCopy").append("<tr><td>"
                        + value.SAC_ID + "</td><td>"
                        + value.SAC_CODE + "</td><td>"
                        + value.Remark + "</td></tr>");
                });
                var TblLength = $("#SACMasterTblCopy").find("tr").length;
                if (TblLength > 1) {
                    $("#SACMasterTblCopy").table2excel({
                        name: "Table2Excel",
                        filename: "SAC_Master_Report"

                    });
                }
            },
            complete: function () {
                $body.removeClass("loading");
            }
        });

    });

    $("#clkAdd").click(function () {
        ClearAll();
        $("#HDSAC_ID").val('0');
        $("#DetailModal").modal('show');
        $("#btnSave").show();
        $("#Remark").attr('disabled', false);
        $("#Active").prop('checked', true);
        $("#Active").attr('disabled', true);
        $("#SAC_CODE").attr('disabled', false);

    });

    function ClearAll() {
        $("#SAC_CODE").removeClass('error');

        $("#SAC_CODE").val('');
        $("#Active").prop('checked', false);
        $("#Remark").val('');
    };
});