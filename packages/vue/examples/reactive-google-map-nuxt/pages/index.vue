<template>
  <div id="app">
    <reactive-base
      :enable-appbase="true"
      app="earthquakes"
      url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
    >
      <div class="row">
        <div class="col">
          <single-list
            :size="50"
            title="Places"
            component-id="places"
            data-field="place.keyword"
            show-search
          />
        </div>

        <div class="col">
          <selected-filters />
          <reactive-google-map
            :size="50"
            :style="{ height: '90vh', minWidth: '300px' }"
            :react="{ and: 'places' }"
            :default-zoom="3"
            :show-marker-clusters="true"
            component-id="map"
            data-field="location"
          >
            <template
              :style="{
                background: 'dodgerblue',
                color: '#fff',
                paddingLeft: '5px',
                paddingRight: '5px',
                borderRadius: '3px',
                padding: '10px',
              }"
              #renderItem="{ magnitude }"
            >
              <i class="fas fa-globe-europe" />
              &nbsp;{{ magnitude }}
            </template>
          </reactive-google-map>
        </div>
      </div>
    </reactive-base>
  </div>
</template>

<script>
import '../assets/css/styles.css';

export default {
	name: 'App',
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
