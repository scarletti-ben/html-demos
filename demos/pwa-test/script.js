// Initialisation function to be called when the DOM has loaded
function init() {
    // Register the service worker if it's supported and not currently active
    if ('serviceWorker' in navigator) {
        if (!navigator.serviceWorker.controller) {
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('/service-worker.js')
                    .then((registration) => {
                        console.log('Service Worker registered with scope: ', registration.scope);
                    })
                    .catch((error) => {
                        console.log('Service Worker registration failed: ', error);
                    });
            });
        } else {
            console.log('Service Worker is already controlling the page.');
        }
    }
}

// Add listener to call init function when the DOM has loaded
document.addEventListener('DOMContentLoaded', init);