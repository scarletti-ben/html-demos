// Constants and Global Declarations
const DEBUG_LEVEL = 0;
let topLine = `
Buttons
    Green   [R]: Run code
    Red     [C]: Clear terminal
    Blue    [S]: Add four spaces
    Orange [CR]: Clear terminal and run code
`
let asyncCode = `

import micropip
await micropip.install('requests')
import requests
modules = micropip.list()
print(f"\\n\\n{modules}\\n")
print(type(requests))

x = requests.get("https://api.dictionaryapi.dev/api/v2/entries/en/hello")
print(type(x))
print(f"Status: {x.status_code}")
print(f"Response: {x.text}")

`

// Function to add a line to the terminal
function addLine(line, newlines = 1) {
    if (terminal.value === '') {
        terminal.value = line;
    }
    else {
        terminal.value += '\n'.repeat(newlines) + line
    }
    terminal.scrollTop = terminal.scrollHeight;
}

// Function to process Python output from pyodide.runPython(code)
function processOutput(output) {
    console.log("Python output has been disabled, use print statements instead");
}

// Function to process Python errors from pyodide.runPython(code)
function processError(error) {
    let line = `[Error] ${[error]}`
    addLine(line)
}

// Function to process Python print calls from pyodide.runPython(code)
function processPrint(text) {
    let line = `[Print] ${[text]}`
    addLine(line)
}

// Function to allow 'print' statements from Python to be passed to JavaScript
function hijackPrint(pyodide) {
    pyodide.globals.set('print', text => processPrint(text));
}

// Add 4 spaces to file.value
function addTab() {
    const spaces = '    ';
    const cursorPosition = file.selectionStart;
    const textBefore = file.value.substring(0, cursorPosition);
    const textAfter = file.value.substring(cursorPosition);
    const textFinal = textBefore + spaces + textAfter;
    file.value = textFinal;
    file.selectionStart = file.selectionEnd = cursorPosition + spaces.length;
    file.focus()
}

// Initialisation function to run on 'DOMContentLoaded' event
async function init() {

    file = document.getElementById("file");
    terminal = document.getElementById("terminal");

    file.value = '';
    // terminal.value = '';

    hijackPrint(pyodide);

    file.disabled = false;
    file.value = asyncCode.trim();
    file.focus();
    file.setSelectionRange(file.value.length, file.value.length);

    document.getElementById("buttonF1").onclick = function () {
        evaluateFileAsync()
    };

    document.getElementById("buttonF2").onclick = function () {
        terminal.value = '';
    };

    document.getElementById("buttonF3").onclick = function () {
        addTab()
    };

    document.getElementById("buttonF4").onclick = function () {
        terminal.value = '';
        evaluateFileAsync()
    };

    file.addEventListener('keydown', function (event) {
        if (event.key == 'Tab') {
            event.preventDefault()
            addTab()
        }
    });

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

// Function to evaluate the current value of the element with id='file'
async function evaluateFileAsync() {
    code = file.value;
    await evaluatePythonAsync(code);
}

// Event listener that only fires when async.js has fulfilled all promises
document.addEventListener('allPromisesSettled', async (event) => {

    for (let result of event.detail) {
        console.log(result.status);
    }

    init();

    terminal.value += topLine;

    // await evaluateFileAsync();

});