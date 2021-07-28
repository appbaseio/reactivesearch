---
title: 'Bring Your Own Cluster'
meta_title: 'Bring Your Own Elasticsearch Cluster'
meta_description: 'Run appbase.io with an upstream Elasticsearch cluster'
keywords:
    - clusters
    - appbaseio
    - appbase
    - Elasticsearch
    - Opensearch
sidebar: 'docs'
---

Already have Elasticsearch hosted with AWS, Elastic Cloud or planning to hosting it yourself?
You can now access all of Appbase.io features such as [search preview](/docs/search/relevancy/#test-search-relevancy), [actionable analytics](/docs/analytics/overview/) and [granular security](/docs/security/credentials/) with an Elasticsearch cluster hosted anywhere with the `Bring Your Own Cluster` deployment mode.

![](https://i.imgur.com/QjBkE7R.png)

This diagram highlights how Appbase.io works. It directly interacts with an underlying Elasticsearch cluster and acts as an API gateway for clients to interact with. Appbase.io supercharges your Elasticsearch cluster with a streamlined development experience, out of the box search analytics and fine-grained security features.

## Quickstart Recipes

You can install [Appbase.io](https://dash.appbase.io) on any server environment. We have created quickstart recipes to make the installation process seamless for the following platforms:

<div class="grid-integrations-index mt4 mt6-l f8">
	<a class="bg-white shadow-2 box-shadow-hover shadow-2-hover  br4 db flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc" style="box-shadow: 0 0 5px rgba(0,0,0,.02), 0 5px 22px -8px rgba(0,0,0,.1);    word-break: normal;cursor: pointer; padding: 2rem; height: 120px;width:120px;" href="#using-appbaseio">
		<img class="w10 mb1" src="/images/arc.svg" />
		appbase.io cloud
	</a>
		<a class="bg-white shadow-2 box-shadow-hover shadow-2-hover  br4 db flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc" style="box-shadow: 0 0 5px rgba(0,0,0,.02), 0 5px 22px -8px rgba(0,0,0,.1);    word-break: normal;cursor: pointer; padding: 2rem;height: 120px;width:120px;" href="#using-ami">
		<img class="w10 mb1" src="/images/awscart.jpg" />
		AWS Marketplace
	</a>
	<a class="bg-white shadow-2 box-shadow-hover shadow-2-hover  br4 db flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc" style="box-shadow: 0 0 5px rgba(0,0,0,.02), 0 5px 22px -8px rgba(0,0,0,.1);    word-break: normal;cursor: pointer; padding: 2rem; height: 120px;width:120px;" href="#using-docker">
		<img class="w10 mb1" src="/images/docker.png" />
		Docker
	</a>
	<a class="bg-white shadow-2 box-shadow-hover shadow-2-hover  br4 db flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc" style="box-shadow: 0 0 5px rgba(0,0,0,.02), 0 5px 22px -8px rgba(0,0,0,.1);    word-break: normal;cursor: pointer; padding: 2rem; height: 120px;width:120px;" href="#using-kubernetes">
		<img class="w10 mb1" src="/images/helm.png" />
		Kubernetes
	</a>
</div>

### Using Appbase.io

Appbase.io dashboard offers the most seamless experience for running Appbase.io with your own Elasticsearch cluster.

**Step 1 -** Go to the **[Create Cluster Link](https://dashboard.appbase.io/clusters/new/my-cluster)**. You will be redirected to sign up or login if you aren't already logged in.

![](https://i.imgur.com/X6dTO8f.png)

You should see the above screen.

**Step 2 -** Select the pricing plan. Read more about pricing plans over [here](https://www.appbase.io/pricing/self-host).

**Step 3 -** Select the region to add Appbase.io to. It is recommended that you pick a region closest to where your Elasticsearch cluster is running.

**Step 4 -** Enter a name for your Appbase.io instance. And enter the Elasticsearch URL. Use the `Verify Connection` button to ensure that this URL is accessible.

![](https://i.imgur.com/NO5lcvl.png)

> **Note:** We recommend either having an open Elasticsearch access policy or one based on Basic Authentication till the Appbase.io instance is deployed.

**Step 5 -** Hit **Create Cluster** button and hang tight till your cluster is deployed.

That's all! It take around 5-10 mins for your Appbase.io instance to be deployed. Once the deployment is complete, you will be able to see it in your **Clusters List** with a `Bring your own cluster` tag.

> **Note:** If you have IP based restriction for your cluster, now you can whitelist the Appbase.io Cluster IP and restrict direct access to your cluster. [Read More](/docs/hosting/byoc/connect-to-your-elasticsearch/)

#### **Accessing Appbase.io Dashboard**

Now that the Appbase.io Cluster is deployed, we can access the **Dashboard** using the **Explore Cluster** Action on the **Clusters Details** page.

![](https://i.imgur.com/uIfTi2G.png)

This will give you access to all the Appbase.io features such as:

-   Better dev tools: Data importer, data browser, logs view, and search relevancy tester
-   Actionable search and click analytics
-   Fine-grained security permissions

![](https://i.imgur.com/OPQiXA8.png)

#### **Accessing Elasticsearch Data using REST API**

You can access the [Elasticsearch REST](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs.html) APIs via the Appbase.io Instance URL. You can either use the master credentials or create additional API keys with fine-grained access permissions.
![](https://i.imgur.com/Q3onHwn.png)

#### **Changing Elasticsearch URL**

You can update your Elasticsearch cluster URL at any point using the Appbase.io dashboard. All you need to do is just enter new URL and hit `Update Cluster Settings`.

> **Note:** Make sure your new Elasticsearch cluster URL has open access till the deployment is completed.

![](https://i.imgur.com/Pb2midX.png)

#### **Sharing Cluster**

With Appbase.io Dashboard, you can easily share the cluster with your team members. Each user can have a **Viewer** or an **Admin** role.

![](https://i.imgur.com/qmKcffi.png)

### Using AMI

You can deploy Appbase.io using Amazon Machine Image (AMI) on the AWS Marketplace. With the AMI, you can install Appbase.io with one click on an AWS EC2 instance.

Here are the steps that you can follow to install Appbase.io using AMI

**Step 1 -** Create an [Appbase.io instance](/docs/hosting/byoc/#how-to-create-appbaseio-instance).

**Step 2 -** Select Appbase.io AMI from [AWS Marketplace](https://aws.amazon.com/marketplace/pp/B081K85XFZ?qid=1574427631010)

![](https://i.imgur.com/ILM9BaS.png)

**Step 3 -** Select an EC2 Instance for Deploying Appbase.io. We recommend using the [t2 medium](https://aws.amazon.com/ec2/pricing/on-demand/) instance size.

That's all you need to follow in order to deploy an Appbase.io cluster 🚀. Once the EC2 machine is created and _running_ successfully, you can get Public DNS / IP address from the EC2 dashboard. This URL becomes your end point for accessing the Appbase.io services. You can also point your domain to this DNS or IP.

![](https://i.imgur.com/PDs8DK0.png)

> **Note:** We highly recommend using the cluster with [TLS security](https://en.wikipedia.org/wiki/Transport_Layer_Security) enabled, as Appbase.io is intended to be used as a frontend for Elasticsearch.

#### **Adding TLS Certificate**

For setting up TLS, you may also want to point EC2 public DNS to your domain. For more information on how to register/point domain to EC2 instance you can check [docs](https://aws.amazon.com/getting-started/tutorials/get-a-domain/).

Now, let's add TLS certificate to EC2 public DNS / custom domain

**Step 1-** Get TLS certificate with `.pem` & `.key` file.

> **Note:** You can obtain a free certificate using [https://letsencrypt.org/](https://letsencrypt.org/) or [use a self-signed certificate](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-18-04) as well.

**Step 2-** Access your EC2 instance using `ssh`. From EC2 dashboard you can select instance and click on **Connect** to get `ssh` login details about your machine.

![EC2 Connect Screenshot](https://i.imgur.com/NRW1P6c.png)

**Step 3-** Copy `.pem` file content to `/etc/nginx/server.crt` using `vim`/`nano` editor

```bash
# Open the file
sudo vim /etc/nginx/server.crt
# Paste the code
cmd/ctrl + v
# Save the file
:wq
```

**Step 4-** Copy `.key` file content to`/etc/nginx/server.key` using similar approach mentioned above.

**Step 5-** Open `sudo vim /etc/nginx/nginx.conf`.

**Step 6-** Configuration for TLS is already present in `nginx.conf` in commented form. You can uncomment it.

![](https://i.imgur.com/PybxA1K.png)

-   Uncomment lines `L125` - `L213`.
-   Comment out or remove the server listening for PORT 80.

**Step 7-** Restart nginx service using following command

```bash
sudo systemctl restart nginx
```

#### **Configuring Appbase.io**

Once your EC2 machine is up and running, you can open the EC2 public DNS. You might come across following page initially.

![](https://i.imgur.com/huRzI3e.png)

You can start configuring Appbase.io by clicking on _configure page_ link OR opening `http://public-dns/configure` URI directly.

**Step 1:** Setup Appbase.io credentials. This are the master credentials that will be used for accessing the Appbase.io Service from the Dashboard. Your initial user name is `ec2-user` and your initial password is your EC2 instance id.

![](https://i.imgur.com/OkyeFJS.png)

**Step 2:** Once you login, you can reset your username and password. Enter the your Elasticsearch URL, APPBASE_ID obtained while setting [Appbase.io instance](/docs/hosting/byoc/#how-to-create-appbaseio-instance) and save the details.

![](https://i.imgur.com/iVmzscW.png)

Hold tight for 5-10s till the Appbase.io service restarts with your new configurations.

#### **Getting Appbase.io URL**

Once EC2 machine is up and running, your EC2 public DNS becomes the Appbase.io URL. This can be used with the configured `USERNAME` and `PASSWORD` to test the Appbase.io connection.

**Example**

```bash
curl -u="USERNAME:PASSWORD" http://EC2-PUBLIC-[IP/DNS]
```

#### **Accessing Appbase.io Dashboard**

Now that all our configurations are complete, in order to access all the Appbase.io Services, let us sign in to the [Appbase.io dashboard](https://dash.appbase.io/login).

-   **Step 1 -** Sign in into [Appbase.io dashboard](https://dash.appbase.io/login) using your EC2 Public IP / Domain with Username and Password configured above.

![](https://i.imgur.com/qVSHx0F.png)

🔥 Hurray! You can now start accessing all the Appbase.io services using [Appbase.io Dashboard](https://dash.appbase.io).

---

### Using Docker

Run appbase.io via a single [docker compose file](https://github.com/appbaseio/arc-dockerized/blob/master/docker-compose-with-elasticsearch.yaml). This setup enables you to run appbase.io and Elasticsearch together with single command, i.e. `docker-compose up -d`. 😎

The dockerized setup is composed of the following services:

#### appbase.io

Allows you to access all appbase.io features like search preview, actionable analytics and granular security with any Elasticsearch cluster hosted anywhere.

> **Note:** Make sure your appbase.io container has complete access to Elasticsearch. You can use Elasticsearch URL with Basic Auth in configuring dashboard or IP restricted Elasticsearch URL where IP of your appbase.io cluster hosted using docker setup is white listed.

#### Configure

This service comes with simple user interface which allows you to set credentials and other environment variables. Also it watches for environment variable file changes: if any variable in the file is changed, it can hot-reload the appbase.io service.

#### Nginx

This service helps in setting up reverse proxy for Appbase.io Service and serving Configuration service. It also helps in serving data using with TLS certificate, which is recommended for production.

#### Elasticsearch

An open-source single-node Elasticsearch cluster is run. This is optional: You can use the [docker compose file here](https://github.com/appbaseio/arc-dockerized/blob/master/docker-compose.yaml) to run without Elasticsearch.


The steps described here assumes that you have [Docker](https://docs.docker.com/install/) already installed on your system.

-   **Step 1:** Get Appbase ID following the steps mentioned [here](/docs/hosting/byoc/#how-to-create-appbaseio-instance)

-   **Step 2:** Clone the repository

    ```bash
    git clone https://github.com/appbaseio/arc-dockerized.git && cd arc-dockerized
    ```

-   **Step 3:** Build and run docker containers

    We highly recommend using Appbase.io with [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) so that we can easily bind this with the Appbase.io Dashboard. To simplify the process of docker build, test and deployment, we have created 2 versions:

    1 - **Install Appbase.io + Nginx with TLS setup _(Recommended for production)_**

    -   Change [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) certificate and keys with production files. Please obtain [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) certificate and key for your domain using [Let's Encrypt](https://letsencrypt.org/) or any other provider. Update the files in [nginx/certs](https://github.com/appbaseio/arc-dockerized/tree/master/nginx/certs).
    -   In case you are using different name than mentioned in [nginx/certs](https://github.com/appbaseio/arc-dockerized/tree/master/nginx/certs) folder, please update them in the `docker-compose.yaml` file as well.

    ![](https://i.imgur.com/piUKTLl.png)

    Also, make sure you update the file names in the [nginx/default.conf](https://github.com/appbaseio/arc-dockerized/blob/master/nginx/default.conf) file.

    ![](https://i.imgur.com/LW8zOyB.png)

    ```bash
    docker-compose up -d
    ```

    2 - **Install Appbase.io + Elasticsearch (If you want to deploy appbase.io Along with Elasticsearch.)**

    ```
    docker-compose -f docker-compose-with-elasticsearch.yaml up -d
    ```

    🔥 Thats all, our containers should be up and running. Next, let us configure the environment variables required by Appbase.io service.

-   **Step 4:** Open configuration service URL in your browser, i.e. http://localhost (or https://your-domain.com as configured in your nginx settings).

    > **Note:** If you are running this setup on an virtual machine, make sure ports `80` and `443` are set in your inbound rules for the cluster.

-   **Step 5:** Set username and password credentials.

-   **Step 6:** Configure Elasticsearch URL and Appbase ID obtained above.

    > **Note:** Once you save the configuration, it may take 5-10s to restart the appbase.io service.

-   **Step 7:** Start using Appbase.io Services using [Appbase.io Dashboard](https://dash.appbase.io/). Here you will have to input Appbase.io Cluster URL which will be of the form http(s)://localhost_OR_cluster_url. Enter the username and password values that you configured in _Step 5_.

### Using Kubernetes

Add appbase.io to your Kubernetes environment with our Helm chart.

#### Installing appbase.io with Helm

Add the appbase.io Helm chart repository first:

`helm repo add appbase https://opensource.appbase.io/helm-charts/`

We're now good to install it: `helm install appbaseio appbase/appbaseio --set <variables>`

The following variables are mandatory:
* `elasticsearch.scheme` (e.g. http or https), `elasticsearch.host` (e.g. my-search.com), `elasticsearch.port` (e.g. 9200) define the upstream Elasticsearch cluster. We also support `elasticsearch.username` and `elasticsearch.password` variables for Basic Auth enabled clusters but these are optional.
* `appbase.id` is the appbase.io instance ID that is used to track subscription status and can be obtained from [dash.appbase.io/install](https://dash.appbase.io/install).
* `appbase.username` and `appbase.password` are user-defined values for providing the initial root user access via the appbase.io API gateway.

For a full list of supported variables, check out our [project README](https://github.com/appbaseio/helm-charts#configure-the-cluster-with-values).

---

### How to create Appbase.io instance?

Creating an Appbae.io instance will enable you to access [Appbase.io Dashboard](https://dash.appbase.io). While following instance creation process, you will get an `APPBASE_ID`. This will be helpful while configuring Appbase.io, with any of the deployment options listed below.

Follow the steps listed below to successfully create an Appbase.io instance.

**Step 1 -** Go to [Appbase.io Dashboard](https://dash.appbase.io/install).

![](https://i.imgur.com/YZubabh.png)

**Step 2 -** Enter your email address

**Step 3 -** You will receive an OTP on entered email address. Enter OTP to verify the email address

**Step 4 -** You will receive an email with `APPBASE_ID` which can be used with Appbase.io configuration.

---
