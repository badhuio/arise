$(document).ready(function () {

    $("#signup").click(function (e) {
        e.preventDefault();

        let username = $("#username").val().trim();
        let email = $("#email").val().trim();
        let password = $("#password").val().trim();
        let confpassword = $("#confirm_password").val().trim();

        if (!username || !email || !password || !confpassword) {
            alert("Please fill all fields");
            return;
        }

        if (password !== confpassword) {
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
        alert("Signup success");
        window.location.href = "/login";
    },
    error: function (err){
        alert("Signup failed");
    }
});

        // console.log(username, email, password);

    });

});
