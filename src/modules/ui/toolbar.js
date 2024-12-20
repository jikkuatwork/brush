import $ from 'jquery';

export function createToolbar() {
    return $(`
        <style>
            #messageInput::placeholder {
                color: #9CA3AF;
                transition: color 0.2s ease;
            }
            
            #messageInput:disabled::placeholder {
                color: #D1D5DB;
            }

            #messageInput {
                outline: none !important;
                transition: all 0.2s ease;
            }

            #messageInput:focus {
                border-color: #FFB800;
                box-shadow: 0 0 0 2px rgba(255, 184, 0, 0.2);
            }

            #messageInput:disabled {
                background-color: rgba(255, 184, 0, 0.05);
                color: #6B7280;
                border-color: rgba(255, 184, 0, 0.2);
                cursor: not-allowed;
            }

            .focus-ring {
                transition: box-shadow 0.15s ease-in-out;
            }

            #toolbarButton:disabled {
                background-color: rgba(255, 184, 0, 0.05);
                color: #9CA3AF;
                cursor: not-allowed;
            }

            #sendBtn {
                transition: all 0.2s ease;
            }

            #sendBtn:disabled {
                background-color: rgba(255, 184, 0, 0.3);
                cursor: not-allowed;
                transform: scale(0.95);
                opacity: 0.5;
            }

            .settings-mode #sendBtn {
                display: none !important;
            }

            #sendBtn svg {
                transition: opacity 0.2s ease;
            }

            #sendBtn:disabled svg {
                opacity: 0.5;
            }

            .sending #sendBtn {
                position: relative;
                overflow: hidden;
            }

            .sending #sendBtn::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 200%;
                height: 100%;
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255, 255, 255, 0.2),
                    transparent
                );
                animation: loading 1.5s infinite;
            }

            @keyframes loading {
                0% {
                    transform: translateX(-100%);
                }
                100% {
                    transform: translateX(100%);
                }
            }
        </style>
        <div class="border-t bg-white p-4 pb-8">
            <div class="flex items-center gap-2 max-w-4xl mx-auto">
                <button id="toolbarButton" class="flex-none p-2 bg-gray-100 hover:bg-gray-200 rounded-full relative">
                    <div id="menuIcon" class="transition-transform duration-300">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </div>
                    <div id="closeIcon" class="absolute inset-0 p-2 transition-transform duration-300 scale-0">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                </button>
                <div id="inputArea" class="flex-1 relative transition-opacity duration-300">
                    <input 
                        type="text" 
                        id="messageInput" 
                        class="w-full border border-gray-300 rounded-full px-4 py-2 focus-ring transition-all duration-200"
                        placeholder="Describe your logo...">
                </div>
                <button id="sendBtn" disabled class="flex-none p-2 bg-[#FFB800] text-white rounded-full hover:bg-[#E6A600] active:bg-[#CC9500] transition-all duration-200">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18l9-2zm0 0v-8"></path>
                    </svg>
                </button>
            </div>
        </div>
    `);
}

export function setToolbarState(isGenerating) {
    const $messageInput = $('#messageInput');
    const $sendBtn = $('#sendBtn');
    const $toolbarButton = $('#toolbarButton');
    
    $messageInput.prop('disabled', isGenerating);
    $toolbarButton.prop('disabled', isGenerating);
    
    if (!isGenerating) {
        updateSendButtonState();
    } else {
        $sendBtn.prop('disabled', true);
        $sendBtn.closest('.flex').addClass('sending');
    }
}

export function updateSendButtonState() {
    const $messageInput = $('#messageInput');
    const $sendBtn = $('#sendBtn');
    const isEmpty = !$messageInput.val().trim();
    
    $sendBtn.prop('disabled', isEmpty);
    $sendBtn.closest('.flex').removeClass('sending');
}

export function initializeToolbar() {
    const $messageInput = $('#messageInput');
    
    $messageInput.on('input', function() {
        updateSendButtonState();
    });
    
    updateSendButtonState();
}