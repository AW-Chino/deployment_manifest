document.addEventListener("DOMContentLoaded", function () {
    attachValidationHandlers();

    function attachValidationHandlers() {
        document.querySelectorAll("input, textarea, select").forEach(field => {
            field.addEventListener("blur", function () {
                validateField(field);
            });
        });

        document.getElementById("submit")?.addEventListener("click", function (e) {
            e.preventDefault();
            if (!validateForm()) {
                alert("Please correct the errors before submitting.");
            } else {
                alert("Form submitted successfully!");
            }
        });
    }

    function validateForm() {
        let isValid = true;
        document.querySelectorAll("input, textarea, select").forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        return isValid;
    }

    function validateField(field) {
        let errorMessage = "";
        if (field.hasAttribute("required") && !field.value.trim()) {
            errorMessage = "This field is required.";
        } else if (field.type === "email" && !isValidEmail(field.value)) {
            errorMessage = "Please enter a valid email address.";
        }

        showError(field, errorMessage);
        return errorMessage === "";
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(field, message) {
        let errorSpan = field.nextElementSibling;
        if (!errorSpan || !errorSpan.classList.contains("error-message")) {
            errorSpan = document.createElement("span");
            errorSpan.classList.add("error-message", "text-danger");
            field.parentNode.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
        field.classList.toggle("is-invalid", message !== "");
    }
});
