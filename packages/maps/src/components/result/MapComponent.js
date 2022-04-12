import React from 'react';
import { GoogleMap } from '@react-google-maps/api';
import types from '@appbaseio/reactivecore/lib/utils/types';
import ScriptLoader from './addons/components/ScriptLoader';

const MapComponent = (props) => {
	const {
		children, onMapMounted, libraries, ...allProps
	} = props;

	return (
		<ScriptLoader libraries={libraries}>
			<GoogleMap onLoad={onMapMounted} {...allProps}>
				{children}
			</GoogleMap>
		</ScriptLoader>
	);
};

MapComponent.propTypes = {
	children: types.children,
	onMapMounted: types.func,
	libraries: types.stringArray,
};

MapComponent.defaultProps = {
	libraries: [''],
};

export default MapComponent;
