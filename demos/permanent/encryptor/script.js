// < ========================================================
// < Imports
// < ========================================================

import { tools } from './mytools.js';

// < ========================================================
// < Variables, Constants and Declarations
// < ========================================================

const githubLink = "https://github.com/scarletti-ben/html-demos/tree/main/demos/permanent/encryptor";

// < ========================================================
// < HTMLElement Queries
// < =========================================================

const page = document.getElementById('page');
const textInput = document.getElementById('text-input');
const passwordInput = document.getElementById('password-input');
const saltInput = document.getElementById('salt-input');
const encryptButton = document.getElementById('encrypt-button');
const outputContainer = document.getElementById('output-container');
const outputText = document.getElementById('output-text');
const copyButton = document.getElementById('copy-button');
const githubButton = document.getElementById('github-icon');

// < ========================================================
// < Functionality
// < ========================================================

/** 
 * Hide outputContainer element, and clear text
 * @returns {void}
 */
function hideOutput() {

    // Clear text content
    outputText.textContent = '';

    // Hide the output container element
    outputContainer.classList.add('hidden');

}

/** 
 * Copy text from the outputText element to user clipboard
 * @returns {void}
 */
async function copyToClipboard() {

    try {

        // Attempt to write text to clipboard
        await navigator.clipboard.writeText(outputText.textContent);

        // Flash green on success
        const originalColor = copyButton.style.backgroundColor;
        copyButton.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            copyButton.style.backgroundColor = originalColor;
        }, 1000);

    } catch (error) {

        // Log the error
        console.error('Failed to copy text: ', error);

    }

}

/** 
 * Encrypt text via PBKDF2
 * - Reads text / password / salt inputs
 * - Generates cryptographic key using PBKDF2
 * - Uses cryptographic key to encrypt text and return
 * - Output text is a comma-separated Base64-encoded string
 * @returns {void}
 */
async function encryptText() {

    // Get text values from HTML elements
    const text = textInput.value.trim();
    const password = passwordInput.value;
    const salt = saltInput.value;

    // Show the output container
    outputContainer.classList.remove('hidden');

    if (!text | !password | !password) {

        // Update output text and return
        outputText.textContent = 'Error: Please ensure none of the inputs are empty';
        return;

    }

    try {

        // Generate cryptographic key using PBKDF2
        let cryptoKey = await tools.PBKDF2(password, salt);

        // Use cryptographic key to encrypt text
        let output = await tools.encrypt(text, cryptoKey);

        // Update output text
        outputText.textContent = output;

    } catch (error) {

        // Update output text
        outputText.textContent = `Error: ${error.message}`;

        // Log the error
        console.error('Encryption error:', error);

    }

}

// < ========================================================
// < Event Listeners
// < ========================================================

// Add functionality to the encrypt button
encryptButton.addEventListener('click', encryptText);

// Add functionality to the copy button
copyButton.addEventListener('click', copyToClipboard);

// Add functionality to the GitHub button
githubButton.addEventListener('click', () => {
    window.open(githubLink, '_blank', '');
});

// Hide output when inputs change
textInput.addEventListener('input', hideOutput);
passwordInput.addEventListener('input', hideOutput);
saltInput.addEventListener('input', hideOutput);

// < ========================================================
// < Entry Point
// < ========================================================

/** 
 * Entry point to run any requrired initialisation functions
 * @returns {void}
 */
function main() {

    hideOutput();

}

// < ========================================================
// < Execution
// < ========================================================

main();