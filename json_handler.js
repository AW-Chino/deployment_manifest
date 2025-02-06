document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("saveBtn")?.addEventListener("click", function () {
        saveJSON();
    });

    document.getElementById("loadBtn")?.addEventListener("click", function () {
        document.getElementById("jsonLoadInput")?.click();
    });

    document.getElementById("jsonLoadInput")?.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            loadJSON(e.target.result);
        };
        reader.readAsText(file);
    });

    function saveJSON() {
        const jsonData = generateJSON();
        const jsonStr = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "deployment_manifest.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert("JSON saved successfully!");
    }

    function loadJSON(jsonStr) {
        let data;
        try {
            data = JSON.parse(jsonStr);
        } catch (error) {
            alert("Invalid JSON file.");
            return;
        }

        populateFormData(data);
    }

    function generateJSON() {
        const jsonData = {};
        document.querySelectorAll(".wizard-step").forEach(section => {
            let sectionId = section.id;
            jsonData[sectionId] = {};

            section.querySelectorAll("input, textarea, select").forEach(input => {
                jsonData[sectionId][input.name] = input.value;
            });

            section.querySelectorAll("table tbody").forEach(tbody => {
                let tableData = [];
                tbody.querySelectorAll("tr").forEach(row => {
                    let rowData = {};
                    row.querySelectorAll("td input, td textarea, td select").forEach(input => {
                        rowData[input.name] = input.value;
                    });
                    tableData.push(rowData);
                });
                jsonData[sectionId][tbody.id] = tableData;
            });
        });

        return jsonData;
    }

    function populateFormData(data) {
        document.querySelectorAll(".wizard-step").forEach(section => {
            let sectionId = section.id;
            if (!data[sectionId]) return;

            section.querySelectorAll("input, textarea, select").forEach(input => {
                if (data[sectionId][input.name] !== undefined) {
                    input.value = data[sectionId][input.name];
                }
            });

            section.querySelectorAll("table tbody").forEach(tbody => {
                let tableData = data[sectionId][tbody.id];
                if (!Array.isArray(tableData)) return;

                tbody.innerHTML = "";
                tableData.forEach(rowData => {
                    let row = document.createElement("tr");
                    Object.keys(rowData).forEach(key => {
                        let td = document.createElement("td");
                        let input = document.createElement("input");
                        input.type = "text";
                        input.name = key;
                        input.value = rowData[key];
                        input.classList.add("form-control");
                        td.appendChild(input);
                        row.appendChild(td);
                    });

                    let actionTd = document.createElement("td");
                    let removeBtn = document.createElement("button");
                    removeBtn.type = "button";
                    removeBtn.classList.add("btn", "btn-danger", "btn-sm");
                    removeBtn.textContent = "Remove";
                    removeBtn.addEventListener("click", function () {
                        row.remove();
                    });

                    actionTd.appendChild(removeBtn);
                    row.appendChild(actionTd);

                    tbody.appendChild(row);
                });
            });
        });
    }
});
