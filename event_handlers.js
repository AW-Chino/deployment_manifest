document.addEventListener("DOMContentLoaded", function () {
    attachEventListeners();
    initializeSections();
    navigateToStep(1);
});

function initializeSections() {
    // Initialize dynamic block sections
    initializeScriptSection();
    initializeCustomRecordSection();
    initializeProcessSection();

    // NEW: Initialize Rollback and Workflow sections
    initializeRollbackSection();
    initializeWorkflowSection();

    // Initialize documentation tables
    setupDocumentationTables();

    // Initialize regular tables
    initializeRegularTables();

    document.querySelectorAll(".wizard-step").forEach(section => {
        section.style.display = "none";
    });

    document.getElementById("step-1").style.display = "block"; // Show only step 1 on load

}
// ===================
// New: Rollback Section
// ===================

function initializeRollbackSection() {
    const addRollbackBtn = document.getElementById("add-rollback-btn");
    const rollbackContainer = document.getElementById("rollback-container");
    const rollbackTemplate = document.getElementById("rollback-block-template");

    if (addRollbackBtn && rollbackContainer && rollbackTemplate) {
        addRollbackBtn.addEventListener("click", () => {
            addNewRollback(rollbackContainer, rollbackTemplate);
        });
    }
}

function addNewRollback(container, template) {
    const rollbackBlock = template.content.cloneNode(true).firstElementChild;
    const uniqueId = `rollback-${Date.now()}`;
    rollbackBlock.id = uniqueId;

    setupRollbackBlock(rollbackBlock);
    container.appendChild(rollbackBlock);
}

function setupRollbackBlock(block) {
    // Set up remove button
    const removeRollbackBtn = block.querySelector(".remove-rollback");
    if (removeRollbackBtn) {
        removeRollbackBtn.addEventListener("click", () => block.remove());
    }

    // Set up Code Differences table add button
    const addCodeDiffBtn = block.querySelector(".add-code-difference");
    const codeDiffsBody = block.querySelector(".code-differences-body");

    if (addCodeDiffBtn && codeDiffsBody) {
        addCodeDiffBtn.addEventListener("click", () => {
            addCodeDiffRow(codeDiffsBody);
        });
    }

    // Add data attributes for JSON handling
    addDataAttributes(block, 'rollback');
}

function addCodeDiffRow(tbody) {
    const row = document.createElement("tr");
    const columns = [
        { name: 'Script', type: 'text', key: 'script' },
        { name: 'Description', type: 'textarea', key: 'description' },
        { name: 'Code', type: 'textarea', key: 'code' }
    ];

    columns.forEach(col => {
        const td = document.createElement("td");
        let input;
        if (col.type === 'textarea') {
            input = document.createElement("textarea");
            input.rows = 2;
        } else {
            input = document.createElement("input");
            input.type = col.type;
        }
        input.className = "form-control";
        input.name = col.key;
        input.placeholder = col.name;
        input.setAttribute('data-field', col.key);
        td.appendChild(input);
        row.appendChild(td);
    });

    // Add remove button cell
    const actionTd = document.createElement("td");
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "btn btn-danger btn-sm";
    removeBtn.onclick = () => row.remove();
    actionTd.appendChild(removeBtn);
    row.appendChild(actionTd);

    tbody.appendChild(row);
}

// ===================
// New: Workflow Section (Custom Records)
// ===================

function initializeWorkflowSection() {
    const addWorkflowBtn = document.getElementById("add-workflow-btn");
    const workflowContainer = document.getElementById("workflow-container");
    const workflowTemplate = document.getElementById("workflow-block-template");

    if (addWorkflowBtn && workflowContainer && workflowTemplate) {
        addWorkflowBtn.addEventListener("click", () => {
            addNewWorkflow(workflowContainer, workflowTemplate);
        });
    }
}

function addNewWorkflow(container, template) {
    const workflowBlock = template.content.cloneNode(true).firstElementChild;
    const uniqueId = `workflow-${Date.now()}`;
    workflowBlock.id = uniqueId;

    setupWorkflowBlock(workflowBlock);
    container.appendChild(workflowBlock);
}

function setupWorkflowBlock(block) {
    // Set up remove workflow button
    const removeWorkflowBtn = block.querySelector(".remove-workflow");
    if (removeWorkflowBtn) {
        removeWorkflowBtn.addEventListener("click", () => block.remove());
    }

    // Set up Add Action button in the workflow block
    const addActionBtn = block.querySelector(".add-action");
    const actionsBody = block.querySelector(".actions-body");
    if (addActionBtn && actionsBody) {
        addActionBtn.addEventListener("click", () => {
            addActionRow(actionsBody);
        });
    }

    // Add data attributes for JSON handling
    addDataAttributes(block, 'workflow');
}

function addActionRow(tbody) {
    const row = document.createElement("tr");
    const columns = [
        { name: 'Action', type: 'text', key: 'action' },
        { name: 'State', type: 'text', key: 'state' },
        { name: 'Details', type: 'textarea', key: 'details' }
    ];

    columns.forEach(col => {
        const td = document.createElement("td");
        let input;
        if (col.type === 'textarea') {
            input = document.createElement("textarea");
            input.rows = 2;
        } else {
            input = document.createElement("input");
            input.type = col.type;
        }
        input.className = "form-control";
        input.name = col.key;
        input.placeholder = col.name;
        input.setAttribute('data-field', col.key);
        td.appendChild(input);
        row.appendChild(td);
    });

    // Add remove button cell
    const actionTd = document.createElement("td");
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "btn btn-danger btn-sm";
    removeBtn.onclick = () => row.remove();
    actionTd.appendChild(removeBtn);
    row.appendChild(actionTd);

    tbody.appendChild(row);
}

function initializeRegularTables() {
    // Project Information (Step 1)
    attachAddHandler('add-version', 'version-history-body', [
        { name: 'Version', type: 'text', key: 'version' },
        { name: 'Date', type: 'date', key: 'date' },
        { name: 'Change Summary', type: 'textarea', key: 'change_summary' }
    ]);

    // Project Scope (Step 2)
    attachAddHandler('add-user-story', 'user-stories-body', [
        { name: 'ID', type: 'text', key: 'story_id' },
        { name: 'Description', type: 'textarea', key: 'story_description' }
    ]);

    attachAddHandler('add-feature', 'features-body', [
        { name: 'Title', type: 'text', key: 'feature_title' },
        { name: 'Description', type: 'textarea', key: 'feature_description' }
    ]);

    attachAddHandler('add-usage', 'usage-body', [
        { name: 'Title', type: 'text', key: 'usage_title' },
        { name: 'Description', type: 'textarea', key: 'usage_description' }
    ]);

    // ReadMe Doc (Step 4)
    attachAddHandler('add-deployment-dependency', 'deployment-dependencies-body', [
        { name: 'Dependency Name', type: 'text', key: 'dependency_name' },
        { name: 'Dependency Version', type: 'text', key: 'dependency_version' },
        { name: 'Dependency License', type: 'text', key: 'dependency_license' }
    ]);

    attachAddHandler('add-dev-dependency', 'dev-dependencies-body', [
        { name: 'Dependency Name', type: 'text', key: 'dependency_name' },
        { name: 'Dependency Version', type: 'text', key: 'dependency_version' },
        { name: 'Dependency License', type: 'text', key: 'dependency_license' }
    ]);

    // Components (Step 7)
    attachAddHandler('add-custom-field', 'custom-fields-body', [
        { name: 'Field Name', type: 'text', key: 'field_name' },
        { name: 'ID', type: 'text', key: 'field_id' },
        { name: 'Description', type: 'textarea', key: 'field_description' }
    ]);

    attachAddHandler('add-template', 'templates-body', [
        { name: 'Template Name', type: 'text', key: 'template_name' },
        { name: 'ID', type: 'text', key: 'template_id' },
        { name: 'Type', type: 'text', key: 'template_type' },
        { name: 'Description', type: 'textarea', key: 'template_description' }
    ]);

    attachAddHandler('add-saved-search', 'saved-searches-body', [
        { name: 'Search Name', type: 'text', key: 'search_name' },
        { name: 'ID', type: 'text', key: 'search_id' },
        { name: 'Description', type: 'textarea', key: 'search_description' },
        { name: 'Criteria', type: 'textarea', key: 'search_criteria' },
        { name: 'Results', type: 'textarea', key: 'search_results' }
    ]);

    // Contact (Step 10)
    attachAddHandler('add-developer', 'developers-body', [
        { name: 'Name', type: 'text', key: 'developer_name' },
        { name: 'Email', type: 'email', key: 'developer_email' },
        { name: 'Note', type: 'text', key: 'developer_note' }
    ]);

    attachAddHandler('add-functional', 'functional-body', [
        { name: 'Name', type: 'text', key: 'functional_name' },
        { name: 'Email', type: 'email', key: 'functional_email' },
        { name: 'Note', type: 'text', key: 'functional_note' }
    ]);
}

function attachAddHandler(buttonClass, tbodyId, columns) {
    const addButton = document.querySelector(`.${buttonClass}`);
    const tbody = document.getElementById(tbodyId);
    
    if (addButton && tbody) {
        addButton.addEventListener('click', () => {
            addTableRow(tbody, columns);
        });
    }
}


function attachEventListeners() {
    // Navigation event listeners
    document.querySelectorAll(".step-navigation").forEach(button => {
        button.addEventListener("click", function () {
            const step = parseInt(this.dataset.step, 10);
            navigateToStep(step);
        });
    });

    // Step links in sidebar
    document.querySelectorAll(".step-link").forEach((link, index) => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            navigateToStep(index + 1);
            updateStepLinks(index + 1);
        });
    });

    // Next/Previous buttons
    const nextButton = document.getElementById("next-btn");
    const prevButton = document.getElementById("prev-btn");
    if (nextButton && prevButton) {
        nextButton.addEventListener("click", () => navigateStep(getCurrentStep() + 1));
        prevButton.addEventListener("click", () => navigateStep(getCurrentStep() - 1));
    }
}

function getCurrentStep() {
    const visibleStep = document.querySelector(".wizard-step[style*='display: block']");
    return visibleStep ? parseInt(visibleStep.id.split('-')[1], 10) : 1;
}

// Script Section Handlers
function initializeScriptSection() {
    const addScriptBtn = document.getElementById("add-script-btn");
    const scriptsContainer = document.getElementById("scripts-container");
    const scriptTemplate = document.getElementById("script-block-template");

    if (addScriptBtn && scriptsContainer && scriptTemplate) {
        addScriptBtn.addEventListener("click", () => {
            // Create a new script block from template
            const scriptBlock = scriptTemplate.content.cloneNode(true).firstElementChild;
            const uniqueId = `script-${Date.now()}`;
            scriptBlock.id = uniqueId;
            
            // Set up the new block
            setupScriptBlock(scriptBlock);
            
            // Add to container
            scriptsContainer.appendChild(scriptBlock);
            return scriptBlock; // Return for chaining
        });
    }
}

function setupTabNavigation(block) {
    const tabs = block.querySelectorAll(".tab-button");
    const panels = block.querySelectorAll(".tab-panel");

    tabs.forEach(tab => {
        tab.addEventListener("click", function() {
            // Remove active class from all tabs and panels
            tabs.forEach(t => t.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            // Activate selected tab and corresponding panel
            this.classList.add("active");
            const targetPanel = block.querySelector(`#${this.dataset.tab}`);
            if (targetPanel) {
                targetPanel.classList.add("active");
            }
        });
    });
}


function addNewScript(container, template) {
    const scriptBlock = template.content.cloneNode(true).firstElementChild;
    const uniqueId = `script-${Date.now()}`;
    scriptBlock.id = uniqueId;
    
    setupScriptBlock(scriptBlock);
    container.appendChild(scriptBlock);
}

function setupScriptBlock(block) {
    // Remove script button
    const removeScriptBtn = block.querySelector(".remove-script");
    if (removeScriptBtn) {
        removeScriptBtn.addEventListener("click", () => block.remove());
    }

    // Tab navigation
    setupTabNavigation(block);

    // Table buttons
    setupTableButtons(block);

    // Add data attributes for JSON handling
    addDataAttributes(block, 'script');
}

// Custom Record Section Handlers
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
    const recordBlock = template.content.cloneNode(true).firstElementChild;
    const uniqueId = `record-${Date.now()}`;
    recordBlock.id = uniqueId;
    
    setupRecordBlock(recordBlock);
    container.appendChild(recordBlock);
}

function setupRecordBlock(block) {
    // Remove record button
    const removeRecordBtn = block.querySelector(".remove-record");
    if (removeRecordBtn) {
        removeRecordBtn.addEventListener("click", () => block.remove());
    }

    // Field button
    setupFieldButton(block);

    // Add data attributes for JSON handling
    addDataAttributes(block, 'record');
}

// Process Section Handlers
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
    const processBlock = template.content.cloneNode(true).firstElementChild;
    const uniqueId = `process-${Date.now()}`;
    processBlock.id = uniqueId;
    
    setupProcessBlock(processBlock);
    container.appendChild(processBlock);
}

function setupProcessBlock(block) {
    // Remove process button
    const removeProcessBtn = block.querySelector(".remove-process");
    if (removeProcessBtn) {
        removeProcessBtn.addEventListener("click", () => block.remove());
    }

    // Add step button
    const addStepBtn = block.querySelector(".add-step");
    const stepsBody = block.querySelector(".steps-body");
    
    if (addStepBtn && stepsBody) {
        addStepBtn.addEventListener("click", () => {
            addStepRow(stepsBody);
        });
    }

    // Add data attributes for JSON handling
    addDataAttributes(block, 'process');
}

// Table Management
function setupTableButtons(block) {
    const tableConfigs = {
        parameters: [
            { name: 'Parameter Name', type: 'text', key: 'parameter_name' },
            { name: 'ID', type: 'text', key: 'parameter_id' },
            { name: 'Parameter Type', type: 'text', key: 'parameter_type' },
            { name: 'Parameter Description', type: 'textarea', key: 'parameter_description' }
        ],
        entrypoints: [
            { name: 'Entry Point Name', type: 'text', key: 'entry_point_name' },
            { name: 'Function Name', type: 'text', key: 'function_name' }
        ],
        'deployment-records': [
            { name: 'Applied To', type: 'text', key: 'applied_to' },
            { name: 'ID', type: 'text', key: 'deployment_id' },
            { name: 'Deployment Notes', type: 'textarea', key: 'deployment_notes' }
        ],
        'version-history': [
            { name: 'Version', type: 'text', key: 'version' },
            { name: 'Date', type: 'date', key: 'date' },
            { name: 'Change Summary', type: 'textarea', key: 'change_summary' },
            { name: 'Commit ID', type: 'text', key: 'commit_id' }
        ],
        libraries: [
            { name: 'Library Name', type: 'text', key: 'library_name' },
            { name: 'File Name', type: 'text', key: 'file_name' },
            { name: 'Location', type: 'text', key: 'location' },
            { name: 'Purpose', type: 'text', key: 'purpose' }
        ],
        'unit-tests': [
            { name: 'Description', type: 'textarea', key: 'test_description' },
            { name: 'Result', type: 'text', key: 'test_result' }
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
    const row = document.createElement("tr");
    
    columns.forEach(col => {
        const td = document.createElement("td");
        const input = col.type === 'textarea' ? 
            document.createElement("textarea") : 
            document.createElement("input");
        
        input.className = "form-control";
        input.type = col.type;
        input.name = col.key;
        input.placeholder = col.name;
        input.setAttribute('data-field', col.key);
        
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

// Documentation Tables
function setupDocumentationTables() {
    setupTroubleshootingTable();
    setupEnvironmentIDsTable();
}

function setupTroubleshootingTable() {
    const addIssueBtn = document.querySelector('.add-troubleshooting');
    const troubleshootingBody = document.querySelector('.troubleshooting-body');

    if (addIssueBtn && troubleshootingBody) {
        addIssueBtn.addEventListener('click', () => {
            addTroubleshootingRow(troubleshootingBody);
        });
    }
}

function setupEnvironmentIDsTable() {
    const addEnvIdBtn = document.querySelector('.add-environment-id');
    const envIdsBody = document.querySelector('.environment-ids-body');
    
    if (addEnvIdBtn && envIdsBody) {
        addEnvIdBtn.addEventListener('click', () => {
            addEnvironmentIdRow(envIdsBody);
        });
    }
}

function addTroubleshootingRow(tbody) {
    const row = document.createElement('tr');

    const columns = [
        { name: 'Error/Issue', type: 'textarea', key: 'error_issue' },
        { name: 'Cause', type: 'textarea', key: 'cause' },
        { name: 'Resolution', type: 'textarea', key: 'resolution' }
    ];

    columns.forEach(col => {
        const td = document.createElement('td');
        const input = document.createElement(col.type === 'textarea' ? 'textarea' : 'input');
        input.className = 'form-control';
        input.type = col.type === 'textarea' ? undefined : col.type;
        input.name = col.key;
        input.placeholder = col.name;
        input.setAttribute('data-field', col.key);
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

function addEnvironmentIdRow(tbody) {
    const row = document.createElement('tr');
    
    const columns = [
        { name: 'Name', type: 'text', key: 'env_name' },
        { name: 'Notes', type: 'textarea', key: 'env_notes' },
        { name: 'Sandbox Value', type: 'textarea', key: 'sandbox_value' },
        { name: 'Production Value', type: 'textarea', key: 'production_value' }
    ];

    columns.forEach(col => {
        const td = document.createElement('td');
        const input = col.type === 'textarea' ? 
            document.createElement('textarea') : 
            document.createElement('input');
        
        input.className = 'form-control';
        if (col.type !== 'textarea') {
            input.type = col.type;
        }
        input.name = col.key;
        input.placeholder = col.name;
        input.setAttribute('data-field', col.key);
        
        if (col.type === 'textarea') {
            input.rows = 2;
        }
        
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

// Navigation
function navigateToStep(step) {
    document.querySelectorAll(".wizard-step").forEach(section => {
        section.style.display = "none";
    });

    const targetStep = document.getElementById(`step-${step}`);
    if (targetStep) {
        targetStep.style.display = "block";
        updateStepLinks(step);
        updateNavigationButtons(step);
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

function updateNavigationButtons(step) {
    const prevButton = document.getElementById("prev-btn");
    const nextButton = document.getElementById("next-btn");
    const totalSteps = document.querySelectorAll(".wizard-step").length;

    if (prevButton) prevButton.disabled = step === 1;
    if (nextButton) nextButton.disabled = step === totalSteps;
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

function addFieldRow(tbody) {
    const columns = [
        { name: 'Field Name', type: 'text', key: 'field_name' },
        { name: 'Field ID', type: 'text', key: 'field_id' },
        { name: 'Field Type', type: 'text', key: 'field_type' },
        { name: 'Field Description', type: 'textarea', key: 'field_description' }
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
        input.name = col.key;
        input.placeholder = col.name;
        input.setAttribute('data-field', col.key);
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

function addStepRow(tbody) {
    const row = document.createElement("tr");
    /*
    // Step Number cell
    const numberCell = document.createElement("td");
    const numberInput = document.createElement("input");
    numberInput.type = "text";
    numberInput.className = "form-control";
    numberInput.placeholder = "Step Number";
    numberInput.name = "step_number";
    numberInput.setAttribute('data-field', 'step_number');
    numberCell.appendChild(numberInput);
    row.appendChild(numberCell);*/
    
    // Description cell
    const descCell = document.createElement("td");
    const descTextarea = document.createElement("textarea");
    descTextarea.className = "form-control";
    descTextarea.placeholder = "Step Description";
    descTextarea.name = "step_description";
    descTextarea.setAttribute('data-field', 'step_description');
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

    // Update step links
    updateStepLinks(step);
}

// Utility Functions
function addDataAttributes(block, type) {
    // Add data attributes to inputs for proper JSON serialization
    block.querySelectorAll('input, textarea, select').forEach(input => {
        if (!input.hasAttribute('data-field')) {
            const fieldName = input.placeholder ? 
                input.placeholder.toLowerCase().replace(/\s+/g, '_') :
                input.name;
            input.setAttribute('data-field', fieldName);
            input.name = fieldName;
        }
    });

    // Add type identifier to the block
    block.setAttribute('data-block-type', type);
}


function clearDynamicBlocks() {
    // Clear all dynamic block containers
    document.getElementById('scripts-container').innerHTML = '';
    document.getElementById('records-container').innerHTML = '';
    document.getElementById('process-container').innerHTML = '';
}

function reloadDynamicBlocks() {
    // Reinitialize all dynamic blocks
    initializeScriptSection();
    initializeCustomRecordSection();
    initializeProcessSection();
}

// Export functions for use in json_handler.js
window.clearDynamicBlocks = clearDynamicBlocks;
window.reloadDynamicBlocks = reloadDynamicBlocks;
window.addNewScript = addNewScript;
window.addNewRecord = addNewRecord;
window.addNewProcess = addNewProcess;
window.setupScriptBlock = setupScriptBlock;
window.setupRecordBlock = setupRecordBlock;
window.setupProcessBlock = setupProcessBlock;
window.addNewRollback = addNewRollback;
window.setupRollbackBlock = setupRollbackBlock;
window.addNewWorkflow = addNewWorkflow;
window.setupWorkflowBlock = setupWorkflowBlock;