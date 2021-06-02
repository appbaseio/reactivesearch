<template>
	<div id="app">
		<reactive-base
			app="earthquakes"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			:enable-appbase="true"
		>
			<div class="row">
				<div class="col">
					<multi-list
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
						componentId="googleMap"
						dataField="location"
						:size="50"
						:style="{ height: '90vh' }"
						:react="{ and: 'places' }"
						:defaultZoom="3"
						:defaultRadius="200"
						:autoCenter="false"
						:defaultCenter="{ lat: 37.74, lng: -122.45 }"
						unit="km"
						:showSearchAsMove="true"
						:renderItem="(result) => ({ label: result._id })"
					>
					<div slot="renderPopover" slot-scope="{ _id }" >
						Id: {{_id}}
					</div>
					<template slot="renderItem" slot-scope="{ _id }" >
						<div>Id: {{_id}}</div>
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
	name: 'app'
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
