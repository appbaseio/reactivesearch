---
title: 'Create Function'
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

Appbase.io uses [OpenFaas](https://docs.openfaas.com) under the hood to create and deploy functions. We use OpenFaas because:

-   It lets you write function in any language
-   It is open source and actively maintained
-   Can be easily deployed and maintained with kubernetes orchestration

To create an build functions using [OpenFaas](https://docs.openfaas.com), you need to install [faas-cli](https://docs.openfaas.com/cli/install/), a command line utility to bootstrap, build and deploy functions. Here are the steps which you can follow to install **faas-cli**

**Prerequisite**

For Linux users

    curl -sSL https://cli.openfaas.com | sudo -E sh

For Mac users

    brew install faas-cli

Once the `faas-cli` is installed, we can create functions using OpenFaas [templates](https://docs.openfaas.com/cli/templates/#classic-vs-of-watchdog-templates). OpenFaas have [templates](https://docs.openfaas.com/cli/templates/#classic-vs-of-watchdog-templates) for creating functions in various programming languages.

In this documentation we will be using `NodeJS` template to create and publish function. For more templates you can check the [template store](https://docs.openfaas.com/cli/templates/#classic-vs-of-watchdog-templates) by OpenFaas

## Quick Start

Let us create a function to promote a result with each search query.

### Step 1: Get the template

```bash
mkdir promote-result && cd promote-result

faas template pull https://github.com/openfaas-incubator/node10-express-template
```

### Step 2: Create a function

```bash
faas new --lang node10-express promote-result
```

### Step 3: Edit Business Logic in `./promote-result/handler.js`

Functions business logic can be developed based on when you would like to trigger them and some other environment variables. Example if you would like to trigger function before it hits ElasticSearch and modify `request` body or if you would like to trigger a function after ElasticSearch request is completed and modify `response` body before it is sent to the end user.

To simplify the development process we have created a body structure which you can access while adding business logic to the function. Please refer the docs [here](/docs/search/functions/create/#event-body-structure) for more information on function data.

In the example below we are trying to update `response` of ElasticSearch and add a promoted result in the response.

```js
'use strict';

module.exports = (event, context) => {
	// check if it is a _search or _msearch
	// request then only update response.
	if (event.body.env.acl === 'search' && event.body.response.status === 200) {
		if (event.body.response.body.hits) {
			event.body.response.body = promoteResult(event.body.response.body);
		}
	} else if (event.body.env.acl === 'msearch' && event.body.response.status === 200) {
		if (
			event.body.response.body.responses &&
			event.body.response.body.responses[0] &&
			event.body.response.body.responses[0].hits
		) {
			event.body.response.body.responses[0] = promoteResult(
				event.body.response.body.responses[0],
			);
		}
	}
	context.status(200).succeed(event.body);
};

function promoteResult(responses) {
	if (responses && responses.hits) {
		// object that we want to promote
		// with each search request
		const promotedRes = {
			_index: 'phones',
			_type: '_doc',
			_id: 'promoted-res',
			_socre: 1.0,
			_source: {
				name: 'iphone',
			},
		};
		// update the total status
		responses.hits.total.value = responses.hits.total.value + 1;
		// prepend the object in result list
		responses.hits.hits.unshift(promotedRes);
	}

	return Object.assign(responses);
}
```

### Step 4: Update image name in `./promote-result.yml`

You need to update the image name with `DOCKER_USERNAME/image-name: VERSION`.

```yaml
version: 1.0
provider:
    name: openfaas
    gateway: http://127.0.0.1:8080
functions:
    promote-result:
        lang: node10-express
        handler: ./promote-result
        image: DOCKER_USERNAME/promote-result:0.1.0
        read_timeout: '30s' # default is 5s, Maximum time to read HTTP request
        write_timeout: '30s' # default is 5s, Maximum time to write HTTP response
        upstream_timeout: '30s' # Maximum duration of upstream function call
```

### Step 5: Build function

```bash
faas-cli build -f promote-result.yml
```

### Step 6: Publish function on docker hub

```bash
faas-cli push -f promote-result.yml
```

Once your function is published as docker image, you can also make it private from your registry / docker hub.

<iframe style="width: 100%" title="Functions demo" height="315" src="https://www.youtube.com/embed/ak7nbXxjY-c" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

> **Note:** If you are using Self Hosted version of Appbase.io and want to deploy private image of function, you will have to add `OPENFAAS_KUBE_CONFIG` env with the value where your kubernetes config file exists.

## Event Body structure

With each function definition, you get access to following data, which can help you build the business logic for the function and enhance the search experience.

Here is the list of parameters that you can get access in your functions `event.body`

| Parameter             | Description                                                                                                                                                                                                          |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `extraRequestPayload` | JSON object to pass extra information to function.                                                                                                                                                                   |
| `env`                 | JSON object to get information about various trigger related environment variables.                                                                                                                                  |
| `env.acl`             | String to do granular classification of the category of the incoming request. You can see the full list of values over [here](https://arc-api.appbase.io/?version=latest#c736042c-7247-41a7-ab26-91e6861a1167)       |  |
| `env.category`        | String value to classify type of incoming request. It can be one of `docs`, `search`, `indices`, `cat`, `clusters`, `misc`.                                                                                          |
| `env.query`           | String value to know the keyword being queried.                                                                                                                                                                      |
| `env.index`           | Array of strings to know the indexes on which the function will be executed                                                                                                                                          |
| `env.filter`          | String value to set filter data based on trigger logic. Accepts the string expression based on [expr](https://github.com/antonmedv/expr/blob/master/docs/Language-Definition.md/#string-operators) library of Golang. |
| `request`             | [Optional] parameter available when trigger is set to before search. It is a JSON object which contains meta information about the request.                                                                          |
| `request.url`         | String value to know the exact URL using which ElasticSearch cluster is accessed.                                                                                                                                    |
| `request.method`      | String value to know HTTP method of request                                                                                                                                                                          |
| `request.headers`     | JSON object to know header values                                                                                                                                                                                    |
| `request.body`        | JSON object to get access to the request payload.                                                                                                                                                                    |
| `response`            | [Optional] parameter available when trigger is set to after search. It is a JSON object which is obtained after execution HTTP request.                                                                              |
| `response.body`       | JSON object obtained after execution HTTP request.                                                                                                                                                                   |
| `response.headers`    | JSON object to know header values                                                                                                                                                                                    |
| `response.status`     | HTTP Status value.                                                                                                                                                                                                   |

#### Example

```js

{
  // extra information to be passed with functions, example env variables.
  "extraRequestPayload": {},
  // in case of before search request execution
  "request": {
    "url": "http://foo:bar@localhost:8000/phones/_search",
    "method": "GET",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": {
      "query": {
        "match": {
          "title": {
            "query": "iphone"
          }
        }
      }
    }
  },
  // in case of after search request execution
  "response": {
    "body": {
      "_shards": {
        "failed": 0,
        "skipped": 0,
        "successful": 1,
        "total": 1
      },
      "hits": {
        "hits": [
          {
            "_id": "9E41hG8B-WWLBcH3Zqmb",
            "_index": "phones",
            "_score": 1,
            "_source": {
              "name": "Samsung M1"
            },
            "_type": "_doc"
          }
        ],
        "max_score": 1,
        "total": {
          "relation": "eq",
          "value": 1
        }
      },
      "timed_out": false,
      "took": 1058
    },
    "headers": {
      "Access-Control-Allow-Credentials": true,
      "Content-Type": "application/json"
    },
    "status": 200
  },
  "env": {
    "acl": "msearch",
    "category": "search",
    "index": [
      "phones"
    ],
    "query": "phones",
    "now": 1578485425
  }
}
```

Now let us see how we can [deploy](/docs/search/functions/deploy/) this function using Appbase.io Dashboard.
