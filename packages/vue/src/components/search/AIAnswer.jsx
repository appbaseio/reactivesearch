import VueTypes from 'vue-types';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { defineComponent } from 'vue';
import { fetchAIResponse } from '@appbaseio/reactivecore/lib/actions/query';
import { getClassName } from '@appbaseio/reactivecore/lib/utils/helper';
import { connect, hasCustomRenderer } from '../../utils/index';
import types from '../../utils/vueTypes';
import ComponentWrapper from '../basic/ComponentWrapper.jsx';
import PreferencesConsumer from '../basic/PreferencesConsumer.jsx';
import { Chatbox } from '../../styles/AIAnswer';
import Title from '../../styles/Title';

const AIAnswer = defineComponent({
	name: 'AIAnswer',
	data() {
		const props = this.$props;
		this.__state = {
			messages: [],
		};
		this.internalComponent = `${props.componentId}__internal`;
		return this.__state;
	},
	inject: {
		theme: {
			from: 'theme_reactivesearch',
		},
	},
	created() {},
	computed: {
		hasCustomRenderer() {
			return hasCustomRenderer(this);
		},
	},
	props: {
		componentId: types.string.isRequired,
		showVoiceInput: VueTypes.bool.def(false),
		showIcon: VueTypes.bool.def(true),
		onData: types.func,
		react: types.react,
		AIConfig: types.AIConfig,
		iconPosition: types.iconPosition.def('left'),
		themePreset: types.themePreset,
		theme: types.style,
		icon: types.children,
		iconURL: types.string,
		renderMic: types.func,
		getMicInstance: types.func,
		innerClass: types.style,
		placeholder: types.string.def('Ask a question'),
		title: types.title,
		AIResponse: types.componentObject,
		isAIResponseLoading: types.bool,
		AIResponseError: types.componentObject,
		getAIResponse: types.func.isRequired,
		enterButton: types.bool,
		renderEnterButton: types.title,
		showInput: types.bool.def(true),
		clearSessionOnDestroy: types.bool.def(true),
		rawData: types.rawData,
		render: types.func,
		onError: types.func,
		renderError: types.title,
		isLoading: types.boolRequired,
	},
	mounted() {},
	watch: {},
	methods: {},
	render() {
		return (
			<Chatbox>
				{this.$props.title && (
					<Title class={getClassName(this.$props.innerClass, 'title') || ''}>
						{this.$props.title}
					</Title>
				)}
			</Chatbox>
		);
	},
});

AIAnswer.hasInternalComponent = () => true;

AIAnswer.defQuery = (value, props) => {
	let finalQuery = null;

	finalQuery = {
		bool: {
			should: AIAnswer.shouldQuery(value, props),
			minimum_should_match: '1',
		},
	};

	if (finalQuery && props.nestedField) {
		return {
			query: {
				nested: {
					path: props.nestedField,
					query: finalQuery,
				},
			},
		};
	}

	return finalQuery;
};
AIAnswer.shouldQuery = (value, props) => ({
	query: {
		queryFormat: props.queryFormat,
		dataField: props.dataField,
		value,
		nestedField: props.nestedField,
		queryString: props.queryString,
		searchOperators: props.searchOperators,
	},
});

const mapStateToProps = (state, props) => ({
	AIResponse:
		state.AIResponses[props.componentId] && state.AIResponses[props.componentId].response,
	isAIResponseLoading:
		state.AIResponses[props.componentId] && state.AIResponses[props.componentId].isLoading,
	AIResponseError:
		state.AIResponses[props.componentId] && state.AIResponses[props.componentId].error,
	rawData: state.rawData[props.componentId],
	themePreset: state.config.themePreset,
	isLoading: state.isLoading[props.componentId] || false,
});
const mapDispatchToProps = {
	getAIResponse: fetchAIResponse,
};
export const AIConnected = PreferencesConsumer(
	ComponentWrapper(connect(mapStateToProps, mapDispatchToProps)(AIAnswer), {
		componentType: componentTypes.AIAnswer,
		internalComponent: true,
	}),
);
AIConnected.name = AIAnswer.name;

AIConnected.defQuery = AIAnswer.defQuery;
AIConnected.shouldQuery = AIAnswer.shouldQuery;
AIConnected.hasInternalComponent = AIAnswer.hasInternalComponent;

AIConnected.install = function (Vue) {
	Vue.component(AIConnected.name, AIConnected);
};
// Add componentType for SSR
AIConnected.componentType = componentTypes.AIAnswer;

export default AIConnected;
