$(document).ready(function() {
	// Masonry effect
	// http://packery.metafizzy.co/
	$('.js-packery').packery();

	// Offer backlink to ProductHunt users
	if (location.href.match(/\?ref=producthunt/)) {
		setTimeout(function() {
			$('.producthunt-backlink').fadeIn();
		}, 600);
	}
});
