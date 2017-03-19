"use strict";

var _reactivemaps = require("@appbaseio/reactivemaps");

var _reactivemaps2 = _interopRequireDefault(_reactivemaps);

var _NestedList = require("./sensors/NestedList");

var _NestedList2 = _interopRequireDefault(_NestedList);

var _ToggleList = require("./sensors/ToggleList");

var _ToggleList2 = _interopRequireDefault(_ToggleList);

var _DynamicRangeSlider = require("./sensors/DynamicRangeSlider");

var _DynamicRangeSlider2 = _interopRequireDefault(_DynamicRangeSlider);

var _TagCloud = require("./sensors/TagCloud");

var _TagCloud2 = _interopRequireDefault(_TagCloud);

var _RatingsFilter = require("./sensors/RatingsFilter");

var _RatingsFilter2 = _interopRequireDefault(_RatingsFilter);

var _CategorySearch = require("./sensors/CategorySearch");

var _CategorySearch2 = _interopRequireDefault(_CategorySearch);

var _MultiLevelMenu = require("./sensors/MultiLevelMenu");

var _MultiLevelMenu2 = _interopRequireDefault(_MultiLevelMenu);

var _ResultCard = require("./actuators/ResultCard");

var _ResultCard2 = _interopRequireDefault(_ResultCard);

var _ResultList = require("./actuators/ResultList");

var _ResultList2 = _interopRequireDefault(_ResultList);

var _ViewSwitcher = require("./actuators/ViewSwitcher");

var _ViewSwitcher2 = _interopRequireDefault(_ViewSwitcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var combineObj = {
	NestedList: _NestedList2.default,
	ToggleList: _ToggleList2.default,
	DynamicRangeSlider: _DynamicRangeSlider2.default,
	TagCloud: _TagCloud2.default,
	RatingsFilter: _RatingsFilter2.default,
	CategorySearch: _CategorySearch2.default,
	MultiLevelMenu: _MultiLevelMenu2.default,
	ResultCard: _ResultCard2.default,
	ResultList: _ResultList2.default,
	ViewSwitcher: _ViewSwitcher2.default
};

Object.keys(_reactivemaps2.default).forEach(function (component) {
	combineObj[component] = _reactivemaps2.default[component];
});

module.exports = combineObj;