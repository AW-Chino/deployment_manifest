// json_handler.js

document.addEventListener("DOMContentLoaded", function () {
    attachJSONHandlers();
});

function attachJSONHandlers() {
    document.getElementById("saveBtn")?.addEventListener("click", function () {
        saveJSON();
    });
    document.getElementById("loadBtn")?.addEventListener("click", function () {
        console.log("loadBtn clicked");
        document.getElementById("jsonLoadInput")?.click();
    });
    document.getElementById("jsonLoadInput")?.addEventListener("change", function (e) {
        console.log("jsonLoadInput changed");
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            loadJSON(e.target.result);
        };
        reader.readAsText(file);
    });
}

function saveJSON() {
    const jsonData = generateJSON();
    const clientName = jsonData["step-1"]?.client || "Client";
    const projectName = jsonData["step-1"]?.project_name || "Project";
    const safeClientName = clientName.trim().replace(/\s+/g, '_');
    const safeProjectName = projectName.trim().replace(/\s+/g, '_');
    const fileName = `${safeClientName}_${safeProjectName}_Deployment_Manifest.json`;
    const jsonStr = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("JSON saved successfully!");
}

function generateJSON() {
    const jsonData = {};
    const tableKeyMapping = {
      "installation-process-body": "installationProcess",
      "rollback-process-body": "rollbackProcess",
      "configuration-process-body": "configurationProcess",
      "unit-testing-body": "unitTesting"
    };
    document.querySelectorAll(".wizard-step").forEach(section => {
        const sectionId = section.id;
        jsonData[sectionId] = {};
        section.querySelectorAll("input[type='text'], input[type='date'], textarea, select").forEach(input => {
            if (input.name && !input.closest('.script-block') && !input.closest('.custom-record-block') && !input.closest('.process-block')) {
                jsonData[sectionId][input.name] = input.value;
            }
        });
        section.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
            if (checkbox.name && !checkbox.closest('.script-block')) {
                jsonData[sectionId][checkbox.name] = checkbox.checked;
            }
        });
        section.querySelectorAll("table").forEach(table => {
            const tbody = table.querySelector("tbody");
            if (tbody && !tbody.closest('.script-block') && !tbody.closest('.custom-record-block') && !tbody.closest('.process-block')) {
                const tableData = [];
                tbody.querySelectorAll("tr").forEach(row => {
                    const rowData = {};
                    row.querySelectorAll("input, textarea, select").forEach(input => {
                        if (input.name) {
                            if (input.name === "installation_image") {
                                rowData[input.name] = input.value.replace(/^images\//, "");
                            } else {
                                rowData[input.name] = input.value;
                            }
                        }
                    });
                    if (Object.keys(rowData).length > 0) {
                        tableData.push(rowData);
                    }
                });
                const tableId = tbody.id || table.id || "table-data";
                const key = tableKeyMapping[tableId] || tableId;
                jsonData[sectionId][key] = tableData;
            }
        });
        if (section.id === "step-6") {
            jsonData[section.id]["scripts"] = extractScriptBlocks(section);
        }
        if (section.id === "step-7") {
            jsonData[section.id]["customRecords"] = extractCustomRecordBlocks(section);
        }
        if (section.id === "step-8") {
            jsonData[section.id]["workflows"] = extractWorkflowBlocks(section);
        }
    });
    return cleanData(jsonData);
}

function extractScriptBlocks(section) {
    const scripts = [];
    section.querySelectorAll(".script-block").forEach(scriptBlock => {
        const scriptData = {
            name: scriptBlock.querySelector("input[name='script_name']")?.value,
            details: {
                id: scriptBlock.querySelector("input[name='script_id']")?.value,
                type: scriptBlock.querySelector("input[name='script_type']")?.value,
                description: scriptBlock.querySelector("textarea[name='script_description']")?.value,
                fileName: scriptBlock.querySelector("input[name='file_name']")?.value,
                location: scriptBlock.querySelector("input[name='location']")?.value
            },
            parameters: extractTableData(scriptBlock, "parameters"),
            entryPoints: extractTableData(scriptBlock, "entrypoints"),
            deploymentRecords: extractTableData(scriptBlock, "deployment-records"),
            versionHistory: extractTableData(scriptBlock, "version-history"),
            libraries: extractTableData(scriptBlock, "libraries"),
            unitTests: extractTableData(scriptBlock, "unit-tests"),
            checklists: {
                standards: scriptBlock.querySelector("input[name='standards']")?.checked,
                disclaimer: scriptBlock.querySelector("input[name='disclaimer']")?.checked,
                expectations: scriptBlock.querySelector("input[name='expectations']")?.checked,
                eslint: scriptBlock.querySelector("input[name='eslint']")?.checked
            }
        };
        scripts.push(scriptData);
    });
    return scripts;
}

function extractCustomRecordBlocks(section) {
    const records = [];
    section.querySelectorAll(".custom-record-block").forEach(recordBlock => {
        const recordData = {
            name: recordBlock.querySelector("input[name='record_name']")?.value,
            id: recordBlock.querySelector("input[name='record_id']")?.value,
            type: recordBlock.querySelector("input[name='record_type']")?.value,
            description: recordBlock.querySelector("textarea[name='record_description']")?.value,
            fields: extractTableData(recordBlock, "fields")
        };
        records.push(recordData);
    });
    return records;
}

function extractWorkflowBlocks(section) {
    const workflows = [];
    section.querySelectorAll(".workflow-block").forEach(workflowBlock => {
        const workflowData = {
            details: workflowBlock.querySelector("input[name='workflow_details']")?.value || "",
            actions: extractTableData(workflowBlock, "actions")
        };
        workflows.push(workflowData);
    });
    return workflows;
}

function extractTableData(container, tableType) {
    const tableData = [];
    const tbody = container.querySelector(`.${tableType}-body`);
    if (tbody) {
        tbody.querySelectorAll("tr").forEach(row => {
            const rowData = {};
            row.querySelectorAll("input, textarea, select").forEach(input => {
                if (input.name) {
                    if (input.name === "installation_image") {
                        rowData[input.name] = input.value.replace(/^images\//, "");
                    } else {
                        rowData[input.name] = input.value;
                    }
                }
            });
            if (Object.keys(rowData).length > 0) {
                tableData.push(rowData);
            }
        });
    }
    return tableData;
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

function populateFormData(data) {
    clearDynamicBlocks();
    Object.entries(data).forEach(([sectionId, sectionData]) => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        Object.entries(sectionData).forEach(([key, value]) => {
            if (
                key === 'scripts' ||
                key === 'customRecords' ||
                key === 'workflows' ||
                key === 'installationProcess' ||
                key === 'rollbackProcess' ||
                key === 'configurationProcess' ||
                key === 'unitTesting' ||
                key.endsWith('-body')
            ) {
                return;
            }
            const input = section.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = value;
                } else {
                    input.value = value;
                }
            }
        });
        if (sectionId === 'step-6' && sectionData.scripts && Array.isArray(sectionData.scripts)) {
            const container = section.querySelector('#scripts-container');
            const template = document.getElementById('script-block-template');
            sectionData.scripts.forEach(scriptData => {
                if (scriptData && scriptData.name) {
                    const scriptBlock = template.content.cloneNode(true).firstElementChild;
                    container.appendChild(scriptBlock);
                    if (typeof setupScriptBlock === 'function') {
                        setupScriptBlock(scriptBlock);
                    }
                    populateScriptBlock(scriptBlock, scriptData);
                }
            });
        }
        if (sectionId === 'step-7' && sectionData.customRecords && Array.isArray(sectionData.customRecords)) {
            const container = section.querySelector('#records-container');
            const template = document.getElementById('custom-record-template');
            sectionData.customRecords.forEach(recordData => {
                if (recordData && recordData.name) {
                    const recordBlock = template.content.cloneNode(true).firstElementChild;
                    container.appendChild(recordBlock);
                    if (typeof setupRecordBlock === 'function') {
                        setupRecordBlock(recordBlock);
                    }
                    populateRecordBlock(recordBlock, recordData);
                }
            });
        }
        if (sectionId === 'step-8' && sectionData.workflows && Array.isArray(sectionData.workflows)) {
            const container = section.querySelector('#workflow-container');
            const template = document.getElementById('workflow-block-template');
            sectionData.workflows.forEach(workflowData => {
                if (workflowData && workflowData.details) {
                    const workflowBlock = template.content.cloneNode(true).firstElementChild;
                    container.appendChild(workflowBlock);
                    if (typeof setupWorkflowBlock === 'function') {
                        setupWorkflowBlock(workflowBlock);
                    }
                    populateWorkflowBlock(workflowBlock, workflowData);
                }
            });
        }
        Object.entries(sectionData).forEach(([key, value]) => {
            if (Array.isArray(value) && (key.endsWith('-body') || key === 'installationProcess' || key === 'rollbackProcess' || key === 'configurationProcess' || key === 'unitTesting')) {
                let tbody;
                switch(key) {
                  case 'installationProcess':
                    tbody = section.querySelector("#installation-process-body");
                    break;
                  case 'rollbackProcess':
                    tbody = section.querySelector("#rollback-process-body");
                    break;
                  case 'configurationProcess':
                    tbody = section.querySelector("#configuration-process-body");
                    break;
                  case 'unitTesting':
                    tbody = section.querySelector("#unit-testing-body");
                    break;
                  default:
                    tbody = section.querySelector(`#${key}`);
                }
                if (tbody && !tbody.closest('.script-block') && !tbody.closest('.custom-record-block') && !tbody.closest('.process-block')) {
                    populateRegularTable(tbody, value);
                }
            }
        });
    });
}

function populateRegularTable(tbody, data) {
    tbody.innerHTML = '';
    data.forEach(rowData => {
      if (!isEmptyRow(rowData)) {
        const row = document.createElement('tr');
        Object.entries(rowData).forEach(([key, value]) => {
          const cell = document.createElement('td');
          const input = (key.includes('description') || key.includes('notes') || key.includes('summary')) ?
            document.createElement('textarea') :
            document.createElement('input');
          input.className = 'form-control';
          if (input.tagName === 'INPUT') {
            input.type = key.includes('date') ? 'date' : 'text';
          }
          input.name = key;
          input.value = value || '';
          input.setAttribute('data-field', key);
          if (input.tagName === 'TEXTAREA') {
            input.rows = 2;
          }
          cell.appendChild(input);
          row.appendChild(cell);
        });
        if (tbody.id !== "components-body") {
          const actionCell = document.createElement('td');
          const removeBtn = document.createElement('button');
          removeBtn.textContent = 'Remove';
          removeBtn.className = 'btn btn-danger btn-sm';
          removeBtn.onclick = () => row.remove();
          actionCell.appendChild(removeBtn);
          row.appendChild(actionCell);
        }
        tbody.appendChild(row);
      }
    });
}

function populateScriptBlock(block, data) {
    const scriptNameInput = block.querySelector("input[name='script_name']");
    if (scriptNameInput) scriptNameInput.value = data.name || '';
    if (data.details) {
        const idInput = block.querySelector("input[name='script_id']");
        if (idInput) idInput.value = data.details.id || '';
        const typeInput = block.querySelector("input[name='script_type']");
        if (typeInput) typeInput.value = data.details.type || '';
        const descTextarea = block.querySelector("textarea[name='script_description']");
        if (descTextarea) descTextarea.value = data.details.description || '';
        const fileNameInput = block.querySelector("input[name='file_name']");
        if (fileNameInput) fileNameInput.value = data.details.fileName || '';
        const locationInput = block.querySelector("input[name='location']");
        if (locationInput) locationInput.value = data.details.location || '';
    }
    ['standards', 'disclaimer', 'expectations', 'eslint'].forEach(name => {
        const checkbox = block.querySelector(`input[name="${name}"]`);
        if (checkbox && data.checklists) {
            checkbox.checked = !!data.checklists[name];
        }
    });
    populateScript_setupTable(block, 'parameters', data.parameters);
    populateScript_setupTable(block, 'entrypoints', data.entryPoints);
    populateScript_setupTable(block, 'deployment-records', data.deploymentRecords);
    populateScript_setupTable(block, 'version-history', data.versionHistory);
    populateScript_setupTable(block, 'libraries', data.libraries);
    populateScript_setupTable(block, 'unit-tests', data.unitTests);
}

function populateScript_setupTable(block, tableType, data) {
    if (!Array.isArray(data)) return;
    const tbody = block.querySelector(`.${tableType}-body`);
    if (!tbody) return;
    tbody.innerHTML = '';
    data.forEach(rowData => {
        if (!isEmptyRow(rowData)) {
            const row = document.createElement('tr');
            Object.entries(rowData).forEach(([key, value]) => {
                const cell = document.createElement('td');
                const input = (key.includes('description') || key.includes('notes') || key.includes('summary')) ?
                    document.createElement('textarea') :
                    document.createElement('input');
                input.className = 'form-control';
                if (input.tagName === 'INPUT') {
                    input.type = key.includes('date') ? 'date' : 'text';
                }
                input.name = key;
                input.value = value || '';
                input.setAttribute('data-field', key);
                if (input.tagName === 'TEXTAREA') {
                    input.rows = 2;
                }
                cell.appendChild(input);
                row.appendChild(cell);
            });
            const actionCell = document.createElement('td');
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'btn btn-danger btn-sm';
            removeBtn.onclick = () => row.remove();
            actionCell.appendChild(removeBtn);
            row.appendChild(actionCell);
            tbody.appendChild(row);
        }
    });
}

function isEmptyRow(rowData) {
    return Object.values(rowData).every(value =>
        value === "" || value === null || value === undefined
    );
}

function cleanData(data) {
    if (Array.isArray(data)) {
        return data.filter(obj => {
            if (typeof obj !== 'object' || obj === null) return true;
            return Object.values(obj).some(value =>
                value !== "" && value !== null && value !== undefined
            );
        });
    }
    if (typeof data === 'object' && data !== null) {
        const cleaned = {};
        for (const [key, value] of Object.entries(data)) {
            if (Array.isArray(value)) {
                const cleanedArray = cleanData(value);
                if (cleanedArray.length > 0) {
                    cleaned[key] = cleanedArray;
                }
            } else if (typeof value === 'object' && value !== null) {
                const cleanedObj = cleanData(value);
                if (Object.keys(cleanedObj).length > 0) {
                    cleaned[key] = cleanedObj;
                }
            } else if (value !== "" && value !== null && value !== undefined) {
                cleaned[key] = value;
            }
        }
        return cleaned;
    }
    return data;
}
function populateRecordBlock(block, data) {
    // Populate basic custom record fields
    const nameInput = block.querySelector("input[name='record_name']");
    if (nameInput) nameInput.value = data.name || '';
  
    const idInput = block.querySelector("input[name='record_id']");
    if (idInput) idInput.value = data.id || '';
  
    const typeInput = block.querySelector("input[name='record_type']");
    if (typeInput) typeInput.value = data.type || '';
  
    const descTextarea = block.querySelector("textarea[name='record_description']");
    if (descTextarea) descTextarea.value = data.description || '';
  
    // Populate dynamic table of custom record fields
    const tbody = block.querySelector(".fields-body");
    if (tbody && data.fields && Array.isArray(data.fields)) {
      tbody.innerHTML = "";
      data.fields.forEach(fieldData => {
        if (!isEmptyRow(fieldData)) {
          const row = document.createElement("tr");
          Object.entries(fieldData).forEach(([key, value]) => {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.className = "form-control";
            input.type = "text";
            input.name = key;
            input.value = value || "";
            input.setAttribute("data-field", key);
            cell.appendChild(input);
            row.appendChild(cell);
          });
          // Add Remove button for the row
          const actionCell = document.createElement("td");
          const removeBtn = document.createElement("button");
          removeBtn.textContent = "Remove";
          removeBtn.className = "btn btn-danger btn-sm";
          removeBtn.addEventListener("click", () => row.remove());
          actionCell.appendChild(removeBtn);
          row.appendChild(actionCell);
          tbody.appendChild(row);
        }
      });
    }
  }
  
  function isEmptyRow(rowData) {
    return Object.values(rowData).every(value =>
      value === "" || value === null || value === undefined
    );
  }
  function populateWorkflowBlock(block, data) {
    // Set the workflow details input value (if exists)
    const detailsInput = block.querySelector("input[name='workflow_details']");
    if (detailsInput) {
      detailsInput.value = data.details || '';
    }
    // Populate the actions table within the workflow block
    if (data.actions && Array.isArray(data.actions)) {
      populateScript_setupTable(block, 'actions', data.actions);
    }
  }

  function populateScript_setupTable(block, tableType, data) {
    if (!Array.isArray(data)) return;
    const tbody = block.querySelector(`.${tableType}-body`);
    if (!tbody) return;
    tbody.innerHTML = '';
    data.forEach(rowData => {
      if (!isEmptyRow(rowData)) {
        const row = document.createElement('tr');
        Object.entries(rowData).forEach(([key, value]) => {
          const cell = document.createElement('td');
          const input = (key.includes('description') || key.includes('notes') || key.includes('summary')) ?
            document.createElement('textarea') :
            document.createElement('input');
          input.className = 'form-control';
          if (input.tagName === 'INPUT') {
            input.type = key.includes('date') ? 'date' : 'text';
          }
          input.name = key;
          input.value = value || '';
          input.setAttribute('data-field', key);
          if (input.tagName === 'TEXTAREA') {
            input.rows = 2;
          }
          cell.appendChild(input);
          row.appendChild(cell);
        });
        // Add remove button for the row
        const actionCell = document.createElement('td');
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'btn btn-danger btn-sm';
        removeBtn.onclick = () => row.remove();
        actionCell.appendChild(removeBtn);
        row.appendChild(actionCell);
        tbody.appendChild(row);
      }
    });
  }
  
