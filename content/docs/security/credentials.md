---
title: 'API Credentials'
meta_title: 'API Credentials - Core Concepts'
meta_description: 'API credentials allow secure access to the appbase.io apps and clusters.'
keywords:
    - concepts
    - appbaseio
    - credentials
    - api
sidebar: 'docs'
---

API credentials allow secure access with fine-grained access controls to the appbase.io clusters.

## Access Controls
### Access Type

API credentials allow one of three access types:

![](https://i.imgur.com/KsFdsMX.png)

- A `Read-only` access type offers access to read operations, e.g. searching but not updating of documents.
- A `Write-only` access type offers access to write operations, e.g. creating or updating of documents but not getting nor searching.
- A `Read & Write` access type doesn't restrict the API credential based on operations.

### Categories

API Categories allow restricting an API credential by the kind of operation.

![](https://i.imgur.com/2C3KT0j.png)

Search related categories:

- **Reactive Search** - Query via the ReactiveSearch API, a declarative opensource API to query Elasticsearch
- **Analytics** - Track analytics and impressions, typically used together with the ReactiveSearch API
- **Stored Queries** - Allow white-listed queries, think parameterized Elasticsearch DSL to be used directly or in conjunction with ReactiveSearch API

Elasticsearch endpoints related categories:

- **Search** - Allow searching via the Elasticsearch Query DSL using `_search`, `_msearch` and similar actions.
- **Docs** - Allow CRUD operations on documents such as `create`, `index`, `update`, `get`, and `delete`.
- **Indices** - Allow index specific actions such as `settings`, `mappings`, `open`, `close`.
- **Clusters** - All cluster specific actions such as `cluster` `nodes`, `tasks`, `remote`, `cat`.
- **Cat** - All `cat` actions specifcally.
- **Misc** - Actions such as `script`, `get`, `ingest`, and `snapshot`.

ReactiveSearch and appbase.io plugins related categories:

- **Search Relevancy** - Allow search relevancy related actions
- **Cache** - Allow cache related actions
- **Suggestions** - Allow suggestions related actions
- **Rules** - Allow query rules related actions
- **Synonyms** - Allow synonyms related actions
- **User** - Allow user related actions
- **Permission** - Allow API credentials (aka permissions) related actions
- **Logs** - Allow log related actions
- **Auth** - Allow getting / setting public keys (for JWT auth)
- **UI Builder** - Allow UI builder related actions.

### Security

Security constraints allow authorizing API access based on the selected HTTP Referers, IP Source values or restricting indices available to the API credential.

![](https://i.imgur.com/tnKFHrK.png)

-   **HTTP Referers** allow adding one or more URIs that are whitelisted for accessing the API endpoints. By default, all referers are allowed access to the APIs.

![](https://i.imgur.com/lJjUAUT.png)

> Note <i class="fa fa-info-circle"></i>
>
> HTTP Referers are passed by the browsers using the `Referer` header by the browsers. They are a good mechanism to prevent unauthorized access from browser environments but can be easily spoofed by a HTTP client running outside of a browser environment.
>
> We recommend using **HTTP Referers** as an additional safeguard to your security model, but not as the only safeguard.

-   **IP Sources** allow specifying whitelisted IP ranges (in CIDR format) that can access the APIs. By default, all IPs are allowed access to the APIs.

![](https://i.imgur.com/7iEZzsj.png)

> Note <i class="fa fa-info-circle"></i>
>
> We don't support specifying a blacklist of IP ranges. You can specify a maximum of `100` HTTP Referers and a maximum of `100` IP Sources.

- **Indices** allow selecting a set of indices on which operations are allowed for an API credential.


### ReactiveSearch API Restrictions

ReactiveSearch API restrictions allow setting the following limits for API requests when using the API.

![](https://i.imgur.com/2XoVBlp.png)

- **Max Query Size** allows restricting the max query hits to return per API request. If an API requests more hits than the limit set here, a `400` status code will be returned

- **Max Aggregations Size** allows restricting the max terms aggregation size to return per API request. If an API requests more hits than the limit set here, a `400` status code will be returned.

- **Allow Direct DSL Queries** allows setting whether direct DSL queries (default) should be allowed with ReactiveSearch API. We recommend using Stored Queries and disabling the use of direct DSL queries.

### Fields Filtering

**Fields filtering** allows setting restrictions on fields that are returned when performing a search action.

    -   **Include** fields offers a dropdown view to select one or more fields that should be included in the response.

    -   **Exclude** fields offers a dropdown view to remove one or more fields that should be excluded from the response.

![](https://i.imgur.com/IBhKGgD.png)

### Max API calls/IP/hour

**Rate Limit by IP** allows setting a per hour rate-limit for every unique IP that is used for making an API call with this API credential. By default, no rate limits are set. Setting a rate-limit prevents abuse of data for scraping or denial of service purposes.

![](https://i.imgur.com/vt8NUmx.png)

### Time To Live (TTL)

**Time to Live (TTL)** allows setting an optional expiration time till this API credential should be effective. You can create ephemeral keys that are only effective for minutes, hours, days or weeks to limit the surface area of keys being compromised. By default, an API credential lives forever.

![](https://i.imgur.com/QXpdEhH.png)


## How are the credentials authenticated?

An appbase.io credential consists of a `username:password` format and are authenticated using the [HTTP Basic Authentication method](https://en.wikipedia.org/wiki/Basic_access_authentication).

When making the API request, the credentials are passed using the `Authorization` header with a base64 encoded value of the actual credentials. Here's an example API credential translated to the Basic Authentication header format.

API Credential: `9ZPVCJMls:bc1b93fc-0599-42fc-bc27-5034a72db138`

Its base64 equivalent is: `OVpQVkNKTWxzOmJjMWI5M2ZjLTA1OTktNDJmYy1iYzI3LTUwMzRhNzJkYjEzOA==` (`btoa(..)` is a built-in Javascript function which translates a string to its base64 equivalent value)

This is the expected header to be passed when this credential is used directly as a part of the REST API: `Authorization: Basic OVpQVkNKTWxzOmJjMWI5M2ZjLTA1OTktNDJmYy1iYzI3LTUwMzRhNzJkYjEzOA==`.

If you are using the [`appbase-js`](/api/javascript/quickstart/) or [`ReactiveSearch`](https://opensource.appbase.io/reactivesearch/) or [`Searchbox`](https://opensource.appbase.io/searchbox) libraries, you don't have to worry about the base64 conversion, these libraries do that for you. If you are using a server-side language, then you will have to add the `Authorization` header with the correct base64 encoded value of the API key as shown above. You can read more about it in the [REST API Reference](https://rest.appbase.io/#authentication).

> **Note:** If you are using [`abc cli`](https://github.com/appbaseio/abc) for importing data into appbase.io, you can use the credential value as https://${credential}@s${host}/${index}. Ensure that you are using a credential that has write access type.
