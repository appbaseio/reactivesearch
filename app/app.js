import {NestedList} from './sensors/NestedList';
import reactivebase from '@appbaseio/reactivebase';

var combineObj = {
	NestedList: NestedList
};

for(let component in reactivebase) {
	combineObj[component] = reactivebase[component];
}

module.exports = combineObj;
