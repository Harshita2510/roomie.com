

function showAnswer(index) {
    document.getElementById("answer-text").textContent = answers[index];
    document.querySelectorAll('.faq-item').forEach((item, i) => {
        item.classList.toggle("active", i === index);
    });
}
document.addEventListener("DOMContentLoaded", function () {
    console.log("Footer loaded successfully!");
});


document.querySelector(".search-btn").addEventListener("click", function() {
    alert("Search functionality coming soon!");
});

document.addEventListener("DOMContentLoaded", function () {        //ensures function runs only when doc is fully loaded
    const menuBtn = document.getElementById("menuBtn");            //getting menu button using its id in html file
    const dropdownMenu = document.getElementById("dropdownMenu");  //getting dropdown using its id in html file

    // Toggle dropdown on button click
    menuBtn.addEventListener("click", function (event) {
        dropdownMenu.classList.toggle("show");                      //bounce effect 
        event.stopPropagation();                                    //stops dropdown from closing when clicked inside
    });

    // Close dropdown when clicking anywhere outside
    document.addEventListener("click", function (event) {
        if (!menuBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });
});









