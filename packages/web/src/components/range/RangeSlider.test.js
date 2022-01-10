import React from 'react';
import renderer from 'react-test-renderer';
import RangeSlider from './RangeSlider';
import ReactiveBase from '../basic/ReactiveBase';

const HISTOGRAM_DATA = {
	ratings_count: {
		buckets: [
			{
				key: 3000,
				doc_count: 2,
			},
			{
				key: 3470,
				doc_count: 1,
			},
			{
				key: 3940,
				doc_count: 2,
			},
			{
				key: 4410,
				doc_count: 6,
			},
			{
				key: 4880,
				doc_count: 11,
			},
			{
				key: 5350,
				doc_count: 14,
			},
			{
				key: 5820,
				doc_count: 17,
			},
			{
				key: 6290,
				doc_count: 8,
			},
			{
				key: 6760,
				doc_count: 25,
			},
			{
				key: 7230,
				doc_count: 32,
			},
			{
				key: 7700,
				doc_count: 68,
			},
			{
				key: 8170,
				doc_count: 107,
			},
			{
				key: 8640,
				doc_count: 122,
			},
			{
				key: 9110,
				doc_count: 152,
			},
			{
				key: 9580,
				doc_count: 173,
			},
			{
				key: 10050,
				doc_count: 191,
			},
			{
				key: 10520,
				doc_count: 215,
			},
			{
				key: 10990,
				doc_count: 229,
			},
			{
				key: 11460,
				doc_count: 214,
			},
			{
				key: 11930,
				doc_count: 179,
			},
			{
				key: 12400,
				doc_count: 223,
			},
			{
				key: 12870,
				doc_count: 193,
			},
			{
				key: 13340,
				doc_count: 203,
			},
			{
				key: 13810,
				doc_count: 175,
			},
			{
				key: 14280,
				doc_count: 198,
			},
			{
				key: 14750,
				doc_count: 159,
			},
			{
				key: 15220,
				doc_count: 175,
			},
			{
				key: 15690,
				doc_count: 130,
			},
			{
				key: 16160,
				doc_count: 176,
			},
			{
				key: 16630,
				doc_count: 145,
			},
			{
				key: 17100,
				doc_count: 166,
			},
			{
				key: 17570,
				doc_count: 119,
			},
			{
				key: 18040,
				doc_count: 153,
			},
			{
				key: 18510,
				doc_count: 119,
			},
			{
				key: 18980,
				doc_count: 133,
			},
			{
				key: 19450,
				doc_count: 103,
			},
			{
				key: 19920,
				doc_count: 98,
			},
			{
				key: 20390,
				doc_count: 99,
			},
			{
				key: 20860,
				doc_count: 98,
			},
			{
				key: 21330,
				doc_count: 104,
			},
			{
				key: 21800,
				doc_count: 104,
			},
			{
				key: 22270,
				doc_count: 91,
			},
			{
				key: 22740,
				doc_count: 90,
			},
			{
				key: 23210,
				doc_count: 71,
			},
			{
				key: 23680,
				doc_count: 97,
			},
			{
				key: 24150,
				doc_count: 88,
			},
			{
				key: 24620,
				doc_count: 87,
			},
			{
				key: 25090,
				doc_count: 76,
			},
			{
				key: 25560,
				doc_count: 64,
			},
			{
				key: 26030,
				doc_count: 77,
			},
			{
				key: 26500,
				doc_count: 65,
			},
			{
				key: 26970,
				doc_count: 71,
			},
			{
				key: 27440,
				doc_count: 64,
			},
			{
				key: 27910,
				doc_count: 54,
			},
			{
				key: 28380,
				doc_count: 53,
			},
			{
				key: 28850,
				doc_count: 63,
			},
			{
				key: 29320,
				doc_count: 60,
			},
			{
				key: 29790,
				doc_count: 53,
			},
			{
				key: 30260,
				doc_count: 56,
			},
			{
				key: 30730,
				doc_count: 39,
			},
			{
				key: 31200,
				doc_count: 43,
			},
			{
				key: 31670,
				doc_count: 51,
			},
			{
				key: 32140,
				doc_count: 51,
			},
			{
				key: 32610,
				doc_count: 53,
			},
			{
				key: 33080,
				doc_count: 46,
			},
			{
				key: 33550,
				doc_count: 42,
			},
			{
				key: 34020,
				doc_count: 37,
			},
			{
				key: 34490,
				doc_count: 37,
			},
			{
				key: 34960,
				doc_count: 37,
			},
			{
				key: 35430,
				doc_count: 34,
			},
			{
				key: 35900,
				doc_count: 33,
			},
			{
				key: 36370,
				doc_count: 36,
			},
			{
				key: 36840,
				doc_count: 42,
			},
			{
				key: 37310,
				doc_count: 43,
			},
			{
				key: 37780,
				doc_count: 39,
			},
			{
				key: 38250,
				doc_count: 29,
			},
			{
				key: 38720,
				doc_count: 34,
			},
			{
				key: 39190,
				doc_count: 30,
			},
			{
				key: 39660,
				doc_count: 34,
			},
			{
				key: 40130,
				doc_count: 29,
			},
			{
				key: 40600,
				doc_count: 28,
			},
			{
				key: 41070,
				doc_count: 32,
			},
			{
				key: 41540,
				doc_count: 24,
			},
			{
				key: 42010,
				doc_count: 33,
			},
			{
				key: 42480,
				doc_count: 28,
			},
			{
				key: 42950,
				doc_count: 21,
			},
			{
				key: 43420,
				doc_count: 30,
			},
			{
				key: 43890,
				doc_count: 33,
			},
			{
				key: 44360,
				doc_count: 31,
			},
			{
				key: 44830,
				doc_count: 21,
			},
			{
				key: 45300,
				doc_count: 23,
			},
			{
				key: 45770,
				doc_count: 24,
			},
			{
				key: 46240,
				doc_count: 26,
			},
			{
				key: 46710,
				doc_count: 20,
			},
			{
				key: 47180,
				doc_count: 16,
			},
			{
				key: 47650,
				doc_count: 27,
			},
			{
				key: 48120,
				doc_count: 25,
			},
			{
				key: 48590,
				doc_count: 26,
			},
			{
				key: 49060,
				doc_count: 19,
			},
			{
				key: 49530,
				doc_count: 17,
			},
		],
	},
};

it('should render slider', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<RangeSlider
					mode="test"
					componentId="range-slider-test"
					dataField="ratings_count"
					range={{
						start: 30000,
						end: 50000,
					}}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render histogram when showHistogram is set to true', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<RangeSlider
					mode="test"
					componentId="range-slider-test"
					dataField="ratings_count"
					range={{
						start: 30000,
						end: 50000,
					}}
					rangeLabels={{
						start: '30K',
						end: '50K',
					}}
					showHistogram
					mockData={{ aggregations: HISTOGRAM_DATA }}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should not render histogram when showHistogram is set to false', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<RangeSlider
					mode="test"
					componentId="range-slider-test"
					dataField="ratings_count"
					range={{
						start: 30000,
						end: 50000,
					}}
					rangeLabels={{
						start: '30K',
						end: '50K',
					}}
					showHistogram={false}
					mockData={{ aggregations: HISTOGRAM_DATA }}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render title', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<RangeSlider
					mode="test"
					componentId="range-slider-test"
					dataField="ratings_count"
					range={{
						start: 30000,
						end: 50000,
					}}
					title="Mock RangeSlider"
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render range labels', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<RangeSlider
					mode="test"
					componentId="range-slider-test"
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
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should select default value', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<RangeSlider
					mode="test"
					componentId="range-slider-test"
					dataField="ratings_count"
					range={{
						start: 30000,
						end: 50000,
					}}
					rangeLabels={{
						start: '30K',
						end: '50K',
					}}
					defaultValue={{
						start: 32000,
						end: 48000,
					}}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should display tooltip', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<RangeSlider
					mode="test"
					componentId="range-slider-test"
					dataField="ratings_count"
					range={{
						start: 30000,
						end: 50000,
					}}
					rangeLabels={{
						start: '30K',
						end: '50K',
					}}
					tooltipTrigger="always"
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});
