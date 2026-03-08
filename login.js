document.getElementById("loginForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("errorMsg");

    if (username === "admin" && password === "admin123") {
        window.location.href = "issue.html";
    }
    else {
        errorMsg.classList.remove("hidden");
    }

});