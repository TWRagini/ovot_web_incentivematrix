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
            url: "DealerMaster.aspx/GetDealerList",
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
                            + PT[i].P_DealerCode + "</td><td>"
                            + PT[i].P_DistributerCode + "</td><td>"
                            + PT[i].P_FirmName + "</td><td>"
                            + PT[i].P_MobileNo + "</td><td>"
                            //+ PT[i].P_EmailId + "</td><td >"
                            + PT[i].P_State + "</td><td>"
                            + PT[i].P_District + "</td><td>"
                            + PT[i].P_Town + "</td><td>"
                            + PT[i].P_PinCode + "</td><td>"
                            + PT[i].P_Address + "</td><td>"
                            + PT[i].P_SalesManagerName + "</td><td>"
                            + PT[i].P_SalesManagerMoblle + "</td><td>"
                            + PT[i].P_ClusterName + "</td><td>"
                            + PT[i].P_OwnerName + "</td><td>"
                            + PT[i].P_GSTNo + "</td><td>"
                            + PT[i].P_LatLong + "</td><td>"
                            + PT[i].P_GCHName + "</td></tr>");
                            
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
          
            return true;
        }
        
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

        // Working On 02-Jan-23 Danish Bagwan // 

    function GetClientCnt() {
        var TotalClientCnt = 0;
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "DealerMaster.aspx/GetDealerCnt",
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
        url: "DealerMaster.aspx/GetASMDll",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            console.log(r);
            var ReasonDD = $("[id*=ASMCode]");
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
        url: "DealerMaster.aspx/GetStateDll",
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
          $('#DistrictCode option:not(:first)').remove();
        $.ajax({
            type: "POST",
            url: "DealerMaster.aspx/GetDistrictDll",
            data: JSON.stringify({ 'StateCode': StateCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (r) {
                console.log(r);
                var ReasonDD = $("[id*=DistrictCode]");
                $.each(r.d, function () {
                    ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
                });
                $("#DistrictCode").val("");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }

        });

    });

    //$("#StateCode").change(function () {
    //    var StateCode = $("#StateCode").val();
    //    FillDistrict(StateCode, "");
    //});

    function FillDistrict(StateCode, subCat) {
        //   alert("Fill sub cat");
        $body.addClass("loading");
        $('#DistrictCode option:not(:first)').remove();
        $.ajax({
            type: "POST",
            url: "DealerMaster.aspx/GetDistrictDll",
            data: JSON.stringify({ 'StateCode': StateCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (r) {
                console.log(r);
                var ReasonDD = $("[id*=DistrictCode]");
                $.each(r.d, function () {
                    ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
                });
                $("#DistrictCode").val(subCat);
                $body.removeClass("loading");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
                $body.removeClass("loading");
            }

        });
    }
    
    $("#DistrictCode").change(function () {
        var DistrictCode = $("#DistrictCode").val();
        debugger;
        $('#TownCode option:not(:first)').remove();
        $.ajax({
            type: "POST",
            url: "DealerMaster.aspx/GetTownDll",
            data: JSON.stringify({ 'DistrictCode': DistrictCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (r) {
                console.log(r);
                var ReasonDD = $("[id*=TownCode]");
                $.each(r.d, function () {
                    ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
                });
                $("#TownCode").val("");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }

        });

    });

    

    $("#ASMCode").change(function () {
        var ASMCode = $("#ASMCode").val();
        debugger;
        $('#GCHCode option:not(:first)').remove();
        $.ajax({
            type: "POST",
            url: "DealerMaster.aspx/GetGCHDllASMWise",
            data: JSON.stringify({ 'ASMCode': ASMCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (r) {
                console.log(r);
                var ReasonDD = $("[id*=GCHCode]");
                $.each(r.d, function () {
                    ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
                });
                $("#DistrictCode").val("");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }

        });

    });
    
    $("#btnSave").click(function () {
        debugger;
        var Validate = true;
        var DealerMaster = [];

        
        var DealerCode = $("#HDDealerCode").val().trim();
        var Name = $("#FirmName").val().trim();
        var MobileNo = $("#MobileNo").val().trim();
        var Distributer = $("#DistributerCode").val().trim();
        var State = $("#StateCode").val().trim();
        var District = $("#DistrictCode").val().trim();
        var Town = $("#TownCode").val().trim();
        var PinCode = $("#PinCode").val().trim();
        var Address = $("#Address").val().trim();
        var ASMCode = $("#ASMCode").val().trim();
        var OwnerName = $("#OwnerName").val().trim();
        var ClusterName = $("#ClusterName").val().trim();
        var GSTNo = $("#GSTNo").val().trim();
        var LatLong = $("#LatLong").val().trim();
        var GCHName = $("#GCHCode").val().trim();
        
        var Active = $("#Active").val().trim();


        // DealerCode == "" ? $("#DealerCode").addClass('error') : $("#DealerCode").removeClass('error');
        Name == "" ? $("#Name").addClass('error') : $("#Name").removeClass('error');
        MobileNo == "" ? $("#MobileNo").addClass('error') : $("#MobileNo").removeClass('error');
        Distributer == "" ? $("#DistributerCode").addClass('error') : $("#DistributerCode").removeClass('error');
        State == "" ? $("#StateCode").addClass('error') : $("#StateCode").removeClass('error');
        District == "" ? $("#DistrictCode").addClass('error') : $("#DistrictCode").removeClass('error');
        Town == "" ? $("#TownCode").addClass('error') : $("#TownCode").removeClass('error');
        PinCode == "" ? $("#PinCode").addClass('error') : $("#PinCode").removeClass('error');
        Address == "" ? $("#Address").addClass('error') : $("#Address").removeClass('error');
        ASMCode == "" ? $("#ASMCode").addClass('error') : $("#ASMCode").removeClass('error');
        OwnerName == "" ? $("#OwnerName").addClass('error') : $("#OwnerName").removeClass('error');
        ClusterName == "" ? $("#ClusterName").addClass('error') : $("#ClusterName").removeClass('error');
        GSTNo == "" ? $("#GSTNo").addClass('error') : $("#GSTNo").removeClass('error');
        LatLong == "" ? $("#LatLong").addClass('error') : $("#LatLong").removeClass('error');
        GCHName == "" ? $("#GCHCode").addClass('error') : $("#GCHCode").removeClass('error');
        
        if (Name == "" || MobileNo == "" || Distributer == "" || State == "" || District == ""
            || Town == "" || PinCode == "" || Address == "" || ASMCode == "" || OwnerName == ""
            || ClusterName == "" || GSTNo == "" || LatLong == "" || GCHName == "") {
            Validate = false;
        }
       
        if (Validate) {
            $body.addClass("loading");
            var ACTIVE = 'FALSE';
            if ($("#Active").prop("checked") == true) {
                ACTIVE = 'TRUE';
            }
            DealerMaster.push({
                P_DealerCode: $("#HDDealerCode").val(),

                P_DealerCode: DealerCode,
                P_FirmName: Name,
                P_MobileNo: MobileNo,
                P_DistributerCode: Distributer,
                P_State: State,
                P_District: District,
                P_Town: Town,
                P_PinCode: PinCode,
                P_Address: Address,
                P_ASMCode: ASMCode,
                P_GCHName: GCHName,
                P_ClusterName: ClusterName,
                P_OwnerName: OwnerName,
                P_GSTNo: GSTNo,
                P_LatLong: LatLong,
                P_Active: ACTIVE,
            })
            $.ajax({
                type: "POST",
                url: "DealerMaster.aspx/SaveDealerDetails",
                data: JSON.stringify({ 'oDealerBll': DealerMaster }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        if (data.d == "Dealer Details Saved Sucessfully") {
                            $.alert("Dealer Saved/Updated Sucessfully!");
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


    $(document).on("click", ".clkEdit", function () {
        $("#btnSave").show();
        ClearAll();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var P_DealerCode = $("#DistributerMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        $.ajax({
            type: "POST",
            url: "DealerMaster.aspx/GetDealerDetails",
            data: JSON.stringify({ 'P_DealerCode': P_DealerCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                debugger;
                var del = $.parseJSON(data.d);
                var ns = del.DealerDetails;
                
                $("#HDDealerCode").val(ns.P_DealerCode);
                $("#MobileNo").val(ns.P_MobileNo);
                $("#DistributerCode").val(ns.P_Distributer);
                $("#FirmName").val(ns.P_FirmName);
                
                $("#StateCode").val(ns.P_State);
                //$("#StateCode").change();
                //$("#DistrictCode option[value=" + ns.P_District + "]").attr('selected', 'selected');
                //FillDistrict(ns.P_State, ns.P_District)
                $("#DistrictCode").val(ns.P_District);
                $("#DistrictCode").change();
                $("#TownCode option[value=" + ns.P_Town + "]").attr('selected', 'selected');
                $("#PinCode").val(ns.P_PinCode);
                $("#Address").val(ns.P_Address);
                $("#ASMCode").val(ns.P_SalesManagerName);
                $("#OwnerName").val(ns.P_OwnerName);
                $("#ClusterName").val(ns.P_ClusterName);
                $("#GSTNo").val(ns.P_GSTNo);
                $("#LatLong").val(ns.P_LatLong);
                $("#GCHCode").val(ns.P_GCHName);
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
        var P_DealerCode = $("#DistributerMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        $.ajax({
            type: "POST",
            url: "DealerMaster.aspx/GetDealerDetails",
            data: JSON.stringify({ 'P_DealerCode': P_DealerCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                var del = $.parseJSON(data.d);
                var ns = del.DealerDetails;
                $("#HDDealerCode").val(ns.P_DealerCode);
                $("#MobileNo").val(ns.P_MobileNo);
                $("#DistributerCode").val(ns.P_Distributer);
                $("#FirmName").val(ns.P_FirmName);
                $("#StateCode").val(ns.P_State);
                //$("#StateCode").change();
                //$("#DistrictCode option[value=" + ns.P_District + "]").attr('selected', 'selected');
                //FillDistrict(ns.P_State, ns.P_District)
                $("#DistrictCode").val(ns.P_District);
                $("#DistrictCode").change();
                $("#TownCode option[value=" + ns.P_Town + "]").attr('selected', 'selected');
                $("#PinCode").val(ns.P_PinCode);
                $("#Address").val(ns.P_Address);
                $("#ASMCode").val(ns.P_SalesManagerName);
                $("#OwnerName").val(ns.P_OwnerName);
                $("#ClusterName").val(ns.P_ClusterName);
                $("#GSTNo").val(ns.P_GSTNo);
                $("#LatLong").val(ns.P_LatLong);
                $("#GCHCode").val(ns.P_GCHName);

                if (ns.P_Active == 'TRUE') {
                    $("#Active").prop('checked', true);
                }
                $('#DetailModal').modal('show');


                $("#HDDealerCode").attr('disabled', true);
                $("#DistributerCode").attr('disabled', true);
                $("#FirmName").attr('disabled', true);
                $("#MobileNo").attr('disabled', true);
                $("#StateCode").attr('disabled', true);
                $("#DistrictCode").attr('disabled', true);
                $("#TownCode").attr('disabled', true);
                $("#PinCode").attr('disabled', true);
                $("#Address").attr('disabled', true);
                $("#ASMCode").attr('disabled', true);
                $("#OwnerName").attr('disabled', true);
                $("#ClusterName").attr('disabled', true);
                $("#GSTNo").attr('disabled', true);
                $("#LatLong").attr('disabled', true);
                $("#GCHCode").attr('disabled', true);

                $("#Active").attr('disabled', true);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });
    

    // Working On 02-Jan-23 Danish Bagwan //

    $("#clkAdd").click(function () {
        ClearAll();
        $("#HDDealerCode").val('0');
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
                filename: "DealerMaster"
            });
        }
    });

   

    function ClearAll() {
        $("#CLIENT_NAME").removeClass('error');
        $("#DistributerCode").removeClass('error');
        $("#DistributerMob").removeClass('error');
        $("#FirmName").removeClass('error');
        $("#MobileNo").removeClass('error');
        $("#EmailId").removeClass('error');
        $("#StateCode").removeClass('error');
        $("#DistrictCode").removeClass('error');
        $("#TownCode").removeClass('error');
        $("#PinCode").removeClass('error');
        $("#Address").removeClass('error');
        $("#ASMCode").removeClass('error');
        
        $("#ClusterName").removeClass('error');
        $("#OwnerName").removeClass('error');
        $("#GSTNo").removeClass('error');
        $("#LatLong").removeClass('error');
        $("#GCHName").removeClass('error');
        
        $("#Active").attr('disabled', false);
        $("#CLIENT_NAME").attr('disabled', false);
        $("#DistributerCode").attr('disabled', false);
        $("#DistributerMob").attr('disabled', false);
        $("#FirmName").attr('disabled', false);
        $("#MobileNo").attr('disabled', false);
        $("#EmailId").attr('disabled', false);
        $("#StateCode").attr('disabled', false);
        $("#DistrictCode").attr('disabled', false);
        $("#TownCode").attr('disabled', false);
        $("#PinCode").attr('disabled', false);
        $("#Address").attr('disabled', false);
        $("#ASMCode").attr('disabled', false);
     
        $("#ClusterName").attr('disabled', false);
        $("#OwnerName").attr('disabled', false);
        $("#GSTNo").attr('disabled', false);
        $("#LatLong").attr('disabled', false);
      
        $("#GCHName").attr('disabled', false);
       

        $("#DistributerCode").val("");
        $("#DistributerMob").val("");
        $("#FirmName").val("");
        $("#MobileNo").val("");
        $("#EmailId").val("");
        $("#StateCode").val("");
        $("#DistrictCode").val("");
        $("#TownCode").val("");
        $("#PinCode").val("");
        $("#Address").val("");
        $("#ASMCode").val("");
       
        $("#ClusterName").val("");
        $("#OwnerName").val("");
        $("#GSTNo").val("");
        $("#LatLong").val("");
      
        $("#GCHName").val("");
        

        $("#Active").prop('checked', false);

    };
});