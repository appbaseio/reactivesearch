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

You can bring your data from various sources into `appbase.io` database using one or many of these methods.

<div class="grid-integrations-index mt4 mt6-l f8">
    <a class="bg-white shadow-2 box-shadow-hover shadow-2-hover  br4 db flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc" style="box-shadow: 0 0 5px rgba(0,0,0,.02), 0 5px 22px -8px rgba(0,0,0,.1);    word-break: normal;cursor: pointer; padding: 2rem; height: 120px;width:120px;" href="#importing-through-dashboard">
		<img class="w10 mb1" src="https://i.imgur.com/qXDGYSX.png" />
		Dashboard
	</a>
	<a class="bg-white shadow-2 box-shadow-hover shadow-2-hover  br4 db flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc" style="box-shadow: 0 0 5px rgba(0,0,0,.02), 0 5px 22px -8px rgba(0,0,0,.1);    word-break: normal;cursor: pointer; padding: 2rem; height: 120px;width:120px;" href="#importing-through-abc-cli">
    		<img class="w10 mb1" src="https://user-images.githubusercontent.com/4047597/29240054-14e0e19a-7f7b-11e7-898b-ba6bad756b1d.png" />
    		ABC CLI
    </a>
    <a class="bg-white shadow-2 box-shadow-hover shadow-2-hover  br4 db flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc" style="box-shadow: 0 0 5px rgba(0,0,0,.02), 0 5px 22px -8px rgba(0,0,0,.1);    word-break: normal;cursor: pointer; padding: 2rem; height: 120px;width:120px;" href="#importing-through-abc-adaptors">
        		<img class="w10 mb1" src="https://user-images.githubusercontent.com/4047597/29240054-14e0e19a-7f7b-11e7-898b-ba6bad756b1d.png" />
        		ABC Adaptors
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

---

##Importing through Dashboard

![](https://i.imgur.com/ckEk5IL.png)

Dashboard is a WYSIWYG GUI for adding, modifying and viewing your appbase.io app's data.

Data is stored as JSON documents. You can read more about the data schema [here](/docs/data/Model).

In this tutorial we will review how to import data from a data file using the appbase.io [dashboard](https://dashboard.appbase.io/).

### Dataset

We’ll use an example from an [actors dataset](https://github.com/algolia/datasets/blob/master/movies/actors.json). Feel free to use your own dataset instead.

We use JSON format, but CSV is also acceptable.

**Example of a JSON file**

```json
[
	{
		"firstname": "Jimmie",
		"lastname": "Barninger"
	},
	{
		"firstname": "Warren",
		"lastname": "Speach"
	}
]
```

**Example of a CSV file**

```csv
firstname,lastname
Jimmie,Barninger
Warren,Speach
```

### Open the appbase.io Dashboard

Head over to [appbase.io dashboard](https://dashboard.appbase.io) and login with your credentials or create an account if you haven't one.

### Creating a new app

As we are using an actors dataset, let’s name our new app `actors`.

![](https://i.imgur.com/v4h2JuY.png)

### Upload the file

Now that the app has been created, we can import the data file as shown in the GIF.

![](https://www.dropbox.com/s/05do1q1wvp7t13t/short_upload.gif?raw=1)

---

##Importing through ABC CLI
`abc import` is part of [abc](https://github.com/appbaseio/abc) — A tool that allows accessing appbase.io via a commandline.

###Key Benefits

-   Whether your data resides in Postgres or a JSON file or MongoDB or in all three places, **abc** can index the data into Elasticsearch. It is the only tool that allows working with all these sources at once or individually: `csv`, `json`, `postgres`, `mysql`, `sqlserver`, `mongodb`, `elasticsearch` and `firestore`.
-   It can keep the Elasticsearch index synced in realtime with the data source.
    > Note: This is currently only supported for MongoDB and Postgres.
-   `abc import` is a single line command that allows doing all of the above. It doesn’t require any external dependencies, takes zero lines of code configuration, and runs as an isolated process with a minimal resource footprint.

### Installation

> Command Line: `docker pull appbaseio/abc`

You can also download from [GitHub](https://github.com/appbaseio/abc/releases/latest) or get the [Docker image](https://hub.docker.com/r/appbaseio/abc/)

It is possible to import data from various database sources. See the API below to import from the database that suits your need.

###Postgres

```bash
abc import --src_type=postgres --src_uri=<uri> <elasticsearch_uri>
```

Read more about it over [here](https://medium.appbase.io/cli-for-indexing-data-from-postgres-to-elasticsearch-6eebc5cc0f0f)

###MongoDB
###abc import

```bash
abc import --src_type=mongodb --src_uri=<uri> <elasticsearch_uri>
```

Read more about it over [here](https://medium.appbase.io/cli-for-indexing-data-from-mongodb-to-elasticsearch-ee5a74695945)

###MySQL

```bash
abc import --src_type=mysql --src_uri=<uri> <elasticsearch_uri>
```

Read more about it over [here](https://medium.appbase.io/cli-for-indexing-data-from-mysql-to-elasticsearch-b59289e5025d)

###Microsoft SQL Server

```bash
abc import --src_type=mssql --src_uri=<uri> <elasticsearch_uri>
```

Read more about it over [here](https://medium.appbase.io/cli-for-indexing-data-from-mssql-to-elasticsearch-341963a054dd)

###Elasticsearch

```bash
abc import --src_type=elasticsearch --src_uri=<elasticsearch_src_uri> <elasticsearch_dest_uri>
```

Read more about it over [here](https://medium.appbase.io/cli-for-indexing-data-from-elasticsearch-to-elasticsearch-301c7a243c84)

###JSON

```bash
abc import --src_type=json --src_uri=<uri> --typename=<target_type_name> <elasticsearch_uri>
```

Read more about it over [here](https://medium.appbase.io/cli-for-indexing-data-from-json-to-elasticsearch-92f582c53df4)

###CSV

```bash
abc import --src_type=csv --src_uri=<uri> --typename=<target_type_name> <elasticsearch_uri>
```

Read more about it over [here](https://medium.appbase.io/cli-for-indexing-data-from-csv-to-elasticsearch-17d290a5974f)

###Firestore

```bash
abc import --src_type=firestore --sac_path=<path_to_service_account_credentials> <elasticsearch_uri>
```

Read more about it over [here](https://medium.appbase.io/cli-for-indexing-from-firestore-to-elasticsearch-80286fc8e58b)

---

##Importing through ABC adaptors
ABC allows the user to configure a number of data adaptors as sources or sinks. These can be databases, files or other resources. Data is read from the sources, converted into a message format, and then send down to the sink where the message is converted into a writable format for its destination. The user can also create data transformations in JavaScript which can sit between the source and sink and manipulate or filter the message flow.
Adaptors may be able to track changes as they happen in source data. This "tail" capability allows a ABC to stay running and keep the sinks in sync. The command for importing through config file is:

```shell script
abc import --config=test.env
```

File extension doesn't matter. The file `test.env` should be an INI/ENV like file with key value pair containing the values of attributes required for importing.
Examples of test.env file for different sources are as follows:

###CSV

```dotenv
src_type=csv
src_uri=/full/local/path/to/file.csv
typename=type_name_to_use

dest_type=elasticsearch
dest_uri=https://USERID:PASS@scalr.api.appbase.io/APPNAME
```

Read more about it over [here](https://github.com/appbaseio/abc/blob/dev/docs/importer/adaptors/csv.md)

###Elasticsearch

```dotenv
src_type=elasticsearch
src_uri=https://user:pass@es_cluster/index

dest_type=elasticsearch
dest_uri=https://USERID:PASS@scalr.api.appbase.io/APPNAME
```

Read more about it over [here](https://github.com/appbaseio/abc/blob/dev/docs/importer/adaptors/elasticsearch.md)

---

###Cloud Firestore

```dotenv
src_type=firestore
sac_path="/path/to/service_account_credentials_file.json"
src_filter="<collection name/regex>"

dest_type=elasticsearch
dest_uri=https://USERID:PASS@scalr.api.appbase.io/APPNAME
```

Read more about it over [here](https://github.com/appbaseio/abc/blob/dev/docs/importer/adaptors/firestore.md)

###JSON

```dotenv
src_type=json
src_uri=/full/path/to/file.json
typename=typename

dest_type=elasticsearch
dest_uri=https://USERID:PASS@scalr.api.appbase.io/APPNAME
```

Read more about it over [here](https://github.com/appbaseio/abc/blob/dev/docs/importer/adaptors/json.md)

###JSONL

```dotenv
src_type=jsonl
src_uri=/full/path/to/file.json
typename=typename

dest_type=elasticsearch
dest_uri=https://USERID:PASS@scalr.api.appbase.io/APPNAME
```

Read more about it over [here](https://github.com/appbaseio/abc/blob/dev/docs/importer/adaptors/jsonl.md)

###Kafka

```dotenv
src_type=kafka
src_uri=kafka://user:pass@SERVER:PORT/TOPIC1,TOPIC2
tail=false

dest_type=elasticsearch
dest_uri=https://USERID:PASS@scalr.api.appbase.io/APPNAME
```

Read more about it over [here](https://github.com/appbaseio/abc/blob/dev/docs/importer/adaptors/kafka.md)

###Mongo DB

```dotenv
src_type=mongodb
src_uri=mongodb://user:pass@SERVER:PORT/DBNAME
tail=false

dest_type=elasticsearch
dest_uri=APP_NAME
dest_uri=https://USERID:PASS@scalr.api.appbase.io/APPNAME
```

Read more about it over [here](https://github.com/appbaseio/abc/blob/dev/docs/importer/adaptors/mongodb.md)

###MSSQL

```dotenv
src_type=mssql
src_uri=sqlserver://USER:PASSWORD@SERVER:PORT?database=DBNAME

dest_type=elasticsearch
dest_uri=https://USERID:PASS@scalr.api.appbase.io/APPNAME
```

Read more about it over [here](https://github.com/appbaseio/abc/blob/dev/docs/importer/adaptors/mssql.md)

###MYSQL

```dotenv
src_type=mysql
src_uri=USER:PASSWORD@tcp(HOST:PORT)/DBNAME

dest_type=elasticsearch
dest_uri=https://USERID:PASS@scalr.api.appbase.io/APPNAME
```

Read more about it over [here](https://github.com/appbaseio/abc/blob/dev/docs/importer/adaptors/mysql.md)

###Neo4J

```dotenv
src_type=neo4j
src_uri=bolt://localhost:7687
src_username=username
src_password=password
src_realm=realm

dest_type=elasticsearch
dest_uri=https://USERID:PASS@scalr.api.appbase.io/APPNAME
```

Read more about it over [here](https://github.com/appbaseio/abc/blob/dev/docs/importer/adaptors/neo4j.md)

###PostgreSQL

```dotenv
src_type=postgres
src_uri=postgres://127.0.0.1:5432/test
tail=false

dest_type=elasticsearch
dest_uri=https://USERID:PASS@scalr.api.appbase.io/APPNAME
```

Read more about it over [here](https://github.com/appbaseio/abc/blob/dev/docs/importer/adaptors/postgres.md)

###Redis

```bash
abc import --src_type=redis --src_uri="redis://localhost:6379/0" https://USERID:PASS@scalr.api.appbase.io/APPNAME
```

Read more about it over [here](https://github.com/appbaseio/abc/blob/dev/docs/importer/adaptors/redis.md)

###SQLITE

```dotenv
src_type=sqlite
src_uri=./data.db?_busy_timeout=5000

dest_type=elasticsearch
dest_uri=https://USERID:PASS@scalr.api.appbase.io/APPNAME
```

Read more about it over [here](https://github.com/appbaseio/abc/blob/dev/docs/importer/adaptors/sqlite.md)

---

##REST API
Let's now learn to index multiple documents in one request. For this, we'll use [Bulk API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html) to perform many index/delete operations in a single API call.

### Setting things up

Before we start using the appbase-js lib, we’ll need to set up an appbase.io app.

For this tutorial, we have used a <a href="https://opensource.appbase.io/dejavu/live/#?input_state=XQAAAAKLAQAAAAAAAAA9iIqnY-B2BnTZGEQz6wkFsW71dAzA7YYc-SS2NBdZOu2iiqUDTwzb8SRY-P60qxz_ZFKoJgMwEJushaRl-FxMxQqDCBLVG-xBlA5HfOZXDzUuGnntd_Zw9u4C0YdVJQ8HvMJrVO8AfQy73d9wq7TjySsVRv-NAKU5ZUw4jxU0ynrQflgPkDLN6AGDv4jeOi8Ir9BBSZ-bdv4J2oq7eCzLoC-gl9qTZsTRLHsXPhHvClG5we6nqctwdPgHqEWqj25nG0qo1RkmJYY_ZTF4XEJcMQyIw-2Rck0OE-ZTR7g8d3ste2uR2u9JbeJj9fjtjVNDltaQGN8jaAdUVVriYpB2CzgXN__Rv9tA&editable=false" target="_blank">sample app</a> containing some dummy housing records. All the examples use this app. You can also clone this app (to create your own private app) directly by clicking "Clone this app" in the <a href="https://opensource.appbase.io/dejavu/live/#?input_state=XQAAAAKLAQAAAAAAAAA9iIqnY-B2BnTZGEQz6wkFsW71dAzA7YYc-SS2NBdZOu2iiqUDTwzb8SRY-P60qxz_ZFKoJgMwEJushaRl-FxMxQqDCBLVG-xBlA5HfOZXDzUuGnntd_Zw9u4C0YdVJQ8HvMJrVO8AfQy73d9wq7TjySsVRv-NAKU5ZUw4jxU0ynrQflgPkDLN6AGDv4jeOi8Ir9BBSZ-bdv4J2oq7eCzLoC-gl9qTZsTRLHsXPhHvClG5we6nqctwdPgHqEWqj25nG0qo1RkmJYY_ZTF4XEJcMQyIw-2Rck0OE-ZTR7g8d3ste2uR2u9JbeJj9fjtjVNDltaQGN8jaAdUVVriYpB2CzgXN__Rv9tA&editable=false" target="_blank">data browser view of the app here</a>.

<br/>

<a target="_blank" href="https://opensource.appbase.io/dejavu/live/#?input_state=XQAAAAKLAQAAAAAAAAA9iIqnY-B2BnTZGEQz6wkFsW71dAzA7YYc-SS2NBdZOu2iiqUDTwzb8SRY-P60qxz_ZFKoJgMwEJushaRl-FxMxQqDCBLVG-xBlA5HfOZXDzUuGnntd_Zw9u4C0YdVJQ8HvMJrVO8AfQy73d9wq7TjySsVRv-NAKU5ZUw4jxU0ynrQflgPkDLN6AGDv4jeOi8Ir9BBSZ-bdv4J2oq7eCzLoC-gl9qTZsTRLHsXPhHvClG5we6nqctwdPgHqEWqj25nG0qo1RkmJYY_ZTF4XEJcMQyIw-2Rck0OE-ZTR7g8d3ste2uR2u9JbeJj9fjtjVNDltaQGN8jaAdUVVriYpB2CzgXN__Rv9tA&editable=false">
<img alt="Dataset" src="https://i.imgur.com/erNycvVg.png" />
</a>

All the records are structured in the following format:

```js

{
    "name": "The White House",
    "room_type": "Private room",
    "property_type": "Townhouse",
    "price": 124,
    "has_availability": true,
    "accommodates": 2,
    "bedrooms": 1,
    "bathrooms": 1.5,
    "beds": 1,
    "bed_type": "Real Bed",
    "host_image": "https://host_image.link",
    "host_name": "Alyson",
    "image": "https://image.link",
    "listing_url": "https://www.airbnb.com/rooms/6644628",
    "location": {
        "lat": 47.53540733743967,
        "lon": -122.27983057017123
    },
    "date_from": 20170426,
    "date_to": 20170421,
}
```

Let's now learn to index multiple documents in one request with these interactive examples in different languages.

###Javascript

<iframe height="600px" width="100%" src="https://repl.it/@YashJoshi/Appbase-js-BulkIndex?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

> Note <i class="fa fa-info-circle"></i>
>
> It is recommended to index up to 1 MB of data (~500 documents) at a time (so if you have 50,000 documents, you can split them into chunks of 500 documents and index).

###Go

<iframe height="600px" width="100%" src="https://repl.it/@dhruvdutt/Appbaseio-Go-Bulk-Index-Data?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

###Python

<iframe height="600px" width="100%" src="https://repl.it/@dhruvdutt/Appbaseio-Python-Bulk-Index-Data?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

###PHP

<iframe height="600px" width="100%" src="https://repl.it/@dhruvdutt/Appbaseio-Go-Bulk-Index-Data?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

---

##Zapier

![](https://cdn-images-1.medium.com/max/2400/1*CpUXOCaeIZYSqzCTJEtVGg.png)

In this section, we will walk through the process of importing using this Zapier integration. It uses Google Sheets as the input source.

Zapier allows connecting apps you use everyday to automate your work and be more productive. You can read more about Zapier over [here](https://zapier.com).

> Right now, the appbase.io's Zapier integration is not publicly available on Zapier which you can use with this invite link: https://zapier.com/developer/public-invite/33102/02001b9598c3849a50cf1c94ff0cf572/

> You can read about importing data from TypeForm into appbase.io using Zapier over [here](https://medium.appbase.io/integrating-typeform-and-appbase-io-using-zapier-with-zero-lines-of-code-3d03c0e5ccd0).

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

##Conclusion

With the below comparision table, you can determine which method suits best for importing data according to your use-case.

|               | **CLI** | **GUI** | **Importing Large Dataset** | **Example Scenario**                                                                              |
| ------------- | ------- | ------- | --------------------------- | ------------------------------------------------------------------------------------------------- |
| **Dashboard** | ✔️      | ✔️      | ✔️                          | CSV, JSON, ElasticSearch, SQL                                                                     |
| **ABC**       | ✔️      | ✖️      | ✔️                          | CSV, JSON, ElasticSearch, Postgres, MongoDB, MySQL, Firestore, etc...                             |
| **REST API**  | ✔️      | ✖️      | ✔️                          | Object or Array of Objects through various languages such as `Javascript`, `Python`, `Go`, etc... |
| **Zapier**    | ✖️      | ✔️      | ✖️                          | Typeform, Google Sheets, Gmail, Google Forms, etc...                                              |
