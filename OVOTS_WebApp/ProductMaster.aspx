<%@ Page Title="" Language="C#" MasterPageFile="~/Main.Master" AutoEventWireup="true" CodeBehind="ProductMaster.aspx.cs" Inherits="OVOTS_WebApp.ProductMaster" %>

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
        <h2 style="text-align: center; margin-left: 0; font-family: 'Roboto';margin-top:30px">Product Master</h2>
        <div style="width: 100%;">
            <div class="form-group; col-sm-12" style="border: 1px solid black; padding: 20px">
                <div class="col-sm-2">
                    <label>Filter Type</label>
                    <select id="ddlFilterType" class="form-control input-sm" style="width: 100%">
                        <option value="">Select</option>
                        <option value="Product Category">Product Category</option>
                        <option value="Sub Category">Sub Category</option>
                        <option value="Model">Model</option>
                        <option value="Serial No">Serial No</option>
                        <option value="Dealer">Dealer</option>
                        <option value="Distributer">Distributer</option>
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
               <%-- <div class="form-group; col-sm-3" style="border-left: 1px solid black;">
                    <div class="col-sm-10">
                        <label>Select File</label>
                        <asp:FileUpload ID="flupDocFilePath" runat="server" Style="margin-top: 4%;" AllowMultiple="false" />

                    </div>
                    <div class="col-sm-1">
                        <br />
                        <input type="button" value="Upload" class="btn btn-success" id="clkUpload" runat="server" onserverclick="clkUpload_ServerClick" />
                    </div>
                </div>--%>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            <div class="form-group; col-sm-12" style="border: 1px solid black; padding: 20px; background-color: #D8D8D8; overflow: auto">

                <table class="imagetable" id="DistributerMasterTbl" style="width: 130%; background-color: whitesmoke; font-size: 12px">
                    <tr style="background-color: #D8D8D8">
                        <th style="" class='noExl'>Action</th>
                        <th style="">Product Code</th>
                        <th style="">Product Category</th>
                        <th style="">Sub Category</th>
                        <th style="">Model</th>
                        <th style="">Serial No.</th>
                        <th style="">State</th>
                        <th style="">District</th>
                        <th style="">Town</th>
                        <th style="">Dealer</th>
                        <th style="">Dealer No.</th>
                        <th style="">Distributer</th>
                        <th style="">Distributer No.</th>
                        <th style="">Incentive Amt</th>

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

                                    <input type="hidden" id="HdProductCode" value="0" />
                                    <div class="" style="padding: 10px;">
                                        <h4 style="text-align: center; margin-left: 0; font-family: 'Roboto'">Product Details</h4>
                                        <div style="height: 100%">
                                            <div class="form-group; col-sm-12">
                                                <input type="hidden" id="HDCLIENT_CODE" value="0" />
                                                <div class="col-sm-4">
                                                    <label>Product Category</label>
                                                    <input type="text" class="form-control input-sm" id="ProductCat" maxlength="100" placeholder="Product Category" />
                                                </div>
                                                <div class="col-sm-4">
                                                    <label>Sub Category</label>
                                                    <input type="text" class="form-control input-sm" id="SubCat" maxlength="100" placeholder="Sub Category" />
                                                </div>
                                                <div class="col-sm-4">
                                                    <label>Model</label>
                                                     <select id="Model" class="form-control input-sm" style="width: 100%">
                                                        <option value="">Select</option>
                                                    </select>
                                                     
                                                </div>

                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                <div class="col-sm-4">
                                                    <label>Serial No</label>
                                                    <input type="text" class="form-control input-sm" id="SerialNo" maxlength="50" placeholder="Serial No" />
                                                </div>

                                                <div class="col-sm-4">
                                                    <label>Dealer</label>
                                                    <select id="DealerCode" class="form-control input-sm" style="width: 100%">
                                                        <option value="">Select</option>
                                                    </select>
                                                </div>
                                                <div class="col-sm-4">
                                                    <label>Incentive Amt</label>
                                                    <input type="numeric" class="form-control input-sm" id="IncentiveAmt" maxlength="5" placeholder="Incentive Amt" disabled="disabled" />
                                                </div>


                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                <div class="col-sm-4">
                                                    <label>Distributer Name</label>
                                                   <select id="DistributerCode" class="form-control input-sm" style="width: 100%">
                                                        <option value="">Select</option>
                                                    </select>
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
    <link href="Scripts/ConfirmBox/Datepicker.css" rel="stylesheet" />
    <script src="Scripts/ConfirmBox/Dapicker_Jquery.js"></script>
    <script src="Scripts/bootstrap.js"></script>
    <script src="Scripts/jquery-3.4.1.js"></script>
    <script src="Scripts/Pages/ProductMasterJs.js"></script>
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
</asp:Content>
