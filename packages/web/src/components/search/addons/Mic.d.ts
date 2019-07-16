import * as React from 'react';
import * as types from '../../../types';

export interface MicProps {
	render?: (data: any) => any;
	children?: (data: any) => any;
	className?: string;
	getInstance?: (...args: any[]) => any;
	lang?: string;
	iconPosition?: string;
	onResult?: (...args: any[]) => any;
	onNoMatch?: (...args: any[]) => any;
	onError?: (...args: any[]) => any;
}

declare const Mic: React.ComponentClass<MicProps>;

export default Mic;
