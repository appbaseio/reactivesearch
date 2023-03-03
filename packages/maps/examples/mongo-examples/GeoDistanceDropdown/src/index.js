import ReactDOM from 'react-dom/client';
import { Component } from 'react';
import { ReactiveBase } from '@appbaseio/reactivesearch';
import {
	GeoDistanceDropdown,
	ReactiveGoogleMap,
	ReactiveOpenStreetMap,
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
			dataField: 'address.location',
			defaultMapStyle: 'Light Monochrome',
			title: 'Reactive Maps',
			defaultZoom: 13,
			index: 'custom',
			size: 100,
			react: {
				and: 'GeoDistanceDropdown',
			},
			onPopoverClick: (item) => (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-start',
						alignItems: 'flex-start',
					}}
				>
					<div style={{ margin: '3px 0', height: '100px', width: '100%' }}>
						<img
							style={{ margin: '3px 0', height: '100%', width: '100%' }}
							src={item.images.picture_url}
							alt={item.name}
						/>
					</div>
					<div style={{ margin: '3px 0' }}>
						<b>Name: </b>
						{item.name}
					</div>
					<div style={{ margin: '3px 0' }}>
						<b>Room Type: </b>
						{item.room_type}
					</div>
					<div style={{ margin: '3px 0' }}>
						<b>Property Type: </b>
						{item.property_type}
					</div>
				</div>
			),
			showMapStyles: true,
			renderItem: () => ({
				custom: (
					<div
						style={{
							background: 'dodgerblue',
							color: '#fff',
							paddingLeft: 5,
							paddingRight: 5,
							borderRadius: 3,
							padding: 10,
						}}
					>
						<i className="fa fa-home" />
					</div>
				),
			}),
		};
		return (
			<ReactiveBase
				app="custom"
				url="https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/public-demo-skxjb/service/http_endpoint/incoming_webhook/reactivesearch"
				mongodb={{
					db: 'sample_airbnb',
					collection: 'listingsAndReviews',
				}}
				enableAppbase
				mapKey="AIzaSyA9JzjtHeXg_C_hh_GdTBdLxREWdj3nsOU"
				mapLibraries={['places']}
				reactivesearchAPIConfig={{ recordAnalytics: false }}
			>
				<div>
					<h3 style={{ textAlign: 'center' }}>Search properties across the globe</h3>
					<div
						style={{
							position: 'relative',
							zIndex: 9999999999,
							marginBottom: '2rem',
						}}
					>
						<GeoDistanceDropdown
							title="Filter by location"
							componentId="GeoDistanceDropdown"
							placeholder="Search Location"
							dataField="address.location"
							unit="mi"
							URLParams
							data={[
								{ distance: 10, label: 'Within 10 miles' },
								{ distance: 50, label: 'Within 50 miles' },
								{ distance: 100, label: 'Under 100 miles' },
								{ distance: 300, label: 'Under 300 miles' },
							]}
							defaultValue={{
								location: 'Rio De Janeiro',
								label: 'Under 300 miles',
							}}
						/>
					</div>
					<div
						style={{
							position: 'relative',
							zIndex: 2147483646,
						}}
					>
						<div>
							<b>Select Map Provider</b>
						</div>
						<Dropdown
							className="dropdown"
							items={providers}
							onChange={this.setProvider}
							selectedItem={this.state.mapProvider}
							keyField="label"
							returnsObject
						/>
					</div>

					{this.state.mapProvider.value === 'googleMap' ? (
						<ReactiveGoogleMap
							style={{ height: '90vh', marginTop: '5px', padding: '1rem' }}
							componentId="googleMap"
							{...mapProps}
						/>
					) : (
						<ReactiveOpenStreetMap
							style={{ height: '90vh', marginTop: '5px', padding: '1rem' }}
							componentId="openstreetMap"
							{...mapProps}
						/>
					)}
				</div>
			</ReactiveBase>
		);
	}
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
