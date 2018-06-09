import React from 'react';
import ReactDOM from 'react-dom';
import { ReactiveBase } from '@appbaseio/reactivesearch';
import { ReactiveMap } from '@appbaseio/reactivemaps';

import './index.css';

const triangleCoords = [
	{ lat: 25.774, lng: -80.190 },
	{ lat: 18.466, lng: -66.118 },
	{ lat: 32.321, lng: -64.757 },
	{ lat: 25.774, lng: -80.190 },
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
			return (<div className="title-box">{title}</div>);
		}
		return null;
	}

	render() {
		return (
			<ReactiveBase
				app="reactivemap_demo"
				credentials="y4pVxY2Ok:c92481e2-c07f-4473-8326-082919282c18"
				type="meetupdata1"
				mapKey="AIzaSyBQdVcKCe0q_vOBDUvJYpzwGpt_d_uTj4Q"
			>
				<h2>Polygons on ReactiveMap</h2>
				{this.renderInfo()}
				<ReactiveMap
					componentId="map"
					dataField="location"
					title="Reactive Maps"
					innerRef={(ref) => {
						this.mapRef = ref;
					}}
					size={500}
					defaultZoom={5}
					center={{ lat: 24.886, lng: -70.268 }}
					onAllData={(hits, streamHits, loadMore, renderMap) => {
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
