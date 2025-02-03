# Ace Editor

# Issues
- Selection and cursor remain on inactive editors
- Horizontal scrollbars in the editors randomly, often past line 10 when the gutter resizes
- Blurry text depending on number of lines

# Fixes
- Fixed autocomplete and snippet issue by removing set margin from `.ace_editor`

# TODO
- Save editor settings to `local storage`
- Save editor text to `local storage`
- F11 fullscreen for a single editor doesn't work in ACTUAL fullscreen
- Learn file tabs for a single editor
- Disable page zoom on mobile
- Add visual that a new editor has been added (hard to tell on mobile)
- Consider putting editors in containers

### Hotkeys
- `Control + ,` for opening the tools panel
- `F1`
- `Control + D`
- `Control + L`
- `Control + F`
- `Control + H`

```css
#page {
  height: 100%;
  width: 100%;
  text-align: center;
  overflow: auto;


  scrollbar-gutter: stable;

}

.container {
  padding-left: calc(100vw - 100%);
}

```

```txt
4. Positioning inside a 100vw width parent
Since scrollbars don't affect the vw unit, we can fix the problem by setting the width of the parent/container in the vw unit and centering/positioning our elements inside of it:

.container {
  width: 100vw;
  /* elements inside won't be affected by scrollbars */
  display: flex;
  align-items: center;
  justify-content: center;
}

or 

.container {
   position: relative;
   left: calc((100vw - 100%) / 2);
}
```

```This can happen when the size of the editor.container is changed without calling editor.resize(), e.g. if a parent node is resized.
Editor scrolls, because it expects its size to be smaller.```


```
chrome dpi blur issue

https://github.com/ajaxorg/ace/issues/4328
```