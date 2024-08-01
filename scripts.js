document.addEventListener('DOMContentLoaded', () => {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const expirationSelect = document.getElementById('expiration-select');

    // Populate month select
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    // Populate year select
    for (let i = 2024; i <= 2034; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    // Handle button click
    document.getElementById('print-btn').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;

        if (!jsPDF) {
            alert('jsPDF library is not loaded.');
            return;
        }

        const month = parseInt(monthSelect.value);
        const year = parseInt(yearSelect.value);
        const expirationType = expirationSelect.value;

        if (!month || !year || !expirationType) {
            alert('Please select all options before printing.');
            return;
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const doc = new jsPDF('p', 'in', [13, 13]); // Page size set to 13 inches by 13 inches

        const labelWidth = 2.625;
        const labelHeight = 1;
        const labelsPerRow = 3;
        const labelsPerColumn = 10; // Adjusted to 10 columns
        const labelsPerPage = labelsPerRow * labelsPerColumn; // Total labels per page

        const leftMargin = 0.5906; // 1.5 cm in inches
        const rightMargin = 0.5906; // 1.5 cm in inches
        const topMargin = 0.7874; // 2 cm in inches
        const bottomMargin = 1.6;

        const xSpacing = 1.50;
        const ySpacing = 0.20;

        let currentDate = new Date(startDate);

        const expirationMap = {
            '7': { days: 7, months: 0, years: 0, text: '7-Days', cellsPerDate: 9 },
            '30': { days: 30, months: 0, years: 0, text: '30-Days', cellsPerDate: 3 },
            '180': { days: 0, months: 6, years: 0, text: '6-Months', cellsPerDate: 3 },
            '1095': { days: 0, months: 0, years: 3, text: '3-Years', cellsPerDate: 3 }
        };

        const { days, months, years, text: expirationText, cellsPerDate } = expirationMap[expirationType] || { days: 0, months: 0, years: 0, text: '', cellsPerDate: 3 };

        let rowCount = 0;
        let labelCount = 0;
        let labelsPrinted = 0;
        let labelsForCurrentDate = 0;

        while (currentDate <= endDate) {
            // Add a new page if the number of labels exceeds the limit for the page
            if (labelsPrinted % labelsPerPage === 0 && labelsPrinted > 0) {
                doc.addPage();
                rowCount = 0;
                labelCount = 0;
                labelsForCurrentDate = 0; // Reset for new page
            }

            // Add label
            const x = leftMargin + labelCount * (labelWidth + xSpacing);
            const y = topMargin + rowCount * (labelHeight + ySpacing);

            const dispensedOn = formatDate(currentDate);
            const expirationDate = new Date(currentDate);

            if (days > 0) {
                expirationDate.setDate(currentDate.getDate() + days);
            } else if (months > 0) {
                expirationDate.setMonth(currentDate.getMonth() + months);
            } else if (years > 0) {
                expirationDate.setFullYear(currentDate.getFullYear() + years);
            }

            const expiresOn = formatDate(expirationDate);

            doc.text(`Dispensed ${dispensedOn}`, x + labelWidth / 2, y + labelHeight / 2 - 0.15, { align: 'center' });
            doc.text(`Expires (${expirationText}) ${expiresOn}`, x + labelWidth / 2, y + labelHeight / 2 + 0.15, { align: 'center', fontSize: 12, fontStyle: 'bold' });

            labelCount++;
            labelsPrinted++;
            labelsForCurrentDate++;

            // Move to the next row or page
            if (labelCount >= labelsPerRow) {
                labelCount = 0;
                rowCount++;
            }

            // Change date after 'cellsPerDate' cells
            if (labelsForCurrentDate >= cellsPerDate) {
                labelsForCurrentDate = 0;
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        const pdfDataUrl = doc.output('datauristring');

        const previewWindow = window.open('', '_blank');
        if (previewWindow) {
            previewWindow.document.write('<html><head><title>PDF Preview</title></head><body>');
            previewWindow.document.write('<iframe width="100%" height="100%" src="' + pdfDataUrl + '"></iframe>');
            previewWindow.document.write('</body></html>');
            previewWindow.document.close();
        } else {
            alert('Failed to open preview window.');
        }
    });

    function formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [month, day, year].join('/');
    }
});
