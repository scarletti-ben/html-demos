// Test function to be called
function test(invoker = null) {
    var message = `${invoker} invoked function 'test'`
    console.log(message)
    goHome()
}

// Listener to run once the HTML DOM has fully loaded
document.addEventListener('DOMContentLoaded', function () {

});