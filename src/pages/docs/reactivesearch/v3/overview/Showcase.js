import React from 'react';
import {
	ReactiveBase,
	DataSearch,
	MultiList,
	RatingsFilter,
	SingleDropdownList,
	SingleList,
	DynamicRangeSlider,
	ToggleButton,
	ReactiveList,
	DateRange,
} from '@appbaseio/reactivesearch';
import { ReactiveGoogleMap } from '@appbaseio/reactivemaps';
import Helmet from 'react-helmet';
import moment from 'moment';

import PostLayout from '../../../../../components/PostLayout';
import ShowcaseComponent from '../../../../../components/ShowcaseComponent';

const settings = {
	app: 'airbeds-yj',
	credentials: 'eRPhaUPwK:22f9279e-3b86-432d-a9b0-ba8a6f07f459',
	theme: {
		colors: {
			textColor: '#738a94',
			primaryTextColor: '#fff',
			primaryColor: '#3eb0ef',
			titleColor: '#343f44',
			alertColor: '#d9534f',
		},
	},
};

const dataSearchProps = {
	dataField: ['name', 'name.autosuggest', 'name.keyword', 'name.search'],
	className: 'showcase-search',
	componentId: 'search',
};

const multilistProps = {
	dataField: 'accommodates',
	componentId: 'multilist',
	react: { and: ['search'] },
	className: 'showcase-list',
	showSearch: false,
	placeholder: 'Select Accommodates',
};

const singleListProps = {
	dataField: 'property_type.raw',
	componentId: 'singlelist',
	react: { and: ['search'] },
	className: 'showcase-list',
	showSearch: false,
	placeholder: 'Select Property Type',
};

const singleDropdownProps = {
	dataField: 'property_type.raw',
	componentId: 'singledropdownlist',
	className: 'dropdown-list',
	react: { and: ['search'] },
	showSearch: false,
};

const rangeSliderProps = {
	dataField: 'price',
	componentId: 'rangeslider',
	react: { and: ['search'] },
	showHistogram: true,
	tooltipTrigger: 'hover',
	rangeLabels: (min, max) => ({
		start: `$${min}`,
		end: `$${max}`,
	}),
};

const dateRangeProps = {
	componentId: 'date',
	dataField: 'date_from',
	numberOfMonths: 2,
	customQuery: value => {
		let query = null;
		if (value) {
			query = [
				{
					range: {
						date_from: {
							gte: moment(value.start).format('YYYYMMDD'),
						},
					},
				},
				{
					range: {
						date_to: {
							lte: moment(value.end).format('YYYYMMDD'),
						},
					},
				},
			];
		}
		return query ? { query: { bool: { must: query } } } : null;
	},
	initialMonth: new Date('04/01/2017'),
};

const ratingsFilterProps = {
	componentId: 'ratingfilter',
	dataField: 'beds',
	dimmedIcon: (
		<img
			style={{ width: 22, height: 22, marginLeft: 5 }}
			alt="Inactive Bed"
			src="https://img.icons8.com/pastel-glyph/2x/bed--v2.png"
		/>
	),
	icon: (
		<img
			style={{ width: 22, height: 22, marginLeft: 5 }}
			alt="Active Bed"
			src="https://img.icons8.com/cotton/2x/bed--v2.png"
		/>
	),
	data: [
		{ start: 4, end: 5, label: '4 & up' },
		{ start: 3, end: 5, label: '3 & up' },
		{ start: 2, end: 5, label: '2 & up' },
		{ start: 1, end: 5, label: '> 1 vote' },
	],
};

const toggleButtonProps = {
	componentId: 'togglebutton',
	dataField: 'room_type.raw',
	data: [
		{ label: 'Entire home/apt', value: 'Entire home/apt' },
		{ label: 'Private Room', value: 'Private room' },
	],
};

const reactiveListProps = {
	componentId: 'result',
	react: {
		and: [
			'togglebutton',
			'ratingfilter',
			'rangeslider',
			'search',
			'singledropdownlist',
			'singlelist',
			'multilist',
			'date',
		],
	},
	size: 5,
	pagination: true,
	dataField: '_score',
	renderItem: res => <pre key={res._id}>{res.name}</pre>,
	scrollOnChange: false,
};

const reactiveMapProps = {
	componentId: 'map',
	react: {
		and: [
			'togglebutton',
			'ratingfilter',
			'rangeslider',
			'search',
			'singledropdownlist',
			'singlelist',
			'multilist',
		],
	},
	size: 100,
	defaultZoom: 12,
	dataField: 'location',
	defaultMapStyle: 'Light Monochrome',
	onPopoverClick: item => {
		return (
			<div>
				<img loading="lazy" src={item.image} alt={item.name} />
				<p style={{ margin: '5px 0' }}>{item.name}</p>
			</div>
		);
	},
	deafultMapStyles: 'Midnight Commander',
};

class Showcase extends React.Component {
	state = {
		mounted: false,
	};

	async componentDidMount() {
		this.setState({
			mounted: true,
		});
	}

	render() {
		const { mounted } = this.state;
		const { location } = this.props;
		return (
			<PostLayout
				sidebar="docs"
				nestedSidebar="web-reactivesearch"
				location={location}
				post={{ title: 'Showcase' }}
			>
				<Helmet>
					<script
						type="text/javascript"
						src="https://maps.google.com/maps/api/js?v=3.31&key=AIzaSyAKz3UhgSuP872fb-Aw27oPRI7M0eXkA9U&libraries=places"
					></script>
				</Helmet>
				{mounted ? (
					<ReactiveBase {...settings}>
						<div className="showcase">
							<div className="w-100">
								<ShowcaseComponent
									title="DataSearch"
									link="/docs/reactivesearch/v3/search/datasearch/"
								>
									<DataSearch {...dataSearchProps} />
								</ShowcaseComponent>
							</div>
							<div className="showcase-grid grid-2">
								<ShowcaseComponent
									title="MultiList - Accommodates"
									link="/docs/reactivesearch/v3/list/multilist/"
								>
									<MultiList {...multilistProps} />
								</ShowcaseComponent>

								<ShowcaseComponent
									title="SingleList - Property Type"
									link="/docs/reactivesearch/v3/list/singlelist/"
								>
									<SingleList {...singleListProps} />
								</ShowcaseComponent>
							</div>

							<div className="showcase-grid grid-2">
								<ShowcaseComponent
									title="DynamicRangeSlider - Price"
									link="/docs/reactivesearch/v3/range/dynamicrangeslider/"
								>
									<DynamicRangeSlider {...rangeSliderProps} />
								</ShowcaseComponent>

								<ShowcaseComponent
									title="RatingsFilter - Beds"
									link="/docs/reactivesearch/v3/range/ratingsfilter/"
								>
									<RatingsFilter {...ratingsFilterProps} />
								</ShowcaseComponent>
							</div>

							<div className="showcase-grid">
								<ShowcaseComponent
									title="DateRange - Date From"
									link="/docs/reactivesearch/v3/range/daterange/"
								>
									<DateRange {...dateRangeProps} />
								</ShowcaseComponent>
							</div>

							<div className="showcase-grid grid-2">
								<ShowcaseComponent
									title="SingleDropdownList - Property Type"
									link="/docs/reactivesearch/v3/list/singledropdownlist/"
								>
									<SingleDropdownList {...singleDropdownProps} />
								</ShowcaseComponent>
								<ShowcaseComponent
									title="ToggleButton - Room Type"
									link="/docs/reactivesearch/v3/list/togglebutton/"
								>
									<ToggleButton {...toggleButtonProps} />
								</ShowcaseComponent>
							</div>
							<div className="showcase-grid">
								<ShowcaseComponent
									title="ReactiveList"
									link="/docs/reactivesearch/v3/result/reactivelist/"
								>
									<ReactiveList {...reactiveListProps} />
								</ShowcaseComponent>
							</div>

							<div className="showcase-grid">
								<ShowcaseComponent
									title="ReactiveMaps"
									link="/docs/reactivesearch/v3/map/reactivegooglemap/"
								>
									<ReactiveGoogleMap {...reactiveMapProps} />
								</ShowcaseComponent>
							</div>
						</div>
					</ReactiveBase>
				) : (
					'Loading'
				)}
			</PostLayout>
		);
	}
}

export default Showcase;
