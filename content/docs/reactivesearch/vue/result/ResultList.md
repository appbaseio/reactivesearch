---
title: 'ResultList'
meta_title: 'ResultList'
meta_description: '`ResultList` creates a list UI component for a particular result item, it can be used with `ReactiveList` to display results in a list layout, suited for data that needs a compact display.'
keywords:
    - reactivesearch
    - resultlist
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'vue-reactivesearch'
---
 
![Imgur](https://i.imgur.com/oevEwGb.png)

`ResultList` creates a list UI component for a particular result item, it can be used with `ReactiveList` to display results in a list layout, suited for data that needs a compact display.

Example uses:

-   showing e-commerce search listings.
-   showing filtered hotel booking results.

> Note
>
> An alternative layout to ResultList is a [**ResultCard**](/docs/reactivesearch/v3/result/resultcard/), which displays result data in a card layout.

## Usage

```html
<template>
    <reactive-list
        componentId="SearchResult"
        dataField="original_title.raw"
        :from="0"
        :size="5"
    >
        <div slot="render" slot-scope="{ data }">
            <result-list-wrapper>
                <result-list
                    v-bind:key="result._id"
                    v-for="result in data"
                >
                    <result-list-image :small="true" :src="result.image" />
                    <result-list-content>
                        <result-list-title>
                            {{result.original_title}}
                        </result-list-title>
                        <result-list-description>
                            <div>
                                <p>
                                    <em>by {{result.authors}}</em>
                                </p>
                                <p>
                                    <b>{{result.average_rating}}</b> ⭐
                                </p>
                                <span>Pub {{result.original_publication_year}}</span>
                            </div>
                        </result-list-description>
                    </result-list-content>
                </result-list>
            </result-list-wrapper>
        </div>
    </reactive-list>
</template>
```

## Props

-   **target** `string` [optional]
    This prop is equivalent to the `target` attribute of html `a` tags. It defaults to `_blank`.
-   **href** `string` [optional]
    can be used to specify the URL of the page the link goes to

> Note
>
> ResultList component accepts all the properties of html `a` tag.

## Sub Components

-   **ResultListImage**
    use it to render the result list image.
    <br/>
    It accepts the following props:
    -   **`src`**: `string`
        source url of the image
    -   **`small`**: `boolean`
        defaults to `false`, if `true` then renders an image of small size.
-   **ResultListContent**
    use it to wrap the result list content other than image.
-   **ResultListTitle**
    renders the title of the result list.
-   **ResultListDescription**
    can be used to render the result list description UI.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/vue/examples/result-list" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
