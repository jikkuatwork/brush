import $ from 'jquery';
import { createMessageElement } from './ui/messageElement';
import { generateLogoConfig } from './api/openai';
import { createLogoPreview } from './ui/logoPreview';

export function initializeChat() {
    const $messageInput = $('#messageInput');
    const $sendBtn = $('#sendBtn');
    const $messages = $('#messages');
    
    let isGenerating = false;

    async function handleSend() {
        const message = $messageInput.val().trim();
        if (message && !isGenerating) {
            try {
                // Set loading state
                isGenerating = true;
                $messageInput.prop('disabled', true);
                $sendBtn.prop('disabled', true).addClass('opacity-50');
                
                // Create message element with loading state
                const $message = await createMessageElement(message, null, true);
                $messages.append($message);
                $messages.scrollTop($messages[0].scrollHeight);
                
                // Generate logo configuration using OpenAI
                const logoConfig = await generateLogoConfig(message);
                
                // Update message element with the logo
                const $logoPreview = await createLogoPreview(logoConfig);
                $message.find('.logo-preview-container').replaceWith($logoPreview);
                
                // Clear input
                $messageInput.val('');
            } catch (error) {
                // Show error in UI
                const errorMessage = error.message || 'Failed to generate logo';
                const $errorElement = $(`
                    <div class="max-w-4xl mx-auto">
                        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            <span class="block sm:inline">${errorMessage}</span>
                            ${error.message.includes('API key') ? `
                                <span class="block mt-2 text-sm">
                                    Please add your OpenAI API key in the settings menu.
                                </span>
                            ` : ''}
                        </div>
                    </div>
                `);
                $messages.append($errorElement);
                $messages.scrollTop($messages[0].scrollHeight);
            } finally {
                // Reset loading state
                isGenerating = false;
                $messageInput.prop('disabled', false);
                $sendBtn.prop('disabled', false).removeClass('opacity-50');
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