import { Actions, helper } from '@appbaseio/reactivecore';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import VueTypes from 'vue-types';
import Title from '../../styles/Title';
import ComponentWrapper from '../basic/ComponentWrapper.jsx';
import PreferencesConsumer from '../basic/PreferencesConsumer.jsx';
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
		index: VueTypes.string,
		endpoint: types.endpointConfig,
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
				currentValue.forEach((value) => {
					values[[value.label]] = true;
				});
				if (reset) {
					selectedValues = values;
				} else {
					selectedValues = { ...selectedValues, ...values };
				}
			} else if (selectedValues[item]) {
				currentValue = currentValue.filter((value) => value.label !== item);
				const { [item]: del, ...selected } = selectedValues;
				selectedValues = selected;
			} else {
				const currentItems = props.data.filter((value) => item.indexOf(value.label) !== -1);
				currentValue = [...currentValue, ...currentItems];
				selectedValues = {
					...selectedValues,
					[typeof item === 'object' ? item.label : item]: true,
				};
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
			if (customQuery) {
				({ query } = customQuery(value, props) || {});
				const customQueryOptions = getOptionsFromQuery(customQuery(value, props));
				updateCustomQuery(
					this.componentId,
					this.setCustomQuery,
					this.$props,
					this.currentValue,
				);

				this.setQueryOptions(props.componentId, customQueryOptions, false);
			}

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
				const processSelectedValues = newVal
					? newVal.map((item) => {
						if (typeof item === 'object' && 'label' in item) {
							return item.label;
						}
						return item;
					  })
					: null;
				this.selectItem(processSelectedValues, true, undefined, true);
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
					{this.$props.data.map((item) => {
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
									checked={this.selectedValues[item.label]}
									on={{
										click: this.handleClick,
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
	value ? props.data.filter((item) => value.includes(item.label)) : null;

MultiRange.defaultQuery = (value, props) => ({
	query: {
		queryFormat: props.queryFormat,
		dataField: props.dataField,
		value,
		showMissing: props.showMissing,
	},
});

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

export const RangeConnected = PreferencesConsumer(
	ComponentWrapper(connect(mapStateToProps, mapDispatchtoProps)(MultiRange), {
		componentType: componentTypes.multiRange,
	}),
);
RangeConnected.name = MultiRange.name;

RangeConnected.defaultQuery = MultiRange.defaultQuery;
RangeConnected.parseValue = MultiRange.parseValue;
RangeConnected.hasInternalComponent = MultiRange.hasInternalComponent;

RangeConnected.install = function (Vue) {
	Vue.component(RangeConnected.name, RangeConnected);
};
// Add componentType for SSR
RangeConnected.componentType = componentTypes.multiRange;

export default RangeConnected;
