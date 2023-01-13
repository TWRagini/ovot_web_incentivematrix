<%@ Page Title="" Language="C#" MasterPageFile="~/Main.Master" AutoEventWireup="true" CodeBehind="IncentiveConfiguration.aspx.cs" Inherits="OVOTS_WebApp.IncentiveConfiguration" %>
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
        <h2 style="text-align: center; margin-left: 0; font-family: 'Roboto';margin-top:30px">Incentive Configuration</h2>
        <div style="width: 100%;">
            <div class="form-group; col-sm-12" style="border: 1px solid black; padding: 20px">
                <div class="col-sm-2">
                    <label>Filter Type</label>
                    <select id="ddlFilterType" class="form-control input-sm" style="width: 100%">
                        <option value="">Select</option>
                        <option value="Name">Name</option>
                      
                    </select>
                </div>
                <div class="col-sm-2">
                    <label>Filter Value</label>
                    <input type="text" id="FilterValue" class="form-control input-sm" />
                </div>

                <div class="col-sm-1">
                    <br />
                    <input type="button" value="Search" class="btn btn-primary" id="clkSearch" />
                </div>
                <div class="col-sm-1" style="width: 7%">
                    <br />
                    <input type="button" value="Add" class="btn btn-warning" id="clkAdd" />
                </div>
                <div class="col-sm-1" style="width: 6%">
                    <br />
                    <a id="GenExcel" runat="server" onserverclick="GenExcel_ServerClick">
                        <img src="Img/Excel-icon.png" />
                    </a>
                    <asp:HiddenField id="hdFilterValue" runat="server"/>
                 <asp:HiddenField id="hdFilterType" runat="server"/>
                </div>
                <div class="col-sm-2">
                    <label>More Filter</label>
                    <input type="text" id="Search" class="form-control input-sm" placeholder="Search" style="width: 100%" />
                </div>
             
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            <div class="form-group; col-sm-12" style="border: 1px solid black; padding: 20px; background-color: #D8D8D8; overflow: auto">

                <table class="imagetable" id="ConfigMasterTbl" style="width: 130%; background-color: whitesmoke; font-size: 12px">
                    <tr style="background-color: #D8D8D8">
                        <th style="" class='noExl'>Action</th>
                        <th style="">Configuration Code</th>
                        <th style="">Name</th>
                        <th style="">Config By</th>
                        <th style="">Level</th>
                        <th style="">Entity</th>
                       
                    </tr>

                </table>

                <div class="col-sm-12">
                    <div class="col-sm-5">
                    </div>
                    <div class="pagination col-sm-5" id="nav">
                    </div>
                    <div class="col-sm-2">
                    </div>
                </div>

                <div>
                    <div id="DetailModal" class="modal fade" data-keyboard="false" data-backdrop="static" role="dialog">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-body" id="ModelContent">

                                    <input type="hidden" id="HdConfigCode" value="0" />
                                    <div class="" style="padding: 10px;">
                                        <h4 style="text-align: center; margin-left: 0; font-family: 'Roboto'">Incentive Configuration</h4>
                                        <div style="height: 100%">
                                            <div class="form-group; col-sm-12">
                                                <input type="hidden" id="HDCLIENT_CODE" value="0" />
                                                <div class="col-sm-4">
                                                    <label>Configuration Name</label>
                                                    <input type="text" class="form-control input-sm" id="ConfigName" maxlength="100" placeholder="Configuration Name" />
                                                </div>
                                                <div class="col-sm-4">
                                                    <label>Configuare By</label>
                                                    <input type="text" class="form-control input-sm" id="ConfigBy" maxlength="100" placeholder="Configuare By" disabled="disabled" />
                                                </div>
                                                <div class="col-sm-4">
                                                    <label>Configuration Level</label>
                                                     <select id="ConfigLevel" class="form-control input-sm" style="width: 100%">
                                                        <option value="">Select</option>
                                                           <option value="5">State</option>
                                                           <option value="4">District</option>
                                                           <option value="3">Town</option>
                                                           <option value="2">Distributer</option>
                                                          <option value="1">Dealer</option>
                                                    </select>
                                                     
                                                </div>

                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                 <div class="col-sm-4">
                                                    <label>Select Entity</label>
                                                     <select id="EntityCode" class="form-control input-sm" style="width: 100%">
                                                        <option value="">Select</option>
                                                    </select>
                                                     
                                                </div>
                                                <div class="col-sm-4">
                                                    <label>Remarks</label>
                                                    <textarea class="form-control" placeholder="Remarks" id="Remarks" maxlength="200" cols="2" rows="1"></textarea>
                                                </div>
                                               
                                                <div class="col-sm-4">
                                                    <label>Active</label>
                                                    <br>
                                                    <input type="checkbox" id="Active" />
                                                </div>
                                            </div>
                                            <br />
                                        </div>

                                    </div>

                                      <div class="" style="padding: 10px;">
                                      
                                        <div style="height: 100%">
                                            <div class="form-group; col-sm-12" style="border:1px solid silver;margin-top:2%;margin-bottom:2%;background-color:lavender" >
                                                 <h4 style=" margin-left: 0; font-family: 'Roboto';font-size:13px">Model Configuration</h4>
                                                <div class="col-sm-4">
                                                    <label>Model</label>
                                                   <select id="Model" class="form-control input-sm" style="width: 100%">
                                                        <option value="">Select</option>
                                                        
                                                    </select>
                                                </div>
                                               
                                                <div class="col-sm-4">
                                                    <label>From Date</label>
                                                     <input type="text" id="FromDate" class="form-control datepicker" />
                                                </div>
                                                 <div class="col-sm-4">
                                                    <label>To Date</label>
                                                      <input type="text" id="ToDate" class="form-control datepicker" />
                                                </div>
                                                  <br />
                                                <br />
                                                <br />
                                                <br />
                                                 <div class="col-sm-4">
                                                    <label>Incentive Amt</label>
                                                    <input type="text" class="form-control input-sm" id="IncentiveAmt" maxlength="100" placeholder="Incentive Amt" />
                                                </div>
                                              <div class="col-sm-2">
                                                   <input type="button" class="btn btn-primary" value="Add" id="AddProduct" style="width:100%;margin-top:2%;" />
                                                </div>

                                                     <div class="form-group">
                                                    <div class="">
                                                        <div class="panel-body" style="overflow: auto; width: 100%">
                                                            <table class="imagetable" id="ProductTbl" style="width: 100%; background-color: whitesmoke; font-size: 10px">
                                                                <tr style="background-color: #dcdcdc" id="row">
                                                                  
                                                                    <th scope="col" style="display: none">ModelCode</th>
                                                                    <th scope="col">Model</th>
                                                                    <th scope="col">Incentive Amt</th>
                                                                    <th scope="col">From Date
                                                                    </th>
                                                                    <th scope="col">To Date</th>
                                                                   
                                                                    <th style="" class='noExl'>Action</th>
                                                                </tr>
                                                            </table>


                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <br />
                                        </div>

                                    </div>

                                </div>
                                <div class="modal-footer">
                                    <input type="button" value="Save" style="" class="btn btn-success" id="btnSave" />
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                </div>
                            </div>

                        </div>
                    </div>
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
     <script src="Scripts/jquery-3.4.1.js"></script>
    <link href="Scripts/ConfirmBox/Datepicker.css" rel="stylesheet" />
<script src="Scripts/ConfirmBox/Dapicker_Jquery.js"></script>
    <script src="Scripts/bootstrap.js"></script>
      <script src="Scripts/jquery-3.4.1.js"></script>

    <script src="Scripts/Pages/IncentiveConfigJS.js"></script>
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
    </script>
    <script>
        
    </script>
</asp:Content>
