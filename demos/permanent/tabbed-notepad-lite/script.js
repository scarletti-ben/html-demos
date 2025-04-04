// < ========================================================
// < Imports
// < ========================================================

import { tools } from "./tools.js";
import { DataTable } from "./table.js";

// < ========================================================
// < Element Queries
// < ========================================================

let page = document.getElementById('page');
let centralContainer = document.getElementById('central-container');
let tableContainer = document.getElementById('table-container');
let tableButton = document.getElementById('table-button');
let menuButton = document.getElementById('menu-button');
let menuRail = document.getElementById('menu-rail');
let tabRail = document.getElementById('tab-rail');
let createButton = document.getElementById('create-button');
let saveButton = document.getElementById('save-button');
// let loadButton = document.getElementById('load-button');
let resetButton = document.getElementById('reset-button');
let downloadButton = document.getElementById('download-button');

// ! ========================================================
// ! Interface
// ! ========================================================

class Interface {

    static toggleMenuRail() {
        let icon = menuButton.firstElementChild;
        let open = icon.textContent === "top_panel_open"
        icon.textContent = open ? "top_panel_close" : "top_panel_open"
        menuRail.classList.toggle("hidden")
    }

    static saveAll() {
        for (let note of Note.instances) {
            Note.saveNote(note);
        }
        StorageHandler.updateOpened();
    }

    static reset() {
        StorageHandler.reset();
        Note.reset();
    }

    static openActiveNote() {
        let uuid = StorageHandler.dictionary.settings['uuid'];
        if (uuid != null) {
            for (let note of Note.instances) {
                if (note.uuid === uuid) {
                    Note.showOnly(note);
                    return;
                }
            }
        }
        Note.showOnly(Note.instances[0]);
    }

    static loadAll() {
        for (let [uuid, { name, text, tags }] of Object.entries(StorageHandler.dictionary.notes)) {
            let opened = StorageHandler.dictionary.settings['opened']
            console.log(opened);
            if (opened.includes(uuid)) {
                console.log(uuid);
                let note = Note.loadNote(uuid, name, text, tags);
                Note.hideNote(note);
            }
        }
    }

    static toggleTable() {
        tableContainer.classList.toggle('hidden')
        let table = document.querySelector(".data-table");
        if (table) {
            table.remove();
            Interface.openActiveNote();
        }
        else {
            Note.showOnly(null);
            const headers = ["uuid", "name", "text", "tags"]
            const data = []
            const activeUUIDS = []
            for (let [uuid, { name, text, tags }] of Object.entries(StorageHandler.dictionary.notes)) {
                data.push([uuid, name, text, tags])
                let active = Note.getNoteFromUUID(uuid) != null;
                if (active) {
                    activeUUIDS.push(uuid);
                }
            }
            let table = new DataTable(tableContainer, headers, data);
            for (let item of activeUUIDS) {
                for (let row of table.element.querySelectorAll('tbody tr')) {
                    if (row.cells[0]?.innerText === item) {
                        row.classList.add('opened');
                    }
                }
            }

        }
    }

    static downloadNotes(filename = 'notes.json') {
        let key = 'notes2025-03-23';
        const item = localStorage.getItem(key);
        if (item) {
            try {
                const parsedData = JSON.parse(item);
                const jsonBlob = new Blob([JSON.stringify(parsedData, null, 2)], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(jsonBlob);
                link.download = filename;
                link.click();
            } catch (error) {
                console.log('Error parsing JSON:', error);
            }
        } else {
            console.log('Item not found in localStorage.');
        }
    }

    /** @returns {Note} */
    static getCurrentNote() {
        /** @param {Note[]} _ */
        let notes = Note.instances;
        for (let note of notes) {
            if (!note.editor.classList.contains('hidden')) {
                return note
            }
        }
    }

}

// < ========================================================
// < StorageHandler Class
// < ========================================================

class StorageHandler {

    static key = 'notes2025-03-23';

    /** @returns {{ settings: object, notes: object }} */
    static get defaultDictionary() {
        return {
            settings: {
                uuid: null,
                opened: []
            },
            notes: {}
        }
    }

    /** @type {{ settings: object, notes: object }} */
    static dictionary;

    // < ========================================================

    static save() {
        let string = tools.stringify(StorageHandler.dictionary)
        localStorage.setItem(this.key, string);
    }

    static load() {
        let stored = localStorage.getItem(this.key);
        if (stored === null) {
            StorageHandler.reset();
        }
        else {
            StorageHandler.dictionary = tools.objectify(stored);
        }
    }

    static reset() {
        StorageHandler.dictionary = StorageHandler.defaultDictionary;
        StorageHandler.save();
    }

    // < ========================================================

    /** @param {Note} note */
    static saveNote(note) {
        console.log(`saving note ${note.uuid}`)
        let notes = StorageHandler.dictionary.notes;
        notes[note.uuid] = note.metadata;
        StorageHandler.save();
    }

    /** @param {string} key @param {any} value */
    static saveSetting(key, value) {
        console.log(`saving setting ${key}: ${value}`)
        let settings = StorageHandler.dictionary.settings;
        settings[key] = value;
        StorageHandler.save();
    }

    // < ========================================================

    /**  @param {Note} note */
    static removeNote(note) {
        console.log(`removing note ${note.uuid}`)
        let notes = StorageHandler.dictionary.notes;
        delete notes[note.uuid];
        StorageHandler.save();
    }

    /**  @param {string} key */
    static removeSetting(key) {
        console.log(`removing setting ${key}`)
        let settings = StorageHandler.dictionary.settings;
        delete settings[key];
        StorageHandler.save();
    }

    static updateOpened() {
        this.saveSetting('opened', Note.instances.map(note => note.uuid))
    }

}

// < ========================================================
// < Note Class
// < ========================================================

class Note {

    /** @type {Note[]} */
    static instances = []

    // < ========================================================
    // < Methods for Note Instances
    // < ========================================================

    constructor(uuid, name, text, tags) {
        this.num = this.getNum();
        this.uuid = uuid ? uuid : crypto.randomUUID();
        this.name = name ? name : 'note' + this.num;
        this.tags = tags ? tags : [];
        this.tab = this.createTab();
        this.editor = this.createEditor();
        this.textarea = this.editor.querySelector('textarea');
        this.text = text ? text : '';
        Note.instances.push(this);
    }

    getNum() {
        let nums = Note.instances.map(instance => instance.num);
        return nums.length > 0 ? Math.max(...nums) + 1 : 1;
    }

    createTab() {
        let tab = document.createElement('div');
        tab.classList.add('tab');
        tab.id = 'tab' + this.num;
        tab.innerText = this.name;
        tab.title = this.uuid;

        // > Ensure that clicking a tab brings it into focus
        tab.addEventListener('click', () => {
            Note.showOnly(this);
        });

        tab.addEventListener('dblclick', function () {
            tab.contentEditable = true;
            tab.focus();
            tools.selectAll(tab);
        });

        tab.addEventListener('blur', () => {
            Note.renameNote(this, tab.innerText);
            tab.contentEditable = false;
        });

        tabRail.insertBefore(tab, createButton);
        return tab;
    }

    createEditor() {
        let editor = document.createElement('div');
        editor.classList.add('editor');
        editor.id = 'editor' + this.num;

        let textarea = document.createElement('textarea');
        textarea.placeholder = editor.id;

        // > Make editor save note accordingly
        textarea.addEventListener('blur', () => {
            Note.saveNote(this);
        });

        editor.appendChild(textarea);
        centralContainer.appendChild(editor);
        return editor;
    }

    set text(value) {
        if (value === null) return;
        this.textarea.value = value;
    }

    get text() {
        return this.textarea.value;
    }

    get metadata() {
        return {
            name: this.name,
            text: this.text,
            tags: this.tags,
        }
    }

    // < ========================================================
    // < Static Methods for Creation of Note Instances
    // < ========================================================

    static loadNote(uuid, name, text, tags) {
        tools.argcheck({ uuid, name, text, tags });
        let note = new Note(uuid, name, text, tags);
        return note;
    }

    // < ========================================================
    // < Static Methods for Manipulating Note Instances
    // < ========================================================

    /** @returns {Note} */
    static getNote(tab) {
        for (let instance of Note.instances) {
            if (instance.tab === tab) {
                return instance;
            }
        }
    }

    /** @returns {Note} */
    static getNoteFromUUID(uuid) {
        for (let instance of Note.instances) {
            if (instance.uuid === uuid) {
                return instance;
            }
        }
    }

    /** @param {Note} note */
    static renameNote(note, name) {
        note.name = name;
        note.tab.innerText = name;
        Note.saveNote(note);
    }

    /** @param {Note} note */
    static showNote(note) {
        note.tab.classList.add('active');
        let table = document.querySelector(".data-table");
        if (!table) {
            note.editor.classList.remove('hidden');
        }
        StorageHandler.saveSetting('uuid', note.uuid);
    }

    /** @param {Note} note */
    static hideNote(note) {
        note.tab.classList.remove('active');
        note.editor.classList.add('hidden');
    }

    /** @param {Note} note */
    static showOnly(note) {
        if (note === null) console.log('hiding all notes');
        for (let instance of Note.instances) {
            if (instance !== note) {
                Note.hideNote(instance);
            }
            else {
                Note.showNote(instance);
            }
        }
    }

    /** @param {Note} note */
    static flashNote(note) {
        if (!note) return;
        note.tab.style.transition = 'opacity 0.2s';
        note.tab.style.opacity = '0.5';
        setTimeout(() => note.tab.style.opacity = '1', 200);
    }

    /** @param {Note} note */
    static closeNote(note) {
        note.tab.remove();
        note.editor.remove();
        let index = Note.instances.indexOf(note);
        Note.instances.splice(index, 1);
        StorageHandler.updateOpened();
    }

    /** @param {Note} note */
    static removeNote(note) {
        Note.closeNote(note);
        StorageHandler.removeNote(note);
    }

    /** @param {Note} note */
    static saveNote(note) {
        Note.flashNote(note);
        StorageHandler.saveNote(note);
    }

    // < ========================================================

    static reset() {
        for (let note of Note.instances) {
            note.tab.remove();
            note.editor.remove();
        }
        Note.instances = [];
        StorageHandler.updateOpened();
    }

}

// < ========================================================
// < EventHandler Class
// < ========================================================

// > EventHandler class to initialise event listeners 
class EventHandler {

    static mx = 0
    static my = 0

    /** @param {Event} event */
    static mousemove(event) {
        EventHandler.mx = event.clientX;
        EventHandler.my = event.clientY;
    }

    static hovered(selector = null) {
        let target = document.elementFromPoint(EventHandler.mx, EventHandler.my);
        if (selector !== null) {
            let closest = target.closest(selector);
            return closest;
        } else {
            return target;
        }
    }

    /** @param {Event} event */
    static click(event) {}

    /** @param {Event} event */
    static keydown(event) {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            Interface.saveAll();
        }
        else if (event.key === 'Delete') {
            let tab = EventHandler.hovered('.tab');
            if (tab) {
                let note = Note.getNote(tab);
                Note.removeNote(note);
                Interface.openActiveNote();
            }
        }
        else if (event.key === 'p') {

        }
    }

    /** @param {MouseEvent} event */
    static mousedown(event) {
        if (event.button === 1) {
            const tab = event.target.closest('.tab');
            if (tab) {
                let note = Note.getNote(tab);
                Note.closeNote(note);
                table.remove();
                let table = document.querySelector(".data-table");
                if (!table) {
                    Interface.openActiveNote();
                }
            }
        }
    }

    /** Initialise event listeners */
    static init() {
        document.addEventListener("click", EventHandler.click);
        document.addEventListener("mousedown", EventHandler.mousedown);
        document.addEventListener("keydown", EventHandler.keydown);
        document.addEventListener("mouseover", EventHandler.mousemove);
        createButton.addEventListener("click", () => {
            let note = new Note();
            Note.showOnly(note);
            StorageHandler.saveNote(note);
            StorageHandler.updateOpened();
        });
        resetButton.addEventListener("click", () => {
            let answer = confirm('This will reset and delete all notes, are you sure?')
            if (answer === true) {
                Interface.reset()
            }
        });
        menuButton.addEventListener("click", () => Interface.toggleMenuRail());
        saveButton.addEventListener("click", () => Interface.saveAll());
        tableButton.addEventListener("click", () => Interface.toggleTable());
        downloadButton.addEventListener("click", () => Interface.downloadNotes());
    }

}

// < ========================================================
// < Entry Point
// < ========================================================

// > Entry point of the application
function main() {

    EventHandler.init();
    StorageHandler.load();

    Interface.loadAll();

    Interface.openActiveNote();

    // ! ========================================================
    // ! Experimental
    // ! ========================================================

    let buttons = document.querySelectorAll('.rail-button');
    buttons.forEach(button => button.title = button.id.replace('-button', ''))

    document.addEventListener('dataTableEvent', event => {
        let value = event.detail.uuid;
        let current = Note.getNoteFromUUID(value);
        if (current) {
            return;
        }
        let { name, text, tags } = StorageHandler.dictionary.notes[value];
        let x = Note.loadNote(value, name, text, tags);
        Note.hideNote(x);
        StorageHandler.updateOpened();
    });

}

// < ========================================================
// < Execution
// < ========================================================

main();
