---
title: 'Data Schema'
meta_title: 'Appbase - Data Schema'
meta_description: 'Appbase uses the same data schema as ElasticSearch `v5.x` and `v2.x`.'
keywords:
    - dataschema
    - appbase
    - datamodel
    - elasticsearch
sidebar: 'concepts'
---

Appbase uses the same data schema as ElasticSearch `v5.x` and `v2.x`.

## App <span style="font-weight: 200;">aka Index</span>

An app in [appbase.io](https://appbase.io) is stored as an index in ElasticSearch. App is the highest level of construct supported by appbase and is equivalent to a **database** in SQL.

## Type

JSON data (aka documents) in an app is logicaly partitioned using types, think of them as namespaces for arranging and querying similar kinds of data.

## Document

A **document** is the actual data stored in an app. Documents are `JSON` objects, equivalent to **records** or **rows** in SQL.

```json
{
	"user": "data",
	"remember": "something",
	"molala": "yaya",
	"lifeis": 42,
	"recursive": {
		"how's this": "one nested value"
	}
}
```

<br>

## Visualizing the Data Model

An app can have one or more types and each type is a container for JSON documents. Visually, the arrangement looks like below:

[![Data Model View](https://i.imgur.com/wQ7kvTj.png)](https://opensource.appbase.io/dejavu/live/#?input_state=XQAAAAJyAQAAAAAAAAA9iIqnY-B2BnTZGEQz6wkFsnR3mLY6qp78UrdyiX4kf3rJXqxmkCAfGPRGyyY4NGU7xDzBus7B3hXJNG4yyaH1H8guySgP4Wo-ZoNcdRwQLUR0z6eRlUmgmT3EhyDSjc2FAfNrp-UQUzBSnnBhUAyhUc5rRuJyHSzSRV3a7TCE0Kd0o7yFwt-ipsw76R6tWjdWWcUyRSNy1GB4J7q98DAmFVqpjdXO37X35pXONcdFgA4urdMJ5Q2oh_uG1Wf-mubQFDVcFYBy16t61GMMPqMmP_hyRVIOFI-kkHGSn0CWT8Iw1uS7K6C38TKBcr7Z2hjCiU3GHOVD2LhwKjDSrwV33ZTqcTd_Rh2ZWdSlokfaXOZmfVU7EcpaQjtZEEEat9eXD9UpGpX_ov1vAA)

Click on the image above to see the actual data, visualized with appbase.io data browser.
