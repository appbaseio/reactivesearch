# Changelog

## Unreleased

<details>
    <summary>The following changes have been included in the <code>dev</code> branch and will be out in the next release. <b>Click to expand</b></summary>
</details>

## v2.14.0
- Fixes loading for result component - [info](https://github.com/appbaseio/reactivesearch/commit/786851c89e17f6c93fec11d6e7a9580bb0065eae)
- Adds support for `renderTooltipData` for custom tooltip content [#611](https://github.com/appbaseio/reactivesearch/pull/611)
- Adds nested object mapping support for MultiList [#595](https://github.com/appbaseio/reactivesearch/issues/595)

## v2.13.0
- Add `tooltipTrigger` in slider components [#284](https://github.com/appbaseio/reactivesearch/issues/284)
- Support nested object mapping in DropdownList comps - Add `nestedField` prop [#595](https://github.com/appbaseio/reactivesearch/issues/595)
- [TS] add renderSuggestions as props on DataSearch and CategorySearch [#591](https://github.com/appbaseio/reactivesearch/issues/591)
- Add polyfill for `Array.find` [#590](https://github.com/appbaseio/reactivesearch/issues/590)
- Add showFilter prop value to selected-filters [#589](https://github.com/appbaseio/reactivesearch/issues/589)
- Handle transformRequest initialization in ReactiveBase [#574](https://github.com/appbaseio/reactivesearch/pull/574)
- Add tooltip in RangeSlider [#553](https://github.com/appbaseio/reactivesearch/pull/553)

## v2.12.1
- Add `Title` prop support in `SelectedFilters` - [info](https://github.com/appbaseio/reactivesearch/commits/dev)
- Fix use of `this` in static method in Date component [#567](https://github.com/appbaseio/reactivesearch/pull/567)
- Add `_type` meta data in parsed-hits - [info](https://github.com/appbaseio/reactivecore/commit/18c3f5f29fb5d398d83e8e574208470a2c0069de)

## v2.12.0
- Rename `beforeSend` to `transformRequest` as in appbase-js version 4 [#568](https://github.com/appbaseio/reactivesearch/issues/568)
- Add better support for consecutive loading in aggs [#515](https://github.com/appbaseio/reactivesearch/issues/515)
- Fix showLoadMore usage which led to duplicate keys errors [#549](https://github.com/appbaseio/reactivesearch/issues/549)

## v2.11.1
- sync url params before updating or deleting - [#566](https://github.com/appbaseio/reactivesearch/issues/566)
- Add error log for url state parsing - [info](https://github.com/appbaseio/reactivesearch/commit/1ffecdf95b68acbb1f0a220eed129c4fba809e07)
- Add redux dev tools support [#565](https://github.com/appbaseio/reactivesearch/issues/565)

## v2.11.0
- update core - cleanup
- Add `downShiftProps` prop for the Downshift component in search components [#516](https://github.com/appbaseio/reactivesearch/issues/516)
- Fix SelectedFilters and URLParams behavior - [#497](https://github.com/appbaseio/reactivesearch/issues/497)
- Fix re-rendering issues with queryLog - causing ReactiveList breakage - [info](https://github.com/appbaseio/reactivesearch/commit/19e757bcc9c10b999ac815a5fe53bbe6a29512ed)
- Remove ReactiveList event listener on unmount conditionally - [info](https://github.com/appbaseio/reactivesearch/commit/6cd0333a5c29362603bb70a1c76dbdc02279e99d)

## v2.10.3
- Fixes react prop behavior for array of (conjunction) objects.

## v2.10.2
- Fixes react prop behavior for array of (conjunction) objects.

## v2.10.1
- Fix dom-node initialisation for `scrollTarget` - [#543](https://github.com/appbaseio/reactivesearch/pull/543)

## v2.10.0

- Support array of (conjunction) objects in react prop - [commit](https://github.com/appbaseio/reactivesearch/commit/b812d7b5239b2aac6bb93018a4e8c305a644f1aa)
- Fix page change behavior on query change - [commit](https://github.com/appbaseio/reactivesearch/commit/07f80914b03ef4c80e572960fe4e152312137de6)
- Adds on demand loading in list components for [#515](https://github.com/appbaseio/reactivesearch/issues/515)
- Support Pagination with JS disabled in browser (helpful in crawling) [#477](https://github.com/appbaseio/reactivesearch/issues/477)
- Add support for scrollTarget [#369](https://github.com/appbaseio/reactivesearch/issues/369)

## v2.9.1
- Appbase-js build fixes
- No restriction on API endpoint for analytics

## v2.9.0
- Update appbase-js version to latest [#506](https://github.com/appbaseio/reactivesearch/issues/506)
- Dynamically change include/exclude Fields [#417](https://github.com/appbaseio/reactivesearch/issues/417)
- Fix empty categories in suggestions for `CategorySearch` [#502](https://github.com/appbaseio/reactivesearch/issues/502)
- Fix `defaultSuggestions` not appearing in `CategorySearch` [commit](https://github.com/appbaseio/reactivesearch/commit/776074f766d5e4c14759ed36e1531d234df35e91)
- Add analytics support [#484](https://github.com/appbaseio/reactivesearch/issues/484)
- Fix result of `defaultSelected` function not evaluated by `isEqual` [#407](https://github.com/appbaseio/reactivesearch/issues/407)
- Add support for `transformData` on list components - [commit](https://github.com/appbaseio/reactivesearch/commit/a00ae14c92ced1c0778f4e3f7bbdebaabd1e90bb)

## v2.8.2
- Fixes issue with cursor jumping in search componentes [#394](https://github.com/appbaseio/reactivesearch/issues/394)
- Upgrades reactivecore to v4.3.0

## v2.8.1
- Fix suggestion parsing where some suggestions were missed due to case sensitive checks [#480](https://github.com/appbaseio/reactivesearch/issues/480)
- Add `renderSuggestions` support in `DataSearch` and `CategorySearch` [#354](https://github.com/appbaseio/reactivesearch/issues/354)

## v2.8.0
- Add custom rendering support in SelectedFilters - [#121](https://github.com/appbaseio/reactivesearch/issues/121) [#415](https://github.com/appbaseio/reactivesearch/issues/415)
- Add `showSearch` support for DropdownList components [#468](https://github.com/appbaseio/reactivesearch/issues/468)
- Show defaultSuggestions in search components even when autosuggest is false [#359](https://github.com/appbaseio/reactivesearch/issues/359)
- Replace internal `shade` function with `polished`. This should give more expected results for different theme colors [#420](https://github.com/appbaseio/reactivesearch/issues/420)
- Improve pagination a11y [#448](https://github.com/appbaseio/reactivesearch/issues/448)
- Fix suggestion selection in `CategorySearch` when the value remains same but the category changes [here](https://github.com/appbaseio/reactivesearch/commit/0565af3b20e025e88a9a3034a9ce1f69310f5640)
- Add beta support for analytics

## v2.7.0
- Add support for `histogramQuery` prop in RangeSlider component - [#459](https://github.com/appbaseio/reactivesearch/pull/459)
- Add support for aggs with query size 0 for hits removal - [#459](https://github.com/appbaseio/reactivesearch/pull/459) and [here](https://github.com/appbaseio/reactivesearch/commit/5d88dbd0b0f1d3291f3de3571f5a85a9f2a4f2d5)
- Adds typings to npm package [#466](https://github.com/appbaseio/reactivesearch/issues/466)
- Extend `SelectedFilters` support for range slider components i.e. `RangeInput`, `RangeSlider` and `DynamicRangeSlider`. The usage is similar to other components, with the `showFilter` prop. [#442](https://github.com/appbaseio/reactivesearch/issues/442)
- Update `defaultQuery` prop append logic for search components [here](https://github.com/appbaseio/reactivesearch/commit/46177528d5ed0b00a4a0cc5d7e8d5dec0adfaa69). `defaultQuery` is now always appended regardless of the `customQuery`
- Adds pagination support in SSR [#441](https://github.com/appbaseio/reactivesearch/issues/441) - This is a `Breaking Change`. Your app will be affected if you have `pagination` and `URLParams` enabled on the result component.
- Addresses [#460](https://github.com/appbaseio/reactivesearch/issues/460) - Instead of adding a new prop to customise the url params, we have removed `-page` string from the result component. Hence, you can now set `p` or `page` as the componentId and expected results can be achieved.
- Search components `DataSearch` and `CategorySearch` now don't fire a query when the input was blurred (Implemented [here](https://github.com/appbaseio/reactivesearch/commit/b9f88e3969fe22fab72d452d38c6dbf002047f94) and [here](https://github.com/appbaseio/reactivesearch/commit/d2b6b8f065af0a425bae1cc8c9a7ac9c3193488e)). This is a critical UX change and will also affect when `onValueSelected` was called.
- Add `strictSelection` support in `DataSearch` and `CategorySearch` [#381](https://github.com/appbaseio/reactivesearch/issues/381)
- Include `cause` and `source` object (if the cause was `'SUGGESTION_SELECT'`) in `onValueSelected` [#387](https://github.com/appbaseio/reactivesearch/issues/387)
- Fix unnecessary renders in `ReactiveList` [#444](https://github.com/appbaseio/reactivesearch/issues/444)
- Add support for store updates on url change [#360](https://github.com/appbaseio/reactivesearch/issues/360)
- Added include & exclude Fields as query options in Result Components [#417](https://github.com/appbaseio/reactivesearch/issues/417)

## v2.6.12
- Upgrade reactivecore and appbase-js

## v2.6.11
- Upgrade reactivecore and fix an import with maps

## v2.6.10
- Upgraded reactivecore to improve reactive-maps behavior and experience

## v2.6.9
- Fix an issue with `ReactiveList` rendering 'undefined' as class [#416](https://github.com/appbaseio/reactivesearch/issues/416)
- Fix an issue with `DateRange` field to accept both string and array [#421](https://github.com/appbaseio/reactivesearch/issues/421)
- Fix some edge cases in `DateRange` and add hover effect when selecting a date range [PR #428](https://github.com/appbaseio/reactivesearch/pull/428)
- Fix `react` prop update in `ReactiveComponent` [PR #451](https://github.com/appbaseio/reactivesearch/pull/451)
-  Add onFilterCleared prop to SelectedFilters [#401](https://github.com/appbaseio/reactivesearch/issues/401)

## v2.6.8
- Update core dependencies to fix streaming issues

## v2.6.7
- Add `defaultQuery` in search components [#353](https://github.com/appbaseio/reactivesearch/issues/353) (Support will be added in other components in coming releases)
- Add `onPageClick` in result components [#396](https://github.com/appbaseio/reactivesearch/issues/396)
- Add `containerProps` in `ResultCard` and `ResultList` [#376](https://github.com/appbaseio/reactivesearch/issues/376)

## v2.6.6
- Fix issue with `onValueSelected` getting called twice [here](https://github.com/appbaseio/reactivesearch/commit/dc60b2e46a8b6d923224e4fd6f017f535a35f79f)
- Support dyanmic props on ReactiveBase component [#373](https://github.com/appbaseio/reactivesearch/issues/373)
- Handle pagination updates on defaultQuery change in result components - [here](https://github.com/appbaseio/reactivesearch/commit/b7543e2f73828fc4bd846bc00ac1d2aa2b35e2ca)

## v2.6.5
- core: Fix an edge case with generating suggestions with numeric splits [#8](https://github.com/appbaseio/reactivecore/issues/8)
- core: Add `_index` key to hits - to help segregate the hits handling based incase of multiple indexes [#9](https://github.com/appbaseio/reactivecore/pull/9/)
- core: Fix onQueryChange behavior [#335](https://github.com/appbaseio/reactivesearch/issues/335) [#362](https://github.com/appbaseio/reactivesearch/issues/362)

## v2.6.4
- Architectural fixes to persist the watchman state in case of component unmount - This helps in keeping the component subscription active incase the component gets remounted.

## v2.6.3
- Add `onValueSelected` in search components [#254](https://github.com/appbaseio/reactivesearch/issues/254)
- Fix issue #371 resetting page number on sort change [#372](https://github.com/appbaseio/reactivesearch/pull/372)
- Cleanup stale url-params on component unmount [#368](https://github.com/appbaseio/reactivesearch/issues/368)

## v2.6.2

- Fixed query timestamp logic in core - should prevent stale results from getting rendered

## v2.6.1

- Fixed (multiple) partial queries firing issues with result component [here](https://github.com/appbaseio/reactivesearch/commit/254598be037c44a31a5aeed941176007bd1ca722)
- Fixed MultiDataList missing queryListener handlers [here](https://github.com/appbaseio/reactivesearch/commit/89d3ffb278e20233b84abd1f2df89441d9a17664)

## v2.6.0

- Fix `onSuggestion` rendering logic in search components [here](https://github.com/appbaseio/reactivesearch/commit/a2fa590710a77c9298b88a501074d08e326eb76e)
- Add `onError` support in result components [here](https://github.com/appbaseio/reactivesearch/commit/6c01c872e9211339ad972b69296f2b1da1e4fa12)
- Support toggling on integer based dropdown lists [#337](https://github.com/appbaseio/reactivesearch/commit/c10b5f222cd21e01b0208351f8d64c56e6eda148)
- Fix and cleanup infinte loading logic in Result components [#336](https://github.com/appbaseio/reactivesearch/commit/b4835ea2d623667852fdd466690cf0d66ecba5cd)
- Fix queryOptions generation logic in search components [here](https://github.com/appbaseio/reactivesearch/commit/88c850a8cc90060373a520ed73f01afc8ef05dce)
- Better query generation support in core.
- Fix complex react prop based query generation logic in core.


## v2.5.1

- Fix defaultQuery behavior in ReactiveComponent
- fix [#329](https://github.com/appbaseio/reactivesearch/issues/329) - highlightQuery issue with SSR
- update query logic for SSR
- update URLParams prop type to bool

## v2.5.0

- Add dynamic defaultQuery support in ReactiveComponent [#313](https://github.com/appbaseio/reactivesearch/issues/313)
- Fix an edge case with SingleDropdownList which threw React into an infinite update loop [#317](https://github.com/appbaseio/reactivesearch/issues/317)
- Add support for `showClear` and `clearIcon` props in `TextField`, `DataSearch` and `CategorySearch` [#255](https://github.com/appbaseio/reactivesearch/issues/255)
- Add support for combined queries via `msearch`
- Add support for SSR
- Fix onValueChange behavior

## v2.3.3

- Use commonjs module for `rheostat` [#289](https://github.com/appbaseio/reactivesearch/issues/289)
- Adds support for aggregations on missing values for list components via `showMissing` and `missingLabel` prop [#291](https://github.com/appbaseio/reactivesearch/issues/291)
- Adds `onDrag` support for RangeSlider components [#284](https://github.com/appbaseio/reactivesearch/issues/284)
- Fixes dynamic size and pagination updates [#298](https://github.com/appbaseio/reactivesearch/issues/298)
- Refactor Result Components [#303](https://github.com/appbaseio/reactivesearch/issues/303)

## v2.3.2

- Add `customHighlight` prop support in `DataSearch` and `CategorySearch` [#285](https://github.com/appbaseio/reactivesearch/issues/285)
- Add `renderListItem` prop support in `Single/Multi/DropdownList` components [#282](https://github.com/appbaseio/reactivesearch/issues/282)

## v2.3.1

- Add 🌳 tree shaking capabilities with ES modules support [here](https://github.com/appbaseio/reactivesearch/commit/62a2ace6148fbbe6795ea69fc85a0ea260501a72)
