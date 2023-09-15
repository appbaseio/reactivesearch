import React from 'react';
import renderer from 'react-test-renderer';
import MultiList from './MultiList';
import ReactiveBase from '../basic/ReactiveBase';

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

it('should render no results message', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
				<MultiList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					renderNoResults={() => 'No authors found'}
					mockData={{
						'authors.keyword': {
							buckets: [],
						},
					}}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render list of items', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
				<MultiList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					renderNoResults={() => 'No authors found'}
					mockData={{
						aggregations: MOCK_AGGREGATIONS_DATA,
					}}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render search/count/checkbox when showSearch/showCount/showCheckbox are true', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
				<MultiList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					showSearch
					showCount
					showCheckbox
					renderNoResults={() => 'No authors found'}
					mockData={{
						aggregations: MOCK_AGGREGATIONS_DATA,
					}}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should not render search/count/checkbox when showSearch/showCount/showCheckbox are false', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
				<MultiList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					showSearch={false}
					showCount={false}
					showCheckbox={false}
					renderNoResults={() => 'No authors found'}
					mockData={{
						aggregations: MOCK_AGGREGATIONS_DATA,
					}}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should use renderItem to render the list item', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
				<MultiList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					renderNoResults={() => 'No authors found'}
					defaultValue={['J. K. Rowling']}
					renderItem={(key, docCount, isChecked) =>
						(isChecked ? (
							<div className="checked">
								{key} - {docCount}
							</div>
						) : (
							<div>
								{key} - {docCount}
							</div>
						))
					}
					mockData={{
						aggregations: MOCK_AGGREGATIONS_DATA,
					}}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should use render prop to render the list item', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
				<MultiList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					renderNoResults={() => 'No authors found'}
					mockData={{
						aggregations: MOCK_AGGREGATIONS_DATA,
					}}
					render={({ data = [] }) => (
						<ul>
							{data.map(list => (
								<li key={list.key}>
									{list.key} {list.count}
								</li>
							))}
						</ul>
					)}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should select default value', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
				<MultiList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					mockData={{
						aggregations: MOCK_AGGREGATIONS_DATA,
					}}
					defaultValue={['J. K. Rowling']}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});
