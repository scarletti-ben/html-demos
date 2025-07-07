// load-split v1.0.0 [new]
// > ========================================================
// > Type Definitions
// > ========================================================

/**
 * @typedef {Object} SplitInstance
 * @property {function(number[]): void} setSizes - Set the sizes of the split panes
 * @property {function(): number[]} getSizes - Get current sizes of the split panes
 * @property {function(number): void} collapse - Collapse a pane by index
 * @property {function(boolean=, boolean=): void} destroy - Destroy the split instance
 */

/**
 * @typedef {Object} SplitOptions
 * @property {number[]} [sizes] - Initial sizes of panes
 * @property {number|number[]} [minSize] - Minimum size(s) of panes
 * @property {number|number[]} [maxSize] - Maximum size(s) of panes
 * @property {boolean} [expandToMin] - Expand to minimum size
 * @property {number} [gutterSize] - Size of the gutter
 * @property {'center'|'start'|'end'} [gutterAlign] - Alignment of gutter
 * @property {number} [snapOffset] - Snap offset
 * @property {number} [dragInterval] - Drag interval
 * @property {'horizontal'|'vertical'} [direction] - Split direction
 * @property {string} [cursor] - Cursor style
 * @property {function(number, string): HTMLElement} [gutter] - Custom gutter function
 * @property {function(string): Object} [gutterStyle] - Custom gutter style function
 * @property {function(string, number, number): Object} [elementStyle] - Custom element style function
 * @property {function(number[]): void} [onDrag] - Drag callback
 * @property {function(number[]): void} [onDragStart] - Drag start callback
 * @property {function(number[]): void} [onDragEnd] - Drag end callback
 */

/**
 * @typedef {function((HTMLElement|string)[], SplitOptions=): SplitInstance} SplitFunction
 */

// < ========================================================
// < Exported loadSplit Function
// < ========================================================

/**
 * Dynamically load Split.js library via Promise
 * @async
 * @returns {Promise<SplitFunction>} Promise that resolves with Split function
 * @throws {Error} If the script fails to load
 */
export async function loadSplit() {

    if (window.Split) {
        console.log('Split already loaded');
        return Promise.resolve(window.Split);
    };

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/split.js/1.6.2/split.min.js';
        script.onload = () => {
            console.log('Split import successful');
            resolve(window.Split);
        };
        script.onerror = () => {
            let error = new Error('Split import unsuccessful');
            reject(error);
        };
        document.head.appendChild(script);
    });

}