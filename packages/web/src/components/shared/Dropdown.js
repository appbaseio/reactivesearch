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
		this.props.onChange(item.key);

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

	getBackgroundColor(selected, highlighted) {
		if (highlighted) {
			return "#eee";
		} else if (selected) {
			return "#fafafa";
		}
		return "#fff";
	}

	render() {
		const { items, selectedItem, placeholder } = this.props;

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
					>
						{selected ? selected : placeholder}
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
													key={item.key}
													style={{
														backgroundColor: this.getBackgroundColor(!!selectedItem[item.key], highlightedIndex === index),
													}}
												>
													{item.key}
													{
														!!selectedItem[item.key]
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

Dropdown.propTypes = {
	items: types.data,
	selectedItem: types.selectedValue,
	onChange: types.func,
	placeholder: types.placeholder,
	multi: types.multiSelect
}

export default Dropdown;
