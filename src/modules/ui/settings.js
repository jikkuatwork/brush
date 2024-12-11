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
            .github-link {
                transition: all 0.2s ease;
            }
            .github-link:hover {
                transform: translateY(-2px);
            }
            .github-link:hover svg {
                filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
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
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-sm text-gray-500">Version 0.2</span>
                    <a href="https://github.com/jikkuatwork/brush" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="github-link inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 font-medium">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                    </a>
                </div>

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
                            href="https://jikkujose.in/startups/2024/12/11/99.html"
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