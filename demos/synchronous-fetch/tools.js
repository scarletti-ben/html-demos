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