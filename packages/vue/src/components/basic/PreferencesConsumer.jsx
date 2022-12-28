import { getCamelCase } from '../../utils/index';

const deepValue = (o, p) => p.split('.').reduce((a, v) => (a ? a[v] : null), o);
/**
 * PreferencesConsumer reads the preferences from SearchPreferencesContext
 * and set the props from preferences to the component
 *
 */
const PreferencesConsumer = (component) => ({
	name: 'PreferencesConsumer',
	inject: {
		$searchPreferences: {
			default: null,
		},
	},
	render(h) {
		const userProps = Object.keys(this.$attrs).reduce(
			(result, key) => ({ ...result, [getCamelCase(key)]: this.$attrs[key] }),
			{},
		);
		const context = this.$searchPreferences;
		if (!userProps || !userProps.componentId) {
			throw Error('ReactiveSearch: componentId is required');
		}
		const { componentId } = userProps;
		const { preferencesPath } = userProps;
		let preferences;
		if (context) {
			if (preferencesPath) {
				// read preferences from path
				preferences = deepValue(context, preferencesPath);
			} else {
				preferences = deepValue(context, ['componentSettings', componentId].join('.'));
				// read preferences from componentSettings
			}
		}
		// Retrieve component specific preferences
		let componentProps = userProps;
		if (preferences) {
			if (preferences.rsConfig) {
				componentProps = { ...preferences.rsConfig, ...componentProps };
			} else {
				componentProps = { ...preferences, ...componentProps };
			}
			if (preferences.enabled !== undefined && !preferences.enabled) {
				return null;
			}
		}
		// Parse component props
		Object.keys(componentProps).forEach((p) => {
			if (typeof componentProps[p] === 'string') {
				if (['defaultQuery', 'customQuery', 'setOption'].includes(p)) {
					// eslint-disable-next-line
					componentProps[p] = eval(componentProps[p]);
				}
			}
		});
		return h(component, {
			attrs: componentProps,
			on: this.$attrs,
			scopedSlots: this.$slots,
			slots: this.$slots,
		});
	},
});

export default PreferencesConsumer;
