$(document).ready(function () {
    $body = $("body");
    var form = $('#AntiForgeryForm');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    var headers = {};
    headers['__RequestVerificationToken'] = token;
    $.ajax({
        type: "POST",
        url: "/Masters/GetStatesDropdwon",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: headers,
        success: function (r) {
            console.log(r);
            var NodeType = $("[id*=ddlState]");
            $.each(r, function () {
                NodeType.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        }
    });


    var TotalCityCnt = GetCityCnt();
    SetPages(TotalCityCnt, 15, 7); 
    GetAllCitys(0, 15);
    var OldValue = '';
    function GetCityCnt() {
        var TotalCityCnt = 0;
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "/Masters/GetCityCnt",
            data: JSON.stringify({ 'FilterType': FilterType, 'FilterValue': FilterValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            headers: headers,
            success: function (data) {
                console.log(data);
                if (data != "") {
                    TotalCityCnt = data;
                }
            }
        });
        return TotalCityCnt;
    };

    $('body').on('click', '#nav li', function () {
        $("#CityMasterTbl").find("tr:gt(0)").remove();
        var val = $(this).find('a').text();
        var End = parseInt(val) * parseInt(15);
        var Start = (parseInt(End) - parseInt(15));
        GetAllCitys(Start, 15);
    });

    function GetAllCitys(StartIndex, EndIndex) {
        $("#CityMasterTbl").find("tr:gt(0)").remove();

        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "/Masters/GetCityList",
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
                        $("#CityMasterTbl").append("<tr><td>"
                            + PT[i].CITY_CODE + "</td><td>"
                            + PT[i].STATE_NAME + "</td><td style='word-break: break-all !important'>"
                            + PT[i].CITY_NAME + "</td><td style='word-break: break-all !important'>"
                            + PT[i].Remark + "</td><td>"
                            + ('<a class="clkEdit pointerOnAnchor" id="clkEdit" style=""><span style="color:green">Edit</span></a> | <a class="clkView pointerOnAnchor" id="clkView" style=""><span style="color:orange">View</span></a>') + "</td></tr>");
                    }
                } else {
                    $("#nav").hide();
                    $("#CityMasterTbl").append("<tr style='color:red;'><td colspan='7' style='text-align:center'>No Record Found</td></tr>");
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
            GetAllCitys(Start, 15);
            return showPage(currentPage + 1);
        });

        $("#previous-page").on("click", function () {
            var End = parseInt(currentPage - 1) * parseInt(15);
            var Start = (parseInt(End) - parseInt(15));
            GetAllCitys(Start, 15);
            return showPage(currentPage - 1);
        });
        $(".pagination").append("</ul>");
    };

    $("#clkSearch").click(function () {
        var TotalCityCnt = GetCityCnt();
        SetPages(TotalCityCnt, 15, 7);
        GetAllCitys(0, 15);
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
        var CityCode = $("#CityMasterTbl").find("tr").eq(TblIndex).find("td").eq(0).text();
        $.ajax({
            type: "POST",
            url: "/Masters/GetCityDetails",
            data: JSON.stringify({ 'CityCode': CityCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                var ns = data;
                console.log(data);
                $("#HDCITY_CODE").val(ns.CITY_CODE);
                OldValue = ns.CITY_NAME;
                $("#ddlState").val(ns.STATE_CODE);
                $("#CITY_NAME").val(ns.CITY_NAME);
                $("#Remark").val(ns.Remark);
                if (ns.ACTIVE == true) {
                    $("#Active").prop('checked', true);
                }

                $('#DetailModal').modal('show');

                $("#CITY_NAME").attr('disabled', false);
                $("#ddlState").attr('disabled', false);
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
        var CityCode = $("#CityMasterTbl").find("tr").eq(TblIndex).find("td").eq(0).text();
        $.ajax({
            type: "POST",
            url: "/Masters/GetCityDetails",
            data: JSON.stringify({ 'CityCode': CityCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                var ns = data;
                console.log(data);
                $("#HDCITY_CODE").val(ns.CITY_CODE);
                $("#ddlState").val(ns.STATE_CODE);
                $("#CITY_NAME").val(ns.CITY_NAME);
                $("#Remark").val(ns.Remark);
                if (ns.ACTIVE == true) {
                    $("#Active").prop('checked', true);
                }
                $('#DetailModal').modal('show');

                $("#CITY_NAME").attr('disabled', true);
                $("#ddlState").attr('disabled', true);
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
        var CityMaster = [];
        var CityName = $("#CITY_NAME").val().trim();
        var StateCode = $("#ddlState").val();       
        CityName == "" ? $("#CITY_NAME").addClass('error') : $("#CITY_NAME").removeClass('error');
        StateCode == "" ? $("#ddlState").addClass('error') : $("#ddlState").removeClass('error');
        // || StateCode==""
        if (CityName == "" || StateCode == "") {
            Validate = false;
        }
        if ($("#HDCITY_CODE").val() == 0 || CityName != OldValue) {
            $.ajax({
                type: "POST",
                url: "/Masters/CheckDuplicate",
                data: JSON.stringify({ 'TblName': 'CityMasterTbl', 'ColumnName': 'CITY_NAME', 'Value': CityName }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                headers: headers,
                success: function (data) {
                    console.log(data);
                    if (data != "0") {
                        Validate = false;
                        $.alert("" + CityName + " City Already Exist!");
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
            CityMaster.push({
                CITY_CODE: $("#HDCITY_CODE").val(),
                STATE_CODE: StateCode,
                CITY_NAME: CityName,
                Remark: $("#Remark").val().trim(),
                ACTIVE: ACTIVE
            })
            $.ajax({
                type: "POST",
                url: "/Masters/SaveUpdateCity",
                data: JSON.stringify({ 'master': CityMaster }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: headers,
                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        $.alert("City Saved/Updated Sucessfully!");
                        var TotalCityCnt = GetCityCnt();
                        SetPages(TotalCityCnt, 15, 7);
                        GetAllCitys(0, 15);

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
        $("#CityMasterTblCopy").find("tr:gt(0)").remove();
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "/Masters/GetCityListForExcel",
            data: JSON.stringify({ 'FilterType': FilterType, 'FilterValue': FilterValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                var ns = JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\""));
                console.log(ns);
                $.each(ns, function (index, value) {
                    $("#CityMasterTblCopy").append("<tr><td>"
                        + value.CITY_CODE + "</td><td>"
                        + value.STATE_NAME + "</td><td>"
                        + value.CITY_NAME + "</td><td>"
                        + value.Remark + "</td></tr>");
                });
                var TblLength = $("#CityMasterTblCopy").find("tr").length;
                if (TblLength > 1) {
                    $("#CityMasterTblCopy").table2excel({
                        name: "Table2Excel",
                        filename: "City_Master_Report"

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
        $("#HDCITY_CODE").val('0');
        $("#DetailModal").modal('show');
        $("#btnSave").show();

        $("#Remark").attr('disabled', false);
        $("#Active").prop('checked', true);
        $("#Active").attr('disabled', true);
        $("#CITY_NAME").attr('disabled', false);
        $("#ddlState").attr('disabled', false);
       
    });

    function ClearAll() {
        $("#CITY_NAME").removeClass('error');
        $("#ddlState").removeClass('error');
        $("#Active").prop('checked', false);

        $("#ddlState").val('');
        $("#CITY_NAME").val('');
        $("#Remark").val('');
    };
});