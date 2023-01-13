$(document).ready(function () {
    $body = $("body");
    //var form = $('#AntiForgeryForm');
    //var token = $('input[name="__RequestVerificationToken"]', form).val();
    //var headers = {};
    //headers['__RequestVerificationToken'] = token;
    $("#ActiveTill").datepicker({ dateFormat: 'dd/mm/yy' });
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
            url: "CatalogueOffer.aspx/GetCatalogueCnt",
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
        url: "CatalogueOffer.aspx/GetProductCategoryDll",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            console.log(r);
            var ReasonDD = $("[id*=Category]");
            $.each(r.d, function () {
                ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
            $('#SubCategory option:not(:first)').remove();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
        }

    });

    $("#Category").change(function () {
        var Category = $("#Category").val();
        FillSubCat(Category,"");
    });

    $("#SubCategory").change(function () {
        var SubCategory = $("#SubCategory").val();
        FillModel(SubCategory,"");
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
            url: "CatalogueOffer.aspx/GetCatalogueList",
            data: JSON.stringify({ 'ddlFilterType': FilterType, 'FilterValue': FilterValue, 'startindex': StartIndex, 'EndIndex': EndIndex }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                console.log(data);
                var PT = data.d;
                if (PT.length > 0) {

                    $("#nav").show();
                    for (var i = 0; i < PT.length; i++) {
                        $("#DistributerMasterTbl").append("<tr><td class='noExl'>"
                            + ('<a class="clkEdit pointerOnAnchor" id="clkEdit" style=""><span style="color:green">Edit</span></a> | <a class="clkView pointerOnAnchor" id="clkView" style=""><span style="color:orange">View</span></a>') + "</td><td>"
                            + PT[i].P_ManualCode + "</td><td>"
                            + PT[i].P_Category + "</td><td>"
                            + PT[i].P_SubCategory + "</td><td>"
                            + PT[i].P_Model + "</td><td>"
                            + PT[i].P_ShortName + "</td><td>"
                            + PT[i].P_ContentType + "</td><td class='noExl'> "
                            + "<a  class='clkFile' href='" + PT[i].P_iconFilePath + "' target='_blank' >View</a></td><td class='noExl'> "
                            + "<a  class='clkFile' href='" + PT[i].P_FilePath + "' target='_blank' >View</a></td><td>"
                            + PT[i].P_ActiveTill + "</td></tr>");
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

    //$('#ModelContent input:text').blur(function () {
    //    if ($(this).val() == '') {
    //        $(this).addClass('error');
    //    } else {
    //        $(this).removeClass('error');
    //    }
    //});

    $("#Search").on("keyup", function () {

        var value = $(this).val().toLowerCase();

        $("#DistributerMasterTbl tr:not(:first-child)").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $(document).on("click", ".clkEdit", function () {
        $body.addClass("loading");
        $("#btnSave").show();
        ClearAll();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var P_CatalogueCode = $("#DistributerMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
      
        $.ajax({
            type: "POST",
            url: "CatalogueOffer.aspx/GetCatalogueDetails",
            data: JSON.stringify({ 'P_CatalogueCode': P_CatalogueCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,

            success: function (data) {
                debugger;
                var del = $.parseJSON(data.d);
                var ns = del.DealerDetails;
                $("#HDCatalogueCode").val(ns.P_ManualCode);
                $("#Category").val(ns.P_Category);
                FillSubCat(ns.P_Category, ns.P_SubCategory);
                $("#SubCategory").val(ns.P_SubCategory);
                FillModel(ns.P_SubCategory, ns.P_Model);
                $("#ModelP").val(ns.P_Model);
                $("#ContentType").val(ns.P_ContentType);
                $("#ShortName").val(ns.P_ShortName);
                $("#iconFilePath").attr("src", ns.P_iconFilePath);
                $("#iconFilePath").css("display", "block");
                $("#aFilePath").css("display", "block");
                $("#aFilePath").attr("href", ns.P_FilePath)
                $("#FilePath").attr("src", ns.P_FilePath);
                $("#FilePath").css("display", "block");
                $("#Link").val(ns.P_FilePath);
                $("#ActiveTill").val(ns.P_ActiveTill);
                $("#Remarks").val(ns.P_Remarks);

                if (ns.P_Active == 'TRUE') {
                    $("#Active").prop('checked', true);
                }
                $('#DetailModal').modal('show');

                $("#Category").attr('disabled', false);
                $("#SubCategory").attr('disabled', false);
                $("#ModelP").attr('disabled', false);
                $("#ContentType").attr('disabled', false);
                $("#ShortName").attr('disabled', false);
                $("#iconFilePath").attr('disabled', false);
                $("#FilePath").attr('disabled', false);
                $("#Remarks").attr('disabled', false);
                $("#ActiveTill").attr('disabled', false);
                $("#Link").attr('disabled', false);
                $("#Active").attr('disabled', false);
                $body.removeClass("loading");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
                $body.removeClass("loading");
            }
        });
    });

    $(document).on("click", ".clkView", function () {
        ClearAll();
        $("#btnSave").hide();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var P_CatalogueCode = $("#DistributerMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        $body.addClass("loading");
        $.ajax({
            type: "POST",
            url: "CatalogueOffer.aspx/GetCatalogueDetails",
            data: JSON.stringify({ 'P_CatalogueCode': P_CatalogueCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                var del = $.parseJSON(data.d);
                var ns = del.DealerDetails;
                $("#HDCatalogueCode").val(ns.P_ManualCode);
                $("#Category").val(ns.P_Category);
                FillSubCat(ns.P_Category, ns.P_SubCategory);
                $("#SubCategory").val(ns.P_SubCategory);
                FillModel(ns.P_SubCategory, ns.P_Model);
                $("#ModelP").val(ns.P_Model);
                $("#ContentType").val(ns.P_ContentType);
                $("#ShortName").val(ns.P_ShortName);
                $("#iconFilePath").attr("src", ns.P_iconFilePath);
                $("#iconFilePath").css("display", "block");
                $("#aFilePath").css("display", "block");
                $("#aFilePath").attr("href", ns.P_FilePath)
                $("#FilePath").attr("src", ns.P_FilePath);
                $("#FilePath").css("display", "block");
                $("#Link").val(ns.P_FilePath);
                $("#ActiveTill").val(ns.P_ActiveTill);
                $("#Remarks").val(ns.P_Remarks);
                if (ns.P_Active == 'TRUE') {
                    $("#Active").prop('checked', true);
                }
                $('#DetailModal').modal('show');


                $("#Category").attr('disabled', true);
                $("#SubCategory").attr('disabled', true);
                $("#ModelP").attr('disabled', true);
                $("#ContentType").attr('disabled', true);
                $("#ShortName").attr('disabled', true);
                $("#iconFilePath").attr('disabled', true);
                $("#FilePath").attr('disabled', true);
                $("#Remarks").attr('disabled', true);
                $("#ActiveTill").attr('disabled', true);
                $("#Link").attr('disabled', true);
                $("#Active").attr('disabled', true);
                $body.removeClass("loading");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
                $body.removeClass("loading");
            }
        });
    });

    $("#btnSave").click(function () {
        debugger;
        var Validate = true;
        var CatalogueOffer = [];
        var CatalogueCode = $("#HDCatalogueCode").val().trim();
        var ShortName = $("#ShortName").val().trim();
        var Category = $("#Category").val().trim();
        var SubCategory = $("#SubCategory").val().trim();
        var Model = $("#ModelP").val().trim();
        var ContentType = $("#ContentType").val().trim();
        var iconFilePath = $("#iconFilePath").val().trim();
        var FilePath = $("#FilePath").val().trim();
        var FilePathLink = $("#Link").val().trim();
        var Remarks = $("#Remarks").val().trim();
        var ActiveTill = $("#ActiveTill").val().trim();
        var FP_ActiveTill = null;
        if (ActiveTill != "" && ActiveTill != null) {
             FP_ActiveTill = FormateDate(ActiveTill);
        }
        var iconfileUpload = $("#flpiconFilePath").get(0);
        var iconfiles = iconfileUpload.files;
        var fileUpload = $("#flpFilePath").get(0);
        var files = fileUpload.files;

        if (iconfiles.length > 0) {
            if (iconfiles[0].name != "" && iconfiles[0].name != null) {
                iconFilePath = "Images/ProductManual/icon/" + iconfiles[0].name;
            }
        }

        if (files.length > 0) {
            if (files[0].name != "" && files[0].name != null) {
                FilePath = "Images/ProductManual/"  + files[0].name;
            }
        }


        Category == "" ? $("#Category").addClass('error') : $("#Category").removeClass('error');
        SubCategory == "" ? $("#SubCategory").addClass('error') : $("#SubCategory").removeClass('error');
        Model == "" ? $("#ModelP").addClass('error') : $("#ModelP").removeClass('error');
        ContentType == "" ? $("#ContentType").addClass('error') : $("#ContentType").removeClass('error');
        ShortName == "" ? $("#ShortName").addClass('error') : $("#ShortName").removeClass('error');
        Model == "" ? $("#ModelP").addClass('error') : $("#ModelP").removeClass('error');
        iconFilePath == "" ? $("#iconFilePath").addClass('error') : $("#iconFilePath").removeClass('error');
        FilePath == "" ? $("#FilePath").addClass('error') : $("#FilePath").removeClass('error');
        if (FilePath == "") {
            FilePath = FilePathLink;
        }
        if (FilePath == "") {
            FilePath = $("#FilePath").attr('src');
        }
        if (iconFilePath == "") {
            iconFilePath = $("#iconFilePath").attr('src');
        }

        if (Category == "" || ShortName == "" || SubCategory == "" || Model == "" || ContentType == "") {
            Validate = false;
        }

        if (FilePath == "") {
            $.alert("Please select file or give path");
            Validate = false;
        }
        if (iconFilePath == "") {
            $.alert("Please select icon");
            Validate = false;
        }

        if (Validate) {
            $body.addClass("loading");
            var ACTIVE = 'FALSE';
            if ($("#Active").prop("checked") == true) {
                ACTIVE = 'TRUE';
            }
            CatalogueOffer.push({
                P_CatalogueCode: CatalogueCode,
                P_Category: Category,
                P_SubCategory: SubCategory,
                P_Model: Model,
                P_ContentType: ContentType,
                P_ShortName: ShortName,
                P_iconFilePath: iconFilePath,
                P_FilePath: FilePath,
                P_ActiveTill: FP_ActiveTill,
                P_Remarks: Remarks,
                P_Active: ACTIVE
            })
            $.ajax({
                type: "POST",
                url: "CatalogueOffer.aspx/SaveCataloguetDetails",
                data: JSON.stringify({ 'oDealerBll': CatalogueOffer }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                success: function (data) {
                    SaveFile();
                    console.log(data);
                    if (data.d != "") {
                        $.alert("Product Manual Saved/Updated Sucessfully!");
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
        ClearAll();
        $("#HDDealerCode").val('0');
        $("#DetailModal").modal('show');
        $("#btnSave").show();


        $("#Active").prop('checked', true);
        $("#Active").attr('disabled', true);


    });

    function FormateDate(date) {
        var d = new Date(date.split("/").reverse().join("-"));
        var dd = d.getDate();
        var mm = d.getMonth() + 1;
        var yy = d.getFullYear();
        var retu = yy + "-" + mm + "-" + dd;
        return retu;
    };

    $("#GenExcel").click(function () {
        var PPtblLength = $("#DistributerMasterTbl").find("tr").length;
        if (PPtblLength > 1) {
            $("#DistributerMasterTbl").table2excel({
                name: "Table2Excel",
                filename: "ProductManual"
            });
        }
    });

    function SaveFile() {
        debugger;
        var iconfileUpload = $("#flpiconFilePath").get(0);
        var iconfiles = iconfileUpload.files;
        var fileUpload = $("#flpFilePath").get(0);
        var files = fileUpload.files;
        //  $("ContentPlaceHolder1_hdFileName").val(file[0].name);
        var data = new FormData();
        var Category = $("#Category").val();
        // var TransactionID = $("#ContentPlaceHolder1_HDTransactionID").val();
        if (iconfiles.length > 0) {
            for (var i = 0; i < iconfiles.length; i++) {

                data.append(iconfiles[i].name, iconfiles[i]);
            }

            $.ajax({
                url: "FileUpload.ashx?Category=icon",
                type: "POST",
                data: data,
                contentType: false,
                processData: false,
                success: function (result) { /*alert(result);*/ },
                error: function (err) {
                    //alert(err.statusText)
                }
            });
        }

        if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {

                data.append(files[i].name, files[i]);
            }

            $.ajax({
                url: "FileUpload.ashx?Category=file" ,
                type: "POST",
                data: data,
                contentType: false,
                processData: false,
                success: function (result) { /*alert(result);*/ },
                error: function (err) {
                    //alert(err.statusText)
                }
            });
        }


    }

    flpiconFilePath.onchange = evt => {
        const [file] = flpiconFilePath.files
        var ext = $('#flpiconFilePath').val().split('.').pop().toLowerCase();
        if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
            alert('invalid extension!');
            $('#flpiconFilePath').val("");
        }
        else if (file) {
            iconFilePath.src = URL.createObjectURL(file);
            $("#iconFilePath").css("display", "block");
        }
    }

    flpFilePath.onchange = evt => {
        const [file] = flpFilePath.files
        if (file) {
            FilePath.src = URL.createObjectURL(file);
            $("#FilePath").css("display", "block");
        }
    }

    function FillModel(SubCategory, model) {
        $body.addClass("loading");
        $('#ModelP option:not(:first)').remove();
        $.ajax({
            type: "POST",
            url: "CatalogueOffer.aspx/GetModelDll",
            data: JSON.stringify({ 'P_SubCategory': SubCategory }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (r) {
                console.log(r);
                var ReasonDD = $("[id*=ModelP]");
                $.each(r.d, function () {
                    ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
                });
                $("#ModelP").val(model);
                $body.removeClass("loading");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
                $body.removeClass("loading");
            }
        
        });

       
    }

    function FillSubCat(Category, subCat) {
     //   alert("Fill sub cat");
        $body.addClass("loading");
        $('#SubCategory option:not(:first)').remove();
        $.ajax({
            type: "POST",
            url: "CatalogueOffer.aspx/GetProductSubCategoryDll",
            data: JSON.stringify({ 'P_Category': Category }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (r) {
                console.log(r);
                var ReasonDD = $("[id*=SubCategory]");
                $.each(r.d, function () {
                    ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
                });
                $("#SubCategory").val(subCat);
                $body.removeClass("loading");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
                $body.removeClass("loading");
            }

        });

       
    }

    function ClearAll() {
        $("#HDCatalogueCode").val('0');
        $("#Category").val("");
       
        $("#SubCategory").val("");
      
        $("#ModelP").val("");
        $("#ContentType").val("");
        $("#ShortName").val("");
        $("#iconFilePath").attr("src", "");
        $("#flpiconFilePath").val("");
        $("#flpFilePath").val("");
        $("#aFilePath").attr("href", "")
        $("#FilePath").attr("src", "");
        $("#Link").attr("src", "");
        $("#ActiveTill").val("");
        $("#Remarks").val("");
        $("#Link").val("");

        $("#Category").removeClass('error');
        $("#SubCategory").removeClass('error');
        $("#ModelP").removeClass('error');
        $("#ContentType").removeClass('error');
        $("#ShortName").removeClass('error');
        $("#iconFilePath").removeClass('error');
        $("#FilePath").removeClass('error');
        $("#ActiveTill").removeClass('error');
        $("#Remarks").removeClass('error');
        $("#Active").removeClass('error');
        $("#Link").removeClass('error');

        $("#Active").attr('disabled', true);
        $("#Category").attr('disabled', false);
        $("#SubCategory").attr('disabled', false);
        $("#ModelP").attr('disabled', false);
        $("#ContentType").attr('disabled', false);
        $("#ShortName").attr('disabled', false);
        $("#iconFilePath").attr('disabled', false);
        $("#FilePath").attr('disabled', false);
        $("#Remarks").attr('disabled', false);
        $("#ActiveTill").attr('disabled', false);
        $("#Active").prop('checked', false);
        $("#Link").attr('disabled', false);

    };
});