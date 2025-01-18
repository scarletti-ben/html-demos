# html-demos
A Frankenstein's Monster of random, often unconnected, HTML demos attached together


# Learnings

Scripts can be given `type="module"` which allows them to behave differently, and allows for imports
`<script src="script.js"></script>`
`<script type="module" src="script.js"></script>`

However as yet I haven't found that these imports work when also referenced via `type="module"`

Defining a global toolset might be achieved via tool dictionary that's added to the window, effectively exporting it or making it global
```javascript
// Add tools to the window
window.tools = {
  tester: function() {
    var text = "tester";
    document.body.innerText = text;
  }
}
```
This method works if you import `<script src="tools.js"></script>` and `tools.js` contains the above, so it sort of executes immediately

The order of `JavaScript` referencing in the `HTML` matters

`JavaScript` does not seem to have a global imports system like`Python`


Might not be doable for what I want and better fixed in future with an `importmap` 
```html
<script type="importmap">
  { "imports": {
      "vue":        "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.41/vue.esm-browser.prod.js",
      "vue-router": "https://cdnjs.cloudflare.com/ajax/libs/vue-router/4.1.5/vue-router.esm-browser.min.js"
  } }
</script>
```
All scripts after this will be able to import from the named modules
Could you import importmap from higher directory?

After bloody ages it just seems that Showdown is not ESM compliant for importmap, for fucks sake

Modern scripts need .mjs and or import / export keywords to work with modern import syntax



Yes, runAfterFetch must be asynchronous if you want to use await exampleFetch();.

Why?
The await keyword can only be used inside an async function.
exampleFetch returns a Promise because it’s an async function.
To pause until exampleFetch finishes, await must be used within an async function.

# Promises
Functions that rely on completed promises are gonna need to be asynchronous async function, because otherwise a synchronous function would move forward with the return value which is simply an uncompleted promise


# My Snippets
```javascript
// Synchronous alternative to Promise and .then() to force blocking
function synchronousFetch(url) {

  var httpRequest = new XMLHttpRequest(); 
  httpRequest.open("GET", url, false); 
  httpRequest.send();

  if (httpRequest.status === 200) {
    return httpRequest

  } else {
    alert("Request failed with status:", httpRequest.status);
    return null
    
  }
}
```

# Issues
- Tools script has asynchronous code, causing issues

- I do not believe you can access files above the root of the local server you created
  - This means that `<script src="../tools.js"></script>` will not work unless its a site that is deeper than server root such as `root/demo/index.html`, which would correctly get `tools.js` at `root/tools.js`

- You can host a folder as as server with python -m http.server

Give up on trying to add CDNs via JavaScript directly to head, they never seem to load correctly