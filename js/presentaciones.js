const announcements = document.getElementById("announcements");
const feedMessage = document.getElementById("feed-message");
const announcementTemplate = document.getElementById("announcement-template");
const studentSearch = document.getElementById("student-search");
const schoolFilter = document.getElementById("school-filter");
const searchEmpty = document.getElementById("search-empty");

function normalizeStatus(status) {
    const normalized = status.trim().toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (normalized === "en curso") return "en curso";
    if (normalized === "finalizado" || normalized === "finalizada") return "finalizado";
    return "pendiente";
}

function showMessage(message, kind = "info") {
    feedMessage.textContent = message;
    feedMessage.dataset.kind = kind;
    feedMessage.hidden = false;
}

function normalizeText(value) {
    return value.trim().toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeSchool(value) {
    const normalized = normalizeText(value);
    return normalized === "arquictetura" ? "arquitectura" : normalized;
}

function parseDateValue(value) {
    const dateText = value.trim();
    const numericDate = dateText.match(/^(\d{1,2})[/\.\-](\d{1,2})[/\.\-](\d{4})$/);

    if (numericDate) {
        const first = Number(numericDate[1]);
        const second = Number(numericDate[2]);
        const year = Number(numericDate[3]);
        const month = first <= 12 && second > 12 ? first : second;
        const day = first <= 12 && second > 12 ? second : first;
        const parsed = new Date(Date.UTC(year, month - 1, day));
        if (parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day) return parsed.getTime();
        return Number.POSITIVE_INFINITY;
    }

    const timestamp = Date.parse(dateText);
    return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
}

function filterByStudent() {
    const searchTerm = normalizeText(studentSearch.value);
    const selectedSchool = schoolFilter.value;
    const cards = [...announcements.querySelectorAll(".announcement")];
    let visibleCount = 0;

    cards.forEach(card => {
        const matchesStudent = card.dataset.student.includes(searchTerm);
        const matchesSchool = !selectedSchool || card.dataset.school === selectedSchool;
        const matches = matchesStudent && matchesSchool;
        card.hidden = !matches;
        if (matches) visibleCount += 1;
    });

    searchEmpty.hidden = visibleCount > 0 || cards.length === 0;
}

function renderAnnouncements(rows) {
    announcements.replaceChildren();
    const validRows = rows
        .filter(row => row.estudiante || row.titulo)
        .map((row, index) => ({ row, index, timestamp: parseDateValue(row.fecha || "") }))
        .sort((first, second) => first.timestamp - second.timestamp || first.index - second.index)
        .map(entry => entry.row);

    if (!validRows.length) {
        showMessage("La hoja no contiene presentaciones para mostrar.");
        return;
    }

    feedMessage.hidden = true;
    validRows.forEach(row => {
        const card = announcementTemplate.content.cloneNode(true);
        card.querySelector(".announcement").dataset.student = normalizeText(row.estudiante || "");
        card.querySelector(".announcement").dataset.school = normalizeSchool(row.escuela || "");
        const status = normalizeStatus(row.estado || "pendiente");
        const fields = {
            fecha: row.fecha,
            estudiante: row.estudiante,
            escuela: row.escuela,
            titulo: row.titulo || "Trabajo de Grado",
            tutor: row.tutor,
            jurado: row.jurado,
            hora: row.hora,
            lugar: row.lugar
        };

        Object.entries(fields).forEach(([field, value]) => {
            card.querySelector(`[data-field="${field}"]`).textContent = value || "Por confirmar";
        });

        const statusBadge = card.querySelector('[data-field="estado"]');
        statusBadge.textContent = status === "en curso" ? "En curso" : status === "finalizado" ? "Finalizado" : "Pendiente";
        statusBadge.dataset.state = status;
        announcements.append(card);
    });

    filterByStudent();
}

async function loadAnnouncements() {
    if (!window.GoogleSheet?.csvUrl) return;

    showMessage("Cargando presentaciones…");
    try {
        const response = await fetch(window.GoogleSheet.csvUrl, { cache: "no-store" });
        if (!response.ok) throw new Error("No se pudo consultar la hoja.");
        const rows = window.GoogleSheet.parseCsv(await response.text());
        renderAnnouncements(rows);
    } catch (error) {
        showMessage("No se pudo cargar la hoja. Verifica que esté publicada como CSV y que la URL sea correcta.", "error");
    }
}

studentSearch.addEventListener("input", filterByStudent);
schoolFilter.addEventListener("change", filterByStudent);
document.querySelector(".print-button").addEventListener("click", () => window.print());
loadAnnouncements();
