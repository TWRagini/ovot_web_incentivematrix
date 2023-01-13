<%@ Page Title="" Language="C#" MasterPageFile="~/Main.Master" AutoEventWireup="true" CodeBehind="IssueManagement.aspx.cs" Inherits="OVOTS_WebApp.IssueManagement" %>

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
        <h2 style="text-align: center; margin-left: 0; font-family: 'Roboto';margin-top:30px">Issue Management</h2>
        <div style="width: 100%; ">
            <div class="form-group; col-sm-12" style="border: 1px solid black; padding: 20px">
                <div class="col-sm-2">
                    <label>Filter Type</label>
                    <select id="ddlFilterType" class="form-control input-sm" style="width: 100%">
                        <option value="">Select</option>
                        <option value="IssueType">Issue Type</option>
                        <option value="Dealer">Dealer</option>
                        <option value="CurrentLevel">Current Level</option>
                          <option value="PendingWith">Pending With</option>
                        <option value="Status">Status</option>
                    </select>
                </div>
                <div class="col-sm-2">
                    <label>Filter Value</label>
                    <input type="text" id="FilterValue" class="form-control input-sm" />
                </div>
                <div class="col-sm-2">
                    <label>From Date</label>
                    <input type="text" id="FromDate" class="form-control datepicker" />
                </div>
                <div class="col-sm-2">
                    <label>To Date</label>
                    <input type="text" id="ToDate" class="form-control datepicker" />
                </div>
               <%-- <div class="col-sm-2">
                    <label>Issue Status</label>
                    <select id="IssueStatus" class="form-control input-sm" style="width: 100%">
                        <option value="Registered">Registered</option>
                        <option value="Process">In-Process</option>
                        <option value="Resolved">Resolved</option>

                    </select>
                </div>--%>
                <div class="col-sm-1">
                    <br />
                    <input type="button" value="Search" class="btn btn-primary" id="clkSearch" />
                </div>

                <div class="col-sm-1">
                    <br />
                   <%-- <a id="GenExcel" runat="server" onserverclick="GenExcel_ServerClick">
                        <img src="Img/Excel-icon.png" />
                    </a>--%>
                    <asp:HiddenField ID="hdFilterValue" runat="server" />
                    <asp:HiddenField ID="hdFilterType" runat="server" />
                    <asp:HiddenField ID="hdfromdt" runat="server" />
                    <asp:HiddenField ID="hdtodt" runat="server" />
                    <asp:HiddenField ID="hdIssueCode" runat="server" />
                </div>
                <div class="col-sm-2">
                    <label>More Filter</label>
                    <input type="text" id="Search" class="form-control input-sm" placeholder="Search" style="width: 100%;" />
                </div>
            </div>

            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            <div class="form-group; col-sm-12" style="border: 1px solid black; padding: 20px; background-color: #D8D8D8; overflow: auto">
                <table class="imagetable" id="Invoicetbl" style="width: 200%; background-color: whitesmoke; font-size: 12px;">
                    <tr style="background-color: #D8D8D8">
                        <th style="width: 6% !important" class='noExl'>Action</th>
                         <th style="display:none">Issue Code</th>
                        <th style="">Dealer</th>
                        <th style="">Issue Type</th>
                        <th style="">Issue Level</th>
                        <th style="">Issue Date</th>
                        <th style="">Current Status</th>
                        <th style="">Current Level</th>
                      
                        <th style="">Resolve By</th>
                          <th style="">Resolve Date</th>
                        <th style="">Pending With</th>
                        <th style="">Days Since Open</th>
                    </tr>
                  <%--  <tr>
                        <th style="width: 6% !important" class='noExl '><a class="clkApprove">Click To Action</a> </th>
                        <th style="">ASHIRWAD ELECTRONICS</th>
                        <th style="">Other</th>
                        <th style="">High</th>
                        <th style="">28-Nov-2021</th>
                      
                        <th style="">In-Process</th>
                        <th style="">ASM</th>
                        <th style="">MK DISTRIBUTORS</th>
                        <th style="">3</th>
                    </tr>--%>
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
                                    <div class="" style="padding: 10px;">
                                        <h4 style="text-align: center; margin-left: 0; font-family: 'Roboto'">Issue Action Details</h4>
                                        <div style="height: 100%">
                                            <div class="form-group; col-sm-12" style="border:1px solid silver">
                                                <input type="hidden" id="HUploadCode" value="0" />
                                                <div class="col-sm-4" style="margin-top:1%">
                                                    <label>Issue Type</label>
                                                    <input type="text" class="form-control input-sm" id="ISSUE_TYPE" maxlength="100" placeholder="Issue Type" disabled="disabled" />
                                                </div>
                                                <div class="col-sm-4"  style="margin-top:1%">
                                                    <label>Dealer</label>
                                                    <input type="text" class="form-control input-sm" id="DEALER" maxlength="100" placeholder="Dealer" disabled="disabled"/>
                                                </div>
                                                <div class="col-sm-4"  style="margin-top:1%;margin-bottom:1%">
                                                    <label>Issue Description</label>
                                                    <textarea class="form-control" placeholder="Issue Description" id="IssueDesciption" maxlength="200" cols="2" rows="2" disabled="disabled"></textarea>
                                                </div>
                                            </div>
                                             <div class="form-group; col-sm-12" style="border:1px solid silver">
                                               <div class="col-sm-4"  style="margin-top:1%">
                                                    <label>Previous User Level</label>
                                                    <input type="text" class="form-control input-sm" id="PREVUSERLEVEL" maxlength="100" placeholder="Prev User Level" disabled="disabled"/>
                                                </div>
                                                <div class="col-sm-4" style="margin-top:1%">
                                                    <label>Previous User</label>
                                                    <input type="text" class="form-control input-sm" id="PREVUSER" maxlength="100" placeholder="Prev User" disabled="disabled" />
                                                </div>
                                                
                                                <div class="col-sm-4"  style="margin-top:1%;margin-bottom:1%">
                                                    <label>Forward Details</label>
                                                    <textarea class="form-control" placeholder="Forward Details" id="ForDetails" maxlength="200" cols="2" rows="2" disabled="disabled"></textarea>
                                                </div>
                                            </div>
                                            <div class="form-group; col-sm-12" style="margin-top: 4%">
                                                <div class="col-sm-4">
                                                    <label>Action Type</label>
                                                    <select id="ActionType" class="form-control input-sm" style="width: 100%">
                                                        <option value="">Select</option>
                                                        <option value="Forward">Forward</option>
                                                        <option value="Resolve">Resolve</option>
                                                    </select>
                                                </div>
                                                <div class="col-sm-4" id="Forward" >
                                                    <label>Forward To</label>
                                                    <select id="ForwardTo" class="form-control input-sm" style="width: 100%">
                                                        
                                                    </select>
                                                </div>
                                                 <div class="col-sm-4">
                                                <input type="text" class="form-control input-sm" id="CURRLEV" style="display:none" />
                                              
                                                    <label id="lblDetail">Forward Details</label>
                                                    <textarea class="form-control" placeholder="Details" id="Details" maxlength="200" cols="2" rows="2"></textarea>
                                                
                                                     </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <div class="modal-footer" style="border-top:none">
                                    <input type="button" value="Save" style="" class="btn btn-success" id="btnSave" />
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
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
    <script src="Scripts/IssueManagmentJS.js"></script>
</asp:Content>
