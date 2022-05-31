import React from 'react';
import styled from '@emotion/styled';

const AutofillSvgIcon = styled.button`
	display: flex;
	margin-left: auto;
	position: relative;
	right: -3px;
	border: none;
	outline: none;
	background: transparent;
	padding: 0;
	z-index: 111;

	svg {
		cursor: pointer;
		fill: #707070;
		height: 17px;
	}

	&:hover {
		svg {
			fill: #1c1a1a;
		}
	}
`;

const SelectArrowSvg = props => (
	<AutofillSvgIcon {...props}>
		<svg viewBox="0 0 24 24">
			<path d="M8 17v-7.586l8.293 8.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-8.293-8.293h7.586c0.552 0 1-0.448 1-1s-0.448-1-1-1h-10c-0.552 0-1 0.448-1 1v10c0 0.552 0.448 1 1 1s1-0.448 1-1z" />
		</svg>
	</AutofillSvgIcon>
);

export default SelectArrowSvg;
