// Constants and Global Declarations
const DEBUG_LEVEL = 0;
let topLine = "Press F1 to run code, F2 to clear terminal\n\n";
let pyodidePromise;
let terminal;
let file;
let fileContents = "import random\nrandom.random()";

// Function to process Python output from pyodide.runPython(code)
function processOutput(output) {
    if (output === undefined) {
        output = "None"
    }
    terminal.value += '\n\n[Output] ' + output;
    terminal.scrollTop = terminal.scrollHeight;
}

// Function to process Python errors from pyodide.runPython(code)
function processError(error) {
    terminal.value += '\n\n[Error] ' + error;
    terminal.scrollTop = terminal.scrollHeight;
}

// Function to process Python print calls from pyodide.runPython(code)
function processPrint(text) {
    terminal.value += '\n\n[Print] ' + text;
    terminal.scrollTop = terminal.scrollHeight;
}

// Function to evaluate a given string of Python code
async function evaluatePython(code) {
    let pyodide = await pyodidePromise;
    
    try {
        let output = pyodide.runPython(code);
        processOutput(output);
    } 
    catch (error) {
        processError(error);
    }
}

// Function to evaluate the current value of the element with id='file'
async function evaluateFile() {
    code = file.value;
    await evaluatePython(code);
}

// Function to allow 'print' statements from Python to be passed to JavaScript
function hijackPrint(pyodide) {
    pyodide.globals.set('print', text => processPrint(text));
}

// Initialisation function to run on 'DOMContentLoaded' event
async function init () {

    file = document.getElementById("file");
    terminal = document.getElementById("terminal");

    // Function to initialise Pyodide and provide pyodidePromise
    async function initialisePyodide() {
        terminal.value += "Python loading...\n";
        let pyodide = await loadPyodide();
        terminal.value += "Python loading complete\n";
        terminal.value += topLine;
        return pyodide;
    }
    pyodidePromise = initialisePyodide();

    // Callback code to run on the success of pyodidePromise
    pyodidePromise.then(pyodide => {

        hijackPrint(pyodide);

        file.disabled = false;
        file.value = fileContents;
        file.focus();
        file.setSelectionRange(file.value.length, file.value.length);

        // Add event listener for hotkeys
        document.addEventListener('keydown', function(event) {
            if (event.key === 'F1'){
                event.preventDefault()
                evaluateFile()
            }
            else if (event.key === 'F2') {
                terminal.value = topLine;
            }
        });

        // Add functionality to the F1 button, for mobile users
        document.getElementById("buttonF1").onclick = function() {
            evaluateFile()
        };

        // Add functionality to the F2 button, for mobile users
        document.getElementById("buttonF2").onclick = function() {
            terminal.value = topLine;
        };

        // Add event listener to conver Tab press into 4 spaces
        file.addEventListener('keydown', function(event) {
            if (event.key == 'Tab') {
                event.preventDefault()
                const spaces = '    ';
                const cursorPosition = file.selectionStart;
                const textBefore = file.value.substring(0, cursorPosition);
                const textAfter = file.value.substring(cursorPosition);
                const textFinal = textBefore + spaces + textAfter;
                file.value = textFinal;
                file.selectionStart = file.selectionEnd = cursorPosition + spaces.length;
            }
        });

    })

}

// Add listener to run `init` function on 'DOMContentLoaded' event
document.addEventListener('DOMContentLoaded', init);