---
title: 'Introduction'
meta_title: 'Introduction to Appbase.io'
meta_description: 'Appbase.io is a search stack for building modern search apps.'
keywords:
    - concepts
    - appbase.io
    - elasticsearch
sidebar: 'docs'
---

[Appbase.io](https://appbase.io) provides a search stack for building modern apps - a hosted (or managed) developer-first search service. We supercharge [ElasticSearch](https://github.com/elastic/elasticsearch), an Apache 2.0 licensed search engine: to offer a streamlined development experience, out of the box search and click analytics and an enterprise grade security.

With appbase.io, you can:

-   Import your data from any sources via dashboard or CLI or REST API,
-   Test search relevancy visually. [Read more here](https://docs.appbase.io/docs/search/Preview)
-   Build production-grade search UIs using one of:
    -  our UI component libraries,
    -  our SDKs,
    -  or the REST API.
You should [start here to learn more](https://docs.appbase.io/docs/reactivesearch/v3/overview/quickstart/).
-   Get out of the box actionable analytics on top searches, no result searches, slow queries. [Read more here](https://docs.appbase.io/docs/analytics/Overview/)
-   Out of the box security with built-in Basic Auth or JWT based authentication, read/write access keys with granular ACLs, field level security, IP based Rate Limits, Time to Live. [Read more here](https://docs.appbase.io/docs/security/Credentials/)

`New: ` Introducing [role-based access control](https://docs.appbase.io/docs/security/Role/) and [search templates](https://docs.appbase.io/docs/security/Template/).

![Appbase.io Architecture](https://i.imgur.com/lM8NNC8.png)
**Image:** appbase.io overview diagram


## API Intro

The appbase.io API is interoperable with the Elasticsearch API and builds on top of it. With the [apps](https://appbase.io/apps) product, there are some API endpoints that we don't allow access to. Full list of supported endpoints is documented at https://rest.appbase.io.

We also offer [hosted or managed clusters](https://appbase.io/clusters), where we maintain 100% compatibility with the Apache 2.0 licensed ElasticSearch and support every ElasticSearch release starting v5.6.

## Out of the Box Features

appbase.io offers the following advantages over running your own Elasticsearch cluster.

![](https://i.imgur.com/aaxqnN2.png)
**Image:** appbase.io feature stack overview

1. **Analytics** - Get rich insights and analytics for your search app.
2. **Security** - Read/write access credentials, IP sources and HTTP Referers based restriction, Role based access control.
3. **Zero Ops** - Automated provisioning, scaling, logging and daily backups so you can enjoy a peace of mind.
4. **An Active Ecosystem** - From UI toolkits to build [search interfaces](https://opensource.appbase.io/reactivesearch) and [map UIs](https://opensource.appbase.io/reactivemaps), to the [leading Elasticsearch data browser](https://opensource.appbase.io/dejavu/) to a [GUI for writing queries](https://opensource.appbase.io/mirage/) to [backend data connectors](https://medium.appbase.io/abc-import-import-your-mongodb-sql-json-csv-data-into-elasticsearch-a202cafafc0d) to import data from SQL, MongoDB, JSON, CSV sources into Elasticsearch, we are actively working on open-standards to improve accessibility of building apps with appbase.io and Elasticsearch.
5. **No Vendor Lock-in** - Hosted APIs often come with a huge lock-in cost. appbase.io is offered as [a hosted API](https://appbase.io) as well as a [cloud native software](https://github.com/appbaseio/arc), offering a consistent experience without becoming a walled garden.
6. **Built-in Realtime Streaming** - appbase.io for clusters offering a realtime pub/sub API for the entire Elasticsearch Query DSL.
