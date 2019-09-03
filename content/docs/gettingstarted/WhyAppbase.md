---
title: 'Why Appbase Cluster'
meta_title: 'Why Appbase Cluster'
meta_description: 'Appbase.io clusters uses kubernetes orchestration.'
keywords:
	- why-appbase-cluster
    - appbaseio
    - appbase
    - elasticsearch
sidebar: 'docs'
---


## Reliability

Appbase.io clusters uses [kubernetes orchestration](/concepts/clusters.html#managing-deployed-cluster). This guarantees a higher reliability for your cluster and it comes with a built-in mechanism to restart a node on failure, allows inspecting and safe editing of your underlying resources.

## Appbase.io's GUI for dev + analytics + security

Appbaseio.io's GUI Addon allows you to manage data across cluster and comes with simpler user interface using which you can also manage indexes of your cluster. You can also view analytics about what all data is searched using Analytics feature of this Dashboard.

Along with data management, this dashboard focus on security of your data and how people can access your data using api keys + limits that you would like to set for data accessibility.

## Built-in ability to scale up or down

Based on the traffic and data storage requirements, you can scale up/down cluster at any point of time. This will help you deploy and replicate data on various elasticsearch nodes.

## Priced by hour and pay only what you use

You can select Provider of your choice for cluster deployment (currently we offer hosting clusters on [Google Cloud Platform](https://cloud.google.com/) and [Microsoft Azure](https://azure.microsoft.com/en-in/)). With this now you don't have to over pay for resources. Based on the plan and your cluster usage only pay for the hours that you have used for.

You can get more details about Appbase.io Cluster pricing [here](https://appbase.io/clusters#pricing).

## Available across the globe

Appbase.io Clusters comes with option to deploy your cluster nodes in multiple zones and thus making it more accessible to place where you are expecting your customer base. Whether you are in EU (Europe), APAC (Asia Pacific), or need a cluster in West US (United States), we've got you covered.

## Monitoring and Logs Access

Since appbase.io clusters are deployed and managed using Kubernetes orchestration, you can easily view the usage of various resources like memory, storage, etc and scale accordingly. For more information you can read docs on [clusters](/concepts/clusters.html#managing-a-deployed-elasticsearch-cluster).

## Managing Elasticsearch

With kubernetes deployment you get full access to the ElasticSearch API, so you can perform any core elasticsearch operations on the clusters. Other ElasticSearch providers like AWS might not give you complete access to core ElasticSearch API.

Along with the full access to API, now you also have full access to elasticsearch configurations and plugins that are installed, you can always add more plugins of your choice by updating the configurations via Stateful Set Configurations on Kubernetes. This also enables your to update elasticsearch version, by just changing the docker image that is deployed.

## Ability to choose your ElasticSearch

With all the freedom, now you can deploy ElasticSearch flavour of your own choice. You can either install the Open Source distribution of [Elasticsearch](https://www.elastic.co/) or use [`Open Distro for Elasticsearch](https://opendistro.github.io/for-elasticsearch/) which comes with more security enhancements.
