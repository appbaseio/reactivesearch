---
title: 'Introduction'
meta_title: 'Introduction to Appbase.io'
meta_description: 'Appbase.io provides a supercharged search experience for creating the most demanding app search experiences with NoCode, REST APIs or JavaScript components.'
keywords:
    - concepts
    - appbase.io
    - elasticsearch
sidebar: 'docs'
---

[Appbase.io](https://appbase.io) provides a supercharged [Elasticsearch](https://github.com/elastic/elasticsearch) experience for creating the most demanding app search experiences with a NoCode control plane, REST APIs or UI components.

## Overview

With appbase.io, you can:

-   [Import your data](/docs/data/import/) from various sources via dashboard or CLI or REST APIs,
-   [Test search relevancy visually](/docs/search/relevancy/),
-   Build production grade search UIs using:
    1.   [UI component libraries](https://docs.appbase.io/docs/reactivesearch/gettingstarted/) that are available for React, Vue, React Native, Flutter, and vanilla JavaScript,
    2.  [A declarative REST API](/api/rest/overview/) or
    3.  [NoCode search UI builder](/docs/reactivesearch/ui-builder/search/).

-   Get out of the box [actionable analytics](/docs/analytics/overview/) on top searches, no result searches, slow queries and more,
-   Get improved search performance and throughput with [application layer caching](/docs/speed/cache-management/),
-   Build access controled search experiences with built-in Basic Auth or JWT based authentication, read/write access keys with granular ACLs, field level security, IP based rate limits, time to live - [read more over here](/docs/security/credentials/).

![Appbase.io Architecture](https://i.imgur.com/lM8NNC8.png)
**Image:** appbase.io overview diagram

## Out of the Box Features

appbase.io offers the following advantages over running your own Elasticsearch cluster.

![](https://i.imgur.com/aaxqnN2.png)
**Image:** appbase.io feature stack overview

1. **Analytics** - Get rich insights and analytics for your search app.
2. **Security** - Read/write access credentials, IP sources and HTTP Referers based restriction, Role based access control.
3. **Zero Ops** - Automated provisioning, scaling, logging and daily backups so you can enjoy a peace of mind.
4. **An Active Ecosystem** - From UI toolkits to build [search interfaces](https://opensource.appbase.io/reactivesearch) and [map UIs](https://opensource.appbase.io/reactivemaps), to the [leading Elasticsearch data browser](https://opensource.appbase.io/dejavu/) to a [GUI for writing queries](https://opensource.appbase.io/mirage/) to [backend data connectors](https://medium.appbase.io/abc-import-import-your-mongodb-sql-json-csv-data-into-elasticsearch-a202cafafc0d) to import data from SQL, MongoDB, JSON, CSV sources into Elasticsearch, we are actively working on open-standards to improve accessibility of building apps with appbase.io and Elasticsearch.
5. **No Vendor Lock-in** - Hosted APIs often come with a huge lock-in cost. appbase.io is offered as [a hosted API](https://appbase.io) as well as a [cloud native software](https://github.com/appbaseio/arc), offering a consistent experience without becoming a walled garden.

## Choose your hosting

<div class="grid-integrations-index mt6 mt6-l f8">
	<a class="bg-white shadow-2 box-shadow-hover shadow-2-hover  br4 db flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc" style="box-shadow: 0 0 5px rgba(0,0,0,.02), 0 5px 22px -8px rgba(0,0,0,.1);    word-break: normal;cursor: pointer; padding: 2rem;height: 120px;width:120px;" href="/docs/hosting/clusters">
		<img class="w10 mb1" src="/images/clusters.png" />
		Clusters
	</a>
	<a class="bg-white shadow-2 box-shadow-hover shadow-2-hover  br4 db flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc" style="box-shadow: 0 0 5px rgba(0,0,0,.02), 0 5px 22px -8px rgba(0,0,0,.1);    word-break: normal;cursor: pointer; padding: 2rem; height: 120px;width:120px;" href="/docs/hosting/byoc">
		<img class="w10 mb1" src="/images/arc.svg" />
		Bring Your Own Cluster
	</a>
</div>

| Hosting                                     | Description                                                                                                                                                                                                      |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Clusters](/docs/hosting/clusters/)          | Free 14-day trial. Flexibility of deploying in 16 regions across North America, South America, Europe, Asia and Australia                                                                                        |
| [Bring Your Own Cluster](/docs/hosting/byoc/) | Already have an Elasticsearch cluster with AWS or Elastic Cloud or hosting it yourself? You can provision the appbase.io docker container or image as a hosted service from the dashboard or deploy it yourself. |
