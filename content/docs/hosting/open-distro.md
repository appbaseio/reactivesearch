---
title: 'Open Distro for Elasticsearch'
meta_title: 'Open Distro for Elasticsearch'
meta_description: 'Open Distro for Elasticsearch is an Apache 2.0 licensed distribution of Elasticsearch enhanced with enterprise-grade security.'
keywords:
    - odfe
    - appbase.io
    - appbase
    - Elasticsearch
sidebar: 'docs'
---

[Open Distro for Elasticsearch](https://opendistro.github.io/for-Elasticsearch/) is an [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) licensed distribution of [Elasticsearch](https://github.com/elastic/Elasticsearch) enhanced with enterprise [security](https://opendistro.github.io/for-Elasticsearch/features/security.html), [alerting](https://opendistro.github.io/for-Elasticsearch/features/alerting.html), [SQL](https://opendistro.github.io/for-Elasticsearch/features/SQL%20Support.html) way of querying Elasticsearch data and [performance analyzer](https://opendistro.github.io/for-Elasticsearch/features/analyzer.html). Now with the [appbase.io clusters](https://appbase.io/clusters/) you can host an open distro flavour of Elasticsearch.

## How to run an Open Distro based cluster?

### Getting Started

You can select **Open Distro** as an Elasticsearch flavour while creating a cluster. For detailed information on how to create a cluster, you can check the [Clusters docs](/docs/hosting/clusters/).

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://www.dropbox.com/s/o2tsuvmia8zk63k/Screenshot%202019-08-08%2019.14.38.png?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

## Default Options that are enabled

-   **Node-to-Node encryption** and **HTTP Basic authentication** is enabled using the [security](https://opendistro.github.io/for-Elasticsearch-docs/docs/security-configuration/) features of Open Distro.

-   [Audit Logging](https://opendistro.github.io/for-Elasticsearch-docs/docs/security-audit-logs/) is enabled to track access to your Elasticsearch cluster and is useful for compliance purposes.

## How to configure other Open Distro Features

Once the cluster deployment is completed, you can configure other Open Distro / Elasticsearch options by updating Elasticsearch configurations.

