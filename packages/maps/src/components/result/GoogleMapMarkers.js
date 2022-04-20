import React from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';

import GoogleMapMarker from './GoogleMapMarker';

class GoogleMapMarkers extends React.Component {
	state = {
		markerOnTop: null,
		openMarkers: {},
	};

	setMarkerOnTop = (markerOnTop) => {
		this.setState({
			markerOnTop,
		});
	};

	setOpenMarkers = (openMarkers) => {
		this.setState({
			openMarkers,
		});
	};

	render() {
		const { resultsToRender, ...rest } = this.props;
		const { markerOnTop, openMarkers } = this.state;
		return (
			<div>
				{resultsToRender.map((marker, index) => (
					<React.Fragment key={marker._id}>
						<GoogleMapMarker
							{...rest}
							index={index}
							marker={marker}
							markerOnTop={markerOnTop}
							openMarkers={openMarkers}
							setMarkerOnTop={this.setMarkerOnTop}
							setOpenMarkers={this.setOpenMarkers}
						/>
					</React.Fragment>
				))}
			</div>
		);
	}
}

GoogleMapMarkers.propTypes = {
	resultsToRender: types.hits,
	getPosition: types.func,
	renderItem: types.func,
	defaultPin: types.string,
	autoClosePopover: types.bool,
	handlePreserveCenter: types.func,
	onPopoverClick: types.func,
	markerProps: types.props,
};
export default GoogleMapMarkers;
