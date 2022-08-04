/** @jsx jsx */
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { jsx } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import React, { useState, useEffect, useRef } from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import {
	getClassName,
	hasCustomRenderer,
	getComponent as getComponentHelper,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { replaceDiacritics } from '@appbaseio/reactivecore/lib/utils/suggestions';
import {
	recLookup,
	setDeep,
	transformRawTreeListData,
} from '@appbaseio/reactivecore/src/utils/helper';
import PreferencesConsumer from '../basic/PreferencesConsumer';
import ComponentWrapper from '../basic/ComponentWrapper';

import Container from '../../styles/Container';
import Button from '../../styles/Button';
import { HierarchicalMenuList, HierarchicalMenuListItem } from '../../styles/TreeList';
import { connect } from '../../utils';
import Input from '../../styles/Input';

import Title from '../../styles/Title';

const useConstructor = (callBack = () => {}) => {
	const [hasBeenCalled, setHasBeenCalled] = useState(false);
	if (hasBeenCalled) return;
	callBack();
	setHasBeenCalled(true);
};

const TreeList = (props) => {
	const {
		showCount,
		mode,
		showLine,
		renderItem,
		showSearch,
		placeholder,
		componentId,
		themePreset,
		innerClass,
		className,
		title,
		style,
		rawData,
		error,
		isLoading,
		showCheckbox,
		showRadio,
		dataField,
	} = props;
	const hasMounted = useRef();

	const [transformedData, setTransformedData] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedValues, setSelectedValues] = useState({});

	useConstructor(() => {
		hasMounted.current = false;
	});

	useEffect(() => {
		hasMounted.current = true;
	}, []);

	useEffect(() => {
		setTransformedData(transformRawTreeListData(rawData.aggregations, dataField));
	}, [rawData]);

	useEffect(() => {
		console.log('selectedValues', selectedValues);
	}, [selectedValues]);

	const handleInputChange = (e) => {
		const { value } = e.target;
		setSearchTerm(value);
	};
	const renderSearch = () => {
		if (showSearch) {
			return (
				<Input
					className={getClassName(innerClass, 'input') || null}
					onChange={handleInputChange}
					value={searchTerm}
					placeholder={placeholder || 'Search'}
					style={{
						margin: '0 0 8px',
					}}
					aria-label={`${componentId}-search`}
					themePreset={themePreset}
				/>
			);
		}
		return null;
	};

	const handleListItemClick = (key, parentPath, isLeafNode) => {
		let path = key;
		if (parentPath) {
			path = `${parentPath}.${key}`;
		}
		const newSelectedValues = { ...selectedValues };
		if (mode === 'single' && isLeafNode && recLookup(newSelectedValues, parentPath)) {
			setDeep(newSelectedValues, parentPath.split('.'), undefined, true);
		}
		setDeep(newSelectedValues, path.split('.'), !recLookup(newSelectedValues, path), true);

		setSelectedValues(newSelectedValues);
	};

	const renderSwitcherIcon = (isExpanded) => {
		const { switcherIcon } = props;
		if (typeof switcherIcon === 'function') {
			return switcherIcon(isExpanded);
		}

		return <span className="--switcher-icon">&#10148;</span>;
	};

	const renderIcon = (isLeafNode) => {
		const {
			showIcon, showLeafIcon, icon, leafIcon,
		} = props;

		if (isLeafNode) {
			if (!showLeafIcon) return null;

			if (leafIcon) {
				return leafIcon;
			}

			return (
				<span role="img" aria-label="file" className="--leaf-icon">
					<svg
						viewBox="64 64 896 896"
						focusable="false"
						data-icon="file"
						width="1em"
						height="1em"
						fill="currentColor"
						aria-hidden="true"
					>
						<path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z" />
					</svg>
				</span>
			);
		}
		if (!showIcon) return null;

		if (icon) {
			return icon;
		}
		return (
			<span role="img" aria-label="folder-open" className="--folder-icon">
				<svg
					viewBox="64 64 896 896"
					focusable="false"
					data-icon="folder-open"
					width="1em"
					height="1em"
					fill="currentColor"
					aria-hidden="true"
				>
					<path d="M928 444H820V330.4c0-17.7-14.3-32-32-32H473L355.7 186.2a8.15 8.15 0 00-5.5-2.2H96c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h698c13 0 24.8-7.9 29.7-20l134-332c1.5-3.8 2.3-7.9 2.3-12 0-17.7-14.3-32-32-32zM136 256h188.5l119.6 114.4H748V444H238c-13 0-24.8 7.9-29.7 20L136 643.2V256zm635.3 512H159l103.3-256h612.4L771.3 768z" />
				</svg>
			</span>
		);
	};

	const renderHierarchicalMenuListItem = (listItem, parentPath) => {
		if (!(listItem instanceof Object) || Object.keys(listItem).length === 0) {
			return null;
		}
		const listItemLabel = listItem.key;
		const listItemCount = listItem.count;
		const isLeafNode = !(Array.isArray(listItem.list) && listItem.list.length > 0);

		if (
			showSearch
			&& searchTerm
			&& isLeafNode
			&& !replaceDiacritics(listItemLabel)
				.toLowerCase()
				.includes(replaceDiacritics(searchTerm).toLowerCase())
		) {
			return null;
		}

		let newParentPath = listItemLabel;
		if (parentPath) {
			newParentPath = `${parentPath}.${listItemLabel}`;
		}
		const isSelected = recLookup(selectedValues, newParentPath);

		return (
			<HierarchicalMenuListItem
				className={`${isSelected ? '-selected-item' : ''}`}
				key={newParentPath}
				showLine={showLine}
			>
				<Button
					isLinkType
					onClick={() => handleListItemClick(listItemLabel, parentPath, isLeafNode)}
				>
					{typeof renderItem === 'function' ? (
						renderItem(listItemLabel, listItemCount, isSelected)
					) : (
						<React.Fragment>
							{!isLeafNode && renderSwitcherIcon(isSelected)}
							{mode === 'multiple' && showCheckbox && (
								<React.Fragment>
									<input
										checked={isSelected}
										id={`${listItemLabel}-radio-${newParentPath}`}
										name={`${listItemLabel}-radio-${newParentPath}`}
										type="checkbox"
									/>
								</React.Fragment>
							)}
							{mode === 'single' && showRadio && (
								<React.Fragment>
									<input
										checked={isSelected}
										id={`${listItemLabel}-radio-${newParentPath}`}
										name={`${listItemLabel}-radio-${newParentPath}`}
										type="radio"
									/>
								</React.Fragment>
							)}
							{renderIcon(isLeafNode)}
							<span className="--list-item-label">{listItemLabel}</span>
							{showCount && (
								<span className="--list-item-count">{listItemCount}</span>
							)}
						</React.Fragment>
					)}
				</Button>
				{isLeafNode === false && (
					<div className="--list-child">
						{/* eslint-disable-next-line no-use-before-define */}
						{renderHierarchicalMenu(listItem.list, newParentPath, isSelected)}
					</div>
				)}
			</HierarchicalMenuListItem>
		);
	};

	function renderHierarchicalMenu(listArray, parentPath = '', isExpanded = false) {
		if (!Array.isArray(listArray) || listArray.length === 0) {
			return null;
		}

		return (
			<HierarchicalMenuList
				className={`${isExpanded ? '--open' : ''}`}
				isSelected={isExpanded}
			>
				{listArray.map(listItem => renderHierarchicalMenuListItem(listItem, parentPath))}
			</HierarchicalMenuList>
		);
	}
	const getComponent = () => {
		const data = {
			data: transformedData,
			rawData,
			error,
			handleClick: handleListItemClick,
			value: selectedValues,
			loading: isLoading,
		};
		return getComponentHelper(data, props);
	};

	return (
		<Container style={style} className={className}>
			{props.title && (
				<Title className={getClassName(innerClass, 'title') || null}>{title}</Title>
			)}
			{renderSearch()}
			{hasCustomRenderer(props)
				? getComponent()
				: renderHierarchicalMenu(transformedData, '', true)}
		</Container>
	);
};
TreeList.propTypes = {
	selectedValue: types.selectedValue,
	error: types.title,
	rawData: types.rawData,
	aggregationData: types.aggregationData,
	themePreset: types.themePreset,
	// component props
	componentId: types.string.isRequired,
	className: types.string,
	style: types.style,
	showRadio: types.bool,
	showCheckbox: types.bool,
	mode: PropTypes.oneOf(['single', 'multiple']),
	showCount: types.bool,
	showSearch: types.bool,
	showIcon: types.bool,
	icon: types.children,
	showLeafIcon: types.bool,
	leafIcon: types.children,
	showLine: types.bool,
	switcherIcon: types.func,
	render: types.func,
	renderItem: types.func,
	innerClass: types.style,
	placeholder: types.string,
	title: types.title,
	isLoading: types.bool,
	dataField: types.stringArray.isRequired,
};

TreeList.defaultProps = {
	className: null,
	style: null,
	showRadio: false,
	showCheckbox: false,
	mode: 'multiple',
	showCount: false,
	showSearch: false,
	showIcon: false,
	showLeafIcon: false,
	showLine: false,
};
const MOCK_DATA = {
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
		level1: {
			doc_count_error_upper_bound: 689,
			sum_other_doc_count: 38957,
			buckets: [
				{
					key: 'COMPACT DISC',
					doc_count: 70654,
					level2: {
						doc_count_error_upper_bound: 0,
						sum_other_doc_count: 16,
						buckets: [
							{
								key: 'VINYL',
								doc_count: 69731,
								level3: {
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
					level2: {
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
					level2: {
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
					level2: {
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
					level2: {
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
					level2: {
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
					level2: {
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
					level2: {
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
					level2: {
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
					level2: {
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
const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	rawData: state.rawData[props.componentId] || MOCK_DATA,
	aggregationData: state.compositeAggregations[props.componentId],
	themePreset: state.config.themePreset,
	error: state.error[props.componentId],
	isLoading: state.isLoading[props.componentId],
});

const mapDispatchtoProps = () => ({});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(props => <TreeList ref={props.myForwardedRef} {...props} />));

const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props}>
		{preferenceProps => (
			<ComponentWrapper
				{...preferenceProps}
				internalComponent
				componentType={componentTypes.treeList}
			>
				{() => <ConnectedComponent {...preferenceProps} myForwardedRef={ref} />}
			</ComponentWrapper>
		)}
	</PreferencesConsumer>
));
hoistNonReactStatics(ForwardRefComponent, TreeList);

ForwardRefComponent.displayName = 'TreeList';
export default ForwardRefComponent;
