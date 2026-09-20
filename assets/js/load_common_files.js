document.addEventListener("DOMContentLoaded", function () {

    // Load Navbar
    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {

            document.getElementById("navbar-container").innerHTML = data;

            // Initialize Hamburger Menu
            const hamburger = document.getElementById("hamburger");
            const navbar = document.getElementById("navbar");

            if (hamburger && navbar) {
                hamburger.addEventListener("click", () => {
                    navbar.classList.toggle("active");
                });
            }

        })
        .catch(error => console.error("Error loading navbar:", error));


    // Load Footer
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
        })
        .catch(error => console.error("Error loading footer:", error));

    // Load whatsapp-circle
    fetch("whatsapp_icon.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("whatsapp-circle-container").innerHTML = data;
        })
        .catch(error => console.error("Error loading footer:", error));

});