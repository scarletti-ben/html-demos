// Initialise the editor and settings
var editor = ace.edit("editor");
editor.getSession().setMode("ace/mode/python");
editor.setShowPrintMargin(false);
editor.setShowInvisibles(false);
// editor.renderer.setScrollMargin(top, bottom, left, right)
editor.renderer.setPadding(8);
editor.renderer.setScrollMargin(16, 0, 0, 0);
// editor.session.setWrapLimitRange(null, null);
editor.session.setOption("wrap", true);
editor.setOption("displayIndentGuides", false)
editor.setOption("showInvisibles", false);

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

resetText()

setInterval(() => {
    localStorage.setItem('userCode', editor.getValue());
    console.log("autosaved")
}, 10000); // Saves every 10 seconds

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

function toggleFullscreen() {
    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
      // If already in fullscreen, exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    } else {
      // If not in fullscreen, request fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        document.documentElement.msRequestFullscreen();
      }
    }
}
  
document.getElementById('fullscreen-button').addEventListener('click', toggleFullscreen);

window.addEventListener('load', function() {
    window.scrollTo(0, 1);

    // Retrieve and apply saved theme
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

function toggleReadonly() {
    editor.setReadOnly(!editor.getReadOnly());
    let setting = editor.getReadOnly() ? "on" : "off";
    let message = `Readonly ${setting}`
    showToast(message)
}

document.getElementById('readonly-button').addEventListener('click', toggleReadonly);

function copyAll() {
  var text = editor.getValue();
  navigator.clipboard.writeText(text)
  showToast("Copied!")
}

document.getElementById('copy-button').addEventListener('click', copyAll);

document.getElementById('reset-button').addEventListener('click', resetText);

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