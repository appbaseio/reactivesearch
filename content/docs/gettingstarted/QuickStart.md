---
title: 'Introduction'
meta_title: 'Introduction to Appbase'
meta_description: 'Appbase is a hosted Elasticsearch service with built-in publish/subscribe support for streaming document updates and query results'
keywords:
    - concepts
    - appbaseio
    - appbase
    - elasticsearch
sidebar: 'docs'
---

[Appbase.io](https://appbase.io) provides a search stack platform for building modern apps. Appbase.io offers ElasticSearch as a service with added bells and whistles like a better development experience, rich analytics and out of the box granular security controls.

With appbase.io, you can:

-   Import your data from a variety of sources using either our dashboard interface or CLI,
-   Build and test search relevancy visually,
-   Build your search UIs using one of our UI component libraries or by using one of the SDKs or the REST API,

![Appbase Architecture](https://i.imgur.com/iJpqtks.png?1)
**Image:** appbase.io overview diagram

We have production users running E-Commerce stores, analytics dashboards, feeds, and realtime backends using appbase.io.

There are some catches if you intend to:

-   Use it as a primary data store or need ACID guarantees - Appbase.io is not ACIDic and doesn't support multi-document transactions. A good design choice in such a situation would be to use something that supports ACID transactions (e.g. a SQL databaste), and then use Appbase.io for the data that needs to be searchable in realtime.
-   Perform analytical processing - Being based on Elasticsearch, appbase.io is designed as an OLTP system although it supports aggregations and queries on data sets of the size of hundreds of gigabytes and even a few terabytes. There are plenty of ideal tools for OLAP use-cases - Amazon Redshift, Google Big Query, Apache Hadoop. appbase.io can be used in a complementary fashion with any of these for handling online transactions.

## API Intro

appbase.io APIs are 100% RESTful, work with JSON and are compatible with Elasticsearch. With our [apps](https://appbase.io/apps) offering, there are some API endpoints that we don't allow access to. Full list of supported endpoints is documented at https://rest.appbase.io.

We also offer [hosted clusters](https://appbase.io/clusters), where we maintain 100% compatibility with the Apache 2.0 licensed ElasticSearch and support every release starting v5.6.

## Out of the Box Features

appbase.io offers following advantages over running a raw Elasticsearch cluster / index.

1. **Analytics** - Get rich insights and analytics for your search app.
2. **Security** - Read/write access credentials, IP sources and HTTP Referers based restriction, Role based access control.
3. **Zero Ops** - Automated provisioning, scaling, logging and daily backups so you can enjoy a peace of mind.
4. **An Active Ecosystem** - From UI toolkits to build [search interfaces](https://opensource.appbase.io/reactivesearch) and [map UIs](https://opensource.appbase.io/reactivemaps), to the [leading Elasticsearch data browser](https://opensource.appbase.io/dejavu/) to a [GUI for writing queries](https://opensource.appbase.io/mirage/) to [backend data connectors](https://medium.appbase.io/abc-import-import-your-mongodb-sql-json-csv-data-into-elasticsearch-a202cafafc0d) to import data from SQL, MongoDB, JSON, CSV sources into Elasticsearch, we are actively working on open-standards to improve accessibility of building apps with appbase.io and Elasticsearch.
5. **No Vendor Lock-in** - Hosted APIs often come with a huge lock-in cost. appbase.io is offered as [a hosted API](https://appbase.io) as well as a [cloud native software](https://github.com/appbaseio/arc), offering a consistent experience without becoming a walled garden.
6. **Built-in Realtime Streaming** - appbase.io is the only Elasticsearch service offering a realtime pub/sub API for the entire Elasticsearch Query DSL.

![](https://i.imgur.com/4nIwmd6.png)
**Image:** appbase.io feature stack overview
