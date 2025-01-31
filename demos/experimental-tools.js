// Toggle the hidden attribute, which sets 'display: none' for an element
function toggleHidden(element) {
    element.hidden = !element.hidden
}

// Add multiple lines of filler to an element for testing
function addFiller(element, lines = 36) {
    element.innerHTML = '<span>text<span><br>'.repeat(lines);
}