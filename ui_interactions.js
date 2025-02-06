document.addEventListener("DOMContentLoaded", function () {
    attachCollapsibleListeners();

    function attachCollapsibleListeners() {
        document.querySelectorAll(".collapsible-toggle").forEach(button => {
            button.addEventListener("click", function () {
                let content = this.nextElementSibling;
                if (content.style.display === "none" || content.style.display === "") {
                    content.style.display = "block";
                    this.innerHTML = "▼ Hide Details";
                } else {
                    content.style.display = "none";
                    this.innerHTML = "▶ Show Details";
                }
            });
        });
    }

    function createCollapsibleSection(title) {
        let sectionContainer = document.createElement("div");
        sectionContainer.classList.add("collapsible-section");

        let toggleButton = document.createElement("button");
        toggleButton.type = "button";
        toggleButton.classList.add("btn", "btn-sm", "btn-link", "collapsible-toggle");
        toggleButton.innerHTML = "▶ " + title;

        let contentDiv = document.createElement("div");
        contentDiv.classList.add("collapsible-content");
        contentDiv.style.display = "none"; // Hidden by default

        sectionContainer.appendChild(toggleButton);
        sectionContainer.appendChild(contentDiv);

        return { sectionContainer, contentDiv };
    }

    function applyCollapsibleFeature() {
        document.querySelectorAll(".multi-table-record").forEach(record => {
            let title = record.dataset.title || "Details";
            let { sectionContainer, contentDiv } = createCollapsibleSection(title);

            while (record.firstChild) {
                contentDiv.appendChild(record.firstChild);
            }

            record.appendChild(sectionContainer);
            attachCollapsibleListeners();
        });
    }

    applyCollapsibleFeature();
});
