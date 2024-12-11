import $ from 'jquery';
import { updateConfig } from '../config';

export function createHelpBox() {
    const $helpBox = $(`
        <style>
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .help-animate-in {
                animation: slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes slideUp {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-20px);
                }
            }
            .help-animate-out {
                animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
        </style>
        <div class="help-box absolute inset-x-0 top-[20%] flex items-start justify-center z-10 opacity-0">
            <div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 max-w-md mx-4 relative border border-gray-100">
                <div class="text-center space-y-4">
                    <div class="w-12 h-12 bg-[#FFB800]/10 rounded-full flex items-center justify-center mx-auto">
                        <svg class="w-6 h-6 text-[#FFB800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900">Create Your Icon</h3>
                    <p class="text-gray-600">
                        Simply describe what you want in your icon below. Try adding details about colors,
                        style, and design elements for best results.
                    </p>
                    <div class="pt-2">
                        <button 
                            id="hideHelpBtn" 
                            class="text-sm text-gray-500 hover:text-gray-700 bg-gray-50 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                            Don't show again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `);

    $helpBox.find('#hideHelpBtn').on('click', () => {
        updateConfig('showHelp', false);
        hideHelp($helpBox);
    });

    requestAnimationFrame(() => {
        $helpBox.addClass('help-animate-in');
    });

    return $helpBox;
}

export function hideHelp($helpBox) {
    if (!$helpBox) return;
    
    $helpBox.removeClass('help-animate-in').addClass('help-animate-out');
    
    setTimeout(() => {
        $helpBox.remove();
    }, 400);
}

export function showHelp($container) {
    $('.help-box').remove();
    const $helpBox = createHelpBox();
    $container.prepend($helpBox);
    return $helpBox;
}