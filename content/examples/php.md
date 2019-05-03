---
title: 'PHP'
meta_title: 'Examples to PHP'
meta_description: 'Interactive examples with PHP'
keywords:
    - php
    - examples
    - appbase
    - elasticsearch
sidebar: 'api-reference'
---

Interactive examples with PHP

### Setting things up

Before we start using the appbase.io REST API, we’ll need to set up an appbase.io app.

For this tutorial, we have used a <a href="https://opensource.appbase.io/dejavu/live/#?input_state=XQAAAAKLAQAAAAAAAAA9iIqnY-B2BnTZGEQz6wkFsW71dAzA7YYc-SS2NBdZOu2iiqUDTwzb8SRY-P60qxz_ZFKoJgMwEJushaRl-FxMxQqDCBLVG-xBlA5HfOZXDzUuGnntd_Zw9u4C0YdVJQ8HvMJrVO8AfQy73d9wq7TjySsVRv-NAKU5ZUw4jxU0ynrQflgPkDLN6AGDv4jeOi8Ir9BBSZ-bdv4J2oq7eCzLoC-gl9qTZsTRLHsXPhHvClG5we6nqctwdPgHqEWqj25nG0qo1RkmJYY_ZTF4XEJcMQyIw-2Rck0OE-ZTR7g8d3ste2uR2u9JbeJj9fjtjVNDltaQGN8jaAdUVVriYpB2CzgXN__Rv9tA&editable=false" target="_blank">sample app</a> containing some dummy housing records. All the examples use this app. You can also clone this app (to create your own private app) directly by clicking "Clone this app" in the <a href="https://opensource.appbase.io/dejavu/live/#?input_state=XQAAAAKLAQAAAAAAAAA9iIqnY-B2BnTZGEQz6wkFsW71dAzA7YYc-SS2NBdZOu2iiqUDTwzb8SRY-P60qxz_ZFKoJgMwEJushaRl-FxMxQqDCBLVG-xBlA5HfOZXDzUuGnntd_Zw9u4C0YdVJQ8HvMJrVO8AfQy73d9wq7TjySsVRv-NAKU5ZUw4jxU0ynrQflgPkDLN6AGDv4jeOi8Ir9BBSZ-bdv4J2oq7eCzLoC-gl9qTZsTRLHsXPhHvClG5we6nqctwdPgHqEWqj25nG0qo1RkmJYY_ZTF4XEJcMQyIw-2Rck0OE-ZTR7g8d3ste2uR2u9JbeJj9fjtjVNDltaQGN8jaAdUVVriYpB2CzgXN__Rv9tA&editable=false" target="_blank">data browser view of the app here</a>.

<br/>

<a target="_blank" href="https://opensource.appbase.io/dejavu/live/#?input_state=XQAAAAKLAQAAAAAAAAA9iIqnY-B2BnTZGEQz6wkFsW71dAzA7YYc-SS2NBdZOu2iiqUDTwzb8SRY-P60qxz_ZFKoJgMwEJushaRl-FxMxQqDCBLVG-xBlA5HfOZXDzUuGnntd_Zw9u4C0YdVJQ8HvMJrVO8AfQy73d9wq7TjySsVRv-NAKU5ZUw4jxU0ynrQflgPkDLN6AGDv4jeOi8Ir9BBSZ-bdv4J2oq7eCzLoC-gl9qTZsTRLHsXPhHvClG5we6nqctwdPgHqEWqj25nG0qo1RkmJYY_ZTF4XEJcMQyIw-2Rck0OE-ZTR7g8d3ste2uR2u9JbeJj9fjtjVNDltaQGN8jaAdUVVriYpB2CzgXN__Rv9tA&editable=false">
<img alt="Dataset" src="https://i.imgur.com/erNycvVg.png" />
</a>

All the records are structured in the following format:

```js

{
    "name": "The White House",
    "room_type": "Private room",
    "property_type": "Townhouse",
    "price": 124,
    "has_availability": true,
    "accommodates": 2,
    "bedrooms": 1,
    "bathrooms": 1.5,
    "beds": 1,
    "bed_type": "Real Bed",
    "host_image": "https://host_image.link",
    "host_name": "Alyson",
    "image": "https://image.link",
    "listing_url": "https://www.airbnb.com/rooms/6644628",
    "location": {
        "lat": 47.53540733743967,
        "lon": -122.27983057017123
    },
    "date_from": 20170426,
    "date_to": 20170421,
}
```

To interact with our app instance, we'll use <a href="http://php.net/curl" target="_blank">`cURL`</a> library from PHP to make HTTP REST API requests. The semantics should remain the same for any other HTTP library as well.

This is the common code which exists in all examples. Here, we simply create a `$curl` object and set request options with `url`, `credentials`, [`app`](/concepts/datamodel.html#app-span-stylefont-weight-200aka-indexspan), [`type`](/concepts/datamodel.html#type) and the query request.

```php

$curl = curl_init();

curl_setopt_array($curl, array(
  // Request URL containing app, type and id or method
  CURLOPT_URL => "https://scalr.api.appbase.io/{{app}}/{{type}}/{{id/method}}",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  // Request HTTP method ( GET | POST | PUT | DELETE )
  CURLOPT_CUSTOMREQUEST => "{{http_method}}",
  // Request body/payload
  CURLOPT_POSTFIELDS => "{{query_request}}",
  CURLOPT_HTTPHEADER => array(
    // App credentials base64 encoded
    "Authorization: Basic {{credentials_base64}}",
    "Content-Type: application/json"
  ),
));

$response = curl_exec($curl);
```

> Note <span class="fa fa-info-circle"></span>
>
> If you are using your own app instance, make sure to update `CURLOPT_URL` with your `app`, `type` and `CURLOPT_HTTPHEADER` with your `credentials`.

## Fetch All

Before with start with all the fancy queries, let's write a query to fetch all the records in the app.

We'll use the <a href="https://rest.appbase.io/#8ba42b07-46a6-0c0b-5ebc-cf4d54411fc7" target="_blank">`/_search`</a> endpoint from appbase.io REST API to fire a `POST` request with the body containing a <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-all-query.html" target="_blank">match_all</a> query.

> Note <span class="fa fa-info-circle"></span>
>
> Feel free to play around the query by making changes in the interactive demo. Make sure to hit the run button after every change.

<iframe height="600px" width="100%" src="https://repl.it/@dhruvdutt/Appbaseio-PHP-search?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

You can also see this query in <a href="https://opensource.appbase.io/mirage" target="_blank">Mirage</a> - a GUI for Elasticsearch queries which provides a query explorer view to interact with an app's data. <a href="https://opensource.appbase.io/mirage/#?input_state=XQAAAAKxBgAAAAAAAAA9iIhnNAWbsswtYjeQNZkpzQK4_mOzUeDpWmI_q1W5J_v7Zsy4Ujaaw71A1BS9rYYbaidH1ngBtQ-I1sDSXRgrmGsCDzBYBoUXwDHQtefpH-PChYyyKqpnVdVrmIsxvIDhOBtThtu_W53GnLmSMoma1UPnh9E7LZRkgXxp3ltXA31wX1fcfowk1r2gVrCN8VgmuPFOWM3o65_HcKkYs4OQ0hAB7hnHy3CILQ5MgAbYZpuCAVHzQcRXBvN2fFZCuSpDQ9kUuOUgEQayJrMjPDHPMTo8qfXwTqnVrh0i_m9y1THrKxTMAfWfwwcedk3CUDAtRXNAADtgrM-AaohtxKZzBXKYRVHTyXyN8U2PEG0TC5uCuzoWoVyTkFzDCLZfyS8mJZJi6QdiEljmtIaslKsXVKOVZq7BPE8P0_xjUwf2hab_384tlhzDPxsBXQcl_ZyL9z8nGByMgfVBfcAvN8jcKriHmOuSZHh7DoVhqXxspPjLExJuHw6BVhFIXXfujcpB1bg9kwQpr87uWrDXXXGwtomqn-zsQQLibaxdSGP4ySERan0TXumqxWGHLQvH6ZZCZ4NznC3TzgqJwoP2_LDBXippb1sz4nAIBur_E-tAUX7hSago0yzRrJn7wmI7" target="_blank">Here's</a> the same query executed on Mirage.

> Note <span class="fa fa-info-circle"></span>
>
> You can use any query parameters such as `from` and `size` that are <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html#_parameters_4" target="_blank">supported by Query DSL</a>.

## Index Data

Next, let's add some data to our app.

We'll use the <a href="https://rest.appbase.io/#1a63955c-96e6-7a85-215b-98cf809565ef" target="_blank">`/id`</a> endpoint from appbase.io REST API specifying the id `H1` and fire a `PUT` request with the body containing a simple JSON object with some housing data.

<br/>

<iframe height="600px" width="100%" src="https://repl.it/@dhruvdutt/Appbaseio-PHP-index?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

> Note <i class="fa fa-info-circle"></i>
>
> If you intended to autogenerate `id`, do a `POST` request instead and don't pass any `id` with the URL. We'll autogenerate it for you.

## Fetch Data

Let's learn how to fetch or read the data present at specific `id` location.

We'll use the <a href="https://rest.appbase.io/#1a63955c-96e6-7a85-215b-98cf809565ef" target="_blank">`/id`</a> endpoint from appbase.io REST API specifying the id `H1` and fire a `GET` request.

<br/>

<iframe height="600px" width="100%" src="https://repl.it/@dhruvdutt/Appbaseio-PHP-get?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

## Bulk Index Data

Let's now learn to index multiple documents in one request. For this, we'll use <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html" target="_blank">Bulk API</a> to perform many index/delete operations in a single API call.

<br/>

<iframe height="600px" width="100%" src="https://repl.it/@dhruvdutt/Appbaseio-Go-Bulk-Index-Data?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

> Note <i class="fa fa-info-circle"></i>
>
> It is recommended to index up to 1 MB of data (~500 documents) at a time (so if you have 50,000 documents, you can split them into chunks of 500 documents and index).

## Range Query

Let's now query the dataset to get all rooms between prices 50 to 100.

We'll use the <a href="https://rest.appbase.io/#8ba42b07-46a6-0c0b-5ebc-cf4d54411fc7" target="_blank">`/_search`</a> endpoint from appbase.io REST API to fire a `POST` request with the body containing a <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html" target="_blank">range query</a> by passing the field `price` and specifying <a href="https://www.elastic.co/guide/en/elasticsearch/reference/1.6/query-dsl-range-filter.html" target="_blank">range filter</a> values.

<br/>

<iframe height="600px" width="100%" src="https://repl.it/@dhruvdutt/Appbaseio-PHP-range?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

<a href="https://opensource.appbase.io/mirage/#?input_state=XQAAAAJfCAAAAAAAAAA9iIhnNAWbsswtYjeQNZkpzQK4_mOzUeDpWmI_q1W5J_v7Zsy4Ujaaw71A1BS9rYYbaidH1ngBtQ-I1sDSXRgrmGsCDzBYBoUXwDHQtefpH-PChYyyKqpnVdVrmIsxvIDhOBtThtu_W53GnLmSMoma1UPnh9E7LZRkgXxp3ltXA31wX1fcfowk1r2gVrCN8VgmuPFOWM3o65_HcKkYs4OQ0hAB7hnHy3CILQ5MgAbYZpuCAVHzQcRXBvN2fFZCuCSUNYX32cshZ3d4lrzfi6fQXgJyuLDjbofRzIiFdNbnDTxOh7awm5G8KyWubtxOjtXV8bilwzwGRcwaa6Vwl0TchA1_BpzJh_fwAq12FFL4R-I5_ibh6CZnEvt4-KnlIuy77b7P8zLtJY5p9O0p5F9in_I1bpUcoSjIVyDVUw7CO3XhqV8GV08WBceOu8bcrsKmeZnI-Tz7wJnFBanEKKCvxmdgNX5iWOlyqb-KulI-V5b7Kd0MnlaLDE9KV4rJlTuHN38cafRSw9KFDmA369s6KHGfK4E8tjcHhkopCEWlojhNy-YDYrfkpB4hBkSRnaoc-Ehh6YMq5B_KZpn0W096kfKkWqUYOqjJkBPWLydygFC5kxq4739mGAfM8pTAFnMN5Qt7qFqbuST9fmTei6v0lp3RT2Uxd9LVAqm3Zwpe8RBtPFYbcd_j8RuCqd4O1HeEgZz60qAFmYL37FBNNLpbxT4mhagGqPSzB6jDCruEgDwj6598PSwxTs3SBIqdZtuv_ZTluhF7jvFMerbm7dw7E8yu-B3jNfPoGW9bTfiMthMn620XFd8bmenoEP8pWq4A" target="_blank">Here's</a> the same query executed on Mirage.

## GeoDistance Query

Let's now get a list of all the rooms available within a certain distance from a specific geopoint (lat,lon) location.

We'll use the <a href="https://rest.appbase.io/#8ba42b07-46a6-0c0b-5ebc-cf4d54411fc7" target="_blank">`/_search`</a> endpoint from appbase.io REST API to fire a `POST` request with the body containing a <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-query.html" target="_blank">geodistance query</a> specifying `distance` and `location` co-ordinates.

<br/>

<iframe height="600px" width="100%" src="https://repl.it/@dhruvdutt/Appbaseio-PHP-GeoDistance?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

## Full-text Search

Here, we will apply a full-text search query on a field with a n-gram analyzer applied to it. Instead of indexing the exact field value, an n-gram indexes multiple grams that constitute the field value when indexing. This allows for a granular querying experience, where even partial field values can be matched back, really useful when building auto-suggestion based search. You can read more about <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-ngram-tokenizer.html" target="_blank">n-grams here</a>.

We'll do a <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-queries.html" target="_blank">full-text search query</a> on the `name` field by using the <a href="https://rest.appbase.io/#8ba42b07-46a6-0c0b-5ebc-cf4d54411fc7" target="_blank">`/_search`</a> endpoint from appbase.io REST API to fire a `POST` request with the body containing a <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html" target="_blank">match query</a> with our n-gram analyzed field `name` and query value.

<br/>

<iframe height="600px" width="100%" src="https://repl.it/@dhruvdutt/Appbaseio-PHP-search-full-text-search?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

<a href="https://opensource.appbase.io/mirage/#?input_state=XQAAAAJECAAAAAAAAAA9iIhnNAWbsswtYjeQNZkpzQK4_mOzUeDpWmI_q1W5J_v7Zsy4Ujaaw71A1BS9rYYbaidH1ngBtQ-I1sDSXRgrmGsCDzBYBoUXwDHQtefpH-PChYyyKqpnVdVrmIsxvIDhOBtThtu_W53GnLmSMoma1UPnh9E7LZRkgXxp3ltXA31wX1fcfowk1r2gVrCN8VgmuPFOWM3o65_HcKkYs4OQ0hAB7hnHy3CILQ5MgAbYZpuCAVHzQcRXBvN2fFZCuCSUNYX32cshZ3d4lrzfi6fQXgJyuLD9FQ2b9UTowlML6Nz4Yks98Jl7CJT4M9dwoB120x3nAWa0b3eGo0atyqfsIkzvPRvAw8Ddhk3GgfPWO89QhrRGa7aEJfIBGZp4mr5z7Obgqy1kuYQRxt49gfXMU4i0_MaNukRWcuQ80KCArF8kEWtHU4AkBintV4KQfISdv_apJGxZs_AgHIcOY0rV6Go0ZYm2k5lZhz2NOhIg4JE5AAGRL38xEasregHkxqxMKt8LNtS5xI7TDhwVJjjPD6I3koSwVcSkfrS4RAsK07SkpDDRvGr5HW8Kkpz0jt8nieWpiyEHlH0PoWS3I_osL6NH7CIGJCZBGSoHBHIbj1oQeL0P3BQVw18O4fMfWH89P6KH1TWZhD2zvCwr48PmopeLcRCtJnXqMXSsCmUqKOTx6MtcmTn-ayiX-IAwpMHpVvyY9k7HDSjc5XKAm_EZTP0en62xzp0ZvL4HlRj_1FB8G8lBF6j6at6gwn51KBo4W8n8s5i1_N4jGSU5HRaTnO_5mtZY1tD6CxTRfcJM3ziGy1Qr4Zj_0jWmGg" target="_blank">Here's</a> the same query executed on Mirage.

## Date Query

Let's now do a date query to get houses that are available between certain dates. As per our mapping (aka data schema), we'll need to use `date_from` and `date_to` fields for querying by the date range.

We'll use the <a href="https://rest.appbase.io/#8ba42b07-46a6-0c0b-5ebc-cf4d54411fc7" target="_blank">`/_search`</a> endpoint from appbase.io REST API to fire a `POST` request with the body containing a <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html" target="_blank">range query</a> with our field `name` and query values.

<br/>

<iframe height="600px" width="100%" src="https://repl.it/@dhruvdutt/Appbaseio-PHP-search-date?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

<a href="https://opensource.appbase.io/mirage/#?input_state=XQAAAAJpCQAAAAAAAAA9iIhnNAWbsswtYjeQNZkpzQK4_mOzUeDpWmI_q1W5J_v7Zsy4Ujaaw71A1BS9rYYbaidH1ngBtQ-I1sDSXRgrmGsCDzBYBoUXwDHQtefpH-PChYyyKqpnVdVrmIsxvIDhOBtThtu_W53GnLmSMoma1UPnh9E7LZRkgXxp3ltXA31wX1fcfowk1r2gVrCN8VgmuPFOWM3o65_HcKkYs4OQ0hAB7hnHy3CILQ5MgAbYZpuCAVHzQcRXBvN2fFZCuCSUNYX32cshZ3d4lrzfi6fQXgJyuLD9FQ2b9UTowlML6Nz4Yks97ESi2tvouDUu23ZYMcOZS3IWRcMxVX5iL_A3K9p25ewhri1rZX4gJl5IUXCoc2inGiafMm0L4xjXz_xDspYFpw62yj3Rl_W6oQvuB08JBYuabPOZB-afI3ADbq6WygsK7w3IKWq3Un8UvwZDRrn3570Nh5QOvxtA5eODOovGVa5CQSvvlE2MdOaYPr2M9DNI7ggOMs-nAEIXUtYlPNX9XbcoNsWnc93gIebBu3MRTuwS4OZmXOBSAJRakqcUNV6IqSwDVb8gs-MhmK9SY74Zn-eRfO7Xaz9C6tZmLMgHyMBqjFZpBDvd2WsT8difxLdR3her8wvviKure25Gk4gS4uBYtmqosWikFwt5C9vJAWzWY0owIVRjx4i2jiY2qJQGGqDAuEE0fTAgqFMnroa7CC6bJpptSCXC-DX-yTUurzZw3TTVXK5o_sUT2BFr-ZDYWOR926oLnc8Zu6yk8VLevJSQLREo2CtMBGsubbdYkApTRBeriurgo1KXAtrnto2RQKIS26UxNv5ZnPvOHxidI_2oSsWiIwq51sd2-0sTEwcKlv09Zlgn0HmFSf-ZC_DQ" target="_blank">Here's</a> the same query executed on Mirage.

## Compound Query

Finally, let's do a compound query that combines multiple queries together. We'll take an example of fetching a specific `room_type` of rooms that are within the specified price range.

We'll use the <a href="https://rest.appbase.io/#8ba42b07-46a6-0c0b-5ebc-cf4d54411fc7" target="_blank">`/_search`</a> endpoint from appbase.io REST API to fire a `POST` request with the body containing a <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html" target="_blank">bool query</a> combining a <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html" target="_blank">match query</a> for `room_type` and a <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html" target="_blank">range query</a> for `price`.

<br/>

<iframe height="600px" width="100%" src="https://repl.it/@dhruvdutt/Appbaseio-PHP-search-compound?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

<a href="https://opensource.appbase.io/mirage/#?input_state=XQAAAAJpCQAAAAAAAAA9iIhnNAWbsswtYjeQNZkpzQK4_mOzUeDpWmI_q1W5J_v7Zsy4Ujaaw71A1BS9rYYbaidH1ngBtQ-I1sDSXRgrmGsCDzBYBoUXwDHQtefpH-PChYyyKqpnVdVrmIsxvIDhOBtThtu_W53GnLmSMoma1UPnh9E7LZRkgXxp3ltXA31wX1fcfowk1r2gVrCN8VgmuPFOWM3o65_HcKkYs4OQ0hAB7hnHy3CILQ5MgAbYZpuCAVHzQcRXBvN2fFZCuCSUNYX32cshZ3d4lrzfi6fQXgJyuLD9FQ2b9UTowlML6Nz4Yks97ESi2tvouDUu23ZYMcOZS3IWRcMxVX5iL_A3K9p25ewhri1rZX4gJl5IUXCoc2inGiafMm0L4xjXz_xDspYFpw62yj3Rl_W6oQvuB08JBYuabPOZB-afI3ADbq6WygsK7w3IKWq3Un8UvwZDRrn3570Nh5QOvxtA5eODOovGVa5CQSvvlE2MdOaYPr2M9DNI7ggOMs-nAEIXUtYlPNX9XbcoNsWnc93gIebBu3MRTuwS4OZmXOBSAJRakqcUNV6IqSwDVb8gs-MhmK9SY74Zn-eRfO7Xaz9C6tZmLMgHyMBqjFZpBDvd2WsT8difxLdR3her8wvviKure25Gk4gS4uBYtmqosWikFwt5C9vJAWzWY0owIVRjx4i2jiY2qJQGGqDAuEE0fTAgqFMnroa7CC6bJpptSCXC-DX-yTUurzZw3TTVXK5o_sUT2BFr-ZDYWOR926oLnc8Zu6yk8VLevJSQLREo2CtMBGsubbdYkApTRBeriurgo1KXAtrnto2RQKIS26UxNv5ZnPvOHxidI_2oSsWiIwq51sd2-0sTEwcKlv09Zlgn0HmFSf-ZC_DQ" target="_blank">Here's</a> the same query executed on Mirage.

### Further Reading

appbase.io REST API methods provide full <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html" target="_blank">Query DSL</a> support and there are lots of use-cases that are unlocked by constructing various types of queries. Feel free to use our <a href="https://opensource.appbase.io/mirage/" target="_blank">GUI query explorer</a> to construct complex queries easily.

There are many more methods provided by the appbase.io REST API other than the ones we used. The full API reference with example snippets in cURL, Ruby, Python, Node, PHP, Go, jQuery can be browsed at <a href="https://rest.appbase.io/" target="_blank">rest.appbase.io</a>.
