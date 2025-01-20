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

// Synchronously convert markdown text to HTML
function convertMarkdownTextToHTML(text) {
  const converter = new showdown.Converter();
  const html = converter.makeHtml(text);
  return html;
}

// Synchronously read file to text
function readFileToText(filename) {
  const response = synchronousFetch(filename);
  return response.responseText;
}

// Synchronously convert .md file to HTML
function readMarkdownFileToHTML(filename) {
  const text = readFileToText(filename)
  const html = convertMarkdownTextToHTML(text)
  return html;
}

// Function to show text in <dialog id="modal-dialog"> that can be closed via Escape key
function showModalDialog(text) {
  let dialog = document.getElementById("modal-dialog");
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = "modal-dialog";
    document.body.appendChild(dialog);
  }
  dialog.innerHTML = '';
  let message = 'Press Escape to Exit'
  dialog.innerText = message + '\n\n' + text;
  dialog.showModal();
}

// Function to show HTML in <dialog id="modal-dialog"> that can be closed via Escape key
function showModalDialogHTML(html) {
  let dialog = document.getElementById("modal-dialog");
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = "modal-dialog";
    document.body.appendChild(dialog);
  }
  dialog.innerHTML = html;
  let message = 'Press Escape to Exit'
  let notice = document.createElement('span');
  notice.innerText = message;
  dialog.prepend(notice);
  dialog.showModal();
}

// Show README.md in <dialog id="modal-dialog">
function showREADME() {
  let html = readMarkdownFileToHTML("README.md");
  showModalDialogHTML(html)
}

// Go to homepage / root, on local server or on GitHub pages
function goHome() {

  var link = "/";
  var url = window.location.origin;

  if (url.includes("github.io")) {
    const path = window.location.pathname.split('/')[1];
    link += path
  }

  window.location.href = link

}

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

  document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'h') {
      event.preventDefault();
      goHome()
    }
  });

})