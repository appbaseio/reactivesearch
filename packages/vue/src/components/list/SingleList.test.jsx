import { mount } from '@vue/test-utils';
import { ListConnected as SingleList } from './SingleList.jsx';
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

describe('SingleList', () => {
	it('should render no results message', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<SingleList
							mode="test"
							componentId="authors"
							dataField="authors.keyword"
							renderNoResults={() => 'No authors found'}
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
						<SingleList
							mode="test"
							componentId="authors"
							dataField="authors.keyword"
							renderNoResults={() => 'No authors found'}
							mockData={{
								aggregations: MOCK_AGGREGATIONS_DATA,
							}}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should render search/count/radio when showSearch/showCount/showRadio are true', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<SingleList
							mode="test"
							componentId="authors"
							dataField="authors.keyword"
							renderNoResults={() => 'No authors found'}
							mockData={{
								aggregations: MOCK_AGGREGATIONS_DATA,
							}}
							showSearch
							showCount
							showRadio
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should not render search/count/radio when showSearch/showCount/showRadio are set to false', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<SingleList
							mode="test"
							componentId="authors"
							dataField="authors.keyword"
							renderNoResults={() => 'No authors found'}
							mockData={{
								aggregations: MOCK_AGGREGATIONS_DATA,
							}}
							showSearch={false}
							showCount={false}
							showRadio={false}
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
						<SingleList
							mode="test"
							componentId="authors"
							dataField="authors.keyword"
							renderNoResults={() => 'No authors found'}
							mockData={{
								aggregations: MOCK_AGGREGATIONS_DATA,
							}}
							render={({ data, handleChange }) => (
								<div>
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
						<SingleList
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
						<SingleList
							mode="test"
							componentId="authors"
							dataField="authors.keyword"
							renderNoResults={() => 'No authors found'}
							mockData={{
								aggregations: MOCK_AGGREGATIONS_DATA,
							}}
							defaultValue="Nora Roberts"
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});
});
