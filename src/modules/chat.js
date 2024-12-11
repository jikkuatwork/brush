// src/modules/chat.js
import $ from 'jquery';
import { createMessageElement } from './ui/messageElement';
import { generateLogoConfig } from './api/api';
import { createLogoPreview } from './ui/logoPreview';
import { showHelp, hideHelp } from './ui/helpBox';
import { getConfig } from './config';

export function initializeChat() {
    console.log('Initializing chat...');
    const $messageInput = $('#messageInput');
    const $sendBtn = $('#sendBtn');
    const $messages = $('#messages');
    let isGenerating = false;
    let $currentHelp = null;

    // Initialize help after a short delay to ensure DOM is ready
    setTimeout(() => {
        console.log('Checking help status:', getConfig('showHelp'));
        if (getConfig('showHelp') !== false) {
            $currentHelp = showHelp($messages);
        }
    }, 300);

    async function handleSend() {
        const message = $messageInput.val().trim();
        if (message && !isGenerating) {
            try {
                if ($currentHelp) {
                    hideHelp($currentHelp);
                    $currentHelp = null;
                }

                isGenerating = true;
                $sendBtn.addClass('opacity-50');
                
                const $message = await createMessageElement(message, null, true);
                $messages.append($message);
                $messages.scrollTop($messages[0].scrollHeight);
                
                const logoConfig = await generateLogoConfig(message);
                const $logoPreview = await createLogoPreview(logoConfig);
                $message.find('.logo-preview-container').replaceWith($logoPreview);
                
                $messageInput.val('');
            } catch (error) {
                const errorMessage = error.message || 'Failed to generate logo';
                const $errorElement = $(`
                    <div class="max-w-4xl mx-auto">
                        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            <span class="block sm:inline">${errorMessage}</span>
                        </div>
                    </div>
                `);
                $messages.append($errorElement);
                $messages.scrollTop($messages[0].scrollHeight);
            } finally {
                isGenerating = false;
                $sendBtn.removeClass('opacity-50');
            }
        }
    }

    $sendBtn.on('click', handleSend);
    
    $messageInput.on('keypress', function(e) {
        if (e.which === 13 && !isGenerating) {
            handleSend();
        }
    });
}