<%@ Page Title="" Language="C#" MasterPageFile="~/Main.Master" AutoEventWireup="true" CodeBehind="GenerateInvoice.aspx.cs" Inherits="OVOTS_WebApp.GenerateInvoice" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <style>
        .ui-icon {
            width: 16px;
            height: 16px;
            background-image: url("../../Scripts/ConfirmBox/ui-icons_444444_256x240.png") !important;
        }

        body {
            /*background: #eef5f9;*/
        }

        .error {
            border-color: red;
        }

        .disabled {
            pointer-events: none;
            opacity: 0.6;
        }

        footer {
            margin-top: 720px;
            margin-bottom: 0px;
            margin-left: 450px
        }

        table.imagetable {
            /*font-family: 'Roboto';*/
            font-size: 12px;
            /*color: #333333;*/
            border-width: 1px;
            border-color: #999999;
            border-collapse: collapse;
        }

            table.imagetable th {
                /*background: #E0FFFF url('cell-blue.jpg');*/ /*Header Color*/
                /*#b5cfd2*/
                border-width: 1px;
                padding: 8px;
                border-style: solid;
                border-color: #999999;
            }

            table.imagetable td {
                /*background: #EBF4FA url('cell-grey.jpg');*/ /*all tr Color*/
                /*#dcddc0*/
                border-width: 1px;
                padding: 6px;
                border-style: solid;
                border-color: #999999;
                height: 8%;
                font-size: 11px;
            }

        .loader {
            display: none;
            position: fixed;
            z-index: 9999 !important;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background: rgba( 255, 255, 255, .5 ) url('../../../../../Img/Loading.gif') 50% 50% no-repeat;
        }

        body.loading .loader {
            overflow: hidden;
        }

        body.loading .loader {
            display: block;
        }
    </style>
    <div class="">
        <h2 style="text-align: center; margin-left: 0; font-family: 'Roboto';margin-left:30px">Generate ISD Incentive Invoice</h2>
        <div style="width: 100%; ">
            <div class="form-group; col-sm-12" style="border: 1px solid black; padding: 20px">
                <div class="col-sm-2">
                    <label>Select Date</label>
                    <input type="text" id="txtDate" class="form-control input-sm" runat="server" />
                </div>
                <div class="col-sm-1">
                    <br />
                    <a  class="btn btn-primary" id="clkSearch" runat="server" onserverclick="clkSearch_ServerClick" >Generate Invoice</a>
                </div>
            </div>
            <br /><br />
              <asp:Label ID="lblError" style="color:red" Visible="false" runat="server"></asp:Label>
                 <asp:Label ID="lblSucess" style="color:green" Visible="false" runat="server"></asp:Label>
            <div class="loader"></div>
        </div>
    </div>
    <script src="Scripts/jquery-3.4.1.js"></script>
    <link href="Scripts/ConfirmBox/Datepicker.css" rel="stylesheet" />
    <script src="Scripts/ConfirmBox/Dapicker_Jquery.js"></script>
    <script src="Scripts/bootstrap.js"></script>
    <script src="Scripts/jquery-3.4.1.js"></script>
    <script>
        $(document).ready(function () {
             $body = $("body");
            $("#ContentPlaceHolder1_txtDate").datepicker({ dateFormat: 'dd/mm/yy', maxDate: -1 });

            $("#ContentPlaceHolder1_clkSearch").click(function () {
                if ($("#ContentPlaceHolder1_txtDate").val() == "") {
                    $.alert("Select Date First");
                    return false;
                }
                else {
                    if (confirm("Did you realy wont to generate invoice for given date ?")) {
                        $body.addClass("loading");
                        return true;
                    }
                    else {
                         return false;
                    }
                }

            });
            

        });

        function ShowError() {
            $.alert(" Invoice No Already Generated For Given Date!");
        }

        function Success(cnt) {
            $.alert(cnt + " ISD Invoice Generated For Given Date!");
            $body.removeClass("loading");
        }

        function ShowLoader() {
            $body.addClass("loading");
        }
    </script>

</asp:Content>

