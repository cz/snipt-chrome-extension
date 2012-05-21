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

var isCtrl = false;
var isShift = false;
document.onkeyup=function(e){
	if(e.which == 17) isCtrl=false;
	if(e.which == 16) isShift=false;
}
document.onkeydown=function(e){
	if(e.which == 17) isCtrl=true;
	if(e.which == 16) isShift=true;
	if(e.which == 83 && isCtrl == true && isShift == true) {
		chrome.extension.sendRequest({ msg: "saveSelection" });
		return false;
	}
}