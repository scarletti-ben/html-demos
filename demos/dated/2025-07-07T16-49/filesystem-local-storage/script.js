// script v1.0.0 iife [modified]
// < ========================================================
// < Imports
// < ========================================================

import { loadSplit } from './load-split.js';

// < ========================================================
// < Type Definitions
// < ========================================================

/**
 * Represents a file with its name and content
 * @typedef {Object} FileData
 * @property {string} uuid - The file uuid string
 * @property {string} name - The filename including extension
 * @property {string} content - The file's text content
 */

// < ========================================================
// < Settings and Declarations
// < ========================================================

/**
 * Application identifier used as localStorage key
 * @type {string}
 */
const APP_NAME = '2025-07-07T16-49';

/**
 * Number for the time between single and double click
 * @type {number}
 */
const DOUBLE_CLICK_THRESHOLD = 250;

/**
 * Mapping for Font Awesome icon class strings
 * @type {Object.<string, string>}
 */
const iconMapping = {
    js: 'fa-brands fa-js',
    py: 'fa-brands fa-python',
    // html: 'fa-brands fa-html5',
    html: 'fa-solid fa-code',
    css: 'fa-brands fa-css',
    md: 'fa-brands fa-markdown',
    json: 'fa-solid fa-file-code',
    txt: 'fa-solid fa-file-lines',
    code: 'fa-solid fa-file-code',
    gitignore: 'fa-solid fa-eye-slash',
    license: 'fa-solid fa-scale-balanced',
    todo: 'fa-solid fa-list',
    '': 'fa-solid fa-plus'
};

/**
 * Default files to create when no saved files exist
 * @type {FileData[]}
 */
const defaultFiles = [
    { uuid: '01', name: '.gitignore', content: '' },
    { uuid: '02', name: 'build.py', content: '' },
    { uuid: '03', name: 'data.json', content: '' },
    { uuid: '04', name: 'index.html', content: 'TEST' },
    { uuid: '05', name: 'LICENSE', content: '' },
    { uuid: '06', name: 'notes.txt', content: '' },
    { uuid: '07', name: 'README.md', content: '' },
    { uuid: '08', name: 'script.js', content: '' },
    { uuid: '09', name: 'style.css', content: '' },
    { uuid: '10', name: 'TODO', content: '' }
];

/**
 * Array containing file data objects
 * @type {FileData[]}
 * @global
 * @see {@link loadFiles} Initialises variable
 */
let fileArray;

// < ========================================================
// < Element Queries
// < =========================================================

/** @type {HTMLDivElement} */
const pageElement = document.getElementById('page');

/** @type {HTMLElement} */
const fileNavigator = document.getElementById('file-navigator');

/** @type {HTMLElement} */
const fileViewer = document.getElementById('file-viewer');

/** @type {HTMLTextAreaElement} */
const textArea = document.getElementById('file-content');

/** @type {HTMLDivElement} */
const newButton = document.getElementById('new-button');

/** @type {HTMLDivElement} */
const deleteButton = document.getElementById('delete-button');

/** @type {HTMLDivElement} */
const resetButton = document.getElementById('reset-button');

// < ========================================================
// < Local Storage Functions
// < ========================================================

/**
 * Load files data objects into `fileArray` from local storage
 * - Uses `defaultData` if no data in local storage
 * - Assigns a value to the global `fileArray` variable
 * @modifies {@link fileArray} - Global array of file data
 * @returns {void}
 */
function loadFiles() {
    const data = localStorage.getItem(APP_NAME);
    fileArray = data ? JSON.parse(data) : [...defaultFiles];
}

/**
 * Save file array to localStorage
 */
function updateStorage() {
    try {
        const value = JSON.stringify(fileArray);
        localStorage.setItem(APP_NAME, value);
        console.log('Local storage updated successfully');
    } catch (error) {
        console.error('Failed to save files to localStorage:', error);
    }
}

/**
 * Save file data to file array
 * - Does not update local storage
 */
function updateData() {

    const selected = getSelected();
    if (!selected) {
        console.error('No file currently selected');
        return;
    }

    const file = findFileByUUID(selected.dataset.uuid);
    if (!file) {
        console.error('File title not found:', selected.title);
        return;
    }

    file.content = textArea.value;

}

// < ========================================================
// < Utility Functions
// < ========================================================

/**
* Get the current date and time as an ISO 8601 string (YYYY-MM-DDTHH:mm:ss.sssZ)
* @param {boolean} [short=true] - If true, returns short format (YYYY-MM-DD)
* @returns {string} The current date and time in ISO 8601 format
*/
function getDate(short = true) {
    const date = new Date();
    const string = date.toISOString();
    return short ? string.split('T')[0] : string;
}

/**
 * Extract file extension from a filename
 * @param {string} filename - Filename including extension
 * @returns {string} The file extension, or empty string
 */
function getExtension(filename) {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop() : '';
}

function getIconClasses(key) {
    if (!Object.keys(iconMapping).includes(key)) {
        key = '';
    }
    return iconMapping[key];
}

/**
 * Create a Font Awesome icon element using the given key
 * @param {string} extension - The string key for the icon
 * @returns {HTMLElement} The created icon element
 */
function createIcon(key) {
    const icon = document.createElement('i');
    const classes = getIconClasses(key);
    classes.split(' ').forEach(className => {
        icon.classList.add(className);
    });
    return icon;
}

/**
 * Find a file by uuid in the file array
 * @param {string} uuid - The uuid of the file to find
 * @returns {FileData|undefined} The file data object, or undefined
 */
function findFileByUUID(uuid) {
    return fileArray.find(file => file.uuid === uuid);
}

/**
 * Find child of navigator with a given data-uuid attribute
 * @param {string} uuid - The UUID to search for
 * @returns {HTMLElement|null} The matching element, or null
 */
function findElementByUUID(uuid) {
    return fileNavigator.querySelector(`[data-uuid="${uuid}"]`);
}

// < ========================================================
// < Element Selection Functions
// < ========================================================

/**
 * Get the currently selected file element
 * @returns {HTMLDivElement|null} Currently selected element, or null
 */
function getSelected() {
    return fileNavigator.querySelector('.file-button.selected');
}

/**
 * Remove the selected class from the currently selected file element
 */
function clearSelected() {
    const selected = getSelected();
    if (selected) {
        selected.classList.remove('selected');
    }
}

/**
 * Add .selected class to a given element
 * @param {HTMLDivElement} element - The element to select
 */
function addSelected(element) {
    element.classList.add('selected');
}

// < ========================================================
// < File Display Functions
// < ========================================================

/**
 * Display the content of a file in the text area
 * - Will set user focus to file content text area
 * @param {FileData} fileData - The file data object to display
 */
function displayFile(fileData) {
    textArea.value = fileData.content;
    textArea.focus();
}

// < ========================================================
// < Event Handlers
// < ========================================================

/**
 * Handle clicking on a button in the navigator
 * @param {HTMLDivElement} element - The clicked file element
 */
function handleClick(element) {

    let selected = getSelected();
    if (selected === element) return;

    console.log(`Switching to ${element.title}`);

    clearSelected();
    addSelected(element);

    const file = findFileByUUID(element.dataset.uuid);
    if (file) {
        displayFile(file);
    } else {
        console.error('File not found:', element.title);
    }

}

// < ========================================================
// < Navigator Button Functions
// < ========================================================

/**
* Create a clickable element for the file navigator
* @param {FileData} fileData - The file data object
* @returns {HTMLDivElement} The created element
*/
function createNavButton(fileData) {
    const button = document.createElement('div');
    button.classList.add('file-button');
    button.dataset.uuid = fileData.uuid;
    button.title = fileData.name;
    button.tabIndex = 0;

    let key;
    if (fileData.name.toLowerCase() === 'license') {
        key = 'license';
    } else if (fileData.name.toLowerCase() === 'todo') {
        key = 'todo';
    } else {
        key = getExtension(fileData.name);
    };
    const icon = createIcon(key);
    button.appendChild(icon);

    const span = document.createElement('span');
    span.textContent = fileData.name;
    span.addEventListener('blur', () => {
        span.contentEditable = 'false';
        fileData.name = span.textContent.trim();
        const extension = getExtension(fileData.name);
        updateIcon(icon, extension);
        updateStorage();
    });
    span.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            span.blur();
        }
    });
    button.appendChild(span);

    let clickCount = 0;
    let clickTimeout;
    button.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 1) {
            clickTimeout = setTimeout(() => {
                handleClick(button);
                clickCount = 0;
            }, DOUBLE_CLICK_THRESHOLD);
        } else if (clickCount === 2) {
            clearTimeout(clickTimeout);
            clickCount = 0;
            handleClick(button);
            span.contentEditable = 'true';
            span.focus();
            const range = document.createRange();
            range.selectNodeContents(span);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });

    return button;
}

/** 
 * Update a given icon
 * - Clears current class names
 * @param {HTMLElement} element
 */
function updateIcon(icon, key) {
    const classes = getIconClasses(key);
    classes.split(' ').forEach(className => {
        icon.classList.add(className);
    });
    return icon;
}

// < ========================================================
// < Initialisation Functions
// < ========================================================

/**
 * Create and append file elements to the file navigator
 */
function populateNavigator() {

    fileArray.forEach(fileData => {
        const element = createNavButton(fileData);
        fileNavigator.appendChild(element);
    });

}

/**
 * Set up event listeners for the site
 */
function setupListeners() {

    // Important: The `blur` event fires before `click`
    textArea.addEventListener('blur', () => {
        console.log('File content text area blurred');
        updateData();
        updateStorage();
    });

    window.addEventListener('beforeunload', () => {
        console.log('Site closing');
        updateData();
        updateStorage();
    });

    window.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('Site hidden');
            updateData();
            updateStorage();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Delete') {
            const hovered = fileNavigator.querySelector('.file-button:hover');
            console.log(hovered);
            if (hovered) {
                deleteFileByUUID(hovered.dataset.uuid);
            }
        }
    });

    newButton.addEventListener('click', () => {
        let date = getDate(true);
        newFile(`${date}.txt`, '');
    });

    deleteButton.addEventListener('click', () => {
        let fileButton = getSelected();
        deleteFileByButton(fileButton);
    });

    resetButton.addEventListener('click', () => {
        if (!confirm(`Are you sure you want to reset all files?`)) return;
        localStorage.removeItem(APP_NAME);
        fileArray = [...defaultFiles];
        updateStorage();
        setTimeout(() => {
            location.href = location.href.split('?')[0] + '?cachebust=' + Date.now();
        }, 200);
    })

}

/**
 * Select and display the first file if any files exist
 */
function selectFirstFile() {
    const element = fileNavigator.querySelector('.file-button');
    if (element) {
        handleClick(element);
    }
}

// < ========================================================
// < File Creation and Deletion
// < ========================================================

/** 
 * 
 * @param {string} name
 * @param {string} content
 * @returns {void}
 */
function newFile(name, content = '') {

    const uuid = crypto.randomUUID();
    fileArray.push({ uuid, name, content });

    updateStorage();

    const button = createNavButton({ uuid, name, content });
    fileNavigator.appendChild(button);
    button.click();

}

/** 
 * 
 * @param {HTMLElement} element - The div button element for the file
 * @returns {void}
 */
function deleteFileByButton(element) {

    if (!confirm(`Are you sure you want to delete ${element.title}?`)) return;
    const uuid = element.dataset.uuid;
    element.remove();

    const index = fileArray.findIndex(f => f.uuid === uuid);
    fileArray.splice(index, 1);

    updateStorage();

    const selected = getSelected();
    if (!selected) {
        selectFirstFile();
    }

}

/** 
 * 
 * @param {string} uuid
 * @returns {void}
 */
function deleteFileByUUID(uuid) {
    const element = findElementByUUID(uuid);
    return deleteFileByButton(element);
}

// >> =======================================================
// >> Entry Point
// >> =======================================================

/**
 * Entry point for the application (IIFE)
 */
(async () => {

    const Split = await loadSplit();
    Split(['#file-navigator', '#file-viewer'], {
        minSize: 160,
        gutterSize: 16,
        sizes: [20, 80],
    });

    loadFiles();
    populateNavigator();
    setupListeners();
    selectFirstFile();

    // Show the page
    pageElement.style = '';

})();