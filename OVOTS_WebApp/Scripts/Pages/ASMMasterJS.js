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
            url: "ASMMaster.aspx/GetASMCnt",
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
        url: "ASMMaster.aspx/GetStateDll",
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

    $("#StateCode").change(function () { // New Update 04-jan-2023 Danish
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

    $("#DistrictCode").change(function () { // New Update 04-jan-2023 Danish
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

    $.ajax({
        type: "POST",
        url: "ASMMaster.aspx/GetGCHDll",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            console.log(r);
            var ReasonDD = $("[id*=GCHCode]");
            $.each(r.d, function () {
                ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
        }

    });

   

    $('body').on('click', '#nav li', function () {
        $("#ASMMasterTbl").find("tr:gt(0)").remove();
        var val = $(this).find('a').text();
        var End = parseInt(val) * parseInt(15);
        var Start = (parseInt(End) - parseInt(15));
        GetAllClients(Start, 15);
    });

    function GetAllClients(StartIndex, EndIndex) {

        $("#ASMMasterTbl").find("tr:gt(0)").remove();
        $body.addClass("loading");
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $("#ContentPlaceHolder1_hdFilterValue").val(FilterValue);
        $("#ContentPlaceHolder1_hdFilterType").val(FilterType);
        $.ajax({
            type: "POST",
            url: "ASMMaster.aspx/GetASMList",
            data: JSON.stringify({ 'ddlFilterType': FilterType, 'FilterValue': FilterValue, 'startindex': StartIndex, 'EndIndex': EndIndex }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                console.log(data);
                var PT = data.d;
                if (PT.length > 0) {

                    $("#nav").show();
                    for (var i = 0; i < PT.length; i++) {
                        $("#ASMMasterTbl").append("<tr><td>"
                            + ('<a class="clkEdit pointerOnAnchor" id="clkEdit" style=""><span style="color:green">Edit</span></a> | <a class="clkView pointerOnAnchor" id="clkView" style=""><span style="color:orange">View</span></a>') + "</td><td>"
                            + PT[i].P_ASMCode + "</td><td>"
                            + PT[i].P_ASMName + "</td><td>"
                            + PT[i].P_MobileNo + "</td><td>"
                            + PT[i].P_EmailId + "</td><td>"
                            + PT[i].P_State + "</td><td>"
                            + PT[i].P_District + "</td><td>"
                            + PT[i].P_Town + "</td><td>"
                            + PT[i].P_PinCode + "</td><td>"
                            + PT[i].P_Address + "</td><td>"
                            + PT[i].P_ClusterName + "</td></tr>");
                    }

                } else {
                    $("#nav").hide();
                    $("#ASMMasterTbl").append("<tr style='color:red;'><td colspan='7' style='text-align:center'>No Record Found</td></tr>");
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

        $("#ASMMasterTbl tr:not(:first-child)").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });




    $("#clkAdd").click(function () {
        ClearAll();
        $("#HDASMCode").val('0');
        $("#DetailModal").modal('show');
        $("#btnSave").show();


        $("#Active").prop('checked', true);
        $("#Active").attr('disabled', true);


    });

    $("#GenExcel").click(function () {
        var PPtblLength = $("#ASMMasterTbl").find("tr").length;
        if (PPtblLength > 1) {
            $("#ASMMasterTbl").table2excel({
                name: "Table2Excel",
                filename: "ASMMaster"
            });
        }
    });

    // New Implimentation 04-jan-23

    $("#btnSave").click(function () {
        debugger;
        var Validate = true;
        var AsmMaster = [];


        var ASMCode = $("#HDASMCode").val().trim();
        var Name = $("#ASMName").val().trim();
        var MobileNo = $("#MobileNo").val().trim();
        var EmailId = $("#EmailId").val().trim();
        var State = $("#StateCode").val().trim();
        var District = $("#DistrictCode").val().trim();
        var Town = $("#TownCode").val().trim();
        var GCHCode = $("#GCHCode").val().trim();
        var ClusterName = $("#ClusterName").val().trim();
        var PinCode = $("#PinCode").val().trim();
        var Address = $("#Address").val().trim();

        var Active = $("#Active").val().trim();

        
        Name == "" ? $("#ASMName").addClass('error') : $("#ASMName").removeClass('error');
        MobileNo == "" ? $("#MobileNo").addClass('error') : $("#MobileNo").removeClass('error');
        EmailId == "" ? $("#EmailId").addClass('error') : $("#EmailId").removeClass('error');
        State == "" ? $("#StateCode").addClass('error') : $("#StateCode").removeClass('error');
        District == "" ? $("#DistrictCode").addClass('error') : $("#DistrictCode").removeClass('error');
        Town == "" ? $("#TownCode").addClass('error') : $("#TownCode").removeClass('error');
        GCHCode == "" ? $("#GCHCode").addClass('error') : $("#GCHCode").removeClass('error');
        ClusterName == "" ? $("#ClusterName").addClass('error') : $("#ClusterName").removeClass('error');
        PinCode == "" ? $("#PinCode").addClass('error') : $("#PinCode").removeClass('error');
        Address == "" ? $("#Address").addClass('error') : $("#Address").removeClass('error');


        if (Name == "" || MobileNo == "" || State == "" || District == "" || Town == ""
            || PinCode == "" || Address == "" || ClusterName == "" || GCHCode == "") {
            Validate = false;
        }

        if (Validate) {
            $body.addClass("loading");
            var ACTIVE = 'FALSE';
            if ($("#Active").prop("checked") == true) {
                ACTIVE = 'TRUE';
            }
            AsmMaster.push({
                P_ASMCode: $("#HDASMCode").val(),
                
                P_ASMName: Name,
                P_MobileNo: MobileNo,
                P_EmailId: EmailId,
                P_State: State,
                P_District: District,
                P_Town: Town,
                P_GCHCode: GCHCode,
                P_ClusterName: ClusterName,
                P_PinCode: PinCode,
                P_Address: Address,
                P_Active: ACTIVE,
            })
            $.ajax({
                type: "POST",
                url: "ASMMaster.aspx/SaveASMDetails",
                data: JSON.stringify({ 'oASMBll': AsmMaster }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        if (data.d == "ASM Details Saved Sucessfully") {
                            $.alert("ASM Saved/Updated Sucessfully!");
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
        var P_ASMCode = $("#ASMMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        $.ajax({
            type: "POST",
            url: "ASMMaster.aspx/GetASMDetails",
            data: JSON.stringify({ 'P_ASMCode': P_ASMCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                debugger;
                var del = $.parseJSON(data.d);
                var ns = del.ASMDetails;

                $("#HDASMCode").val(ns.P_ASMCode);
                $("#ASMName").val(ns.P_ASMName);
                $("#MobileNo").val(ns.P_MobileNo);
                $("#EmailId").val(ns.P_EmailId);
                $("#StateCode").val(ns.P_State);
                //$("#StateCode").change();
                //$("#DistrictCode option[value=" + ns.P_District + "]").attr('selected', 'selected');
                //FillDistrict(ns.P_State, ns.P_District)
                $("#DistrictCode").val(ns.P_District);
                $("#DistrictCode").change();
                $("#TownCode option[value=" + ns.P_Town + "]").attr('selected', 'selected');
                $("#PinCode").val(ns.P_PinCode);
                $("#Address").val(ns.P_Address);
                $("#ClusterName").val(ns.P_ClusterName);
                $("#GCHCode").val(ns.P_GCHCode);
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
        $("#btnSave").show();
        ClearAll();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var P_ASMCode = $("#ASMMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        $.ajax({
            type: "POST",
            url: "ASMMaster.aspx/GetASMDetails",
            data: JSON.stringify({ 'P_ASMCode': P_ASMCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                debugger;
                var del = $.parseJSON(data.d);
                var ns = del.ASMDetails;

                $("#HDASMCode").val(ns.P_GCHCode);
                $("#ASMName").val(ns.P_ASMName);
                $("#MobileNo").val(ns.P_MobileNo);
                $("#EmailId").val(ns.P_EmailId);
                $("#StateCode").val(ns.P_State);
                $("#StateCode").change();
                $("#DistrictCode option[value=" + ns.P_District + "]").attr('selected', 'selected');
                //FillDistrict(ns.P_State, ns.P_District)
                $("#DistrictCode").val(ns.P_District);
                $("#DistrictCode").change();
                $("#TownCode option[value=" + ns.P_Town + "]").attr('selected', 'selected');
                //$("#TownCode").val(ns.P_TownCode);
                $("#PinCode").val(ns.P_PinCode);
                $("#Address").val(ns.P_Address);
                $("#ClusterName").val(ns.P_ClusterName);
                $("#GCHCode").val(ns.P_GCHCode);

                if (ns.P_Active == 'TRUE') {
                    $("#Active").prop('checked', true);
                }
                $('#DetailModal').modal('show');

                $("#HDASMCode").attr('disabled', true);
                $("#ASMName").attr('disabled', true);
                $("#MobileNo").attr('disabled', true);
                $("#EmailId").attr('disabled', true);
                $("#StateCode").attr('disabled', true);
                $("#DistrictCode").attr('disabled', true);
                $("#TownCode").attr('disabled', true);
                $("#PinCode").attr('disabled', true);
                $("#Address").attr('disabled', true);
                $("#ClusterName").attr('disabled', true);
                $("#GCHCode").attr('disabled', true);

                $("#Active").attr('disabled', true);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });

    function ClearAll() {
        
       
        $("#ASMName").removeClass('error');
        $("#MobileNo").removeClass('error');
        $("#EmailId").removeClass('error');
        $("#StateCode").removeClass('error');
        $("#DistrictCode").removeClass('error');
        $("#TownCode").removeClass('error');
        $("#PinCode").removeClass('error');
        $("#Address").removeClass('error');
        $("#ClusterName").removeClass('error');
        $("#GCHCode").removeClass('error');

        $("#Active").attr('disabled', false);
        $("#ASMName").attr('disabled', false);
        $("#MobileNo").attr('disabled', false);
        $("#EmailId").attr('disabled', false);
        $("#StateCode").attr('disabled', false);
        $("#DistrictCode").attr('disabled', false);
        $("#TownCode").attr('disabled', false);
        $("#PinCode").attr('disabled', false);
        $("#Address").attr('disabled', false);
        $("#ClusterName").attr('disabled', false);
        $("#GCHCode").attr('disabled', false);

        $("#ASMName").val("");
        $("#MobileNo").val("");
        $("#EmailId").val("");
        $("#StateCode").val("");
        $("#DistrictCode").val("");
        $("#TownCode").val("");
        $("#PinCode").val("");
        $("#Address").val("");
        $("#ClusterName").val("");
        $("#GCHCode").val("");


        $("#Active").prop('checked', false);
    }

    
});