import React from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';

const CustomSvg = ({
	iconId, className, icon, type,
}) => {
	if (icon) {
		return React.createElement('div', { className }, [
			React.cloneElement(icon, { key: iconId }),
		]);
	}
	if (type === 'recent-search-icon') {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				alt="Recent Search"
				height="20"
				width="20"
				viewBox="0 0 24 24"
				style={{ fill: '#707070' }}
				className={className}
			>
				<path d="M0 0h24v24H0z" fill="none" />
				<path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
			</svg>
		);
	}
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			alt="Popular Search"
			height="20"
			width="20"
			viewBox="0 0 24 24"
			style={{ fill: '#707070' }}
			className={className}
		>
			<path d="M0 0h24v24H0z" fill="none" />
			<path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
		</svg>
	);
};

CustomSvg.propTypes = {
	iconId: types.string,
	className: types.string,
	icon: types.children,
	type: types.string,
};

CustomSvg.defaultProps = {
	iconId: undefined,
	className: null,
	icon: undefined,
	type: 'recent-search-icon',
};

export default CustomSvg;
