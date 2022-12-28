import { Actions, helper } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import types from '../../utils/vueTypes';
import Button, { filters } from '../../styles/Button';
import Container from '../../styles/Container';
import Title from '../../styles/Title';
import { connect, decodeHtml } from '../../utils/index';

const { setValue, clearValues, resetValuesToDefault } = Actions;
const { getClassName, handleA11yAction } = helper;

const SelectedFilters = {
	name: 'SelectedFilters',
	props: {
		className: VueTypes.string.def(''),
		clearAllLabel: VueTypes.string.def('Clear All'),
		innerClass: types.style,
		showClearAll: VueTypes.bool.def(true),
		title: types.title,
		resetToDefault: VueTypes.bool.def(false),
		clearAllBlacklistComponents: VueTypes.array,
		resetToValues: VueTypes.object,
	},
	inject: {
		theme: {
			from: 'theme_reactivesearch',
		},
	},
	render() {
		if (this.$slots.default) {
			return this.$slots.default({
				components: this.components,
				selectedValues: this.selectedValues,
				clearValues: this.clearValues,
				clearValue: this.clearValue,
				setValue: this.setValue,
				resetValuesToDefault: this.resetValuesToDefault,
			});
		}
		const filtersToRender = this.renderFilters();
		const hasValues = !!filtersToRender.length;
		return (
			<Container class={`${filters(this.theme)} ${this.$props.className || ''}`}>
				{this.$props.title && hasValues && (
					<Title class={getClassName(this.$props.innerClass, 'title') || ''}>
						{this.$props.title}
					</Title>
				)}
				{filtersToRender}
				{this.$props.showClearAll && hasValues && filtersToRender.length > 1 ? (
					<Button
						class={getClassName(this.$props.innerClass, 'button') || ''}
						{...{
							on: {
								click: this.clearValues,
								keypress: (event) =>
									handleA11yAction(event, () => this.clearValues()),
							},
						}}
						tabIndex="0"
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
			const { resetToDefault, resetToValues, clearAllBlacklistComponents } = this;
			if (resetToDefault) {
				this.resetValuesToDefault(clearAllBlacklistComponents);
			} else {
				this.clearValuesAction(resetToValues, clearAllBlacklistComponents);
			}
			this.$emit('clear', resetToValues);
		},
		clearValue(componentId) {
			const { resetToDefault, resetToValues } = this;
			if (resetToDefault) {
				this.resetValuesToDefault(
					this.components.filter((component) => component !== componentId),
				);
			} else {
				this.setValue(componentId, resetToValues?.[componentId] || null);
			}
			this.$emit('clear', resetToValues?.[componentId]);
		},
		renderValue(value, isArray) {
			if (isArray && value.length) {
				const arrayToRender = value.map((item) => this.renderValue(item));
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
		renderFilterButton(component, keyProp, handleRemove, label) {
			return (
				<Button
					class={getClassName(this.$props.innerClass, 'button') || ''}
					key={keyProp}
					{...{
						on: {
							click: handleRemove,
							keypress: (event) => handleA11yAction(event, handleRemove),
						},
					}}
					tabIndex="0"
				>
					<span>{label}</span>
					<span>&#x2715;</span>
				</Button>
			);
		},
		renderFilters() {
			const { selectedValues } = this;
			const filterComponents = Object.keys(selectedValues).filter(
				(id) => this.components.includes(id) && selectedValues[id].showFilter,
			);
			return filterComponents
				.map((component, index) => {
					const { label, value } = selectedValues[component];
					const isArray = Array.isArray(value);

					// default behaviour
					if (label && ((isArray && value.length) || (!isArray && value))) {
						const valueToRender = this.renderValue(value, isArray);
						return this.renderFilterButton(
							component,
							`${component}-${index + 1}`,
							() => this.remove(component, value),
							`${selectedValues[component].label}: ${decodeHtml(valueToRender)}`,
						);
					}

					return null;
				})
				.filter(Boolean);
		},
	},
	watch: {
		selectedValues(newVal) {
			this.$emit('change', newVal);
		},
	},
};

const mapStateToProps = (state) => ({
	components: state.components,
	selectedValues: state.selectedValues,
});

const mapDispatchtoProps = {
	clearValuesAction: clearValues,
	setValue,
	resetValuesToDefault,
};

const RcConnected = connect(mapStateToProps, mapDispatchtoProps)(SelectedFilters);
RcConnected.name = SelectedFilters.name;

RcConnected.install = function (Vue) {
	Vue.component(RcConnected.name, RcConnected);
};
export default RcConnected;
