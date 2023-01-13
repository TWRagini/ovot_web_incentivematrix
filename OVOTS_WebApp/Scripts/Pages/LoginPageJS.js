$(document).ready(function () {   
    $body = $("body");
    $("#btnsubmit").click(function () {
       
        
        var Validate = true;
        //var form = $('#AntiForgeryForm');
        //var token = $('input[name="__RequestVerificationToken"]', form).val();
        //var headers = {};
        //headers['__RequestVerificationToken'] = token;

        var UserName = $("#UserName").val().trim();
        var Password = $("#Password").val().trim();

        UserName == "" ? $("#UserName").addClass('error') : $("#UserName").removeClass('error');
        Password == "" ? $("#Password").addClass('error') : $("#Password").removeClass('error');

        if (UserName == "" || Password == "") {
            Validate = false;  
        }

        if (Validate) {
            $body.addClass("loading");
           lsRememberMe();
           
            $.ajax({
                type: "POST",
                url: "Default.aspx/VerifyPassword",
                data: JSON.stringify({ 'UserName': UserName, 'Password': Password }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
              
                success: function (data) {
                    if (data.d == "") {
                        $.alert('Provide a valid Username Or Password');
                       
                    } else {
                        window.location.href = "Landing.aspx";
                        return false;
                    }

                },
                complete: function () {
                    $body.removeClass("loading");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {                  
                    alert("Error while retrieving data of :" + textStatus); alert("Error: " + XMLHttpRequest.responseText);
                }
            });
        }
    });


    $('#UserName').keyup(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            $('#btnsubmit').click();
            return false;
        }
    });
    $('#Password').keyup(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            $('#btnsubmit').click();
            return false;
        }
    });

    const RemberMe = document.getElementById("rememberMe"),
        UserName = document.getElementById("UserName"),
        Password = document.getElementById("Password");

    if (localStorage.checkbox && localStorage.checkbox !== "") {
        RemberMe.setAttribute("checked", "checked");
        UserName.value = localStorage.UserName;
        Password.value = localStorage.Password;
    } else {
        RemberMe.removeAttribute("checked");
        Password.value = "";
        UserName.value = "";
    }

    function lsRememberMe() {
        debugger;
        if (RemberMe.checked && UserName !== "" && Password !== "") {
            localStorage.UserName = UserName.value;
            localStorage.checkbox = RemberMe.value;
            localStorage.Password = Password.value;
        } else {
            localStorage.username = "";
            localStorage.checkbox = "";
            Password.value = "";
        }
    }
});