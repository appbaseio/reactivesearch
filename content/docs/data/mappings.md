---
title: 'Mappings'
meta_title: 'Appbase Mappings - Core Concepts'
meta_description: 'Mappings define how the JSON data indexed into appbase.io is stored as.'
keywords:
    - concepts
    - appbase
    - mappings
    - elasticsearch
sidebar: 'docs'
---

Mapping is the process of defining how a JSON document and the fields it contains are stored and indexed in ElasticSearch. There are various [field types](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html) offered by ElasticSearch which you can assign to the fields that will be stored in ElasticSearch.

Mappings are immutable in ElasticSearch. Once a mapping type is assigned to a field, it can be only modified by re-indexing the data with the new mapping type.

Appbase.io's [Schema UI](/docs/search/relevancy/#schema) (earlier called App Settings) lets you do the following:
- Add a new field and set its data type,
- In addition to a data type, you can also set the use-case for each field as either search or aggregation,
- You can update the data type of an existing field,
- You can delete an existing field.

Once you make schema changes, appbase.io does an in place re-index of the data.

![](https://i.imgur.com/ajFgt2r.gif)

## Field Data Types

Field data types are present in one of three shapes:

1. **Primitive**: Text, Keyword, Integer, Float, Double, Date, Geo Point, Boolean are some examples.

2. **Array**: An array shape in appbase.io is just a container that can hold one or more values of the primitive data type. There is no special data type associated with it.

3. **Object**: An object shape in appbase.io acts as a container that can hold a nested JSON object, each keys of which representing a primitive data type or another object / array container.

Beyond the primitive data types, there are also specialized data types that are specific to a search engine, like `completion`, `ip`, `percolator`. You can read all about the supported data types over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-types.html).

## How to Set Mappings

In addition to the Schema UI described above, you can use:

1. [**Data Browser**](https://dashboard.appbase.io/app?view=browse): The data browser UI can be used to set mappings via the `Add New Field` UI button.

![](https://i.imgur.com/51KlukI.png)

The UI supports adding all the primitive types. You can set your own mapping object for creating a specialized type or if you want to set any non-default options within a type.

2. [**REST API**](https://rest.appbase.io): You can use the REST API to set the mappings using the [PUT /_mapping](https://rest.appbase.io/#5c5e8488-a1a0-6bdb-a840-73b40a8d990a) endpoint.

> Note <i class="fa fa-info-circle"></i>
>
> Mappings are immutable in Elasticsearch. Once set, they can't be changed.
