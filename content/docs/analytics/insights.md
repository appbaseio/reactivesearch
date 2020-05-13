---
title: 'Analytics Insights'
meta_title: 'Appbase.io analytics insights'
meta_description: 'Appbase.io insights is a monthly insights report into improving your search performance compiled by our team of search experts.'
keywords:
    - concepts
    - appbase
    - analytics
    - implement
    - insights
    - business
sidebar: 'docs'
---

### Analytics Insights
Analytics Insights provides tips and tricks for your business based on the recent activities of your business. Apbbase.io tracks the search activity of your users and discovers the important changes in your analytics data and from that, we prepare a list of insights with the recommendations so you can take meaningful action to improve your search experience.

Analytics Insights helps you to quickly assess that <b>what is going correct and what went wrong</b>. If something is not going well for your business and there is room to improve then we provide a set of recommendations for that particular insight so you can take the next steps.

<div style="height: 0; padding-bottom: calc(51.81% + 35px); position:relative; width: 100%;"><iframe allow="autoplay; gyroscope;" allowfullscreen height="100%" referrerpolicy="strict-origin" src="https://www.kapwing.com/e/5ebbc3276baaa5001357bf40" style="border:0; height:100%; left:0; overflow:hidden; position:absolute; top:0; width:100%" title="Embedded content made with Kapwing" width="100%"></iframe></div>

### Each Insight Explained
Let us explain the most important insights and their purposes.

#### No Results Searches
This insight helps you to find how many searches have been performed by users for which you have no results. A higher value for no result searches is not a good sign for business because you may lose customers traction.

#### Low Clicks
Low clicks mean that people are not finding the exact thing for which they're searching.

#### Low Suggestions Clicks
If you have low suggestions clicks then it indicates that your search is not showing relevant suggestions to the users.

#### Higher Click Position
If the click position is higher than it means that your users are having difficulty finding the desired results at the top.

#### Popular Searches
This insight helps you to find the total number of popular searches made by users. A higher value indicates that your business is doing really well.

#### Popular Searches with Low Clicks
If something is popular among users but you're not getting clicks then it means that your results for popular searches are not relevant.

#### Long Tail Searches
Long-tail searches insight represents that users have to type more to search the results i.e the suggestions which you're showing in search are not much useful.

#### Higher Bounce Rate
The bounce rate represents how many users are visiting your search page and leaving it without interacting with the search. Higher bounce insight is reported when the bounce rate becomes more than 50%. 

#### High Response Time
If you see that insight then it means that you're search is slow and required some additional infrastructure.

#### Client-side Errors
Client-side errors indicate that your search requests are getting failed because of bad requests from the client-side.

#### Server Errors
Internal server errors indicate an issue with the underlying ElasticSearch service.

### Insights via API

You can also get insights by using API.

Check the API reference over [here](https://arc-api.appbase.io/?version=latest#4bb9a282-586d-4e1b-aa46-79359665769c).

```bash
curl --location --request GET 'http://{{user}}:{{password}}@{{host}}/_analytics/insights'
```