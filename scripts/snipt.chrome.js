var Snipt = {

	init: function() {
		Snipt.status.container = $('header.sub');
		Snipt.status.text = Snipt.status.container.find('span').html();

		if(localStorage.getItem('validated') != 'true') {
			Snipt.switch_view();
			Snipt.message.set('error', 'Start by supplying API credentials');
		} else {
			Snipt.creds.populate();
			Snipt.get_selection();
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
		$('#toggle-creds').click(function(e){
			e.preventDefault();
			Snipt.switch_view();
		})
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
					Snipt.message.flash('success', 'Successfully posted!');
					$('#post form').reset();
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
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {helper: 'get_selection'}, function(response) {
					selection = response.selection;

					chrome.tabs.getSelected(null, function(tab) {
						$('#code').val(selection);
					});
			});
		});
	},

	message: {
		set: function(status, message) {
			var bar = Snipt.status.container;
			var span = bar.find('span');

			bar.removeClass('error success');
			if(status != null) {
				bar.addClass(status);
			}
			span.html(message);
		},

		flash: function(status, message) {
			Snipt.message.set(status, message);

			setTimeout(function(){
				Snipt.message.set(null, Snipt.status.text);
			}, 2000)
		}
	},

	switch_view: function() {
		$('#tabs li').toggle();
		$('#toggle-creds').toggleClass('back');
	},

	status: {
		container: {},
		text: ''
	}
};