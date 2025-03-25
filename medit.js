document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("image").addEventListener("change", function(event) {
        const image = document.getElementById("profileImg");
        const file = event.target.files[0];
    
        if (file) {
            const reader = new FileReader();
    
            reader.onload = function(e) {
                image.src = e.target.result;
            };
    
            reader.readAsDataURL(file);
        }
    });
    
    document.getElementById("roommateForm").addEventListener("submit", async function(event) {
        event.preventDefault();

        const formData = {
            name: document.getElementById("name").value,
            gender: document.getElementById("gender").value,
            hobby: document.getElementById("hobby").value,
            course: document.getElementById("course").value,
            food: document.getElementById("food").value,
            bhk: document.getElementById("bhk").value,
            type: document.getElementById("type").value,
            note: document.getElementById("note").value
        };

        try {
            const response = await fetch("http://localhost:5000/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    });
});
