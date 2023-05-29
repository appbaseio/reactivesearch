import React from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';

const ThumbsDownSvg = ({ onClick, className = '' }) => (
	<svg
		stroke="currentColor"
		fill="none"
		strokeWidth="2"
		viewBox="0 0 24 24"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
		height="1em"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
		onClick={onClick}
	>
		<path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
	</svg>
);

ThumbsDownSvg.propTypes = {
	onClick: types.func,
	className: types.string,
};

export default ThumbsDownSvg;
