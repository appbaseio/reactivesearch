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
import { recLookup, setDeep } from '@appbaseio/reactivecore/src/utils/helper';
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
	} = props;
	const hasMounted = useRef();

	const [transformedData, setTransformedData] = useState([
		{
			key: 'Shoes',
			count: 200,
			level: 0,
			list: [
				{
					key: 'Casual',
					count: 100,
					level: 1,
					list: [
						{
							key: 'Puma',
							count: 50,
							level: 2,
						},
						{
							key: 'Adidas',
							count: 50,
							level: 2,
						},
					],
				},
				{
					key: 'Formal',
					count: 100,
					level: 1,
					list: [
						{
							key: 'Red Chief',
							count: 50,
							level: 2,
						},
						{
							key: 'Bata',
							count: 50,
							level: 2,
						},
					],
				},
			],
		},
		{
			key: 'Clothes',
			count: 100,
			level: 0,
			list: [
				{
					key: 'Tshirts',
					count: 40,
					level: 1,
					list: [
						{
							key: 'Levis',
							count: 10,
							level: 2,
						},
						{
							key: 'Puma',
							count: 30,
							level: 2,
						},
					],
				},
				{
					key: 'Shirts',
					count: 60,
					level: 1,
					list: [
						{
							key: 'Levis',
							count: 40,
							level: 2,
						},
						{
							key: 'Puma',
							count: 20,
							level: 2,
						},
					],
				},
			],
		},
	]);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedValues, setSelectedValues] = useState({});

	useConstructor(() => {
		hasMounted.current = false;
	});

	useEffect(() => {
		hasMounted.current = true;
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
			<HierarchicalMenuList isSelected={isExpanded}>
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

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	rawData: state.rawData[props.componentId],
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
