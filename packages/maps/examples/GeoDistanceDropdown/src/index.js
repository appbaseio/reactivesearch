import React from 'react';
import ReactDOM from 'react-dom';
import { ReactiveBase, SelectedFilters } from '@appbaseio/reactivesearch';
import {
	ReactiveOpenStreetMap,
	ReactiveGoogleMap,
	GeoDistanceDropdown,
} from '@appbaseio/reactivemaps';
import Dropdown from '@appbaseio/reactivesearch/lib/components/shared/Dropdown';

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
				and: 'GeoDistanceDropdown',
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
				mapKey="AIzaSyA9JzjtHeXg_C_hh_GdTBdLxREWdj3nsOU"
			>
				<div>
					<h3 style={{ textAlign: 'center' }}>Search Locations</h3>
					<div
						style={{
							position: 'relative',
							zIndex: 9999999999,
							marginBottom: '2rem',
						}}
					>
						<GeoDistanceDropdown
							title="Location"
							componentId="GeoDistanceDropdown"
							placeholder="Search Location"
							dataField="location"
							unit="mi"
							URLParams
							data={[
								{ distance: 10, label: 'Within 10 miles' },
								{ distance: 50, label: 'Within 50 miles' },
								{ distance: 100, label: 'Under 100 miles' },
								{ distance: 300, label: 'Under 300 miles' },
							]}
							defaultValue={{
								location: 'London, UK',
								label: 'Within 10 miles',
							}}
						/>
					</div>
					<div
						style={{
							position: 'relative',
							zIndex: 2147483646,
							marginBottom: '5px',
							fontSize: '1 rem',
						}}
					>
						<div>
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

					<div style={{ padding: '2rem' }}>
						<SelectedFilters />
						{this.state.mapProvider.value === 'googleMap' ? (
							<ReactiveGoogleMap
								style={{ height: '90vh' }}
								componentId="googleMap"
								{...mapProps}
							/>
						) : (
							<ReactiveOpenStreetMap
								style={{ height: '90vh' }}
								componentId="openstreetMap"
								{...mapProps}
							/>
						)}
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
