import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { h } from 'vue';
import PreferencesConsumer from './PreferencesConsumer.jsx';
import { RLConnected as ReactiveList } from '../result/ReactiveList.jsx';
import { SBConnected as SearchBox } from '../search/SearchBox.jsx';
import { ListConnected as SingleList } from '../list/SingleList.jsx';
import { ListConnected as MultiList } from '../list/MultiList.jsx';
import { ListConnected as SingleDropdownList } from '../list/SingleDropdownList.jsx';
import { ListConnected as MultiDropdownList } from '../list/MultiDropdownList.jsx';
import { TBConnected as ToggleButton } from '../list/ToggleButton.jsx';
import { RangeConnected as DynamicRangeSlider } from '../range/DynamicRangeSlider.jsx';
import { RangeConnected as SingleRange } from '../range/SingleRange.jsx';
import { RangeConnected as MultiRange } from '../range/MultiRange.jsx';
import { RangeConnected as RangeSlider } from '../range/RangeSlider.jsx';
import { RangeConnected as RangeInput } from '../range/RangeInput.jsx';
import ReactiveComponent from './ReactiveComponent.jsx';

const RcConnected = PreferencesConsumer({
	name: 'RcConnected',
	render() {
		let component = ReactiveComponent;
		switch (this.$attrs.componentType) {
			case componentTypes.reactiveList:
				component = ReactiveList;
				break;
			case componentTypes.searchBox:
				component = SearchBox;
				break;
			// list components
			case componentTypes.singleList:
				component = SingleList;
				break;
			case componentTypes.multiList:
				component = MultiList;
				break;
			case componentTypes.singleDropdownList:
				component = SingleDropdownList;
				break;
			case componentTypes.multiDropdownList:
				component = MultiDropdownList;
				break;
			// basic components
			case componentTypes.toggleButton:
				component = ToggleButton;
				break;
			// range components
			case componentTypes.dynamicRangeSlider:
				component = DynamicRangeSlider;
				break;
			case componentTypes.singleRange:
				component = SingleRange;
				break;
			case componentTypes.multiRange:
				component = MultiRange;
				break;
			case componentTypes.rangeSlider:
				component = RangeSlider;
				break;
			case componentTypes.rangeInput:
				component = RangeInput;
				break;
			default:
		}
		return h(component, null, this.$slots);
	},
});
RcConnected.name = ReactiveComponent.name;
RcConnected.hasInternalComponent = ReactiveComponent.hasInternalComponent;
// Add componentType for SSR
RcConnected.componentType = componentTypes.reactiveComponent;
RcConnected.install = function (Vue) {
	Vue.component(RcConnected.name, RcConnected);
};
export default RcConnected;
