import React from 'react';
import ReactDOM from 'react-dom';
import { ReactiveBase } from '@appbaseio/reactivesearch';
import { ReactiveMap } from '@appbaseio/reactivemaps';

import './index.css';

const Main = () => (
	<ReactiveBase
		app="weather"
		credentials="dmgyKySw5:162202d3-43f7-4e01-95f2-f9f3e1b02bb5"
		type="city"
		mapKey="AIzaSyBQdVcKCe0q_vOBDUvJYpzwGpt_d_uTj4Q"
	>
		<h2>Weather updates on ReactiveMap</h2>
		<ReactiveMap
			componentId="map"
			dataField="coord"
			title="Reactive Maps"
			defaultZoom={4}
			onData={(res) => {
				let icon = 'https://i.imgur.com/6gsHmLq.png';
				if (res.clouds.all > 20 && res.clouds.all < 70) {
					icon = 'https://i.imgur.com/6gsHmLq.png';
				} else if (res.clouds.all > 70) {
					icon = 'https://i.imgur.com/w3ezG1q.png';
				}

				if (res.clouds.rain) {
					icon = 'https://i.imgur.com/VsrZdwU.png';
				}

				if (res.clouds.snow) {
					icon = 'https://i.imgur.com/VbbTyCl.png';
				}

				return ({
					icon,
				});
			}}
			size={50}
			defaultCenter={{ lat: 55.58, lng: -103.46 }}
			showMarkerClusters={false}
			showSearchAsMove
			searchAsMove
			defaultMapStyles="Blue Water"
		/>
	</ReactiveBase>
);

ReactDOM.render(<Main />, document.getElementById('root'));
