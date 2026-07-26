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
            :show-marker-clusters="false"
            component-id="map"
            data-field="location"
            @open-marker-popover="handleOpen"
            @close-marker-popover="handleClose"
          >
            <template #renderItem="{ magnitude }">
              <div
                :style="{
                  background: 'dodgerblue',
                  color: '#fff',
                  paddingLeft: '5px',
                  paddingRight: '5px',
                  borderRadius: '3px',
                  padding: '10px',
                }"
              >
                <i class="fas fa-globe-europe" />
                &nbsp;{{ magnitude }}
              </div>
            </template>
            <template #renderPopover="{ item }">
              <div
                :style="{
                  background: 'dodgerblue',
                  color: '#fff',
                  paddingLeft: '5px',
                  paddingRight: '5px',
                  borderRadius: '3px',
                  padding: '10px',
                }"
              >
                Place: &nbsp;{{ item.place }}
                <div>Year: &nbsp;{{ new Date(item.time).getFullYear() }}</div>
              </div>
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
	methods: {
		handleOpen() {
			console.log('open');
		},
		handleClose() {
			console.log('close');
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
