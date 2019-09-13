---
title: 'Clusters'
meta_title: 'Clusters'
meta_description: 'It allows you to fully manage and scale your ElasticSearch clusters using kubernetes orchestration.'
keywords:
    - clusters
    - appbaseio
    - appbase
    - ElasticSearch
sidebar: 'docs'
---

Now you can host dedicated ElasticSearch clusters to meet your business needs using [Appbase.io](https://appbase.io/clusters/) clusters. It allows you to fully manage and scale your ElasticSearch clusters using [kubernetes](https://kubernetes.io/) orchestration. You can Visualize with Kibana and choose from addons available in ElasticSearch ecosystem. Along ElasticSearch addons you can leverage other Appbase.io features like [Realtime Search](https://appbase.io/usecases/realtime-search/), [Data browser](/docs/data/Browser), [Search Preview](/docs/search/Preview), [Analytics](/docs/analytics/Overview/), [Mappings](/docs/search/Mappings), [Security](/docs/security/Credentials).

## Getting started

Following are the steps that you can follow, to create a new cluster:

-   Login to [appbase.io dashboard](https://dashboard.appbase.io/)
    <br/>

     <div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden"><img src="https://www.dropbox.com/s/m8my8lq3keju99c/Screenshot%202019-08-08%2015.57.03.png?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

-   Go to [cluster pages](https://dashboard.appbase.io/clusters) and click [Create New Cluster](https://dashboard.appbase.io/clusters/new). Enter the following details for cluster creation:

    -   Select Cluster Pricing Plans. You can get more details about Pricing Plans [here](https://appbase.io/clusters#pricing).

    -   Input the desired name for cluster.

    -   Select ElasticSearch flavour, i.e. [Open Source ElasticSearch Distribution](https://github.com/elastic/elasticsearch) or [Open Distro for ElasticSearch](https://opendistro.github.io/for-elasticsearch/).

    -   Select addons to be deployed. Example Kibana/Grafana, Appbase.io's GUI dashboard, ElasticSearch HQ for browsing data + analytics + security features.

    -   Select the plugins to be installed that are available as part of ElasticSearch ecosystem
        <br/>
        <div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden"><img src="https://www.dropbox.com/s/08cb5r4qcnj35x3/cluster_original.gif?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

> Note - You can also install any other custom plugins after the cluster is created. For more details on how to update plugins via ElasticSearch configurations you can check [here](#accessing-elasticsearch-logs-metrics-and-advanced-editing)

## Tracking Deployment Status

Once the cluster creation starts, it takes around 5-10 minutes for a cluster to be up and running. There is a status tag next to cluster name on your cluster dashboard, which will help you know the status of deployment.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://www.dropbox.com/s/hm0lqxllzwe50kk/Screenshot%202019-08-08%2018.37.08.png?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

Once the cluster is created and ElasticSearch is deployed successfully, you will be able to **View Details** of the cluster.

There you might come across messages which specifies that other addon deployments are still in progress. For accessing all the features, you can wait till all the _deployment in progress_ messages disappear.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://www.dropbox.com/s/mw5sg478mtwwg9q/Screenshot%202019-08-08%2018.44.26.png?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

## Managing A Deployed ElasticSearch Cluster

Once the cluster is deployed, you can maintain cluster by

-   Managing addons
-   Scaling cluster based on traffic
-   Managing security via Appbase.io GUI Dashboard
-   Viewing analytics for various indexes
-   Browsing data
-   Monitoring resources used by cluster via Kubernetes Dashboard.

### Managing addons

Once the cluster is deployed you can enable / disable the addons from Cluster details page.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/Md3cXNf.png" alt="addons editing" /></div>

### Accessing Appbase.io GUI Dashboard

In order to access and manage cluster data, you can click on **Explore Cluster** from cluster details page.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/d2GCCWH.png" alt="explore" /></div>

Using this Dashboard you can create/delete indexes or you can explore and manage their individual data. Appbase.io GUI Dashboard also allows you to manage [API credentials](/docs/security/Credentials) and [Role Based Access](/docs/security/Role), hence adding more layers of security to your application.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/4LJxa6U.png" /></div>

> Note: For more details on how [analytics](/docs/analytics/Overview) and [security](/docs/security/Credentials) works please check their individual documentation.

### Scaling Cluster

At any given point you can scale the cluster by adding/removing ElasticSearch nodes.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://www.dropbox.com/s/bm2ohlvwlu7ez6y/Screenshot%202019-08-08%2018.48.58.png?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

### Sharing Cluster

With the help of Sharing feature you can share cluster access with your team and can also restrict the access by specifying the `viewer` role to that team member.

 <div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/ce4q4g6.png" /></div>

### Accessing ElasticSearch Logs, Metrics and Advanced Editing

As we deploy ElasticSearch using a Kubernetes orchestration, it allows user to access Kubernetes dashboard and monitor various resource deployed on the cluster.

You can open kubernetes dashboard by click on the link available in Dashboard section of your cluster details page.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/SaPI0Ne.png" /></div>

#### Benefits of using Kubernetes

Kubernetes orchestration guarantees a higher reliability for your cluster and it comes with a built-in mechanism to restart a node on failure, allows inspecting and safe editing of your underlying resources.

**Monitoring the resource usage**

For information on how kubernetes system works and how resources are managed you can check [kubernetes Documentation](https://kubernetes.io/docs/home/)

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://www.dropbox.com/s/g77abqqtxf7a7s7/Screenshot%202019-08-08%2018.44.43.png?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

**Accessing ElasticSearch logs**

ElasticSearch logs can be really helpful from debugging point of view. They can also help us know the deployment status of various plugins and various operations performed on the clusters.

You can follow this steps to access the logs

-   Open kubernetes dashboard
-   Navigate to **Workloads** > **Stateful Set**
-   Select **elasticsearch** from the Stateful Sets
-   Open ElasticSearch Logs by clicking on **Logs** option in top right menu

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/It1aHo0.gif " alt="cluster creation gif" style="width:100%;" /></div>

**Advanced Editing**

You have no restrictions with respect to editing any part of the ElasticSearch configuration. For example, you can install a custom plugin or updated your ElasticSearch cluster's version. You can also deploy your own docker image to run alongside ElasticSearch.

For example in order to limit access of cluster on limited sites you can edit _[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)_ configuration for ElasticSearch cluster.

-   Open kubernetes dashboard
-   Navigate to **Workloads** > **Stateful Sets**
-   Select **elasticsearch** from the Stateful Sets
-   Open the Stateful Set configuration by clicking **Edit** option in the top right menu
-   In the `spec.containers[0].args` option of file, you can change value of `-Ehttp.cors.allow-origin`. Instead of `*` we can specify actual sites that are going to access data of this cluster, example `-Ehttp.cors.allow-origin https://appbase.io`

    <div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/A3IIPeL.gif" alt="cluster creation gif" style="width:100%;" /></div>

> Note: Editing Stateful Sets will automatically restart pods and will apply configuration to all the ElasticSearch pods in the cluster.
