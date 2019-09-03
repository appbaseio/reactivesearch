---
title: 'Clusters'
meta_title: 'Clusters'
meta_description: 'It allows you to fully manage and scale your elasticsearch clusters using kubernetes orchestration.'
keywords:
    - clusters
    - appbaseio
    - appbase
    - elasticsearch
sidebar: 'docs'
---

Now you can host your own dedicated ElasticSearch clusters to meet your business needs using [appbase.io](https://appbase.io/clusters/) clusters. It allows you to fully manage and scale your elasticsearch clusters using [kubernetes](https://kubernetes.io/) orchestration. You can Visualize with Kibana and choose from addons available in ElasticSearch ecosystem. Along ElasticSearch addons you can leverage other appbase.io features like [Realtime Search](https://appbase.io/usecases/realtime-search/), [Data browser](/concepts/databrowser.html), [Search Preview](/concepts/search-preview.html), [Analytics](/concepts/analytics.html), [Mappings](/concepts/mappings), [Security](concepts/api-credentials.html)

## Getting started

* Login to [appbase.io dashboard](https://dashboard.appbase.io/)
  <br/><br/>

   <div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden"><img src="https://www.dropbox.com/s/m8my8lq3keju99c/Screenshot%202019-08-08%2015.57.03.png?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

* Go to cluster pages and click [Create New Cluster](https://dashboard.appbase.io/clusters/new) and enter the following details:

  * Select Cluster Pricing Plans. For more details about pricing, please check `Pricing` section of [clusters page](https://appbase.io/clusters#pricing)

  * Select Provider and Region where you would like to host your cluster. Currently we offer hosting clusters on [Google Cloud Platform](https://cloud.google.com/) and [Microsoft Azure](https://azure.microsoft.com/en-in/)

  * Input the desired name for cluster

  * Select ElasticSearch version. Along with the version selection, you can also enable deployment of various addons like Kibana, Appbase.io's GUI dashboard for dev + analytics + security features built on top of ES, and ElasticSearch HQ.

  * Select the plugins to be installed that are available as part of ElasticSearch ecosystem
    <br/><br/>
    <div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden"><img src="https://www.dropbox.com/s/08cb5r4qcnj35x3/cluster_original.gif?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

> Note - You can also install any other custom plugins after the cluster is created. For more details on how to update plugins via ElasticSearch configurations you can check [here](#accessing-elasticsearch-logs-metrics-and-advanced-editing)
## Tracking Deployment Status

It takes around 5-10 minutes to initialize cluster and deploy ElasticSearch with all the selected configurations. There is a status tag next to cluster name on your cluster dashboard, which will help you know the status of deployment.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://www.dropbox.com/s/hm0lqxllzwe50kk/Screenshot%202019-08-08%2018.37.08.png?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

Once the cluster is created and ElasticSearch is deployed successfully, you will be able to **View Details** of the cluster where you might see some messages which specifies that other addon deployments are still in progress. For accessing all the features, you can wait till all the deployment in progress messages disappear. 😊

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://www.dropbox.com/s/mw5sg478mtwwg9q/Screenshot%202019-08-08%2018.44.26.png?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

## Managing A Deployed ElasticSearch Cluster

Once the cluster is deployed you can edit addons deployed addons, manage cluster data, view analytics for various indexes deployed on your cluster or manage Security via Appbase.io GUI Dashboard / Kibana. Depending you traffic you can scale up/down your cluster. For advance monitoring and managing various cluster resource we are using kubernetes orchestration. This guarantees a higher reliability for your cluster and it comes with a built-in mechanism to restart a node on failure, allows inspecting and safe editing of your underlying resources.

### Editing addons

Once the cluster is deployed you can enable / disable the addons from Cluster details page.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/Md3cXNf.png" alt="addons editing" /></div>

### Accessing Appbase.io GUI Dashboard

In order to access and manage cluster data, you can click on **Explore Cluster** from cluster details page.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/d2GCCWH.png" alt="explore" /></div>

Now using Appbase.io GUI Dashboard you can create/delete new indexes or you can explore their individual data.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/4LJxa6U.png" /></div>

> Note: For more details on how [analytics](/concepts/analytics.html) and [security](/concepts/ap-credentials.html) works please check their individual documentation.
### Scaling Cluster

At any given point you can scale the cluster by adding/removing elasticsearch nodes based on the traffic/data that you are storing in elasticsearch

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://www.dropbox.com/s/bm2ohlvwlu7ez6y/Screenshot%202019-08-08%2018.48.58.png?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

### Sharing Cluster

With the help of Sharing feature you can share cluster access with your team and can also restrict the access by specifying the `viewer` role to that team member.

 <div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/ce4q4g6.png" /></div>

### Accessing ElasticSearch Logs, Metrics and Advanced Editing

As we deploy ElasticSearch using a Kubernetes orchestration, it enables user to access Kubernetes dashboard and allows them to monitor various resource deployed on the cluster. You can open kubernetes dashboard by click on the link available in Dashboard section of your cluster details page.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/SaPI0Ne.png" /></div>

#### Benefits of using Kubernetes Dashboard

**Monitoring the resource usage**

For information on how kubernetes system works and how resources are managed you can check [kubernetes Documentation](https://kubernetes.io/docs/home/)

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://www.dropbox.com/s/g77abqqtxf7a7s7/Screenshot%202019-08-08%2018.44.43.png?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

**Accessing ElasticSearch logs**

ElasticSearch logs can be really helpful with respect to debugging. They can also help us know the deployment status of various plugins and various operations performed on the clusters.

You can follow this steps to access the logs

* Open kubernetes dashboard
* Navigate to `Workloads` > `Stateful Set`
* Select `elasticsearch` from the stateful deployments
* There you will see `Logs` option in top right menu, which can give you access to ElasticSearch Logs

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/It1aHo0.gif " alt="cluster creation gif" style="width:100%;" /></div>

**Advanced Editing**

You have no restrictions with respect to editing any part of the ElasticSearch config. For example, you can install a custom plugin, updated your ElasticSearch cluster's version, or update the config within your ElasticSearch cluster. You can also deploy your own docker image to run alongside ElasticSearch.

For example in order to allow access to limited site you can edit _[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)_ configuration for elasticsearch cluster.

* Open kubernetes dashboard
* Navigate to `Workloads` > `Stateful Set`
* Select `elasticsearch` from the stateful deployments
* There you will see `Edit` option in the top right menu, which will give you access to ElasticSearch configurations.
* In the `spec.containers[0].args` option of file, you can change value of `-Ehttp.cors.allow-origin`. Instead of `*` we can specify actual sites that are going to access data of this cluster, example `-Ehttp.cors.allow-origin https://appbase.io`

  <div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/A3IIPeL.gif" alt="cluster creation gif" style="width:100%;" /></div>

> Note: Editing Stateful sets will automatically restart pods and will apply configuration to all the elasticsearch pods in the cluster.
