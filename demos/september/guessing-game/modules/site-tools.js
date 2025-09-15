/**
 * General site tools
 * 
 * @module site-tools
 * @author Ben Scarletti
 * @since 2025-09-03
 * @see {@link https://github.com/scarletti-ben}
 * @license MIT
 */

// ~ ======================================================
// ~ Functions: Exportable
// ~ ======================================================

/**
 * Decode a `Base64` string to bytes
 * 
 * @param {string} base64String - The `Base64` string to decode
 * @returns {ArrayBuffer}  The decoded bytes as an `ArrayBuffer`
 */
function base64ToBytes(base64String) {
    const byteString = window.atob(base64String);
    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
    }
    return byteArray.buffer;
}

/**
 * Encode bytes to a `Base64` string
 * 
 * @param {ArrayBuffer | Uint8Array} buffer - The bytes as `ArrayBuffer` or `Uint8Array`
 * @returns {string} The encoded `Base64` string
 */
function bytesToBase64(buffer) {
    let byteString = '';
    const byteArray = new Uint8Array(buffer);
    for (let i = 0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
    }
    return window.btoa(byteString);
}

/**
 * Create an array of numbers from `0` to `n - 1`
 * 
 * @param {number} n - The end number (exclusive)
 * @returns {Array<number>} An array containing the sequence `0` to `n - 1`
 */
function range(n) {
    return [...Array(n).keys()];
}

/**
 * Create an array of numbers from `0` to `n - 1`
 * 
 * @param {number} n - The end number (exclusive)
 * @returns {Array<number>} An array containing the sequence `0` to `n - 1`
 */
function range_01(n) {
    return Array.from({ length: n }, (_, i) => i);
}

/**
 * Execute a function n times, passing current index to the function
 * 
 * @param {number} n - Number of times to repeat
 * @param {(i: number) => void} func - Function to execute, uses current index
 * @example 
 * repeat(5, (i) => console.log(i))
 */
function repeat(n, func) {
    for (let i = 0; i < n; i++) {
        func(i);
    }
}

/** 
 * Get a random item from an array
 * 
 * @template T
 * @param {Array<T>} array - The array
 * @returns {T} The random item from the array
 */
function choice(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

/** 
 * Create a `Promise` time delay
 * 
 * @param {number} ms - Time to delay [1000ms]
 * @returns {Promise<void>} The `Promise` time delay
 * @example 
 * await delay(2000)
 * delay(4000).then(() => console.log('finished'))
 */
function delay(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/** 
 * Select all text within an element
 * 
 * @param {HTMLElement} element - The element to select text from
 */
function selectAllText(element) {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

/**
 * Reflow an element via attribute access
 * 
 * @param {HTMLElement} element - The element to reflow
 */
function reflow(element) {
    void element.offsetWidth;
}

/**
 * Convert a serialisable `JavaScript` value to a `JSON` string
 * 
 * @param {*} value - The value to serialise
 * @param {number} indent - The number of spaces to indent [2]
 * @returns {string} The `JSON` string representation of the value
 * @throws If the value is not serialisable to `JSON`
 */
function serialise(value, indent = 2) {
    return JSON.stringify(value, null, indent);
}

/**
 * Convert a serialised `JSON` string to a `JavaScript` value
 * 
 * @param  {string} str `JSON` string representation of the value
 * @throws If the text is not valid `JSON`
 */
function unserialise(str) {
    return JSON.parse(str);
}

/**
 * Download text as a file
 * 
 * @param {string} text - The text to download
 * @param {string} filename The name for the file ['text.txt']
 */
function downloadText(text, filename = 'text.txt') {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}

/**
 * View text in a new tab
 * 
 * @param {string} text - The text to view
 */
function viewText(text) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}

/**
 * Download serialisable data as a file
 * 
 * @param {*} data - The data to serialise and download
 * @param {string} filename The filename of the file ['data.json']
 * @throws If the data is not serialisable
 */
function downloadData(data, filename = 'data.json') {
    const text = JSON.stringify(data, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}

/**
 * View serialisable data in a new tab
 * 
 * @param {*} data - The data to view
 * @throws If the data is not serialisable
 */
function viewData(data) {
    const text = JSON.stringify(data, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}

/**
 * View link in a new tab
 * 
 * @param {string} url - The url for the link
 */
function viewLink(url) {
    window.open(url, "_blank");
}

/**
 * Remove an item from an array, in place
 * 
 * @template T
 * @param {Array<T>} array - The array to remove the item from
 * @param {T} item - The item to remove from the array
 * @returns {Array<T>} The spliced array of deleted elements
 * @throws If the item is not found in the array
 */
function remove(array, item) {
    const index = array.indexOf(item);
    if (index !== -1) {
        return array.splice(index, 1);
    }
    throw new Error(`UserError: item not in array`);
}

/** 
 * Assert that a condition is truthy
 * 
 * @param {boolean} condition - The condition to check
 * @param {string?} message - The message if the condition is not truthy
 * @throws If the condition is not truthy
 * @throws If the condition is not boolean type
 */
function assert(condition, message = null) {
    if (typeof condition !== 'boolean') throw new Error('Expected a boolean');
    if (condition) return;
    let error = `AssertionError`;
    if (message) {
        error += `: ${message}`;
    }
    throw new Error(error);
}

/**
 * Generate a random integer from `min` to `max` (both inclusive)
 * 
 * @param {number} min - The minimum value (will be rounded up)
 * @param {number} max - The maximum value (will be rounded down)
 * @returns {number} A random integer `min <= n <= max`
 */
function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * Generate a random integer from `min` to `max` (both inclusive)
 * 
 * @param {number} min - The minimum integer value
 * @param {number} max - The maximum integer value
 * @returns {number} A random integer `min <= n <= max`
 */
function randint_01(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * Generate a random boolean
 * 
 * @returns {boolean} A random boolean
 */
function randbool() {
    return Math.random() > 0.5;
}

/** 
 * Clamp a value between `min` and `max`
 * 
 * @param {number} value - The value to clamp
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @returns {number} The clamped value
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Sort an array using a function, with optional reverse
 * 
 * @template T
 * @param {Array<T>} array - The array to sort
 * @param {(item: T) => number} func - Function that returns a sort value
 * @param {boolean} reverse - Option to reverse the sort order [false]
 * @returns {Array<T>} The sorted array
 */
function sort(array, func, reverse = false) {
    return array.sort((a, b) => {
        const comparison = func(a) - func(b);
        return reverse ? -comparison : comparison;
    });
}

/** 
 * Shuffle an array using an unbiased Fisher–Yates shuffle
 * 
 * @param {Array} array - The array to shuffle
 */
function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

/** 
 * Toggle class state of an element
 * 
 * @param {Element} element The element
 * @param {string} name The class to toggle the state of
 * @param {boolean} [force] Option to force state for the class
 * @returns {boolean} The final state of the class
 */
function toggleClass(element, name, force) {
    return element.classList.toggle(name, force);
}

/** 
 * Toggle state of a dataset attribute of an element
 * 
 * @param {HTMLElement} element The element
 * @param {string} name The dataset attribute to toggle the state of
 * @param {boolean} [force] Option to force state for the dataset attribute
 * @returns {boolean} The final state of the dataset attribute
 */
function toggleAttribute(element, name, force) {
    const attribute = `data-${name}`;
    const currentStr = element.getAttribute(attribute);
    const currentBool = currentStr === 'true';
    const newBool = force ? force : !currentBool;
    const newStr = String(newBool);
    element.setAttribute(attribute, newStr);
    return newBool;
}

/** 
 * Toggle state of a dataset attribute of an element
 * 
 * @param {HTMLElement} element The element
 * @param {string} name The dataset attribute to toggle the state of
 */
function toggleAttribute_01(element, name) {
    const dataset = element.dataset;
    const current = dataset[name] === 'true';
    dataset[name] = !current;
}

/** 
 * Set the value of a root variable (inline)
 * 
 * @param {string} name The name of the root variable, without `--`
 * @param {string} value The value of the root variable, as a string
 * @example
 * setRootVariable('u', '32px')
 */
function setRootVariable(name, value) {
    document.documentElement.style.setProperty(`--${name}`, value);
}

/**
 * Flash an element by giving it a temporary green overlay
 * 
 * @param {HTMLElement} element - The element to flash
 * @param {number} duration - Duration of the flash [400ms]
 */
function flashGreen(element, duration = 400) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: green;
        opacity: 0;
        pointer-events: none;
        z-index: 9999;
        transition: opacity ${duration / 2}ms ease-out;
    `;
    element.appendChild(overlay);
    reflow(element);
    overlay.style.opacity = '1';
    setTimeout(() => overlay.style.opacity = '0', duration / 2);
    setTimeout(() => overlay.remove(), duration);
}

/** 
 * Fetch text from a URL
 * 
 * @param {string} url The URL with a `.text` response
 * @returns {Promise<string>} Promise of the text
 * @throws For an unsuccessful fetch
 */
async function fetchText(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error: status ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        throw new Error('Fetch error', { cause: error });
    }
}

/** 
 * Fetch binary data from a URL as an `ArrayBuffer`
 * 
 * @param {string} url The URL with a binary response
 * @returns {Promise<ArrayBuffer>} Promise of the binary data as an `ArrayBuffer`
 * @throws For an unsuccessful fetch
 */
async function fetchBinary(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error: status ${response.status}`);
        }
        return await response.arrayBuffer();
    } catch (error) {
        throw new Error('Fetch error', { cause: error });
    }
}

/** 
 * Fetch binary data from a URL as a `Blob`
 * 
 * @param {string} url The URL with a binary response
 * @returns {Promise<Blob>} Promise of the binary data as a `Blob`
 * @throws For an unsuccessful fetch
 */
async function fetchBlob(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error: status ${response.status}`);
        }
        return await response.blob();
    } catch (error) {
        throw new Error('Fetch error', { cause: error });
    }
}

/** 
 * Fetch `CSV` from a URL, parsed to a `JavaScript` array
 * 
 * @param {string} url The URL of the `.csv` file
 * @returns {Promise<any[]>} Promise of the parsed array
 * @throws For an unsuccessful fetch
 * @throws If there is an error when parsing
 */
async function fetchCSV(url) {
    let text = await fetchText(url);
    text = text.replace(/\r\n/g, "\n").trim();
    const lines = text.split("\n");
    return lines.map(line => line.split(","));
}

/** 
 * Fetch `JSON` from a URL, parsed to a `JavaScript` object
 * 
 * @param {string} url The URL with a `.json` response
 * @returns {Promise<any>} Promise of the parsed object
 * @throws For an unsuccessful fetch
 * @throws If there is an error when parsing to `JavaScript`
 */
async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error: status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error('Fetch error', { cause: error });
    }
}

/** 
 * Fetch `.svg` file from URL as an `<svg>` element
 * 
 * @param {string} url The URL for the `.svg` file
 * @param {boolean} hidden Option to hide `<svg>` [true]
 * @returns {Promise<SVGElement>} Promise of the `<svg>` element
 * @throws For an unsuccessful fetch
 */
async function fetchSVGElement(url, hidden = true) {
    const text = await fetchText(url);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = text;
    const svg = wrapper.firstElementChild;
    if (hidden) {
        svg.style.display = 'none';
    }
    return svg;
}

/** 
 * Create an `<svg>` element using symbol id from the DOM
 * 
 * @param {string} id The symbol id from the DOM
 * @returns {SVGElement} The `<svg>` element
 */
function createSVGElement(id) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${id}`);
    svg.appendChild(use);
    return svg;
}

/** 
 * Create a `<div>` element
 * 
 * @param {Record<string, string>} styles - Optional styling for the `<div>`
 * @returns {HTMLDivElement} The `<div>` element
 */
function createDiv(styles = {}) {
    const div = document.createElement('div');
    Object.assign(div.style, styles);
    return div;
}

/** 
 * Create a `<button>` element
 * 
 * @param {string} text The text to show inside the `<button>`
 * @param {string} title The tooltip text to show on hover
 * @param {(event: Event) => void} func The function for `onclick`
 * @returns {HTMLButtonElement} The `<button>` element
 */
function createButton(text, title, func) {
    const button = document.createElement('button');
    button.textContent = text;
    button.title = title;
    button.onclick = func;
    return button;
}

/** 
 * Create a `<button>` element
 * 
 * @param {string} text The text to show inside the `<button>`
 * @param {string} title The tooltip text to show on hover
 * @param {(event: Event) => void} func The function for the 'click' event listener
 * @returns {HTMLButtonElement} The `<button>` element
 */
function createButton_01(text, title, func) {
    const button = document.createElement('button');
    button.textContent = text;
    button.title = title;
    button.addEventListener('click', func);
    return button;
}

/** 
 * Create a `<button>` element
 * 
 * @param {string} text The text to show inside the `<button>`
 * @param {string} title The tooltip text to show on hover
 * @param {(event: Event, button: HTMLButtonElement) => void} func The function for the 'click' event listener
 * @returns {HTMLButtonElement} The `<button>` element
 */
function createButton_02(text, title, func) {
    const button = document.createElement('button');
    button.textContent = text;
    button.title = title;
    button.addEventListener('click', (event, button) => func(event, button));
    return button;
}

/**
 * Create a `<div>` element
 *
 * @param {Object} options - Options for the `<div>`
 * @param {string} options.id - Optional id for the `<div>`
 * @param {string[]} options.classes - Optional classes for the `<div>`
 * @param {Record<string, string>} options.styles - Optional styling for the `<div>`
 * @returns {HTMLDivElement} The `<div>` element
 */
function createDiv_01({ id = '', classes = [], styles = {} } = {}) {
    const div = document.createElement('div');
    div.id = id;
    div.classList.add(...classes);
    Object.assign(div.style, styles);
    return div;
}

/**
 * Parse `HTML` string to a DOM element
 * 
 * @param {string} html - The `HTML` string to parse
 * @returns {Element|null} The DOM element, null if invalid
 */
function parseToElement(html) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const element = wrapper.firstElementChild;
    return element;
}

/**
 * Create `<style>` element from `CSS` rules string
 * 
 * @param {string} rules - The `CSS` rules string
 * @returns {HTMLStyleElement} The `<style>` element
 */
function createStyleElement(rules) {
    const style = document.createElement('style');
    style.textContent = rules;
    return style;
}

/**
 * Write a raw string to a local storage key
 * 
 * @param {string} value The string to write
 * @param {string} key The key to write to
 */
function writeLocalStorageRaw(value, key) {
    window.localStorage.setItem(key, value);
}

/**
 * Read a raw string from a local storage key
 * 
 * @param {string} key The key to read from
 * @returns {string} The raw string
 * @throws If the key does not exist
 */
function readLocalStorageRaw(key) {
    const value = window.localStorage.getItem(key);
    if (value == null) throw new Error(`Key does not exist: ${key}`);
    return value;
}

/**
 * Format a `Date` object as a plain object
 * 
 * @param {Date} date The `Date` object to format
 * @returns The formatted date as a plain object
 */
function dateToPlain(date) {
    return {
        YYYY: String(date.getFullYear()),
        MM: String(date.getMonth() + 1).padStart(2, '0'),
        DD: String(date.getDate()).padStart(2, '0'),
        HH: String(date.getHours()).padStart(2, '0'),
        mm: String(date.getMinutes()).padStart(2, '0'),
        SS: String(date.getSeconds()).padStart(2, '0'),
        sss: String(date.getMilliseconds()).padStart(2, '0'),
    }
}

/**
 * Format a `Date` object as a string `YYYY-MM-DD`
 * 
 * @param {Date} date The `Date` object to format
 * @returns The formatted date as a string
 */
function dateToString(date) {
    const YYYY = String(date.getFullYear());
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const DD = String(date.getDate()).padStart(2, '0');
    return `${YYYY}-${MM}-${DD}`;
}

/**
 * Format a `Date` object as a string `YYYY-MM-DDTHH-mm`
 * 
 * @param {Date} date The `Date` object to format
 * @returns The formatted date as a string
 */
function dateToString_01(date) {
    const YYYY = String(date.getFullYear());
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const DD = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${YYYY}-${MM}-${DD}T${HH}-${mm}`;
}

/**
 * Format a `Date` object as a string `YYYY-MM-DDTHH-mm-SS`
 * 
 * @param {Date} date The `Date` object to format
 * @returns The formatted date as a string
 */
function dateToString_02(date) {
    const YYYY = String(date.getFullYear());
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const DD = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const SS = String(date.getSeconds()).padStart(2, '0');
    return `${YYYY}-${MM}-${DD}T${HH}-${mm}-${SS}`;
}

/** 
 * Assert that an argument is a non-empty string
 * 
 * @param {*} arg The argument to check
 * @throws If the argument fails the check
 */
function assertFilledString(arg) {
    if (typeof arg !== 'string' || arg.trim().length === 0) {
        throw new Error(`Expected non-empty string`);
    }
}

/** 
 * Assert that an argument is a non-empty string
 * 
 * @param {*} arg The argument to check
 * @throws If the argument fails the check
 */
function assertFilledString_01(arg) {
    assert(
        typeof arg === 'string' && arg.trim().length > 0,
        `Expected non-empty string`
    );
}

/** 
 * Get a object for interacting with search parameters
 * 
 * @returns {URLSearchParams} Object for interacting with search parameters
 * @example
 * const params = getSearchParameters()
 * const thing = params.get('thing')
 */
function getSearchParameters() {
    const params = new URLSearchParams(window.location.search);
}

/**
 * Find element by selector, with type hinting
 * 
 * @template {keyof HTMLElementTagNameMap} [T='div']
 * @param {string} selector The element selector
 * @param {T} [tagName] The tag name for type hint
 * @returns {HTMLElementTagNameMap[T]} The element
 * @throws If the element is not found
 */
function find(selector, tagName) {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`Element not found: ${selector}`);
    }
    return element;
}

// < ======================================================
// < Functions: Checks
// < ======================================================

/**
 * Check that an argument is a boolean
 * 
 * @param {*} arg The argument to check
 * @returns {boolean} `true` if the argument passes the check
 */
function isBoolean(arg) {
    return typeof arg === 'boolean';
}

/**
 * Check that an argument is a string
 * 
 * @param {*} arg The argument to check
 * @returns {boolean} `true` if the argument passes the check
 */
function isString(arg) {
    return (
        typeof arg === 'string'
    );
}

/**
 * Check that an argument is a non-empty string
 * 
 * @param {*} arg The argument to check
 * @returns {boolean} `true` if the argument passes the check
 */
function isNonEmptyString(arg) {
    return (
        isString(arg) &&
        arg.trim().length > 0
    );
}

/**
 * Check that an argument is an array
 * 
 * @param {*} arg The argument to check
 * @returns {boolean} `true` if the argument passes the check
 */
function isArray(arg) {
    return (
        Array.isArray(arg)
    );
}

/**
 * Check that an argument is a non-empty array
 * 
 * @param {*} arg The argument to check
 * @returns {boolean} `true` if the argument passes the check
 */
function isNonEmptyArray(arg) {
    return (
        isArray(arg) &&
        arg.length > 0
    );
}

/**
 * Check that an argument is a plain object
 * 
 * @param {*} arg The argument to check
 * @returns {boolean} `true` if the argument passes the check
 */
function isPlainObject(arg) {
    return (
        arg != null &&
        typeof arg === 'object' &&
        !Array.isArray(arg)
    );
}

/**
 * Check that an argument is a non-empty plain object
 * 
 * @param {*} arg The argument to check
 * @returns {boolean} `true` if the argument passes the check
 */
function isNonEmptyPlainObject(arg) {
    return (
        isPlainObject(arg) &&
        Object.keys(arg).length > 0
    );
}

// < ======================================================
// < Functions: Assertions
// < ======================================================

/**
 * Assert that an argument is a boolean
 * 
 * @param {*} arg The argument to check
 * @throws If the argument fails the check
 */
function assertBoolean(arg) {
    assert(
        isBoolean(arg),
        `Expected a boolean`
    );
}

/**
 * Assert that an argument is a string
 * 
 * @param {*} arg The argument to check
 * @throws If the argument fails the check
 */
function assertString(arg) {
    assert(
        isString(arg),
        `Expected a string`
    );
}

/**
 * Assert that an argument is a non-empty string
 * 
 * @param {*} arg The argument to check
 * @throws If the argument fails the check
 */
function assertNonEmptyString(arg) {
    assert(
        isNonEmptyString(arg),
        `Expected a non-empty string`
    );
}

/**
 * Assert that an argument is an array
 * 
 * @param {*} arg The argument to check
 * @throws If the argument fails the check
 */
function assertArray(arg) {
    assert(
        isArray(arg),
        `Expected an array`
    );
}

/**
 * Assert that an argument is a non-empty array
 * 
 * @param {*} arg The argument to check
 * @throws If the argument fails the check
 */
function assertIsNonEmptyArray(arg) {
    assert(
        isNonEmptyArray(arg),
        `Expected a non-empty array`
    );
}

/**
 * Assert that an argument is a plain object
 * 
 * @param {*} arg The argument to check
 * @throws If the argument fails the check
 */
function assertIsPlainObject(arg) {
    assert(
        isPlainObject(arg),
        `Expected a plain object`
    );
}

/**
 * Assert that an argument is a non-empty plain object
 * 
 * @param {*} arg The argument to check
 * @throws If the argument fails the check
 */
function assertIsNonEmptyPlainObject(arg) {
    assert(
        isNonEmptyPlainObject(arg),
        `Expected a non-empty plain object`
    );
}

// < ======================================================
// < Functions: Miscellaneous
// < ======================================================

/** 
 * Set the value of a key in `<body>` dataset
 * - Seen in the DOM as `data-key=value`
 * 
 * @param {string} key The dataset attribute to set
 * @param {string} value The value to set it to
 * @example
 * setBodyKey('theme', 'sunset');
 */
function setBodyKey(key, value) {
    document.body.dataset[key] = value;
}

/**
 * Clear a record in-place
 * - Original references to the record remain intact
 * 
 * @param {Record<string, any>} record The record to clear
 */
function clearRecord(record) {
    for (const key in record) {
        delete record[key];
    }
}

/**
 * Clear an array in-place
 * - Original references to the array remain intact
 * 
 * @param {Array} array The array to clear
 */
function clearArray(array) {
    array.length = 0;
}

/** 
 * Get the names of all themes accessible to the DOM
 * - Finds all theme names in the format `[data-theme="name"]`
 * 
 * @returns {Set<string>} The set of all accessible theme names
 */
function getThemes() {

    const pattern = /\[data-theme="([^"]+)"\]/g;
    const themes = new Set();
    for (const sheet of document.styleSheets) {
        try {
            if (!sheet.cssRules) continue;
            for (const rule of sheet.cssRules) {
                if (rule instanceof CSSStyleRule) {
                    const matches = rule.selectorText.matchAll(pattern);
                    for (const match of matches) {
                        const theme = match[1];
                        themes.add(theme);
                    }
                }
            }
        } catch (error) {
            console.warn('Cannot access stylesheet rules:', sheet.href || 'inline style', error);
            continue;
        }
    }
    return [...themes];

}

// < ======================================================
// < Classes: Miscellaneous
// < ======================================================

/** 
 * Array wrapper for iterating forward or backward
 * 
 * @example
 * const colours = ['red', 'green', 'blue']
 * const cycle = new Cycle(colours)
 * const colour = cycle.random()
 * console.log(colour)
 */
class Cycle {

    /** @type {any[]} The array of values to cycle */
    values;

    /** @type {any} The current value */
    value;

    /** 
     * @param {any[]} values The array of values to cycle
     */
    constructor(values) {
        this.values = values;
        this.value = this.values[0];
    }

    /** 
     * Switch to the next value
     * 
     * @returns {any} The value cycled to
     */
    next() {
        let i = this.values.indexOf(this.value);
        i = (i + 1) % this.values.length;
        this.value = this.values[i];
        return this.value;
    }

    /** 
     * Switch to the previous value
     * 
     * @returns {any} The value cycled to
     */
    previous() {
        let i = this.values.indexOf(this.value);
        i = (i - 1 + this.values.length) % this.values.length;
        this.value = this.values[i];
        return this.value;
    }

    /** 
     * Switch to a random value
     * 
     * @returns {any} The value cycled to
     */
    random() {
        const i = Math.floor(Math.random() * this.values.length);
        this.value = this.values[i];
        return this.value;
    }

}

// > ======================================================
// > Exports
// > ======================================================

export {
    assert,
    assertBoolean,
    assertString,
    assertNonEmptyString,
    assertArray,
    assertIsNonEmptyArray,
    assertIsPlainObject,
    assertIsNonEmptyPlainObject,
    assertFilledString,
    assertFilledString_01,
    base64ToBytes,
    bytesToBase64,
    range,
    range_01,
    repeat,
    choice,
    delay,
    selectAllText,
    reflow,
    serialise,
    unserialise,
    downloadText,
    viewText,
    downloadData,
    viewData,
    viewLink,
    remove,
    randint,
    randint_01,
    randbool,
    clamp,
    sort,
    shuffle,
    toggleClass,
    toggleAttribute,
    toggleAttribute_01,
    setRootVariable,
    flashGreen,
    fetchText,
    fetchBinary,
    fetchBlob,
    fetchJSON,
    fetchCSV,
    fetchSVGElement,
    createSVGElement,
    createDiv,
    createDiv_01,
    createButton,
    createButton_01,
    createButton_02,
    parseToElement,
    createStyleElement,
    writeLocalStorageRaw,
    readLocalStorageRaw,
    dateToPlain,
    dateToString,
    dateToString_01,
    dateToString_02,
    getSearchParameters,
    find,
    isBoolean,
    isString,
    isNonEmptyString,
    isArray,
    isNonEmptyArray,
    isPlainObject,
    isNonEmptyPlainObject,
    setBodyKey,
    clearArray,
    clearRecord,
    getThemes,
    Cycle
}