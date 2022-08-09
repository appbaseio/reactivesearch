import React from 'react';
import renderer from 'react-test-renderer';
import ReactiveBase from '../basic/ReactiveBase';
import MultiList from '../list/MultiList';
import ErrorBoundary from './ErrorBoundary';


const MOCK_AGGREGATIONS_DATA = {
	'authors.keyword': {
		buckets: [
			{
				key: 'J. K. Rowling',
				doc_count: 10,
			},
			{
				key: 'Nora Roberts',
				doc_count: 7,
			},
		],
	},
};

it('should handle network errors 501, 502', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<ErrorBoundary>
					<MultiList
						mode="test"
						componentId="authors"
						dataField="authors.keyword"
						mockData={{
							aggregations: {
								'authors.keyword': {
									buckets: [],
								},
							},
							error: new Error('500: Network request failed'),
						}}
					/>
				</ErrorBoundary>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});
it('should handle error with renderError', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<ErrorBoundary renderError={error => `Error: ${error.message}`}>
					<MultiList
						mode="test"
						componentId="authors"
						dataField="authors.keyword"
						mockData={{
							aggregations: {
								'authors.keyword': {
									buckets: [],
								},
							},
							error: new Error('500: Network request failed'),
						}}
					/>
				</ErrorBoundary>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});
it('should handle error with componentIds passed', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<ErrorBoundary componentIds={['multilist-1', 'multilist-2']}>
					<MultiList
						mode="test"
						componentId="multilist-1"
						dataField="authors.keyword"
						mockData={{
							aggregations: {
								'authors.keyword': {
									buckets: [],
								},
							},
						}}
					/>
				</ErrorBoundary>
				<MultiList
					mode="test"
					componentId="multilist-2"
					dataField="authors.keyword"
					mockData={{
						error: new Error('Network request failed'),
						aggregations: MOCK_AGGREGATIONS_DATA,
					}}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});
