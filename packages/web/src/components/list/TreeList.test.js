import React from 'react';
import renderer from 'react-test-renderer';
import { recLookup } from '@appbaseio/reactivecore/lib/utils/helper';
import TreeList from './TreeList';
import ReactiveBase from '../basic/ReactiveBase';

const MOCK_AGGREGATIONS_DATA = {
	took: 34,
	timed_out: false,
	_shards: {
		total: 3,
		successful: 3,
		skipped: 0,
		failed: 0,
	},
	hits: {
		total: {
			value: 10000,
			relation: 'gte',
		},
		max_score: null,
		hits: [],
	},
	aggregations: {
		'class.keyword': {
			doc_count_error_upper_bound: 689,
			sum_other_doc_count: 38957,
			buckets: [
				{
					key: 'COMPACT DISC',
					doc_count: 70654,
					'subclass.keyword': {
						doc_count_error_upper_bound: 0,
						sum_other_doc_count: 16,
						buckets: [
							{
								key: 'VINYL',
								doc_count: 69731,
							},
							{
								key: 'MUSIC DVD',
								doc_count: 565,
							},
							{
								key: 'CLASSICAL-OPERA',
								doc_count: 106,
							},
							{
								key: 'ROCK-ELECTRONIC',
								doc_count: 72,
							},
							{
								key: 'ROCK',
								doc_count: 64,
							},
							{
								key: 'REGGAE',
								doc_count: 39,
							},
							{
								key: 'MISC.',
								doc_count: 34,
							},
							{
								key: 'RAP',
								doc_count: 13,
							},
							{
								key: 'JAZZ-CONTEMPORARY',
								doc_count: 7,
							},
							{
								key: 'R&B',
								doc_count: 7,
							},
						],
					},
				},
				{
					key: 'DVD SOFTWARE',
					doc_count: 48268,
					'subclass.keyword': {
						doc_count_error_upper_bound: 9,
						sum_other_doc_count: 2606,
						buckets: [
							{
								key: 'SPORTS & FITNESS',
								doc_count: 12553,
							},
							{
								key: 'DRAMA/DR',
								doc_count: 9853,
							},
							{
								key: 'COMEDY/CO',
								doc_count: 4455,
							},
							{
								key: 'TV-A-Z',
								doc_count: 4252,
							},
							{
								key: 'SCIENCE FICTION/SF',
								doc_count: 3826,
							},
							{
								key: 'ACTION/AC',
								doc_count: 3336,
							},
							{
								key: 'CHILDRENS-FAMILY',
								doc_count: 3035,
							},
							{
								key: 'MUSIC DVD',
								doc_count: 2208,
							},
							{
								key: 'FAITH',
								doc_count: 1077,
							},
							{
								key: 'SPORTS',
								doc_count: 1067,
							},
						],
					},
				},
				{
					key: 'BLU RAY MOVIES',
					doc_count: 13622,
					'subclass.keyword': {
						doc_count_error_upper_bound: 0,
						sum_other_doc_count: 382,
						buckets: [
							{
								key: 'BLU RAY A-Z',
								doc_count: 9526,
							},
							{
								key: 'ACTION',
								doc_count: 1029,
							},
							{
								key: 'DRAMA',
								doc_count: 645,
							},
							{
								key: 'BLU RAY TV',
								doc_count: 433,
							},
							{
								key: 'COMEDY',
								doc_count: 420,
							},
							{
								key: 'HORROR',
								doc_count: 336,
							},
							{
								key: 'ANIME',
								doc_count: 253,
							},
							{
								key: 'CHILDRENS',
								doc_count: 249,
							},
							{
								key: 'BLURAY MUSIC',
								doc_count: 203,
							},
							{
								key: 'BLU RAY STEELBOOKS',
								doc_count: 146,
							},
						],
					},
				},
				{
					key: 'PREMIUM MAJOR APPL',
					doc_count: 7742,
					'subclass.keyword': {
						doc_count_error_upper_bound: 16,
						sum_other_doc_count: 1987,
						buckets: [
							{
								key: 'SO PAC ACCY BBHD',
								doc_count: 928,
							},
							{
								key: 'SO PAC VENTIL REG',
								doc_count: 921,
							},
							{
								key: 'SO PAC GAS RANGE REG',
								doc_count: 722,
							},
							{
								key: 'SO PAC OUTDR ACC REG',
								doc_count: 613,
							},
							{
								key: 'SO PAC FS ODKCHN REG',
								doc_count: 560,
							},
							{
								key: 'SO PAC ODBI KCHN REG',
								doc_count: 527,
							},
							{
								key: 'SO PAC DUAL RANG REG',
								doc_count: 487,
							},
							{
								key: 'SO PAC COL REFRG REG',
								doc_count: 354,
							},
							{
								key: 'SO PAC UC COOLNG REG',
								doc_count: 333,
							},
							{
								key: 'SO PAC PRO RANGE REG',
								doc_count: 310,
							},
						],
					},
				},
				{
					key: 'FURNITURE SO',
					doc_count: 4726,
					'subclass.keyword': {
						doc_count_error_upper_bound: 0,
						sum_other_doc_count: 280,
						buckets: [
							{
								key: 'SO ENT FURN',
								doc_count: 2213,
							},
							{
								key: 'SO CHAIR &RECLIN',
								doc_count: 581,
							},
							{
								key: 'SO OFFICE FURN',
								doc_count: 542,
							},
							{
								key: 'SO BOOKCS&ENDTAB',
								doc_count: 315,
							},
							{
								key: 'SO LAMPS',
								doc_count: 187,
							},
							{
								key: 'SO OTTOMANS',
								doc_count: 164,
							},
							{
								key: 'SO HOME DECOR',
								doc_count: 133,
							},
							{
								key: 'SO DINING ROOM',
								doc_count: 126,
							},
							{
								key: 'SO BEDS &FRAMES',
								doc_count: 112,
							},
							{
								key: 'SO BEDDING ACC',
								doc_count: 73,
							},
						],
					},
				},
				{
					key: 'TRAFFIC APPLIANCES',
					doc_count: 2861,
					'subclass.keyword': {
						doc_count_error_upper_bound: 34,
						sum_other_doc_count: 1274,
						buckets: [
							{
								key: 'SO COOKWARE',
								doc_count: 510,
							},
							{
								key: 'SO KITCEN GADGETS',
								doc_count: 249,
							},
							{
								key: 'SO PORTABLE BEVERAGE',
								doc_count: 159,
							},
							{
								key: 'ACCESSORIES',
								doc_count: 131,
							},
							{
								key: 'BLENDERS',
								doc_count: 101,
							},
							{
								key: 'SO COFFEE MAKERS',
								doc_count: 101,
							},
							{
								key: 'SO MISC HOUSEWARES',
								doc_count: 92,
							},
							{
								key: 'MISC. HOUSEWARES',
								doc_count: 85,
							},
							{
								key: 'SO KETTLE',
								doc_count: 80,
							},
							{
								key: 'ESPRESSO MAKERS',
								doc_count: 79,
							},
						],
					},
				},
				{
					key: 'IPHONE ACCY',
					doc_count: 2313,
					'subclass.keyword': {
						doc_count_error_upper_bound: 0,
						sum_other_doc_count: 1,
						buckets: [
							{
								key: 'SO IPHONE ACCY',
								doc_count: 1070,
							},
							{
								key: 'SO NON IPHONE CASES',
								doc_count: 455,
							},
							{
								key: 'TREND CASES',
								doc_count: 213,
							},
							{
								key: 'SO SCREEN PROTECTORS',
								doc_count: 209,
							},
							{
								key: 'ULT PROTECTION CASES',
								doc_count: 204,
							},
							{
								key: 'SURFACE PROTECTION',
								doc_count: 79,
							},
							{
								key: 'SLIM CASES',
								doc_count: 51,
							},
							{
								key: 'WATER PROOF CASES',
								doc_count: 15,
							},
							{
								key: 'BATTERY CASES',
								doc_count: 8,
							},
							{
								key: 'GSRF BATTERY CASES',
								doc_count: 8,
							},
						],
					},
				},
				{
					key: 'DIGITAL GAMING',
					doc_count: 1900,
					'subclass.keyword': {
						doc_count_error_upper_bound: 0,
						sum_other_doc_count: 25,
						buckets: [
							{
								key: 'DIGITAL XB1 FGD',
								doc_count: 878,
							},
							{
								key: 'DIGITAL NINTENDO FGD',
								doc_count: 243,
							},
							{
								key: 'DIGITAL PC DLC',
								doc_count: 195,
							},
							{
								key: 'DIGITAL PC SUB PNTS',
								doc_count: 166,
							},
							{
								key: 'DIGITAL PC FGD',
								doc_count: 135,
							},
							{
								key: 'DIGITAL PS4 SUB-PNTS',
								doc_count: 88,
							},
							{
								key: 'DIGITAL XB1 SUB-PNTS',
								doc_count: 72,
							},
							{
								key: 'DIGITAL NIN SUB-PNTS',
								doc_count: 44,
							},
							{
								key: 'DIGITAL PS4 DLC',
								doc_count: 27,
							},
							{
								key: 'DIGITAL XB1 DLC',
								doc_count: 27,
							},
						],
					},
				},
				{
					key: 'VIDEO GAME SOFTWARE',
					doc_count: 1665,
					'subclass.keyword': {
						doc_count_error_upper_bound: 0,
						sum_other_doc_count: 50,
						buckets: [
							{
								key: 'PLAYSTATION 4 SW',
								doc_count: 569,
							},
							{
								key: 'XBX1 SOFTWARE',
								doc_count: 410,
							},
							{
								key: 'NINTENDO SWITCH SFTW',
								doc_count: 408,
							},
							{
								key: 'PNEXT SOFTWARE',
								doc_count: 52,
							},
							{
								key: 'PC GAMING SOFTWARE',
								doc_count: 46,
							},
							{
								key: 'TOY 2 LIFE CHARACTER',
								doc_count: 37,
							},
							{
								key: 'GAMING COLLECTIBLES',
								doc_count: 26,
							},
							{
								key: 'SO PS4',
								doc_count: 25,
							},
							{
								key: 'SO XBX',
								doc_count: 25,
							},
							{
								key: 'XNEXT SOFTWARE',
								doc_count: 17,
							},
						],
					},
				},
				{
					key: 'BUILT-INS',
					doc_count: 1492,
					'subclass.keyword': {
						doc_count_error_upper_bound: 9,
						sum_other_doc_count: 369,
						buckets: [
							{
								key: 'SO RANGHOODS BBHD',
								doc_count: 310,
							},
							{
								key: 'SO RANGEHOODS',
								doc_count: 217,
							},
							{
								key: 'SO RANGEHOODS LTL',
								doc_count: 145,
							},
							{
								key: 'SO BI ACCY BBHD',
								doc_count: 98,
							},
							{
								key: 'SO EL SING WLOV BBHD',
								doc_count: 83,
							},
							{
								key: 'SO ELEC COOKTOP BBHD',
								doc_count: 72,
							},
							{
								key: 'SO WIN BEV COOL BBHD',
								doc_count: 60,
							},
							{
								key: 'SO EL DBL WLOV BBHD',
								doc_count: 51,
							},
							{
								key: 'SO RANGEHOODS REG',
								doc_count: 47,
							},
							{
								key: 'SO EL SING OVEN REG',
								doc_count: 40,
							},
						],
					},
				},
			],
		},
	},
};
function renderListItems(listItem, parentPath, selectedValues, handleListItemClick) {
	if (!(listItem instanceof Object) || Object.keys(listItem).length === 0) {
		return null;
	}
	const listItemLabel = listItem.key;
	const listItemCount = listItem.count;
	const isLeafNode = !(Array.isArray(listItem.list) && listItem.list.length > 0);

	let newParentPath = listItemLabel;
	if (parentPath) {
		newParentPath = `${parentPath}.${listItemLabel}`;
	}
	const isSelected = recLookup(selectedValues, newParentPath);

	return (
		<li key={newParentPath}>
			{/* eslint-disable jsx-a11y/click-events-have-key-events */}
			{/* eslint-disable jsx-a11y/no-static-element-interactions */}
			<span
				style={isSelected ? { background: 'green', margin: '5px 0' } : {}}
				onClick={() => handleListItemClick(listItemLabel, parentPath)}
			>
				<React.Fragment>
					<span>{listItemLabel}</span>

					<span>{listItemCount}</span>
				</React.Fragment>
			</span>
			{isLeafNode === false && (
				<div className="--list-child">
					{/* eslint-disable-next-line no-use-before-define */}
					{renderLists(
						listItem.list,
						newParentPath,
						isSelected,
						selectedValues,
						handleListItemClick,
					)}
				</div>
			)}
		</li>
	);
}

function renderLists(transformedData, parentPath, isExpanded, selectedValues, handleClick) {
	return (
		<ul style={isExpanded ? { fontWeight: 600 } : {}}>
			{transformedData.map(listItem =>
				renderListItems(listItem, parentPath, selectedValues, handleClick),
			)}
		</ul>
	);
}
it('should render TreeList', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<TreeList
					testMode
					componentId="tree-list"
					dataField={['class.keyword', 'subclass.keyword']}
					mockData={MOCK_AGGREGATIONS_DATA}
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
				<TreeList
					testMode
					componentId="tree-list"
					dataField={['class.keyword', 'subclass.keyword']}
					mockData={MOCK_AGGREGATIONS_DATA}
					title="Test Title"
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
				<TreeList
					testMode
					componentId="tree-list"
					dataField={['class.keyword', 'subclass.keyword']}
					mockData={MOCK_AGGREGATIONS_DATA}
					showRadio
					mode="single"
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render with showCheckbox', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<TreeList
					testMode
					componentId="tree-list"
					dataField={['class.keyword', 'subclass.keyword']}
					mockData={MOCK_AGGREGATIONS_DATA}
					showCheckbox
					mode="multiple"
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render with showIcon', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<TreeList
					testMode
					componentId="tree-list"
					dataField={['class.keyword', 'subclass.keyword']}
					mockData={MOCK_AGGREGATIONS_DATA}
					showIcon
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render with showLeafIcon', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<TreeList
					testMode
					componentId="tree-list"
					dataField={['class.keyword', 'subclass.keyword']}
					mockData={MOCK_AGGREGATIONS_DATA}
					showLeafIcon
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render with showSwitcherIcon', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<TreeList
					testMode
					componentId="tree-list"
					dataField={['class.keyword', 'subclass.keyword']}
					mockData={MOCK_AGGREGATIONS_DATA}
					showSwitcherIcon
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render with showLine', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<TreeList
					testMode
					componentId="tree-list"
					dataField={['class.keyword', 'subclass.keyword']}
					mockData={MOCK_AGGREGATIONS_DATA}
					showLine
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
				<TreeList
					testMode
					componentId="tree-list"
					dataField={['class.keyword', 'subclass.keyword']}
					mockData={MOCK_AGGREGATIONS_DATA}
					showSearch
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render with custom icon', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<TreeList
					testMode
					componentId="tree-list"
					dataField={['class.keyword', 'subclass.keyword']}
					mockData={MOCK_AGGREGATIONS_DATA}
					showIcon
					icon={
						<span role="img" aria-label="folder-icon">
							🦷
						</span>
					}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render with custom leafIcon', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<TreeList
					testMode
					componentId="tree-list"
					dataField={['class.keyword', 'subclass.keyword']}
					mockData={MOCK_AGGREGATIONS_DATA}
					showLeafIcon
					leafIcon={
						<span role="img" aria-label="leaf-icon">
							☘️
						</span>
					}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render with custom switcherIcon', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<TreeList
					testMode
					componentId="tree-list"
					dataField={['class.keyword', 'subclass.keyword']}
					mockData={MOCK_AGGREGATIONS_DATA}
					showSwitcherIcon
					switcherIcon={bool => (bool ? <span> &#8592;</span> : <span> &#8598;</span>)}
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
				<TreeList
					testMode
					componentId="tree-list"
					dataField={['class.keyword', 'subclass.keyword']}
					mockData={MOCK_AGGREGATIONS_DATA}
					renderItem={(label, count, isSelected) => (
						<span style={isSelected ? { background: 'green' } : { background: 'aqua' }}>
							{label} - {count}
						</span>
					)}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render with custom UI', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<TreeList
					testMode
					componentId="tree-list"
					dataField={['class.keyword', 'subclass.keyword']}
					mockData={MOCK_AGGREGATIONS_DATA}
					render={(propData) => {
						const {
							/* eslint-disable no-unused-vars */
							data,
							rawData,
							error,
							handleClick,
							value,
							loading,
						} = propData;
						return renderLists(data, '', true, value, handleClick);
					}}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render no results', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<TreeList
					testMode
					componentId="tree-list"
					dataField={['class.keyword', 'subclass.keyword']}
					mockData={{}}
					renderNoResults={() => <span>No Results Found!!</span>}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});
