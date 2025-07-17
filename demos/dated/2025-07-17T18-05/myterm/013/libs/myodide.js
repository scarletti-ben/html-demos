// myodide v0.0.19
// < ========================================================
// < Internal Functions
// < ========================================================

/**
 * Dynamically import a module from the given URL
 * @async
 * @param {string} url - The URL to import from
 * @returns {Promise<any>} The imported module
 */
async function _dynamicImport(url) {
    const module = await import(url);
    return module;
}

/**
 * Dynamically import a module and log window alterations
 * @async
 * @param {string} url - The URL to import from
 * @param {string} [name] - Name for logging
 * @returns {Promise<any>} The imported module
 */
async function dynamicImport(url, name) {
    const before = new Set(Object.getOwnPropertyNames(window));
    const module = await _dynamicImport(url);
    const after = new Set(Object.getOwnPropertyNames(window));
    const added = [...after].filter(key => !before.has(key));
    const prefix = name ? `[${name}]` : `[${url}]`;
    console.log(`${prefix} alterations to window:`, added);
    return module;
}

/**
 * Load Pyodide into `window` if not already loaded
 * @async
 * @returns {Promise<any>} A Pyodide instance
 */
async function _loadPyodide() {
    if (!window.loadPyodide) {
        await dynamicImport(
            'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js',
            '[Pyodide]'
        );
    };
    return await window.loadPyodide();
}

// < ========================================================
// < Exported Myodide Class
// < ========================================================

/** 
 * Class to create Pyodide wrapper instances
 * - Myodide instances manage an internal Pyodide instance
 */
export class Myodide {

    // ~ ====================================================
    // ~ Properties
    // ~ ====================================================

    /** @type {any | null} Pyodide instance */
    _pyodide = null;

    /** @type {(message: string) => void} Internal logger function */
    _logger;

    /** @type {(message: string) => void} Internal thrower function */
    _thrower;

    /**
     * Pyodide filesystem object
     * @type {any}
     */
    get fs() {
        return this._pyodide.FS;
    }

    // ~ ====================================================
    // ~ Constructor
    // ~ ====================================================

    /** 
     * Create an object that wraps a Pyodide instance
     * @param {(message: string) => void} [logger] - Optional logging function
     */
    constructor(logger) {
        let func = logger || console.log;
        this._logger = (message) => func(`[Myodide] ${message}`);
        this._thrower = (message) => {
            func(`[Myodide Error] ${message}`);
            throw new Error(`[Myodide] ${message}`)
        };
    }

    // ~ ====================================================
    // ~ Initialisation Method Proper
    // ~ ====================================================

    /**
     * Initialise or reinitialise Myodide / Pyodide
     * - Creates a fresh Pyodide instance each time
     * - Functions as init and reinit
     * @async
     * @returns {Promise<void>}
     */
    async init() {
        if (this._pyodide) {
            this._pyodide = null;
            this._logger('destroyed pyodide instance');
        };
        this._pyodide = await _loadPyodide();
        this._logger('created pyodide instance');
    }

    // ~ ====================================================
    // ~ Code Execution Methods
    // ~ ====================================================

    /**
     * Execute Python code synchronously
     * @param {string} code - Python code to execute
     * @returns {any} Result of execution
     */
    run(code) {
        return this._pyodide.runPython(code);
    }

    /**
     * Execute Python code asynchronously
     * @async
     * @param {string} code - Python code to execute
     * @returns {Promise<any>} Result of execution
     */
    async runAsync(code) {
        return this._pyodide.runPythonAsync(code);
    }

    // ~ ====================================================
    // ~ Filesystem Methods
    // ~ ====================================================

    /**
     * Read a file from the Pyodide filesystem
     * - Reads UTF-8
     * @param {string} path - Pyodide path of the file
     * @returns {string} Text content of the file
     */
    readFile(path) {
        return this.fs.readFile(path, { encoding: 'utf8' });
    }

    /**
     * Write a file to the Pyodide filesystem
     * - Writes UTF-8
     * @param {string} path - Pyodide path for the written file
     * @param {string} content - Text to write to the file
     * @returns {void}
     */
    writeFile(path, content) {
        this.fs.writeFile(path, content, { encoding: 'utf8' });
        this._logger(`${path} written to filesystem`);
    }

    /**
     * Create a directory in the Pyodide filesystem
     * @param {string} path - Pyodide path for the directory
     * @returns {void}
     */
    makeDirectory(path) {
        this.fs.mkdir(path);
    }

    /** 
     * Load files into the Pyodide filesystem
     * - Paths should be server paths, not Pyodide paths
     * - Loads all files into root directory
     * @async
     * @param {string[]} paths - Paths to files on the server
     * @returns {Promise<void>}
     */
    async loadFiles(paths) {
        for (const path of paths) {
            let response = await fetch(path);
            let content = await response.text();
            let filename = path.split('/').pop();
            this.writeFile(filename, content);
        }
    }

    /**
     * Load and unpack a zip archive into the Pyodide filesystem
     * - Unpacks the zip into the filesystem root
     * @param {string} path - Server path to the zip file
     * @returns {Promise<void>}
     */
    async loadZip(path) {
        let response = await fetch(path);
        let buffer = await response.arrayBuffer();
        await this._pyodide.unpackArchive(buffer, 'zip');
        let filename = path.split('/').pop();
        this._logger(`${filename} unpacked into filesystem root`);
    }

}