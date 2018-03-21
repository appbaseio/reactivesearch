import React from 'react';
import ReactDOM from 'react-dom';
import { ReactiveBase } from '@appbaseio/reactivesearch';
import { ReactiveMap } from '@appbaseio/reactivemaps';

import './index.css';

const Main = () => (
	<ReactiveBase
		app="transport"
		credentials="1uwmtnnk9:163c389a-014a-48c0-a8dd-aa1635e154a3"
		type="location"
		mapKey="AIzaSyBQdVcKCe0q_vOBDUvJYpzwGpt_d_uTj4Q"
	>
		<h2>Realtime bus streaming on ReactiveMap</h2>
		<p>Tip: You may need to zoom out to see the second bus</p>
		<ReactiveMap
			componentId="map"
			dataField="location"
			title="Reactive Maps"
			defaultZoom={11}
			defaultPin="https://i.imgur.com/ajzfeYT.png"
			stream
			defaultQuery={() => ({
				match_all: {},
			})}
			onData={(res) => {
				if (res._id === 'bus-1') {
					return ({
						icon: 'https://i.imgur.com/ajzfeYT.png',
					});
				}
				return ({
					icon: 'https://i.imgur.com/EQkhDre.png',
				});
			}}
			defaultMapStyle="Light Monochrome"
			defaultCenter={{ lat: 37.74, lng: -122.45 }}
			showMarkerClusters={false}
			streamAutoCenter={false}
			showSearchAsMove={false}
		/>
	</ReactiveBase>
);

ReactDOM.render(<Main />, document.getElementById('root'));
