var selection;

chrome.contextMenus.create({
	'title': 'Snipt it!',
	'contexts': ['selection', 'editable'],
	'onclick': saveSelection
});

function saveSelection(info, tab) {
	chrome.tabs.sendRequest(tab.id, {helper: 'get_selection'}, function(response) {
			selection = response.selection;
	});

	chrome.windows.get(tab.windowId, null, function(window) {
		tpos = window.height / 2 + window.top - 245;
		lpos = window.width / 2 + window.left - 170;

		chrome.windows.create({
			'url': 'popup.html',
			'type': 'popup',
			'width': 340,
			'height': 490,
			'top': tpos,
			'left': lpos
		});
	});
}

var clearSelection = function() {
	selection = '';
}

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse){
		if(request.msg == "clearSelection") clearSelection();
		if(request.msg == "saveSelection") saveSelection(null, sender.tab);
	}
);