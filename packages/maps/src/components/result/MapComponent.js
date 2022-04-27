import React from 'react';
import { GoogleMap } from '@react-google-maps/api';
import types from '@appbaseio/reactivecore/lib/utils/types';
import ScriptLoader from './addons/components/ScriptLoader';

const MapComponent = (props) => {
	const { children, onMapMounted, ...allProps } = props;

	return (
		<ScriptLoader>
			<GoogleMap onLoad={onMapMounted} {...allProps}>
				{children}
			</GoogleMap>
		</ScriptLoader>
	);
};

MapComponent.propTypes = {
	children: types.children,
	onMapMounted: types.func,
};

MapComponent.defaultProps = {};

export default MapComponent;
