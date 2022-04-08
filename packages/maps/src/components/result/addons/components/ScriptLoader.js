import React, { useContext } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { ReactReduxContext } from '@appbaseio/reactivesearch/lib/utils';
import types from '@appbaseio/reactivecore/lib/utils/types';

const LIBRARIES = ['places'];

const ScriptLoader = (props) => {
	const RSContext = useContext(ReactReduxContext);
	const mapKey = RSContext.storeState.config.mapKey || '';
	const { children, libraries } = props;
	if (window.google && window.GOOGLE_MAPS_SCRIPT_STARTED) {
		return children;
	}
	console.log('window.GOOGLE_MAPS_SCRIPT_STARTED', window.GOOGLE_MAPS_SCRIPT_STARTED);
	window.GOOGLE_MAPS_SCRIPT_STARTED = true;
	console.log('window.GOOGLE_MAPS_SCRIPT_STARTED', window.GOOGLE_MAPS_SCRIPT_STARTED);
	return (
		<LoadScript id="load-script" googleMapsApiKey={mapKey} libraries={libraries || LIBRARIES}>
			{children}
		</LoadScript>
	);
};

ScriptLoader.propTypes = {
	children: types.children,
	libraries: types.stringArray,
};

ScriptLoader.defaultProps = {};

export default ScriptLoader;
