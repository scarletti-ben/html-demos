// Variables, Constants and Declarations
let pageContainer = document.getElementById('page');
let longPressTimer = null;
const defaultText = `

# Hotkeys
# - CTRL + , to open settings
#   - Long press on mobile

def test(value: int) -> int:
    """Test function to square a given number"""
    return value ** 2

value = test(8)
print(value)

`

// Long press on page to open settings menu
pageContainer.addEventListener("touchstart", () => {
    let id = `editor_${editorCount}`;
    longPressTimer = setTimeout(() => openSettingsMenu(id), 1000);
});

// Long press on page to open settings menu
pageContainer.addEventListener("touchend", () => {
    clearTimeout(longPressTimer);
});

// Long press on page to open settings menu
pageContainer.addEventListener("touchmove", () => {
    clearTimeout(longPressTimer);
});

// Open the settings menu for a given editor id
function openSettingsMenu(id) {
    let editor = ace.edit(id);
    editor.execCommand("showSettingsMenu");;
}

// Function to add a new ace editor to pageContainer, with incremented id
function addEditor() {

    let editor = ace.edit(`editor`);
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
        theme: "ace/theme/gruvbox",
        highlightSelectedWord: false,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
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