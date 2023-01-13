<%@ Page Title="" Language="C#" MasterPageFile="~/Main.Master" AutoEventWireup="true" CodeBehind="UserMaster.aspx.cs" Inherits="OVOTS_WebApp.UserMaster" %>

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
        <h2 style="text-align: center; margin-left: 0; font-family: 'Roboto'; margin-top: 30px">User Master</h2>
        <div style="width: 100%;">
            <div class="form-group; col-sm-12" style="border: 1px solid black; padding: 20px">
                <div class="col-sm-2">
                    <label>Filter Type</label>
                    <select id="ddlFilterType" class="form-control input-sm" style="width: 100%">
                        <option value="">Select</option>
                        <option value="User Role">User Role</option>
                        <option value="User Name">User Name</option>
                        <option value="Contact No">Contact No</option>
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

                </div>
                <asp:HiddenField ID="hdFilterValue" runat="server" />
                <asp:HiddenField ID="hdFilterType" runat="server" />
                 <asp:HiddenField ID="HDUserPrevRole" runat="server" Value="0"/>
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
             <input type="hidden" id="HDUserCode" value="0" />
            <div class="form-group; col-sm-12" style="border: 1px solid black; padding: 20px; background-color: #D8D8D8; overflow: auto">

                <table class="imagetable" id="DistributerMasterTbl" style="width: 150%; background-color: whitesmoke; font-size: 12px">
                    <tr style="background-color: #D8D8D8">
                        <th style="" class='noExl'>Action</th>
                        <th style="">User Code</th>
                        <th style="">User Id</th>
                        <th style="">User Name</th>
                        <th style="">User Type</th>
                        <th style="">Contact Number</th>
                          <th style="">User Role</th>
                        <th style="">User Level</th>
                      

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
                                        <h4 style="text-align: center; margin-left: 0; font-family: 'Roboto'">User Details</h4>
                                        <div style="height: 100%">
                                            <div class="form-group; col-sm-12">
                                                <input type="hidden" id="HDDealerCode" value="0" />
                                                <div class="col-sm-4">
                                                    <label>User Contact Number</label>
                                                    <input type="number" oninput="this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');" onkeydown="if(this.value.length==12 && event.keyCode!=8) return false;" class="form-control input-sm" id="ContactNumber" maxlength="100" placeholder="Contact No" disabled="disabled" />
                                                </div>
                                              
                                                   <div class="col-sm-4">
                                                    <label>User Name</label>
                                                   <input type="text" class="form-control input-sm" id="UserName" maxlength="100" placeholder="User Name" />
                                                </div>
                                                <div class="col-sm-4">
                                                    <label>User Role</label>
                                                    <select id="UserRole" class="form-control input-sm" style="width: 100%">
                                                        <option value="">Select</option>
                                                    </select>
                                                </div>
                                                
                                              
                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                               

                                               
                                                 <div class="col-sm-4">
                                                    <label>User Type</label>
                                                    <select id="UserType" class="form-control input-sm" style="width: 100%" disabled="disabled">
                                                      
                                                        <option value="INTERNAL">INTERNAL</option>
                                                        <option value="EXTERNAL">EXTERNAL</option>
                                                    </select>
                                                </div>
                                                  <div class="col-sm-4">
                                                    <label>Email Id</label>
                                                    <input type="text" class="form-control input-sm" id="txtEmail" maxlength="100" placeholder="Email Id" />
                                                </div>
                                                 <div class="col-sm-4">
                                                    <label>Remarks</label>
                                                    <input type="text" class="form-control input-sm" id="Remarks" maxlength="250" placeholder="Remarks" />
                                                </div>
                                               
                                                 <div class="col-sm-4" style="display:none">
                                                  
                                                    <input type="text" class="form-control input-sm" id="UserId" maxlength="250" placeholder="Remarks" />
                                                       <input type="text" class="form-control input-sm" id="UserLevel" maxlength="250" placeholder="Remarks" />
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
                                     <input type="button" value="Reset Password" style="display:none" class="btn btn-info" id="btnReset"   />
                                    <input type="button" value="Save" style="" class="btn btn-success" id="btnSave" />
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                            <div runat="server" id="Msg" style="display: none"></div>
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

    <script src="Scripts/jquery-3.4.1.js"></script>
    <script src="Scripts/bootstrap.js"></script>
    <script src="Scripts/Pages/UserMasterJS.js"></script>
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
