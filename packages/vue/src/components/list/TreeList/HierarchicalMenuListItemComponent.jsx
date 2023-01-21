import { TREELIST_VALUES_PATH_SEPARATOR } from '@appbaseio/reactivecore/lib/utils/constants';
import { recLookup, getClassName } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import VueTypes from 'vue-types';
import { HierarchicalMenuListItem } from '../../../styles/TreeList';
import { Checkbox, Radio } from '../../../styles/FormControlList';

// eslint-disable-next-line import/no-cycle
import HierarchicalMenuComponent from './HierarchicalMenuComponent.jsx';
import ListItem from '../../../styles/ListItem';

const HierarchicalMenuListItemComponent = {
	name: 'HierarchicalMenuListItemComponent',
	data() {
		return {
			isExpanded: false,
			newParentPath: '',
		};
	},
	created() {
		const listItemLabel = this.listItem.key;
		let newParentPath = listItemLabel;
		if (this.parentPath) {
			newParentPath = `${this.parentPath}${TREELIST_VALUES_PATH_SEPARATOR}${listItemLabel}`;
		}

		this.newParentPath = newParentPath;
		this.isExpanded = !!recLookup(
			this.selectedValues,
			newParentPath,
			TREELIST_VALUES_PATH_SEPARATOR,
		);
	},
	watch: {
		listItem(newVal) {
			if (newVal.initiallyExpanded) {
				this.isExpanded = newVal.initiallyExpanded;
			}
		},
		selectedValues(newVal) {
			this.isExpanded = !!recLookup(
				newVal,
				this.newParentPath,
				TREELIST_VALUES_PATH_SEPARATOR,
			);
		},
	},
	props: {
		parentPath: types.string,
		selectedValues: types.rawData,
		mode: types.string,
		searchTerm: types.string,
		listItem: types.rawData,
		showLine: types.bool,
		renderItem: types.func,
		handleListItemClick: types.func,
		renderSwitcherIcon: types.func,
		showCheckbox: VueTypes.bool,
		innerClass: types.style,
		showRadio: VueTypes.bool,
		renderIcon: types.func,
		showCount: VueTypes.bool,
		showSwitcherIcon: types.bool,
		switcherIcon: types.children,
	},
	render() {
		const {
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
		} = this.$props;

		if (!(listItem instanceof Object) || Object.keys(listItem).length === 0) {
			return null;
		}
		const listItemLabel = listItem.key;
		const listItemCount = listItem.count;
		const isLeafNode = !(Array.isArray(listItem.list) && listItem.list.length > 0);

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
						this.isExpanded = !this.isExpanded;
					}}
					class="--switcher-icon"
				>
					&#10148;
				</span>
			);
		};
		let isSelected = false;
		if (mode === 'single') {
			if (
				recLookup(selectedValues, this.newParentPath, TREELIST_VALUES_PATH_SEPARATOR)
				=== true
			) {
				isSelected = true;
			}
		} else {
			isSelected = !!recLookup(
				selectedValues,
				this.newParentPath,
				TREELIST_VALUES_PATH_SEPARATOR,
			);
		}

		return (
			<HierarchicalMenuListItem
				class={`${isSelected ? '-selected-item' : ''} ${
					this.isExpanded ? '-expanded-item' : ''
				}`}
				key={this.newParentPath}
				showLine={showLine}
			>
				<ListItem
					isTreeListItem={true}
					onClick={() => {
						handleListItemClick(listItemLabel, parentPath);
					}}
					style={{ textDecoration: 'none' }}
				>
					{typeof renderItem === 'function' ? (
						renderItem(listItemLabel, listItemCount, isSelected)
					) : (
						<div>
							{!isLeafNode && renderSwitcherIcon(isSelected)}
							{/* eslint-disable jsx-a11y/click-events-have-key-events */}
							{/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */}
							{mode === 'multiple' && showCheckbox && (
								<div>
									<Checkbox
										class={getClassName(innerClass, 'checkbox') || null}
										checked={isSelected}
										id={`${listItemLabel}-checkbox-${this.newParentPath}`}
										name={`${listItemLabel}-checkbox-${this.newParentPath}`}
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
										htmlFor={`${listItemLabel}-checkbox-${this.newParentPath}`}
										onClick={(e) => {
											e.stopPropagation();
										}}
									/>
								</div>
							)}
							{mode === 'single' && showRadio && (
								<div>
									<Radio
										checked={isSelected}
										class={getClassName(innerClass, 'radio') || null}
										id={`${listItemLabel}-radio-${this.newParentPath}`}
										name={`${listItemLabel}-radio-${this.newParentPath}`}
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
										htmlFor={`${listItemLabel}-radio-${this.newParentPath}`}
										onClick={(e) => {
											e.stopPropagation();
										}}
									/>
								</div>
							)}{' '}
							{/* eslint-enable jsx-a11y/click-events-have-key-events */}
							{/* eslint-enable jsx-a11y/no-noninteractive-element-interactions */}
							{renderIcon(isLeafNode)}
							<div class="--list-item-label-count-wrapper">
								<span
									class={`--list-item-label ${
										getClassName(innerClass, 'label') || ''
									}`}
								>
									{listItemLabel}
								</span>
								{showCount && (
									<span
										class={`--list-item-count ${
											getClassName(innerClass, 'count') || ''
										}`}
									>
										{listItemCount}
									</span>
								)}
							</div>
						</div>
					)}
				</ListItem>
				{isLeafNode === false && (
					<div class={`--list-child ${showSwitcherIcon ? ' --show-switcher-icon' : ''}`}>
						{/* eslint-disable-next-line no-use-before-define */}
						<HierarchicalMenuComponent
							key={`${this.newParentPath}-${listItemLabel}-${listItemCount}`}
							listArray={listItem.list}
							parentPath={this.newParentPath}
							isExpanded={this.isExpanded}
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
	},
};

export default HierarchicalMenuListItemComponent;
