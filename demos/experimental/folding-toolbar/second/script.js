// Variables, Constants and Declarations
let page = document.querySelector("#page");
let toolbar = document.querySelector(".toolbar");
let content = document.querySelector(".content");

// Initialisation function to be called when the DOM has loaded
function init() {

    var spans = document.querySelectorAll(".toolbar span");
    for (const span of spans) {
        span.addEventListener("click", () => {
           toolbar.classList.toggle("hidden");
        });
    }

    let opener = document.querySelector(".content span");
    opener.addEventListener("click", () => {
        toolbar.classList.toggle("hidden");
    });

}

// Add listener to call init function when the DOM has loaded
document.addEventListener('DOMContentLoaded', init);