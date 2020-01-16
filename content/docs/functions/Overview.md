---
title: 'Serverless Functions'
meta_title: 'Appbase Serverless Functions'
meta_description: 'How to use serverless functions with ElasticSearch.'
keywords:
    - concepts
    - appbase
    - elasticsearch
    - serverless
    - functions
sidebar: 'docs'
---

Appbase.io now supports [Serverless Functions](https://en.wikipedia.org/wiki/Serverless_computing) which provides the ability to extend the ElasticSearch functionality. Under the hood it is using [Open Faas](https://www.openfaas.com/), an open source solution to create and deploy functions using kubernetes orchestration. With help of this feature, now you can perform various operations before / after the search query is executed.

**Here are some use cases where serverless functions can be useful:**

-   Create a function based query rule that allows to modify the query:
    -   Parse intent from a Natural language query and structure it differently.
    -   Apply a default filter.
    -   Apply security rules to search only on certain fields/indexes.
    -   Apply size restrictions.
-   Build a customized security logic:
    -   Add custom JWT authorization for each requests
    -   Add role based access to the data
-   Create a response transformer that allows to:
    -   Modify the shape of the response
    -   Modify the contents of the response
    -   Modify the score of the response, e.g. using an overlay based on Machine Learning algorithms.

## Quick Start

There are two ways to get started with Serverless Functions and ElasticSearch

1. [Appbase.io Clusters](https://docs.appbase.io/docs/hosting/Cluster/)

2. [Self hosted Appbase.io](https://github.com/appbaseio/arc-k8s)

### 1. Appbase.io Clusters

Supports serverless functions out of the box for [Production II, III, IV plans](https://appbase.io/clusters/#pricing). All you need to do is [Create Function](/docs/functions/CreateFunction/), [Deploy Function](/docs/functions/DeployFunction) and [Set Triggers](/docs/functions/DeployFunction/#step-5-set-trigger).

![](https://www.dropbox.com/s/vr5sveo9a2vzxrx/Screenshot%202020-01-16%2009.44.45.png?raw=1)

### 2. Self hosted Appbase.io

With [self hosted Appbase.io](https://github.com/appbaseio/arc-k8s) and [kubernetes](https://kubernetes.io/) orchestration, you can deploy [OpenFaas](https://github.com/openfaas/faas-netes/blob/master/chart/openfaas/README.md) and get access to functions dashboard on Appbase.io Dashboard.

### Installation

There are multiple ways to [deploy OpenFaas](https://docs.openfaas.com/deployment/kubernetes/) with kubernetes. The recommended way is using [helm charts](https://helm.sh/docs/topics/charts/) >= v3.

**Prerequisite**

-   [Kubenertes](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

    **For linux users:**

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl

    chmod +x ./kubectl

    sudo mv ./kubectl /usr/local/bin/kubectl
    ```

    **For mac users:**

    ```
    brew install kubectl
    ```

-   [Helm chart](https://github.com/helm/charts)

    **For linux users:**

    ```
    curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get | bash
    ```

    **For mac users:**

    ```
    brew install kubernetes-helm
    ```

### Installation steps

#### 1. Add OpenFaas namespaces

    kubectl apply -f https://raw.githubusercontent.com/openfaas/faas-netes/master/namespaces.yml

#### 2. Add OpenFaas repo

    helm repo add openfaas https://openfaas.github.io/faas-netes/

#### 3. [Optional] Generate secrets so that we can enable basic authentication for the Gateway

This step is only required if you are exposing OpenFaas gateway via Load Balancer.

    PASSWORD=admin

    kubectl -n openfaas create secret generic basic-auth \
    --from-literal=basic-auth-user=admin \
    --from-literal=basic-auth-password="\$PASSWORD"

#### 4. Deploy OpenFaas

    helm repo update \
    && helm upgrade openfaas --install openfaas/openfaas \
    --namespace openfaas \
    --set functionNamespace=openfaas-fn \

If you are using Load Balancer to expose OpenFaas Gateway, then you can add `--set serviceType=LoadBalancer` switch in the above command. Similarly if you have enabled basic auth then you need to add `--set basic_auth=true` switch.

#### 5. Configure Appbase

If you are using Appbase.io with kubernetes and not using LoadBalancer for OpenFaas, then add following variable to [Appbase Environment Variable](https://github.com/appbaseio/arc-k8s).

    OPENFAAS_GATEWAY="http://gateway.openfaas:8080"

If you are exposing your OpenFaas service via LoadBalancer with Basic Authentication, then add following variable to [Appbase Environment Variable](https://github.com/appbaseio/arc-k8s)

    OPENFAAS_GATEWAY="http://username:password@IP_ADDRESS:8080"

> Note: Please check strep 8 [here](https://github.com/appbaseio/arc-k8s) on how to configure Arc Env

That's all, we have successfully deployed and integrated OpenFaas with Appbase.io. Now lets us see how we can [Create Functions](/docs/functions/CreateFunction).
