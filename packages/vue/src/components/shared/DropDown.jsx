import { helper } from '@appbaseio/reactivecore';
import { replaceDiacritics } from '@appbaseio/reactivecore/lib/utils/suggestions';
import VueTypes from 'vue-types';
import Downshift from '../basic/DownShift.jsx';
import Input, { suggestionsContainer, suggestions } from '../../styles/Input';
import types from '../../utils/vueTypes';
import Select, { Tick } from '../../styles/Select';
import Chevron from '../../styles/Chevron';
import { isFunction } from '../../utils/index';

const { getClassName } = helper;
const Dropdown = {
	data() {
		this.__state = {
			isOpen: false,
			searchTerm: '',
		};
		return this.__state;
	},
	inject: {
		theme: {
			from: 'theme_reactivesearch',
		},
	},
	props: {
		innerClass: types.style,
		items: types.data,
		keyField: VueTypes.string.def('key'),
		labelField: VueTypes.string.def('label'),
		multi: VueTypes.bool, // change event
		placeholder: types.string,
		returnsObject: VueTypes.bool,
		customLabelRenderer: types.func,
		hasCustomRenderer: VueTypes.bool,
		customRenderer: types.func,
		renderItem: types.func,
		renderNoResults: VueTypes.any,
		handleChange: types.func,
		transformData: types.func,
		selectedItem: types.selectedValue,
		showCount: VueTypes.bool,
		single: VueTypes.bool,
		small: VueTypes.bool.def(false),
		themePreset: types.themePreset,
		showSearch: VueTypes.bool,
	},

	render() {
		const {
			items,
			selectedItem,
			placeholder,
			labelField,
			keyField,
			themePreset,
			renderItem,
			transformData,
			footer,
			customLabelRenderer,
			hasCustomRenderer,
			customRenderer,
		} = this.$props;
		let itemsToRender = items;

		if (transformData) {
			itemsToRender = transformData(itemsToRender);
		}

		const filteredItemsToRender = itemsToRender.filter(item => {
			if (String(item[labelField]).length) {
				if (
					this.$props.showSearch
					&& this.$data.searchTerm
				) {
					return replaceDiacritics(String(item[labelField]))
						.toLowerCase()
						.includes(
							replaceDiacritics(this.$data.searchTerm.toLowerCase()),
						);
				}

				return true;
			}

			return false;
		})

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
						getItemEvents,
					}) => (
						<div class={suggestionsContainer}>
							<Select
								{...{
									on: {
										...getButtonProps({
											onClick: this.toggle,
										}),
									},
								}}
								class={getClassName(this.$props.innerClass, 'select') || ''}
								title={
									selectedItem ? this.renderToString(selectedItem) : placeholder
								}
								small={this.$props.small}
								themePreset={this.$props.themePreset}
							>
								{customLabelRenderer ? (
									customLabelRenderer(selectedItem)
								) : (
									<div>
										{selectedItem
											? this.renderToString(selectedItem)
											: placeholder}
									</div>
								)}
								<Chevron open={isOpen} />
							</Select>
							{/* eslint-disable-next-line no-nested-ternary */}
							{hasCustomRenderer ? (
								customRenderer(itemsToRender, {
									getItemProps,
									isOpen,
									highlightedIndex,
									getButtonProps,
									getItemEvents,
								})
							) : isOpen && itemsToRender.length ? (
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
												borderBottom: '1px solid #ddd',
											}}
											showIcon={false}
											class={getClassName(this.$props.innerClass, 'input')}
											placeholder="Type here to search..."
											value={this.$data.searchTerm}
											onChange={this.handleInputChange}
											themePreset={themePreset}
										/>
									) : null}
									{(!hasCustomRenderer && filteredItemsToRender.length === 0 )
										? this.renderNoResult()
										: filteredItemsToRender.map((item, index) => {
											let selected
												= this.$props.multi // MultiDropdownList
												&& ((selectedItem && !!selectedItem[item[keyField]]) // MultiDropdownRange
													|| (Array.isArray(selectedItem)
														&& selectedItem.find(
															value =>
																value[labelField]
																=== item[labelField],
														)));
											if (!this.$props.multi)
												selected = item.key === selectedItem;
											return (
												<li
													{...{
														domProps: getItemProps({ item }),
													}}
													{...{
														on: getItemEvents({
															item,
														}),
													}}
													key={item[keyField]}
													class={`${selected ? 'active' : ''}`}
													style={{
														backgroundColor: this.getBackgroundColor(
															highlightedIndex === index,
															selected,
														),
													}}
												>
													{renderItem ? (
														renderItem({
															label: item[labelField],
															count: item.doc_count,
															isChecked:
																selected && this.$props.multi,
														})
													) : (
														<div>
															{typeof item[labelField]
															=== 'string' ? (
																	<span
																		domPropsInnerHTML={
																			item[labelField]
																		}
																	/>
																) : (
																	item[labelField]
																)}
															{this.$props.showCount
																&& item.doc_count && (
																<span
																	class={
																		getClassName(
																			this.$props
																				.innerClass,
																			'count',
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
																getClassName(
																	this.$props.innerClass,
																	'icon',
																) || ''
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
					),
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
			}
			if (selected) {
				return isDark ? '#686868' : '#fafafa';
			}

			return isDark ? '#424242' : '#fff';
		},

		handleInputChange(e) {
			const { value } = e.target;
			this.searchTerm = value;
		},

		renderToString(value) {
			const { customLabelRenderer } = this.$props;
			if (customLabelRenderer) {
				const customLabel = customLabelRenderer(value);
				if (typeof customLabel === 'string') {
					return customLabel;
				}
			}
			if (Array.isArray(value) && value.length) {
				const arrayToRender = value.map(item => this.renderToString(item));
				return arrayToRender.join(', ');
			}
			if (value && typeof value === 'object') {
				if (value[this.$props.labelField]) {
					return value[this.$props.labelField];
				}
				if (Object.keys(value).length) {
					return this.renderToString(Object.keys(value));
				}

				return this.$props.placeholder;
			}

			return value;
		},

		renderNoResult() {
			const renderNoResults
				= this.$scopedSlots.renderNoResults || this.$props.renderNoResults;
			return (
				<p class={getClassName(this.$props.innerClass, 'noResults') || null}>
					{isFunction(renderNoResults) ? renderNoResults() : renderNoResults}
				</p>
			);
		},
	},
};
export default Dropdown;
