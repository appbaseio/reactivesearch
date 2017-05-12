"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _storybook = require("@kadira/storybook");

var _storybookAddonKnobs = require("@kadira/storybook-addon-knobs");

var _withReadme = require("storybook-readme/with-readme");

var _withReadme2 = _interopRequireDefault(_withReadme);

var _NestedList = require("@appbaseio/reactivemaps-manual/docs/v1.0.0/components/NestedList.md");

var _NestedList2 = _interopRequireDefault(_NestedList);

var _ToggleButton = require("@appbaseio/reactivemaps-manual/docs/v1.0.0/components/ToggleButton.md");

var _ToggleButton2 = _interopRequireDefault(_ToggleButton);

var _RangeSlider = require("@appbaseio/reactivemaps-manual/docs/v1.0.0/components/RangeSlider.md");

var _RangeSlider2 = _interopRequireDefault(_RangeSlider);

var _SingleList = require("@appbaseio/reactivemaps-manual/docs/v1.0.0/components/SingleList.md");

var _SingleList2 = _interopRequireDefault(_SingleList);

var _SingleRange = require("@appbaseio/reactivemaps-manual/docs/v1.0.0/components/SingleRange.md");

var _SingleRange2 = _interopRequireDefault(_SingleRange);

var _DataSearch = require("@appbaseio/reactivemaps-manual/docs/v1.0.0/components/DataSearch.md");

var _DataSearch2 = _interopRequireDefault(_DataSearch);

var _ReactiveList = require("@appbaseio/reactivemaps-manual/docs/v1.0.0/components/ReactiveList.md");

var _ReactiveList2 = _interopRequireDefault(_ReactiveList);

var _NestedList3 = require("./NestedList.stories");

var _NestedList4 = _interopRequireDefault(_NestedList3);

var _ToggleList = require("./ToggleList.stories");

var _ToggleList2 = _interopRequireDefault(_ToggleList);

var _DynamicRangeSlider = require("./DynamicRangeSlider.stories");

var _DynamicRangeSlider2 = _interopRequireDefault(_DynamicRangeSlider);

var _TagCloud = require("./TagCloud.stories");

var _TagCloud2 = _interopRequireDefault(_TagCloud);

var _RatingsFilter = require("./RatingsFilter.stories");

var _RatingsFilter2 = _interopRequireDefault(_RatingsFilter);

var _CategorySearch = require("./CategorySearch.stories");

var _CategorySearch2 = _interopRequireDefault(_CategorySearch);

var _MultiLevelMenu = require("./MultiLevelMenu.stories");

var _MultiLevelMenu2 = _interopRequireDefault(_MultiLevelMenu);

var _ResultCard = require("./ResultCard.stories");

var _ResultCard2 = _interopRequireDefault(_ResultCard);

var _ResultList = require("./ResultList.stories");

var _ResultList2 = _interopRequireDefault(_ResultList);

var _ViewSwitcher = require("./ViewSwitcher.stories");

var _ViewSwitcher2 = _interopRequireDefault(_ViewSwitcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("../../node_modules/materialize-css/dist/css/materialize.min.css");
require("../../dist/css/style.min.css");

function removeFirstLine(str) {
	return str.substring(str.indexOf("\n") + 1);
}

(0, _storybook.storiesOf)("NestedList", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_NestedList2.default), function () {
	return _react2.default.createElement(_NestedList4.default, {
		title: ""
	});
})).add("With Title", (0, _withReadme2.default)(removeFirstLine(_NestedList2.default), function () {
	return _react2.default.createElement(_NestedList4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "Car Category")
	});
})).add("Default selection", (0, _withReadme2.default)(removeFirstLine(_NestedList2.default), function () {
	return _react2.default.createElement(_NestedList4.default, {
		defaultSelected: (0, _storybookAddonKnobs.array)("defaultSelected", ["bmw", "estate car", "1er"])
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_NestedList2.default), function () {
	return _react2.default.createElement(_NestedList4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "NestedList: Car Filter"),
		size: (0, _storybookAddonKnobs.number)("size", 100),
		sortBy: (0, _storybookAddonKnobs.select)("sortBy", { asc: "asc", desc: "desc", count: "count" }, "count"),
		defaultSelected: (0, _storybookAddonKnobs.array)("defaultSelected", ["bmw", "estate car", "1er"]),
		showCount: (0, _storybookAddonKnobs.boolean)("showCount", true),
		showSearch: (0, _storybookAddonKnobs.boolean)("showSearch", true),
		placeholder: (0, _storybookAddonKnobs.text)("placeholder", "Search Cars")
	});
}));

(0, _storybook.storiesOf)("ToggleList", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_ToggleButton2.default), function () {
	return _react2.default.createElement(_ToggleList2.default, null);
})).add("With Default Selected", (0, _withReadme2.default)(removeFirstLine(_ToggleButton2.default), function () {
	return _react2.default.createElement(_ToggleList2.default, {
		defaultSelected: (0, _storybookAddonKnobs.array)("defaultSelected", ["Social"])
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_ToggleButton2.default), function () {
	return _react2.default.createElement(_ToggleList2.default, {
		title: (0, _storybookAddonKnobs.text)("title", "ToggleList: Meetup Categories"),
		multiSelect: (0, _storybookAddonKnobs.boolean)("multiSelect", true),
		data: (0, _storybookAddonKnobs.object)("data", [{ label: "Social", value: "Social" }, { label: "Travel", value: "Travel" }, { label: "Outdoors", value: "Outdoors" }]),
		defaultSelected: (0, _storybookAddonKnobs.array)("defaultSelected", ["Social", "Travel"])
	});
}));

(0, _storybook.storiesOf)("DynamicRangeSlider", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_RangeSlider2.default), function () {
	return _react2.default.createElement(_DynamicRangeSlider2.default, null);
})).add("Without histogram", (0, _withReadme2.default)(removeFirstLine(_RangeSlider2.default), function () {
	return _react2.default.createElement(_DynamicRangeSlider2.default, {
		showHistogram: (0, _storybookAddonKnobs.boolean)("showHistogram", false)
	});
})).add("With RangeLabels", (0, _withReadme2.default)(removeFirstLine(_RangeSlider2.default), function () {
	return _react2.default.createElement(_DynamicRangeSlider2.default, {
		rangeLabels: function rangeLabels(min, max) {
			return { start: min, end: max };
		}
	});
})).add("With defaultSelected", (0, _withReadme2.default)(removeFirstLine(_RangeSlider2.default), function () {
	return _react2.default.createElement(_DynamicRangeSlider2.default, {
		rangeLabels: function rangeLabels(min, max) {
			return { start: min, end: max };
		},
		defaultSelected: function defaultSelected(min, max) {
			return { start: min + 10, end: max - 10 };
		}
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_RangeSlider2.default), function () {
	return _react2.default.createElement(_DynamicRangeSlider2.default, {
		title: (0, _storybookAddonKnobs.text)("title", "DynamicRangeSlider: Guest RSVPs"),
		stepValue: (0, _storybookAddonKnobs.number)("stepValue", 1),
		showHistogram: (0, _storybookAddonKnobs.boolean)("showHistogram", true)
	});
}));

(0, _storybook.storiesOf)("TagCloud", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_SingleList2.default), function () {
	return _react2.default.createElement(_TagCloud2.default, null);
})).add("With multiSelect", (0, _withReadme2.default)(removeFirstLine(_SingleList2.default), function () {
	return _react2.default.createElement(_TagCloud2.default, {
		multiSelect: (0, _storybookAddonKnobs.boolean)("multiSelect", true)
	});
})).add("With defaultSelected", (0, _withReadme2.default)(removeFirstLine(_SingleList2.default), function () {
	return _react2.default.createElement(_TagCloud2.default, {
		defaultSelected: (0, _storybookAddonKnobs.text)("defaultSelected", "Auckland")
	});
})).add("With multiSelect and defaultSelected", (0, _withReadme2.default)(removeFirstLine(_SingleList2.default), function () {
	return _react2.default.createElement(_TagCloud2.default, {
		multiSelect: (0, _storybookAddonKnobs.boolean)("multiSelect", true),
		defaultSelected: (0, _storybookAddonKnobs.array)("defaultSelected", ["Auckland", "Amsterdam"])
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_SingleList2.default), function () {
	return _react2.default.createElement(_TagCloud2.default, {
		title: (0, _storybookAddonKnobs.text)("title", "TagCloud: City Filter"),
		size: (0, _storybookAddonKnobs.number)("size", 100),
		multiSelect: (0, _storybookAddonKnobs.boolean)("multiSelect", "true"),
		defaultSelected: (0, _storybookAddonKnobs.array)("defaultSelected", ["Auckland"]),
		showCount: (0, _storybookAddonKnobs.boolean)("showCount", true)
	});
}));

(0, _storybook.storiesOf)("RatingsFilter", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_SingleRange2.default), function () {
	return _react2.default.createElement(_RatingsFilter2.default, null);
})).add("With defaultSelected", (0, _withReadme2.default)(removeFirstLine(_SingleRange2.default), function () {
	return _react2.default.createElement(_RatingsFilter2.default, {
		defaultSelected: (0, _storybookAddonKnobs.object)("defaultSelected", { start: 2, end: 5 })
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_SingleRange2.default), function () {
	return _react2.default.createElement(_RatingsFilter2.default, {
		title: (0, _storybookAddonKnobs.text)("title", "RatingsFilter"),
		data: (0, _storybookAddonKnobs.object)("data", [{ start: 4, end: 5, label: "4 stars and up" }, { start: 3, end: 5, label: "3 stars and up" }, { start: 2, end: 5, label: "2 stars and up" }, { start: 1, end: 5, label: "> 1 stars" }]),
		defaultSelected: (0, _storybookAddonKnobs.object)("defaultSelected", { start: 2, end: 5 })
	});
}));

(0, _storybook.storiesOf)("CategorySearch", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_DataSearch2.default), function () {
	return _react2.default.createElement(_CategorySearch2.default, {
		title: "CategorySearch",
		placeholder: "Search Car"
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_DataSearch2.default), function () {
	return _react2.default.createElement(_CategorySearch2.default, {
		title: (0, _storybookAddonKnobs.text)("title", "CategorySearch"),
		appbaseField: (0, _storybookAddonKnobs.array)("appbaseField", ["name"]),
		categoryField: (0, _storybookAddonKnobs.text)("categoryField", "brand.raw"),
		defaultSelected: (0, _storybookAddonKnobs.text)("defaultSelected", ""),
		placeholder: (0, _storybookAddonKnobs.text)("placeholder", "Search Car")
	});
}));

(0, _storybook.storiesOf)("MultiLevelMenu", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_NestedList2.default), function () {
	return _react2.default.createElement(_MultiLevelMenu2.default, null);
})).add("With Blacklist", (0, _withReadme2.default)(removeFirstLine(_NestedList2.default), function () {
	return _react2.default.createElement(_MultiLevelMenu2.default, {
		blacklist: (0, _storybookAddonKnobs.array)("blacklist", ["golf", "unknown"])
	});
})).add("With maxCategories", (0, _withReadme2.default)(removeFirstLine(_NestedList2.default), function () {
	return _react2.default.createElement(_MultiLevelMenu2.default, {
		maxCategories: (0, _storybookAddonKnobs.number)("maxCategories", 6)
	});
})).add("With maxItems", (0, _withReadme2.default)(removeFirstLine(_NestedList2.default), function () {
	return _react2.default.createElement(_MultiLevelMenu2.default, {
		maxItems: (0, _storybookAddonKnobs.number)("maxItems", 3)
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_NestedList2.default), function () {
	return _react2.default.createElement(_MultiLevelMenu2.default, {
		data: (0, _storybookAddonKnobs.object)("data", [{ label: "Volkswagen", value: "volkswagen" }, { label: "BMW", value: "bmw" }]),
		blacklist: (0, _storybookAddonKnobs.array)("blacklist", ["golf", "unknown"]),
		maxCategories: (0, _storybookAddonKnobs.number)("maxCategories", 10),
		maxItems: (0, _storybookAddonKnobs.number)("maxItems", 4)
	});
}));

(0, _storybook.storiesOf)("ResultCard", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_ReactiveList2.default), function () {
	return _react2.default.createElement(_ResultCard2.default, null);
})).add("With Pagination", (0, _withReadme2.default)(removeFirstLine(_ReactiveList2.default), function () {
	return _react2.default.createElement(_ResultCard2.default, { pagination: true });
}));

(0, _storybook.storiesOf)("ResultList", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_ReactiveList2.default), function () {
	return _react2.default.createElement(_ResultList2.default, null);
})).add("With Pagination", (0, _withReadme2.default)(removeFirstLine(_ReactiveList2.default), function () {
	return _react2.default.createElement(_ResultList2.default, { pagination: true });
}));

(0, _storybook.storiesOf)("ViewSwitcher", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_ReactiveList2.default), function () {
	return _react2.default.createElement(_ViewSwitcher2.default, null);
}));