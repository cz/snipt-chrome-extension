// http://code.google.com/chrome/extensions/messaging.html
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.helper == 'get_selection'){
            sendResponse({selection: document.getSelection().toString()});
        } else {
            sendResponse({selection: ''}); // snub them.
        }
    }
);