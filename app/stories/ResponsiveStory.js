var $ = require("jquery");

var ResponsiveStory = function ResponsiveStory() {
	var paginationHeight = function paginationHeight() {
		return $(".rbc-pagination").length * 85;
	};

	var getHeight = function getHeight(item) {
		return item.height() ? item.height() : 0;
	};

	var handleResponsive = function handleResponsive() {
		var height = $(window).height();
		var resultHeight = height - 15;
		$(".rbc.rbc-reactivelist, .rbc.rbc-reactiveelement").css({
			maxHeight: resultHeight
		});
		var $component = [$(".rbc.rbc-singlelist"), $(".rbc.rbc-multilist"), $(".rbc.rbc-nestedlist"), $(".rbc.rbc-tagcloud")];
		$component.forEach(function (item) {
			if (item.length) {
				var itemHeader = getHeight(item.find(".rbc-title")) + getHeight(item.find(".rbc-search-container"));
				item.find(".rbc-list-container").css({ maxHeight: height - itemHeader - 35 });
			}
		});
		$(".rbc-base > .row").css({
			"margin-bottom": 0
		});
		$(".rbc-reactivemap .rbc-container").css({
			maxHeight: height
		});
	};

	handleResponsive();

	$(window).resize(function () {
		handleResponsive();
	});
};

export default ResponsiveStory;