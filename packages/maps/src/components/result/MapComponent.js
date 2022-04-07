import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

import types from '@appbaseio/reactivecore/lib/utils/types';

const MapComponent = (props) => {
	const { children, onMapMounted, ...allProps } = props;

	return (
		<LoadScript googleMapsApiKey="">
			<GoogleMap onLoad={onMapMounted} {...allProps}>
				{children}
			</GoogleMap>
		</LoadScript>
	);
};

MapComponent.propTypes = {
	children: types.children,
	onMapMounted: types.func,
};

MapComponent.defaultProps = {};

export default MapComponent;
