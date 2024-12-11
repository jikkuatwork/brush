// src/main.js
import { initializeChat } from './modules/chat';
import { initializeNavigation } from './modules/navigation';
import { createToolbar } from './modules/ui/toolbar';
import { loadConfig } from './modules/config';

$(document).ready(() => {
    loadConfig();
    const $toolbar = $('#toolbar');
    $toolbar.append(createToolbar());
    initializeNavigation();
    initializeChat();
});