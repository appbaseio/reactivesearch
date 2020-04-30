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

## Overview

Appbase.io uses [OpenFaas](https://docs.openfaas.com) under the hood to create and deploy functions. We use OpenFaas because:

-   It lets you write function in any language
-   It is open source and actively maintained
-   Can be easily deployed and maintained with kubernetes orchestration

There are two ways to get started with Functions and Appbase.io

-   [Appbase.io Clusters](https://docs.appbase.io/docs/hosting/clusters/)

-   [Self Hosted Appbase.io](https://github.com/appbaseio/arc-k8s)

## Appbase.io Clusters

Supports functions out of the box for [Production II, III, IV plans](https://appbase.io/clusters/#pricing). All you need to do is [Create Function](/docs/search/functions/create/), [Deploy Function](/docs/search/functions/deploy/) and [Set Triggers](/docs/search/functions/trigger/).

## Self Hosted Appbase.io

With [Self Hosted Appbase.io](https://github.com/appbaseio/arc-k8s) and [kubernetes](https://kubernetes.io/) orchestration, you can deploy functions in the same infrastructure as of your ElasticSearch. There are multiple ways to [deploy OpenFaas](https://docs.openfaas.com/deployment/kubernetes/) with kubernetes. The recommended way is using [helm charts](https://helm.sh/docs/topics/charts/).

### Prerequisite

-   [Kubenertes](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

-   [Helm chart](https://github.com/helm/charts)

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
    --set basic_auth=false

If you are using Load Balancer to expose OpenFaas Gateway, then you can add `--set serviceType=LoadBalancer` switch in the above command. Similarly if you have enabled basic auth then you need to add `--set basic_auth=true` switch.

#### 5. Configure Appbase

If you are using Appbase.io with kubernetes and not using LoadBalancer for OpenFaas, then add following variable to [Appbase Environment Variable](https://github.com/appbaseio/arc-k8s).

    OPENFAAS_GATEWAY="http://gateway.openfaas:8080"

If you are exposing your OpenFaas service via LoadBalancer with Basic Authentication, then add following variable to [Appbase Environment Variable](https://github.com/appbaseio/arc-k8s)

    OPENFAAS_GATEWAY="http://username:password@IP_ADDRESS:8080"

> **Note:** If you are using Self Hosted version of Appbase.io and want to deploy private image of function, you will have to add `OPENFAAS_KUBE_CONFIG` env with the value where your kubernetes config file exists.

<iframe title="Hosting demo" style="width:100%" height="315" src="https://www.youtube.com/embed/YR0jSSgfxwI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

That's all, we have successfully deployed and integrated OpenFaas with Appbase.io. Now lets us see how we can [Create Functions](/docs/search/functions/create/).
