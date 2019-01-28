import { helper } from '@appbaseio/reactivecore';
import { noSuggestions } from '../../../styles/Input';
import types from '../../../utils/vueTypes';

const { getClassName } = helper;

const SuggestionWrapper = {
	name: 'SuggestionWrapper',
	props: {
		innerClassName: types.string,
		themePreset: types.themePreset,
		innerClass: types.style,
	},
	render() {
		const { themePreset, innerClass, innerClassName } = this.$props;
		return (
			<div
				class={`${noSuggestions(themePreset)} ${getClassName(
					innerClass,
					innerClassName || '',
				)}`}
			>
				<li>{this.$scopedSlots.default()}</li>
			</div>
		);
	},
};

export default SuggestionWrapper;
