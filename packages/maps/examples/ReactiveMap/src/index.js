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
			defaultZoom: 3,
			size: 50,
			react: {
				and: 'places',
			},
			onPopoverClick: item => <div>{item.place}</div>,
			showMapStyles: true,
			renderData: result => ({
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
						<i className="fas fa-globe-europe" />
						&nbsp;{result.magnitude}
					</div>
				),
			}),
		};
		return (
			<ReactiveBase
				app="earthquakes"
				url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
				enableAppbase
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
