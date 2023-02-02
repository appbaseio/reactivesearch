import React from 'react';
import {
	ReactiveBase,
	NumberBox,
	SelectedFilters,
	ReactiveList,
	getServerState,
} from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';

import Layout from '../components/Layout';
import BookCard from '../components/BookCard';

const settings = {
	app: 'good-books-ds',
	url: 'https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io',
	enableAppbase: true,
};

const numberBoxProps = {
	componentId: 'BookSensor',
	dataField: 'average_rating_rounded',
	data: {
		label: 'Book Rating',
		start: 2,
		end: 5,
	},
	showFilter: false,
	defaultValue: 3,
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
	<Layout title="SSR | NumberBox">
		<ReactiveBase
			{...settings}
			{...(props.contextCollector ? { contextCollector: props.contextCollector } : {})}
			initialState={props.initialState}
		>
			<div className="row">
				<div className="col">
					<NumberBox {...numberBoxProps} />
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
