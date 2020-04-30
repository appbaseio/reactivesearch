---
title: 'Apps'
meta_title: 'Apps'
meta_description: 'Appbase.io Apps allow you to get the best of Elasticsearch without the cost of running a full cluster. Free for up to 10K records and 100K monthly API calls.'
keywords:
    - clusters
    - appbaseio
    - appbase
    - ElasticSearch
sidebar: 'docs'
---

An **App** in appbase.io is equivalent to an index in ElasticSearch. Appbase.io Apps allow you to get the best of Elasticsearch without the cost of running a full cluster. You can read more about them over [here](https://appbase.io/apps/).

In addition to being powered by ElasticSearch, apps come with the following features out of the box:

-   A dashboard UI for importing data,
-   Build and test search relevancy with zero lines of code,
-   Get Actionable Search Analytics: Top User Searches,
-   Enhanced security with ACLs, IP sources and HTTP Referers, Role Based Access Control, and IP based rate limits.

## Getting Started

Here are the steps you can follow to create and manage Appbase.io apps.

-   **Step 1 -** Log in to [Appbase.io Dashboard](https://dashboard.appbase.io)

![](https://www.dropbox.com/s/m8my8lq3keju99c/Screenshot%202019-08-08%2015.57.03.png?raw=1)

-   **Step 2 -** Select the **Create a new app** action.

![](https://i.imgur.com/dqfWrdH.png)

-   **Step 3 -** Enter details and click **Create App** button.
    > **Note:** Here you can select the plan based on API calls and storage requirements. It also allows you to import data from JSON/CSV. Data can also be imported after the app is created.

That's all! Our appbase.io app is created 🚀. Now you can view this app on your dashboard by clicking on the app card.

![](https://i.imgur.com/S19dnoP.png)

Out of the box features available for apps:

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
