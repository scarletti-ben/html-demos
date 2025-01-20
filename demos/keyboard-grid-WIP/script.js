// Function to change stylesheet file based on selection
function switchStylesheet() {
    const style = document.getElementById('stylesheetSelector').value;
    const stylesheet = document.getElementById('stylesheet')
    stylesheet.href = style;
}

// Listener to run once the HTML DOM has fully loaded
document.addEventListener('DOMContentLoaded', function () {
    
});

