import types from '@appbaseio/reactivecore/lib/utils/types';
import VueTypes from 'vue-types';
import { HierarchicalMenuList } from '../../../styles/TreeList';
// eslint-disable-next-line import/no-cycle
import HierarchicalMenuListItemComponent from './HierarchicalMenuListItemComponent.jsx';

const HierarchicalMenuComponent = {
	name: 'HierarchicalMenuComponent',
	props: {
		listArray: VueTypes.arrayOf(VueTypes.object), // array of objects
		parentPath: VueTypes.string.def(''),
		isExpanded: VueTypes.bool.def(false),
		listItemProps: types.rawData,
	},
	render() {
		const { listArray, isExpanded, parentPath, listItemProps } = this.$props;

		if (!Array.isArray(listArray) || listArray.length === 0) {
			return null;
		}

		return (
			<HierarchicalMenuList class={`${isExpanded ? '--open' : ''}`} isSelected={isExpanded}>
				{listArray.map((listItem) => (
					<HierarchicalMenuListItemComponent
						key={`${parentPath}__${JSON.stringify(listItem)}`}
						parentPath={parentPath}
						listItem={listItem}
						{...listItemProps}
					/>
				))}
			</HierarchicalMenuList>
		);
	},
};

export default HierarchicalMenuComponent;
