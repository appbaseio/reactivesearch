---
title: 'ReactiveSearch API: Overview'
meta_title: 'ReactiveSearch API - Overview'
meta_description: 'ReactiveSearch API offers a declarative interface to querying ElasticSearch, prevents query injections and lets you extend the API via Query Rules and Functions.'
keywords:
    - concepts
    - appbase
    - elasticsearch
    - reactivesearch
sidebar: 'docs'
---

## Overview

At Appbase.io, we're determined to help our users build a better search experience. While working with Elasticsearch, we found some challenges which were restricting us to provide some built-in features to customize your search because it is hard to parse and interpret / enrich queries created using the Elasticsearch query DSL because of its non-declarative nature.

Many users also reported security as a big concern for them when using ReactiveSearch directly with an Elasticsearch backend:
1. There is a possibility for an attacker to do a query injection.
2. ReactiveSearch, by querying ElasticSearch directly exposed their search business logic and queries.

To address these issues effectively, we have introduced a new declarative API - the `ReactiveSearch API`. ReactiveSearch API is 100% compatible with the declarative ReactiveSearch library. When using ReactiveSearch API, you:
1. use the same declarative props that you're familiar with when using the ReactiveSearch library. This prevents query injections (as you can whitelist all your search queries to only be passed via the ReactiveSearch API)
2. Encapsulate your search business logic away from your search UIs.
3. Extend by setting [query rules](/docs/search/rules/) and [functions](/docs/search/functions/) that validate, enrich or modify the incoming search requests made via declarative APIs.
