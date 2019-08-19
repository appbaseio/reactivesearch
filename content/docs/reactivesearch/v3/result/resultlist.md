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
nestedSidebar: 'web-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/iY2csRm.png)

`ResultList` creates a list UI component for a particular result item, it can be used with `ReactiveList` to display results in a list layout, suited for data that needs a compact display.

Example uses:

-   showing e-commerce search listings.
-   showing filtered hotel booking results.

> Note
>
> An alternative layout to ResultList is a [**ResultCard**](/docs/reactivesearch/v3/result/resultcard/), which displays result data in a card layout.

## Usage

### Basic Usage

```js
import {
    ReactiveList,
    ResultList
} from '@appbaseio/reactivesearch';

const { ResultListWrapper } = ReactiveList;


<ReactiveList
    react={{
        "and": ["PriceFilter", "SearchFilter"]
    }}
    componentId="SearchResult"
>
    {({ data, error, loading, ... }) => (
        <ResultListWrapper>
            {
                data.map(item => (
                    <ResultList key={item._id}>
                        <ResultList.Image src={item.image} />
                        <ResultList.Content>
                            <ResultList.Title
                                dangerouslySetInnerHTML={{
                                    __html: item.original_title
                                }}
                            />
                            <ResultList.Description>
                                <div>
                                    <div>by {item.authors}</div>
                                    <div>
                                        ({item.average_rating} avg)
                                    </div>
                                </div>
                                <span>
                                    Pub {item.original_publication_year}
                                </span>
                            </ResultList.Description>
                        </ResultList.Content>
                    </ResultList>
                ))
            }
        </ResultListWrapper>
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
> ResultList component accepts all the properties of html `a` tag.

## Sub Components

-   **Image**
    use it to render the result list image.
    <br/>
    The `ResultList.Image` accepts the following properties:
    -   **`src`**: `string`
        source url of the image
    -   **`small`**: `boolean`
        defaults to `false`, if `true` then renders an image of small size.
-   **Content**
    use it to wrap the result list content other than image.
-   **Title**
    renders the title of the result list.
-   **Description**
    can be used to render the result list description UI.

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/web/examples/ResultList" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Examples

See more stories for ResultList on playground.

<a href="https://opensource.appbase.io/playground/?selectedKind=Result%20components%2FResultList" target="_blank">ResultList stories</a>
