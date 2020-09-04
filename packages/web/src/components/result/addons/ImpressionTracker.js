import React from 'react';
import { node } from 'prop-types';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { connect } from '../../../utils';

class ImpressionTracker extends React.Component {
	render() {
		const { children } = this.props;
		return children;
	}
}

ImpressionTracker.propTypes = {
	componentId: types.stringRequired,
	hits: types.hits,
	children: node,
};

export default connect(null, null)(ImpressionTracker);
