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

// < ========================================================
// < TabSwitcher Wrapper Class
// < ========================================================

class TabSwitcher {

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

    /** @returns {HTMLDivElement[]} */
    get notches() {
        return Array.from(this.ribbon.children);
    }

    /** @returns {HTMLDivElement[]} */
    get panes() {
        return Array.from(this.window.children);
    }

    /** @returns {string[]} */
    get uuids() {
        return this.notches.map(notch => notch.dataset.uuid);
    }

    /** @param {string} uuid @returns {HTMLDivElement} */
    notch(uuid) {
        return this.notches.find(notch => notch.dataset.uuid === uuid);
    }

    /** @param {string} uuid @returns {HTMLDivElement} */
    pane(uuid) {
        return this.panes.find(pane => pane.dataset.uuid === uuid);
    }

    /** @param {string} uuid */
    show(uuid) {
        for (let pane of this.panes) {
            toggleHidden(pane, pane.dataset.uuid !== uuid);
        }
        for (let notch of this.notches) {
            toggleHighlighted(notch, notch.dataset.uuid === uuid);
        }
    }

    /** @param {string} uuid @param {string} name @param {HTMLElement} element */
    add(uuid, name, element) {

        // > Create and append notch to ribbon
        let notch = document.createElement('div');
        notch.classList.add('notch');
        notch.innerText = name;
        notch.dataset.uuid = uuid;
        this.ribbon.appendChild(notch);

        // > Create and append pane to window, hidden
        let pane = document.createElement('div');
        pane.classList.add('pane', 'hidden');
        pane.dataset.uuid = uuid;
        this.window.appendChild(pane);

        // > Add event listeners to notch
        notch.addEventListener('click', (event) => {
            this.show(uuid);
        });

        // > Append passed element to pane
        pane.appendChild(element);

    }

}

// < ========================================================
// < Entry Point of the Application
// < ========================================================

function main() {

    let tabSwitcher = new TabSwitcher('tab-switcher');

    // > Create a tab
    var uuid = crypto.randomUUID();
    var name = 'uno';
    var div = document.createElement('div');
    div.classList.add('note');
    var textarea = document.createElement('textarea');
    textarea.value = name;
    div.appendChild(textarea);
    tabSwitcher.add(uuid, name, div);

    // > Create another tab
    var uuid = crypto.randomUUID();
    var name = 'dos';
    var div = document.createElement('div');
    div.classList.add('note');
    var textarea = document.createElement('textarea');
    textarea.value = name;
    div.appendChild(textarea);
    tabSwitcher.add(uuid, name, div);

    // > Show the second tab
    tabSwitcher.show(uuid);

}

// < ========================================================
// < Execution
// < ========================================================

main();