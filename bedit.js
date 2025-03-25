document.addEventListener("DOMContentLoaded", function () {
    let form = document.getElementById("propertyForm");
    
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            let formData = new FormData(form);

            fetch("http://localhost:3019/propertyf", {
                method: "POST",
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(text => {
                try {
                    let data = JSON.parse(text);
                    console.log("Response from server:", data);
                    alert(data.message);
                } catch (error) {
                    console.error("JSON Parsing Error:", error, "Response Text:", text);
                    alert("Unexpected response format. Check the server.");
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                alert("Submission failed. Check console for details.");
            });
        });
    } else {
        console.error("Form element not found!");
    }
});

function previewImage(event) {
    let reader = new FileReader();
    reader.onload = function(){
        let output = document.getElementById("preview");
        output.src = reader.result;
        output.style.display = "block";
    };
    reader.readAsDataURL(event.target.files[0]);
}

function toggleFields() {
    let propertyType = document.getElementById("type").value;
    document.getElementById("bhkField").style.display = propertyType === "Flat" ? "block" : "none";
    document.getElementById("bedsField").style.display = propertyType === "PG" ? "block" : "none";
    document.getElementById("roomsField").style.display = propertyType === "PG" ? "block" : "none";
}