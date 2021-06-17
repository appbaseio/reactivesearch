import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import { Actions, helper } from '@appbaseio/reactivecore';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import VueTypes from 'vue-types';
import { connect, getValidPropsKeys, getCamelCase } from '../../utils/index';

const {
	addComponent,
	removeComponent,
	watchComponent,
	setQueryListener,
	setComponentProps,
	updateComponentProps,
} = Actions;

const {
	pushToAndClause,
	checkPropChange,
	checkSomePropChange,
} = helper;

/**
 * ComponentWrapper component is a wrapper component for each ReactiveSearch component
 * which is responsible for following tasks:
 * 1. Register a component on mount
 * 2. Set query listener
 * 3. Set react prop
 * 4. Follow the [1-3] for the internal component if needed
 * 5. Update component props in redux store
 * 6. Unregister the component on un-mount
 * Note: All components are using that except the DynamicRangeSlider
 */
const ComponentWrapper = (
	component,
	options = {
		componentType: null,
		internalComponent: false,
	},
) => ({
	name: 'ComponentWrapper',
	props: {
		destroyOnUnmount: VueTypes.bool.def(true)
	},
	created() {
		// clone the props for component it is needed because attrs gets changed on time
		const componentProps = { ...this.$attrs };
		// handle kebab case for props
		const parsedProps = {};
		Object.keys(componentProps).forEach(key => {
			parsedProps[getCamelCase(key)] = componentProps[key];
		});
		this.componentProps = parsedProps;
		this.componentId = this.componentProps.componentId;
		this.react = this.componentProps.react;
	},
	beforeMount() {
		let components = [];
		if(this.$$store) {
			({components} = this.$$store.getState())
		}
		// Register a component only when `destroyOnUnmount` is `true`
		// or component is not present in store
		if(this.destroyOnUnmount
			|| components.indexOf(this.componentProps.componentId) === -1) {
			// Register  component
			this.addComponent(this.componentId);
			const onQueryChange = (...args) => {
				this.$emit('queryChange', ...args);
				this.$emit('query-change', ...args);
			};
			const onError = e => {
				this.$emit('error', e);
			};
			this.setQueryListener(this.componentId, onQueryChange, onError);
			// Update props in store
			this.setComponentProps(this.componentId, this.componentProps, options.componentType);

			// if default query prop is defined and component is reactive component then register the internal component
			if (
				options.internalComponent
			|| (this.componentProps.defaultQuery
				&& options.componentType === componentTypes.reactiveComponent)
			) {
				this.internalComponent = getInternalComponentID(this.componentId);
			}
			// Register internal component
			if (this.internalComponent) {
				this.addComponent(this.internalComponent);
				this.setComponentProps(
					this.internalComponent,
					this.componentProps,
					options.componentType,
				);
			}
		}
	},
	mounted() {
		if (this.internalComponent) {
			// Watch component after rendering the component to avoid the un-necessary calls
			this.setReact(this.componentProps);
		}
	},
	beforeDestroy() {
		if(this.destroyOnUnmount) {
			// Unregister components
			this.removeComponent(this.componentId);
			if (this.internalComponent) {
				this.removeComponent(this.internalComponent);
			}
		}
	},
	watch: {
		$attrs: {
			deep: true,
			handler(newVal) {
				const propsKeys = getValidPropsKeys(newVal);
				checkSomePropChange(newVal, this.savedComponentProps, propsKeys, () => {
					this.updateComponentProps(this.componentId, newVal, options.componentType);
					this.updateComponentProps(
						this.internalComponent,
						newVal,
						options.componentType,
					);
				});
			},
		},
		react(newVal, oldVal) {
			checkPropChange(newVal, oldVal, () => this.setReact(this.componentProps));
		},
	},
	methods: {
		setReact(props) {
			const { react } = props;
			if (this.internalComponent) {
				if (react) {
					const newReact = pushToAndClause(react, this.internalComponent);
					this.watchComponent(props.componentId, newReact);
				} else {
					this.watchComponent(props.componentId, {
						and: this.internalComponent,
					});
				}
			} else {
				this.watchComponent(props.componentId, react);
			}
		},
	},
	render(h) {
		return h(component, {
			attrs: this.$attrs,
			on: this.$listeners,
			scopedSlots: this.$scopedSlots,
			slots: this.$slots,
		});
	},
});
const mapStateToProps = (state, props) => ({
	savedComponentProps: state.props[props.componentId],
});

const mapDispatchToProps = {
	addComponent,
	removeComponent,
	setQueryListener,
	watchComponent,
	setComponentProps,
	updateComponentProps,
};
export default (component, options = {}) =>
	connect(mapStateToProps, mapDispatchToProps)(ComponentWrapper(component, options));
