$(document).ready(function () {
    $body = $("body");

    var Masters = [];
    var Transactions = [];
   
    var form = $('#AntiForgeryForm');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    var headers = {};
    headers['__RequestVerificationToken'] = token;
    $body.addClass("loading");
    $.ajax({
        type: "POST",
        url: "/Home/GetUserDtList",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: headers,
        success: function (data) {
            console.log(data);
            var PT = JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\""));
            var ML = PT.MasterLst;
            var TL = PT.TransactionLst;
            Masters = ML;
            Transactions = TL;
            if (ML.length > 0) {
                $("#MDiv").show();
            } else {
                $("#MDiv").hide();
            }
            if (TL.length > 0) {
                $("#TDiv").show();
            } else {
                $("#TDiv").hide();
            }
            $("#RPTDiv").show();
            LandingRPT();
            LoadDropdown();
            //JSON.stringify({ 'UserID': 'USR0001' })

        },
        complete: function () {
            $body.removeClass("loading");
        }
    });
    function LandingRPT() {
        $.ajax({
            type: "POST",
            url: "/Home/LandingRPT",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            async: false,
            success: function (data) {
                console.log(data);
                var PT = JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\""));
                var BillCnt = PT[0].Cnt;
                var GSTCnt = PT[1].Cnt; 
                var MSMECnt = PT[2].Cnt; 
                $("#BillCnt").text(BillCnt);
                $("#PayCnt").text(GSTCnt);
                $("#PayMSMECnt").text(MSMECnt);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
            }
        });
    };
    

    $("#MDiv").click(function () {
        $("#Menus1").hide();
        $("#Head").text("Masters");
        $("#Menus").empty();
        //$('#myModal').modal('show');
        for (var i = 0; i < Masters.length; i++) {
            $("#Menus").append("<li><p style='height:11px'><a href=" + Masters[i].URL + ">" + Masters[i].SubMenu + "</a></p></li>");
        };
    });

    $("#TDiv").click(function () {
        $("#Menus1").show();
        $("#Menus1").empty();
        $("#Head").text("Transactions");
        $("#Menus").empty();
        //$('#myModal').modal('show');        
        for (var i = 0; i < Transactions.length; i++) {
            $("#Menus").append("<li><p style='height:11px'><a href=" + Transactions[i].URL + ">" + Transactions[i].SubMenu + "</a></p></li>");
        };
    });

    $("#BillCnt").click(function () {
        window.location.href = "/Transactions/VendorTrackingList?LP=BL";
    });
    $("#PayCnt").click(function () {
        window.location.href = "/Transactions/VendorTrackingList?LP=PY";
    });

    function LoadDropdown() {

        $.ajax({
            type: "POST",
            url: "/Transactions/GetStatesDropdwon",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false, headers: headers,
            success: function (r) {
                //console.log(r);
                localStorage['StateDropdown'] = JSON.stringify(r);
            }
        });

        $.ajax({
            type: "POST",
            url: "/Transactions/GetVendorsDropdwon",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false, headers: headers,
            success: function (r) {
                //console.log(r);
                localStorage['VendorDropdown'] = JSON.stringify(r);
            }
        });
        $.ajax({
            type: "POST",
            url: "/Transactions/GetClientsDropdwon",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false, headers: headers,
            success: function (r) {
                //console.log(r);
                localStorage['ClientDropdown'] = JSON.stringify(r);
            }
        });
        $.ajax({
            type: "POST",
            url: "/Transactions/GetServicesDropdwon",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false, headers: headers,
            success: function (r) {
                //console.log(r);
                localStorage['ServiceDropdown'] = JSON.stringify(r);
            }
        });

        $.ajax({
            type: "POST",
            url: "/Transactions/GetBillingCategoryDropdwon",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json", headers: headers,
            async: false,
            success: function (r) {
                //console.log(r);
                localStorage['CategoryDropdown'] = JSON.stringify(r);
            }
        });
        $.ajax({
            type: "POST",
            url: "/Transactions/GetSACCodesDropdwon",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json", headers: headers,
            async: false,
            success: function (r) {
                //console.log(r);
                localStorage['SACDropdown'] = JSON.stringify(r);
            }
        });
        $.ajax({
            type: "POST",
            url: "/Transactions/GetUserDropdwon",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json", headers: headers,
            async: false,
            success: function (r) {
                //console.log(r);
                localStorage['UserDropdown'] = JSON.stringify(r);
            }
        });
        //$.ajax({
        //    type: "POST",
        //    url: "/Transactions/GetUserDropdwon",
        //    data: '{}',
        //    contentType: "application/json; charset=utf-8",
        //    dataType: "json", headers: headers,
        //    async: false,
        //    success: function (r) {
        //        //console.log(r);
        //        var ddlval = $("[id*=COMPLIANCE_USER]");
        //        $.each(r, function () {
        //            ddlval.append($("<option></option>").val(this['Value']).html(this['Text']));
        //        });
        //    }
        //});
        $.ajax({
            type: "POST",
            url: "/Transactions/CityDropdwon",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json", headers: headers,
            success: function (r) {
                //console.log(r);
                localStorage['CityDropdown'] = JSON.stringify(r);
            }
        });

        $.ajax({
            type: "POST",
            url: "/Masters/GetApprovedByDropdwon",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json", headers: headers,
            async: false,
            success: function (r) {
                //console.log(r);
                localStorage['ApprovedByDropdwon'] = JSON.stringify(r);
            }
        });
    }
});