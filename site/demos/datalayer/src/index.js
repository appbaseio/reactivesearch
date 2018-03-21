import React from 'react';
import ReactDOM from 'react-dom';
import { ReactiveBase } from '@appbaseio/reactivesearch';
import { ReactiveMap } from '@appbaseio/reactivemaps';

import './index.css';

const Main = () => (
	<ReactiveBase
		app="earthquake"
		credentials="OrXIHcgHn:d539c6e7-ed14-4407-8214-c227b0600d8e"
		type="places"
		mapKey="AIzaSyBQdVcKCe0q_vOBDUvJYpzwGpt_d_uTj4Q"
	>
		<h2>Data Layer on ReactiveMap</h2>
		<ReactiveMap
			componentId="map"
			dataField="location"
			title="Reactive Maps"
			innerRef={(ref) => {
				this.map = ref;
			}}
			defaultZoom={4}
			onAllData={(hits, streamHits, loadMore, renderMap) => {
				if (this.map) {
					// renders data layer on the map
					// refer: https://developers.google.com/maps/documentation/javascript/datalayer
					this.map.data.loadGeoJson('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json');
				}
				return renderMap();
			}}
			showMarkerClusters={false}
			center={{ lat: 45.58, lng: -103.46 }}
		/>
	</ReactiveBase>
);

ReactDOM.render(<Main />, document.getElementById('root'));
