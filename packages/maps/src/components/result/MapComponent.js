import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const MapComponent = (props) => {
	// eslint-disable-next-line react/prop-types
	const { children, onMapMounted, ...allProps } = props;

	return (
		<LoadScript googleMapsApiKey="">
			<GoogleMap onLoad={onMapMounted} {...allProps}>
				{children}
			</GoogleMap>
		</LoadScript>
	);
};

MapComponent.propTypes = {};

MapComponent.defaultProps = {};

export default MapComponent;
