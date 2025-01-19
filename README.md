# html-demos
A Frankenstein's Monster of random, often unconnected, HTML demos attached together

### WORK IN PROGRESS: Currently `build.py` has limited functionality

# Project Information
## `demos`
- Located at `root/demos`
- Contains many subfolders that should each have a similar structure, containing their on individial `index.html`, `styles.css`, `script.js` and `README.md` files
```
demos/
  one/
    index.html
    styles.css
    script.js
    README.md
  two/
    index.html
    styles.css
    script.js
    README.md
```
- On the `GitHub Pages` site there should be a landing page (generated by `build.py`) that displays links to each of the static sites in the `demos` folder
- When testing locally, setting up a local server in the `demos` folder via `python -m http.server` will open the directory as a landing page with directory navigation

## `demo-tools.js`
- Located at `root/demos/demo-tools.js`
- A set of reusable functions in `JavaScript`
- Most of the functions should be synchronous
  - This means that they should be blocking and require less asynchronous code in the `index.html` that imports `tools.js`
- If `index.html` is found in a subdirectory of `demos`, such as `root/demos/one/index.html`, then importing `tools.js` is done by adding `<script src="../demo-tools.js"></script>` to `<head>`, so as to access the script from a higher directory

The `tools.js` script relies on the importing of certain `CDNs`, and makes a check to see if `index.html` has imported them successfully
```javascript
// Listener to run once the HTML DOM has fully loaded
document.addEventListener('DOMContentLoaded', function () {

  console.log("DOMContentLoaded => Loaded tools.js")

  // List of CDN links required for tools.jst to run
  const cdnLinks = {
    showdown: "https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js"
  };

  // For loop to check for failed CDNs and alert if needed
  const failedCDNs = {};
  for (const [key, value] of Object.entries(cdnLinks)) {
    if (!window[key]) {
      failedCDNs[key] = value;
    }
  }
  if (Object.keys(failedCDNs).length > 0) {
    let message = `Dictionary of failed CDNs: ${JSON.stringify(failedCDNs, null, 2)}`
    message += '\n\nAdd CDN URLs to the head of index.html in the format: <script src="URL"></script>'
    alert(message)
  }

})
```
An example of a useful synchronous function for URL requests and file-reading from `demo-tools.js`
```javascript
// Synchronous function that forces blocking, alternative to fetch / Promise / .then()
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
## `local-server.bat`
- Located at `root/demos/local-server.bat`
- Simple utility script to open current folder as a local server using `python -m http.server`
- If run in a folder without an `index.html` it will show as a directory structure with navigation links

## `build.py`
- Located at `root/build/build.py`

## `static.yml`
- Located at `root/.github/workflows/static.yml`

# Deploying to `GitHub Pages` with Custom Workflow
If you own the repository you can access and alter the workflow that is used to deploy your site to `GitHub Pages` via a link like this:  https://github.com/scarletti-ben/html-demos/settings/pages

From here you will see a section titled **Build and deployment** and a subheading **Source**, beneath this is a dropdown that controls whether your site is deployed by the default workflow from `GitHub` or via your custom workflow file in `.github/workflows`

If you choose custom workflow and select the template for `static.yml` you have a simple file that outlines the automated process for deploying your site to `GitHub Pages`, it specifies the environments and tasks required, and what triggers the workflow to run

# Assessing the Results of Workflow Run
Workflow runs, such as those from `static.yml`, allow you to see their output while they are running, and after they run. It can be useful to read the output if things are not going as you would expect. One example reason for reading the output is that if your project has a `Python` script, like `build.py`, this is where you can access the `print` statements and console log for the script.

- The `actions` dashboard for the project can be found [here](https://github.com/scarletti-ben/html-demos/actions), it shows all workflows and workflow runs for the project
- An example workflow run can be found [here](https://github.com/scarletti-ben/html-demos/actions/runs/12847868309/job/35824642855) and it shows the output of each task on the `deploy` job
  - From this page, if you go to into the settings and select **View raw logs** you get a raw text output of the entire `deploy` job of the workflow run
- The workflow run can run without error, and still function incorrectly, so it can be important to raise exceptions in your code, such as `raise UserException` in `Python`, to block the run as that script will run with an exit code that is not 0 and halt the workflow run

Note: `GitHub Actions` read(s) a workflow file to know the tasks required for deployment


# Learnings
Below is a list of things I learned, reinforced, or remembered while working on this project. It is very possible that things written below are **wildly** wrong
- When testing `index.html` files in `Google Chrome` you are going to have issues if you aren't making extensive use of the button for **Empty Cache and Hard Reload** which is accessed via right-clicking the refresh button whilst in developer tools
- In order to stop tracking a file that was previously tracked you can use `git rm --cached index.html` alongside adding the rule to the `.gitignore` file
- You can never access a file above the root where the local server is run, or, if using `GitHub Pages`, above the root `index.html` generated by `build.py`
- Imports in `JavaScript` don't always play nicely, and newer importing methods may fail for `CDNs` that have not been updated
  - Importing `CDNs` dynamically can therefore be a pain and has been avoided, where possible, in these demos
- Code using `async function` and the `await` keyword are dealing with `Promise` objects where the request is handled asynchronously, a synchronous function trying to get a return from an asynchronous one might assign the return value of an asynchronous function to a variable `var test = asynchronousFunction()` and move forward, despite `test` now being a `Promise` object rather than the intended return value of `asynchronousFunction()`, this is why asynchronous code is often referred to in the context of "zombies" as it just creates more and more asynchronous code as ideally you want `var test = await asynchronousFunction()`, which requires the function running that code to itself be asynchronous, and anything using that function to itself be... and so on, and so forth
- Asynchronous code can be run in synchronous functions if you are willing to essentially "start the process", and the rest of the function does not rely on said process, using `.then()` attaches a callback to execute when the `Promise` is resolved
```javascript
function synchronousFunction() {

  asynchronousFunction().then(result => {
    console.log(result); // Logs the resolved value of asynchronousFunction()
  });
  
  console.log("This runs before the promise resolves");

}
```
- Log in developer tools for `demos/test` when running locally
```
window.location.pathname => '/test/'
window.location.origin => 'http://localhost:8000'
window.location.href => 'http://localhost:8000/test/'
```

- Log in developer tools for `demos/test` when running on `GitHub`
```
window.location.pathname => '/html-demos/demos/test/'
window.location.origin => 'https://scarletti-ben.github.io'
window.location.href => 'https://scarletti-ben.github.io/html-demos/demos/test/'
```