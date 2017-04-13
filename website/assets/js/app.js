$(document).ready(function() {
	// Masonry effect
	// http://packery.metafizzy.co/
	setInterval(function() {
		$('.js-packery').packery();
	}, 3000);

	// Offer backlink to ProductHunt users
	if (location.href.match(/\?ref=producthunt/)) {
		setTimeout(function() {
			$('.producthunt-backlink').fadeIn();
		}, 600);
	}

	// Stars
	$.ajax({
		url: 'https://api.github.com/repos/appbaseio/reactivesearch',
	}).done(function(data) {
		if (data.stargazers_count > 1) {
			$('.js-stars').text(data.stargazers_count);
		} else {
			$('.js-stars').hide();
		}
	})
});
