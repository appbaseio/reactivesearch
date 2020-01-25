---
title: 'Functions Hosting'
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

There are two ways to get started with Serverless Functions and ElasticSearch

1. [Appbase.io Clusters](https://docs.appbase.io/docs/hosting/Cluster/)

2. [Self hosted Appbase.io](https://github.com/appbaseio/arc-k8s)

### 1. Appbase.io Clusters

Supports serverless functions out of the box for [Production II, III, IV plans](https://appbase.io/clusters/#pricing). All you need to do is [Create Function](/docs/search/Functions/create), [Deploy Function](/docs/search/Functions/deploy) and [Set Triggers](/docs/search/Functions/trigger).

### 2. Self hosted Appbase.io

With [self hosted Appbase.io](https://github.com/appbaseio/arc-k8s) and [kubernetes](https://kubernetes.io/) orchestration, you can deploy [OpenFaas](https://github.com/openfaas/faas-netes/blob/master/chart/openfaas/README.md) an open source solution to create and deploy functions.

Appbase.io uses OpenFaas under the hood because:
* It lets you write function in any language
* It is open source and actively maintained
* Can be easily deploymend and maintained with kubernetes orchestration

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

That's all, we have successfully deployed and integrated OpenFaas with Appbase.io. Now lets us see how we can [Create Functions](/docs/search/Functions/create).
