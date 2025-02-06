document.addEventListener("DOMContentLoaded", function () {
    loadAutoSavedData();

    document.querySelectorAll("input, textarea, select").forEach(field => {
        field.addEventListener("input", function () {
            autoSaveForm();
        });
    });

    function autoSaveForm() {
        let formData = generateJSON();
        localStorage.setItem("autosave_manifest", JSON.stringify(formData));
    }

    function loadAutoSavedData() {
        let savedData = localStorage.getItem("autosave_manifest");
        if (savedData) {
            loadJSON(savedData);
        }
    }
});
