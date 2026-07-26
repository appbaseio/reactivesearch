<template>
  <div id="app">
    <reactive-base
      app="earthquakes"
      url="https://reactivesearch-api-9-4-0.onrender.com"
      credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
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
            :default-query="defaultQuery"
            :show-marker-clusters="true"
            component-id="map"
            data-field="location"
            @zoom-changed="handleZoom"
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
import './styles.css';

export default {
	name: 'App',
	data () {
		return {
			defaultQuery: () => this.getDefaultQuery()
		};
	},
	methods: {
		getDefaultQuery(zoom) {
			if (zoom) {
				return {
					query: {
						range: {
							magnitude: {
								gte: zoom
							},
						},
					},
				};
			}
			return {
				query: {
					match_all: {},
				},
			};
		},
		handleZoom(zoom) {
			this.defaultQuery = () => this.getDefaultQuery(zoom);
		},
	},
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
