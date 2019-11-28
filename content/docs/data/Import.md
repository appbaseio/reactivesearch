---
title: 'Importing Data'
meta_title: 'Appbase - Dashboard'
meta_description: 'Import through GUI and command line sources such as Dashboard, ABC CLI, Rest APIs, and Zapier.'
keywords:
    - dataschema
    - appbase
    - import
    - elasticsearch
sidebar: 'docs'
---

You can bring your data from various sources into an `appbase.io` app or cluster using one of the following methods:

<div class="grid-integrations-index mt4 mt6-l f8">
    <a class="bg-white shadow-2 box-shadow-hover shadow-2-hover  br4 db flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc" style="box-shadow: 0 0 5px rgba(0,0,0,.02), 0 5px 22px -8px rgba(0,0,0,.1);    word-break: normal;cursor: pointer; padding: 2rem; height: 120px;width:120px;" href="#importing-through-dashboard">
		<img class="w10 mb1" src="https://i.imgur.com/qXDGYSX.png" />
		Dashboard
	</a>
	<a class="bg-white shadow-2 box-shadow-hover shadow-2-hover  br4 db flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc" style="box-shadow: 0 0 5px rgba(0,0,0,.02), 0 5px 22px -8px rgba(0,0,0,.1);    word-break: normal;cursor: pointer; padding: 2rem; height: 120px;width:120px;" href="#importing-through-abc-cli">
    	<img class="w10 mb1" src="https://user-images.githubusercontent.com/4047597/29240054-14e0e19a-7f7b-11e7-898b-ba6bad756b1d.png" />
    	ABC CLI
    </a>
    <a class="bg-white shadow-2 box-shadow-hover shadow-2-hover  br4 db flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc" style="box-shadow: 0 0 5px rgba(0,0,0,.02), 0 5px 22px -8px rgba(0,0,0,.1);    word-break: normal;cursor: pointer; padding: 2rem; height: 120px;width:120px;" href="#rest-api">
        <img class="w10 mb1" src="https://i.imgur.com/nKKQLXb.png" />
        REST API
    </a>
	<a class="bg-white shadow-2 box-shadow-hover shadow-2-hover  br4 db flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc" style="box-shadow: 0 0 5px rgba(0,0,0,.02), 0 5px 22px -8px rgba(0,0,0,.1);    word-break: normal;cursor: pointer; padding: 2rem; height: 120px;width:120px;" href="#zapier">
		<img class="w10 mb1" src="https://i.imgur.com/Z9ahZbM.png" />
		Zapier
	</a>
</div>

This table below can help you choose the right method for your use-case:

<div class="table-less-width">

|                   | **Ease of Use** | **Supports Automation** | **Importing Large Dataset** | **Data Sources Supported**                                     |
| ----------------- | --------------- | ----------------------- | --------------------------- | -------------------------------------------------------------- |
| **Dashboard GUI** | ✔️              | ✖️️️                    | ✔️                          | CSV, JSON, ElasticSearch and SQL.                              |
| **ABC CLI**       | ✔️\*            | ✔️\*                    | ✔️                          | Everything above plus MongoDB, Firestore, Kafka, Redis, Neo4J. |
| **REST API**      | ✖️️️            | ✔️\*                    | ✔️                          | No restrictions.                                               |
| **Zapier**        | ✔️              | ✔️                      | ✖️                          | Typeform, Google Sheets, Twilio, and over 1500+ other apps.    |

</div>

---

## Importing Through Dashboard

![](https://i.imgur.com/ckEk5IL.png)

Dashboard offers a GUI for importing data visually. It supports the following formats:

1. **JSON / JSONL** - You can bring in any JSON or newline limited JSON files (or hosted URLs) to be imported using the Importer view of the dashboard.
2. **CSV** - You can also bring in a CSV file (or hosted URL) to be imported.
3. **ElasticSearch** - You can import an index from an ElasticSearch cluster hosted anywhere into your appbase.io app or cluster.
   ![](https://i.imgur.com/id7clAb.png)
4. **SQL** - You can import a SQL database from Postgres, MySQL or Microsoft SQL Server into your appbase.io app or cluster.
   ![](https://i.imgur.com/itWUcXM.png)

You can try the Importer UI live over [here](https://dashboard.appbase.io/app/?view=import).

Below is a GIF showing the import process for a JSON file.

![](http://g.recordit.co/3pUmi0KC3n.gif)

---

## Importing Through ABC CLI

While the dashboard GUI supports the most common formats, we offer the [ABC CLI](https://github.com/appbaseio/abc) which allows importing data from an extensive list of database sources using the `abc import` command.

### Key Benefits

-   Whether your data resides in Postgres or a JSON file or MongoDB or in all three places, **abc** can index the data into Elasticsearch. It is the only tool that allows working with all these sources at once or individually: `csv`, `json`, `postgres`, `mysql`, `sqlserver`, `mongodb`, `elasticsearch` and `firestore`.
-   It can keep the Elasticsearch index synced in realtime with the data source.
    > Note: This is currently only supported for MongoDB and Postgres.
-   `abc import` is a single line command that allows doing all of the above. It doesn’t require any external dependencies, code configuration is optional (and helps with transforming data before being indexed), and runs as an isolated process with a minimal resource footprint.

### Installation

You can install ABC CLI from the [latest Github release](https://github.com/appbaseio/abc/releases/latest) for your OS.

You can also install this via docker using:

> : `docker pull appbaseio/abc`

It is possible to import data from various database sources. See the snippets below that show the import command for each of the supported database.

### Postgres

```bash
abc import --src_type=postgres --src_uri=<uri> <elasticsearch_uri>
```

Read more about it over [here](https://medium.appbase.io/cli-for-indexing-data-from-postgres-to-elasticsearch-6eebc5cc0f0f).

### MongoDB

```bash
abc import --src_type=mongodb --src_uri=<uri> <elasticsearch_uri>
```

Read more about it over [here](https://medium.appbase.io/cli-for-indexing-data-from-mongodb-to-elasticsearch-ee5a74695945).

### MySQL

```bash
abc import --src_type=mysql --src_uri=<uri> <elasticsearch_uri>
```

Read more about it over [here](https://medium.appbase.io/cli-for-indexing-data-from-mysql-to-elasticsearch-b59289e5025d).

### Microsoft SQL Server

```bash
abc import --src_type=mssql --src_uri=<uri> <elasticsearch_uri>
```

Read more about it over [here](https://medium.appbase.io/cli-for-indexing-data-from-mssql-to-elasticsearch-341963a054dd).

### Elasticsearch

```bash
abc import --src_type=elasticsearch --src_uri=<elasticsearch_src_uri> <elasticsearch_dest_uri>
```

Read more about it over [here](https://medium.appbase.io/cli-for-indexing-data-from-elasticsearch-to-elasticsearch-301c7a243c84).

### JSON

```bash
abc import --src_type=json --src_uri=<uri> --typename=<target_type_name> <elasticsearch_uri>
```

Read more about it over [here](https://medium.appbase.io/cli-for-indexing-data-from-json-to-elasticsearch-92f582c53df4).

### CSV

```bash
abc import --src_type=csv --src_uri=<uri> --typename=<target_type_name> <elasticsearch_uri>
```

Read more about it over [here](https://medium.appbase.io/cli-for-indexing-data-from-csv-to-elasticsearch-17d290a5974f).

### Firestore

```bash
abc import --src_type=firestore --sac_path=<path_to_service_account_credentials> <elasticsearch_uri>
```

Read more about it over [here](https://medium.appbase.io/cli-for-indexing-from-firestore-to-elasticsearch-80286fc8e58b).

### SQLITE

```bash
abc import --src_type=sqlite src_uri=./data.db?_busy_timeout=5000
```

Read more about it over [here](https://github.com/appbaseio/abc/blob/dev/docs/importer/adaptors/sqlite.md).

### Kafka

```bash
abc import --src_type=kafka src_uri=kafka://user:pass@SERVER:PORT/TOPIC1,TOPIC2
```

Read more about it over [here](https://github.com/appbaseio/abc/blob/dev/docs/importer/adaptors/kafka.md).

### Neo4J

```bash
abc import --src_type=neo4j src_uri=bolt://localhost:7687
```

Read more about it over [here](https://github.com/appbaseio/abc/blob/dev/docs/importer/adaptors/neo4j.md).

### Redis

```bash
abc import --src_type=redis --src_uri="redis://localhost:6379/0" https://USERID:PASS@scalr.api.appbase.io/APPNAME
```

Read more about it over [here](https://github.com/appbaseio/abc/blob/dev/docs/importer/adaptors/redis.md).

---

## REST API

Appbase.io, by extension of ElasticSearch's REST API offers two ways to index data:

1. Document Index / Document Update endpoint - Read more about this in the doc and see an example code snippet [here](https://rest.appbase.io/?version=latest#81149466-4ba5-8214-56f6-6a0d2f3bebcc).
2. Bulk Index endpoint - Read more in the doc and see an example code snippet [here](https://rest.appbase.io/?version=latest#1162c8a2-733f-aee0-1c57-63fc3979feeb).

You can also see the examples below that show an interactive example of using the bulk API for JavaScript, Go, Python and PHP:

### Javascript

<iframe height="600px" width="100%" src="https://repl.it/@YashJoshi/Appbase-js-BulkIndex?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

### Go

<iframe height="600px" width="100%" src="https://repl.it/@dhruvdutt/Appbaseio-Go-Bulk-Index-Data?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

### Python

<iframe height="600px" width="100%" src="https://repl.it/@dhruvdutt/Appbaseio-Python-Bulk-Index-Data?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

### PHP

<iframe height="600px" width="100%" src="https://repl.it/@dhruvdutt/Appbaseio-Go-Bulk-Index-Data?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

> Note <i class="fa fa-info-circle"></i>
>
> It is recommended to index up to 1 MB of data (~500 documents) at a time (so if you have 50,000 documents, you can split them into chunks of 500 documents and index).

---

## Zapier

![](https://cdn-images-1.medium.com/max/2400/1*CpUXOCaeIZYSqzCTJEtVGg.png)

Appbase.io's Zapier integration allows you to import data from over 1500+ apps such as Mailchimp, Sendgrid, Twilio, Google Sheets, Typeform into your appbase.io app or cluster.

> You can start using the integration using this invite link: https://zapier.com/developer/public-invite/33102/02001b9598c3849a50cf1c94ff0cf572/

If you are new to Zapier, it allows connecting apps you use everyday to automate your work and be more productive. You can read more about Zapier over [here](https://zapier.com).

In this section, we will walk through the process of importing data using this Zapier integration. We will use Google Sheets as the input source.

> You can also read about importing data from TypeForm into appbase.io using this Zapier integration over [here](https://medium.appbase.io/integrating-typeform-and-appbase-io-using-zapier-with-zero-lines-of-code-3d03c0e5ccd0).

### Creating A Zap

You can go to the [Zapier editor](https://zapier.com/app/editor/) and create a zap. In the below image, we create a zap for `Google Sheets <> appbase.io`.

![](https://i.imgur.com/GSavUdf.png)

### Adding Your Data In Google Sheets

Add data in your Google Sheets. You can directly copy the data from [here](https://docs.google.com/spreadsheets/d/1nc3n-saZ8pVd7gE64iR6BrJoHzpVOrRPi8B3598UCLQ/edit?usp=sharing).

![](https://i.imgur.com/eHoBAWB.png)

### Configuring Google Sheets

Login with your Google account and once you configure the Google Sheets integration, you should see something similar:

![](https://i.imgur.com/tARRU02.png)

### Configuring appbase.io

Next, select `appbase.io` from the apps and go to the `Create Document` action.

![](https://i.imgur.com/NXSWV1Y.png)

After this step, you need to add your API credentials and authenticate. Connect your `appbase.io` account on clicking `Add a New Account` under `Choose Account` section, where you have to
enter your `appbase.io` credentials which you can find [here](https://dashboard.appbase.io/profile/credentials).
You should see something similar:

![](https://i.imgur.com/avTdYss.png)

You can perform below operations through Zapier.

### Adding New Record

I am going to call my appbase.io app `business` here. The Zapier integration will create the app if it doesn't exist. The next step is to map the columns from Google Sheets to the field names that will be used to store them in appbase.io. It should look something similar to the following:

![](https://i.imgur.com/wHpDMH7.png)

After clicking on `Continue` and after a successful insertion, you will also see an `_id` being returned back. This is the unique ID for our record (aka document).

![](https://i.imgur.com/r2MSpTg.png)

### Updating An Existing Document

Another helpful feature is the ability to edit existing documents. Whenever a value from an incoming integration is mapped to an `_id` field, the existing document gets updated instead of a new document getting created.

![](https://i.imgur.com/7zEAso9.png)
