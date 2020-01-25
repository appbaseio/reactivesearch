---
title: 'Deploy Function'
meta_title: 'Appbase Functions'
meta_description: 'How to use functions with ElasticSearch.'
keywords:
    - concepts
    - appbase
    - elasticsearch
    - serverless
    - functions
sidebar: 'docs'
---

Once OpenFaas is deployed and you have created function, you can use Appbase.io to seamlessly deploy and manage functions. Below are the steps you can follow to deploy function

### Step 1: Login to Appbase.io (Arc Dashboard)

-   Appbase.io cluster users can directly access Dashboard, by logging in [here](https://dashboard.appbase.io). After logging in select your cluster and click `Explore Cluster` button.

-   Self hosted Appbase.io users can open [Arc Dashbard](https://arc-dashboard.appbase.io) and enter credentials set during [setup](https://docs.appbase.io/docs/hosting/BYOC/#accessing-arc-dashboard-1).

### Step 2: Navigate to Functions

After logging into dashboard, you can Navigate to `Develop > Functions` tab from the left side menu.

![](https://www.dropbox.com/s/g9z5srd1ycmaygp/Screenshot%202020-01-16%2008.39.25.png?raw=1)

### Step 3: Click on **Deploy Function**

![](https://www.dropbox.com/s/b6gh3rg0ftvw7t8/Screenshot%202020-01-16%2008.39.25%20copy.png?raw=1)

### Step 4: Add function details

![](https://www.dropbox.com/s/2o9j4hvjwmutchp/Screenshot%202020-01-16%2009.06.29.png?raw=1)

> **Note:** If you are using Self Hosted version of Appbase.io and want to deploy private image of function, you will have to add `OPENFAAS_KUBE_CONFIG` env with the value where your kubernetes config file exists.

Once the function is deployed we can [Set Trigger](/docs/search/Functions/trigger) for that function so that we can conditionally invoke a function.
