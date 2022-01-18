import { mount } from '@vue/test-utils';
import Vue from 'vue';
import { RangeConnected as RangeSlider } from './RangeSlider.jsx';
import ReactiveBase from '../ReactiveBase/index.jsx';

Vue.component('vue-slider-component', require('vue-slider-component'));

describe('RangeSlider', () => {
	it('should render range with slider', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<RangeSlider
							mode="test"
							componentId="authors"
							dataField="ratings_count"
							range={{
								start: 30000,
								end: 50000,
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
						<RangeSlider
							mode="test"
							componentId="authors"
							dataField="ratings_count"
							range={{
								start: 30000,
								end: 50000,
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
						<RangeSlider
							mode="test"
							componentId="authors"
							dataField="ratings_count"
							range={{
								start: 30000,
								end: 50000,
							}}
							rangeLabels={{
								start: '30K',
								end: '50K',
							}}
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
						<RangeSlider
							mode="test"
							componentId="authors"
							dataField="ratings_count"
							range={{
								start: 3000,
								end: 5500,
							}}
							rangeLabels={{
								start: '3K',
								end: '5.5K',
							}}
							defaultValue={{
								start: 3200,
								end: 4500,
							}}
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
						<RangeSlider
							mode="test"
							componentId="authors"
							dataField="ratings_count"
							range={{
								start: 3000,
								end: 5500,
							}}
							rangeLabels={{
								start: '3K',
								end: '5.5K',
							}}
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
