import React from 'react';
import renderer from 'react-test-renderer';
import MultiDropdownList from './MultiDropdownList';
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
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<MultiDropdownList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					renderNoResults={() => 'No authors found'}
					mockData={{
						aggregations: {
							'authors.keyword': {
								buckets: [],
							},
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
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<MultiDropdownList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					renderNoResults={() => 'No authors found'}
					mockData={{
						aggregations: MOCK_AGGREGATIONS_DATA,
					}}
					isOpen
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render search/count when showSearch/showCount are true', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<MultiDropdownList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					showSearch
					showCount
					renderNoResults={() => 'No authors found'}
					mockData={{
						aggregations: MOCK_AGGREGATIONS_DATA,
					}}
					isOpen
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should not render search/ count when showSearch/ showCount are false', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<MultiDropdownList
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
					isOpen
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should use renderItem to render the list item', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<MultiDropdownList
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
					isOpen
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should use render prop to render the list item', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<MultiDropdownList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					mockData={{
						aggregations: MOCK_AGGREGATIONS_DATA,
					}}
					render={({
						loading, error, data, handleChange,
					}) => {
						if (loading) {
							return <div>Fetching Results.</div>;
						}
						if (error) {
							return (
								<div>
									Something went wrong! Error details {JSON.stringify(error)}
								</div>
							);
						}
						return (
							<div>
								{data.map(item => (
									/* eslint-disable jsx-a11y/click-events-have-key-events */
									<span
										role="menuitem"
										style={{ padding: '5px', boxShadow: '1px 1px #c3c3c3' }}
										onClick={() => handleChange(item.key)}
										key={item.key}
										tabIndex="0"
									>
										<span>{item.key}</span>&nbsp; (<span>{item.doc_count}</span>
										)
									</span>
								))}
							</div>
						);
					}}
					isOpen
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should select default value', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<MultiDropdownList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					mockData={{
						aggregations: {},
					}}
					defaultValue={['J. K. Rowling']}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});
