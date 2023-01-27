import React from 'react';

const SliderHandle = ({
	/* eslint-disable react/prop-types */
	className,
	style,
	tooltipTrigger,
	renderTooltipData,
	...passProps
	/* eslint-enable react/prop-types */
}) => {
	if (tooltipTrigger) {
		let tooltipClassname = '';
		switch (tooltipTrigger) {
			case 'hover':
				tooltipClassname = 'slider-tooltip';
				break;
			case 'focus':
				tooltipClassname = 'slider-tooltip-focus';
				break;
			case 'always':
				tooltipClassname = 'slider-tooltip-visible';
				break;
			case 'none':
			default:
				return (
					<div
						style={style}
						aria-label="slider-button"
						className={className}
						{...passProps}
					/>
				);
		}
		const tooltipContent = passProps['aria-valuenow'];
		return (
			<div style={style} className={className} aria-label="slider-button" {...passProps}>
				<span className={tooltipClassname}>
					{renderTooltipData ? renderTooltipData(tooltipContent) : tooltipContent}
				</span>
			</div>
		);
	}
	return <div style={style} className={className} {...passProps} />;
};

export default SliderHandle;
