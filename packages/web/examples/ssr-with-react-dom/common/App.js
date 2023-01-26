/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { ReactiveBase, SingleRange, ReactiveList } from '@appbaseio/reactivesearch';

const App = ({
	settings, store, singleRangeProps, reactiveListProps, contextCollector,
}) => (
	<ReactiveBase
		{...settings}
		initialState={store}
		{...(contextCollector ? { contextCollector } : {})}
	>
		<div className="row">
			<div className="col">
				<SingleRange {...singleRangeProps} />
			</div>

			<div className="col">
				<ReactiveList {...reactiveListProps} />
			</div>
		</div>
	</ReactiveBase>
);

App.propTypes = {
	settings: PropTypes.object,
	store: PropTypes.object,
	singleRangeProps: PropTypes.object,
	reactiveListProps: PropTypes.object,
	contextCollector: PropTypes.func,
};

export default App;
