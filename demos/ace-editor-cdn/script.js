// Initialise the editor and settings
var editor = ace.edit("editor");
editor.getSession().setMode("ace/mode/python");
editor.setShowPrintMargin(false);
editor.setShowInvisibles(false);
editor.renderer.setPadding(8);
editor.renderer.setScrollMargin(16, 0, 0, 0);
editor.session.setOption("wrap", true);
editor.setOption("displayIndentGuides", false)
editor.setOption("showInvisibles", false);
editor.getSession().setTabSize(4);
editor.getSession().setUseSoftTabs(true);

editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});

// editor.getSession().completer.autoSelect = true;

let pythonCode = `

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
    
`

// Reset text to demo text
function resetText() {
    editor.setValue(pythonCode.trim());
    editor.clearSelection()
    console.log("test reset")
}
document.getElementById('reset-button').addEventListener('click', resetText);
resetText()

// Autosave every 10 seconds
setInterval(() => {
    localStorage.setItem('userCode', editor.getValue());
    console.log("autosaved")
}, 10000);

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
    localStorage.setItem('selectedTheme', themeCode);
    if (themeSelector.value !== themeCode) {
        themeSelector.value = themeCode
    }
}

// Change the theme based on the selected option
themeSelector.addEventListener('change', function () {
    const themeCode = themeSelector.value;
    setTheme(themeCode)
});

document.addEventListener('click', function() {
    var position = editor.getCursorPosition();
    var token = editor.session.getTokenAt(position.row, position.column);
    console.log(token)
});

// Add hotkeys when the document is fully loaded
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

// Toggle fullscreen
function toggleFullscreen() {

    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    }
    
}
document.getElementById('fullscreen-button').addEventListener('click', toggleFullscreen);

window.addEventListener('load', function() {

    window.scrollTo(0, 1);

    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme("mono_industrial");
    }

    let userCode = localStorage.getItem('userCode');
    if (userCode) {
        editor.setValue(userCode.trim());
        editor.clearSelection()
        console.log("test set to saved userCode")
    } 
    else {
      resetText();
    }

});

// Toggle readonly mode to stop automatic keyboard popup on mobile
function toggleReadonly() {
    editor.setReadOnly(!editor.getReadOnly());
    let setting = editor.getReadOnly() ? "on" : "off";
    let message = `Readonly ${setting}`
    showToast(message)
}
document.getElementById('readonly-button').addEventListener('click', toggleReadonly);

// Copy all text in the editor to clipboard
function copyAll() {
    var text = editor.getValue();
    navigator.clipboard.writeText(text)
    showToast("Copied!")
}
document.getElementById('copy-button').addEventListener('click', copyAll);

// Toasting function to add a temporary toast message
function showToast(message) {

    const toaster = document.getElementById('toaster');
    toaster.textContent = message;
    toaster.style.visibility = 'visible';

    // Hide toaster after 3 seconds
    setTimeout(() => {
        toaster.style.visibility = 'hidden';
        toaster.textContent = '';
    }, 1200);

}

// Save editor text to a .txt file
function saveFile() {

    const code = editor.getValue();

    const blob = new Blob([code], { type: 'text/plain' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'file.txt';
    link.click();
    URL.revokeObjectURL(link.href);

}
document.getElementById('save-button').addEventListener('click', saveFile);

// Load .txt file to editor
function loadFile() {

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt, .py';

    input.addEventListener('change', function(event) {
        
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                editor.setValue(e.target.result, -1);
                editor.focus()
                const row = editor.getSession().getLength() - 1
                const column = editor.getSession().getLine(row).length;
                editor.getSession().selection.moveTo(row, column);
            };
            reader.readAsText(file);
        }

    });

    input.click();

}
document.getElementById('load-button').addEventListener('click', loadFile);