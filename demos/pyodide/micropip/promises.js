let terminal;
let pyodide;
let micropip;
let pyodidePromise = loadPyodide();

async function initialisePyodide() {
    terminal.value += "Python loading...\n";
    pyodide = await pyodidePromise;
    terminal.value += "Python loading complete\n";
}

async function installMicropip() {
    await pyodidePromise;
    terminal.value += "Micropip installing...\n";
    await pyodide.loadPackage('micropip')
    micropip = pyodide.pyimport("micropip");
    terminal.value += "Micropip installation complete\n";
}

document.addEventListener("DOMContentLoaded", () => {
    
    terminal = document.querySelector("#terminal");

    allPromises = [
        initialisePyodide(),
        installMicropip()
    ];

    Promise.allSettled(allPromises).then(results => {
        const event = new CustomEvent('allPromisesSettled', { detail: results });
        document.dispatchEvent(event);
    });

});