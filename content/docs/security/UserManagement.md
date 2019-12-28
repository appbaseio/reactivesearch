---
title: 'User Management'
meta_title: 'User Management - Security'
meta_description: 'User Management allows you to add additional user login access to the appbase.io dashboard.'
keywords:
    - concepts
    - appbaseio
    - user management
    - api
sidebar: 'docs'
---

User Management allows you to add additional user login access to the appbase.io dashboard. You can access User Management from the `Security` view in your dashboard.

![usermanagement](https://i.imgur.com/yoCzEmG.png)

Users need to sign in via the login URL provided in the dashboard using the provided username and password. Passwords are encrypted and can't be seen once set - they can always be reset by an admin user.

## Create A New User

![Create a New User](https://i.imgur.com/nCbPi8w.png)

When creating a new user, you can either provide admin privileges or set the specific categories (access controls) this user can access via UI / APIs.

## User Management vs API Credentials

When you need to provide GUI access to the dashboard, we recommend creating a new user. On the other hand, when you need to offer programmatic access to a subset of the APIs / or set restrictions based on IPs, HTTP Referers, fields, time, we recommend creating an [API credential](/docs/security/Credentials/#adding-and-updating-credentials).
