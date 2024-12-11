// src/modules/config.js
window.app = window.app || {};
window.app.config = window.app.config || {};

function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('showHelp')) {
        console.log('Resetting config due to showHelp parameter');
        localStorage.removeItem('app_config');
        window.app.config = {};
        window.app.config.showHelp = true;
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, '', newUrl);
        return true;
    }
    return false;
}

export function loadConfig() {
    console.log('Loading config...');
    checkUrlParameters();
    
    const storedConfig = localStorage.getItem('app_config');
    if (storedConfig) {
        try {
            const parsed = JSON.parse(storedConfig);
            window.app.config = { ...window.app.config, ...parsed };
            console.log('Loaded config:', window.app.config);
        } catch (e) {
            console.error('Error loading config:', e);
        }
    } else {
        window.app.config.showHelp = true;
    }
}

export function saveConfig() {
    try {
        localStorage.setItem('app_config', JSON.stringify(window.app.config));
        console.log('Saved config:', window.app.config);
    } catch (e) {
        console.error('Error saving config:', e);
    }
}

export function updateConfig(key, value) {
    window.app.config[key] = value;
    saveConfig();
}

export function getConfig(key, defaultValue = null) {
    return window.app.config[key] ?? defaultValue;
}