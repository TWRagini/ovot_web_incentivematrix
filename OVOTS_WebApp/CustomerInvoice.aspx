<%@ Page Title="" Language="C#" MasterPageFile="~/Main.Master" AutoEventWireup="true" CodeBehind="CustomerInvoice.aspx.cs" Inherits="OVOTS_WebApp.CustomerInvoice" %>

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
        <h2 style="text-align: center; margin-left: 0; font-family: 'Roboto';margin-left:30px">Customer Invoice Update</h2>
        <div style="width: 100%;">
            <div class="form-group; col-sm-12" style="border: 1px solid black; padding: 20px">
                <div class="col-sm-2">
                    <label>Filter Type</label>
                    <select id="ddlFilterType" class="form-control input-sm" style="width: 100%">
                        <option value="">Select</option>
                        <option value="Customer">Customer</option>
                        <option value="InvoiceNo">Invoice No</option>
                        <option value="ISD">ISD</option>
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

                <div class="col-sm-1">
                    <br />
                    <label id="GenExcel">
                        <img src="Img/Excel-icon.png" />
                    </label>

                </div>
                <div class="col-sm-3">
                    <label>More Filter</label>
                    <input type="text" id="Search" class="form-control input-sm" placeholder="Search" style="width: 200px;" />
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            <div class="form-group; col-sm-12" style="border: 1px solid black; padding: 20px; background-color: #D8D8D8; overflow: auto">

                <table class="imagetable" id="DistributerMasterTbl" style="width: 100%; background-color: whitesmoke; font-size: 12px">
                    <tr style="background-color: #D8D8D8">
                        <th style="" class='noExl'>Action</th>
                        <th style="">Invoice No</th>
                        <th style="">Customer</th>
                        <th style="">MobileNo</th>
                        <th style="">ISD</th>
                        <th style="">Invoice File</th>

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
                                    <div class="" style="padding: 10px;">
                                        <h4 style="text-align: center; margin-left: 0; font-family: 'Roboto'">Invoice Details</h4>
                                        <div style="height: 100%">
                                           
                                                <input type="hidden" id="HDInvoiceNo" value="0" />
                                                 <div class="col-sm-4">
                                                    <label>Invoice No</label>
                                                    <input type="text" class="form-control input-sm" id="InvoiceNo" maxlength="150" placeholder="Invoice No" />
                                                </div>
                                                <div class="col-sm-4">
                                                    <label>Customer</label>
                                                    <input type="text" class="form-control input-sm" id="Customer" maxlength="150" placeholder="Customer" />
                                                </div>
                                                <div class="col-sm-4">
                                                    <label>Mobile No</label>
                                                    <input type="number" oninput="this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');" onkeydown="if(this.value.length==12 && event.keyCode!=8) return false;" class="form-control input-sm" id="MobileNo" maxlength="100" placeholder="Mobile No" />
                                                </div>
                                               
                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                 <div class="col-sm-4">
                                                    <label>ISD</label>
                                                    <select id="ISDCode" class="form-control input-sm" style="width: 100%">
                                                        <option value="">Select</option>
                                                    </select>
                                                </div>
                                                <div class="col-sm-4">
                                                    <label>Invoice File</label>
                                                    <br />
                                                    <%--<input type="file" class="form-control input-sm" id="flInvoice" />--%>
                                                    <a id="InvoiceFilePath" target="_blank" href="" class="clkFile pointerOnAnchor">View</a>
                                                </div>

                                           <br />
                                                <br />
                                                <br />
                                                <br />
                                           
                                                <div class="col-sm-8">
                                                    <label>Product</label>
                                                    <select id="ProductCode" class="form-control input-sm" style="max-width:500px">
                                                        <option value="">Select</option>
                                                    </select>
                                                </div>
                                                <div class="col-sm-1">
                                                    <br />
                                                    <input type="button" value="Add" class="btn btn-primary" id="clkAdd" />
                                                </div>
                                         <br />
                                                <br />
                                                <br />
                                                <br />
                                            <div class="form-group; col-sm-12">
                                                <table class="imagetable" id="ProductMasterTbl" style="width: 100%; background-color: whitesmoke; font-size: 12px">
                                                    <tr style="background-color: #D8D8D8">
                                                        <th style="" class='noExl'>Action</th>
                                                        <th style="display:none">ProductCode</th>
                                                        <th style="">Product Category</th>
                                                        <th style="">Sub Category</th>
                                                        <th style="">Serial No</th>
                                                        <th style="">Model</th>
                                                        <th style="">Dealer</th>
                                                        <th style="">Incentive Amt</th>
                                                    </tr>

                                                </table>
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
    <script src="Scripts/CustomerInvoiceJS.js"></script>
</asp:Content>
