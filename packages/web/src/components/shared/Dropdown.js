import React, { Component } from "react";
import Downshift from "downshift";

import types from "@appbaseio/reactivecore/lib/utils/types";

import { suggestionsContainer, suggestions } from "../../styles/Input";
import Select, { Tick } from "../../styles/Select";
import Chevron from "../../styles/Chevron";

class Dropdown extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false
		};
	}

	toggle = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	close = () => {
		this.setState({
			isOpen: false
		});
	};

	onChange = (item) => {
		this.props.onChange(item[this.props.keyField]);

		if (!this.props.multi) {
			this.setState({
				isOpen: false
			});
		}
	};

	handleStateChange = (changes) => {
		const { isOpen, type } = changes;
		if (type === Downshift.stateChangeTypes.mouseUp) {
			this.setState({
				isOpen
			});
		}
	};

	getBackgroundColor = (item, selectedItem, highlighted) => {
		if (highlighted) {
			return "#eee";
		} else if (this.props.multi && !!selectedItem[item]) {
			return "#fafafa";
		}
		return "#fff";
	};

	render() {
		const { items, selectedItem, placeholder, labelField, keyField } = this.props;

		return (<Downshift
			selectedItem={selectedItem}
			onChange={this.onChange}
			onOuterClick={this.close}
			onStateChange={this.handleStateChange}
			isOpen={this.state.isOpen}
			render={({
				getButtonProps,
				getItemProps,
				isOpen,
				highlightedIndex
			}) => {
				let selected = selectedItem;

				if (this.props.multi) {
					selected = Object.keys(selectedItem).join(", ");
				}

				return (<div className={suggestionsContainer}>
					<Select
						{...getButtonProps()}
						onClick={this.toggle}
						title={selected ? selected : placeholder}
					>
						<div>{selected ? selected : placeholder}</div>
						<Chevron open={isOpen} />
					</Select>
					{
						isOpen && items.length
							? (<div className={suggestions}>
								<ul>
									{
										items
											.map((item, index) => (
												<li
													{...getItemProps({ item })}
													key={item[keyField]}
													style={{
														backgroundColor: this.getBackgroundColor(item[keyField], selectedItem, highlightedIndex === index)
													}}
												>
													{item[labelField]}
													{
														this.props.multi && !!selectedItem[item[keyField]]
															? (<Tick />)
															: null
													}
												</li>
											))
									}
								</ul>
							</div>)
							: null
					}
				</div>);
			}}
		/>);
	}
}

Dropdown.defaultProps = {
	labelField: "label",
	keyField: "key"
}

Dropdown.propTypes = {
	items: types.data,
	selectedItem: types.selectedValue,
	onChange: types.func,
	placeholder: types.placeholder,
	multi: types.multiSelect,
	labelField: types.string,
	keyField: types.string
}

export default Dropdown;
