# Charts Dashboard

This app is a charts dashboard app which has two pages `explore` and `search`. Those are defined as below.

-   An explore page where we can apply various filters and see the number of results it finds.
-   A search page where we can see the details of the results.
-   The explore page can drill down to the search page with all the facets selected on the page.

### Running the app locally

It as easy as installing all the dependencies `yarn` and then starting the server `yarn start`.

### How to add a chart facet?

For this, we use [`ReactiveChart`](https://docs.reactivesearch.io/docs/reactivesearch/v3/chart/reactivechart/) component and pass it required props to show us a desired chart. `componentId` differentiates this facet from others. `dataField` determines the field in your dataset/index on which you want to query. Finally, `chartType` is the chart you want to render. It can be pie, bar, line, etc. You can look at how we can configure different chart facets in the [documentation](https://docs.reactivesearch.io/docs/reactivesearch/v3/chart/reactivechart/).
