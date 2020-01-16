---
title: 'Create Function'
meta_title: 'Appbase Serverless Functions'
meta_description: 'How to use serverless functions with ElasticSearch.'
keywords:
    - concepts
    - appbase
    - elasticsearch
    - serverless
    - functions
sidebar: 'docs'
---

To create an build serverless functions, you need to install [faas-cli](https://docs.openfaas.com/cli/install/) on your machine. Here are the steps which you can follow to install **faas-cli**

For Linux users

    curl -sSL https://cli.openfaas.com | sudo -E sh

For Mac users

    brew install faas-cli

There are [2 types](https://docs.openfaas.com/cli/templates/#classic-vs-of-watchdog-templates) of functions that you can create with OpenFaas

1. Classical: They are based upon Classic Watchdog which uses STDIO to communicate with your function

2. Of-watchdog: The of-watchdog uses HTTP to communicate with functions.

We will be using Of-watchdog functions only as mainly we deal with HTTP requests of ElasticSearch. OpenFaas have templates for creating functions in various programming language. In this documentation we will be using `NodeJS` template to create and publish function. For more templates you can check the [template store](https://docs.openfaas.com/cli/templates/#classic-vs-of-watchdog-templates) by OpenFaas

## Quick Start

Let us create a function to promote a result with each search query.

#### Step 1: Get the template

```bash
mkdir promote-result && cd promote result

faas template pull https://github.com/openfaas-incubator/node10-express-template
```

#### Step 2: Create a function

```bash
faas new --lang node10-express promote-result
```

#### Step 3: Edit Business Logic in `./promote-result/handler.js`

Here we are trying to update the response of ElasticSearch based on request type, i.e. `search` / `msearch`. Appbase.io functions gives access to meta information about the request via `event.body.env`. For more information on request / response body structure, please check docs [here](/docs/functions/CreateFunction/#event-body-structure)

```js
'use strict';

function promoteResult(responses) {
	if (responses && responses.hits) {
		const promotedRes = {
			_index: 'phones',
			_type: '_doc',
			_id: 'promoted-res',
			_socre: 1.0,
			_source: {
				name: 'iphone',
			},
		};
		responses.hits.total.value = responses.hits.total.value + 1;
		responses.hits.hits.unshift(promoteResult);
	}

	return Object.assign(responses);
}
module.exports = (event, context) => {
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
```

#### Step 4: Update image name in `./promote-result.yml`

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
```

#### Step 5: Build function

```bash
faas-cli build -f promote-result.yaml
```

#### Step 6: Publish function on docker hub

```bash
faas-cli push -f promote-result.yaml
```

Once your function is published as docker image, you can also make it private from your registry / docker hub.

> **Note:** If you are using Self Hosted version of Appbase.io and want to deploy private image of function, you will have to add `OPENFAAS_KUBE_CONFIG` env with the value where your kubernetes config file exists.

## Event Body structure

With each function definition, you get access to following data, which can help you build the business logic for the function and enhance the search experience.

Here is the list of parameters that you can get access in your functions `event.body`

| Parameter           | Description                                                                                                                                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| extraRequestPayload | JSON object to pass extra information to function.                                                                                                                                                                   |
| env                 | JSON object to get information about various trigger related environment variables.                                                                                                                                  |
| env.acl             | String value to know the ElasticSearch request type.                                                                                                                                                                 |
| env.query           | String value to know the keyword being queried.                                                                                                                                                                      |
| env.category        | String value to know category of search example `category=docs`                                                                                                                                                      |
| env.index           | Array of strings to know the indexes on which the function will be executed                                                                                                                                          |
| env.filter          | String value to set filter data based on trigger logic. Accepts the string expression based on [expr](https://github.com/antonmedv/expr/blob/master/docs/Language-Definition.md#string-operators) library of Golang. |
| request             | [Optional] parameter available when trigger is set to before search. It is a JSON object which contains meta information about the request.                                                                          |
| request.url         | String value to know the exact URL using which ElasticSearch cluster is accessed.                                                                                                                                    |
| request.method      | String value to know HTTP method of request                                                                                                                                                                          |
| request.headers     | JSON object to know header values                                                                                                                                                                                    |
| request.body        | JSON object to get access to the request payload.                                                                                                                                                                    |
| response            | [Optional] parameter available when trigger is set to after search. It is a JSON object which is obtained after execution HTTP request.                                                                              |
| response.body       | JSON object obtained after execution HTTP request.                                                                                                                                                                   |
| response.headers    | JSON object to know header values                                                                                                                                                                                    |
| response.status     | Number value giving information about the HTTP Status code.                                                                                                                                                          |

### Example

```json
// envent.body
{
	"extraRequestPayload": {
		// extra information to be passed with functions
	},
	"env": {
		// trigger environment variables, eg acl, filters, indexes
	},
	// in case of before search request execution
	"request": {
		"url": "",
		"method": "",
		"headers": {},
		"body": {}
	},
	// in case of after search request execution
	"response": {
		"body": {
			// response body
		},
		"headers": {},
		"status": 200
	}
}
```

Now let us see how we can [deploy](/docs/functions/DeployFunction) this function using Appbase.io Dashboard.
