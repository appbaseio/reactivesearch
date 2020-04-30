---
title: 'Functions'
meta_title: 'Appbase.io Functions'
meta_description: 'How to use appbase.io functions with ElasticSearch'
keywords:
    - concepts
    - appbase.io
    - elasticsearch
    - serverless
    - functions
sidebar: 'docs'
---

## Overview

Appbase.io Functions (available with **Clusters**) provide the ability to extend the search engine and tailor it for your use-case. You can use it to implement custom security logic, do more with search or handle specific cases around search relevancy. Functions are built with performance and ease of use in mind - it runs on the same infrastructure where your search is hosted. You can define functions in Node.JS, Python, PHP, Go, Ruby, Java or C# and use external packages with no restrictions.

[See an 8 mins video overview and live demo here ▷](https://youtu.be/ak7nbXxjY-c)

![Functions Dashboard](https://i.imgur.com/4LPHTlw.png)

> Functions are available with Production II, III and IV clusters plans or with the enterprise plan (for self-hosted).

## Use Cases

Here are some use cases where functions can help you improve search relevance or security.

-   **Modify the incoming query:**
    -   Parse intent from a natural language query and restructure it (e.g. rewrite tail queries)
    -   Apply additional filters based on query intent detection

-   **Build a customized security logic:**
    -   Implement a custom security authorization for all incoming requests
    -   Enforce custom access control policies
	-   Apply a custom IP rate limit logic to prevent DoS attacks
	-   Prevent certain kinds of queries from being run
    -   Apply query size restrictions

-   **Extend your index time logic:**
    -   Enforce additional security checks prior to the data getting indexed
	-   Parse and enrich the data prior to indexing, e.g. perform OCR and index the parsed contents

-   **Modify the search response:**
    -   Define your custom re-scoring function based on external signals to rescore the results
	-   Add custom data to returned based on either the request or the response context
	-   Modify the shape of the response

## Why use Functions

Appbase.io Functions run right where your search service is, thus minimizing the overall latency that your end-users experience.

-   **Appbase.io Functions v/s your server**

    When you write custom security logic or search extensions on your server, you require a flow that looks like this:

    ![](https://www.dropbox.com/s/7j1v8f4pavhrwws/Screenshot%202020-01-31%2015.26.23.png?raw=1)

    Depending on where your server is located geographically, having it as part of the search request flow can contribute anywhere between 10ms to 100ms of additional latency. When your end users are searching, milliseconds matter. By virtue of appbase.io functions running on the same infra as your search service is, there is no added network latency.

    Appbase.io Functions dashboard gives you control over the trigger conditions, ordering, and the ability to enable / disable individual functions.

-   **Appbase.io Functions v/s AWS Lambda**

    When you use a hosted serverless services such as AWS Lambda (or even AWS Lambda on edge), you're still adding additional latency b/w your end user and your search service. Besides, most serverless function services restrict your choice of language and use of 3rd party packages. Appbase.io Functions are internally deployed as HTTP services and thus are language agnostic (you can write them in Node.JS, Python, Java, Go, PHP, Ruby, or C#) and let you add 3rd party packages without restriction.

    The differences in latencies are further pronounced when your function logic requires database access. Appbase.io Functions can access the ElasticSearch indices - you can read (or write) data to your search cluster.

## Hosting

To deploy and run functions, Appbase.io leverages [OpenFaas](https://docs.openfaas.com), the most popular open-source project for running and deploying serverless functions. There are two ways to get started with Functions and Appbase.io

-   [Appbase.io Clusters](https://docs.appbase.io/docs/hosting/clusters/):

    Supports functions out of the box for [Production II, III, IV plans](https://appbase.io/clusters/#pricing). All you need to do is [Create Function](/docs/search/functions/create/), [Deploy Function](/docs/search/functions/deploy/) and [Set Triggers](/docs/search/functions/trigger/).

-   [Self Hosted Appbase.io](https://github.com/appbaseio/arc-k8s):

    With [Self Hosted Appbase.io](https://github.com/appbaseio/arc-k8s) and [Kubernetes](https://kubernetes.io/) orchestration, you can deploy functions in the same infrastructure as your search. For more information on how to self-host appbase.io with functions, please checkout our docs [here](/docs/search/functions/hosting/).

## Create

Creating a function is the first step. You can start by getting a boilerplate template and your business logic to the handler function. For more information on how to create a function, please refer docs [here](/docs/search/functions/create/)

## Deploy

A function once created can be deployed alongside your search infrastructure as a HTTP service with dedicated compute and memory resources allocated to it. For more information on how to deploy a function you can read docs [here](/docs/search/functions/deploy/).

## Set Trigger

Setting a trigger lets you define the conditions which when met would invoke your function. You can read more about the trigger syntax over [here](/docs/search/functions/trigger/).
