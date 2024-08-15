let redirectEnabled = true;
const REDIRECT_RULE_ID = 1;

// Check if the redirect flag is stored in Chrome storage
chrome.storage.sync.get(["redirectEnabled"], function(result) {
    redirectEnabled = result.redirectEnabled !== undefined ? result.redirectEnabled : true;
    updateRedirectRule();
});

function updateRedirectRule() {
    // First, remove the rule if it already exists to avoid the duplicate ID error
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [REDIRECT_RULE_ID],
        addRules: redirectEnabled ? [{
            "id": REDIRECT_RULE_ID,
            "priority": 1,
            "action": { "type": "redirect", "redirect": { "url": "https://www.youtube.com" } }, // Your target URL
            "condition": { "urlFilter": "*", "resourceTypes": ["main_frame"] }
        }] : []
    }, function() {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        }
    });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "disableRedirect") {
        redirectEnabled = false;
        chrome.storage.sync.set({ redirectEnabled: false }, updateRedirectRule);
    } else if (request.action === "enableRedirect") {
        redirectEnabled = true;
        chrome.storage.sync.set({ redirectEnabled: true }, updateRedirectRule);
    }
});
