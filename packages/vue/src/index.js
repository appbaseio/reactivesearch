import ReactiveList from './components/result/ReactiveList.jsx';
import ReactiveBase from './components/ReactiveBase/index.jsx';
import DataSearch from './components/search/DataSearch.jsx';
import SingleList from './components/list/SingleList.jsx';
import MultiList from './components/list/MultiList.jsx';
import SingleDropdownList from './components/list/SingleDropdownList.jsx';
import MultiDropdownList from './components/list/MultiDropdownList.jsx';
import ReactiveComponent from './components/basic/ReactiveComponent.jsx';
import SelectedFilters from './components/basic/SelectedFilters.jsx';
import SingleRange from './components/range/SingleRange.jsx';
import MultiRange from './components/range/MultiRange.jsx';
import ResultCard from './components/result/ResultCard.jsx';
import ResultList from './components/result/ResultList.jsx';
import RangeSlider from './components/range/RangeSlider.jsx'
import version from './components/Version/index';

const components = [
	ReactiveList,
	ResultCard,
	ResultList,
	ReactiveBase,
	DataSearch,
	SingleList,
	MultiList,
	SingleRange,
	MultiRange,
	RangeSlider,
	ReactiveComponent,
	SelectedFilters,
	SingleDropdownList,
	MultiDropdownList,
];

const install = function(Vue) {
	components.map(component => {
		Vue.use(component);
		return null;
	});
};

if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue);
}

export {
	version,
	install,
	ReactiveList,
	ResultCard,
	ResultList,
	ReactiveBase,
	DataSearch,
	SingleList,
	MultiList,
	SingleRange,
	MultiRange,
  	RangeSlider,
	ReactiveComponent,
	SelectedFilters,
	SingleDropdownList,
	MultiDropdownList
};

export default {
	version,
	install
};
