$(document).ready(function () {
   
    $body = $("body");
   // $("#Approve_Date").datepicker({ dateFormat: 'dd/mm/yy', maxDate: 0 }).datepicker("setDate", new Date());
    var UserName = $("#HDUserName").val();
    $("#APPROVE_BY").val(UserName);
    $("#FromDate").datepicker({ dateFormat: 'dd/mm/yy' });
    $("#ToDate").datepicker({ dateFormat: 'dd/mm/yy' });
    debugger;
    $.ajax({
        type: "POST",
        url: "CustomerInvoiceApprove.aspx/GetReasonDll",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            console.log(r);
            var ReasonDD = $("[id*=REJECTION_REASON]");
            $.each(r.d, function () {
                ReasonDD.append($("<option></option>").val(this['Value']).html(this['Text']));
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            
            alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
        }

    });
   
    $("#clkSearch").click(function () {
       
        GetCustomerInvoiceList();
    });

    $(document).on("click", ".clkApprove", function () {
       
        ClearAll();
        var TblIndex = $(this).closest('td').parent()[0].sectionRowIndex;
        var UploadCode = $("#Invoicetbl").find("tr").eq(TblIndex).find("td").eq(0).text();
        $("#HUploadCode").val(UploadCode);
        $.ajax({
            type: "POST",
            url: "CustomerInvoiceApprove.aspx/GetApproveDetails",
            data: JSON.stringify({ 'UploadCode': UploadCode }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
           
            success: function (data) {
                debugger;
                var ns = $.parseJSON(data.d);
                var Apd = ns.ApproveDetails;
               
                console.log(data.d);
                if (Apd.P_ApproveStatus != null && Apd.P_ApproveStatus != "") {

                    $("#APPROVE_STATUS").val(Apd.P_ApproveStatus);
                    $("#REJECTION_REASON").val(Apd.P_RejectionReason);
                    $("#APPROVE_BY").val(Apd.P_ApproveBy);
                    $("#Approve_Date").val(Apd.P_ApproveDate);
                    $("#ApproveRemarks").val(Apd.P_Remarks);
                }
                else {
                   
                    $("#REJECTION_REASON").val('');
                   
                    $("#ApproveRemarks").val('');
                    $("#APPROVE_BY").val($("#HDUserName").val());
                    $("#Approve_Date").datepicker({ dateFormat: 'dd/mm/yy', maxDate: 0 }).datepicker("setDate", new Date());
                }
                $('#DetailModal').modal('show');

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    });

    $("#btnSave").click(function () {
        debugger;
        var ApproveBll = [];
       
        var Validate = true;

        var P_UploadCode = $("#HUploadCode").val();
        var P_ApproveStatus = $("#APPROVE_STATUS").val();
        var P_RejectionReason = $("#REJECTION_REASON").val();
        var P_ApproveBy = $("#APPROVE_BY").val();
        var P_ApproveDate = $("#Approve_Date    ").val();
        var P_Remarks = $("#ApproveRemarks").val();
     

       
        P_ApproveStatus == "" ? $("#APPROVE_STATUS").addClass('error') : $("#APPROVE_STATUS").removeClass('error');
        P_ApproveBy == "" ? $("#APPROVE_BY").addClass('error') : $("#APPROVE_BY").removeClass('error');
        P_ApproveDate == "" ? $("#Approve_Date").addClass('error') : $("#Approve_Date").removeClass('error');
        
    


        if (P_ApproveStatus == "" || P_ApproveBy === "" || P_ApproveDate === "") {
            Validate = false;
        }
        if (P_ApproveStatus == "Rejected") {
            
            P_RejectionReason == "" ? $("#REJECTION_REASON").addClass('error') : $("#REJECTION_REASON").removeClass('error');
            if (P_RejectionReason == "") {
                Validate = false;
            }
        }

      

        if (Validate) {
            $body.addClass("loading");
            var FP_ApproveDate = FormateDate(P_ApproveDate);
         
            ApproveBll.push({
                P_UploadCode: P_UploadCode,
                P_ApproveStatus: P_ApproveStatus,
                P_RejectionReason: P_RejectionReason,
                P_ApproveBy: P_ApproveBy,
                P_ApproveDate: FP_ApproveDate,
                P_Remarks: P_Remarks,
               
            });

           
            $.ajax({
                type: "POST",
                url: "CustomerInvoiceApprove.aspx/SaveApproveDetails",
                data: JSON.stringify({ 'oApproveBll': ApproveBll }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data.d != '') {
                        alert("Approval Details Save Successfuly...");
                        $("#Invoicetbl").find("tr:gt(0)").remove();
                        GetCustomerInvoiceList();
                        $('#DetailModal').modal('hide');
                       
                    }
                },
                complete: function () {
                    $body.removeClass("loading");
                }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                    debugger;
                    alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
                }
            });
        }
    });

    function ClearAll() {
       
        $("#REJECTION_REASON").val('');
        $("#APPROVE_BY").val('');
        $("#Approve_Date").val('');
        $("#ApproveRemarks").val('');
    }

    $("#APPROVE_STATUS").change(function () {
        var ApproveStatus = $("#APPROVE_STATUS").val();
        if (ApproveStatus == 'Approved') {
            $("#REJECTION_REASON").val('');
            $("#REJECTION_REASON").attr('disabled', true);
        }
        else {
            $("#REJECTION_REASON").attr('disabled', false);
        }
    });

    function GetCustomerInvoiceList() {
        $("#Invoicetbl").find("tr:gt(0)").remove();
        var ddlFilterType = $("#ddlFilterType").val();
        var FilterValue = $("#FilterValue").val();

        var FromDt = $("#FromDate").val();
        var ToDt = $("#ToDate").val();

        var Validate = true;
        //ddlFilterType == "" ? $("#ddlFilterType").addClass('error') : $("#ddlFilterType").removeClass('error');
        //FilterValue == "" ? $("#FilterValue").addClass('error') : $("#FilterValue").removeClass('error');
        //if (ddlFilterType == "" || FilterValue === "") {
        //    Validate = false;

        //}
        if (Validate) {
            $body.addClass("loading");
            $.ajax({
                type: "POST",
                url: "CustomerInvoiceApprove.aspx/GetInvoiceApproveList",
                data: JSON.stringify({ 'ddlFilterType': ddlFilterType, 'FilterValue': FilterValue, 'FromDt': FromDt, 'ToDt': ToDt }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var DR = data.d;
                    for (var i = 0; i < DR.length; i++) {
                        $("#Invoicetbl").append("<tr><td style='display:none' class='noExl'>"
                            + DR[i].UploadCode + "</td><td>"
                            + DR[i].InvoiceNo + "</td><td>"
                            + DR[i].Customer + "</td><td>"
                            + DR[i].MobileNo + "</td><td>"
                            + DR[i].ProductSrNo + "</td><td>"
                            + DR[i].Model + "</td><td>"
                            + DR[i].Dealer + "</td><td>"
                            + DR[i].ISD + "</td><td>"
                            + DR[i].IncentiveAmt + "</td><td class='noExl'> "
                            + "<a  class='clkFile' href='" + DR[i].InvoiceFilePath +"' target='_blank' >View</a></td><td>"
                            + DR[i].ApproveStatus + "</td><td class='noExl'>"
                            + "<a class='clkApprove pointerOnAnchor'>Approve</a></td></tr>");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    debugger;
                    alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
                },
                complete: function () {
                    $body.removeClass("loading");
                }
            });
        }
    }

    $(document).on("click", ".clkFile", function () {
      
        var href = $(this).attr('href');
        
        if (href == '') {
            alert("No file found");
            return false;
        }
        //else {
        //    $(this).attr("target", "_blank");
        //}
    });

    function ShowFile(FilePath) {
        alert("");
        if (FilePath == "") {
            alert("No Invoice Uploaded");
        }
        else {
            window.location.href = FilePath;        }
    }

    $("#GenExcel").click(function () {
        var PPtblLength = $("#Invoicetbl").find("tr").length;
        if (PPtblLength > 1) {
            $("#Invoicetbl").table2excel({
                name: "Table2Excel",
                filename: "Customer_Invoice"
            });
        }
    });

    $("#Search").on("keyup", function () {

        var value = $(this).val().toLowerCase();

        $("#Invoicetbl tr:not(:first-child)").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    function FormateDate(date) {
        var d = new Date(date.split("/").reverse().join("-"));
        var dd = d.getDate();
        var mm = d.getMonth() + 1;
        var yy = d.getFullYear();
        var retu = yy + "-" + mm + "-" + dd;
        return retu;
    };
});