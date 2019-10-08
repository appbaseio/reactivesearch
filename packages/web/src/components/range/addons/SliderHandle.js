import React from 'react';

const SliderHandle = ({
	// eslint-disable-next-line react/prop-types
	className, style, tooltipTrigger, renderTooltipData, ...passProps
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
					<button
						style={style}
						aria-label="slider-button"
						className={className}
						{...passProps}
					/>
				);
		}
		const tooltipContent = passProps['aria-valuenow'];
		return (
			<button style={style} className={className} aria-label="slider-button" {...passProps}>
				<span className={tooltipClassname}>
					{renderTooltipData ? renderTooltipData(tooltipContent) : tooltipContent}
				</span>
			</button>
		);
	}
	return <button style={style} className={className} {...passProps} />;
};

export default SliderHandle;
