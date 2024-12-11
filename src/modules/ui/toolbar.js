import $ from 'jquery';

export function createToolbar() {
    return $(`
        <style>
            #messageInput::placeholder {
                color: #9CA3AF;
            }
            #messageInput:focus {
                border-color: #FFB800;
                box-shadow: 0 0 0 2px rgba(255, 184, 0, 0.2);
            }
            #messageInput {
                outline: none !important;
            }
            .focus-ring {
                transition: box-shadow 0.15s ease-in-out;
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
                <button id="sendBtn" class="flex-none p-2 bg-[#FFB800] text-white rounded-full hover:bg-[#E6A600] active:bg-[#CC9500] transition-colors duration-200">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                </button>
            </div>
        </div>
    `);
}