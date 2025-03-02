/**
 * Markdown README Generator Script
 * Author: Chino Dela Cruz
 * Date: 2025-02-28
 * Version: 1.0.0
 *
 * AppWrap Code Disclaimer:
 * Copyright 2025 AppWrap, Inc. All Rights Reserved.
 * This code is proprietary and confidential to AppWrap, Inc.
 * Unauthorized use, copying, modification, or distribution is strictly prohibited.
 *
 * References:
 * - AppWrap Deployment Standards: https://drive.google.com/file/d/1bYRw2rDC2-eFiLa3FVQVpDciEolIRBbs/view?usp=drive_link
 * - AppWrap Code Guide: https://gitlab.com/appwrap/appwrap-2.0/tech-task-tracker/-/blob/code-guide/CODE%20GUIDE/documentation-and-quality-standards.md
 */

document.addEventListener("DOMContentLoaded", function () {
  const dropZone = document.getElementById("initial-screen");
  const jsonFileInput = document.getElementById("jsonFileInput");
  const docContainer = document.getElementById("docContainer");
  const docCode = document.getElementById("docCode");
  const copyButton = document.getElementById("copyButton");

  // Set up file input via click and change events
  dropZone.addEventListener("click", () => jsonFileInput.click());
  jsonFileInput.addEventListener("change", handleFileSelect);

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        try {
          const fileContent = event.target.result.replace(/^\uFEFF/, "");
          const data = JSON.parse(fileContent);
          const generatedMarkdown = generateMarkdownDocument(data);
          docCode.textContent = generatedMarkdown;
          docContainer.style.display = "block";
          dropZone.style.display = "none";
        } catch (err) {
          console.error("Error parsing JSON:", err);
          alert("Error parsing JSON file. Please check the file format and try again.");
        }
      };
      reader.onerror = function () {
        alert("Error reading file. Please try again.");
      };
      reader.readAsText(file);
    }
  }

  // Copy markdown to clipboard
  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(docCode.textContent).then(() => {
      alert("Markdown README copied to clipboard!");
    }).catch(err => {
      alert("Failed to copy text: " + err);
    });
  });
});

/* ---------- Helper Functions ---------- */

/* Section Selection Helper */
function getSectionSelections() {
  return {
    checklist: document.getElementById('readme_checklist')?.checked,
    toc: document.getElementById('readme_toc')?.checked,
    overview: document.getElementById('readme_overview')?.checked,
    userStoriesFeatures: document.getElementById('readme_userStoriesFeatures')?.checked,
    dependencies: document.getElementById('readme_dependencies')?.checked,
    installation: document.getElementById('readme_installation')?.checked,
    customRecord: document.getElementById('readme_customRecord')?.checked,
    scriptDetails: document.getElementById('readme_scriptDetails')?.checked,
    troubleshooting: document.getElementById('readme_troubleshooting')?.checked,
    unitTesting: document.getElementById('readme_unitTesting')?.checked,
    contactAndLicense: document.getElementById('readme_contactAndLicense')?.checked
  };
}

/* Badge Generation (Updated: Removed the "Updated" badge) */
function generateBadges(step1) {
  const version = step1.version ? step1.version.replace(/^v/, '') : '0.0.0';
  const environment = step1.development_environment || 'Development';
  return `![Version](https://img.shields.io/badge/Version-${version}-blue)
![Environment](https://img.shields.io/badge/Environment-${environment}-orange)`;
}

/* Current Date Helper */
function getCurrentDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/* Checklist Generator */
function generateChecklist() {
  return `## Checklist

- [ ] Project upholds [AppWrap's Deployment Standards and Best Practices](https://drive.google.com/file/d/1bYRw2rDC2-eFiLa3FVQVpDciEolIRBbs/view?usp=drive_link)
- [ ] Scripts include [AppWrap's Code Disclaimer and Header](https://placeholder-link.com)
- [ ] Contributors adhere to [AppWrap's Developer and Technical Resources Expectations](https://gitlab.com/appwrap/appwrap-2.0/tech-task-tracker/-/blob/code-guide/CODE%20GUIDE/documentation-and-quality-standards.md)`;
}

/* Table of Contents Generator */
function generateTableOfContents(data, selections) {
  let toc = "## Table of Contents\n\n";
  if (selections.overview) toc += "- [Project Overview](#project-overview)\n";
  if (selections.userStoriesFeatures) toc += "- [User Stories & Usage](#user-stories--usage)\n";
  if (selections.dependencies) toc += "- [Dependencies](#dependencies)\n";
  if (selections.installation) toc += "- [Installation, Rollback & Configuration](#installation-rollback--configuration)\n";
  if (selections.customRecord) toc += "- [Custom Record](#custom-record)\n";
  if (selections.scriptDetails) toc += "- [Script Details](#script-details)\n";
  if (selections.troubleshooting) toc += "- [Troubleshooting](#troubleshooting)\n";
  if (selections.unitTesting) toc += "- [Unit Testing](#unit-testing)\n";
  if (selections.contactAndLicense) toc += "- [Contact and License](#contact-and-license)\n";
  return toc;
}

/* Installation, Rollback & Configuration Section Generator */
function generateInstallationSection(step3, step4) {
  let md = "## Installation, Rollback & Configuration\n\n";
  
  // Installation Steps (from step-3.installationProcess)
  if (step3.installationProcess && step3.installationProcess.length > 0) {
    md += "### Installation Steps\n\n";
    step3.installationProcess.forEach((inst, idx) => {
      md += `${idx + 1}. ${inst.description || "No description provided"}\n`;
      if (inst.installation_image) {
        md += `   ![Step Image](${inst.installation_image})\n`;
      }
      md += "\n";
    });
  } else {
    md += "No installation steps specified.\n\n";
  }
  
  // Rollback Steps (from step-3.rollbackProcess)
  if (step3.rollbackProcess && step3.rollbackProcess.length > 0) {
    md += "### Rollback Steps\n\n";
    md += "> ⚠️ Use these steps to revert the deployment if necessary\n\n";
    step3.rollbackProcess.forEach((rollback, idx) => {
      md += `${idx + 1}. ${rollback.description || "No description provided"}\n`;
      if (rollback.installation_image) {
        md += `   ![Rollback Image](${rollback.installation_image})\n`;
      }
      md += "\n";
    });
  } else {
    md += "No rollback steps specified.\n\n";
  }
  
  // Configuration Steps (from step-4.configurationProcess)
  if (step4 && step4.configurationProcess && step4.configurationProcess.length > 0) {
    md += "### Configuration Steps\n\n";
    step4.configurationProcess.forEach(group => {
      md += `#### ${group.group_name || "Configuration Group"}\n\n`;
      if (group.group_description) {
        md += group.group_description + "\n\n";
      }
      if (group.steps && group.steps.length > 0) {
        group.steps.forEach((step, idx) => {
          md += `${idx + 1}. ${step.description || "No description provided"}\n`;
          if (step.installation_image) {
            md += `   ![Step Image](${step.installation_image})\n`;
          }
          md += "\n";
        });
      } else {
        md += "No configuration steps specified in this group.\n\n";
      }
    });
  }
  
  return md;
}

/**
 * Generate a complete Markdown README document from the provided JSON data.
 * Sections included:
 * - Header (with AppWrap logo)
 * - Project Overview
 * - User Stories & Usage (from step-2)
 * - Dependencies (from step-5)
 * - Installation, Rollback & Configuration (from step-3 and step-4)
 * - Custom Record (from step-7)
 * - Script Details (from step-6, without unit tests or compliance)
 * - Troubleshooting (from step-10)
 * - Unit Testing (from step-10)
 * - Contact & License (from step-12)
 */
function generateMarkdownDocument(data) {
  const selections = getSectionSelections();
  const step1 = data["step-1"] || {};
  const step2 = data["step-2"] || {};
  const step3 = data["step-3"] || {};
  const step4 = data["step-4"] || {};
  const step5 = data["step-5"] || {};
  const step6 = data["step-6"] || {};
  const step7 = data["step-7"] || {};
  const step10 = data["step-10"] || {};
  const step12 = data["step-12"] || {};

  let md = "";

  // AppWrap Logo at the top
  md += `![AppWrap Logo](https://appwrap.com/wp-content/uploads/2024/12/appwrap-logo.svg)\n\n`;

  // Title and header
  md += `# ${step1.project_name || "Deployment Document"}\n\n`;

  // Badges
  md += generateBadges(step1) + "\n\n";

  // Checklist
  if (selections.checklist) {
    md += generateChecklist() + "\n\n";
  }

  // Table of Contents
  if (selections.toc) {
    md += generateTableOfContents(data, selections) + "\n\n";
  }

  // Project Overview
  if (selections.overview) {
    md += "## Project Overview\n\n";
    if (step1.change_summary) md += step1.change_summary + "\n\n";
    md += `| Project Detail | Value |\n|---------------|-------|\n`;
    if (step1.client) md += `| **Client** | ${step1.client} |\n`;
    if (step1.development_environment) md += `| **Environment** | ${step1.development_environment} |\n`;
    if (step1.version) md += `| **Version** | ${step1.version} |\n`;
    if (step1.date) md += `| **Last Updated** | ${step1.date} |\n`;
    if (step1.developer) md += `| **Developer** | ${step1.developer} |\n`;
    md += "\n";
  }

  // User Stories & Usage
  if (selections.userStoriesFeatures) {
    md += "## User Stories & Usage\n\n";
    // User Stories
    md += "### User Stories\n\n";
    if (step2["user-stories-body"] && step2["user-stories-body"].length > 0) {
      md += "| Story ID | Story Description |\n|----------|-------------------|\n";
      step2["user-stories-body"].forEach(story => {
        md += `| ${story.story_id || ""} | ${story.story_description || ""} |\n`;
      });
    } else {
      md += "No user stories specified.\n";
    }
    md += "\n";
    // Usage
    md += "### Usage\n\n";
    if (step2["usage-body"] && step2["usage-body"].length > 0) {
      step2["usage-body"].forEach((usage, idx) => {
        md += `#### ${usage.usage_title || "Usage Scenario " + (idx + 1)}\n\n`;
        md += usage.usage_description + "\n\n";
      });
    } else {
      md += "No usage instructions specified.\n\n";
    }
  }

  // Dependencies
  if (selections.dependencies) {
    md += "## Dependencies\n\n";
    md += "### Deployment Dependencies\n\n";
    if (step5["deployment-dependencies-body"] && step5["deployment-dependencies-body"].length > 0) {
      md += "| Dependency | Version | License |\n|------------|---------|----------|\n";
      step5["deployment-dependencies-body"].forEach(dep => {
        md += `| ${dep.dependency_name || ""} | ${dep.dependency_version || ""} | ${dep.dependency_license || ""} |\n`;
      });
    } else {
      md += "No deployment dependencies specified.\n";
    }
    md += "\n### Dev Dependencies\n\n";
    if (step5["dev-dependencies-body"] && step5["dev-dependencies-body"].length > 0) {
      md += "| Dependency | Version | License |\n|------------|---------|----------|\n";
      step5["dev-dependencies-body"].forEach(dep => {
        md += `| ${dep.dependency_name || ""} | ${dep.dependency_version || ""} | ${dep.dependency_license || ""} |\n`;
      });
    } else {
      md += "No development dependencies specified.\n";
    }
    md += "\n";
  }

  // Installation, Rollback & Configuration Steps (from step-3 and step-4)
  if (selections.installation) {
    md += generateInstallationSection(step3, step4) + "\n\n";
  }

  // Custom Record (from step-7)
  if (selections.customRecord) {
    md += "## Custom Record\n\n";
    if (step7.customRecords && step7.customRecords.length > 0) {
      step7.customRecords.forEach(record => {
        md += `### ${record.name || "Unnamed Record"}\n\n`;
        if (record.description) md += record.description + "\n\n";
        md += `- **ID:** \`${record.id || ""}\`\n`;
        if (record.fields && record.fields.length > 0) {
          md += "#### Fields\n\n";
          md += "| Field Name | Field ID | Type | Description |\n|------------|----------|------|-------------|\n";
          record.fields.forEach(field => {
            md += `| ${field.field_name || ""} | \`${field.field_id || ""}\` | ${field.field_type || ""} | ${field.field_description || ""} |\n`;
          });
          md += "\n";
        } else {
          md += "No fields defined for this record.\n\n";
        }
        md += "---\n\n";
      });
    } else {
      md += "No custom record information specified.\n\n";
    }
  }

  // Script Details (from step-6)
  if (selections.scriptDetails) {
    md += "## Script Details\n\n";
    if (step6.scripts && step6.scripts.length > 0) {
      step6.scripts.forEach(script => {
        const details = script.details || {};
        md += `### ${script.name || "Unnamed Script"}\n\n`;
        md += `**Type:** ${details.type || "N/A"}\n\n`;
        md += `**File Name:** \`${details.fileName || ""}\`\n\n`;
        md += `**Description:** ${details.description || "No description provided."}\n\n`;
        if (details.location) {
          md += `**Location:** \`${details.location}\`\n\n`;
        }
        if (details.id) {
          md += `**Script ID:** \`${details.id}\`\n\n`;
        }
        if (script.parameters && script.parameters.length > 0) {
          md += "<details>\n<summary>Script Parameters</summary>\n\n";
          md += "| Parameter Name | Parameter ID | Type | Description |\n|---------------|--------------|------|-------------|\n";
          script.parameters.forEach(param => {
            md += `| ${param.parameter_name || ""} | \`${param.parameter_id || ""}\` | ${param.parameter_type || ""} | ${param.parameter_description || ""} |\n`;
          });
          md += "\n</details>\n\n";
        }
        if (script.entryPoints && script.entryPoints.length > 0) {
          md += "<details>\n<summary>Entry Points</summary>\n\n";
          md += "| Event | Function |\n|-------|----------|\n";
          script.entryPoints.forEach(ep => {
            md += `| ${ep.entry_point_name || ""} | ${ep.function_name || ""} |\n`;
          });
          md += "\n</details>\n\n";
        }
        if (script.deploymentRecords && script.deploymentRecords.length > 0) {
          md += "**Deployment Records:**\n";
          script.deploymentRecords.forEach(record => {
            md += `- **Applied To:** ${record.applied_to || ""} — **ID:** \`${record.deployment_id || ""}\` (${record.deployment_notes || ""})\n`;
          });
          md += "\n";
        } else {
          md += "**Deployment Records:** None\n\n";
        }
        if (script.versionHistory && script.versionHistory.length > 0) {
          md += "<details>\n<summary>Version History</summary>\n\n";
          md += "| Version | Date | Change Summary | Commit ID |\n|---------|------|----------------|------------|\n";
          script.versionHistory.forEach(vh => {
            md += `| ${vh.version || ""} | ${vh.date || getCurrentDateString()} | ${vh.change_summary || ""} | ${vh.commit_id || "N/A"} |\n`;
          });
          md += "\n</details>\n\n";
        }
        md += "---\n\n";
      });
    } else {
      md += "No scripts specified.\n\n";
    }
  }

  // Troubleshooting (from step-10)
  if (selections.troubleshooting) {
    md += "## Troubleshooting\n\n";
    if (step10["troubleshooting-body"] && step10["troubleshooting-body"].length > 0) {
      md += "| Issue | Cause | Resolution |\n|-------|-------|------------|\n";
      step10["troubleshooting-body"].forEach(issue => {
        md += `| ${issue.error_issue || ""} | ${issue.cause || ""} | ${issue.resolution || ""} |\n`;
      });
      md += "\n";
    } else {
      md += "No troubleshooting issues specified.\n\n";
    }
  }

  // Unit Testing (from step-10)
  if (selections.unitTesting) {
    md += "## Unit Testing\n\n";
    if (step10.unitTesting && step10.unitTesting.length > 0) {
      md += "| Test Description | Expected Result | Actual Result | Pass/Fail | Comments |\n|-------------------|-----------------|---------------|-----------|----------|\n";
      step10.unitTesting.forEach(test => {
        md += `| ${test.business_process || ""} | ${test.expected_result || ""} | ${test.actual_result || ""} | ${test.pass_fail || ""} | ${test.comments || ""} |\n`;
      });
      md += "\n";
    } else {
      md += "No unit testing data specified.\n\n";
    }
  }

  // Contact & License (from step-12)
  if (selections.contactAndLicense) {
    md += "## Contact and License\n\n";
    if (step12["developers-body"] && step12["developers-body"].length > 0) {
      md += "**Developers**\n\n";
      md += "| Developer Name | Email | Note |\n|----------------|-------|------|\n";
      step12["developers-body"].forEach(dev => {
        md += `| ${dev.developer_name || ""} | ${dev.developer_email || ""} | ${dev.developer_note || ""} |\n`;
      });
      md += "\n";
    } else {
      md += "No developer information specified.\n\n";
    }
    if (step12["functional-body"] && step12["functional-body"].length > 0) {
      md += "**Functional Contacts**\n\n";
      md += "| Functional Name | Email | Note |\n|-----------------|-------|------|\n";
      step12["functional-body"].forEach(func => {
        md += `| ${func.functional_name || ""} | ${func.functional_email || ""} | ${func.functional_note || ""} |\n`;
      });
      md += "\n";
    } else {
      md += "No functional contact information specified.\n\n";
    }
    md += "## License\n\n";
    if (step12.license) {
      md += "```\n" + step12.license.trim() + "\n```\n";
    } else {
      md += "No license information provided.\n";
    }
  }

  return md;
}

/* ----- End of File ----- */
