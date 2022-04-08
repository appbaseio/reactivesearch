import React, { useContext } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { ReactReduxContext } from '@appbaseio/reactivesearch/lib/utils';
import types from '@appbaseio/reactivecore/lib/utils/types';

const MapComponent = (props) => {
	const RSContext = useContext(ReactReduxContext);
	const mapKey = RSContext.storeState.config.mapKey || '';
	const { children, onMapMounted, ...allProps } = props;
	if (window.google) {
		return (
			<GoogleMap onLoad={onMapMounted} {...allProps}>
				{children}
			</GoogleMap>
		);
	}
	return (
		<LoadScript googleMapsApiKey={mapKey}>
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
