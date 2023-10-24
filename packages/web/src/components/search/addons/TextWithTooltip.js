import { string } from 'prop-types';
import types from '@appbaseio/reactivecore/lib/utils/types';
import React, { useState, useEffect, useRef } from 'react';

import styled from '@emotion/styled';

const Container = styled.div`
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;

const Content = styled.span`
	display: ${props => (props.isOverflowing ? 'inline' : 'block')};
`;

/**
 * Shows tooltip when text content overflows out of the container
 * */
const TextWithTooltip = ({
	style, className, title, innerHTML,
}) => {
	const containerRef = useRef(null);
	const contentRef = useRef(null);
	const [isOverflowing, setIsOverflowing] = useState(false);

	useEffect(() => {
		const container = containerRef.current;
		const content = contentRef.current;

		if (container && content) {
			const containerWidth = container.offsetWidth;
			const contentWidth = content.scrollWidth;

			setIsOverflowing(contentWidth > containerWidth);
		}
	}, [innerHTML, title]);

	return (
		<Container title={isOverflowing ? title : ''} ref={containerRef} >
			<Content
				className={className}
				style={style}
				isOverflowing={isOverflowing}
				ref={contentRef}
				dangerouslySetInnerHTML={{
					__html: innerHTML,
				}}
			/>
		</Container>
	);
};

TextWithTooltip.propTypes = {
	title: string,
	className: string,
	style: types.style,
	innerHTML: string.isRequired,
};

export default TextWithTooltip;
