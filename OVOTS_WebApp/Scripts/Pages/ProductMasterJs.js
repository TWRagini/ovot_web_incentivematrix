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
            url: "ProductMaster.aspx/GetProductCnt",
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
        url: "ProductMaster.aspx/GetDealerDll",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            console.log(r);
            var ReasonDD = $("[id*=DealerCode]");
            $.each(r.d, function () {
                ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
        }

    });

    $.ajax({
        type: "POST",
        url: "DealerMaster.aspx/GetDistributerDll",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            console.log(r);
            var ReasonDD = $("[id*=DistributerCode]");
            $.each(r.d, function () {
                ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
        }

    });
    
    $.ajax({
        type: "POST",
        url: "ProductMaster.aspx/GetModelDll",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (g) {
            console.log(g);
            var ReasonDD = $("#Model");
            $.each(g.d, function () {
                ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
        }

    });

    $("#Model").change(function () {
        var Model = $("#Model").val();
        debugger;
        $.ajax({
            type: "POST",
            url: "ModelMaster.aspx/GetModelDetails",
            data: JSON.stringify({ 'P_ModelCode': Model }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var del = $.parseJSON(data.d);
                var ns = del.ModelDetails;
               
                $("#IncentiveAmt").val(ns.P_IncentiveAmt);
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }

        });

    });


    $('body').on('click', '#nav li', function () {
        $("#DistributerMasterTbl").find("tr:gt(0)").remove();
        var val = $(this).find('a').text();
        var End = parseInt(val) * parseInt(15);
        var Start = (parseInt(End) - parseInt(15));
        GetAllClients(Start, 15);
    });

    function GetAllClients(StartIndex, EndIndex) {
        debugger;
        $("#DistributerMasterTbl").find("tr:gt(0)").remove();
        $body.addClass("loading");
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $("#ContentPlaceHolder1_hdFilterValue").val(FilterValue);
        $("#ContentPlaceHolder1_hdFilterType").val(FilterType);
        $.ajax({
            type: "POST",
            url: "ProductMaster.aspx/GetProductList",
            data: JSON.stringify({ 'ddlFilterType': FilterType, 'FilterValue': FilterValue, 'startindex': StartIndex, 'EndIndex': EndIndex }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
               
                var PT = data.d;
                if (PT.length > 0) {
                   
                    $("#nav").show();
                    for (var i = 0; i < PT.length; i++) {
                        $("#DistributerMasterTbl").append("<tr><td>"
                            + ('<a class="clkEdit pointerOnAnchor" id="clkEdit" style=""><span style="color:green">Edit</span></a> | <a class="clkView pointerOnAnchor" id="clkView" style=""><span style="color:orange">View</span></a>') + "</td><td>"
                            + PT[i].P_ProductCode + "</td><td >"
                            + PT[i].P_ProductCat + "</td><td>"
                            + PT[i].P_SubCat + "</td><td>"
                            + PT[i].P_Model + "</td><td>"
                            + PT[i].P_SerialNo + "</td><td>"
                            + PT[i].P_State + "</td><td >"
                            + PT[i].P_District + "</td><td >"
                            + PT[i].P_Town + "</td><td >"
                            + PT[i].P_DealerName + "</td><td >"
                            + PT[i].P_DealerNo + "</td><td >"
                            + PT[i].P_DistributerName + "</td><td >"
                            + PT[i].P_DistributerMobile + "</td><td >"
                            + PT[i].P_IncentiveAmt + "</td></tr >");
                           
                    }
                   
                } else {
                    $("#nav").hide();
                    $("#DistributerMasterTbl").append("<tr style='color:red;'><td colspan='14' style='text-align:center'>No Record Found</td></tr>");
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

        $("#DistributerMasterTbl tr:not(:first-child)").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $(document).on("click", ".clkEdit", function () {
        $("#btnSave").show();
        ClearAll();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var P_ProductCode = $("#DistributerMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        $.ajax({
            type: "POST",
            url: "ProductMaster.aspx/GetProductDetails",
            data: JSON.stringify({ 'P_ProductCode': P_ProductCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                debugger;
                var del = $.parseJSON(data.d);
                var ns = del.ProductDetails;
                $("#HdProductCode").val(ns.P_ProductCode);

                OldValue = ns.P_SerialNo;
                $("#ProductCat").val(ns.P_ProductCat);
                $("#SubCat").val(ns.P_SubCat);
                $("#SerialNo").val(ns.P_SerialNo);
                $("#Model").val(ns.P_Model);
                $("#DealerCode").val(ns.P_DealerCode);
                $("#IncentiveAmt").val(ns.P_IncentiveAmt);
                $("#DistributerCode").val(ns.P_DistributerName);
              

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
        var P_ProductCode = $("#DistributerMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        $.ajax({
            type: "POST",
            url: "ProductMaster.aspx/GetProductDetails",
            data: JSON.stringify({ 'P_ProductCode': P_ProductCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                var del = $.parseJSON(data.d);
                var ns = del.ProductDetails;
                
                $("#ProductCat").val(ns.P_ProductCat);
                $("#SubCat").val(ns.P_SubCat);
                $("#SerialNo").val(ns.P_SerialNo);
                $("#Model").val(ns.P_Model);
                $("#DealerCode").val(ns.P_DealerCode);
                $("#IncentiveAmt").val(ns.P_IncentiveAmt);
                $("#DistributerCode").val(ns.P_DistributerName);
               
                if (ns.P_Active == 'TRUE') {
                    $("#Active").prop('checked', true);
                }
                $('#DetailModal').modal('show');


                $("#ProductCat").attr('disabled', true);
                $("#SubCat").attr('disabled', true);
                $("#SerialNo").attr('disabled', true);
                $("#Model").attr('disabled', true);
                $("#DealerCode").attr('disabled', true);
                $("#IncentiveAmt").attr('disabled', true);
                $("#DistributerCode").attr('disabled', true);
               

                $("#Active").attr('disabled', true);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });

    $("#btnSave").click(function () {
        debugger;
        var Validate = true;
        var ProductMaster = [];
        var ProductCode = $("#HdProductCode").val();
        var ProductCat = $("#ProductCat").val().trim();
        var SubCat = $("#SubCat").val().trim();
        var SerialNo = $("#SerialNo").val().trim();
        var Model = $("#Model").val().trim();
        var DealerCode = $("#DealerCode").val().trim();
        var IncentiveAmt = $("#IncentiveAmt").val().trim();
        var DistributerCode = $("#DistributerCode").val().trim();
        


        ProductCat == "" ? $("#ProductCat").addClass('error') : $("#ProductCat").removeClass('error');
        SubCat == "" ? $("#SubCat").addClass('error') : $("#SubCat").removeClass('error');
        SerialNo == "" ? $("#SerialNo").addClass('error') : $("#SerialNo").removeClass('error');

        Model == "" ? $("#Model").addClass('error') : $("#Model").removeClass('error');
        DealerCode == "" ? $("#DealerCode").addClass('error') : $("#DealerCode").removeClass('error');
        IncentiveAmt == "" ? $("#IncentiveAmt").addClass('error') : $("#IncentiveAmt").removeClass('error');

        DistributerCode == "" ? $("#DistributerCode").addClass('error') : $("#DistributerCode").removeClass('error');
       
        if (ProductCat == "" || SubCat == "" || SerialNo == "" || Model == "" || DealerCode == "" || IncentiveAmt == "" || DistributerCode == "") {
            Validate = false;
        }
        if ($("#HdProductCode").val() == 0 || SerialNo != OldValue) {
            $.ajax({
                type: "POST",
                url: "ProductMaster.aspx/CheckDuplicate",
                data: JSON.stringify({ 'TblName': 'productmaster', 'ColumnName': 'SerialNo', 'Value': SerialNo }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
               
                success: function (data) {
                    debugger;
                    console.log(data);
                    if (data.d != "0") {
                        Validate = false;
                        $.alert("" + SerialNo + " Serial No Already Exist!");
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
            ProductMaster.push({
                P_ProductCode: $("#HdProductCode").val(),
                P_ProductCat: ProductCat,
                P_SubCat: SubCat,
                P_SerialNo: SerialNo,
                P_Model: Model,
                P_DealerCode: DealerCode,
                P_IncentiveAmt: IncentiveAmt,
                P_DistributerName: DistributerCode,

                P_Active: ACTIVE
            })
            $.ajax({
                type: "POST",
                url: "ProductMaster.aspx/SaveProductDetails",
                data: JSON.stringify({ 'oDealerBll': ProductMaster }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        $.alert("Product Saved/Updated Sucessfully!");
                        var TotalClientCnt = GetClientCnt();
                        SetPages(TotalClientCnt, 15, 7);
                        GetAllClients(0, 15);

                        $('#DetailModal').modal('hide');

                    }
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });
        }
    });

    //$("#GenExcel").click(function () {
    //    //$body.addClass("loading");       
    //    $("#DistributerMasterTblCopy").find("tr:gt(0)").remove();
    //    var FilterType = $("#ddlFilterType").val().trim();
    //    var FilterValue = $("#FilterValue").val().trim();
    //    $.ajax({
    //        type: "POST",
    //        url: "/Masters/GetClientListForExcel",
    //        data: JSON.stringify({ 'FilterType': FilterType, 'FilterValue': FilterValue }),
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        headers: headers,
    //        success: function (data) {
    //            var ns = JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\""));
    //            console.log(ns);
    //            $.each(ns, function (index, value) {
    //                $("#DistributerMasterTblCopy").append("<tr><td>"
    //                    + value.CLIENT_CODE + "</td><td>"
    //                    + value.CLIENT_NAME + "</td><td>"
    //                    + value.CLIENT_GROUP + "</td><td>"//AP-20210922-Added for Client Group column
    //                    + value.Remark + "</td></tr>");
    //            });
    //            var TblLength = $("#DistributerMasterTblCopy").find("tr").length;
    //            if (TblLength > 1) {
    //                $("#DistributerMasterTblCopy").table2excel({
    //                    name: "Table2Excel",
    //                    filename: "Client_Master_Report"

    //                });
    //            }
    //        },
    //        complete: function () {
    //            $body.removeClass("loading");
    //        }
    //    });

    //});

    $("#clkAdd").click(function () {
        debugger;
        ClearAll();
        $("#HdProductCode").val("0");
        $("#DetailModal").modal('show');
        $("#btnSave").show();


        $("#Active").prop('checked', true);
        $("#Active").attr('disabled', true);


    });

    $("#GenExcel").click(function () {
        var PPtblLength = $("#DistributerMasterTbl").find("tr").length;
        if (PPtblLength > 1) {
            $("#DistributerMasterTbl").table2excel({
                name: "Table2Excel",
                filename: "ProductMaster"
            });
        }
    });

    function ClearAll() {
        
        $("#ProductCat").removeClass('error');
        $("#SubCat").removeClass('error');
        $("#SerialNo").removeClass('error');
        $("#Model").removeClass('error');
        $("#DealerCode").removeClass('error');
        $("#IncentiveAmt").removeClass('error');
        $("#DistributerCode").removeClass('error');
       


        $("#Active").attr('disabled', false);
        $("#ProductCat").attr('disabled', false);
        $("#SubCat").attr('disabled', false);
        $("#SerialNo").attr('disabled', false);
        $("#Model").attr('disabled', false);
        $("#DealerCode").attr('disabled', false);
       
        $("#DistributerCode").attr('disabled', false);
       

        $("#ProductCat").val('');
        $("#SubCat").val('');
        $("#SerialNo").val('');
        $("#Model").val('');
        $("#DealerCode").val('');
        $("#IncentiveAmt").val('');
        $("#DistributerCode").val('');
        

        $("#Active").prop('checked', false);

    };
});