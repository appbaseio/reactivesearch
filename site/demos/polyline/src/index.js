import React from 'react';
import ReactDOM from 'react-dom';
import { ReactiveBase } from '@appbaseio/reactivesearch';
import { ReactiveMap } from '@appbaseio/reactivemaps';

import './index.css';

const flightPlanCoordinates = [
	{ lat: 37.772, lng: -122.214 },
	{ lat: 21.291, lng: -157.821 },
	{ lat: -18.142, lng: 178.431 },
	{ lat: -27.467, lng: 153.027 },
];

class Main extends React.Component {
	constructor() {
		super();

		this.state = {
			title: '',
		};
		this.renderInfo = this.renderInfo.bind(this);
	}

	renderInfo() {
		const { title } = this.state;
		if (title) {
			return <div className="title-box">{title}</div>;
		}
		return null;
	}

	render() {
		return (
			<ReactiveBase
				app="meetup_app"
				credentials="lW70IgSjr:87c5ae16-73fb-4559-a29e-0a02760d2181"
				type="meetupdata1"
				mapKey="AIzaSyBQdVcKCe0q_vOBDUvJYpzwGpt_d_uTj4Q"
			>
				<h2>Polylines on ReactiveMap</h2>
				{this.renderInfo()}
				<ReactiveMap
					componentId="map"
					dataField="location"
					title="Reactive Maps"
					innerRef={(ref) => {
						this.mapRef = ref;
					}}
					size={50}
					defaultZoom={3}
					center={{ lat: 0, lng: -180 }}
					onAllData={(hits, streamHits, loadMore, renderMap) => {
						if (this.mapRef) {
							const { map } = this.mapRef;
							const flightPath = new window.google.maps.Polyline({
								path: flightPlanCoordinates,
								geodesic: true,
								strokeColor: '#FF0000',
								strokeOpacity: 1.0,
								strokeWeight: 2,
							});

							// renders polyline on the map
							// refer: https://developers.google.com/maps/documentation/javascript/shapes#polylines
							flightPath.setMap(map);
						}
						return renderMap();
					}}
					showMarkerClusters={false}
					showSearchAsMove={false}
				/>
			</ReactiveBase>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
