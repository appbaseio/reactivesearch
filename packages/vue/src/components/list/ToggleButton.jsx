import { Actions, helper } from '@appbaseio/reactivecore';
import types from '../../utils/vueTypes';
import Title from '../../styles/Title';
import Container from '../../styles/Container';
import Button, { toggleButtons } from '../../styles/Button';
import { connect } from '../../utils/index';

const {
	addComponent,
	removeComponent,
	updateQuery,
	watchComponent,
	setQueryListener,
	setQueryOptions,
} = Actions;
const { isEqual, checkValueChange, getClassName, getOptionsFromQuery } = helper;

const ToggleButton = {
	name: 'ToggleButton',
	props: {
		componentId: types.stringRequired,
		data: types.data,
		dataField: types.stringRequired,
		defaultValue: types.stringOrArray,
		value: types.stringOrArray,
		filterLabel: types.string,
		nestedField: types.string,
		innerClass: types.style,
		multiSelect: types.bool,
		react: types.react,
		showFilter: types.bool,
		title: types.title,
		URLParams: types.bool,
		renderItem: types.func,
	},
	data() {
		const props = this.$props;
		const value = this.selectedValue || props.value || props.defaultValue || [];
		const currentValue = ToggleButton.parseValue(value, props);
		this.__state = {
			currentValue,
		};
		this.locked = false;

		return this.__state;
	},
	beforeMount() {
		const props = this.$props;
		const hasMounted = false;
		if (this.$data.currentValue.length) {
			this.handleToggle(this.$data.currentValue, true, props, hasMounted);
		}
		this.addComponent(props.componentId);
		this.setReact(props);
	},
	created() {
		const onQueryChange = (...args) => {
			this.$emit('queryChange', ...args);
		};
		this.setQueryListener(this.$props.componentId, onQueryChange, e => {
			this.$emit('error', e);
		});
	},
	beforeDestroy() {
		this.removeComponent(this.$props.componentId);
	},
	watch: {
		react() {
			this.setReact(this.$props);
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
			// ignore state updates when component is locked
			if (props.beforeValueChange && this.locked) {
				return;
			}

			this.locked = true;

			const performUpdate = () => {
				const handleUpdates = () => {
					this.updateQuery(value, props);
					this.locked = false;
					this.$emit('valueChange', value);
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
				);
			}

			this.updateQueryHandler({
				componentId: props.componentId,
				query,
				value: filterValue,
				// sets a string in URL not array
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: props.URLParams,
				componentType: 'TOGGLEBUTTON',
			});
		},

		handleClick(item) {
			const { value } = this.$props;
			if (value === undefined) {
				this.handleToggle(item);
			} else {
				this.$emit('change', item);
			}
		},

		renderButton(item) {
			const renderItem = this.$scopedSlots.renderItem || this.renderItem;
			const isSelected = this.$data.currentValue.some(value => value.value === item.value);

			return (
				<Button
					class={`${getClassName(this.$props.innerClass, 'button')} ${
						isSelected ? 'active' : ''
					}`}
					onClick={() => this.handleClick(item)}
					key={item.value}
					primary={isSelected}
					large
				>
					{renderItem ? renderItem({ item, isSelected }) : item.label}
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
});

const mapDispatchtoProps = {
	addComponent,
	removeComponent,
	updateQueryHandler: updateQuery,
	watchComponent,
	setQueryListener,
	setQueryOptions,
};

const RcConnected = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(ToggleButton);

ToggleButton.install = function(Vue) {
	Vue.component(ToggleButton.name, RcConnected);
};
export default ToggleButton;
