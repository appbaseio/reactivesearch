import React from 'react';
import ReactDOM from 'react-dom';
import { ReactiveBase, SingleList, SelectedFilters } from '@appbaseio/reactivesearch';
import { ReactiveGoogleMap, ReactiveOpenStreetMap } from '@appbaseio/reactivemaps';
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
			react: {
				and: 'places',
			},
			onPopoverClick: item => <div>{item.place}</div>,
			showMapStyles: true,
		};
		return (
			<ReactiveBase
				app="earthquakes"
				credentials="dshr057Nz:e18bbbbe-5d55-4234-a17e-4d64fb2222c7"
				mapKey="AIzaSyBQdVcKCe0q_vOBDUvJYpzwGpt_d_uTj4Q"
			>
				<div className="row">
					<div className="col">
						<SingleList
							title="Places"
							componentId="places"
							dataField="place.keyword"
							size={50}
							showSearch
						/>
						<div
							style={{
								marginTop: '20px',
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
							<ReactiveGoogleMap componentId="googleMap" {...mapProps} />
						) : (
							<ReactiveOpenStreetMap componentId="openstreetMap" {...mapProps} />
						)}
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
