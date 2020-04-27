import React from 'react';
import ReactDOM from 'react-dom';
import { ReactiveBase } from '@appbaseio/reactivesearch';
import { ReactiveGoogleMap } from '@appbaseio/reactivemaps';

import './index.css';

const triangleCoords = [
	{ lat: 25.774, lng: -80.19 },
	{ lat: 18.466, lng: -66.118 },
	{ lat: 32.321, lng: -64.757 },
	{ lat: 25.774, lng: -80.19 },
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
				app="meetup_dataset"
				url="https://xe6N9nDRV:51ea7a8a-6354-4b5f-83e1-12dce3b7ec47@arc-cluster-appbase-demo-ps1pgt.searchbase.io"
				enableAppbase
				type="meetupdata1"
				mapKey="AIzaSyAKz3UhgSuP872fb-Aw27oPRI7M0eXkA9U"
			>
				<h2>Polygons on ReactiveMap</h2>
				{this.renderInfo()}
				<ReactiveGoogleMap
					componentId="map"
					dataField="location"
					title="Reactive Maps"
					innerRef={(ref) => {
						this.mapRef = ref;
					}}
					size={500}
					defaultZoom={5}
					center={{ lat: 24.886, lng: -70.268 }}
					renderAllData={(hits, streamHits, loadMore, renderMap) => {
						if (this.mapRef) {
							const { map } = this.mapRef;
							const bermudaTriangle = new window.google.maps.Polygon({
								paths: triangleCoords,
								strokeColor: '#FF0000',
								strokeOpacity: 0.8,
								strokeWeight: 2,
								fillColor: '#FF0000',
								fillOpacity: 0.35,
							});

							// renders polygon on the map
							// refer: https://developers.google.com/maps/documentation/javascript/shapes#polygons
							bermudaTriangle.setMap(map);
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
