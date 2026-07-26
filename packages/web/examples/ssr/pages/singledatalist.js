import React from 'react';
import {
	ReactiveBase,
	SingleDataList,
	SelectedFilters,
	ReactiveList,
	getServerState,
} from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';

import Layout from '../components/Layout';
import ListItemView from '../components/ListItemView';

const settings = {
	app: 'good-books-ds',
	url: 'https://reactivesearch-api-9-4-0.onrender.com',
	credentials: 'd03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0',
	enableAppbase: true,
};

const singleDataListProps = {
	componentId: 'LanguageSensor',
	dataField: 'language_code.keyword',
	data: [
		{ label: 'English', value: 'eng' },
		{ label: 'French', value: 'fre' },
		{ label: 'Spanish', value: 'spa' },
		{ label: 'German', value: 'ger' },
	],
	defaultValue: 'eng',
};

const resultListProps = {
	componentId: 'SearchResult',
	dataField: 'original_title.keyword',
	title: 'Results',
	sortBy: 'asc',
	className: 'result-list-container',
	from: 0,
	size: 5,
	render: ({ data }) => (
		<ReactiveList.ResultListWrapper>
			{data.map(item => (
				<ListItemView key={item._id} {...item} />
			))}
		</ReactiveList.ResultListWrapper>
	),
	pagination: true,
	react: {
		and: ['LanguageSensor'],
	},
};

const Main = props => (
	<Layout title="SSR | SingleDataList">
		<ReactiveBase
			{...settings}
			{...(props.contextCollector ? { contextCollector: props.contextCollector } : {})}
			initialState={props.initialState}
		>
			{' '}
			<div className="row">
				<div className="col">
					<SingleDataList {...singleDataListProps} />
				</div>

				<div className="col">
					<SelectedFilters />
					<ReactiveList {...resultListProps} />
				</div>
			</div>
		</ReactiveBase>
	</Layout>
);
export async function getServerSideProps(context) {
	const initialState = await getServerState(Main, context.resolvedUrl);
	return {
		props: { initialState },
		// will be passed to the page component as props
	};
}
Main.propTypes = {
	// eslint-disable-next-line
	initialState: PropTypes.object,
	contextCollector: PropTypes.func,
};
export default Main;
