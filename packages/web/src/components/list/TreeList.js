/** @jsx jsx */
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { jsx } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import {
	getClassName,
	hasCustomRenderer,
	getComponent as getComponentHelper,
	updateCustomQuery as updateCustomQueryHelper,
	updateDefaultQuery as updateDefaultQueryHelper,
	getQueryOptions,
	transformTreeListLocalStateIntoQueryComptaibleFormat,
	getOptionsFromQuery,
	updateInternalQuery,
	checkValueChange,
	getAggsQuery,
	isEqual,
	recLookup,
	setDeep,
	transformRawTreeListData,
	isFunction,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { replaceDiacritics } from '@appbaseio/reactivecore/lib/utils/suggestions';
import {
	setQueryOptions as setQueryOptionsAction,
	updateQuery as updateQueryAction,
} from '@appbaseio/reactivecore/lib/actions/query';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import PreferencesConsumer from '../basic/PreferencesConsumer';
import ComponentWrapper from '../basic/ComponentWrapper';

import Container from '../../styles/Container';
import Button from '../../styles/Button';
import { HierarchicalMenuList, HierarchicalMenuListItem } from '../../styles/TreeList';
import { connect } from '../../utils';
import Input from '../../styles/Input';

import Title from '../../styles/Title';
import { Checkbox, Radio } from '../../styles/FormControlList';

const useConstructor = (callBack = () => {}) => {
	const [hasBeenCalled, setHasBeenCalled] = useState(false);
	if (hasBeenCalled) return;
	callBack();
	setHasBeenCalled(true);
};

const transformValueIntoLocalState = (valueArray) => {
	let valueToSet = {};
	if (valueArray.length) {
		const newSelectedValues = {};
		valueArray.forEach((valueItem) => {
			setDeep(
				newSelectedValues,
				valueItem.split(' > '),
				!recLookup(newSelectedValues, valueItem.split(' > ')),
				true,
			);
		});
		valueToSet = newSelectedValues;
	}
	return valueToSet;
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
		enableAppbase,
		index,
		sortBy,
		renderError,
		renderNoResults,
		loader,
		aggregationData,
	} = props;
	const hasMounted = useRef();

	const [searchTerm, setSearchTerm] = useState('');
	const [selectedValues, setSelectedValues] = useState({});
	const getTransformedData = useMemo(
		() => transformRawTreeListData(aggregationData, dataField),
		[aggregationData, dataField],
	);
	const generateQueryOptions = () => {
		const queryOptions = getQueryOptions(props);
		const valueArray = transformTreeListLocalStateIntoQueryComptaibleFormat(selectedValues);
		return getAggsQuery(valueArray, queryOptions, props);
	};

	const updateQueryOptions = () => {
		// for a new query due to other changes don't append after to get fresh results
		const queryOptions = generateQueryOptions(
			props,
			{},
			transformTreeListLocalStateIntoQueryComptaibleFormat(selectedValues),
		);
		if (props.defaultQuery) {
			// eslint-disable-next-line no-use-before-define
			updateDefaultQuery(queryOptions);
		} else {
			props.setQueryOptions(getInternalComponentID(componentId), queryOptions);
		}
	};

	const getDefaultQuery = (value) => {
		let query = null;
		const type = 'term';

		if (!Array.isArray(value) || value.length === 0) {
			return null;
		}

		if (value) {
			// adds a sub-query with must as an array of objects for each term/value
			const queryArray = value.map(item => ({
				[type]: {
					[props.dataField]: item,
				},
			}));
			const listQuery = {
				bool: {
					must: queryArray,
				},
			};

			query = value.length ? listQuery : null;
		}

		return query;
	};

	const updateQuery = (value) => {
		const { customQuery } = props;
		let query = getDefaultQuery(value);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(value, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery(value, props));
			updateCustomQueryHelper(props.componentId, props, value);
		}
		props.setQueryOptions(props.componentId, {
			...generateQueryOptions(),
			...customQueryOptions,
		});

		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: componentTypes.multiList,
		});
	};

	function updateDefaultQuery(queryOptions) {
		const value = transformTreeListLocalStateIntoQueryComptaibleFormat(selectedValues);
		// Update default query for RS API
		updateDefaultQueryHelper(componentId, props, value);
		updateInternalQuery(
			getInternalComponentID(componentId),
			queryOptions,
			value,
			props,
			generateQueryOptions(),
			null,
		);
	}

	const setValue = (value, hasMountedParam = hasMounted.current) => {
		const finalValues
			= Array.isArray(value) === false
				? transformTreeListLocalStateIntoQueryComptaibleFormat(value)
				: value;
		const performUpdate = () => {
			const handleUpdates = () => {
				updateQuery(finalValues);
				if (props.onValueChange) props.onValueChange(finalValues);
			};

			if (hasMountedParam) {
				setSelectedValues(
					Array.isArray(value) ? transformValueIntoLocalState(value) : value,
				);
				handleUpdates();
			} else {
				handleUpdates();
			}
		};

		checkValueChange(props.componentId, finalValues, props.beforeValueChange, performUpdate);
	};

	useConstructor(() => {
		hasMounted.current = false;
		const defaultValue = props.defaultValue || props.value;
		const currentValueArray = props.selectedValue || defaultValue || [];
		// update local state for selected values
		if (currentValueArray.length) {
			const newSelectedValues = transformValueIntoLocalState(currentValueArray);
			setValue(newSelectedValues, true);
		}
		// Set custom and default queries in store
		updateCustomQueryHelper(componentId, props, currentValueArray);
		updateDefaultQueryHelper(componentId, props, currentValueArray);

		updateQueryOptions();
	});

	useEffect(() => {
		if (hasMounted.current) {
			updateDefaultQuery();
			updateQuery([]);
		}
	}, [props.defaultQuery]);

	useEffect(() => {
		if (hasMounted.current) {
			const valueArray
				= transformTreeListLocalStateIntoQueryComptaibleFormat(selectedValues) || [];
			updateQuery(valueArray);
		}
	}, [props.customQuery]);

	useEffect(() => {
		if (hasMounted.current) {
			updateQueryOptions();
		}
	}, [sortBy]);

	useEffect(() => {
		if (hasMounted.current) {
			const valueArray
				= transformTreeListLocalStateIntoQueryComptaibleFormat(selectedValues) || [];
			updateQueryOptions();
			updateQuery(valueArray);
		}
	}, [dataField]);

	useEffect(() => {
		if (hasMounted.current) {
			if (props.value !== undefined) {
				setValue(props.value);
			}
		}
	}, [props.value]);

	useEffect(() => {
		if (hasMounted.current) {
			if (
				!isEqual(
					transformTreeListLocalStateIntoQueryComptaibleFormat(selectedValues),
					props.selectedValue,
				)
			) {
				const { value, onChange } = props;
				let valueToSet = [];
				if (Array.isArray(props.selectedValue) && props.selectedValue.length) {
					valueToSet = props.selectedValue;
				}
				if (value === undefined) {
					setValue(valueToSet);
				} else if (onChange && !isEqual(value, valueToSet)) {
					onChange(valueToSet);
				}
			}
		}
	}, [props.selectedValue]);

	useEffect(() => {
		hasMounted.current = true;

		if (!enableAppbase && index) {
			console.warn(
				'Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.',
			);
		}
	}, []);

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

	const sanitizeObject = obj =>
		JSON.parse(
			JSON.stringify(obj, (key, value) =>
				// eslint-disable-next-line eqeqeq
				(value === null || value == {} || value === false ? undefined : value),
			),
		);

	const handleListItemClick = (key, parentPath) => {
		let path = key;
		if (parentPath) {
			path = `${parentPath}.${key}`;
		}
		let newSelectedValues = { ...selectedValues };
		if (mode === 'single') {
			newSelectedValues = {};
			setDeep(newSelectedValues, path.split('.'), true, true);
		} else {
			const newValue = !recLookup(newSelectedValues, path);

			setDeep(newSelectedValues, path.split('.'), newValue, true);
		}
		newSelectedValues = sanitizeObject({ ...newSelectedValues });
		if (props.value === undefined) {
			setValue(newSelectedValues);
		} else if (props.onChange) {
			const valueToSet
				= transformTreeListLocalStateIntoQueryComptaibleFormat(newSelectedValues);

			props.onChange(valueToSet);
		}
	};

	const renderSwitcherIcon = (isExpanded) => {
		const { switcherIcon, showSwitcherIcon } = props;
		if (showSwitcherIcon === false) {
			return null;
		}
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
		let isSelected = false;
		if (mode === 'single') {
			if (recLookup(selectedValues, newParentPath) === true) {
				isSelected = true;
			}
		} else {
			isSelected = !!recLookup(selectedValues, newParentPath);
		}
		const isExpanded = !!recLookup(selectedValues, newParentPath);
		return (
			<HierarchicalMenuListItem
				className={`${isSelected ? '-selected-item' : ''}`}
				key={newParentPath}
				showLine={showLine}
			>
				<Button
					isLinkType
					onClick={() => {
						handleListItemClick(listItemLabel, parentPath);
					}}
				>
					{typeof renderItem === 'function' ? (
						renderItem(listItemLabel, listItemCount, isSelected)
					) : (
						<React.Fragment>
							{!isLeafNode && renderSwitcherIcon(isSelected)}
							{/* eslint-disable jsx-a11y/click-events-have-key-events */}
							{/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */}
							{mode === 'multiple' && showCheckbox && (
								<React.Fragment>
									<Checkbox
										className={getClassName(innerClass, 'checkbox') || null}
										checked={isSelected}
										id={`${listItemLabel}-checkbox-${newParentPath}`}
										name={`${listItemLabel}-checkbox-${newParentPath}`}
										show
										readOnly
									/>
									<label
										style={{
											width: '26px',
											marginTop: 0,
											marginBottom: 0,
											marginRight: '-9px',
											left: '-3px',
										}}
										htmlFor={`${listItemLabel}-checkbox-${newParentPath}`}
										onClick={(e) => {
											e.stopPropagation();
										}}
									/>
								</React.Fragment>
							)}
							{mode === 'single' && showRadio && (
								<React.Fragment>
									<Radio
										checked={isSelected}
										className={getClassName(innerClass, 'radio') || null}
										id={`${listItemLabel}-radio-${newParentPath}`}
										name={`${listItemLabel}-radio-${newParentPath}`}
										show
										readOnly
									/>

									<label
										style={{
											width: '26px',
											marginTop: 0,
											marginBottom: 0,
											marginRight: '-9px',
											left: '-3px',
										}}
										htmlFor={`${listItemLabel}-radio-${newParentPath}`}
										onClick={(e) => {
											e.stopPropagation();
										}}
									/>
								</React.Fragment>
							)}{' '}
							{/* eslint-enable jsx-a11y/click-events-have-key-events */}
							{/* eslint-enable jsx-a11y/no-noninteractive-element-interactions */}
							{renderIcon(isLeafNode)}
							<span
								className={`--list-item-label ${
									getClassName(innerClass, 'label') || ''
								}`}
							>
								{listItemLabel}
							</span>
							{showCount && (
								<span
									className={`--list-item-count ${
										getClassName(innerClass, 'count') || ''
									}`}
								>
									{listItemCount}
								</span>
							)}
						</React.Fragment>
					)}
				</Button>
				{isLeafNode === false && (
					<div className="--list-child">
						{/* eslint-disable-next-line no-use-before-define */}
						{renderHierarchicalMenu(listItem.list, newParentPath, isExpanded)}
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
			data: getTransformedData,
			rawData,
			error,
			handleClick: handleListItemClick,
			value: selectedValues,
			loading: isLoading,
		};
		return getComponentHelper(data, props);
	};

	if (isLoading && loader) {
		return loader;
	}

	if (renderError && error) {
		return isFunction(renderError) ? renderError(error) : renderError;
	}

	if (!getTransformedData || getTransformedData.length === 0) {
		return renderNoResults ? renderNoResults() : null;
	}
	return (
		<Container style={style} className={className}>
			{props.title && (
				<Title className={getClassName(innerClass, 'title') || null}>{title}</Title>
			)}
			{renderSearch()}
			{hasCustomRenderer(props)
				? getComponent()
				: renderHierarchicalMenu(getTransformedData, '', true)}
		</Container>
	);
};
TreeList.propTypes = {
	selectedValue: types.selectedValue,
	error: types.title,
	rawData: types.rawData,
	aggregationData: types.rawData,
	themePreset: types.themePreset,
	updateQuery: types.funcRequired,
	setQueryOptions: types.funcRequired,
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
	onQueryChange: types.func,
	defaultValue: types.stringArray,
	value: types.stringArray,
	customQuery: types.func,
	defaultQuery: types.func,
	enableAppbase: types.bool,
	index: types.string,
	showFilter: types.bool,
	URLParams: types.bool,
	filterLabel: types.string,
	onChange: types.func,
	onValueChange: types.func,
	beforeValueChange: types.func,
	sortBy: types.sortByWithCount,
	onError: types.func,
	showSwitcherIcon: types.bool,
	renderError: types.title,
	renderNoResults: types.func,
	loader: types.title,
	aggergationSize: types.number,
};

TreeList.defaultProps = {
	className: null,
	showSwitcherIcon: true,
	style: null,
	showRadio: false,
	showCheckbox: false,
	mode: 'multiple',
	showCount: false,
	showSearch: false,
	showIcon: false,
	showLeafIcon: false,
	showLine: false,
	URLParams: false,
	sortBy: 'count',
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	rawData: state.rawData[props.componentId] || {},
	aggregationData: state.aggregations[props.componentId] || {},
	themePreset: state.config.themePreset,
	error: state.error[props.componentId],
	isLoading: state.isLoading[props.componentId],
	enableAppbase: state.config.enableAppbase,
});

const mapDispatchtoProps = dispatch => ({
	setQueryOptions: (component, props) => dispatch(setQueryOptionsAction(component, props)),
	updateQuery: updateQueryObject => dispatch(updateQueryAction(updateQueryObject)),
});

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
				mode={preferenceProps.testMode ? 'test' : ''}
			>
				{() => <ConnectedComponent {...preferenceProps} myForwardedRef={ref} />}
			</ComponentWrapper>
		)}
	</PreferencesConsumer>
));
hoistNonReactStatics(ForwardRefComponent, TreeList);

ForwardRefComponent.displayName = 'TreeList';
export default ForwardRefComponent;
