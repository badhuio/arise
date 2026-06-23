$(document).ready(function (){


    $("#login").click(function (e){
        e.preventDefault();

        let email = $("#email").val().trim();
        let password = $("#password").val().trim();

       if(!email || !password){
           alert("please fill fields");
            return;
       }

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!regex.test(email)) {
            alert("Invalid email format");
            $("#email").css("border-color", "#ff4d4d");
            return;
        }

        let login_data = {email , password};

        console.log(login_data);

       $.ajax({
           url: "/login_checking",
           method: "POST",
           contentType: "application/json",
           data:JSON.stringify(login_data),
           success: function (res) {
               popup("Login Successful", "Redirecting to home...");

                        setTimeout(()=>{
                               window.location.href="/home";
                           },3025);
           },

       })

    })



    //popup
    function popup(title,message){

                    $("#popup-title").text(title);
                    $("#popup-message").text(message);

                    $("#popup").fadeIn();

                    setTimeout(()=>{
                        $("#popup").fadeOut();
                    },3018);

                }
})
