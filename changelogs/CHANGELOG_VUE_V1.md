# Changelog

## Unreleased

<details>
    <summary>The following changes have been included in the <code>next</code> branch and will be out in the next release. <b>Click to expand</b></summary>
</details>

### v1.5.0
- Add support for `defaultSortOption` in ReactiveList component @bietkul [[d6178b89]](https://github.com/appbaseio/reactivesearch/commit/d6178b89)
- Expose `setPage` method in `render` slot for ReactiveList component that is helpful to build custom pagination @lakhansamani (#1498)

### v1.4.3
- Fix custom query in `DataSearch` component @bietkul [[050b2efa]](https://github.com/appbaseio/reactivesearch/commit/050b2efa)
- Fix SSR support when `enableAppbase` is set to `true` @bietkul [[bfced0db]](https://github.com/appbaseio/reactivesearch/commit/bfced0db)

### v1.4.2
- Provide value actions to custom renderer in SelectedFilters component @bietkul [[667c41c6]](https://github.com/appbaseio/reactivesearch/commit/667c41c6)

### v1.4.1
- Fix pagination in ReactiveList with URLParams when `enableAppbase` is set to true @bietkul [[f52bda55]](https://github.com/appbaseio/reactivecore/commit/f52bda55)
- Fix props watcher for all components @ShahAnuj2610 (#1467)

### v1.4.0

- Make dataField optional for DataSearch for rs-api @ShahAnuj2610 (#1448)
- Make defaultQuery and customQuery reactive @ShahAnuj2610 (#1435)
- Add first class support for query suggestions @ShahAnuj2610 (#1459)
- Avoid redundant queries on mount @ShahAnuj2610 (#1463)
- Fix dynamic range slider when enableAppbase is true @bietkul [[b2320802]](https://github.com/appbaseio/reactivesearch/commit/b2320802)

### v1.3.0
- Reactivesearch API Integration @bietkul https://github.com/appbaseio/reactivesearch/commit/de4d7d562a52fd03f51d29a23b339166ba3fa748

### v1.2.0
- Add rawData to provide an as-is response from es in render prop @ShahAnuj2610 (#1382)

### v1.1.1
- Fix `DataSearch` autosuggest select on android firefox[#1374](https://github.com/appbaseio/reactivesearch/issues/1374)

### v1.1.0
- Add support for voice search [#1352](https://github.com/appbaseio/reactivesearch/issues/1352)
- Update search value on search icon click [#1342](https://github.com/appbaseio/reactivesearch/issues/1342)
- Add support to display promoted results [#1303](https://github.com/appbaseio/reactivesearch/issues/1303)
- Fix `size` prop in `DataSearch` [#1344](https://github.com/appbaseio/reactivesearch/issues/1344)
- Fix `URLParams` behavior in `MultiRange` [#1294](https://github.com/appbaseio/reactivesearch/issues/1294)

### v1.0.0 [Breaking]
- Remove deprecated `defaultSelected` prop, use `defaultValue` instead [[af38b6ef]](https://github.com/appbaseio/reactivesearch/commit/af38b6ef)
- Fix style of DataSearch clear icon [#1266](https://github.com/appbaseio/reactivesearch/issues/1266)
- Control analytics with `analyticsConfig` prop in `ReactiveBase` [#1262](https://github.com/appbaseio/reactivesearch/iss/1262)
- Fix pagination when `URLParams` is set to `true` [#1260](https://github.com/appbaseio/reactivesearcs/1260)
- Fix edge cases for pagination [#1259](https://github.com/appbaseio/reactivesearch/issues/1259)
- Fix infinite scroll for `aggregationField` in ReactiveList [#1256](https://github.com/appbaseio/reactivesearch/issues/1256)
- Make pagination prop as reactive [[2bfa0375]](https://github.com/appbaseio/reactivesearch/commit/2bfa0375)

### v1.0.0-rc.01 [Breaking]

-   Fix installation of sub-components [[864c22f7]](https://github.com/appbaseio/reactivesearch/commit/864c22f7)
-   Update `onData` event data and add more props for ReactiveComponent [#1247](https://github.com/appbaseio/reactivesearch/issues/1247)
-   Remove `resultStats` event from `ReactiveList`, now it'll be a part of `data` event. [[8a3d888a]](https://github.com/appbaseio/reactivesearch/commit/8a3d888a)

### v1.0.0-rc [Breaking]

-   Add `change` event for SelectedFilters [#1246](https://github.com/appbaseio/reactivesearch/issues/1246)
-   Add state provider component [[d71359c6]](https://github.com/appbaseio/reactivesearch/commit/d71359c6)
-   Add `renderLabel` prop for dropdown components [#1244](https://github.com/appbaseio/reactivesearch/issues/1244)
-   Rename `renderSuggestion` to `parseSuggestion` in `DataSearch` component [#1245](https://github.com/appbaseio/reactivesearch/issues/1245)
-   Add support for render prop for list and dropdown components, rename `renderAllSuggestions` to `render` in search components [#1243](https://github.com/appbaseio/reactivesearch/issues/1243)

### v1.0.0-beta.22

-   Set size to zero when nestedField present for list components [#1217](https://github.com/appbaseio/reactivesearch/issues/1217)
-   Add `aggregationField` for Search and Result components [#1232](https://github.com/appbaseio/reactivesearch/issues/1232)
-   Custom tag for ReactiveBase [#1206](https://github.com/appbaseio/reactivesearch/issues/1206)

### v1.0.0-beta.21

-   Add controlled behavior in Range Components [#1194](https://github.com/appbaseio/reactivesearch/issues/1194)
-   Add controlled behavior for list components [#1193](https://github.com/appbaseio/reactivesearch/issues/1193)
-   DynamicRangeSlider fix [#1189](https://github.com/appbaseio/reactivesearch/issues/1189)

### v1.0.0-beta.20

-   Fix search icon position [#1177](https://github.com/appbaseio/reactivesearch/issues/1177)
-   Add a11y for selected filters [#1185](https://github.com/appbaseio/reactivesearch/issues/1185)
-   Add a11y for toggle button [#1186](https://github.com/appbaseio/reactivesearch/issues/1186)
-   Add `showEndPage` to ReactiveList [#1184](https://github.com/appbaseio/reactivesearch/issues/1184)

### v1.0.0-beta.19

-   Add `renderAllSuggestions` + example to demonstrate the uses [[718b59f6]](https://github.com/appbaseio/reactivesearch/commit/718b59f6)
-   Fix umd build issue [#1121](https://github.com/appbaseio/reactivesearch/issues/1121)

### v1.0.0-beta.18

-   Fix theme variable conflict with Vuetify [[2d2139b5]](https://github.com/appbaseio/reactivesearch/commit/2d2139b5)
-   Dependency issues (#1052)[#1052](https://github.com/appbaseio/reactivesearch/issues/1052)
-   Dependency issues (#1053)[#1053](https://github.com/appbaseio/reactivesearch/issues/1053)

### v1.0.0-beta.17

-   Add `defaultSelected` in MultiRange[[431e95e3]](https://github.com/appbaseio/reactivesearch/commit/431e95e3)
-   Add `defaultSelected` in ToggleButton[[d4e7316d]](https://github.com/appbaseio/reactivesearch/commit/d4e7316d)

### v1.0.0-beta.16

-   Fix setState issue in ReactiveBase [#1028](https://github.com/appbaseio/reactivesearch/issues/1028)
-   Fix highlight issue in DataSearch[[ddef5200]](https://github.com/appbaseio/reactivesearch/commit/ddef5200)
-   Fix highlight search query in suggestion[[85db20dc]](https://github.com/appbaseio/reactivesearch/commit/85db20dc)
-   Add `render` slot to ToggleButton [#993](https://github.com/appbaseio/reactivesearch/issues/993)
-   Add support for `transformResponse` [#1009](https://github.com/appbaseio/reactivesearch/issues/1009)
-   Fix url params issue with vue router [[65da9b0b]](https://github.com/appbaseio/reactivesearch/commit/65da9b0b)

### v1.0.0-beta.13

-   Fix url params parsing [#955](https://github.com/appbaseio/reactivesearch/issues/955)

### v1.0.0-beta.12

-   Add SSR support [#931](https://github.com/appbaseio/reactivesearch/issues/931)

### v1.0.0-beta.10

-   Access watchComponent using context [#923](https://github.com/appbaseio/reactivesearch/issues/923)
-   Watch for selectedValue in Slider Components [#924](https://github.com/appbaseio/reactivesearch/issues/924)

### v1.0.0-beta.8

-   Set query size to zero for composite aggs [#745](https://github.com/appbaseio/reactivesearch/issues/745)

### v1.0.0-beta.7

-   Update core logic [[d6ccf9ac]](https://github.com/appbaseio/reactivesearch/commit/d6ccf9ac)

### v1.0.0-beta.6

-   Fix data variables use [#800](https://github.com/appbaseio/reactivesearch/issues/800)
-   Add nestedField in List Components [#795](https://github.com/appbaseio/reactivesearch/issues/795)
-   Add nestedField support in Range Components [#796](https://github.com/appbaseio/reactivesearch/issues/796)
-   Add nestedField in search components [#797](https://github.com/appbaseio/reactivesearch/issues/797)

### v1.0.0-beta.4

-   Add support for Dynamic Range Slider [#734](https://github.com/appbaseio/reactivesearch/issues/734)

### v1.0.0-beta.3

-   Add sliderOptions in RangeSlider [#732](https://github.com/appbaseio/reactivesearch/issues/732)
-   Fix defaultSelected values in MultiDropdownList [#731](https://github.com/appbaseio/reactivesearch/issues/731)

### v1.0.0-beta.2

-   Fix class name in DataSearch input [#697](https://github.com/appbaseio/reactivesearch/issues/697)

### v1.0.0-alpha.3

-   Add MultiDropdownList Component [#610](https://github.com/appbaseio/reactivesearch/issues/610)
-   Add SingleDropdownList Component [#605](https://github.com/appbaseio/reactivesearch/issues/605)

### v1.0.0-alpha.2

-   Move vue types from reactivecore to vue [[61624dcd]](https://github.com/appbaseio/reactivesearch/commit/61624dcd)
-   Add ReactiveSearch for VueJS [#586](https://github.com/appbaseio/reactivesearch/issues/586)
