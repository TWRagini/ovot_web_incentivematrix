$(document).ready(function () {
    $body = $("body");
    SetDate();
    var TotalVendorCnt = GetVendorCnt();
    SetPages(TotalVendorCnt, 15, 7);
    GetAllVendors(0, 15);
    var OldValue = '';
    var OldGSTValue = '';
    var OldSAPCodeValue = '';
    function GetVendorCnt() {
        var form = $('#AntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        var headers = {};
        headers['__RequestVerificationToken'] = token;
        var TotalVendorCnt = 0;
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "/Masters/GetVendorCnt",
            data: JSON.stringify({ 'FilterType': FilterType, 'FilterValue': FilterValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            headers: headers,
            success: function (data) {
                console.log(data);
                if (data != "") {
                    TotalVendorCnt = data;
                }
            }
        });
        return TotalVendorCnt;
    };

    function GetAllVendors(StartIndex, EndIndex) {
        $("#VendorMasterTbl").find("tr:gt(0)").remove();
        var form = $('#AntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        var headers = {};
        headers['__RequestVerificationToken'] = token;
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "/Masters/GetVendorList",
            data: JSON.stringify({'StartIndex': StartIndex, 'EndIndex': EndIndex, 'FilterType': FilterType, 'FilterValue': FilterValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                console.log(data);
                var PT = JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\""));;
                if (PT.length > 0) {
                    $("#nav").show();
                    for (var i = 0; i < PT.length; i++) {
                        $("#VendorMasterTbl").append("<tr><td style='display:none'>"
                            + PT[i].VENDOR_CODE + "</td><td style='word-break: break-all !important'>"
                            + PT[i].VENDOR_NAME + "</td><td style='word-break: break-all !important'>"
                            + PT[i].VENDOR_SAP_CODE + "</td><td style='word-break: break-all !important'>"
                            + PT[i].VENDOR_GST + "</td><td style='word-break: break-all !important'>"
                            + PT[i].VENDOR_MSMED + "</td><td style='word-break: break-all !important'>"
                            + PT[i].VENDOR_SPOC + "</td><td style='word-break: break-all !important'>"
                            + PT[i].VENDOR_CONTACT_NO + "</td><td style='word-break: break-all !important'>"
                            + PT[i].Remark + "</td><td>"
                            + ('<a class="clkEdit pointerOnAnchor" id="clkEdit" style=""><span style="color:green">Edit</span></a> | <a class="clkView pointerOnAnchor" id="clkView" style=""><span style="color:orange">View</span></a>') + "</td></tr>");
                    }
                } else {
                    $("#nav").hide();
                    $("#VendorMasterTbl").append("<tr style='color:red;'><td colspan='7' style='text-align:center'>No Record Found</td></tr>");
                }
            }
        });
    }

    $('body').on('click', '#nav li', function () {
        $("#VendorMasterTbl").find("tr:gt(0)").remove();
        var val = $(this).find('a').text();
        var End = parseInt(val) * parseInt(15);
        var Start = (parseInt(End) - parseInt(15));
        GetAllVendors(Start, 15);
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

    function SetPages(numberOfItems, limitPerPage, paginationSize) {

        var numberOfItems = numberOfItems;
        var limitPerPage = limitPerPage;
        var totalPages = Math.ceil(numberOfItems / limitPerPage);
        var paginationSize = paginationSize;
        var currentPage;

        function showPage(whichPage) {
            if (whichPage < 1 || whichPage > totalPages) return false;
            currentPage = whichPage;
            $("#jar .content").hide()
                .slice((currentPage - 1) * limitPerPage,
                    currentPage * limitPerPage).show();
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
            GetAllVendors(Start, 15);
            return showPage(currentPage + 1);
        });

        $("#previous-page").on("click", function () {
            var End = parseInt(currentPage - 1) * parseInt(15);
            var Start = (parseInt(End) - parseInt(15));
            GetAllVendors(Start, 15);
            return showPage(currentPage - 1);
        });
        $(".pagination").append("</ul>");
    };

    $("#clkSearch").click(function () {
        var TotalVendorCnt = GetVendorCnt();
        SetPages(TotalVendorCnt, 15, 7);
        GetAllVendors(0, 15);
    });

    $("#clkAdd").click(function () {
        ClearAll();
        $("#HDVendorID").val('0');
        $("#DetailModal").modal('show');
        $("#btnSave").show();

        $("#Remark").attr('disabled', false);
        $("#Active").prop('checked', true);
        $("#Active").attr('disabled', true);
        $("#VendorName").attr('disabled', false);
        $("#VendorSAPCode").attr('disabled', false);
        $("#GSTNumber").attr('disabled', false);
        $("#MSMEDNumber").attr('disabled', false);
        $("#PropOrSpoc").attr('disabled', false);
        $("#Contact").attr('disabled', false);
        $("#GSTType").attr('disabled', false);
        $("#GSTStartDate").attr('disabled', false);
       
        $("#MEMSDStartDate").attr('disabled', false);
        $("#LowerTaxStartDate").attr('disabled', false);
        $("#LowerTaxPer").attr('disabled', false);
        $("#BankName").attr('disabled', false);
        $("#AccountNo").attr('disabled', false);
        $("#IFSCCode").attr('disabled', false);
        $("#BeneficiaryName").attr('disabled', false);
        $("#BranchAddress").attr('disabled', false);
    });

    $('#ModelContent input:text').blur(function () {
        if ($(this).val() == '') {
            $(this).addClass('error');
        } else {
            $(this).removeClass('error');
        }
    });

    $(document).on("click", ".clkEdit", function () {
        var form = $('#AntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        var headers = {};
        headers['__RequestVerificationToken'] = token;
        $("#btnSave").show();
        ClearAll();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var VendorCode = $("#VendorMasterTbl").find("tr").eq(TblIndex).find("td").eq(0).text();
        $.ajax({
            type: "POST",
            url: "/Masters/GetVendorDetails",
            data: JSON.stringify({ 'VendorCode': VendorCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                var ns = data;
                console.log(data);
                var GSTStartDate = ns.GSTStartDate;
                if (GSTStartDate != "" && GSTStartDate != null) {
                    GSTStartDate = new Date(parseInt(ns.GSTStartDate.replace(/(^.*\()|([+-].*$)/g, '')));
                    GSTStartDate = GetDDMMYYDate(GSTStartDate);
                }
                var MEMSDStartDate = ns.MEMSDStartDate;
                if (MEMSDStartDate != "" && MEMSDStartDate != null) {
                    MEMSDStartDate = new Date(parseInt(ns.MEMSDStartDate.replace(/(^.*\()|([+-].*$)/g, '')));
                    MEMSDStartDate = GetDDMMYYDate(MEMSDStartDate);
                }
                var LowerTaxStartDate = ns.LowerTaxStartDate;
                if (LowerTaxStartDate != "" && LowerTaxStartDate != null) {
                    LowerTaxStartDate = new Date(parseInt(ns.LowerTaxStartDate.replace(/(^.*\()|([+-].*$)/g, '')));
                    LowerTaxStartDate = GetDDMMYYDate(LowerTaxStartDate);
                }
                $("#HDVendorID").val(ns.VENDOR_CODE);
                $("#VendorName").val(ns.VENDOR_NAME);
                OldValue = ns.VENDOR_NAME;
                $("#VendorSAPCode").val(ns.VENDOR_SAP_CODE);
                OldSAPCodeValue = ns.VENDOR_SAP_CODE;
                $("#GSTNumber").val(ns.VENDOR_GST);
                OldGSTValue = ns.VENDOR_GST;
                $("#MSMEDNumber").val(ns.VENDOR_MSMED);
                $("#PropOrSpoc").val(ns.VENDOR_SPOC);
                $("#Contact").val(ns.VENDOR_CONTACT_NO);
                $("#Remark").val(ns.Remark);
                $("#GSTType").val(ns.GSTType);
                $("#GSTStartDate").val(GSTStartDate);
                $("#MEMSDStartDate").val(MEMSDStartDate);
                $("#LowerTaxStartDate").val(LowerTaxStartDate);
                $("#LowerTaxPer").val(ns.LowerTaxPer);
                $("#BankName").val(ns.BankName);
                $("#AccountNo").val(ns.AccountNo);
                $("#IFSCCode").val(ns.IFSCCode);
                $("#BeneficiaryName").val(ns.BeneficiaryName);
                $("#BranchAddress").val(ns.BranchAddress);
                if (ns.ACTIVE == true) {
                    $("#Active").prop('checked', true);
                }
                if (ns.LowerTax == true) {
                    $("#LowerTax").prop('checked', true);
                }
                if (ns.GSTType == "Unregistered") {
                    $("#GSTNumber").attr('disabled', true);
                    $("#GSTStartDate").attr('disabled', true);
                }
                else{
                    $("#GSTNumber").attr('disabled', false);
                    $("#GSTStartDate").attr('disabled', false);
                }
                

                $("#VendorName").attr('disabled', false);
                $("#VendorSAPCode").attr('disabled', false);
               
                $("#MSMEDNumber").attr('disabled', false);
                $("#PropOrSpoc").attr('disabled', false);
                $("#Contact").attr('disabled', false);
                $("#Remark").attr('disabled', false);
                $("#Active").attr('disabled', false);
                $("#LowerTax").attr('disabled', false);
                $("#GSTType").attr('disabled', false);
                
               
                $("#MEMSDStartDate").attr('disabled', false);
                $("#LowerTaxStartDate").attr('disabled', false);
                $("#LowerTaxPer").attr('disabled', false);
                $("#BankName").attr('disabled', false);
                $("#AccountNo").attr('disabled', false);
                $("#IFSCCode").attr('disabled', false);
                $("#BeneficiaryName").attr('disabled', false);
                $("#BranchAddress").attr('disabled', false);
                $('#DetailModal').modal('show');

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });

    $(document).on("click", ".clkView", function () {
        var form = $('#AntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        var headers = {};
        headers['__RequestVerificationToken'] = token;
        ClearAll();
        $("#btnSave").hide();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var VendorCode = $("#VendorMasterTbl").find("tr").eq(TblIndex).find("td").eq(0).text();
        $.ajax({
            type: "POST",
            url: "/Masters/GetVendorDetails",
            data: JSON.stringify({ 'VendorCode': VendorCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                var ns = data;
                console.log(data);
                var GSTStartDate = ns.GSTStartDate;
                if (GSTStartDate != "" && GSTStartDate != null) {
                    GSTStartDate = new Date(parseInt(ns.GSTStartDate.replace(/(^.*\()|([+-].*$)/g, '')));
                    GSTStartDate = GetDDMMYYDate(GSTStartDate);
                }
                var MEMSDStartDate = ns.MEMSDStartDate;
                if (MEMSDStartDate != "" && MEMSDStartDate != null) {
                    MEMSDStartDate = new Date(parseInt(ns.MEMSDStartDate.replace(/(^.*\()|([+-].*$)/g, '')));
                    MEMSDStartDate = GetDDMMYYDate(MEMSDStartDate);
                }
                var LowerTaxStartDate = ns.LowerTaxStartDate;
                if (LowerTaxStartDate != "" && LowerTaxStartDate != null) {
                    LowerTaxStartDate = new Date(parseInt(ns.LowerTaxStartDate.replace(/(^.*\()|([+-].*$)/g, '')));
                    LowerTaxStartDate = GetDDMMYYDate(LowerTaxStartDate);
                }
                $("#HDVendorID").val(ns.VENDOR_CODE);
                $("#VendorName").val(ns.VENDOR_NAME);
                $("#VendorSAPCode").val(ns.VENDOR_SAP_CODE);
                $("#GSTNumber").val(ns.VENDOR_GST);
                $("#MSMEDNumber").val(ns.VENDOR_MSMED);
                $("#PropOrSpoc").val(ns.VENDOR_SPOC);
                $("#Contact").val(ns.VENDOR_CONTACT_NO);
                $("#Remark").val(ns.Remark);
                if (ns.ACTIVE == true) {
                    $("#Active").prop('checked', true);
                }
                if (ns.LowerTax == true) {
                    $("#LowerTax").prop('checked', true);
                }
                $("#GSTType").val(ns.GSTType);
                $("#GSTStartDate").val(GSTStartDate);
                $("#MEMSDStartDate").val(MEMSDStartDate);
                $("#LowerTaxStartDate").val(LowerTaxStartDate);
                $("#LowerTaxPer").val(ns.LowerTaxPer);
                $("#BankName").val(ns.BankName);
                $("#AccountNo").val(ns.AccountNo);
                $("#IFSCCode").val(ns.IFSCCode);
                $("#BeneficiaryName").val(ns.BeneficiaryName);
                $("#BranchAddress").val(ns.BranchAddress);

                $('#DetailModal').modal('show');

                $("#VendorName").attr('disabled', true);
                $("#VendorSAPCode").attr('disabled', true);
                $("#GSTNumber").attr('disabled', true);
                $("#MSMEDNumber").attr('disabled', true);
                $("#PropOrSpoc").attr('disabled', true);
                $("#Contact").attr('disabled', true);
                $("#Remark").attr('disabled', true);
                $("#Active").attr('disabled', true);
                $("#LowerTax").attr('disabled', true);
                $("#GSTType").attr('disabled', true);
                $("#GSTStartDate").attr('disabled', true);
               
                $("#MEMSDStartDate").attr('disabled', true);
                $("#LowerTaxStartDate").attr('disabled', true);
                $("#LowerTaxPer").attr('disabled', true);
                $("#BankName").attr('disabled', true);
                $("#AccountNo").attr('disabled', true);
                $("#IFSCCode").attr('disabled', true);
                $("#BeneficiaryName").attr('disabled', true);
                $("#BranchAddress").attr('disabled', true);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });

    $("#btnSave").click(function () {
        var form = $('#AntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        var headers = {};
        headers['__RequestVerificationToken'] = token;
        var Validate = true;
        var VendorMaster = [];
        var VendorName = $("#VendorName").val().trim();
        var VendorSAPCode = $("#VendorSAPCode").val().trim();
        var GSTNumber = $("#GSTNumber").val().trim();
        var MSMEDNumber = $("#MSMEDNumber").val().trim();
        var PropOrSpoc = $("#PropOrSpoc").val().trim();
        var Contact = $("#Contact").val().trim();
        var GSTType = $("#GSTType").val().trim();

        var GSTType = $("#GSTType").val().trim();
        var GSTStartDate = $("#GSTStartDate").val().trim();
        var MEMSDStartDate = $("#MEMSDStartDate").val().trim();
        var LowerTaxStartDate = $("#LowerTaxStartDate").val().trim();
        var LowerTaxPer = $("#LowerTaxPer").val().trim();
        var BankName = $("#BankName").val().trim();
        var AccountNo = $("#AccountNo").val().trim();
        var IFSCCode = $("#IFSCCode").val().trim();
        var BeneficiaryName = $("#BeneficiaryName").val().trim();
        var BranchAddress = $("#BranchAddress").val().trim();

        VendorName == "" ? $("#VendorName").addClass('error') : $("#VendorName").removeClass('error');
        VendorSAPCode == "" ? $("#VendorSAPCode").addClass('error') : $("#VendorSAPCode").removeClass('error');
        
        MSMEDNumber == "" ? $("#MSMEDNumber").addClass('error') : $("#MSMEDNumber").removeClass('error');
        PropOrSpoc == "" ? $("#PropOrSpoc").addClass('error') : $("#PropOrSpoc").removeClass('error');
        Contact == "" ? $("#Contact").addClass('error') : $("#Contact").removeClass('error');

        if (VendorName == "" || VendorSAPCode === "" || MSMEDNumber == "" || PropOrSpoc == "" || Contact == "") {
            Validate = false;
            return false;
        }
        if (GSTType !="Unregistered") {
            GSTNumber == "" ? $("#GSTNumber").addClass('error') : $("#GSTNumber").removeClass('error');
            GSTStartDate == "" ? $("#GSTStartDate").addClass('error') : $("#GSTStartDate").removeClass('error');

            if (GSTNumber == "" || GSTStartDate === "" ) {
                Validate = false;
                return false;
            }
        }
        if ($("#HDVendorID").val() == 0 || VendorName != OldValue) {
            $.ajax({
                type: "POST",
                url: "/Masters/CheckDuplicate",
                data: JSON.stringify({ 'TblName': 'VendorMasterTbl', 'ColumnName': 'VENDOR_NAME', 'Value': VendorName }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                headers: headers,
                success: function (data) {
                    console.log(data);
                    if (data != "0") {
                        Validate = false;
                        $.alert("" + VendorName + " Vendor Already Exist!");
                    }
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });
        }      
        if ($("#HDVendorID").val() == 0 || GSTNumber != OldGSTValue) {
            $.ajax({
                type: "POST",
                url: "/Masters/CheckDuplicate",
                data: JSON.stringify({ 'TblName': 'VendorMasterTbl', 'ColumnName': 'VENDOR_GST', 'Value': GSTNumber }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                headers: headers,
                success: function (data) {
                    console.log(data);
                    if (data != "0") {
                        Validate = false;
                        $.alert("" + GSTNumber + " GST No Already Exist!");
                    }
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });
        }
        if ($("#HDVendorID").val() == 0 || VendorSAPCode != OldSAPCodeValue) {
            $.ajax({
                type: "POST",
                url: "/Masters/CheckDuplicate",
                data: JSON.stringify({ 'TblName': 'VendorMasterTbl', 'ColumnName': 'VENDOR_SAP_CODE', 'Value': VendorSAPCode }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                headers: headers,
                success: function (data) {
                    console.log(data);
                    if (data != "0") {
                        Validate = false;
                        $.alert("" + VendorSAPCode + " SAP Code Already Exist!");
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
            var LowerTax = false;
            //if ($("#LowerTax").prop("checked") == true) {
            //    LowerTax = true;
            //}
            if (LowerTaxPer != '' || LowerTaxPer != 0) {
                LowerTax = true;
            }
            if (GSTStartDate != "") {
                var FGSTStartDate = FormateDate(GSTStartDate);
            }
            if (MEMSDStartDate != "") {
                var FMEMSDStartDate = FormateDate(MEMSDStartDate);
            }
            if (LowerTaxStartDate != "") {
                var FLowerTaxStartDate = FormateDate(LowerTaxStartDate);
            }
            VendorMaster.push({
                VENDOR_CODE: $("#HDVendorID").val(),
                VENDOR_NAME: VendorName,
                VENDOR_SAP_CODE: VendorSAPCode,
                VENDOR_GST: GSTNumber,
                VENDOR_MSMED: MSMEDNumber,
                VENDOR_SPOC: PropOrSpoc,
                VENDOR_CONTACT_NO: Contact,
                Remark: $("#Remark").val().trim(),
                LowerTax: LowerTax,
                GSTType: GSTType,
                GSTStartDate: FGSTStartDate,
                MEMSDStartDate: FMEMSDStartDate,
                LowerTaxStartDate: FLowerTaxStartDate,
                LowerTaxPer: LowerTaxPer,
                BankName: BankName,
                AccountNo: AccountNo,
                IFSCCode: IFSCCode,
                BeneficiaryName: BeneficiaryName,
                BranchAddress: BranchAddress,
                ACTIVE: ACTIVE
            })
            
            $.ajax({
                type: "POST",
                url: "/Masters/SaveUpdateVendor",
                data: JSON.stringify({ 'vendors': VendorMaster }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: headers,
                success: function (data) {
                    console.log(data);
                    if (data.d != "") {
                        $.alert("Vendor Saved/Updated Sucessfully!");                        
                        var TotalVendorCnt = GetVendorCnt();
                        SetPages(TotalVendorCnt, 15, 7);
                        GetAllVendors(0, 15);

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
        var form = $('#AntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        var headers = {};
        headers['__RequestVerificationToken'] = token;
        $("#VendorMasterTblCopy").find("tr:gt(0)").remove();
        var FilterType = $("#ddlFilterType").val().trim();
        var FilterValue = $("#FilterValue").val().trim();
        $.ajax({
            type: "POST",
            url: "/Masters/GetVendorListForExcel",
            data: JSON.stringify({ 'FilterType': FilterType, 'FilterValue': FilterValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            success: function (data) {
                var ns = JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\""));
                console.log(ns);
                $.each(ns, function (index, value) {
                    //var LowerTax = value.LowerTax == '1' ? 'Yes' : 'No';
                    var GSTStartDate = value.GSTStartDate;
                    if (GSTStartDate != "" && GSTStartDate != null) {
                        GSTStartDate = new Date(parseInt(value.GSTStartDate.replace(/(^.*\()|([+-].*$)/g, '')));
                        GSTStartDate = GetDDMMYYDate(GSTStartDate);
                    }
                    var MEMSDStartDate = value.MEMSDStartDate;
                    if (MEMSDStartDate != "" && MEMSDStartDate != null) {
                        MEMSDStartDate = new Date(parseInt(value.MEMSDStartDate.replace(/(^.*\()|([+-].*$)/g, '')));
                        MEMSDStartDate = GetDDMMYYDate(MEMSDStartDate);
                    }
                    var LowerTaxStartDate = value.LowerTaxStartDate;
                    if (LowerTaxStartDate != "" && LowerTaxStartDate != null) {
                        LowerTaxStartDate = new Date(parseInt(value.LowerTaxStartDate.replace(/(^.*\()|([+-].*$)/g, '')));
                        LowerTaxStartDate = GetDDMMYYDate(LowerTaxStartDate);
                    }
                    $("#VendorMasterTblCopy").append("<tr><td>"
                        + value.VENDOR_NAME + "</td><td>"
                        + value.VENDOR_SAP_CODE + "</td><td>"
                        + value.GSTType + "</td><td>"
                        + value.VENDOR_GST + "</td><td>"
                        + GSTStartDate + "</td><td>"
                        + value.VENDOR_MSMED + "</td><td>"
                        + MEMSDStartDate + "</td><td>"
                        + value.VENDOR_SPOC + "</td><td>"
                        + value.VENDOR_CONTACT_NO + "</td><td>"
                        + value.Remark + "</td><td>"
                        + LowerTaxStartDate + "</td><td>"
                        + value.LowerTaxPer + "</td><td>"
                        + value.BankName + "</td><td>"
                        + value.AccountNo + "</td><td>"
                        + value.IFSCCode + "</td><td>"
                        + value.BeneficiaryName + "</td><td>"
                        + value.BranchAddress + "</td></tr>");
                });
                var TblLength = $("#VendorMasterTblCopy").find("tr").length;
                if (TblLength > 1) {
                    $("#VendorMasterTblCopy").table2excel({
                        name: "Table2Excel",
                        filename: "Vendor_Master_Report"

                    });
                }
            },
            complete: function () {
                $body.removeClass("loading");
            }
        });

    });

    $("#GSTType").change(function () {
        var GSTType = $("#GSTType").val();
        if (GSTType == "Unregistered") {
            $("#GSTNumber").attr('disabled', true);
            $("#GSTStartDate").attr('disabled', true);
            $("#GSTStartDate").val('');
            $("#GSTNumber").val('');
        } else {
            $("#GSTNumber").attr('disabled', false);
            $("#GSTStartDate").attr('disabled', false);            
        }
    });

    function ClearAll() {
        $("#VendorName").removeClass('error');
        $("#VendorSAPCode").removeClass('error');
        $("#GSTNumber").removeClass('error');
        $("#MSMEDNumber").removeClass('error');
        $("#PropOrSpoc").removeClass('error');
        $("#LowerTaxPer").removeClass('error');
        $("#Contact").removeClass('error');
        $("#Active").prop('checked', false);
        $("#LowerTax").prop('checked', false);

        $("#VendorName").val('');
        $("#VendorSAPCode").val('');
        $("#GSTNumber").val('');
        $("#MSMEDNumber").val('');
        $("#PropOrSpoc").val('');
        $("#Contact").val('');
        $("#Remark").val('');
        $("#MEMSDStartDate").val('');
        $("#LowerTaxStartDate").val('');
        $("#LowerTaxPer").val('');
        $("#BankName").val('');
        $("#AccountNo").val('');
        $("#IFSCCode").val('');
        $("#BeneficiaryName").val('');
        $("#BranchAddress").val('');
        $("#GSTStartDate").val('');
      
    };

    function SetDate() {
        $("#GSTStartDate").datepicker({ dateFormat: 'dd/mm/yy'});
        $("#MEMSDStartDate").datepicker({ dateFormat: 'dd/mm/yy'});
        $("#LowerTaxStartDate").datepicker({ dateFormat: 'dd/mm/yy' });

    };

    function FormateDate(date) {
        var d = new Date(date.split("/").reverse().join("-"));
        var dd = d.getDate();
        var mm = d.getMonth() + 1;
        var yy = d.getFullYear();
        var retu = yy + "-" + mm + "-" + dd;
        return retu;
    };
    function GetDDMMYYDate(date) {
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return day + '/' + month + '/' + year;
    }
});