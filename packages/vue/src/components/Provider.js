export default {
	name: 'Provider',
	props: {
		store: {
			type: Object,
			required: true,
			validator(store) {
				if (!store.dispatch && !store.subscribe && !store.getState) {
					throw new Error(
						'[reactivesearch-vue] - store provided is not a valid redux store'
					);
				}
				return true;
			}
		}
	},
	provide() {
		return {
			$$store: this.store
		};
	},
	render(h) {
		if (this.$slots.default.length > 1) {
			return h('div', this.$slots.default);
		}
		return this.$slots.default[0];
	}
};
