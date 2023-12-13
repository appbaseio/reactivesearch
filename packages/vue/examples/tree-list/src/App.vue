<template>
  <div id="app">
    <ReactiveBase
      :enable-appbase="true"
      app="best-buy-dataset"
      url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
    >
      <div class="row">
        <div class="col">
          <TreeList
            :urlparams="true"
            :data-field="['class.keyword', 'subclass.keyword']"
            :show-search="true"
            component-id="TreeListComponent"
            mode="multiple"
          />
        </div>
        <div class="col">
          <SelectedFilters />
          <ReactiveList
            :pagination="true"
            :from="0"
            :size="5"
            :react="{ and: ['TreeListComponent'] }"
            :include-fields="['*']"
            component-id="SearchResult"
            data-field="original_title"
            class-name="result-list-container"
          >
            <template #renderItem="{ item: data }">
              <div 
                :key="data._id" 
                className="flex book-content">
                <img 
                  :src="data.image" 
                  alt="Book Cover" 
                  className="book-image" >
                <div
                  :style="{ marginLeft: 20 }"
                  className="flex column justify-center"
                >
                  <div className="book-header">{{ data.name }}</div>
                  <div className="flex column justify-space-between">
                    <div>
                      <div>
                        <span className="authors-list">
                          {{ data.class }} > {{ data.subclass }}
                        </span>
                      </div>
                      <div className="ratings-list flex align-center">
                        Sale Price 💰 <b>{{ data.salePrice }}</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </ReactiveList>
        </div>
      </div>
    </ReactiveBase>
  </div>
</template>

<script>
import './styles.css';
import {
	ReactiveBase,
	ReactiveList,
	TreeList,
	SelectedFilters,
} from '@appbaseio/reactivesearch-vue';

export default {
	name: 'App',
	components: { ReactiveBase, ReactiveList, TreeList, SelectedFilters },
};
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
</style>
