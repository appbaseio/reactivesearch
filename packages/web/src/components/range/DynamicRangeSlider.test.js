import React from 'react';
import renderer from 'react-test-renderer';
import DynamicRangeSlider from './DynamicRangeSlider';
import ReactiveBase from '../basic/ReactiveBase';

const HISTOGRAM_DATA = {
	books_count: {
		buckets: [
			{
				key: 1,
				doc_count: 3904,
			},
			{
				key: 36,
				doc_count: 3234,
			},
			{
				key: 71,
				doc_count: 1120,
			},
			{
				key: 106,
				doc_count: 384,
			},
			{
				key: 141,
				doc_count: 156,
			},
			{
				key: 176,
				doc_count: 113,
			},
			{
				key: 211,
				doc_count: 62,
			},
			{
				key: 246,
				doc_count: 57,
			},
			{
				key: 281,
				doc_count: 34,
			},
			{
				key: 316,
				doc_count: 35,
			},
			{
				key: 351,
				doc_count: 30,
			},
			{
				key: 386,
				doc_count: 20,
			},
			{
				key: 421,
				doc_count: 27,
			},
			{
				key: 456,
				doc_count: 20,
			},
			{
				key: 491,
				doc_count: 15,
			},
			{
				key: 526,
				doc_count: 12,
			},
			{
				key: 561,
				doc_count: 10,
			},
			{
				key: 596,
				doc_count: 17,
			},
			{
				key: 631,
				doc_count: 17,
			},
			{
				key: 666,
				doc_count: 8,
			},
			{
				key: 701,
				doc_count: 8,
			},
			{
				key: 736,
				doc_count: 8,
			},
			{
				key: 771,
				doc_count: 8,
			},
			{
				key: 806,
				doc_count: 8,
			},
			{
				key: 841,
				doc_count: 9,
			},
			{
				key: 876,
				doc_count: 3,
			},
			{
				key: 911,
				doc_count: 6,
			},
			{
				key: 946,
				doc_count: 5,
			},
			{
				key: 981,
				doc_count: 3,
			},
			{
				key: 1016,
				doc_count: 4,
			},
			{
				key: 1051,
				doc_count: 5,
			},
			{
				key: 1086,
				doc_count: 5,
			},
			{
				key: 1121,
				doc_count: 2,
			},
			{
				key: 1156,
				doc_count: 1,
			},
			{
				key: 1191,
				doc_count: 2,
			},
			{
				key: 1226,
				doc_count: 3,
			},
			{
				key: 1261,
				doc_count: 1,
			},
			{
				key: 1296,
				doc_count: 5,
			},
			{
				key: 1331,
				doc_count: 4,
			},
			{
				key: 1366,
				doc_count: 3,
			},
			{
				key: 1401,
				doc_count: 1,
			},
			{
				key: 1436,
				doc_count: 1,
			},
			{
				key: 1471,
				doc_count: 2,
			},
			{
				key: 1506,
				doc_count: 0,
			},
			{
				key: 1541,
				doc_count: 0,
			},
			{
				key: 1576,
				doc_count: 2,
			},
			{
				key: 1611,
				doc_count: 0,
			},
			{
				key: 1646,
				doc_count: 1,
			},
			{
				key: 1681,
				doc_count: 7,
			},
			{
				key: 1716,
				doc_count: 4,
			},
			{
				key: 1751,
				doc_count: 1,
			},
			{
				key: 1786,
				doc_count: 1,
			},
			{
				key: 1821,
				doc_count: 1,
			},
			{
				key: 1856,
				doc_count: 2,
			},
			{
				key: 1891,
				doc_count: 1,
			},
			{
				key: 1926,
				doc_count: 2,
			},
			{
				key: 1961,
				doc_count: 2,
			},
			{
				key: 1996,
				doc_count: 0,
			},
			{
				key: 2031,
				doc_count: 0,
			},
			{
				key: 2066,
				doc_count: 0,
			},
			{
				key: 2101,
				doc_count: 0,
			},
			{
				key: 2136,
				doc_count: 0,
			},
			{
				key: 2171,
				doc_count: 0,
			},
			{
				key: 2206,
				doc_count: 1,
			},
			{
				key: 2241,
				doc_count: 0,
			},
			{
				key: 2276,
				doc_count: 2,
			},
			{
				key: 2311,
				doc_count: 0,
			},
			{
				key: 2346,
				doc_count: 1,
			},
			{
				key: 2381,
				doc_count: 0,
			},
			{
				key: 2416,
				doc_count: 1,
			},
			{
				key: 2451,
				doc_count: 0,
			},
			{
				key: 2486,
				doc_count: 1,
			},
			{
				key: 2521,
				doc_count: 0,
			},
			{
				key: 2556,
				doc_count: 2,
			},
			{
				key: 2591,
				doc_count: 1,
			},
			{
				key: 2626,
				doc_count: 0,
			},
			{
				key: 2661,
				doc_count: 0,
			},
			{
				key: 2696,
				doc_count: 0,
			},
			{
				key: 2731,
				doc_count: 0,
			},
			{
				key: 2766,
				doc_count: 0,
			},
			{
				key: 2801,
				doc_count: 0,
			},
			{
				key: 2836,
				doc_count: 0,
			},
			{
				key: 2871,
				doc_count: 0,
			},
			{
				key: 2906,
				doc_count: 0,
			},
			{
				key: 2941,
				doc_count: 0,
			},
			{
				key: 2976,
				doc_count: 0,
			},
			{
				key: 3011,
				doc_count: 0,
			},
			{
				key: 3046,
				doc_count: 0,
			},
			{
				key: 3081,
				doc_count: 0,
			},
			{
				key: 3116,
				doc_count: 0,
			},
			{
				key: 3151,
				doc_count: 0,
			},
			{
				key: 3186,
				doc_count: 0,
			},
			{
				key: 3221,
				doc_count: 0,
			},
			{
				key: 3256,
				doc_count: 0,
			},
			{
				key: 3291,
				doc_count: 0,
			},
			{
				key: 3326,
				doc_count: 0,
			},
			{
				key: 3361,
				doc_count: 0,
			},
			{
				key: 3396,
				doc_count: 0,
			},
			{
				key: 3431,
				doc_count: 1,
			},
		],
	},
};

const MOCK_RANGE_DATA = {
	min: {
		value: 1,
	},
	max: {
		value: 3455,
	},
};

it('should render slider', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<DynamicRangeSlider
					mode="test"
					componentId="DynamicRangeMock"
					dataField="books_count"
					mockData={{
						DynamicRangeMock: { aggregations: HISTOGRAM_DATA },
						DynamicRangeMock__range__internal: { aggregations: MOCK_RANGE_DATA },
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
				<DynamicRangeSlider
					mode="test"
					componentId="DynamicRangeMock"
					dataField="books_count"
					mockData={{
						DynamicRangeMock: { aggregations: HISTOGRAM_DATA },
						DynamicRangeMock__range__internal: { aggregations: MOCK_RANGE_DATA },
					}}
					showHistogram
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
				<DynamicRangeSlider
					mode="test"
					componentId="DynamicRangeMock"
					dataField="books_count"
					mockData={{
						DynamicRangeMock: { aggregations: HISTOGRAM_DATA },
						DynamicRangeMock__range__internal: { aggregations: MOCK_RANGE_DATA },
					}}
					showHistogram={false}
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
				<DynamicRangeSlider
					mode="test"
					componentId="DynamicRangeMock"
					dataField="books_count"
					mockData={{
						DynamicRangeMock: { aggregations: HISTOGRAM_DATA },
						DynamicRangeMock__range__internal: { aggregations: MOCK_RANGE_DATA },
					}}
					title="Mock Title"
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
				<DynamicRangeSlider
					mode="test"
					componentId="DynamicRangeMock"
					dataField="books_count"
					mockData={{
						DynamicRangeMock: { aggregations: HISTOGRAM_DATA },
						DynamicRangeMock__range__internal: { aggregations: MOCK_RANGE_DATA },
					}}
					rangeLabels={(min, max) => ({
						start: `Test ${min}`,
						end: `Test ${max}`,
					})}
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
				<DynamicRangeSlider
					mode="test"
					componentId="DynamicRangeMock"
					dataField="books_count"
					mockData={{
						DynamicRangeMock: { aggregations: HISTOGRAM_DATA },
						DynamicRangeMock__range__internal: { aggregations: MOCK_RANGE_DATA },
					}}
					tooltipTrigger="always"
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});
