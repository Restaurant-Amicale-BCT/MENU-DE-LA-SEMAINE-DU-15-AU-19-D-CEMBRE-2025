// --- SCRIPT D'ANIMATION DU MENU ---

/**
 * Gère la transition de l'écran d'introduction vers le contenu principal du menu.
 */
function enterApp() {
    const overlay = document.getElementById('intro-overlay');
    const app = document.getElementById('app-container');
    
    window.scrollTo(0, 0);

    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
        app.style.display = 'block';
        // Force le re-flux pour l'animation CSS
        void app.offsetWidth;
        app.style.opacity = '1';
    }, 600);
}

/**
 * Affiche la section de menu correspondant au jour sélectionné.
 * @param {string} dayId - L'ID de la section du menu à afficher (ex: 'lundi').
 * @param {HTMLElement} btnElement - L'élément bouton cliqué.
 */
function showMenu(dayId, btnElement) {
    document.querySelectorAll('.menu-section').forEach(sec => sec.classList.remove('active-day'));
    document.querySelectorAll('.day-btn').forEach(btn => {
        if(!btn.classList.contains('holiday')) btn.classList.remove('active');
    });
    document.getElementById(dayId).classList.add('active-day');
    btnElement.classList.add('active');
}

// --- SCRIPT DE SIMULATION DU COMPTEUR DE VISITEURS ---

// Les valeurs initiales sont réinitialisées à 0 pour le lancement.
// On ajoute une petite valeur aléatoire au démarrage pour simuler les premières visites.
const STARTING_VISITS = Math.floor(Math.random() * 5) + 1; // Commence entre 1 et 5 visites

/**
 * Formate un nombre en ajoutant des espaces pour les milliers.
 * @param {number} num - Le nombre à formater.
 * @returns {string} Le nombre formaté.
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Génère l'icône SVG pour un appareil donné.
 * @param {string} type - 'pc', 'tablet', ou 'phone'.
 * @returns {string} Le code SVG de l'icône.
 */
function getDeviceIcon(type) {
    const size = "20";
    const color = "var(--primary)";
    
    // PC (Écran d'ordinateur portable)
    if (type === 'pc') {
        return `
            <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="2" y1="20" x2="22" y2="20"></line>
            </svg>`;
    }
    
    // Tablette
    if (type === 'tablet') {
        return `
            <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12" y2="18"></line>
            </svg>`;
    }
    
    // Téléphone (Mobile)
    if (type === 'phone') {
        return `
            <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12" y2="18"></line>
            </svg>`;
    }
    return '';
}

/**
 * Simule le comptage des visites totales et la répartition par type d'appareil.
 */
function simulateCounter() {
    // Utiliser une valeur croissante stockée localement (localStorage) pour simuler une persistance.
    let totalVisits = parseInt(localStorage.getItem('menuTotalVisits')) || STARTING_VISITS;
    
    // Simule une nouvelle visite à chaque chargement de page (dans un environnement réel)
    // Nous incrémentons de 1 pour simuler cette visite actuelle.
    totalVisits += 1;
    localStorage.setItem('menuTotalVisits', totalVisits);

    // Ratios de répartition des appareils (Total = 1.0)
    // Mobile : 60%, PC : 30%, Tablette : 10%
    const mobileRatio = 0.60;
    const pcRatio = 0.30;
    const tabletRatio = 1.0 - mobileRatio - pcRatio; 

    // Calcul des visites par appareil (avec conversion en entier)
    let mobileVisits = Math.floor(totalVisits * mobileRatio);
    let pcVisits = Math.floor(totalVisits * pcRatio);
    let tabletVisits = totalVisits - mobileVisits - pcVisits; // Assure que la somme est exacte

    // Affichage du total
    document.getElementById('total-visits-count').innerHTML = 
        `Total des consultations : <span>${formatNumber(totalVisits)}</span>`;

    // Affichage de la répartition avec les icônes interactives
    const breakdownHtml = `
        <div class="device-item interactive">
            ${getDeviceIcon('pc')} Ordinateurs (PC) : <span>${formatNumber(pcVisits)}</span>
        </div>
        <div class="device-item interactive">
            ${getDeviceIcon('tablet')} Tablettes : <span>${formatNumber(tabletVisits)}</span>
        </div>
        <div class="device-item interactive">
            ${getDeviceIcon('phone')} Téléphones : <span>${formatNumber(mobileVisits)}</span>
        </div>
    `;
    document.getElementById('device-breakdown').innerHTML = breakdownHtml;
}


// Exécuter les fonctions au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Événements de la bannière
    const banner = document.querySelector('.banner');
    if (banner) {
        banner.addEventListener('mouseenter', () => {
            banner.style.transform = 'scale(1.01)';
        });
        banner.addEventListener('mouseleave', () => {
            banner.style.transform = 'scale(1)';
        });
    }
    
    // Lance la simulation du compteur
    simulateCounter();
    
    // Optionnel : Ajout d'un style interactif au CSS pour les icônes
    const style = document.createElement('style');
    style.innerHTML = `
        .device-item.interactive {
            transition: color 0.2s, transform 0.2s;
            cursor: default; /* Indique que c'est une zone d'information */
        }
        .device-item.interactive:hover {
            color: var(--primary); /* Met en évidence le texte au survol */
            transform: scale(1.05);
        }
        .device-item.interactive svg {
            margin-right: 5px;
            transition: stroke 0.2s;
        }
        .device-item.interactive:hover svg {
            stroke: var(--accent); /* Change la couleur de l'icône au survol */
        }
    `;
    document.head.appendChild(style);
});