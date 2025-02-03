// Constants and Global Declarations
const DEBUG_LEVEL = 0;
let pyodidePromise;
let terminal;
let input;

// Dictionary of terminal commands that will override normal functionality
let commands = {
    'cls': () => terminal.value = '',
}

// List of each user input string
const history = []
let historyIndex = 0;

// Cycle through saved user inputs
function cycleHistory(direction) {

    let length = history.length;
    if (length < 1) {
        return
    }

    if (direction === "down") {
        historyIndex += 1;
    }
    else {
        historyIndex -= 1;
    }
        
    if (historyIndex >= length) {
        historyIndex = 0;
    }
    else if (historyIndex < 0) {
        historyIndex = length - 1;
    }

    let value = history[historyIndex];
    input.value = value;

}

// Function to add string to history
function addToHistory(code) {
    if (history.length === 0 || history[history.length - 1] !== code) {
        history.push(code);
    }
    historyIndex = history.length;
}

// Function to add a line of text to the element with id='terminal'
function addLine(text, flavour = 'default') {
    let line = '>>> ' + input.value + "\n"
    if (text !== "None") {
        line += text + "\n";
    }
    terminal.value += line;
    let message = `[${flavour}] ${line}`;
    console.log(message);
    terminal.scrollTop = terminal.scrollHeight;
}

// Function to process Python output from pyodide.runPython(code)
function processOutput(output) {
    let line = output;
    if (line === undefined) {
        line = "None";
    }
    addLine(line, 'output');
}

// Function to process Python errors from pyodide.runPython(code)
function processError(error) {
    let line = error;
    addLine(line, 'error');
}

// Function to process Python print calls from pyodide.runPython(code)
function processPrint(text) {
    let line = text;
    addLine(line, 'print');
}

// Function to evaluate a given string of Python code
async function evaluatePython(code) {
    let pyodide = await pyodidePromise;
    
    if (code in commands) {
        commands[code]();
        console.log(`User command used '${code}'`);
        return;
    }

    try {
        let output = await pyodide.runPython(code);
        processOutput(output);
    } 
    catch (error) {
        processError(error);
    }
}

// Function to evaluate the current value of the element with id='input'
async function evaluateInput() {
    code = input.value;
    await evaluatePython(code);
    input.value = '';
    addToHistory(code)
}

// Function to allow 'print' statements from Python to be passed to JavaScript
function hijackPrint(pyodide) {
    pyodide.globals.set('print', text => processPrint(text));
}

// Initialisation function to run on 'DOMContentLoaded' event
async function init () {

    input = document.getElementById("input");
    terminal = document.getElementById("terminal");

    // Function to initialise Pyodide and provide pyodidePromise
    async function initialisePyodide() {
        terminal.value += "Python loading...\n";
        let pyodide = await loadPyodide();
        terminal.value += "Python loading complete\n\n";
        return pyodide;
    }
    pyodidePromise = initialisePyodide();

    // Callback code to run on the success of pyodidePromise
    pyodidePromise.then(pyodide => {

        hijackPrint(pyodide)

        // Set text and focus on the #input element
        input.disabled = false;
        input.value = "sum([1, 2, 3])";
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);

        // Add event listener for hotkeys
        document.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowDown') {
                event.preventDefault()
                cycleHistory("down")
            }
            else if (event.key === 'ArrowUp') {
                event.preventDefault()
                cycleHistory("up")
            }
            else if (event.key === 'Escape') {
                input.value = '';
            }
        });

    })

}

// Add listener to run `init` function on 'DOMContentLoaded' event
document.addEventListener('DOMContentLoaded', init);