$(document).ready(function () {
    $body = $("body");
    $("#FromDate").datepicker({ dateFormat: 'dd/mm/yy' });
    $("#ToDate").datepicker({ dateFormat: 'dd/mm/yy' });
    var username = $("#HDUserName").val();
    alert(username);
    $("#ConfigBy").val(username);

    var TotalClientCnt = GetClientCnt();
    SetPages(TotalClientCnt, 15, 7);
    GetAllClients(0, 15);
    GetAllProducts();
    ClearAll();
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
        url: "IncentiveConfiguration.aspx/GetModelDll",
        data: JSON.stringify({ 'Level': 'Model' }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            console.log(r);
            var ReasonDD = $("#Model");
            $.each(r.d, function () {
                ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
        }

    });

    $("#ConfigLevel").change(function () {
        var ConfigLevel = $("#ConfigLevel").val();
        debugger;
        $('#EntityCode option:not(:first)').remove();
        $.ajax({
            type: "POST",
            url: "IncentiveConfiguration.aspx/GetEntityDll",
            data: JSON.stringify({ 'Level': ConfigLevel }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (r) {
                console.log(r);
                var ReasonDD = $("[id*=EntityCode]");
                $.each(r.d, function () {
                    ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
                });
                $("#EntityCode").val("");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }

        });

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

    function GetAllClients(StartIndex, EndIndex) {
        debugger;
        $("#ConfigMasterTbl").find("tr:gt(0)").remove();
        $body.addClass("loading");
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $("#ContentPlaceHolder1_hdFilterValue").val(FilterValue);
        $("#ContentPlaceHolder1_hdFilterType").val(FilterType);
        $.ajax({
            type: "POST",
            url: "IncentiveConfiguration.aspx/GetIncentiveConfigList",
            data: JSON.stringify({ 'ddlFilterType': FilterType, 'FilterValue': FilterValue, 'startindex': StartIndex, 'EndIndex': EndIndex }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                console.log(data);
                var PT = data.d;
                if (PT.length > 0) {

                    $("#nav").show();
                    for (var i = 0; i < PT.length; i++) {
                        $("#ConfigMasterTbl").append("<tr><td>"
                            + ('<a class="clkEdit pointerOnAnchor" id="clkEdit" style=""><span style="color:green">Edit</span></a> | <a class="clkView pointerOnAnchor" id="clkView" style=""><span style="color:orange">View</span></a>') + "</td><td>"
                            + PT[i].P_ConfigCode + "</td><td>"
                            + PT[i].P_ConfigName + "</td><td>"
                            + PT[i].P_ConfigBy + "</td><td>"
                            + PT[i].P_ConfigLevel + "</td><td>"
                            + PT[i].P_EntityCode + "</td>");
                    }

                } else {
                    $("#nav").hide();
                    $("#ConfigMasterTbl").append("<tr style='color:red;'><td colspan='7' style='text-align:center'>No Record Found</td></tr>");
                }
                $body.removeClass("loading");
            }
        });
    }

    function GetAllProducts() {
        debugger;
        $("#ProductTbl").find("tr:gt(0)").remove();
        $body.addClass("loading");
        $.ajax({
            type: "POST",
            url: "IncentiveConfiguration.aspx/GetIncentiveConfigDetails",
            data: JSON.stringify({ }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                console.log(data);
                var PT = data.d;
                if (PT.length > 0) {

                    $("#nav").show();
                    for (var i = 0; i < PT.length; i++) {
                        $("#ProductTbl").append("<tr><td>"
                            + PT[i].P_ModelCode + "</td><td>"
                            + PT[i].P_IncentiveAmt + "</td><td>"
                            + PT[i].P_FromDate + "</td><td>"
                            + PT[i].P_ToDate + "</td><td>"
                            + ('<a class="clkDelete pointerOnAnchor" id="clkDelete" style=""><span style="color:Red">Delete</span></a>')
                        );
                    }

                } else {
                    $("#nav").hide();
                    $("#ProductTbl").append("<tr style='color:red;'><td colspan='7' style='text-align:center'>No Record Found</td></tr>");
                }
                $body.removeClass("loading");
            }
        });
    }

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

    //----------------------------------- 02/2023 -----------------------------------//
    $("#btnSave").click(function () {
        debugger;
        var Validate = true;
        var IncentiveConfig = [];
       
        var ConfigCode = $("#HDCLIENT_CODE").val().trim();
        var ConfigName = $("#ConfigName").val().trim();
        var ConfigBy = $("#ConfigBy").val().trim();
        var ConfigLevel = $("#ConfigLevel").val().trim();
        var EntityCode = $("#EntityCode").val().trim();
        var Remarks = $("#Remarks").val().trim();

        var Active = $("#Active").val().trim();


        ConfigName == "" ? $("#ConfigName").addClass('error') : $("#ConfigName").removeClass('error');
        ConfigBy == "" ? $("#ConfigBy").addClass('error') : $("#ConfigBy").removeClass('error');
        ConfigLevel == "" ? $("#ConfigLevel").addClass('error') : $("#ConfigLevel").removeClass('error');
        EntityCode == "" ? $("#EntityCode").addClass('error') : $("#EntityCode").removeClass('error');

        if (ConfigName == "" || ConfigBy == "" || ConfigLevel == "" || EntityCode == "") {
            Validate = false;
        }

        if (Validate) {
            $body.addClass("loading");
            var ACTIVE = 'FALSE';
            if ($("#Active").prop("checked") == true) {
                ACTIVE = 'TRUE';
            }
            IncentiveConfig.push({
                P_ConfigCode: $("#HDCLIENT_CODE").val(),

                P_ConfigCode: ConfigCode,
                P_ConfigName: ConfigName,
                P_ConfigBy: ConfigBy,
                P_ConfigLevel: ConfigLevel,
                P_EntityCode: EntityCode,
                P_Remarks: Remarks,
                P_Active: ACTIVE,
            })
            $.ajax({
                type: "POST",
                url: "IncentiveConfiguration.aspx/SaveConfig",
                data: JSON.stringify({ 'oConfigBll': IncentiveConfig }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        if (data.d == "Incentive Configuration Saved Sucessfully") {
                            $.alert("Incentive Configuration Saved/Updated Sucessfully!");
                            var TotalClientCnt = GetClientCnt();
                            SetPages(TotalClientCnt, 15, 7);
                            GetAllClients(0, 15);
                            ClearProductDetails();
                            $('#DetailModal').modal('hide');
                        }
                        else {
                            alert(data.d);
                        }

                    }
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });
        }
    });

    $("#AddProduct").click(function () {
        debugger;
        var Validate = true;
        var IncentiveConfigDetails = [];

        var ConfigCode = $("#HDCLIENT_CODE").val().trim();
        var ModelCode = $("#Model").val().trim();
        var FromDate = $("#FromDate").val().trim();
        var ToDate = $("#ToDate").val().trim();
        var IncentiveAmt = $("#IncentiveAmt").val().trim();
       
        var Active = $("#Active").val().trim();

        
        ModelCode == "" ? $("#Model").addClass('error') : $("#Model").removeClass('error');
        FromDate == "" ? $("#FromDate").addClass('error') : $("#FromDate").removeClass('error');
        ToDate == "" ? $("#ToDate").addClass('error') : $("#ToDate").removeClass('error');
        IncentiveAmt == "" ? $("#IncentiveAmt").addClass('error') : $("#IncentiveAmt").removeClass('error');
        
        if (ModelCode == "" || FromDate == "" || ToDate == "" || IncentiveAmt == "") {
            Validate = false;
        }

        if (Validate) {
            $body.addClass("loading");
            var ACTIVE = 'FALSE';
            if ($("#Active").prop("checked") == true) {
                ACTIVE = 'TRUE';
            }
            IncentiveConfigDetails.push({
                P_ConfigCode: ConfigCode,

                P_ModelCode: ModelCode,
                P_FromDate: FromDate,
                P_ToDate: ToDate,
                P_IncentiveAmt: IncentiveAmt,
                P_Active: ACTIVE,
            })
            $.ajax({
                type: "POST",
                url: "IncentiveConfiguration.aspx/SaveConfigDetails",
                data: JSON.stringify({ 'oConfigBll': IncentiveConfigDetails }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        if (data.d == "Incentive Product Details Saved Sucessfully") {
                            $.alert("Incentive Product Saved/Updated Sucessfully!");
                            var TotalClientCnt = GetClientCnt();
                            SetPages(TotalClientCnt, 15, 7);
                            GetAllProducts(ConfigCode);
                            ClearProductDetails();
                            //$('#DetailModal').modal('hide');
                        }
                        else {
                            alert(data.d);
                        }

                    }
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });
        }
    });

    $(document).on("click", ".clkDelete", function () {
        
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var P_ModelCode = $("#ProductTbl").find("tr").eq(TblIndex).find("td").eq(0).text();
        
        $.ajax({
            type: "POST",
            url: "IncentiveConfiguration.aspx/DeleteModel",
            data: JSON.stringify({ 'ModelCode': P_ModelCode, 'ConfigCode': '' }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                debugger;
                alert("Model Delete Sucessfully");
                GetAllProducts();

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });

    $(document).on("click", ".clkEdit", function () { // 07-02-2023
        $("#btnSave").show();
        ClearAll();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var P_ConfigCode = $("#ConfigMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        $.ajax({
            type: "POST",
            url: "IncentiveConfiguration.aspx/GetIncentiveConfig",
            data: JSON.stringify({ 'P_ConfigCode': P_ConfigCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                debugger;
                var del = $.parseJSON(data.d);
                var ns = del.IncConfigDetails;

                $("#HDCLIENT_CODE").val(ns.P_ConfigCode);
                $("#ConfigName").val(ns.P_ConfigName);
                $("#ConfigBy").val(ns.P_ConfigBy);
                $("#ConfigLevel").val(ns.P_ConfigLevel);
                $("#EntityCode").val(ns.P_EntityCode);
                $("#Remarks").val(ns.P_Remarks);
                
                if (ns.P_Active == 'TRUE') {
                    $("#Active").prop('checked', true);
                }
                $('#DetailModal').modal('show');

                GetAllProducts();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });
    //---------------------------------------------------------------------------------//


   

    $("#clkAdd").click(function () {
        ClearAll();
        $("#HdConfigCode").val('0');
        $("#DetailModal").modal('show');
        $("#btnSave").show();


        $("#Active").prop('checked', true);
        $("#Active").attr('disabled', true);


    });

    
    function ClearProductDetails() {
        
        $("#Model").val('');
        $("#FromDate").val('');
        $("#ToDate").val('');
        $("#IncentiveAmt").val('');
        

    };


    function ClearAll() {
        ClearProductDetails();

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