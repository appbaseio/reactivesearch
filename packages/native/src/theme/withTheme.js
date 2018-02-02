import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import types from '@appbaseio/reactivecore/lib/utils/types';

export default function withTheme(Component) {
	const WithTheme = (props, { theming }) => (
		<Component
			theming={theming}
			{...props}
		/>
	);

	WithTheme.contextTypes = {
		theming: types.style,
	};

	const componentName = Component.displayName || Component.name || 'Component';
	WithTheme.displayName = `withTheme(${componentName})`;

	return hoistNonReactStatics(WithTheme, Component);
}
