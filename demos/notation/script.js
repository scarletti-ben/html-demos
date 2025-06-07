// < ========================================================
// < Imports
// < ========================================================

import {
    tools
} from './tools/my-tools-v1.0.0.js';

import {
    initialisation,
    authentication,
    firestore
} from './tools/firebase-wrapper.js';

import {
    openDB,
    getFromDB,
    storeInDB
} from './tools/idb-functions.js';

import {
    Toast
} from './tools/toaster.js';

// < ========================================================
// < Element Queries
// < =========================================================

const page = document.getElementById('page');
const contentWindow = document.getElementById('content-window');
const errorWindow = document.getElementById('error-window');
const noteContainer = document.getElementById('note-container');
const noteText = noteContainer.querySelector('.note-text');
const noteTitle = noteContainer.querySelector('.note-title');
const noteTags = noteContainer.querySelector('[data-field="tags"]');
const noteActions = noteContainer.querySelector('.note-actions');
const noteUUID = noteContainer.querySelector('[data-field="uuid"]');
const noteDate = noteContainer.querySelector('[data-field="date"]');

// < ========================================================
// < Utility Functions
// < ========================================================

/**
 * Get the `firebaseConfig` object
 * - Reads from IndexedDB if present
 * - Otherwise prompts the user and runs decryption process
 * - Stores `firebaseConfig` to IndexedDB once decrypted
 * @param {string} appName - Name of the app, for IndexedDB
 * @returns {Promise<object>} The `firebaseConfig` object
 */
async function getFirebaseConfig(appName) {

    // Check if appName is provided
    if (!appName) {
        console.error('UserError: appName is a required argument');
        return;
    }

    // Open the IndexedDB and check for stored firebaseConfig
    const idb = await openDB(appName);
    let firebaseConfig = await getFromDB(idb, 'firebaseConfig');

    // Return firebaseConfig if found, otherwise continue
    if (firebaseConfig) {
        console.log('firebaseConfig loaded from IndexedDB');
        return firebaseConfig;
    }

    try {

        // Read objects.json to retrieve encrypted firebaseConfig
        const response = await fetch('./objects.json');
        const repsonseData = await response.json();
        const encryptedObject = repsonseData['firebaseConfig'];

        // Placeholder method to prompt user for password and salt
        let password = prompt('Enter password...');
        let salt = prompt('Enter salt...');

        // Attempt to decrypt the object
        const cryptoKey = await tools.PBKDF2(password, salt);
        const stringObject = await tools.decrypt(encryptedObject, cryptoKey);
        firebaseConfig = JSON.parse(stringObject);

        // Store decrypted firebaseConfig object in indexedDB
        await storeInDB(idb, "firebaseConfig", firebaseConfig);

        // Log if successful
        console.log('firebaseConfig decrypted and saved to IndexedDB');

        // Return the decrypted firebaseConfig object
        return firebaseConfig;

    }
    catch (error) {

        // Log error and return undefined
        console.error(error);
        return undefined;

    }

}

/**
 * Create a div button, with label and callback
 * @param {string} text - The text to display on the button
 * @param {Function} callback - The function to execute when the button is clicked
 * @param {HTMLElement} parent - Optional parent element to append to
 * @returns {HTMLDivElement} The created button div element
 */
function createButton(text, callback, parent) {
    const button = document.createElement('div');
    button.classList.add('button');
    button.textContent = text;
    button.addEventListener('click', callback);
    if (parent) {
        parent.appendChild(button);
    }
    return button;
}

/**
* Adds validation listener to date input that toggles 'invalid' class
* @param {HTMLInputElement} dateElement - The date input element
*/
function addDateValidation(dateElement) {
    dateElement.addEventListener('input', function () {
        if (this.validity.valid && this.value) {
            this.classList.remove('invalid');
        } else {
            this.classList.add('invalid');
        }
    });
}

/**
* Initialise date input to current date and time and add validation
* @param {HTMLInputElement} dateElement - The date input element
*/
function initDateElement(dateElement) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    // dateElement.value = `${year}-${month}-${day}`;
    dateElement.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    addDateValidation(dateElement);
}

async function _uploadNote(uuid, title, text, tags, date) {
    const data = {
        uuid,
        title,
        text,
        tags,
        created: date,
        modified: date
    };

    try {
        firestore.writeDocument('notes', uuid, data);
    }
    catch (error) {
        console.error('uploadNote error:', error);
    }
}

async function safeUpload(uuid, title, text, tags, date) {
    try {
        await firestore.writeDocument('notes', uuid, {
            uuid,
            title,
            text,
            tags,
            created: date,
            modified: date
        });
        return true;
    } catch (error) {
        console.error('safeUpload:', error);
        return false;
    }
}

function getNoteObject() {
    let noteObject = {
        title: noteTitle.value,
        text: noteText.value,
        date: noteDate.value,
        tags: noteTags.value.split(',').map(tag => tag.trim()),
        uuid: noteUUID.value,
    }
    return noteObject;
}

/**
 * Toggle visibility between content / error window
 * @param {boolean} [force] - Force error window on or off
 */
function toggleError(force = null) {
    if (force === true) {
        contentWindow.style.display = 'none';
        errorWindow.style.display = '';
    } else if (force === false) {
        contentWindow.style.display = '';
        errorWindow.style.display = 'none';
    } else {
        if (errorWindow.style.display === 'none') {
            contentWindow.style.display = 'none';
            errorWindow.style.display = '';
        } else {
            contentWindow.style.display = '';
            errorWindow.style.display = 'none';
        }
    }
}

// < ========================================================
// < Entry Point
// < ========================================================

async function main() {

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace') {
            toggleError();
        }
    })

    // Test Toast
    let toast = new Toast();
    toast.show('testing', 5000);

    // Define example name for the app
    const appName = 'test-app';

    // Define example collection to check
    const collectionName = 'notes';

    // Get firebaseConfig from IndexedDB, or prompt user
    const firebaseConfig = await getFirebaseConfig(appName);

    // Initialise Firebase with appName and firebaseConfig
    initialisation.init(appName, firebaseConfig);

    // Add example callbacks
    authentication.onLogin((user) => {
        console.log('User profile picture:', user.photoURL);
    });
    authentication.onLogout(() => {
        console.log('User logged out');
    });

    // Initialise the date input element
    initDateElement(noteDate);

    // Create new uuid
    noteUUID.value = crypto.randomUUID();

    // Add the read button to note actions
    let readButton = createButton('read', async (event) => {
        let result = await firestore.readCollection(collectionName);
        result.sort((a, b) => new Date(b.modified) - new Date(a.modified));
        let message = JSON.stringify(result, null, 2);
        console.log(message);
        alert(message);


    }, noteActions);

    // Add the login button to note actions
    let loginButton = createButton('login', async (event) => {
        await authentication.login();
    }, noteActions);

    // Add the upload button
    let uploadButton = createButton('upload', async (event) => {
        let noteObject = getNoteObject();
        let success = await safeUpload(
            noteObject.uuid,
            noteObject.title,
            noteObject.text,
            noteObject.tags,
            noteObject.date
        );
        alert(`Success: ${success}`);
    }, noteActions);

    // Add the debug button to note actions
    let debugButton = createButton('debug', async (event) => {

        let object = getNoteObject();
        let message = JSON.stringify(object, null, 2);
        console.log(message);
        alert(message);

    }, noteActions);

    // POSTIT
    // let credentials = await authentication.login();
    // console.log(credentials);

}

// < ========================================================
// < Execution
// < ========================================================

main();