$(document).ready(function() {
	// Masonry effect
	// http://packery.metafizzy.co/
	$('.js-packery').packery();

	var prices = {
		'monthly': {
			bootstrap: 29,
			growth: 89,
			dedicated: 499
		},
		'annually': {
			bootstrap: 19,
			growth: 59,
			dedicated: 299
		}
	};
	function handleResponsive() {
		$('.tab-pane .img-container').css({
			'height': 'auto'
		});
		var tabHeight = $('.tab-pane.fade.in .img-container').height();
		$('.tab-pane .img-container').css({
			'height': tabHeight
		});
	}
	handleResponsive();
	$(window).resize(function() {
		handleResponsive();
	})
	$("#faq li").on('click', function(e) {
		var parentNode = e.target.parentNode;
		if ($(parentNode).hasClass("active"))
			$(parentNode).removeClass("active");
		else
			$(parentNode).addClass("active");
	});
	$('.toggleButton .btn').on('click', function() {
		$('.toggleButton .btn').removeClass('active');
		var mode = $(this).hasClass('monthly') ? 'monthly' : 'annually';
		changePlan(mode);
	});
	function changePlan(mode) {
		$('.toggleButton .btn.'+mode).addClass('active');
		$('#bootstrap-card .plan-price').text(prices[mode].bootstrap);
		$('#growth-card .plan-price').text(prices[mode].growth);
		$('#dedicated-card .plan-price').text(prices[mode].dedicated);
	}
});
