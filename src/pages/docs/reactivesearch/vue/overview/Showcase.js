import React from 'react';
import {
	ReactiveBase,
	DataSearch,
	MultiList,
	SingleDropdownList,
	SingleList,
	DynamicRangeSlider,
	ToggleButton,
	ReactiveList,
} from '@appbaseio/reactivesearch';
import Helmet from 'react-helmet';

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
	showHistogram: false,
	tooltipTrigger: 'hover',
	rangeLabels: (min, max) => ({
		start: `$${min}`,
		end: `$${max}`,
	}),
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
				nestedSidebar="vue-reactivesearch"
				location={location}
				post={{ title: 'Showcase' }}
			>
				{mounted ? (
					<ReactiveBase {...settings}>
						<div className="showcase">
							<div className="w-100">
								<ShowcaseComponent
									title="DataSearch"
									link="/docs/reactivesearch/vue/search/DataSearch/"
								>
									<DataSearch {...dataSearchProps} />
								</ShowcaseComponent>
							</div>
							<div className="showcase-grid grid-2">
								<ShowcaseComponent
									title="MultiList - Accommodates"
									link="/docs/reactivesearch/vue/list/MultiList/"
								>
									<MultiList {...multilistProps} />
								</ShowcaseComponent>

								<ShowcaseComponent
									title="SingleList - Property Type"
									link="/docs/reactivesearch/vue/list/SingleList/"
								>
									<SingleList {...singleListProps} />
								</ShowcaseComponent>
							</div>

							<div className="showcase-grid">
								<ShowcaseComponent
									title="DynamicRangeSlider - Price"
									link="/docs/reactivesearch/vue/range/DynamicRangeSlider/"
								>
									<DynamicRangeSlider {...rangeSliderProps} />
								</ShowcaseComponent>
							</div>

							<div className="showcase-grid grid-2">
								<ShowcaseComponent
									title="SingleDropdownList - Property Type"
									link="/docs/reactivesearch/vue/list/SingleDropdownList/"
								>
									<SingleDropdownList {...singleDropdownProps} />
								</ShowcaseComponent>
								<ShowcaseComponent
									title="ToggleButton - Room Type"
									link="/docs/reactivesearch/vue/list/ToggleButton/"
								>
									<ToggleButton {...toggleButtonProps} />
								</ShowcaseComponent>
							</div>
							<div className="showcase-grid">
								<ShowcaseComponent
									title="ReactiveList"
									link="/docs/reactivesearch/vue/result/ReactiveList/"
								>
									<ReactiveList {...reactiveListProps} />
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
