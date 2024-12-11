import $ from "jquery"

export function createSettingsContent() {
  const $content = $(`
        <style>
            @keyframes spinAndScale {
                0% { transform: scale(1.5) rotate(0deg); }
                50% { transform: scale(1.8) rotate(180deg); }
                100% { transform: scale(1.5) rotate(360deg); }
            }
            .spin-animation {
                animation: spinAndScale 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            .logo-hover {
                transition: transform 0.2s ease;
            }
            .logo-hover:hover {
                transform: scale(1.6);
            }
        </style>
        <div class="max-w-4xl mx-auto space-y-6 p-6">
            <div class="flex flex-col items-center justify-center">
                <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg mb-6 overflow-hidden flex items-center justify-center cursor-pointer hover:shadow-xl transition-shadow duration-300" id="logoContainer">
                    <div class="w-full h-full transform scale-150 logo-hover" id="logoWrapper">
                        <img src="/meta/logo.svg" alt="Brush Logo" class="w-full h-full object-cover" />
                    </div>
                </div>

                <h1 class="text-2xl font-bold mb-2">Brush</h1>
                <span class="text-sm text-gray-500 mb-4">Version 0.2</span>

                <div class="prose prose-sm text-gray-600 max-w-md text-center mb-6">
                    <p class="font-medium text-gray-700">
                        Create beautiful icons for your apps using AI. Simply describe what you want,
                        and watch as Brush generates the perfect icon with thoughtfully chosen colors
                        and shapes.
                    </p>
                </div>

                <div class="prose prose-sm text-gray-600 max-w-md text-center mb-8">
                    <p class="mb-4">
                        This app is part of <a
                            href="https://99app.toolbomber.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-blue-500 hover:text-blue-600 font-medium">
                            99App
                        </a> Challenge: where we go from idea to deployed app in just 99 minutes using the best AI tools available.
                    </p>

                    <p>Built by <a
                        href="https://twitter.com/jikkujose"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-500 hover:text-blue-600 font-medium">
                        @jikkujose
                    </a></p>
                </div>
            </div>
        </div>
    `)

  let clickCount = 0
  let lastClickTime = 0
  const clickCooldown = 1000

  $content.find("#logoContainer").on("click", function () {
    const currentTime = Date.now()
    if (currentTime - lastClickTime < clickCooldown) return

    lastClickTime = currentTime
    clickCount++

    const $logo = $(this).find("#logoWrapper")
    $logo.removeClass("spin-animation").width()
    $logo.addClass("spin-animation")

    if (clickCount === 5) {
      const colors = [
        "from-red-500 to-yellow-500",
        "from-green-500 to-blue-500",
        "from-purple-500 to-pink-500",
      ]
      const currentGradient = colors[Math.floor(Math.random() * colors.length)]
      $(this)
        .removeClass("from-blue-500 to-purple-600")
        .addClass(currentGradient)
      clickCount = 0
    }
  })

  return $content
}
