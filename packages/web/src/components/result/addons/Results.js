import React from 'react';
import { getClassName } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import ImpressionTracker from './ImpressionTracker';

const Results = ({
	filteredResults,
	hasCustomRender,
	listClass,
	innerClass,
	renderItem,
	triggerClickAnalytics,
	base,
	analytics,
	getComponent,
}) => {
	const resultElement = () =>
		(hasCustomRender ? (
			getComponent()
		) : (
			<div className={`${listClass} ${getClassName(innerClass, 'list')}`}>
				{filteredResults.map((item, index) =>
					renderItem(item, () => {
						triggerClickAnalytics(base + index);
					}),
				)}
			</div>
		));
	// If analytics is set to true then render with impression tracker
	if (analytics) {
		return <ImpressionTracker hits={filteredResults}>{resultElement()}</ImpressionTracker>;
	}
	return resultElement();
};

Results.propTypes = {
	hasCustomRender: types.boolRequired,
	innerClass: types.style,
	renderItem: types.func,
	base: types.number,
	getComponent: types.func,
	listClass: types.string,
	filteredResults: types.hits,
	triggerClickAnalytics: types.func,
	analytics: types.bool,
};

export default Results;
