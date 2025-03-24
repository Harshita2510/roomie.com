document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("registration-form");
    const inputs = form.querySelectorAll(".input-field");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    function updateProgress() {
        let filled = 0;
        inputs.forEach(input => {
            if (input.value.trim() !== "") {
                filled++;
            }
        });
        let percentage = (filled / inputs.length) * 100;
        progressBar.style.width = percentage + "%";
        progressText.innerText = `${Math.round(percentage)}% completed`;
    }

    inputs.forEach(input => {
        input.addEventListener("input", updateProgress);
        input.addEventListener("change", updateProgress);
    });
});
