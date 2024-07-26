document.getElementById('print-btn').addEventListener('click', () => {
    // Get selected values
    const hoodSelect = document.getElementById('hood-select');
    const cleaningSelect = document.getElementById('cleaning-select');

    const selectedHood = hoodSelect.value;
    const selectedCleaning = cleaningSelect.value;

    // Create a new table
    const table = document.createElement('table');
    table.id = 'steps-table';

    // Create table headers
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headerCell1 = document.createElement('th');
    headerCell1.textContent = 'Cleaning';

    const headerCell2 = document.createElement('th');
    headerCell2.textContent = 'Sequence';

    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    thead.appendChild(headerRow);

    // Create table body
    const tbody = document.createElement('tbody');

    // Determine the content based on selected options
    if (selectedHood === '7' && selectedCleaning === '7') {
        // Daily Cleaning
        const row1 = document.createElement('tr');
        const cell1 = document.createElement('td');
        cell1.innerHTML = `
            1) Sterile TBI-3000 (Dwell time 1 min)<br>
            2) Sterile Alcohol
        `;

        const cell2 = document.createElement('td');
        cell2.innerHTML = `
            1) Back to front with side to side motion<br>
            2) Ceiling<br>
            3) Back<br>
            4) Interior Side<br>
            5) Bar/Hooks<br>
            6) Exterior Equipment Surfaces<br>
            7) Work Surface
        `;

        row1.appendChild(cell1);
        row1.appendChild(cell2);

        tbody.appendChild(row1);

    } else if (selectedHood === '7' && selectedCleaning === '30') {
        // Monthly Cleaning
        const row1 = document.createElement('tr');
        const cell1 = document.createElement('td');
        cell1.innerHTML = `
            1) Sterile Peridox (Dwell time 3 min)<br>
            2) Sterile Alcohol
        `;

        const cell2 = document.createElement('td');
        cell2.innerHTML = `
            1) Back to front with side to side motion<br>
            2) Ceiling<br>
            3) Back<br>
            4) Interior Side<br>
            5) Bar/Hooks<br>
            6) Exterior Equipment Surfaces<br>
            7) Work Surface
        `;

        row1.appendChild(cell1);
        row1.appendChild(cell2);

        tbody.appendChild(row1);

    } else {
        // No valid options selected
        const row1 = document.createElement('tr');
        const cell1 = document.createElement('td');
        cell1.colSpan = 2; // Make cell span across both columns
        cell1.textContent = 'No data available for selected options';

        row1.appendChild(cell1);
        tbody.appendChild(row1);
    }

    table.appendChild(thead);
    table.appendChild(tbody);

    // Clear existing table content and add new table
    const tableContainer = document.querySelector('.table-container');
    tableContainer.innerHTML = ''; // Clear any existing content
    tableContainer.appendChild(table);

    // Add additional text below the table
    const additionalText = document.createElement('div');
    additionalText.id = 'additional-text'; // Apply the CSS class
    additionalText.innerHTML = `
        ALL SURFACES MUST REMAIN SATURATED THROUGHOUT DWELL TIME<br>
        WIPE AFTER DWELL TIME COMPLETED<br>
        CHANGE GLOVES AFTER CLEANING
    `;

    tableContainer.appendChild(additionalText);
});
