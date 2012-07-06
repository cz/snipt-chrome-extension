var selection;

chrome.contextMenus.create({
	'title': 'Snipt it!',
	'contexts': ['selection', 'editable'],
	'onclick': saveSelection
});

function saveSelection(info, tab) {
	chrome.tabs.sendRequest(tab.id, {helper: 'get_selection'}, function(response) {
			selection = response.selection;

			chrome.windows.create({
				'url': 'popup.html',
				'type': 'popup',
				'width': 340,
				'height': 505
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