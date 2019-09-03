---
title: 'Open Distro for ElasticSearch'
meta_title: 'Open Distro for ElasticSearch'
meta_description: 'Open Distro for ElasticSearch is an Apache 2.0 licensed distribution of  ElasticSearch enhanced with enterprise [security]'
keywords:
    - odfe
    - appbaseio
    - appbase
    - elasticsearch
sidebar: 'docs'
---

[Open Distro for ElasticSearch](https://opendistro.github.io/for-elasticsearch/) is an [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) licensed distribution of [ElasticSearch](https://www.elastic.co/) enhanced with enterprise [security](https://opendistro.github.io/for-elasticsearch/features/security.html), [alerting](https://opendistro.github.io/for-elasticsearch/features/alerting.html), [SQL](https://opendistro.github.io/for-elasticsearch/features/SQL%20Support.html) way of querying elasticsearch data and [performance analyzer](https://opendistro.github.io/for-elasticsearch/features/analyzer.html). Now with the [appbase.io clusters](https://appbase.io/clusters/) you can host an open distro flavour of elasticsearch.

## How to run an Open Distro based cluster?

### Getting Started

You can select **Open Distro** as ElasticSearch flavor while creating a cluster. For detailed information on how to create a cluster, you can check [Clusters docs](/concepts/clusters.html).

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://www.dropbox.com/s/o2tsuvmia8zk63k/Screenshot%202019-08-08%2019.14.38.png?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

## Default Options that are enabled

* **Node-to-Node encryption** and **HTTP Basic authentication** is enabled using [security](https://opendistro.github.io/for-elasticsearch-docs/docs/security-configuration/) features of Open Distro.

> NOTE: Currently we are using self-signed certificate for node-node encryption.
* [Audit Logging](https://opendistro.github.io/for-elasticsearch-docs/docs/security-audit-logs/) is enabled to track access to your elasticsearch cluster and are useful for compliance purpose / aftermath of security breach.

## How to configure other Open Distro Features

Once the deployment is completed, you can configure other Open Distro / ElasticSearch options by updating ElasticSearch configurations and `exec` into cluster via [kubernetes Dashboard](/concepts/clusters.html#accessing-kubernetes-dashboard)

### How to update elasticsearch configurations / security options?

For Open Distro clusters elasticsearch configurations are done via [Config Map](https://cloud.google.com/kubernetes-engine/docs/concepts/configmap). To access `elasticsearch` configurations, [kubernetes Dashboard](/concepts/clusters.html#accessing-kubernetes-dashboard) and route to config maps

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/H5jmYxw.png" alt="cluster creation gif" style="width:100%;" /></div>

And now you can open `elasticsearch-config` ConfigMap available there.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/Q4RiVHM.png" alt="cluster creation gif" style="width:100%;" /></div>

Now you can edit/add elasticseach configurations or options available via open distro. For more security configurations of open distro you can check their [documentation](https://opendistro.github.io/for-elasticsearch-docs/docs/security-configuration/).

Once the configurations are updated successfully, you will manually have to restart elasticsearch [pods](https://kubernetes.io/docs/concepts/workloads/pods/pod/) from [kubernetes dashboard](/concepts/clusters.html#accessing-kubernetes-dashboard). All the elasticsearch pods has prefix `elasticsearch-` followed by node number, eg `elasticsearch-0`, `elasticsearch-1`. In order to restart a pod, you can manually delete them which will automatically trigger a restart.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/rSkRn9T.png" alt="cluster creation gif" style="width:100%;" /></div>
