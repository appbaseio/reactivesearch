import { Actions, helper } from '@appbaseio/reactivecore';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import VueTypes from 'vue-types';
import Title from '../../styles/Title';
import ComponentWrapper from '../basic/ComponentWrapper.jsx';
import Container from '../../styles/Container';
import { UL, Checkbox } from '../../styles/FormControlList';
import { connect, parseValueArray, updateCustomQuery, isQueryIdentical } from '../../utils/index';
import types from '../../utils/vueTypes';

const { updateQuery, setQueryOptions, setCustomQuery } = Actions;

const { isEqual, checkValueChange, getClassName, getOptionsFromQuery } = helper;
const MultiRange = {
	name: 'MultiRange',
	data() {
		this.state = {
			currentValue: [],
			showModal: false,
			selectedValues: {},
		};
		this.type = 'range';
		return this.state;
	},
	props: {
		beforeValueChange: types.func,
		className: VueTypes.string.def(''),
		componentId: types.stringRequired,
		customQuery: types.func,
		data: types.data,
		dataField: types.stringRequired,
		defaultValue: types.stringArray,
		value: types.stringArray,
		filterLabel: types.string,
		innerClass: types.style,
		react: types.react,
		showFilter: VueTypes.bool.def(true),
		showCheckbox: VueTypes.bool.def(true),
		title: types.title,
		URLParams: VueTypes.bool.def(false),
		nestedField: types.string,
	},
	methods: {
		handleClick(e) {
			const { value } = this.$props;

			if (value === undefined) {
				this.selectItem(e.target.value);
			} else {
				const values = parseValueArray(this.selectedValues, e.target.value);
				this.$emit('change', values);
			}
		},
		selectItem(item, isDefaultValue = false, props = this.$props, reset = false) {
			let { currentValue, selectedValues } = this;

			if (!item) {
				currentValue = [];
				selectedValues = {};
			} else if (isDefaultValue) {
				currentValue = MultiRange.parseValue(item, props);
				const values = {};
				currentValue.forEach(value => {
					values[[value.label]] = true;
				});
				if (reset) {
					selectedValues = values;
				} else {
					selectedValues = { ...selectedValues, ...values };
				}
			} else if (selectedValues[item]) {
				currentValue = currentValue.filter(value => value.label !== item);
				const { [item]: del, ...selected } = selectedValues;
				selectedValues = selected;
			} else {
				const currentItems = props.data.filter(value => item.indexOf(value.label) !== -1);
				currentValue = [...currentValue, ...currentItems];
				selectedValues = { ...selectedValues, [item]: true };
			}

			const performUpdate = () => {
				this.currentValue = currentValue;
				this.selectedValues = selectedValues;
				this.updateQueryHandler(currentValue, props);
				this.$emit('valueChange', Object.keys(selectedValues));
				this.$emit('value-change', Object.keys(selectedValues));
			};

			checkValueChange(
				props.componentId,
				currentValue,
				props.beforeValueChange,
				performUpdate,
			);
		},

		updateQueryHandler(value, props) {
			const { customQuery } = props;
			let query = MultiRange.defaultQuery(value, props);
			let customQueryOptions;
			if (customQuery) {
				({ query } = customQuery(value, props) || {});
				customQueryOptions = getOptionsFromQuery(customQuery(value, props));
				updateCustomQuery(
					this.componentId,
					this.setCustomQuery,
					this.$props,
					this.currentValue,
				);
			}

			this.setQueryOptions(props.componentId, customQueryOptions);

			this.updateQuery({
				componentId: props.componentId,
				query,
				value,
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: props.URLParams,
				componentType: componentTypes.multiRange,
			});
		},
	},

	watch: {
		dataField() {
			this.updateQueryHandler(this.$data.currentValue, this.$props);
		},
		defaultValue(newVal) {
			this.selectItem(newVal, true, undefined, true);
		},
		value(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.selectItem(newVal, true, undefined, true);
			}
		},
		selectedValue(newVal) {
			if (!isEqual(this.$data.currentValue, newVal)) {
				this.selectItem(newVal);
			}
		},
		customQuery(newVal, oldVal) {
			if (!isQueryIdentical(newVal, oldVal, this.$data.currentValue, this.$props)) {
				this.updateQueryHandler(this.$data.currentValue, this.$props);
			}
		},
	},

	created() {
		// Set custom query in store
		updateCustomQuery(this.componentId, this.setCustomQuery, this.$props, this.currentValue);
	},
	beforeMount() {
		if (this.selectedValue) {
			this.selectItem(this.selectedValue, true);
		} else if (this.$props.value) {
			this.selectItem(this.$props.value, true);
		} else if (this.$props.defaultValue) {
			this.selectItem(this.$props.defaultValue, true);
		}
	},
	render() {
		return (
			<Container class={this.$props.className}>
				{this.$props.title && (
					<Title class={getClassName(this.$props.innerClass, 'title')}>
						{this.$props.title}
					</Title>
				)}
				<UL class={getClassName(this.$props.innerClass, 'list')}>
					{this.$props.data.map(item => {
						const selected
							= !!this.$data.currentValue
							&& this.$data.currentValue.label === item.label;
						return (
							<li key={item.label} class={`${selected ? 'active' : ''}`}>
								<Checkbox
									class={getClassName(this.$props.innerClass, 'checkbox')}
									id={`${this.$props.componentId}-${item.label}`}
									name={this.$props.componentId}
									value={item.label}
									type="Checkbox"
									show={this.$props.showCheckbox}
									{...{
										domProps: {
											checked: this.selectedValues[item.label],
										},
									}}
									{...{
										on: {
											click: this.handleClick,
										},
									}}
								/>
								<label
									class={getClassName(this.$props.innerClass, 'label')}
									for={`${this.$props.componentId}-${item.label}`}
								>
									{item.label}
								</label>
							</li>
						);
					})}
				</UL>
			</Container>
		);
	},
};

MultiRange.parseValue = (value, props) =>
	value ? props.data.filter(item => value.includes(item.label)) : null;

MultiRange.defaultQuery = (values, props) => {
	const generateRangeQuery = (dataField, items) => {
		if (items.length > 0) {
			return items.map(value => ({
				range: {
					[dataField]: {
						gte: value.start,
						lte: value.end,
						boost: 2.0,
					},
				},
			}));
		}
		return null;
	};
	let query = null;
	if (values && values.length) {
		query = {
			bool: {
				should: generateRangeQuery(props.dataField, values),
				minimum_should_match: 1,
				boost: 1.0,
			},
		};
	}
	if (query && props.nestedField) {
		return {
			query: {
				nested: {
					path: props.nestedField,
					query,
				},
			},
		};
	}

	return query;
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	componentProps: state.props[props.componentId],
});

const mapDispatchtoProps = {
	updateQuery,
	setQueryOptions,
	setCustomQuery,
};

const RangeConnected = ComponentWrapper(connect(mapStateToProps, mapDispatchtoProps)(MultiRange), {
	componentType: componentTypes.multiRange,
});

MultiRange.install = function(Vue) {
	Vue.component(MultiRange.name, RangeConnected);
};
// Add componentType for SSR
MultiRange.componentType = componentTypes.multiRange;

export default MultiRange;
