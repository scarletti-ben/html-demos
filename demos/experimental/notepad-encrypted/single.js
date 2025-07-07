// POSTIT - rename window

// < ========================================================
// < StorageManager Class
// < ========================================================

export class StorageManager {

    static notesKey = 'notepad-encrypyted-2025-03-27-notes';
    static settingsKey = 'notepad-encrypyted-2025-03-27-settings';

    /**
     * Notes object with noteUUID as keys
     * @type {Record<string, { text: string, name: string }>}
     */
    static notes = {}

    static settings = {
        highlightedUUID: null,
        openUUIDS: []
    }

    static _save(storageKey, storageObject) {
        let storageString = JSON.stringify(storageObject);
        localStorage.setItem(storageKey, storageString);
    }

    static _load(storageKey) {
        let storageString = localStorage.getItem(storageKey);
        return storageString ? JSON.parse(storageString) : {}
    }

    static load() {

        // > Load saved settings object, and merge with default
        let settings = StorageManager._load(StorageManager.settingsKey);
        Object.assign(StorageManager.settings, settings);

        // > Load saved notes object, and merge with default
        let notes = StorageManager._load(StorageManager.notesKey);
        Object.assign(StorageManager.notes, notes);

    }

    static save() {

        // > Save settings object to localStorage
        StorageManager._save(StorageManager.settingsKey, StorageManager.settings);

        // > Save notes object to localStorage
        StorageManager._save(StorageManager.notesKey, StorageManager.notes);

    }

}

// < ========================================================
// < Tab Class
// < ========================================================

class Tab {

    /** @type {TabSwitcher} */
    switcher;

    /** @type {string} */
    uuid;

    /** @type {HTMLElement} */
    element;

    /** @type {HTMLElement} */
    notch;

    /** @type {HTMLElement} */
    pane;

    /** 
     * Initialise a Tab instance
     * @param {TabSwitcher} switcher - The TabSwitcher instance this tab belongs to
     * @param {string} uuid - The unique identifier for the tab
     * @param {HTMLElement} element - The HTMLElement for this tab's element
     */
    constructor(switcher, uuid, element) {

        this.switcher = switcher;
        this.uuid = uuid;
        this.element = element;

        // > Create
        this.pane = document.createElement('div');
        this.pane.classList.add('pane', 'hidden');
        this.pane.dataset.uuid = uuid;
        this.pane.appendChild(element);

        // > Create
        this.notch = document.createElement('div');
        this.notch.dataset.uuid = uuid;
        this.notch.classList.add('notch');

        switcher.add(this);

    }

    /** 
     * Add custom listeners to elements this instance is tied to
     */
    _addCustomListeners() { }

    /** 
     * Add default listeners to elements this instance is tied to
     */
    _addDefaultListeners() {
        this.notch.addEventListener('click', (event) => {
            this.switcher.show(this.uuid);
        });
    }

}

// < ========================================================
// < TabSwitcher Class
// < ========================================================

class TabSwitcher {

    /** @type {Tab[]} */
    tabs = [];

    /** @param {string} id */
    constructor(id) {
        this.element = document.getElementById(id);
        this.top = this.element.querySelector('.top-section');
        this.ribbon = this.element.querySelector('.ribbon');
        this.bottom = this.element.querySelector('.bottom-section');
        this.frame = this.element.querySelector('.frame');
        this.header = this.element.querySelector('.header');
        this.window = this.element.querySelector('.window');
        this.footer = this.element.querySelector('.footer');
    }


    /** @param {string} uuid @returns {Tab} */
    tab(uuid) {
        return this.tabs.find(tab => tab.uuid === uuid);
    }

    /** @param {string} uuid */
    show(uuid) {
        for (let tab of this.tabs) {
            toggleHidden(tab.pane, tab.uuid !== uuid);
            toggleHighlighted(tab.notch, tab.uuid === uuid);
        }
    }

    /** 
     * Add a tab to this TabSwitcher instance
     * @param {Tab} tab
     */
    add(tab) {
        this.tabs.push(tab);
        this.window.appendChild(tab.pane);
        this.ribbon.appendChild(tab.notch);
        console.log('added a tab');
    }

    destroy(uuid) {
        let tab = this.tab(uuid);
        this.window.removeChild(tab.pane);
        this.ribbon.removeChild(tab.notch);
        const index = this.tabs.indexOf(tab);
        if (index !== -1) {
            this.tabs.splice(index, 1);
        }
        console.log('destroyed a tab');
    }

    // < ========================================================
    // < Static Methods
    // < ========================================================

    /**
     * Generate tab-switcher HTML structure inside a given container element
     * @param {string} containerID - The ID of the container element
     * @param {string} switcherID - The ID of the new tab-switcher element
     * @returns {string} - The id of the new tab-switcher element
     */
    static inject(containerID, switcherID) {
        let container = document.getElementById(containerID);
        const switcherHTML = `
        <div id="${switcherID}" class="tab-switcher">
            <div class="top-section">
                <div class="ribbon"></div>
            </div>
            <div class="bottom-section">
                <div class="display">
                    <div class="header"></div>
                    <div class="window"></div>
                    <div class="footer"></div>
                </div>
            </div>
        </div>`;
        container.insertAdjacentHTML('beforeend', switcherHTML);
        console.log(`TabSwitcher created switcher element with ID: ${switcherID}`)
        return switcherID;
    }

}

// < ========================================================
// < Note Class (Subclass of Tab)
// < ========================================================

class Note extends Tab {

    /** 
     * Initialise a Note instance, a subclass of Tab, for use with TabSwitcher
     * @param {TabSwitcher} switcher - The TabSwitcher instance this note belongs to
     * @param {string} noteUUID - The unique identifier for the note
     * @param {Object<string, { text: string, name: string }>} noteData - Words
     */
    constructor(switcher, noteUUID, noteData) {

        // > Create
        let element = document.createElement('div');
        let textarea = document.createElement('textarea');
        element.classList.add('note');
        textarea.value = noteData.text;
        element.appendChild(textarea);

        super(switcher, noteUUID, element);

        this.textarea = textarea;
        this.notch.innerText = noteData.name;
        this._addCustomListeners();
    }

    /** 
     * Add custom listeners to elements this instance is tied to
     */
    _addCustomListeners() {

        this.notch.addEventListener('click', (event) => {
            this.switcher.show(this.uuid);
            changeHighlighted(this.uuid);
        });

        this.notch.addEventListener('dblclick', (event) => {
            this.notch.contentEditable = true;
            this.notch.focus();
            selectAll(this.notch);
        });

        this.notch.addEventListener('blur', () => {
            changeName(this.uuid, this.notch.innerText);
            this.notch.contentEditable = false;
        });

        this.textarea.addEventListener('blur', () => {
            changeText(this.uuid, this.textarea.value);
        })

        this.notch.addEventListener('mousedown', (event) => {
            if (event.button === 1) {
                console.log(`Middle click detected for ${this.uuid}`);
                closeNote(this.switcher, this.uuid);
            } else if (event.button === 2) {
                event.preventDefault();
                console.log(`Right click detected for ${this.uuid}`);
            }
        });

        this.notch.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            destroyNote(this.switcher, this.uuid);
        });

    }

}

// < ========================================================
// < Utility Functions
// < ========================================================

/** @param {HTMLElement} element @param {boolean} [force] */
function toggleHidden(element, force) {
    element.classList.toggle('hidden', force);
}

/** @param {HTMLElement} element @param {boolean} [force] */
function toggleHighlighted(element, force) {
    element.classList.toggle('highlighted', force);
}

function selectAll(element) {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

function changeName(noteUUID, newName) {
    StorageManager.notes[noteUUID]['name'] = newName;
    StorageManager.save();
    console.log(`changed name for ${noteUUID}`);
}

function changeText(noteUUID, newText) {
    StorageManager.notes[noteUUID]['text'] = newText;
    StorageManager.save();
    console.log(`changed text for ${noteUUID}`);
}

function changeData(noteUUID, newData) {
    StorageManager.notes[noteUUID] = newData;
    StorageManager.save();
    console.log(`changed data for ${noteUUID}`);
}

function changeHighlighted(noteUUID) {
    StorageManager.settings.highlightedUUID = noteUUID
    StorageManager.save();
    console.log(`changed highlighted to ${noteUUID}`);
}

/** @param {TabSwitcher} switcher */
function newNote(switcher) {
    let noteUUID = crypto.randomUUID();
    let noteData = {
        name: 'name',
        text: noteUUID
    }
    StorageManager.notes[noteUUID] = noteData;
    StorageManager.settings.openUUIDS.push(noteUUID);
    StorageManager.settings.highlightedUUID = noteUUID;
    StorageManager.save();
    let note = new Note(switcher, noteUUID, noteData);
}

/** @param {TabSwitcher} switcher */
function destroyNote(switcher, noteUUID) {

    switcher.destroy(noteUUID);

    delete StorageManager.notes[noteUUID];

    const index = StorageManager.settings.openUUIDS.indexOf(noteUUID);
    if (index !== -1) {
        StorageManager.settings.openUUIDS.splice(index, 1);
    }

    if (StorageManager.settings.highlightedUUID === noteUUID) {
        StorageManager.settings.highlightedUUID = null;
    }
    StorageManager.save();

    console.log('destroyed note');

}

/** @param {TabSwitcher} switcher */
function closeNote(switcher, noteUUID) {

    switcher.destroy(noteUUID);

    const index = StorageManager.settings.openUUIDS.indexOf(noteUUID);
    if (index !== -1) {
        StorageManager.settings.openUUIDS.splice(index, 1);
    }

    if (StorageManager.settings.highlightedUUID === noteUUID) {
        StorageManager.settings.highlightedUUID = null;
    }
    StorageManager.save();

    console.log('closed note');

}

/** @param {TabSwitcher} switcher */
function saveNote(switcher, noteUUID) {
    /** @type {Note} */
    let tab = switcher.tab(noteUUID);
    StorageManager.notes[noteUUID]['name'] = tab.notch.innerText;
    StorageManager.notes[noteUUID]['text'] = tab.textarea.value;
    StorageManager.save();
}

// < ========================================================
// < Initialisation Function
// < ========================================================

/** @param {TabSwitcher} switcher */
function init(switcher, resetting = false) {

    if (resetting) {
        // > Reset
        StorageManager.save();
    }
    else {
        // > Load
        StorageManager.load();
    }

    // > Create 
    let noteUUIDS = [...StorageManager.settings.openUUIDS];
    for (let noteUUID of noteUUIDS) {
        let noteData = StorageManager.notes[noteUUID];
        let note = new Note(switcher, noteUUID, noteData);
    }

    // > Log hidden tabs
    console.log(Object.keys(StorageManager.notes).filter(uuid => !StorageManager.settings.openUUIDS.includes(uuid)));

    // > Show
    let noteUUID = StorageManager.settings.highlightedUUID;
    if (noteUUID) {
        switcher.show(noteUUID);
    }

    // > Hide footer
    toggleHidden(switcher.footer);

}

// < ========================================================
// < Entry Point
// < ========================================================

function main() {

    // > Initialise switcher
    let switcherID = TabSwitcher.inject('page', 'switcher');
    let switcher = new TabSwitcher(switcherID);

    // > Initialise
    init(switcher, false);

    document.addEventListener('keydown', (event) => {
        if (!event.ctrlKey) {
            return
        } else {
            event.preventDefault();
        }
        if (event.key === '1') {
            newNote(switcher);
            alert('new note added')
        }
        if (event.key === '2') {
            let hiddenUUIDS = Object.keys(StorageManager.notes).filter(uuid => !StorageManager.settings.openUUIDS.includes(uuid))
            for (let noteUUID of hiddenUUIDS) {
                let noteData = StorageManager.notes[noteUUID];
                let note = new Note(switcher, noteUUID, noteData);
                StorageManager.settings.openUUIDS.push(noteUUID);
            }
            StorageManager.save();
            alert('showing all hidden notes');
        }
        if (event.key === '3') {
            StorageManager.notes = {}
            StorageManager.settings = {
                highlightedUUID: null,
                openUUIDS: []
            }
            StorageManager.save();
            alert('reset complete')
        }
        if (event.key === '4') {}
        if (event.key === '5') {}
        if (event.key === '6') {}
        if (event.key === '7') {}
        if (event.key === '8') {}
        if (event.key === '9') {}
        if (event.key === 's') {
            let uuid = StorageManager.settings.highlightedUUID;
            saveNote(switcher, uuid);
            alert('saved current note')
        }
    });

}

// < ========================================================
// < Execution
// < ========================================================

main()