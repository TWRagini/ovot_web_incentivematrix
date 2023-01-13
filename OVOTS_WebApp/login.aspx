<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="login.aspx.cs" Inherits="OVOTS_WebApp.login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <!-- Basic Page Needs
  ================================================== -->
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!-- Mobile Specific Metas
  ================================================== -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <!-- For Search Engine Meta Data  -->
  <meta name="description" content="" />
  <meta name="keywords" content="" />
  <meta name="author" content="yoursite.com" />
	
  <title>Authfy : Login-05</title>

  <!-- Favicon -->
  <link rel="shortcut icon" type="image/icon" href="images/favicon-16x16.png"/>
   
  <!-- Main structure css file -->
  <link  rel="stylesheet" href="loginjscs/login5-style.css">
  
  <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if IE]>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js"></script>
  <![endif]-->
 
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
          <div class="col-sm-5 authfy-panel-left">
            <div class="brand-col">
              <div class="headline">
                <!-- brand-logo start -->
                <div class="brand-logo">
                  <img src="loginjscs/AMSTRAD_Logo.png" width="150" alt="brand-logo">
                </div><!-- ./brand-logo -->
                <p>Some Text come here</p>
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
                             <input name="txtemail" type="text" id="UserName" class="form-control " placeholder="User Name" maxlength="30" >
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
                        <div class="form-group wrap-input">
                          <input type="email" class="form-control" name="username" placeholder="Email address">
                          <span class="focus-input"></span>
                        </div>
                        <div class="form-group wrap-input">
                          <input type="text" class="form-control" name="fullname" placeholder="Full name">
                          <span class="focus-input"></span>
                        </div>
                        <div class="form-group wrap-input">
                          <div class="pwdMask">
                            <input  type="password" class="form-control" name="password" placeholder="Password">
                            <span class="focus-input"></span>
                            <span class="fa fa-eye-slash pwd-toggle"></span>
                          </div>
                        </div>
                        <div class="form-group">
                          <p class="term-policy text-muted small">I agree to the <a href="#">privacy policy</a> and <a href="#">terms of service</a>.</p>
                        </div>
                        <div class="form-group">
                          <button class="btn btn-lg btn-primary btn-block" type="submit">Sign up with email</button>
                        </div>
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
    
      <!-- Custom js-->
    <script src="loginjscs/custom.js"></script>
         <script src="Scripts/Pages/LoginPageJS.js"></script>
    </form>
</body>
</html>
