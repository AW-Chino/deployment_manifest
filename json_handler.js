// ------------------------
// JSON Handler (json_handler.js)
// ------------------------

// Wait for the DOM to load before attaching JSON handlers
document.addEventListener("DOMContentLoaded", function () {
    attachJSONHandlers();
  });
  
  // Attach event listeners for save/load buttons and file input
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
  
  // Save JSON: generate JSON from current form data and trigger a download
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
  
  // Generate JSON from the form data
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
      // Get all non-table fields (inputs, textareas, selects) that are not part of dynamic blocks
      section.querySelectorAll("input[type='text'], input[type='date'], textarea, select").forEach(input => {
        if (input.name && !input.closest('.script-block') && !input.closest('.custom-record-block') && !input.closest('.process-block')) {
          jsonData[sectionId][input.name] = input.value;
        }
      });
      // Get all checkboxes
      section.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        if (checkbox.name && !checkbox.closest('.script-block')) {
          jsonData[sectionId][checkbox.name] = checkbox.checked;
        }
      });
      // Get table data
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

      if (section.id === "step-4") {
        // Instead of a single table, extract each configuration group
        const groupsContainer = section.querySelector("#configuration-groups-container");
        if (groupsContainer) {
          const groups = [];
          groupsContainer.querySelectorAll(".configuration-group-block").forEach(groupBlock => {
            const groupData = {
              group_name: groupBlock.querySelector("input[name='configuration_group_name']")?.value || "",
              group_description: groupBlock.querySelector("textarea[name='configuration_group_description']")?.value || "",
              steps: extractTableData(groupBlock, "configuration-steps")
            };
            groups.push(groupData);
          });
          jsonData["step-4"]["configurationProcess"] = groups;
        }
      }
      
      // Scripts (Step 6)
      if (section.id === "step-6") {
        jsonData[section.id]["scripts"] = extractScriptBlocks(section);
      }
      // Custom Records (Step 7)
      if (section.id === "step-7") {
        jsonData[section.id]["customRecords"] = extractCustomRecordBlocks(section);
      }
      // Workflows (Step 8)
      if (section.id === "step-8") {
        jsonData[section.id]["workflows"] = extractWorkflowBlocks(section);
      }
    });
    return cleanData(jsonData);
  }
  
  // Extract script data from Step 6
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
  
  // Extract custom record data from Step 7
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
  
  // Extract workflow data from Step 8 (including nested states)
  function extractWorkflowBlocks(section) {
    const workflows = [];
    section.querySelectorAll(".workflow-block").forEach(workflowBlock => {
      const workflowData = {
        workflow_id: workflowBlock.querySelector("input[name='workflow_id']")?.value || "",
        workflow_name: workflowBlock.querySelector("input[name='workflow_name']")?.value || "",
        workflow_description: workflowBlock.querySelector("textarea[name='workflow_description']")?.value || "",
        workflow_notes: workflowBlock.querySelector("textarea[name='workflow_notes']")?.value || "",
        states: []
      };
      // Loop through each nested state block
      workflowBlock.querySelectorAll(".states-container .state-block").forEach(stateBlock => {
        const stateData = {
          state_name: stateBlock.querySelector("input[name='state_name']")?.value || "",
          details: {
            state_id: stateBlock.querySelector("input[name='state_id']")?.value || "",
            state_description: stateBlock.querySelector("textarea[name='state_description']")?.value || "",
            state_notes: stateBlock.querySelector("textarea[name='state_notes']")?.value || ""
          },
          transitions: extractTableData(stateBlock, "transitions"),
          actions: extractTableData(stateBlock, "actions")
        };
        workflowData.states.push(stateData);
      });
      workflows.push(workflowData);
    });
    return workflows;
  }
  
  // Extract table data given a container and a table type (class name)
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
  
  // Load JSON from string and populate the form
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
  
  // --- MAIN POPULATION FUNCTION ---
  function populateFormData(data) {
    clearDynamicBlocks();
    Object.entries(data).forEach(([sectionId, sectionData]) => {
      const section = document.getElementById(sectionId);
      if (!section) return;
      
      // Populate individual non-table fields
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
      

      if (section.id === "step-4") {
        // Populate configuration groups
        const container = section.querySelector("#configuration-groups-container");
        const groupTemplate = document.getElementById("configuration-group-template");
        if (container && sectionData.configurationProcess && Array.isArray(sectionData.configurationProcess)) {
          sectionData.configurationProcess.forEach(groupData => {
            const groupBlock = groupTemplate.content.cloneNode(true).firstElementChild;
            container.appendChild(groupBlock);
            const groupNameInput = groupBlock.querySelector("input[name='configuration_group_name']");
            if (groupNameInput) groupNameInput.value = groupData.group_name || "";
            const groupDescTextarea = groupBlock.querySelector("textarea[name='configuration_group_description']");
            if (groupDescTextarea) groupDescTextarea.value = groupData.group_description || "";
            const stepsTbody = groupBlock.querySelector(".configuration-steps-body");
            if (stepsTbody && groupData.steps && Array.isArray(groupData.steps)) {
              populateInstallationOrRollbackTable(stepsTbody, groupData.steps);
            }
          });
        }
      }
      

      

      // Step 6: Scripts
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
      
      // Step 7: Custom Records
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
      
      // Step 8: Workflows & nested States
      if (sectionId === 'step-8') {
        const container = section.querySelector('#workflow-container');
        const template = document.getElementById('workflow-block-template');
        if (sectionData.workflows && Array.isArray(sectionData.workflows) && sectionData.workflows.length > 0) {
          sectionData.workflows.forEach(workflowData => {
            if (workflowData && (workflowData.workflow_name || workflowData.workflow_id)) {
              const workflowBlock = template.content.cloneNode(true).firstElementChild;
              container.appendChild(workflowBlock);
              if (typeof setupWorkflowBlock === 'function') {
                setupWorkflowBlock(workflowBlock);
              }
              populateWorkflowBlock(workflowBlock, workflowData);
            }
          });
        } else {
          // If no workflow exists in JSON, add a default workflow block.
          const workflowBlock = template.content.cloneNode(true).firstElementChild;
          container.appendChild(workflowBlock);
          if (typeof setupWorkflowBlock === 'function') {
            setupWorkflowBlock(workflowBlock);
          }
        }
      }
      
      // Populate table-based data: installationProcess, rollbackProcess, configurationProcess, unitTesting, etc.
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
            if (key === 'installationProcess' || key === 'rollbackProcess' || key === 'configurationProcess') {
              populateInstallationOrRollbackTable(tbody, value);
            } else {
              populateRegularTable(tbody, value);
            }
          }
        }
      });
    });
  }
  
  // --- HELPER FUNCTIONS ---
  
  // Populate a regular table (for fields like unit testing, custom fields, etc.)
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
  
  // Populate script block with data
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
  
  // Populate script tables (parameters, entrypoints, etc.)
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
  
  // Check if a row object is empty
  function isEmptyRow(rowData) {
    return Object.values(rowData).every(value =>
      value === "" || value === null || value === undefined
    );
  }
  
  // Clean data: remove empty objects
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
  
  // Populate custom record block
  function populateRecordBlock(block, data) {
    const nameInput = block.querySelector("input[name='record_name']");
    if (nameInput) nameInput.value = data.name || '';
    const idInput = block.querySelector("input[name='record_id']");
    if (idInput) idInput.value = data.id || '';
    const typeInput = block.querySelector("input[name='record_type']");
    if (typeInput) typeInput.value = data.type || '';
    const descTextarea = block.querySelector("textarea[name='record_description']");
    if (descTextarea) descTextarea.value = data.description || '';
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
  
  // Populate workflow block (including nested state blocks)
  function populateWorkflowBlock(block, data) {
    const wfIdInput = block.querySelector("input[name='workflow_id']");
    if (wfIdInput) wfIdInput.value = data.workflow_id || "";
    const wfNameInput = block.querySelector("input[name='workflow_name']");
    if (wfNameInput) wfNameInput.value = data.workflow_name || "";
    const wfDesc = block.querySelector("textarea[name='workflow_description']");
    if (wfDesc) wfDesc.value = data.workflow_description || "";
    const wfNotes = block.querySelector("textarea[name='workflow_notes']");
    if (wfNotes) wfNotes.value = data.workflow_notes || "";
    
    // Populate nested state blocks
    if (data.states && Array.isArray(data.states)) {
      const statesContainer = block.querySelector(".states-container");
      const stateTemplate = document.getElementById("state-block-template");
      data.states.forEach(stateData => {
        if (stateData && stateData.state_name) {
          const stateBlock = stateTemplate.content.cloneNode(true).firstElementChild;
          statesContainer.appendChild(stateBlock);
          if (typeof setupStateBlock === 'function') {
            setupStateBlock(stateBlock);
          }
          populateStateBlock(stateBlock, stateData);
        }
      });
    }
  }
  
  // Populate individual state block
  function populateStateBlock(block, data) {
    const stateNameInput = block.querySelector("input[name='state_name']");
    if (stateNameInput) stateNameInput.value = data.state_name || "";
    const stateIdInput = block.querySelector("input[name='state_id']");
    if (stateIdInput) stateIdInput.value = (data.details && data.details.state_id) || "";
    const stateDesc = block.querySelector("textarea[name='state_description']");
    if (stateDesc) stateDesc.value = (data.details && data.details.state_description) || "";
    const stateNotes = block.querySelector("textarea[name='state_notes']");
    if (stateNotes) stateNotes.value = (data.details && data.details.state_notes) || "";
    
    // Populate transitions
    if (data.transitions && Array.isArray(data.transitions)) {
      const transitionsTbody = block.querySelector(".transitions-body");
      if (transitionsTbody) {
        populateRegularTable(transitionsTbody, data.transitions);
      }
    }
    
    // Populate actions
    if (data.actions && Array.isArray(data.actions)) {
      const actionsTbody = block.querySelector(".actions-body");
      if (actionsTbody) {
        populateRegularTable(actionsTbody, data.actions);
      }
    }
  }
  
  // Helper: Populate installation/rollback/configuration table rows with auto-numbering
  function populateInstallationOrRollbackTable(tbody, data) {
    tbody.innerHTML = '';
    data.forEach(rowData => {
      if (!isEmptyRow(rowData)) {
        const row = document.createElement("tr");
        // Empty cell for auto-numbering
        const numberCell = document.createElement("td");
        row.appendChild(numberCell);
        
        // Description cell
        const descCell = document.createElement("td");
        const descInput = document.createElement("textarea");
        descInput.className = "form-control";
        descInput.name = "description";
        descInput.placeholder = "Enter description";
        descInput.rows = 2;
        descInput.value = rowData.description || "";
        descCell.appendChild(descInput);
        row.appendChild(descCell);
        
        // Image cell
        const imageCell = document.createElement("td");
        const imageInput = document.createElement("input");
        imageInput.type = "text";
        imageInput.className = "form-control";
        imageInput.name = "installation_image";
        imageInput.placeholder = "Enter image filename";
        imageInput.value = rowData.installation_image || "";
        imageCell.appendChild(imageInput);
        row.appendChild(imageCell);
        
        // Action cell with remove button
        const actionCell = document.createElement("td");
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "btn btn-danger btn-sm";
        removeBtn.addEventListener("click", function() {
          row.remove();
          renumberInstallationRows(tbody);
        });
        actionCell.appendChild(removeBtn);
        row.appendChild(actionCell);
        
        tbody.appendChild(row);
      }
    });
    renumberInstallationRows(tbody);
  }
  
  // Helper: Renumber rows for installation/rollback/configuration tables
  function renumberInstallationRows(tbody) {
    const rows = tbody.querySelectorAll("tr");
    rows.forEach((row, index) => {
      row.cells[0].textContent = index + 1;
    });
  }
  