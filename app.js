$(document).ready(function() {
    const $chatScreen = $('#chatScreen');
    const $moreScreen = $('#moreScreen');
    const $menuBtn = $('#menuBtn');
    const $closeMoreBtn = $('#closeMoreBtn');
    const $messageInput = $('#messageInput');
    const $sendBtn = $('#sendBtn');
    const $messages = $('#messages');

    function showMoreScreen() {
        $moreScreen.removeClass('-translate-x-full');
        $chatScreen.addClass('translate-x-full');
    }

    function hideMoreScreen() {
        $moreScreen.addClass('-translate-x-full');
        $chatScreen.removeClass('translate-x-full');
    }

    function addMessage(text) {
        const $message = $(`
            <div class="flex flex-col max-w-sm">
                <div class="bg-white rounded-lg p-4 shadow">
                    <p class="text-gray-800">${text}</p>
                </div>
                <div class="bg-gray-200 w-32 h-32 mt-2 rounded-lg flex items-center justify-center">
                    <span class="text-gray-500">Logo Preview</span>
                </div>
            </div>
        `);
        $messages.append($message);
        $messages.scrollTop($messages[0].scrollHeight);
    }

    function handleSend() {
        const message = $messageInput.val().trim();
        if (message) {
            addMessage(message);
            $messageInput.val('');
        }
    }

    $menuBtn.on('click', showMoreScreen);
    $closeMoreBtn.on('click', hideMoreScreen);
    $sendBtn.on('click', handleSend);
    
    $messageInput.on('keypress', function(e) {
        if (e.which === 13) {
            handleSend();
        }
    });
});