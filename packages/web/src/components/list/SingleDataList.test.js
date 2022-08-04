import React from 'react';
import renderer from 'react-test-renderer';
import ReactiveBase from '../basic/ReactiveBase';
import SingleDataList from './SingleDataList';

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
				<SingleDataList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					data={[
						{ label: 'J. K. Rowling', value: 'J. K. Rowling' },
						{ label: 'Nora Roberts', value: 'Nora Roberts' },
					]}
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
				<SingleDataList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					data={[
						{ label: 'J. K. Rowling', value: 'J. K. Rowling' },
						{ label: 'Nora Roberts', value: 'Nora Roberts' },
					]}
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
				<SingleDataList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					data={[
						{ label: 'J. K. Rowling', value: 'J. K. Rowling' },
						{ label: 'Nora Roberts', value: 'Nora Roberts' },
					]}
					renderItem={label => `${label} V`}
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
				<SingleDataList
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

it('should render with displayAsVertical', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SingleDataList
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
					displayAsVertical
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});


it('should render with showSearch', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SingleDataList
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
					showSearch
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});


it('should render with showRadio', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SingleDataList
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
					showRadio
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});


it('should render with showRadio and displayAsVertical', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SingleDataList
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
					showRadio
					displayAsVertical
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});


it('should render with showRadio, showSearch and displayAsVertical', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SingleDataList
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
					showRadio
					showSearch
					displayAsVertical
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render with showRadio and showSearch', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SingleDataList
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
					showRadio
					showSearch
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});
