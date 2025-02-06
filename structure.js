const structureData = {
    "title": "AppWrap - Deployment Manifest Wizard",
    "version": "2.0",
    "groups": [
      {
        "id": "group1",
        "name": "Project Information",
        "sections": [
          {
            "name": "Project Information",
            "type": "fields",
            "fields": [
              {
                "name": "Name",
                "type": "text"
              },
              {
                "name": "Client",
                "type": "text"
              },
              {
                "name": "Developer",
                "type": "text"
              },
              {
                "name": "Functional",
                "type": "text"
              }
            ]
          },
          {
            "name": "Production Version History",
            "type": "table",
            "columns": [
              {
                "name": "Version",
                "type": "text"
              },
              {
                "name": "Date",
                "type": "date"
              },
              {
                "name": "Change Summary",
                "type": "textarea"
              }
            ]
          }
        ]
      },
      {
        "id": "group2",
        "name": "Project Scope",
        "sections": [
          {
            "name": "User Stories",
            "type": "table",
            "columns": [
              {
                "name": "ID",
                "type": "text"
              },
              {
                "name": "Description",
                "type": "text"
              }
            ]
          },
          {
            "name": "Features",
            "type": "table",
            "columns": [
              {
                "name": "ID",
                "type": "text"
              },
              {
                "name": "Description",
                "type": "text"
              }
            ]
          },
          {
            "name": "Usage",
            "type": "table",
            "columns": [
              {
                "name": "ID",
                "type": "text"
              },
              {
                "name": "Description",
                "type": "text"
              }
            ]
          }
        ]
      },
      {
        "id": "group3",
        "name": "Configuration",
        "sections": [
          {
            "name": "Process",
            "type": "multiTableRecord",
            "isCollapsible": true,
            "tables": [
              {
                "name": "Installation",
                "type": "table",
                "columns": [
                  {
                    "name": "Step Number",
                    "type": "text"
                  },
                  {
                    "name": "Description",
                    "type": "text"
                  }
                ]
              },
              {
                "name": "Rollback",
                "type": "textarea"
              }
            ]
          },
          {
            "name": "Environment Specific IDs",
            "type": "table",
            "columns": [
              {
                "name": "Name",
                "type": "text"
              },
              {
                "name": "Notes",
                "type": "text"
              },
              {
                "name": "Sandbox Value",
                "type": "text"
              },
              {
                "name": "Production Value",
                "type": "text"
              }
            ]
          }
        ]
      },
      {
        "id": "group4",
        "name": "ReadMe Doc",
        "sections": [
          {
            "name": "Deployment Dependencies",
            "type": "table",
            "columns": [
              {
                "name": "Dependency Name",
                "type": "text"
              },
              {
                "name": "Dependency Version",
                "type": "text"
              },
              {
                "name": "Dependency License",
                "type": "text"
              }
            ]
          },
          {
            "name": "Dev Dependencies",
            "type": "table",
            "columns": [
              {
                "name": "Dependency Name",
                "type": "text"
              },
              {
                "name": "Dependency Version",
                "type": "text"
              },
              {
                "name": "Dependency License",
                "type": "text"
              }
            ]
          }
        ]
      },
      {
        "id": "group5",
        "name": "Scripts",
        "type": "multiTableRecord",
        "isCollapsible": true,
        "hasTabs": true,
        "sections": [
          {
            "name": "Script Details",
            "type": "fields",
            "fields": [
              {
                "name": "Name",
                "type": "text"
              },
              {
                "name": "ID",
                "type": "text"
              },
              {
                "name": "Type",
                "type": "text"
              },
              {
                "name": "Description",
                "type": "text"
              },
              {
                "name": "File Name",
                "type": "text"
              },
              {
                "name": "Location",
                "type": "text"
              }
            ]
          },
          {
            "name": "Parameters",
            "type": "table",
            "columns": [
              {
                "name": "Parameter Name",
                "type": "text"
              },
              {
                "name": "ID",
                "type": "text"
              },
              {
                "name": "Parameter Type",
                "type": "text"
              },
              {
                "name": "Parameter Description",
                "type": "text"
              }
            ]
          },
          {
            "name": "Entry Points",
            "type": "table",
            "columns": [
              {
                "name": "Entry Point Name",
                "type": "text"
              },
              {
                "name": "Function Name",
                "type": "text"
              }
            ]
          },
          {
            "name": "Deployment Records",
            "type": "table",
            "columns": [
              {
                "name": "Applied To",
                "type": "text"
              },
              {
                "name": "ID",
                "type": "text"
              },
              {
                "name": "Deployment Notes",
                "type": "textarea"
              }
            ]
          },
          {
            "name": "Version History",
            "type": "table",
            "columns": [
              {
                "name": "Version",
                "type": "text"
              },
              {
                "name": "Date",
                "type": "date"
              },
              {
                "name": "Change Summary",
                "type": "textarea"
              },
              {
                "name": "Commit ID",
                "type": "text"
              }
            ]
          },
          {
            "name": "Libraries/Module",
            "type": "table",
            "columns": [
              {
                "name": "Library Name",
                "type": "text"
              },
              {
                "name": "File Name",
                "type": "text"
              },
              {
                "name": "Location",
                "type": "text"
              },
              {
                "name": "Purpose",
                "type": "text"
              }
            ]
          },
          {
            "name": "Unit Tests",
            "type": "table",
            "columns": [
              {
                "name": "Description",
                "type": "text"
              },
              {
                "name": "Result",
                "type": "text"
              }
            ]
          },
          {
            "name": "Checkboxes",
            "type": "checkboxes",
            "fields": [
              {
                "name": "Project upholds AppWrap's Deployment Standards and Best Practices",
                "type": "checkbox"
              },
              {
                "name": "Scripts include AppWrap's Code Disclaimer and Header",
                "type": "checkbox"
              },
              {
                "name": "Contributors adhere to AppWrap's Developer and Technical Resources Expectations",
                "type": "checkbox"
              },
              {
                "name": "Eslint Checked",
                "type": "checkbox"
              }
            ]
          }
        ]
      },
      {
        "id": "group6",
        "name": "Custom Records",
        "type": "multiTableRecord",
        "isCollapsible": true,
        "sections": [
          {
            "name": "Custom Records",
            "type": "table",
            "columns": [
              {
                "name": "Record Name",
                "type": "text"
              },
              {
                "name": "ID",
                "type": "text"
              },
              {
                "name": "Description",
                "type": "text"
              }
            ]
          },
          {
            "name": "Fields",
            "type": "table",
            "columns": [
              {
                "name": "Field Name",
                "type": "text"
              },
              {
                "name": "ID",
                "type": "text"
              },
              {
                "name": "Field Type",
                "type": "text"
              },
              {
                "name": "Field Description",
                "type": "text"
              }
            ]
          }
        ]
      },
      {
        "id": "group7",
        "name": "Components",
        "sections": [
          {
            "name": "Custom Fields",
            "type": "table",
            "columns": [
              {
                "name": "Field Name",
                "type": "text"
              },
              {
                "name": "ID",
                "type": "text"
              },
              {
                "name": "Description",
                "type": "textarea",
                "description": "Applies To, Sourced From etc."
              }
            ]
          },
          {
            "name": "Templates",
            "type": "table",
            "columns": [
              {
                "name": "Template Name",
                "type": "text"
              },
              {
                "name": "ID",
                "type": "text"
              },
              {
                "name": "Type",
                "type": "text"
              },
              {
                "name": "Description",
                "type": "text"
              }
            ]
          },
          {
            "name": "Saved Searches",
            "type": "table",
            "columns": [
              {
                "name": "Search Name",
                "type": "text"
              },
              {
                "name": "ID",
                "type": "text"
              },
              {
                "name": "Description",
                "type": "text"
              },
              {
                "name": "Criteria",
                "type": "text",
                "fileType": "image"
              },
              {
                "name": "Results",
                "type": "text",
                "fileType": "image"
              }
            ]
          }
        ]
      },
      {
        "id": "group8",
        "name": "Documentation",
        "sections": [
          {
            "name": "Troubleshooting",
            "type": "table",
            "columns": [
              {
                "name": "Error/Issue",
                "type": "text"
              },
              {
                "name": "Cause",
                "type": "text"
              },
              {
                "name": "Resolution",
                "type": "text"
              }
            ]
          },
          {
            "name": "Test Cases",
            "type": "table",
            "columns": [
              {
                "name": "Test Name",
                "type": "text"
              },
              {
                "name": "Description",
                "type": "text"
              },
              {
                "name": "Result",
                "type": "text"
              },
              {
                "name": "Status",
                "type": "text"
              }
            ]
          }
        ]
      },
      {
        "id": "group9",
        "name": "Deployment",
        "sections": [
          {
            "name": "Deployment Checklist",
            "type": "checkboxes",
            "fields": [
              {
                "name": "Production Version Backed Up and in Git",
                "type": "checkbox"
              },
              {
                "name": "Code Changes Fully Documented [Readme Doc]",
                "type": "checkbox"
              },
              {
                "name": "All Fields and Records Listed",
                "type": "checkbox"
              },
              {
                "name": "Rollback Steps Defined",
                "type": "checkbox"
              },
              {
                "name": "Deployment Reviewed",
                "type": "checkbox"
              },
              {
                "name": "Tested Completely by Functional Team",
                "type": "checkbox"
              },
              {
                "name": "Tested Completely by Client",
                "type": "checkbox"
              },
              {
                "name": "Deployment Plan Approved by Client",
                "type": "checkbox"
              }
            ]
          }
        ]
      },
      {
        "id": "group10",
        "name": "Contact",
        "sections": [
          {
            "name": "Developers",
            "type": "table",
            "columns": [
              {
                "name": "Name",
                "type": "text"
              },
              {
                "name": "Email",
                "type": "text"
              },
              {
                "name": "Note",
                "type": "text",
                "description": "Main, Backup"
              }
            ]
          },
          {
            "name": "Functional",
            "type": "table",
            "columns": [
              {
                "name": "Name",
                "type": "text"
              },
              {
                "name": "Email",
                "type": "text"
              },
              {
                "name": "Note",
                "type": "text",
                "description": "Main, Backup"
              }
            ]
          },
          {
            "name": "License",
            "type": "textarea",
            "defaultValue": "Copyright 2025 AppWrap, Inc. All Rights Reserved."
          }
        ]
      }
    ]
  }

 