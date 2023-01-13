$(document).ready(function () {
    $body = $("body");
    //var form = $('#AntiForgeryForm');
    //var token = $('input[name="__RequestVerificationToken"]', form).val();
    //var headers = {};
    //headers['__RequestVerificationToken'] = token;

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
            url: "TownMaster.aspx/GetTownCnt",
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

    debugger;
    $.ajax({
        type: "POST",
        url: "TownMaster.aspx/GetStateDll",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            console.log(r);
            var ReasonDD = $("[id*=StateCode]");
            $.each(r.d, function () {
                ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
        }

    });

    $("#StateCode").change(function () {
        var StateCode = $("#StateCode").val();
        debugger;
        $.ajax({
            type: "POST",
            url: "TownMaster.aspx/GetDistrictDll",
            data: JSON.stringify({ 'StateCode': StateCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (r) {
                console.log(r);
                var ReasonDD = $("[id*=DistrictCode]");
                $.each(r.d, function () {
                    ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }

        });

    });

    $('body').on('click', '#nav li', function () {
        $("#TownMasterTbl").find("tr:gt(0)").remove();
        var val = $(this).find('a').text();
        var End = parseInt(val) * parseInt(15);
        var Start = (parseInt(End) - parseInt(15));
        GetAllClients(Start, 15);
    });

    function GetAllClients(StartIndex, EndIndex) {

        $("#TownMasterTbl").find("tr:gt(0)").remove();
        $body.addClass("loading");
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $("#ContentPlaceHolder1_hdFilterValue").val(FilterValue);
        $("#ContentPlaceHolder1_hdFilterType").val(FilterType);
        $.ajax({
            type: "POST",
            url: "TownMaster.aspx/GetTownList",
            data: JSON.stringify({ 'ddlFilterType': FilterType, 'FilterValue': FilterValue, 'startindex': StartIndex, 'EndIndex': EndIndex }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                console.log(data);
                var PT = data.d;
                if (PT.length > 0) {

                    $("#nav").show();
                    for (var i = 0; i < PT.length; i++) {
                        $("#TownMasterTbl").append("<tr><td>"
                            + ('<a class="clkEdit pointerOnAnchor" id="clkEdit" style=""><span style="color:green">Edit</span></a> | <a class="clkView pointerOnAnchor" id="clkView" style=""><span style="color:orange">View</span></a>') + "</td><td>"
                            + PT[i].P_TownCode + "</td><td>"
                            + PT[i].P_StateName + "</td><td>"
                            + PT[i].P_DistrictName + "</td><td>"
                            + PT[i].P_TownName + "</td></tr>");

                    }

                } else {
                    $("#nav").hide();
                    $("#TownMasterTbl").append("<tr style='color:red;'><td colspan='7' style='text-align:center'>No Record Found</td></tr>");
                }
                $body.removeClass("loading");
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

    $("#Search").on("keyup", function () {

        var value = $(this).val().toLowerCase();

        $("#TownMasterTbl tr:not(:first-child)").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $(document).on("click", ".clkEdit", function () {
        $("#btnSave").show();
        ClearAll();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var P_TownCode = $("#TownMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();

        $.ajax({
            type: "POST",
            url: "TownMaster.aspx/GetTownDetails",
            data: JSON.stringify({ 'P_TownCode': P_TownCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                debugger;
                var del = $.parseJSON(data.d);
                var ns = del.TownDetails;
                $("#HDTownCode").val(ns.P_TownCode);

                $("#TownName").val(ns.P_TownName);
                OldValue = ns.P_TownName;
                $("#StateCode").val(ns.P_StateCode);
                $("#StateCode").change();
                $("#DistrictCode option[value=" + ns.P_DistrictCode +"]").attr('selected', 'selected');
               // $("#DistrictCode").val(ns.P_DistrictCode);
                if (ns.P_Active == 'TRUE') {
                    $("#Active").prop('checked', true);
                }
                $('#DetailModal').modal('show');


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
        var P_TownCode = $("#TownMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        $.ajax({
            type: "POST",
            url: "TownMaster.aspx/GetTownDetails",
            data: JSON.stringify({ 'P_TownCode': P_TownCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                var del = $.parseJSON(data.d);
                var ns = del.TownDetails;
                $("#HDTownCode").val(ns.P_TownCode);

                $("#TownName").val(ns.P_TownName);
                $("#StateCode").val(ns.P_StateCode);
                $("#StateCode").change();
                $("#DistrictCode option[value=" + ns.P_DistrictCode + "]").attr('selected', 'selected');
                if (ns.P_Active == 'TRUE') {
                    $("#Active").prop('checked', true);
                }
                $('#DetailModal').modal('show');


                $("#TownName").attr('disabled', true);
                $("#StateCode").attr('disabled', true);
                $("#DistrictCode").attr('disabled', true);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });

    $("#btnSave").click(function () {
        debugger;
        var Validate = true;
        var TownMaster = [];
        var TownCode = $("#HDTownCode").val().trim();
        var TownName = $("#TownName").val().trim();
        var StateCode = $("#StateCode").val().trim();
        var DistrictCode = $("#DistrictCode").val().trim();


        TownName == "" ? $("#TownName").addClass('error') : $("#TownName").removeClass('error');
        StateCode == "" ? $("#StateCode").addClass('error') : $("#StateCode").removeClass('error');
        DistrictCode == "" ? $("#DistrictCode").addClass('error') : $("#DistrictCode").removeClass('error');



        if (TownName == "" || StateCode == "" || DistrictCode == "") {
            Validate = false;
        }
        if ($("#HDTownCode").val() == 0 || TownName != OldValue) {
            $.ajax({
                type: "POST",
                url: "DealerMaster.aspx/CheckDuplicate",
                data: JSON.stringify({ 'TblName': 'townmaster', 'ColumnName': 'TownName', 'Value': TownName }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,

                success: function (data) {
                    console.log(data);
                    if (data.d != "0") {
                        Validate = false;
                        $.alert("" + TownName + " Town Name Already Exist!");
                    }
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });
        }


        if (Validate) {
            $body.addClass("loading");
            var ACTIVE = 'FALSE';
            if ($("#Active").prop("checked") == true) {
                ACTIVE = 'TRUE';
            }
            TownMaster.push({
                P_TownCode: $("#HDTownCode").val(),

                P_TownName: TownName,
                P_StateCode: StateCode,
                P_DistrictCode: DistrictCode,
                P_Active: ACTIVE
            })
            $.ajax({
                type: "POST",
                url: "TownMaster.aspx/SaveTownDetails",
                data: JSON.stringify({ 'oTownBll': TownMaster }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        if (data.d == "Town Details Saved Sucessfully") {
                            $.alert("Town Saved/Updated Sucessfully!");
                            var TotalClientCnt = GetClientCnt();
                            SetPages(TotalClientCnt, 15, 7);
                            GetAllClients(0, 15);

                            $('#DetailModal').modal('hide');
                        }
                        else {
                            alert(data.d)
                        }

                    }
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });
        }
    });



    $("#clkAdd").click(function () {
        ClearAll();
        $("#HDTownCode").val('0');
        $("#DetailModal").modal('show');
        $("#btnSave").show();


        $("#Active").prop('checked', true);
        $("#Active").attr('disabled', true);


    });

    $("#GenExcel").click(function () {
        var PPtblLength = $("#TownMasterTbl").find("tr").length;
        if (PPtblLength > 1) {
            $("#TownMasterTbl").table2excel({
                name: "Table2Excel",
                filename: "TownMaster"
            });
        }
    });



    function ClearAll() {
        $("#TownName").removeClass('error');

        $("#StateCode").removeClass('error');
        $("#DistrictCode").removeClass('error');
        $("#Active").attr('disabled', false);
        $("#TownName").attr('disabled', false);

        $("#StateCode").attr('disabled', false);
        $("#DistrictCode").attr('disabled', false);
        $("#TownName").val('');
        $("#StateCode").val('');
        $("#DistrictCode").val('');


        $("#Active").prop('checked', false);

    };
});