import { useContext } from 'react';
import { shape } from 'prop-types';
import { SearchPreferencesContext } from '../../utils';

/**
 * PreferencesConsumer reads the preferences from SearchPreferencesContext
 * and set the props from preferences to the component
 *
 */
const deepValue = (o, p) => p.split('.').reduce((a, v) => a[v], o);

const PreferencesConsumer = ({ children, userProps }) => {
	const context = useContext(SearchPreferencesContext);
	if (!userProps || !userProps.componentId) {
		throw Error('ReactiveSearch: componentId is required');
	}
	const componentId = userProps.componentId;
	const preferencesPath = userProps.preferencesPath;
	let preferences;
	if (preferencesPath) {
		// read preferences from path
		preferences = deepValue(context, preferencesPath);
	} else {
		preferences = deepValue(context, ['componentSettings', componentId].join('.'));
		// read preferences from componentSettings
	}
	// Retrieve component specific preferences
	let componentProps = userProps;
	if (preferences) {
		if (preferences.rsConfig) {
			componentProps = { ...preferences.rsConfig, ...componentProps };
		} else {
			componentProps = { ...preferences, ...componentProps };
		}
		if (preferences.enabled !== undefined && !preferences.enabled) {
			return null;
		}
	}
	return children(componentProps);
};

PreferencesConsumer.propTypes = {
	userProps: shape({}),
};

export default PreferencesConsumer;
