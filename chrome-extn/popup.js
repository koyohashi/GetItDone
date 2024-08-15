document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('toggleRedirect');
    
    // Check current state and update button text
    chrome.storage.sync.get(["redirectEnabled"], function(result) {
        if (result.redirectEnabled === false) {
            button.textContent = "Enable Redirect";
        } else {
            button.textContent = "Disable Redirect";
        }
    });

    button.addEventListener('click', function() {
        chrome.storage.sync.get(["redirectEnabled"], function(result) {
            let newState = !result.redirectEnabled;
            let action = newState ? "enableRedirect" : "disableRedirect";
            chrome.runtime.sendMessage({action: action});
            button.textContent = newState ? "Disable Redirect" : "Enable Redirect";
        });
    });
});
