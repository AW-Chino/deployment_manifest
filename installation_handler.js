// installation_handler.js

document.addEventListener("DOMContentLoaded", function () {
  attachInstallationHandlers();
});

function attachInstallationHandlers() {
  // Attach an event listener on the installation table (if needed) for image input changes.
  const tbody = document.getElementById('installation-body');
  if (tbody) {
    tbody.addEventListener('input', function(event) {
      if (event.target.name === 'installation_image') {
        updateInstallationImagePreview(event.target);
      }
    });
  }
}

function addInstallationRow() {
  console.log("Adding a new installation row");
  const tbody = document.getElementById('installation-body');
  const row = document.createElement('tr');
  
  // Step cell: auto-numbered based on current rows
  const stepCell = document.createElement('td');
  const stepNumber = tbody.querySelectorAll('tr').length + 1;
  stepCell.textContent = stepNumber;
  row.appendChild(stepCell);
  
  // Description cell: text input
  const descCell = document.createElement('td');
  const descInput = document.createElement('input');
  descInput.type = 'text';
  descInput.className = 'form-control';
  descInput.name = 'installation_description';
  descInput.placeholder = 'Enter description';
  descCell.appendChild(descInput);
  row.appendChild(descCell);
  
  // Image cell: text input and preview element
  const imageCell = document.createElement('td');
  const imageInput = document.createElement('input');
  imageInput.type = 'text';
  imageInput.className = 'form-control';
  imageInput.name = 'installation_image';
  imageInput.placeholder = 'Enter image file name';
  // Attach an event listener for live preview update
  imageInput.addEventListener('input', function() {
    updateInstallationImagePreview(imageInput);
  });
  imageCell.appendChild(imageInput);
  
  // Create a preview element for the image
  const preview = document.createElement('img');
  preview.style.maxWidth = "100px";
  preview.style.marginTop = "5px";
  preview.style.display = "none"; // hide initially
  imageCell.appendChild(preview);
  row.appendChild(imageCell);
  
  // Actions cell: Remove button
  const actionCell = document.createElement('td');
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.className = 'btn btn-danger btn-sm';
  removeBtn.addEventListener('click', function() {
    row.remove();
    renumberInstallationRows();
  });
  actionCell.appendChild(removeBtn);
  row.appendChild(actionCell);
  
  tbody.appendChild(row);
}

function renumberInstallationRows() {
  const tbody = document.getElementById('installation-body');
  const rows = tbody.querySelectorAll('tr');
  rows.forEach((row, index) => {
    row.cells[0].textContent = index + 1;
  });
}

function updateInstallationImagePreview(input) {
  // Ensure only the file name is stored by stripping any "images/" prefix
  let filename = input.value.trim().replace(/^images\//, "");
  // Determine the preview image element (assumed to be the first <img> in the same cell)
  const cell = input.parentElement;
  const preview = cell.querySelector('img');
  if (filename !== "") {
    // For display purposes, prepend the folder path:
    preview.src = "images/" + filename;
    preview.style.display = "block";
  } else {
    preview.style.display = "none";
  }
}

// Make the function globally available so inline onclick="addInstallationRow()" works
window.addInstallationRow = addInstallationRow;
