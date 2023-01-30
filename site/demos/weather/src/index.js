import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import { ReactiveBase } from '@appbaseio/reactivesearch';
import { ReactiveGoogleMap } from '@appbaseio/reactivemaps';

import './index.css';

const Main = () => {
	const mapRef = useRef();
	const heatMap = useRef();

	return (
		<ReactiveBase
			app="city-weather-demo"
			credentials="55084b5c823f:58ed793c-435f-4b70-9eb5-502002036186"
			url="https://appbase-demo-ansible-abxiydt-arc.searchbase.io"
			mapKey="AIzaSyA9JzjtHeXg_C_hh_GdTBdLxREWdj3nsOU"
			style={{
				position: 'relative',
			}}
			mapLibraries={['visualization', 'places']}
		>
			<h2>Weather updates on ReactiveMap</h2>
			<ReactiveGoogleMap
				componentId="map"
				dataField="city.coord"
				title="Reactive Maps"
				defaultZoom={3}
				innerRef={(ref) => {
					mapRef.current = ref;
				}}
				renderItem={() => ({
					icon: 'https://i.imgur.com/h81muef.png',
				})}
				size={100}
				defaultRadius={10000}
				defaultCenter={{ lat: 22.3367983, lng: 31.6259148 }}
				showMarkerClusters={false}
				showSearchAsMove
				defaultMapStyles="Blue Water"
				render={({ data: hits, renderMap }) => {
					if (mapRef.current) {
						if (heatMap.current) {
							heatMap.current.getData().clear();
						}
						const heatMapData = hits.map((markerData) => {
							const location = markerData.city.coord;
							const temp = Math.max(markerData.deg - 273.15, 0);
							return {
								location: new window.google.maps.LatLng(location.lat, location.lon),
								weight: temp,
							};
						});
						heatMap.current = new window.google.maps.visualization.HeatmapLayer({
							data: heatMapData,
							radius: 30,
							map: mapRef.current,
						});
					}

					return renderMap();
				}}
			/>
		</ReactiveBase>
	);
};

ReactDOM.render(<Main />, document.getElementById('root'));
