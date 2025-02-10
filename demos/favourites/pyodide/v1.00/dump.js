// Get the CSS styling for the editor
function getEditorCSS() {
    let theme = editor.getTheme();
    let name = theme.split('/')[2]
    let selector = `.ace-${name}`
    let element = document.querySelector(selector);
    var computedStyle = window.getComputedStyle(element);
    return computedStyle
}

// Get the CSS styling for the editor gutter
function getGutterCSS() {
    let selector = `.ace_gutter`
    let element = document.querySelector(selector);
    var computedStyle = window.getComputedStyle(element);
    return computedStyle
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'F6') {
        event.preventDefault()
        let theme = getThemeCSS();
        var backgroundColor = theme.backgroundColor;
        document.body.style.backgroundColor = backgroundColor;
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'F7') {
        event.preventDefault()
        let theme = getGutterCSS();
        var backgroundColor = theme.backgroundColor;
        document.body.style.backgroundColor = backgroundColor;
    }
});

// Ace scroller?