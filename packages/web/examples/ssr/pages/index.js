/* eslint-disable */
import React, { Component } from 'react';
import {
	ReactiveBase,
	DataSearch,
	NumberBox,
	// RangeSlider,
	ResultCard,
} from '@appbaseio/reactivesearch';
import initReactivesearch from '@appbaseio/reactivesearch/lib/server';

import './styles/airbnb.css';

const components = {
	settings: {
		app: 'housing',
		credentials: '0aL1X5Vts:1ee67be1-9195-4f4b-bd4f-a91cd1b5e4b5',
		type: 'listing',
		theme: {
			colors: {
				primaryColor: '#FF3A4E',
			},
		},
	},
	datasearch: {
		componentId: 'SearchSensor',
		dataField: 'name',
		autosuggest: false,
		placeholder: 'Search by house names',
		iconPosition: 'left',
		className: 'search',
		highlight: true,
	},
	numberbox: {
		componentId: 'GuestSensor',
		dataField: 'accommodates',
		title: 'Guests',
		defaultSelected: 2,
		labelPosition: 'right',
		data: {
			start: 1,
			end: 16,
		},
	},
	rangeslider: {
		componentId: 'PriceSensor',
		dataField: 'price',
		title: 'Price Range',
		range: {
			start: 10,
			end: 250,
		},
		rangeLabels: {
			start: '$10',
			end: '$250',
		},
		defaultSelected: {
			start: 10,
			end: 50,
		},
		stepValue: 10,
		interval: 20,
	},
	resultcard: {
		className: 'right-col',
		componentId: 'SearchResult',
		dataField: 'name',
		size: 12,
		onData: data => ({
			image: data.image,
			title: data.name,
			description: (
				<div>
					<div className="price">${data.price}</div>
					<p className="info">
						{data.room_type} · {data.accommodates} guests
					</p>
				</div>
			),
			url: data.listing_url,
		}),
		pagination: true,
		URLParams: true,
		react: {
			and: ['SearchSensor', 'GuestSensor'],
		},
		innerClass: {
			resultStats: 'result-stats',
			list: 'list',
			listItem: 'list-item',
			image: 'image',
		},
	},
};

export default class Main extends Component {
	static async getInitialProps({ pathname, query }) {
		return {
			store: await initReactivesearch(
				[
					{
						...components.datasearch,
						type: 'DataSearch',
						source: DataSearch,
					},
					{
						...components.numberbox,
						type: 'NumberBox',
						source: NumberBox,
					},
					// {
					// 	...components.rangeslider,
					// 	type: 'RangeSlider',
					// 	source: RangeSlider,
					// },
					{
						...components.resultcard,
						type: 'ResultCard',
						source: ResultCard,
					},
				],
				query,
				components.settings,
			),
		};
	}

	render() {
		return (
			<div className="container">
				<ReactiveBase {...components.settings} initialState={this.props.store}>
					<nav className="nav">
						<div className="title">Airbeds</div>
						<DataSearch {...components.datasearch} />
					</nav>
					<div className="left-col">
						<NumberBox {...components.numberbox} />
						{/* <RangeSlider {...components.rangeslider} /> */}
					</div>

					<ResultCard {...components.resultcard} />
				</ReactiveBase>
			</div>
		);
	}
}
