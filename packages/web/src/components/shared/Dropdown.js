import React, { Component } from "react";
import Downshift from "downshift";

import types from "@appbaseio/reactivecore/lib/utils/types";

import { suggestionsContainer, suggestions } from "../../styles/Input";
import Select from "../../styles/Select";
import Chevron from "../../styles/Chevron";

class Dropdown extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false
		};
	}

	toggle = () => {
		this.setState({
			open: !this.state.open
		});
	};

	close = () => {
		this.setState({
			open: false
		});
	};

	onChange = (item) => {
		this.props.onChange(item.key);

		if (!this.props.multi) {
			this.close();
		}
	}

	render() {
		const { items, selectedItem, placeholder } = this.props;

		return (<Downshift
			selectedItem={selectedItem}
			onChange={this.onChange}
			onOuterClick={this.close}
			render={({
				isOpen,
				getButtonProps,
				getItemProps,
				highlightedIndex
			}) => {
				const { open } = this.state;
				return (<div className={suggestionsContainer}>
					<Select
						{...getButtonProps()}
						onClick={this.toggle}
						onBlur={() => setTimeout(this.close, 200)}
					>
						{selectedItem ? selectedItem : placeholder}
						<Chevron open={open} />
					</Select>
					{
						open && items.length
							? (<div className={suggestions}>
								<ul>
									{
										items
											.map((item, index) => (
												<li
													{...getItemProps({ item })}
													key={item.key}
													style={{
														backgroundColor: highlightedIndex === index ? "#eee" : "#fff"
													}}
												>
													{item.key}
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
	selectedItem: types.string,
	onChange: types.func,
	placeholder: types.placeholder,
	multi: types.multiSelect
}

export default Dropdown;
