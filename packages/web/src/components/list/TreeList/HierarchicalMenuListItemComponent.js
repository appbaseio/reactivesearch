import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { getClassName, recLookup } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { HierarchicalMenuListItem } from '../../../styles/TreeList';
import Button from '../../../styles/Button';
import { Checkbox, Radio } from '../../../styles/FormControlList';
import HierarchicalMenuComponent from './HierarchicalMenuComponent';

const HierarchicalMenuListItemComponent = ({
	selectedValues,
	mode,
	searchTerm,
	listItem,
	parentPath,
	showLine,
	renderItem,
	handleListItemClick,
	showCheckbox,
	innerClass,
	showRadio,
	renderIcon,
	showCount,
	showSwitcherIcon,
	switcherIcon,
}) => {
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
	let isSelected = false;
	if (mode === 'single') {
		if (recLookup(selectedValues, newParentPath) === true) {
			isSelected = true;
		}
	} else {
		isSelected = !!recLookup(selectedValues, newParentPath);
	}

	const [isExpanded, setIsExpanded] = useState(!!recLookup(selectedValues, newParentPath));

	useEffect(() => {
		setIsExpanded(!!recLookup(selectedValues, newParentPath));
	}, [selectedValues]);

	useEffect(() => {
		if (listItem.initiallyExpanded) {
			setIsExpanded(listItem.initiallyExpanded);
		}
	}, [listItem.initiallyExpanded]);

	const renderSwitcherIcon = (isExpandedProp) => {
		if (showSwitcherIcon === false) {
			return null;
		}
		if (typeof switcherIcon === 'function') {
			return switcherIcon(isExpandedProp);
		}

		return (
			/* eslint-disable jsx-a11y/click-events-have-key-events
			, jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-tabindex */
			<span
				tabIndex="0"
				onClick={(e) => {
					e.stopPropagation();
					setIsExpanded(!isExpanded);
				}}
				className="--switcher-icon"
			>
				&#10148;
			</span>
		);
	};
	return (
		<HierarchicalMenuListItem
			className={`${isSelected ? '-selected-item' : ''} ${
				isExpanded ? '-expanded-item' : ''
			}`}
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
						<div className="--list-item-label-count-wrapper">
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
						</div>
					</React.Fragment>
				)}
			</Button>
			{isLeafNode === false && (
				<div className="--list-child">
					{/* eslint-disable-next-line no-use-before-define */}
					<HierarchicalMenuComponent
						key={`${newParentPath}-${listItemLabel}-${listItemCount}`}
						listArray={listItem.list}
						parentPath={newParentPath}
						isExpanded={isExpanded}
						listItemProps={{
							mode,
							selectedValues,
							searchTerm,
							showLine,
							renderItem,
							handleListItemClick,
							renderSwitcherIcon,
							showCheckbox,
							innerClass,
							showRadio,
							renderIcon,
							showCount,
							showSwitcherIcon,
							switcherIcon,
						}}
					/>
				</div>
			)}
		</HierarchicalMenuListItem>
	);
};
HierarchicalMenuListItemComponent.propTypes = {
	parentPath: types.string,
	selectedValues: types.rawData,
	mode: types.string,
	searchTerm: types.string,
	listItem: types.rawData,
	showLine: types.bool,
	renderItem: types.func,
	handleListItemClick: types.func,
	renderSwitcherIcon: types.func,
	showCheckbox: PropTypes.bool,
	innerClass: types.style,
	showRadio: PropTypes.bool,
	renderIcon: types.func,
	showCount: PropTypes.bool,
	showSwitcherIcon: types.bool,
	switcherIcon: types.children,
};
export default HierarchicalMenuListItemComponent;
