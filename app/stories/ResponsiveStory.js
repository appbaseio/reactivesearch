const $ = require("jquery");

const ResponsiveStory = function ResponsiveStory() {
	const paginationHeight = function paginationHeight() {
		return $(".rbc-pagination").length * 85;
	};

	const getHeight = function getHeight(item) {
		return item.height() ? item.height() : 0;
	};

	const handleResponsive = function handleResponsive() {
		const height = $(window).height();
		const resultHeight = height - 15;
		$(".rbc.rbc-reactivelist, .rbc.rbc-reactiveelement").css({
			maxHeight: resultHeight
		});
		const $component = [$(".rbc.rbc-singlelist"), $(".rbc.rbc-multilist"), $(".rbc.rbc-nestedlist"), $(".rbc.rbc-tagcloud")];
		$component.forEach((item) => {
			if (item.length) {
				const itemHeader = getHeight(item.find(".rbc-title")) + getHeight(item.find(".rbc-search-container"));
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

	$(window).resize(() => {
		handleResponsive();
	});
};

export default ResponsiveStory;
