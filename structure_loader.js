document.addEventListener("DOMContentLoaded", function () {
    console.log("Initializing Wizard with Structure:", structureData);
    initializeWizard(structureData);
    attachTableHandlers();
});

function initializeWizard(structure) {
    if (!validateStructure(structure)) return;

    const wizardContainer = document.getElementById("wizard");
    if (!wizardContainer) {
        console.error("Wizard container not found in the DOM.");
        return;
    }

    attachNavigationHandlers();
    showStep(1);
}

function validateStructure(structure) {
    if (!structure || !structure.groups) {
        console.error("Structure data is invalid or missing groups.");
        return false;
    }
    return true;
}

function attachTableHandlers() {
    // Project Information (Step 1)
    attachAddButtonHandler('add-version', 'version-history-body', [
        { name: 'Version', type: 'text', key: 'version' },
        { name: 'Date', type: 'date', key: 'date' },
        { name: 'Change Summary', type: 'textarea', key: 'change_summary' }
    ]);

    // Project Scope (Step 2)
    attachAddButtonHandler('add-user-story', 'user-stories-body', [
        { name: 'ID', type: 'text', key: 'story_id' },
        { name: 'Description', type: 'textarea', key: 'story_description' }
    ]);

    attachAddButtonHandler('add-feature', 'features-body', [
        { name: 'Title', type: 'text', key: 'feature_title' },
        { name: 'Description', type: 'textarea', key: 'feature_description' }
    ]);

    attachAddButtonHandler('add-usage', 'usage-body', [
        { name: 'Title', type: 'text', key: 'usage_title' },
        { name: 'Description', type: 'textarea', key: 'usage_description' }
    ]);

    // ReadMe Doc (Step 4)
    attachAddButtonHandler('add-deployment-dependency', 'deployment-dependencies-body', [
        { name: 'Dependency Name', type: 'text', key: 'dependency_name' },
        { name: 'Dependency Version', type: 'text', key: 'dependency_version' },
        { name: 'Dependency License', type: 'text', key: 'dependency_license' }
    ]);

    attachAddButtonHandler('add-dev-dependency', 'dev-dependencies-body', [
        { name: 'Dependency Name', type: 'text', key: 'dependency_name' },
        { name: 'Dependency Version', type: 'text', key: 'dependency_version' },
        { name: 'Dependency License', type: 'text', key: 'dependency_license' }
    ]);

    // Components (Step 7)
    attachAddButtonHandler('add-custom-field', 'custom-fields-body', [
        { name: 'Field Name', type: 'text', key: 'field_name' },
        { name: 'ID', type: 'text', key: 'field_id' },
        { name: 'Description', type: 'textarea', key: 'field_description' }
    ]);

    attachAddButtonHandler('add-template', 'templates-body', [
        { name: 'Template Name', type: 'text', key: 'template_name' },
        { name: 'ID', type: 'text', key: 'template_id' },
        { name: 'Type', type: 'text', key: 'template_type' },
        { name: 'Description', type: 'textarea', key: 'template_description' }
    ]);

    attachAddButtonHandler('add-saved-search', 'saved-searches-body', [
        { name: 'Search Name', type: 'text', key: 'search_name' },
        { name: 'ID', type: 'text', key: 'search_id' },
        { name: 'Description', type: 'textarea', key: 'search_description' },
        { name: 'Criteria', type: 'textarea', key: 'search_criteria' },
        { name: 'Results', type: 'textarea', key: 'search_results' }
    ]);

    // Contact (Step 10)
    attachAddButtonHandler('add-developer', 'developers-body', [
        { name: 'Name', type: 'text', key: 'developer_name' },
        { name: 'Email', type: 'email', key: 'developer_email' },
        { name: 'Note', type: 'text', key: 'developer_note' }
    ]);

    attachAddButtonHandler('add-functional', 'functional-body', [
        { name: 'Name', type: 'text', key: 'functional_name' },
        { name: 'Email', type: 'email', key: 'functional_email' },
        { name: 'Note', type: 'text', key: 'functional_note' }
    ]);
}

function attachAddButtonHandler(buttonClass, tbodyId, columns) {
    const addButton = document.querySelector(`.${buttonClass}`);
    const tbody = document.getElementById(tbodyId);
    
    if (addButton && tbody) {
        addButton.addEventListener('click', () => {
            addTableRow(tbody, columns);
        });
    }
}

function addTableRow(tbody, columns) {
    const row = document.createElement('tr');
    
    columns.forEach(col => {
        const td = document.createElement('td');
        const input = col.type === 'textarea' ? 
            document.createElement('textarea') : 
            document.createElement('input');
        
        input.className = 'form-control';
        if (input.tagName === 'INPUT') {
            input.type = col.type;
        }
        input.name = col.key;
        input.placeholder = col.name;
        input.setAttribute('data-field', col.key);
        
        if (input.tagName === 'TEXTAREA') {
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

function attachNavigationHandlers() {
    document.querySelectorAll('.step-link').forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showStep(index + 1);
        });
    });

    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');

    if (prevButton && nextButton) {
        const totalSteps = document.querySelectorAll('.wizard-step').length;

        prevButton.addEventListener('click', () => {
            const currentStep = getCurrentStep();
            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });

        nextButton.addEventListener('click', () => {
            const currentStep = getCurrentStep();
            if (currentStep < totalSteps) {
                showStep(currentStep + 1);
            }
        });
    }
}

function getCurrentStep() {
    const visibleStep = document.querySelector('.wizard-step[style*="display: block"]');
    return visibleStep ? parseInt(visibleStep.id.split('-')[1], 10) : 1;
}

function showStep(step) {
    document.querySelectorAll('.wizard-step').forEach(section => {
        section.style.display = 'none';
    });

    document.querySelectorAll('.step-link').forEach(link => {
        link.classList.remove('active');
    });

    const targetStep = document.getElementById(`step-${step}`);
    const targetLink = document.querySelector(`.step-link[data-step="${step}"]`);

    if (targetStep) {
        targetStep.style.display = 'block';
    }
    if (targetLink) {
        targetLink.classList.add('active');
    }

    updateNavigationButtons(step);
}

function updateNavigationButtons(step) {
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const totalSteps = document.querySelectorAll('.wizard-step').length;

    if (prevButton) {
        prevButton.disabled = step === 1;
    }
    if (nextButton) {
        nextButton.disabled = step === totalSteps;
    }
}