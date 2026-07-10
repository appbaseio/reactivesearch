import React from 'react';
import {
	ReactiveBase,
	SelectedFilters,
	ReactiveList,
	SearchBox,
	getServerState,
} from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';

import Layout from '../components/Layout';
import BookCard from '../components/BookCard';

const settings = {
	app: 'good-books-ds',
	url: 'https://reactivesearch-api-9-4-0.onrender.com',
	credentials: 'd03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0',
	enableAppbase: true,
};

const searchBoxProps = {
	dataField: ['original_title', 'original_title.search'],
	categoryField: 'authors.keyword',
	componentId: 'BookSensor',
	URLParams: true,
};

const reactiveListProps = {
	componentId: 'SearchResult',
	dataField: 'original_title',
	className: 'result-list-container',
	from: 0,
	size: 5,
	renderItem: data => <BookCard key={data._id} data={data} />,
	react: {
		and: ['BookSensor'],
	},
};

const Main = props => (
	<Layout title="SSR | SearchBoxWithCategory">
		<ReactiveBase
			{...settings}
			{...(props.contextCollector ? { contextCollector: props.contextCollector } : {})}
			initialState={props.initialState}
		>
			<div className="row">
				<div className="col">
					<SearchBox {...searchBoxProps} />
				</div>

				<div className="col">
					<SelectedFilters />
					<ReactiveList {...reactiveListProps} />
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
