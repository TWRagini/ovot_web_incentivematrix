$(document).ready(function () {
    $body = $("body");

    var TotalBillCatCnt = GetBillCatCnt();
    SetPages(TotalBillCatCnt, 15, 7);
    var OldValue = '';
    GetAllBillCats(0, 15);

    function GetBillCatCnt() {
        var form = $('#AntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        var headers = {};
        headers['__RequestVerificationToken'] = token;
        var TotalBillCatCnt = 0;
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "/Masters/GetBillCatCnt",
            data: JSON.stringify({ 'FilterType': FilterType, 'FilterValue': FilterValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            headers: headers,
            success: function (data) {
                console.log(data);
                if (data != "") {
                    TotalBillCatCnt = data;
                }
            }
        });
        return TotalBillCatCnt;
    };

    function GetAllBillCats(StartIndex, EndIndex) {
        $("#BillCatMasterTbl").find("tr:gt(0)").remove();
        var form = $('#AntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        var headers = {};
        headers['__RequestVerificationToken'] = token;
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "/Masters/GetBillCatList",
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
                        $("#BillCatMasterTbl").append("<tr><td>"
                            + PT[i].BILLING_CATEGORY_CODE + "</td><td>"
                            + PT[i].BILLING_CATEGORY_NAME + "</td><td>"
                            + PT[i].Remark + "</td><td>"
                            + ('<a class="clkEdit pointerOnAnchor" id="clkEdit" style=""><span style="color:green">Edit</span></a> | <a class="clkView pointerOnAnchor" id="clkView" style=""><span style="color:orange">View</span></a>') + "</td></tr>");
                    }
                } else {
                    $("#nav").hide();
                    $("#BillCatMasterTbl").append("<tr style='color:red;'><td colspan='7' style='text-align:center'>No Record Found</td></tr>");
                }
            }
        });
    }

    $('body').on('click', '#nav li', function () {
        $("#BillCatMasterTbl").find("tr:gt(0)").remove();
        var val = $(this).find('a').text();
        var End = parseInt(val) * parseInt(15);
        var Start = (parseInt(End) - parseInt(15));
        GetAllBillCats(Start, 15);
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
            GetAllBillCats(Start, 15);
            return showPage(currentPage + 1);
        });

        $("#previous-page").on("click", function () {
            var End = parseInt(currentPage - 1) * parseInt(15);
            var Start = (parseInt(End) - parseInt(15));
            GetAllBillCats(Start, 15);
            return showPage(currentPage - 1);
        });
        $(".pagination").append("</ul>");
    };

    $("#clkSearch").click(function () {
        var TotalBillCatCnt = GetBillCatCnt();
        SetPages(TotalBillCatCnt, 15, 7);
        GetAllBillCats(0, 15);
    });

    $('#ModelContent input:text').blur(function () {
        if ($(this).val() == '') {
            $(this).addClass('error');
        } else {
            $(this).removeClass('error');
        }
    });

    $(document).on("click", ".clkEdit", function () {
        var form = $('#AntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        var headers = {};
        headers['__RequestVerificationToken'] = token;
        $("#btnSave").show();
        ClearAll();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var BillCatCode = $("#BillCatMasterTbl").find("tr").eq(TblIndex).find("td").eq(0).text();
        $.ajax({
            type: "POST",
            url: "/Masters/GetBillCatDetails",
            data: JSON.stringify({ 'BillCatCode': BillCatCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                var ns = data;
                console.log(data);
                $("#HDBILLING_CATEGORY_CODE").val(ns.BILLING_CATEGORY_CODE);
                $("#BILLING_CATEGORY_NAME").val(ns.BILLING_CATEGORY_NAME);
                OldValue = ns.BILLING_CATEGORY_NAME;
                $('#DetailModal').modal('show');
                $("#Remark").val(ns.Remark);
                if (ns.ACTIVE == true) {
                    $("#Active").prop('checked', true);
                }
                $("#Remark").attr('disabled', false);
                $("#Active").attr('disabled', false);
                $("#BILLING_CATEGORY_NAME").attr('disabled', false);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });

    $(document).on("click", ".clkView", function () {
        var form = $('#AntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        var headers = {};
        headers['__RequestVerificationToken'] = token;
        ClearAll();
        $("#btnSave").hide();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var BillCatCode = $("#BillCatMasterTbl").find("tr").eq(TblIndex).find("td").eq(0).text();
        $.ajax({
            type: "POST",
            url: "/Masters/GetBillCatDetails",
            data: JSON.stringify({ 'BillCatCode': BillCatCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers, headers,
            success: function (data) {
                var ns = data;
                console.log(data);
                $("#HDBILLING_CATEGORY_CODE").val(ns.BILLING_CATEGORY_CODE);
                $("#BILLING_CATEGORY_NAME").val(ns.BILLING_CATEGORY_NAME);
                $('#DetailModal').modal('show');
                $("#Remark").val(ns.Remark);
                if (ns.ACTIVE == true) {
                    $("#Active").prop('checked', true);
                }
                $("#Remark").attr('disabled', true);
                $("#Active").attr('disabled', true);
                $("#BILLING_CATEGORY_NAME").attr('disabled', true);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });

    $("#btnSave").click(function () {
        var form = $('#AntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        var headers = {};
        headers['__RequestVerificationToken'] = token;
        var Validate = true;
        var BillCatMaster = [];
        var BillCatName = $("#BILLING_CATEGORY_NAME").val().trim();

        BillCatName == "" ? $("#BILLING_CATEGORY_NAME").addClass('error') : $("#BILLING_CATEGORY_NAME").removeClass('error');

        if (BillCatName == "") {
            Validate = false;
        }
        if ($("#HDBILLING_CATEGORY_CODE").val() == 0 || BillCatName != OldValue) {
            $.ajax({
                type: "POST",
                url: "/Masters/CheckDuplicate",
                data: JSON.stringify({ 'TblName': 'BillingCategoryMasterTbl', 'ColumnName': 'BILLING_CATEGORY_NAME', 'Value': BillCatName }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                headers: headers,
                success: function (data) {
                    console.log(data);
                    if (data != "0") {
                        Validate = false;
                        $.alert("" + BillCatName + " Billing Category Already Exist!");
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
            BillCatMaster.push({
                BILLING_CATEGORY_CODE: $("#HDBILLING_CATEGORY_CODE").val(),
                BILLING_CATEGORY_NAME: BillCatName,
                Remark: $("#Remark").val().trim(),
                ACTIVE: ACTIVE
            })
            $.ajax({
                type: "POST",
                url: "/Masters/SaveUpdateBillCat",
                data: JSON.stringify({ 'master': BillCatMaster }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: headers,
                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        $.alert("Billing Category Saved/Updated Sucessfully!");
                        var TotalBillCatCnt = GetBillCatCnt();
                        SetPages(TotalBillCatCnt, 15, 7);
                        GetAllBillCats(0, 15);

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
        var form = $('#AntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        var headers = {};
        headers['__RequestVerificationToken'] = token;
        //$body.addClass("loading");       
        $("#BillCatMasterTblCopy").find("tr:gt(0)").remove();
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "/Masters/GetBillCatListForExcel",
            data: JSON.stringify({ 'FilterType': FilterType, 'FilterValue': FilterValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers, headers,
            success: function (data) {
                var ns = JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\""));
                console.log(ns);
                $.each(ns, function (index, value) {
                    $("#BillCatMasterTblCopy").append("<tr><td>"
                        + value.BILLING_CATEGORY_CODE + "</td><td>"
                        + value.BILLING_CATEGORY_NAME + "</td><td>"
                        + value.Remark + "</td></tr>");
                });
                var TblLength = $("#BillCatMasterTblCopy").find("tr").length;
                if (TblLength > 1) {
                    $("#BillCatMasterTblCopy").table2excel({
                        name: "Table2Excel",
                        filename: "BillCat_Master_Report"

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
        $("#HDBILLING_CATEGORY_CODE").val('0');
        $("#DetailModal").modal('show');
        $("#btnSave").show();
        $("#Remark").attr('disabled', false);
        $("#Active").prop('checked', true);
        $("#Active").attr('disabled', true);
        $("#BillCatName").attr('disabled', false);

    });

    function ClearAll() {
        $("#BILLING_CATEGORY_NAME").removeClass('error');
        $("#Active").prop('checked', false);
        $("#Remark").val('');
        $("#BILLING_CATEGORY_NAME").val('');
    };
});