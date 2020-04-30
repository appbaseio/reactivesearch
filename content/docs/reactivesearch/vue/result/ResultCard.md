---
title: 'ResultCard'
meta_title: 'ResultCard'
meta_description: '`ResultCard` creates a card UI component for a particular result item, it can be used with `ReactiveList` to display results in a card layout, suited for data that have an associated image.'
keywords:
    - reactivesearch
    - resultcard
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'vue-reactivesearch'
---

![Imgur](https://i.imgur.com/mKcFEnV.png)

`ResultCard` creates a card UI component for a particular result item, it can be used with `ReactiveList` to display results in a card layout, suited for data that have an associated image.

Example uses:

-   showing e-commerce search results in a card layout.
-   showing filtered hotel booking results in a card layout.

> Note
>
> An alternative layout to ResultCard is a [**ResultList**](/docs/reactivesearch/vue/result/ResultList/), which displays result data in a list format.

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
            <result-cards-wrapper>
                <result-card
                    v-bind:key="result._id"
                    v-for="result in data"
                >
                    <result-card-image :src="result.image" />
                    <result-card-title>
                        {{result.original_title}}
                    </result-card-title>
                    <result-card-description>
                        <div>
                            <p>
                                <em>by {{data.authors}}</em>
                            </p>
                            <p>
                                <b>{{data.average_rating}}</b> ⭐
                            </p>
                            <span>Pub {{data.original_publication_year}}</span>
                        </div>
                    </result-card-description>
                </result-card>
            </result-cards-wrapper>
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
> ResultCard component accepts all the properties of html `a` tag.

## Sub Components
-   **ResultCardImage**
    use it to render the result card image.
    <br/>
    It accepts the following props:
    -   **`src`**: `string`
        source url of the image
-   **ResultCardTitle**
    renders the title of the result card.
-   **ResultCardDescription**
    can be used to render the result card description UI.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/vue/examples/result-card" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
