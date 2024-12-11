import $ from 'jquery';

// Initialize global app configuration
window.app = window.app || {};
window.app.config = window.app.config || {};

// Load config from localStorage
export function loadConfig() {
    const storedConfig = localStorage.getItem('app_config');
    if (storedConfig) {
        window.app.config = JSON.parse(storedConfig);
    }
}

// Save config to localStorage
export function saveConfig() {
    localStorage.setItem('app_config', JSON.stringify(window.app.config));
}

// Update a specific config value
export function updateConfig(key, value) {
    window.app.config[key] = value;
    saveConfig();
}