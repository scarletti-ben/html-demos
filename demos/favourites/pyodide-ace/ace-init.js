// =======================================================
// Constants, Variables, and Global Declarations
// =======================================================

const editor = ace.edit("editor");
const defaultText = `

import micropip
await micropip.install("cryptography")
import cryptography
print(cryptography)

`;

// =======================================================
// Functionality
// =======================================================

// Initialise Ace editor
async function aceInit() {
    editor.session.setMode("ace/mode/python");
    editor.setOptions({
        autoScrollEditorIntoView: true,
        displayIndentGuides: false,
        tabSize: 4,
        useSoftTabs: true,
        wrap: true,
        showPrintMargin: false,
        showInvisibles: false,
        highlightActiveLine: false,
        highlightGutterLine: false,
        theme: "ace/theme/gruvbox",
        highlightSelectedWord: false,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        readOnly: false
    });
    editor.renderer.setScrollMargin(16, 0);
    editor.setValue(defaultText.trim());
    editor.clearSelection();
    editor.focus();
}