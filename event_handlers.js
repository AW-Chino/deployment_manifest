document.addEventListener("DOMContentLoaded", function () {
    attachEventListeners();
    initializeScriptSection();
    initializeCustomRecordSection();
    initializeProcessSection();
    setupDocumentationTables();
    initializeTroubleshootingSection();
    navigateToStep(1);
});

function attachEventListeners() {
    document.querySelectorAll(".add-row-btn").forEach(button => {
        button.addEventListener("click", function () {
            let tableBody = document.getElementById(this.dataset.target);
            if (tableBody) {
                addTableRow(tableBody);
            }
        });
    });

    document.querySelectorAll(".step-navigation").forEach(button => {
        button.addEventListener("click", function () {
            let step = parseInt(this.dataset.step, 10);
            navigateToStep(step);
        });
    });

    // Navigation buttons
    const nextButton = document.getElementById("next-btn");
    const prevButton = document.getElementById("prev-btn");
    let currentStep = 1;

    if (nextButton && prevButton) {
        nextButton.addEventListener("click", () => navigateStep(currentStep + 1));
        prevButton.addEventListener("click", () => navigateStep(currentStep - 1));
    }

    // Step links in sidebar
    document.querySelectorAll(".step-link").forEach((link, index) => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            navigateStep(index + 1);
            updateStepLinks(index + 1);
        });
    });
}

function initializeScriptSection() {
    const addScriptBtn = document.getElementById("add-script-btn");
    const scriptsContainer = document.getElementById("scripts-container");
    const scriptTemplate = document.getElementById("script-block-template");

    if (addScriptBtn && scriptsContainer && scriptTemplate) {
        addScriptBtn.addEventListener("click", () => {
            addNewScript(scriptsContainer, scriptTemplate);
        });
    }
}
function initializeTroubleshootingSection() {
    console.log("Initializing Troubleshooting Section");

    // Setup Troubleshooting Table
    const addIssueBtn = document.querySelector('.add-troubleshooting');
    const troubleshootingBody = document.querySelector('.troubleshooting-body');

    if (addIssueBtn && troubleshootingBody) {
        addIssueBtn.addEventListener('click', () => {
            addTroubleshootingRow(troubleshootingBody);
        });
    }
}

function addTroubleshootingRow(tbody) {
    const row = document.createElement('tr');

    const columns = [
        { name: 'Error/Issue', type: 'textarea' },
        { name: 'Cause', type: 'textarea' },
        { name: 'Resolution', type: 'textarea' }
    ];

    columns.forEach(col => {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.className = 'form-control';
        input.type = 'textarea';
        input.placeholder = col.name;
        td.appendChild(input);
        row.appendChild(td);
    });

    // Add remove button
    const actionTd = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'btn btn-danger btn-sm';
    removeBtn.onclick = () => row.remove();
    actionTd.appendChild(removeBtn);
    row.appendChild(actionTd);

    tbody.appendChild(row);
}


function initializeCustomRecordSection() {
    const addRecordBtn = document.getElementById("add-record-btn");
    const recordsContainer = document.getElementById("records-container");
    const recordTemplate = document.getElementById("custom-record-template");

    if (addRecordBtn && recordsContainer && recordTemplate) {
        addRecordBtn.addEventListener("click", () => {
            addNewRecord(recordsContainer, recordTemplate);
        });
    }
}

function addNewRecord(container, template) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = template.innerHTML.trim();
    const recordBlock = tempDiv.firstElementChild;
    const uniqueId = `record-${Date.now()}`;
    recordBlock.id = uniqueId;
    
    setupRecordBlock(recordBlock);
    container.appendChild(recordBlock);
}

function setupRecordBlock(block) {
    // Setup remove record button
    const removeRecordBtn = block.querySelector(".remove-record");
    if (removeRecordBtn) {
        removeRecordBtn.addEventListener("click", () => block.remove());
    }

    // Setup field button
    setupFieldButton(block);
}

function setupFieldButton(block) {
    const addFieldBtn = block.querySelector(".add-field");
    const fieldsBody = block.querySelector(".fields-body");
    
    if (addFieldBtn && fieldsBody) {
        addFieldBtn.addEventListener("click", () => {
            addFieldRow(fieldsBody);
        });
    }
}

function setupDocumentationTables() {
    // Setup Environment IDs table
    const addEnvIdBtn = document.querySelector('.add-environment-id');
    const envIdsBody = document.querySelector('.environment-ids-body');
    
    if (addEnvIdBtn && envIdsBody) {
        addEnvIdBtn.addEventListener('click', () => {
            addEnvironmentIdRow(envIdsBody);
        });
    }
}

function addEnvironmentIdRow(tbody) {
    const row = document.createElement('tr');
    
    // Columns configuration
    const columns = [
        { name: 'Name', type: 'text' },
        { name: 'Notes', type: 'textarea' },
        { name: 'Sandbox Value', type: 'text' },
        { name: 'Production Value', type: 'text' }
    ];

    columns.forEach(col => {
        const td = document.createElement('td');
        const input = col.type === 'textarea' ? 
            document.createElement('textarea') : 
            document.createElement('input');
        
        input.className = 'form-control';
        if (col.type === 'textarea') {
            input.rows = 2;
        } else {
            input.type = 'text';
        }
        input.placeholder = col.name;
        td.appendChild(input);
        row.appendChild(td);
    });

    // Add remove button
    const actionTd = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'btn btn-danger btn-sm';
    removeBtn.onclick = () => row.remove();
    actionTd.appendChild(removeBtn);
    row.appendChild(actionTd);

    tbody.appendChild(row);
}

function addFieldRow(tbody) {
    const columns = [
        { name: 'Field Name', type: 'text' },
        { name: 'Field ID', type: 'text' },
        { name: 'Field Type', type: 'text' },
        { name: 'Field Description', type: 'textarea' }
    ];

    const row = document.createElement("tr");
    
    columns.forEach(col => {
        const td = document.createElement("td");
        const input = col.type === 'textarea' ? 
            document.createElement("textarea") : 
            document.createElement("input");
        
        input.className = "form-control";
        if (input.tagName === 'INPUT') {
            input.type = col.type;
        }
        input.placeholder = col.name;
        td.appendChild(input);
        row.appendChild(td);
    });

    // Add remove button
    const actionTd = document.createElement("td");
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "btn btn-danger btn-sm";
    removeBtn.onclick = () => row.remove();
    actionTd.appendChild(removeBtn);
    row.appendChild(actionTd);

    tbody.appendChild(row);
}



function addNewScript(container, template) {
    // Clear any existing temporary elements
    const existingTemp = document.getElementById('temp-script-container');
    if (existingTemp) existingTemp.remove();

    // Create a temporary container with a unique ID
    const tempDiv = document.createElement('div');
    tempDiv.id = 'temp-script-container';
    tempDiv.innerHTML = template.innerHTML.trim();
    
    const scriptBlock = tempDiv.firstElementChild;
    const uniqueId = `script-${Date.now()}`;
    scriptBlock.id = uniqueId;
    
    setupScriptBlock(scriptBlock);
    container.appendChild(scriptBlock);
    tempDiv.remove();
}
function setupScriptBlock(block) {
    // Setup remove script button
    const removeScriptBtn = block.querySelector(".remove-script");
    if (removeScriptBtn) {
        removeScriptBtn.addEventListener("click", () => block.remove());
    }

    // Setup tab navigation
    setupTabNavigation(block);

    // Setup table buttons
    setupTableButtons(block);
}

function setupTabNavigation(block) {
    const tabs = block.querySelectorAll(".tab-button");
    const panels = block.querySelectorAll(".tab-panel");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetId = tab.getAttribute("data-tab");
            const containingBlock = tab.closest('.script-block');
            const targetPanel = containingBlock.querySelector(`#${targetId}`);
            
            containingBlock.querySelectorAll(".tab-button").forEach(t => t.classList.remove("active"));
            containingBlock.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
            
            tab.classList.add("active");
            if (targetPanel) {
                targetPanel.classList.add("active");
            }
        });
    });
}


function initializeProcessSection() {
    const addProcessBtn = document.getElementById("add-process-btn");
    const processContainer = document.getElementById("process-container");
    const processTemplate = document.getElementById("process-block-template");

    if (addProcessBtn && processContainer && processTemplate) {
        addProcessBtn.addEventListener("click", () => {
            addNewProcess(processContainer, processTemplate);
        });
    }
}

function addNewProcess(container, template) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = template.innerHTML.trim();
    const processBlock = tempDiv.firstElementChild;
    const uniqueId = `process-${Date.now()}`;
    processBlock.id = uniqueId;
    
    setupProcessBlock(processBlock);
    container.appendChild(processBlock);
}

function setupProcessBlock(block) {
    // Setup remove process button
    const removeProcessBtn = block.querySelector(".remove-process");
    if (removeProcessBtn) {
        removeProcessBtn.addEventListener("click", () => block.remove());
    }

    // Setup add step button
    const addStepBtn = block.querySelector(".add-step");
    const stepsBody = block.querySelector(".steps-body");
    
    if (addStepBtn && stepsBody) {
        addStepBtn.addEventListener("click", () => {
            addStepRow(stepsBody);
        });
    }
}

function addStepRow(tbody) {
    const row = document.createElement("tr");
    
    // Step Number cell
    const numberCell = document.createElement("td");
    const numberInput = document.createElement("input");
    numberInput.type = "text";
    numberInput.className = "form-control";
    numberInput.placeholder = "Step Number";
    numberCell.appendChild(numberInput);
    row.appendChild(numberCell);
    
    // Description cell
    const descCell = document.createElement("td");
    const descTextarea = document.createElement("textarea");
    descTextarea.className = "form-control";
    descTextarea.placeholder = "Step Description";
    descTextarea.rows = 2;
    descCell.appendChild(descTextarea);
    row.appendChild(descCell);

    // Actions cell
    const actionCell = document.createElement("td");
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "btn btn-danger btn-sm";
    removeBtn.onclick = () => row.remove();
    actionCell.appendChild(removeBtn);
    row.appendChild(actionCell);

    tbody.appendChild(row);
}



function setupTableButtons(block) {
    const tableConfigs = {
        parameters: [
            { name: 'Parameter Name', type: 'text' },
            { name: 'ID', type: 'text' },
            { name: 'Parameter Type', type: 'text' },
            { name: 'Parameter Description', type: 'text' }
        ],
        entrypoints: [
            { name: 'Entry Point Name', type: 'text' },
            { name: 'Function Name', type: 'text' }
        ],
        'deployment-records': [
            { name: 'Applied To', type: 'text' },
            { name: 'ID', type: 'text' },
            { name: 'Deployment Notes', type: 'textarea' }
        ],
        'version-history': [
            { name: 'Version', type: 'text' },
            { name: 'Date', type: 'date' },
            { name: 'Change Summary', type: 'textarea' },
            { name: 'Commit ID', type: 'text' }
        ],
        libraries: [
            { name: 'Library Name', type: 'text' },
            { name: 'File Name', type: 'text' },
            { name: 'Location', type: 'text' },
            { name: 'Purpose', type: 'text' }
        ],
        'unit-tests': [
            { name: 'Description', type: 'text' },
            { name: 'Result', type: 'text' }
        ]
    };

    Object.entries(tableConfigs).forEach(([type, columns]) => {
        const addBtn = block.querySelector(`.add-${type}`);
        const tbody = block.querySelector(`.${type}-body`);
        
        if (addBtn && tbody) {
            addBtn.addEventListener("click", () => {
                addTableRow(tbody, columns);
            });
        }
    });
}

function addTableRow(tbody, columns) {
    if (!tbody) {
        console.error("Table body not found for adding rows.");
        return;
    }

    const row = document.createElement("tr");
    
    if (Array.isArray(columns)) {
        columns.forEach(col => {
            const td = document.createElement("td");
            const input = col.type === 'textarea' ? 
                document.createElement("textarea") : 
                document.createElement("input");
            
            input.className = "form-control";
            if (input.tagName === 'INPUT') {
                input.type = col.type || 'text';
            }
            input.placeholder = col.name;
            td.appendChild(input);
            row.appendChild(td);
        });
    }

    // Add remove button
    const actionTd = document.createElement("td");
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "btn btn-danger btn-sm";
    removeBtn.onclick = () => row.remove();
    actionTd.appendChild(removeBtn);
    row.appendChild(actionTd);

    tbody.appendChild(row);
}

function navigateToStep(step) {
    document.querySelectorAll(".wizard-step").forEach(section => {
        section.style.display = "none";
    });

    const targetStep = document.getElementById(`step-${step}`);
    if (targetStep) {
        targetStep.style.display = "block";
        updateStepLinks(step);
    }
}

function updateStepLinks(activeStep) {
    document.querySelectorAll(".step-link").forEach((link, index) => {
        link.classList.remove("active");
        if (index + 1 === activeStep) {
            link.classList.add("active");
        }
    });
}

function navigateStep(step) {
    const steps = document.querySelectorAll(".wizard-step");
    if (step < 1 || step > steps.length) return;
    
    document.querySelectorAll(".wizard-step").forEach(section => {
        section.style.display = "none";
    });

    const targetStep = document.getElementById(`step-${step}`);
    if (targetStep) {
        targetStep.style.display = "block";
    }

    // Update button states
    const prevButton = document.getElementById("prev-btn");
    const nextButton = document.getElementById("next-btn");
    if (prevButton) prevButton.disabled = step === 1;
    if (nextButton) nextButton.disabled = step === steps.length;
}


