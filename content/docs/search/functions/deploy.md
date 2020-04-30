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

## Overview

A function once created can be deployed into your search infrastructure. Deploying a function is essentially the equivalent of putting a container which contains this function and gets dedicated compute and memory resources. Appbase.io Dashboard allows you to seamlessly deploy and manage functions. Below are the steps you can follow to deploy function

![](https://www.dropbox.com/s/olwgd2t8ep1mww4/Screenshot%202020-01-31%2023.57.26.png?raw=1)

## Deployment Procedure

### Step 1: Login to Appbase.io (Arc Dashboard)

-   Appbase.io cluster users can directly access Dashboard, by logging in [here](https://dashboard.appbase.io). After logging in select your cluster and click `Explore Cluster` button.

-   Self hosted Appbase.io users can open [Arc Dashbard](https://arc-dashboard.appbase.io) and enter credentials set during [setup](https://docs.appbase.io/docs/hosting/byoc/#accessing-arc-dashboard-1).

### Step 2: Navigate to Functions

After logging into dashboard, you can Navigate to `Develop > Functions` tab from the left side menu.

![](https://www.dropbox.com/s/bznciixl09uk5yx/Screenshot%202020-01-31%2009.22.26.png?raw=1)

### Step 3: Click on **Deploy Function**

![](https://www.dropbox.com/s/p4wzzfr8e9n08z8/Screenshot%202020-01-31%2009.17.34.png?raw=1)

### Step 4: Add function details

![](https://www.dropbox.com/s/u1arrqa3nhtriv6/Screenshot%202020-01-31%2009.37.24.png?raw=1)

> **Note:** If you are using Self Hosted version of Appbase.io and want to deploy private image of function, you will have to add `OPENFAAS_KUBE_CONFIG` env with the value where your kubernetes config file exists.

Once the function is deployed we can [Set Trigger](/docs/search/functions/trigger/) for that function so that we can conditionally invoke a function.
