<%@ Page Title="" Language="C#" MasterPageFile="~/Main.Master" AutoEventWireup="true" CodeBehind="CatalogueOffer.aspx.cs" Inherits="OVOTS_WebApp.CatalogueOffer" %>

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
        <h2 style="text-align: center; margin-left: 0; font-family: 'Roboto';margin-left:30px">Product Manual Master</h2>
        <div style="width: 100%; ">
            <div class="form-group; col-sm-12" style="border: 1px solid black; padding: 20px">
                <div class="col-sm-2">
                    <label>Filter Type</label>
                    <select id="ddlFilterType" class="form-control input-sm" style="width: 100%">
                        <option value="">Select</option>
                        <option value="Category">Category</option>
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
                    <label id="GenExcel">
                        <img src="Img/Excel-icon.png" />
                    </label>

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

            <div class="form-group; col-sm-12" style="border: 1px solid black; padding: 20px; background-color: #D8D8D8">

                <table class="imagetable" id="DistributerMasterTbl" style="width: 100%; background-color: whitesmoke; font-size: 12px">

                    <tr style="background-color: #D8D8D8">
                        <th style="" class='noExl'>Action</th>
                        <th style="">Manual Code</th>
                        <th style="">Category</th>
                         <th style="">Sub Category</th>
                         <th style="">Model</th>
                         <th style="">ShortName</th>
                        <th style="">ContentType</th>
                        <th style="" class='noExl'>Icon</th>
                        <th style="" class='noExl'>file</th>
                        <th style="">Active Till</th>

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
                                        <h4 style="text-align: center; margin-left: 0; font-family: 'Roboto'">Product Manual Details</h4>
                                        <div style="height: 100%">
                                            <div class="form-group; col-sm-12">
                                                <input type="hidden" id="HDCatalogueCode" value="0" />
                                                <div class="col-sm-4">
                                                    <label>Category</label>
                                                    <select id="Category" class="form-control input-sm" style="width: 100%">
                                                        <option value="">Select</option>
                                                    </select>
                                                </div>
                                                <div class="col-sm-4">
                                                    <label>Sub Category</label>
                                                    <select id="SubCategory" class="form-control input-sm" style="width: 100%">
                                                        <option value="">Select</option>
                                                    </select>
                                                </div>
                                                 <div class="col-sm-4">
                                                    <label>Model</label>
                                                    <select id="ModelP" class="form-control input-sm" style="width: 100%">
                                                        <option value="">Select</option>
                                                    </select>
                                                </div>
                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                   <div class="col-sm-4">
                                                    <label>Content Type</label>
                                                    <select id="ContentType" class="form-control input-sm" style="width: 100%">
                                                        <option value="">Select</option>
                                                          <option value="PDF">PDF</option>
                                                          <option value="Word Document">Word Document</option>
                                                          <option value="IMAGE">IMAGE</option>
                                                          <option value="WEB LINK">WEB LINK</option>
                                                          <option value="YOUTUBE">YOUTUBE</option>
                                                    </select>
                                                </div>
                                                 <div class="col-sm-4">
                                                    <label>Short Name</label>
                                                    <input type="text" class="form-control input-sm" id="ShortName" maxlength="50" placeholder="Short Name" />
                                                </div>
                                                 <div class="col-sm-4">
                                                    <label>Active Till</label>
                                                    <input type="text" class="form-control input-sm" id="ActiveTill" maxlength="50" placeholder="Active Till" />
                                                </div>
                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                <div class="col-sm-6">
                                                    <label>Icon</label>
                                                    <input type="file" id="flpiconFilePath" accept="image/jpg,image/png,image/jpeg,image/gif" />
                                                </div>
                                                <div class="col-sm-6">
                                                    <label>File / Link</label>
                                                    <input type="file" id="flpFilePath" />
                                                     <input type="text" class="form-control input-sm" id="Link" maxlength="250" placeholder="Link"  style="max-width:100%"/>

                                                </div>
                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                <div class="col-sm-6" style="height: 200px; border: 1px solid silver">
                                                    <img src="" id="iconFilePath" style="width: 100%; height: 100%" onerror="this.style.display='none'"/>
                                                </div>
                                                <div class="col-sm-6" style="height: 200px; border: 1px solid silver">
                                                    <a id="aFilePath" style="display:none" target="_blank">View File</a>
                                                    <img src="" id="FilePath" style="width: 100%; height: 100%" onerror="this.style.display='none'"/>
                                                </div>

                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                <div class="col-sm-4">
                                                    <label>Remarks</label>
                                                    <textarea class="form-control" placeholder="Remarks" id="Remarks" maxlength="200" cols="2" rows="2"></textarea>
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
    <script src="Scripts/CatalogueOfferJS.js?vr=1.0"></script>

</asp:Content>

