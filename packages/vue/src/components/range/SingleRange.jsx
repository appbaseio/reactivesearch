import { Actions, helper } from '@appbaseio/reactivecore';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import VueTypes from 'vue-types';
import ComponentWrapper from '../basic/ComponentWrapper.jsx';
import Title from '../../styles/Title';
import Container from '../../styles/Container';
import { UL, Radio } from '../../styles/FormControlList';
import { connect, updateCustomQuery, isQueryIdentical } from '../../utils/index';
import types from '../../utils/vueTypes';

const { updateQuery, setQueryOptions, setCustomQuery } = Actions;
const { isEqual, checkValueChange, getClassName, getOptionsFromQuery } = helper;

const SingleRange = {
	name: 'SingleRange',
	data() {
		this.__state = {
			currentValue: null,
		};
		this.type = 'range';
		return this.__state;
	},
	props: {
		beforeValueChange: types.func,
		className: VueTypes.string.def(''),
		componentId: types.stringRequired,
		customQuery: types.func,
		data: types.data,
		dataField: types.stringRequired,
		defaultValue: types.string,
		value: types.value,
		filterLabel: types.string,
		innerClass: types.style,
		react: types.react,
		showFilter: VueTypes.bool.def(true),
		showRadio: VueTypes.bool.def(true),
		title: types.title,
		URLParams: VueTypes.bool.def(false),
		nestedField: types.string,
	},
	created() {
		// Set custom query in store
		updateCustomQuery(this.componentId, this.setCustomQuery, this.$props, this.currentValue);
	},
	beforeMount() {
		if (this.selectedValue) {
			this.setValue(this.selectedValue);
		} else if (this.$props.value) {
			this.setValue(this.$props.value);
		} else if (this.$props.defaultValue) {
			this.setValue(this.$props.defaultValue);
		}
	},
	watch: {
		dataField() {
			this.updateQueryHandler(this.$data.currentValue, this.$props);
		},
		defaultValue(newVal) {
			this.setValue(newVal);
		},
		value(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.setValue(newVal);
			}
		},
		selectedValue(newVal) {
			if (!isEqual(this.$data.currentValue, newVal)) {
				this.setValue(newVal);
			}
		},
		customQuery(newVal, oldVal) {
			if (!isQueryIdentical(newVal, oldVal, this.$data.currentValue, this.$props)) {
				this.updateQueryHandler(this.$data.currentValue, this.$props);
			}
		},
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
								<Radio
									class={getClassName(this.$props.innerClass, 'radio')}
									id={`${this.$props.componentId}-${item.label}`}
									name={this.$props.componentId}
									value={item.label}
									onChange={this.handleChange}
									type="radio"
									checked={selected}
									show={this.$props.showRadio}
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

	methods: {
		setValue(value, props = this.$props) {
			const currentValue = SingleRange.parseValue(value, props);

			const performUpdate = () => {
				this.currentValue = currentValue;
				this.updateQueryHandler(currentValue, props);
				this.$emit('valueChange', currentValue);
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
			let query = SingleRange.defaultQuery(value, props);
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
				componentType: componentTypes.singleRange,
			});
		},

		handleChange(e) {
			const { value } = this.$props;

			if (value === undefined) {
				this.setValue(e.target.value);
			} else {
				this.$emit('change', e.target.value);
			}
		},
	},
};

SingleRange.parseValue = (value, props) => props.data.find(item => item.label === value) || null;

SingleRange.defaultQuery = (value, props) => {
	let query = null;
	if (value) {
		query = {
			range: {
				[props.dataField]: {
					gte: value.start,
					lte: value.end,
					boost: 2.0,
				},
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

const RangeConnected = ComponentWrapper(connect(mapStateToProps, mapDispatchtoProps)(SingleRange), {
	componentType: componentTypes.singleRange,
});

SingleRange.install = function(Vue) {
	Vue.component(SingleRange.name, RangeConnected);
};
// Add componentType for SSR
SingleRange.componentType = componentTypes.singleRange;

export default SingleRange;
