---
title: 'Bring Your Own Cluster'
meta_title: 'Bring Your Own Cluster'
meta_description: 'Run Appbase.io with for your own ElasticSearch cluster hosted elsewhere.'
keywords:
    - clusters
    - appbaseio
    - appbase
    - ElasticSearch
sidebar: 'docs'
---

Already have ElasticSearch hosted with AWS, Elastic Cloud or planning to hosting it yourself?
You can now access all of Appbase.io features such as [search preview](/docs/search/Preview), [actionable analytics](/docs/analytics/Overview/) and [granular security](/docs/security/Credentials/) with an ElasticSearch cluster hosted anywhere with the `Bring Your Own Cluster` deployment mode.

> 🆕 We're making Appbase.io available as a cloud-native software under the codename [Arc](https://arc-dashboard.appbase.io).

![](/images/byoc.png)

This diagram highlights how Arc works. It directly interacts with an underlying ElasticSearch cluster and acts as an API gateway for clients to interact with. Arc supercharges your ElasticSearch cluster with a streamlined development experience, out of the box search analytics and fine-grained security features.

## Quickstart Recipes

You can install [Arc](https://arc-dashboard.appbase.io) on any server environment. We have created quickstart recipes to make the installation process seamless for the following platforms:

<div class="grid-integrations-index mt4 mt6-l f8">
	<a class="bg-white shadow-2 box-shadow-hover shadow-2-hover  br4 db flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc" style="box-shadow: 0 0 5px rgba(0,0,0,.02), 0 5px 22px -8px rgba(0,0,0,.1);    word-break: normal;cursor: pointer; padding: 2rem; height: 120px;width:120px;" href="#using-appbaseio">
		<img class="w10 mb1" src="/images/arc.svg" />
		using appbase.io
	</a>
		<a class="bg-white shadow-2 box-shadow-hover shadow-2-hover  br4 db flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc" style="box-shadow: 0 0 5px rgba(0,0,0,.02), 0 5px 22px -8px rgba(0,0,0,.1);    word-break: normal;cursor: pointer; padding: 2rem;height: 120px;width:120px;" href="#using-ami">
		<img class="w10 mb1" src="/images/awscart.jpg" />
		AWS Marketplace
	</a>
	<a class="bg-white shadow-2 box-shadow-hover shadow-2-hover  br4 db flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc" style="box-shadow: 0 0 5px rgba(0,0,0,.02), 0 5px 22px -8px rgba(0,0,0,.1);    word-break: normal;cursor: pointer; padding: 2rem; height: 120px;width:120px;" href="#using-docker">
		<img class="w10 mb1" src="/images/docker.png" />
		Docker
	</a>
</div>

### Using Appbase.io

Appbase.io dashboard offers the most seamless experience for running your Arc with your own ElasticSearch cluster.

**Step 1 -** Go to the **[Create Cluster Link](https://dashboard.appbase.io/clusters/new/my-cluster)**. You will be redirected to sign up or login if you aren't already logged in.

![](https://i.imgur.com/X6dTO8f.png)

You should see the above screen.

**Step 2 -** Select the pricing plan. Read more about pricing plans over [here](https://arc-site.netlify.com/pricing/).

**Step 3 -** Select the region to add Arc to. It is recommended that you pick a region closest to where your ElasticSearch cluster is running.

**Step 4 -** Enter a name for your Arc instance. And enter the ElasticSearch URL. Use the `Verify Connection` button to ensure that this URL is accessible.

![](https://i.imgur.com/NO5lcvl.png)

> **Note:** We recommend either having an open ElasticSearch access policy or one based on Basic Authentication till the Arc instance is deployed.

**Step 5 -** Hit **Create Cluster** button and hang tight till your cluster is deployed.

That's all! It take around 5-10 mins for your Arc instance to be deployed. Once the deployment is complete, you will be able to see it in your **Clusters List** with a `Bring your own cluster` tag.

> **Note:** If you have IP based restriction for your cluster, now you can whitelist the Arc Cluster IP and restrict direct access to your cluster.

#### **Accessing Arc Dashboard**

Now that the Arc Cluster is deployed, we can access the **Arc Dashboard** using the **Explore Cluster** Action on the **Clusters Details** page.

![](https://i.imgur.com/uIfTi2G.png)

This will give you access to all the Appbase.io features such as:

-   Better dev tools: The Dejavu data browser, search preview, query rules
-   Actionable Search and Click Analytics
-   Fine-grained Security Permissions.

![](https://i.imgur.com/OPQiXA8.png)

#### **Accessing ElasticSearch Data using REST API**

You can access the [ElasticSearch REST](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs.html) APIs via the Arc Instance URL. You can either use the master credentials or create additional API keys with fine-grained access permissions.
![](https://i.imgur.com/Q3onHwn.png)

#### **Changing ElasticSearch URL**

You can update your ElasticSearch cluster URL at any point using the Appbase.io dashboard. All you need to do is just enter new URL and hit `Update Cluster Settings`.

> **Note:** Make sure your new ElasticSearch cluster URL has open access till the deployment is completed.

![](https://i.imgur.com/Pb2midX.png)

#### **Sharing Cluster**

With Appbase.io Dashboard, you can easily share the cluster with your team members. Each user can have a **Viewer** or an **Admin** role.

![](https://i.imgur.com/qmKcffi.png)

### Using AMI

Now you can deploy Arc using Amazon Machine Image (AMI) on the AWS Marketplace. With the AMI, you can install Arc with one click on an AWS EC2 instance.

Here are the steps that you can follow to install Arc using AMI

**Step 1 -** Create an [Arc instance](/docs/hosting/BYOC/#how-to-create-arc-instance).

**Step 2 -** Select Arc AMI from [AWS Marketplace](https://aws.amazon.com/marketplace/pp/B081K85XFZ?qid=1574427631010)

![](https://i.imgur.com/ILM9BaS.png)

**Step 3 -** Select an EC2 Instance for Deploying Arc. We recommend using the [t2 medium](https://aws.amazon.com/ec2/pricing/on-demand/) instance size.

That's all you need to follow in order to deploy an Arc cluster 🚀. Once the EC2 machine is created and _running_ successfully, you can get Public DNS / IP address from the EC2 dashboard. This URL becomes your end point for accessing the Arc services. You can also point your domain to this DNS or IP.

## ![](https://i.imgur.com/PDs8DK0.png)

> **Note:** We highly recommend using the cluster with [TLS security](https://en.wikipedia.org/wiki/Transport_Layer_Security) enabled, as Arc is intended to be used as a frontend for ElasticSearch.

#### **Adding TLS Certificate**

For setting up TLS, you may also want to point EC2 public DNS to your domain. For more information on how to register/point domain to EC2 instance you can check [docs](https://aws.amazon.com/getting-started/tutorials/get-a-domain/).

Now, let's add TLS certificate to EC2 public DNS / custom domain

**Step 1-** Get TLS certificate with `.pem` & `.key` file.

> **Note:** You can obtain a free certificate using [https://letsencrypt.org/](https://letsencrypt.org/) or [use a self-signed certificate](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-18-04) as well.

**Step 2-** Access your EC2 instance using `ssh`. From EC2 dashboard you can select instance and click on **Connect** to get `ssh` login details about your machine.

![EC2 Connect Screenshot](https://i.imgur.com/NRW1P6c.png)

**Step 3-** Copy `.pem` file content to `/etc/pki/nginx/server.crt` using `vim`/`nano` editor

```bash
# Open the file
sudo vim /etc/pki/nginx/server.crt
# Paste the code
cmd/ctrl + v
# Save the file
:wq
```

**Step 4-** Copy `.key` file content to`/etc/pki/nginx/private/server.key` using similar approach mentioned above.

**Step 5-** Open `sudo vim /etc/nginx/nginx.conf`.

**Step 6-** Configuration for TLS is already present in `nginx.conf` in commented form. You can uncomment it.

![](https://i.imgur.com/PybxA1K.png)

-   Uncomment lines `L125` - `L213`.
-   Comment out or remove the server listening for PORT 80.

**Step 7-** Restart nginx service using following command

```bash
sudo systemctl restart nginx
```

#### **Configuring Arc**

Once your EC2 machine is up and running, you can open the EC2 public DNS. You might come across following page initially.

![](https://i.imgur.com/huRzI3e.png)

You can start configuring Arc by clicking on _configure page_ link OR opening `http://public-dns/configure` URI directly.

**Step 1:** Setup Arc credentials. This are the master credentials that will be used for accessing the Arc Service from Arc Dashboard. Your initial user name is `ec2-user` and your initial password is your EC2 instance id.

![](https://i.imgur.com/OkyeFJS.png)

**Step 2:** Once you login, you can reset your username and password. Enter the your ElasticSearch URL, ARC_ID obtained while setting [Arc instance](/docs/hosting/BYOC/#how-to-create-arc-instance) and save the details.

![](https://i.imgur.com/iVmzscW.png)

Hold tight for 5-10s till the Arc service restarts with your new configurations.

#### **Getting Arc URL**

Once EC2 machine is up and running, your EC2 public DNS becomes the Arc URL. This can be used with the configured `USERNAME` and `PASSWORD` to test the Arc connection.

**Example**

```bash
curl -u="USERNAME:PASSWORD" http://EC2-PUBLIC-[IP/DNS]
```

#### **Accessing Arc Dashboard**

Now that all our configurations are complete, in order to access all the Arc Services, let us sign in to the [Arc dashboard](https://arc-dashboard.appbase.io/login).

-   **Step 1 -** Sign in into [Arc dashboard](https://arc-dashboard.appbase.io/login) using your EC2 Public IP / Domain with Username and Password configured above.

![](https://i.imgur.com/qVSHx0F.png)

🔥 Hurray! You can now start accessing all the Appbase.io services using [Arc Dashboard](https://arc-dashboard.appbase.io).

---

### Using Docker

We have containerized Arc with its configuring dashboard into one docker compose file. This setup enables you to run Arc with single command, i.e. `docker-compose up -d` 😎.

Dockerize setup for Arc comes with 3 different services

#### Arc

Allows you to access all [Appbase.io](https://docs.appbase.io/docs/gettingstarted/WhyAppbase/) features like search preview, actionable analytics and granular security with any ElasticSearch cluster hosted anywhere.

> **Note:** Make sure your arc container have complete access to ElasticSearch. You can use ElasticSearch URL with Basic Auth in configuring dashboard or IP restricted ElasticSearch URL where IP of your ARC cluster hosted using docker setup is white listed.

#### Configure

This service comes with simple user interface which allows you to set credentials and other environment variables. Also it watches for environment variable file changes, so that if any variable in file is changed it can restart arc service.

#### Nginx

This service helps in setting up reverse proxy for Arc Service and serving Configuration service. It also helps in serving data using with TLS certificate, which is recommended for production.

## Quick Start 🚀

The steps described here assumes a that you have [docker](https://docs.docker.com/install/) installed.

-   **Step 1:** Get Arc ID following the steps mentioned [here](https://docs.appbase.io/docs/hosting/BYOC/#using-ami)

-   **Step 2:** Clone the repository

    ```bash
    git clone https://github.com/appbaseio/arc-dockerized.git && cd arc-dockerized
    ```

-   **Step 3:** Build and run docker containers

    We highly recommend using Arc with [SSL](https://en.wikipedia.org/wiki/Transport_Layer_Security) so that we can easily bind this with Arc Dashboard. To simplify the process of docker build, test and deployment we have created 2 versions:

    1 - **Install Arc + Nginx with SSL setup _(Recommended for production)_**

    -   Change [SSL](https://en.wikipedia.org/wiki/Transport_Layer_Security) certificate and keys with production files. Please obtain [SSL](https://en.wikipedia.org/wiki/Transport_Layer_Security) certificate and key for your domain using [Let's Encrypt](https://letsencrypt.org/) or any other provider. Update the files in [nginx/certs](https://github.com/appbaseio/arc-dockerized/tree/master/nginx/certs)
    -   In case you are using different name then mentioned in [nginx/certs](https://github.com/appbaseio/arc-dockerized/tree/master/nginx/certs) folder, then please update them in `docker-compose.yaml` file as well

    ![](https://i.imgur.com/piUKTLl.png)

    Also, make sure you update file names in [nginx/default.conf](https://github.com/appbaseio/arc-dockerized/blob/master/nginx/default.conf) file

    ![](https://i.imgur.com/LW8zOyB.png)

    ```bash
    docker-compose up -d
    ```

    2 - **Install Arc + ElasticSearch _(If you want to deploy Arc Along with ElasticSearch.)_**

    ```
    docker-compose -f docker-compose-with-elasticsearch.yaml up -d
    ```

    🔥 Thats all, our containers should be up and running. Next let us configure environment variables required by Arc service.

-   **Step 4:** Open configuration service URL in your browser, i.e. [http://localhost_OR_cluster_url](http://localhost/CLUStER_URL)

    > **Note:** If you are running this setup on an virtual machine, make sure ports `80` and `443` are set in your inbound rules for the cluster.

-   **Step 5:** Set credentials

-   **Step 6:** Configure ElasticSearch URL and ARC ID obtained above.

    > **NOte:** Once you save the configuration, it may take 5-10s to restart the arc service.

-   **Step 7:** Start using Arc Services using [Arc Dashboard](https://arc-dashboard.appbase.io/). Here you will have to input Arc Cluster URL which will be [http(s)://localhost_OR_cluster_url](<http(s)://localhost_OR_cluster_url>) and credentials would be the one that you configured initially on _Step 5_.

---

### How to create Arc instance?

Creating an Arc instance will enable you to access [Arc Dashboard](https://arc-dashboard.appbase.io). While following instance creation process, you will get an `ARC_ID`. This will be helpful while configuring Arc, with any of the deployment options listed below.

Follow the steps listed below to successfully create an Arc instance.

**Step 1 -** Go to [Arc Dashboard](https://arc-dashboard.appbase.io/install).

![](https://i.imgur.com/YZubabh.png)

**Step 2 -** Enter your email address

**Step 3 -** You will receive an OTP on entered email address. Enter OTP to verify the email address

**Step 4-** You will receive an email with `ARC_ID` which can be used with Arc configuration.

---
