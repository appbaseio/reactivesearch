---
title: 'Recommendations UI Builder'
meta_title: 'NoCode Recommendations UI Builder'
meta_description: 'Build a recommendations UI with NoCode. Export to your favorite E-Commerce Platform or your own site.'
keywords:
	- ui-builder
    - ui-integrations
    - overview
    - recommendations-ui
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'ui-builder-reactivesearch'
---

## Overview

The Recommendations UI builder offers a NoCode interface for creating Recommendations widgets by popularity, similarity, recency. A user can also choose to feature the recommendations.

![](https://i.imgur.com/3uq5Ndm.png)

### E-Commerce Platform

![](https://i.imgur.com/kmpsrZA.png)

You can choose the `E-Commerce Platform` for which you are building the recommendations UI for. The Shopify option comes with presets specific to Shopify's schema. You can also import data from a Shopify store into appbase.io via the `Develop > Import` tab. However, you can use the recommendations UI builder for other platforms such as Magento, Wordpress, Webflow, Wix and it can even be integrated into your own site.


### Recommendations UI

![](https://i.imgur.com/Vredm1F.png)

There are three types of recommendations UI that you can create:
- **Most Popular Products** - This recommendation UI uses analytics to show the most popular products to your users.
	![](https://i.imgur.com/TgUgVNG.png)
- **Most Recent Products** - This recommendation UI shows the most recently added products to your users. It requires you to set a timestamp field that it will use to sort the most recent products.
	![](https://i.imgur.com/ZNTaWpa.png)
- **Similar to this Product** - This recommendation UI is meant to be displayed on a product page. It recommends other products to your users based on the similarity in the `DataField`. E.g. Users browsing a sneaker (product type) from Adidas (specific product) should be recommended other shoes from other brands.
	![](https://i.imgur.com/E2x6vpX.png)
	The Similar To recommendation allows you (the developer) to define the product URL pattern. It extracts the value of the current product's data field based on this and then fetches other similar products.


### Settings

![](https://i.imgur.com/5mIjz1G.png)

The Settings tab allows specifying the details of the recommendations card layout, specifying style presets, as well as adding any custom CSS.

You can use the **Settings Preview** option to preview how the recommendations would appear.

### Exporting Code to Shopify

We natively support exporting a recommendations widget to Shopify.

1. To export to Shopify, select the Platform as Shopify in your E-Commerce tab.

	![](https://i.imgur.com/CKrAqW5.png)

2. Next, select the Recommendation UI that you wish to export.

	![](https://i.imgur.com/tfJcHZ0.png)

3. Add the API credentials to be used with the Recommendations UI and follow the installation instructions.

	![](https://i.imgur.com/f1GdPFt.png)

### Exporting Code to other Platforms

Exporting to all platforms (including your own site) is also supported.

1. Select the Platform as Other in your E-Commerce Platform tab.
	![](https://i.imgur.com/xCNgQA7.png)

2. Next, select the Recommendation UI that you wish to export.
	![](https://i.imgur.com/tfJcHZ0.png)

3. Add the API credentials and choose between Embed and Hackable Mode.

![https://i.imgur.com/IfsWCCd.png](https://i.imgur.com/R2UEryc.png)

**Embed Mode** offers the most convenient way to install the Recommendations snippet.

**Hackable Mode** on the other hand exports the underlying source code in a way that makes it easy to extend the project further.
