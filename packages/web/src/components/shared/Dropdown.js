import React, { Component } from 'react';
import Downshift from 'downshift';
import { withTheme } from 'emotion-theming';

import types from '@appbaseio/reactivecore/lib/utils/types';
import { getClassName } from '@appbaseio/reactivecore/lib/utils/helper';

import Input, { suggestionsContainer, suggestions } from '../../styles/Input';
import Select, { Tick } from '../../styles/Select';
import Chevron from '../../styles/Chevron';

class Dropdown extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false,
			searchTerm: '',
		};
	}

	toggle = () => {
		this.setState({
			isOpen: !this.state.isOpen,
		});
	};

	close = () => {
		this.setState({
			isOpen: false,
		});
	};

	onChange = (item) => {
		if (this.props.returnsObject) {
			this.props.onChange(item);
		} else {
			this.props.onChange(item[this.props.keyField]);
		}

		if (!this.props.multi) {
			this.setState({
				isOpen: false,
			});
		}
	};

	handleStateChange = (changes) => {
		const { isOpen, type } = changes;
		if (type === Downshift.stateChangeTypes.mouseUp) {
			this.setState({
				isOpen,
			});
		}
		if (type === Downshift.stateChangeTypes.keyDownEscape) {
			this.setState({
				isOpen: false,
			});
		}
	};

	getBackgroundColor = (highlighted, selected) => {
		const isDark = this.props.themePreset === 'dark';
		if (highlighted) {
			return isDark ? '#555' : '#eee';
		}
		if (selected) {
			return isDark ? '#686868' : '#fafafa';
		}
		return isDark ? '#424242' : '#fff';
	};

	handleInputChange = (e) => {
		const { value } = e.target;
		this.setState({
			searchTerm: value,
		});
	};

	renderToString = (value) => {
		if (this.props.customLabelRenderer) {
			const customLabel = this.props.customLabelRenderer(value);
			if (typeof customLabel === 'string') {
				return customLabel;
			}
		}
		if (Array.isArray(value) && value.length) {
			const arrayToRender = value.map(item => this.renderToString(item));
			return arrayToRender.join(', ');
		}
		if (value && typeof value === 'object') {
			if (value[this.props.labelField]) {
				return value[this.props.labelField];
			}
			if (Object.keys(value).length) {
				return this.renderToString(Object.keys(value));
			}
			return this.props.placeholder;
		}
		return value;
	};

	render() {
		const {
			items,
			selectedItem,
			placeholder,
			labelField,
			keyField,
			themePreset,
			theme,
			renderItem,
			transformData,
			footer,
			hasCustomRenderer,
			customRenderer,
		} = this.props;

		let itemsToRender = items;

		if (transformData) {
			itemsToRender = transformData(itemsToRender);
		}

		const dropdownItems = itemsToRender.filter((item) => {
			if (String(item[labelField]).length) {
				if (this.props.showSearch && this.state.searchTerm) {
					return String(item[labelField])
						.toLowerCase()
						.includes(this.state.searchTerm.toLowerCase());
				}
				return true;
			}
			return false;
		});

		return (
			<Downshift
				selectedItem={selectedItem}
				onChange={this.onChange}
				onOuterClick={this.close}
				onStateChange={this.handleStateChange}
				isOpen={this.state.isOpen}
				itemToString={i => i && i[this.props.labelField]}
				render={({
					getButtonProps, getItemProps, isOpen, highlightedIndex, ...rest
				}) => (
					<div className={suggestionsContainer}>
						<Select
							{...getButtonProps()}
							className={getClassName(this.props.innerClass, 'select') || null}
							onClick={this.toggle}
							title={selectedItem ? this.renderToString(selectedItem) : placeholder}
							small={this.props.small}
							themePreset={this.props.themePreset}
						>
							{this.props.customLabelRenderer
								? this.props.customLabelRenderer(selectedItem)
								: (
									<div>
										{selectedItem ? this.renderToString(selectedItem) : placeholder}
									</div>
								)}
							<Chevron open={isOpen} />
						</Select>
						{
							// eslint-disable-next-line
							hasCustomRenderer ? customRenderer(itemsToRender, {
								getButtonProps, getItemProps, isOpen, highlightedIndex, ...rest,
							}) : isOpen && itemsToRender.length ? (
								<ul
									className={`${suggestions(themePreset, theme)} ${
										this.props.small ? 'small' : ''
									} ${getClassName(this.props.innerClass, 'list')}`}
								>
									{this.props.showSearch ? (
										<Input
											id={`${this.props.componentId}-input`}
											style={{
												border: 0,
												borderBottom: '1px solid #ddd',
											}}
											showIcon={false}
											className={getClassName(this.props.innerClass, 'input')}
											placeholder={this.props.searchPlaceholder}
											value={this.state.searchTerm}
											onChange={this.handleInputChange}
											themePreset={themePreset}
										/>
									) : null}
									{
										dropdownItems.length ? dropdownItems.map((item, index) => {
											let selected
												= this.props.multi
												// MultiDropdownList
												&& ((selectedItem && !!selectedItem[item[keyField]])
													// MultiDropdownRange
													|| (Array.isArray(selectedItem)
														&& selectedItem.find(
															value => value[labelField] === item[labelField])));
											if (!this.props.multi) selected = item.key === selectedItem;

											return (
												<li
													{...getItemProps({ item })}
													key={item[keyField]}
													className={`${selected ? 'active' : ''}`}
													style={{
														backgroundColor: this.getBackgroundColor(
															highlightedIndex === index,
															selected,
														),
													}}
												>
													{renderItem ? (
														renderItem(
															item[labelField],
															item.doc_count,
															selected && this.props.multi,
															itemsToRender,
														)
													) : (
														<div>
															{typeof item[labelField] === 'string' ? (
																<span
																	dangerouslySetInnerHTML={{
																		__html: item[labelField],
																	}}
																/>
															) : (
																item[labelField]
															)}
															{this.props.showCount
																&& item.doc_count && (
																<span
																	className={
																		getClassName(
																			this.props.innerClass,
																			'count',
																		) || null
																	}
																>
																		&nbsp;({item.doc_count})
																</span>
															)}
														</div>
													)}
													{selected && this.props.multi ? (
														<Tick
															className={
																getClassName(
																	this.props.innerClass,
																	'icon',
																) || null
															}
														/>
													) : null}
												</li>
											);
										}) : this.props.renderNoResults && this.props.renderNoResults()}
									{footer}
								</ul>
							) : null
						}
					</div>
				)}
			/>
		);
	}
}

Dropdown.defaultProps = {
	keyField: 'key',
	labelField: 'label',
	small: false,
	searchPlaceholder: 'Type here to search...',
};

Dropdown.propTypes = {
	innerClass: types.style,
	items: types.data,
	keyField: types.string,
	labelField: types.string,
	multi: types.bool,
	hasCustomRenderer: types.bool,
	onChange: types.func,
	placeholder: types.string,
	searchPlaceholder: types.string,
	returnsObject: types.bool,
	renderItem: types.func,
	transformData: types.func,
	renderNoResults: types.func,
	customRenderer: types.func,
	customLabelRenderer: types.func,
	selectedItem: types.selectedValue,
	showCount: types.bool,
	single: types.bool,
	small: types.bool,
	theme: types.style,
	themePreset: types.themePreset,
	showSearch: types.bool,
	footer: types.children,
	componentId: types.string,
};

export default withTheme(Dropdown);
