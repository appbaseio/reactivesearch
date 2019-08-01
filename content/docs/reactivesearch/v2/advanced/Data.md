---
title: 'Writing and Editing Data'
meta_title: 'Writing and Editing Data'
meta_description: 'Writing and updating data is a common operation that is triggered from app UIs.'
keywords:
    - reactivesearch
    - data
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'web-v2-reactivesearch'
---

Writing and updating data is a common operation that is triggered from app UIs.

[ReactiveSearch](https://opensource.appbase.io/reactivesearch/) offers components for creating read based search UIs.

In this post, we will talk about a few ways to perform Create, Update and Delete operations on the data.

## appbase-js

[`appbase-js`](https://github.com/appbaseio/appbase-js) is the javascript library from appbase.io that runs on Node.JS, UMD, React and React Native environments.

We recommend using appbase-js in a [Node.JS middleware](http://expressjs.com/en/guide/using-middleware.html) to perform the write operations.

> Note
>
> It is important to perform write operations from a secure environment, as you don't want to expose the write credentials publicly.

## REST API

If your middleware is written in a different language, you can easily use the REST API endpoints to write data into appbase.io or Elasticsearch. An example PUT endpoint for indexing a new (or overwriting an existing) document would look like:

```bash
curl -XPUT $host/$app/$type/$doc_id -d '{
   "msg": "Hello from ReactiveSearch",
   "from": "A middleware server"
}'
```

Full REST API is available at [rest.appbase.io](https://rest.appbase.io).
