let redirectEnabled = true;
let isRedirectEnabled = true;
const REDIRECT_RULE_ID = 1;

function updateRedirectRule() {
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [REDIRECT_RULE_ID],
        addRules: (isRedirectEnabled && redirectEnabled) ? [{
            "id": REDIRECT_RULE_ID,
            "priority": 1,
            "action": { "type": "redirect", "redirect": { "url": "https://www.youtube.com" } },
            "condition": { "urlFilter": "*", "resourceTypes": ["main_frame"] }
        }] : []
    }, function() {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        }
    });
}

// Check if the redirect flag and enable flag are stored in Chrome storage
chrome.storage.sync.get(["redirectEnabled", "isRedirectEnabled"], function(result) {
    redirectEnabled = result.redirectEnabled !== undefined ? result.redirectEnabled : true;
    isRedirectEnabled = result.isRedirectEnabled !== undefined ? result.isRedirectEnabled : true;
    updateRedirectRule();
});

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
