$(document).ready(function () {

    $body = $("body");


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
            url: "UserMaster.aspx/GetUserCnt",
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
        url: "UserMaster.aspx/GetRollDll",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            console.log(r);
            var ReasonDD = $("[id*=UserRole]");
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
            url: "UserMaster.aspx/GetUserList",
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
                            + PT[i].P_UserCode + "</td><td>"
                            + PT[i].P_UserId + "</td><td>"
                            + PT[i].P_UserName + "</td><td>"
                            + PT[i].P_UserType + "</td><td>"

                            + PT[i].P_ContactNumber + "</td><td>"
                            + PT[i].P_UserRole + "</td><td>"
                            + PT[i].P_UserLevel + "</td></tr>");
                       

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
        $("#btnReset").show();
        
        ClearAll();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var P_UserCode = $("#DistributerMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        $.ajax({
            type: "POST",
            url: "UserMaster.aspx/GetUserDetails",
            data: JSON.stringify({ 'P_UserCode': P_UserCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                debugger;
                var del = $.parseJSON(data.d);
                var ns = del.DealerDetails;
                $("#noEdit").hide();
                //$("#HDISDCode").val(ns.P_ISDCode);
                $("#HDUserCode").val(ns.P_UserCode);
                $("#UserName").val(ns.P_UserName);
                $("#UserType").val(ns.P_UserType);
                $("#ContactNumber").val(ns.P_ContactNumber);
                $("#UserRole").val(ns.P_UserRole);
                $("#UserId").val(ns.P_UserId);
                $("#txtEmail").val(ns.P_EmailId);
                $("#UserLevel").val(ns.P_UserLevel);
                $("#ContentPlaceHolder1_HDUserPrevRole").val(ns.P_UserRole);
                $("#UserName").attr('disabled', true);
                $("#UserType").attr('disabled', true);
                $("#ContactNumber").attr('disabled', true);


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
        $("#btnReset").hide();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var P_UserCode = $("#DistributerMasterTbl").find("tr").eq(TblIndex).find("td").eq(1).text();
        $.ajax({
            type: "POST",
            url: "UserMaster.aspx/GetUserDetails",
            data: JSON.stringify({ 'P_UserCode': P_UserCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                var del = $.parseJSON(data.d);
                var ns = del.DealerDetails;
                
                //$("#HDISDCode").val(ns.P_ISDCode);
                $("#HDUserCode").val(ns.P_UserCode);
                $("#UserName").val(ns.P_UserName);
                $("#UserType").val(ns.P_UserType);
                $("#ContactNumber").val(ns.P_ContactNumber);
                $("#UserRole").val(ns.P_UserRole);
                $("#txtEmail").val(ns.P_EmailId);
                $("#UserName").attr('disabled', true);
                $("#UserType").attr('disabled', true);
                $("#ContactNumber").attr('disabled', true);
                $("#txtEmail").attr('disabled', true);
              

                if (ns.P_Active == 'TRUE') {
                    $("#Active").prop('checked', true);
                }
                $('#DetailModal').modal('show');

                $("#UserRole").attr('disabled', true);
               

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
        var UserMaster = [];

        //var ISDCode = $("#ISDCode").val().trim();
        var ContactNumber = $("#ContactNumber").val().trim();
        var UserName = $("#UserName").val().trim();
        var UserRole = $("#UserRole").val().trim();
        var UserType = $("#UserType").val().trim();
        var Remarks = $("#Remarks").val().trim();
        var UserId = $("#UserId").val().trim();
        var EmailId = $("#txtEmail").val().trim();
        var UserLevel = $("#UserLevel").val().trim();
        var Active = $("#Active").val().trim();
        var Type = $("#UserRole option:selected").text();
        var UserPrevRole = $("#ContentPlaceHolder1_HDUserPrevRole").val();
        // DealerCode == "" ? $("#DealerCode").addClass('error') : $("#DealerCode").removeClass('error');
        ContactNumber == "" ? $("#ContactNumber").addClass('error') : $("#ContactNumber").removeClass('error');
        UserName == "" ? $("#UserName").addClass('error') : $("#UserName").removeClass('error');
        UserRole == "" ? $("#UserRole").addClass('error') : $("#UserRole").removeClass('error');
        UserType == "" ? $("#UserType").addClass('error') : $("#UserType").removeClass('error');
       

        if (ContactNumber == "" || UserName == "" || UserRole == "" || UserType == "") {
            Validate = false;
        }
        //if ($("#HDUserCode").val() != "0") {
        //    if (UserPrevRole == "ROL00003" && UserRole == "ROL00004") {

        //    }
        //    else {
        //        if (UserPrevRole != UserRole) {
        //            $.alert("Role can not be changed!");
        //            Validate = false;
        //            $("#UserRole").val(UserRole);
        //        }
        //    }
        //}

        //$.ajax({
        //    type: "POST",
        //    url: "UserMaster.aspx/ValidateUser",
        //    data: JSON.stringify({ 'Number': ContactNumber, 'Type': 'Duplicate', 'UserCode': $("#HDUserCode").val() }),
        //    contentType: "application/json; charset=utf-8",
        //    dataType: "json",

        //    success: function (data) {
        //        console.log(data);
        //        if (data.d != "") {
        //            if (data.d == "Duplicate") {
        //                $.alert("Same Contact number available in User Master!");
        //                $("#ContactNumber").val("");
        //                Validate = false;
        //            }
        //        }
        //    },
        //    complete: function () {
        //        $body.removeClass("loading");
        //    }
        //});

        //$.ajax({
        //    type: "POST",
        //    url: "UserMaster.aspx/ValidateUser",
        //    data: JSON.stringify({ 'Number': ContactNumber, 'Type': Type, 'UserCode': $("#HDUserCode").val() }),
        //    contentType: "application/json; charset=utf-8",
        //    dataType: "json",

        //    success: function (data) {
        //        console.log(data);
        //        if (data.d != "") {
        //            if (data.d == "NoUser") {
        //                $.alert("No details found fourn this contact number in record!");
        //                $("#ContactNumber").val("");
        //                Validate = false;
        //            }
        //            else {
        //                UserId = data.d;
        //                $("#UserId").val(data.d);

        //            }
        //        }
        //    },
        //    complete: function () {
        //        $body.removeClass("loading");
        //    }
        //});
        debugger;
        if (Validate) {
            $body.addClass("loading");
            var ACTIVE = 'FALSE';
            if ($("#Active").prop("checked") == true) {
                ACTIVE = 'TRUE';
            }
            UserMaster.push({
                P_UserCode: $("#HDUserCode").val(),
                P_UserId: UserId,
                P_EmailId: EmailId,
                P_UserName: UserName,
                P_UserType: UserType,
                P_PassWord: ContactNumber,
                P_ConfirmPassword: ContactNumber,
                P_ContactNumber: ContactNumber,
                P_UserRole: UserRole,
                P_IMEI: "",
                P_Remarks: Remarks,
                P_UserLevel: UserLevel,
                P_Active: ACTIVE,
                P_UserPrevRole: UserPrevRole
            })
            $.ajax({
                type: "POST",
                url: "UserMaster.aspx/SaveUserDetails",
                data: JSON.stringify({ 'oDealerBll': UserMaster }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        $.alert(data.d);
                        if (data.d == "User Saved / Updated Sucessfully!") {
                            var TotalClientCnt = GetClientCnt();
                            SetPages(TotalClientCnt, 15, 7);
                            GetAllClients(0, 15);
                            SaveUserDetails
                            $('#DetailModal').modal('hide');
                            $body.removeClass("loading");
                        }
                        else {
                            $body.removeClass("loading");
                        }

                    }
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });
        }
        else {
            return false;
        }
    });

    $("#btnReset").click(function () {
        debugger;
        var Validate = true;
        var UserMaster = [];

        //var ISDCode = $("#ISDCode").val().trim();
        var ContactNumber = $("#ContactNumber").val().trim();
        var UserName = $("#UserName").val().trim();
       
       
        var UserLevel = $("#UserLevel").val().trim();
        var Active = $("#Active").val().trim();
        var Type = $("#UserRole option:selected").text();

        // DealerCode == "" ? $("#DealerCode").addClass('error') : $("#DealerCode").removeClass('error');
        ContactNumber == "" ? $("#ContactNumber").addClass('error') : $("#ContactNumber").removeClass('error');
        UserName == "" ? $("#UserName").addClass('error') : $("#UserName").removeClass('error');
        


        if (ContactNumber == "" || UserName == "") {
            Validate = false;
        }

        $.ajax({
            type: "POST",
            url: "UserMaster.aspx/ValidateUser",
            data: JSON.stringify({ 'Number': ContactNumber, 'Type': 'Duplicate', 'UserCode': $("#HDUserCode").val() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                console.log(data);
                if (data.d != "") {
                    if (data.d == "Duplicate") {
                        $.alert("Same Contact number available in User Master!");
                        $("#ContactNumber").val("");
                        Validate = false;
                    }
                }
            },
            complete: function () {
                $body.removeClass("loading");
            }
        });

        $.ajax({
            type: "POST",
            url: "UserMaster.aspx/ValidateUser",
            data: JSON.stringify({ 'Number': ContactNumber, 'Type': Type, 'UserCode': $("#HDUserCode").val() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                console.log(data);
                if (data.d != "") {
                    if (data.d == "NoUser") {
                        $.alert("No details found fourn this contact number in record!");
                        $("#ContactNumber").val("");
                        Validate = false;
                    }
                    else {
                        UserId = data.d;
                        $("#UserId").val(data.d);

                    }
                }
            },
            complete: function () {
                $body.removeClass("loading");
            }
        });

        if (Validate) {
            $body.addClass("loading");
            var ACTIVE = 'FALSE';
            if ($("#Active").prop("checked") == true) {
                ACTIVE = 'TRUE';
            }
            UserMaster.push({
                P_UserCode: $("#HDUserCode").val(),
               
                P_PassWord: ContactNumber,
                P_ConfirmPassword: ContactNumber,
                P_ContactNumber: ContactNumber,
             
                P_UserLevel: UserLevel,
                P_Active: Active,
            })
            $.ajax({
                type: "POST",
                url: "UserMaster.aspx/ResetPassword",
                data: JSON.stringify({ 'oDealerBll': UserMaster }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        $.alert("Password Reset Successfully!");
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
        ClearAll();
        $("#HDUserCode").val('0');
        $("#DetailModal").modal('show');
        $("#btnSave").show();
        $("#btnReset").hide();

        $("#Active").prop('checked', true);
        $("#Active").attr('disabled', true);


    });

    $("#GenExcel").click(function () {
        var PPtblLength = $("#DistributerMasterTbl").find("tr").length;
        if (PPtblLength > 1) {
            $("#DistributerMasterTbl").table2excel({
                name: "Table2Excel",
                filename: "UserMaster"
            });
        }
    });

    $("#ContactNumber").change(function () {
        var ContactNumber = $("#ContactNumber").val();
        var UserCode = $("#HDUserCode").val();
        $.ajax({
            type: "POST",
            url: "UserMaster.aspx/ValidateUser",
            data: JSON.stringify({ 'Number': ContactNumber, 'Type': 'Duplicate', 'UserCode': UserCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {
                console.log(data);
                if (data.d != "") {
                    if (data.d == "Duplicate") {
                        $.alert("Same Contact number available in User Master!");
                        $("#ContactNumber").val("");
                    }
                }
            },
            complete: function () {
                $body.removeClass("loading");
            }
        });
    });

    $("#UserRole").change(function () {
        debugger;
        var ContactNumber = $("#ContactNumber").val();
        var UserCode = $("#HDUserCode").val();
        var Type = $("#UserRole option:selected").text();
        var UserPrevRole = $("#ContentPlaceHolder1_HDUserPrevRole").val();
        var UserNowRole = $("#UserRole").val();
        if (ContactNumber != "") {
            $.ajax({
                type: "POST",
                url: "UserMaster.aspx/ValidateUser",
                data: JSON.stringify({ 'Number': ContactNumber, 'Type': Type, 'UserCode': UserCode }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        if (data.d == "NoUser") {
                            $.alert("No details found for this contact number in record!");
                            
                        }
                        else {
                            UserId = data.d;
                            $("#UserId").val(data.d);

                        }
                    }
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });

            if (UserCode != "0") {
                if (UserPrevRole == "ROL00003" && UserNowRole == "ROL00004") {

                }
                else {
                    $.alert("Role can not be changed!");
                    $("#UserRole").val(UserNowRole);
                }
            }

        }
            if (Type == "ISD" || Type == "DEALER" || Type == "ISD + DEALER") {
                $("#UserType").val("EXTERNAL");
            }
            else {
                $("#UserType").val("INTERNAL");
            }
        
    });

    function ClearAll() {
        $("#ContactNumber").removeClass('error');
        $("#UserName").removeClass('error');
        $("#UserRole").removeClass('error');
        $("#UserType").removeClass('error');
        $("#Remarks").removeClass('error');
        $("#txtEmail").removeClass('error');


        $("#ContactNumber").attr('disabled', false);
        $("#UserName").attr('disabled', false);
        $("#UserRole").attr('disabled', false);
        $("#UserType").attr('disabled', false);
        $("#Remarks").attr('disabled', false);
        $("#txtEmail").attr('disabled', false);
       
        $("#Active").attr('disabled', false);


        $("#ContactNumber").val('');
        $("#UserName").val('');
        $("#UserRole").val('');
        $("#UserType").val('');
        $("#Remarks").val('');
        $("#UserId").val('');
        $("#UserLevel").val('');
        $("#txtEmail").val('');
       


        $("#Active").prop('checked', false);

    };
});