# Changelog

## Unreleased

<details>
    <summary>The following changes have been included in the <code>dev</code> branch and will be out in the next release. <b>Click to expand</b></summary>
</details>

## v2.6.5
- core: Fix an edge case with generating suggestions with numeric splits [#8](appbaseio/reactivecore/issues/8)
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
