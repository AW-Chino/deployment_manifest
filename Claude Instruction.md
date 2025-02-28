You are provided with detailed project and script information for a NetSuite deployment. Using that information, produce a JSON manifest matching the following structure and rules:

1. **Overall JSON Format**  
   ```json
   {
     "step-1": { /* Project Information */ },
     "step-2": { /* Project Scope */ },
     "step-3": { /* Playbook */ },
     "step-4": { /* Configuration */ },
     "step-5": { /* Dependencies */ },
     "step-6": { /* Scripts */ },
     "step-7": { /* Custom Records */ },
     "step-8": { /* Workflow */ },
     "step-9": { /* Custom Fields */ },
     "step-10": { /* Troubleshooting */ },
     "step-11": { /* Deployment Checklist */ },
     "step-12": { /* Contact & License */ }
   }
   ```

2. **Section Details** (include only the ones you need, but maintain the structure):
   - **Step 1 (Project Info)** must include:
     - `project_name` (string)
     - `client` (string)
     - `developer` (**default to "C. Dela Cruz"** if no name is specified by the user)
     - `development_environment` (string)
     - `version` (string, semantic version preferred, e.g. `"1.0.0"`)
     - `date` (`YYYY-MM-DD`)
     - `change_summary` (string)
     - `version-history-body` (array of objects, each with `version`, `date`, `change_summary`)

   - **Step 2 (Project Scope)**: user-stories-body, features-body, usage-body

   - **Step 3 (Playbook)**: processes (name + steps) and rollbacks (list of rollback actions)

   - **Step 4 (Configuration)**: environment-ids-body (list of environment IDs)

   - **Step 5 (Dependencies)**: deployment-dependencies-body, dev-dependencies-body

   - **Step 6 (Scripts)**: scripts array, each with:
     - `name`
     - `details` (`id`, `type`, `description`, `fileName`, `location`)
     - `parameters` (`parameter_name`, `parameter_id`, `parameter_type`, `parameter_description`)
     - `entryPoints` (`entry_point_name`, `function_name`)
     - `deploymentRecords` (`applied_to`, `deployment_id`, `deployment_notes`)
     - `libraries` (`library_name`, `file_name`, `location`, `purpose`)
     - `unitTests` (`test_description`, `test_result`)
     - `checklists` (`standards`, `disclaimer`, `expectations`, `eslint` booleans)

   - **Step 7 (Custom Records)**: customRecords array, each with `name`, `id`, `type`, `description`, `fields`

   - **Step 8 (Workflow)**: workflows array, each with `details`, `actions` (`action`, `state`, `details`)

   - **Step 9 (Custom Fields)**: custom-fields-body, saved-searches-body, templates-body

   - **Step 10 (Troubleshooting)**: troubleshooting-body array

   - **Step 11 (Deployment Checklist)**:  
     ```
     {
       "production_version_backed_up": boolean,
       "code_changes_documented": boolean,
       "fields_records_listed": boolean,
       "rollback_steps_defined": boolean,
       "deployment_reviewed": boolean,
       "tested_by_functional": boolean,
       "tested_by_client": boolean,
       "deployment_plan_approved": boolean
     }
     ```

   - **Step 12 (Contact & License)**: `license`, `developers-body`, `functional-body`

3. **Validation Rules**:  
   - The `"developer"` field must be `"C. Dela Cruz"` by default, or `"Chino Dela Cruz"` if the user specifies differently  
   - All dates are in `YYYY-MM-DD` format  
   - Script/record IDs must follow NetSuite naming conventions (e.g., `customscript_`, `customrecord_`)  
   - Provide meaningful version histories and change summaries

4. **Required Fields**:  
   - `project_name`  
   - `client`  
   - `developer` (defaults to `"C. Dela Cruz"`)  
   - `development_environment`  
   - `license`

5. **Please Return**:  
   - A single JSON object matching the above structure  
   - **No additional text**; only valid JSON.

**Now here are my specific details:**  
[Paste or describe your project, scripts, custom records, etc. in natural language]

**Generate the JSON** that fits all these details, ensuring it meets the structure and rules above.

