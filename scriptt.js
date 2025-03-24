const questions = [
    "What is Beiyo and why it's different from others?",
    "How does Beiyo contribute to a positive community environment?",
    "How can I get Beiyo's services for my hostel or PG?",
    "How does Beiyo work with PG and hostel owners?",
    "Refer and Earn"
];




const answers = [
    "It is a unique platform providing better hostel and PG services...",
    "It promotes inclusivity, diversity, and collaboration, creating a safe and supportive space...",
    "You can get Roomie.com's services via our website...",
    "Beiyo partners with PG and Mess owners to improve the experience for students...",
    "Refer your friends and earn rewards when they join Beiyo."
];




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










