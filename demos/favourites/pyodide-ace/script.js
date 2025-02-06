// =======================================================
// Constants, Variables, and Global Declarations
// =======================================================

let userID = "1336348896317857792";
let packageNames = ["requests", "pillow", "numpy"];
let page = document.getElementById("page");
let toolbarTop = document.getElementById("toolbar-top");
let mainButton = document.querySelector("#toolbar-bottom .icon");
const defaultText = ``;

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

// Disable default save site functionality
document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
    }
});

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

function getDateString() {
    var currentdate = new Date();
    let pad = (value) => `0${value}`.slice(-2);
    var YYYY = currentdate.getFullYear();
    var MM = pad(currentdate.getMonth() + 1);
    var DD = pad(currentdate.getDate());
    var HH = pad(currentdate.getHours());
    var mm = pad(currentdate.getMinutes());
    var ss = pad(currentdate.getSeconds());
    return `${YYYY}-${MM}-${DD}_${HH}-${mm}-${ss}`
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

document.getElementById("tool-1").addEventListener("click", () => {
    let dateString = getDateString();
    addLocalSnippet(dateString, editor.getValue());
    terminal.textContent += "added local snippet\n";
});

document.getElementById("tool-2").addEventListener("click", () => {
    updateStorage(userID, userData);
    terminal.textContent += "updated external snippets\n";
});

document.getElementById("tool-3").addEventListener("click", () => {
    loadSnippet(editor);
    terminal.textContent += "loaded snippet to editor\n";
});

document.getElementById("tool-4").addEventListener("click", () => {
    terminal.textContent += "opening raw JSON in new tab\n";
    openRaw(userID);
});

document.getElementById("tool-5").addEventListener("click", () => {
    terminal.textContent += "deleting recent local snippet\n";
    deleteLocalSnippet();
});

document.getElementById("tool-6").addEventListener("click", () => {
    terminal.textContent += "saving to local file\n";
    let filename = "test.py";
    saveToFile(filename, editor);
});

document.getElementById("tool-7").addEventListener("click", () => {
    terminal.textContent += "loading from local file\n";
    loadFromFile(editor);
    editor.clearSelection();
});

document.getElementById("tool-8").addEventListener("click", () => {
    editor.setValue("");
});

document.getElementById("tool-9").addEventListener("click", () => {
    terminal.textContent = "";
});

document.getElementById("tool-10").addEventListener("click", () => {
    let dateString = getDateString();
    addLocalSnippet(dateString, editor.getValue());
    terminal.textContent += `added local snippet with date ${dateString}\n`;
    updateStorage(userID, userData);
    terminal.textContent += "updated external snippets\n";
});

// =======================================================
// Functionality
// =======================================================

// Ensures Pyodide and Ace have initialised before running
async function main() {
    await aceInit();
    await pyodideInit(packageNames);
    hijackPrint(pyodide);
    await storageInit(userID);
    console.log(snippets);
}

// =======================================================
// Execution
// =======================================================

main();