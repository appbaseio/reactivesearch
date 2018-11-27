import React from 'react';
import PropTypes from 'prop-types';
import { ReactiveBase, SingleRange, ReactiveList } from '@appbaseio/reactivesearch';

const App = ({
	settings, store, singleRangeProps, reactiveListProps,
}) => (
	<ReactiveBase {...settings} initialState={store}>
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
	settings: PropTypes.object, // eslint-disable-line
	store: PropTypes.object, // eslint-disable-line
	singleRangeProps: PropTypes.object, // eslint-disable-line
	reactiveListProps: PropTypes.object, // eslint-disable-line
};

export default App;
