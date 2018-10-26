import { Actions, vueTypes as types, helper } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import { connect } from '../utils/index';
import Base from '../styles/Base';

const URLSearchParams = require('url-search-params');

const { setHeaders, setValue } = Actions;
const { isEqual } = helper;

const URLParamsProvider = {
  name: 'URLParamsProvider',
  props: {
    headers: types.headers,
    params: VueTypes.instanceOf(URLSearchParams),
    className: types.string,
  },
  watch: {
    selectedValues(newVal, oldVal) {
      this.currentSelectedState = newVal;

      if (!isEqual(oldVal, newVal)) {
        const currentComponents = Object.keys(newVal);
        currentComponents.filter(component => newVal[component].URLParams).forEach((component) => {
          // prevents empty history pollution on initial load
          if (this.hasValidValue(oldVal[component]) || this.hasValidValue(newVal[component])) {
            if (newVal[component].URLParams) {
              this.setURL(component, this.getValue(newVal[component].value));
            } else {
              this.$props.params.delete(component);
              this.pushToHistory();
            }
          }
        }); // remove unmounted components

        Object.keys(oldVal)
          .filter(component => !currentComponents.includes(component))
          .forEach((component) => {
            this.$props.params.delete(component);
            this.pushToHistory();
          });

        if (!currentComponents.length) {
          Array.from(this.$props.params.keys()).forEach((item) => {
            this.$props.params.delete(item);
          });
          this.pushToHistory();
        }
      }
    },
    headers(newVal, oldVal) {
      if (!isEqual(oldVal, newVal)) {
        this.$data.setHeaders(newVal);
      }
    },
  },
  mounted() {
    this.currentSelectedState = this.selectedValues || {};
    if (window) {
      window.onpopstate = () => {
        let queryParams = window.location.search;
        queryParams = new URLSearchParams(queryParams);
        // remove inactive components from selectedValues
        const activeComponents = Array.from(queryParams.keys());
        Object.keys(this.currentSelectedState)
          .filter(item => !activeComponents.includes(item))
          .forEach((component) => {
            this.$data.setValue(component, null);
          }); // update active components in selectedValues

        Array.from(queryParams.entries()).forEach((item) => {
          this.$data.setValue(item[0], JSON.parse(item[1]));
        });
      };
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
      if (
        !value ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0)
      ) {
        this.$props.params.delete(component);
        this.pushToHistory();
      } else {
        const data = JSON.stringify(this.getValue(value));

        if (data !== this.$props.params.get(component)) {
          this.$props.params.set(component, data);
          this.pushToHistory();
        }
      }
    },

    pushToHistory() {
      if (window.history.pushState) {
        const paramsSting = this.$props.params.toString()
          ? `?${this.$props.params.toString()}`
          : '';
        const base = window.location.href.split('?')[0];
        const newurl = `${base}${paramsSting}`;
        window.history.pushState(
          {
            path: newurl,
          },
          '',
          newurl,
        );
      }
    },
  },
};

const mapStateToProps = state => ({
  selectedValues: state.selectedValues,
});

const mapDispatchtoProps = {
  setHeaders,
  setValue,
};

URLParamsProvider.install = function (Vue) {
  Vue.component(URLParamsProvider.name, URLParamsProvider);
};
export default connect(
  mapStateToProps,
  mapDispatchtoProps,
)(URLParamsProvider);
