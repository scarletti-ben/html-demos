
// Set the value of a root variable, in the format --variable
function setRootVariable (property, value) {
    let root = document.documentElement
    root.style.setProperty(property, value);
}

// Initialisation function to be called when the DOM has loaded
async function init() {
    // setRootVariable("--colour-font", "blue")
}

// Add listener to call init function when the DOM has loaded
document.addEventListener('DOMContentLoaded', init);