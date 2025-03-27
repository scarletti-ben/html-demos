// < ========================================================
// < Imports
// < ========================================================

import { StorageManager } from "./storage-manager.js";
import { TabSwitcher } from "./tab-switcher.js";

// < ========================================================
// < Functionality
// < ========================================================

/** @param {TabSwitcher} switcher */
function createNote(switcher) {

    // > Create
    let noteUUID = crypto.randomUUID();
    let noteName = '';
    let noteText = '';
    let noteData = {
        name: noteName,
        text: noteText
    }
    StorageManager.notes[noteUUID] = noteData;
    StorageManager.save();

    // > Create
    let noteElement = document.createElement('div');
    noteElement.classList.add('note');
    let textarea = document.createElement('textarea');
    textarea.value = '';
    noteElement.appendChild(textarea);

    // > Create tab instance on switcher
    let tab = switcher.add(noteUUID, noteName, noteElement);

    // > Add listeners to the note textarea
    textarea.addEventListener('blur', () => {
        StorageManager.notes[noteUUID]['text'] = textarea.value;
        StorageManager.save();
        console.log('saved text');
    })


    // > Add listeners to the tab notch
    tab.notch.addEventListener('dblclick', (event) => {
        tab.notch.innerText = 'new';
        StorageManager.notes[noteUUID]['name'] = 'new';
        StorageManager.save();
        console.log('saved name');
    });

    let settings = StorageManager.settings;
    if (!settings.openUUIDS.includes(noteUUID)) {
        settings.openUUIDS.push(noteUUID)
    }

    return noteUUID;

}

/** @param {TabSwitcher} switcher @param {string} noteUUID */
function loadNote(switcher, noteUUID) {

    let noteData = StorageManager.notes[noteUUID];

    // > Create
    let noteElement = document.createElement('div');
    noteElement.classList.add('note');
    let textarea = document.createElement('textarea');
    textarea.value = noteData.text;
    noteElement.appendChild(textarea);

    // > Create tab instance on switcher
    let tab = switcher.add(noteUUID, noteData.name, noteElement);

    // > Add listener to the note textarea
    textarea.addEventListener('blur', () => {
        StorageManager.notes[noteUUID]['text'] = textarea.value;
        StorageManager.save();
        console.log('saved text');
    })

    // > Add listener to the tab notch
    tab.notch.addEventListener('dblclick', (event) => {
        tab.notch.innerText = 'new';
        StorageManager.notes[noteUUID]['name'] = 'new';
        StorageManager.save();
        console.log('saved name');
    });

    // > Add listener to the tab notch
    tab.notch.addEventListener('click', (event) => {
        StorageManager.settings.highlightedUUID = noteUUID
        StorageManager.save();
        console.log('saved highlighted');
    });

    let settings = StorageManager.settings;
    if (!settings.openUUIDS.includes(noteUUID)) {
        settings.openUUIDS.push(noteUUID)
    }

    return noteUUID;

}

// < ========================================================
// < Entry Point
// < ========================================================

function main() {

    TabSwitcher.create('page', 'switcher');
    let switcher = new TabSwitcher('switcher');

    StorageManager.load();

    let identifiers = [...StorageManager.settings.openUUIDS];
    if (identifiers.length > 0) {
        for (let identifier of identifiers) {
            loadNote(switcher, identifier);
        }
    }

    let uuid = StorageManager.settings.highlightedUUID;
    if (uuid) {
        switcher.show(uuid);
    }

}

// < ========================================================
// < Execution
// < ========================================================

main();