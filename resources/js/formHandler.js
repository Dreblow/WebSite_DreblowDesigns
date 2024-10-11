document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Show the "Working" message
    var workingMessage = document.getElementById("workingMessage");
    workingMessage.style.display = "block";

    // Gather form data
    var formData = new FormData(this);

    // Send the data via AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/pages/contact/contact.php", true);
    
    // Handle response
    xhr.onload = function() {
        // Hide the "Working" message
        workingMessage.style.display = "none";

        if (xhr.status === 200) {
            // Show success popup
            var successPopup = document.getElementById("successPopup");
            successPopup.style.display = "block";

            // Hide the popup and redirect after 2 seconds
            setTimeout(function() {
                successPopup.style.display = "none";
                window.location.href = "/index.html"; // Redirect to index
            }, 2000);
        } else {
            alert("Error sending message. Please try again.");
        }
    };
    
    // Send form data
    xhr.send(formData);
});