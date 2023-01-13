<%@ Page Title="" Language="C#" MasterPageFile="~/Main.Master" AutoEventWireup="true" CodeBehind="UploadData.aspx.cs" Inherits="OVOTS_WebApp.UploadData" %>

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
        <h2 style="text-align: center; margin-left: 0; font-family: 'Roboto'" runat="server" id="heading"></h2>
        <div style="width: 108%; margin-left: -50px">
            <div class="form-group; col-sm-12" style="border: 1px solid black; padding: 20px">
                <div class="col-sm-3">
                    <label>Select File</label>
                    <asp:FileUpload ID="flupDocFilePath" runat="server" Style="margin-top: 4%;" AllowMultiple="false" />
                </div>
                <div class="col-sm-1">
                    <br />
                    <input type="button" value="Show" class="btn btn-success" id="clkUpload" runat="server" onserverclick="clkUpload_ServerClick"  onclick="ShowLoader();"/>
                </div>
                  <div class="col-sm-1" style="display:none" runat="server" id="dvsave">
                    <br />
                    <input type="button" value="Upload & Save" class="btn btn-primary" id="clkSave" runat="server" onserverclick="clkSave_ServerClick" />
                </div>
                 <div class="col-sm-3" >
                       <br />
                    
                     <a runat="server" id="FileFormat" >View File Format</a>
                 </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            <div class="form-group; col-sm-12" style="border: 1px solid black; padding: 20px; background-color: #D8D8D8; overflow: auto">

                <%--<table class="imagetable" id="DistributerMasterTbl" style="width: 150%; background-color: whitesmoke; font-size: 12px">
                    <tr style="background-color: #D8D8D8">
                        <th style="" class='noExl'>Action</th>
                        <th style="">Dealer Code</th>
                        <th style="">Distributer</th>
                        <th style="">Firm Name</th>
                        <th style="">Mobile No</th>
                        <th style="">State</th>
                        <th style="">District</th>
                        <th style="">Town</th>
                        <th style="">Pin code</th>
                        <th style="">Address</th>

                        <th style="">Sales Manager</th>
                        <th style="">Sales Manager Number</th>

                        <th style="">Cluster Name</th>
                        <th style="">Owner Name</th>
                        <th style="">GST No</th>
                        <th style="">Lat/Long</th>

                    </tr>

                </table>--%>


                <asp:GridView runat="server" ID="grdData" CssClass="imagetable" style="width: 150%; background-color: whitesmoke; font-size: 12px" AutoGenerateColumns="true" 
                    EmptyDataText="No records has been added." OnRowDataBound="grdData_RowDataBound">

                </asp:GridView>
                <div>


                    <div id="myModal" class="modal fade" role="dialog">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" onclick="CloseModal('myModal');">&times;</button>
                                    <h4 class="modal-title">Upload Details</h4>
                                </div>
                                <div class="modal-body">
                                    <div id="divmsg" runat="server">
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal" onclick="CloseModal('myModal');">Close</button>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="loader"></div>
                </div>
            </div>
            <div class="loader"></div>
        </div>
    </div>
    <script src="Scripts/jquery-3.4.1.js"></script>
    <link href="Scripts/ConfirmBox/Datepicker.css" rel="stylesheet" />
    <script src="Scripts/ConfirmBox/Dapicker_Jquery.js"></script>
    <script src="Scripts/bootstrap.js"></script>
    <script src="Scripts/jquery-3.4.1.js"></script>
    <script src="Scripts/Pages/DealerMasterJs.js"></script>
    <script src="Scripts/jquery-3.4.1.js"></script>
    <script src="Scripts/bootstrap.js"></script>
    <script>
        function ShowMsg() {
            var modalId = "myModal";
            $("#" + modalId).css("display", "block");
            $("#" + modalId).addClass("in");
            $("body").addClass("modal-open");
            $('.overlay').css('display', 'block');

        }
        function CloseModal(modalId) {
            $("#" + modalId).css("display", "none");
            $("#" + modalId).removeClass("in");
            $("body").removeClass("modal-open");
            $('.overlay').css('display', 'none');
        }

        $(document).ready(function () {
            $body = $("body");
        });

        function ShowLoader() {
            $body.addClass("loading");
        }
        function HideLoader() {
            $body.removeClass("loading");
        }
    </script>
</asp:Content>
