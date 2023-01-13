<%@ Page Title="" Language="C#" MasterPageFile="~/Main.Master" AutoEventWireup="true" CodeBehind="Landing.aspx.cs" Inherits="OVOTS_WebApp.Landing" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:ScriptManager runat="server" ID="SCIPT5"></asp:ScriptManager>
    <style>
        .panel-default {
            border-color: #A6ACAF !important;
        }

        footer {
            position: fixed;
            bottom: 0;
            margin-left: 450px
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

        <div class="" style="padding: 20px; margin-top: 90px">
            <div class="form-group; col-sm-12">
                <div class="col-sm-1">
                </div>
               
                <asp:Repeater runat="server" ID="rpt_MainMenu">
                    <ItemTemplate>
                         <asp:UpdatePanel runat="server" ID="UpdatePanel1">
                            <ContentTemplate>
                                <asp:Label ID="lblMenuHDCode" runat="server" Visible="false" Text='<%# Eval("MenuCode") %>'></asp:Label>
                                <a style="cursor: pointer;color:#000" title='<%#Eval("MenuName") %>' id="aMenuHead" runat="server" onserverclick="aMenuHead_ServerClick" name='<%#Eval("MenuCode") %>'>
                                    <div class="col-sm-3" id="MDiv">
                                        <div class="panel panel-default" id="MSEc">
                                            <div class="panel-body" style="text-align: center">
                                                <img src="<%#Eval("ImagePath") %>" style="height: 100px" /><br />
                                                <br />
                                                <%#Eval("MenuName") %>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                           </ContentTemplate>
                        </asp:UpdatePanel>
                    </ItemTemplate>
                </asp:Repeater>
                                 
                <%-- <div class="col-sm-3" id="TDiv">
                    <div class="panel panel-default" data-toggle="modal" data-target="#myModal2">
                        <div class="panel-body" style="text-align: center">
                            <img src="Img/TRANSACTION.png" style="height: 100px" /><br />
                            <br />
                            Transactions
                        </div><img src="Img/MASTERS.png" />
                    </div>
                </div>
                <div class="col-sm-3" id="RDiv">
                    <div class="panel panel-default" data-toggle="modal" data-target="#myModal3" id="RSec" style="display: none">
                        <div class="panel-body" style="text-align: center">
                            <img src="Img/REPORTS.png" style="height: 100px" /><br />
                            <br />
                            Reports
                        </div>
                    </div>
                </div>--%>

                <div class="col-sm-2">
                </div>
            </div>
            <%--  <div class="form-group; col-sm-12">
            <div class="col-sm-3">
            </div>
            <div class="col-sm-6" id="RPTDiv" style="display:none">
                <div class="panel panel-default">
                    <div class="panel-body" style="text-align: left;font-size:13px">
                        1. Billing Details not updated for more than (30 days) : <a><span id="BillCnt" class="pointerOnAnchor"></span></a>  <br />
                        2. Payment not made (10 Days) before MSME Due Date : <a><span id="PayMSMECnt" class="pointerOnAnchor"></span></a>
                        3. Payment not made (10 Days) before GST Due Date : <a><span id="PayCnt" class="pointerOnAnchor"></span></a>
                    </div>
                </div>
            </div>
            <div class="col-sm-3">
            </div>
        </div>--%>
        </div>
         <asp:UpdatePanel runat="server" ID="ups1">
                            <ContentTemplate>
        <div id="myModal" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg" style="width: 500px">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title" id="popupH1" runat="server">Masters</h4>
                    </div>
                    <div class="modal-body" id="ModalBody">
                        <div>
                            <div class="col-sm-12">
                                <div class="col-sm-7">
                                    <ul id="Menus" style="width: 100%">
                                        <asp:Repeater ID="rpt_SubMenu" runat="server">
                                            <ItemTemplate>
                                                <li>
                                                    <p style='height: 11px'><a href="<%#Eval("PageLink") %>"><%#Eval("MenuDTName") %></a></p>
                                                </li>
                                            </ItemTemplate>
                                        </asp:Repeater>
                                        <%--  <li>
                                            <p style='height: 11px'><a href="ISDMaster.aspx">ISD Master</a></p>
                                        </li>
                                        <li>
                                            <p style='height: 11px'><a href="ProductMaster.aspx">Product Master</a></p>
                                        </li>
                                      

                                        <hr style="border-top: 3px solid #eeeeee" />

                                        <li>
                                            <p style='height: 11px'><a href="UploadData.aspx?PG=ISD">Upload ISD Master</a></p>
                                        </li>--%>
                                    </ul>
                                </div>
                                <div class="col-sm-1">
                                    <ul id="Menus1" style="">
                                    </ul>
                                </div>
                                <div class="col-sm-4">
                                </div>
                            </div>
                            <div class="modal-footer" style='border: none;'>
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
                                </ContentTemplate>
             </asp:UpdatePanel>
        <%--   <div id="myModal3" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg" style="width: 500px">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title" id="Head">Reports</h4>
                    </div>
                    <div class="modal-body" id="ModalBody">
                        <div>
                            <div class="col-sm-12">
                                <div class="col-sm-7">
                                    <ul id="Menus" style="width: 100%">
                                        <li>
                                            <p style='height: 11px'><a href="rptReportAll.aspx?id=Invoice">Incentive Report</a></p>
                                        </li>
                                        <li>
                                            <p style='height: 11px'><a href="rptReportAll.aspx?id=DealerInvoice">Dealer Incentive Report</a></p>
                                        </li>
                                     
                                    </ul>
                                </div>
                                <div class="col-sm-1">
                                    <ul id="Menus1" style="">
                                    </ul>
                                </div>
                                <div class="col-sm-4">
                                </div>
                            </div>
                            <div class="modal-footer" style='border: none;'>
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div id="myModal2" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg" style="width: 500px">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title" id="Head2">Transactions</h4>
                    </div>
                    <div class="modal-body" id="ModalBody2">
                        <div>
                            <div class="col-sm-12">
                                <div class="col-sm-7">
                                    <ul id="Menus2" style="width: 100%">
                                        <li>
                                            <p style='height: 11px'><a href="InvoiceApprove.aspx">Customer Invoice Approval</a></p>
                                        </li>
                                        <li>
                                            <p style='height: 11px'><a href="ISDApproval.aspx">ISD KYC Approval</a></p>
                                        </li>
                                        <li>
                                            <p style='height: 11px'><a href="CatalogueOffer.aspx">Product Manual</a></p>
                                        </li>
                                        <li>
                                            <p style='height: 11px'><a href="IssueManagement.aspx">Issue Managment</a></p>
                                        </li>
                                    </ul>
                                </div>
                                <div class="col-sm-1">
                                    <ul id="Menus1" style="">
                                    </ul>
                                </div>
                                <div class="col-sm-4">
                                </div>
                            </div>
                            <div class="modal-footer" style='border: none;'>
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>--%>
        <div class="loader"></div>
    </div>
    <script src="Scripts/jquery-3.4.1.js"></script>
    <link href="Scripts/ConfirmBox/Datepicker.css" rel="stylesheet" />
    <script src="Scripts/ConfirmBox/Dapicker_Jquery.js"></script>
    <script src="Scripts/bootstrap.js"></script>
    <script src="Scripts/jquery-3.4.1.js"></script>

    <script src="Scripts/jquery-3.4.1.js"></script>
    <script src="Scripts/bootstrap.js"></script>
    <script>
        var UserCode = $("#HDUserRole").val();

        if (UserCode == 'WEBADMIN') {
            $("#MSEc").css("display", "block");
            $("#RSec").css("display", "block");
        }

        function ShowModel() {
            
            $('#myModal').modal('show');
        }
    </script>
</asp:Content>
