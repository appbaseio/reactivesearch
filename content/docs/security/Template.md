---
title: 'Search Template'
meta_title: 'Search Template'
meta_description: 'API credentials allow secure access to the appbase.io APIs.'
keywords:
    - security
    - appbaseio
    - searchtemplate
    - elasticesearch
sidebar: 'docs'
---

Search Templates prevent script injections by only passing the parameters to your search query rather than the query itself over the network.

![](https://i.imgur.com/uzf1AtQ.png)

## How Search Templates Work

The `/_search/template` endpoint allows to use the mustache language to pre render search requests, before they are executed and fill existing templates with template parameters.

### Create/Edit Template

Let's start with creating a template, to create a template you need to define the `source` key in the elasticsearch query DSL format.

![](https://i.imgur.com/cCA62CB.png)

> Note <i class="fa fa-info-circle"></i>
>
> You can also update the template query just by using the same view.

### Validate/Render Template

You can render a template in a response with given parameters using the `Validate and Render` option.

![](https://i.imgur.com/v2JjZRM.png)

This call will return the rendered template:

![](https://i.imgur.com/omWOkqJ.png)

### Get API Endpoint

![](https://i.imgur.com/YtFxnTI.png)

You can use `Copy as CURL` option to copy the request in your clipboard.<br/>
For an example check this sample request.

```bash
curl -X GET https://scalr.api.appbase.io/movies-store-app/_search/template -H 'Content-Type: application/json' -H 'Authorization: Basic XYZ' -d'
{
  "id": "Template1",
  "params": {
    "query_string": "search for these words"
  }
}
'
```

Open your terminal and paste the request to test the search query results.
