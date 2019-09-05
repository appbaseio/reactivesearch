---
title: 'Open Distro for ElasticSearch'
meta_title: 'Open Distro for ElasticSearch'
meta_description: 'Open Distro for ElasticSearch is an Apache 2.0 licensed distribution of ElasticSearch enhanced with enterprise-grade security.'
keywords:
    - odfe
    - appbase.io
    - appbase
    - elasticsearch
sidebar: 'docs'
---

[Open Distro for ElasticSearch](https://opendistro.github.io/for-elasticsearch/) is an [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) licensed distribution of [ElasticSearch](https://github.com/elastic/elasticsearch) enhanced with enterprise [security](https://opendistro.github.io/for-elasticsearch/features/security.html), [alerting](https://opendistro.github.io/for-elasticsearch/features/alerting.html), [SQL](https://opendistro.github.io/for-elasticsearch/features/SQL%20Support.html) way of querying elasticsearch data and [performance analyzer](https://opendistro.github.io/for-elasticsearch/features/analyzer.html). Now with the [appbase.io clusters](https://appbase.io/clusters/) you can host an open distro flavour of elasticsearch.

## How to run an Open Distro based cluster?

### Getting Started

You can select **Open Distro** as an ElasticSearch distro option while creating a cluster. For detailed information on how to create a cluster, you can check the [Clusters docs](/docs/gettingstarted/Cluster).

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://www.dropbox.com/s/o2tsuvmia8zk63k/Screenshot%202019-08-08%2019.14.38.png?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

## Default Options that are enabled

* **Node-to-Node encryption** and **HTTP Basic authentication** is enabled using the [security](https://opendistro.github.io/for-elasticsearch-docs/docs/security-configuration/) features of Open Distro.

> NOTE: Currently, appbase.io uses a self-signed certificate for node-to-node encryption.
* [Audit Logging](https://opendistro.github.io/for-elasticsearch-docs/docs/security-audit-logs/) is enabled to track access to your ElasticSearch cluster and is useful for compliance purposes.

## How to configure other Open Distro Features

Once the deployment is completed, you can configure other Open Distro / ElasticSearch options by updating ElasticSearch configurations and doing an `exec` into cluster via the [Kubernetes Dashboard](/docs/gettingstarted/Cluster/#accessing-elasticsearch-logs-metrics-and-advanced-editing).

### How to update elasticsearch configurations / security options?

For Open Distro clusters, the ElasticSearch configuration (think elasticsearch.yml) is implemented via [Config Maps](https://cloud.google.com/kubernetes-engine/docs/concepts/configmap). To access the ElasticSearch configuration, go to the [kubernetes Dashboard](/docs/gettingstarted/Cluster/#accessing-elasticsearch-logs-metrics-and-advanced-editing) and open the Config Maps section.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/H5jmYxw.png" alt="cluster creation gif" style="width:100%;" /></div>

You can then open the `elasticsearch-config` Config Map available here.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/Q4RiVHM.png" alt="cluster creation gif" style="width:100%;" /></div>

Tou can add or edit any ElasticSearch configurations or options available via open distro. For more security configurations specific to Open Distro, you can check their [docs here](https://opendistro.github.io/for-elasticsearch-docs/docs/security-configuration/).

Once the configuration is updated successfully, you will have to manually restart the ElasticSearch [pods](https://kubernetes.io/docs/concepts/workloads/pods/pod/) from [Kubernetes Dashboard](/concepts/clusters.html#accessing-kubernetes-dashboard). All the ElasticSearch pods have a `elasticsearch-` prefix followed by the node number, e.g. `elasticsearch-0`, `elasticsearch-1`. You can delete these pods in sequence (i.e. delete a pod, wait for it to be spinned up with the new configuration, then delete the next one and so on..) which will trigger a restart.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/rSkRn9T.png" alt="cluster creation gif" style="width:100%;" /></div>

`Note`: This will not cause any data loss. And doing the pod restarts in sequence will also ensure that your users don't see any issues with accessing the search service.
