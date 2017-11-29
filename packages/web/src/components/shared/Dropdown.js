import React from "react";
import Downshift from "downshift";

import types from "@appbaseio/reactivecore/lib/utils/types";

import { suggestions } from "../../styles/Input";
import Select from "../../styles/Select";
import Chevron from "../../styles/Chevron";

const Dropdown = ({ items, selectedItem, onChange, placeholder }) => (
	<Downshift
		selectedItem={selectedItem}
		onChange={(item) => onChange(item.key)}
		render={({
			isOpen,
			getButtonProps,
			getItemProps,
			highlightedIndex,
			selectedItem: dsSelectedItem
		}) => (<div>
			<Select {...getButtonProps()}>
				{selectedItem ? selectedItem : placeholder}
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
		</div>)}
	/>
);

Dropdown.propTypes = {
	items: types.data,
	selectedItem: types.string,
	onChange: types.func,
	placeholder: types.placeholder
}

export default Dropdown;
