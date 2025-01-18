// Test function to be called
function test(invoker = null) {
    var message = `${invoker} invoked function 'test'`
    alert(message)
    console.log(message)
}

// Listener to run once the HTML DOM has fully loaded
document.addEventListener('DOMContentLoaded', function () {
    test('user')
});