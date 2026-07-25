<template>
  <reactive-base
    :enable-appbase="true"
    app="carstore-dataset"
    url="https://reactivesearch-api-9-4-0.onrender.com"
    credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
  >
    <div class="row">
      <div class="col">
        <reactive-component
          :default-query="
            () => ({
              aggs: {
                'brand.keyword': {
                  terms: {
                    field: 'brand.keyword',
                    order: {
                      _count: 'desc',
                    },
                    size: 10,
                  },
                },
              },
            })
          "
          component-id="CarSensor"
        >
          <template #default="{ aggregations, setQuery }">
            <CustomComponent 
              :aggregations="aggregations" 
              :set-query="setQuery" />
          </template>
        </reactive-component>
      </div>

      <div class="col">
        <reactive-list
          :from="0"
          :size="20"
          :pagination="true"
          :react="{
            and: 'CarSensor',
          }"
          component-id="SearchResult"
          data-field="model.keyword"
          title="ReactiveList"
        >
          <template #renderItem="{ item }">
            <h2>{{ item.model }}</h2>
            <p>{{ item.price }} - {{ item.rating }} stars rated</p>
          </template>
        </reactive-list>
      </div>
    </div>
  </reactive-base>
</template>
<script>
import { ReactiveComponent, ReactiveList, ReactiveBase } from '@appbaseio/reactivesearch-vue'
import CustomComponent from './CustomComponent.vue';
import './styles.css';

export default {
	name: 'App',
	components:{
		ReactiveComponent,
		CustomComponent,
		ReactiveList,
		ReactiveBase
	}
};
</script>
