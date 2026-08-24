// Firebase is initialized in admin.html via CDN (window.db)

// DOM Elements
const loginContainer = document.getElementById('login-container');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const settingsForm = document.getElementById('settings-form');
const saveStatus = document.getElementById('save-status');

// Auth State Management without Firebase Auth
function checkAuthStatus() {
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        loginContainer.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        loadSettings();
    } else {
        loginContainer.classList.remove('hidden');
        adminDashboard.classList.add('hidden');
    }
}

// Controlla all'avvio
checkAuthStatus();

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');
    
    // Password semplificata senza firebase auth
    if (password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        errorMsg.textContent = '';
        checkAuthStatus();
        return;
    } else {
        errorMsg.textContent = 'Password errata!';
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    checkAuthStatus();
});

// Sync Color inputs
const colorFields = ['bg', 'gold', 'text-primary', 'text-secondary'];
colorFields.forEach(field => {
    const colorPicker = document.getElementById(`color-${field}`);
    const textInput = document.getElementById(`color-${field}-text`);
    
    if (colorPicker && textInput) {
        colorPicker.addEventListener('input', (e) => {
            textInput.value = e.target.value;
        });
        textInput.addEventListener('input', (e) => {
            if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                colorPicker.value = e.target.value;
            }
        });
    }
});

// Load Settings from Firestore
async function loadSettings() {
    try {
        const docRef = window.db.collection('config').doc('main');
        const docSnap = await docRef.get();
        
        let data = {};
        if (docSnap.exists) {
            data = docSnap.data();
        } else {
            console.log('No such document, using defaults.');
        }
        
        // Defaults fallbacks matching index.html hardcoded values
        const defaults = {
            texts: {
                subtitle: 'Il mio diciottesimo',
                title: '18',
                tagline: 'Un nuovo capitolo sta per iniziare.',
                date: '24 Settembre 2026',
                time: 'Ore 20:00',
                address: 'Via SP 84, n. 33',
                intro: 'Ci sono momenti che segnano un confine, un passaggio, un nuovo inizio. Questo è il mio momento. Sarei felice di condividere con le persone a me più care una serata indimenticabile, all\'insegna dell\'eleganza e del divertimento.',
                locationName: 'La Villa Esclusiva',
                dresscodeTitle: 'Black Tie Optional',
                dresscodeDesc: 'Abbigliamento elegante e formale, preferibilmente toni scuri o neutri.',
                finale: 'Ci vediamo per festeggiare insieme\nquesto nuovo capitolo.'
            },
            colors: {
                bg: '#030308',
                bgAlt: 'rgba(10, 10, 20, 0.4)',
                gold: '#d4af37',
                textPrimary: '#ffffff',
                textSecondary: '#aaaaaa'
            }
        };

        const t = data.texts || defaults.texts;
        document.getElementById('text-subtitle').value = t.subtitle || defaults.texts.subtitle;
        document.getElementById('text-title').value = t.title || defaults.texts.title;
        document.getElementById('text-tagline').value = t.tagline || defaults.texts.tagline;
        document.getElementById('text-date').value = t.date || defaults.texts.date;
        document.getElementById('text-time').value = t.time || defaults.texts.time;
        document.getElementById('text-countdown').value = t.countdown || '2026-09-24T20:00';
        document.getElementById('text-address').value = t.address || defaults.texts.address;
        document.getElementById('text-intro').value = t.intro || defaults.texts.intro;
        document.getElementById('text-location-name').value = t.locationName || defaults.texts.locationName;
        document.getElementById('text-dresscode-title').value = t.dresscodeTitle || defaults.texts.dresscodeTitle;
        document.getElementById('text-dresscode-desc').value = t.dresscodeDesc || defaults.texts.dresscodeDesc;
        document.getElementById('text-finale').value = t.finale || defaults.texts.finale;
        
        const c = data.colors || defaults.colors;
        document.getElementById('color-bg-text').value = c.bg || defaults.colors.bg;
        document.getElementById('color-bg').value = (c.bg && /^#[0-9A-F]{6}$/i.test(c.bg)) ? c.bg : defaults.colors.bg;
        
        document.getElementById('color-bg-alt').value = c.bgAlt || defaults.colors.bgAlt;
        
        document.getElementById('color-gold-text').value = c.gold || defaults.colors.gold;
        document.getElementById('color-gold').value = (c.gold && /^#[0-9A-F]{6}$/i.test(c.gold)) ? c.gold : defaults.colors.gold;
        
        document.getElementById('color-text-primary-text').value = c.textPrimary || defaults.colors.textPrimary;
        document.getElementById('color-text-primary').value = (c.textPrimary && /^#[0-9A-F]{6}$/i.test(c.textPrimary)) ? c.textPrimary : defaults.colors.textPrimary;
        
        document.getElementById('color-text-secondary-text').value = c.textSecondary || defaults.colors.textSecondary;
        document.getElementById('color-text-secondary').value = (c.textSecondary && /^#[0-9A-F]{6}$/i.test(c.textSecondary)) ? c.textSecondary : defaults.colors.textSecondary;
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

// Save Settings to Firestore
settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('save-btn');
    btn.textContent = 'Salvataggio in corso...';
    btn.disabled = true;
    
    const configData = {
        texts: {
            subtitle: document.getElementById('text-subtitle').value,
            title: document.getElementById('text-title').value,
            tagline: document.getElementById('text-tagline').value,
            date: document.getElementById('text-date').value,
            time: document.getElementById('text-time').value,
            countdown: document.getElementById('text-countdown').value,
            address: document.getElementById('text-address').value,
            intro: document.getElementById('text-intro').value,
            locationName: document.getElementById('text-location-name').value,
            dresscodeTitle: document.getElementById('text-dresscode-title').value,
            dresscodeDesc: document.getElementById('text-dresscode-desc').value,
            finale: document.getElementById('text-finale').value
        },
        colors: {
            bg: document.getElementById('color-bg-text').value || document.getElementById('color-bg').value,
            bgAlt: document.getElementById('color-bg-alt').value,
            gold: document.getElementById('color-gold-text').value || document.getElementById('color-gold').value,
            textPrimary: document.getElementById('color-text-primary-text').value || document.getElementById('color-text-primary').value,
            textSecondary: document.getElementById('color-text-secondary-text').value || document.getElementById('color-text-secondary').value
        }
    };
    
    try {
        const docRef = window.db.collection('config').doc('main');
        await docRef.set(configData);
        
        saveStatus.textContent = 'Impostazioni salvate con successo!';
        saveStatus.className = 'status-msg success';
        setTimeout(() => saveStatus.textContent = '', 3000);
    } catch (error) {
        console.error('Error saving config:', error);
        saveStatus.textContent = 'Errore durante il salvataggio: ' + error.message;
        saveStatus.className = 'status-msg error';
    } finally {
        btn.textContent = 'Salva Impostazioni';
        btn.disabled = false;
    }
});

