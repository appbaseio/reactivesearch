---
title: 'Clusters'
meta_title: 'Clusters'
meta_description: 'Appbase.io clusters provide a hosted app search experience.'
keywords:
    - clusters
    - appbaseio
    - appbase
    - Elasticsearch
sidebar: 'docs'
---

[Appbase.io](https://www.appbase.io/pricing)'s cloud service provides a fully hosted Elasticsearch + appbase.io experience in over 16+ global regions. It's the easiest way to get started with appbase.io. The cloud service comes with the following benefits over a [bring your cluster](/docs/hosting/byoc/) option:

  - **A zero config app search experience**: With the cloud service, appbase.io deploys both Elasticsearch and appbase.io services in a performance-optimized fashion,
  - **16+ available regions**: Deploy your cluster in one of 16+ global regions on GCP or AWS,
  - **99.9% SLA**: Get 99.9% SLAs on all of our production plans,
  - **Monitoring**: See detailed insights into cluster health and resource usage.


## Getting started

Following are the steps that you can follow, to create a new cluster:

-   Login to [appbase.io dashboard](https://dashboard.appbase.io/)
    <br/>

     <div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden"><img src="https://www.dropbox.com/s/m8my8lq3keju99c/Screenshot%202019-08-08%2015.57.03.png?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

-   Go to [cluster pages](https://dashboard.appbase.io/clusters) and click [Create New Cluster](https://dashboard.appbase.io/clusters/new). Enter the following details for cluster creation:

    -   Select a plan. You can check out the pricing plan details over [here](https://appbase.io/pricing).

    -   Input the desired name for cluster.

    -   Select Elasticsearch flavour, i.e. [Open Source Elasticsearch Distribution](https://github.com/elastic/elasticsearch) or [Open Distro for Elasticsearch](https://opendistro.github.io/for-elasticsearch/).

    -   Select addons to be deployed. Example Kibana/Grafana, Appbase.io's GUI dashboard, Elasticsearch HQ for browsing data + analytics + security features.


## Tracking Deployment Status

Once the cluster creation starts, it takes around 5-10 minutes for a cluster to be up and running. There is a status tag next to cluster name on your cluster dashboard, which will help you know the status of deployment.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://www.dropbox.com/s/hm0lqxllzwe50kk/Screenshot%202019-08-08%2018.37.08.png?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

Once the cluster is created and Elasticsearch is deployed successfully, you will be able to **View Details** of the cluster.

There you might come across messages which specifies that other addon deployments are still in progress. For accessing all the features, you can wait till all the _deployment in progress_ messages disappear.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://www.dropbox.com/s/mw5sg478mtwwg9q/Screenshot%202019-08-08%2018.44.26.png?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

## Managing A Deployed Elasticsearch Cluster

Once the cluster is deployed, you can maintain cluster by

-   Manage deployment details
-   Access the dashboard UI where you can:
    - Import data
    - Set and test search relevancy
    - See actionable analytics
    - Set and manage access control settings
-   Scale cluster
-   Share cluster
-   Monitor resource usage with the Cluster Monitoring view

### Managing add-ons

Once the cluster is deployed you can enable / disable the addons from Cluster details page.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/Md3cXNf.png" alt="addons editing" /></div>

### Accessing Appbase.io GUI Dashboard

In order to access and manage cluster data, you can click on **Explore Cluster** from cluster details page.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/d2GCCWH.png" alt="explore" /></div>

Using this Dashboard you can create/delete indexes or you can explore and manage their individual data. Appbase.io GUI Dashboard also allows you to manage [API credentials](/docs/security/credentials/) and [Role Based Access](/docs/security/role/), hence adding more layers of security to your application.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/4LJxa6U.png" /></div>

> Note: For more details on how [analytics](/docs/analytics/overview/) and [security](/docs/security/credentials/) works please check their individual documentation.

### Scaling Cluster

At any given point you can scale the cluster by adding/removing Elasticsearch nodes.

<div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://www.dropbox.com/s/bm2ohlvwlu7ez6y/Screenshot%202019-08-08%2018.48.58.png?raw=1" alt="cluster creation gif" style="width:100%;" /></div>

### Sharing Cluster

With the help of Sharing feature you can share cluster access with your team and can also restrict the access by specifying the `viewer` role to that team member.

 <div style="border: 1px solid #dfdfdf; border-radius: 5px;overflow:hidden;margin-top:10px;"><img src="https://i.imgur.com/ce4q4g6.png" /></div>

A more fine-grained access control mechanism is available as part of the [User Management view](/docs/security/user-management/) under the Explore Cluster GUI.

### Monitor Cluster

![Cluster Monitoring view](https://i.imgur.com/XfuoG02.png)

With our new cluster monitoring view, you can now see detailed insights into cluster health and resource usage including the ability to specify time intervals to zoom in and drill down further into node level stats.


