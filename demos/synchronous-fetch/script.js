// Listener to run once the HTML DOM has fully loaded
document.addEventListener('DOMContentLoaded', function () {
    document.body.innerHTML = readMarkdownFileToHTML("README.md")
});