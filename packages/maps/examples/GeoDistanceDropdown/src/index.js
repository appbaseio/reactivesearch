import ReactDOM from 'react-dom/client';
import { Component } from 'react';
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
class App extends Component {
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
			onPopoverClick: (item) => <div>{item.place}</div>,
			showMapStyles: true,
		};
		return (
			<ReactiveBase
				app="earthquakes"
				url="https://reactivesearch-api-9-4-0.onrender.com"
				credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
				enableAppbase
				mapKey="AIzaSyA9JzjtHeXg_C_hh_GdTBdLxREWdj3nsOU"
				mapLibraries={['places']}
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
								location: 'California, USA',
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
