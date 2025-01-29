// Initialise the editor and settings
var editor = ace.edit("editor");
editor.getSession().setMode("ace/mode/python");
editor.setShowPrintMargin(false);
editor.setShowInvisibles(false);
// editor.container.style.padding = "20px";
editor.setValue(`

def test():
    return 5

value = test()
print(value)

class Thing:
    def __init__(self):
        self.value = 10

thing = Thing()
value = thing.value
print(value)

try:
    5 / 0
except Exception as e:
    print(e)

`.trim());
editor.clearSelection()

// List of Dark Theme Codes
const darkThemes = [
    'ambiance',
    'chaos',
    'clouds_midnight',
    'cobalt',
    'dracula',
    'gob',
    'gruvbox',
    'idle_fingers',
    'kr_theme',
    'merbivore',
    'merbivore_soft',
    'mono_industrial',
    'monokai',
    'pastel_on_dark',
    'solarized_dark',
    'terminal',
    'tomorrow_night',
    'tomorrow_night_blue',
    'tomorrow_night_bright',
    'tomorrow_night_eighties',
    'twilight',
    'vibrant_ink'
];

// List of Light Theme Codes
const lightThemes = [
    'chrome',
    'clouds',
    'crimson_editor',
    'dawn',
    'dreamweaver',
    'eclipse',
    'github',
    'iplastic',
    'katzenmilch',
    'kuroir',
    'solarized_light',
    'sqlserver',
    'textmate',
    'tomorrow',
    'xcode'
];

// Populate the select dropdown
const themeSelector = document.getElementById('themeSelector');

const darkOptgroup = document.createElement('optgroup');
darkOptgroup.label = 'Dark';
themeSelector.appendChild(darkOptgroup);

const lightOptgroup = document.createElement('optgroup');
lightOptgroup.label = 'Light';
themeSelector.appendChild(lightOptgroup);

// Append dark themes to the dark optgroup
for (const themeCode of darkThemes) {
    const option = document.createElement('option');
    option.value = themeCode;
    option.textContent = themeCode;
    darkOptgroup.appendChild(option);
}

// Append light themes to the light optgroup
for (const themeCode of lightThemes) {
    const option = document.createElement('option');
    option.value = themeCode;
    option.textContent = themeCode;
    lightOptgroup.appendChild(option);
}

// Simple function to change theme and ensure selector matches theme
function setTheme(themeCode) {
    themeCode = themeCode.toLowerCase().replace(/ /g, '_');
    let theme = "ace/theme/" + themeCode
    editor.setTheme(theme);
    if (themeSelector.value !== themeCode) {
        themeSelector.value = themeCode
    }
}

// Change the theme based on the selected option
themeSelector.addEventListener('change', function () {
    const themeCode = themeSelector.value;
    setTheme(themeCode)
});

setTheme("mono industrial")

editor.setShowInvisibles(false);

document.addEventListener('click', function() {
    var position = editor.getCursorPosition();
    var token = editor.session.getTokenAt(position.row, position.column);
    console.log(token)
});

document.addEventListener('DOMContentLoaded', function () {

    document.addEventListener('keydown', function(event) {
        if (event.key === 'F1') {
            event.preventDefault()
            var aceElement = document.querySelector('.ace-mono-industrial');
            var computedStyle = window.getComputedStyle(aceElement);
            var backgroundColor = computedStyle.backgroundColor;
            document.body.style.backgroundColor = backgroundColor;
        }
    });

});