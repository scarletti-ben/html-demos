// Constants and Global Declarations
const DEBUG_LEVEL = 0;
let topLine = "\nHotkeys\n    F1 [R]: Run code\n    F2 [C]: Clear terminal\n    F3 [S]: Add four spaces";
let pyodidePromise;
let terminal;
let file;
let pythonCode = `

from random import randint as roll

lowest = 1
highest = 20
quantity = 2

for i in range(quantity):
    result = roll(lowest, highest)
    print(f"You rolled a {result}")

`;


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

    // if (output === undefined) {
    //     output = "None"
    // }
    // let line = `[Output] ${[output]}`
    // addLine(line)
    
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

// Function to evaluate a given string of Python code
async function evaluatePython(code) {
    let pyodide = await pyodidePromise;
    
    try {
        addLine("[Run Start]", 2)
        let output = pyodide.runPython(code);
        processOutput(output);
        addLine("[Run End]", 1)
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
async function init () {

    file = document.getElementById("file");
    terminal = document.getElementById("terminal");

    file.value = '';
    terminal.value = '';

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
        file.value = pythonCode.trim();
        file.focus();
        file.setSelectionRange(file.value.length, file.value.length);

        // Add event listener for hotkeys
        document.addEventListener('keydown', function(event) {
            if (event.key === 'F1'){
                event.preventDefault()
                evaluateFile()
            }
            else if (event.key === 'F2') {
                event.preventDefault()
                // terminal.value = topLine;
                terminal.value = '';
            }
            else if (event.key === 'F3') {
                event.preventDefault()
                addTab()
            }
        });

        // Add functionality to the F1 button, for mobile users
        document.getElementById("buttonF1").onclick = function() {
            evaluateFile()
        };

        // Add functionality to the F2 button, for mobile users
        document.getElementById("buttonF2").onclick = function() {
            // terminal.value = topLine;
            terminal.value = '';
        };

        // Add functionality to the F3 button, for mobile users
        document.getElementById("buttonF3").onclick = function() {
            addTab()
        };

        // Add event listener to conver Tab press into 4 spaces
        file.addEventListener('keydown', function(event) {
            if (event.key == 'Tab') {
                event.preventDefault()
                addTab()
            }
        });

    })

}

// Add listener to run `init` function on 'DOMContentLoaded' event
document.addEventListener('DOMContentLoaded', init);