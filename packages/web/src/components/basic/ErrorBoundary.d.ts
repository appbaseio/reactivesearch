import * as React from 'react';
import * as types from '../../types';

export interface ErrorBoundaryProps {
	children?: types.children;
	componentIds?: types.stringArray;
	renderError?: (error: object, componentId: string)=>void;
	onError?: (error: object, componentId: string) => void;
}

declare const ErrorBoundary: React.ComponentClass<ErrorBoundaryProps>;

export default ErrorBoundary;
