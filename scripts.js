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

        const month = monthSelect.value;
        const year = yearSelect.value;
        const expirationType = expirationSelect.value;

        if (!month || !year || !expirationType) {
            alert('Please select all options before printing.');
            return;
        }

        const startDate = new Date(year, month - 1, 1); // First day of the selected month
        const endDate = new Date(year, month, 0); // Last day of the selected month
        const doc = new jsPDF('p', 'in', 'letter');

        const labelWidth = 2.625;
        const labelHeight = 1;
        const labelsPerRow = 3;
        const labelsPerColumn = 10;
        const startX = 0.1875; // starting X position for the first label
        const startY = 0.5; // starting Y position for the first label
        const xSpacing = 0.125; // horizontal space between labels
        const ySpacing = 0.75; // vertical space between labels

        let currentDate = new Date(startDate);
        const expirationMap = {
            '7': { days: 7, months: 0, years: 0 },
            '30': { days: 30, months: 0, years: 0 },
            '180': { days: 0, months: 6, years: 0 }, // 6 months
            '1095': { days: 0, months: 0, years: 3 } // 3 years
        };

        const { days, months, years } = expirationMap[expirationType] || { days: 0, months: 0, years: 0 };

        while (currentDate <= endDate) {
            // Add a new page for each set of 30 labels
            if (currentDate.getDate() > 1) {
                doc.addPage();
            }

            for (let row = 0; row < labelsPerColumn; row++) {
                for (let col = 0; col < labelsPerRow; col++) {
                    const x = startX + col * (labelWidth + xSpacing);
                    const y = startY + row * (labelHeight + ySpacing);

                    const openedOn = formatDate(currentDate);
                    const expirationDate = new Date(currentDate);
                    
                    if (days > 0) {
                        expirationDate.setDate(currentDate.getDate() + days);
                    } else if (months > 0) {
                        expirationDate.setMonth(currentDate.getMonth() + months);
                    } else if (years > 0) {
                        expirationDate.setFullYear(currentDate.getFullYear() + years);
                    }
                    
                    const expiredOn = formatDate(expirationDate);

                    doc.text(`Opened on ${openedOn}`, x, y);
                    doc.text(`Expired on ${expiredOn}`, x, y + 0.4); // Adjust this value to increase space between the two outputs
                }
            }

            // Move to the next date
            currentDate.setDate(currentDate.getDate() + 1);

            // Break out of loop if no more labels are needed
            if (currentDate > endDate) break;
        }

        // Convert PDF to Data URL
        const pdfDataUrl = doc.output('datauristring');

        // Open PDF in a new window
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write('<html><head><title>PDF Preview</title></head><body>');
        previewWindow.document.write('<iframe width="100%" height="100%" src="' + pdfDataUrl + '"></iframe>');
        previewWindow.document.write('</body></html>');
        previewWindow.document.close();
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
