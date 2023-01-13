$(document).ready(function () {
    $body = $("body");
    var form = $('#AntiForgeryForm');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    var headers = {};
    headers['__RequestVerificationToken'] = token;

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
            url: "/Masters/GetClientCnt",
            data: JSON.stringify({ 'FilterType': FilterType, 'FilterValue': FilterValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            headers: headers,
            success: function (data) {
                console.log(data);
                if (data != "") {
                    TotalClientCnt = data;
                }
            }
        });
        return TotalClientCnt;
    };

    $('body').on('click', '#nav li', function () {
        $("#ClientMasterTbl").find("tr:gt(0)").remove();
        var val = $(this).find('a').text();
        var End = parseInt(val) * parseInt(15);
        var Start = (parseInt(End) - parseInt(15));
        GetAllClients(Start, 15);
    });

    function GetAllClients(StartIndex, EndIndex) {
        $("#ClientMasterTbl").find("tr:gt(0)").remove();

        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "/Masters/GetClientList",
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
                        $("#ClientMasterTbl").append("<tr><td>"
                            + PT[i].CLIENT_CODE + "</td><td style='word-break: break-all !important'>"
                            + PT[i].CLIENT_NAME + "</td><td style='word-break: break-all !important'>"
                            + PT[i].CLIENT_GROUP + "</td><td style='word-break: break-all !important'>"//AP-20210922-Added for Client Group column
                            + PT[i].Remark + "</td><td>"
                            + ('<a class="clkEdit pointerOnAnchor" id="clkEdit" style=""><span style="color:green">Edit</span></a> | <a class="clkView pointerOnAnchor" id="clkView" style=""><span style="color:orange">View</span></a>') + "</td></tr>");
                    }
                } else {
                    $("#nav").hide();
                    $("#ClientMasterTbl").append("<tr style='color:red;'><td colspan='7' style='text-align:center'>No Record Found</td></tr>");
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

    $("#clkSearch").click(function () {
        var TotalClientCnt = GetClientCnt();
        SetPages(TotalClientCnt, 15, 7);
        GetAllClients(0, 15);
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
        var ClientCode = $("#ClientMasterTbl").find("tr").eq(TblIndex).find("td").eq(0).text();
        $.ajax({
            type: "POST",
            url: "/Masters/GetClientDetails",
            data: JSON.stringify({ 'ClientCode': ClientCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                var ns = data;
                console.log(data);
                $("#HDCLIENT_CODE").val(ns.CLIENT_CODE);
                OldValue = ns.CLIENT_NAME;
                $("#CLIENT_NAME").val(ns.CLIENT_NAME);
                $("#CLIENT_GROUP").val(ns.CLIENT_GROUP);//AP-20210922-Added for Client Group column
                $("#Remark").val(ns.Remark);
                if (ns.ACTIVE == true) {
                    $("#Active").prop('checked', true);
                }
                $('#DetailModal').modal('show');

                $("#CLIENT_NAME").attr('disabled', false);
                $("#CLIENT_GROUP").attr('disabled', false);//AP-20210922-Added for Client Group column
                $("#Remark").attr('disabled', false);
                $("#Active").attr('disabled', false);
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
        var ClientCode = $("#ClientMasterTbl").find("tr").eq(TblIndex).find("td").eq(0).text();
        $.ajax({
            type: "POST",
            url: "/Masters/GetClientDetails",
            data: JSON.stringify({ 'ClientCode': ClientCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                var ns = data;
                console.log(data);
                $("#HDCLIENT_CODE").val(ns.CLIENT_CODE);
                $("#CLIENT_NAME").val(ns.CLIENT_NAME);
                $("#CLIENT_GROUP").val(ns.CLIENT_GROUP);//AP-20210922-Added for Client Group column
                $("#Remark").val(ns.Remark);
                if (ns.ACTIVE == true) {
                    $("#Active").prop('checked', true);
                }
                $('#DetailModal').modal('show');

                $("#CLIENT_NAME").attr('disabled', true);
                $("#CLIENT_GROUP").attr('disabled', true);//AP-20210922-Added for Client Group column
                $("#Remark").attr('disabled', true);
                $("#Active").attr('disabled', true);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });

    $("#btnSave").click(function () {

        var Validate = true;
        var ClientMaster = [];
        var ClientName = $("#CLIENT_NAME").val().trim();
        var ClientGroup = $("#CLIENT_GROUP").val().trim();
        ClientName == "" ? $("#CLIENT_NAME").addClass('error') : $("#CLIENT_NAME").removeClass('error');

        if (ClientName == "") {
            Validate = false;
        }
        if ($("#HDCLIENT_CODE").val() == 0 && ClientName != OldValue) {
            $.ajax({
                type: "POST",
                url: "/Masters/CheckDuplicate",
                data: JSON.stringify({ 'TblName': 'ClientMasterTbl', 'ColumnName': 'CLIENT_NAME', 'Value': ClientName }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                headers: headers,
                success: function (data) {
                    console.log(data);
                    if (data != "0") {
                        Validate = false;
                        $.alert("" + ClientName + " Client Already Exist!");
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
            ClientMaster.push({
                CLIENT_CODE: $("#HDCLIENT_CODE").val(),
                CLIENT_NAME: ClientName,
                CLIENT_GROUP: ClientGroup,//AP-20210922-Added for Client Group column
                Remark: $("#Remark").val().trim(),
                ACTIVE: ACTIVE
            })
            $.ajax({
                type: "POST",
                url: "/Masters/SaveUpdateClient",
                data: JSON.stringify({ 'master': ClientMaster }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: headers,
                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        $.alert("Client Saved/Updated Sucessfully!");
                        var TotalClientCnt = GetClientCnt();
                        SetPages(TotalClientCnt, 15, 7);
                        GetAllClients(0, 15);

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
        $("#ClientMasterTblCopy").find("tr:gt(0)").remove();
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "/Masters/GetClientListForExcel",
            data: JSON.stringify({ 'FilterType': FilterType, 'FilterValue': FilterValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                var ns = JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\""));
                console.log(ns);
                $.each(ns, function (index, value) {
                    $("#ClientMasterTblCopy").append("<tr><td>"
                        + value.CLIENT_CODE + "</td><td>"
                        + value.CLIENT_NAME + "</td><td>"
                        + value.CLIENT_GROUP + "</td><td>"//AP-20210922-Added for Client Group column
                        + value.Remark + "</td></tr>");
                });
                var TblLength = $("#ClientMasterTblCopy").find("tr").length;
                if (TblLength > 1) {
                    $("#ClientMasterTblCopy").table2excel({
                        name: "Table2Excel",
                        filename: "Client_Master_Report"

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
        $("#HDCLIENT_CODE").val('0');
        $("#DetailModal").modal('show');
        $("#btnSave").show();

        $("#Remark").attr('disabled', false);
        $("#Active").prop('checked', true);
        $("#Active").attr('disabled', true);
        $("#CLIENT_NAME").attr('disabled', false);

    });

    function ClearAll() {
        $("#CLIENT_NAME").removeClass('error');
        $("#Active").prop('checked', false);

        $("#CLIENT_NAME").val('');
        $("#Remark").val('');
    };
});