import React from 'react';
import ReactDOM from 'react-dom';
import { ReactiveBase, SelectedFilters } from '@appbaseio/reactivesearch';
import {
	ReactiveGoogleMap,
	ReactiveOpenStreetMap,
	GeoDistanceSlider,
} from '@appbaseio/reactivemaps';
import Dropdown from '@appbaseio/reactivesearch/lib/components/shared/Dropdown';

import './index.css';

const providers = [
	{
		label: 'Google Map',
		value: 'googleMap',
	},
	{
		label: 'OpenStreet Map',
		value: 'openstreetMap',
	},
];
class App extends React.Component {
	constructor() {
		super();

		this.state = {
			mapProvider: providers[0],
		};

		this.setProvider = this.setProvider.bind(this);
	}

	setProvider(mapProvider) {
		this.setState({
			mapProvider,
		});
	}

	render() {
		const mapProps = {
			dataField: 'location',
			defaultMapStyle: 'Light Monochrome',
			title: 'Reactive Maps',
			defaultZoom: 13,
			size: 100,
			react: {
				and: 'GeoDistanceSlider',
			},
			onPopoverClick: item => <div>{item.venue.venue_name}</div>,
			showMapStyles: true,
		};
		return (
			<ReactiveBase
				app="meetup_dataset"
				url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
				enableAppbase
				type="meetupdata1"
				mapKey="AIzaSyAKz3UhgSuP872fb-Aw27oPRI7M0eXkA9U"
			>
				<div className="row">
					<div className="col">
						<GeoDistanceSlider
							title="Location"
							componentId="GeoDistanceSlider"
							placeholder="Search Location"
							dataField="location"
							unit="mi"
							URLParams
							range={{
								start: 10,
								end: 300,
							}}
							rangeLabels={{
								start: '10mi',
								end: '300mi',
							}}
							defaultValue={{
								location: 'London, UK',
								distance: 10,
							}}
						/>
						<div
							style={{
								marginTop: '3rem',
								marginBottom: '5px',
								fontSize: '1 rem',
							}}
						>
							<b>Select Map Provider</b>
						</div>
						<Dropdown
							items={providers}
							onChange={this.setProvider}
							selectedItem={this.state.mapProvider}
							keyField="label"
							returnsObject
						/>
					</div>

					<div className="col">
						<SelectedFilters />
						{this.state.mapProvider.value === 'googleMap' ? (
							<ReactiveGoogleMap style={{ height: '90vh' }} componentId="googleMap" {...mapProps} />
						) : (
							<ReactiveOpenStreetMap style={{ height: '90vh' }} componentId="openstreetMap" {...mapProps} />
						)}
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
