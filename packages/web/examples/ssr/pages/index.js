import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	ReactiveBase,
	SearchBox,
	NumberBox,
	RangeSlider,
	ReactiveList,
	SelectedFilters,
} from '@appbaseio/reactivesearch';
import initReactivesearch from '@appbaseio/reactivesearch/lib/server';
import { components } from './utils/index';

const components = {
	settings: {
		app: 'airbnb-dev',
		url: 'https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io',
		theme: {
			colors: {
				primaryColor: '#FF3A4E',
			},
		},
		enableAppbase: true,
	},
	searchbox: {
		componentId: 'SearchSensor',
		dataField: ['name', 'name.search'],
		autosuggest: false,
		placeholder: 'Search by house names',
		iconPosition: 'left',
		className: 'search',
		highlight: true,
		URLParams: true,
	},
	numberbox: {
		componentId: 'GuestSensor',
		dataField: 'accommodates',
		title: 'Guests',
		defaultValue: 2,
		labelPosition: 'right',
		data: {
			start: 1,
			end: 16,
		},
		URLParams: true,
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
		defaultValue: {
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
		render: ({ data }) => (
			<ReactiveList.ResultCardsWrapper>
				{data.map((item) => (
					<ResultCard href={item.listing_url} key={item._id}>
						<ResultCard.Image src={item.images ? item.images[0] : ''} />
						<ResultCard.Title>{item.name}</ResultCard.Title>
						<ResultCard.Description>
							<div>
								<div className="price">${item.price}</div>
								<p className="info">
									{item.room_type} · {item.accommodates} guests
								</p>
							</div>
						</ResultCard.Description>
					</ResultCard>
				))}
			</ReactiveList.ResultCardsWrapper>
		),
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
						...components.searchbox,
						source: SearchBox,
					},
					{
						...components.numberbox,
						source: NumberBox,
					},
					{
						...components.rangeslider,
						source: RangeSlider,
					},
					{
						...components.resultcard,
						source: ReactiveList,
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
						<SearchBox {...components.searchbox} />
					</nav>
					<div className="left-col">
						<NumberBox {...components.numberbox} />
						<RangeSlider {...components.rangeslider} />
					</div>

					<div className="search-container">
						<SearchBox {...components.searchbox} />
					</div>
					<div className="sub-container">
						<div className={isClicked ? 'left-bar-optional' : 'left-bar'}>
							<div className="filter-heading center">
								<b>
									{' '}
									<i className="fa fa-pied-piper-alt" /> Genres{' '}
								</b>
							</div>

							<MultiList {...components.multiList} className="genres-filter" />
							<hr className="blue" />

							<div className="filter-heading center">
								<b>
									<i className="fa fa-star" /> Ratings
								</b>
							</div>
							<RangeSlider {...components.rangeSlider} className="review-filter" />
						</div>

						<div
							className={isClicked ? 'result-container-optional' : 'result-container'}
						>
							<SelectedFilters
								showClearAll
								clearAllLabel="Clear filters"
								className="selected-filters"
							/>
							<ReactiveList {...components.resultcard} />
						</div>
					</div>
				</div>
			</ReactiveBase>
			<button className="toggle-button" onClick={handleClick}>
				{message}
			</button>
		</div>
	);
};

// eslint-disable-next-line
Main.getInitialProps = async ({ query }) => {
	return {
		store: await initReactivesearch(
			[
				{
					...components.searchbox,
					source: SearchBox,
				},
				{
					...components.multiList,
					source: MultiList,
				},
				{
					...components.rangeSlider,
					source: RangeSlider,
				},
				{
					...components.resultcard,
					source: ReactiveList,
				},
			],
			query,
			components.settings,
		),
	};
};

Main.propTypes = {
	store: PropTypes.oneOf([PropTypes.object]),
};

export default Main;
