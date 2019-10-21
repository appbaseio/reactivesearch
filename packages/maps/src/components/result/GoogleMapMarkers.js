import React from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';

import GoogleMapMarker from './GoogleMapMarker';

const GoogleMapMarkers = ({ resultsToRender, ...rest }) => (
	<div>
		{resultsToRender.map((marker, index) => (
			<React.Fragment key={marker._id}>
				<GoogleMapMarker {...rest} index={index} marker={marker} />
			</React.Fragment>
		))}
	</div>
);

GoogleMapMarkers.propTypes = {
	resultsToRender: types.hits,
	getPosition: types.func,
	renderData: types.func,
	defaultPin: types.string,
	autoClosePopover: types.bool,
	handlePreserveCenter: types.func,
	onPopoverClick: types.func,
	markerProps: types.props,
};
export default GoogleMapMarkers;
