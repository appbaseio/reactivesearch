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
});
