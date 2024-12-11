import $ from 'jquery';
import { createSettingsContent } from './ui/settings';

export function initializeNavigation() {
    const $chatScreen = $('#chatScreen');
    const $moreScreen = $('#moreScreen');
    const $toolbarButton = $('#toolbarButton');
    const $menuIcon = $('#menuIcon');
    const $closeIcon = $('#closeIcon');
    const $inputArea = $('#inputArea');
    const $sendBtn = $('#sendBtn');
    const $moreContent = $('#moreContent');

    // Initialize settings content
    $moreContent.append(createSettingsContent());

    function showMoreScreen() {
        $moreScreen.removeClass('-translate-x-full');
        $chatScreen.addClass('translate-x-full');
        $menuIcon.addClass('scale-0');
        $closeIcon.removeClass('scale-0');
        $inputArea.addClass('opacity-0 pointer-events-none');
        $sendBtn.addClass('opacity-0 pointer-events-none');
    }

    function hideMoreScreen() {
        $moreScreen.addClass('-translate-x-full');
        $chatScreen.removeClass('translate-x-full');
        $menuIcon.removeClass('scale-0');
        $closeIcon.addClass('scale-0');
        $inputArea.removeClass('opacity-0 pointer-events-none');
        $sendBtn.removeClass('opacity-0 pointer-events-none');
    }

    $toolbarButton.on('click', function() {
        if ($moreScreen.hasClass('-translate-x-full')) {
            showMoreScreen();
        } else {
            hideMoreScreen();
        }
    });
}