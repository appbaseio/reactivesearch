import React from 'react';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import PreferencesConsumer from '../basic/PreferencesConsumer';
import SingleList from '../list/SingleList';
import ReactiveList from '../result/ReactiveList';
import SearchBox from '../search/SearchBox';
import MultiList from '../list/MultiList';
import SingleDataList from '../list/SingleDataList';
import TabDataList from '../list/TabDataList';
import MultiDataList from '../list/MultiDataList';
import SingleDropdownList from '../list/SingleDropdownList';
import MultiDropdownList from '../list/MultiDropdownList';
import SingleDropdownRange from '../range/SingleDropdownRange';
import MultiDropdownRange from '../range/MultiDropdownRange';
import NumberBox from './NumberBox';
import TagCloud from '../list/TagCloud';
import ToggleButton from '../list/ToggleButton';
import DatePicker from '../date/DatePicker';
import DateRange from '../date/DateRange';
import SingleRange from '../range/SingleRange';
import MultiRange from '../range/MultiRange';
import RangeSlider from '../range/RangeSlider';
import DynamicRangeSlider from '../range/DynamicRangeSlider';
import RatingsFilter from '../range/RatingsFilter';
import RangeInput from '../range/RangeInput';
import ReactiveChart from '../chart/ReactiveChart';
import TreeList from '../list/TreeList';
import ReactiveComponent from './ReactiveComponent';

const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props}>
		{(preferenceProps) => {
			switch (preferenceProps.componentType) {
				case componentTypes.treeList:
					return <TreeList {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.reactiveList:
					return <ReactiveList {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.searchBox:
					return <SearchBox {...preferenceProps} myForwardedRef={ref} />;
				// list components
				case componentTypes.singleList:
					return <SingleList {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.multiList:
					return <MultiList {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.singleDataList:
					return <SingleDataList {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.tabDataList:
					return <TabDataList {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.multiDataList:
					return <MultiDataList {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.singleDropdownList:
					return <SingleDropdownList {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.multiDropdownList:
					return <MultiDropdownList {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.singleDropdownRange:
					return <SingleDropdownRange {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.multiDropdownRange:
					return <MultiDropdownRange {...preferenceProps} myForwardedRef={ref} />;
				// basic components
				case componentTypes.numberBox:
					return <NumberBox {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.tagCloud:
					return <TagCloud {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.toggleButton:
					return <ToggleButton {...preferenceProps} myForwardedRef={ref} />;
				// range components
				case componentTypes.datePicker:
					return <DatePicker {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.dateRange:
					return <DateRange {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.dynamicRangeSlider:
					return <DynamicRangeSlider {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.singleRange:
					return <SingleRange {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.multiRange:
					return <MultiRange {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.rangeSlider:
					return <RangeSlider {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.ratingsFilter:
					return <RatingsFilter {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.rangeInput:
					return <RangeInput {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.reactiveChart:
					return <ReactiveChart {...preferenceProps} myForwardedRef={ref} />;
				case componentTypes.reactiveComponent:
				default:
					return <ReactiveComponent {...preferenceProps} myForwardedRef={ref} />;
			}
		}}
	</PreferencesConsumer>
));

ForwardRefComponent.displayName = 'ReactiveComponentPrivate';
export default ForwardRefComponent;
