import React from 'react';
import ReactDOM from 'react-dom';
import {
	ReactiveBase,
	SelectedFilters,
	RangeSlider,
	DynamicRangeSlider,
} from '@appbaseio/reactivesearch';
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
				and: ['magnitude-filter', 'year-filter'],
			},
			onPopoverClick: item => <div>{item.place}</div>,
			showMapStyles: true,
			renderItem: result => ({
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
				mapKey="AIzaSyA9JzjtHeXg_C_hh_GdTBdLxREWdj3nsOU"
			>
				<div className="container">
					<div className="filters-container">
						{' '}
						<h1>Earthquakes Reporter</h1>
						<div
							style={{
								position: 'relative',
								zIndex: 9999999,
								marginBottom: '1rem',
							}}
						>
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
						<hr />
						<RangeSlider
							title="Filter By Magnitude"
							componentId="magnitude-filter"
							dataField="magnitude"
							range={{
								start: 1,
								end: 10,
							}}
							rangeLabels={{
								start: '1',
								end: '10',
							}}
							tooltipTrigger="hover"
						/>
						<hr />
						<DynamicRangeSlider
							title="Filter By Year"
							componentId="year-filter"
							dataField="time"
							queryFormat="date"
							rangeLabels={(min, max) => ({
								start: new Date(min).toISOString().substring(0, 10),
								end: new Date(max).toISOString().substring(0, 10),
							})}
						/>
					</div>

					<div className="maps-container">
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
