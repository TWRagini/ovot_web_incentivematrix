$(document).ready(function () {
    $body = $("body");
    //var form = $('#AntiForgeryForm');
    //var token = $('input[name="__RequestVerificationToken"]', form).val();
    //var headers = {};
    //headers['__RequestVerificationToken'] = token;
    $("#FromDate").datepicker({ dateFormat: 'dd/mm/yy' });
    $("#ToDate").datepicker({ dateFormat: 'dd/mm/yy' });
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
            url: "CustomerInvoice.aspx/GetInvoiceCnt",
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
        url: "CustomerInvoice.aspx/GetISDDll",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            console.log(r);
            var ReasonDD = $("[id*=ISDCode]");
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
        url: "CustomerInvoice.aspx/GetProductDll",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            console.log(r);
            var ReasonDD = $("[id*=ProductCode]");
            $.each(r.d, function () {
                ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
        }

    });

    $('body').on('click', '#nav li', function () {
        $("#DistributerMasterTbl").find("tr:gt(0)").remove();
        var val = $(this).find('a').text();
        var End = parseInt(val) * parseInt(15);
        var Start = (parseInt(End) - parseInt(15));
        GetAllClients(Start, 15);
    });

    function GetAllClients(StartIndex, EndIndex) {

        $("#DistributerMasterTbl").find("tr:gt(0)").remove();
        $body.addClass("loading");
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "CustomerInvoice.aspx/GetInvoiceList",
            data: JSON.stringify({ 'ddlFilterType': FilterType, 'FilterValue': FilterValue, 'startindex': StartIndex, 'EndIndex': EndIndex }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                console.log(data);
                var PT = data.d;
                if (PT.length > 0) {

                    $("#nav").show();
                    for (var i = 0; i < PT.length; i++) {
                        $("#DistributerMasterTbl").append("<tr><td>"
                            + ('<a class="clkEdit pointerOnAnchor" id="clkEdit" style=""><span style="color:green">Edit</span></a> | <a class="clkView pointerOnAnchor" id="clkView" style=""><span style="color:orange">View</span></a>') + "</td><td>"
                            //+ PT[i].P_UploadCode + "</td><td>"
                            + PT[i].P_InvoiceNo + "</td><td>"
                            + PT[i].P_Customer + "</td><td>"
                            + PT[i].P_MobileNo + "</td><td>"
                            + PT[i].P_ISDName + "</td><td>"
                            + "<a  class='clkFile' href='" + PT[i].P_InvoiceFilePath +"' target='_blank' >View</a></td></tr>");

                    }

                } else {
                    $("#nav").hide();
                    $("#DistributerMasterTbl").append("<tr style='color:red;'><td colspan='7' style='text-align:center'>No Record Found</td></tr>");
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

    $(document).on("click", ".clkFile", function () {

        var href = $(this).attr('href');

        if (href == '') {
            $.alert("No file found");
            return false;
        }
        //else {
        //    $(this).attr("target", "_blank");
        //}
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
        $("#ProductMasterTbl").find("tr:gt(0)").remove();
        $("ProductCode").val("");
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var P_InvoiceNo = $("#DistributerMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        $body.addClass("loading");
        $.ajax({
            type: "POST",
            url: "CustomerInvoice.aspx/GetInvoiceDetails",
            data: JSON.stringify({ 'P_InvoiceNo': P_InvoiceNo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
               
                var ns = data.d;
                //var ns = del.DealerDetails;
                if (ns.length > 0) {
                    for (var i = 0; i < ns.length; i++) {
                        $("#HDInvoiceNo").val(ns[0].P_InvoiceNo);
                        $("#InvoiceNo").val(ns[0].P_InvoiceNo);
                        $("#Customer").val(ns[0].P_Customer);
                        $("#MobileNo").val(ns[0].P_MobileNo);
                        $("#ISDCode").val(ns[0].P_ISDCode);
                        $("#InvoiceFilePath").attr("href", ns[0].P_InvoiceFilePath)
                       
                        OldValue = ns[0].P_InvoiceNo;
                        $("#ProductMasterTbl").append("<tr><td>"
                            + ('<a class="clkDel pointerOnAnchor" id="clkDel" style=""><span style="color:red">Remove</span></a>') + "</td><td style='display:none'>"
                            + ns[i].P_UploadCode + "</td><td style='display:none'>"
                            + ns[i].P_ProductCode + "</td><td>"
                            + ns[i].P_ProductCat + "</td><td>"
                            + ns[i].P_SubCat + "</td><td>"
                            + ns[i].P_ProductSrNo + "</td><td>"
                            + ns[i].P_Model + "</td><td>"
                            + ns[i].P_Dealer + "</td><td>"
                            + ns[i].P_IncentiveAmt + "</td></tr>");
                    }
                }
                else {

                    $("#ProductMasterTbl").append("<tr style='color:red;'><td colspan='7' style='text-align:center'>No Record Found</td></tr>");
                }
                $body.removeClass("loading");
                $('#DetailModal').modal('show');

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $body.removeClass("loading");
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });

    $(document).on("click", ".clkView", function () {
        $("#ProductMasterTbl").find("tr:gt(0)").remove();
        $("ProductCode").val("");
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var P_InvoiceNo = $("#DistributerMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        $body.addClass("loading");
        $.ajax({
            type: "POST",
            url: "CustomerInvoice.aspx/GetInvoiceDetails",
            data: JSON.stringify({ 'P_InvoiceNo': P_InvoiceNo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                var ns = data.d;
                if (ns.length > 0) {
                    for (var i = 0; i < ns.length; i++) {
                        $("#HDInvoiceNo").val(ns[0].P_InvoiceNo);
                        $("#InvoiceNo").val(ns[0].P_InvoiceNo);

                        $("#Customer").val(ns[0].P_Customer);
                        $("#MobileNo").val(ns[0].P_MobileNo);
                        $("#ISDCode").val(ns[0].P_ISDCode);
                        $("#InvoiceFilePath").attr("href", ns[0].P_InvoiceFilePath)

                        $("#ProductMasterTbl").append("<tr><td >"
                            + ('<a class="clkNo pointerOnAnchor" id="clkNo" style=""><span style="color:red">Remove</span></a>') + "</td><td style='display:none'>"

                            + ns[i].P_UploadCode + "</td><td style='display:none'>"
                            + ns[i].P_ProductCode + "</td><td>"
                            + ns[i].P_ProductCat + "</td><td>"
                            + ns[i].P_SubCat + "</td><td>"
                            + ns[i].P_ProductSrNo + "</td><td>"
                            + ns[i].P_Model + "</td><td>"
                            + ns[i].P_Dealer + "</td><td>"
                            + ns[i].P_IncentiveAmt + "</td></tr>");
                    }
                }
                else {

                    $("#ProductMasterTbl").append("<tr style='color:red;'><td colspan='7' style='text-align:center'>No Record Found</td></tr>");
                }
                $body.removeClass("loading");
                $('#DetailModal').modal('show');


                $("#InvoiceNo").attr('disabled', true);
                $("#Customer").attr('disabled', true);
                $("#MobileNo").attr('disabled', true);
                $("#ISDCode").attr('disabled', true);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $body.removeClass("loading");
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });


    $(document).on("click", ".clkDel", function () {
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
       
        var UploadCode = $("#ProductMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        var RemoveRow = $(this);
        if (TblIndex > 1) {
            $.confirm({
                title: 'Delete Product!',
                content: 'Want to Delete the Product!',
                buttons: {
                    confirm: function () {
                        RemoveRow.closest("tr").remove();
                        $.ajax({
                            type: "POST",
                            url: "CustomerInvoice.aspx/DeleteProduct",
                            data: JSON.stringify({ 'UploadCode': UploadCode }),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (data) {

                                $.alert("Product Removed Sucessfully!");

                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {

                                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
                            }

                        });

                    },
                    cancel: function () {
                        // $.alert('Saved Canceled!');
                    }
                }
            });
        }
        else {
            $.alert("Invoice should have minimum 1 Product");
        }
    });

    $("#btnSave").click(function () {

        var Validate = true;
        var CustomerInvoice = [];
        var InvoiceNo = $("#HDInvoiceNo").val().trim();
        var Customer = $("#Customer").val().trim();
        var MobileNo = $("#MobileNo").val().trim();
        var ISDCode = $("#ISDCode").val().trim();
        var InvoiceFilePath = "";
      

        InvoiceNo == "" ? $("#InvoiceNo").addClass('error') : $("#InvoiceNo").removeClass('error');
        Customer == "" ? $("#Customer").addClass('error') : $("#Customer").removeClass('error');
        MobileNo == "" ? $("#MobileNo").addClass('error') : $("#MobileNo").removeClass('error');

        ISDCode == "" ? $("#ISDCode").addClass('error') : $("#ISDCode").removeClass('error');
        


        if (InvoiceNo == "" || Customer == "" || MobileNo == "" || ISDCode == "" ) {
            Validate = false;
        }
        if (InvoiceNo != OldValue) {
            $.ajax({
                type: "POST",
                url: "CustomerInvoice.aspx/CheckDuplicate",
                data: JSON.stringify({ 'TblName': 'CustomerInvoice', 'ColumnName': 'InvoiceNo', 'Value': InvoiceNo }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,

                success: function (data) {
                    console.log(data);
                    if (data.d != "0") {
                        Validate = false;
                        $.alert("" + InvoiceNo + " Invoice No Already Exist!");
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
            
            CustomerInvoice.push({
                P_InvoiceNo : InvoiceNo,

                P_Customer : Customer,
                P_MobileNo : MobileNo,
                P_ISDCode : ISDCode,
                P_InvoiceFilePath : InvoiceFilePath

            })
            $.ajax({
                type: "POST",
                url: "CustomerInvoice.aspx/SaveInvoiceMaster",
                data: JSON.stringify({ 'oDealerBll': CustomerInvoice }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        $.alert("Invoice Saved/Updated Sucessfully!");
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



    $("#clkAdd").click(function () {
        debugger;
        var ProductCode = $("#ProductCode").val();
        var InvoiceNo = $("#InvoiceNo").val().trim();
        var Customer = $("#Customer").val().trim();
        var MobileNo = $("#MobileNo").val().trim();
        var ISDCode = $("#ISDCode").val().trim();
        var InvoiceFilePath = "";
        var InvoiceDetails = [];
        if (ProductCode == "" || ProductCode == null) {
            $.alert("Select Product!");
        }
        else {
            $body.addClass("loading");
            $.ajax({
                type: "POST",
                url: "ProductMaster.aspx/GetProductDetails",
                data: JSON.stringify({ 'P_ProductCode': ProductCode }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    debugger;
                    var del = $.parseJSON(data.d);
                    var Pre = del.ProductDetails;
                    var Duplicates = true;

                    var n = $("#ProductMasterTbl").find("tr").length;
                    for (var i = 1; i < n; i++) {
                        var Product = $("#ProductMasterTbl").find("tr").eq(i).find("td").eq(2).text();
                        if (Pre.P_ProductCode == Product) {
                            Duplicates = false;
                            $.alert("Product Already Added!");
                            $body.removeClass("loading");
                            return false;
                        }
                    }
                    if (Duplicates) {

                        $("#ProductMasterTbl").append("<tr><td>"
                            + ('<a class="clkDel pointerOnAnchor" id="clkDel" style=""><span style="color:green">Remove</span></a>') + "</td><td style='display:none'>"
                            + "0" + "</td><td style='display:none'>"
                            + Pre.P_ProductCode + "</td><td>"
                            + Pre.P_ProductCat + "</td><td>"
                            + Pre.P_SubCat + "</td><td>"
                            + Pre.P_SerialNo + "</td><td>"
                            + Pre.P_Model + "</td><td>"
                            + Pre.P_DealerName + "</td><td>"
                            + Pre.P_IncentiveAmt + "</td></tr>");

                        InvoiceDetails.push({
                            P_UploadCode: '0',

                            P_ProductCode: Pre.P_ProductCode,
                            P_ProductSrNo: Pre.P_SerialNo,
                            P_Model: Pre.P_Model,
                            P_Dealer: Pre.P_DealerName,
                            P_IncentiveAmt: Pre.P_IncentiveAmt,
                            P_InvoiceNo: InvoiceNo,
                            P_Customer: Customer,
                            P_MobileNo: MobileNo,
                            P_ISDCode: ISDCode,
                            P_InvoiceFilePath: InvoiceFilePath
                        })

                        $.ajax({
                            type: "POST",
                            url: "CustomerInvoice.aspx/SaveInvoiceDetails",
                            data: JSON.stringify({ 'oDealerBll': InvoiceDetails }),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (r) {
                                $("ProductCode").val("");
                                $.alert("Product Added Sucessfully");
                                
                            },
                            complete: function () {
                               
                                $body.removeClass("loading");
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                $body.removeClass("loading");
                                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
                            }

                        });
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    debugger;
                    alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
                }

            });
        }
    });

    $("#GenExcel").click(function () {
        var PPtblLength = $("#DistributerMasterTbl").find("tr").length;
        if (PPtblLength > 1) {
            $("#DistributerMasterTbl").table2excel({
                name: "Table2Excel",
                filename: "CustomerInvoice"
            });
        }
    });

   
});