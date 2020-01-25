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

Appbase.io now supports Functions which provides the ability to extend the underlying search functionality either to handle edge cases around search relevance or to implement custom security logic. Functions with Appbase.io can add great value in improving search experience as they run on the same infrastructure where your search is running and in the world of search latency matters.

![architecture](https://www.dropbox.com/s/hf86m0a2enmw82b/Functions%20Flow%20Chart.png?raw=1)

> This is different than running AWS Lambda functions or any such service, because as soon as you introduce third party service it is going to add some latency. We recommend using functions over running anything on your server or third party services for search use cases.

## Use Cases

Here are some use cases where functions can help you improve search relevance or security.

* **Create a function based query rule that allows to modify the query:**
	* Parse intent from a Natural language query and structure it differently.
	* Apply a default filter.

<br />

* **Build a customized security logic:**
	* Add custom JWT authorization for each requests
	* Add role based access to the data
	* Apply security rules to search only on certain fields/indexes.
	* Apply size restrictions.

<br />

* **Create a response transformer that allows to:**
	* Modify the shape of the response
	* Modify the contents of the response
	* Modify the score of the response, e.g. using an overlay based on Machine Learning algorithms.

<br />

*  **Create a request transformer that allows to:**
	*  Modify data before it gets indexed
	*  Extract text from an image and index image text to provide image search.

Let us see how we can [Create](/docs/search/Functions/create) and [Deploy](/docs/search/Functions/deploy) functions using [Appbase.io Clusters](/docs/search/Functions/hosting#1-appbaseio-clusters) or [Self Hosted Appbase.io](/docs/search/Functions/hosting#2-self-hosted-appbaseio)
