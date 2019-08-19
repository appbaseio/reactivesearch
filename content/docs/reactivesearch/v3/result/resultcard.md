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
nestedSidebar: 'web-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/KnrGoRk.png)

`ResultCard` creates a card UI component for a particular result item, it can be used with `ReactiveList` to display results in a card layout, suited for data that have an associated image.

Example uses:

-   showing e-commerce search results in a card layout.
-   showing filtered hotel booking results in a card layout.

> Note
>
> An alternative layout to ResultCard is a [**ResultList**](/docs/reactivesearch/v3/result/resultlist/), which displays result data in a list format.

## Usage

### Basic Usage

```js
import {
    ReactiveList,
    ResultCard
} from '@appbaseio/reactivesearch';

const { ResultCardWrapper } = ReactiveList;


<ReactiveList
    react={{
        "and": ["PriceFilter", "SearchFilter"]
    }}
    componentId="SearchResult"
>
    {({ data, error, loading, ... }) => (
        <ResultCardWrapper>
            {
                data.map(item => (
                    <ResultCard key={item._id}>
                        <ResultCard.Image src={item.image}/>
                        <ResultCard.Title
                            dangerouslySetInnerHTML={{
                                __html: item.original_title
                            }}
                        />
                        <ResultCard.Description>
                            <div>
                                <div>by {item.authors}</div>
                                <div>
                                    ({item.average_rating} avg)
                                </div>
                            </div>
                            <span>
                                Pub {item.original_publication_year}
                            </span>
                        </ResultCard.Description>
                    </ResultCard>
                ))
            }
        </ResultCardWrapper>
    )}
</ReactiveList>
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

-   **Image**
    use it to render the result card image.
    <br/>
    The `ResultCard.Image` accepts the following props:
    -   **`src`**: `string`
        source url of the image
-   **Title**
    renders the title of the result card.
-   **Description**
    can be used to render the result card description UI.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/web/examples/ResultCard" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Examples

See more stories for ResultCard on playground.

<a href="https://opensource.appbase.io/playground/?selectedKind=Result%20components%2FResultCard" target="_blank">ResultCard Stories</a>
