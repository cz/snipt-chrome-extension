var Snipt = {

	init: function() {
		Snipt.status.container = $('header.sub');
		Snipt.get_selection();

		if(localStorage.getItem('validated') != 'true') {
			Snipt.switch_view();
			Snipt.message.set('error', 'Start by supplying API credentials');
		} else {
			Snipt.creds.populate();
			Snipt.message.set(null, Snipt.status.text());
		}
		$('#creds button.save').click(function(e){
			e.preventDefault();
			Snipt.creds.save();
		})
		$('#creds button.remove').click(function(e){
			e.preventDefault();
			Snipt.creds.remove();
		})
		$('#post button').click(function(e){
			e.preventDefault();
			Snipt.api.post();
		})
		$('.toggle-view').click(function(e){
			e.preventDefault();
			Snipt.switch_view();
		})
		$('#title').focus();
	},

	api: {
		base_url: 'https://snipt.net/api/private/snipt/',

		post: function(){
			var data = {};

			if($('#title').val() != '') {
				data.title = $('#title').val();
			}

			if($('#code').val() != '') {
				data.code = $('#code').val();
			}

			if($('#tags').val() != '') {
				data.tags = $('#tags').val();
			}

			if($('#public').is(':checked')) {
				data.public = true;
			}

			data.lexer = $('#lexer option:selected').val();

			var post_data = JSON.stringify(data);

			$.ajax({
				type: 'POST',
				url: Snipt.api.base_url,
				data: post_data,
				contentType: 'application/json',
				crossDomain: true,
				beforeSend : Snipt.api.set_header,
				success: function(data){
					Snipt.message.flash('success', 'Successfully posted! <a href="https://snipt.net' + data.absolute_url + '">View snipt</a>');
					document.getElementById('post-snipt').reset();
				},
				error: function(request, status, error){
					Snipt.message.flash('error', 'Sorry, something went wrong :-(');
				},
				dataType: 'json'
			});
		},

		set_header: function(xhr){
			xhr.setRequestHeader('Authorization', 'ApiKey '
								+ localStorage.getItem('username')
								+ ':'
								+ localStorage.getItem('api_key'));
		}
	},

	creds: {
		populate: function(){
			if(localStorage.getItem('validated') == 'true') {
				$('form #username').val(localStorage.getItem('username'));
				$('form #key').val(localStorage.getItem('api_key'));
			}
		},

		remove: function(){
			localStorage.removeItem('username');
			localStorage.removeItem('api_key');
			localStorage.setItem('validated', 'false');
			$('form #username').val('');
			$('form #key').val('');
			Snipt.message.flash('success', 'Credentials removed');
		},
		
		save: function(){
			var username = $('#username').val();
			var api_key = $('#key').val();

			var url = Snipt.api.base_url
			        + '?username='
			        + username
			        + '&api_key='
			        + api_key

			$.ajax({
				type: 'GET',
				url: url,
				dataType: 'jsonp',
				success: function(data){
					localStorage.setItem('username', username);
					localStorage.setItem('api_key', api_key);
					localStorage.setItem('validated', 'true');
					Snipt.message.flash('success', 'Credentials saved');
					Snipt.switch_view();
				},
				error: function(xhr, status){
					localStorage.removeItem('username');
					localStorage.removeItem('api_key');
					localStorage.setItem('validated', 'false');
					Snipt.message.flash('error', 'Bad credentials');
				}
			});
		},
	},

	get_selection: function() {
		if(chrome.extension.getBackgroundPage().selection !== '') {
			chrome.tabs.getSelected(null, function(tab) {
				$('#code').val(chrome.extension.getBackgroundPage().selection);
			});
			chrome.extension.sendRequest({ msg: "clearSelection" });
		} else {
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendRequest(tab.id, {helper: 'get_selection'}, function(response) {
						selection = response.selection;

						chrome.tabs.getSelected(null, function(tab) {
							$('#code').val(selection);
						});
				});
			});
		}
	},

	message: {
		set: function(status, message) {
			var bar = Snipt.status.container;

			bar.removeClass('error success');
			if(status != null) {
				bar.addClass(status);
			}
			bar.html(message);
		},

		flash: function(status, message) {
			Snipt.message.set(status, message);

			setTimeout(function(){
				Snipt.message.set(null, Snipt.status.text());
			}, 5000)
		},

		list: [
			'Try me after selecting some text!',
			'Did you know Snipt has a <a href="https://snipt.net/blog/"> blog</a>?',
			'Follow <a href="https://twitter.com/snipt">@snipt</a> on Twitter!'
		]
	},

	switch_view: function() {
		$('#tabs li').animate({
			height: 'toggle'
		}, 50);
		$('.toggle-view').toggleClass('back');
	},

	status: {
		container: {},
		text: function() {
			var key = Math.floor(Math.random() * Snipt.message.list.length);
			return Snipt.message.list[key];
		}
	}
};

$(document).ready(function(){
	Snipt.init();
});