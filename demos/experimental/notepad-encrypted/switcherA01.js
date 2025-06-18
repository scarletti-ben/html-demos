// < ========================================================
// < tools Object
// < ========================================================

const tools = {

    assert(condition, message = 'Assertion') {
        if (!condition) {
            throw new Error(`UserError: ${message}`);
        }
    },

    /**
     * Remove an item from an array
     * 
     * @param {Array<T>} array - The array to remove the item from
     * @param {T} item - The item to remove from the array
     * @returns {Array<T>} - The spliced array of deleted elements
     * @template T
     */
    remove(array, item) {
        const index = array.indexOf(item);
        if (index !== -1) {
            return array.splice(index, 1);
        }
        throw new Error(`UserError: item not in array`)
    },

    selectAll(element) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    },

    /** 
     * Toggle .hidden class for an element
     * @param {HTMLElement} element
     */
    toggleHidden(element, force) {
        element.classList.toggle('hidden', force);
    },

    /** 
     * Toggle .highlighted class for an element
     * @param {HTMLElement} element
     */
    toggleHighlighted(element, force) {
        element.classList.toggle('highlighted', force);
    },

    /** 
     * Toggle .bordered class for an element
     * @param {HTMLElement} element
     */
    toggleBordered(element, force) {
        element.classList.toggle('bordered', force);
    },

    /** 
     * debounced
     * @param {CallableFunction} callback - Function
     * @param {number} timeout - Time in ms
     */
    debounced: (callback, timeout) => {
        let timeoutID = null;
        return (...args) => {
            window.clearTimeout(timeoutID);
            timeoutID = window.setTimeout(() => {
                callback(...args);
            }, timeout);
        };
    }

}

// < ========================================================
// < Tab Class
// < ========================================================

class Tab {

    /** @type {string} */
    uuid;

    /** @type {HTMLDivElement} */
    _element;

    /** @type {HTMLDivElement} */
    notch;

    /** @type {HTMLDivElement} */
    pane;

    /** 
     * Initialise a Tab instance for use with Switcher
     * @param {string} uuid - The unique identifier for this tab
     * @param {HTMLDivElement} element - The element to go in the pane
     */
    constructor(uuid, element) {
        this.uuid = uuid;
        this._element = element;
        this.pane = this._createPane();
        this.notch = this._createNotch();
    }

    /** @returns {HTMLDivElement} */
    _createPane() {
        let pane = document.createElement('div');
        pane.classList.add('pane', 'hidden');
        pane.dataset.uuid = this.uuid;
        pane.appendChild(this._element);
        return pane;
    }

    /** @returns {HTMLDivElement} */
    _createNotch() {
        let notch = document.createElement('div');
        notch.dataset.uuid = this.uuid;
        notch.classList.add('notch');
        return notch;
    }

}

// < ========================================================
// < Switcher Class
// < ========================================================

class Switcher {

    /** @type {Tab[]} */
    static tabs = [];

    /** @type {HTMLDivElement} */
    static element;

    /** @type {HTMLDivElement} */
    static top;

    /** @type {HTMLDivElement} */
    static ribbon;

    /** @type {HTMLDivElement} */
    static bottom;

    /** @type {HTMLDivElement} */
    static viewport;

    /** @type {HTMLDivElement} */
    static header;

    /** @type {HTMLDivElement} */
    static frame;

    /** @type {HTMLDivElement} */
    static footer;

    /**
     * Generate Switcher HTML structure inside a given container element
     * @param {string} containerID - The ID of the container element
     */
    static init(containerID) {
        let switcherID = this.inject(containerID);
        this.element = document.getElementById(switcherID);
        this.top = this.element.querySelector('.top-section');
        this.ribbon = this.element.querySelector('.ribbon');
        this.bottom = this.element.querySelector('.bottom-section');
        this.viewport = this.element.querySelector('.viewport');
        this.header = this.element.querySelector('.header');
        this.frame = this.element.querySelector('.frame');
        this.footer = this.element.querySelector('.footer');
    }

    /** @param {string} uuid @returns {Tab} */
    static getTab(uuid) {
        return this.tabs.find(tab => tab.uuid === uuid);
    }

    /** @param {Tab} tab */
    static highlightTab(tab) {
        for (let instance of this.tabs) {
            tools.toggleHidden(instance.pane, instance !== tab);
            tools.toggleHighlighted(instance.notch, instance === tab);
        }
    }

    /** @param {Tab} tab */
    static closeTab(tab) {
        this.frame.removeChild(tab.pane);
        this.ribbon.removeChild(tab.notch);
        tools.remove(this.tabs, tab);
        console.log(`Switcher closed tab: ${tab.uuid}`);
    }

    /** @param {Tab} tab */
    static addTab(tab) {
        this.ribbon.appendChild(tab.notch);
        this.frame.appendChild(tab.pane);
        this.tabs.push(tab);
    }

    /**
     * Generate Switcher HTML structure inside a given container element
     * @param {string} containerID - The ID of the container element
     * @returns {string} - The id of the new Switcher element
     */
    static inject(containerID) {
        let switcherID = 'switcher'
        let container = document.getElementById(containerID);
        const switcherHTML = `
        <div id="${switcherID}" class="switcher">
            <div class="top-section">
                <div class="ribbon"></div>
            </div>
            <div class="bottom-section">
                <div class="viewport">
                    <div class="header"></div>
                    <div class="frame"></div>
                    <div class="footer"></div>
                </div>
            </div>
        </div>`;
        container.insertAdjacentHTML('beforeend', switcherHTML);
        console.log(`TabSwitcher created switcher element with ID: ${switcherID}`)
        return switcherID;
    }

    // < ========================================================
    // < 
    // < ========================================================

    static toggleHeader(force) {
        tools.toggleHidden(this.header, force);
    }

    static toggleFooter(force) {
        tools.toggleHidden(this.footer, force);
    }

    static toggleBorder(force) {
        tools.toggleBordered(this.viewport, force);
    }

}

// < ========================================================
// < Note Class
// < ========================================================

class Note {

    /** @type {Note[]} */
    static instances = [];

    /** @type {string} */
    uuid;

    /** @type {Object<string, { name: string, text: string }>} */
    data;

    /** @type {HTMLTextAreaElement} */
    textarea;

    /** @type {Tab} */
    tab;

    /** 
     * Initialise a Note instance, generating an associated Switcher tab
     * @param {string} uuid - The unique identifier for the Note instance
     * @param {Object<string, { name: string, text: string }>} data - The data object for the Note instance
     */
    constructor(uuid, data) {
        this.uuid = uuid;
        this.data = data;
        this.textarea = this._createTextarea(data);
        this.tab = this._createTab(this.textarea);
    }

    /** @param {Object<string, { name: string, text: string }>} data */
    _createTextarea(data) {
        const textarea = document.createElement('textarea');
        textarea.value = data.text;
        return textarea;
    }

    /** @param {HTMLTextAreaElement} textarea */
    _createTab(textarea) {
        const element = document.createElement('div');
        element.classList.add('note');
        element.appendChild(textarea);
        let tab = new Tab(this.uuid, element);
        tab.notch.innerText = this.data.name;
        return tab;
    }

    /** @param {string} uuid @returns {Note} */
    static getNote(uuid) {
        return Note.instances.find(note => note.uuid === uuid);
    }

}

// < ========================================================
// < Core Class
// < ========================================================

// Inferface between Switcher / Tab / Note and localStorage
class Core {

    static dataKey = 'notepad-encrypyted-2025-03-29';
    static data = {
        highlighted: null,
        opened: [],
        notes: {}
    }

    static highlightNote(note) {
        Core.data.highlighted = note.uuid;
        Switcher.highlightTab(note.tab);
        console.log(`Core highlighted note: ${note.uuid}`);
    }

    static closeNote(note) {
        if (Core.data.highlighted === note.uuid) {
            Core.data.highlighted = null;
        }
        Switcher.closeTab(note.tab);
        tools.remove(Note.instances, note);
        tools.remove(Core.data.opened, note.uuid);
        console.log(`Core closed note: ${note.uuid}`);
    }

    static deleteNote(note) {
        if (confirm('Are you sure?')) {
            Core.closeNote(note);
            delete Core.data.notes[note.uuid];
            console.log(`Core deleted note: ${note.uuid}`);
        }
    }

    /** @returns {Note} */
    static createNote(noteUUID, noteData) {
        let note = new Note(noteUUID, noteData);
        Note.instances.push(note);
        Switcher.addTab(note.tab);
        Core.applyListeners(note);
        Core.data.notes[noteUUID] = note.data;
        if (!Core.data.opened.includes(noteUUID)) {
            Core.data.opened.push(noteUUID);
        }
        console.log(`Core created note: ${note.uuid}`);
        return note;
    }

    /** @returns {Note} */
    static blankNote() {
        let noteUUID = crypto.randomUUID();
        let noteData = {
            name: '',
            text: ''
        }
        return Core.createNote(noteUUID, noteData)
    }

    static load() {
        const dataJSON = localStorage.getItem(Core.dataKey);
        const data = JSON.parse(dataJSON);
        Core.data = data;
        console.log(`Core loaded all data from localStorage`);
    }

    static save = tools.debounced(() => {
        let dataJSON = JSON.stringify(Core.data);
        localStorage.setItem(Core.dataKey, dataJSON);
        console.log(`Core saved all data to localStorage`);
    }, 3000)

    static init(resetting = false) {
        if (resetting) {
            Core.save()
        } else {
            Core.load();
        }
        let noteUUIDS = [...Core.data.opened];
        for (let noteUUID of noteUUIDS) {
            let noteData = Core.data.notes[noteUUID];
            tools.assert(noteData !== undefined);
            Core.createNote(noteUUID, noteData);
        }
        console.log(`Core initialised`);
    }

    /** 
     * Add listeners to the elements of a given note instance
     * @param {Note} note
     */
    static applyListeners(note) {

        let notch = note.tab.notch;
        let textarea = note.textarea;

        // > Highlight note when notch left clicked
        notch.addEventListener('click', (event) => {
            Core.highlightNote(note);
            Core.save();
        });

        // > Enable text editing when notch double clicked
        notch.addEventListener('dblclick', (event) => {
            notch.contentEditable = true;
            notch.focus();
            tools.selectAll(notch);
        });

        // > Save note name when notch focus lost
        notch.addEventListener('blur', (event) => {
            if (notch.contentEditable) {
                notch.contentEditable = false;
                note.data.name = notch.innerText;
                Core.save();
            }
        });

        // > Close note when notch middle clicked
        notch.addEventListener('mousedown', (event) => {
            if (event.button === 1) {
                Core.closeNote(note);
                Core.save();
            }
        });

        // > Delete note when notch right clicked
        notch.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            Core.deleteNote(note);
            Core.save();
        });

        // > Save note text when textarea focus lost
        textarea.addEventListener('blur', (event) => {
            note.data.text = textarea.value;
            Core.save();
        })

    }

    // ! ========================================================
    // ! Experimental Methods
    // ! ========================================================

    /** @param {Note} note */
    static flashNote(note, ms = 200) {
        note.tab.notch.style.transition = 'opacity 0.2s';
        note.tab.notch.style.opacity = '0.5';
        setTimeout(() => note.tab.notch.style.opacity = '1', ms);
    }

    /** Print Core.data object in a readable format */
    static print() {
        console.log(JSON.stringify(Core.data, null, 2));
    }

}

// < ========================================================
// < Entry Point
// < ========================================================

function main() {

    // > Initialise Switcher
    Switcher.init('page');
    Switcher.toggleBorder(true);
    Switcher.toggleFooter(false);

    // > Init
    Core.init(false);

    if (Core.data.highlighted) {
        let noteUUID = Core.data.highlighted;
        let note = Note.getNote(noteUUID);
        Core.highlightNote(note);
    }

    // ! ========================================================
    // ! 
    // ! ========================================================

    let element = document.createElement('div');
    element.innerText = '+';
    element.classList.add('notch');
    Switcher.top.appendChild(element);
    element.addEventListener('click', () => {
        Core.blankNote();
        Core.print();
    })
}

// < ========================================================
// < Execution
// < ========================================================

main();