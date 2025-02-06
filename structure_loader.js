document.addEventListener("DOMContentLoaded", function () {
    console.log("Initializing Wizard with Structure:", structureData);
    initializeWizard(structureData);
 });
 
 function initializeWizard(structure) {
    if (!validateStructure(structure)) return;
 
    const wizardContainer = document.getElementById("wizard");
    if (!wizardContainer) {
        console.error("Wizard container not found in the DOM.");
        return;
    }
 
    structure.groups.forEach((group, index) => {
        console.log(`Processing Group: ${group.name}`);
        const section = createWizardSection(group, index);
        wizardContainer.appendChild(section);
    });
 
    showStep(1);
    attachNavigationHandlers();
    initializeScriptHandlers();
 }
 
 function validateStructure(structure) {
    if (!structure || !structure.groups) {
        console.error("Structure data is invalid or missing groups.");
        return false;
    }
    return true;
 }
 
 function createWizardSection(group, index) {
    const section = document.createElement("section");
    section.id = `step-${index + 1}`;
    section.classList.add("wizard-step");
    section.style.display = "none";
 
    const header = document.createElement("h4");
    header.classList.add("mb-3");
    header.textContent = group.name;
    section.appendChild(header);
 
    group.sections.forEach(sectionData => {
        const sectionBlock = createSectionBlock(sectionData, group.name);
        section.appendChild(sectionBlock);
    });
 
    return section;
 }
 
 function createSectionBlock(sectionData, groupName) {
    const sectionBlock = document.createElement("div");
    sectionBlock.classList.add("section-block", "mb-4");
 
    const subHeader = document.createElement("h5");
    subHeader.textContent = sectionData.name;
    sectionBlock.appendChild(subHeader);
 
    if (["Scripts", "Process", "Custom Records"].includes(groupName)) {
        appendMultiTableRecord(sectionBlock, sectionData, groupName);
    } else if (sectionData.type === "checkboxes") {
        appendCheckboxes(sectionBlock, sectionData);
    } else if (sectionData.type === "fields") {
        appendFields(sectionBlock, sectionData);
    } else if (sectionData.type === "table") {
        appendTable(sectionBlock, sectionData);
    }
 
    return sectionBlock;
 }
 
 function appendMultiTableRecord(container, sectionData, groupName) {
    const recordContainer = document.createElement("div");
    recordContainer.classList.add("multi-record-container");
    container.appendChild(recordContainer);
 
    const addButton = createAddButton(groupName, () => {
        addMultiRecord(recordContainer, sectionData);
    });
    container.appendChild(addButton);
 }
 
 function appendCheckboxes(container, sectionData) {
    sectionData.fields.forEach(field => {
        const checkboxGroup = createCheckboxGroup(field);
        container.appendChild(checkboxGroup);
    });
 }
 
 function appendFields(container, sectionData) {
    const form = document.createElement("form");
    sectionData.fields.forEach(field => {
        const formGroup = createFormGroup(field);
        form.appendChild(formGroup);
    });
    container.appendChild(form);
 }
 
 function appendTable(container, sectionData) {
    const table = createTable(sectionData);
    container.appendChild(table);
 
    const addButton = createAddButton(sectionData.name, () => {
        addTableRow(table.querySelector('tbody'), sectionData.columns);
    });
    container.appendChild(addButton);
 }
 
 function createAddButton(text, clickHandler) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("btn", "btn-secondary", "btn-sm", "mt-2");
    button.textContent = `Add ${text}`;
    button.addEventListener("click", clickHandler);
    return button;
 }
 
 function createCheckboxGroup(field) {
    const group = document.createElement("div");
    group.classList.add("form-check");
 
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = field.name.replace(/\s+/g, "_").toLowerCase();
    input.classList.add("form-check-input");
 
    const label = document.createElement("label");
    label.textContent = field.name;
    label.classList.add("form-check-label");
 
    group.appendChild(input);
    group.appendChild(label);
    return group;
 }
 
 function createFormGroup(field) {
    const group = document.createElement("div");
    group.classList.add("form-group");
 
    const label = document.createElement("label");
    label.textContent = field.name;
 
    const input = document.createElement("input");
    input.type = field.type;
    input.name = field.name.replace(/\s+/g, "_").toLowerCase();
    input.classList.add("form-control");
 
    group.appendChild(label);
    group.appendChild(input);
    return group;
 }
 
 function createTable(sectionData) {
    const table = document.createElement("table");
    table.classList.add("table", "table-bordered");
 
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    sectionData.columns.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col.name;
        headerRow.appendChild(th);
    });
    const actionsHeader = document.createElement("th");
    actionsHeader.textContent = "Actions";
    headerRow.appendChild(actionsHeader);
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
 
    const tbody = document.createElement("tbody");
    tbody.id = `${sectionData.name.replace(/\s+/g, "_").toLowerCase()}-body`;
    table.appendChild(tbody);
 
    return table;
 }
 
 function addMultiRecord(container, sectionData) {
    const recordBlock = document.createElement("div");
    recordBlock.classList.add("multi-record-block", "border", "p-3", "mb-3");
 
    const title = document.createElement("h6");
    title.textContent = `${sectionData.name} Record`;
    recordBlock.appendChild(title);
 
    if (sectionData.type === "fields") {
        appendFields(recordBlock, sectionData);
    }
 
    if (sectionData.type === "table") {
        appendTable(recordBlock, sectionData);
    }
 
    const removeBtn = createRemoveButton(() => recordBlock.remove());
    recordBlock.appendChild(removeBtn);
    container.appendChild(recordBlock);
 }
 
 function addTableRow(tbody, columns) {
    if (!tbody) {
        console.error("Table body not found for adding rows.");
        return;
    }
 
    const row = document.createElement("tr");
 
    columns.forEach(col => {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = col.type || "text";
        input.name = col.name.replace(/\s+/g, "_").toLowerCase();
        input.classList.add("form-control");
        input.placeholder = `Enter ${col.name}`;
        td.appendChild(input);
        row.appendChild(td);
    });
 
    const actionTd = document.createElement("td");
    const removeBtn = createRemoveButton(() => row.remove());
    actionTd.appendChild(removeBtn);
    row.appendChild(actionTd);
 
    tbody.appendChild(row);
 }
 
 function createRemoveButton(clickHandler) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("btn", "btn-danger", "btn-sm", "mt-2");
    button.textContent = "Remove";
    button.addEventListener("click", clickHandler);
    return button;
 }
 
 function initializeScriptHandlers() {
    const addScriptBtn = document.getElementById("add-script-btn");
    const scriptsContainer = document.getElementById("scripts-container");
    const scriptTemplate = document.getElementById("script-block-template");
 
    if (addScriptBtn && scriptsContainer && scriptTemplate) {
        addScriptBtn.addEventListener("click", () => {
            addNewScript(scriptsContainer, scriptTemplate);
        });
    }
 }
 
 function addNewScript(container, template) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = template.innerHTML.trim();
    const scriptBlock = tempDiv.firstElementChild;
    const uniqueId = `script-${Date.now()}`;
    scriptBlock.id = uniqueId;
    
    setupScriptBlock(scriptBlock);
    container.appendChild(scriptBlock);
 }
 
 function setupScriptBlock(block) {
    setupTabNavigation(block);
    
    const removeScriptBtn = block.querySelector(".remove-script");
    if (removeScriptBtn) {
        removeScriptBtn.addEventListener("click", () => block.remove());
    }
 
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
 
 function setupTableButtons(block) {
    const tableConfigs = {
        'parameters': ['Parameter Name', 'ID', 'Parameter Type', 'Parameter Description'],
        'entrypoints': ['Entry Point Name', 'Function Name'],
        'deployment-records': ['Applied To', 'ID', 'Deployment Notes'],
        'version-history': ['Version', 'Date', 'Change Summary', 'Commit ID'],
        'libraries': ['Library Name', 'File Name', 'Location', 'Purpose'],
        'unit-tests': ['Description', 'Result']
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
 
 function showStep(step) {
    document.querySelectorAll(".wizard-step").forEach(section => {
        section.style.display = "none";
    });
 
    const currentStep = document.getElementById(`step-${step}`);
    if (currentStep) {
        currentStep.style.display = "block";
    }
 }
 
 function attachNavigationHandlers() {
    const steps = document.querySelectorAll(".wizard-step");
    const nextButton = document.getElementById("next-btn");
    const prevButton = document.getElementById("prev-btn");
    let currentStep = 1;
 
    function updateButtons() {
        prevButton.disabled = currentStep === 1;
        nextButton.disabled = currentStep === steps.length;
    }
 
    function navigateStep(step) {
        if (step < 1 || step > steps.length) return;
        showStep(step);
        currentStep = step;
        updateButtons();
    }
 
    nextButton?.addEventListener("click", () => navigateStep(currentStep + 1));
    prevButton?.addEventListener("click", () => navigateStep(currentStep - 1));
 
    document.querySelectorAll(".step-link").forEach((link, index) => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            navigateStep(index + 1);
        });
    });
 
    updateButtons();
 }