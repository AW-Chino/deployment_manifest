/* ------------------------------
   PREVIEW.JS - Document Generation
------------------------------ */

// Wait for the DOM to load before setting up file input
document.addEventListener("DOMContentLoaded", function () {
    setupFileInput();
  });
  
  function setupFileInput() {
    const dropZone = document.querySelector(".file-input-section");
    const initialScreen = document.getElementById("initial-screen");
    const docContent = document.getElementById("docContent");
  
    // Prevent default drag events
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      dropZone.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Highlight drop zone on dragenter/dragover
    ["dragenter", "dragover"].forEach(eventName => {
      dropZone.addEventListener(eventName, () => dropZone.classList.add("border-primary", "bg-light"), false);
    });
    // Remove highlight on dragleave/drop
    ["dragleave", "drop"].forEach(eventName => {
      dropZone.addEventListener(eventName, () => dropZone.classList.remove("border-primary", "bg-light"), false);
    });
    dropZone.addEventListener("drop", handleDrop, false);
    document.getElementById("jsonFileInput").addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) handleFile(file);
    });
  
    function handleDrop(e) {
      const dt = e.dataTransfer;
      const file = dt.files[0];
      if (file) handleFile(file);
    }
  
    function handleFile(file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        try {
          const fileContent = event.target.result.replace(/^\uFEFF/, "");
          const data = JSON.parse(fileContent);
          docContent.innerHTML = generateDocument(data);
          initialScreen.style.display = "none";
          docContent.style.display = "block";
        } catch (err) {
          console.error("Error parsing JSON:", err);
          alert("Error parsing JSON file. Please check the file format and try again.");
        }
      };
      reader.onerror = function () {
        console.error("File reading error");
        alert("Error reading file. Please try again.");
      };
      reader.readAsText(file);
    }
  }
  
  function getCurrentDateString() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }
  
  function insertPageBreak(selections) {
    return selections.pageBreaks ? `<div class="page-break"></div>` : "";
  }
  
  function getSectionSelections() {
    return {
      header: document.getElementById('section_header').checked,
      toc: document.getElementById('section_toc').checked,
      userStoriesFeatures: document.getElementById('section_userStoriesFeatures').checked,
      configuration: document.getElementById('section_configuration').checked,
      dependencies: document.getElementById('section_dependencies').checked,
      scriptDetails: document.getElementById('section_scriptDetails').checked,
      customRecords: document.getElementById('section_customRecords').checked,
      workflows: document.getElementById('section_workflows').checked,
      customFields: document.getElementById('section_customFields').checked,
      savedSearches: document.getElementById('section_savedSearches').checked,
      templates: document.getElementById('section_templates').checked,
      troubleshooting: document.getElementById('section_troubleshooting').checked,
      checklist: document.getElementById('section_checklist').checked,
      contacts: document.getElementById('section_contacts').checked,
      components: document.getElementById('section_components').checked,
      license: document.getElementById('section_license').checked,
      pageBreaks: document.getElementById('page_breaks') ? document.getElementById('page_breaks').checked : true,
      step6_versionHistory: true
    };
  }
  
  /* ------------------------------
     Document Generation Functions
  ------------------------------ */
  
  function generateDocument(data) {
    const selections = getSectionSelections();
    let docHTML = "";
    docHTML += generateHeaderSection(data, selections) + insertPageBreak(selections);
    docHTML += generateTOC(data) + insertPageBreak(selections);
    docHTML += generateUserStoriesFeaturesSection(data, selections) + insertPageBreak(selections);
    // Use configuration groups for multi-group configuration (Step 4)
    docHTML += generateConfigurationGroups(data) + insertPageBreak(selections);
    docHTML += generateDependenciesSection(data, selections) + insertPageBreak(selections);
    docHTML += generateScriptDetailsSection(data, selections) + insertPageBreak(selections);
    docHTML += generateCustomRecordsSectionNew(data, selections) + insertPageBreak(selections);
    docHTML += generateWorkflowsSection(data, selections) + insertPageBreak(selections);
    docHTML += generateCustomFieldsSection(data, selections);
    docHTML += generateTemplatesSection(data, selections) + insertPageBreak(selections);
    docHTML += generateSavedSearchesSection(data, selections) + insertPageBreak(selections);
    docHTML += generateTroubleshootingSection(data, selections) + insertPageBreak(selections);
   // docHTML += generateChecklistSection(data) + insertPageBreak(selections);
    // Unified Contacts Section
    docHTML += generateContactsSection(data, selections) + insertPageBreak(selections);
    docHTML += generateComponentsSection(data, selections);
    docHTML += generateLicenseSection(data);
    docHTML += `<div class="mt-5 text-center">
            <p>
              <strong>AppWrap, Inc.</strong> &emsp; (${getCurrentDateString()})<br>
              Proprietary and Confidential to AppWrap, Inc.
            </p>
          </div>`;
    return docHTML;
  }
  
  /* --- Header & Version History --- */
  function generateHeaderSection(data, selections) {
    const step1 = data["step-1"] || {};
    let headerHTML = `
        <div class="document-header">
          <div class="header-container">
            <div class="logo-section">
              <img src="https://appwrap.com/wp-content/uploads/2024/12/appwrap-logo.svg" alt="AppWrap.Com Logo" />
            </div>
          </div>
          <div class="cover-image">
            <img src="./cover.jpg" alt="Cover Image" />
          </div>
          <br>
          <h1 class="text-start mb-4" style="font-size:42px;color:black">Script Deployment Document</h1>
          <h2 class="text-start mb-5" style="font-size:30px; color: #01395A;">${step1.client || "Client Not Provided"}</h2>
          <center>
            <h1>${step1.project_name || "Project Name Not Provided"}</h1>
          </center>
          <br />
          <div class="mx-auto mb-5" style="width:40%; height:3px; background-color:#01395A;"></div>
          <div class="confidential-notice">
            <p>
              Any reproduction or distribution of any part of this document without prior written permission of AppWrap, Inc. is strictly prohibited.
            </p>
            <p>
              The information included in this document is confidential and proprietary to AppWrap, Inc.
            </p>
          </div>
          <div class="version-history no-break">
            <br>
            <h2 class="section-title">Document Version History</h2>
            ${generateVersionHeader(step1)}
            ${generateVersionHistory(step1["version-history-body"])}
          </div>
        </div>
      `;
    return headerHTML;
  }
  
  function generateVersionHeader(step1) {
    return `
        <table class="table table-bordered">
          <tbody>
            <tr>
              <td width="20%"><strong>Customer Name</strong></td>
              <td width="30%">${step1.client || ""}</td>
              <td width="20%"><strong>Date</strong></td>
              <td width="30%">${step1.date || getCurrentDateString()}</td>
            </tr>
            <tr>
              <td><strong>Script Title</strong></td>
              <td>${step1.project_name || ""}</td>
              <td><strong>Prepared By</strong></td>
              <td>${step1.developer || "C. Dela Cruz"}</td>
            </tr>
          </tbody>
        </table>
      `;
  }
  
  function generateVersionHistory(versions) {
    if (!versions || !versions.length) return "";
    return `
        <h5>Version History</h5>
        <table class="table table-bordered mt-4">
          <thead>
            <tr>
              <th class="nowrap">Version</th>
              <th class="nowrap">Date</th>
              <th>Change Summary</th>
            </tr>
          </thead>
          <tbody>
            ${versions.map(v => `
              <tr>
                <td class="nowrap">${v.version || ""}</td>
                <td class="nowrap">${v.date || getCurrentDateString()}</td>
                <td>${v.change_summary || ""}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
  }
  
  /* --- Step 2: User Stories and Features --- */
  function generateUserStoriesFeaturesSection(data, selections) {
    const step2 = data["step-2"] || {};
    let sectionHTML = `<h2 class="section-title">User Stories and Features</h2>`;
    sectionHTML += `
        <section class="no-break">
          <h3 class="subsection-title">User Stories</h3>
          ${generateUserStoriesTable(step2["user-stories-body"])}
        </section>
        <section class="no-break">
          <h3 class="subsection-title">Features</h3>
          ${generateFeaturesTable(step2["features-body"])}
        </section>
        <section class="no-break">
          <h3 class="subsection-title">Usage</h3>
          ${generateUsageTable(step2["usage-body"])}
        </section>
      `;
    return sectionHTML;
  }
  
  function generateUserStoriesTable(stories) {
    if (!stories || !stories.length)
      return "<p>No user stories specified.</p>";
    return `
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Story ID</th>
              <th>Story Description</th>
            </tr>
          </thead>
          <tbody>
            ${stories.map(s => `
              <tr>
                <td>${s.story_id || ""}</td>
                <td>${s.story_description || ""}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
  }
  
  function generateFeaturesTable(features) {
    if (!features || !features.length)
      return "<p>No features specified.</p>";
    return `
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Feature Title</th>
              <th>Feature Description</th>
            </tr>
          </thead>
          <tbody>
            ${features.map(f => `
              <tr>
                <td>${f.feature_title || ""}</td>
                <td>${f.feature_description || ""}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
  }
  
  function generateUsageTable(usages) {
    if (!usages || !usages.length)
      return "<p>No usage scenarios specified.</p>";
    return `
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Usage Title</th>
              <th>Usage Description</th>
            </tr>
          </thead>
          <tbody>
            ${usages.map(u => `
              <tr>
                <td>${u.usage_title || ""}</td>
                <td>${u.usage_description || ""}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
  }
  
  /* --- Step 4: Configuration Groups --- */
  function generateConfigurationGroups(data) {
    const step4 = data["step-4"] || {};
    let html = `<h2 class="section-title centered-heading">Playbook & Configuration</h2>`;
    if (step4.configurationProcess && step4.configurationProcess.length) {
      html += `<div id="configuration-groups-container">`;
      step4.configurationProcess.forEach((group, i) => {
        html += `
        <div class="page-break"></div>
          <div class="configuration-group-block mb-4">
            <h3 class="text-script">Configuration Group ${i + 1}: ${group.group_name || "Unnamed Group"}</h3>
            <p>${group.group_description || ""}</p>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th nowrap>Step #</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                ${group.steps && group.steps.length ? group.steps.map((step, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>
                      <div>${step.description || ""}</div>
                      ${step.installation_image ? `<br>${renderImageField(step.installation_image)}` : ""}
                    </td>
                  </tr>
                `).join("") : "<tr><td colspan='2'>No steps defined.</td></tr>"}
              </tbody>
            </table>
          </div>
        `;
      });
      html += `</div>`;
    } else {
      html += "<p>No configuration groups specified.</p>";
    }
    html += generateEnvironmentIds(step4["environment-ids-body"]);
    return html;
  }
  
  // generateEnvironmentIds remains unchanged because it doesn't handle images
  function generateEnvironmentIds(envIds) {
    if (!envIds || !envIds.length)
      return "<p>No environment IDs specified.</p>";
    return `
    <div class="page-break"></div>
   <h2 class="section-title">Environment Specific Values</h2>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Environment Name</th>
              <th>Notes</th>
              <th>Sandbox Value</th>
              <th>Production Value</th>
            </tr>
          </thead>
          <tbody>
            ${envIds.map(env => `
              <tr>
                <td>${env.env_name || ""}</td>
                <td>${env.env_notes || ""}</td>
                <td>${env.sandbox_value || ""}</td>
                <td>${env.production_value || ""}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
  }
  /* --- Step 5: Dependencies --- */
  function generateDependenciesSection(data, selections) {
    const step5 = data["step-5"] || {};
    let sectionHTML = `<h2 class="section-title">Dependencies</h2>`;
    sectionHTML += `
        <h3 class="subsection-title">Deployment Dependencies</h3>
        ${generateDeploymentDependencies(step5["deployment-dependencies-body"])}
        <h3 class="subsection-title">Development Dependencies</h3>
        ${generateDevDependencies(step5["dev-dependencies-body"])}
      `;
    return sectionHTML;
  }
  
  function generateDeploymentDependencies(deps) {
    if (!deps || !deps.length)
      return "<p>No deployment dependencies specified.</p>";
    return `
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Dependency Name</th>
              <th>Version</th>
              <th>License</th>
            </tr>
          </thead>
          <tbody>
            ${deps.map(d => `
              <tr>
                <td>${d.dependency_name || ""}</td>
                <td>${d.dependency_version || ""}</td>
                <td>${d.dependency_license || ""}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
  }
  
  function generateDevDependencies(deps) {
    if (!deps || !deps.length)
      return "<p>No development dependencies specified.</p>";
    return `
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Dependency Name</th>
              <th>Version</th>
              <th>License</th>
            </tr>
          </thead>
          <tbody>
            ${deps.map(d => `
              <tr>
                <td>${d.dependency_name || ""}</td>
                <td>${d.dependency_version || ""}</td>
                <td>${d.dependency_license || ""}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
  }
  
  /* --- Step 6: Script Details --- */
  function generateScriptDetailsSection(data, selections) {
    const step6 = data["step-6"] || {};
    if (!step6.scripts || !step6.scripts.length)
      return "<section><br><h2 class='section-title'>Script Details</h2><p>No scripts specified.</p></section>";
    return `
        <section><br>
          <h2 class="section-title centered-heading">Script Details</h2>
          ${step6.scripts.map((script, index) => `
            ${index > 0 ? insertPageBreak(selections) : ''}
            ${generateScriptDetail(script, selections)}
          `).join("")}
        </section>
      `;
  }
  
  function generateScriptDetail(sc, selections) {
    const details = sc.details || {};
    let scriptHTML = `
        <div class="script-details mb-5">
          <div class="script-header mb-4">
            <h3 class="mb-1 p-2 text-script">${sc.name || ""}</h3>
            <div class="row">
              <div class="p-3 mb-3">
                <strong class="d-block mb-2">Description</strong>
                <p class="mb-0">${details.description || ""}</p>
              </div>
              <div class="col-md-6">
                <div class="info-box p-3 mb-3">
                  <div class="d-flex mb-2"><strong class="me-2">Script ID:</strong><span>${details.id || ""}</span></div>
                  <div class="d-flex mb-2"><strong class="me-2">Type:</strong><span>${details.type || ""}</span></div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-box p-3 mb-3">
                  <div class="d-flex mb-2"><strong class="me-2">File Name:</strong><span>${details.fileName || ""}</span></div>
                  <div class="d-flex mb-2"><strong class="me-2">Location:</strong><span>${details.location || ""}</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="script-section mb-5">
            ${generateParameters(sc.parameters)}
          </div>
          <div class="script-section mb-5">
            ${generateEntryPoints(sc.entryPoints)}
          </div>
          <div class="script-section mb-5">
            ${generateDeploymentRecords(sc.deploymentRecords)}
          </div>
          <div class="script-section mb-5">
            ${generateLibraries(sc.libraries)}
          </div>
          <div class="script-section mb-5">
            ${generateUnitTests(sc.unitTests)}
          </div>
      `;
    if (selections.step6_versionHistory && sc.versionHistory) {
      scriptHTML += `
          <div class="script-section mb-5">
            <h5>Version History</h5>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th class="nowrap">Version</th>
                  <th class="nowrap">Date</th>
                  <th>Changes</th>
                </tr>
              </thead>
              <tbody>
                ${sc.versionHistory.map(vh => `
                  <tr>
                    <td class="nowrap">${vh.version || ""}</td>
                    <td class="nowrap">${vh.date || getCurrentDateString()}</td>
                    <td>${vh.change_summary || ""}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
      `;
    }
    scriptHTML += `</div>`;
    return scriptHTML;
  }
  
  function generateParameters(parameters) {
    if (!parameters || !parameters.length) return "";
    return `
      <h5>Parameters</h5>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${parameters.map(p => `
              <tr>
                <td>${p.parameter_name || ""}</td>
                <td>${p.parameter_id || ""}</td>
                <td>${p.parameter_type || ""}</td>
                <td>${p.parameter_description || ""}</td>
              </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }
  
  function generateEntryPoints(entryPoints) {
    if (!entryPoints || !entryPoints.length) return "";
    return `
      <h5>Entry Points</h5>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Entry Point Name</th>
            <th>Function Name</th>
          </tr>
        </thead>
        <tbody>
          ${entryPoints.map(ep => `
              <tr>
                <td>${ep.entry_point_name || ""}</td>
                <td>${ep.function_name || ""}</td>
              </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }
  
  function generateDeploymentRecords(records) {
    if (!records || !records.length) return "";
    return `
      <h5>Deployment Records</h5>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Applied To</th>
            <th>Deployment ID</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${records.map(r => `
              <tr>
                <td>${r.applied_to || ""}</td>
                <td>${r.deployment_id || ""}</td>
                <td>${r.deployment_notes || ""}</td>
              </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }
  
  function generateLibraries(libraries) {
    if (!libraries || !libraries.length) return "";
    return `
      <h5>Libraries</h5>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Library Name</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          ${libraries.map(lib => `
              <tr>
                <td>${lib.library_name || ""}</td>
                <td>${lib.purpose || ""}</td>
              </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }
  
  function generateUnitTests(tests) {
    if (!tests || !tests.length) return "";
    return `
      <h5>Unit Tests</h5>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Test Description</th>
            <th>Test Result</th>
          </tr>
        </thead>
        <tbody>
          ${tests.map(t => `
              <tr>
                <td>${t.test_description || ""}</td>
                <td>${t.test_result || ""}</td>
              </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }
  
  /* --- Step 7: Custom Records --- */
  function generateCustomRecordsSectionNew(data, selections) {
    const step7 = data["step-7"] || {};
    if (!step7.customRecords || !step7.customRecords.length)
      return "<section class='no-break'><h2 class='section-title'>6. Custom Records</h2><p>No custom records specified.</p></section>";
    return `
        <section class="no-break"><br>
          <h2 class="section-title">Custom Records</h2>
          ${step7.customRecords.map(record => `
            <div class="script-details mb-4">
              <h4 class="mb-3 p-2 text-script">${record.name || ""}</h4>
              <dl>
                <dt>Record ID</dt>
                <dd>${record.id || ""}</dd>
                <dt>Description</dt>
                <dd>${record.description || ""}</dd>
              </dl>
              ${generateRecordFields(record.fields)}
            </div>
          `).join("")}
        </section>
    `;
  }
  
  function generateRecordFields(fields) {
    if (!fields || !fields.length) return "";
    return `
        <h5>Fields</h5>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Field Name</th>
              <th>Field ID</th>
              <th>Field Type</th>
              <th>Field Description</th>
            </tr>
          </thead>
          <tbody>
            ${fields.map(f => `
              <tr>
                <td>${f.field_name || ""}</td>
                <td>${f.field_id || ""}</td>
                <td>${f.field_type || ""}</td>
                <td>${f.field_description || ""}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
    `;
  }
  
  /* --- Step 8: Workflow --- */
  function generateWorkflowsSection(data, selections) {
    const step8 = data["step-8"] || {};
    let wfHTML = `<h2 class="section-title">Workflow</h2>`;
    if (step8.workflows && step8.workflows.length > 0) {
      step8.workflows.forEach((wf, index) => {
        wfHTML += `<div class="mb-4">
          <h3 class="text-script">Workflow ${index + 1}: ${wf.workflow_name || "Unnamed Workflow"}</h3>
          <p><strong>ID:</strong> ${wf.workflow_id || ""}</p>
          <p><strong>Description:</strong> ${wf.workflow_description || ""}</p>
          <p><strong>Notes:</strong> ${wf.workflow_notes || ""}</p>`;
        if (wf.states && wf.states.length > 0) {
          wfHTML += `<h4>States:</h4>`;
          wfHTML += `<table class="table table-bordered">
            <thead>
              <tr>
                <th>State Name</th>
                <th>Description</th>
                <th>Notes</th>
                <th>Transitions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>`;
          wf.states.forEach(state => {
            wfHTML += `<tr>
              <td>${state.state_name || ""}
              <br>
              <small>${state.details && state.details.state_id ? state.details.state_id : ""}</small>
              </td>
              <td>${state.details && state.details.state_description ? state.details.state_description : ""}</td>
              <td>${state.details && state.details.state_notes ? state.details.state_notes : ""}</td>
              <td>${generateTransitions(state.transitions)}</td>
              <td>${generateStateActions(state.actions)}</td>
            </tr>`;
          });
          wfHTML += `</tbody></table>`;
        }
        wfHTML += `</div>`;
      });
    } else {
      wfHTML += "<p>No workflows specified.</p>";
    }
    return wfHTML;
  }
  
  function generateTransitions(transitions) {
    if (!transitions || transitions.length === 0) return "None";
    let html = "<ul>";
    transitions.forEach(t => {
      html += `<li><strong>${t.transition_name || ""}</strong> to ${t.target_state || ""}. Conditions: ${t.conditions || ""}. Notes: ${t.notes || ""}</li>`;
    });
    html += "</ul>";
    return html;
  }
  
  function generateStateActions(actions) {
    if (!actions || actions.length === 0) return "None";
    let html = "<ul>";
    actions.forEach(a => {
      html += `<li><strong>${a.action_name || ""}</strong> (Trigger: ${a.trigger || ""}). Details: ${a.details || ""}</li>`;
    });
    html += "</ul>";
    return html;
  }
  
  /* --- Step 9: Custom Fields, Saved Searches, Templates --- */
  function generateCustomFieldsSection(data, selections) {
    const step9 = data["step-9"] || {};
    let fieldsHTML = `<h2 class="section-title">Custom Fields</h2>`;
    fieldsHTML += step9["custom-fields-body"] && step9["custom-fields-body"].length
      ? generateFieldsTable(step9["custom-fields-body"])
      : "<p>No custom fields specified.</p>";
    return fieldsHTML;
  }
  
  function generateFieldsTable(fields) {
    return `
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Field Name</th>
              <th>Field ID</th>
              <th>Description</th>
              <th>Type</th>
              <th>Applies To</th>
            </tr>
          </thead>
          <tbody>
            ${fields.map(field => `
              <tr>
                <td>${field.field_name || ""}</td>
                <td>${field.field_id || ""}</td>
                <td>${field.field_description || ""}</td>
                <td>${field.field_type || ""}</td>
                <td>${field.applies_to || ""}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
    `;
  }
  
  function generateSavedSearchesSection(data, selections) {
    const step9 = data["step-9"] || {};
    let searchesHTML = `<h2 class="section-title">Saved Searches</h2>`;
    searchesHTML += step9["saved-searches-body"] && step9["saved-searches-body"].length
      ? generateSearchesTable(step9["saved-searches-body"])
      : "<p>No saved searches specified.</p>";
    return searchesHTML;
  }
  
  function generateSearchesTable(searches) {
    if (!searches || !searches.length)
      return "<p>No saved searches specified.</p>";
    
    let html = "";
    
    for (let i = 0; i < searches.length; i++) {
      const search = searches[i];
      
      html += `
        <div class="saved-search-section mb-4">
          <div class="row mb-3">
            <div class="col-md-4"><h4 class="mb-0 text-script">${search.search_name || "Unnamed Search"}</h4></div>
            <div class="col-md-4 text-end"><strong>ID:</strong> ${search.search_id || "N/A"}</div>
            <div class="col-md-4 text-end"></div>
          </div>
          
          <div class="mb-3">
            <strong>Description:</strong>
            <p class="mt-1">${search.search_description || "No description provided."}</p>
          </div>
          
          <div class="mb-3">
            <strong>Search Criteria:</strong>
            ${search.search_criteria ? renderImageField(search.search_criteria) : "<p class='mt-1'>No search criteria specified.</p>"}
          </div>
          
          <div class="mb-3">
            <strong>Search Results:</strong>
            ${search.search_results ? renderImageField(search.search_results) : "<p class='mt-1'>No search results specified.</p>"}
          </div>
      `;
      
      // Add separator between searches
      if (i < searches.length - 1) {
        html += '<hr class="mt-4 mb-4">';
      }
      
      html += '</div>'; // End saved-search-section
    }
    
    return html;
  }
  
  function generateTemplatesSection(data, selections) {
    const step9 = data["step-9"] || {};
    let tmplHTML = `<h2 class="section-title">Templates</h2>`;
    tmplHTML += step9["templates-body"] && step9["templates-body"].length
      ? generateTemplatesTable(step9["templates-body"])
      : "<p>No templates specified.</p>";
    return tmplHTML;
  }
  
  function generateTemplatesTable(templates) {
    return `
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Template Name</th>
              <th>Template ID</th>
              <th>Description</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            ${templates.map(t => `
              <tr>
                <td>${t.template_name || ""}</td>
                <td>${t.template_id || ""}</td>
                <td>${t.template_description || ""}</td>
                <td>${t.template_type || ""}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
    `;
  }
  
  /* --- Step 10: Troubleshooting --- */
  function generateTroubleshootingSection(data, selections) {
    const step10 = data["step-10"] || {};
    let trHTML = `<h2 class="section-title">Troubleshooting</h2>`;
    trHTML += step10["troubleshooting-body"] && step10["troubleshooting-body"].length
      ? `
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Cause</th>
                <th>Resolution</th>
                <th>Prevention</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              ${step10["troubleshooting-body"].map(issue => `
                <tr>
                  <td>${issue.error_issue || ""}</td>
                  <td>${issue.cause || ""}</td>
                  <td>${issue.resolution || ""}</td>
                  <td>${issue.prevention || ""}</td>
                  <td>${issue.impact || ""}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        `
      : "<p>No troubleshooting issues specified.</p>";
    return trHTML;
  }
  
  /* --- Step 11: Deployment Checklist --- */
  function generateChecklistSection(data) {
    const step11 = data["step-11"] || {};
    return `
        <h2 class="section-title">Deployment Checklist</h2>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Checklist Item</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Production Version Backed Up</td>
              <td>${step11.production_version_backed_up ? '<i class="fas fa-check-circle text-success"></i>' : '<i class="fas fa-times-circle text-danger"></i>'}</td>
            </tr>
            <tr>
              <td>Code Changes Documented</td>
              <td>${step11.code_changes_documented ? '<i class="fas fa-check-circle text-success"></i>' : '<i class="fas fa-times-circle text-danger"></i>'}</td>
            </tr>
            <tr>
              <td>Fields/Records Listed</td>
              <td>${step11.fields_records_listed ? '<i class="fas fa-check-circle text-success"></i>' : '<i class="fas fa-times-circle text-danger"></i>'}</td>
            </tr>
            <tr>
              <td>Rollback Steps Defined</td>
              <td>${step11.rollback_steps_defined ? '<i class="fas fa-check-circle text-success"></i>' : '<i class="fas fa-times-circle text-danger"></i>'}</td>
            </tr>
            <tr>
              <td>Deployment Reviewed</td>
              <td>${step11.deployment_reviewed ? '<i class="fas fa-check-circle text-success"></i>' : '<i class="fas fa-times-circle text-danger"></i>'}</td>
            </tr>
            <tr>
              <td>Tested by Functional</td>
              <td>${step11.tested_by_functional ? '<i class="fas fa-check-circle text-success"></i>' : '<i class="fas fa-times-circle text-danger"></i>'}</td>
            </tr>
            <tr>
              <td>Tested by Client</td>
              <td>${step11.tested_by_client ? '<i class="fas fa-check-circle text-success"></i>' : '<i class="fas fa-times-circle text-danger"></i>'}</td>
            </tr>
            <tr>
              <td>Deployment Plan Approved</td>
              <td>${step11.deployment_plan_approved ? '<i class="fas fa-check-circle text-success"></i>' : '<i class="fas fa-times-circle text-danger"></i>'}</td>
            </tr>
          </tbody>
        </table>
    `;
  }
  
  /* --- Step 12: Unified Contacts --- */
  function generateContactsSection(data, selections) {
    const step12 = data["step-12"] || {};
    let contacts = [];
    if (step12["developers-body"] && Array.isArray(step12["developers-body"])) {
      step12["developers-body"].forEach(dev => {
        contacts.push({
          name: dev.developer_name || "",
          email: dev.developer_email || "",
          role: "Developer",
          note: dev.developer_note || ""
        });
      });
    }
    if (step12["functional-body"] && Array.isArray(step12["functional-body"])) {
      step12["functional-body"].forEach(func => {
        contacts.push({
          name: func.functional_name || "",
          email: func.functional_email || "",
          role: "Functional",
          note: func.functional_note || ""
        });
      });
    }
    let html = `<h2 class="section-title">Contacts</h2>`;
    if (contacts.length === 0) {
      html += "<p>No contact information available.</p>";
    } else {
      html += `
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            ${contacts.map(c => `
              <tr>
                <td>${c.name}</td>
                <td>${c.email}</td>
                <td>${c.role}</td>
                <td>${c.note}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    }
    return html;
  }
  
  /* --- Step 13: Components --- */
  function generateComponentsSection(data, selections) {
    const step13 = data["step-13"] || {};
    let compHTML = `<h2 class="section-title">Components</h2>`;
    compHTML += step13["components-body"] && step13["components-body"].length
      ? `
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Component Type</th>
              <th>Component Name</th>
              <th>Deployment Date</th>
              <th>Documentation Version</th>
              <th>Status</th>
              <th>Change Description</th>
              <th>Installation Method</th>
            </tr>
          </thead>
          <tbody>
            ${step13["components-body"].map(comp => `
              <tr>
                <td>${comp.component_type || ""}</td>
                <td>${comp.component_name || ""}</td>
                <td>${comp.deployment_date || ""}</td>
                <td>${comp.documentation_version || ""}</td>
                <td>${comp.status || ""}</td>
                <td>${comp.change_description || ""}</td>
                <td>${comp.installation_method || ""}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : "<p>No components specified.</p>";
    return compHTML;
  }




  function generateTOC(data) {
    const tocSections = [];
  
    // Step 1: Project Information (no sub-items)
    if (data["step-1"]) {
      tocSections.push({
        title: "Project Information",
        sub: []
      });
    }
  
    // Step 2: Project Scope (static list: User Stories, Features, Usage)
    if (data["step-2"]) {
      tocSections.push({
        title: "Project Scope",
        sub: ["User Stories", "Features", "Usage"]
      });
    }
  
    // Step 4: Configuration (list configuration group names without prefix)
    if (data["step-4"]) {
      const subItems = [];
      if (data["step-4"].configurationProcess && data["step-4"].configurationProcess.length) {
        data["step-4"].configurationProcess.forEach(group => {
          subItems.push(group.group_name || "Unnamed Group");
        });
      }
      tocSections.push({
        title: "Configuration",
        sub: subItems
      });
    }
  
    // Step 5: Dependencies (static list: Deployment Dependencies and Development Dependencies)
    if (data["step-5"]) {
      tocSections.push({
        title: "Dependencies",
        sub: ["Deployment Dependencies", "Development Dependencies"]
      });
    }
  
    // Step 6: Scripts (list script names with prefix)
    if (data["step-6"]) {
      const subItems = [];
      if (data["step-6"].scripts && data["step-6"].scripts.length) {
        data["step-6"].scripts.forEach(script => {
          subItems.push(script.name || "Unnamed Script");
        });
      }
      tocSections.push({
        title: "Scripts",
        sub: subItems
      });
    }
  
    // Step 7: Custom Records (list record names with prefix)
    if (data["step-7"]) {
      const subItems = [];
      if (data["step-7"].customRecords && data["step-7"].customRecords.length) {
        data["step-7"].customRecords.forEach(record => {
          subItems.push(record.name || "Unnamed Record");
        });
      }
      tocSections.push({
        title: "Custom Records",
        sub: subItems
      });
    }
  
    // Step 8: Workflow (list workflow names with prefix)
    if (data["step-8"]) {
      const subItems = [];
      if (data["step-8"].workflows && data["step-8"].workflows.length) {
        data["step-8"].workflows.forEach(wf => {
          subItems.push(wf.workflow_name || "Unnamed Workflow");
        });
      }
      tocSections.push({
        title: "Workflow",
        sub: subItems
      });
    }
  
    // New: Step 9: Custom Fields, Saved Searches, and Templates
    if (data["step-9"]) {
      // Custom Fields
      let subItemsCustomFields = [];
      if (data["step-9"]["custom-fields-body"] && data["step-9"]["custom-fields-body"].length) {
        data["step-9"]["custom-fields-body"].forEach(field => {
         // subItemsCustomFields.push(field.field_name || "Unnamed Field");
        });
      }
      tocSections.push({
        title: "Custom Fields",
        sub: subItemsCustomFields
      });

       // Templates
       let subItemsTemplates = [];
       if (data["step-9"]["templates-body"] && data["step-9"]["templates-body"].length) {
         data["step-9"]["templates-body"].forEach(template => {
         //  subItemsTemplates.push(template.template_name || "Unnamed Template");
         });
       }
       tocSections.push({
         title: "Templates",
         sub: subItemsTemplates
       });


      // Saved Searches
      let subItemsSavedSearches = [];
      if (data["step-9"]["saved-searches-body"] && data["step-9"]["saved-searches-body"].length) {
        data["step-9"]["saved-searches-body"].forEach(search => {
          subItemsSavedSearches.push(search.search_name || "Unnamed Search");
        });
      }
      tocSections.push({
        title: "Saved Searches",
        sub: subItemsSavedSearches
      });
     
    }
  
    // Step 10: Troubleshooting (list issues with prefix)
    if (data["step-10"]) {
      const subItems = [];
      if (data["step-10"]["troubleshooting-body"] && data["step-10"]["troubleshooting-body"].length) {
        data["step-10"]["troubleshooting-body"].forEach(issue => {
          subItems.push(issue.error_issue || "Unnamed Issue");
        });
      }
      tocSections.push({
        title: "Troubleshooting",
        sub: subItems
      });
    }
  
    // Step 12: Contacts & License (no sub-items)
    if (data["step-12"]) {
      tocSections.push({
        title: "Contacts & License",
        sub: []
      });
    }
  
    // Step 13: Deployable Components (no sub-items)
    if (data["step-13"]) {
      tocSections.push({
        title: "Deployable Components",
        sub: []
      });
    }
  
    // Build the TOC HTML with an ordered list for sections and unordered lists for sub-items.
    let tocHTML = `<div class="toc no-break">
      <br>
      <h2 class="section-title">Table of Contents</h2>
      <ol>`;
    tocSections.forEach(section => {
      tocHTML += `<li>${section.title}`;
      if (section.sub && section.sub.length > 0) {
        tocHTML += `<ul>`;
        section.sub.forEach(item => {
          tocHTML += `<li>${item}</li>`;
        });
        tocHTML += `</ul>`;
      }
      tocHTML += `</li>`;
    });
    tocHTML += `</ol></div>`;
    return tocHTML;
  }
  
  
  

  
  /* --- Step 14: License --- */
  function generateLicenseSection(data) {
    const step12 = data["step-12"] || {};
    const licenseText = step12.license || "Copyright 2025 AppWrap, Inc. All Rights Reserved.";
    return `
        <h2 class="section-title">License</h2>
        <div class="script-details mb-4">
          <dl>
            <dt>License</dt>
            <dd>${licenseText}</dd>
          </dl>
        </div>
    `;
  }
  
  /* --- Helper: Render Image Field --- */
  function renderImageField(value) {
    if (!value) return "";
    const style = 'max-width:800px; max-height:600px; width:auto; height:auto;';
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return `<img src="${value}" alt="Image" class="preview-image" style="${style}" />`;
    } else {
      // Assume it is a file name; prepend a base path if needed (change 'images/' as necessary)
      return `<img src="images/${value}" alt="Image" class="preview-image" style="${style}" />`;
    }
  }
  
  
  
  
  /* ------------------------------
     End of preview.js
  ------------------------------ */
  