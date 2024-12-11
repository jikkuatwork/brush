import { initializeChat } from './modules/chat';
import { initializeNavigation } from './modules/navigation';
import { createToolbar } from './modules/ui/toolbar';
import { loadConfig } from './modules/config';

$(document).ready(() => {
    // Load saved configuration
    loadConfig();

    // Initialize toolbar
    const $toolbar = $('#toolbar');
    $toolbar.append(createToolbar());

    // Initialize other modules
    initializeChat();
    initializeNavigation();
});