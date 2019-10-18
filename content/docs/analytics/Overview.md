---
title: 'Analytics'
meta_title: 'Appbase analytics - Core Concepts'
meta_description: 'Analytics offers actionable insights into how your search is performing.'
keywords:
    - concepts
    - appbase
    - elasticsearch
    - analytics
sidebar: 'docs'
---

Search analytics allows you to keep track of the users' search activities which helps you to improve your search experience based on the analytics extracted by Appbase.io.

In this competitive world of e-solutions where almost every e-solution has some alternatives to choose, it's important to understand the users' needs & act accordingly. Search experience plays an important role to convert new users to recurring paid customers, nobody wants to lose customers because of the less interactive search. Here we play our role, we at Appbase.io are determined to provide access to the fast and meaningful content based on the users' search queries. Appbase.io analytics offers actionable insights into how your search is performing.

We can think of the search experience is proportional to business growth, the right search with the right content is the key to success. For our customers, it is important to understand their users' needs - what they want and when they want, what they like and what they dislike. To fulfill our customer needs we just launched a new analytics section in the Appbase.io dashboard which gives you access to the out of the box analytics features.

![Appbase.io dashboard](https://i.imgur.com/We4qekB.png)

## Getting insights from Analytics

We describe here some of the top features available to our customers.

### Understand the funnel of conversions
Get insights on what users are clicking on, what position those results appear in your results, the average click position of specific search queries, and how those queries are translating to conversions. You can check the [docs](/docs/analytics/Implement/#click-analytics) to learn how to register a click event.

If you are a `Growth` plan user, the following statistics also additionally give insights into the click data of the app.

### Top Search Queries
In the following chart, we show the most popular search terms searched by the users. It would be useful, for example, to a movie store application for anticipating their most searched movies. Based on the stats the owner can increase the price of some most popular movies to earn some profit.

![Appbase.io PopularSearches](https://i.imgur.com/7LXMPiM.png)

### Understand Content Gaps with No Results Queries
It is one of the most important statistics to know that where we don't meet the customers' expectations. This analytics feature allows you to know the search terms for which your customers didn't get any results back.

![Appbase.io NoResultsSearches](https://i.imgur.com/9HTjRYr.png)

### Get Instant Feedback With Replay Search
All analytics charts provide an additional Replay Search feature which allows testing the exact state of a user search inside of the dashboard providing an actionable feedback loop. For example, a movie store app owner may want to know why their customers are not getting more relevant results despite having the data set, by using the replay search feature they can test it out & update the search settings in front-end.

### Promote Results With Query Rules
This feature allows you to create featured results based on the top search queries or no results queries. For example, to a movie store app, it can be useful to promote `Harry Potter and The Deathly Hallows` movie at the top when someone searches for the harry potter query.

<br/>
<img src="/images/gifs/query-rules.gif" alt="Appbase.io Query Rules" />

### Top Search Results
Popular Results give insights into the total search impressions, clicks and conversion info for the most searched result items.

![Appbase.io PopularResults](https://i.imgur.com/8fAFNJV.png)

### Geo Distribution
Geography Visualization gives insights into where users are most searching from.

![Appbase.io GeoDistribution](https://i.imgur.com/g4SCYth.png)

### Request Distribution
The request distribution chart helps you to understand the status of your requests.

![Appbase.io Request Distribution](https://i.imgur.com/R1HswrA.png)

### Search Latency
It allows you to see search latency to determine when additional infrastructure is needed.

![Appbase.io Search Latency](https://i.imgur.com/2q49EjJ.png)

### Custom Analytics
Although we provide built-in support for the most important analytics, it should be possible for our customers to record and track the custom events with minimal effort. These events will get recorded with the appbase.io analytics which can be used to filter out the analytics from the appbase.io dashboard later.

<strong>The custom analytics feature allows you to build your own analytics on top of the Appbase.io analytics.</strong>

For example, a movie store app owner wants to filter out the analytics for the free users who are using the android device to make the search requests. You can read the [docs](/docs/analytics/Implement/#how-to-implement-custom-events) to know how to work with custom events.

<br/>
<img src="/images/gifs/custom-analytics.gif" alt="Appbase.io Custom Analytics" />

### Record Analytics
We have created some open-source libraries that make recording most of the analytics possible out-of-the-box. And we also have the REST APIs that allow users to use them to power their own end-user analytics or internal analytics.
Please check the [docs](/docs/analytics/Implement/) to learn how to record the appbase.io analytics.

We are actively working on to get the best out of the elasticsearch, personalization and NLP based search is in our roadmap & soon will be available for the customers. We hope you like it and we'll be happy to hear the feedback from you. You can reach out to us on twitter or email us at info@appbase.io.