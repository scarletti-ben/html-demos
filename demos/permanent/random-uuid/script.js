// < ======================================================
// < Declarations
// < ======================================================



// < ======================================================
// < Element Queries
// < ======================================================

const page = /** @type {HTMLDivElement} */
    (document.getElementById('page'));

// < ======================================================
// < Functions
// < ======================================================

/** 
 * Copy text to clipboard, with error protection
 * 
 * @param {string} text The text to copy
 * @returns {Promise<boolean>} Promise of `true` if successful
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log('Text copied to clipboard:', text);
        return true;
    } catch (error) {
        console.error('Error copying text to clipboard:', error);
        return false;
    }
}

// ~ ======================================================
// ~ Entry Point
// ~ ======================================================

// ? Run callback when all resources have loaded
window.addEventListener('load', async () => {

    // Generate random UUID
    const uuid = crypto.randomUUID();
    console.log('Random UUID:', uuid);

    // Add UUID to site, with event listener
    const div = document.createElement('div');
    div.id = 'content';
    div.textContent = uuid;
    div.addEventListener('click', async () => {
        const result = await copyToClipboard(uuid);
        if (result) {
            div.classList.add('dimmed');
            setTimeout(() => {
                div.classList.remove('dimmed');
            }, 300);
        }
    });
    page.appendChild(div);

    // Show the page element
    page.style.display = '';

});