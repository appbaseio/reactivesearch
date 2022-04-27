import React, { useEffect } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { connect } from '@appbaseio/reactivesearch/lib/utils';
import types from '@appbaseio/reactivecore/lib/utils/types';
import {
	setGoogleMapScriptLoading,
	setGoogleMapScriptLoaded,
	setGoogleMapScriptError,
} from '@appbaseio/reactivecore/lib/actions/misc';

const ScriptLoader = (props) => {
	const {
		children,
		mapLibraries,
		mapKey,
		setMapScriptLoadError,
		setMapScriptLoaded,
		setMapScriptLoading,
		mapScriptLoadStatus,
	} = props;
	useEffect(() => {
		if (mapScriptLoadStatus.error) {
			console.error('Error loading google api: ', mapScriptLoadStatus.error);
		}
	}, [mapScriptLoadStatus.error]);

	if (typeof window === 'undefined') {
		return null;
	}

	if (
		!window.google
		&& window.GOOGLE_SCRIPT_LOCK_ACQUIRED === true
		&& !mapScriptLoadStatus.loaded
	) {
		return 'Initializing...';
	}

	if (!window.google && typeof window.GOOGLE_SCRIPT_LOCK_ACQUIRED === 'undefined') {
		window.GOOGLE_SCRIPT_LOCK_ACQUIRED = true;
		setMapScriptLoading(true);
	}
	if (window.google) {
		return children;
	}

	return (
		<LoadScript
			onError={(error) => {
				setMapScriptLoadError(error);
				window.GOOGLE_SCRIPT_LOCK_ACQUIRED = false;
			}}
			googleMapsApiKey={mapKey || ''}
			libraries={Array.from(new Set(mapLibraries))} // avoid duplicates
			onLoad={() => {
				if (mapScriptLoadStatus.loaded === false) {
					window.GOOGLE_SCRIPT_LOCK_ACQUIRED = false;
					setMapScriptLoaded(true);
				}
			}}
		>
			{children}
		</LoadScript>
	);
};

ScriptLoader.propTypes = {
	children: types.children,
	setMapScriptLoading: types.func,
	setMapScriptLoaded: types.func,
	setMapScriptLoadError: types.func,
	mapScriptLoadStatus: types.props,
	mapKey: types.string,
	mapLibraries: types.stringArray,
};

ScriptLoader.defaultProps = {
	mapScriptLoadStatus: {},
	mapLibraries: [],
};
const mapStateToProps = state => ({
	mapKey: state.config.mapKey,
	mapLibraries: state.config.mapLibraries,
	mapScriptLoadStatus: state.googleMapScriptStatus,
});

const mapDispatchtoProps = dispatch => ({
	setMapScriptLoading: loading => dispatch(setGoogleMapScriptLoading(loading)),
	setMapScriptLoaded: loaded => dispatch(setGoogleMapScriptLoaded(loaded)),
	setMapScriptLoadError: error => dispatch(setGoogleMapScriptError(error)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(ScriptLoader);
