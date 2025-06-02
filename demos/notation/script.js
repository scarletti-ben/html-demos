// < ========================================================
// < Imports
// < ========================================================

import {
    tools
} from './tools/mytools.js';

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

// < ========================================================
// < Element Queries
// < =========================================================

const page = document.getElementById('page');
const testButton = document.getElementById('test-button');
const loginButton = document.getElementById('login-button');
const uploadButton = document.getElementById('upload-button');
const contentWindow = document.getElementById('content-window');
const noteText = document.getElementById('note-text');

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

// < ========================================================
// < Entry Point
// < ========================================================

async function main() {

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

    // Add functionality to the test button
    testButton.addEventListener('click', async (event) => {
        let result = await firestore.readCollection(collectionName);
        alert(JSON.stringify(result, null, 2));
    });

    // Add functionality to the login button
    loginButton.addEventListener('click', async (event) => {
        await authentication.login();
    });

    // Add functionality to the upload button
    uploadButton.addEventListener('click', async (event) => {
        // const noteUUID = crypto.randomUUID();
        // const noteTitle = prompt('Enter note title:');
        // const noteContent = prompt('Enter note content:');
        // const noteTags = prompt('Enter note tags (comma separated):').split(',').map(tag => tag.trim());
        // const noteData = {
        //     uuid: noteUUID,
        //     title: noteTitle,
        //     content: noteContent,
        //     tags: noteTags,
        //     created: Date.now(),
        //     modified: Date.now()
        // };
        // await firestore.writeDocument('notes', noteUUID, noteData).then(() => {
        //     console.log('Note written successfully');
        // }).catch((error) => {
        //     console.error('Error writing note:', error);
        // });
        let text = noteText.value;
        alert(`NotImplemented: Uploaded text: ${text}`);
    });

    // let credentials = await authentication.login();
    // console.log(credentials);

}

// < ========================================================
// < Execution
// < ========================================================

main();