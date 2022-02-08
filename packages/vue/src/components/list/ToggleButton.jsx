import VueTypes from 'vue-types';
import { Actions, helper } from '@appbaseio/reactivecore';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import types from '../../utils/vueTypes';
import Title from '../../styles/Title';
import Container from '../../styles/Container';
import ComponentWrapper from '../basic/ComponentWrapper.jsx';
import Button, { toggleButtons } from '../../styles/Button';
import { connect, updateCustomQuery, isQueryIdentical } from '../../utils/index';

const { updateQuery, setQueryOptions, setCustomQuery } = Actions;
const { isEqual, checkValueChange, getClassName, getOptionsFromQuery, handleA11yAction } = helper;

const ToggleButton = {
	name: 'ToggleButton',
	props: {
		componentId: types.stringRequired,
		data: types.data,
		dataField: types.stringRequired,
		defaultValue: types.any,
		value: types.stringOrArray,
		filterLabel: types.string,
		nestedField: types.string,
		innerClass: types.style,
		multiSelect: VueTypes.bool,
		react: types.react,
		showFilter: VueTypes.bool,
		title: types.title,
		URLParams: VueTypes.bool,
		renderItem: types.func,
		index: VueTypes.string,
		enableStrictSelection: VueTypes.bool,
	},
	data() {
		this.__state = {
			currentValue: [],
		};
		return this.__state;
	},
	beforeMount() {
		const props = this.$props;
		const hasMounted = false;
		const value = this.selectedValue || props.value || props.defaultValue || [];
		const currentValue = ToggleButton.parseValue(value, props);

		this.setValue(currentValue);

		if (this.$data.currentValue.length) {
			this.handleToggle(this.$data.currentValue, true, props, hasMounted);
		}
	},
	created() {
		if (!this.enableAppbase && this.$props.index) {
			console.warn(
				'Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.',
			);
		}
		// Set custom query in store
		updateCustomQuery(this.componentId, this.setCustomQuery, this.$props, this.currentValue);
	},
	watch: {
		defaultValue(newVal) {
			this.setValue(ToggleButton.parseValue(newVal, this.$props));
		},
		dataField() {
			this.updateQuery(this.$data.currentValue, this.$props);
		},
		nestedField() {
			this.updateQuery(this.$data.currentValue, this.$props);
		},
		value(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.handleToggle(newVal, true, this.$props);
			}
		},
		selectedValue(newVal, oldVal) {
			if (this.$props.multiSelect) {
				// for multiselect selectedValue will be an array
				if (!isEqual(this.$data.currentValue, newVal) && !isEqual(oldVal, newVal)) {
					this.handleToggle(newVal || [], true, this.$props);
				}
			} else {
				// else selectedValue will be a string
				const currentValue = this.$data.currentValue[0]
					? this.$data.currentValue[0].value
					: null;

				if (
					!isEqual(currentValue, this.selectedValue)
					&& !isEqual(oldVal, this.selectedValue)
				) {
					this.handleToggle(this.selectedValue || [], true, this.$props);
				}
			}
		},
		customQuery(newVal, oldVal) {
			if (!isQueryIdentical(newVal, oldVal, this.$data.currentValue, this.$props)) {
				this.updateQuery(this.$data.currentValue, this.$props);
			}
		},
	},
	methods: {
		handleToggle(value, isDefaultValue = false, props = this.$props, hasMounted = true) {
			const { currentValue } = this.$data;
			const toggleValue = value;
			let finalValue = [];

			if (isDefaultValue) {
				finalValue = ToggleButton.parseValue(toggleValue, props);
			} else if (this.$props.multiSelect) {
				finalValue = currentValue.some(item => item.value === toggleValue.value)
					? currentValue.filter(item => item.value !== toggleValue.value)
					: currentValue.concat(toggleValue);
			} else {
				finalValue = currentValue.some(item => item.value === toggleValue.value)
					? []
					: [toggleValue];
			}

			this.setValue(finalValue, props, hasMounted);
		},

		setReact(props) {
			if (props.react) {
				this.watchComponent(props.componentId, props.react);
			}
		},

		setValue(value, props = this.$props, hasMounted = true) {
			const performUpdate = () => {
				const handleUpdates = () => {
					this.updateQuery(value, props);
					this.$emit('valueChange', value);
					this.$emit('value-change', value);
				};

				if (hasMounted) {
					this.currentValue = value;
					handleUpdates();
				} else {
					handleUpdates();
				}
			};

			checkValueChange(
				props.componentId,
				props.multiSelect ? value : value[0],
				props.beforeValueChange,
				performUpdate,
			);
		},

		updateQuery(value, props) {
			let filterValue = value;

			if (!props.multiSelect) {
				filterValue = value[0] ? value[0].value : null;
			}

			const { customQuery } = props;
			let query = ToggleButton.defaultQuery(value, props);

			if (customQuery) {
				({ query } = customQuery(value, props) || {});
				this.setQueryOptions(
					props.componentId,
					getOptionsFromQuery(customQuery(value, props)),
					false
				);
				updateCustomQuery(props.componentId, this.setCustomQuery, props, value);
			}

			this.updateQueryHandler({
				componentId: props.componentId,
				query,
				value: filterValue,
				// sets a string in URL not array
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: props.URLParams,
				componentType: componentTypes.toggleButton,
			});
		},

		handleClick(item) {
			const { enableStrictSelection, multiSelect } = this.$props;
			if (
				enableStrictSelection
				&& !multiSelect
				&& this.$data.currentValue.find(stateItem => isEqual(item, stateItem))
			) {
				return false;
			}
			const { value } = this.$props;
			if (value === undefined) {
				this.handleToggle(item);
			} else {
				this.$emit('change', item.value);
			}
			return true;
		},

		renderButton(item) {
			const renderItem = this.$scopedSlots.renderItem || this.renderItem;
			const isSelected = this.$data.currentValue.some(value => value.value === item.value);

			return renderItem ? (
				renderItem({ item, isSelected, handleClick: () => this.handleClick(item) })
			) : (
				<Button
					class={`${getClassName(this.$props.innerClass, 'button')} ${
						isSelected ? 'active' : ''
					}`}
					onClick={() => this.handleClick(item)}
					key={item.value}
					primary={isSelected}
					large
					tabIndex={isSelected ? '-1' : '0'}
					onKeypress={e => handleA11yAction(e, () => this.handleClick(item))}
				>
					{item.label}
				</Button>
			);
		},
	},

	render() {
		return (
			<Container class={toggleButtons}>
				{this.$props.title && (
					<Title class={getClassName(this.$props.innerClass, 'title')}>
						{this.$props.title}
					</Title>
				)}
				{this.$props.data.map(item => this.renderButton(item))}
			</Container>
		);
	},
};

ToggleButton.parseValue = (value, props) => {
	if (Array.isArray(value)) {
		if (typeof value[0] === 'string') {
			return props.data.filter(item => value.includes(item.value));
		}
		return value;
	}
	return props.data.filter(item => item.value === value);
};

ToggleButton.defaultQuery = (value, props) => {
	let query = null;
	if (value && value.length) {
		query = {
			bool: {
				boost: 1.0,
				minimum_should_match: 1,
				should: value.map(item => ({
					term: {
						[props.dataField]: item.value,
					},
				})),
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
	enableAppbase: state.config.enableAppbase,
});

const mapDispatchtoProps = {
	updateQueryHandler: updateQuery,
	setQueryOptions,
	setCustomQuery,
};

const RcConnected = ComponentWrapper(connect(mapStateToProps, mapDispatchtoProps)(ToggleButton), {
	componentType: componentTypes.toggleButton,
});

ToggleButton.install = function(Vue) {
	Vue.component(ToggleButton.name, RcConnected);
};
// Add componentType for SSR
ToggleButton.componentType = componentTypes.toggleButton;

export default ToggleButton;
