import { Actions, helper } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import Title from '../../styles/Title';
import Container from '../../styles/Container';
import { UL, Checkbox } from '../../styles/FormControlList';
import { connect } from '../../utils/index';
import types from '../../utils/vueTypes';

const { addComponent, removeComponent, watchComponent, updateQuery, setQueryListener } = Actions;

const { isEqual, checkValueChange, getClassName } = helper;
const MultiRange = {
	name: 'MultiRange',
	data() {
		this.state = {
			currentValue: [],
			showModal: false,
			selectedValues: {},
		};
		this.type = 'range';
		this.locked = false;
		return this.state;
	},
	props: {
		beforeValueChange: types.func,
		className: VueTypes.string.def(''),
		componentId: types.stringRequired,
		customQuery: types.func,
		data: types.data,
		dataField: types.stringRequired,
		defaultSelected: types.string,
		filterLabel: types.string,
		innerClass: types.style,
		react: types.react,
		showFilter: VueTypes.bool.def(true),
		showCheckbox: VueTypes.bool.def(true),
		title: types.title,
		URLParams: VueTypes.bool.def(false),
	},
	methods: {
		setReact(props) {
			if (props.react) {
				this.watchComponent(props.componentId, props.react);
			}
		},
		handleClick(e) {
			this.selectItem(e.target.value);
		},
		selectItem(item, isDefaultValue = false, props = this.$props) {
			// ignore state updates when component is locked
			if (props.beforeValueChange && this.locked) {
				return;
			}
			this.locked = true;
			let { currentValue, selectedValues } = this;

			if (!item) {
				currentValue = [];
				selectedValues = {};
			} else if (isDefaultValue) {
				currentValue = MultiRange.parseValue(item, props);
				currentValue.forEach(value => {
					selectedValues = { ...selectedValues, [value.label]: true };
				});
			} else if (selectedValues[item]) {
				currentValue = currentValue.filter(value => value.label !== item);
				const { [item]: del, ...selected } = selectedValues;
				selectedValues = selected;
			} else {
				const currentItem = props.data.find(value => item === value.label);
				currentValue = [...currentValue, currentItem];
				selectedValues = { ...selectedValues, [item]: true };
			}

			const performUpdate = () => {
				this.currentValue = currentValue;
				this.selectedValues = selectedValues;
				this.updateQueryHandler(currentValue, props);
				this.locked = false;
				this.$emit('valueChange', Object.keys(selectedValues));
			};

			checkValueChange(
				props.componentId,
				currentValue,
				props.beforeValueChange,
				performUpdate,
			);
		},

		updateQueryHandler(value, props) {
			const query = props.customQuery || MultiRange.defaultQuery;
			this.updateQuery({
				componentId: props.componentId,
				query: query(value, props),
				value,
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: props.URLParams,
				componentType: 'MULTIRANGE',
			});
		},
	},

	watch: {
		react() {
			this.setReact(this.$props);
		},
		dataField() {
			this.updateQueryHandler(this.$data.currentValue, this.$props);
		},
		defaultSelected(newVal) {
			this.selectItem(newVal);
		},
		selectedValue(newVal) {
			if (!isEqual(this.$data.currentValue, newVal)) {
				this.selectItem(newVal);
			}
		},
	},

	created() {
		const onQueryChange = (...args) => {
			this.$emit('queryChange', ...args);
		};
		this.setQueryListener(this.$props.componentId, onQueryChange, null);
	},

	beforeMount() {
		this.addComponent(this.$props.componentId);
		this.setReact(this.$props);
		if (this.selectedValue) {
			this.selectItem(this.selectedValue, true);
		} else if (this.$props.defaultSelected) {
			this.selectItem(this.$props.defaultSelected, true);
		}
	},

	beforeDestroy() {
		this.removeComponent(this.$props.componentId);
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

	if (values && values.length) {
		const query = {
			bool: {
				should: generateRangeQuery(props.dataField, values),
				minimum_should_match: 1,
				boost: 1.0,
			},
		};
		return query;
	}
	return null;
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
	updateQuery,
	watchComponent,
	setQueryListener,
};

const RangeConnected = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(MultiRange);

MultiRange.install = function(Vue) {
	Vue.component(MultiRange.name, RangeConnected);
};
export default MultiRange;
