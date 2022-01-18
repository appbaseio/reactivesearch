import { mount } from '@vue/test-utils';
import Vue from 'vue';
import { RangeConnected as DynamicRangeSlider } from './DynamicRangeSlider.jsx';
import ReactiveBase from '../ReactiveBase/index.jsx';

Vue.component('vue-slider-component', require('vue-slider-component'));

const MOCK_RANGE_DATA = {
	min: {
		value: 1,
	},
	max: {
		value: 3455,
	},
};

describe('DynamicRangeSlider', () => {
	it('should render range with slider', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<DynamicRangeSlider
							mode="test"
							componentId="DynamicRangeMock"
							dataField="books_count"
							mockData={{
								DynamicRangeMock__range__internal: {
									aggregations: MOCK_RANGE_DATA,
								},
							}}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should render title', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<DynamicRangeSlider
							mode="test"
							componentId="DynamicRangeMock"
							dataField="books_count"
							mockData={{
								DynamicRangeMock__range__internal: {
									aggregations: MOCK_RANGE_DATA,
								},
							}}
							title="Test Title"
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should render range labels', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<DynamicRangeSlider
							mode="test"
							componentId="DynamicRangeMock"
							dataField="books_count"
							mockData={{
								DynamicRangeMock__range__internal: {
									aggregations: MOCK_RANGE_DATA,
								},
							}}
							rangeLabels={(start, end) => ({
								start,
								end,
							})}
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
						<DynamicRangeSlider
							mode="test"
							componentId="DynamicRangeMock"
							dataField="books_count"
							mockData={{
								DynamicRangeMock__range__internal: {
									aggregations: MOCK_RANGE_DATA,
								},
							}}
							defaultValue={() => ({
								start: 30,
								end: 2300,
							})}
							rangeLabels={() => ({
								start: 30,
								end: 2300,
							})}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should not display tooltip when sliderOptions has tooltip set to false', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<DynamicRangeSlider
							mode="test"
							componentId="DynamicRangeMock"
							dataField="books_count"
							mockData={{
								DynamicRangeMock__range__internal: {
									aggregations: MOCK_RANGE_DATA,
								},
							}}
							defaultValue={() => ({
								start: 30,
								end: 2300,
							})}
							rangeLabels={() => ({
								start: 30,
								end: 2300,
							})}
							sliderOptions={{
								tooltip: false,
							}}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});
});
