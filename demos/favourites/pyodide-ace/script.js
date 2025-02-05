// =======================================================
// Constants, Variables, and Global Declarations
// =======================================================

let page = document.getElementById("page");
let toolbarTop = document.getElementById("toolbar-top");
let mainButton = document.querySelector("#toolbar-bottom .icon")

// ! ======================================================
// ! Testing
// ! ======================================================

// Function to add a line to the terminal
function addLine(line, newlines = 1) {
    if (terminal.textContent === '') {
        terminal.textContent = line;
    } 
    else {
        terminal.textContent += '\n'.repeat(newlines) + line;
    }
    terminal.scrollTop = terminal.scrollHeight;
}

// Function to process Python output from pyodide.runPython(code)
function processOutput(output) {
    console.log("Python output has been disabled, use print statements instead");
}

// Function to process Python errors from pyodide.runPython(code)
function processError(error) {
    let line = `[Error] ${[error]}`;
    addLine(line);
}

// Function to process Python print calls from pyodide.runPython(code)
function processPrint(text) {
    let line = `[Print] ${[text]}`;
    addLine(line);
}

// Function to evaluate a given string of Python code
async function evaluatePythonAsync(code) {
    try {
        addLine("[Run Start]", 2)
        let output = await pyodide.runPythonAsync(code);
        processOutput(output);
        addLine("[Run Ended]", 1)
    }
    catch (error) {
        processError(error);
    }
}

// Function to evaluate python code from the editor
async function evaluateEditorAsync() {
    code = editor.getValue();
    await evaluatePythonAsync(code);
}


// Function to allow 'print' statements from Python to be passed to JavaScript
function hijackPrint() {
    pyodide.globals.set('print', text => processPrint(text));
}

let layoutButtons = document.querySelectorAll('[id^="layout-"]');
for (const button of layoutButtons) {
    button.addEventListener("click", () => {
        terminal.style.display = "flex";
        document.getElementById("editor").style.display = "flex";
        page.className = button.id;
    });
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Toggle hidden for the top part of the toolbar 
function toggleToolbar() {
    toolbarTop.classList.toggle("hidden");
}

function editorOnly() {
    terminal.style.display = "none";
    document.getElementById("editor").style.display = "flex";
}

function terminalOnly() {
    document.getElementById("editor").style.display = "none";
    terminal.style.display = "flex";
}

mainButton.addEventListener("click", toggleToolbar);
document.getElementById("editor-only").addEventListener("click", editorOnly);
document.getElementById("terminal-only").addEventListener("click", terminalOnly);
document.getElementById("toggle-fullscreen").addEventListener("click", toggleFullscreen);
document.getElementById("run").addEventListener("click", evaluateEditorAsync);

// =======================================================
// Functionality
// =======================================================

// Ensures Pyodide and Ace have initialised before running
async function main() {
    await aceInit();
    await pyodideInit();
    hijackPrint(pyodide);
}

// =======================================================
// Execution
// =======================================================

main();