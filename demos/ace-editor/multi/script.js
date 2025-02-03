// Variables, Constants and Declarations
let pageContainer = document.getElementById('page');
let bottomButton = document.getElementById("new-button");
let editorCount = 0;
let longPressTimer = null;
const defaultText = `

def test(value: int) -> int:
    """Test function to square a given number"""
    return value ** 2

value = test(8)
print(value)

`

// Long press on new-button to open settings menu
bottomButton.addEventListener("touchstart", () => {
    let id = `editor_${editorCount}`;
    longPressTimer = setTimeout(() => openSettingsMenu(id), 1000);
});

// Long press on new-button to open settings menu
bottomButton.addEventListener("touchend", () => {
    clearTimeout(longPressTimer);
});

// Long press on new-button to open settings menu
bottomButton.addEventListener("touchmove", () => {
    clearTimeout(longPressTimer);
});

// Open the settings menu for a given editor id
function openSettingsMenu(id) {
    let editor = ace.edit(id);
    editor.execCommand("showSettingsMenu");
    // editor.execCommand("showKeyboardShortcuts");
    // editor.showKeyboardShortcuts();
}

// Toggle the cursor for a given editor id
function toggleCursor(id) {
    let editor = ace.edit(id);
    let cursorLayer = editor.renderer.$cursorLayer.element;
    if (cursorLayer.style.display === "none") {
        cursorLayer.style.display = "";
    } else {
        cursorLayer.style.display = "none";
    }
}

// Function to add a new spacer element, to avoid margin on ace editors
function addSpacer() {
    var element = document.createElement('div');
    element.classList.add("spacer");
    pageContainer.insertBefore(element, bottomButton);
}

// Function to add a new ace editor to pageContainer, with incremented id
function addEditor() {
    
    let id = `editor_${++editorCount}`;
    var element = document.createElement('pre');
    element.id = id;
    addSpacer();
    pageContainer.insertBefore(element, bottomButton);
    let editor = ace.edit(id);
    editor.session.setMode("ace/mode/python");
    editor.renderer.setScrollMargin(16, 0);
    editor.setShowPrintMargin(false);
    editor.setShowInvisibles(false);
    editor.session.setOption("wrap", true);
    editor.setOption("displayIndentGuides", false)
    editor.setOption("showInvisibles", false);
    editor.session.setTabSize(4);
    editor.session.setUseSoftTabs(true);
    editor.setOption("highlightActiveLine", false);
    editor.setOption("highlightGutterLine", false);
    editor.setOptions({
        autoScrollEditorIntoView: true,
        // scrollPastEnd: 0.1,
        theme: "ace/theme/gruvbox",
        highlightSelectedWord: false,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });

    editor.container.addEventListener('keydown', function(event) {
        if (event.key === 'F11') {
            event.preventDefault();
            const isFullScreen = document.body.classList.toggle('fullScreen');
            editor.container.classList.toggle('fullScreen', isFullScreen);
            editor.setAutoScrollEditorIntoView(!isFullScreen);
            editor.resize();
        }
    });

    editor.setValue(defaultText.trim());
    editor.clearSelection();
    pageContainer.scrollBy(0, 1000);

}

// Main function for script.js
function main() {
    addEditor();
}
main()