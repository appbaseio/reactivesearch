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
	function x() {
		$.ajax({
			url: 'https://api.github.com/repos/appbaseio/reactivesearch',
		}).done(function(data) {
			if (data.stargazers_count > 1 && data.forks > 6) {
				$('.js-stars').text(data.stargazers_count);
			} else {
				$('.js-stars').hide();
			}
		})
	}
	x()
	// Slide Out Blog post tab after some scrolling
	// with throttle
	var didScroll = false;
	$(window).scroll(function() {
		didScroll = true;
	});
	setInterval(function() {
		if (didScroll) {
			// If they scrolled 100vh
			if ($('html').scrollTop() > $(window).height()) {
				$('.medium-post-link').addClass('js-active');
			} else {
				$('.medium-post-link').removeClass('js-active');
			}

			didScroll = false;
		}
	}, 250);
});
