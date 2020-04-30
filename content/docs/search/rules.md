---
title: 'Query Rules For Clusters'
meta_title: 'Query Rules For Clusters'
meta_description: 'Query Rules are essentially `If-This-Then-That`'
keywords:
    - concepts
    - appbaseio
    - elasticsearch
    - queryrules
sidebar: 'docs'
---

## Overview

Query Rules let you make precise, predetermined changes to your search results or search queries, thus allowing you to enhance search experience. For example, you can reposition items in a user’s search results or activate filters based on query terms. Rules can also be enabled for a fixed period of time: this makes Rules a great way of implementing sales or promotions. Query Rules are essentially `If-This-Then-That` construct - **_If_** **search query contains 'Google',** **_then_**
**promote 'Chromebook'.** Query Rules serve a very specific purpose as far as search results and merchandising is concerned. When building a commercial search product, customers more often than not require commercializing the product based on certain search queries.

![query rule dashboard](https://www.dropbox.com/s/1n4uznradc78lch/Screenshot%202020-02-20%2011.06.00.png?raw=1)

> Query rules are available with **Production I, II, III and IV** cluster plans or with the **Enterprise Plan** for Self Hosted Appbase.io.

## Use Cases

Here are some use cases where Query Rules can help you improve search relevance

-   Dynamically update facets based on query. Example if a user is searching for "laptops", show filters related laptops only
-   Promote result during discounts / sale on your store
-   Hide products that are not available
-   Hide irrelevant results
-   Replace search term based on data available

## Configure **If** Condition

**If** conditions helps in deciding when to trigger a query rule based on which configured actions will be executed. There are 2 types of trigger

1.  **Always:**

    This is helpful when you want to execute an action with all the search request. Example you want to always **hide** a product which is no longer available in store.

2.  **Condition**

    This is helpful when you want to execute an action with specific search / filter condition. Example if query `contains` a specific search term. There are 4 types of search condition which you can configure

    -   `Query is`: applied when there is an **exact** query match
    -   `Query contains`: applied when a search query contains the specified query
    -   `Query starts with`: applied when a search query starts with the specified query
    -   `Query ends with`: applied when a search query ends with the specified query

    <br />
    Here, you can also configure filter condition, which can help you set trigger based on filtering field and value. Example, `brand` is `apple`.

You can also configure rules for specific `indexes` in your ElasticSearch cluster and for a specific `time period` (example you only want to promote result for a seasonal sale on your ecommerce store ). By default, it is applicable on all the indexes and all the time.

![configure if condition](https://www.dropbox.com/s/3zdnfuzm9bnqln3/Screenshot%202020-02-20%2010.20.25.png?raw=1)

## Configure **Then** Actions

**Then** actions help you configure the actions that you want to invoke when triggering conditions are matched. Following are the actions that you can invoke

> Note: Actions are executed in the order in which are the listed in your dashboard. You can drag and drop to change the sequence of executing actions.

### Promote Results

Helps in promoting result at certain position in your result set. Example when a user searches for `iphone` you want to promote `air pods`.

![promote result](https://www.dropbox.com/s/sxvshcbmwn7u24j/Screenshot%202020-02-20%2010.25.52.png?raw=1)

### Hide Results

Helps in hiding certain results from getting included in the actual search results. Example you want to hide products that not available in the store, or you want to hide results that contains irrelevant data.

![hide result](https://www.dropbox.com/s/ppnhqqwytmxqqw1/Screenshot%202020-02-20%2010.35.40.png?raw=1)

### Custom Data

Helps in sending the custom `JSON` data in search response. This will be helpful when you want to send some extra information to frontend, which can help in rendering more specific information.

![custom data](https://www.dropbox.com/s/nhwr6vglqouxkh5/Screenshot%202020-02-20%2010.44.18.png?raw=1)

### Replace Search Term

Helps in replacing the user’s entire search query with another query. Helps in showing relevant results to users, specially when you are aware from the analytics that certain search term is returning no results.

![replace search term](https://www.dropbox.com/s/p0he4889pkbl1u8/Screenshot%202020-02-20%2010.50.10.png?raw=1)

### Remove Words

Removing words is the progressive loosening of query constraints to include more results when none are initially found.

For example, imagine an online smartphone shop that sold a limited inventory of iPhones in only 16GB and 32GB varieties. Users searching for “iphone 5 64gb” would see no results. This is not ideal behavior - it would be far better to show users some iPhone 5 results instead of a blank page.

You can remove multiple words by space separated values. E.g. `iphone samsung`.

![remove words](https://i.imgur.com/ArDcJRn.png)

### Replace Words

Rules offers an alternative. You can now replace words instead of adding new ones. For example, if you make `tv` a synonym for `television`, Rules will replace `tv` with `television` so that only `television` is used to search.

![replace-word](https://i.imgur.com/ps6JH9A.png)

### Functions

Helps in doing more customization with search or handling edge cases around search relevancy. Functions lets you implement any custom action. Example you want to perform natural language processing on search query.

![function](https://www.dropbox.com/s/tsrj68q3yixcp2n/Screenshot%202020-02-20%2010.59.35.png?raw=1)

For more information you can read functions [docs](/docs/search/functions/).

> Note: a function linked with Query Rule cannot have its own triggering condition.
