---
title: 'Pages'
meta_title: 'Using Pages in Ghost - Core Concepts'
meta_description: 'Decide whether your content is a page or a post with one click - Learn more about static content with Ghost!'
keywords:
    - concepts
    - ghost
    - publishing
    - pages
sidebar: 'docs'
---

## Part 1: Introduction

Query Rules are essentially `If-This-Then-That` construct - **_If_** **search query contains 'Google',** **_then_**
**promote 'Chromebook'.** Query Rules serve a very specific purpose as far as search results and merchandising is
concerned. When building a commercial search product, customers more often than not require commercializing the product
based on certain search queries.

One of the most common approach to achieve this is to **promote** or **hide** certain search results based on a given
query. Query Rules automates this process by allowing users to curate `If-This-Then-That` rules. For example, a user can
create a rule to **promote** an external document or result when a particular search query is fired. The rule is then
triggered automatically whenever that search query is fired and appends the promoted document along with the search
results. Similarly, a rule can be created that prevents i.e. **hides** certain results from getting included in the
actual search results.

## Part 2: Query Rules using Dashboard

The dashboard provides an intuitive way to create, manage and configure your Query Rules. In fact, you can visualize
and tune your search results while you are creating the rule. After the rule is created, you can always tweak it later
based on your search and merchandising needs.

In order to create a Query Rule, select `Query Rules` under `Develop` on the dashboard's navigation bar.

![](https://i.imgur.com/uszkL7s.png)

Creating a rule from dashboard is a two-step process. In the first step you configure the **_If_** condition of the rule.
Query Rule currently supports four `operators`:

-   `is`: resembles the docs with **exact** query match
-   `starts_with`: resembles the docs that **starts with** the given query
-   `ends_with`: resembles the docs that **ends with** the given query
-   `contains`: resembles the docs that **contains** the given query

For example: After the configuring this step, what we achieve is something similar to:
**_If_** **search query contains 'Google'**, where the `operator` is `contains` and `query` is `Google`.

<!-- If condition image -->

![](https://i.imgur.com/rzOq63Q.png)

The second step consists of configuring of actions that are triggered when the **_If_** condition of the query is
matched. Query Rule currently supports two `actions`:

-   `promote`: appends external docs or results along with the actual search results
-   `hide`: prevents certain results from getting included in the resturned search results

<!-- Then condition image each for promote and hide -->

![](https://i.imgur.com/biuc4SL.png)

## Part 3: Query Rules using API

The dashboard provides an easier way to tune and visualize the query rules, however you can also manage them via API.
The rule can be divided into two main segments:

1. **_If_** clause:

The **If** clause comprises of both `query` and `operator`. Currently supported `operators` are listed in the
section above. Whenever a search query matches the **If** clause, it automatically triggers the **Then** clause of the
rule.

```json
{
    ..
    "if": {
        "query": "harry potter",
        "operator": "contains"
    }
    ...
}
```

2. **_Then_** clause:

The **Then** clause comprises of `actions` that are to be executed when a rule is triggered. Currently supported
`actions` are listed in the section above.

```json
{
    ...
    "then": {
        "promote": [
            {
                "id": "harry_potter_cheat_sheet",
                "name": "Harry Potter",
                "section_order": [
                    "Books",
                    "Movies",
                    "Franchise"
                ],
                "template_type": "reference"
            }
        ],
        "hide": [
            { "doc_id": "Jle44WgBnfYvZBcA0H66" }
        ]
    }
    ...
}
```

A complete query rule may look similar to:

```json
{
	"id": "contains_harry_potter",
	"if": {
		"query": "harry potter",
		"operator": "contains"
	},
	"then": {
		"promote": [
			{
				"id": "harry_potter_cheat_sheet",
				"name": "Harry Potter",
				"section_order": ["Books", "Movies", "Franchise"],
				"template_type": "reference"
			}
		],
		"hide": [{ "doc_id": "Jle44WgBnfYvZBcA0H66" }]
	}
}
```

**Note**: The rule `id` is an optional field, in case it isn't provided, it will be generated automatically
based on the `query` and `operator`.

Now that we have constructed the `rule` object, we can create the query rule by executing the following request:

```sh
curl --location --request POST "https://accapi.appbase.io/app/book-store/rule" \
  --header "Content-Type: application/json" \
  --data '
{
    "id": "contains_harry_potter",
    "if": {
        "query": "harry potter",
        "operator": "contains"
    },
    "then": {
        "promote": [
            {
                "id": "harry_potter_cheat_sheet",
                "name": "Harry Potter",
                "section_order": [
                    "Books",
                    "Movies",
                    "Franchise"
                ],
                "template_type": "reference"
            }
        ],
        "hide": [
            { "doc_id": "Jle44WgBnfYvZBcA0H66" }
        ]
    }
}
'
```

We can similarly add more rules and update or delete the existing query rules via API. Checkout the Query Rules REST
API [documentation](https://documenter.getpostman.com/view/2848488/RW81vt5x#723b2a22-e515-4950-adec-ab3b64ccfcd7) for
more information.

## Part 4: Query Rules Responses

In order to run the search queries against the query rules, we need to pass in the query value in the `X-Search-Query`
header. For example:

```sh
curl -XGET https://${credentials}@scalr.api.appbase.io/movie-store/_msearch \
  -H 'Content-Type: application/json' \
  -H 'X-Search-Query: harry potter' \
  -d '
{
    "query": {
        "match": {
            "original_title": "harry potter"
        }
    }
}
'
```

The search query `harry potter` subsequently matches the rule we created in the previous section. What happens is the
**If** clause i.e. **_If_** **search query contains 'harry potter'** resolves to true, and so the **Then** clause is
subsequently triggered. Our rule specifies two actions in the **Then** clause: `promote` the given doc and `hide` a
search result with `{ "doc_id": "Jle44WgBnfYvZBcA0H66" }`.

Therefore, both these actions get applied to the elasticsearch's response to our original query. The **promoted**
results will get appended under the `promoted` field and the **hidden** results will be removed from the original
results. An example `search` response would look similar to this:

```json
{
	"took": 8,
	"timed_out": false,
	"_shards": {
		"failed": 0,
		"skipped": 0,
		"successful": 3,
		"total": 3
	},
	"hits": {
		"max_score": 5.4339542,
		"total": 3,
		"hits": [
			{
				"_id": "AWjmCtx674JxTt-e5Gzs",
				"_index": "movie-store",
				"_score": 4.480236,
				"_source": {
					"genres": "",
					"original_language": "English",
					"original_title": "Harry Potter and the Deathly Hallows: Part 1",
					"overview": "Harry, Ron and Hermione walk away from their last year at Hogwarts to find and destroy the remaining Horcruxes, putting an end to Voldemort's bid for immortality.",
					"poster_path": "https://image.tmdb.org/t/p/w185/maP4MTfPCeVD2FZbKTLUgriOW4R.jpg",
					"release_year": 2010,
					"tagline": "One Way… One Fate… One Hero."
				},
				"_type": "movies"
			}
		]
	},
	"promoted": [
		{
			"id": "harry_potter_cheat_sheet",
			"name": "Harry Potter",
			"section_order": ["Books", "Movies", "Franchise"],
			"template_type": "reference"
		}
	]
}
```
