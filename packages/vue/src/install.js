import ReactiveList from './components/result/ReactiveList.jsx';
import ReactiveBase from './components/ReactiveBase/index.jsx';
import DataSearch from './components/search/DataSearch.jsx';
import SearchBox from './components/search/SearchBox.jsx';
import SingleList from './components/list/SingleList.jsx';
import MultiList from './components/list/MultiList.jsx';
import SingleDropdownList from './components/list/SingleDropdownList.jsx';
import MultiDropdownList from './components/list/MultiDropdownList.jsx';
import ToggleButton from './components/list/ToggleButton.jsx';
import ReactiveComponent from './components/basic/ReactiveComponent.jsx';
import SelectedFilters from './components/basic/SelectedFilters.jsx';
import SingleRange from './components/range/SingleRange.jsx';
import MultiRange from './components/range/MultiRange.jsx';
import ResultCard from './components/result/ResultCard.jsx';
import ResultList from './components/result/ResultList.jsx';
import RangeSlider from './components/range/RangeSlider.jsx';
import DynamicRangeSlider from './components/range/DynamicRangeSlider.jsx';
import StateProvider from './components/basic/StateProvider.jsx';
import RangeInput from './components/range/RangeInput.jsx';

const components = [
	ReactiveList,
	ResultCard,
	ResultList,
	ReactiveBase,
	DataSearch,
	SearchBox,
	SingleList,
	MultiList,
	SingleRange,
	MultiRange,
	RangeSlider,
	DynamicRangeSlider,
	ReactiveComponent,
	SelectedFilters,
	ToggleButton,
	SingleDropdownList,
	MultiDropdownList,
	StateProvider,
	RangeInput,
];

export default function (Vue) {
	components.map((component) => {
		Vue.use(component);
		return null;
	});
}
