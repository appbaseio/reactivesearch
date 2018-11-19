import { helper } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import Downshift from '../basic/DownShift.jsx';
import Input, { suggestionsContainer, suggestions } from '../../styles/Input';
import types from '../../utils/vueTypes';
import Select, { Tick } from '../../styles/Select';
import Chevron from '../../styles/Chevron';

const { getClassName } = helper;
const Dropdown = {
	data() {
		this.__state = {
			isOpen: false,
			searchTerm: ''
		};
		return this.__state;
	},
	inject: ['theme'],
	props: {
		innerClass: types.style,
		items: types.data,
		keyField: VueTypes.string.def('key'),
		labelField: VueTypes.string.def('label'),
		multi: types.bool, // change event
		placeholder: types.string,
		returnsObject: types.bool,
		renderListItem: types.func,
		handleChange: types.func,
		transformData: types.func,
		selectedItem: types.selectedValue,
		showCount: types.bool,
		single: types.bool,
		small: VueTypes.bool.def(false),
		themePreset: types.themePreset,
		showSearch: types.bool
	},

	render() {
		const {
			items,
			selectedItem,
			placeholder,
			labelField,
			keyField,
			themePreset,
			renderListItem,
			transformData,
			footer
		} = this.$props;
		let itemsToRender = items;

		if (transformData) {
			itemsToRender = transformData(itemsToRender);
		}
		return (
			<Downshift
				isOpen={this.$data.isOpen}
				selectedItem={selectedItem}
				handleChange={this.onChange}
				handleMouseup={this.handleStateChange}
				scopedSlots={{
					default: ({
						getItemProps,
						isOpen,
						highlightedIndex,
						getButtonProps,
						getItemEvents
					}) => (
						<div class={suggestionsContainer}>
							<Select
								{...{
									on: {
										...getButtonProps({
											onClick: this.toggle
										})
									}
								}}
								class={getClassName(this.$props.innerClass, 'select') || ''}
								title={
									selectedItem ? this.renderToString(selectedItem) : placeholder
								}
								small={this.$props.small}
								themePreset={this.$props.themePreset}
							>
								<div>
									{selectedItem
										? this.renderToString(selectedItem)
										: placeholder}
								</div>
								<Chevron open={isOpen} />
							</Select>
							{isOpen && itemsToRender.length ? (
								<ul
									class={`${suggestions(themePreset, this.theme)} ${
										this.$props.small ? 'small' : ''
									} ${getClassName(this.$props.innerClass, 'list')}`}
								>
									{this.$props.showSearch ? (
										<Input
											id={`${this.$props.componentId}-input`}
											style={{
												border: 0,
												borderBottom: '1px solid #ddd'
											}}
											showIcon={false}
											class={getClassName(this.$props.innerClass, 'input')}
											placeholder="Type here to search..."
											value={this.$data.searchTerm}
											onChange={this.handleInputChange}
											themePreset={themePreset}
										/>
									) : null}
									{itemsToRender
										.filter(item => {
											if (String(item[labelField]).length) {
												if (this.$props.showSearch && this.$data.searchTerm) {
													return String(item[labelField])
														.toLowerCase()
														.includes(this.$data.searchTerm.toLowerCase());
												}

												return true;
											}

											return false;
										})
										.map((item, index) => {
											let selected
												= this.$props.multi // MultiDropdownList
												&& ((selectedItem && !!selectedItem[item[keyField]]) // MultiDropdownRange
													|| (Array.isArray(selectedItem)
														&& selectedItem.find(
															value => value[labelField] === item[labelField]
														)));
											if (!this.$props.multi)
												selected = item.key === selectedItem;
											return (
												<li
													{...{
														domProps: getItemProps({ item })
													}}
													{...{
														on: getItemEvents({
															item
														})
													}}
													key={item[keyField]}
													class={`${selected ? 'active' : ''}`}
													style={{
														backgroundColor: this.getBackgroundColor(
															highlightedIndex === index,
															selected
														)
													}}
												>
													{renderListItem ? (
														renderListItem({
															label: item[labelField],
															count: item.doc_count
														})
													) : (
														<div>
															{typeof item[labelField] === 'string' ? (
																<span domPropsInnerHTML={item[labelField]} />
															) : (
																item[labelField]
															)}
															{this.$props.showCount
																&& item.doc_count && (
																<span
																	class={
																		getClassName(
																			this.$props.innerClass,
																			'count'
																		) || ''
																	}
																>
																		&nbsp;(
																	{item.doc_count})
																</span>
															)}
														</div>
													)}
													{selected && this.$props.multi ? (
														<Tick
															class={
																getClassName(this.$props.innerClass, 'icon')
																|| ''
															}
														/>
													) : null}
												</li>
											);
										})}
									{footer}
								</ul>
							) : null}
						</div>
					)
				}}
			/>
		);
	},

	methods: {
		toggle() {
			this.isOpen = !this.$data.isOpen;
		},

		close() {
			this.isOpen = false;
		},

		onChange(item) {
			if (this.$props.returnsObject) {
				this.$props.handleChange(item);
			} else {
				this.$props.handleChange(item[this.$props.keyField]);
			}

			if (!this.$props.multi) {
				this.isOpen = false;
			}
		},
		handleStateChange({ isOpen }) {
			this.isOpen = isOpen;
		},

		getBackgroundColor(highlighted, selected) {
			const isDark = this.$props.themePreset === 'dark';

			if (highlighted) {
				return isDark ? '#555' : '#eee';
			} else if (selected) {
				return isDark ? '#686868' : '#fafafa';
			}

			return isDark ? '#424242' : '#fff';
		},

		handleInputChange(e) {
			const { value } = e.target;
			this.searchTerm = value;
		},

		renderToString(value) {
			if (Array.isArray(value) && value.length) {
				const arrayToRender = value.map(item => this.renderToString(item));
				return arrayToRender.join(', ');
			} else if (value && typeof value === 'object') {
				if (value[this.$props.labelField]) {
					return value[this.$props.labelField];
				} else if (Object.keys(value).length) {
					return this.renderToString(Object.keys(value));
				}

				return this.$props.placeholder;
			}

			return value;
		}
	}
};
export default Dropdown;
