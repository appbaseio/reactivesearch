---
title: 'Functions'
meta_title: 'Appbase Functions'
meta_description: 'How to use functions with ElasticSearch.'
keywords:
    - concepts
    - appbase
    - elasticsearch
    - serverless
    - functions
sidebar: 'docs'
---

## Overview

Appbase.io now supports Functions which provides the ability to extend the underlying search functionality either to handle edge cases around search relevance or to implement custom security logic. Functions with Appbase.io can add great value in improving search experience as they run on the same infrastructure where your search is running and in the world of search latency matters.

![architecture](https://www.dropbox.com/s/0zckyheks84ass4/Functions%20Flow%20Chart.png?raw=1)

> This is different than running AWS Lambda functions or any such service, because as soon as you introduce third party service it is going to add some latency. We recommend using functions over running anything on your server or third party services for search use cases.

## Use Cases

Here are some use cases where functions can help you improve search relevance or security.

-   **Create a function based query rule that allows to modify the query:**
    -   Parse intent from a Natural language query and structure it differently.
    -   Apply a default filter.

<br />

-   **Build a customized security logic:**
    -   Add custom JWT authorization for each requests
    -   Add role based access to the data
    -   Apply security rules to search only on certain fields/indexes.
    -   Apply size restrictions.

<br />

-   **Create a response transformer that allows to:**
    -   Modify the shape of the response
    -   Modify the contents of the response \* Modify the score of the response, e.g. using an overlay based on Machine Learning algorithms.

<br />

-   **Create a request transformer that allows to:**
    -   Modify data before it gets indexed
    -   Extract text from an image and index image text to provide image search.

## Why use Functions

Appbase.io Functions run right where your search service is, thus minimizing the overall latency that your end-users experience.

-   **Appbase.io Functions v/s your server**

    When you write custom security logic or search extensions on your server, you require a flow that looks like this:
    <br />

    ![](https://www.dropbox.com/s/7j1v8f4pavhrwws/Screenshot%202020-01-31%2015.26.23.png?raw=1)

    <br />
    Depending on where your server is located geographically, this can add b/w 20ms to 250ms of additional latency. Since Appbase.io functions run on the same infra as your search service, they only add the execution time of your custom logic.

-   **Appbase.io Functions v/s AWS Lambda**

    When you use a hosted serverless service such as AWS Lambda (or even AWS Lambda on edge), you're still adding additional latency b/w your end-user and your search service. Besides, most serverless function services restrict your choice of language, use of 3rd party packages. Appbase.io functions internally communicate over HTTP and thus are language agnostic (you can write JavaScript, Python, Java, Go, ...) and support 3rd party packages as well.

The differences in latencies are further pronounced when your custom logic requires access to a database system. Appbase.io functions provide access to your ElasticSearch instance - this means that you can read and write data to your search cluster into a meta index.
