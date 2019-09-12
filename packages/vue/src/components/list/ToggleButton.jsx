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
		defaultSelected: types.stringOrArray,
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
		const value = this.selectedValue || this.value || this.defaultSelected || [];
		const currentValue = ToggleButton.parseValue(value, this.$props);
		this.__state = {
			currentValue,
		};
		this.locked = false;

		return this.__state;
	},
	beforeMount() {
		const hasMounted = false;
		if (this.currentValue.length) {
			this.handleToggle(this.currentValue, true, hasMounted);
		}
		this.addComponent(this.componentId);
		this.setReact();
	},
	created() {
		const onQueryChange = (...args) => {
			this.$emit('queryChange', ...args);
		};
		this.setQueryListener(this.componentId, onQueryChange, e => {
			this.$emit('error', e);
		});
	},
	beforeDestroy() {
		this.removeComponent(this.componentId);
	},
	watch: {
		defaultSelected(newVal) {
			this.setValue(ToggleButton.parseValue(newVal));
		},
		react() {
			this.setReact();
		},
		dataField() {
			this.updateQuery(this.currentValue);
		},
		nestedField() {
			this.updateQuery(this.currentValue);
		},
		value(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.handleToggle(newVal, true);
			}
		},
		selectedValue(newVal, oldVal) {
			if (this.multiSelect) {
				// for multiselect selectedValue will be an array
				if (!isEqual(this.currentValue, newVal) && !isEqual(oldVal, newVal)) {
					this.handleToggle(newVal || [], true);
				}
			} else {
				// else selectedValue will be a string
				const currentValue = this.currentValue[0]
					? this.currentValue[0].value
					: null;

				if (
					!isEqual(currentValue, this.selectedValue)
					&& !isEqual(oldVal, this.selectedValue)
				) {
					this.handleToggle(this.selectedValue || [], true);
				}
			}
		},
	},
	methods: {
		handleToggle(value, isDefaultValue = false, hasMounted = true) {
			const { currentValue } = this;
			const toggleValue = value;
			let finalValue = [];

			if (isDefaultValue) {
				finalValue = ToggleButton.parseValue(toggleValue, this.$props);
			} else if (this.multiSelect) {
				finalValue = currentValue.some(item => item.value === toggleValue.value)
					? currentValue.filter(item => item.value !== toggleValue.value)
					: currentValue.concat(toggleValue);
			} else {
				finalValue = currentValue.some(item => item.value === toggleValue.value)
					? []
					: [toggleValue];
			}

			this.setValue(finalValue, hasMounted);
		},

		setReact() {
			if (this.react) {
				this.watchComponent(this.componentId, this.react);
			}
		},

		setValue(value, hasMounted = true) {
			// ignore state updates when component is locked
			if (this.beforeValueChange && this.locked) {
				return;
			}

			this.locked = true;

			const performUpdate = () => {
				const handleUpdates = () => {
					this.updateQuery(value);
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
				this.componentId,
				this.multiSelect ? value : value[0],
				this.beforeValueChange,
				performUpdate,
			);
		},

		updateQuery(value) {
			let filterValue = value;

			if (!this.multiSelect) {
				filterValue = value[0] ? value[0].value : null;
			}

			const { customQuery } = this;
			let query = ToggleButton.defaultQuery(value, this.$props);

			if (customQuery) {
				({ query } = customQuery(value, this.$props) || {});
				this.setQueryOptions(
					this.componentId,
					getOptionsFromQuery(customQuery(value, this.$props)),
				);
			}

			this.updateQueryHandler({
				componentId: this.componentId,
				query,
				value: filterValue,
				// sets a string in URL not array
				label: this.filterLabel,
				showFilter: this.showFilter,
				URLParams: this.URLParams,
				componentType: 'TOGGLEBUTTON',
			});
		},

		handleClick(item) {
			const { value } = this;
			if (value === undefined) {
				this.handleToggle(item);
			} else {
				this.$emit('change', item);
			}
		},

		renderButton(item) {
			const renderItem = this.$scopedSlots.renderItem || this.renderItem;
			const isSelected = this.currentValue.some(value => value.value === item.value);
			return (
				<Button
					class={`${getClassName(this.innerClass, 'button')} ${
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
				{this.title && (
					<Title class={getClassName(this.innerClass, 'title')}>
						{this.title}
					</Title>
				)}
				{this.data.map(item => this.renderButton(item))}
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
