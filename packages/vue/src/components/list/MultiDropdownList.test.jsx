import { mount } from '@vue/test-utils';
import { ListConnected as MultiDropdownList } from './MultiDropdownList.jsx';
import ReactiveBase from '../ReactiveBase/index.jsx';

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

describe('MultiDropdownList', () => {
	it('should render no results message', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<MultiDropdownList
							mode="test"
							componentId="authors"
							dataField="authors.keyword"
							renderNoResults={() => 'No authors found'}
							mockData={{
								'authors.keyword': {
									buckets: [],
								},
							}}
							isOpen={true}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should render list of items', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<MultiDropdownList
							mode="test"
							componentId="authors"
							dataField="authors.keyword"
							renderNoResults={() => 'No authors found'}
							mockData={{
								aggregations: MOCK_AGGREGATIONS_DATA,
							}}
							isOpen={true}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should render search/count when showSearch/showCount are true', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<MultiDropdownList
							mode="test"
							componentId="authors"
							dataField="authors.keyword"
							renderNoResults={() => 'No authors found'}
							mockData={{
								aggregations: MOCK_AGGREGATIONS_DATA,
							}}
							showSearch
							showCount
							isOpen={true}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should not render search/count when showSearch/showCount are set to false', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<MultiDropdownList
							mode="test"
							componentId="authors"
							dataField="authors.keyword"
							renderNoResults={() => 'No authors found'}
							mockData={{
								aggregations: MOCK_AGGREGATIONS_DATA,
							}}
							showSearch={false}
							showCount={false}
							isOpen={true}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should use render prop to render the list', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<MultiDropdownList
							mode="test"
							componentId="authors"
							dataField="authors.keyword"
							renderNoResults={() => 'No authors found'}
							mockData={{
								aggregations: MOCK_AGGREGATIONS_DATA,
							}}
							render={({ data, handleChange }) => (
								<div className="suggestions">
									<ul>
										{/* eslint-disable camelcase */}
										{data.map(({ doc_count, key }) => (
											<li
												style={{ backgroundColor: 'transparent' }}
												key={key}
												onClick={() => handleChange(key)}
											>
												{key} --- {doc_count}
											</li>
										))}
									</ul>
								</div>
							)}
							isOpen={true}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should use renderItem to render the list item', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<MultiDropdownList
							mode="test"
							componentId="authors"
							dataField="authors.keyword"
							renderNoResults={() => 'No authors found'}
							mockData={{
								aggregations: MOCK_AGGREGATIONS_DATA,
							}}
							renderItem={({ label, count }) => (
								<div>
									{label}
									<span style={{ marginLeft: 5, color: 'dodgerblue' }}>
										{count}
									</span>
								</div>
							)}
							isOpen={true}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should select default value', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<MultiDropdownList
							mode="test"
							componentId="authors"
							dataField="authors.keyword"
							renderNoResults={() => 'No authors found'}
							mockData={{
								aggregations: MOCK_AGGREGATIONS_DATA,
							}}
							defaultValue={['Nora Roberts']}
							isOpen={true}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});
});
