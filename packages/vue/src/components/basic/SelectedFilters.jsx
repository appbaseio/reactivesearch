import { Actions, helper } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import types from '../../utils/vueTypes';
import Button, { filters } from '../../styles/Button';
import Container from '../../styles/Container';
import Title from '../../styles/Title';
import { connect } from '../../utils/index';

const { setValue, clearValues } = Actions;
const { getClassName } = helper;

const SelectedFilters = {
	name: 'SelectedFilters',
	props: {
		className: VueTypes.string.def(''),
		clearAllLabel: VueTypes.string.def('Clear All'),
		innerClass: types.style,
		showClearAll: VueTypes.bool.def(true),
		title: types.title
	},
	inject: ['theme'],
	render() {
		if (this.$scopedSlots.default) {
			return this.$scopedSlots.default(this.$props);
		}
		const filtersToRender = this.renderFilters();
		const hasValues = !!filtersToRender.length;
		return (
			<Container
				class={`${filters(this.theme)} ${this.$props.className || ''}`}
			>
				{this.$props.title
					&& hasValues && (
					<Title class={getClassName(this.$props.innerClass, 'title') || ''}>
						{this.$props.title}
					</Title>
				)}
				{filtersToRender}
				{this.$props.showClearAll && hasValues ? (
					<Button
						class={getClassName(this.$props.innerClass, 'button') || ''}
						{...{
							on: {
								click: this.clearValues
							}
						}}
					>
						{this.$props.clearAllLabel}
					</Button>
				) : null}
			</Container>
		);
	},

	methods: {
		remove(component, value = null) {
			this.setValue(component, null);
			this.$emit('clear', component, value);
		},
		clearValues() {
			this.clearValuesAction();
			this.$emit('clear', null);
		},

		renderValue(value, isArray) {
			if (isArray && value.length) {
				const arrayToRender = value.map(item => this.renderValue(item));
				return arrayToRender.join(', ');
			}
			if (value && typeof value === 'object') {
				// TODO: support for NestedList
				let label
					= (typeof value.label === 'string' ? value.label : value.value)
					|| value.key
					|| value.distance
					|| null;

				if (value.location) {
					label = `${value.location} - ${label}`;
				}

				return label;
			}

			return value;
		},

		renderFilters() {
			const { selectedValues } = this;
			return Object.keys(selectedValues)
				.filter(
					id => this.components.includes(id) && selectedValues[id].showFilter
				)
				.map((component, index) => {
					const { label, value } = selectedValues[component];
					const isArray = Array.isArray(value);

					if (label && ((isArray && value.length) || (!isArray && value))) {
						const valueToRender = this.renderValue(value, isArray);
						return (
							<Button
								class={getClassName(this.$props.innerClass, 'button') || ''}
								key={`${component}-${index + 1}`}
								{...{
									on: {
										click: () => this.remove(component, value)
									}
								}}
							>
								<span>
									{selectedValues[component].label}: {valueToRender}
								</span>
								<span>&#x2715;</span>
							</Button>
						);
					}

					return null;
				})
				.filter(Boolean);
		}
	}
};

const mapStateToProps = state => ({
	components: state.components,
	selectedValues: state.selectedValues
});

const mapDispatchtoProps = {
	clearValuesAction: clearValues,
	setValue
};

const RcConnected = connect(
	mapStateToProps,
	mapDispatchtoProps
)(SelectedFilters);

SelectedFilters.install = function(Vue) {
	Vue.component(SelectedFilters.name, RcConnected);
};
export default SelectedFilters;
