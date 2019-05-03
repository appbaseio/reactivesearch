---
title: 'Queries with Go'
meta_title: 'Queries with Golang'
meta_description: 'go-appbase is a universal Golang client library for working with the appbase.io database.'
keywords:
    - queries
    - golang
    - appbase
    - elasticsearch
sidebar: 'api-reference'
---

In the previous article [`Golang Quickstart`](/go/quickstart), we saw how to index new data and stream both individual data as well as query results. Now, we shall go ahead and explore some complex queries with `ElasticSearch` using our [`go-appbase` library](https://godoc.org/github.com/appbaseio/go-appbase/).

For this tutorial, we will use an app called `gitxplore-live`. The credentials for this app are `2FPZ2UJQW:1c50c6df-4652-4d74-906b-7bc0a6a731b6`.

You can browse the app's data by clicking the image below.

[![Image](https://i.imgur.com/Pvh2btF.png)](https://appbaseio.github.io/dejavu/live/#?input_state=XQAAAAKvAQAAAAAAAAA9iIqnY-B2BnTZGEQz6wkFsXzANcEiOj1t75YJPmGw7xeXjnOyOKwcTIJQljSmiDlmnS0idduXRCWx36R0WY9_Vp2OeiWvs5xdlMjiRDDupmmjgc5kXonz8uq6m2RqZAJEc_g63epaXm2VZJ6P017RqXwhNW50YP02uGPJzw_wlnNHejyw3A55t32cUtVwYDVOtKa99NwNlFHAdl3uj_6iHw3B-0vHqDKRryA5CsywM3FCsu23ODTNzechJe-gmxprZA9mVWAEtVsHlY2xwiEtAoUv2y01q-PbwwQRWgvPawZOg_2FMxpSdtTlo3pM6GtNC58SfDg-9XlSibEGCXddBtwfsFtLe__m9Bxxb4Ko1ga01UaH5Ww5n5_KJWXsgh17HlNH_vawxqo)

## Date Range Query

When we need to query all documents in a particular range of dates we use [`range`](https://www.elastic.co/guide/en/elasticsearch/reference/5.6/query-dsl-range-query.html) clause. See the example below to understand how it works.

```go
client, _ := appbase.NewClient("https://scalr.api.appbase.io", "2FPZ2UJQW", "1c50c6df-4652-4d74-906b-7bc0a6a731b6", "gitxplore-live")
err := client.Ping()
if err != nil {
	log.Println(err)
}
fmt.Println("Client created")

const testtype string = "gitxplore-live"
const dateQuery string = `{
	"query": {
		"range" : {
			"created" : {
				"gte" : "2015-10-29T14:37:16Z",
				"lte" : "2017-10-29T14:37:16Z"
			}
		}
	}
}`

searchResponse, err := client.Search().Type(testtype).Body(dateQuery).Do()
if err != nil {
	log.Println(err)
	return
}
fmt.Println("Total Hits for the range of dates is: ", searchResponse.Hits.TotalHits)
```

```go
searchResponse: {
	Total Hits for the range of dates is: 4684
}
```

`Note:` To print the document as well you need to add the following lines to the code:

```go
document, err := json.MarshalIndent(*searchResponse.Hits, "", "  ")
if err != nil {
	log.Println(err)
}
fmt.Println(string(document))
```

Play with `Date Range` query on [Mirage](https://appbaseio.github.io/mirage/#?input_state=XQAAAAKjDAAAAAAAAAA9iIhnNAWbsswtYjeQNZkpzQK4_mOzUeDpWmFX40My38I2h2kWQlEdacvCMz6CtrX2pl2yy1LFtI8PefTkjddNtb1d4yacMv2ni8qYGp6yBtb_-oP0y6NadalvEMEYzWi_LqQ9mRe7P0mnWEZnms4MVU1rDLGSaeM2Mz8PnBpHlB8ozXiqBjd1HlXOyeHMn5YveDpjt6BIMyLyGa2t8hZgMVZjYLCqQfjpLtkwgaEOmm2R1JmcWDyJyLna4GMxMs4r-IB62CWjJDzP0z4x-RfvS62oJTV_QWTdNhkUbqBUiFBhVVl7-ayTdtv0yCAHx1AgpRTttjFd4ziRvtuIUg-5cVTilejvGrcHV_zB-iUoIEyNw5oEixmlR__80-CEG1Fja4GkFx9ETbv2QdsGGn22U9T2_1kfEf9XhFy5c0H1qTaIr137ek9KgLguG4emUkj6MnknmSprSHbURPySNcuAKnaYYjePFPTTSIHxQDAQ7RdlJzujWuYAacOdO4OjlQdU96tb-FK2nQzFB0mP1kyhhejGrLO6YEQBgMNIDPYDYVK3XPImr1le4xw97v7k54s2XRwUVLDUrBBsR_6sfGPc5w6PWXcU0xCCQE6xc8k-0PlcVhoiKKE5NcR7Io9ysbZiHDQ4ZEgs8W44LlW2I0TToEfTCsd7SMVL661-3NGlbXia_vfdkHdIaO43IUQhItj4fYSdCnQrxiNNQbrGfbbYR_JvBxpwbGZhDHB_seCPImnEsJmlQkXq4iTbcu-MZKKdfNNg6r4tvUKDOlwIZk2aLJdfQFsuds-00lw6YiLFFgqtIm9Cqt-7iwYP_7opRD_LupUmvGOqygxSWXZTHZTDM8pQkx2lUYsCZ24Hxv9nFfbzexACj_JwPx9v2BbSHdnRQPUBEEp2WuTVHV7-PzYcr_DYEvXUb0f7YgadA34jGq1ToVfziz55WegG91abrNie8ba-Tt_a3zjW4ZzFOLOjdQx0QxY4IZk5FV__9PC9Ng).

## Compound Query

Now we shall look into a compound query where we want to get those documents which are within the specified dates and have a particular term in one of the fields. The following example will return all the documents which have `JavaScript` in their `language` field and which were `created` on or after `2015-10-29T14:37:16Z` till `2017-10-29T14:37:16Z`.

```go
client, _ := appbase.NewClient("https://scalr.api.appbase.io", "2FPZ2UJQW", "1c50c6df-4652-4d74-906b-7bc0a6a731b6", "gitxplore-live")
err := client.Ping()
if err != nil {
	log.Println(err)
}
fmt.Println("Client created")

const testtype string = "gitxplore-live"
const matchDateTermQuery string = `{
	"query": {
		"bool": {
			"must": [
				{
					"range": {
						"created": {
							"gte": "2015-10-29T14:37:16Z",
							"lte": "2017-10-29T14:37:16Z"
						}
					}
				},
				{
					"term": {
						"language": "javascript"
					}
				}
			]
		}
	}
}`
dateTermQueryResponse, err := client.Search().Type(testtype).Body(matchDateTermQuery).Do()
if err != nil {
	log.Println(err)
	return
}
fmt.Println("Total Hits for the range of dates with JavaScript term is: ", dateTermQueryResponse.Hits.TotalHits)
```

```go
dateTermQueryResponse: {
	Total Hits for the range of dates with JavaScript term is: 1022
}
```

Play with the `Compound Query` on [Mirage](https://appbaseio.github.io/mirage/#?input_state=XQAAAAKjDQAAAAAAAAA9iIhnNAWbsswtYjeQNZkpzQK4_mOzUeDpWmFX40My38I2h2kWQlEdacvCMz6CtrX2pl2yy1LFtI8PefTkjddNtb1d4yacMv2ni8qYGp6yBtb_-oP0y6NadalvEMEYzWi_LqQ9mRe7P0mnWEZnms4MVU1rDLGSaeM2Mz8PnBpHlB8ozXiqBjd1HlXOyeHMn5YveDpjt6BIMyLyGa2t8hZgMVZjYLCqQfjpLtkwgaEOmm2R1JmcWDyJyLna4GMxMs4r-IB62CWjJFpLSDvyu_mM_MRP6uJO6YtZ1uAe6otWHfaTGdC0cxa9cI8wzgGM5DGHwlCi6yWsTDaMALy_ouzQPdvMlfC0R33CUIu4Srx5Y_RTVjfq7sgdA1pmIhH1TlbmHWFbS7Y2cSdo73pq__lkqlolbbhPZkrg5VGkcVMRnSPlXnl0R0DVyRCtRNmIufdi0SCVGdQ7UTeFQu4Mu55hvYDBx9bQDnmn65slHhyYDYPONMMTj1Zv2fSSFBPLzyjMewBW_D80IYf62i3y40sVIyl4XT8tvYfju_xNyYIzxs_CP14Tyk9Z5Uzmo2oBOkX1G2mJf_2zq2vhSPiEg5QxXeuAlBIyh7xvA2vDEhdj5jKk-c7R8YzS2u-T5zcbMi-eprfIDSqrxH-8Ut8eOMW_ADsC-VpgzMwEYDuk46L4q7SrQOwI1gkHMGUpX1qTidBjy-AxynwKD-9hDVx770vjaB5A03AoAe1DLq6lpXYtc2gZsXIXRtQJ8Wof4hvioPtuU9513JCxA-i1vLkDU7X_3H9xWUxz-y-PgqXpVb9ojze1BVplnUzZhYZKEUbQOcRNPF4oU3zBJcoRJDaONGkAmsB86bNtMiUQ9mshgjI-0aHBCu4k1zLGlLaFr0NA1l8mAlIldUZsTQp6OoBfDb7VH2mIAfcDWCacI2LpvFQyiUjtxNb5o2ZtbtN__pg0Dn013s1_aCXnYT77vE16-00EyWKlAPYAt8lDmEjStGj0kTBB6XPlZfn7Wy3eL6qFcrEyKz8KFbqe4sW6_Gr-1XNTmFnMz_88lnAA).
We can further extend the above query to contain more nested `bool` clauses. You can read more about it [here](https://www.elastic.co/guide/en/elasticsearch/reference/5.6/query-dsl-bool-query.html).

## Sorting Query Results

We need to add [`sort`](https://www.elastic.co/guide/en/elasticsearch/reference/5.6/search-request-sort.html) clause to the query to sort the `returned documents`. It takes `asc` (sorts in ascending order) or `desc` (sorts in descending order) as parameter to `order`. Say if we wanted to sort the response of our previous query in ascending order of its `created` date, the query would change to:

```go
const matchDateTermQuery string = `{
	"query": {
		"bool": {
			"must": [
				{
					"range": {
						"created": {
							"gte": "2015-10-29T14:37:16Z",
							"lte": "2017-10-29T14:37:16Z"
						}
					}
				},
				{
					"term": {
						"language": "javascript"
					}
				}
			]
		}
	},
	"sort": [
		{
			"created": {
				"order": "asc"
			}
		}
	]
}`
```

Play with the `Sorting Query Results` on [Mirage](https://appbaseio.github.io/mirage/#?input_state=XQAAAAIUDgAAAAAAAAA9iIhnNAWbsswtYjeQNZkpzQK4_mOzUeDpWmFX40My38I2h2kWQlEdacvCMz6CtrX2pl2yy1LFtI8PefTkjddNtb1d4yacMv2ni8qYGp6yBtb_-oP0y6NadalvEMEYzWi_LqQ9mRe7P0mnWEZnms4MVU1rDLGSaeM2Mz8PnBpHlB8ozXiqBjd1HlXOyeHMn5YveDpjt6BIMyLyGa2t8hZgMVZjYLCqQfjpLtkwgaEOmm2R1JmcWDyJyLna4GMxMs4r-IB62CWjJFpLSDvyu_mM_MRP6uJO6YtZ1uAe6otWHfaTGdC0cxa9cI8wzgGM5DGHwlCi6yWsTDaMALy_ouzQPdvMlfC0R33CUIu4Srx5Y_RTVjfq7sgdA1pmIhH1TlbmHWFbS7Y2cSdo73pq__lkqlolbbhPZkrg5VGkcVMRnSPlXnl0R0DVyRCtRNmIufdi0SCVGdQ7UTeFQu4Mu55hvYDBx9bQDnmn65slHhyYDYPONMMTj1Zv2fSSFBPLzyjMewBW_D80IYf62i3y40sVIyl4XT8tvYfju_xNyYIzxs_CP14Tyk9Z5Uzmo2oBOkX1G2mJf_2zq2vhSPiEg5QxXeuAlBIyh7xvA2vDEhdj5jKk-c7R8YzS2u-T5zcbMi-eprfIDSqrxH-8Ut8eOMW_ADsC-VpgzMwEYDuk46L4q7SrQOwI1gkHMGUpX1qTidBjy-AxynwKD-9hDVx770vjaB5A03AoAe1DLq6lpXYtc2gZsXIXRtQJ8Wof4hvioPtuU9513JCxA-i1vLkDU7X_3H9xWUxz-y-PgqXpVb9ojze1BVplnUzZhYZKEUbQOcRNPF4oU3zBJcoRJDaONGkAmsB86bNtMiUQ9mshgjI-0aHBCu4k1zLGlLaFr0NA1l8mAlIldUZsTQp6OoBfDb7VH2mIAfcDWCacI2LpvFQyiUjtxNb5o2ZtbtN__pg0Dn01_c3h1mLOI81tetiuh8jXJbKfs-YktndNkYW3sse3idUuwAb_GiXVzPAOUyL2P0Hw5AW1USvc-jrjXpaSDvYT2FJL0KRZj5bxnz1Fw-wssO8dcdjBZUpsVW1noovQBBtB4I1a-zOtyuYoxdTmc4cXDq_8cl96).

## Match Query

[`match`](https://www.elastic.co/guide/en/elasticsearch/reference/5.6/query-dsl-match-query.html#query-dsl-match-query) clause is a simple match query. If matches if atleast one term from the query is present. The more the match the better is its score. For example, the below `matchQuery` when executed will return every document which has at least one of the term from the `plugin which` phrase in their `description` field.

```go
const matchQuery string = `{
	"query": {
		"match": {
			"description": "plugin which"
		}
	}
}`
```

It currently returns `980` documents for this query.
Play with the `Match Query` on [Mirage](https://appbaseio.github.io/mirage/#?input_state=XQAAAAJCDAAAAAAAAAA9iIhnNAWbsswtYjeQNZkpzQK4_mOzUeDpWmFX40My38I2h2kWQlEdacvCMz6CtrX2pl2yy1LFtI8PefTkjddNtb1d4yacMv2ni8qYGp6yBtb_-oP0y6NadalvEMEYzWi_LqQ9mRe7P0mnWEZnms4MVU1rDLGSaeM2Mz8PnBpHlB8ozXiqBjd1HlXOyeHMn5YveDpjt6BIMyLyGa2t8hZgMVZjYLCqQfjpLtkwgaEOmm2R1JmcWDyJyLna4GMxMs4r-IB62CWjJFpLSDvyu_mM_MRP6uJO6YtZ1uAe6otWHfaTGdC0cxa_xsuZSsaLNpDXeiG-sabfHGofyPzN4CQFey5kqLVoxtipdBv33cZVkzZf4twuvl7RLMIfabJ4R8PrE3_Z4Ha_i4OI4voih854V3oXAZTRrNXvAOd4nGcBhbA5hsu6Y26qfBWWLY-YOah1lhtmjSpgrImPBaONMNWHZdeASE0iRsxPcExtdQ5I_77IDD-DkClmdMVu7P5H3lmsrPVXARFokIjoD3FpmTupHqWmeCsjohjtlG-bAZxVfmJXQ4LPLh8iE_IWUVwfi0XyYGIIgPjnmHwAJ-FZvO8pwXlZVmcM7ITUcjUZhceV5FYIxuRkERT5efSDx331X8o9aO4BmdDn0-IVcWs60qSUn6ZOnoeMAPRBO9oalADxIPPgFBz87BvpDrUah43Bvx5Z76ps8xOrXnFH7CM3v-wKvBRcaXMX6HeUZjhlBXu_jZcEa6Htc_GDEEcBPcpYz0vZKRXd6DhEPg42sZ-Rovw7VdU0n3ZtyQCVxZY8qCTg718tQG56hTxrHLuErFpKu4vrC4QLy3FpWxHxrx5waotKrlI7_XPoWv3vMwf79mlSlryS8y7mT22vHr9hPplTkmq2F-IVfh9vXccVUKlE49BJzEbzgWT2MLboXtIDn3JAioFw9duR4o7-6V-c).

### Match Phrase Query

[`match_phrase`](https://www.elastic.co/guide/en/elasticsearch/reference/5.6/query-dsl-match-query-phrase.html#query-dsl-match-query-phrase) query matches only if all the terms from the query are present and in the same order. For example the below `matchPhraseQuery` when executed will return every document which has all of the terms from `plugin which` phrase and in the exact order in their `description` field.

```go
const matchPhraseQuery string = `{
	"query": {
		"match": {
			"description": "plugin which"
		}
	}
}`
```

It will return `16` documents for this query.
Play with the `Match Phrase` query on [Mirage](https://appbaseio.github.io/mirage/#?input_state=XQAAAAJXDAAAAAAAAAA9iIhnNAWbsswtYjeQNZkpzQK4_mOzUeDpWmFX40My38I2h2kWQlEdacvCMz6CtrX2pl2yy1LFtI8PefTkjddNtb1d4yacMv2ni8qYGp6yBtb_-oP0y6NadalvEMEYzWi_LqQ9mRe7P0mnWEZnms4MVU1rDLGSaeM2Mz8PnBpHlB8ozXiqBjd1HlXOyeHMn5YveDpjt6BIMyLyGa2t8hZgMVZjYLCqQfjpLtkwgaEOmm2R1JmcWDyJyLna4GMxMs4r-IB62CWjJFpLSDvyu_mM_MRP6uJO6YtZ1uAe6otWHfaTGdC0cxa_xsuZSsaLNpDXeiG-sabfHGofyPzN4CQFey5kqLVoxtjeFOBS1wgtRH20v8dO_fVXoyNW-gxcFmjOgeumWMW4kglNoWUm6DtUiOQZ1ZSNdiexjDTLyEtz0U0rD42p75o0PtSgG6vBnbYOqLn1Vk2OtRN5KKEP64-bw8BjOHpDlk_6GB-mq8BqMu9Fg9J2tYG_TnBjjgAbO7LOo8sGEY1hNwKerdwVx4xJGx1UdRthU3lagSGLkJ1BLiMbvGJ0XRY8w-G_g6qG-EBB8PhuDg3R5MExspV4oy9ipK6YOI9pJ7Qh-cBPv5ivZK33xqVbDfq5Kb97NLo4X_x3EusAH0HRbai2d1fa1n6l8oA3JDZhpy7liphWYhianp6v3urs1la2T6pVrebK4koP2H8vun4ck-VXALIWm9-sEPh4yLP13WcuDsmif9f_8tSLoPnuJvH-zcBktLAudN3npDBJyQAZ24-PMj-ub6MnjYOGmpqFdj2Ub5c6d9FDs7Vr_SUErMHvXA0DCJiI4MQRScxvX5S_IX_9CrVVroR_MZX3gyKyxLlkuzRjBt1P343LV6PXGRUhWQ_u2WdM4jkRyVZyA1Lk7Vq9KqmIBqaUV7KccWHQ6IJyK-EGUK5zVmApgT8WI-HHKSGbGJ__9j1qxg).

### Match Phrase Prefix Query

The [`match_phrase_prefix`](https://www.elastic.co/guide/en/elasticsearch/reference/5.6/query-dsl-match-query-phrase-prefix.html#query-dsl-match-query-phrase-prefix) query is the same as `match_phrase`, except that it allows for prefix matches on the last term in the text.

```go
const matchPhraseQuery string = `{
	"query": {
		"match_phrase_prefix": {
			"description": "and wr"
		}
	}
}`
```

It will return `34` number of documents for this query.
Play with the `Match Phrase Prefix Query` on [Mirage](https://appbaseio.github.io/mirage/#?input_state=XQAAAAJ0DAAAAAAAAAA9iIhnNAWbsswtYjeQNZkpzQK4_mOzUeDpWmFX40My38I2h2kWQlEdacvCMz6CtrX2pl2yy1LFtI8PefTkjddNtb1d4yacMv2ni8qYGp6yBtb_-oP0y6NadalvEMEYzWi_LqQ9mRe7P0mnWEZnms4MVU1rDLGSaeM2Mz8PnBpHlB8ozXiqBjd1HlXOyeHMn5YveDpjt6BIMyLyGa2t8hZgMVZjYLCqQfjpLtkwgaEOmm2R1JmcWDyJyLna4GMxMs4r-IB62CWjJFpLSDvyu_mM_MRP6uJO6YtZ1uAe6otWHfaTGdC0cxa_xsuZSsaLNpDXeiG-sabfHGofyPzN4CQFey5kqLVoxtjiUWsuOyxZujQoHYJp27YL_J3-K3PDEm78TGLIbspUsliRHA10weYS2BFSn7RnHigWnPoi7y49tk09MUzI_3pLAM-ykhu_ZLRJQ5qUZarzjC-pZVeW1Kcyfgr5UihbKq5--pm2WB-Pu4quy4qf9cYqxUAKdiTEGDuSs-S44iOzy08p7T2DszuM_loqkRDWFcf4xCZ-U10wyDDA2yCpNBQV12L-NeBFaVBx5aD2omvJJSackVZ-UqoivC_Rppuqongd-dNBF2SzmywAtGmGl12awbDvAXdEGGuxZdpiHbdM4IgtWM2qGjbH68QJBJDCjNzNq7egwzah9YK4f9EX7HK6_Di3rehkolys7w_7skPy1sGfKQzLT_9ttGOHSU16We9HBGD7k2Aa7T6u23Au0SupCXHY4MnjkhZtMhTXOdEjKha6t_EvYtKJ4tsBlRkj7uB5lfDNrdO9Xn2qyxWMlQ0nm1B1VW74Aau-r0H47kfRkvWNRDVU5tcRWJLj11Y9yKAZn6rHUvUFe1Fw-ZI0kbborzxvZEVCBX-RqI22sql-gBBN9c_xe93-Tt1jC6HPFVZeEqW3xcO9Simh2UKWFbS4VbXtPqPtnQz_0TQuBY8JUvlF5S_UQf7A2zg).

In this article, we showed examples of how to work with `term`, `match`, `match_phrase`, `match_phrase_prefix`, `range` and `compound` queries. You can learn more about the [Elasticsearch Query DSL here](https://www.elastic.co/guide/en/elasticsearch/reference/5.6/query-dsl.html).
