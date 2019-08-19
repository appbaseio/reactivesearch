import React from 'react';
import { getClassName, isEqual } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

const Results = (props) => {
	if (props.hasCustomRender) {
		return props.getComponent();
	}

	return (
		<div className={`${props.listClass} ${getClassName(props.innerClass, 'list')}`}>
			{props.filteredResults.map((item, index) =>
				props.renderItem(item, () => {
					props.triggerClickAnalytics(props.base + index);
				}),
			)}
		</div>
	);
};

Results.propTypes = {
	hasCustomRender: types.boolRequired,
	innerClass: types.style,
	renderItem: types.func,
	base: types.number,
	getComponent: types.func,
	listClass: types.string,
	triggerClickAnalytics: types.func,
};

function areEqual(prevProps, nextProps) {
	return isEqual(prevProps, nextProps);
}

export default React.memo(Results, areEqual);
