# Simple Toaster
Simple `<div>` container for a `toast` or `alert` that I have decided is best termed a `toaster`

```html
<div id="toaster">
    <p>This toaster should follow the viewport when scrolling</p>
</div>
```

Its functionality is defined in `CSS` with `#toaster` having `position: fixed` and being given the `invisible` class
```css
.invisible {
    opacity: 0;
    visibility: hidden;
}
```