(function(){

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

	// Set up keyboard shortcut CTRL+SHIFT+[
	var ctrl = false;
	var shift = false;

	// Unset CTRL/SHIFT when they're released
	document.onkeyup = function(e){
		if(e.which === 17){
			ctrl = false;
		}
		if(e.which === 16){
			shift = false;
		}
	}

	// Handle the keyboard combo
	document.onkeydown = function(e){
		if(e.which === 17){
			ctrl = true;
		}
		if(e.which === 16){
			shift = true;
		}
		if(e.which === 219 && ctrl === true && shift === true) {
			chrome.extension.sendRequest({ msg: "saveSelection" });

			// 'onkeyup' gets triggered on the popup window, so we need to unset
			// these manually here.
			ctrl = false;
			shift = false;

			return false;
		}
	}
})();