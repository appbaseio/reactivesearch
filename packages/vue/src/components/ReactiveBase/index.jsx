import configureStore from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import Appbase from 'appbase-js';
import Provider from '../Provider';
import { composeThemeObject } from '../../utils/index';
import types from '../../utils/vueTypes';
import URLParamsProvider from '../URLParamsProvider.jsx';
import getTheme from '../../styles/theme';

const URLSearchParams = require('url-search-params');

const ReactiveBase = {
  name: 'ReactiveBase',
  data() {
    const props = this.$props;
    this.state = {
      key: '__REACTIVE_BASE__',
    };
    this.setStore(props);
    return this.state;
  },
  props: {
    app: types.stringRequired,
    analytics: VueTypes.bool.def(false),
    credentials: types.string,
    headers: types.headers,
    queryParams: types.string,
    theme: VueTypes.object.def({}),
    themePreset: VueTypes.string.def('light'),
    type: types.string,
    url: types.string,
    beforeSend: types.func,
    mapKey: types.string,
    className: types.string,
    initialState: VueTypes.object.def({}),
  },
  provide() {
    return {
      theme: composeThemeObject(getTheme(this.$props.themePreset), this.$props.theme),
      store: this.store,
    };
  },
  methods: {
    setStore(props) {
      const credentials = props.url && props.url.trim() !== '' && !props.credentials ? null : props.credentials;

      const config = {
        url: props.url && props.url.trim() !== '' ? props.url : 'https://scalr.api.appbase.io',
        app: props.app,
        credentials,
        type: props.type ? props.type : '*',
        beforeSend: props.beforeSend,
        analytics: props.analytics,
      };

      let queryParams = '';
      if (typeof window !== 'undefined') {
        queryParams = window.location.search;
      } else {
        queryParams = props.queryParams || '';
      }

      this.params = new URLSearchParams(queryParams);
      let selectedValues = {};

      try {
        Array.from(this.params.keys()).forEach((key) => {
          selectedValues = {
            ...selectedValues,
            [key]: { value: JSON.parse(this.params.get(key)) },
          };
        });
      } catch (e) {
        selectedValues = {};
      }

      const { headers = {}, themePreset } = props;
      const appbaseRef = Appbase(config);

      const initialState = {
        config: { ...config, mapKey: props.mapKey, themePreset },
        appbaseRef,
        selectedValues,
        headers,
        ...props.initialState,
      };
      this.store = configureStore(initialState);
    },
  },
  render() {
    const children = this.$slots.default;
    const { headers, style, className } = this.$props;
    return (
      <Provider store={this.store}>
        <URLParamsProvider
          params={this.params}
          headers={headers}
          style={style}
          className={className}
        >
          {children}
        </URLParamsProvider>
      </Provider>
    );
  },
};

ReactiveBase.install = function (Vue) {
  Vue.component(ReactiveBase.name, ReactiveBase);
};

export default ReactiveBase;
