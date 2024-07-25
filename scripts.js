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

        const month = monthSelect.value;
        const year = yearSelect.value;
        const expirationType = expirationSelect.value;

        if (!month || !year || !expirationType) {
            alert('Please select all options before printing.');
            return;
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const doc = new jsPDF('p', 'in', 'letter');

        const labelWidth = 2.625;
        const labelHeight = 1;
        const labelsPerRow = 3;
        const labelsPerColumn = 10;

        const leftMargin = 0.5 / 2.54;
        const rightMargin = 0.5 / 2.54;
        const topMargin = 0.8 / 2.54;
        const bottomMargin = 1.6 / 2.54;
        const interColumnMargin = 4 / 2.54;

        const xSpacing = (doc.internal.pageSize.width - leftMargin - rightMargin - (labelsPerRow * labelWidth)) / (labelsPerRow - 1);
        const ySpacing = (doc.internal.pageSize.height - topMargin - bottomMargin - (labelsPerColumn * labelHeight)) / (labelsPerColumn - 1);

        let currentDate = new Date(startDate);
        const expirationMap = {
            '7': { days: 7, months: 0, years: 0 },
            '30': { days: 30, months: 0, years: 0 },
            '180': { days: 0, months: 6, years: 0 },
            '1095': { days: 0, months: 0, years: 3 }
        };

        const { days, months, years } = expirationMap[expirationType] || { days: 0, months: 0, years: 0 };

        while (currentDate <= endDate) {
            if (currentDate.getDate() > 1) {
                doc.addPage();
            }

            for (let row = 0; row < labelsPerColumn; row++) {
                for (let col = 0; col < labelsPerRow; col++) {
                    const x = leftMargin + col * (labelWidth + xSpacing) + (labelWidth / 2);
                    const y = topMargin + row * (labelHeight + ySpacing) + (labelHeight / 2);

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

                    doc.text(`Opened on ${openedOn}`, x, y, { align: 'center' });
                    doc.text(`Expired on ${expiredOn}`, x, y + 0.4, { align: 'center' });
                }
            }

            currentDate.setDate(currentDate.getDate() + 1);

            if (currentDate > endDate) break;
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
