// Listener to run once the HTML DOM has fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // Declare variable element for easy reassignment
    var element = null;

    // Add a listener for a click event for a given button ID
    element = document.getElementById("show-readme");
    element.addEventListener("click", () => {
        showREADME()
    });

    // Add a listener for a click event for a given button ID
    element = document.getElementById("go-home");
    element.addEventListener("click", () => {
        goHome();
    });

    // Add a listener for a click event for a given button ID
    element = document.getElementById("show-dialog");
    element.addEventListener("click", () => {
        showModalDialog("Testing modal dialog");
    });
    
    // Replace onclick method for a given button ID
    element = document.getElementById("X");
    element.onclick = function() {
      
    };
    
});