document.addEventListener("DOMContentLoaded", function () {
    initializeTooltips();
    applyPlaceholders();

    function initializeTooltips() {
        document.querySelectorAll("[data-tooltip]").forEach(field => {
            field.addEventListener("focus", function () {
                showTooltip(field, field.getAttribute("data-tooltip"));
            });

            field.addEventListener("blur", function () {
                hideTooltip(field);
            });
        });
    }

    function showTooltip(field, message) {
        let tooltip = document.createElement("div");
        tooltip.classList.add("tooltip-box");
        tooltip.textContent = message;
        document.body.appendChild(tooltip);

        let rect = field.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
        field.dataset.tooltipId = tooltip;
    }

    function hideTooltip(field) {
        let tooltip = document.querySelector(".tooltip-box");
        if (tooltip) tooltip.remove();
    }

    function applyPlaceholders() {
        document.querySelectorAll("input, textarea").forEach(field => {
            if (field.hasAttribute("placeholder")) return;
            let label = field.previousElementSibling;
            if (label) {
                field.setAttribute("placeholder", `Enter ${label.textContent}`);
            }
        });
    }
});
