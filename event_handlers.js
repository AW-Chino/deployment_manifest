// event_handlers.js

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
    initializeRollbackProcessSection(); // New rollback process section
    initializeWorkflowSection();
    initializeInstallationProcessSection();
    initializeConfigurationProcessSection();
    initializeUnitTestSection();
    setupDocumentationTables();
    initializeRegularTables();

    // Hide all wizard steps and show step 1
    document.querySelectorAll(".wizard-step").forEach(section => {
        section.style.display = "none";
    });
    document.getElementById("step-1").style.display = "block";
}

// --- Dynamic Block Initializers ---

// Installation Process Section
function initializeInstallationProcessSection() {
    var btn = document.getElementById("add-installation-process-btn");
    var tbody = document.getElementById("installation-process-body");
    if (btn && tbody) {
        btn.addEventListener("click", function() {
            var stepNumber = tbody.querySelectorAll("tr").length + 1;
            var row = document.createElement("tr");
            // Auto-number Step
            var stepCell = document.createElement("td");
            stepCell.textContent = stepNumber;
            row.appendChild(stepCell);
            // Description
            var descCell = document.createElement("td");
            var descInput = document.createElement("textarea");
            descInput.className = "form-control";
            descInput.name = "description";
            descInput.placeholder = "Enter description";
            descInput.rows = 2;
            descCell.appendChild(descInput);
            row.appendChild(descCell);
            // Image Filename
            var imageCell = document.createElement("td");
            var imageInput = document.createElement("input");
            imageInput.type = "text";
            imageInput.className = "form-control";
            imageInput.name = "installation_image";
            imageInput.placeholder = "Enter image filename";
            imageCell.appendChild(imageInput);
            row.appendChild(imageCell);
            // Action: Remove Button
            var actionCell = document.createElement("td");
            var removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.className = "btn btn-danger btn-sm";
            removeBtn.addEventListener("click", function() {
                row.remove();
                renumberTableRows(tbody);
            });
            actionCell.appendChild(removeBtn);
            row.appendChild(actionCell);
            tbody.appendChild(row);
        });
    }
}

// Rollback Process Section
function initializeRollbackProcessSection() {
    var btn = document.getElementById("add-rollback-process-btn");
    var tbody = document.getElementById("rollback-process-body");
    if (btn && tbody) {
        btn.addEventListener("click", function() {
            var stepNumber = tbody.querySelectorAll("tr").length + 1;
            var row = document.createElement("tr");
            var stepCell = document.createElement("td");
            stepCell.textContent = stepNumber;
            row.appendChild(stepCell);
            var descCell = document.createElement("td");
            var descInput = document.createElement("textarea");
            descInput.className = "form-control";
            descInput.name = "description";
            descInput.placeholder = "Enter description";
            descInput.rows = 2;
            descCell.appendChild(descInput);
            row.appendChild(descCell);
            var imageCell = document.createElement("td");
            var imageInput = document.createElement("input");
            imageInput.type = "text";
            imageInput.className = "form-control";
            imageInput.name = "installation_image";
            imageInput.placeholder = "Enter image filename";
            imageCell.appendChild(imageInput);
            row.appendChild(imageCell);
            var actionCell = document.createElement("td");
            var removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.className = "btn btn-danger btn-sm";
            removeBtn.addEventListener("click", function() {
                row.remove();
                renumberTableRows(tbody);
            });
            actionCell.appendChild(removeBtn);
            row.appendChild(actionCell);
            tbody.appendChild(row);
        });
    }
}
// Configuration Process Section
function initializeConfigurationProcessSection() {
    var btn = document.getElementById("add-configuration-process-btn");
    var tbody = document.getElementById("configuration-process-body");
    if (btn && tbody) {
        btn.addEventListener("click", function() {
            var stepNumber = tbody.querySelectorAll("tr").length + 1;
            var row = document.createElement("tr");
            var stepCell = document.createElement("td");
            stepCell.textContent = stepNumber;
            row.appendChild(stepCell);
            var descCell = document.createElement("td");
            var descInput = document.createElement("textarea");
            descInput.className = "form-control";
            descInput.name = "description";
            descInput.placeholder = "Enter description";
            descInput.rows = 2;
            descCell.appendChild(descInput);
            row.appendChild(descCell);
            var imageCell = document.createElement("td");
            var imageInput = document.createElement("input");
            imageInput.type = "text";
            imageInput.className = "form-control";
            imageInput.name = "installation_image";
            imageInput.placeholder = "Enter image filename";
            imageCell.appendChild(imageInput);
            row.appendChild(imageCell);
            var actionCell = document.createElement("td");
            var removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.className = "btn btn-danger btn-sm";
            removeBtn.addEventListener("click", function() {
                row.remove();
                renumberTableRows(tbody);
            });
            actionCell.appendChild(removeBtn);
            row.appendChild(actionCell);
            tbody.appendChild(row);
        });
    }
}

// Unit Test Section in Documentation
/**
 * AppWrap Code Disclaimer
 * This code is part of the AppWrap application framework.
 * Unauthorized use, modification, or distribution is prohibited.
 * All rights reserved. AppWrap Inc.
 * 
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope Public
 * @author Chino Delal Cruz
 * @date 03/02/2025
 * @version 1.0
 */

/**
 * Initializes the unit test section in the documentation by setting up event listeners
 * for adding and removing unit test rows in the table.
 * @function
 * @return {void}
 */
function initializeUnitTestSection() {
    var btn = document.querySelector(".add-unit-test");
    var tbody = document.getElementById("unit-testing-body");
    
    if (btn && tbody) {
        btn.addEventListener("click", function() {
            var row = document.createElement("tr");
            
            // Business Process cell
            var processCell = document.createElement("td");
            var processInput = document.createElement("textarea");
            processInput.className = "form-control";
            processInput.name = "test_process";
            processInput.placeholder = "Enter business process";
            processInput.rows = 2;
            processCell.appendChild(processInput);
            row.appendChild(processCell);
            
            // Expected Result cell
            var expectedCell = document.createElement("td");
            var expectedInput = document.createElement("textarea");
            expectedInput.className = "form-control";
            expectedInput.name = "test_expected";
            expectedInput.placeholder = "Enter expected result";
            expectedInput.rows = 2;
            expectedCell.appendChild(expectedInput);
            row.appendChild(expectedCell);
            
            // Actual Result cell
            var actualCell = document.createElement("td");
            var actualInput = document.createElement("textarea");
            actualInput.className = "form-control";
            actualInput.name = "test_actual";
            actualInput.placeholder = "Enter actual result";
            actualInput.rows = 2;
            actualCell.appendChild(actualInput);
            row.appendChild(actualCell);
            
            // Pass/Fail cell
            var statusCell = document.createElement("td");
            var statusSelect = document.createElement("select");
            statusSelect.className = "form-control";
            statusSelect.name = "test_status";
            
            var passOption = document.createElement("option");
            passOption.value = "Pass";
            passOption.textContent = "Pass";
            
            var failOption = document.createElement("option");
            failOption.value = "Fail";
            failOption.textContent = "Fail";
            
            statusSelect.appendChild(passOption);
            statusSelect.appendChild(failOption);
            statusCell.appendChild(statusSelect);
            row.appendChild(statusCell);
            
            // Comments cell
            var commentsCell = document.createElement("td");
            var commentsInput = document.createElement("textarea");
            commentsInput.className = "form-control";
            commentsInput.name = "test_comments";
            commentsInput.placeholder = "Enter comments";
            commentsInput.rows = 2;
            commentsCell.appendChild(commentsInput);
            row.appendChild(commentsCell);
            
            // Action cell (for remove button)
            var actionCell = document.createElement("td");
            var removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.className = "btn btn-danger btn-sm";
            removeBtn.addEventListener("click", function() {
                row.remove();
            });
            actionCell.appendChild(removeBtn);
            row.appendChild(actionCell);
            
            tbody.appendChild(row);
        });
    }
}
// Helper: Renumber table rows in a tbody
function renumberTableRows(tbody) {
    const rows = tbody.querySelectorAll("tr");
    rows.forEach((row, index) => {
        if (row.cells.length > 0) {
            row.cells[0].textContent = index + 1;
        }
    });
}

// Regular Tables Initialization (Attach add handlers for basic tables)
function initializeRegularTables() {
    attachAddHandler('add-version', 'version-history-body', [
        { name: 'Version', type: 'text', key: 'version' },
        { name: 'Date', type: 'date', key: 'date' },
        { name: 'Change Summary', type: 'textarea', key: 'change_summary' }
    ]);
    attachAddHandler('add-user-story', 'user-stories-body', [
        { name: 'Title', type: 'text', key: 'story_id' },
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
    attachAddHandler('add-deployment-dependency', 'deployment-dependencies-body', [
        { name: 'Dependency Name', type: 'text', key: 'dependency_name' },
        { name: 'Dependency Version', type: 'text', key: 'dependency_version' },
        { name: 'Dependency License', type: 'text', key: 'dependency_license' },
        { name: 'Link', type: 'text', key: 'dependency_link' }
    ]);
    attachAddHandler('add-dev-dependency', 'dev-dependencies-body', [
        { name: 'Dependency Name', type: 'text', key: 'dependency_name' },
        { name: 'Dependency Version', type: 'text', key: 'dependency_version' },
        { name: 'Dependency License', type: 'text', key: 'dependency_license' },
        { name: 'Link', type: 'text', key: 'dependency_link' }
    ]);
    attachAddHandler('add-custom-field', 'custom-fields-body', [
        { name: 'Custom Field Name', type: 'text', key: 'field_name' },
        { name: 'Field ID', type: 'text', key: 'field_id' },
        { name: 'Field Type', type: 'text', key: 'field_type' },
        { name: 'Field Description', type: 'textarea', key: 'field_description' }
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

// Navigation Event Handlers
function attachEventListeners() {
    document.querySelectorAll(".step-navigation").forEach(button => {
        button.addEventListener("click", function () {
            const step = parseInt(this.dataset.step, 10);
            navigateToStep(step);
        });
    });
    document.querySelectorAll(".step-link").forEach((link, index) => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            navigateToStep(index + 1);
            updateStepLinks(index + 1);
        });
    });
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
            const scriptBlock = scriptTemplate.content.cloneNode(true).firstElementChild;
            const uniqueId = `script-${Date.now()}`;
            scriptBlock.id = uniqueId;
            setupScriptBlock(scriptBlock);
            scriptsContainer.appendChild(scriptBlock);
            return scriptBlock;
        });
    }
}

function setupTabNavigation(block) {
    const tabs = block.querySelectorAll(".tab-button");
    const panels = block.querySelectorAll(".tab-panel");

    tabs.forEach(tab => {
        tab.addEventListener("click", function() {
            // Remove 'active' from all tabs & panels in this block
            tabs.forEach(t => t.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            // Add 'active' to the clicked tab
            tab.classList.add("active");

            // Get the data-tab value, find the matching panel
            const target = tab.getAttribute("data-tab");
            const targetPanel = block.querySelector(`.tab-panel[data-tab="${target}"]`);
            if (targetPanel) {
                targetPanel.classList.add("active");
            }
        });
    });
}


function setupScriptBlock(block) {
    const removeScriptBtn = block.querySelector(".remove-script");
    if (removeScriptBtn) {
        removeScriptBtn.addEventListener("click", () => block.remove());
    }
    // Important: attach the tab logic
    setupTabNavigation(block);
    setupTableButtons(block);
    addDataAttributes(block, "script");
}


function addNewScript(container, template) {
    const scriptBlock = template.content.cloneNode(true).firstElementChild;
    const uniqueId = `script-${Date.now()}`;
    scriptBlock.id = uniqueId;
    setupScriptBlock(scriptBlock);
    container.appendChild(scriptBlock);
}

function setupScriptBlock(block) {
    const removeScriptBtn = block.querySelector(".remove-script");
    if (removeScriptBtn) {
        removeScriptBtn.addEventListener("click", () => block.remove());
    }
    setupTabNavigation(block);
    setupTableButtons(block);
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
    const removeRecordBtn = block.querySelector(".remove-record");
    if (removeRecordBtn) {
        removeRecordBtn.addEventListener("click", () => block.remove());
    }
    setupFieldButton(block);
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
    const removeProcessBtn = block.querySelector(".remove-process");
    if (removeProcessBtn) {
        removeProcessBtn.addEventListener("click", () => block.remove());
    }
    const addStepBtn = block.querySelector(".add-step");
    const stepsBody = block.querySelector(".steps-body");
    if (addStepBtn && stepsBody) {
        addStepBtn.addEventListener("click", () => {
            addStepRow(stepsBody);
        });
    }
    addDataAttributes(block, 'process');
}

// Helper: Add a new step row in a process block
function addStepRow(tbody) {
    const row = document.createElement("tr");
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
            { name: 'Deployment Notes', type: 'textarea', key: 'deployment_notes' },
            { name: 'Screenshot', type: 'text', key: 'deployment_img' }
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
     //   'unit-tests': [
     //       { name: 'Description', type: 'textarea', key: 'test_description' },
    //        { name: 'Result', type: 'text', key: 'test_result' }
      //  ]
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
        const input = col.type === 'textarea' ? document.createElement("textarea") : document.createElement("input");
        input.className = "form-control";
        input.type = col.type;
        input.name = col.key;
        input.placeholder = col.name;
        input.setAttribute('data-field', col.key);
        td.appendChild(input);
        row.appendChild(td);
    });
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
        const input = col.type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
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
    const actionTd = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'btn btn-danger btn-sm';
    removeBtn.onclick = () => row.remove();
    actionTd.appendChild(removeBtn);
    row.appendChild(actionTd);
    tbody.appendChild(row);
}

// Navigation functions
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

function addDataAttributes(block, type) {
    block.querySelectorAll('input, textarea, select').forEach(input => {
        if (!input.hasAttribute('data-field')) {
            const fieldName = input.placeholder ? input.placeholder.toLowerCase().replace(/\s+/g, '_') : input.name;
            input.setAttribute('data-field', fieldName);
            input.name = fieldName;
        }
    });
    block.setAttribute('data-block-type', type);
}

function clearDynamicBlocks() {
    const containerIds = [
      'scripts-container',
      'records-container',
      'process-container',
      'workflow-container',
      'installation-process-body',
      'rollback-process-body',
      'configuration-process-body',
      'unit-testing-body'
    ];
    containerIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = '';
      }
    });
}

function reloadDynamicBlocks() {
    initializeScriptSection();
    initializeCustomRecordSection();
    initializeProcessSection();
}

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

// --- Missing Functions ---

// Function to add a rollback block from the template
function addNewRollback(container, template) {
  const rollbackBlock = template.content.cloneNode(true).firstElementChild;
  const uniqueId = `rollback-${Date.now()}`;
  rollbackBlock.id = uniqueId;
  setupRollbackBlock(rollbackBlock);
  container.appendChild(rollbackBlock);
}

// Setup function for a rollback block
function setupRollbackBlock(block) {
  // Assuming rollback block remove button uses class "remove-rollback"
  const removeRollbackBtn = block.querySelector(".remove-rollback");
  if (removeRollbackBtn) {
      removeRollbackBtn.addEventListener("click", () => block.remove());
  }
  addDataAttributes(block, 'rollback');
}

// Function to initialize the Workflow section
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

// Helper to add a new workflow block
function addNewWorkflow(container, template) {
  const workflowBlock = template.content.cloneNode(true).firstElementChild;
  const uniqueId = `workflow-${Date.now()}`;
  workflowBlock.id = uniqueId;
  setupWorkflowBlock(workflowBlock);
  container.appendChild(workflowBlock);
}

// Setup function for workflow block
function setupWorkflowBlock(block) {
    // Remove workflow button
    const removeWorkflowBtn = block.querySelector(".remove-workflow");
    if (removeWorkflowBtn) {
        removeWorkflowBtn.addEventListener("click", () => block.remove());
    }
    // Setup add action button in workflow block
    const addActionBtn = block.querySelector(".add-action");
    const actionsBody = block.querySelector(".actions-body");
    if (addActionBtn && actionsBody) {
        addActionBtn.addEventListener("click", () => {
            addActionRow(actionsBody);
        });
    }
    addDataAttributes(block, 'workflow');
}

// Helper to add a new action row in a workflow block
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
    const actionTd = document.createElement("td");
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "btn btn-danger btn-sm";
    removeBtn.onclick = () => row.remove();
    actionTd.appendChild(removeBtn);
    row.appendChild(actionTd);
    tbody.appendChild(row);
}

// Function to set up the "Add Field" button in a custom record block
function setupFieldButton(block) {
  const addFieldBtn = block.querySelector(".add-field");
  const fieldsBody = block.querySelector(".fields-body");
  if (addFieldBtn && fieldsBody) {
    addFieldBtn.addEventListener("click", () => {
      addFieldRow(fieldsBody);
    });
  }
}

// Helper to add a new field row (for custom record fields)
function addFieldRow(tbody) {
  const columns = [
    { name: 'Field Name', type: 'text', key: 'field_name' },
    { name: 'Field ID', type: 'text', key: 'field_id' },
    { name: 'Field Type', type: 'text', key: 'field_type' },
    { name: 'Field Description', type: 'textarea', key: 'field_description' }
  ];
  addTableRow(tbody, columns);
}
