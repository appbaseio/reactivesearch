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
						componentId="places"
						dataField="place.keyword"
						:size="50"
						showSearch
					/>
				</div>

				<div class="col">
					<selected-filters />
					<reactive-google-map
						componentId="map"
						dataField="location"
						:size="50"
						:style="{ height: '90vh', minWidth: '300px' }"
						:react="{ and: 'places' }"
						:defaultZoom="3"
						:showMarkerClusters="false"
					>
						<div
							slot="renderItem"
							slot-scope="{ magnitude }"
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
