import React from 'react';
import renderer from 'react-test-renderer';
import ReactiveBase from '../basic/ReactiveBase';
import TabDataList from './TabDataList';

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
			{
				key: 'Bram Stoker',
				doc_count: 12,
			},
		],
	},
};
it('should render', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<TabDataList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					data={[
						{ label: 'J. K. Rowling', value: 'J. K. Rowling' },
						{ label: 'Nora Roberts', value: 'Nora Roberts' },
					]}
					mockData={{
						aggregations: MOCK_AGGREGATIONS_DATA,
					}}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});
it('should render with title', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<TabDataList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					data={[
						{ label: 'J. K. Rowling', value: 'J. K. Rowling' },
						{ label: 'Nora Roberts', value: 'Nora Roberts' },
					]}
					mockData={{
						aggregations: MOCK_AGGREGATIONS_DATA,
					}}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render with renderItem', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<TabDataList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					data={[
						{ label: 'J. K. Rowling', value: 'J. K. Rowling' },
						{ label: 'Nora Roberts', value: 'Nora Roberts' },
					]}
					mockData={{
						aggregations: MOCK_AGGREGATIONS_DATA,
					}}
					renderItem={item => `${item.label} V`}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render with showCount', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<TabDataList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					data={[
						{ label: 'J. K. Rowling', value: 'J. K. Rowling' },
						{ label: 'Nora Roberts', value: 'Nora Roberts' },
					]}
					mockData={{
						aggregations: MOCK_AGGREGATIONS_DATA,
					}}
					showCount
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});
