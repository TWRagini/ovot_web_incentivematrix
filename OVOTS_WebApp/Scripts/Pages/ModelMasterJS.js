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
            url: "ModelMaster.aspx/GetModelCnt",
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

    
  

    $('body').on('click', '#nav li', function () {
        $("#ModelMasterTbl").find("tr:gt(0)").remove();
        var val = $(this).find('a').text();
        var End = parseInt(val) * parseInt(15);
        var Start = (parseInt(End) - parseInt(15));
        GetAllClients(Start, 15);
    });

    function GetAllClients(StartIndex, EndIndex) {

        $("#ModelMasterTbl").find("tr:gt(0)").remove();
        $body.addClass("loading");
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $("#ContentPlaceHolder1_hdFilterValue").val(FilterValue);
        $("#ContentPlaceHolder1_hdFilterType").val(FilterType);
        $.ajax({
            type: "POST",
            url: "ModelMaster.aspx/GetModelList",
            data: JSON.stringify({ 'ddlFilterType': FilterType, 'FilterValue': FilterValue, 'startindex': StartIndex, 'EndIndex': EndIndex }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                console.log(data);
                var PT = data.d;
                if (PT.length > 0) {

                    $("#nav").show();
                    for (var i = 0; i < PT.length; i++) {
                        $("#ModelMasterTbl").append("<tr><td>"
                            + ('<a class="clkEdit pointerOnAnchor" id="clkEdit" style=""><span style="color:green">Edit</span></a> | <a class="clkView pointerOnAnchor" id="clkView" style=""><span style="color:orange">View</span></a>') + "</td><td>"
                            + PT[i].P_ModelCode + "</td><td>"
                            + PT[i].P_ModelName + "</td><td>"
                            + PT[i].P_IncentiveAmt + "</td></tr>");
                    }

                } else {
                    $("#nav").hide();
                    $("#ModelMasterTbl").append("<tr style='color:red;'><td colspan='7' style='text-align:center'>No Record Found</td></tr>");
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

        $("#ModelMasterTbl tr:not(:first-child)").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $(document).on("click", ".clkEdit", function () {
        $("#btnSave").show();
        ClearAll();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var P_ModelCode = $("#ModelMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();

        $.ajax({
            type: "POST",
            url: "ModelMaster.aspx/GetModelDetails",
            data: JSON.stringify({ 'P_ModelCode': P_ModelCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                debugger;
                var del = $.parseJSON(data.d);
                var ns = del.ModelDetails;
                $("#HDModelCode").val(ns.P_ModelCode);

               
                $("#ModelName").val(ns.P_ModelName);
                $("#IncentiveAmt").val(ns.P_IncentiveAmt);
                $("#Remarks").val(ns.P_Remarks);

                OldValue = ns.P_ModelName;
               

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
        var P_ModelCode = $("#ModelMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        $.ajax({
            type: "POST",
            url: "ModelMaster.aspx/GetModelDetails",
            data: JSON.stringify({ 'P_ModelCode': P_ModelCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                var del = $.parseJSON(data.d);
                var ns = del.ModelDetails;
                $("#HDModelCode").val(ns.P_ModelCode);


                $("#ModelName").val(ns.P_ModelName);
                $("#IncentiveAmt").val(ns.P_IncentiveAmt);
                $("#Remarks").val(ns.P_Remarks);
                OldValue = ns.P_MobileNo;
                
                if (ns.P_Active == 'TRUE') {
                    $("#Active").prop('checked', true);
                }
                $('#DetailModal').modal('show');



                $("#ModelCode").attr('disabled', true);
                $("#ModelName").attr('disabled', true);
                $("#IncentiveAmt").attr('disabled', true);
                $("#Remarks").attr('disabled', true);



            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });

    $("#btnSave").click(function () {
        debugger;
        var Validate = true;
        var ModelMaster = [];
        var ModelCode = $("#HDModelCode").val().trim();
        var ModelName = $("#ModelName").val().trim();
        var IncentiveAmt = $("#IncentiveAmt").val().trim();
        var Remarks = $("#Remarks").val().trim();



        ModelName == "" ? $("#ModelName").addClass('error') : $("#ModelName").removeClass('error');
        IncentiveAmt == "" ? $("#IncentiveAmt").addClass('error') : $("#IncentiveAmt").removeClass('error');
      



        if (ModelName == "" || IncentiveAmt == "") {
            Validate = false;
        }

        if ($("#HDModelCode").val() == 0 || MobileNo != OldValue) {
            $.ajax({
                type: "POST",
                url: "DealerMaster.aspx/CheckDuplicate",
                data: JSON.stringify({ 'TblName': 'Modelmaster', 'ColumnName': 'ModelName', 'Value': ModelName }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,

                success: function (data) {
                    console.log(data);
                    if (data.d != "0") {
                        Validate = false;
                        $.alert("" + ModelName + " Model Name Already Exist!");
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
            ModelMaster.push({
                P_ModelCode: $("#HDModelCode").val(),

                P_ModelCode: ModelCode,
                P_ModelName: ModelName,
                P_IncentiveAmt: IncentiveAmt,
                P_Remarks: Remarks,
              
                P_Active: ACTIVE
            })
            $.ajax({
                type: "POST",
                url: "ModelMaster.aspx/SaveModelDetails",
                data: JSON.stringify({ 'oModelBll': ModelMaster }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        if (data.d == "Model Details Saved Sucessfully") {
                            $.alert("Model Saved/Updated Sucessfully!");
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
        $("#HDModelCode").val('0');
        $("#DetailModal").modal('show');
        $("#btnSave").show();


        $("#Active").prop('checked', true);
        $("#Active").attr('disabled', true);


    });

    $("#GenExcel").click(function () {
        var PPtblLength = $("#ModelMasterTbl").find("tr").length;
        if (PPtblLength > 1) {
            $("#ModelMasterTbl").table2excel({
                name: "Table2Excel",
                filename: "ModelMaster"
            });
        }
    });



    function ClearAll() {
        $("#ModelName").removeClass('error');
        $("#ModelName").removeClass('error');
        $("#IncentiveAmt").removeClass('error');
       
        $("#Active").attr('disabled', false);
        $("#ModelName").attr('disabled', false);
        $("#IncentiveAmt").attr('disabled', false);
        $("#Remarks").attr('disabled', false);
       
        $("#ModelName").val('');
        $("#IncentiveAmt").val('');
        $("#Remarks").val('');
        
        $("#Active").prop('checked', false);

    };
});