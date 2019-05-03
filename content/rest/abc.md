---
title: 'ABC CLI'
meta_title: 'ABC cli appbase'
meta_description: 'ABC is the commandline interface for working with appbase.io.'
keywords:
    - abc
    - cli
    - appbase
    - elasticsearch
sidebar: 'api-reference'
---

ABC is the commandline interface for working with appbase.io.

![](https://i.imgur.com/vBByTd0.png)

### [Download from github](https://github.com/appbaseio/abc/releases/tag/0.4.1) or [get the Docker Image](https://hub.docker.com/r/appbaseio/abc/).

## How It Works

ABC allows creating apps, accessing credentials, viewing usage metrics and importing data from sources like JSON, CSV, MongoDB, SQL into appbase.io. Here is a sneak peek of how it works:

```bash
$ abc
USAGE
  abc <command> [flags]

COMMANDS
  login     login into appbase.io
  user      get user details
  apps      display user apps
  app       display app details
  create    create app
  delete    delete app
  logout    logout session
  import    import data to appbase app
  version   show build details
Run 'abc COMMAND --help' for more information on a command.
```

You can `login` right from the convenience of the CLI. Once you are logged in, you can check the `user` info as follows:

```bash
$ abc user
NAME:  Siddharth Kothari
EMAIL: siddharth@appbase.io
APPS:
+------+--------------------------+
|  ID  |           NAME           |
+------+--------------------------+
| 7184 | newsave                  |
| 6986 | example-app01            |
...
+------+--------------------------+
```

Now, let’s try to view the usage `metrics` of the **example-app01** app. (You can also use the app id instead of the app name in the following command.)

```bash
$ abc app example-app01 --metrics
ID:         6986
Name:       example-app01
Owner:      siddharth@appbase.io
Users:      siddharth@appbase.io
ES Version: 2.4
Created on: Fri Jul 21 16:05:29 2017

Storage(KB): 3
Records:     1
+-------------+-----------+
|    DATE     | API CALLS |
+-------------+-----------+
| 2017-Jul-21 |     5     |
+-------------+-----------+
|    TOTAL    |     5     |
+-------------+-----------+
```

The `app` command also has a flag `--creds` for viewing the app’s credentials and a flag `--data-view` to open the app’s data in the data browser.

Finally, let’s create a new app, we will call it `abc-demo`.

```bash
$ abc create abc-demo
(master)
ID:    8499
Name:  abc-demo
Admin API key: 67yS0tlsG:b25979f0-15c4-4c37-ab60-a3e22dcc40a0
Read-only API key: UlSDP7x3r:fc123d3e-1d17-4c66-bffa-d04cbad581a0
```

Deleting is pretty nifty too with `delete`, BE CAREFUL as it doesn’t require a confirmation before deleting an app.

```bash
$ abc delete abc-demo
App Deleted
```

### Importing Data

Last but not least, the `import` command allows importing data from sources like Postgres, MongoDB, MySQL, SQL Server, JSON and CSV into your appbase.io app.

Here is an example import command showing data from MySQL being imported to an appbased.io app.

```bash
abc import --src_type=mysql --src_uri="USER:PASS@tcp(HOST:PORT)/DBNAME" "https://USER:PASS@scalr.api.appbase.io/APPNAME"
```

`import` uses the `--src_type` and `--src_uri` switches to set the source database. It takes a required destination URL for the appbase.io app (or Elasticsearch index) into which the data is being imported to. You can follow this step-by-step guide for [importing data from MySQL](https://medium.appbase.io/cli-for-indexing-data-from-mysql-to-elasticsearch-b59289e5025d).

Since the `import` command can do so many things, we have a dedicated post explaining [how it works](https://medium.appbase.io/abc-import-import-your-mongodb-sql-json-csv-data-into-elasticsearch-a202cafafc0d).

Other specific guides:

1. [Importing your MongoDB data](https://medium.appbase.io/cli-for-indexing-data-from-mongodb-to-elasticsearch-ee5a74695945)
2. [Importing your Postgres data](https://medium.appbase.io/cli-for-indexing-data-from-postgres-to-elasticsearch-6eebc5cc0f0f)
3. [Importing data from MS SQL](https://medium.appbase.io/cli-for-indexing-data-from-mssql-to-elasticsearch-341963a054dd)
4. [Importing data from one Elasticsearch to another](https://medium.appbase.io/cli-for-indexing-data-from-elasticsearch-to-elasticsearch-301c7a243c84)
5. [Importing JSON files](https://medium.appbase.io/cli-for-indexing-data-from-json-to-elasticsearch-92f582c53df4)
6. [Importing CSV files](https://medium.appbase.io/cli-for-indexing-data-from-csv-to-elasticsearch-17d290a5974f)
