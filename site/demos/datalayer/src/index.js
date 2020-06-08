import React from 'react';
import ReactDOM from 'react-dom';
import { ReactiveBase } from '@appbaseio/reactivesearch';
import { ReactiveGoogleMap } from '@appbaseio/reactivemaps';

import './index.css';

const texas = ['Dallas', 'San Angelo', 'Austin', 'San Antonio'];

const california = ['San Jose', 'San Francisco', 'California', 'Los Angeles', 'San Diego'];

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
				url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@arc-cluster-appbase-demo-6pjy6z.searchbase.io"
				enableAppbase
				type="meetupdata1"
				mapKey="AIzaSyAKz3UhgSuP872fb-Aw27oPRI7M0eXkA9U"
			>
				<h2>Data Layer on ReactiveMap</h2>
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
					defaultQuery={() => ({
						query: {
							terms: {
								'group.group_city.keyword': [...texas, ...california],
							},
						},
					})}
					renderAllData={(hits, streamHits, loadMore, renderMap) => {
						if (this.mapRef) {
							const { map } = this.mapRef;
							const count = {
								California: 0,
								Texas: 0,
							};

							hits.forEach((hit) => {
								if (texas.includes(hit.group.group_city)) {
									count.Texas += 1;
								} else {
									count.California += 1;
								}
							});

							// renders data layer on the map
							// refer: https://developers.google.com/maps/documentation/javascript/datalayer
							map.data.loadGeoJson(
								'https://raw.githubusercontent.com/appbaseio/reactivesearch/dev/site/demos/datalayer/src/us-states.json',
							);
							map.data.addListener('click', (event) => {
								this.setState({
									title: `${event.feature.f.name}: ${
										count[event.feature.f.name]
									} meetups`,
								});
							});
						}
						return renderMap();
					}}
					showMarkerClusters={false}
					showSearchAsMove={false}
					defaultCenter={{ lat: 45.58, lng: -103.46 }}
				/>
			</ReactiveBase>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
