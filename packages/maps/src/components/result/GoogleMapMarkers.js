import React from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';

import GoogleMapMarker from './GoogleMapMarker';

const GoogleMapMarkers = ({ showMarkers, resultsToRender, ...rest }) => (
	<div>
		{showMarkers
			&& resultsToRender.map(marker => (
				<React.Fragment key={marker._id}>
					<GoogleMapMarker {...rest} marker={marker} />
				</React.Fragment>
			))}
	</div>
);

GoogleMapMarkers.propTypes = {
	showMarkers: types.bool,
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
