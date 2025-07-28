/**
 * Example module
 * 
 * @module example
 * @author Ben Scarletti
 * @version 1.0.0
 * @since 1995-12-22
 * @see {@link https://github.com/scarletti-ben}
 * @license MIT
 */

// < ======================================================
// < Declarations
// < ======================================================

const example = `
local name = "Ben"
print("Hello, " .. name)
return name
`

// < ======================================================
// < Element Queries
// < ======================================================

const page = /** @type {HTMLDivElement} */
    (document.getElementById('page'));

const main = /** @type {HTMLDivElement} */
    (document.getElementById('main'));

const terminal = /** @type {HTMLDivElement} */
    (document.getElementById('terminal'));

const display = /** @type {HTMLDivElement} */
    (document.querySelector('#display'));

const textarea = /** @type {HTMLInputElement} */
    (terminal.querySelector('#textarea'));

// < ======================================================
// < Helper Functions
// < ======================================================

/**
 * Add element to the terminal display
 * @param {Element} element - The element to add to terminal
 * @return {void}
 */
function _print(element) {
    display.insertBefore(element, display.lastElementChild);
}

/**
 * Add output text to the terminal display
 * @param {string} text - Text to display
 * @param {''|'log'|'themed'|'error'|'success'|'info'|'warning'} [type=''] - Colour for element styling
 * @return {void}
 */
function print(text, type = '') {
    type = type === 'log' ? '' : type;
    const element = document.createElement('div');
    element.className = `output ${type}`;
    element.textContent = text;
    _print(element);
}

/**
 * Parse HTML string and add the parsed element to the terminal display
 * - The string is automatically wrapped in <div class="output">
 * @param {string} markup - The HTML string to parse and add to display
 * @return {void}
 */
function printHTML(markup) {
    const output = document.createElement('div');
    output.className = 'output';
    output.innerHTML = markup.trim();
    _print(output);
}

function resizeTextarea() {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// < ======================================================
// < Wrapper Functions for Lua / fengari-web.js
// < ======================================================

function initLua() {
    const state = fengari.lauxlib.luaL_newstate();
    fengari.lualib.luaL_openlibs(state);
    return state;
}

/**
 * Run Lua code using fengari-web.js a Lua VM for ES6 
 * - Translates Lua to run entirely in JavaScript
 * - Does not use WASM
 * @param {any} lua - The Lua instance
 * @param {string} code - The Lua code to run
 * @return {void}
 */
function runLua(lua, code) {
    try {

        const status = fengari.lauxlib.luaL_loadstring(lua, fengari.to_luastring(code));
        if (status !== fengari.lua.LUA_OK) {
            console.log('Reached 1')
            const err = fengari.to_jsstring(fengari.lua.lua_tostring(lua, -1));
            fengari.lua.lua_pop(lua, 1);
            return { success: false, error: err, flavour: 1 };
        }

        const callStatus = fengari.lua.lua_pcall(lua, 0, 1, 0);
        if (callStatus !== fengari.lua.LUA_OK) {
            console.log('Reached 2')
            const err = fengari.to_jsstring(fengari.lua.lua_tostring(lua, -1));
            fengari.lua.lua_pop(lua, 1);
            return { success: false, error: err, flavour: 2 };
        }

        console.log('Reached 3 or 4')
        const luaResult = fengari.lua.lua_tostring(lua, -1);
        if (luaResult === null) {
            console.log('Reached 3')
            fengari.lua.lua_pop(lua, 1);
            return { success: true, result: null, flavour: 3 };
        }
        console.log('Reached 4')
        const result = fengari.to_jsstring(luaResult);
        fengari.lua.lua_pop(lua, 1);
        return { success: true, result, flavour: 4 };

    } catch (err) {

        console.log('Reached 5')
        return { success: false, error: err.message || err.toString(), flavour: 5 };

    }
}

// ~ ======================================================
// ~ Entry Point
// ~ ======================================================

// ? Run callback when all resources have loaded
window.addEventListener('load', () => {

    // ~ Initialise a Lua VM
    const lua = initLua();

    // ~ Add example code and resize textarea
    textarea.value = example.trim();
    resizeTextarea();

    // ~ Add listener to automatically resize the textarea on input
    textarea.addEventListener('input', () => {
        resizeTextarea();
    });

    // ~ Add listener to run Lua code
    textarea.addEventListener('keydown', (event) => {

        if (event.key === 'Enter') {

            if (!event.shiftKey) {

                // ~ Do not add a newline character
                event.preventDefault();

                // ~ Handle code execution
                const code = textarea.value.trim();
                const output = runLua(lua, code);
                // print(`Flavour: ${output.flavour}`);
                if (output.success) {
                    print(`Result: ${output.result}`);
                } else {
                    print(`Error: ${output.error}`, 'error');
                }
                textarea.value = '';

            } else {

                // ~ Add newline character if Shift + Enter pressed

            }

        }

    });

});