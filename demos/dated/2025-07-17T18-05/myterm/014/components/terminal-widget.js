// < ======================================================
// < Declarations
// < ======================================================

/** @type {string} */
const VERSION = 'my-term v0.0.14';

/** @type {string} */
const ATTRIBUTION = '2025 Ben Scarletti - MIT License';

/** @type {string} */
const INFORMATION = `${VERSION} - ${ATTRIBUTION}`;

// < ======================================================
// < Element Queries
// < ======================================================

const page = /** @type {HTMLDivElement} */
    (document.getElementById('page'));

const main = /** @type {HTMLDivElement} */
    (document.getElementById('main'));

// < ======================================================
// < Widget CSS Styling
// < ======================================================

/** 
 * Terminal Widget CSS styling for the shadow root
 * @type {string}
 */
const styling = /*css*/`

/* ========================================================
  CSS Variables
======================================================== */

:host {

    --colour-background: hsla(0, 0%, 10%, 1);
    --colour-background-soft: hsla(0, 0%, 20%, 1);
    --colour-background-rich: hsla(0, 0%, 4%, 1);
    --colour-theme: hsla(283, 40%, 60%, 1);
    --colour-theme-dim: hsla(283, 30%, 25%, 1);
    --colour-theme-mid: hsla(283, 30%, 45%, 1);
    
    --colour-log: hsla(0, 0%, 88%, 1);
    --colour-info: hsla(212, 100%, 65%, 1);
    --colour-success: hsla(129, 68%, 47%, 1);
    --colour-warning: hsla(41, 100%, 59%, 1);
    --colour-error: hsla(3, 100%, 67%, 1);

}

:host(.green) {

    --colour-background: hsla(0, 0%, 10%, 1);
    --colour-background-soft: hsla(0, 0%, 20%, 1);
    --colour-background-rich: hsla(0, 0%, 4%, 1);
    --colour-theme: hsla(120, 60%, 50%, 1);
    --colour-theme-dim: hsla(120, 40%, 25%, 1);
    --colour-theme-mid: hsla(120, 40%, 45%, 1);
    
    --colour-log: hsla(120, 20%, 80%, 1);
    --colour-info: hsla(180, 100%, 70%, 1);
    --colour-success: hsla(140, 70%, 60%, 1);
    --colour-warning: hsla(50, 100%, 60%, 1);
    --colour-error: hsla(10, 100%, 70%, 1);

}

/* ========================================================
  Terminal Widget Element Styling
======================================================== */

:host {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
}

/* ========================================================
  Wildcard Styling
======================================================== */

* {
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    font-family: monospace, 'Courier New';
}

/* ========================================================
  Frame Styling
======================================================== */

#frame {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--colour-background-rich);
    border-radius: 12px;
    border: 2px solid var(--colour-theme-dim);
    outline: 2px solid var(--colour-theme-mid);
}

/* ========================================================
  Header Styling
======================================================== */

#header {
    padding: 12px 20px;
    background: var(--colour-background);
    border-bottom: 1px solid var(--colour-background-soft);
    display: flex;
    align-items: center;
    gap: 16px;
}

#dot-container {
    display: flex;
    gap: 6px;
}
.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}
.dot.red { background: var(--colour-error); }
.dot.yellow { background: var(--colour-warning); }
.dot.green { background: var(--colour-success); }
.dot.semicircle {
    width: 6px;
    height: 12px;
    border-radius: 6px 0 0 6px;
}

/* ========================================================
  Screen Styling
======================================================== */

#screen {
    flex: 1;
    padding: 24px 12px;
    overflow-y: auto;
    scrollbar-gutter: stable both-edges;
    background: var(--colour-background-rich);
    position: relative;
}
#screen::-webkit-scrollbar { width: 8px; }
#screen::-webkit-scrollbar-track { background: transparent; }
#screen::-webkit-scrollbar-thumb {
    background: var(--colour-background-soft);
    border-radius: 4px;
}
#screen.hide-scroll::-webkit-scrollbar {
    display: none;
}
#screen.hide-scroll {
    padding: 24px 27px;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* ========================================================
  Input Styling
======================================================== */

#input-line {
    display: flex;
    align-items: flex-start;
    margin-bottom: 0;
}

#prompt {
    white-space: nowrap;
    margin-top: 2px;
}

#textarea {
    padding: 0px;
    margin: 0px;
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-family: inherit;
    color: var(--colour-log);
    caret-color: var(--colour-success);
    resize: none;
    overflow: hidden;
    min-height: 20px;
    line-height: 20px;
}

#textarea:focus {
    outline: none;
}

/* ========================================================
  Output Styling
======================================================== */

.output {
    margin-bottom: 10px;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: var(--colour-log);
}

.themed { color: var(--colour-theme) !important; }
.error { color: var(--colour-error)!important; }
.success { color: var(--colour-success) !important; }
.info { color: var(--colour-info) !important; }
.warning { color: var(--colour-warning) !important; }

`;

// < ======================================================
// < Widget HTML Structure
// < ======================================================

/** 
 * Terminal Widget HTML structure for the shadow root
 * @type {string}
 */
const structure = /*html*/`

<div id="frame">
    <div id="header">
        <div id="dot-container">
            <div class="dot red"></div>
            <div class="dot yellow"></div>
            <div class="dot green"></div>
            <div class="dot red semicircle"></div>
        </div>
    </div>
    <div id="screen">
        <div class="output">Welcome to <span class="themed">${VERSION}</span> by ${'Ben Scarletti'}</div>
        <div class="output"><span class="info">Hotkeys</span>: <span class="themed">Tab</span> to autocomplete, <span class="themed">Up</span> / <span class="themed">Down</span> to navigate history</div>
        <div class="output">Type <span class="themed">help</span> for available commands</div>
        <div id="input-line">
            <span id="prompt" class="themed">$&nbsp;&nbsp;</span>
            <textarea id="textarea" autocomplete="off" spellcheck="false" rows="1" autocapitalize="off"></textarea>
        </div>
    </div>
</div>

`;

// < ======================================================
// < Inner HTML String
// < ======================================================

const innerHTML = `<style>${styling}</style>` + structure;

// < ======================================================
// < Type Declarations
// < ======================================================

/** 
 * @typedef {''|'themed'|'error'|'success'|'info'|'warning'} EchoColour 
 */

/** 
 * @typedef {''|'green'} ThemeColour 
 */

// < ======================================================
// < Terminal Widget Class
// < ======================================================

export class TerminalWidget extends HTMLElement {

    /** @type {HTMLDivElement} */
    screen;

    /** @type {HTMLTextAreaElement} */
    textarea;

    /** @type {TerminalShell | null} */
    shell = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = innerHTML;
        this.screen = this.query('#screen');
        this.textarea = this.query('#textarea');
        this.shadowRoot.addEventListener('keydown', this._handleKeyDown);
        this.shadowRoot.addEventListener('mouseup', this._handleMouseUp);
        this.textarea.addEventListener('input', this._handleInput);
        this.setPrompt('$', 2);
    }

    /** 
     * Change the prompt string
     * @param {string} [symbol='$ ']
     * @param {number} [spaces=0]
     * @returns {void}
     */
    setPrompt(symbol = '$', spaces = 0) {
        const element = this.query('#prompt');
        element.innerHTML = `${symbol}${'&nbsp;'.repeat(spaces)}`;
    }

    /**
     * Set terminal theme via host classname
     * @param {ThemeColour} [theme='']
     * @returns {void}
     */
    setTheme(theme = '') {
        const className = theme ? theme : '';
        this.shadowRoot.host.className = className;
    }

    /**
     * Find and an element inside the shadow root
     * @template {Element} E
     * @param {string} selector - CSS selector string
     * @returns {E} The element
     */
    query(selector) {
        const element = this.shadowRoot.querySelector(selector);
        if (element === null) {
            throw new Error('TerminalWidget queries should never be null');
        }
        return /** @type {E} */ (element);
    }

    /**
     * Auto-resize textarea based on content
     * @returns {void}
     */
    _autoResizeTextarea() {
        this.textarea.style.height = 'auto';
        this.textarea.style.height = this.textarea.scrollHeight + 'px';
    }

    /**
     * Handle input events to auto-resize textarea
     * @param {Event} event
     * @returns {void}
     */
    _handleInput = (event) => {
        this._autoResizeTextarea();
    }

    /**
     * Handle `keydown` events in the terminal
     * - Pass events to terminal shell
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    _handleKeyDown = (event) => {
        if (this.shell) {
            this.shell._handleKeyDown(event);
            return;
        } else if (event.key === 'Enter') {
            this.echo('No shell attached to terminal');
        }
    }

    /**
     * Add output text to the terminal screen
     * @param {string} text - Text to display
     * @param {EchoColour} [type=''] - Class for element styling
     * @return {void}
     */
    echo(text, type = '') {
        const output = document.createElement('div');
        output.className = `output ${type}`;
        output.textContent = text;
        this.addToScreen(output);
    }

    /**
     * Add element to the terminal screen
     * @param {Element} element - The element to add to screen
     * @param {boolean} scrolling
     * @return {void}
     */
    addToScreen(element, scrolling = true) {
        this.screen.insertBefore(element, this.screen.lastElementChild);
        if (scrolling) {
            this.scrollToBottom();
        }
    }

    /**
     * Parse HTML string and add resulting element(s) to the terminal screen
     * @param {string} markup - The HTML string to parse and add to screen
     * @param {boolean} scrolling
     * @return {void}
     */
    parseToScreen(markup, scrolling = true) {
        const fragment = document.createElement('template');
        fragment.innerHTML = markup.trim();
        const elements = fragment.content.children;
        for (const element of elements) {
            this.addToScreen(element, scrolling);
        }
    }

    /**
     * Scroll to the bottom of the terminal screen
     * @returns {void}
     */
    scrollToBottom() {
        this.screen.scrollTop = this.screen.scrollHeight;
    }

    /**
     * Clear the terminal screen
     * @returns {void}
     */
    clearScreen() {
        const outputs = this.screen.querySelectorAll('.output');
        for (const output of outputs) {
            output.remove();
        }
    }

    /**
     * Clear the terminal textarea
     * @param {number} [delay] 
     * @returns {void}
     */
    clearText(delay) {
        if (delay) {
            setTimeout(() => {
                this.textarea.value = '';
            }, delay);
            return;
        }
        this.textarea.value = '';
    }

    /**
     * Toggle scrollbar visibility on terminal screen
     * @returns {boolean} The state of the class after toggle
     */
    toggleScrollbar() {
        return this.screen.classList.toggle('hide-scroll');
    }

    /**
     * Handle `mouseup` events in the terminal
     * @param {Event} event
     * @returns {void}
     */
    _handleMouseUp = (event) => {
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
            this.textarea.focus();
        }
    }

}

// < ======================================================
// < Terminal Command Class
// < ======================================================

/**
 * @typedef {(
 *   widget: TerminalWidget,
 *   shell: TerminalShell,
 *   command: TerminalCommand,
 *   ...args: any[]
 * ) => any} CommandHandler
 */

export class TerminalCommand {

    /** @type {string} */
    name;

    /** @type {CommandHandler} */
    handler;

    /**
     * Create a command instance
     * @param {string} name
     * @param {CommandHandler} handler
     */
    constructor(name, handler) {
        this.name = name;
        this.handler = handler;
    }

    /**
     * Execute command handler
     * @param {TerminalWidget} widget
     * @param {TerminalShell} shell
     * @param {...*} args
     */
    execute(widget, shell, ...args) {
        this.handler(widget, shell, this, ...args);
    }

}

// < ======================================================
// < Terminal Hijacker Class
// < ======================================================

export class TerminalHijacker {

    /** @type {string} */
    name;

    /** @type {TerminalShell | null} */
    shell = null;

    /**
     * Create a TerminalHijacker instance
     * @param {string} name - The name of the hijacker instance
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * Attach hijacker to a shell
     * @param {TerminalShell} shell
     * @returns {void}
     */
    attachTo(shell) {
        if (!shell.widget) {
            throw new Error('Shell must be attached to widget first');
        }
        shell.hijacker = this;
        this.shell = shell;
        this.onEnter(shell);
    }

    /**
     * Detatch hijacker from current shell
     * @returns {void}
     */
    detatch() {
        const shell = this.shell;
        shell.hijacker = null;
        this.shell = null;
        this.onExit(shell);
    }

    /**
     * Called when hijacker is attached to shell
     * @param {TerminalShell} shell
     * @returns {void}
     */
    onEnter(shell) {

        shell.widget.echo('onEnter method should be overwritten');

    }

    /**
     * Called when hijacker is detatched from shell
     * @param {TerminalShell} shell
     * @returns {void}
     */
    onExit(shell) {

        shell.widget.echo('onExit method should be overwritten');

    }

    /**
     * Handle `keydown` events from the terminal
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    _handleKeyDown = (event) => {

        if (event.key === 'Enter' && !event.shiftKey) {

            // Do not add a newline character
            event.preventDefault();

            const input = this.shell.widget.textarea.value;
            this.shell.widget.textarea.value = '';

            this.handleSubmit(input);

        } else if (event.key === 'Enter') {

            setTimeout(() => this.shell.widget._autoResizeTextarea(), 0);

        }

    }

    /**
     * Handle input from `Enter` key down event
     * @param {string} input
     * @returns {void}
     */
    handleSubmit(input) {
        this.shell.widget.echo('handleSubmit method should be overwritten');
    }

}

// < ======================================================
// < Terminal Shell Class
// < ======================================================

export class TerminalShell {

    /** @type {string} */
    name;

    /** @type {TerminalWidget} */
    widget;

    /** @type {TerminalCommand[]} */
    commands;

    /** @type {TerminalHijacker | null} */
    hijacker;

    /** @type {string[]} */
    _history;

    /** @type {number} */
    _historyIndex;

    /** 
     * 
     * @param {string} name
     */
    constructor(name) {
        this.name = name;
        this._history = [];
        this._historyIndex = -1;
        this.commands = [];
    }

    /**
     * Handle `keydown` events from the terminal
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    _handleKeyDown = (event) => {
        if (this.hijacker) {
            this.hijacker._handleKeyDown(event);
            return;
        }
        if (event.key === 'Enter') {

            // Do not add a newline character
            event.preventDefault();

            const value = this.widget.textarea.value.trim();
            if (!value) return;
            this._addToHistory(value);

            // this.widget.textarea.value = '';

            this.widget.echo(`>> ${value}`);

            const [key, ...args] = value.split(' ');
            const command = this.commands.find(c => c.name === key);
            if (command) {
                command.execute(this.widget, this, ...args);
            } else {
                this.widget.echo(`${key} is not a valid command`);
            }
            this.widget.scrollToBottom();

            // Clear the textarea
            setTimeout(() => {
                this.widget.textarea.value = '';
            }, 0);

        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this._navigateHistory(-1);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            this._navigateHistory(1);
        } else if (event.key === 'Tab') {
            event.preventDefault();
            this._autocomplete();
        }

    }

    /**
     * Attach shell to the terminal widget
     * @param {TerminalWidget} widget
     * @returns {void}
     */
    attachTo(widget) {
        widget.shell = this;
        this.widget = widget;
    }

    /**
     * Show all shell commands on terminal screen
     * @returns {void}
     */
    showHelp() {
        const commandNames = this.commands.map(c => c.name);
        for (const name of commandNames) {
            this.widget.echo(name)
        }
    }

    /**
     * Simple autocomplete for terminal
     * - Predicts based on saved commands
     * @returns {void}
     */
    _autocomplete() {
        const textarea = this.widget.textarea;
        const partial = textarea.value.trim();
        const names = this.commands.map(cmd => cmd.name);
        const matches = names.filter(name =>
            name.toLowerCase().startsWith(partial.toLowerCase())
        );
        if (matches.length === 1) {
            this.widget.textarea.value = matches[0];
        } else if (matches.length > 1) {
            this.widget.echo(`Available: ${matches.join(', ')}`, 'info');
        }
    }

    /**
     * Add command to history
     * @param {string} command - Command string input
     * @returns {void}
     */
    _addToHistory(command) {
        this._history.push(command);
        this._historyIndex = this._history.length;
    }

    /**
     * Navigate command history
     * @param {number} direction - Integer for index change `+/-`
     * @returns {void}
     */
    _navigateHistory(direction) {
        const index = this._historyIndex + direction;
        if (index >= 0 && index <= this._history.length) {
            this._historyIndex = index;
            this.widget.textarea.value = this._history[this._historyIndex] || '';
        }
    }

}

// * ======================================================
// * Custom Element Registration
// * ======================================================

customElements.define('terminal-widget', TerminalWidget);