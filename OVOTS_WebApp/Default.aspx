<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="OVOTS_WebApp.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
   <title>AMSTRAD PROMAX  - Your Profit Maximizer</title>

  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!-- Mobile Specific Metas
  ================================================== -->

    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <link  rel="stylesheet" href="loginjscs/login5-style.css">
  
   <%-- <link href="Content/bootstrap.css" rel="stylesheet" />
    <link href="Content/Site.css" rel="stylesheet" />
    <script src="Scripts/modernizr-2.8.3.js"></script>
    <style>
        .login-box {
            margin: auto;
            max-width: 400px;
        }

        .imgcls {
            background-image: url('Img/TRANSACTION.png');
            background-repeat: no-repeat;
            background-size: 800px 617px;
        }

        .error {
            border-color: red;
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
    </style>--%>

    <style>
        /*.login-box {
            margin: auto;
            max-width: 400px;
        }*/

        /*.imgcls {
            background-image: url('Img/TRANSACTION.png');
            background-repeat: no-repeat;
            background-size: 800px 617px;
        }*/

        .error {
            border-color: red;
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
    <style>
          .error {
            background-color: #f2b9b9;
        }

    </style>
</head>
<body>
      <form id="form1" runat="server">
           <!-- Start Preloader -->
    <div id="preload-block">
      <div class="square-block"></div>
    </div>
    <!-- Preloader End -->
    
    <div class="container-fluid">
      <div class="row">
        <div class="authfy-container col-xs-12 col-sm-10 col-md-8 col-lg-6 col-sm-offset-1 col-md-offset-2 col-lg-offset-3">
          <div class="col-sm-5 authfy-panel-left" style="background-color:rgb(190 234 220)">
            <div class="brand-col" style="padding:0px">
              <div class="headline">
                <!-- brand-logo start -->
                <div class="brand-logo" style="margin-top:-80px">
                  <img src="loginjscs/AMSTRAD_Logo.png" width="250" alt="brand-logo">
                </div><!-- ./brand-logo -->
                <p style="color:#000;text-align:justify">Welcome to OVOT Incentive Management System. This is your gateway for an Encouraging and Rewarding platform for everyone in Supply Chain Link. Please login or register yourself to get to know more details about the same.</p>
                <!-- social login buttons start -->
                <div class="row social-buttons">
                  <div class="col-xs-4 col-sm-4 col-md-12">
                   <%-- <a href="#" class="btn btn-block btn-facebook">
                      <i class="fa fa-facebook"></i> <span class="hidden-xs hidden-sm">Signin with facebook</span>
                    </a>--%>
                  </div>
                  <div class="col-xs-4 col-sm-4 col-md-12">
                   <%-- <a href="#" class="btn btn-block btn-twitter">
                      <i class="fa fa-twitter"></i> <span class="hidden-xs hidden-sm">Signin with twitter</span>
                    </a>--%>
                  </div>
                  <div class="col-xs-4 col-sm-4 col-md-12">
                   <%-- <a href="#" class="btn btn-block btn-google">
                      <i class="fa fa-google-plus"></i> <span class="hidden-xs hidden-sm">Signin with google</span>
                    </a>--%>
                  </div>
                </div><!-- ./social-buttons -->
              </div>
            </div>
          </div>
          <div class="col-sm-7 authfy-panel-right">
            <!-- authfy-login start -->
            <div class="authfy-login">
              <!-- Nav tabs -->
              <ul class="nav nav-tabs nav-justified" role="tablist">
                <li role="presentation" class="active"><a href="#login" data-toggle="tab">Login Here</a></li>
                <li role="presentation"><a href="#signup" data-toggle="tab">How To Register</a></li>
              </ul>
              <div class="tab-content">
                <!-- panel-login start -->
                <div id="login" class="authfy-panel panel-login text-center tab-pane fade in active">
                  <div class="row">
                    <div class="col-xs-12 col-sm-12">
                      <form name="loginForm" class="loginForm" action="#" method="POST">
                        <div class="form-group wrap-input">
                         <%-- <input type="email" class="form-control email" name="username" placeholder="Email address">--%>
                             <input name="txtemail" type="text" id="UserName" class="form-control " placeholder="UserId" maxlength="30" >
                          <span class="focus-input"></span>
                        </div>
                        <div class="form-group wrap-input">
                          <div class="pwdMask">
                           <%-- <input type="password" class="form-control password" name="password" placeholder="Password">--%>
                               <input name="txtpwd" type="password" id="Password" class="form-control password" placeholder="Password">
                           <%-- <span class="focus-input"></span>
                            <span class="fa fa-eye-slash pwd-toggle"></span>--%>
                          </div>
                        </div>
                        <!-- start remember-row -->
                        <div class="row remember-row">
                          <div class="col-xs-6 col-sm-6">
                            <label class="checkbox text-left">
                               <input id="rememberMe" type="checkbox" value="lsRememberMe" name="chkRemeber">
                              <span class="label-text">Remember me</span>
                            </label>
                          </div>
                         <%-- <div class="col-xs-6 col-sm-6">
                            <p class="forgotPwd">
                              <a id="forget-lnk" href="#forgot-pwd" data-toggle="tab">Forgot password?</a>
                            </p>
                          </div>--%>
                        </div> <!-- ./remember-row -->
                        <div class="form-group">
                          <a class="btn btn-lg btn-primary btn-block"  id="btnsubmit">Login</a>
                        </div>
                      </form>
                    </div>
                  </div>
                </div> <!-- ./panel-login -->
                <!-- panel-signup start -->
                <div id="signup" class="authfy-panel panel-signup text-center tab-pane fade">
                  <div class="row">
                    <div class="col-xs-12 col-sm-12">
                      <form name="signupForm" class="signupForm" action="#" method="POST">
                      <p style="color:#000;text-align:justify">For registration, you have to speak to your Sales Manager or write us @ incentive@ovot.in. We will get back to you in due course for your registration and informing you about the details of the schemes</p>
                      </form>
                    </div>
                  </div>
                </div> <!-- ./panel-signup -->
                <!-- panel-forget start -->
                <div id="forgot-pwd" class="authfy-panel panel-forgot tab-pane fade">
                  <div class="row">
                    <div class="col-xs-12 col-sm-12">
                      <div class="authfy-heading">
                        <h3 class="auth-title">Recover your password</h3>
                        <p>Fill in your e-mail address below and we will send you an email with further instructions.</p>
                      </div>
                      <form name="forgetForm" class="forgetForm" action="#" method="POST">
                        <div class="form-group wrap-input">
                          <input type="email" class="form-control" name="username" placeholder="Email address">
                          <span class="focus-input"></span>
                        </div>
                        <div class="form-group">
                          <button class="btn btn-lg btn-primary btn-block" type="submit">Recover your password</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div> <!-- ./panel-forgot -->
              </div> <!-- ./tab-content -->
            </div> <!-- ./authfy-login -->
          </div>
        </div>
      </div> <!-- ./row -->
    </div> <!-- ./container -->
    
    <!-- Javascript Files -->

    <!-- initialize jQuery Library -->
    
        <script src="loginjscs/jquery-2.2.4.min.js"></script>
    <!-- for Bootstrap js -->
    <script src="loginjscs/bootstrap.min.js"></script>
     <link href="Scripts/ConfirmBox/jquery-confirm.css" rel="stylesheet" />
    <script src="Scripts/ConfirmBox/jquery-confirm.min.js"></script>
      <!-- Custom js-->
    <script src="loginjscs/custom.js"></script>
         <script src="Scripts/Pages/LoginPageJS.js"></script>
    </form>
  <%--  <form id="form1" runat="server">
        <div class="" style="margin-top: -50px">
            <div class="col-md-7  imgcls" style="height: 700px; background-image: url('Img/TRANSACTION.png'); background-repeat: no-repeat"></div>
            <div class="col-md-5" style="height: 105%; margin-top: 1%">
                <div class="login-box">
                    <div class="" style="margin-top: 0px">
                        <div class="form-group" style="text-align: center; margin-bottom: 0px;">
                            <img src="Img/logo.jpg" style="width: 300px; height: 80px;">
                        </div>
                        <br />
                        <br />
                        <div class="form-group" style="margin-left: 60px">
                            <input name="txtemail" type="text" id="UserName" class="form-control " placeholder="User Name" maxlength="30" style="width: 400px !important">
                        </div>
                        <div class="form-group" style="margin-left: 60px">
                            <input name="txtpwd" type="password" id="Password" class="form-control" placeholder="password">
                        </div>
                        <div class="form-group" style="margin-left: 60px">
                            <input id="rememberMe" type="checkbox" value="lsRememberMe" name="chkRemeber">
                            &nbsp;&nbsp;&nbsp;<strong> Remember Me</strong>
                        </div>
                        <a name="btnsubmit"  id="btnsubmit" class="btn btn-lg btn-block btn-primary btn-success" style="font-weight: bold; margin-left: 60px;width:75%">Login</a>

                        <div style="color: #000; font-size: 10px!important">
                            <br>

                              <a style="font-size: 14px; font-weight: 800; float: right" onclick="ShowModal('ModalSMS1');">Forgot Password</a><br>


                            <hr>
                        </div>
                    </div>
                </div>
            </div>
            <div class="loader"></div>
        </div>
        <div class="col-md-7" style="background-color: #22BAA0; height: 41px; margin-top: -14px; text-align: center">
            <p style="padding: 10px; font-family: 'Roboto'; font: bolder">All Rights Reserved. Copyright &copy;Poshs</p>
        </div>
    </form>
    <script src="Scripts/jquery-3.4.1.js"></script>
    <script src="Scripts/jquery-3.4.1.min.js"></script>
    <script src="Scripts/jquery-3.4.1.slim.js"></script>
    <script src="Scripts/jquery-3.4.1.slim.min.js"></script>
    <link href="Scripts/ConfirmBox/jquery-confirm.css" rel="stylesheet" />
    <script src="Scripts/ConfirmBox/jquery-confirm.min.js"></script>
    <script src="Scripts/jquery-3.4.1.js"></script>
    <script src="Scripts/Pages/LoginPageJS.js"></script>--%>
    
</body>
</html>
