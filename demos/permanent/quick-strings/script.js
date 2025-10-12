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

/**
 * Format a `Date` object as a string `YYYY-MM-DDTHH-mm`
 * 
 * @param {Date} date The `Date` object to format
 * @returns The formatted date as a string
 */
function dateToString(date) {
    const YYYY = String(date.getFullYear());
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const DD = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${YYYY}-${MM}-${DD}T${HH}-${mm}`;
}

/** 
 * Create a clickable `<div>` element with `.content` class
 * 
 * @param {string} text - The text content of the `<div>`
 * @returns {HTMLDivElement} The clickable `<div>` element
 */
function createContentButton(text) {
    const div = document.createElement('div');
    div.className = 'content';
    div.textContent = text;
    div.addEventListener('click', async () => {
        const result = await copyToClipboard(div.textContent);
        if (result) {
            div.classList.add('dimmed');
            setTimeout(() => {
                div.classList.remove('dimmed');
            }, 300);
        }
    });
    return div;
}

// ~ ======================================================
// ~ Entry Point
// ~ ======================================================

// ? Run callback when all resources have loaded
window.addEventListener('load', async () => {

    // Add random UUID string to site
    {
        const str = crypto.randomUUID();
        console.log('Random UUID:', str);
        const button = createContentButton(str);
        page.appendChild(button);
    }

    // Add date string to site
    {
        const str = dateToString(new Date());
        console.log('Date string:', str);
        const button = createContentButton(str);
        page.appendChild(button);
    }

    // Show the page element
    page.style.display = '';

});