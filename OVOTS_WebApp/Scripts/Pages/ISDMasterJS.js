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
            url: "ISDMaster.aspx/GetISDCnt",
            data: JSON.stringify({ 'ddlFilterType': FilterType, 'FilterValue': FilterValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
           
            success: function (data) {
              
                if (data.d != "") {
                    TotalClientCnt = data.d;
                }
            }
        });
        return TotalClientCnt;
    };

    $.ajax({
        type: "POST",
        url: "GCHMaster.aspx/GetStateDll",
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
            url: "GCHMaster.aspx/GetDistrictDll",
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

    $("#DistrictCode").change(function () {
        var DistrictCode = $("#DistrictCode").val();
        debugger;
        $.ajax({
            type: "POST",
            url: "GCHMaster.aspx/GetTownDll",
            data: JSON.stringify({ 'DistrictCode': DistrictCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (r) {
                console.log(r);
                var ReasonDD = $("[id*=TownCode]");
                $.each(r.d, function () {
                    ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }

        });

    });
    
    $.ajax({
        type: "POST",
        url: "ISDMaster.aspx/GetDealerDll",
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
        $("#ContentPlaceHolder1_hdFilterValue").val(FilterValue);
        $("#ContentPlaceHolder1_hdFilterType").val(FilterType);
        $.ajax({
            type: "POST",
            url: "ISDMaster.aspx/GetISDList",
            data: JSON.stringify({ 'ddlFilterType': FilterType, 'FilterValue': FilterValue, 'StartIndex': StartIndex, 'EndIndex': EndIndex }),
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
                            + PT[i].P_ISDCode + "</td><td>"
                            + PT[i].P_Name + "</td><td>"
                            + PT[i].P_MobileNo + "</td><td>"
                            + PT[i].P_DealerName + "</td><td>"

                            + PT[i].P_State + "</td><td>"
                            + PT[i].P_District + "</td><td>"
                            + PT[i].P_Town + "</td><td>"
                            + PT[i].P_AdharNo + "</td><td>"
                            + PT[i].P_PANNO + "</td><td>"
                            + PT[i].P_BankName + "</td><td>"
                            + PT[i].P_BankACNo + "</td><td>"
                            + PT[i].P_IFSCCode + "</td><td>"
                            
                            + PT[i].P_UPINo + "</td></tr>");
                            //+ PT[i].P_Active + "</td><td>"
                           
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
        var P_ISDCode = $("#DistributerMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        $.ajax({
            type: "POST",
            url: "ISDMaster.aspx/GetISDDetails",
            data: JSON.stringify({ 'P_ISDCode': P_ISDCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                debugger;
                var del = $.parseJSON(data.d);
                var ns = del.DealerDetails;
                //$("#HDISDCode").val(ns.P_ISDCode);
                $("#HDISDCode").val(ns.P_ISDCode);
                $("#DealerCode").val(ns.P_DealerCode);
                $("#Name").val(ns.P_Name);
                $("#MobileNo").val(ns.P_MobileNo);
                $("#StateCode").val(ns.P_State);
                $("#StateCode").change();
                $("#DistrictCode option[value=" + ns.P_District + "]").attr('selected', 'selected');
                $("#DistrictCode").change();
                $("#TownCode option[value=" + ns.P_Town + "]").attr('selected', 'selected');
                $("#AdharNo").val(ns.P_AdharNo);
                $("#PANNO").val(ns.P_PANNO);
                $("#BankName").val(ns.P_BankName);
                $("#BankACNo").val(ns.P_BankACNo);
                $("#UPINo").val(ns.P_UPINo);
                $("#IFSCCode").val(ns.P_IFSCCode);

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
        var P_ISDCode = $("#DistributerMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        $.ajax({
            type: "POST",
            url: "ISDMaster.aspx/GetISDDetails",
            data: JSON.stringify({ 'P_ISDCode': P_ISDCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                var del = $.parseJSON(data.d);
                var ns = del.DealerDetails;
                $("#HDISDCode").val(ns.P_ISDCode);
                $("#DealerCode").val(ns.P_DealerCode);
                $("#Name").val(ns.P_Name);
                $("#MobileNo").val(ns.P_MobileNo);
                $("#StateCode").val(ns.P_State);
                $("#StateCode").change();
                $("#DistrictCode option[value=" + ns.P_District + "]").attr('selected', 'selected');
                $("#DistrictCode").change();
                $("#TownCode option[value=" + ns.P_Town + "]").attr('selected', 'selected');
                $("#AdharNo").val(ns.P_AdharNo);
                $("#PANNO").val(ns.P_PANNO);
                $("#BankName").val(ns.P_BankName);
                $("#BankACNo").val(ns.P_BankACNo);
                $("#UPINo").val(ns.P_UPINo);
                $("#IFSCCode").val(ns.P_IFSCCode);
                
                if (ns.P_Active == 'TRUE') {
                    $("#Active").prop('checked', true);
                }
                $('#DetailModal').modal('show');


                $("#DealerCode").attr('disabled', true);
                $("#Name").attr('disabled', true);
                $("#MobileNo").attr('disabled', true);
                $("#IFSCCode").attr('disabled', true);
                
                $("#StateCode").attr('disabled', true);
                $("#DistrictCode").attr('disabled', true);
                $("#TownCode").attr('disabled', true);
                $("#AdharNo").attr('disabled', true);
                $("#PANNO").attr('disabled', true);
                $("#BankName").attr('disabled', true);
                $("#BankACNo").attr('disabled', true);
                $("#UPINo").attr('disabled', true);
               
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
        var ISDMaster = [];
       
        //var ISDCode = $("#ISDCode").val().trim();
        var DealerCode = $("#DealerCode").val().trim();
        var Name = $("#Name").val().trim();
        var MobileNo = $("#MobileNo").val().trim();
        var State = $("#StateCode").val().trim();
        var District = $("#DistrictCode").val().trim();
        var Town = $("#TownCode").val().trim();
        var AdharNo = $("#AdharNo").val().trim();
        var PANNO = $("#PANNO").val().trim();
        var BankName = $("#BankName").val().trim();
        var BankACNo = $("#BankACNo").val().trim();
        var UPINo = $("#UPINo").val().trim();
        var IFSCCode = $("#IFSCCode").val().trim();
        var Active = $("#Active").val().trim();


       // DealerCode == "" ? $("#DealerCode").addClass('error') : $("#DealerCode").removeClass('error');
        Name == "" ? $("#Name").addClass('error') : $("#Name").removeClass('error');
        MobileNo == "" ? $("#MobileNo").addClass('error') : $("#MobileNo").removeClass('error');

        //State == "" ? $("#State").addClass('error') : $("#State").removeClass('error');
        //District == "" ? $("#District").addClass('error') : $("#District").removeClass('error');
        //Town == "" ? $("#Town").addClass('error') : $("#Town").removeClass('error');

        //BankName == "" ? $("#BankName").addClass('error') : $("#BankName").removeClass('error');
        //BankACNo == "" ? $("#BankACNo").addClass('error') : $("#BankACNo").removeClass('error');
      
        if ( Name == "" || MobileNo == "" ) {
            Validate = false;
        }
        //if ($("#HDCLIENT_CODE").val() == 0 && ClientName != OldValue) {
        //    $.ajax({
        //        type: "POST",
        //        url: "/Masters/CheckDuplicate",
        //        data: JSON.stringify({ 'TblName': 'DistributerMasterTbl', 'ColumnName': 'CLIENT_NAME', 'Value': ClientName }),
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        async: false,
        //        headers: headers,
        //        success: function (data) {
        //            console.log(data);
        //            if (data != "0") {
        //                Validate = false;
        //                $.alert("" + ClientName + " Client Already Exist!");
        //            }
        //        },
        //        complete: function () {
        //            $body.removeClass("loading");
        //        }
        //    });
        //}


        if (Validate) {
            $body.addClass("loading");
            var ACTIVE = 'FALSE';
            if ($("#Active").prop("checked") == true) {
                ACTIVE = 'TRUE';
            }
            ISDMaster.push({
                P_ISDCode: $("#HDISDCode").val(),
              
                P_DealerCode: DealerCode,
                P_Name: Name,
                P_MobileNo: MobileNo,
                P_State: State,
                P_District: District,
                P_Town: Town,
                P_AdharNo: AdharNo,
                P_PANNO: PANNO,
                P_BankName: BankName,
                P_BankACNo: BankACNo,
                P_UPINo: UPINo,
                P_IFSCCode: IFSCCode,
                P_Active: ACTIVE,
            })
            $.ajax({
                type: "POST",
                url: "ISDMaster.aspx/SaveISDDetails",
                data: JSON.stringify({ 'oDealerBll': ISDMaster }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        if (data.d == "ISD Details Saved Sucessfully") {
                            $.alert("ISD Saved/Updated Sucessfully!");
                            var TotalClientCnt = GetClientCnt();
                            SetPages(TotalClientCnt, 15, 7);
                            GetAllClients(0, 15);

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

    //$("#DealerCode").change(function () {
    //    var DealerCode = $("#DealerCode").val();
    //    $.ajax({
    //        type: "POST",
    //        url: "DealerMaster.aspx/GetDealerDetails",
    //        data: JSON.stringify({ 'P_DealerCode': DealerCode }),
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",

    //        success: function (data) {
    //            var del = $.parseJSON(data.d);
    //            var ns = del.DealerDetails;
               
    //            $("#StateCode").val(ns.P_State);
    //            $("#DistrictCode").val(ns.P_District);
    //            $("#TownCode").val(ns.P_Town);
               
    //        },
    //        error: function (XMLHttpRequest, textStatus, errorThrown) {
    //            alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
    //        }
    //    });
    //});
    

    $("#clkAdd").click(function () {
        ClearAll();
        $("#HDISDCode").val('0');
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
                filename: "ISDMaster"
            });
        }
    });

    function Error() {
        alert("call");
        $.alert("call");
    }

    function SuccessSave() {
        $.alert("ISD Data Uploaded Successfuly...");
    }

    function ClearAll() {
        $("#ISDCode").removeClass('error');
        $("#DealerCode").removeClass('error');
        $("#Name").removeClass('error');
        $("#MobileNo").removeClass('error');
        $("#StateCode").removeClass('error');
        $("#DistrictCode").removeClass('error');
        $("#TownCode").removeClass('error');
        $("#AdharNo").removeClass('error');
        $("#PANNO").removeClass('error');
        $("#BankName").removeClass('error');
        $("#BankACNo").removeClass('error');
        $("#UPINo").removeClass('error');
        $("#Active").removeClass('error');
        $("#IFSCCode").attr('disabled', false);
        
        
        $("#ISDCode").attr('disabled', false);
        $("#DealerCode").attr('disabled', false);
        $("#Name").attr('disabled', false);
        $("#MobileNo").attr('disabled', false);
        $("#StateCode").attr('disabled', false);
        $("#DistrictCode").attr('disabled', false);
        $("#TownCode").attr('disabled', false);
        $("#AdharNo").attr('disabled', false);
        $("#PANNO").attr('disabled', false);
        $("#BankName").attr('disabled', false);
        $("#BankACNo").attr('disabled', false);
        $("#UPINo").attr('disabled', false);
        $("#Active").attr('disabled', false);


        $("#IFSCCode").val('');
        $("#DealerCode").val('');
        $("#Name").val('');
        $("#MobileNo").val('');
        $("#StateCode").val('');
        $("#DistrictCode").val('');
        $("#TownCode").val('');
        $("#AdharNo").val('');
        $("#PANNO").val('');
        $("#BankName").val('');
        $("#BankACNo").val('');
        $("#UPINo").val('');
        

        $("#Active").prop('checked', false);

    };
});