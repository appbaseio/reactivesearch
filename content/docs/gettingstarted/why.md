---
title: 'Why Appbase.io?'
meta_title: 'Why Appbase.io'
meta_description: 'Appbase.io is a search stack for building modern search apps.'
keywords:
    - concepts
    - appbase.io
    - elasticsearch
sidebar: 'docs'
---

[Appbase.io](https://appbase.io) provides the search stack for building modern apps - a hosted (or managed) developer-first search service. It supercharges ElasticSearch, an Apache 2.0 licensed search engine: to offer a streamlined development experience, out of the box actionable analytics and enterprise grade security.

> In this article, we highlight the key benefits of using appbase.io.

### Appbase.io Platform

Appbaseio.io's dashboard provides a powerful interface for developing search apps.

![](https://i.imgur.com/4gjLUYd.png)

**Image:** appbase.io dashboard functionalities

#### Development Experience 🕵️‍♂️

-   **[Import Data](/docs/data/import/)** allows importing data into ElasticSearch from sources such as `JSON`, `CSV`, `SQL` or another ElasticSearch index. [The CLI tool](https://github.com/appbaseio/abc) supports more sources such as `MongoDB`, `Firestore`, `Kafka`, `Redis` to name a few.
-   **[Search Relevancy](/docs/search/relevancy/)** allows configuring and testing search relevancy settings through a set of GUIs.
-   **[Query Rules](/docs/search/rules/)** allows setting "If This, Then That" style rules to extend the search engine.
-   **[ReactiveSearch](/docs/reactivesearch/v3/overview/quickstart/)** allows creating search UIs for React, Vue, Vanilla JS, React Native using industry-leading search UI components.

<iframe width="100%" style="border-radius: 3px;" height="315" src="https://www.youtube.com/embed/Lk3TUcnrKpQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

#### Actionable Analytics 📈

[Actionable Analytics](/docs/analytics/overview/) provide insights into search queries, as well as allow measuring clicks and conversion activities.

-   **Request Logs** track the request and response logs.
-   **Popular Searches** track the popular search queries.
-   **No Results Searches** track search queries which returned no hits.
-   **Popular Filters** track the popular filters (aka facets).
-   **Popular Results** track the popular search results and their impressions.
-   **Geo Distribution** charts the geography of where your searches are originating from.
-   **Request per minute** charts the requests per minute (aka RPM) against your app.
-   **Search Latency** measures the latency performance of your search queries.

![](https://i.imgur.com/SaDSdGt.gif)

#### Enterprise Grade Security 🔐

-   [**API Credentials**](/docs/security/credentials/) provides Basic Authentication based security keys with fine-grained security rules to control access. It also allows you to set IP restriction and API access limit for your ElasticSearch data.
-   [**Role Based Access Control**](/docs/security/role/) allows securing search apps with Javascript Web Tokens created via an identity provider of your choice.

![](https://i.imgur.com/UlF6rv8.png)

### APIs and Integrations

In addition to a REST API and client SDKs, Appbase.io also offers a rich set of UI component libraries for creating powerful search experiences.

-   **ReactiveSearch** is the most popular UI library for creating web based search experiences. It is available for [ReactJS](https://reactjs.org/) and [Vue.JS](https://opensource.appbase.io/reactivesearch/vue).
-   **ReactiveMaps** is a [React.JS UI library](https://opensource.appbase.io/reactivemaps/) for building geo search experiences.
-   **ReactiveSearch Native** is a [React Native UI library](https://opensource.appbase.io/reactivesearch/native) for creating mobile-first search experiences.
-   **SearchBox** is a set of light weight searchbox UI components available for JavaScript, React, Vue and Android.

### No Vendor Lock-in

Hosted APIs often come with a huge lock-in cost. appbase.io is offered as [a hosted API](https://appbase.io) as well as a [cloud native software](https://github.com/appbaseio/arc), allowing users to run it without any restrictions.

### Reliability

[Appbase.io Clusters](/docs/hosting/clusters/) use a Kubernetes based orchestration and multi-node clusters are deployed across multiple zones. This ensures a higher cluster availability and comes with a built-in mechanism to restart services on failures, as well as allows inspecting and safe editing of underlying resources.

### Available Across The Globe

Appbase.io Clusters allow creation of search clusters across 16 global regions across Americas, Europe and Asia Pacific, giving you choice to be closer to your customers.

![](https://i.imgur.com/v88UP6Z.png)

### Built-in ability to scale up or down

Clusters can be scaled up or down elastically and grow with your usage.

### Billed Hourly

Clusters are billed hourly so you only pay for what you use.

You can get more details about Appbase.io Cluster pricing over [here](https://appbase.io/clusters#pricing).

### Monitoring and Logs Access

Since appbase.io clusters are deployed and managed using a Kubernetes based orchestration, you can easily view the usage of various resources like CPU, memory, and storage. For more information, you can read the docs for [clusters over here](/docs/hosting/clusters/).

### Managed ElasticSearch

Another advantage of our managed ElasticSearch offering is full access to the underlying APIs without restriction. Other ElasticSearch providers like AWS limit access to your ElasticSearch API.

Along with full access to the underlying APIs, you also have full access to the ElasticSearch configuration and plugins that are installed. You can always add more plugins of your choice by updating the configurations via Stateful Set Configuration on Kubernetes.

### Ability to choose your ElasticSearch Distro

We also let you deploy an ElasticSearch flavor of your own choice. You can either install the Apache 2.0 licensed distribution of [ElasticSearch](https://github.com/elastic/elasticsearch) or use [Open Distro for ElasticSearch](https://opendistro.github.io/for-elasticsearch/) which comes with additional security enhancements.

## Deployment Options

While we recommend using the hosted [Appbase.io](https://appbase.io) products, we also offer other modes of deployment.

### Appbase.io App

Get the best of Elasticsearch without the cost of running a full cluster. Free forever plan for up to 10K records and 100K monthly API calls. No credit card required. You can check out the [Apps Product Page](https://appbase.io/clusters) for more details.

### Appbase.io Cluster

Deploy your own dedicated Elasticsearch clusters to meet your business needs. It includes a free 14-day trial and flexibility of deploying in 16 regions across North America, South America, Europe, Asia and Australia. You can check out the [Clusters Product Page](https://appbase.io/clusters) for more details.

### Bring Your Own Cluster

Already using an ElasticSearch cluster with AWS, Elastic Cloud or hosting it yourself? You can deploy appbase.io as a cloud-native software. Read more about Bring Your Own Cluster over [here](/docs/hosting/byoc/).
