---
title: 'Search UI Builder'
meta_title: 'NoCode UI Builder For Search'
meta_description: 'Visually build a search UI with NoCode. Export to your favorite E-Commerce Platform or your own site.'
keywords:
	- ui-builder
    - ui-integrations
    - overview
    - storefront search builder
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'ui-builder-reactivesearch'
---

## Overview


[Appbase.io](http://appbase.io) now comes with **UI Builder** - a built-in visual search UI builder that gives developers and business teams freedom to alter search layout and settings in realtime. This WYSIWYG storefront search preview can be easily integrated with your favorite E-Commerce platform or site.

You can watch this 5-mins video to follow along the process of creating a storefront search and installing into a Shopify store.

[![Watch 5-min video for Shopify](https://i.imgur.com/VMW4pIw.jpg)](https://www.youtube.com/watch?v=5pdcNUha2iA)

> Note: **UI Builder** feature is available with appbase.io Production and Enterprise plans.


### E-Commerce Platform

![Choose Platform](https://imgur.com/DWhvlhp.png)

You can choose the `E-Commerce Platform` for which you are building the search UI for. The Shopify option comes with presets specific to Shopify's schema. You can also import data from a Shopify store into appbase.io via the `Develop > Import` tab. However, you can use UI Builder to build a site search for other platforms such as Magento, Wordpress, Webflow, Wix and it can even be integrated into your own site.

![Store Info](https://imgur.com/l96LvJU.png)

Next, in the `Store info` tab, you can set the default currency for your store.

### Importing Data

appbase.io natively supports indexing data from a Shopify store via our dashboard.

<br/>
<img src="https://i.imgur.com/Bm1AmXj.png" alt="Support for sync preferences" width="500"/>

You can read more about the different preferences and how it works over [here](/docs/data/import/from-shopify/).

### Layout and Design

The options in the `Layout and Design` tab will let you style and create a design for your search results and search results page.

![Search Layout](https://imgur.com/fgxvpxh.png)

Starting with the `Search Layout` tab, you can select the overall look for your search page. Currently, you can select `Classic`, which has clearly defined boxes for filters and facets making it a great fit for multi-category stores, or `Minimal` which delivers a streamlined view preferred by fashion and jewelery retailers.

![Style Presets](https://imgur.com/VZpKmjp.png)

The next tab, `Style Presets`, will let you set the font family and color preferences for the storefront search.

![Custom CSS](https://imgur.com/BhhZUr9.png)

In `Custom CSS`, you will be able to set your CSS to control the look and feel of the search results page on a more granular level by adding various classes. We've also given some examples you copy-paste in the editor. All these changes will be updated in realtime and you can have a look at them in the preview.

### Search Settings

In the `Search Settings` tab, you will be able to define the behavior for search, filters, and results.

![Search Tab](https://imgur.com/yJPp5sj.png)

In the `Search` tab, you can configure the preferences and search settings. Here the preferences are related to suggestions and enabling of voice search and the search settings are regarding the fields to search on, field weights to apply, typo tolerance and synonyms settings. You can read more about the available options over [here](/docs/search/relevancy/#search-settings).

![Filters](https://imgur.com/5AxRfYG.png)

In the `Filters` tab, you can set the filters that should appear as facets in the storefront search.

![Adding a custom filter](https://imgur.com/UXwKxmh.png)

You can also add custom filters in this view. Click on the **Add Filter** button. In the **Data Field** dropdown, select one of the fields from your index. Give it a title and save. The filter options will be populated by data present in the attributes.

![Results Tab](https://imgur.com/39icKEZ.png)

The `Results` tab gives you control over the search UI for your store. It supports the following options:

- Enable or Disable **Popular Suggestions** along with the search dropdown,
- Show **Active Filters** on top of the search results page,
- **Show Results as** allows choosing whether to show the results in grid or list view,
- Enable **Results View Switcher** to allow end users to pick between grid and list view in the search UI,
- Toggle **Infinite Scroll** or **Pagination** on your search result pages,
- Select what fields appear on the Product Cards in the search results. You will be able to set data for **Product Title**, **Product Description**, **Product Price**, **Product Image**, and **Redirect URL**.



Custom Messages tab lets you customize the text and messaging that appears at various points of the search journey for E-Commerce visitors. You can customize these messages.

![Custom Messages](https://i.imgur.com/vgw0Yii.png)

- **Search Text** lets you set the placeholder message in the search box,
- You can set a custom **Search Icon**,
- **Suggestions Loading** is the message that appears in the search dropdown when relevant suggestions are being fetched,
- **No Suggestions Found** lets you set the message when no suggestions are found for a search term,
- **Result Stats** message lets you show how many results were found for the search query along with the time taken,
- **No Results Found** lets you set the message that appears on the search results page when a search query returns no results,
- **No Filter Items** lets you set the message that appears the filters that appears when there are no relevant filters to select from
- **Fetching Filter Items** lets you set the message when the filter values are being fetched.

While some of these messages are on-screen for a brief period of time, it is considered a good Ux practice to have them set up. They can be used to guide your users to finding relevant search results.


### Exporting Code to Shopify

![Export code](https://i.imgur.com/kfNSBky.png)

Once you are satisfied with the changes you've made, you can export the code to your Shopify store. Click on the bottom-left button to begin.

![Set API Credentials](https://i.imgur.com/xg7t1Zq.png)

You can set the **API Credentials** - they will be used by the exported code to query your appbase.io index.

![installation snippet](https://i.imgur.com/SWhRnSr.png)

You can follow the **Installation Instructions** for the exact steps to install this snippet into your Shopify (or Shopify Plus) store.

Once installed, you can head to the store and see the appbase.io generated search interface as your default search.

![Final Result](https://i.imgur.com/rG6VNpv.png)


### Exporting Code to other Platforms

While we offer a first-class support for Shopify, one can export the generated storefront search code to any other platform of choice, such as Magento, Wordpress, Webflow, Wix. You can also install into a site.

In the Export Mode, select the export mode.

![UI%20Integrations%20Documentation%203dae67e206ec4b00826e3673675775af/common-1%201.png](https://i.imgur.com/R2UEryc.png)

**Embed Mode** offers the most convenient way to install the snippet.

**Hackable Mode** on the other hand exports the underlying source code in a way that makes it easy to extend the project further.
