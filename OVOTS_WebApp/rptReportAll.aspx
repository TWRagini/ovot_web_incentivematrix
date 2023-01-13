<%@ Page Title="" Language="C#" MasterPageFile="~/Main.Master" AutoEventWireup="true" CodeBehind="rptReportAll.aspx.cs" Inherits="OVOTS_WebApp.rptReportAll" %>
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
        <h2 style="text-align: center; margin-left: 0; font-family: 'Roboto'" runat="server" id="lblheading">Incentive Report</h2>
    <div style="width:108%;margin-left:-50px">
        <div class="form-group; col-sm-12" style="border: 1px solid black; padding: 20px">
            <div class="col-sm-2">
                <label>Filter Type</label>
                <select id="ddlFilterType" class="form-control input-sm" style="width: 100%" runat="server">
                    <option value="">Select</option>
                    <option value="ProductSrNoE">Product Serial No</option>
                    <option value="Dealer">Dealer</option>
                    <option value="Customer">Customer</option>
                    <option value="Model">Modal</option>
                    <option value="ISDCode">ISD</option>
                    <option value="ApproveStatus">Approve Status</option>
                </select>
            </div>
            <div class="col-sm-2">
                <label>Filter Value</label>
                <input type="text" id="FilterValue" class="form-control input-sm" runat="server"/>
            </div>
             <div class="col-sm-2">
                        <label>From Date</label>
                        <input type="text" id="FromDate" class="form-control datepicker" runat="server" />
                    </div>
                    <div class="col-sm-2">
                        <label>To Date</label>
                        <input type="text" id="ToDate" class="form-control datepicker" runat="server"/>
                    </div>
            <div class="col-sm-2" id="rptType" runat="server">
                <label>Report Type</label>
               <select id="ddlReportType" class="form-control input-sm" style="width: 100%" runat="server">
                      <option value="Detail">Detail</option>
                    <option value="Summary">Summary</option>
                  
                   
                </select>
            </div>
            <div class="col-sm-1">
                <br />
                <input type="button" value="Search" class="btn btn-primary" id="clkSearch" runat="server" onserverclick="clkSearch_ServerClick" />
            </div>
          
            <div class="col-sm-1">
                <br />
                <a id="GenExcel" runat="server" onserverclick="GenExcel_ServerClick">
                        <img src="Img/Excel-icon.png" />
                    </a>

            </div>
           <%-- <div class="col-sm-2">
                <label>More Filter</label>
                    <input type="text" id="Search" class="form-control input-sm" placeholder="Search" style="width: 200px;" />
            </div>--%>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

        <div class="form-group; col-sm-12" style="border: 1px solid black; padding: 20px; background-color: #D8D8D8;overflow:auto">
 <asp:GridView ID="grdReport" runat="server" CssClass="Grid" AutoGenerateColumns="true" Width="450%" OnPageIndexChanging="grdReport_PageIndexChanging"
                                EmptyDataText="No records has been added." HeaderStyle-Height="30px" CellPadding="3" ForeColor="Black" BorderColor="#999999" BackColor="White" BorderStyle="Solid" BorderWidth="1px"   AllowPaging ="true" PageSize="20">
                                       
                                <AlternatingRowStyle BackColor="White" />
                                <EditRowStyle BackColor="#2461BF"  />
                                <FooterStyle Font-Bold="True" ForeColor="White" />
                                <HeaderStyle BackColor="#003B70" Font-Bold="True" ForeColor="#ffffff" HorizontalAlign="Center" CssClass="gvhspadding" Height="30px" />
                                <PagerStyle BackColor="#2461BF" HorizontalAlign="Center" />
                                <RowStyle BackColor="#EFF3FB" Height="30px"  />
                                <SelectedRowStyle BackColor="#D1DDF1" Font-Bold="True" ForeColor="#333333" />
                                <SortedAscendingCellStyle BackColor="#F5F7FB" />
                                <SortedAscendingHeaderStyle BackColor="#6D95E1" />
                                <SortedDescendingCellStyle BackColor="#E9EBEF" />
                                <SortedDescendingHeaderStyle BackColor="#4870BE" />
                                <PagerStyle HorizontalAlign="center" CssClass="GridPager" />
                            </asp:GridView>
                            <asp:Label ID="lblNotFound" runat="server" Style="font-size: 13px; color: red"></asp:Label>

            <div>
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
  
    <script>
   $("#ContentPlaceHolder1_FromDate").datepicker({ dateFormat: 'dd/mm/yy' });
        $("#ContentPlaceHolder1_ToDate").datepicker({ dateFormat: 'dd/mm/yy' });
        </script>
</asp:Content>
