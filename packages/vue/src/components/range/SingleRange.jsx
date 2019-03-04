import { Actions, helper } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import Title from '../../styles/Title';
import Container from '../../styles/Container';
import { UL, Radio } from '../../styles/FormControlList';
import { connect } from '../../utils/index';
import types from '../../utils/vueTypes';

const { addComponent, removeComponent, watchComponent, updateQuery, setQueryListener } = Actions;
const { isEqual, checkValueChange, getClassName } = helper;

const SingleRange = {
	name: 'SingleRange',
	data() {
		this.__state = {
			currentValue: null,
		};
		this.type = 'range';
		this.locked = false;
		return this.__state;
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
		showRadio: VueTypes.bool.def(true),
		title: types.title,
		URLParams: VueTypes.bool.def(false),
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
			this.setValue(this.selectedValue);
		} else if (this.$props.defaultSelected) {
			this.setValue(this.$props.defaultSelected);
		}
	},

	beforeDestroy() {
		this.removeComponent(this.$props.componentId);
	},
	watch: {
		react() {
			this.setReact(this.$props);
		},
		dataField() {
			this.updateQueryHandler(this.$data.currentValue, this.$props);
		},
		defaultSelected(newVal) {
			this.setValue(newVal);
		},
		selectedValue(newVal) {
			if (!isEqual(this.$data.currentValue, newVal)) {
				this.setValue(newVal);
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
									onClick={this.handleClick}
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
		setReact(props) {
			if (props.react) {
				props.watchComponent(props.componentId, props.react);
			}
		},

		setValue(value, props = this.$props) {
			// ignore state updates when component is locked
			if (props.beforeValueChange && this.locked) {
				return;
			}

			this.locked = true;
			const currentValue = SingleRange.parseValue(value, props);

			const performUpdate = () => {
				this.currentValue = currentValue;
				this.updateQueryHandler(currentValue, props);
				this.locked = false;
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
			const query = props.customQuery || SingleRange.defaultQuery;
			this.updateQuery({
				componentId: props.componentId,
				query: query(value, props),
				value,
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: props.URLParams,
				componentType: 'SINGLERANGE',
			});
		},

		handleClick(e) {
			this.setValue(e.target.value);
		},
	},
};

SingleRange.parseValue = (value, props) => props.data.find(item => item.label === value) || null;

SingleRange.defaultQuery = (value, props) => {
	if (value) {
		return {
			range: {
				[props.dataField]: {
					gte: value.start,
					lte: value.end,
					boost: 2.0,
				},
			},
		};
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
)(SingleRange);

SingleRange.install = function(Vue) {
	Vue.component(SingleRange.name, RangeConnected);
};
export default SingleRange;
