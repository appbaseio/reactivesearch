import React from 'react';

import PropTypes from 'prop-types';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { HierarchicalMenuList } from '../../../styles/TreeList';
import HierarchicalMenuListItemComponent from './HierarchicalMenuListItemComponent';

function HierarchicalMenuComponent({
	listArray,
	parentPath = '',
	isExpanded = false,
	listItemProps,
}) {
	if (!Array.isArray(listArray) || listArray.length === 0) {
		return null;
	}

	return (
		<HierarchicalMenuList className={`${isExpanded ? '--open' : ''}`} isSelected={isExpanded}>
			{listArray.map(listItem => (
				<HierarchicalMenuListItemComponent
					key={`${parentPath}__${JSON.stringify(listItem)}`}
					parentPath={parentPath}
					listItem={listItem}
					{...listItemProps}
				/>
			))}
		</HierarchicalMenuList>
	);
}

HierarchicalMenuComponent.propTypes = {
	listArray: PropTypes.arrayOf(types.rawData), // array of objects
	parentPath: types.string,
	isExpanded: types.bool,
	listItemProps: types.rawData,
};
export default HierarchicalMenuComponent;
