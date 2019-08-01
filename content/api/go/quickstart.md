---
title: 'Quickstart'
meta_title: 'Quickstart to Golang'
meta_description: 'go-appbase is a universal Golang client library for working with the appbase.io database.'
keywords:
    - quickstart
    - golang
    - appbase
    - elasticsearch
sidebar: 'api-reference'
---

[go-appbase](https://godoc.org/github.com/appbaseio/go-appbase/) is a universal Golang client library for working with the appbase.io database.

It can:

-   Index new documents or update / delete existing ones.
-   Stream updates to documents, queries or filters using `http-streams`.

It can't:

-   Configure mappings, change analyzers, or capture snapshots. These are provided by Elasticsearch client libraries. We recommend the golang [elastic](https://olivere.github.io/elastic/) library by Olivere.

[Appbase.io - the database service](https://appbase.io) is opinionated about cluster setup and hence doesn't support the ElasticSearch devops APIs. See [rest.appbase.io](https://rest.appbase.io) for a full reference on the supported APIs.

This is a quick start guide to whet the appetite with the possibilities of data streams. The full client API reference can be found [here](https://godoc.org/github.com/appbaseio/go-appbase/).

## Creating an App

This gif shows how to create an app on appbase.io, which we will need for this quickstart guide.

![](https://i.imgur.com/r6hWKAG.gif)

Log in to <span class="fa fa-external-link"></span> [appbase.io dashboard](https://dashboard.appbase.io/), and create a new app.

For this tutorial, we will use an app called `newstreamingapp`. The credentials for this app are `meqRf8KJC:65cc161a-22ad-40c5-aaaf-5c082d5dcfda`.

> Note <i class="fa fa-info-circle"></i>
>
> appbase.io uses **HTTP Basic Auth** for authenticating requests.

## Import go-appbase

We will fetch and install the **go-appbase** lib using git.

```
go get -t github.com/appbaseio/go-appbase
```

Adding it in the project should be a one line import syntax.

```
import "github.com/appbaseio/go-appbase"
```

To write data or stream updates from [appbase.io](https://appbase.io), we need to first create a reference object. We do this by passing the appbase.io API URL, app name, and credentials into the `Appbase` constructor:

```go
client, _ = NewClient("https://scalr.api.appbase.io", "meqRf8KJC", "65cc161a-22ad-40c5-aaaf-5c082d5dcfda", "newstreamingapp")
err := client.Ping()
if err != nil {
	log.Println(err)
}
// Import `fmt` package before printing
fmt.Println("Client created")

```

## Storing Data

Once we have the reference object (called `client` in this tutorial), we can insert any JSON data into it with the `Index()` method.

```go
const jsonObject = `{
	"department_name": "Books",
	"department_name_analyzed": "Books",
	"department_id": 1,
	"name": "A Fake Book on Network Routing",
	"price": 5595
}`
```

```go
result, err := client.Index().Type("books").Id("1").Body(jsonObject).Do()
if err != nil {
	log.Println(err)
	return
}
fmt.Println("Data Inserted. ID: ", result.ID)
```

where `type: 'books'` indicates the collection (or table) inside which the data will be stored and the`id: "1"` is a unique identifier of the data.

> Note <span class="fa fa-info-circle"></span>
>
> appbase.io uses the same APIs and data modeling conventions as [ElasticSearch](https://www.elastic.co/products/elasticsearch). A **type** is equivalent to a collection in MongoDB or a table in SQL, and a **document** is similar to the document in MongoDB or a row in SQL.

## GETing or Streaming Data

Unlike typical databases that support GET operations (or Read) for fetching data and queries, appbase.io operates on both GET and stream modes.

### Getting a Document Back

We will first apply the GET mode to read our just inserted object using the `Get()` method.

```go
response, err := client.Get().Type("books").Id("1").Do()
if err != nil {
	log.Println(err)
	return
}
// MarshalIndent for pretty printing Json
document, err := json.MarshalIndent(response.Source, "", "  ")
if err != nil {
	log.Println("error:", err)
}
fmt.Println("Document: ", string(document), ", ", "Id: ", response.Id)
```

should print:

```


Document: {
	"department_name": "Books",
	"department_name_analyzed": "Books",
	"department_id": 1,
	"name": "A Fake Book on Network Routing",
},
Id: "1"
```

### Subscribing to a Document Stream

Now let's say that we are interested in subscribing to all the state changes that happen on a document. Here, we would use the `GetStream()` method over `Get()`, which keeps returning new changes made to the document.

```go
response, err := client.GetStream().Type("books").Id("1").Do()
if err != nil {
	log.Println(err)
}
for {
	data, _ := response.Next()
	// MarshalIndent for pretty printing JSON
	document, err := json.MarshalIndent(data.Source, "", "  ")
	if err != nil {
		log.Println("error:", err)
	}
	fmt.Println("Document: ", string(document), ", Id: ", data.Id)
}
```

Don't be surprised if you don't see anything printed, `GetStream()` only returns updates made to the document after you have subscribed.

### Observe the Updates in Realtime

Let's see live updates in action. We will modify the book price in our original `jsonObject` variable from 5595 to 6034 and apply `Index()` again.

For brevity, we will not show the `Index()` operation here.

GetStream() Response:

```go
Document: {
	"department_name": "Books",
	"department_name_analyzed": "Books",
	"department_id": 1,
	"name": "A Fake Book on Network Routing",
	"price": 6034
},
Id: "1"
```

In the new document update, we can see the price change (5595 -> 6034) being reflected. Subsequent changes will be streamed as JSON objects.

`Note:` Appbase always streams the final state of an object, and not the diff b/w the old state and the new state. You can compute diffs on the client side by persisting the state using a composition of (\_type, \_id) fields.

## Streaming Rich Queries

Streaming document updates are great for building messaging systems or notification feeds on individual objects. What if we were interested in continuously listening to a broader set of data changes? The `SearchStream()` method scratches this itch perfectly.

In the example below, we will see it in action with a `match_all` query that returns any time a new document is added to the type 'books' or when any of the existing documents are modified.

```go
const matchAllQuery string = `{"query":{"match_all":{}}}`
response, err := client.SearchStream().Type("books").Body(matchAllQuery).Do()
if err != nil {
	log.Println(err)
	return
}

// Now we index another object.
const anotherBook string = `{"department_name": "Books", "department_name_analyzed": "Books", "department_id": 2, "name": "A Fake Book on Load balancing", "price": 7510}`
_, err = client.Index().Type("books").Id("3").Body(anotherBook).Do()
if err != nil {
	log.Println(err)
	return
}

// This should trigger a new streaming match.
data, err := response.Next()
if err != nil {
	log.Println(err)
	return
}
fmt.Println("Id: ", data.Id)

// MarshalIndent for pretty printing JSON
document, err := json.MarshalIndent(data.Source, "", "  ")
if err != nil {
	log.Println("error:", err)
}
fmt.Println("Document: ", string(document))
```

Response when a new data changes:

```
Id: "3"
Document: {
	"department_name": "Books",
	"department_name_analyzed": "Books",
	"department_id": 2,
	"name": "A Fake Book on Load balancing",
	"price": 7510
}
```

`Note:` Like `GetStream()`, `SearchStream()` subscribes to the new matches.

## Streaming Rich Queries to a URL

`SearchStreamToURL()` streams results directly to a URL instead of streaming back. In the example below we will see with a `match_all` query that sends anytime a new document is added to the type `books` to an URL.

```go
// Similar to NewClient, we will instiate a webhook instance with appbase.NewWebhook()
webhook := appbase.NewWebhook()

// Webhook instancess need to have a URL, method and body (which can be string or a JSON object)
webhook.URL = "https://www.mockbin.org/bin/cd6461ab-468f-42f5-865f-4eed22daae95"
webhook.Method = "POST"
webhook.Body = "hellowebhooks"
const matchAllQuery string = `{"query":{"match_all":{}}}`

response, err := client.SearchStreamToURL().Type("books").Query(matchAllQuery).AddWebhook(webhook).Do()
if err != nil {
	log.Println(err)
	return
}

stopSearchStream, err := response.Stop()
if err != nil {
	log.Println(err)
	return
}
fmt.Println(response.Id == stopSearchStream.Id)
```

SearchStreamToURL() response

```
{
	true
}
```

In this tutorial, we have learnt how to index new data and stream both individual data as well as query results. Go check out the full Golang client reference over [here](https://godoc.org/github.com/appbaseio/go-appbase/).
