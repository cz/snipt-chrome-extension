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
		tpos = window.top + 300;
		lpos = window.left + 300;

		console.log(tpos);
		console.log(lpos);

		chrome.windows.create({
			'url': 'popup.html',
			'type': 'popup',
			'width': 340,
			'height': 490,
			'top': 0,
			'left': 0
		});
	});
}

var clearSelection = function() {
	selection = '';
}

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse){
		if(request.msg == "clearSelection") clearSelection();
	}
);