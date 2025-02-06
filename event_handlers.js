document.addEventListener("DOMContentLoaded", function () {
    attachEventListeners();
    initializeScriptSection();
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