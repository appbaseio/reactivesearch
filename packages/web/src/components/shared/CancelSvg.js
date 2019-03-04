import React from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';

const CancelSvg = ({ onClick }) => (
	<svg
		alt="Clear"
		className="cancel-icon"
		height="10"
		onClick={onClick}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 212.982 212.982"
	>
		<title>Clear</title>
		<path
			d="M131.804,106.491l75.936-75.936c6.99-6.99,6.99-18.323,0-25.312
		c-6.99-6.99-18.322-6.99-25.312,0l-75.937,75.937L30.554,5.242c-6.99-6.99-18.322-6.99-25.312,0c-6.989,6.99-6.989,18.323,0,25.312
		l75.937,75.936L5.242,182.427c-6.989,6.99-6.989,18.323,0,25.312c6.99,6.99,18.322,6.99,25.312,0l75.937-75.937l75.937,75.937
		c6.989,6.99,18.322,6.99,25.312,0c6.99-6.99,6.99-18.322,0-25.312L131.804,106.491z"
		/>
	</svg>
);

CancelSvg.propTypes = {
	onClick: types.func,
};

export default CancelSvg;
