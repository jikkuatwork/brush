import $ from 'jquery';
import { createLogoPreview } from './logoPreview';

export async function createMessageElement(text, logoConfig = null, isLoading = false) {
    const $element = $(`
        <div class="max-w-4xl mx-auto">
            <div class="flex flex-col max-w-sm">
                <div class="bg-white rounded-lg p-4 shadow">
                    <p class="text-gray-800">${text}</p>
                </div>
                ${isLoading ? createSkeletonLoader() : ''}
            </div>
        </div>
    `);

    if (!isLoading && logoConfig !== null) {
        const $logoPreview = await createLogoPreview(logoConfig);
        $element.find('.flex-col').append($logoPreview);
    }
    
    return $element;
}

function createSkeletonLoader() {
    return `
        <div class="logo-preview-container relative bg-gray-100 w-32 h-32 mt-2 rounded-lg flex items-center justify-center overflow-hidden">
            <div class="w-24 h-24 rounded-lg bg-gray-200 animate-pulse relative">
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skeleton-shine"></div>
            </div>
        </div>
    `;
}