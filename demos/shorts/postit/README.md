# Features
- Drag and drop to move `postit` elements
    - Highlight elements as you drag over them
- Type in `postit` elements
- Combine `postit` elements in `postit-frame` elements
- Use of `flex` layouts and `flex-wrap`
- Class control of `postit` size using syntax `class='postit-container h2 w4'`

# Issues
- The `postit-frame` has a wrapping issue if you move the elements around as once the scrollbar appears it is considered an element in the `postit-frame` and two regular `postit-container` elements no longer fit on the same line, overflow set to hidden, but this now means an element placed after the long element will be inaccessible

# CSS / HTML Flex Layout
- By default neither `display: flex`, nor `display: grid` have support for non-rectangular objects, and don't handle different sized objects easily
    - When using `flex-wrap: wrap;` a small object in a flex row with a larger object will leave empty space below it, to make up the difference in size, this leaves gaps that can't be filled
- It can be possible to manually fill those gaps, which I attempted with a `<div class="postit-frame">` flex container around a set of `postit-container` elements, but this is a bit fiddly
- It may be possible to write a rearranging function in `JavaScript` and make it work for `display: grid`, almost like a `tetris` solver
- The method suggested on [Stack Overflow](https://stackoverflow.com/) was to use `Masonry` for dynamic grid layouts, which can be found [here](https://masonry.desandro.com/)

# Ideas
- ~~Consider margin or padding within the postit container, making content smaller, so that the container itself maintains size and have no gaps~~

- Consider a system of dummy postit notes / filler notes to keep a grid of sorts in place

# Learnings
### CSS Inline Styles
- You can use `inline style` in `index.html` to control styling for that specific element, and even alter a `root` variable for that element without altering any actual `root` variables for other elements

`<div class="container" style="width: 200px; height: 400px;">`
`<div class="container" style="width: calc(var(--unit) * 2);">`
`<div class="container" style="--unit: 80px;">`

- All of the above styles apply only to their specific `container` element