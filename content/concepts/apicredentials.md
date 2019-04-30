---
title: 'Development Principles'
meta_title: 'API Credentials - Core Concepts'
meta_description: 'API credentials allow secure access to the appbase.io APIs.'
keywords:
    - concepts
    - ghost
    - credentials
    - api
sidebar: 'concepts'
---

API credentials allow secure access to the appbase.io APIs. They offer a variety of rules to granularly control access to the APIs.

## Defaults

When creating an app in appbase.io, you have access to two types of API Credentials.

![](https://i.imgur.com/hkMdS7u.png)

A `Read-only API key` offers access to read based endpoints of the [API](https://rest.appbase.io) (you can get a document, search for documents, but not create or update a document) while an `Admin API key` offers access to both read an write based endpoints (you can create, update and even delete documents).

## How are the credentials authenticated?

An appbase.io credential consists of a `username:password` format and are authenticated using the [HTTP Basic Authentication method](https://en.wikipedia.org/wiki/Basic_access_authentication).

When making the API request, the credentials are passed using the `Authorization` header with a base64 encoded value of the actual credentials. Here's an example API credential translated to the Basic Authentication header format.

API Credential: `9ZPVCJMls:bc1b93fc-0599-42fc-bc27-5034a72db138`

Its base64 equivalent is: `OVpQVkNKTWxzOmJjMWI5M2ZjLTA1OTktNDJmYy1iYzI3LTUwMzRhNzJkYjEzOA==` (`btoa(..)` is a built-in Javascript function which translates a string to its base64 equivalent value)

This is the expected header to be passed when this credential is used directly as a part of the REST API: `Authorization: Basic OVpQVkNKTWxzOmJjMWI5M2ZjLTA1OTktNDJmYy1iYzI3LTUwMzRhNzJkYjEzOA==`.

If you are using the [`appbase-js`](https://docs.appbase.io/javascript/quickstart.html) or [`ReactiveSearch`](https://opensource.appbase.io/reactive-manual/getting-started/reactivesearch.html) libraries, you don't have to worry about the base64 conversion, these libraries do that for you. If you are using a server-side language, then you will have to add the `Authorization` header with the correct base64 encoded value of the API key as shown above. You can read more about it in the [REST API Reference](https://rest.appbase.io/#authentication).

If you are using [`abc cli`](https://github.com/appbaseio/abc) for importing data into appbase.io, you can use the credential value as https://${credential}@scalr.api.appbase.io/${appname}. In the above example, the URL would look like `https://9ZPVCJMls:bc1b93fc-0599-42fc-bc27-5034a72db138@scalr.api.appbase.io/1234ad`. Also ensure that you are using a credential that has write permissions, as you won't be able to insert data otherwise.

## Adding and Updating Credentials

You can also create a new credentials or modify the existing defaults. When doing so, you can set one or more of the following restrictions.

![](https://i.imgur.com/UlF6rv8.png)

Let's go over each kind of authorization constraint you can apply to a key:

1. **Key Type** determines the main type of operations this key will be responsible for. There are three key types:

    ![](https://i.imgur.com/9IVZjIJ.png)

    - Read-only key,
    - Write-only key,
    - Admin key (aka read + write).

2. **ACLs** determine granularly what type of actions are allowed for the API key in addition to the broad Key Type.

    ![](https://i.imgur.com/FyLWp3e.png)

    - **Index** (index) allows indexing and update actions.
    - **Get** (get) allows retrieving documents and data mappings.
    - **Search** (search) allows searching for documents in an app.
    - **Settings** (settings) allow access to the settings endpoints.
    - **Stream** (stream) allows access to the streaming endpoints for realtime data updates.
    - **Bulk** (bulk) allows access to the bulk endpoints.
    - **Delete** (delete) allows access to all the deletion related endpoints.
    - **Analytics** (analytics) allows access to the Analytics APIs programmatically. [only available for `growth` plan users]

3) **Security** constraints allow authorizing API access based on the selected HTTP Referers and IP Source values.

    - **HTTP Referers** allow adding one or more URIs that are whitelisted for accessing the API endpoints. By default, all referers are allowed access to the APIs.

    ![](https://i.imgur.com/lJjUAUT.png)

    > Note <i class="fa fa-info-circle"></i>
    >
    > HTTP Referers are passed by the browsers using the `Referer` header by the browsers. They are a good mechanism to prevent unauthorized access from browser environments but can be easily spoofed by a HTTP client running outside of a browser environment.
    >
    > We recommend using **HTTP Referers** as an additional safeguard to your security model, but not as the only safeguard.

    - **IP Sources** allow specifying whitelisted IP ranges (in CIDR format) that can access the APIs. By default, all IPs are allowed access to the APIs.

    ![](https://i.imgur.com/7iEZzsj.png)

    > Note <i class="fa fa-info-circle"></i>
    >
    > We don't support specifying a blacklist of IP ranges. You can specify a maximum of `100` HTTP Referers and a maximum of `100` IP Sources.

4) **Fields filtering** allows setting restrictions on fields that are returned when performing a search action.

    - **Include** fields offers a dropdown view to select one or more fields that should be included in the response.

    - **Exclude** fields offers a dropdown view to remove one or more fields that should be excluded from the response.

5) **Rate Limit by IP** allows setting a per hour rate-limit for every unique IP that is used for making an API call with this API credential. By default, no rate limits are set. Setting a rate-limit prevents abuse of data for scraping or denial of service purposes.

![](https://i.imgur.com/vt8NUmx.png)

6. **Time to Live (TTL)** allows setting an optional expiration time till this API credential should be effective. You can create ephemeral keys that are only effective for minutes, hours, days or weeks to limit the surface area of keys being compromised. By default, an API credential lives forever.

![](https://i.imgur.com/QXpdEhH.png)
