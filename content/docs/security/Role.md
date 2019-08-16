---
title: 'Role Based Access'
meta_title: 'Role Based Accesss'
meta_description: 'API credentials allow secure access to the appbase.io APIs.'
keywords:
    - security
    - appbaseio
    - rolebasedaccess
    - elasticesearch
sidebar: 'docs'
---

## Introduction

Essential entities in any [Role Based Access Control (RBAC)](https://en.wikipedia.org/wiki/Role-based_access_control) system are the **user**, the **service** that user wants to access (in our case _appbase application / elasticsearch indexes_), and the **[identity provider (IdP)](https://en.wikipedia.org/wiki/Identity_provider)**. To access the service, the user first needs to authenticate against the IdP. The IdP verifies the user credentials and hands out a signed token. The user then sends this token to the service with each request. The service uses the information in the token to verify the user’s identity and to assign roles and permissions.

You can now secure your Appbase applications by providing role based access to the various users that are going to use appbase application / elasticsearch index. We are supporting role base access using [JSON Web Tokens (JWT)](https://jwt.io/introduction/).

> JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.

You can add JWT token with `Authorization: Bearer {JWT}` header, to authorize a user. In order to verify JWT token from different identity providers, we decide to support the JWT tokens that are signed using public/private key pair using [RSA256](<https://en.wikipedia.org/wiki/RSA_(cryptosystem)>).

Now with the `JWT Bearer` token authorization, we will not be exposing our api credentials, hence adding one more layer of security to the application.

## Enable Role Based Access using Dashboard

Appbase dashbaord provides an intuitive way to enable and configure role based access using JWT. In order to setup RBAC, select `Role Based Access` under `Security` on Dashboard's navigation bar.

![](https://www.dropbox.com/s/v7uwupxmh757yvl/Screenshot%202019-06-19%2017.19.46.png?dl=1)

### This page is divided into 2 sections

#### 1. Configuring JWT Public Key and Role Key

In order to verify JWT token signed using RSA256, we need a Public Key provided by the identity provider. You can simply paste the public key in the text area provided for `Public Key`. Another thing that is required to verify role, is actual `Role Key` that would be present in any JWT token. This can be configured in `Role Key` input. The default value for role key is `role`.

**Here is a quick example, where [https://jwt.io/](https://jwt.io/) is used as an identity provider.**

![](https://www.dropbox.com/s/n1vqfle2t3vrma8/Screenshot%202019-06-19%2017.56.04.png?dl=1)

#### 2. Adding roles to [API Credentials](/concepts/api-credentials.html)

Once the `Public Key` and `Role Key` is configured, you can set up the actual roles that a user can have in your application in `Map Roles to API Credential` section. Each credentials created in [API Credentials](/concepts/api-credentials.html) section can have a unique role name, which would be the value encoded in our JWT token.

![](https://www.dropbox.com/s/oxxtdl8koww9mro/Screenshot%202019-06-19%2018.25.59.png?dl=1)

As you can see in the above example we have 2 roles assigned to different credentials, i.e. `admin` & `developer` (_this values have to be unique per application_).

Now, whenever a user will make a request to the application, with valid `JWT Bearer` token for a given application he/she will be able to access the data.

Sample API call for appbase app

```bash
curl --location --request GET "https://scalr.api.appbase.io/my-appbase-app" \
  --header "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impob24iLCJyb2xlIjoiYWRtaW4ifQ.GEbnh5dfbdRXdlkGi5aLFnM7xYuYViPSf0ZnLGaX0ikfo3fT8Rtx7rbpKvR6_eftmB3q0Q_x3n9-JsgbEY1E47p2H_qhMhP5Jd8uB__Dlm1LW5W6qiDsNelVsZLAcqq-CgnGxkgWvWRFfpNEoyZhzLa3TudoPjZWW7m4WOaewpyZwlyGH7oztjbLVwRVCNC5ziA61aZJHVR-C4MhaMxZ-hf1uE022BD9q6aH-mWuVjbMACMOQuqTgIxo5tmphRh_kbuKZEUslUYtB1cEPzgQNU2eRq5BjDI4EoxdTKkLhgYSgMWNnUcZowq8sd4-kKjEB7wrUa6xYIjY04xVO4NvYw"
```
