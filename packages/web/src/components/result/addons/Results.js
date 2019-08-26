import React from 'react';
import { getClassName, isEqual } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

class Results extends React.Component {
	shouldComponentUpdate(nextProps) {
		/*
			Use shouldComponentUpdate because PureComponent uses shallow comparison of objects.
			If props contain complex data structures, it may produce false-negatives for
			deeper differences.
		*/

		return !isEqual(nextProps.filteredResults, this.props.filteredResults);
	}

	render() {
		if (this.props.hasCustomRender) {
			return this.props.getComponent();
		}

		return (
			<div
				className={`${this.props.listClass} ${getClassName(this.props.innerClass, 'list')}`}
			>
				{this.props.filteredResults.map((item, index) =>
					this.props.renderItem(item, () => {
						this.props.triggerClickAnalytics(this.props.base + index);
					}),
				)}
			</div>
		);
	}
}

Results.propTypes = {
	hasCustomRender: types.boolRequired,
	innerClass: types.style,
	renderItem: types.func,
	base: types.number,
	getComponent: types.func,
	listClass: types.string,
	filteredResults: types.hits,
	triggerClickAnalytics: types.func,
};

export default Results;
