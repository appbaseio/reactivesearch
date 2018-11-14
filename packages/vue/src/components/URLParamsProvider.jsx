import { Actions, helper } from '@appbaseio/reactivecore';
import { connect } from '../utils/index';
import types from '../utils/vueTypes';
import Base from '../styles/Base';

const { setHeaders, setValue } = Actions;
const { isEqual } = helper;

const URLSearchParams = require('url-search-params');

const URLParamsProvider = {
	name: 'URLParamsProvider',
	props: {
		headers: types.headers,
		className: types.string
	},
	mounted() {
		window.onpopstate = () => {
			this.$params = new URLSearchParams(window.location.search);
			this.currentSelectedState = this.selectedValues || {};
			// remove inactive components from selectedValues
			const activeComponents = Array.from(this.$params.keys());
			Object.keys(this.currentSelectedState)
				.filter(item => !activeComponents.includes(item))
				.forEach(component => {
					this.setValue(component, null);
				}); // update active components in selectedValues

			Array.from(this.$params.entries()).forEach(item => {
				this.setValue(item[0], JSON.parse(item[1]));
			});
		};
	},

	watch: {
		selectedValues(newVal, oldVal) {
			this.currentSelectedState = newVal;
			if (!isEqual(oldVal, newVal)) {
				this.$params = new URLSearchParams(window.location.search);
				const currentComponents = Object.keys(newVal);
				const urlComponents = Array.from(this.$params.keys());
				currentComponents
					.filter(component => newVal[component].URLParams)
					.forEach(component => {
						// prevents empty history pollution on initial load
						if (
							this.hasValidValue(oldVal[component])
							|| this.hasValidValue(newVal[component])
						) {
							if (newVal[component].URLParams) {
								this.setURL(component, this.getValue(newVal[component].value));
							} else {
								this.$params.delete(component);
								this.pushToHistory();
							}
						} else if (
							!this.hasValidValue(newVal[component])
							&& urlComponents.includes(component)
						) {
							// doesn't have a valid value, but the url has a (stale) valid value set
							this.$params.delete(component);
							this.pushToHistory();
						}
					}); // remove unmounted components
				Object.keys(oldVal)
					.filter(component => !currentComponents.includes(component))
					.forEach(component => {
						this.$params.delete(component);
						this.pushToHistory();
					});
				if (!currentComponents.length) {
					Array.from(this.$params.keys()).forEach(item => {
						this.$params.delete(item);
					});
					this.pushToHistory();
				}
			}
		},
		headers(newVal, oldVal) {
			if (!isEqual(oldVal, newVal)) {
				this.setHeaders(newVal);
			}
		}
	},

	render() {
		const children = this.$slots.default;
		return <Base class={this.$props.className}>{children}</Base>;
	},
	methods: {
		hasValidValue(component) {
			if (!component) return false;
			if (Array.isArray(component.value)) return !!component.value.length;
			return !!component.value;
		},
		getValue(value) {
			if (Array.isArray(value) && value.length) {
				return value.map(item => this.getValue(item));
			}
			if (value && typeof value === 'object') {
				// TODO: support for NestedList
				if (value.location) return value;
				return value.label || value.key || null;
			}

			return value;
		},
		setURL(component, value) {
			this.$params = new URLSearchParams(window.location.search);

			if (
				!value
				|| (typeof value === 'string' && value.trim() === '')
				|| (Array.isArray(value) && value.length === 0)
			) {
				this.$params.delete(component);
				this.pushToHistory();
			} else {
				const data = JSON.stringify(this.getValue(value));

				if (data !== this.$params.get(component)) {
					this.$params.set(component, data);
					this.pushToHistory();
				}
			}
		},
		pushToHistory() {
			if (window.history.pushState) {
				const paramsSting = this.$params.toString()
					? `?${this.$params.toString()}`
					: '';
				const base = window.location.href.split('?')[0];
				const newurl = `${base}${paramsSting}`;
				window.history.pushState(
					{
						path: newurl
					},
					'',
					newurl
				);
			}
		}
	}
};

const mapStateToProps = state => ({
	selectedValues: state.selectedValues
});

const mapDispatchtoProps = {
	setHeaders,
	setValue
};

URLParamsProvider.install = function(Vue) {
	Vue.component(URLParamsProvider.name, URLParamsProvider);
};
export default connect(
	mapStateToProps,
	mapDispatchtoProps
)(URLParamsProvider);
