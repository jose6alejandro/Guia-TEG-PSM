window.GoogleSheet = {
    csvUrl: "https://docs.google.com/spreadsheets/d/12au0DSFvircnAiuKEx5Q1UicGLET_d19q6ekhdWtWv4/export?format=csv",
    parseCsv(csv) {
        const rows = [];
        let row = [];
        let cell = "";
        let quoted = false;

        for (let index = 0; index < csv.length; index += 1) {
            const character = csv[index];
            if (character === '"' && quoted && csv[index + 1] === '"') {
                cell += '"';
                index += 1;
            } else if (character === '"') {
                quoted = !quoted;
            } else if (character === "," && !quoted) {
                row.push(cell.trim());
                cell = "";
            } else if ((character === "\n" || character === "\r") && !quoted) {
                if (character === "\r" && csv[index + 1] === "\n") index += 1;
                row.push(cell.trim());
                if (row.some(value => value !== "")) rows.push(row);
                row = [];
                cell = "";
            } else {
                cell += character;
            }
        }

        row.push(cell.trim());
        if (row.some(value => value !== "")) rows.push(row);
        if (rows.length < 2) return [];

        const headers = rows.shift().map(header => header.trim().replace(/^\uFEFF/, "").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        return rows.map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])));
    }
};
