<template>
  <ReactiveBase
    app="carstore-dataset"
    credentials="4HWI27QmA:58c731f7-79ab-4f55-a590-7e15c7e36721"
  >
    <div class="row">
      <div class="col">
        <ReactiveComponent
          componentId="CarSensor"
          :defaultQuery="
              () => ({
                    aggs: {
                      'brand.keyword': {
                        terms: {
                        field: 'brand.keyword',
                                  order: {
                        _count: 'desc'
                    },
                    size: 10
                  }
                }
              }
            })
          "
        >
          <div slot-scope="{ aggregations, setQuery }">
            <CustomComponent
                :aggregations="aggregations"
                :setQuery="setQuery"
              />
          </div>
        </ReactiveComponent>
    </div>

    <div class="col">
      <ReactiveList
        componentId="SearchResult"
        dataField="model.keyword"
        title="ReactiveList"
        :from="0"
        :size="20"
        :pagination="true"
        :react="{
          and: 'CarSensor'
        }"
      >
        <div slot="renderData" slot-scope="{item}">
          <h2>{{ item.model }}</h2>
          <p>{{ item.price }} - {{ item.rating }} stars rated</p>
        </div>
      </ReactiveList>
      </div>
    </div>
  </ReactiveBase>
</template>
<script>
    import CustomComponent from "./CustomComponent.vue";
    export default {
      name: "App",
      components: {CustomComponent}
    };
</script>
