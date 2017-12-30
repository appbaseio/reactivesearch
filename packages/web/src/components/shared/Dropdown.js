import React, { Component } from 'react';
import Downshift from 'downshift';

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
		if (highlighted) {
			return '#eee';
		} else if (selected) {
			return '#fafafa';
		}
		return '#fff';
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
			items, selectedItem, placeholder, labelField, keyField,
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
					>
						<div>{selectedItem ? this.renderToString(selectedItem) : placeholder}</div>
						<Chevron open={isOpen} />
					</Select>
					{
						isOpen && items.length
							? (
								<ul className={`${suggestions} ${getClassName(this.props.innerClass, 'list')}`}>
									{
										items
											.map((item, index) => {
												const selected = this.props.multi && (
													// MultiDropdownList
													(selectedItem && !!selectedItem[item[keyField]])
													// MultiDropdownRange
													|| (Array.isArray(selectedItem)
														&& selectedItem.find(value =>
															value[labelField] === item[labelField]))
												);

												return (
													<li
														{...getItemProps({ item })}
														key={item[keyField]}
														style={{
															backgroundColor: this.getBackgroundColor(
																highlightedIndex === index,
																selected,
															),
														}}
													>
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
																	&& ` (${item.doc_count})`
															}
														</div>
														{
															selected
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
	labelField: 'label',
	keyField: 'key',
};

Dropdown.propTypes = {
	items: types.data,
	selectedItem: types.selectedValue,
	onChange: types.func,
	placeholder: types.string,
	multi: types.bool,
	labelField: types.string,
	keyField: types.string,
	returnsObject: types.bool,
	showCount: types.bool,
	innerClass: types.style,
};

export default Dropdown;
