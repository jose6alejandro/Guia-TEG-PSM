function openTab(tabName) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.add('hidden');
        content.classList.remove('block', 'active');
    });

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('bg-psm-blue', 'text-white', 'border-psm-gold');
        btn.classList.add('bg-white', 'text-gray-600', 'border-transparent');
    });

    const selectedContent = document.getElementById(tabName);
    selectedContent.classList.remove('hidden');
    selectedContent.classList.add('block', 'active');

    const activeBtn = document.getElementById('btn-' + tabName);
    if(activeBtn) {
        activeBtn.classList.remove('bg-white', 'text-gray-600', 'border-transparent');
        activeBtn.classList.add('bg-psm-blue', 'text-white', 'border-psm-gold');
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const button = document.getElementById('mobileMenuButton');
    const icon = document.getElementById('mobileMenuIcon');
    const isOpen = !menu.classList.contains('hidden');

    menu.classList.toggle('hidden', isOpen);
    button.setAttribute('aria-expanded', String(!isOpen));
    button.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    icon.classList.toggle('fa-bars', isOpen);
    icon.classList.toggle('fa-xmark', !isOpen);
}

document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', () => {
        const menu = document.getElementById('mobileMenu');
        const button = document.getElementById('mobileMenuButton');
        const icon = document.getElementById('mobileMenuIcon');

        menu.classList.add('hidden');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Abrir menú');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
    });
});

const formatRoles = {
    'FOR-INVP-001': ['estudiante'],
    'FOR-INVP-002': ['organizacion'],
    'FOR-INVP-003': ['organizacion'],
    'FOR-INVP-004': ['jurados'],
    'FOR-INVP-005': ['tutores'],
    'FOR-INVP-006': ['tutores'],
    'FOR-INVP-007': ['estudiante'],
    'FOR-INVP-008': ['estudiante'],
    'FOR-INVP-009': ['estudiante'],
    'FOR-INVP-010': ['tutores'],
    'FOR-INVP-011': ['jurados'],
    'FOR-INVP-012': ['tutores', 'jurados'],
    'FOR-INVP-013': ['tutores'],
    'FOR-INVP-014': ['estudiante'],
    'FOR-INVP-015': ['jurados'],
    'FOR-INVP-016': ['jurados'],
    'FOR-INVP-017': ['jurados'],
    'FOR-INVP-018': ['jurados'],
    'FOR-INVP-019': ['jurados']
};

function filterFormats(role) {
    const cards = document.querySelectorAll('.format-card');
    const filterButtons = document.querySelectorAll('.format-filter-btn');

    cards.forEach(card => {
        const formatCode = card.querySelector('h4')?.textContent.trim();
        const matchesRole = role === 'todos' || formatRoles[formatCode]?.includes(role);
        card.classList.toggle('hidden', !matchesRole);
    });

    filterButtons.forEach(button => {
        const isActive = button.dataset.filter === role;
        button.classList.toggle('bg-psm-blue', isActive);
        button.classList.toggle('text-white', isActive);
        button.classList.toggle('bg-white', !isActive);
        button.classList.toggle('text-gray-600', !isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
}

const scrollBtn = document.getElementById("scrollTopBtn");

window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollBtn.classList.add("visible");
    } else {
        scrollBtn.classList.remove("visible");
    }
};

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}