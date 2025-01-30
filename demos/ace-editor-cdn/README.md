# Ace Editor
This site features a code-editor window using `ace`. You can build `ace` yourself but this version uses the `CDN` version which can be found on `cdnjs.com` [here](https://cdnjs.com/libraries/ace). The file, `https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.5/ace.js`, is part of the `ace` package and imports relevant things from the package.

Using the `CDN` version means there is limited customisability with `syntax highlighting`, among other things, and certain features are not enabled, such as autocompletion.

Some example customisation settings you can change are found in `script.js` and the snippet below.
```javascript
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
```

You can also use a `pre-built` version of `ace` found [here](
https://github.com/ajaxorg/ace-builds/).

There is also a demo site where you can toggle different `ace` settings, called `ace kitchen sink` found 
[here](https://ace.c9.io/build/kitchen-sink.html).

You can enable `autocomplete` by adding the second `CDN` of `<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.5/ext-language_tools.js"></script>` to `index.html`
```javascript
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});
```

### Information
It can be hard to style the `ace` editor, and while you can pinpoint the different `CSS` classes, you can have issues with alignment if you manually change things, this is why most of the settings are best left to `script.js` eg. `editor.renderer.setScrollMargin(16, 0, 0, 0);` will move the editor down `16px` which is the default line size, wheras attempting to manually set padding will create alignment issues for the cursor.

### Features
- Theme selector
- Remember theme choice between sessions
- Fullscreen button
- Copy code button
- Reset to demo code button
- Save and load files as `.txt`
- Remember text between sessions
- Autosave text
- Readonly button to disable automatic keyboard popup on mobile
- Soft tabs, backspace will delete four spaces where applicable
    - **Not working on mobile devices**

# TODO
- Clean up `index.html`, `styles.css` and `script.js`
- Disable `Enter` key accepting autocomplete suggestions