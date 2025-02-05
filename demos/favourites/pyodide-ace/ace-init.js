// =======================================================
// Constants, Variables, and Global Declarations
// =======================================================

const editor = ace.edit("editor");
const defaultText = `

import micropip
await micropip.install("https://files.pythonhosted.org/packages/27/7c/abc460494640767edfce9c920da3e03df22327fc5e3d51c7857f50fd89c4/segno-1.6.1-py3-none-any.whl")
import segno
import js

text = "Hello, World"
qr = segno.make_qr("Hello, World")
qr.save(
    "/qr.png",
    scale = 5,
)

file_data = open("/qr.png", "rb").read()
binary_data_js = js.Uint8Array.new(file_data)
blob = js.Blob.new([binary_data_js], {"type": "image/png"})
url = js.window.URL.createObjectURL(blob)
a = js.document.createElement("a")
a.href = url
a.download = "qr.png"
js.document.body.appendChild(a)
a.click()
js.document.body.removeChild(a)
js.window.URL.revokeObjectURL(url)

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