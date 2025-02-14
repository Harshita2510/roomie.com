const questions = [
    "What is Beiyo and why it's different from others?",
    "How does Beiyo contribute to a positive community environment?",
    "How can I get Beiyo's services for my hostel or PG?",
    "How does Beiyo work with PG and hostel owners?",
    "Refer and Earn"
];




const answers = [
    "Beiyo is a unique platform providing better hostel and PG services...",
    "Beiyo promotes inclusivity, diversity, and collaboration, creating a safe and supportive space...",
    "You can get Beiyo's services by contacting us via our website...",
    "Beiyo partners with PG and hostel owners to improve the experience for students...",
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












