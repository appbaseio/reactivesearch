import React, { Component } from 'react';
import Downshift from 'downshift';
import { withTheme } from 'emotion-theming';

import types from '@appbaseio/reactivecore/lib/utils/types';
import { getClassName } from '@appbaseio/reactivecore/lib/utils/helper';

import { suggestionsContainer, suggestions } from '../../styles/Input';
import Select, { Tick } from '../../styles/Select';
import Chevron from '../../styles/Chevron';

class Dropdown extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false,
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
	};

	getBackgroundColor = (highlighted, selected) => {
		const isDark = this.props.themePreset === 'dark';
		if (highlighted) {
			return isDark ? '#555' : '#eee';
		} else if (selected) {
			return isDark ? '#686868' : '#fafafa';
		}
		return isDark ? '#424242' : '#fff';
	};

	renderToString = (value) => {
		if (Array.isArray(value) && value.length) {
			const arrayToRender = value.map(item => this.renderToString(item));
			return arrayToRender.join(', ');
		} else if (value && typeof value === 'object') {
			if (value[this.props.labelField]) {
				return value[this.props.labelField];
			} else if (Object.keys(value).length) {
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
			renderListItem,
		} = this.props;

		return (<Downshift
			selectedItem={selectedItem}
			onChange={this.onChange}
			onOuterClick={this.close}
			onStateChange={this.handleStateChange}
			isOpen={this.state.isOpen}
			itemToString={i => i && i[this.props.labelField]}
			render={({
				getButtonProps,
				getItemProps,
				isOpen,
				highlightedIndex,
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
						<div>{selectedItem ? this.renderToString(selectedItem) : placeholder}</div>
						<Chevron open={isOpen} />
					</Select>
					{
						isOpen && items.length
							? (
								<ul className={`${suggestions(themePreset, theme)} ${this.props.small ? 'small' : ''} ${getClassName(this.props.innerClass, 'list')}`}>
									{
										items
											.map((item, index) => {
												let selected = this.props.multi && (
													// MultiDropdownList
													(selectedItem && !!selectedItem[item[keyField]])
													// MultiDropdownRange
													|| (Array.isArray(selectedItem)
														&& selectedItem.find(value =>
															value[labelField] === item[labelField]))
												);

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
														{
															renderListItem
																? renderListItem(item[labelField], item.doc_count)
																: (
																	<div>
																		{
																			typeof item[labelField] === 'string'
																				? <span
																					dangerouslySetInnerHTML={{
																						__html: item[labelField],
																					}}
																				/>
																				: item[labelField]
																		}
																		{
																			this.props.showCount && item.doc_count
																				&& (
																					<span
																						className={
																							getClassName(this.props.innerClass, 'count')
																							|| null
																						}
																					>
																						&nbsp;({item.doc_count})
																					</span>
																				)
																		}
																	</div>
																)
														}
														{
															selected && this.props.multi
																? (<Tick
																	className={
																		getClassName(this.props.innerClass, 'icon')
																		|| null
																	}
																/>)
																: null
														}
													</li>
												);
											})
									}
								</ul>
							)
							: null
					}
				</div>
			)}
		/>);
	}
}

Dropdown.defaultProps = {
	keyField: 'key',
	labelField: 'label',
	small: false,
};

Dropdown.propTypes = {
	innerClass: types.style,
	items: types.data,
	keyField: types.string,
	labelField: types.string,
	multi: types.bool,
	onChange: types.func,
	placeholder: types.string,
	returnsObject: types.bool,
	renderListItem: types.func,
	selectedItem: types.selectedValue,
	showCount: types.bool,
	single: types.bool,
	small: types.bool,
	theme: types.style,
	themePreset: types.themePreset,
};

export default withTheme(Dropdown);
