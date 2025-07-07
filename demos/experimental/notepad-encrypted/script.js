// < ========================================================
// < Imports
// < ========================================================

import { StorageManager } from "./storage-manager.js";
import { TabSwitcher, Tab } from "./tab-switcher.js";

// POSTIT - Only log changes if value changes

// < ========================================================
// < Functionality
// < ========================================================

let element = document.createElement('div');
let textarea = document.createElement('textarea');
element.classList.add('note');
textarea.value = 'yee';
element.appendChild(textarea);

class Note extends Tab {

    /** @type {TabSwitcher} */
    switcher;

    /** @type {string} */
    uuid;

    /** @type {HTMLElement} */
    element;

    /** @type {HTMLElement} */
    textarea;

    /** @type {HTMLElement} */
    notch;

    /** @type {HTMLElement} */
    pane;

    /** 
     * Initialise a Note instance, a subclass of Tab
     * @param {TabSwitcher} switcher - The TabSwitcher instance this note belongs to
     * @param {string} uuid - The unique identifier for the note
     * @param {Record<string, { text: string, name: string }>} data
     */
    constructor(switcher, uuid, data) {

        // // > Create
        // let element = document.createElement('div');
        // let textarea = document.createElement('textarea');
        // element.classList.add('note');
        // textarea.value = data.text;
        // element.appendChild(textarea);

        super(switcher, uuid, element);

        console.log(this)


        this.textarea = textarea;
        // this._addCustomListeners();

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

        this.notch.addEventListener('blur', () => {
            changeName(this.uuid, this.notch.innerText);
            this.notch.contentEditable = false;
        });

        this.textarea.addEventListener('blur', () => {
            changeText(this.uuid, this.textarea.value);
        })

    }

}

// < ========================================================
// < Functionality
// < ========================================================

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

// < ========================================================
// < Entry Point
// < ========================================================

function main() {

    let switcherID = TabSwitcher.inject('page', 'switcher');
    let switcher = new TabSwitcher(switcherID);

    StorageManager.load();

    let identifiers = [...StorageManager.settings.openUUIDS];
    if (identifiers.length > 0) {
        for (let noteUUID of identifiers) {
            let noteData = StorageManager.notes[noteUUID];
            let note = new Note(switcher, noteUUID, noteData);
            note._addCustomListeners();

            let settings = StorageManager.settings;
            if (!settings.openUUIDS.includes(noteUUID)) {
                settings.openUUIDS.push(noteUUID)
            }

        }
    }

    let uuid = StorageManager.settings.highlightedUUID;
    if (uuid) {
        switcher.show(uuid);
    }

    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
        }
    })

    document.addEventListener('mousedown', (event) => {
        if (event.button === 1) {
            const notch = event.target.closest('.notch');
            console.log(notch);
        }
    })


}

// < ========================================================
// < Execution
// < ========================================================

main();