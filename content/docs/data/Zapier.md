---
title: 'Zapier Integration'
meta_title: 'appbase.io - Zapier'
meta_description: 'Automate your appbase.io database operations with Zapier.'
keywords:
    - dataschema
    - appbase.io
    - zapier
    - elasticsearch
sidebar: 'docs'
---

## Overview

You can import data into appbase.io using any of the following methods:

-   Import via the dashboard GUI,
-   Import via ABC CLI,
-   Use the Zapier integration to import from over 1,500+ supported apps such as Typeform, Google Sheets, Mailchimp.

In this doc, we will walk through the process of importing using this Zapier integration using Google Sheets as an example input source.

Zapier allows connecting apps you use everyday to automate your work and be more productive. You can read more about Zapier over [here](https://zapier.com).

> Right now, the appbase.io app is not publicly available on Zapier. You can use it via this invite link: https://zapier.com/developer/public-invite/33102/02001b9598c3849a50cf1c94ff0cf572/

## Creating A Zap

You can go to the [Zapier editor](https://zapier.com/app/editor/) and create a zap. In the below image, we create a zap for `Google Sheets <> appbase.io`.

![](https://i.imgur.com/GSavUdf.png)

## Adding Your Data In Google Sheets

Add data in your Google Sheets. You can directly copy the data from [here](https://docs.google.com/spreadsheets/d/1nc3n-saZ8pVd7gE64iR6BrJoHzpVOrRPi8B3598UCLQ/edit?usp=sharing).

![](https://i.imgur.com/eHoBAWB.png)

## Configuring Google Sheets

Login with your Google account and once you configure the Google Sheets integration, you should see something similar:

![](https://i.imgur.com/tARRU02.png)

## Configuring appbase.io

Next, select `appbase.io` from the apps and go to the `Create Document` action.

![](https://i.imgur.com/NXSWV1Y.png)

After this step, you need to add your API credentials and authenticate. Connect your `appbase.io` account on clicking `Add a New Account` under `Choose Account` section, where you have to
enter your `appbase.io` credentials which you can find [here](https://dashboard.appbase.io/profile/credentials).
You should see something similar:

![](https://i.imgur.com/avTdYss.png)

## Operations

### Adding New Record

I am going to call my appbase.io app `business` here. The Zapier integration will create the app if it doesn't exist. The next step is to map the columns from Google Sheets to the field names that will be used to store them in appbase.io. It should look something similar to the following:

![](https://i.imgur.com/wHpDMH7.png)

After clicking on `Continue` and after a successful insertion, you will also see an `_id` being returned back. This is the unique ID for our record (aka document).

![](https://i.imgur.com/r2MSpTg.png)

### Updating An Existing Document

Another helpful feature is the ability to edit existing documents. Whenever a value from an incoming integration is mapped to an `_id` field, the existing document gets updated instead of a new document getting created.

![](https://i.imgur.com/7zEAso9.png)

## Conclusion

While we focused here on a specific integration with Google Sheets, you can capture incoming data from a variety of sources, including but not limited to emails being received in your Sendgrid account or GMail, form data coming from Google Sheets, Typeform or Airtable, and even perform database sync from MySQL, Firestore and other supported database Zaps.
