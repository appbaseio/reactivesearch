<template>
	<div id="app">
		<reactive-base
			app="earthquakes"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			:enable-appbase="true"
		>
			<div class="row">
				<div class="col">
					<single-list
						title="Places"
						component-id="places"
						data-field="place.keyword"
						:size="50"
						show-search
					/>
				</div>

				<div class="col">
					<selected-filters />
					<reactive-google-map
						component-id="map"
						data-field="location"
						:size="50"
						:style="{ height: '90vh', minWidth: '300px' }"
						:react="{ and: 'places' }"
						:default-zoom="3"
						:show-marker-clusters="true"
						:default-query="defaultQuery"
						:calculate-markers="handleCalculateMarkers"
						@zoom-changed="handleZoomChange"
						:auto-close-popover="true"
					>
						<div
							slot="renderItem"
							slot-scope="{ doc_count }"
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
							&nbsp;{{ doc_count }}
						</div>
						<div slot="renderPopover" slot-scope="{ doc_count }">
							{{ doc_count }}
						</div>
					</reactive-google-map>
				</div>
			</div>
		</reactive-base>
	</div>
</template>
<script>
import './styles.css';

export default {
	name: 'app',
	methods: {
		handleCalculateMarkers({ rawData }) {
			const markers = rawData?.aggregations?.results?.buckets?.map(bucket => ({
				...bucket,
				_id: bucket.key,
				location: bucket.cetroid.location
			}))
			return markers
		},
		defaultQuery() {
			return {
				size: 0,
				aggs: {
					results: {
						geotile_grid: {
							field: 'location',
							precision: 8,
						},
						aggs: {
							cetroid: {
								geo_centroid: {
									field: 'location',
								}
							}
						}
					},
				},
			};
		},
		handleZoomChange(zoom) {
			console.log("Current Zoom", zoom)
		}
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
