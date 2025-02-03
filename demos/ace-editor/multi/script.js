// Variables, Constants and Declarations
let pageContainer = document.getElementById('page');
let editorCount = 0;
const defaultText = `

def test(value: int) -> int:
    """Test function to square a given number"""
    return value ** 2

value = test(8)
print(value)

`

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

// Function to add a spacer to pageContainer, <div class="spacer"></div>
function addSpacer() {
    var element = document.createElement('div');
    element.classList.add('spacer');
    pageContainer.appendChild(element);
}

// Function to add a new ace editor to pageContainer, with incremented id
function addEditor() {
    let id = `editor_${++editorCount}`;
    var element = document.createElement('pre');
    element.id = id;
    pageContainer.appendChild(element);
    let editor = ace.edit(id);
    editor.session.setMode("ace/mode/python");
    editor.renderer.setScrollMargin(16, 0);
    editor.setShowPrintMargin(false);
    editor.setShowInvisibles(false);
    // editor.renderer.setPadding(8);
    editor.session.setOption("wrap", true);
    editor.setOption("displayIndentGuides", false)
    editor.setOption("showInvisibles", false);
    editor.session.setTabSize(4);
    editor.session.setUseSoftTabs(true);
    editor.setOption("highlightActiveLine", false);
    editor.setOption("highlightGutterLine", false);
    editor.setOption("showMatchingBracket", false);
    // toggleCursor(id);
    editor.setOptions({
        autoScrollEditorIntoView: true,
        theme: "ace/theme/gruvbox",
        highlightSelectedWord: false,
    });
    editor.setValue(defaultText.trim());
    editor.clearSelection();
}

// Main function for script.js
function main() {
    addSpacer();
    addEditor();
    addSpacer();
    addEditor();
}
main()