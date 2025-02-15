// Header & Footer
document.addEventListener("DOMContentLoaded", function () {
    // Load Topbar Header
    fetch("../components/header__topbar.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("#header__topbar").innerHTML = data;
        });

    // Load Topbar Header
    fetch("../components/header__sticky.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("#header__sticky").innerHTML = data;
        });

    // Load Footer
    fetch("../components/footer.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("#footer").innerHTML = data;
        });
});

// Sticky header
window.addEventListener('scroll', function() {
    var header = document.getElementById('header__sticky');
    if (window.scrollY > 50) {
        header.classList.add('shrink');
    } else {
        header.classList.remove('shrink');
    }
});