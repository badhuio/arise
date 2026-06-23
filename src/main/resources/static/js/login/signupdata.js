$(document).ready(function () {

    $("#signup").click(function (e) {
        e.preventDefault();

        let username = $("#username").val().trim();
        let email = $("#email").val().trim();
        let password = $("#password").val().trim();
        let confirm_password = $("#confirm_password").val().trim();

        if (!username || !email || !password || !confirm_password) {
            alert("Please fill all fields");
            return;
        }

        if (password !== confirm_password) {
            alert("Password mismatch!");
            return;
        }

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!regex.test(email)) {
            alert("Invalid email format");
            $("#email").css("border-color", "#ff4d4d");
            return;
        }

        let data = {username,email,password};

         console.log(data);

$.ajax({
    url: "/signup_saving",
    method: "POST",
    contentType:"application/json",
    data:JSON.stringify(data),
    success: function (res){

         popup("Registration Successful","Your account has been created. Redirecting to login...");

         setTimeout(()=>{
                window.location.href="/login";
            },3025);
    },
    error: function (err){
        popup("Error",err.responseText);
    }
});

    });


//popup
    function popup(title,message){

                $("#popup-title").text(title);
                $("#popup-message").text(message);

                $("#popup").fadeIn();

                setTimeout(()=>{
                    $("#popup").fadeOut();
                },3018);

            }

    //toggle-password and toggle-password 1 disable and enable
    $("#password, #confirm_password").on("input", function(){

        let target = $(this).attr("id");

        $(`.toggle-password[data-target='${target}']`)
            .toggle($(this).val().trim() !== "");

    });

});
