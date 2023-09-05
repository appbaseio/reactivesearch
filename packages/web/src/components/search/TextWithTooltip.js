import { object, string } from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';

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
		<div title={isOverflowing ? title : ''} ref={containerRef} >
			<div
				className={className}
				style={style}
				ref={contentRef}
				dangerouslySetInnerHTML={{
					__html: innerHTML,
				}}
			/>
		</div>
	);
};

TextWithTooltip.propTypes = {
	title: string,
	className: string,
	// eslint-disable-next-line react/forbid-prop-types
	style: object,
	innerHTML: string.isRequired,
};

export default TextWithTooltip;
