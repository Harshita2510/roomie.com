document.getElementById("roleForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const role = document.getElementById("role").value;
    const errorMsg = document.getElementById("errorMsg");

    if (!role) {
        errorMsg.textContent = "⚠ Please select a role before proceeding.";
        errorMsg.style.display = "block";
        return;
    }

    errorMsg.style.display = "none"; // Hide error message when role is selected

    // Redirect to the respective registration form
    const rolePages = {
        student: "register.html",
        broker: "broker.html",
        // "mess-owner": "mess-owner-register.html",
    };

    window.location.href = rolePages[role] || "frontpage.html"; // Default fallback
});
