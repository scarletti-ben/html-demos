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

const cdnLinks = ["https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js"]

// Function to load multiple CDN links
function loadCDNs(cdnLinks) {
  cdnLinks.forEach(function(url) {
    const response = synchronousFetch(url);
    const script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);
    console.log("Loaded script:", url);
    console.log(document.head.innerHTML)
  })
}

loadCDNs(cdnLinks)