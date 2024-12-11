import $ from 'jquery';

export function createSettingsContent() {
    const $content = $(`
        <div class="max-w-4xl mx-auto space-y-6">
            <div class="bg-white rounded-lg p-6 shadow-sm">
                <h2 class="text-lg font-semibold mb-4">Theme</h2>
                <div class="flex gap-4">
                    <button class="flex-1 p-4 rounded-lg border-2 border-blue-500 bg-white flex items-center justify-center gap-2 hover:bg-gray-50" id="lightTheme">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>Light</span>
                    </button>
                    <button class="flex-1 p-4 rounded-lg border-2 border-transparent bg-gray-100 flex items-center justify-center gap-2 hover:bg-gray-200" id="darkTheme">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                        <span>Dark</span>
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-lg p-6 shadow-sm">
                <h2 class="text-lg font-semibold mb-4">Export Settings</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Default Format</label>
                        <select class="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>SVG</option>
                            <option>PNG</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
                        <select class="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>High (2048px)</option>
                            <option>Medium (1024px)</option>
                            <option>Low (512px)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `);

    return $content;
}